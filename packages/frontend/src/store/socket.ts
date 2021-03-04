import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'nuxt-typed-vuex'
import { CreateWebSocket } from '~/api/ws/createWebSocket'

export const state = () => ({
  socket: null as CreateWebSocket | null,
})

export type SocketState = ReturnType<typeof state>
// eslint-disable-next-line no-use-before-define
export type SocketGetters = typeof getters

export const SocketMutations = {
  SET_WS: 'SET_WS',
}

export const getters = getterTree(state, {
  socket: (state) => state.socket,
})

export const mutations = mutationTree(state, {
  [SocketMutations.SET_WS]: (state, val: CreateWebSocket) =>
    (state.socket = val),
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setSocket: ({ commit }: any, val: CreateWebSocket) =>
      commit(SocketMutations.SET_WS, val),
  }
)

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
})
