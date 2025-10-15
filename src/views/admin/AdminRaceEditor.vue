<script setup>
import { onMounted } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRaceEditor } from '@/composables/UseRaceEditor'
import { useUnsaved } from '@/composables/useUnsaved'
import BackButton from '@/components/BackButton.vue'

const props = defineProps({ id: { type: String, default: null } })

// editor data/actions
const {
  form, loading, saving, errorMsg,
  isEdit, pageTitle,
  lists,
  load, save, cancel
} = useRaceEditor(props.id)

// minimal unsaved tracking (after user finishes a field)
const { markDirty, isDirty, anyDirty, blurOnEnter } = useUnsaved()

onMounted(load)
</script>

<template>
  <div class="p-6 space-y-6">
    <header class="flex items-center gap-3 justify-between">
      <h1 class="font-title text-3xl text-accent">{{ pageTitle }}</h1>

      <div class="ml-auto flex items-center gap-4">
        <!-- tiny badge only when something was edited -->
        <span
          v-if="anyDirty"

          class="rounded-md text-danger px-3 py-1 text-xs font-title "
        >
           Unsaved changes
        </span>

        <div class="flex gap-3">
          <BaseButton variant="solid" size="sm" @click="cancel">Cancel</BaseButton>
          <BaseButton :disabled="saving" variant="solid" size="sm" @click="save">
            {{ saving ? 'Saving…' : 'Save' }}
          </BaseButton>
        </div>
      </div>
    </header>

    <div v-if="loading" class="admin-card text-text/70">Loading…</div>

    <div v-else class="grid gap-6 md:grid-cols-3">
      <!-- Left column -->
      <section class="admin-card space-y-4 md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isEdit">
            <label class="ui-label">ID</label>
            <input
              v-model="form.id"
              class="ui-input"
              placeholder="e.g., hard"
              @keydown="blurOnEnter"
              @change="markDirty('id')"
              :class="isDirty('id') ? 'bg-accent/10 border-accent/50' : ''"
            />
            <p class="ui-hint">Lowercase, URL-safe; used as Firestore doc id.</p>
          </div>

          <div>
            <label class="ui-label">Title</label>
            <input
              v-model="form.title"
              class="ui-input"
              placeholder="SwimRun HARD"
              @keydown="blurOnEnter"
              @change="markDirty('title')"
              :class="isDirty('title') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>

          <div>
            <label class="ui-label">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('date')"
              :class="isDirty('date') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>

          <div>
            <label class="ui-label">Start time</label>
            <input
              v-model="form.startTime"
              type="time"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('startTime')"
              :class="isDirty('startTime') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>

          <div>
            <label class="ui-label">City</label>
            <input
              v-model="form.locationCity"
              class="ui-input"
              placeholder="Ivano-Frankivsk"
              @keydown="blurOnEnter"
              @change="markDirty('locationCity')"
              :class="isDirty('locationCity') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>

          <div>
            <label class="ui-label">Location name</label>
            <input
              v-model="form.locationName"
              class="ui-input"
              placeholder="City lake"
              @keydown="blurOnEnter"
              @change="markDirty('locationName')"
              :class="isDirty('locationName') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>

          <div>
            <label class="ui-label">Active</label>
            <div class="flex items-center gap-3">
              <input
                id="isActive"
                v-model="form.isActive"
                type="checkbox"
                class="h-4 w-4"
                @change="markDirty('isActive')"
                :class="isDirty('isActive') ? 'border-accent/50 ring-0' : ''"
              />
              <label for="isActive" class="font-body text-text/80">Visible & open</label>
            </div>
          </div>
        </div>

        <div>
          <label class="ui-label">Blurb</label>
          <textarea
            v-model="form.blurb"
            rows="3"
            class="ui-input"
            placeholder="More swim, more fun 💪"
            @keydown="blurOnEnter"
            @change="markDirty('blurb')"
            :class="isDirty('blurb') ? 'bg-accent/10 border-accent/50' : ''"
          ></textarea>
        </div>
      </section>

      <!-- Right: quick numbers -->
      <section class="admin-card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="ui-label">Total length (km)</label>
            <input
              v-model.number="form.lengthKm"
              type="number"
              step="0.1"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('lengthKm')"
              :class="isDirty('lengthKm') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
          <div>
            <label class="ui-label">Run (km)</label>
            <input
              v-model.number="form.runKm"
              type="number"
              step="0.1"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('runKm')"
              :class="isDirty('runKm') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
          <div>
            <label class="ui-label">Swim (km)</label>
            <input
              v-model.number="form.swimKm"
              type="number"
              step="0.01"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('swimKm')"
              :class="isDirty('swimKm') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
          <div>
            <label class="ui-label">Price</label>
            <input
              v-model.number="form.price"
              type="number"
              step="1"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('price')"
              :class="isDirty('price') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="ui-label">Time limit (h)</label>
            <input
              v-model.number="form.limits.timeHours"
              type="number"
              step="0.5"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('limits.timeHours')"
              :class="isDirty('limits.timeHours') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
          <div>
            <label class="ui-label">Participants limit</label>
            <input
              v-model.number="form.limits.participantLimit"
              type="number"
              step="1"
              class="ui-input"
              @keydown="blurOnEnter"
              @change="markDirty('limits.participantLimit')"
              :class="isDirty('limits.participantLimit') ? 'bg-accent/10 border-accent/50' : ''"
            />
          </div>
        </div>
      </section>

      <!-- Arrays / Repeaters -->
      <section class="admin-card space-y-5 md:col-span-3">
        <h2 class="font-title text-xl text-brand">Course outline</h2>
        <div class="space-y-3">
          <div v-for="(_, idx) in form.courseOutline" :key="'co-'+idx" class="flex gap-2 flex-col sm:flex-row">
            <input
              v-model="form.courseOutline[idx]"
              class="ui-input flex-1"
              :placeholder="`Step ${idx+1}`"
              @keydown="blurOnEnter"
              @change="markDirty(`courseOutline.${idx}`)"
              :class="isDirty(`courseOutline.${idx}`) ? 'bg-accent/10 border-accent/50' : ''"
            />
            <BaseButton variant="outline" size="sm" @click="lists.courseOutline.remove(idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="lists.courseOutline.add()">+ Add step</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Equipment — Mandatory</h2>
        <div class="space-y-3">
          <div v-for="(_, idx) in form.equipmentMandatory" :key="'em-'+idx" class="flex gap-2 flex-col sm:flex-row">
            <input
              v-model="form.equipmentMandatory[idx]"
              class="ui-input flex-1"
              placeholder="e.g., Swim cap (provided)"
              @keydown="blurOnEnter"
              @change="markDirty(`equipmentMandatory.${idx}`)"
              :class="isDirty(`equipmentMandatory.${idx}`) ? 'bg-accent/10 border-accent/50' : ''"
            />
            <BaseButton variant="outline" size="sm" @click="lists.equipmentMandatory.remove(idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="lists.equipmentMandatory.add()">+ Add item</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Equipment — Recommended</h2>
        <div class="space-y-3">
          <div v-for="(_, idx) in form.equipmentRecommended" :key="'er-'+idx" class="flex gap-2 flex-col sm:flex-row">
            <input
              v-model="form.equipmentRecommended[idx]"
              class="ui-input flex-1"
              placeholder="e.g., Pull buoy"
              @keydown="blurOnEnter"
              @change="markDirty(`equipmentRecommended.${idx}`)"
              :class="isDirty(`equipmentRecommended.${idx}`) ? 'bg-accent/10 border-accent/50' : ''"
            />
            <BaseButton variant="outline" size="sm" @click="lists.equipmentRecommended.remove(idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="lists.equipmentRecommended.add()">+ Add item</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Perks</h2>
        <div class="space-y-3">
          <div v-for="(_, idx) in form.perks" :key="'pk-'+idx" class="flex gap-2 flex-col sm:flex-row">
            <input
              v-model="form.perks[idx]"
              class="ui-input flex-1"
              placeholder="e.g., Finisher medal"
              @keydown="blurOnEnter"
              @change="markDirty(`perks.${idx}`)"
              :class="isDirty(`perks.${idx}`) ? 'bg-accent/10 border-accent/50' : ''"
            />
            <BaseButton variant="outline" size="sm" @click="lists.perks.remove(idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="lists.perks.add()">+ Add perk</BaseButton>
        </div>
      </section>

      <!-- Notes -->
      <section class="admin-card space-y-4 md:col-span-3">
        <div>
          <label class="ui-label">Equipment permitted note</label>
          <textarea
            v-model="form.equipmentPermittedNote"
            rows="3"
            class="ui-input"
            placeholder="Mattresses, vests, buoys, fins, dry bags allowed if carried throughout; leaving gear = DQ."
            @keydown="blurOnEnter"
            @change="markDirty('equipmentPermittedNote')"
            :class="isDirty('equipmentPermittedNote') ? 'bg-accent/10 border-accent/50' : ''"
          ></textarea>
        </div>
        <div>
          <label class="ui-label">Participants note</label>
          <textarea
            v-model="form.participantsNote"
            rows="3"
            class="ui-input"
            placeholder="You are 18+ and able to swim 750m…"
            @keydown="blurOnEnter"
            @change="markDirty('participantsNote')"
            :class="isDirty('participantsNote') ? 'bg-accent/10 border-accent/50' : ''"
          ></textarea>
        </div>
      </section>
    </div>

    <div class="flex items-center gap-3 justify-between">
       <BackButton size="sm" />


      <div class="ml-auto flex items-center gap-4 ">
        <!-- tiny badge only when something was edited -->
        <span
          v-if="anyDirty"

          class="rounded-md text-danger px-3 py-1 text-xs font-title "
        >
           Unsaved changes
        </span>

        <div class="flex gap-3">
          <BaseButton variant="solid" size="sm" @click="cancel">Cancel</BaseButton>
          <BaseButton :disabled="saving" variant="solid" size="sm" @click="save">
            {{ saving ? 'Saving…' : 'Save' }}
          </BaseButton>
        </div>
      </div>
    </div>


    <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>
  </div>
</template>
