import EventEmitter from 'eventemitter3'
import { baseUrl } from '../axios'
import createEventEmitter from './createEventEmitter'

type CreateWebSocket = [WebSocket, EventEmitter]

const createWebSocket = (): CreateWebSocket => {
  const socket = new WebSocket(`${baseUrl(true)}/paste/websocket`)

  const emitter = createEventEmitter(socket)

  return [socket, emitter]
}

export { createWebSocket, CreateWebSocket }
export default createWebSocket
