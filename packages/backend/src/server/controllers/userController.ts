import { withUserContext } from '../context/userContext'
import { error, ErrorKind, success } from '../../utils/response'
import { User } from '../../schemas'
import { controller } from '../../utils/controllers'
import { $s } from '../../container'

export default controller(async (app) => {
  const db = $s('db')

  app.get('/', async (req, res) =>
    withUserContext({ req, res }, ({ dtoUser }) =>
      res.send(success({ user: dtoUser }))
    )
  )

  app.post<User.Invite>('/invite', { schema: User.invite }, async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
      if (user.invite)
        return res.send(
          error({
            kind: ErrorKind.USER_INPUT,
            message: 'You are already invited.',
          })
        )

      const code = await db.invite.findUnique({
        where: { id: req.body.data.code },
      })
      if (!code)
        return res.send(
          error({
            kind: ErrorKind.USER_INPUT,
            message: 'Invalid invite code',
          })
        )

      if (code.takenById)
        return res.send(
          error({
            kind: ErrorKind.USER_INPUT,
            message: 'This code is already taken',
          })
        )

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          invite: {
            connect: {
              id: code.id,
            },
          },
          invites: { create: Array(10).fill({}) },
        },
      })

      res.send(
        success({
          message: 'success',
        })
      )
    })
  )
}, '/user')
