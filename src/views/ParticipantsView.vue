<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useParticipants } from "@/composables/useParticipants";
import { useRole } from "@/composables/useRole";
import { buildParticipantsStats } from "@/utils/participantsStats";
import {
  downloadParticipantsCsv,
  downloadParticipantsJson,
} from "@/utils/exporters";

import BaseButton from "@/components/BaseButton.vue";
import BackButton from "@/components/BackButton.vue";
import ParticipantsTable from "@/components/admin/ParticipantsTable.vue";
import ParticipantDetailsModal from "@/components/admin/ParticipantDetailsModal.vue";
import ParticipantsStats from "@/components/admin/ParticipantsStats.vue";

// read ?race=hard|light
const route = useRoute();
const router = useRouter();
const race = computed(() => {
  const r = String(route.query.race || "").toLowerCase();
  return r === "hard" || r === "light" ? r : undefined;
});

// data + role
const { participants, loading } = useParticipants(race);
const { isAdmin } = useRole();

// title + pills
const title = computed(() =>
  race.value ? `Start list — ${race.value.toUpperCase()}` : "Start list — All"
);
function go(r) {
  router.replace({ name: route.name, query: r ? { race: r } : {} });
}
const pillVariant = (r) =>
  (!r && !race.value) || race.value === r ? "solid" : "outline";

// admin: stats + exports
const stats = computed(() => buildParticipantsStats(participants.value));
function exportCSV() {
  downloadParticipantsCsv(participants.value, {
    admin: isAdmin.value,
    race: race.value,
  });
}
function exportJSON() {
  downloadParticipantsJson(participants.value, { race: race.value });
}

// modal (admin)
const modalOpen = ref(false);
const selected = ref(null);
function handleSelect(p) {
  if (!isAdmin.value) return;
  selected.value = p;
  modalOpen.value = true;
}

// small helper if you want first name in public table
function firstName(name) {
  return (name || "").trim().split(/\s+/)[0] || "";
}
</script>

<template>
  <section class="p-4 sm:p-6">
    <header class="mb-4 sm:mb-6">
      <h1 class="text-2xl font-semibold text-accent">{{ title }}</h1>

      <!-- race filter pills + (admin) actions -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <BaseButton :variant="pillVariant(undefined)" size="sm" @click="go()">All</BaseButton>
        <BaseButton :variant="pillVariant('hard')" size="sm" @click="go('hard')">HARD</BaseButton>
        <BaseButton :variant="pillVariant('light')" size="sm" @click="go('light')">LIGHT</BaseButton>

        <div v-if="isAdmin" class="ml-auto flex gap-2">
          <BaseButton variant="outline" size="sm" @click="exportJSON">Download JSON</BaseButton>
          <BaseButton variant="outline" size="sm" @click="exportCSV">Download CSV</BaseButton>
        </div>
      </div>

      <!-- admin stats -->
     <ParticipantsStats v-if="isAdmin" :stats="stats" />
     </header>

    <!-- states -->
    <div v-if="loading" class="text-text/70">Loading…</div>
    <div v-else-if="!participants.length" class="text-text/70">No registrations yet.</div>

    <!-- table (visible for both public and admin) -->
    <div v-else class="overflow-x-auto admin-card">
      <ParticipantsTable
        :participants="participants"
        :admin="isAdmin"
        :firstNameFn="firstName"
        @select="handleSelect"
      />
    </div>

    <!-- back -->
    <BackButton href="/" :autoBack="false" class="mt-4" />

    <!-- admin modal -->
    <ParticipantDetailsModal
      :open="modalOpen"
      :participant="selected"
      @close="modalOpen = false"
    />
  </section>
</template>
