import axios from 'axios'

const BASE_ENDPOINTS: Record<string, string> = {
  development: 'http://localhost:4200/api',
  production: 'https://pastte.vott.us/api',
}

const WS_BASE_ENDPOINTS: Record<string, string> = {
  development: 'ws://localhost:4200/api',
  production: 'wss://pastte.vott.us/api',
}

/// TODO: dont use ip

const baseUrl = (ws = false) =>
  ws
    ? WS_BASE_ENDPOINTS[env] ?? WS_BASE_ENDPOINTS.production
    : BASE_ENDPOINTS[env] ?? BASE_ENDPOINTS.production

const env = process.env.NODE_ENV ?? 'production'

const $axios = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
})

export { BASE_ENDPOINTS, env, $axios, baseUrl }
