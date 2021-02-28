import { Event } from '@pastte/backend/src/ws/helpers/responseHelper'
import EventEmitter from 'eventemitter3'

const createEventEmitter = (socket: WebSocket) => {
  const eventEmitter = new EventEmitter()

  socket.addEventListener('message', (event) => {
    let msg: Event<string, any> | string = event.data

    try {
      msg = JSON.parse(event.data) as Event<string, any>
    } catch (_) {
      return
    }

    console.log('[server] parsed:', { msg })

    eventEmitter.emit(msg.event, msg)
  })

  return eventEmitter
}

export { createEventEmitter }
export default createEventEmitter
