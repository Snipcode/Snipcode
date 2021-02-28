import { Paste as DBPaste } from '@prisma/client'
import { Controller } from '../../types'
import { withUserContext } from '../context/userContext'
import { PasteDto } from '../dto/db/pasteDto'
import { error, ErrorKind, success } from '../helpers/responseHelper'
import { Paste } from '../schemas'

const PasteController: Controller = async (app, { db, emitter }) => {
  app.get<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withUserContext(
      async ({ user }) => {
        const paste = await db.paste.findUnique({
          where: {
            id: req.params.id,
          },
        })

        if (!paste)
          return res.send(
            error({
              kind: ErrorKind.USER_INPUT,
              message: 'Paste not found',
            })
          )

        if (paste.userId !== user.id)
          return res.send(
            error({
              kind: ErrorKind.FORBIDDEN,
              message: 'This is not your paste',
            })
          )

        res.send(
          success({
            paste: PasteDto.make(paste),
          })
        )
      },
      {
        req,
        res,
        deps: { db },
      }
    )
  )

  app.put<Paste.Create>('/', { schema: Paste.create }, async (req, res) =>
    withUserContext(
      async ({ user }) => {
        const paste = await db.paste.create({
          data: {
            content: req.body.data.content,
            createdAt: new Date(),
            userId: user.id,
          },
        })

        emitter.emit(`pasteCreate__${user.id}`, paste)

        res.send(
          success({
            paste,
          })
        )
      },
      { req, res, deps: { db } }
    )
  )

  app.delete<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withUserContext(
      async ({ user }) => {
        const paste = await db.paste.findUnique({
          where: {
            id: req.params.id,
          },
        })

        if (!paste)
          return res.send(
            error({
              kind: ErrorKind.USER_INPUT,
              message: 'Paste not found',
            })
          )

        if (paste.userId !== user.id)
          return res.send(
            error({
              kind: ErrorKind.FORBIDDEN,
              message: 'This is not your paste',
            })
          )

        db.paste.delete({
          where: {
            id: req.params.id,
          },
        })

        res.send(
          success({
            message: 'success',
          })
        )
      },
      {
        req,
        res,
        deps: { db },
      }
    )
  )

  app.route({
    method: 'GET',
    url: '/websocket',
    handler: (_, res) => {
      console.log('bad handler')
      res.send(
        error({
          kind: ErrorKind.USER_INPUT,
          message: 'This is a websocket endpoint',
        })
      )
    },
    wsHandler: async (conn, req) => {
      console.log('newconn')
      const user = await db.user.findUnique({
        where: {
          id: req.session.get('userId'),
        },
      })

      if (!user) {
        conn.socket.send(
          JSON.stringify(
            error({
              kind: ErrorKind.UNAUTHORIZED,
              message: 'You are not logged in',
            })
          )
        )
        return conn.socket.close()
      }

      const handlePasteCreate = (paste: DBPaste) => {
        conn.socket.send(
          JSON.stringify({
            evt: 'paste_create',
            data: {
              paste: PasteDto.make(paste),
            },
          })
        )
      }

      emitter.on(`pasteCreate__${user.id}`, handlePasteCreate)

      conn.socket.on('close', () =>
        emitter.off(`pasteCreate__${user.id}`, handlePasteCreate)
      )

      conn.socket.on('message', async (message: string) => {
        const msg: any = JSON.parse(message) // TODO: trycatch
        switch (msg.action) {
          case 'fetch_pastes': {
            conn.socket.send(
              JSON.stringify({
                evt: 'fetch_pastes',
                data: {
                  pastes: await db.paste.findMany({
                    where: {
                      userId: user.id,
                    },
                  }),
                },
              })
            )
            break
          }
          case 'create_paste': {
            const data = msg.data
            if (typeof data !== 'object') break
            if (typeof data.content !== 'string') break

            const paste = await db.paste.create({
              data: {
                content: data.content,
                createdAt: new Date(),
                userId: user.id,
              },
            })

            conn.socket.send(JSON.stringify({ message: 'success' }))

            emitter.emit(`pasteCreate__${user.id}`, paste)

            break
          }
          default:
            break
        }
      })
    },
  })
}

export const routePrefix = '/paste'

export default PasteController
