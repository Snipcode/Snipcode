import { Error, Success } from '@snipcode/backend/src/utils/response'
import { UserDto } from '@snipcode/backend/src/dto/db/userDto'
import { $axios } from '../axios'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { User } from '@snipcode/backend/src/schemas'
import { user } from '../../store'

export interface MeData {
  user: UserDto
}

export const me = () =>
  $axios.request<Success<MeData> | Error<any>>({
    url: '/user',
    method: 'GET',
  })

export const activateInviteCode = ({ code }: User.Invite['Body']['data']) =>
  $axios.request({
    url: '/user/invite',
    method: 'POST',
    data: {
      data: {
        code,
      },
    },
  })

export const parseInviteCodeFromRoute = (route: RouteLocationNormalizedLoaded) =>
  route.query.invite
    ? typeof route.query.invite === 'string'
      ? route.query.invite
      : ''
    : ''

export const refreshMe = async () => {
  const _me = await me();
  if (!_me.data.success) return window.location.reload();
  user.value = _me.data.data.user
}
