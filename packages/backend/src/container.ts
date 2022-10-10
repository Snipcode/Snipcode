import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import {Container, setContainer, useContainer} from "contairy";
import EventEmitter from "eventemitter3";

export interface ServiceContainer {
  db: PrismaClient;
  server: FastifyInstance;
  emitter: EventEmitter
  [key: string]: any;
}

export const services = (): ServiceContainer => <ServiceContainer>useContainer()._services;

export const $s = (name: keyof ServiceContainer): ServiceContainer[typeof name] => services()[name];
