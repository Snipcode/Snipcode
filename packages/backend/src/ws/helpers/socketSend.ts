import { SocketStream } from 'fastify-websocket'

const socketSend = (conn: SocketStream, payload: object | string) =>
  conn.socket.send(
    typeof payload === 'object' ? JSON.stringify(payload) : payload
  )

export { socketSend }
export default socketSend
