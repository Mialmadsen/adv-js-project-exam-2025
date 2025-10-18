<script setup>
import { ref, onMounted } from 'vue'
import { useUsersList } from '@/composables/useUsersList'
import { useUserRegistrations } from '@/composables/useUserRegistrations'
import UsersTable from '@/components/admin/UsersTable.vue'
import UserDetailsModal from '@/components/admin/UserDetailsModal.vue'
import {
   downloadUsersCsv, downloadUsersJson
} from "@/utils/exporters";

import { useContact } from '@/composables/useContact'
import BaseButton from '@/components/BaseButton.vue'
import { useUserStats } from '@/composables/useUserStats'
import UserStatsModal from '@/components/admin/UserStatsModal.vue'



 const statsOpen = ref(false)
const statsData = ref(null)
const { buildStats } = useUserStats()

function openStats() {
  // compute from the array you render (sortedUsers)
 statsData.value = buildStats(sortedUsers.value || [])
statsOpen.value = true
}


const { contactUser } = useContact()
const {
  sortedUsers, loading, errorMsg, load,
  setSort, sortKey, sortDir
} = useUsersList()

function exportCsvAll()  { downloadUsersCsv(sortedUsers.value) }
function exportJsonAll() { downloadUsersJson(sortedUsers.value) }
const { registrations, loading: regsLoading, load: loadRegs } = useUserRegistrations()

const modalOpen = ref(false)
const selectedUser = ref(null)

onMounted(load)

function handleSort(key) { setSort(key) }

async function handleSelect(user) {
  selectedUser.value = user
  modalOpen.value = true
  await loadRegs(user.id)
}

</script>

<template>
  <div class="min-h-[60vh] px-4 sm:px-6">
    <h1 class="font-title text-3xl text-accent mb-6">Users</h1>
     <div class="mb-3 flex flex-wrap gap-2 justify-end">
<BaseButton variant="solid" size="sm"   @click="exportCsvAll">
     Download CSV (all)
  </BaseButton>
 <BaseButton variant="solid" size="sm"
         @click="exportJsonAll">
   Download JSON (all)
  </BaseButton>
 </div>

    <UsersTable
      :users="sortedUsers"
      :loading="loading"
      :errorMsg="errorMsg"
      :sortKey="sortKey"
      :sortDir="sortDir"
      @sort="handleSort"
      @select="handleSelect"
    />

    <UserDetailsModal
      :open="modalOpen"
      :user="selectedUser"
      :registrations="registrations"
      :loadingRegs="regsLoading"
      @close="modalOpen = false"
      @contact="contactUser"
    />

    <BaseButton variant="outline" size="sm" class="mt-6"
      @click="openStats"
    >View statistics</BaseButton>

    <UserStatsModal
      :open="statsOpen"
      :stats="statsData"
      @close="statsOpen = false"
    />
  </div>
</template>
