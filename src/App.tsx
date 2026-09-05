import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { BottomNav } from './components/common/BottomNav';
import WishPage from './pages/WishPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentTab, setCurrentTab] = useState('home');

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage />;
      case 'gallery':
        return <GalleryPage />;
      case 'wish':
        return <WishPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
      {/* 全局左上角悬浮设置按钮（任何页面都可见） */}
      <button
        onClick={() => setCurrentTab('settings')}
        className={`fixed left-3 top-3 z-[60] flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition-all active:scale-95 ${
          currentTab === 'settings'
            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-pink-300'
            : 'bg-white/90 text-pink-500 ring-1 ring-pink-200 hover:bg-white'
        }`}
        title="设置"
      >
        <Settings size={14} />
        设置
      </button>

      {renderPage()}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;