import { createFasteer } from '@fasteerjs/fasteer'
import { dev, Env, env } from '../env'
import path from 'path'
import { __root } from '../constants'
import { PrismaClient } from '@prisma/client'
import secureSession from 'fastify-secure-session'
import fs from 'fs'

export const createServer = ({ db }: { db: PrismaClient }) => {
  const app = createFasteer({
    controllers: [path.join(__dirname, 'controllers', '**', '*Controller.ts')],
    port: env(Env.PORT),
    host: env(Env.HOST),
    development: dev(),
    cors: {
      origin: env(Env.CORS_DOMAIN),
      credentials: true,
    },
    helmet: true,
    loggerOptions: {
      consoleLogging: {
        logErrors: true,
      },
      fileLogging: {
        path: path.join(__root, 'logs', 'snipcode.log'),
        errorPath: path.join(__root, 'logs', 'snipcode-errors.log'),
      },
    },
  })

  app.inject({ db })

  app.fastify.register(secureSession, {
    cookieName: 'snipcode_session',
    key: fs.readFileSync(path.join(__root, 'snipcode_session_key')),
    cookie: {
      path: '/',
    },
  })
  ;['SIGINT', 'SIGTERM'].forEach((sig) =>
    process.on(sig, () => app.fastify.close())
  )

  return app
}
