import { Paste, User } from '@prisma/client'
import { Either } from '../../types'

export type PasteWithOptionalUser = Omit<Paste, 'userId'> &
  Either<{ userId: string }, { user: { id: User['id'] } }>

export class PasteDto {
  public id: Paste['id']

  public createdAt: Paste['createdAt']

  public content: Paste['content']

  public authorId: User['id']

  public isPublic: Paste['public']

  constructor({ id, createdAt, content, public: _public, ...paste }: PasteWithOptionalUser) {
    this.id = id
    this.createdAt = createdAt
    this.content = content
    this.authorId = paste.user ? paste.user.id : paste.userId
    this.isPublic = _public
  }

  public static make(paste: PasteWithOptionalUser): PasteDto {
    return new this(paste)
  }

  public static makeMany(pastes: PasteWithOptionalUser[]): PasteDto[] {
    return pastes.map(this.make)
  }
}
