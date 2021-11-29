import { Fasteer } from "@fasteerjs/fasteer";
import {FastifyInstance} from "fastify"
import { PrismaClient } from "@prisma/client";
import { Logger } from "winston"

export interface SnipcodeContainer {
  db: PrismaClient,
  logger: Logger
}

export type Controller = Fasteer.FunctionalController<FastifyInstance, {}, SnipcodeContainer>
