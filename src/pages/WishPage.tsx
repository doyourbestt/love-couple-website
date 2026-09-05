import React from 'react';
import { Heart, Plus } from 'lucide-react';

const WishPage: React.FC = () => {
  const wishes = [
    { id: 1, text: '一起去看海', done: false },
    { id: 2, text: '做一顿饭给你吃', done: true },
    { id: 3, text: '去迪士尼看烟花', done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white pb-28">
      <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 px-4 pb-6 pt-8">
        <h1 className="text-center text-2xl font-bold text-white drop-shadow-md">
          心愿单
        </h1>
        <p className="mt-2 text-center text-sm text-white/90">
          一起想做的事 · 一起完成
        </p>
      </div>

      <div className="-mt-3 px-4 space-y-3">
        {wishes.map((w) => (
          <div
            key={w.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md shadow-pink-100"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                w.done
                  ? 'bg-gradient-to-br from-rose-400 to-pink-500'
                  : 'bg-pink-50'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  w.done ? 'fill-white text-white' : 'text-pink-400'
                }`}
              />
            </div>
            <span
              className={`flex-1 text-sm font-medium ${
                w.done ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              {w.text}
            </span>
          </div>
        ))}

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-300 py-4 text-sm text-pink-500 transition-colors hover:bg-pink-50">
          <Plus size={18} />
          添加新心愿
        </button>
      </div>
    </div>
  );
};

export default WishPage;
