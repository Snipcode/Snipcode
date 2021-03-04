/**
 * The response helper for sending standardized responses
 * based on the @vottuscode/response-spec specification.
 *
 * @see https://github.com/VottusCode/response-spec/tree/8d21f72681a7777e2ef30336aee656644619e7af
 * @see https://github.com/VottusCode/response-spec/blob/8d21f72681a7777e2ef30336aee656644619e7af/src/fastify.ts
 */

interface Success<TData extends any = any> {
  success: true
  data: TData
}

interface BaseError {
  kind: string
  message: string
}

interface Error<TError extends BaseError = BaseError> {
  success: false
  error: TError
}

const success = <TData extends any = any>(data: TData): Success<TData> => ({
  success: true,
  data,
})

const error = <TError extends BaseError = BaseError>(
  error: TError
): Error<TError> => ({ success: false, error })

const ErrorKind = {
  USER_INPUT: 'user_input',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  INTERNAL: 'internal',
}

export { success, error, Success, BaseError, Error, ErrorKind }
