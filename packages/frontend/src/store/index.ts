import { UserDto } from '@snipcode/backend/src/http/dto/db/userDto'
import { ref } from 'vue'
import { CreateWebSocket } from '../api/ws/createWebSocket'
import { Alert } from './Alert'

export const user = ref<UserDto | null>(null)

export const socket = ref<CreateWebSocket | null>(null)

export const alert = ref<Alert | null>(null)
