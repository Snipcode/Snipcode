<template>
  <div>
    <Header/>
    <div class="px-5 py-6">
      <error v-if="form.error">
        {{ form.error }}
      </error>
      <with-arrow class="mb-6">
        <h1 class="font-mono text-white text-2xl">Invite</h1>
        <p class="font-mono text-gray-200">
          Invited users have special functions, such as public pastes.
        </p>
      </with-arrow>

      <div class="flex flex-col gap-y-4">
        <form @submit.prevent="activateInviteCode" v-if="!user.invited">
          <with-arrow class="mb-4">
            <Input
              type="text"
              autocomplete="invite-code"
              placeholder="Invite Code"
              tabindex="0"
              required
              @input="v.code.$touch"
              v-model.trim="form.code"
            />
            <span
              v-if="v.code.$error"
              class="text-red-500 text-sm font-mono md:ml-2"
            >You need to enter the invite code.</span
            >
          </with-arrow>
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <div v-else>
          <with-arrow class="mb-6">
            <h1 class="font-mono text-white text-2xl">Your Invite Codes</h1>
          </with-arrow>

          <div
            class="mt-6 flex flex-col gap-y-4 pr-5 overflow-y-scroll"
            style="height: 50vh"
          >
            <a
              v-for="(invite, i) in user.invites"
              :key="i"
              class="rounded-2xl flex flex-col border px-4 py-2 border-gray-700 text-white font-mono"
            >
              <span
                class="truncate break-all overflow-ellipsis overflow-hidden tracking-tighter max-w-4xl"
              >
                {{ invite }}
              </span>
              <span class="text-xs text-gray-400 flex gap-x-2">
                <span
                  class="text-gray-200 border-b border-gray-200 cursor-pointer"
                  @click.prevent="() => copyLink(invite, 'register')"
                >
                  Copy Register Link
                </span>
                <span
                  class="text-gray-200 border-b border-gray-200 cursor-pointer"
                  @click.prevent="() => copyLink(invite, 'invite')"
                >
                  Copy Invite Link
                </span>
              </span>
            </a>
            <div v-if="user.invites.length < 1" class="text-white font-mono">
              You have no unused invite codes.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {parseInviteCodeFromRoute} from '../api/user'
import Button from '../components/elements/Button.vue'
import Error from '../components/elements/Error.vue'
import WithArrow from '../components/elements/WithArrow.vue'
import Input from '../components/form/Input.vue'
import Header from '../components/layout/Header.vue'
import {activateInviteCode as apiActivateCode} from '../api/user'
import {useRouter} from "vue-router";
import {user} from "../store";
import {addTimedAlert, Alert} from "../store/Alert";

export default defineComponent({
  components: {Header, Error, WithArrow, Input, Button},
  middleware: 'requiredAuth',
  setup() {
    const router = useRouter()

    const form = reactive({
      code: parseInviteCodeFromRoute(router.currentRoute),
      error: '',
    })

    const v = useVuelidate(
      {
        code: {
          required: required,
        },
      },
      form
    )

    const activateInviteCode = async () => {
      v.value.$touch()
      if (v.value.$error) return

      try {
        const {data} = await apiActivateCode(form)

        if (!data.success)
          return (form.error =
            data.error.message ?? 'An unexpected error has occurred.')

        addTimedAlert(new Alert('Invite redeemed successfully'), 1000)

        router.push('/')
      } catch (_) {
        form.error = 'An unexpected error has occurred.'
      }
    }

    const copyLink = async (code: string, kind = 'invite') => {
      const link = `${window.location.origin}/${kind}?invite=${code}`
      addTimedAlert(new Alert('Link copied'), 1000)
      try {
        await navigator.clipboard.writeText(link)
      } catch (e) {
        console.log('[client] error while copying link', {e})
      }
      return link
    }

    return {
      user,
      form,
      v,
      activateInviteCode,
      copyLink,
    }
  },
})
</script>
