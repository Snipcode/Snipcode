import { SocketStream } from "@fastify/websocket";
import WebSocket from "ws";
import { WebsocketMiddleware } from "../../../types/websocket";
import { socketSend } from "../";

/**
 * In some cases the connection may time out after a certain time
 * (eg. 30s by default when using Nginx as reverse proxy).
 *
 * This middleware sends an empty "keep-alive" message every 10 seconds
 * to the client in order to maintain the connection.
 *
 * This function returns the NodeJS.Timeout, so if at any point the keep-alive message
 * should stop being stopped, a clearInterval() function can be called.
 *
 * @param conn The socket stream
 * @returns The interval
 */
const keepAlive: WebsocketMiddleware = async (conn: SocketStream): Promise<NodeJS.Timeout> => {
    // Send a keep-alive message every 10s
    const interval = setInterval(() => {
        if (conn.socket.readyState === WebSocket.OPEN) socketSend(conn.socket, "");
    }, 1000 * 10);

    conn.on("end", () => interval && clearInterval(interval));

    return interval;
};

export { keepAlive };

export default keepAlive;
