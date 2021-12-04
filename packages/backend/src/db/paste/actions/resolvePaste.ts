import { Exception } from '@fasteerjs/exceptions'
import { Paste, Prisma, User } from '@prisma/client'
import { db } from '../../../container'
import { PasteResolveException } from '../../../exceptions/db/actions/PasteResolveException'
import { IdResolvable } from '../../../types'
import { logException } from '../../../utils/logger'
import { resolveId } from '../../utils'

export const resolvePaste = async (
  where: Prisma.PasteWhereInput,
  opts: Omit<Prisma.PasteFindFirstArgs, 'where'> = {}
) => {
  if (opts.include.shareAccessWith)
    throw new Exception('Cannot override opts.include.shareAccessWith')

  try {
    const paste = await db().paste.findFirst({
      where,
      ...opts,
      include: {
        ...(opts.include ?? {}),
        shareAccessWith: {
          select: {
            id: true,
          },
        },
      },
    })

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

export const resolvePasteById = async (
  id: IdResolvable,
  { where: _, ...opts }: Prisma.PasteFindFirstArgs = {}
) => resolvePaste({ id: resolveId(id) }, opts)

export const resolvePastes = async (
  where: Prisma.PasteWhereInput,
  { where: _, ...opts }: Prisma.PasteFindManyArgs = {}
) => {
  try {
    return db().paste.findMany({ where, ...opts })
  } catch (e) {
    logException(e)
    throw e
  }
}

export const resolvePastesByUser = async (
  user: IdResolvable<User['id']>,
  { where: _, ...opts }: Prisma.PasteFindManyArgs = {}
) => resolvePastes({ userId: resolveId(user) }, opts)
