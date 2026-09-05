import React, { useState } from 'react';
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
      {renderPage()}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;
