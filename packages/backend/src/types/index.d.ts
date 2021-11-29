export type Only<T, U> = {
  [P in keyof T]: T[P]
} & {
  [P in keyof U]?: never
}

export type Either<T, U> = Only<T, U> | Only<U, T>

export type IdResolvable<TId extends number | string = string> = TId | { id: TId }
