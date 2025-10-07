<script setup>
import Container from '@/components/layout/Container.vue'
import { useRole } from '@/composables/useRole'
const { role, isAdmin, setRole } = useRole()
</script>

<template>
  <div class="min-h-screen w-full bg-bg text-text">
    <header class="sticky top-0 z-50 w-full max-auto ">

        <slot name="header" />

    </header>

    <main>
      <Container>
        <slot />
      </Container>
    </main>

    <footer class="mt-12 border-t border-brand/10">
      <Container>
        <div class="py-6 flex items-center justify-between text-sm text-text/70 gap-4">
      <div>© SwimRunIF 2025</div>

      <!-- dev-only role switcher -->
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

      </Container>
    </footer>
  </div>
</template>
