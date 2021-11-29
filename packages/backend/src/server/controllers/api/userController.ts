import { Controller } from '../../../types/http'
import { createUser } from '../../../db/user/actions/createUser'
import { UserCreateRequest, userCreateSchema } from '../../schema/userSchema'
import { success } from '../../../utils/response'

const UserController: Controller = (app, {}) => {
  app.put<UserCreateRequest>(
    '/register',
    { schema: userCreateSchema.valueOf() },
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
}

export const routePrefix = '/api/user'

export default UserController
