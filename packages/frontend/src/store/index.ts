import { UserDto } from '@snipcode/backend/src/dto/db/userDto'
import { ref } from 'vue'

export const user = ref<UserDto | null>(null)

export const globalLoaded = ref(false);
