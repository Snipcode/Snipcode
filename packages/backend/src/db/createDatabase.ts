import { PrismaClient } from "@prisma/client"
import { DatabaseConnectionException } from "../exceptions/load/DatabaseConnectionException"

export const createDatabase = async (): Promise<PrismaClient> => {
  const db = new PrismaClient()

  try {
    await db.$connect()
  } catch (e) {
    throw new DatabaseConnectionException(e.message)
  }

  return db
}
