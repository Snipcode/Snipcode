import fp from "fastify-plugin";
import { decorateWebsocket } from "../websocket";
import ws, { WebsocketPluginOptions } from "@fastify/websocket";

/**
 * Websocket Plugin
 */
export const websocket = fp<WebsocketPluginOptions>(async (server, opts) => {
    server.register(ws, opts);

    decorateWebsocket(server);
});
