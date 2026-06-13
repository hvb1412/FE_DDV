import { createElement, Fragment, useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
const KEY = 'app.theme';

const readMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const raw = localStorage.getItem(KEY);
  return raw === 'dark' || raw === 'light' || raw === 'system' ? raw : 'system';
};

const systemPrefers = (): 'dark' | 'light' =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyClass = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
};

type ThemeState = {
  mode: ThemeMode;
  systemDark: boolean;
  setMode: (m: ThemeMode) => void;
  setSystemDark: (b: boolean) => void;
  toggle: () => void;
};

const useThemeStore = create<ThemeState>((set, get) => ({
  mode: readMode(),
  systemDark: systemPrefers() === 'dark',
  setMode: (m) => {
    if (typeof window !== 'undefined') localStorage.setItem(KEY, m);
    set({ mode: m });
  },
  setSystemDark: (b) => set({ systemDark: b }),
  toggle: () => {
    const { mode, systemDark } = get();
    const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
    get().setMode(resolved === 'dark' ? 'light' : 'dark');
  },
}));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const systemDark = useThemeStore((s) => s.systemDark);
  const setSystemDark = useThemeStore((s) => s.setSystemDark);
  const resolved: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    applyClass(resolved);
  }, [resolved]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setSystemDark]);

  return createElement(Fragment, null, children);
}

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const systemDark = useThemeStore((s) => s.systemDark);
  const setMode = useThemeStore((s) => s.setMode);
  const toggle = useThemeStore((s) => s.toggle);
  const resolved: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  return { mode, resolved, setMode, toggle };
}
