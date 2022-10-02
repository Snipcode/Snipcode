import fastify from 'fastify'
import cors from '@fastify/cors'
import { $env } from '../data/Env'
import { errorHandler } from './errors'
import { websocket } from './plugins/websocket'
import { controllers } from './plugins/controllers'
import { __app } from '../constants'
import { views } from './plugins/views'
import { Liquid } from 'liquidjs'
import path from 'path'
import { sessions } from './plugins/sessions'

/**
 * Create the server instance
 */
const server = fastify({
  logger: {
    // Pretty printing log output in development
    transport: $env.dev ? { target: 'pino-pretty' } : undefined,
  },
})

/**
 * CORS
 */
server.register(cors, {
  origin: $env.get('CORS_ORIGIN', false) ?? '*',
})

/**
 * Error handling
 */
server.setErrorHandler(errorHandler)

/**
 * Websocket plugin
 */
server.register(websocket, {
  options: {
    maxPayload: 1048576,
  },
})

/**
 * Controller plugin
 */
server.register(controllers, {
  paths: ['src/server/controllers/*.{ts,js}'],
})

/**
 * Views plugin
 */
server.register(views, {
  engine: {
    liquid: new Liquid({
      root: path.join(__app, 'server/views'),
      extname: '.liquid',
    }),
  },
  root: path.join(__app, 'server/views'),
})

/**
 * Sessions plugin
 */
server.register(sessions)

export { server as $server }
