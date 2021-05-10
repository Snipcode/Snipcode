import { Paste as DBPaste } from '@prisma/client'
import Ajv from 'ajv'
import { PasteDto } from '@snipcode/core/src/dto/pasteDto'
import { Controller, ReceivedMessage } from '../../types'
import { createUserContext } from '../../http/context/userContext'
import { error, ErrorKind } from '../../http/helpers/responseHelper'
import { createActionEmitter } from '../helpers/createActionEmitter'
import { Paste } from '../../http/schemas'
import socketSend from '../helpers/socketSend'
import { event } from '../helpers/responseHelper'

const PasteWebsocketController: Controller = async (app, { db, emitter }) => {
  const ajv = new Ajv()

  app.route({
    method: 'GET',
    url: '/websocket',
    handler: (_, res) => {
      res.send(
        error({
          kind: ErrorKind.USER_INPUT,
          message: 'This is a websocket endpoint',
        })
      )
    },
    wsHandler: async (conn, req) => {
      const ctx = await createUserContext({ req, deps: { db } })
      if (!ctx.success) return socketSend(conn.socket, ctx)

      const { user } = ctx

      /**
       * Broadcasting when the user creates a new Paste
       */

      const handlePasteCreate = (paste: DBPaste) =>
        socketSend(
          conn.socket,
          event('paste_create', { paste: PasteDto.make(paste) })
        )

      const handlePasteEdit = (paste: DBPaste) =>
        socketSend(
          conn.socket,
          event('paste_edit', { paste: PasteDto.make(paste) })
        )

      const handlePasteDelete = (paste: DBPaste) =>
        socketSend(
          conn.socket,
          event('paste_delete', { paste: PasteDto.make(paste) })
        )

      emitter.on(`paste_create__${user.id}`, handlePasteCreate)
      emitter.on(`paste_edit__${user.id}`, handlePasteEdit)
      emitter.on(`paste_delete__${user.id}`, handlePasteDelete)

      conn.socket.on('close', () => {
        emitter.off(`paste_create__${user.id}`, handlePasteCreate)
        emitter.off(`paste_edit__${user.id}`, handlePasteEdit)
        emitter.off(`paste_delete__${user.id}`, handlePasteDelete)
      })

      /**
       * Websocket Actions
       */

      const actionEmitter = createActionEmitter(conn)

      actionEmitter.on('paste_fetch', async () =>
        socketSend(
          conn.socket,
          event('paste_fetch', {
            pastes: await db.paste.findMany({
              orderBy: [
                {
                  createdAt: 'desc',
                },
              ],
              where: {
                userId: user.id,
              },
            }),
          })
        )
      )

      actionEmitter.on('paste_create', async (msg: ReceivedMessage) => {
        const data: Paste.Create['Body']['data'] = msg.data
        if (!ajv.validate(Paste.create.body, { data })) return

        if (data.public && !user.invite)
          return socketSend(
            conn.socket,
            error({
              kind: ErrorKind.FORBIDDEN,
              message: 'You are not authorized to make public pastes.',
            })
          )

        const paste = await db.paste.create({
          data: {
            content: data.content,
            createdAt: new Date(),
            userId: user.id,
          },
        })

        socketSend(
          conn.socket,
          event('action_paste_save', {
            message: 'success',
            data: {
              paste: PasteDto.make(paste),
            },
          })
        )

        emitter.emit(`paste_create__${user.id}`, paste)
      })

      actionEmitter.on('paste_edit', async (msg: ReceivedMessage) => {
        const data: Paste.Edit['Body']['data'] = msg.data
        console.log(msg.data)
        if (!ajv.validate(Paste.edit.body.properties.data, data)) return

        const paste = await db.paste.findUnique({
          where: {
            id: data.id,
          },
        })

        if (!paste)
          return socketSend(
            conn.socket,
            error({
              kind: ErrorKind.USER_INPUT,
              message: 'Paste not found',
            })
          )

        if (paste.userId !== user.id)
          return socketSend(
            conn.socket,
            error({
              kind: ErrorKind.FORBIDDEN,
              message: 'This is not your paste',
            })
          )

        const newPaste = await db.paste.update({
          where: {
            id: data.id,
          },
          data: {
            content: data.content,
            public: data.public,
          },
        })

        emitter.emit(`paste_edit__${user.id}`, newPaste)

        socketSend(
          conn.socket,
          event('action_paste_edit', {
            message: 'success',
            data: {
              paste: PasteDto.make(newPaste),
            },
          })
        )
      })

      actionEmitter.on('paste_delete', async (msg: ReceivedMessage) => {
        const data: Paste.ById['Params'] = msg.data
        if (!ajv.validate(Paste.byId.params, data)) return

        const paste = await db.paste.findUnique({
          where: {
            id: data.id,
          },
        })

        if (!paste)
          return socketSend(
            conn.socket,
            error({
              kind: ErrorKind.USER_INPUT,
              message: 'Paste not found',
            })
          )

        if (paste.userId !== user.id)
          return socketSend(
            conn.socket,
            error({
              kind: ErrorKind.FORBIDDEN,
              message: 'This is not your paste',
            })
          )

        await db.paste.delete({
          where: {
            id: data.id,
          },
        })

        emitter.emit(`paste_delete__${user.id}`, paste)

        socketSend(
          conn.socket,
          event('action_paste_delete', {
            message: 'success',
            data: {
              paste: PasteDto.make(paste),
            },
          })
        )
      })
    },
  })
}

export const routePrefix = '/paste'

export default PasteWebsocketController
