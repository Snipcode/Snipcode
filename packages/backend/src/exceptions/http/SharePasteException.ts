import { NotFoundException } from '@fasteerjs/exceptions'
import { isEx } from '../utils'

export class SharePasteException extends NotFoundException {
  public static NAME = 'SharePasteException'

  constructor(message?: string | null) {
    super(message ?? 'An error occurred while attempting to share the paste..')
    this.name = SharePasteException.NAME
  }

  static is(e) {
    return isEx(e, this.NAME)
  }
}

