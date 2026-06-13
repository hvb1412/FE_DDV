import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const KEY = 'patient.prefs.v1';

export type PatientPrefs = {
  notif: { medication: boolean; appointment: boolean; message: boolean; tip: boolean; marketing: boolean };
  dnd: boolean; biometric: boolean; twoFA: boolean;
  fontIdx: number; language: 'vi' | 'en';
  premium: boolean;
  linked: { google: boolean; apple: boolean; facebook: boolean };
};

const DEFAULTS: PatientPrefs = {
  notif: { medication: true, appointment: true, message: true, tip: false, marketing: false },
  dnd: false, biometric: true, twoFA: false,
  fontIdx: 1, language: 'vi', premium: false,
  linked: { google: true, apple: false, facebook: false },
};

type State = {
  prefs: PatientPrefs;
  update: (patch: Partial<PatientPrefs>) => void;
};

const useStore = create<State>()(
  persist(
    (set, get) => ({
      prefs: DEFAULTS,
      update: (patch) => set({ prefs: { ...get().prefs, ...patch } }),
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ prefs: s.prefs }),
      merge: (persisted, current) => {
        const p = (persisted as { prefs?: Partial<PatientPrefs> })?.prefs;
        return { ...current, prefs: { ...DEFAULTS, ...(p || {}) } };
      },
    },
  ),
);

export function usePatientPrefs() {
  const prefs = useStore((s) => s.prefs);
  const update = useStore((s) => s.update);
  return { prefs, update };
}

export function applyFontSize(idx: number) {
  document.documentElement.style.fontSize = ['14px', '16px', '18px', '20px'][idx] ?? '16px';
}
