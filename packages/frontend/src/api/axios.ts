import axios from 'axios'

const BASE_ENDPOINTS: Record<string, string> = {
  development: 'http://localhost:4200/api',
  production: 'https://pastte-api.vott.us/api',
}

const RAW_BASE_ENDPOINTS: Record<string, string> = {
  development: 'localhost:4200/api',
  production: 'pastte-api.vott.us/api',
}

const baseUrl = (raw = false) =>
  raw
    ? RAW_BASE_ENDPOINTS[env] ?? RAW_BASE_ENDPOINTS.production
    : BASE_ENDPOINTS[env] ?? BASE_ENDPOINTS.production

const env = process.env.NODE_ENV ?? 'production'

const $axios = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
})

export { BASE_ENDPOINTS, env, $axios, baseUrl }
