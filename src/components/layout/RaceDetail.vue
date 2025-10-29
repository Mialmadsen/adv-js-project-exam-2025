<script setup>
import BaseButton from '@/components/BaseButton.vue'
import FactCard from '@/components/layout/FactCard.vue'

const { race } = defineProps({
  race: { type: Object, required: true },
})
</script>

<template>
  <article class="space-y-8">
    <!-- Hero -->
    <header class="ring-teal overflow-hidden rounded-md ring-1">
      <div class="h-56 w-full sm:h-72">
        <img
          v-if="race.imageUrl"
          :src="race.imageUrl"
          :alt="race.title"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full" :style="{ background: 'var(--color-gradient)' }"></div>
      </div>

      <div class="bg-bg p-6 sm:p-8">
        <h1 class="font-title text-accent text-3xl sm:text-4xl">
          {{ race.title }}
        </h1>
        <p class="font-body text-text mt-2">
          {{ race.blurb }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <RouterLink :to="{ name: 'register', params: { raceId: race.id } }">
            <BaseButton variant="solid" size="lg">Register</BaseButton>
          </RouterLink>
          <span class="font-body text-text/60">
            {{ race.locationCity }} • {{ race.date }} • {{ race.startTime }}
          </span>
        </div>
      </div>
    </header>

    <!-- Facts bar -->
    <section
      class="bg-teal/30 shadow-xsm rounded-md border border-teal-400/10 text-neutral-600 backdrop-blur-[1px]"
    >
      <div
        class="divide-teal/50 grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-3 xl:grid-cols-6"
      >
        <FactCard label="Total distance" :value="race.lengthKm + ' km'">
          <template #icon>
            <i class="fa-solid fa-person-swimming text-on-brand-text"></i>
          </template>
        </FactCard>

        <FactCard label="Swimming" :value="race.swimKm + ' km'">
          <template #icon>
            <i class="fa-solid fa-water-ladder text-on-brand-text"></i>
          </template>
        </FactCard>

        <FactCard label="Running" :value="race.runKm + ' km'">
          <template #icon>
            <i class="fa-solid fa-person-running text-on-brand-text"></i>
          </template>
        </FactCard>

        <FactCard label="Time limit" :value="race.limits?.timeHours + ' h'">
          <template #icon>
            <i class="fa-solid fa-stopwatch text-on-brand-text"></i>
          </template>
        </FactCard>

        <FactCard
          v-if="race.limits?.participantLimit"
          label="Participants limit"
          :value="race.limits.participantLimit"
        >
          <template #icon>
            <i class="fa-solid fa-users text-on-brand-text"></i>
          </template>
        </FactCard>

        <FactCard label="Location" :value="race.locationName">
          <template #icon>
            <i class="fa-solid fa-location-dot text-on-brand-text"></i>
          </template>
        </FactCard>
      </div>
    </section>

    <!-- Course outline -->
    <section v-if="race.courseOutline?.length" class="bg-bg ring-teal rounded-md p-6 ring-1">
      <h2 class="font-title text-accent mb-4 text-2xl">Course outline</h2>
      <ol class="font-body text-text list-decimal space-y-1 pl-5">
        <li v-for="(line, i) in race.courseOutline" :key="i">{{ line }}</li>
      </ol>
    </section>

    <!-- Equipment -->
    <section class="grid gap-6 lg:grid-cols-2">
      <div class="bg-bg ring-teal rounded-md p-6 ring-1">
        <h3 class="font-title text-accent mb-3 text-2xl">Mandatory equipment</h3>
        <ul class="font-body text-text list-disc space-y-1 pl-5">
          <li v-for="(item, i) in race.equipmentMandatory" :key="'m' + i">{{ item }}</li>
        </ul>
      </div>
      <div class="bg-bg ring-teal rounded-md p-6 ring-1">
        <h3 class="font-title text-accent mb-3 text-2xl">Recommended</h3>
        <ul class="font-body text-text list-disc space-y-1 pl-5">
          <li v-for="(item, i) in race.equipmentRecommended" :key="'r' + i">{{ item }}</li>
        </ul>
        <p v-if="race.equipmentPermittedNote" class="text-text/70 mt-3 text-sm">
          {{ race.equipmentPermittedNote }}
        </p>
      </div>
    </section>
    <section class="grid gap-6 lg:grid-cols-2">
      <div class="bg-bg ring-teal rounded-md p-6 ring-1">
        <h3 class="font-title text-accent mb-3 text-2xl">Registration Fee</h3>
        <p class="font-title text-brand text-4xl">DKK {{ race.price }}</p>
      </div>
      <div class="bg-bg ring-teal rounded-md p-6 ring-1">
        <h3 class="font-title text-accent mb-3 text-2xl">Fee covers:</h3>
        <ul class="font-body text-text list-disc space-y-1 pl-5">
          <li v-for="(item, i) in race.perks" :key="'r' + i">{{ item }}</li>
        </ul>
        <p v-if="race.participantsNote" class="text-text/70 mt-3 text-sm">
          {{ race.participantsNote }}
        </p>
      </div>
    </section>

    <!-- Map (optional) -->
    <section v-if="race.mapImage" class="ring-teal overflow-hidden rounded-md ring-1">
      <img :src="race.mapImage" alt="Course map" class="h-auto w-full" />
    </section>
  </article>
  <div class="mt-6 flex flex-wrap items-center justify-between">
    <RouterLink :to="{ name: 'register', params: { raceId: race.id } }">
      <BaseButton variant="solid" size="lg">Register</BaseButton>
    </RouterLink>

    <!-- NEW: go to Participants  -->
    <RouterLink
      :to="{ name: 'participants', query: { race: race.id } }"
      aria-label="View participants"
    >
      <BaseButton variant="outline" size="lg">Participants</BaseButton>
    </RouterLink>
  </div>
</template>
