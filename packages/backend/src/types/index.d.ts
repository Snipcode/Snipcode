import { Fasteer } from '@fasteerjs/fasteer'
import { PrismaClient } from '@prisma/client'
import EventEmitter from 'eventemitter3'
import { FastifyInstance } from 'fastify'

export interface Injected {
  db: PrismaClient
  emitter: EventEmitter
}

export type Controller = Fasteer.FCtrl<FastifyInstance, {}, Injected>
