import { db } from "@/modules/firebase";
import { collection, query, where, orderBy, onSnapshot, } from "firebase/firestore";

const col = collection(db, "participants");

export function mapParticipant(id, data) {
  const extras = data.extras || {}; // tshirt/medal live here

  return {
    id,

    // public fields
    fullName: data.fullName || "",
    age: typeof data.age === "number" ? data.age : null,
    nationality: data.nationality || "",
    gender: data.gender || "",
    bib: typeof data.bib === "number" ? data.bib : null,
    raceId: data.raceId || "",

    // admin-only fields (we just carry them; UI won’t render them here)
    email: data.email || data.user || "",
    total: typeof data.total === "number" ? data.total : null,
    shirtSize: data.shirtSize || "",       // keep if this is stored at root
    tshirt: !!extras.tshirt,               // <— only from extras
    medal:  !!extras.medal,                // <— only from extras

    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
  };
}

export function watchParticipants(opts = {}, cb) {
  const clauses = [];
  if (opts.raceId) clauses.push(where("raceId", "==", opts.raceId));
  clauses.push(orderBy("createdAt", "desc"));
  const q = query(col, ...clauses);

  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => mapParticipant(d.id, d.data()));
    cb && cb(rows);
  });
}
