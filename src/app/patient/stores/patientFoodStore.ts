import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const FAV_KEY = 'patient.food.favorites';
const DIARY_KEY = 'patient.food.diary';

export type DiaryEntry = {
  id: string;
  foodId: number;
  name: string;
  emoji: string;
  meal: string;
  qty: number;
  per: string;
  kcal: number;
  protein: number;
  carb: number;
  fat: number;
  date: string;
  createdAt: number;
};

type FavState = {
  favs: number[];
  toggle: (id: number) => void;
};

const useFavStore = create<FavState>()(
  persist(
    (set, get) => ({
      favs: [],
      toggle: (id) => {
        const cur = get().favs;
        set({ favs: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
      },
    }),
    { name: FAV_KEY, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ favs: s.favs }) },
  ),
);

type DiaryState = {
  entries: DiaryEntry[];
  add: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
};

const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (entry) =>
        set({
          entries: [
            ...get().entries,
            { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() },
          ],
        }),
      remove: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),
    }),
    { name: DIARY_KEY, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ entries: s.entries }) },
  ),
);

export const useFavorites = () => {
  const favs = useFavStore((s) => s.favs);
  const toggle = useFavStore((s) => s.toggle);
  const has = (id: number) => favs.includes(id);
  return { favs, toggle, has };
};

export const useDiary = () => {
  const entries = useDiaryStore((s) => s.entries);
  const add = useDiaryStore((s) => s.add);
  const remove = useDiaryStore((s) => s.remove);
  return { entries, add, remove };
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
