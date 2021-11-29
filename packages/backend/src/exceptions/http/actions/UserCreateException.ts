import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../../utils'

export class UserCreateException extends NotFoundException {
  public static NAME = 'UserCreateException'

  constructor(message?: string | null) {
    super(message ?? 'Failed to create a user')
    this.name = UserCreateException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}
