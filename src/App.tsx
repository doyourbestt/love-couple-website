import { useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'timeline' | 'settings'>('home');
  const timelineRef = useRef<HTMLElement | null>(null);

  const registerTimelineRef = (el: HTMLElement | null) => {
    timelineRef.current = el;
  };

  const scrollToTimeline = () => {
    if (currentTab !== 'timeline') {
      setCurrentTab('timeline');
      // 等动画完成后再滚动
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50">
      {/* 左上角设置按钮 */}
      <button
        onClick={() => setCurrentTab('settings')}
        className={`fixed left-3 top-3 z-40 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition-all active:scale-95 ${
          currentTab === 'settings'
            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-pink-300'
            : 'bg-white/90 text-pink-500 ring-1 ring-pink-200 hover:bg-white'
        }`}
        title="设置"
      >
        <Settings size={14} />
        设置
      </button>

      {/* 顶部 tab 切换 */}
      {currentTab !== 'settings' && (
        <div className="sticky top-0 z-30 flex justify-center gap-2 px-4 pt-4 pb-2 bg-gradient-to-b from-pink-50/95 via-rose-50/80 to-transparent backdrop-blur-sm">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentTab === 'home'
                ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                : 'bg-white/70 text-rose-500 hover:bg-white'
            }`}
          >
            🏠 首页
          </button>
          <button
            onClick={() => setCurrentTab('timeline')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentTab === 'timeline'
                ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                : 'bg-white/70 text-rose-500 hover:bg-white'
            }`}
          >
            ⏰ 时间轴
          </button>
        </div>
      )}

      {/* 页面内容 */}
      {currentTab === 'home' && <Home onScrollToTimeline={scrollToTimeline} />}
      {currentTab === 'timeline' && <Timeline registerScrollTarget={registerTimelineRef} />}
      {currentTab === 'settings' && <SettingsPage />}
    </div>
  );
}

export default App;