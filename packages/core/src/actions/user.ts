import { User, PrismaClient, Prisma } from '@prisma/client'
import { UserDto } from '../dto/userDto'

interface UserFetchOneResult {
  user: User
  userDto: UserDto
}

interface UserFetchManyResult {
  users: User[]
  userDtos: UserDto[]
}

interface UserSaveResult {
  user: User
  userDto: UserDto
}

interface UserUpdateResult {
  oldUser: User
  oldUserDto: UserDto
  user: User
  userDto: UserDto
}

interface UserDeleteResult {
  user: User
  userDto: UserDto
}

/**
 * Fetch a user.
 *
 * @param {Prisma.UserWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {UserFetchOneResult | null} Fetch Result
 */
const fetchOne = async (
  where: Prisma.UserWhereInput,
  prisma: PrismaClient
): Promise<UserFetchOneResult | null> => {
  const user = await prisma.user.findFirst({ where })

  if (!user) return null

  return {
    user,
    userDto: UserDto.make(user),
  }
}

/**
 * Fetch multiple users.
 *
 * @param {Prisma.UserWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {UserFetchManyResult} Fetch Result
 */
const fetchMany = async (
  where: Prisma.UserWhereInput,
  prisma: PrismaClient
): Promise<UserFetchManyResult> => {
  const users = await prisma.user.findMany({ where })

  return {
    users,
    userDtos: UserDto.makeMany(users),
  }
}

/**
 * Fetch users by UNIQUE columns.
 *
 * @param {Prisma.UserWhereUniqueInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {UserFetchOneResult | null} Fetch Result
 */
const fetchUnique = async (
  where: Prisma.UserWhereUniqueInput,
  prisma: PrismaClient
): Promise<UserFetchOneResult | null> => {
  const user = await prisma.user.findUnique({ where })

  if (!user) return null

  return {
    user,
    userDto: UserDto.make(user),
  }
}

/**
 * Fetch a user by it's id.
 *
 * @param {User['id']} id User's id
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {UserFetchOneResult | null} Fetch Result
 */
const fetchById = async (
  id: User['id'],
  prisma: PrismaClient
): Promise<UserFetchOneResult | null> => fetchUnique({ id }, prisma)

/**
 * Save a user.
 *
 * @param {Prisma.UserCreateInput} data User data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {UserSaveResult} Save Result
 */
const save = async (
  data: Prisma.UserCreateInput,
  prisma: PrismaClient
): Promise<UserSaveResult | null> => {
  const newUser = await prisma.user.create({ data })

  return {
    user: newUser,
    userDto: UserDto.make(newUser),
  }
}

/**
 * Update a user.
 *
 * @param {User | User['id']} user User id or an existing User instance
 * @param {Prisma.UserUpdateInput} data Update Data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {UserUpdateResult | null} Update Result
 */
const update = async (
  user: User | User['id'],
  data: Prisma.UserUpdateInput,
  prisma: PrismaClient
): Promise<UserUpdateResult | null> => {
  const oldUser =
    typeof user === 'object' ? user : (await fetchById(user, prisma))?.user

  if (!oldUser) return null

  const newUser = await prisma.user.update({
    where: {
      id: oldUser.id,
    },
    data,
  })

  return {
    oldUser,
    oldUserDto: UserDto.make(oldUser),
    user: newUser,
    userDto: UserDto.make(newUser),
  }
}

/**
 * Delete a user.
 *
 * @param {User | User['id']} user User id or a User instance.
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {UserDeleteResult | null} Delete Result
 */
const _delete = async (
  user: User | User['id'],
  prisma: PrismaClient
): Promise<UserDeleteResult | null> => {
  const oldUser = await prisma.user.delete({
    where: {
      id: typeof user === 'object' ? user.id : user,
    },
  })

  if (!oldUser) return null

  return {
    user: oldUser,
    userDto: UserDto.make(oldUser),
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
  UserFetchOneResult,
  UserFetchManyResult,
  UserSaveResult,
  UserUpdateResult,
  UserDeleteResult,
}
