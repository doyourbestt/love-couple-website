import { useEffect, useState } from 'react';
import { Clock, Heart, RefreshCw, Camera } from 'lucide-react';
import { useUserStore } from '../store/userStore';

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function differenceInDays(end: Date, start: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function differenceInHours(end: Date, start: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
}

function differenceInMinutes(end: Date, start: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
}

function differenceInSeconds(end: Date, start: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

function getNextAnniversaryDate(dateStr: string): Date {
  const today = new Date();
  const target = parseLocalDate(dateStr);
  const next = new Date(today.getFullYear(), target.getMonth(), target.getDate());
  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return next;
}

// 飘动的爱心组件
function FloatingHearts() {
  const hearts = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 10 + Math.random() * 10;
        const size = 16 + Math.random() * 24;
        return (
          <div
            key={i}
            className="absolute text-pink-300/60"
            style={{
              left: `${left}%`,
              bottom: '-40px',
              fontSize: `${size}px`,
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          >
            {['💕', '💖', '🌸', '✨', '💗'][i % 5]}
          </div>
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const randomMemories = [
  { text: '第一次见面时，你穿了一件白色的裙子', emoji: '👗' },
  { text: '一起淋雨跑回家，虽然感冒了但超开心', emoji: '🌧️' },
  { text: '你做的第一顿饭，盐放多了但我觉得很好吃', emoji: '🍳' },
  { text: '一起看日出的那个清晨，世界好像只有我们', emoji: '🌅' },
  { text: '你偷偷准备的惊喜，让我差点哭了', emoji: '🎂' },
  { text: '雨天窝在沙发上看电影，你靠着我睡着了', emoji: '🎬' },
  { text: '第一次牵手的瞬间，心跳快得像要跳出来', emoji: '🤝' },
  { text: '遇见你，好像捡到了120斤的运气', emoji: '💝' },
];

interface HomeProps {
  onScrollToTimeline: () => void;
}

export default function Home({ onScrollToTimeline }: HomeProps) {
  const { partnerName, startDate } = useUserStore();
  const [daysTogether, setDaysTogether] = useState(0);
  const [memory, setMemory] = useState(randomMemories[0]);
  const [memoryKey, setMemoryKey] = useState(0);

  const nextAnniversary = getNextAnniversaryDate(startDate);

  // 在一起天数
  useEffect(() => {
    const update = () => {
      setDaysTogether(Math.max(0, differenceInDays(new Date(), parseLocalDate(startDate))));
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [startDate]);

  // 实时倒计时
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCountdown({
        days: differenceInDays(nextAnniversary, now),
        hours: differenceInHours(nextAnniversary, now) % 24,
        minutes: differenceInMinutes(nextAnniversary, now) % 60,
        seconds: differenceInSeconds(nextAnniversary, now) % 60,
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  const refreshMemory = () => {
    let next;
    do {
      next = randomMemories[Math.floor(Math.random() * randomMemories.length)];
    } while (next.text === memory.text && randomMemories.length > 1);
    setMemory(next);
    setMemoryKey((k) => k + 1);
  };

  const annivDate = parseLocalDate(startDate);
  const annivText = `${annivDate.getMonth() + 1}·${annivDate.getDate()}`;

  return (
    <div className="relative overflow-hidden">
      <FloatingHearts />

      {/* Hero 区 */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="relative z-10 text-center animate-fadeInUp">
          <div
            className="text-6xl mb-6 inline-block"
            style={{ animation: 'heartbeat 2s ease-in-out infinite' }}
          >
            💕
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {partnerName || '彤彤 ❤️ 苏木'}
          </h1>
          <p className="text-xl md:text-2xl text-rose-500 mb-2 font-light">属于我们的甜蜜时光</p>
          <p className="text-lg text-pink-500 mb-8">
            已经在一起 <span className="font-bold text-2xl">{daysTogether}</span> 天 💕
          </p>

          {/* 倒计时卡片 */}
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg shadow-pink-200/40 border border-pink-100 mb-12">
            <p className="text-gray-500 text-sm mb-3">距离下一个纪念日</p>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-rose-500">{countdown.days}</span>
                <p className="text-xs text-gray-500 mt-1">天</p>
              </div>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-rose-500">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <p className="text-xs text-gray-500 mt-1">时</p>
              </div>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-rose-500">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <p className="text-xs text-gray-500 mt-1">分</p>
              </div>
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-rose-500">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <p className="text-xs text-gray-500 mt-1">秒</p>
              </div>
            </div>
            <p className="text-sm text-rose-400 mt-3">
              💝 恋爱纪念日 {annivText}
            </p>
          </div>

          {/* 快速入口 */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onScrollToTimeline}
              className="px-6 py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full font-medium shadow-lg shadow-rose-300/40 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              回顾时光
            </button>
            <a
              href="#memories"
              className="px-6 py-3 bg-white/80 text-rose-500 rounded-full font-medium shadow-lg shadow-pink-200/30 hover:shadow-xl hover:-translate-y-0.5 transition-all border border-pink-100 flex items-center gap-2 no-underline"
            >
              <Camera className="w-5 h-5" />
              珍藏回忆
            </a>
          </div>
        </div>
      </section>

      {/* 随机回忆 */}
      <section id="memories" className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-pink-100 text-center">
          <p className="text-sm text-gray-500 mb-3">✨ 随机回忆</p>
          <div
            key={memoryKey}
            className="animate-fadeInUp"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="text-2xl mr-2">{memory.emoji}</span>
              {memory.text}
            </p>
          </div>
          <button
            onClick={refreshMemory}
            className="mt-4 px-4 py-2 text-sm text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5 mx-auto rounded-full hover:bg-pink-50"
          >
            <RefreshCw className="w-4 h-4" />
            换一个回忆
          </button>
        </div>
      </section>

      {/* 底部装饰 */}
      <div className="relative z-10 text-center py-8 text-gray-400 text-sm">
        <p>用爱记录每一个瞬间 💕</p>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.15); }
          20%, 40% { transform: scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}