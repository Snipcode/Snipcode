import { FastifyRequest, FastifyReply } from 'fastify'
import { Injected } from '../../types'
import { FullUser, UserDto } from '../dto/db/userDto'
import { BaseError, Error, error, ErrorKind } from '../helpers/responseHelper'
interface UseUserContext {
  req: FastifyRequest
  res?: FastifyReply
  deps: {
    db: Injected['db']
  }
}

interface UserContext {
  success: true
  user: FullUser
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
  deps: { db },
}: Omit<UseUserContext, 'res'>): Promise<UserContext | Error<BaseError>> => {
  const userId = req.session.get('userId')

  if (!userId)
    return error({
      kind: ErrorKind.UNAUTHORIZED,
      message: 'You are not logged in.',
    })

  /**
   * Query the user by the ID in the session.
   */
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      pastes: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
      invites: true,
      invite: true,
    },
  })
  if (!user)
    return error({
      kind: ErrorKind.UNAUTHORIZED,
      message: 'You are not logged in.',
    })

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
  { req, res, deps: { db } }: UseUserContext,
  fn: (userCtx: UserContext) => Promise<unknown> | unknown,
  errFn?: () => unknown
) => {
  const context = await createUserContext({ req, deps: { db } })
  if (!context.success) {
    if (res) return res.send(context)
    return errFn?.()
  }

  return fn(context)
}

export { UseUserContext, UserContext, withUserContext, createUserContext }
