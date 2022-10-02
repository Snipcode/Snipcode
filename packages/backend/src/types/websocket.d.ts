import {
    RouteOptions,
    FastifyRequest,
    RawServerBase,
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    ContextConfigDefault,
    FastifySchema,
    RouteShorthandOptions,
    RouteHandlerMethod,
    FastifyInstance,
    RouteShorthandOptionsWithHandler,
    RouteShorthandMethod,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { SocketStream, WebsocketPluginOptions } from "@fastify/websocket";
import { FasteerInstance } from "@fasteerjs/fasteer";

/**
 * The Async/Promise Middleware.
 */
export type WebsocketMiddlewarePromise<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>
> = (
    conn: SocketStream,
    req: FastifyRequest<RouteGeneric, RawServer, RawRequest>,
    app: FasteerInstance
) => Promise<boolean>;

/**
 * Legacy Callback-style Middleware. The return value is passed inside of the callback.
 */
export type WebsocketMiddlewareCb<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>
> = (
    conn: SocketStream,
    req: FastifyRequest<RouteGeneric, RawServer, RawRequest>,
    app: FasteerInstance,
    next: (result: boolean) => void
) => unknown;

/**
 * The middlewares are called before the wsHandler, they can stop the ws connection
 * altogether by returning a falsy value.
 */
export type WebsocketMiddleware<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>
> =
    | WebsocketMiddlewarePromise<RouteGeneric, RawServer, RawRequest>
    | WebsocketMiddlewareCb<RouteGeneric, RawServer, RawRequest>;

/**
 * Extended Route Options for WebSocket routes.
 *
 * In this case handler and method is omitted. WsHandler is used instead
 * for websocket routes and httpHandler (with the same signature as handler) is
 * used for http requests on a websocket route. It is optional and by default returns
 * an error message.
 */
export type WebSocketRouteOptions<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    ContextConfig = ContextConfigDefault,
    SchemaCompiler = FastifySchema
> = Omit<
    RouteOptions<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler>,
    "handler" | "method"
> & {
    httpHandler: RouteOptions<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler>["handler"];
};

/**
 * The shorthand method in FastifyInstance for WS routes.
 */
export interface WebSocketShorthandMethod<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>
> extends RouteShorthandMethod<RawServer, RawRequest, RawReply> {
    <
        RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
        ContextConfig = ContextConfigDefault,
        SchemaCompiler = FastifySchema
    >(
        path: string,
        middleware: WebsocketMiddleware | WebsocketMiddleware[],
        opts: RouteShorthandOptions<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig, SchemaCompiler>,
        handler: RouteHandlerMethod<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig>
    ): FastifyInstance<RawServer, RawRequest, RawReply>;

    <RouteGeneric extends RouteGenericInterface = RouteGenericInterface, ContextConfig = ContextConfigDefault>(
        path: string,
        middleware: WebsocketMiddleware | WebsocketMiddleware[],
        handler: RouteHandlerMethod<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig>
    ): FastifyInstance<RawServer, RawRequest, RawReply>;

    <
        RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
        ContextConfig = ContextConfigDefault,
        SchemaCompiler = FastifySchema
    >(
        path: string,
        middleware: WebsocketMiddleware | WebsocketMiddleware[],
        opts: RouteShorthandOptionsWithHandler<
            RawServer,
            RawRequest,
            RawReply,
            RouteGeneric,
            ContextConfig,
            SchemaCompiler
        >
    ): FastifyInstance<RawServer, RawRequest, RawReply>;
}

declare module "fastify" {
    /**
     * Augmenting the instance and adding ws/websocket shorthands.
     */
    interface FastifyInstance<
        RawServer extends RawServerBase = RawServerDefault,
        RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
        RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>
    > {
        ws: WebSocketShorthandMethod<RawServer, RawRequest, RawReply>;
        websocket: WebSocketShorthandMethod<RawServer, RawRequest, RawReply>;
    }
}

/**
 * The plugin options.
 */
export interface PluginOptions {
    fastifyWebsocket?: WebsocketPluginOptions;
    globalMiddlewares?: WebsocketMiddleware[];
}
