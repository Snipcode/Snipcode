import { SocketStream } from '@fastify/websocket'

const socketSend = (
  socket: { send: SocketStream['socket']['send'] },
  payload: object | string
) =>
  socket.send(typeof payload === 'object' ? JSON.stringify(payload) : payload)

export { socketSend }
export default socketSend
