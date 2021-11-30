import { UnauthorizedException } from '@fasteerjs/exceptions'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserDto, UserWithPastes } from '../../db/user'
import { resolveUser, resolveUserById } from '../../db/user/actions/resolveUser'
import { BaseError, ErrorPartial, error, ErrorKind } from '../../utils/response'

interface UseUserContext {
  req: FastifyRequest
  res?: FastifyReply
}

interface UserContext {
  success: true
  user: UserWithPastes
  dtoUser: UserDto
}

/**
 * Creates the User Context and returns it,
 * if an error occurs it returns and Error according to the response-spec.
 *
 * @param {Omit<UseUserContext, 'res'>} _
 * @returns {UserContext | Error<BaseError>}
 */
const createUserContext = async ({
  req,
}: Omit<UseUserContext, 'res'>): Promise<
  UserContext | ErrorPartial<BaseError>
> => {
  const userId = req.session.get('userId')

  if (!userId)
    throw new UnauthorizedException()

  /**
   * Query the user by the ID in the session.
   */
  const user = await resolveUserById(userId)

  if (!user)
    throw new UnauthorizedException()

  const context: UserContext = {
    success: true,
    user,
    dtoUser: UserDto.make(user),
  }

  return context
}

/**
 * Creates the User Context and passes it to the callback
 * passed in the first function.
 *
 * If an error occurs while fetching (eg. missing token, etc..),
 * the callback does not get executed and an error response gets sent.
 *
 * @param {(userCtx: UserContext) => Promise<unknown>} fn The callback
 * @param {UseUserContext} deps The required dependencies for UserContext
 */
const withUserContext = async (
  { req, res }: UseUserContext,
  fn: (userCtx: UserContext) => Promise<unknown> | unknown,
  errFn?: () => unknown
) => {
  const context = await createUserContext({ req })

  if (!context.success) {
    if (res) return res.send(context)
    return errFn?.()
  }

  return fn(context)
}

export { UseUserContext, UserContext, withUserContext, createUserContext }
