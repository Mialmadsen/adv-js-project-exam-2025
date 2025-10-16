<template>
    <!-- Centered thank you card layout -->
    <div class="min-h-screen flex items-center justify-center p-8">
      <div class="bg-white shadow-lg rounded-md p-8 w-full max-w-lg text-center">
        <!-- Heading -->
        <h2 class="text-3xl font-title font-bold text-accent mb-6">
          Thank you for registering!
        </h2>
  
        <!-- If registration data exists, show registration details -->
        <div v-if="registration">
          <p class="text-lg mb-4">
            You are registered for <strong>{{ registration.raceTitle }}</strong> 🎉
          </p>
  
          <p class="text-lg mb-2">
            Total: <strong>{{ registration.total }} DKK</strong>
          </p>
  
          <p class="text-lg mb-2">
            Your race bib number:
          </p>
          <p class="text-4xl font-bold text-brand mt-2">
            {{ registration.bib }}
          </p>
  
          <p class="text-sm text-text/60 mt-6">
            Registered as: {{ registration.user }}
          </p>
  
          <!-- Button to go to homepage -->
          <BaseButton class="mt-8" @click="goHome">Homepage</BaseButton>
        </div>
  
        <!-- If no registration data, show fallback message -->
        <div v-else>
          <p>No registration found.</p>
          <BaseButton class="mt-4" @click="goHome">Go back</BaseButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // --- Imports: Vue, router, and UI components ---
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseButton from '@/components/BaseButton.vue'
  
  // --- Router instance for navigation ---
  const router = useRouter()
  
  // --- Reactive state for registration data ---
  const registration = ref(null)
  
  // --- On mount, load registration data from sessionStorage ---
  onMounted(() => {
    const data = sessionStorage.getItem('registration')
    if (data) registration.value = JSON.parse(data)
  })
  
  // --- Navigate to homepage ---
  function goHome() {
    router.push('/')
  }
  </script>
