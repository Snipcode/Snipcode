import {
  withOptionalUserContext,
  withUserContext,
} from '../context/userContext'
import { PasteDto } from '../../dto/db/pasteDto'
import { error, ErrorKind, success } from '../../utils/response'
import { Paste } from '../../schemas'
import { controller } from '../../utils/controllers'
import { $s } from '../../container'

export default controller(async (app) => {
  const db = $s('db')

  app.get<Paste.ById>('/:id', { schema: Paste.byId }, async (req, res) =>
    withOptionalUserContext({ req, res },
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

  app.get('/', async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
      res.send(
        success({
          pastes: PasteDto.makeMany(
            await db.paste.findMany({ where: { userId: user.id } })
          ),
        })
      )
    })
  )

  app.put<Paste.Create>('/', { schema: Paste.create }, async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
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

      res.send(
        success({
          paste: PasteDto.make(paste),
        })
      )
    })
  )

  app.post<Paste.Edit>('/', { schema: Paste.edit }, async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
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
    withUserContext({ req, res }, async ({ user }) => {
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

      res.send(
        success({
          paste: PasteDto.make(paste),
        })
      )
    })
  )
}, '/paste')
