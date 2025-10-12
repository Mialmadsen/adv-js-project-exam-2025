<script setup>
import { ref, computed } from 'vue'
import logoUrl from '@/assets/Logo.svg'
import MenuDropdown from '@/components/MenuDropdown.vue'
import { useRole } from '@/composables/useRole'

/* mobile nav toggle */
const menuOpen = ref(false)

/* role-based header bits */
const { isUser, isAdmin } = useRole()
const isAuthed = computed(() => isUser.value || isAdmin.value)
const displayName = computed(() => (isAdmin.value ? 'Admin' : 'Athlete')) // placeholder until real profile
const initial = computed(() => displayName.value?.[0] ?? 'U')

</script>

<template>
  <!-- outer padding so the rounded bar doesn’t touch edges -->
  <div class="p-2 w-full">
    <!-- the rounded header bar -->
    <div
      class="rounded-md bg-teal/30  backdrop-blur-[2px] shadow-xsm border border-teal-400/10" >
      <div class="flex items-center justify-between px-4 sm:px-6 py-3">
        <!-- Logo / Brand -->
        <RouterLink to="/" >
          <img :src="logoUrl" alt="SwimRunIF logo" class="h-12 w-12" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-8 font-body font-semibold text-lg text-text">

                            <!-- Races: word scrolls menu -->
            <MenuDropdown>
            <!-- trigger: word scrolls to #races, arrow toggles menu -->
            <template #trigger="{ toggle }">
              <div class="flex items-center gap-2">
                <RouterLink :to="{ path: '/', hash: '#races' }" class="hover:text-teal">
                  Races
                </RouterLink>
                <button
                  class="p-1.5 rounded-md text-text/80 hover:text-text hover:bg-teal"
                  @click="toggle"
                  aria-label="Open races menu"
                  aria-haspopup="menu"

                >
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </template>

            <!-- panel items (your styles + icons) -->
            <template #default="{ close }">
              <RouterLink
                :to="{ name: 'race', params: { id: 'hard' } }"
                class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-person-swimming"></i> SwimRun HARD
              </RouterLink>
              <RouterLink
                :to="{ name: 'race', params: { id: 'light' } }"
                class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-person-swimming"></i> SwimRun LIGHT
              </RouterLink>
            </template>
          </MenuDropdown>




          <RouterLink to="/participants" class="hover:text-text">Runners</RouterLink>


        </nav>

        <!-- Right icons -->
        <div class="hidden md:flex items-center gap-5 text-text/80">
            <!-- if NOT authed: show login -->
            <template v-if="!isAuthed">
              <RouterLink to="/auth/login" aria-label="Account" class="hover:text-text">
                <i class="fa-solid fa-user text-lg text-text hover:text-teal"></i>
              </RouterLink>
            </template>

  <!-- if authed: show avatar + greeting + button -->
          <template v-else>
  <MenuDropdown align="right">
    <!-- trigger button -->
    <template #trigger="{ toggle }">
      <div class="flex items-center gap-2 text-lg ">
          <div class="h-8 w-8 rounded-full bg-teal ring-2 ring-teal
                              flex items-center justify-center text-text  font-title">
                    {{ initial }}
                  </div>
                  <span class="font-body font-semibold">Hi, {{ displayName }}</span>
                <button
                  class="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-teal/40 text-text"
                  @click="toggle"
                  aria-label="Open profile menu"

                >


                  <i class="fa-solid fa-chevron-down"
                    ></i>
                </button>


      </div>

    </template>

    <!-- menu items -->
    <template  #default="{ close }" >
      <RouterLink
        to="/profile"
        class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md text-lg"
        @click="close()"
      >
        <i class="fa-solid fa-passport"></i> Profile
      </RouterLink>

      <button
        class="w-full text-left px-4 py-2.5 font-body hover:bg-bg hover:rounded-md text-lg"
        @click="setRole('guest'); close()"
      >
        <i class="fa-solid fa-right-from-bracket"></i> Log out
      </button>
    </template>
  </MenuDropdown>
</template>

  <!-- register cart -->
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
      <div v-if="menuOpen" class="md:hidden border-t border-teal px-4 sm:px-6 py-3 font-body font-semibold">
        <ul class="flex flex-col gap-3">
          <ul> <RouterLink to="/" class="py-1 hover:text-text">Rases</RouterLink>
          <li> <RouterLink
                    :to="{ name: 'race', params: { id: 'hard' } }"
                    class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"

                  ><i class="fa-solid fa-person-swimming"></i>
                    SwimRun HARD
                  </RouterLink></li>
          <li> <RouterLink
                    :to="{ name: 'race', params: { id: 'light' } }"
                    class="block px-4 py-2.5 font-body hover:bg-bg hover:rounded-md"

                  ><i class="fa-solid fa-person-swimming"></i>
                    SwimRun LIGHT
                  </RouterLink></li>
          </ul>

          <li><RouterLink to="/participants" class="py-1 hover:text-text">Runners</RouterLink></li>
          <li><RouterLink to="/auth/login" class="py-1 hover:text-text">Sign in</RouterLink></li>
          <li><RouterLink v-if="isAuthed" to="/profile" class="py-1 hover:text-text">My profile</RouterLink></li>




        </ul>
      </div>
    </div>
  </div>
</template>
