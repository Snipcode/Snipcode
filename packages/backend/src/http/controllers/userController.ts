import { Controller } from '../../types'
import { withUserContext } from '../context/userContext'
import { error, ErrorKind, success } from '../helpers/responseHelper'

const UserController: Controller = async (app, { db }) => {
  app.get('/', async (req, res) =>
    withUserContext(
      {
        req,
        res,
        deps: { db },
      },
      ({ dtoUser }) => res.send(success({ user: dtoUser }))
    )
  )

  app.post<{ Body: { data: { code: string } } }>(
    '/invite',
    {
      schema: {
        body: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'object',
              required: ['code'],
              properties: { code: { type: 'string' } },
            },
          },
        },
      },
    },
    async (req, res) =>
      withUserContext({ req, res, deps: { db } }, async ({ user }) => {
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
          },
        })

        res.send(
          success({
            message: 'success',
          })
        )
      })
  )
}

export const routePrefix = '/user'

export default UserController
