import { Auth } from '@pastte/backend/src/http/schemas'
import { Error, Success } from '@pastte/backend/src/http/helpers/responseHelper'
import { $axios, SuccessMessage } from '../axios'

const login = ({ username, password }: Auth.AuthSchema['Body']['data']) =>
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

const register = ({
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

const logout = () =>
  $axios.request<Success<SuccessMessage>>({
    url: '/auth/logout',
    method: 'GET',
  })

export { login, register, logout }
