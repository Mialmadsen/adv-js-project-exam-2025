<template>
  <!-- === Outer Container === -->
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-on-brand-text/70 backdrop-blur-[2px] shadow-md rounded-md p-8 w-full max-w-md">

      <!-- === LOGIN SECTION === -->
      <h2 class="text-3xl font-title font-bold text-center text-accent mb-8">Sign in</h2>
      <form @submit.prevent="loginUser" class="space-y-4">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-text/10 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="w-full p-3 border border-text/10 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
        />
        <BaseButton
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-accent via-teal to-cyan text-on-brand-text  font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50"
        >
          Sign in
        </BaseButton>
      </form>

      <!-- === INFO TEXT === -->
      <p class="text-center text-sm text-text/50 mt-8">
        Don't have a profile yet?
        <span class="font-semibold text-accent">Sign up here below!</span>
      </p>

      <div class="border-t border-text/10 my-8"></div>

      <!-- === REGISTER SECTION === -->
      <h2 class="text-3xl font-title font-bold text-center text-[var(--color-accent)] mb-8">Sign up</h2>
      <form @submit.prevent="registerUser" class="space-y-4">
        <input
          type="email"
          v-model="regEmail"
          placeholder="Email"
          required
          class="w-full p-3 border border-text/10 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
        />
        <input
          type="password"
          v-model="regPassword"
          placeholder="Password"
          required
          class="w-full p-3 border border-text/10 rounded-md focus:ring-2 focus:ring-accent  focus:outline-none"
        />
        <BaseButton
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-accent via-teal to-cyan text-on-brand-text font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50"
        >
          Sign up
        </BaseButton>
      </form>

      <!-- === ERROR AND STATUS MESSAGES === -->
      <div v-if="authError" class="mt-6 text-center text-danger font-semibold">
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
const route  = useRoute()

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


