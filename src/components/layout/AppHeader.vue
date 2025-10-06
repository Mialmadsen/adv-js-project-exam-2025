<script setup>
import { ref } from 'vue'
import logoUrl from '@/assets/Logo.svg'

/* simple mobile toggle + fake auth (we’ll wire Firebase later) */
const menuOpen = ref(false)
const isAuthed  = ref(false)
</script>

<template>
  <!-- outer padding so the rounded bar doesn’t touch edges -->
  <div class="p-2 w-full">
    <!-- the rounded header bar -->
    <div
      class="rounded-md bg-teal/30  backdrop-blur shadow-xsm "
    >
      <div class="flex items-center justify-between px-4 sm:px-6 py-3">
        <!-- Logo / Brand -->
        <RouterLink to="/" >
          <img :src="logoUrl" alt="SwimRunIF logo" class="h-12 w-12" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-8 font-body text-lg text-text">
          <RouterLink to="/" class="hover:text-text">Races</RouterLink>
          <RouterLink to="/participants" class="hover:text-text">Runners</RouterLink>

          <RouterLink v-if="isAuthed" to="/profile" class="hover:text-text">My profile</RouterLink>
        </nav>

        <!-- Right icons (simple) -->
        <div class="hidden md:flex items-center gap-5 text-text/80">
          <!-- user icon -->
          <RouterLink to="/auth/login" aria-label="Account" class="hover:text-text">
              <i class="fa-solid fa-user text-2xl text-teal hover:text-text"></i>
          </RouterLink>
          <!-- cart icon (placeholder for future payments) -->
          <RouterLink to="/register/hard" aria-label="Register" class="hover:text-text">
            <i class="fa-solid fa-cart-shopping text-2xl text-teal hover:text-text"></i>
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden rounded-lg px-3 py-2 text-text/80 hover:text-text"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <!-- burger -->
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <!-- close -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile nav panel -->
      <div v-if="menuOpen" class="md:hidden border-t border-brand/10 px-4 sm:px-6 py-3 font-body">
        <div class="flex flex-col gap-3">
          <RouterLink to="/" class="py-1 hover:text-text">Home</RouterLink>
          <RouterLink to="/participants" class="py-1 hover:text-text">Runners</RouterLink>
          <RouterLink to="/auth/login" class="py-1 hover:text-text">Register or login</RouterLink>
          <RouterLink v-if="isAuthed" to="/profile" class="py-1 hover:text-text">My profile</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
