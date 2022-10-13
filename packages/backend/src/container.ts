import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { useContainer } from 'contairy'

export interface ServiceContainer {
  db: PrismaClient
  server: FastifyInstance
  [key: string]: any
}

export const services = (): ServiceContainer =>
  <ServiceContainer>useContainer()._services

export const $s = (
  name: keyof ServiceContainer
): ServiceContainer[typeof name] => services()[name]
