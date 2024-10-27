import { create } from 'zustand'

// A list of typical household medications
const INITIAL_MEDICATIONS: ReadonlyArray<Medication> = [
  {
    name: 'Ibuprofen',
    indication: 'Pain relief, inflammation, fever',
    dosage: '200-400 mg every 4-6 hours as needed',
    usage: 'Take with food or milk to prevent stomach upset',
  },
  {
    name: 'Acetaminophen',
    indication: 'Pain relief, fever',
    dosage: '500-1000 mg every 4-6 hours as needed',
    usage: 'Do not exceed 4000 mg in 24 hours',
  },
  {
    name: 'Diphenhydramine',
    indication: 'Allergy relief, sleep aid',
    dosage: '25-50 mg every 4-6 hours as needed',
    usage: 'May cause drowsiness, avoid alcohol',
  },
  {
    name: 'Loperamide',
    indication: 'Diarrhea',
    dosage: '4 mg initially, then 2 mg after each loose stool',
    usage: 'Do not exceed 16 mg in 24 hours',
  },
  {
    name: 'Cetirizine',
    indication: 'Allergy relief',
    dosage: '10 mg once daily',
    usage: 'May cause drowsiness, avoid alcohol',
  },
  {
    name: 'Hydrocortisone cream',
    indication: 'Skin irritation, rash, itching',
    dosage: 'Apply a thin layer to affected area 1-4 times daily',
    usage: 'For external use only, avoid contact with eyes',
  },
  {
    name: 'Saline nasal spray',
    indication: 'Nasal congestion, dry nasal passages',
    dosage: 'Use as needed',
    usage: 'Spray into each nostril as needed for moisture',
  },
  {
    name: 'Calcium carbonate',
    indication: 'Heartburn, acid indigestion',
    dosage: 'Chew 2-4 tablets as needed',
    usage: 'Do not exceed 10 tablets in 24 hours',
  },
  {
    name: 'Neosporin',
    indication: 'Minor cuts, scrapes, burns',
    dosage: 'Apply a small amount to the affected area 1-3 times daily',
    usage: 'For external use only, cover with a bandage if needed',
  },
  {
    name: 'Cough syrup (Dextromethorphan)',
    indication: 'Cough relief',
    dosage: '10-20 mg every 4 hours as needed',
    usage: 'Do not exceed 120 mg in 24 hours',
  },
]

export type Medication = {
  name: string
  indication: string
  dosage: string
  usage: string
}

export const useMedicineCabinetStore = create<{
  medications: ReadonlyArray<Medication>
  addMedication: (medication: Medication) => void
}>((set) => ({
  medications: INITIAL_MEDICATIONS,
  addMedication: (medication) => set((state) => ({ medications: [...state.medications, medication] })),
}))
