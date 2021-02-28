import { Context } from '@nuxt/types'

export const $accessor = ({
  $accessor,
}: {
  $accessor: Context['$accessor']
}): Context['$accessor'] => $accessor

export type Accessor = Context['$accessor']

export default $accessor
