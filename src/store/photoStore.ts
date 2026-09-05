import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PhotoItem } from '../types';

interface PhotoState {
  photos: PhotoItem[];
  currentIndex: number;
  addPhoto: (src: string) => void;
  removePhoto: (id: string) => void;
  reorderPhotos: (photos: PhotoItem[]) => void;
  setCurrentIndex: (index: number) => void;
  updatePhoto: (id: string, updates: Partial<PhotoItem>) => void;
  clearAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 彤彤和苏木 CP 主题 - 一句话配一张图
const defaultPhotos: PhotoItem[] = [
  {
    id: '1',
    src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20couple%20holding%20hands%20walking%20on%20a%20sunny%20street%2C%20soft%20pastel%20colors%2C%20romantic%20and%20warm%20atmosphere%2C%20cherry%20blossoms%20blowing%20in%20the%20wind%2C%20anime%20illustration%20style&image_size=landscape_4_3',
    createdAt: Date.now(),
    caption: '今天和苏木一起去逛了街，阳光很好，你的笑容更好看。',
  },
  {
    id: '2',
    src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20couple%20sharing%20a%20dessert%20in%20a%20cozy%20cafe%2C%20warm%20lighting%2C%20pastel%20color%20palette%2C%20romantic%20mood%2C%20anime%20style%20illustration&image_size=landscape_4_3',
    createdAt: Date.now() - 86400000,
    caption: '咖啡店里的小时光，只要和彤彤在一起，哪里都是甜的。',
  },
  {
    id: '3',
    src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20couple%20watching%20sunset%20together%20by%20the%20sea%2C%20golden%20sky%2C%20peaceful%20ocean%2C%20silhouettes%2C%20romantic%20anime%20illustration&image_size=landscape_4_3',
    createdAt: Date.now() - 172800000,
    caption: '海边的日落，想和你一起看一万次。',
  },
  {
    id: '4',
    src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20couple%20under%20a%20starry%20night%20sky%2C%20fireflies%20glowing%2C%20dreamy%20atmosphere%2C%20romantic%20and%20fantasy%2C%20pastel%20colors%2C%20anime%20style&image_size=landscape_4_3',
    createdAt: Date.now() - 259200000,
    caption: '今晚的星星都亮了，因为你在身旁。',
  },
];

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set) => ({
      photos: defaultPhotos,
      currentIndex: 0,
      addPhoto: (src, caption = '') =>
        set((state) => ({
          photos: [
            ...state.photos,
            {
              id: generateId(),
              src,
              caption,
              createdAt: Date.now(),
            },
          ],
        })),
      removePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
          currentIndex: Math.min(
            state.currentIndex,
            Math.max(0, state.photos.length - 2)
          ),
        })),
      reorderPhotos: (photos) => set({ photos }),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      updatePhoto: (id, updates) =>
        set((state) => ({
          photos: state.photos.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      clearAll: () => set({ photos: [], currentIndex: 0 }),
    }),
    {
      name: 'love-photo-storage',
    }
  )
);
