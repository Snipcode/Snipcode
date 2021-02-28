import { Controller } from '../../types'
import { withUserContext } from '../context/userContext'
import { PasteDto } from '../dto/db/pasteDto'
import { error, ErrorKind, success } from '../helpers/responseHelper'
import { Paste } from '../schemas'

const PasteController: Controller = async (app, { db, emitter }) => {
  app.get<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withUserContext(
      {
        req,
        res,
        deps: { db },
      },
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
      }
    )
  )

  app.put<Paste.Create>('/', { schema: Paste.create }, async (req, res) =>
    withUserContext({ req, res, deps: { db } }, async ({ user }) => {
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
    })
  )

  app.delete<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withUserContext(
      {
        req,
        res,
        deps: { db },
      },
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
      }
    )
  )
}

export const routePrefix = '/paste'

export default PasteController
