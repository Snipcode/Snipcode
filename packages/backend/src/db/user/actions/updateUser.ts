import { Prisma } from '@prisma/client'
import { db } from '../../../container'
import { UserResolveException } from '../../../exceptions/db/actions/UserResolveException'
import { hashPassword } from '../../../security/password'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const updateUser = async (
  id: IdResolvable,
  data: Prisma.UserUpdateInput
) => {
  try {
    const user = await db().user.update({
      where: {
        id: resolveId(id),
      },
      data: {
        ...data,
        password:
          typeof data.password === 'string'
            ? await hashPassword(data.password)
            : undefined,
      },
    })

    if (!user)
      throw new UserResolveException()

  } catch (e) {
    if (!UserResolveException.is(e)) {
      logException(e, `Failed to update user "${resolveId(id)}"`)
      throw new UserResolveException()
    }

    throw e
  }
}
