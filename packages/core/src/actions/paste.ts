import { Paste, PrismaClient, Prisma } from '@prisma/client'
import { PasteDto } from '../dto/pasteDto'
import {
  DeleteResult,
  FetchManyResult,
  FetchOneResult,
  SaveResult,
  UpdateResult,
} from '.'

/**
 * Fetch a paste.
 *
 * @param {Prisma.PasteWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<Paste, PasteDto>} Fetch Result
 */
const fetchOne = async (
  where: Prisma.PasteWhereInput,
  prisma: PrismaClient
): Promise<FetchOneResult<Paste, PasteDto>> => {
  const paste = await prisma.paste.findFirst({ where })

  if (!paste) return null

  return {
    entity: paste,
    entityDto: PasteDto.make(paste),
  }
}

/**
 * Fetch multiple pastes.
 *
 * @param {Prisma.PasteWhereInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchManyResult<Paste, PasteDto>} Fetch Result
 */
const fetchMany = async (
  where: Prisma.PasteWhereInput,
  prisma: PrismaClient
): Promise<FetchManyResult<Paste, PasteDto>> => {
  const pastes = await prisma.paste.findMany({ where })

  return {
    entities: pastes,
    entityDtos: PasteDto.makeMany(pastes),
  }
}

/**
 * Fetch pastes by UNIQUE columns.
 *
 * @param {Prisma.PasteWhereUniqueInput} where Query filters
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<Paste, PasteDto} Fetch Result
 */
const fetchUnique = async (
  where: Prisma.PasteWhereUniqueInput,
  prisma: PrismaClient
): Promise<FetchOneResult<Paste, PasteDto>> => {
  const paste = await prisma.paste.findUnique({ where })

  if (!paste) return null

  return {
    entity: paste,
    entityDto: PasteDto.make(paste),
  }
}

/**
 * Fetch a paste by it's id.
 *
 * @param {Paste['id']} id Paste's id
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {FetchOneResult<Paste, PasteDto>} Fetch Result
 */
const fetchById = async (
  id: Paste['id'],
  prisma: PrismaClient
): Promise<FetchOneResult<Paste, PasteDto>> => fetchUnique({ id }, prisma)

/**
 * Save a paste.
 *
 * @param {Prisma.PasteCreateInput} data Paste data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {SaveResult<Paste, PasteDto>} Save Result
 */
const save = async (
  data: Prisma.PasteCreateInput,
  prisma: PrismaClient
): Promise<SaveResult<Paste, PasteDto>> => {
  const newPaste = await prisma.paste.create({ data })

  return {
    entity: newPaste,
    entityDto: PasteDto.make(newPaste),
  }
}

/**
 * Update a paste.
 *
 * @param {Paste | Paste['id']} paste Paste id or an existing Paste instance
 * @param {Prisma.PasteUpdateInput} data Update Data
 * @param {PrismaClient} prisma PrismaClient Instance
 * @returns {UpdateResult<Paste, PasteDto>} Update Result
 */
const update = async (
  paste: Paste | Paste['id'],
  data: Prisma.PasteUpdateInput,
  prisma: PrismaClient
): Promise<UpdateResult<Paste, PasteDto>> => {
  const oldPaste =
    typeof paste === 'object' ? paste : (await fetchById(paste, prisma))?.entity

  if (!oldPaste) return null

  const newPaste = await prisma.paste.update({
    where: {
      id: oldPaste.id,
    },
    data,
  })

  return {
    oldEntity: oldPaste,
    oldEntityDto: PasteDto.make(oldPaste),
    entity: newPaste,
    entityDto: PasteDto.make(newPaste),
  }
}

/**
 * Delete a paste.
 *
 * @param {Paste | Paste['id']} paste Paste id or a Paste instance.
 * @param {PrismaClient} prisma PrismaClient instance
 * @returns {DeleteResult<Paste, PasteDto>} Delete Result
 */
const _delete = async (
  paste: Paste | Paste['id'],
  prisma: PrismaClient
): Promise<DeleteResult<Paste, PasteDto>> => {
  const oldPaste = await prisma.paste.delete({
    where: {
      id: typeof paste === 'object' ? paste.id : paste,
    },
  })

  if (!oldPaste) return null

  return {
    entity: oldPaste,
    entityDto: PasteDto.make(oldPaste),
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
}
