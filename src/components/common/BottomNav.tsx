import React from 'react';
import { Home, Images, Heart, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: '首页' },
  { id: 'gallery', icon: Images, label: '相册' },
  { id: 'wish', icon: Heart, label: '心愿' },
  { id: 'settings', icon: Settings, label: '设置' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-pink-200 bg-white shadow-[0_-8px_20px_rgba(244,114,182,0.15)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 min-w-[64px] ${
                isActive
                  ? 'text-pink-600 scale-105'
                  : 'text-gray-500 hover:text-pink-400 active:scale-95'
              }`}
            >
              <div
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-300'
                    : 'bg-pink-50'
                }`}
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-white' : 'text-pink-400'}
                />
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-pink-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
