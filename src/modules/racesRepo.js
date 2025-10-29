import { db } from '@/modules/firebase'
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

export function watchRaces(callback) {
  // read races ordered by title; callback gets an array of { id, ...data }
  const q = query(collection(db, 'races'), orderBy('title', 'asc'))
  const stop = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(list)
  })
  return stop // call this to unsubscribe
}

export async function deleteRace(id) {
  await deleteDoc(doc(db, 'races', id))
}
