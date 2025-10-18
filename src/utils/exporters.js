const esc = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toISO = (ts) => {
  if (!ts) return "";
  if (ts.toDate) return ts.toDate().toISOString();     // Firestore Timestamp
  if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
  if (ts instanceof Date) return ts.toISOString();
  return "";
};
const download = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};

// ===== Users =====
export function downloadUserCsv(user, regs) {
  if (!user) return;
  const rows = [];
  const list = (regs && regs.length ? regs : [null]);
  for (const r of list) {
    rows.push({
      uid: user.id,
      fullName: user.fullName || "",
      email: user.email || "",
      emailVerified: user.emailVerified ? "yes" : "no",
      age: user.age ?? "",
      gender: user.gender || "",
      nationality: user.nationality || "",
      size: user.shirtSize || "",
      raceTitle: r ? (r.raceTitle || r.raceId || "") : "",
      bib: r ? (r.bib ?? "") : "",
      regStatus: r ? (r.status || "") : "",
      regCreatedAt: r ? toISO(r.createdAt) : ""
    });
  }
  const cols = [
    "uid","fullName","email","emailVerified","age","gender","nationality",
    "size","raceTitle","bib","regStatus","regCreatedAt"
  ];
  const header = cols.join(",");
  const body = rows.map(row => cols.map(k => esc(row[k])).join(",")).join("\n");
  download(`${(user.fullName || user.email || "user").replace(/[^a-z0-9-_]+/gi,"_")}_${user.id}.csv`,
           new Blob([header+"\n"+body], { type: "text/csv;charset=utf-8;" }));
}

export function downloadUsersCsv(users) {
  const rows = (users || []).map(u => ({
    uid: u.id,
    fullName: u.fullName || "",
    email: u.email || "",
    emailVerified: u.emailVerified ? "yes" : "no",
    age: u.age ?? "",
    gender: u.gender || "",
    nationality: u.nationality || "",
    size: u.shirtSize || "",
    registrationsCount: u.registrationsCount ?? 0,
    createdAt: toISO(u.createdAt)
  }));
  const cols = [
    "uid","fullName","email","emailVerified","age","gender",
    "nationality","size","registrationsCount","createdAt"
  ];
  const header = cols.join(",");
  const body = rows.map(r => cols.map(k => esc(r[k])).join(",")).join("\n");
  download("users_export.csv", new Blob([header+"\n"+body], { type: "text/csv;charset=utf-8;" }));
}

export function downloadUsersJson(users) {
  const cleaned = (users || []).map(u => ({
    uid: u.id,
    fullName: u.fullName || null,
    email: u.email || null,
    emailVerified: !!u.emailVerified,
    age: u.age ?? null,
    gender: u.gender || null,
    nationality: u.nationality || null,
    size: u.shirtSize || "",
    registrationsCount: u.registrationsCount ?? 0,
    createdAt: toISO(u.createdAt) || null
  }));
  download("users_export.json",
    new Blob([JSON.stringify(cleaned, null, 2)], { type: "application/json" }));
}

// ===== Participants =====
export function downloadParticipantsCsv(participants, { admin = false, race } = {}) {
  const baseCols = [
    ["id","id"],["fullName","fullName"],["age","age"],["gender","gender"],
    ["nationality","nationality"],["bib","bib"],["raceId","raceId"],["createdAtISO","createdAt"]
  ];
  const adminCols = [
    ["email","email"],["total","total"],["shirtSize","shirtSize"],["tshirt","tshirt"],["medal","medal"]
  ];
  const cols = admin ? [...baseCols, ...adminCols] : baseCols;

  const rows = (participants || []).map(p => ({
    id: p.id,
    fullName: p.fullName || "",
    age: p.age ?? "",
    gender: p.gender || "",
    nationality: p.nationality || "",
    bib: p.bib ?? "",
    raceId: p.raceId || "",
    createdAtISO: toISO(p.createdAt) || "",
    email: p.email || "",
    total: p.total ?? "",
    shirtSize: p.shirtSize || "",
    tshirt: p.tshirt ? "yes" : "no",
    medal: p.medal ? "yes" : "no"
  }));

  const header = cols.map(([, label]) => label).join(",");
  const body = rows.map(r => cols.map(([k]) => esc(r[k])).join(",")).join("\n");
  download(`participants${race ? "-"+race : ""}.csv`,
    new Blob([header+"\n"+body], { type: "text/csv;charset=utf-8;" }));
}

export function downloadParticipantsJson(participants, { race } = {}) {
  const cleaned = (participants || []).map(p => ({
    id: p.id,
    fullName: p.fullName || null,
    age: p.age ?? null,
    gender: p.gender || null,
    nationality: p.nationality || null,
    bib: p.bib ?? null,
    raceId: p.raceId || null,
    createdAt: toISO(p.createdAt) || null,
    email: p.email || null,
    total: p.total ?? null,
    shirtSize: p.shirtSize || null,
    tshirt: !!p.tshirt,
    medal: !!p.medal
  }));
  download(`participants${race ? "-"+race : ""}.json`,
    new Blob([JSON.stringify(cleaned, null, 2)], { type: "application/json" }));
}
