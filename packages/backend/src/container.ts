import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { Container, setContainer } from "contairy";
import { $globals, Globals } from "./data/Globals";
import { $server } from "./server";
import { $db } from "./db";
import { $env } from "./data/Env";

export interface ServiceContainer {
    db: PrismaClient;
    server: FastifyInstance;
    globals: Globals;
    [key: string]: unknown;
}

export const $container = new Container<ServiceContainer>({
    db: $db,
    server: $server,
    globals: $globals,
    env: $env
})

setContainer($container);

export const services = (): ServiceContainer => <ServiceContainer>$container._services;

export const $s = (name: keyof ServiceContainer): ServiceContainer[typeof name] => services()[name];