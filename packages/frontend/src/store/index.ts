import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'typed-vuex'

import * as user from './user'
import * as socket from './socket'

export const state = () => ({
  alert: null as string | null,
})

export const RootMutations = {
  SET_ALERT: 'SET_ALERT',
}

export type RootState = ReturnType<typeof state>

export const getters = getterTree(state, {
  alert: (state) => state.alert,
})

export const mutations = mutationTree(state, {
  [RootMutations.SET_ALERT]: (state, newVal: string | null) =>
    (state.alert = newVal),
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    setAlert: ({ commit }: any, newVal: string | null) =>
      commit(RootMutations.SET_ALERT, newVal),
    setTimedAlert: (
      { commit }: any,
      newVal: { value: string; time: number }
    ) => {
      commit(RootMutations.SET_ALERT, newVal.value)
      setTimeout(() => commit(RootMutations.SET_ALERT, null), newVal.time)
    },
  }
)

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    user,
    socket,
  },
})
