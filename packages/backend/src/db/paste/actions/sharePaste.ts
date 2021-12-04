import { db } from '../../../container'
import { PasteResolveException } from '../../../exceptions/db/actions/PasteResolveException'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const sharePaste = async (id: IdResolvable, to: IdResolvable) => {
  try {
    const paste = await db().paste.update({
      where: {
        id: resolveId(id),
      },
      data: {
        shareAccessWith: {
          connect: {
            id: resolveId(to),
          },
        },
      },
    })

    if (!paste) throw new PasteResolveException()

    return paste
  } catch (e) {
    if (!PasteResolveException.is(e)) {
      logException(e, `Failed to update paste "${resolveId(id)}"`)
      throw new PasteResolveException()
    }

    throw e
  }
}

export const revokeShareOfPaste = async (
  id: IdResolvable,
  from: IdResolvable
) => {
  try {
    const paste = await db().paste.update({
      where: {
        id: resolveId(id),
      },
      data: {
        shareAccessWith: {
          disconnect: {
            id: resolveId(from),
          },
        },
      },
    })

    if (!paste) throw new PasteResolveException()

    return paste
  } catch (e) {
    if (!PasteResolveException.is(e)) {
      logException(e, `Failed to update paste "${resolveId(id)}"`)
      throw new PasteResolveException()
    }

    throw e
  }
}
