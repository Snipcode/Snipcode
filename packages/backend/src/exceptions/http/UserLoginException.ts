import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../utils'

export class UserLoginException extends NotFoundException {
  public static NAME = 'UserLoginException'

  constructor(message?: string | null) {
    super(message ?? 'Incorrect username or password.')
    this.name = UserLoginException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}

