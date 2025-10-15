<script setup>
// --- Import Container layout component ---
import Container from '@/components/layout/Container.vue'


</script>

<template>
  <div class="min-h-screen w-full bg-bg text-text">
    <!-- === Header Slot (for navigation/header content) === -->
    <header class="sticky top-0 z-50 w-full max-auto">
      <slot name="header" />
    </header>

    <!-- === Main Content Slot (page content) === -->
    <main>
      <Container>
        <slot />
      </Container>
    </main>

    <!-- === Footer with copyright and dev-only role switcher === -->
    <footer class="mt-12 border-t border-brand/10">
      <Container>
        <div class="py-6 flex items-center justify-between text-sm text-text/70 gap-4">
          <!-- Copyright -->
          <div>© SwimRunIF 2025</div>
        </div>
      </Container>
    </footer>
  </div>
</template>


