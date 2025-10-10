<script setup>
import Container from '@/components/layout/Container.vue'
import { useRole } from '@/composables/useRole'

const { role, setRole } = useRole()

// Dev-only flag
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="min-h-screen w-full bg-bg text-text">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full max-auto">
      <slot name="header" />
    </header>

    <!-- Main content -->
    <main>
      <Container>
        <slot />
      </Container>
    </main>

    <!-- Footer -->
    <footer class="mt-12 border-t border-brand/10">
      <Container>
        <div class="py-6 flex items-center justify-between text-sm text-text/70 gap-4">
          <div>© SwimRunIF 2025</div>

          <!-- Dev-only role switcher -->
          <div v-if="isDev">
            <label class="inline-flex items-center gap-2">
              <span class="font-body">Role:</span>
              <select
                class="rounded-md border border-brand/30 bg-white/80 px-2 py-1 text-text"
                :value="role"
                @change="setRole($event.target.value)"
              >
                <option value="guest">Guest</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

        </div>
      </Container>
    </footer>
  </div>
</template>

<style scoped>
/* Optional styling */
</style>
