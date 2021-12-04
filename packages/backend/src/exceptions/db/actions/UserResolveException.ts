import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../../utils'

export class UserResolveException extends NotFoundException {
  public static NAME = 'UserResolveException'

  constructor(message?: string | null) {
    super(message ?? 'This user does not exist')
    this.name = UserResolveException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}
