import { Either } from '../types'

type ExceptionName = Either<{ NAME?: string }, { name?: string }>

export const isEx = (what: ExceptionName, which: ExceptionName | string) =>
  (what.name ?? what.NAME) ===
  (typeof which === 'string' ? which : which.name ?? which.NAME)
