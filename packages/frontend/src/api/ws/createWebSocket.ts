import EventEmitter from 'eventemitter3'
import { baseUrl } from '../axios'
import createEventEmitter from './createEventEmitter'

export type CreateWebSocket = [WebSocket, EventEmitter]

export const createWebSocket = (): CreateWebSocket => {
  const socket = new WebSocket(`${baseUrl(true)}/paste/websocket`)

  const emitter = createEventEmitter(socket)

  return [socket, emitter]
}
