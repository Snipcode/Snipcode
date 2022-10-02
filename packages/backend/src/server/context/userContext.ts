import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { $s } from '../../container'
import { $db } from '../../db'
import { BaseError, error, ErrorKind, ErrorPartial } from '../utils/response'

interface UseUserContext {
  req: FastifyRequest
  res?: FastifyReply
}

interface UserContext {
  success: true
  user: User
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
    return error({
      kind: ErrorKind.UNAUTHORIZED,
      message: 'You are not logged in.',
    })

  /**
   * Query the user by the ID in the session.
   */
  const user = await $db.user.findUnique({
    where: {
      id: userId,
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
