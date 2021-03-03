import { Paste as DBPaste } from '@prisma/client'
import Ajv from 'ajv'
import { Controller, ReceivedMessage } from '../../types'
import { createUserContext } from '../../http/context/userContext'
import { PasteDto } from '../../http/dto/db/pasteDto'
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

      emitter.on(`pasteCreate__${user.id}`, handlePasteCreate)

      conn.socket.on('close', () =>
        emitter.off(`pasteCreate__${user.id}`, handlePasteCreate)
      )

      /**
       * Websocket Actions
       */

      const actionEmitter = createActionEmitter(conn)

      actionEmitter.on('fetch_pastes', async () =>
        socketSend(
          conn.socket,
          event('fetch_pastes', {
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

      actionEmitter.on('create_paste', async (msg: ReceivedMessage) => {
        const data: Paste.Create['Body']['data'] = msg.data
        if (!ajv.validate(Paste.create.body, { data })) return

        const paste = await db.paste.create({
          data: {
            content: data.content,
            createdAt: new Date(),
            userId: user.id,
          },
        })

        socketSend(conn.socket, event('save_paste', { message: 'success' }))

        emitter.emit(`pasteCreate__${user.id}`, paste)
      })
    },
  })
}

export const routePrefix = '/paste'

export default PasteWebsocketController
