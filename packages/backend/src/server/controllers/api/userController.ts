import { Controller } from '../../../types/http'
import { createUser } from '../../../db/user/actions/createUser'
import { CommonUserRequest, commonUserSchema } from '../../schema/userSchema'
import { success } from '../../../utils/response'
import { resolveUserByUsername } from '../../../db/user/actions/resolveUser'
import { verifyPassword } from '../../../security/password'
import { UserLoginException } from '../../../exceptions/http/UserLoginException'
import { UserDto } from '../../../db/user'
import { withUserContext } from '../../context/userContext'

const UserController: Controller = (app, {}) => {
  app.put<CommonUserRequest>(
    '/register',
    { schema: commonUserSchema.valueOf() },
    async (req, res) =>
      res.send(
        success({
          user: await createUser({
            username: req.body.username,
            rawPassword: req.body.password,
          }),
        })
      )
  )

  app.post<CommonUserRequest>(
    '/login',
    { schema: commonUserSchema.valueOf() },
    async (req, res) => {
      try {
        const user = await resolveUserByUsername(req.body.username)

        if (!(await verifyPassword(user.password, req.body.password)))
          throw new UserLoginException()

        req.session.set('userId', user.id)

        return res.send(
          success({
            user: UserDto.make(user),
          })
        )
      } catch {
        throw new UserLoginException()
      }

      // "If you're seeing me, that means you boys fucked up."
    }
  )

  app.get('/me', (req, res) =>
    withUserContext({ req, res }, ({ dtoUser: user }) =>
      res.send(success({ user }))
    )
  )
}

export const routePrefix = '/api/user'

export default UserController
