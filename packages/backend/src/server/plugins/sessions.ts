import fastifySecureSession from '@fastify/secure-session'
import pointOfView, { PointOfViewOptions } from '@fastify/view'
import fp from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
import sodium from 'sodium-native'

/**
 * Sessions Plugin
 */
export const sessions = fp<PointOfViewOptions>(async (server, opts) => {
  const sessionKeyPath = path.join(__dirname, '..', '..', '..', '.session_key')

  if (!fs.existsSync(sessionKeyPath)) {
    const buf = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES)
    sodium.randombytes_buf(buf)
    fs.writeFileSync(sessionKeyPath, buf)
  }

  server.register(fastifySecureSession, {
    cookieName: '_snipcode_session',
    key: fs.readFileSync(sessionKeyPath),
    cookie: {
      path: '/',
    },
  })
})
