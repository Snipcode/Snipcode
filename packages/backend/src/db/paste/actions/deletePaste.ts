import { Paste, Prisma, User } from '@prisma/client'
import { db } from '../../../container'
import { PasteDeleteException } from '../../../exceptions/db/actions/PasteDeleteException'
import { PasteResolveException } from '../../../exceptions/db/actions/PasteResolveException'
import { logException } from '../../../utils/logger'

export const deletePaste = async (
  where: Prisma.PasteWhereUniqueInput,
  opts: Omit<Prisma.PasteDeleteArgs, "where"> = {}
): Promise<Paste> => {
  try {
    const paste = await db().paste.delete({ where, ...opts })

    if (!paste) throw new PasteResolveException()

    return paste
  } catch (e) {
    if (!PasteResolveException.is(e)) {
      logException(e, `Failed to delete paste "${JSON.stringify(where)}"`)
      throw new PasteDeleteException()
    }

    throw e
  }
}

export const deletePastes = async (
  where: Prisma.PasteWhereInput,
  opts: Omit<Prisma.PasteDeleteManyArgs, "where"> = {}
): Promise<number> => {
  try {
    const paste = await db().paste.deleteMany({ where, ...opts })

    return paste.count
  } catch (e) {
    logException(e, `Failed to delete pastes by "${JSON.stringify(where)}"`)
    throw new PasteDeleteException()
  }
}
