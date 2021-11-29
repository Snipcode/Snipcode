import { Paste, Prisma, User } from '@prisma/client'
import { db } from '../../../container'
import { PasteResolveException } from '../../../exceptions/http/actions/PasteResolveException'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const resolvePaste = async (
  where: Prisma.PasteWhereInput
): Promise<Paste> => {
  try {
    const paste = await db().paste.findFirst({ where })

    if (!paste) throw new PasteResolveException()

    return paste
  } catch (e) {
    if (!PasteResolveException.is(e)) {
      logException(e, `Failed to resolve paste "${JSON.stringify(where)}"`)
      throw new PasteResolveException()
    }

    throw e
  }
}

export const resolvePasteById = async (id: IdResolvable) =>
  resolvePaste({ id: resolveId(id) })

export const resolvePastes = async (where: Prisma.PasteWhereInput) => {
  try {
    return db().paste.findMany({ where })
  } catch (e) {
    logException(e)
    throw e
  }
}

export const resolvePastesByUser = async (user: IdResolvable<User["id"]>) => resolvePastes({ userId: resolveId(user) })
