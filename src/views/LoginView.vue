<template>
  <!-- === Outer Container === -->
  <div class="flex min-h-screen items-center justify-center">
    <div class="bg-on-brand-text/70 w-full max-w-md rounded-md p-8 shadow-md backdrop-blur-[2px]">
      <!-- === LOGIN SECTION === -->
      <h2 class="font-title text-accent mb-8 text-center text-3xl font-bold">Sign in</h2>
      <form @submit.prevent="loginUser" class="space-y-4">
        <input type="email" v-model="email" placeholder="Email" required class="ui-input" />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="ui-input"
        />
        <BaseButton type="submit" :disabled="loading"> Sign in </BaseButton>
      </form>

      <!-- === INFO TEXT === -->
      <p class="text-text/50 mt-8 text-center text-sm">
        Don't have a profile yet?
        <span class="text-accent font-semibold">Sign up here below!</span>
      </p>

      <div class="border-text/10 my-8 border-t"></div>

      <!-- === REGISTER SECTION === -->
      <h2 class="font-title mb-8 text-center text-3xl font-bold text-[var(--color-accent)]">
        Sign up
      </h2>
      <form @submit.prevent="registerUser" class="space-y-4">
        <input type="email" v-model="regEmail" placeholder="Email" required class="ui-input" />
        <input
          type="password"
          v-model="regPassword"
          placeholder="Password"
          required
          class="ui-input"
        />
        <BaseButton type="submit" :disabled="loading"> Sign up </BaseButton>
      </form>

      <!-- === ERROR AND STATUS MESSAGES === -->
      <div v-if="authError" class="text-danger mt-6 text-center font-semibold">
        {{ authError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/modules/useAuth'
import { useRole } from '@/composables/useRole'
import BaseButton from '@/components/BaseButton.vue'

const { login, register, authError, loading, isLoggedIn } = useAuth()
const { updateRole } = useRole()

const router = useRouter()
const route = useRoute()

// --- Form State ---
const email = ref('')
const password = ref('')
const regEmail = ref('')
const regPassword = ref('')

// go to ?redirect=... (if present) otherwise home
function goAfterAuth() {
  const target = (route.query.redirect && String(route.query.redirect)) || '/'
  router.push(target)
}

// --- Login Handler ---
const loginUser = async () => {
  await login(email.value, password.value)
  await updateRole()
  if (isLoggedIn.value) goAfterAuth()
}

// --- Register Handler ---
const registerUser = async () => {
  await register(regEmail.value, regPassword.value)
  await updateRole()
  if (isLoggedIn.value) goAfterAuth()
}

// If already signed in, don't stay on this page
watchEffect(() => {
  if (isLoggedIn.value) router.replace('/')
})
</script>
