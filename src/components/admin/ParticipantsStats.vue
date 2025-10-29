<script setup>
defineProps({
  stats: {
    type: Object,
    required: true, // shape from buildParticipantsStats()
    // { total, byRace:{hard,light}, byGender:{Female,Male,Other,Unknown}, extras:{tshirt,medal} }
  },
})
</script>

<template>
  <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">Total</div>
      <div class="text-lg font-semibold">{{ stats.total }}</div>
    </div>

    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">HARD</div>
      <div class="text-lg font-semibold">{{ stats.byRace.hard }}</div>
    </div>

    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">LIGHT</div>
      <div class="text-lg font-semibold">{{ stats.byRace.light }}</div>
    </div>

    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">Female</div>
      <div class="text-lg font-semibold">{{ stats.byGender.Female }}</div>
    </div>

    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">Male</div>
      <div class="text-lg font-semibold">{{ stats.byGender.Male }}</div>
    </div>

    <div class="ring-accent/40 bg-accent/20 rounded-md p-2 text-sm ring backdrop-blur-[2px]">
      <div class="text-text/80">T-shirts / Medals</div>
      <div class="text-lg font-semibold">{{ stats.extras.tshirt }} / {{ stats.extras.medal }}</div>
    </div>
  </div>
</template>
