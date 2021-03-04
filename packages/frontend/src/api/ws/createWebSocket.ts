import EventEmitter from 'eventemitter3'
import { baseUrl } from '../axios'
import createEventEmitter from './createEventEmitter'

const createWebSocket = (): [WebSocket, EventEmitter] => {
  const socket = new WebSocket(`${baseUrl(true)}/paste/websocket`)

  const emitter = createEventEmitter(socket)

  return [socket, emitter]
}

export { createWebSocket }
export default createWebSocket
