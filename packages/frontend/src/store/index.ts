import { UserDto } from '@snipcode/backend/src/dto/db/userDto'
import { ref } from 'vue'
import { Alert } from './Alert'

export const user = ref<UserDto | null>(null)

export const alert = ref<Alert | null>(null)

export const globalLoaded = ref(false);
