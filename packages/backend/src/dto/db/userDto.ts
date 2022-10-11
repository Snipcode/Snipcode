import { Invite, Paste, User } from '@prisma/client'

export type UserWithPastes = User & { pastes?: Paste[] | null }

export type FullUser = UserWithPastes & {
  invites?: Invite[] | null
  invite?: Invite | null
}

export class UserDto {
  constructor(_user: FullUser) {
    this.id = _user.id
    this.username = _user.username
    this.pastes = _user.pastes
    this.invited = Boolean(_user.invite)
    this.invites = _user.invites ? _user.invites.map((el) => el.id) : []
  }

  /**
   * Create a new DTO object from a User
   *
   * @param {User} user User
   * @returns {UserDto} Array of User DTO objects
   */
  public static make(user: FullUser): UserDto {
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
  public id: string

  /**
   * User's username
   */
  public username: string

  /**
   * User's pastes
   */
  public pastes?: Paste[] | null

  /**
   * Is the user invited?
   */
  public invited: boolean

  /**
   * User's invite codes
   */
  public invites?: string[] | null
}
