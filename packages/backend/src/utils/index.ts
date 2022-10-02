import { IdResolvable } from '../types'

/**
 * Gets id either as a property of object or itself.
 * @param id
 * @returns The id
 */
export const id = <TId extends number | string = string>(
  id: IdResolvable<TId>
): TId => (typeof id === 'object' ? id.id : id)
