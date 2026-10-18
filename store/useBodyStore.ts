import { create } from 'zustand';
import { SECTIONS, type Mode } from '@/data/sections';

interface BodyState {
  progress: number; // 0..1 по всей странице
  activeIndex: number; // текущая секция
  mode: Mode;
  setProgress: (p: number) => void;
  setMode: (m: Mode) => void;
}

export const useBodyStore = create<BodyState>((set) => ({
  progress: 0,
  activeIndex: 0,
  mode: 'organs',
  setProgress: (p) => {
    const progress = Math.min(1, Math.max(0, p));
    const activeIndex = Math.round(progress * (SECTIONS.length - 1));
    set({ progress, activeIndex });
  },
  setMode: (mode) => set({ mode }),
}));
