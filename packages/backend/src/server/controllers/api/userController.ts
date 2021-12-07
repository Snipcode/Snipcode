import { UserInputException } from '@fasteerjs/exceptions'
import { deletePaste } from '../../../db/paste/actions/deletePaste'
import { deleteUser } from '../../../db/user/actions/deleteUser'
import { updateUser } from '../../../db/user/actions/updateUser'
import { verifyPassword } from '../../../security/password'
import { Controller } from '../../../types/http'
import { success } from '../../../utils/response'
import { withUserContext } from '../../context/userContext'
import {
  UpdatePasswordRequest,
  updatePasswordSchema,
} from '../../schema/userSchema'

const UserController: Controller = (app) => {
  app.get('/me', (req, res) =>
    withUserContext({ req, res }, ({ dtoUser: user }) =>
      res.send(success({ user }))
    )
  )

  app.post<UpdatePasswordRequest>(
    '/password',
    { schema: updatePasswordSchema.valueOf() },
    (req, res) =>
      withUserContext({ req, res }, async ({ user }) => {
        if (!(await verifyPassword(user.password, req.body.newPassword)))
          throw new UserInputException('The current password does not match.')

        if (req.body.oldPassword === req.body.newPassword)
          throw new UserInputException(
            'The password cannot be the same as the old one.'
          )

        await updateUser(user, {
          password: req.body.newPassword,
        })

        res.send(success())
      })
  )

  app.post("/clearPastes",     (req, res) =>
  withUserContext({ req, res }, async ({ user }) => {
    await deletePaste()

    res.send(success())
  }))

  app.delete('/delete', (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
      await deleteUser(user)
      req.session.delete()

      res.send(success())
    })
  )
}

export const routePrefix = '/api/user'

export default UserController
