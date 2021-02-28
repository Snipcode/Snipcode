import { $axios } from '../axios'
import { Error, Success } from '@pastte/backend/src/http/helpers/responseHelper'
import { UserDto } from '@pastte/backend/src/http/dto/db/userDto'

interface MeData {
  user: UserDto
}

const me = () =>
  $axios.request<Success<MeData> | Error<any>>({
    url: '/user',
    method: 'GET',
  })

export { me }
