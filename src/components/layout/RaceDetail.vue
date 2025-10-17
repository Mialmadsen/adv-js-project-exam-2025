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
    <header class="rounded-md overflow-hidden  ring-1 ring-teal">
      <div class="h-56 sm:h-72 w-full">
        <img
          v-if="race.heroImage"
          :src="race.heroImage"
          :alt="race.title"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full" :style="{ background: 'var(--color-gradient)' }"></div>
      </div>

      <div class="p-6 sm:p-8 bg-bg">
        <h1 class="font-title text-3xl sm:text-4xl text-accent">
          {{ race.title }}
        </h1>
        <p class="mt-2 font-body text-text">
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
  class="bg-teal/30 rounded-md text-neutral-600  backdrop-blur-[1px] border border-teal-400/10 shadow-xsm"
>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6
           divide-y sm:divide-y-0 sm:divide-x divide-teal/50"
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

    <FactCard v-if="race.limits?.participantLimit"
              label="Participants limit"
              :value="race.limits.participantLimit">
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
    <section v-if="race.courseOutline?.length" class="rounded-md bg-bg p-6  ring-1 ring-teal">
      <h2 class="font-title text-2xl text-accent mb-4">Course outline</h2>
      <ol class="list-decimal pl-5 space-y-1 font-body text-text">
        <li v-for="(line, i) in race.courseOutline" :key="i">{{ line }}</li>
      </ol>
    </section>

    <!-- Equipment -->
    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-md bg-bg p-6  ring-1 ring-teal">
        <h3 class="font-title text-2xl text-accent mb-3">Mandatory equipment</h3>
        <ul class="list-disc pl-5 space-y-1 font-body text-text">
          <li v-for="(item, i) in race.equipmentMandatory" :key="'m'+i">{{ item }}</li>
        </ul>
      </div>
      <div class="rounded-md bg-bg p-6  ring-1 ring-teal">
        <h3 class="font-title text-2xl text-accent mb-3">Recommended</h3>
        <ul class="list-disc pl-5 space-y-1 font-body text-text">
          <li v-for="(item, i) in race.equipmentRecommended" :key="'r'+i">{{ item }}</li>
        </ul>
        <p v-if="race.equipmentPermittedNote" class="mt-3 text-sm text-text/70">
          {{ race.equipmentPermittedNote }}
        </p>
      </div>
    </section>
    <section class="grid gap-6 lg:grid-cols-2">
       <div class="rounded-md bg-bg p-6  ring-1 ring-teal">
        <h3 class="font-title text-2xl text-accent mb-3">Registration Fee</h3>
        <p class="font-title text-brand text-4xl">DKK {{ race.price }}</p>

      </div>
     <div class="rounded-md bg-bg p-6  ring-1 ring-teal">
      <h3 class="font-title text-2xl text-accent mb-3">Fee covers:</h3>
       <ul class="list-disc pl-5 space-y-1 font-body text-text">
          <li v-for="(item, i) in race.perks" :key="'r'+i">{{ item }}</li>
        </ul>
        <p v-if="race.participantsNote" class="mt-3 text-sm text-text/70">
          {{ race.participantsNote }}
        </p>
     </div>


    </section>

    <!-- Map (optional) -->
    <section v-if="race.mapImage" class="rounded-md overflow-hidden  ring-1 ring-teal">
      <img :src="race.mapImage" alt="Course map" class="w-full h-auto" />
    </section>
  </article>
  <div class="mt-6 flex flex-wrap items-center justify-between ">
  <RouterLink :to="{ name: 'register', params: { raceId: race.id } }">
    <BaseButton variant="solid" size="lg">Register</BaseButton>
  </RouterLink>

  <!-- NEW: go to Participants  -->
  <RouterLink :to="{ name: 'participants', query: { race: race.id } }" aria-label="View participants">
    <BaseButton variant="outline" size="lg">Participants</BaseButton>
  </RouterLink>


</div>
</template>
