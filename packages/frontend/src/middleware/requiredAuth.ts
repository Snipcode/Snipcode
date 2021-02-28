import { Context } from '@nuxt/types'

export default async ({ $accessor, redirect }: Context) => {
  if (!$accessor.user.user) redirect('/login')
}
