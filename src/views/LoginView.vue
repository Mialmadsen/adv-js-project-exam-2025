<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg)] font-body">
    <div class="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
      <!-- LOGIN -->
      <h2 class="text-3xl font-title font-bold text-center text-[var(--color-accent)] mb-8">Login</h2>

      <form @submit.prevent="loginUser" class="space-y-4">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
        />
        <BaseButton
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-teal)] to-[var(--color-cyan)] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          Login
        </BaseButton>
      </form>

      <!-- INFO TEKST -->
      <p class="text-center text-sm text-gray-700 mt-8">
        Don't have a profile yet?
        <span class="font-semibold text-[var(--color-accent)]"> Register here below!</span>
      </p>

      <div class="border-t border-gray-300 my-8"></div>

      <!-- REGISTER -->
      <h2 class="text-3xl font-title font-bold text-center text-[var(--color-accent)] mb-8">Register</h2>

      <form @submit.prevent="registerUser" class="space-y-4">
        <input
          type="email"
          v-model="regEmail"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
        />
        <input
          type="password"
          v-model="regPassword"
          placeholder="Password"
          required
          class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
        />
        <BaseButton
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-teal)] to-[var(--color-cyan)] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          Register
        </BaseButton>
      </form>

      <!-- ERROR OG STATUS -->
      <div v-if="authError" class="mt-6 text-center text-[var(--color-danger)] font-semibold">
        {{ authError }}
      </div>

      <div v-if="isLoggedIn" class="mt-6 text-center text-sm text-gray-700">
        Logged in as: 
        <span class="font-semibold text-[var(--color-brand)]">{{ currentUser?.email }}</span>
      </div>
    </div>
  </div>
</template>



<script setup>

import { ref } from 'vue'
import {useAuth} from '../modules/useAuth'
import BaseButton from '@/components/BaseButton.vue'

const { login,register, authError, loading, isLoggedIn, currentUser } = useAuth()

const email = ref('')
const password = ref('')
const regEmail = ref('')
const regPassword = ref('')

const loginUser = () => {
  login(email.value, password.value)
}

const registerUser = () => {
  register(regEmail.value, regPassword.value)
}

</script>

<style>
.login-view {
  max-width: 400px;
  margin: 20px auto;
}

.error {
  color: red;
  margin-top: 16px;
}

</style>
