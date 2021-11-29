import { config as configEnv } from 'dotenv'
import { NoEnvFoundException } from './exceptions/load/NoEnvFoundException'

configEnv()

export enum Env {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  HOST = 'HOST',
  BASE_URL = 'BASE_URL',
  HTTPS = 'HTTPS',
  CORS_DOMAIN = 'CORS_DOMAIN',
}

export enum Environment {
  DEV = 'development',
  PROD = 'production',
}

const env = (variable: Env, fallback?: string): string => {
  const val = process.env[variable]

  if (!val && !fallback) {
    throw new NoEnvFoundException(variable)
  }

  return val ?? fallback
}

env.bool = (variable: Env): boolean => Boolean(env(variable, 'false'))

export { env }

export const dev = () => env(Env.NODE_ENV) === 'development'

export const ver = require('../package.json').version
