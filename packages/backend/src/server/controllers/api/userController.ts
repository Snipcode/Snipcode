import { Controller } from '../../../types/http'
import { success } from '../../../utils/response'
import { withUserContext } from '../../context/userContext'

const UserController: Controller = (app) => {
  app.get('/me', (req, res) =>
    withUserContext({ req, res }, ({ dtoUser: user }) =>
      res.send(success({ user }))
    )
  )
}

export const routePrefix = '/api/user'

export default UserController
