import { PasteDto } from '@snipcode/core/src/dto/pasteDto'
import { Controller } from '../../types'
import {
  withOptionalUserContext,
  withUserContext,
} from '../context/userContext'
import { error, ErrorKind, success } from '../helpers/responseHelper'
import { Paste } from '../schemas'

const PasteController: Controller = async (app, { db, emitter }) => {
  app.get<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withOptionalUserContext(
      {
        req,
        res,
        deps: { db },
      },
      async (ctx) => {
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

        if (!paste.public && (!ctx || paste.userId !== ctx.user.id))
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
      if (req.body.data.public && !user.invite)
        return res.send(
          error({
            kind: ErrorKind.FORBIDDEN,
            message: 'You are not authorized to make public pastes.',
          })
        )

      const paste = await db.paste.create({
        data: {
          content: req.body.data.content,
          createdAt: new Date(),
          userId: user.id,
          public: req.body.data.public,
        },
      })

      emitter.emit(`paste_create__${user.id}`, paste)

      res.send(
        success({
          paste: PasteDto.make(paste),
        })
      )
    })
  )

  app.post<Paste.Edit>('/', { schema: Paste.edit }, async (req, res) =>
    withUserContext({ req, res, deps: { db } }, async ({ user }) => {
      const paste = await db.paste.findUnique({
        where: {
          id: req.body.data.id,
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

      const newPaste = await db.paste.update({
        where: {
          id: req.body.data.id,
        },
        data: {
          content: req.body.data.content,
          public: req.body.data.public,
        },
      })

      res.send(
        success({
          paste: PasteDto.make(newPaste),
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

        await db.paste.delete({
          where: {
            id: req.params.id,
          },
        })

        emitter.emit(`paste_delete__${user.id}`, paste)

        res.send(
          success({
            paste: PasteDto.make(paste),
          })
        )
      }
    )
  )
}

export const routePrefix = '/paste'

export default PasteController
