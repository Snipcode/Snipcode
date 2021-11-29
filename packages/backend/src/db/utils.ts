import { IdResolvable } from '../types'

export const resolveId = <TId extends number | string = string>(id: IdResolvable<TId>): TId =>
  typeof id === 'object' ? id.id : id
