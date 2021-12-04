import { createUser } from '../../../db/user/actions/createUser'
import { resolveUserByUsername } from '../../../db/user/actions/resolveUser'
import { UserLoginException } from '../../../exceptions/http/UserLoginException'
import { verifyPassword } from '../../../security/password'
import { Controller } from '../../../types/http'
import { success } from '../../../utils/response'
import { CommonUserRequest, commonUserSchema } from '../../schema/userSchema'

const AuthController: Controller = async (app) => {
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

        return res.send(success())
      } catch {
        throw new UserLoginException()
      }

      // "If you're seeing me, that means you boys fucked up."
    }
  )
}

export const routePrefix = '/api/auth'

export default AuthController
