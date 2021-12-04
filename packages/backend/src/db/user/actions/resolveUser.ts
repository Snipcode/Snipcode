import { Prisma, User } from '@prisma/client'
import { db } from '../../../container'
import { UserResolveException } from '../../../exceptions/db/actions/UserResolveException'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const resolveUser = async (
  where: Prisma.UserWhereInput,
  opts: Omit<Prisma.UserFindFirstArgs, "where"> = {}
): Promise<User> => {
  try {
    const user = await db().user.findFirst({ where, ...opts })

    if (!user) throw new UserResolveException()

    return user
  } catch (e) {
    if (!UserResolveException.is(e)) {
      logException(e, `Failed to resolve user "${JSON.stringify(where)}"`)
      throw new UserResolveException()
    }

    throw e
  }
}

export const resolveUserByUsername = async (
  username: string | { username: string },
  opts: Omit<Prisma.UserFindFirstArgs, "where"> = {}
): Promise<User> =>
  resolveUser(typeof username === 'object' ? username : { username }, opts)

export const resolveUserById = async (
  id: IdResolvable<User['id']>,
  opts: Omit<Prisma.UserFindFirstArgs, "where"> = {}
): Promise<User> => resolveUser({ id: resolveId(id) }, opts)
