import { db } from '../../../container'
import { UserResolveException } from '../../../exceptions/db/actions/UserResolveException'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const deleteUser = async (id: IdResolvable) => {
  try {
    // First, all pastes need to be deleted.
    // Maybe someone will question why not make a query if
    // the user exists first because sending this query for a non-existent user
    // would be a waste - well, you would still send at least one query, either deleting all the pastes
    // for the id (even if there are none) or checking if the user exists.
    await db().paste.deleteMany({
      where: {
        userId: resolveId(id),
      },
    })

    // Delete the user.
    const user = await db().user.delete({
      where: {
        id: resolveId(id),
      },
    })

    if (!user)
      throw new UserResolveException()
  } catch (e) {
    if (!UserResolveException.is(e)) {
      logException(e, `Failed to delete user "${resolveId(id)}"`)
      throw new UserResolveException()
    }

    throw e
  }
}
