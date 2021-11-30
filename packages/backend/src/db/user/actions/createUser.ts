import { db } from '../../../container'
import { UserCreateException } from '../../../exceptions/db/actions/UserCreateException'
import { hashPassword } from '../../../security/password'
import { logException } from '../../../utils/logger'
import { resolveUserByUsername } from './resolveUser'

export interface UserCreateOpts {
  username: string
  rawPassword: string
}

export const createUser = async ({ username, rawPassword }: UserCreateOpts) => {
  try {
    if (!Boolean(await resolveUserByUsername(username)))
      throw new UserCreateException('This username is already used.')

    return await db().user.create({
      data: {
        username,
        password: await hashPassword(rawPassword),
      },
    })
  } catch (e) {
    if (!UserCreateException.is(e)) {
      logException(e)
      throw new UserCreateException()
    }

    throw e
  }
}
