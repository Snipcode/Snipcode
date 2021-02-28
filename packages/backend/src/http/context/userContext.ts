import { FastifyRequest, FastifyReply } from 'fastify'
import { Injected } from '../../types'
import { UserDto, UserWithPastes } from '../dto/db/userDto'
import { error, ErrorKind } from '../helpers/responseHelper'

interface UseUserContext {
  req: FastifyRequest
  res: FastifyReply
  deps: {
    db: Injected['db']
  }
}

interface UserContext {
  user: UserWithPastes
  dtoUser: UserDto
}

/**
 * Fetches the data for the UserContext and passes them to the callback
 * passed in the first function.
 *
 * If an error occurs while fetching (eg. missing token, etc..),
 * the callback does not get executed and an error response gets sent.
 *
 * @param {(userCtx: UserContext) => Promise<unknown>} fn The callback
 * @param {UseUserContext} deps The required dependencies for UserContext
 */
const withUserContext = async (
  fn: (userCtx: UserContext) => Promise<unknown> | unknown,
  { req, res, deps: { db } }: UseUserContext
) => {
  const userId = req.session.get('userId')

  if (!userId)
    return res.send(
      error({
        kind: ErrorKind.UNAUTHORIZED,
        message: 'You are not logged in.',
      })
    )

  /**
   * Query the user by the ID in the session.
   */
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      pastes: true,
    },
  })
  if (!user)
    return res.send(
      error({
        kind: ErrorKind.UNAUTHORIZED,
        message: 'This user is no longer active.',
      })
    )

  const context: UserContext = {
    user,
    dtoUser: UserDto.make(user),
  }

  return fn(context)
}

export { UseUserContext, UserContext, withUserContext }
