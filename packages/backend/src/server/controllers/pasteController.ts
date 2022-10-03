import { PasteRepository } from '../../db/PasteRepository'
import { withUserContext } from '../context/userContext'
import { controller } from '../plugins/controllers'
import { success } from '../utils/response'

export default controller(async (server) => {
  server.get('/', async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
      return res.send(
        success({
          pastes: PasteRepository.findPastesByUserId(user.id),
        })
      )
    })
  )
}, '/paste')
