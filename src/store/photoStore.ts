import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PhotoItem } from '../types';

interface PhotoState {
  photos: PhotoItem[];
  currentIndex: number;
  addPhoto: (src: string) => void;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, data: Partial<PhotoItem>) => void;
  reorderPhotos: (photos: PhotoItem[]) => void;
  setCurrentIndex: (index: number) => void;
  clearAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 默认照片数据 - 用 jsDelivr CDN 加速（国内手机访问稳定）
const defaultPhotos: PhotoItem[] = [
  {
    id: '3',
    src: 'https://cdn.jsdelivr.net/gh/doyourbestt/love-photos@main/b1b54b3c7c84d76147ddb66038073445.jpg',
    caption: '我偏无理取闹，除非先生抱抱。',
    createdAt: 1788429226204,
    edited: true,
  },
  {
    id: '4',
    src: 'https://cdn.jsdelivr.net/gh/doyourbestt/love-photos@main/e5b915a9bf1a359fe68b3117cff2bc8a.jpg',
    caption: '遇见你，就好像捡到了120斤运气',
    createdAt: 1788342826204,
  },
];

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: defaultPhotos,
      currentIndex: 0,
      addPhoto: (src) =>
        set((state) => ({
          photos: [
            ...state.photos,
            {
              id: generateId(),
              src,
              createdAt: Date.now(),
            },
          ],
        })),
      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
          currentIndex: Math.min(
            state.currentIndex,
            state.photos.length - 2
          ),
        })),
      updatePhoto: (id, data) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      reorderPhotos: (photos) => set({ photos }),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      clearAll: () => set({ photos: [], currentIndex: 0 }),
    }),
    {
      name: 'love-photo-storage',
    }
  )
);