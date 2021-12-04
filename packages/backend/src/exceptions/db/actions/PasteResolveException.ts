import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../../utils'

export class PasteResolveException extends NotFoundException {
  public static NAME = 'PasteResolveException'

  constructor(message?: string | null) {
    super(message ?? 'This paste does not exist')
    this.name = PasteResolveException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}
