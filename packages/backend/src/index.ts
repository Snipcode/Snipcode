import path from 'path'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import fastifySecureSession from '@fastify/secure-session'
import fastifyWebsocket from '@fastify/websocket'
import EventEmitter from 'eventemitter3'
import { error, ErrorKind } from './utils/response'
import sodium from 'sodium-native'
import { controllers } from './utils/controllers'
import { registerContainerServices } from 'contairy'
import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

const db = new PrismaClient()

const emitter = new EventEmitter()

const server = fastify({
  logger:
    process.env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
})

server.setErrorHandler(async (e, _, res) => {
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

server.register(cors, {
  origin:
    process.env.FRONTEND_URL ?? process.env.NODE_ENV === 'production'
      ? 'https://snipcode.link'
      : 'http://localhost:5173',
  credentials: true,
})

server.register(helmet)

server.register(controllers, {
  paths: ['src/server/controllers/*Controller.{ts,js}'],
})

registerContainerServices({
  db,
  server,
  emitter,
})

const sessionKeyPath = path.join(__dirname, '..', '..', '..', '.session_key')

if (!fs.existsSync(sessionKeyPath)) {
  const buf = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES)
  sodium.randombytes_buf(buf)
  fs.writeFileSync(sessionKeyPath, buf)
}

server.register(fastifySecureSession, {
  cookieName: '_session',
  key: fs.readFileSync(sessionKeyPath),
  cookie: {
    path: '/',
  },
})

server.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576,
  },
})

// Close Fastify server on exit
;['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => server.close()))

const start = async () => {
  await server.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) : 4200,
  })
}

start()
