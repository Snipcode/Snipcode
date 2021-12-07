import s from "fluent-json-schema"

export interface CommonUserRequest {
  Body: {
    username: string
    password: string
  }
}

export const commonUserSchema = s
  .object()
  .prop(
    'body',
    s
      .object()
      .required()
      .prop('username', s.string().required().minLength(3).maxLength(255))
      .prop('password', s.string().required().minLength(6))
  )

export interface UpdatePasswordRequest {
  Body: {
    oldPassword: string,
    newPassword: string
  }
}

export const updatePasswordSchema = s
  .object()
  .prop(
    'body',
    s
      .object()
      .required()
      .prop('oldPassword', s.string().required().minLength(6))
      .prop('newPassword', s.string().required().minLength(6))
  )
