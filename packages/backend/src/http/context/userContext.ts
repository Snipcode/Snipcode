import { FastifyRequest, FastifyReply } from 'fastify'
import { FullUser, UserDto } from '@snipcode/core/src/dto/userDto'
import { Injected } from '../../types'
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
  ctx: UseUserContext,
  fn: (userCtx: UserContext) => Promise<unknown> | unknown,
  errFn?: () => unknown
) => {
  const context = await createUserContext(ctx)
  if (!context.success) {
    if (ctx.res) return ctx.res.send(context)
    return errFn?.()
  }

  return fn(context)
}

const withOptionalUserContext = async (
  ctx: UseUserContext,
  fn: (userCtx: UserContext | null) => Promise<unknown> | unknown
) => {
  const context = await createUserContext(ctx)
  return fn(context.success ? context : null)
}

export {
  UseUserContext,
  UserContext,
  withUserContext,
  withOptionalUserContext,
  createUserContext,
}
