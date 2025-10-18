export function buildParticipantsStats(list) {
  const stats = {
    total: 0,
    byRace: { hard: 0, light: 0 },
    byGender: { Female: 0, Male: 0, Other: 0, Unknown: 0 },
    extras: { tshirt: 0, medal: 0 },
  };

  for (const p of list) {
    stats.total++;

    if (p.raceId === "hard") stats.byRace.hard++;
    else if (p.raceId === "light") stats.byRace.light++;

    const g = normalizeGender(p.gender);
    stats.byGender[g] = (stats.byGender[g] || 0) + 1;

    if (p.tshirt) stats.extras.tshirt++;
    if (p.medal)  stats.extras.medal++;
  }
  return stats;
}

function normalizeGender(g) {
  const s = (g || "").toLowerCase();
  if (s.startsWith("f")) return "Female";
  if (s.startsWith("m")) return "Male";
  if (s && s !== "female" && s !== "male") return "Other";
  return "Unknown";
}
