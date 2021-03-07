import { Paste, User } from '@prisma/client'

export type PasteWithUser = Paste & { user?: User }

export class PasteDto {
  constructor(_paste: PasteWithUser) {
    this.id = _paste.id
    this.content = _paste.content
    this.createdAt = _paste.createdAt
    this.user = _paste.user
    this.userId = _paste.userId
    this.public = _paste.public
  }

  /**
   * Create a new DTO object from a Paste
   *
   * @param {Paste} paste Paste
   * @returns {PasteDto} Paste DTO object
   */
  public static make(paste: PasteWithUser): PasteDto {
    return new this(paste)
  }

  /**
   * Create new DTO objects from an array of Pastes
   *
   * @param {Paste[]} pastes Array of Pastes
   * @returns {PasteDto[]} Array of Paste DTO objects
   */
  public static makeMany(pastes: PasteWithUser[]): PasteDto[] {
    return pastes.map((paste) => new this(paste))
  }

  /**
   * Paste Id
   */
  public id: string

  /**
   * Paste Content
   */
  public content: string

  /**
   * Paste Create Date
   *
   * (can be string if parsed from JSON)
   */
  public createdAt: Date | String

  /**
   * Id of the Paste Author
   */
  public userId: string

  /**
   * Paste Author
   */
  public user?: User

  /**
   * Is the Paste public?
   */
  public public?: boolean
}
