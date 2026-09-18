import { useEffect, useState } from 'react';
import { Heart, RefreshCw, Camera, BookOpen } from 'lucide-react';
import { useUserStore } from '../store/userStore';

// 飘动的爱心
function FloatingHearts() {
  const symbols = ['💕', '💖', '💗', '🌸', '✨', '💝'];
  const hearts = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 12 + Math.random() * 8;
        const size = 18 + Math.random() * 18;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              bottom: '-40px',
              fontSize: `${size}px`,
              opacity: 0.5,
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          >
            {symbols[i % symbols.length]}
          </div>
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function differenceInDays(end: Date, start: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function differenceInHours(end: Date, start: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
}

function differenceInMinutes(end: Date, start: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60)));
}

function differenceInSeconds(end: Date, start: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

function getNextAnniversaryDate(dateStr: string): Date {
  const today = new Date();
  const target = parseLocalDate(dateStr);
  const next = new Date(today.getFullYear(), target.getMonth(), target.getDate());
  if (next.getTime() <= today.getTime()) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return next;
}

const randomMemories = [
  { text: '还记得第一次见面时，你穿了一件白色的裙子', emoji: '👗' },
  { text: '那次一起淋雨跑回家，虽然感冒了但超开心', emoji: '🌧️' },
  { text: '你做的第一顿饭，盐放多了但我觉得很好吃', emoji: '🍳' },
  { text: '一起看日出的那个清晨，世界好像只有我们', emoji: '🌅' },
  { text: '你偷偷准备的生日惊喜，我差点哭了', emoji: '🎂' },
  { text: '雨天窝在沙发上看电影，你靠着我肩膀睡着了', emoji: '🎬' },
  { text: '第一次牵手的瞬间，心跳快得像要跳出来', emoji: '🤝' },
  { text: '你写的那封手写信，我到现在还保存着', emoji: '💌' },
];

interface HomeProps {
  onScrollToTimeline: () => void;
}

export default function Home({ onScrollToTimeline }: HomeProps) {
  const { partnerName, startDate } = useUserStore();
  const [daysTogether, setDaysTogether] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [memory, setMemory] = useState(randomMemories[0]);
  const [memoryKey, setMemoryKey] = useState(0);

  // 在一起天数
  useEffect(() => {
    const update = () => setDaysTogether(differenceInDays(new Date(), parseLocalDate(startDate)));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [startDate]);

  // 实时倒计时
  useEffect(() => {
    const next = getNextAnniversaryDate(startDate);
    const update = () => {
      const now = new Date();
      setCountdown({
        days: differenceInDays(next, now),
        hours: differenceInHours(next, now) % 24,
        minutes: differenceInMinutes(next, now) % 60,
        seconds: differenceInSeconds(next, now) % 60,
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
      <section className="relative min-h-[78vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* 心跳 emoji */}
          <div className="text-7xl mb-6 inline-block animate-heart-beat">💕</div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-coral via-pink-soft to-purple-light bg-clip-text text-transparent mb-3 leading-tight">
            {partnerName || '心系小琪 ❤️ 我系小琪'}
          </h1>
          <p className="text-base md:text-lg text-rose-gold mb-2 font-light">属于我们的甜蜜时光</p>
          <p className="text-base md:text-lg text-coral mb-10">
            已经在一起 <span className="font-bold text-2xl mx-1">{daysTogether}</span> 天 💕
          </p>

          {/* 倒计时卡片（白底玻璃拟态） */}
          <div className="inline-block bg-card-bg backdrop-blur-sm rounded-3xl px-6 py-5 md:px-10 md:py-7 shadow-lg shadow-pink-soft/20 border border-pink-soft/30 mb-10 animate-fade-in-up">
            <p className="text-text-secondary text-xs md:text-sm mb-3 tracking-wider">
              距离下一个纪念日
            </p>
            <div className="flex items-center gap-3 md:gap-5">
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-coral">{countdown.days}</span>
                <p className="text-xs text-text-secondary mt-1">天</p>
              </div>
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-pink-soft fill-pink-soft" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-coral">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <p className="text-xs text-text-secondary mt-1">时</p>
              </div>
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-pink-soft fill-pink-soft" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-coral">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <p className="text-xs text-text-secondary mt-1">分</p>
              </div>
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-pink-soft fill-pink-soft" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-bold text-coral">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <p className="text-xs text-text-secondary mt-1">秒</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-rose-gold mt-3">
              💝 恋爱纪念日 {annivText}
            </p>
          </div>

          {/* 快速入口按钮 */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-fade-in-up">
            <button
              onClick={onScrollToTimeline}
              className="px-5 md:px-7 py-2.5 md:py-3 bg-gradient-to-r from-coral to-pink-soft text-white rounded-full font-medium shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              珍藏回忆
            </button>
            <button
              onClick={onScrollToTimeline}
              className="px-5 md:px-7 py-2.5 md:py-3 bg-card-bg text-coral rounded-full font-medium shadow-lg shadow-pink-soft/20 hover:shadow-xl hover:shadow-pink-soft/30 transition-all duration-300 hover:-translate-y-0.5 border border-pink-soft/30 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              回顾时光
            </button>
          </div>
        </div>
      </section>

      {/* 随机回忆 */}
      <section className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <div className="bg-card-bg backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-pink-soft/20 text-center">
          <p className="text-xs md:text-sm text-text-secondary mb-3 tracking-wider">✨ 随机回忆</p>
          <div key={memoryKey} className="animate-fade-in">
            <p className="text-base md:text-lg text-text-primary leading-relaxed">
              <span className="text-2xl mr-2">{memory.emoji}</span>
              {memory.text}
            </p>
          </div>
          <button
            onClick={refreshMemory}
            className="mt-4 px-4 py-2 text-xs md:text-sm text-coral hover:text-text-primary transition-colors flex items-center gap-1.5 mx-auto rounded-full hover:bg-pink-soft/10"
          >
            <RefreshCw className="w-4 h-4" />
            换一个回忆
          </button>
        </div>
      </section>

      {/* 底部 */}
      <div className="relative z-10 text-center py-8 text-text-secondary text-xs md:text-sm">
        <p>用爱记录每一个瞬间 💕</p>
      </div>
    </div>
  );
}