import { Fasteer } from '@fasteerjs/fasteer'
import { PrismaClient } from '@prisma/client'
import EventEmitter from 'eventemitter3'
import { FastifyInstance } from 'fastify'

export interface Injected {
  db: PrismaClient
  emitter: EventEmitter
}
export interface ReceivedMessage {
  action: string
  [key: string]: any
}

export type Controller = Fasteer.FCtrl<FastifyInstance, {}, Injected>
