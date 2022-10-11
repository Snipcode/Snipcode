import bcrypt, { hashSync } from 'bcryptjs'
import { error, ErrorKind, success } from '../../utils/response'
import { Auth } from '../../schemas'
import { controller } from '../../utils/controllers'
import { $s } from '../../container'

export default controller(async (app) => {
  const db = $s('db')

  app.post<Auth.AuthSchema>(
    '/login',
    { schema: Auth.authSchema },
    async (req, res) => {
      const user = await db.user.findUnique({
        where: {
          username: req.body.data.username,
        },
      })

      if (!user)
        return res.send(
          error({
            kind: ErrorKind.USER_INPUT,
            message: 'Combination of username and password is invalid.',
          })
        )

      if (!bcrypt.compareSync(req.body.data.password, user.password))
        return res.send(
          error({
            kind: ErrorKind.USER_INPUT,
            message: 'Combination of username and password is invalid.',
          })
        )

      req.session.set('userId', user.id)

      res.send(success({ message: 'success' }))
    }
  )

  app.put<Auth.AuthSchema>(
    '/register',
    { schema: Auth.authSchema },
    async ({ body: { data } }, res) => {
      const usernameTaken = await db.user.findUnique({
        where: {
          username: data.username,
        },
      })

      if (usernameTaken)
        return res.send(
          error({
            kind: 'user_input',
            message: 'Username is already taken.',
          })
        )

      if (data.code) {
        const code = await db.invite.findUnique({
          where: {
            id: data.code,
          },
        })

        if (!code)
          return res.send(
            error({ kind: 'user_input', message: 'Invalid invite code' })
          )

        if (code.takenById)
          return res.send(
            error({
              kind: ErrorKind.USER_INPUT,
              message: 'This code is already taken',
            })
          )
      }

      await db.user.create({
        data: {
          username: data.username,
          password: hashSync(data.password),
          ...(data.code
            ? {
                invite: { connect: { id: data.code } },
                invites: { create: Array(10).fill({}) },
              }
            : {}),
        },
      })

      res.send(
        success({
          message: 'success',
        })
      )
    }
  )

  app.get('/logout', async (req, res) => {
    req.session.delete()
    res.send(
      success({
        message: 'success',
      })
    )
  })
}, '/api/auth')
