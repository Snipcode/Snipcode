import { Paste, User } from '@prisma/client'

export type UserWithPastes = User & { pastes?: Paste[] }

export class UserDto {
  constructor(_user: UserWithPastes) {
    this.username = _user.username
    this.pastes = _user.pastes
  }

  /**
   * Create a new DTO object from a User
   *
   * @param {User} user User
   * @returns {UserDto} Array of User DTO objects
   */
  public static make(user: User): UserDto {
    return new this(user)
  }

  /**
   * Create new DTO objects from an array of Users
   *
   * @param {User[]} user Array of Users
   * @returns {UserDto[]} Array of User DTO objects
   */
  public static makeMany(users: User[]): UserDto[] {
    return users.map((user) => new this(user))
  }

  /**
   * User's username
   */
  public username: string

  /**
   * User's pastes
   */
  public pastes?: Paste[]
}
