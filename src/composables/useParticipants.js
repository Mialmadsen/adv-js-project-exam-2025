import { ref, isRef, watchEffect } from "vue";
import { watchParticipants } from "@/services/participantsRepo.js";

export function useParticipants(race /* can be 'hard' | 'light' | undefined OR a ref */) {
  const participants = ref([]);
  const loading = ref(true);
  const error = ref(null);
  let stop = null;

  const raceRef = isRef(race) ? race : ref(race);

  watchEffect((onCleanup) => {
    loading.value = true;
    error.value = null;

    if (stop) stop(); // cleanup old listener

    stop = watchParticipants(
      { raceId: raceRef.value },
      (rows) => {
        participants.value = rows;
        loading.value = false;
      }
    );

    onCleanup(() => stop && stop());
  });

  return { participants, loading, error };
}
