<template>
    <!-- if user is logged in -->
    <BaseButton
      v-if="isLoggedIn"
      @click="handleLogout"
      class="auth-btn bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-teal)] to-[var(--color-cyan)] text-white font-semibold rounded-xl px-4 py-2 hover:opacity-90 transition"
    >
      Logout
    </BaseButton>
  
    <!-- if user is not logged in -->
    <router-link v-else class="authbtn" to="/login">Login</router-link>
  </template>

<script setup>
import { useAuth } from '../modules/useAuth'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'

const { isLoggedIn, logout } = useAuth()
const router = useRouter()

const handleLogout = () => {
  logout(router)
}


</script>

<style>

</style>