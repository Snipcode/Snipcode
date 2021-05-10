import {
  Error,
  Success,
} from '@snipcode/backend/src/http/helpers/responseHelper'
import { UserDto } from '@snipcode/core/src/dto/userDto'
import { $axios } from '../axios'
import { Route } from 'vue-router'
import { User } from '@snipcode/backend/src/http/schemas'

interface MeData {
  user: UserDto
}

const me = () =>
  $axios.request<Success<MeData> | Error<any>>({
    url: '/user',
    method: 'GET',
  })

const activateInviteCode = ({ code }: User.Invite['Body']['data']) =>
  $axios.request({
    url: '/user/invite',
    method: 'POST',
    data: {
      data: {
        code,
      },
    },
  })

const parseInviteCodeFromRoute = (route: Route) =>
  route.query.invite
    ? typeof route.query.invite === 'string'
      ? route.query.invite
      : ''
    : ''

export { me, activateInviteCode, parseInviteCodeFromRoute }
