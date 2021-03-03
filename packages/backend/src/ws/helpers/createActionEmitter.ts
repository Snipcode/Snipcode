import EventEmitter from 'eventemitter3'
import { SocketStream } from 'fastify-websocket'
import { ReceivedMessage } from '../../types'

const createActionEmitter = (conn: SocketStream) => {
  const actionEmitter = new EventEmitter()

  conn.socket.on('message', async (message: string) => {
    let msg: ReceivedMessage | string = message

    try {
      msg = JSON.parse(message) as ReceivedMessage
    } catch (_) {
      return
    }

    actionEmitter.emit(msg.action, msg)
  })

  return actionEmitter
}

export { createActionEmitter }
export default createActionEmitter
