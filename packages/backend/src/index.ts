import path from 'path'
import fs from 'fs'
import https from 'https'
import { hookFastify } from '@fasteerjs/fasteer'
import { PrismaClient } from '@prisma/client'
import fastifySecureSession from 'fastify-secure-session'
import fastifyWebsocket from 'fastify-websocket'
import EventEmitter from 'eventemitter3'

const db = new PrismaClient()

const emitter = new EventEmitter()

const app = hookFastify({
  controllers: [
    path.join(__dirname, 'http', 'controllers', '*Controller.{ts,js}'),
    path.join(__dirname, 'ws', 'controllers', '*Controller.{ts,js}'),
  ],
  port: 4200,
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://pastte.vott.us'
        : 'http://localhost:3000',
    credentials: true,
  },
  helmet: true,
  logRequests: true,
  development: process.env.NODE_ENV === 'development',
  globalPrefix: '/api',
})

app.inject({ db, emitter })

app.fastify.register(fastifySecureSession, {
  cookieName: 'pastte_sess_key',
  key: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'sess_secret')),
  cookie: {
    path: '/',
  },
})

app.fastify.register(fastifyWebsocket, {
  options: {
    ...(process.env.NODE_ENV === 'production'
      ? {
          server: https.createServer({
            key: fs.readFileSync(process.env.KEY ?? '../../../key.pem'),
            cert: fs.readFileSync(process.env.CERT ?? '../../../cert.pem'),
          }),
        }
      : {}),
    maxPayload: 1048576,
  },
})
// Close Fastify on e
;['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, () => app.fastify.close())
)

const start = async () => {
  const addr = await app.start()
  app.logger.info(`App started! @ ${addr}`)
}

// This is a wild one.
start()
