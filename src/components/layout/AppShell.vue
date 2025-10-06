<script setup>
import Container from '@/components/layout/Container.vue'
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
        <div class="py-6 text-sm text-text/70">
          © SwimRunIF 2025
        </div>
      </Container>
    </footer>
  </div>
</template>
