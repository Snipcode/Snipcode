import { Context } from '@nuxt/types'
import { me } from '~/api/user'
import createWebSocket from '~/api/ws/createWebSocket'

const initSocketStore = ({
  $accessor,
}: {
  $accessor: Context['$accessor']
}) => {
  $accessor.socket.setSocket(createWebSocket())
}

const fetchMe = async ({ $accessor }: { $accessor: Context['$accessor'] }) => {
  const { data } = await me()
  if (!data.success || !data.data) return

  $accessor.user.setUser(data.data.user)
  return Boolean(data.data.user)
}

// Not using the entire Context type so this function is reusable.
export default async ({ $accessor }: { $accessor: Context['$accessor'] }) => {
  const isLoggedIn = await fetchMe({ $accessor })
  if (isLoggedIn && !$accessor.socket.socket) initSocketStore({ $accessor })
}

export { initSocketStore, fetchMe }
