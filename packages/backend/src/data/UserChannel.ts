import { SocketStream } from '@fastify/websocket'
import { Paste, User } from '@prisma/client'
import { EventEmitter } from 'eventemitter3'
import { FastifyRequest } from 'fastify'
import { EmitCallback } from './Emitter'

export const UserChannelEmits = {
  Close: 'close',
  PasteCreate: 'paste_create',
  PasteEdit: 'paste_edit',
  PasteDelete: 'paste_delete',
}

export type PasteEmitCallback = (paste: Paste) => unknown

export class UserChannel extends EventEmitter {
  constructor(public id: User['id']) {
    super()
  }

  emitClose() {
    return this.emit(UserChannelEmits.Close)
  }

  onClose(cb: EmitCallback) {
    return this.once(UserChannelEmits.Close, cb)
  }

  emitPasteCreate(paste: Paste) {
    return this.emit(UserChannelEmits.PasteCreate, paste)
  }

  emitPasteEdit(paste: Paste) {
    return this.emit(UserChannelEmits.PasteEdit, paste)
  }

  emitPasteDelete(paste: Paste) {
    return this.emit(UserChannelEmits.PasteDelete, paste)
  }

  onPasteCreate(cb: PasteEmitCallback) {
    return this.on(UserChannelEmits.PasteCreate, cb)
  }

  onPasteEdit(cb: PasteEmitCallback) {
    return this.on(UserChannelEmits.PasteEdit, cb)
  }

  onPasteDelete(cb: PasteEmitCallback) {
    return this.on(UserChannelEmits.PasteDelete, cb)
  }
}
