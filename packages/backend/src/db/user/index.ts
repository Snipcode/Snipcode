import { Paste, User } from '@prisma/client'


export type UserWithPastes = User & { pastes?: Paste[] }

export class UserDto {
  public id: string

  public username: string

  // TODO: PasteDto
  public pastes?: Paste[]

  constructor({ id, username, pastes }: UserWithPastes) {
    this.id = id
    this.username = username
    this.pastes = pastes
  }

  public static make(user: UserWithPastes): UserDto {
    return new this(user)
  }

  public static makeMany(users: UserWithPastes[]): UserDto[] {
    return users.map(this.make)
  }
}
