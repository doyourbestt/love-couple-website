import React from 'react';
import { Heart, Calendar, Sparkles } from 'lucide-react';
import { useLoveDay } from '../../hooks/useLoveDay';

interface LoveDayCardProps {
  partnerName: string;
  startDate: string;
}

export const LoveDayCard: React.FC<LoveDayCardProps> = ({ partnerName, startDate }) => {
  const { days, nextAnniversary } = useLoveDay(startDate);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 p-6 shadow-2xl shadow-pink-200">
      {/* 装饰背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-xl" />
      </div>

      {/* 浮动爱心动画 */}
      <div className="absolute right-4 top-4 animate-pulse">
        <Heart className="h-6 w-6 text-white/60" fill="currentColor" />
      </div>
      <div className="absolute bottom-8 right-8 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Heart className="h-4 w-4 text-white/40" fill="currentColor" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 标题 */}
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-200" />
          <span className="text-sm font-medium text-white/90">我们的爱情时光</span>
        </div>

        {/* 情侣名称 */}
        <h2 className="mb-2 text-xl font-bold text-white drop-shadow-md">
          {partnerName}
        </h2>

        {/* 恋爱天数 - 核心展示 */}
        <div className="my-6 text-center">
          <div className="mb-1 text-6xl font-black text-white drop-shadow-lg">
            {days}
          </div>
          <div className="text-lg font-medium text-white/90">天</div>
        </div>

        {/* 开始日期 */}
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/80">
          <Calendar className="h-4 w-4" />
          <span>始于 {startDate}</span>
        </div>

        {/* 下一个纪念日 */}
        <div className="rounded-2xl bg-white/20 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-sm text-white/90">
            距离下一个纪念日还有
            <span className="mx-1 text-lg font-bold text-yellow-200">
              {nextAnniversary.daysUntil}
            </span>
            天
          </p>
          <p className="mt-1 text-xs text-white/70">
            第 {nextAnniversary.anniversaryNumber} 个纪念日
          </p>
        </div>
      </div>
    </div>
  );
};
