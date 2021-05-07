import { Paste, PrismaClient, Prisma } from '@prisma/client'
import { PasteDto } from '../dto/pasteDto'

interface PasteFetchOneResult {
  paste: Paste
  pasteDto: PasteDto
}

interface PasteFetchManyResult {
  pastes: Paste[]
  pasteDtos: PasteDto[]
}

interface PasteSaveResult {
  paste: Paste
  pasteDto: PasteDto
}

interface PasteUpdateResult {
  oldPaste: Paste
  oldPasteDto: PasteDto
  paste: Paste
  pasteDto: PasteDto
}

interface PasteDeleteResult {
  paste: Paste
  pasteDto: PasteDto
}

/**
 * Fetch a paste.
 *
 * @param {Prisma.PasteWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {PasteFetchOneResult | null} Fetch Result
 */
const fetchOne = async (
  where: Prisma.PasteWhereInput,
  prisma: PrismaClient
): Promise<PasteFetchOneResult | null> => {
  const paste = await prisma.paste.findFirst({ where })

  if (!paste) return null

  return {
    paste,
    pasteDto: PasteDto.make(paste),
  }
}

/**
 * Fetch multiple pastes.
 *
 * @param {Prisma.PasteWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {PasteFetchManyResult} Fetch Result
 */
const fetchMany = async (
  where: Prisma.PasteWhereInput,
  prisma: PrismaClient
): Promise<PasteFetchManyResult> => {
  const pastes = await prisma.paste.findMany({ where })

  return {
    pastes,
    pasteDtos: PasteDto.makeMany(pastes),
  }
}

/**
 * Fetch pastes by UNIQUE columns.
 *
 * @param {Prisma.PasteWhereUniqueInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {PasteFetchOneResult | null} Fetch Result
 */
const fetchUnique = async (
  where: Prisma.PasteWhereUniqueInput,
  prisma: PrismaClient
): Promise<PasteFetchOneResult | null> => {
  const paste = await prisma.paste.findUnique({ where })

  if (!paste) return null

  return {
    paste,
    pasteDto: PasteDto.make(paste),
  }
}

/**
 * Fetch a paste by it's id.
 *
 * @param {Paste['id']} id Paste's id
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {PasteFetchOneResult | null} Fetch Result
 */
const fetchById = async (
  id: Paste['id'],
  prisma: PrismaClient
): Promise<PasteFetchOneResult | null> => fetchUnique({ id }, prisma)

/**
 * Save a paste.
 *
 * @param {Prisma.PasteCreateInput} data Paste data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {PasteSaveResult} Save Result
 */
const save = async (
  data: Prisma.PasteCreateInput,
  prisma: PrismaClient
): Promise<PasteSaveResult | null> => {
  const newPaste = await prisma.paste.create({ data })

  return {
    paste: newPaste,
    pasteDto: PasteDto.make(newPaste),
  }
}

/**
 * Update a paste.
 *
 * @param {Paste | Paste['id']} paste Paste id or an existing Paste instance
 * @param {Prisma.PasteUpdateInput} data Update Data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {PasteUpdateResult | null} Update Result
 */
const update = async (
  paste: Paste | Paste['id'],
  data: Prisma.PasteUpdateInput,
  prisma: PrismaClient
): Promise<PasteUpdateResult | null> => {
  const oldPaste =
    typeof paste === 'object' ? paste : (await fetchById(paste, prisma))?.paste

  if (!oldPaste) return null

  const newPaste = await prisma.paste.update({
    where: {
      id: oldPaste.id,
    },
    data,
  })

  return {
    oldPaste,
    oldPasteDto: PasteDto.make(oldPaste),
    paste: newPaste,
    pasteDto: PasteDto.make(newPaste),
  }
}

/**
 * Delete a paste.
 *
 * @param {Paste | Paste['id']} paste Paste id or a Paste instance.
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {PasteDeleteResult | null} Delete Result
 */
const _delete = async (
  paste: Paste | Paste['id'],
  prisma: PrismaClient
): Promise<PasteDeleteResult | null> => {
  const oldPaste = await prisma.paste.delete({
    where: {
      id: typeof paste === 'object' ? paste.id : paste,
    },
  })

  if (!oldPaste) return null

  return {
    paste: oldPaste,
    pasteDto: PasteDto.make(oldPaste),
  }
}

export {
  fetchById,
  fetchMany,
  fetchOne,
  fetchUnique,
  save,
  update,
  _delete as delete,
  PasteFetchOneResult,
  PasteFetchManyResult,
  PasteSaveResult,
  PasteUpdateResult,
  PasteDeleteResult,
}
