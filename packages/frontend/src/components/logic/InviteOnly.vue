<template>
  <span>
    <slot v-if="user.invited" />
  </span>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $accessor } = useContext()

    const user = $accessor.user.user

    return {
      user,
    }
  },
})
</script>
