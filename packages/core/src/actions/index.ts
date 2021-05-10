type FetchOneResult<T, TDto> = {
  entity: T
  entityDto: TDto
} | null

interface FetchManyResult<T, TDto> {
  entities: T[]
  entityDtos: TDto[]
}

interface SaveResult<T, TDto> {
  entity: T
  entityDto: TDto
}

type UpdateResult<T, TDto> = {
  oldEntity: T
  oldEntityDto: TDto
  entity: T
  entityDto: TDto
} | null

type DeleteResult<T, TDto> = {
  entity: T
  entityDto: TDto
} | null

export {
  FetchOneResult,
  FetchManyResult,
  SaveResult,
  UpdateResult,
  DeleteResult,
}

export * as paste from './paste'
export * as user from './user'
