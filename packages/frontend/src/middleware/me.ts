import { Context } from '@nuxt/types'
import { me } from '~/api/user'

// Not using the entire Context type so this function is reusable.
export default async ({ $accessor }: { $accessor: Context['$accessor'] }) => {
  console.log($accessor)
  console.log('meow')
  const { data } = await me()
  if (!data.success || !data.data) return

  $accessor.user.setUser(data.data.user)
}
