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

// 默认照片数据 - 彤彤和苏木主题（从导出的 JSON 导入）
const defaultPhotos: PhotoItem[] = [
  {
    id: '3',
    src: 'https://github.com/doyourbestt/love-photos/blob/main/3cf6dd6a897379afbe3a2d52152f6325.jpg?raw=true',
    caption: '喜欢是两手空空，是眼眶红红，是蠢蠢欲动。',
    createdAt: 1788429226204,
    edited: true,
  },
  {
    id: '4',
    src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=anime%20couple%20under%20a%20starry%20night%20sky%2C%20fireflies%20glowing%2C%20dreamy%20atmosphere%2C%20romantic%20and%20fantasy%2C%20pastel%20colors%2C%20anime%20style&image_size=landscape_4_3',
    caption: '今晚的星星都亮了，因为你在身旁。',
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