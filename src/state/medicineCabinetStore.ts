import { create } from 'zustand'

// A list of typical household medications
const INITIAL_MEDICATIONS: ReadonlyArray<Medication> = [
  {
    name: 'Ibuprofen',
    strength: '200 mg',
    indication: 'Pain relief, inflammation, fever',
  },
  {
    name: 'Paracetamol',
    strength: '500 mg',
    indication: 'Pain relief, fever',
  },
  {
    name: 'Loperamide',
    strength: '2 mg',
    indication: 'Diarrhea',
  },
  {
    name: 'Aspirin',
    strength: '325 mg',
    indication: 'Pain relief, inflammation, fever, blood thinner',
  },
  {
    name: 'Diphenhydramine',
    strength: '25 mg',
    indication: 'Allergy relief, sleep aid',
  },
]

export type Medication = {
  name: string
  strength: string
  indication: string
}

export const useMedicineCabinetStore = create<{
  medications: ReadonlyArray<Medication>
  addMedication: (medication: Medication) => void
}>((set) => ({
  medications: INITIAL_MEDICATIONS,
  addMedication: (medication) => set((state) => ({ medications: [...state.medications, medication] })),
}))
