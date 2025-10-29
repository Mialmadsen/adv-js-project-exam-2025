<script setup>
import { ref, computed } from 'vue'
import logoUrl from '@/assets/Logo.svg'
import MenuDropdown from '@/components/MenuDropdown.vue'
import { useRole } from '@/composables/useRole'
import { useAuth } from '@/modules/useAuth'
import { useUserProfile } from '@/composables/useUserProfile'
import { useRouter } from 'vue-router'
const router = useRouter()

/* mobile nav toggle */
const menuOpen = ref(false)

/* role-based header bits */
const { isUser, isAdmin } = useRole()
const { currentUser, logout } = useAuth()
const { profile } = useUserProfile()
const isAuthed = computed(() => isUser.value || isAdmin.value)

// Prefer Admin label → Firestore fullName → Firebase displayName → email name → fallback
const displayName = computed(() => {
  if (isAdmin.value) return 'Admin'
  return (
    profile.value?.fullName ??
    currentUser.value?.displayName ??
    currentUser.value?.email?.split('@')[0] ??
    'Athlete'
  )
})

const initial = computed(() => (displayName.value?.[0] || 'U').toUpperCase())

function firstName(name) {
  return (name || '').trim().split(' ')[0] || ''
}

async function handleSignOut() {
  try {
    await logout()
  } finally {
    // close menus etc. here if needed
    router.replace({ path: '/' }) // or { name: "home" }
  }
}
</script>

<template>
  <!-- outer padding so the rounded bar doesn’t touch edges -->
  <div class="w-full p-2">
    <!-- the rounded header bar -->
    <div class="bg-teal/30 shadow-xsm rounded-md border border-teal-400/10 backdrop-blur-[2px]">
      <div class="flex items-center justify-between px-4 py-3 sm:px-6">
        <!-- Logo / Brand -->
        <RouterLink to="/">
          <img :src="logoUrl" alt="SwimRunIF logo" class="h-12 w-12" />
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="font-body text-text hidden items-center gap-8 text-lg font-medium md:flex">
          <!-- Races: word scrolls menu -->
          <MenuDropdown>
            <!-- trigger: word scrolls to #races, arrow toggles menu -->
            <template #trigger="{ toggle }">
              <div class="flex items-center gap-2">
                <RouterLink :to="{ path: '/', hash: '#races' }" class="hover:text-teal">
                  Races
                </RouterLink>
                <button
                  class="text-text/80 hover:text-text hover:bg-teal rounded-md p-1.5"
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
                class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-person-swimming"></i> SwimRun HARD
              </RouterLink>
              <RouterLink
                :to="{ name: 'race', params: { id: 'light' } }"
                class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-person-swimming"></i> SwimRun LIGHT
              </RouterLink>
            </template>
          </MenuDropdown>

          <!-- Runners dropdown -->
          <MenuDropdown>
            <!-- trigger -->
            <template #trigger="{ toggle }">
              <div class="flex items-center gap-2">
                <RouterLink :to="{ name: 'participants' }" class="hover:text-teal">
                  Participants
                </RouterLink>
                <button
                  class="text-text/80 hover:text-text hover:bg-teal rounded-md p-1.5"
                  @click="toggle"
                  aria-label="Open runners menu"
                  aria-haspopup="menu"
                >
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </template>

            <!-- panel items -->
            <template #default="{ close }">
              <RouterLink
                :to="{ name: 'participants', query: { race: 'hard' } }"
                class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-users"></i> HARD — Start list
              </RouterLink>

              <RouterLink
                :to="{ name: 'participants', query: { race: 'light' } }"
                class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                @click="close()"
              >
                <i class="fa-solid fa-users"></i> LIGHT — Start list
              </RouterLink>
            </template>
          </MenuDropdown>
        </nav>

        <!-- Right side -->
        <div class="text-text/80 hidden items-center gap-5 text-lg md:flex">
          <!-- GUEST: show login icon -->
          <template v-if="!isAuthed">
            <RouterLink to="/auth/login" aria-label="Account" class="hover:text-text">
              <i class="fa-solid fa-user text-text hover:text-teal text-lg"></i>
            </RouterLink>
          </template>

          <!-- AUThed: avatar + greeting + dropdown -->
          <template v-else>
            <MenuDropdown align="right">
              <!-- trigger -->
              <template #trigger="{ toggle }">
                <button
                  class="text-text flex items-center gap-2 rounded-md px-2 py-1"
                  @click="toggle"
                  aria-label="Open profile menu"
                >
                  <div
                    class="bg-teal/40 hover:bg-teal ring-teal text-text font-title flex h-8 w-8 items-center justify-center rounded-full ring-2"
                  >
                    {{ initial }}
                  </div>
                  <span class="font-body font-semibold">Hi, {{ firstName(displayName) }}</span>
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </template>

              <!-- menu -->
              <template #default="{ close }">
                <!-- If ADMIN: Dashboard -->
                <RouterLink
                  v-if="isAdmin"
                  to="/admin"
                  class="font-body hover:bg-bg block px-4 py-2.5 text-lg hover:rounded-md"
                  @click="close()"
                >
                  <i class="fa-solid fa-gauge-high text-text text-lg font-medium"></i> Dashboard
                </RouterLink>

                <!-- If USER: Profile -->
                <RouterLink
                  v-else
                  to="/profile"
                  class="font-body hover:bg-bg block px-4 py-2.5 text-lg hover:rounded-md"
                  @click="close()"
                >
                  <i class="fa-solid fa-passport text-text text-lg font-medium"></i> Profile
                </RouterLink>

                <button
                  class="font-body hover:bg-bg w-full px-4 py-2.5 text-left text-lg hover:rounded-md"
                  @click="
                    handleSignOut()
                    close()
                  "
                >
                  <i class="fa-solid fa-right-from-bracket"></i> Sign out
                </button>
              </template>
            </MenuDropdown>
          </template>

          <!-- checkout cart -->
          <RouterLink
            v-if="!isAdmin"
            to="/register/hard"
            aria-label="Register"
            class="hover:text-text"
          >
            <i class="fa-solid fa-cart-shopping text-text hover:text-teal text-lg"></i>
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <!-- Mobile: avatar + greeting (no chevron, no dropdown) -->
        <div v-if="isAuthed" class="text-text/90 flex items-center gap-2 md:hidden">
          <div
            class="bg-teal/40 ring-teal font-title grid h-8 w-8 place-items-center rounded-full ring-2"
          >
            {{ initial }}
          </div>
          <span class="text-lg font-semibold">Hi, {{ firstName(displayName) }}</span>
        </div>

        <button
          class="text-text rounded-md px-3 py-2 md:hidden"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <!-- burger -->
          <i v-if="!menuOpen" class="fa-solid fa-bars text-2xl"></i>

          <!-- close -->
          <i v-else class="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <!-- Mobile nav panel -->
      <div
        v-if="menuOpen"
        class="border-top border-teal font-body px-4 py-3 font-semibold sm:px-6 md:hidden"
      >
        <ul class="flex flex-col gap-3">
          <!-- Races group -->
          <li class="border-teal border-t-1">
            <RouterLink to="/" class="hover:text-text py-1" @click="menuOpen = false"
              >Races</RouterLink
            >
            <ul class="mt-1">
              <li>
                <RouterLink
                  :to="{ name: 'race', params: { id: 'hard' } }"
                  class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                  @click="menuOpen = false"
                >
                  <i class="fa-solid fa-person-swimming"></i> SwimRun HARD
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'race', params: { id: 'light' } }"
                  class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                  @click="menuOpen = false"
                >
                  <i class="fa-solid fa-person-swimming"></i> SwimRun LIGHT
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="border-teal border-t-1">
            <RouterLink to="/participants" class="hover:text-text py-1" @click="menuOpen = false"
              >Participants</RouterLink
            >
            <ul class="mt-1">
              <li>
                <RouterLink
                  :to="{ name: 'participants', query: { race: 'hard' } }"
                  class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                  @click="menuOpen = false"
                >
                  <i class="fa-solid fa-users"></i> HARD — Start list
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'participants', query: { race: 'light' } }"
                  class="font-body hover:bg-bg block px-4 py-2.5 hover:rounded-md"
                  @click="menuOpen = false"
                >
                  <i class="fa-solid fa-users"></i> LIGHT — Start list
                </RouterLink>
              </li>
            </ul>
          </li>

          <li v-if="!isAuthed" class="border-teal border-t-1">
            <RouterLink to="/auth/login" class="hover:text-text py-1" @click="menuOpen = false"
              >Sign in</RouterLink
            >
          </li>

          <li v-else class="border-teal border-t-1">
            <RouterLink
              v-if="isAdmin"
              to="/admin"
              class="font-body hover:bg-bg block py-2.5 hover:rounded-md"
              @click="menuOpen = false"
            >
              <i class="fa-solid fa-gauge-high"></i> Dashboard
            </RouterLink>

            <!-- If USER: Profile -->
            <RouterLink
              v-else
              to="/profile"
              class="font-body hover:bg-bg block hover:rounded-md"
              @click="menuOpen = false"
            >
              <i class="fa-solid fa-passport"></i> Profile
            </RouterLink>
          </li>

          <li v-if="isAuthed">
            <button
              class="hover:text-text py-2.5 text-left"
              @click="
                handleSignOut()
                menuOpen = false
              "
            >
              <i class="fa-solid fa-right-from-bracket"></i>

              Sign out
            </button>
          </li>
          <li v-if="isAuthed && !isAdmin">
            <RouterLink
              to="/register/hard"
              aria-label="Register"
              class="hover:text-text py-2.5"
              @click="menuOpen = false"
            >
              <i class="fa-solid fa-cart-shopping text-text hover:text-teal text-lg"></i>Checkout
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
