/**
 * The response helper for sending standardized responses
 * based on the @vottuscode/response-spec specification.
 *
 * @see https://github.com/VottusCode/response-spec/tree/8d21f72681a7777e2ef30336aee656644619e7af
 * @see https://github.com/VottusCode/response-spec/blob/8d21f72681a7777e2ef30336aee656644619e7af/src/fastify.ts
 */

export interface Success<TData extends any = any> {
  success: true
  data: TData
}

export interface BaseError {
  kind: string
  message: string
}

export interface Error<TError extends BaseError = BaseError> {
  success: false
  error: TError
}

export const success = <TData extends any = any>(
  data: TData
): Success<TData> => ({
  success: true,
  data,
})

export const error = <TError extends BaseError = BaseError>(
  error: TError
): Error<TError> => ({ success: false, error })

export const ErrorKind = {
  USER_INPUT: 'user_input',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  INTERNAL: 'internal',
}

export interface Event<
  TEventName extends string = string,
  TData extends any = any
> {
  event: TEventName
  data?: TData
}

export const event = <
  TEventName extends string = string,
  TData extends any = any
>(
  eventName: TEventName,
  data?: TData
): Event<TEventName, TData> => ({
  event: eventName,
  data,
})
