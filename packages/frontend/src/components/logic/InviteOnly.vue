<template>
  <span>
    <slot v-if="user.invited" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {user} from "../../store";

export default defineComponent({
  setup() {

    return {
      user,
    }
  },
})
</script>
