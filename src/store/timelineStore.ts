import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimelineEvent {
  id: string;
  title: string;
  eventDate: string;
  description: string;
  icon: string;
  image: string;
}

interface TimelineState {
  events: TimelineEvent[];
  addEvent: (e: Omit<TimelineEvent, 'id'>) => void;
  updateEvent: (id: string, data: Partial<TimelineEvent>) => void;
  removeEvent: (id: string) => void;
  clearAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 默认时间轴 - 彤彤和苏木的故事
const defaultEvents: TimelineEvent[] = [
  {
    id: '1',
    title: '初次相遇',
    eventDate: '2026-08-23',
    description: '第一次见到你的时候，整个世界好像都亮了起来。那一刻，我就知道你是对的人。',
    icon: '💕',
    image: 'https://cdn.jsdelivr.net/gh/doyourbestt/love-photos@main/b1b54b3c7c84d76147ddb66038073445.jpg',
  },
  {
    id: '2',
    title: '在一起',
    eventDate: '2026-09-03',
    description: '从今天起，你是我的女孩，我是你的先生。往后余生，请多指教。',
    icon: '💍',
    image: 'https://cdn.jsdelivr.net/gh/doyourbestt/love-photos@main/e5b915a9bf1a359fe68b3117cff2bc8a.jpg',
  },
];

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      events: defaultEvents,
      addEvent: (e) =>
        set((state) => ({
          events: [
            ...state.events,
            { ...e, id: generateId() },
          ].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()),
        })),
      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        })),
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      clearAll: () => set({ events: [] }),
    }),
    {
      name: 'love-timeline-storage',
    }
  )
);