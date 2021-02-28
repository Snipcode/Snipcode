import { Controller } from '../../types'
import { withUserContext } from '../context/userContext'
import { success } from '../helpers/responseHelper'

const UserController: Controller = async (app, { db }) => {
  app.get('/', async (req, res) =>
    withUserContext(({ dtoUser }) => res.send(success({ user: dtoUser })), {
      req,
      res,
      deps: { db },
    })
  )
}

export const routePrefix = '/user'

export default UserController
