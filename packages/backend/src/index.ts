import path from 'path'
import fs from 'fs'
import {createFasteer} from '@fasteerjs/fasteer'
import { PrismaClient } from '@prisma/client'
import fastifySecureSession from '@fastify/secure-session'
import fastifyWebsocket from '@fastify/websocket'
import EventEmitter from 'eventemitter3'
import { error, ErrorKind } from './http/helpers/responseHelper'
import sodium from 'sodium-native'
import {controllers} from "./http/helpers/controllers";
import {registerContainerServices} from "contairy";

const db = new PrismaClient()

const emitter = new EventEmitter()

const app = createFasteer({
  controllers: [],
  port: 4200,
  host: '0.0.0.0',
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://pastte.vott.us'
        : 'http://localhost:5173',
    credentials: true,
  },
  helmet: true,
  logRequests: process.env.NODE_ENV === 'development' ? 'all' : 'file',
  development: process.env.NODE_ENV === 'development',
  globalPrefix: '/api',
})
// @ts-ignore
app.fastify.setErrorHandler(async (e, _, res) => {
  if (e.validation)
    return res.send(
      error({
        kind: ErrorKind.USER_INPUT,
        message: 'Validation Error',
      })
    )

  res.send(
    error({
      kind: ErrorKind.INTERNAL,
      message: 'Internal Server Error',
    })
  )
})

app.fastify.register(controllers, {
  paths: [
    'src/http/controllers/*Controller.{ts,js}',
    'src/ws/controllers/*Controller.{ts,js}'
  ],
})

registerContainerServices({
  db,
  server: app.fastify,
  emitter
})

app.inject({ db, emitter })

const sessionKeyPath = path.join(__dirname, '..', '..', '..', '.session_key')

if (!fs.existsSync(sessionKeyPath)) {
  const buf = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES)
  sodium.randombytes_buf(buf)
  fs.writeFileSync(sessionKeyPath, buf)
}

app.fastify.register(fastifySecureSession, {
  cookieName: 'snipcode_sess_key',
  key: fs.readFileSync(sessionKeyPath),
  cookie: {
    path: '/',
  },
})

app.fastify.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576,
  },
})
// Close Fastify on e
;['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, () => app.fastify.close())
)

const start = async () => {
  const addr = await app.start()
  app.logger.info(`Backend started`)
}

// This is a wild one.
start()
