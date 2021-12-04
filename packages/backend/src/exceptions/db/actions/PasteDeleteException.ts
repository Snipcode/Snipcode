import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../../utils'

export class PasteDeleteException extends NotFoundException {
  public static NAME = 'PasteDeleteException'

  constructor(message?: string | null) {
    super(message ?? 'Failed to delete this paste')
    this.name = PasteDeleteException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}
