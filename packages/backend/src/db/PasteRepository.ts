import { Prisma } from '@prisma/client'
import { $db } from '.'
import { $globals } from '../data/Globals'

export class PasteRepository {
  static _ = $db.paste

  static async findPastes(where: Prisma.PasteWhereInput) {
    return await this._.findMany({
      where,
    })
  }

  static async findPastesByUserId(userId: string) {
    return await this._.findMany({
      where: {
        userId,
      },
    })
  }

  static async findPaste(where: Prisma.PasteWhereInput) {
    return await this._.findFirst({ where })
  }

  static async findPasteById(id: string) {
    return await this._.findUnique({
      where: {
        id,
      },
    })
  }

  static async createPaste(data: Prisma.PasteCreateInput) {
    const paste = await this._.create({
      data,
    })

    const channel = $globals.findUserChannelByUserId(paste.userId)

    if (channel) {
      channel.emitPasteCreate(paste)
    }

    return paste
  }

  static async updatePastes(
    where: Prisma.PasteWhereUniqueInput,
    data: Prisma.PasteCreateInput
  ) {
    const pastes = await this._.updateMany({
      where,
      data,
    })

    // todo: emit

    return pastes
  }

  static async deletePastes(where: Prisma.PasteWhereUniqueInput) {
    const pastes = await this._.deleteMany({
      where,
    })

    // todo: emit

    return pastes
  }

  static async updatePaste(id: string, data: Prisma.PasteCreateInput) {
    const paste = await this._.update({
      where: {
        id,
      },
      data,
    })

    const channel = $globals.findUserChannelByUserId(paste.userId)

    if (channel) {
      channel.emitPasteEdit(paste)
    }

    return paste
  }

  static async deletePaste(id: string) {
    const paste = await this._.delete({
      where: {
        id,
      },
    })

    const channel = $globals.findUserChannelByUserId(paste.userId)

    if (channel) {
      channel.emitPasteDelete(paste)
    }

    return paste
  }
}
