<script setup>
import { ref } from 'vue'
import logoUrl from '@/assets/Logo.svg'

/* simple mobile toggle + fake auth (we’ll wire Firebase later) */
const menuOpen = ref(false)
const isAuthed  = ref(false)
const racesOpen = ref(false)
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

                            <!-- Races: word scrolls to #races, arrow opens menu -->
              <div class="relative">
                <div class="flex items-center gap-2">
                  <!-- click the word to scroll to section on Home -->
                  <RouterLink :to="{ path: '/', hash: '#races' }" class="hover:text-teal">
                    Races
                  </RouterLink>

                  <!-- click the arrow to open the dropdown -->
                  <button
                    class="p-1.5 rounded-md text-text/80 hover:text-text hover:bg-teal"
                    @click="racesOpen = !racesOpen"
                    aria-label="Open races menu"
                    aria-haspopup="menu"
                    :aria-expanded="racesOpen"
                  >
                    <i class="fa-solid fa-chevron-down"></i>
                  </button>
                </div>

                <!-- dropdown -->
                <div
                  v-if="racesOpen"
                  class="absolute left-0 mt-4 w-56 rounded-md bg-teal shadow-lg"
                >
                  <RouterLink
                    :to="{ name: 'race', params: { id: 'hard' } }"
                    class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"
                    @click="racesOpen = false"
                  >
                    SwimRun HARD
                  </RouterLink>
                  <RouterLink
                    :to="{ name: 'race', params: { id: 'light' } }"
                    class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"
                    @click="racesOpen = false"
                  >
                    SwimRun LIGHT
                  </RouterLink>
                </div>
              </div>




          <RouterLink to="/participants" class="hover:text-text">Runners</RouterLink>

          <RouterLink v-if="isAuthed" to="/profile" class="hover:text-text">My profile</RouterLink>
        </nav>

        <!-- Right icons (simple) -->
        <div class="hidden md:flex items-center gap-5 text-text/80">
          <!-- user icon -->
          <RouterLink to="/auth/login" aria-label="Account" class="hover:text-text">
              <i class="fa-solid fa-user text-lg text-text hover:text-teal"></i>
          </RouterLink>
          <!-- cart icon (placeholder for future payments) -->
          <RouterLink to="/register/hard" aria-label="Register" class="hover:text-text">
            <i class="fa-solid fa-cart-shopping text-lg text-text hover:text-teal"></i>
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden rounded-md px-3 py-2 text-text"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <!-- burger -->
           <i v-if="!menuOpen" class="fa-solid fa-bars"></i>


          <!-- close -->
           <i v-else class="fa-solid fa-xmark"></i>

        </button>
      </div>

      <!-- Mobile nav panel -->
      <div v-if="menuOpen" class="md:hidden border-t border-teal px-4 sm:px-6 py-3 font-body">
        <div class="flex flex-col gap-3">
          <RouterLink to="/" class="py-1 hover:text-text">Rases</RouterLink>
          <RouterLink to="/participants" class="py-1 hover:text-text">Runners</RouterLink>
          <RouterLink to="/auth/login" class="py-1 hover:text-text">Sign in</RouterLink>
          <RouterLink v-if="isAuthed" to="/profile" class="py-1 hover:text-text">My profile</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
