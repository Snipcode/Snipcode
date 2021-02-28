import { $axios } from '../axios'
import { Auth } from '@pastte/backend/src/http/schemas'
import { Error, Success } from '@pastte/backend/src/http/helpers/responseHelper'

interface SuccessMessage {
  message: 'success'
}

const login = (data: Auth.AuthSchema['Body']['data']) =>
  $axios.request<Success<SuccessMessage> | Error<any>>({
    url: '/auth/login',
    method: 'POST',
    data: {
      data,
    },
  })

const register = (data: Auth.AuthSchema['Body']['data']) =>
  $axios.request<Success<SuccessMessage> | Error<any>>({
    url: '/auth/register',
    method: 'PUT',
    data: {
      data,
    },
  })

export { login, register }
