import { Fasteer } from '@fasteerjs/fasteer'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'

export type Controller = Fasteer.FCtrl<FastifyInstance, {}, Injected>
