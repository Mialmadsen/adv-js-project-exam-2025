// src/services/racesSeed.js
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/modules/firebase' // keep this path as in your project

const seedRaces = [
  {
    id: 'hard',
    title: 'SwimRun HARD',
    date: '2025-07-13',
    startTime: '10:00',
    locationCity: 'Ivano-Frankivsk',
    locationName: 'City lake (boat rental station)',
    lengthKm: 13,
    runKm: 10.8,
    swimKm: 2.25,
    price: 399,
    blurb: 'More swim, more fun 💪',
    isActive: true,
    limits: { timeHours: 3 },
    segments: { runStages: 4, swimStages: 3, longestRunKm: 3, longestSwimKm: 0.75 },
    courseOutline: [
      'Start → 3 km run',
      'Lap 1: 750 m swim → 2.6 km run',
      'Lap 2: 750 m swim → 2.6 km run',
      'Lap 3: 750 m swim → 2.6 km run',
      'Finish'
    ],
    participantsNote:
      '18+; must sign liability waiver; accident insurance required; able to swim 750 m.',
    equipmentMandatory: ['Swim cap (provided)', 'Swimming goggles', 'Running gear'],
    equipmentRecommended: ['Pull buoy', 'Swim paddles'],
    equipmentPermittedNote:
      'Mattresses, vests, buoys, fins, dry bags allowed if carried throughout; leaving gear = DQ.',
    perks: ['Finisher medal', 'T-shirt', 'Chip timing'],
  },
  {
    id: 'light',
    title: 'SwimRun LIGHT',
    date: '2025-07-13',
    startTime: '10:00',
    locationCity: 'Ivano-Frankivsk',
    locationName: 'City lake (boat rental station)',
    lengthKm: 10,
    runKm: 8.1,
    swimKm: 1.4,
    price: 299,
    blurb: 'Friendly & fast ⚡',
    isActive: true,
    limits: { timeHours: 2, participantLimit: 60 },
    segments: { runStages: 7, swimStages: 6, longestRunKm: 3, longestSwimKm: 0.35 },
    courseOutline: [
      'Start → 3 km run',
      'Lap 1: 350 m swim → 700 m run → 120 m swim → 1 km run',
      'Lap 2: 350 m swim → 700 m run → 120 m swim → 1 km run',
      'Lap 3: 350 m swim → 700 m run → 120 m swim → 1 km run',
      'Finish'
    ],
    participantsNote:
      '18+; must sign liability waiver; accident insurance required; able to swim 750 m.',
    equipmentMandatory: ['Swim cap (provided)', 'Swimming goggles', 'Running gear'],
    equipmentRecommended: ['Pull buoy', 'Swim paddles'],
    equipmentPermittedNote:
      'Mattresses, vests, buoys, fins, dry bags allowed if carried throughout; leaving gear = DQ.',
    perks: ['Finisher medal', 'Chip timing'],
  },
]

// call this once to write the docs
export async function seedRacesToFirestore() {
  for (const r of seedRaces) {
    await setDoc(
      doc(db, 'races', r.id),
      { ...r, updatedAt: serverTimestamp() },
      { merge: true } // safe to re-run
    )
  }
}
