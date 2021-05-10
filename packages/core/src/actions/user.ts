import { User, PrismaClient, Prisma } from '@prisma/client'
import { UserDto } from '../dto/userDto'
import {
  FetchOneResult,
  FetchManyResult,
  SaveResult,
  UpdateResult,
  DeleteResult,
} from '.'

/**
 * Fetch a user.
 *
 * @param {Prisma.UserWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<User, UserDto> | null} Fetch Result
 */
const fetchOne = async (
  where: Prisma.UserWhereInput,
  prisma: PrismaClient
): Promise<FetchOneResult<User, UserDto> | null> => {
  const user = await prisma.user.findFirst({ where })

  if (!user) return null

  return {
    entity: user,
    entityDto: UserDto.make(user),
  }
}

/**
 * Fetch multiple users.
 *
 * @param {Prisma.UserWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchManyResult<User, UserDto>} Fetch Result
 */
const fetchMany = async (
  where: Prisma.UserWhereInput,
  prisma: PrismaClient
): Promise<FetchManyResult<User, UserDto>> => {
  const users = await prisma.user.findMany({ where })

  return {
    entities: users,
    entityDtos: UserDto.makeMany(users),
  }
}

/**
 * Fetch users by UNIQUE columns.
 *
 * @param {Prisma.UserWhereUniqueInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<User, UserDto> | null} Fetch Result
 */
const fetchUnique = async (
  where: Prisma.UserWhereUniqueInput,
  prisma: PrismaClient
): Promise<FetchOneResult<User, UserDto> | null> => {
  const user = await prisma.user.findUnique({ where })

  if (!user) return null

  return {
    entity: user,
    entityDto: UserDto.make(user),
  }
}

/**
 * Fetch a user by it's id.
 *
 * @param {User['id']} id User's id
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<User, UserDto> | null} Fetch Result
 */
const fetchById = async (
  id: User['id'],
  prisma: PrismaClient
): Promise<FetchOneResult<User, UserDto> | null> => fetchUnique({ id }, prisma)

/**
 * Save a user.
 *
 * @param {Prisma.UserCreateInput} data User data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {SaveResult<User, UserDto>} Save Result
 */
const save = async (
  data: Prisma.UserCreateInput,
  prisma: PrismaClient
): Promise<SaveResult<User, UserDto> | null> => {
  const newUser = await prisma.user.create({ data })

  return {
    entity: newUser,
    entityDto: UserDto.make(newUser),
  }
}

/**
 * Update a user.
 *
 * @param {User | User['id']} user User id or an existing User instance
 * @param {Prisma.UserUpdateInput} data Update Data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {UpdateResult<User, UserDto> | null} Update Result
 */
const update = async (
  user: User | User['id'],
  data: Prisma.UserUpdateInput,
  prisma: PrismaClient
): Promise<UpdateResult<User, UserDto> | null> => {
  const oldUser =
    typeof user === 'object' ? user : (await fetchById(user, prisma))?.entity

  if (!oldUser) return null

  const newUser = await prisma.user.update({
    where: {
      id: oldUser.id,
    },
    data,
  })

  return {
    oldEntity: oldUser,
    oldEntityDto: UserDto.make(oldUser),
    entity: newUser,
    entityDto: UserDto.make(newUser),
  }
}

/**
 * Delete a user.
 *
 * @param {User | User['id']} user User id or a User instance.
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {DeleteResult<User, UserDto> | null} Delete Result
 */
const _delete = async (
  user: User | User['id'],
  prisma: PrismaClient
): Promise<DeleteResult<User, UserDto> | null> => {
  const oldUser = await prisma.user.delete({
    where: {
      id: typeof user === 'object' ? user.id : user,
    },
  })

  if (!oldUser) return null

  return {
    entity: oldUser,
    entityDto: UserDto.make(oldUser),
  }
}

export {
  fetchById,
  fetchMany,
  fetchOne,
  fetchUnique,
  save,
  update,
  _delete as delete,
}
