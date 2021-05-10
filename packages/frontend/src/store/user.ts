import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'nuxt-typed-vuex'
import { UserDto } from '@snipcode/core/src/dto/userDto'

export const state = () => ({
  user: null as UserDto | null,
})

export type UserState = ReturnType<typeof state>
// eslint-disable-next-line no-use-before-define
export type UserGetters = typeof getters

export const UserMutations = {
  SET_USER: 'SET_USER',
}

export const getters = getterTree(state, {
  user: (state) => state.user,
})

export const mutations = mutationTree(state, {
  [UserMutations.SET_USER]: (state, val: UserState['user']) =>
    (state.user = val),
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setUser: ({ commit }: any, val: UserState['user']) =>
      commit(UserMutations.SET_USER, val),
  }
)

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
})
