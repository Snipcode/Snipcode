import { Auth } from '@snipcode/backend/src/schemas'
import { Error, Success } from '@snipcode/backend/src/utils/response'
import { $axios, SuccessMessage } from '../axios'

export const login = ({ username, password }: Auth.AuthSchema['Body']['data']) =>
  $axios.request<Success<SuccessMessage> | Error<any>>({
    url: '/auth/login',
    method: 'POST',
    data: {
      data: {
        username,
        password,
      },
    },
  })

export const register = ({
  username,
  password,
  code,
}: Auth.AuthSchema['Body']['data']) =>
  $axios.request<Success<SuccessMessage> | Error<any>>({
    url: '/auth/register',
    method: 'PUT',
    data: {
      data: {
        username,
        password,
        ...(code && code.trim().length > 1 ? { code } : {}),
      },
    },
  })

export const logout = () =>
  $axios.request<Success<SuccessMessage>>({
    url: '/auth/logout',
    method: 'GET',
  })
