import s from "fluent-json-schema"

export interface UserCreateRequest {
  Body: {
    username: string
    password: string
  }
}

export const userCreateSchema = s
  .object()
  .prop(
    'body',
    s
      .object()
      .required()
      .prop('username', s.string().required().minLength(3).maxLength(255))
      .prop('password', s.string().required().minLength(6))
  )
