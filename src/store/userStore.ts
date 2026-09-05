import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserConfig } from '../types';

interface UserState extends UserConfig {
  isFirstVisit: boolean;
  devMode: boolean; // 开发者模式开关
  setPartnerName: (name: string) => void;
  setStartDate: (date: string) => void;
  setAvatar: (avatar: string) => void;
  toggleDevMode: () => void;
  setDevMode: (v: boolean) => void;
  completeFirstVisit: () => void;
  reset: () => void;
}

const defaultState: UserConfig & {
  isFirstVisit: boolean;
  devMode: boolean;
} = {
  partnerName: '彤彤 ❤️ 苏木',
  startDate: '2026-09-03',
  avatar: undefined,
  isFirstVisit: true,
  devMode: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...defaultState,
      setPartnerName: (name) => set({ partnerName: name }),
      setStartDate: (date) => set({ startDate: date }),
      setAvatar: (avatar) => set({ avatar }),
      toggleDevMode: () => set((s) => ({ devMode: !s.devMode })),
      setDevMode: (v) => set({ devMode: v }),
      completeFirstVisit: () => set({ isFirstVisit: false }),
      reset: () => set(defaultState),
    }),
    {
      name: 'love-user-storage',
    }
  )
);