<script setup>
// --- Import Container layout component ---
import Container from '@/components/layout/SiteContainer.vue'
</script>

<template>
  <div class="bg-bg text-text min-h-screen w-full">
    <!-- === Header Slot (for navigation/header content) === -->
    <header class="max-auto sticky top-0 z-50 w-full">
      <slot name="header" />
    </header>

    <!-- === Main Content Slot (page content) === -->
    <main>
      <Container>
        <slot />
      </Container>
    </main>

    <!-- === Footer with copyright and dev-only role switcher === -->
    <footer class="border-brand/10 mt-12 border-t">
      <Container>
        <div class="text-text/70 flex items-center justify-between gap-4 py-6 text-sm">
          <!-- Copyright -->
          <div>© SwimRunIF 2025</div>
        </div>
      </Container>
    </footer>
  </div>
</template>
