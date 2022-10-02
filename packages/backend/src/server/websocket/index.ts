import { SocketStream } from '@fastify/websocket'
import { FastifyInstance, FastifyRequest } from 'fastify'
import util from 'util'
import { $s } from '../../container'
import {
  WebsocketMiddleware,
  WebsocketMiddlewarePromise,
  WebSocketRouteOptions,
} from '../../types/websocket'

export const handleMiddldeware = async <
  TFastifyRequest extends FastifyRequest = FastifyRequest,
  TFastifyInstance extends FastifyInstance = FastifyInstance
>(
  conn: SocketStream,
  req: TFastifyRequest,
  fasteer: TFastifyInstance,
  middleware: WebsocketMiddleware
): Promise<boolean> => {
  if (!util.types.isAsyncFunction(middleware)) {
    return new Promise<boolean>((resolve) =>
      middleware(conn, req, fasteer, resolve)
    )
  }

  return await (middleware as WebsocketMiddlewarePromise)(conn, req, fasteer)
}

export const middlewares = async <
  TFastifyInstance extends FastifyInstance = FastifyInstance
>(
  conn: SocketStream,
  req: FastifyRequest,
  fastify: TFastifyInstance,
  middlewares: WebsocketMiddleware[]
): Promise<boolean> => {
  for (const middleware of middlewares) {
    const passes = await handleMiddldeware(conn, req, fastify, middleware)

    // If the middleware returns false it means that no next step should be taken.
    if (!passes) {
      conn.end()
      return false
    }
  }

  return true
}

/**
 * A route shorthand to define a WebSocket endpoint.
 * It applies the keep-alive pre-handler by default and takes care of middlewares.
 *
 * @param app The fastify instance
 * @param opts Route options
 * @returns The fastify instance
 */
export const websocket =
  <TFastifyInstance extends FastifyInstance = FastifyInstance>(
    server: TFastifyInstance,
    globalMiddlewares: WebsocketMiddleware[]
  ) =>
  (
    url: string,
    middleware?: WebsocketMiddleware | WebsocketMiddleware[],
    opts?: WebSocketRouteOptions,
    handler?: WebSocketRouteOptions['wsHandler']
  ): TFastifyInstance => {
    server.route({
      url,
      method: 'GET',
      handler:
        // If a httpHandler is provided, use that,
        // otherwise use the default one.
        opts && opts.httpHandler
          ? opts.httpHandler
          : (_, res) => {
              res.send({
                success: false,
                error: {
                  kind: 'USER_INPUT',
                  message: 'This is a WS endpoint',
                },
              })
            },
      async wsHandler(conn, req) {
        if (globalMiddlewares.length >= 1) {
          // Global Middlewares are handled first, that's why they
          // are called separately.
          if (!(await middlewares(conn, req, server, globalMiddlewares))) return
        }

        // Per-Route Middlewares, can be specified inside of the route shorthand.
        const routeMiddlewares = middleware
          ? Array.isArray(middleware)
            ? middleware
            : [middleware]
          : []

        if (routeMiddlewares.length >= 1) {
          if (!(await middlewares(conn, req, server, routeMiddlewares))) return
        }

        handler?.call(this, conn, req)
      },
    })

    return server
  }

export const $ws = websocket($s('server') as FastifyInstance, [])

/**
 * Send a message to the socket. If it's an object, it automatically
 * gets encoded into a JSON, otherwise .toString() is used.
 *
 * @param socket The socket
 * @param payload The payload
 */
export const socketSend = (
  socket: { send: SocketStream['socket']['send'] },
  payload: object | string
): void =>
  socket.send(typeof payload === 'object' ? JSON.stringify(payload) : payload)

/**
 * Decorates the passed Fastify instance with the websocket shorthand.
 *
 * @param {FastifyInstance} fastify
 * @param {WebsocketMiddleware[]} globalMiddlewares
 */
export const decorateWebsocket = <
  TFastify extends FastifyInstance = FastifyInstance
>(
  fastify: TFastify,
  globalMiddlewares: WebsocketMiddleware[] = []
) => {
  const shorthand = websocket(fastify, globalMiddlewares)

  fastify.decorate('ws', shorthand)
  fastify.decorate('websocket', shorthand)
}
