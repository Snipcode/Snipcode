import axios from 'axios'

export const BASE_ENDPOINTS: Record<string, string> = {
  development: 'http://localhost:4200/',
  production: 'https://snipcode.link/api',
}

export interface SuccessMessage {
  message: 'success'
}

/// TODO: dont use ip

export const baseUrl = () => BASE_ENDPOINTS[env] ?? BASE_ENDPOINTS.production

export const env = process.env.NODE_ENV ?? 'production'

export const $axios = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
})
