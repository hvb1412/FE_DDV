import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const KEY = 'patient.profile.v1';

export type PatientProfile = {
  fullName: string; username: string; email: string; phone: string;
  dob: string; gender: 'Nam' | 'Nữ' | 'Khác'; address: string; insurance: string;
  height: number; weight: number;
  conditions: string[]; allergies: string[]; medications: string[]; familyHistory: string[];
  records: { name: string; date: string; size: string }[];
  avatar: string | null;
  emergency: { name: string; phone: string; relation: string };
  achievements: string[];
};

const DEFAULTS: PatientProfile = {
  fullName: 'Nguyễn Văn Minh', username: 'minh.nguyen', email: 'minh.nguyen@example.com', phone: '0901 234 567',
  dob: '15/03/1990', gender: 'Nam', address: 'Quận 1, TP. Hồ Chí Minh', insurance: 'GD4012345678901',
  height: 170, weight: 63.5,
  conditions: ['Đái tháo đường type 2', 'Tăng huyết áp nhẹ'],
  allergies: ['Hải sản (tôm, cua)', 'Penicillin'],
  medications: ['Metformin 500mg — 2 viên/ngày', 'Amlodipine 5mg — 1 viên/sáng'],
  familyHistory: ['Bố: Đái tháo đường type 2', 'Ông nội: Tim mạch'],
  records: [
    { name: 'Kết quả XN tổng quát', date: '18/05/2026', size: '2.4 MB' },
    { name: 'Đơn thuốc tháng 5', date: '15/05/2026', size: '420 KB' },
    { name: 'Phiếu kết quả siêu âm', date: '02/05/2026', size: '1.8 MB' },
  ],
  avatar: null,
  emergency: { name: 'Nguyễn Thị Lan', phone: '0987 654 321', relation: 'Vợ' },
  achievements: ['streak-7', 'menu-3', 'first-meal'],
};

type State = {
  profile: PatientProfile;
  update: (patch: Partial<PatientProfile>) => void;
};

const useStore = create<State>()(
  persist(
    (set, get) => ({
      profile: DEFAULTS,
      update: (patch) => set({ profile: { ...get().profile, ...patch } }),
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ profile: s.profile }),
      merge: (persisted, current) => {
        const p = (persisted as { profile?: Partial<PatientProfile> })?.profile;
        return { ...current, profile: { ...DEFAULTS, ...(p || {}) } };
      },
    },
  ),
);

export function usePatientProfile() {
  const profile = useStore((s) => s.profile);
  const update = useStore((s) => s.update);
  return { profile, update };
}

export function calcBMI(h: number, w: number) { const m = h / 100; return m ? Math.round((w / (m * m)) * 10) / 10 : 0; }
export function calcAge(dob: string) {
  const [d, m, y] = dob.split('/').map(Number); if (!y) return 0;
  const now = new Date(); let age = now.getFullYear() - y;
  const mo = now.getMonth() + 1 - m; if (mo < 0 || (mo === 0 && now.getDate() < d)) age--;
  return age;
}
