import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useCarousel } from '../../hooks/useCarousel';
import type { PhotoItem } from '../../types';

interface PhotoCarouselProps {
  photos: PhotoItem[];
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const { currentIndex, goTo, goNext, goPrev } = useCarousel({
    total: photos.length,
    autoPlay: true,
    interval: 4000,
    loop: true,
  });

  const [isLiked, setIsLiked] = useState(false);

  const handleLike = useCallback(() => {
    setIsLiked(true);
    setTimeout(() => setIsLiked(false), 1000);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50">
        <p className="text-gray-400">暂无照片，快去添加吧~</p>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="relative">
      {/* 标题 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">甜蜜相册</h3>
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* 轮播容器 */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {/* 图片 */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-100 to-rose-100">
          <img
            src={currentPhoto.src}
            alt={currentPhoto.caption || '回忆'}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* 点赞按钮 */}
          <button
            onClick={handleLike}
            className={`absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 ${
              isLiked ? 'animate-bounce' : ''
            }`}
          >
            <Heart
              size={24}
              className={`transition-colors duration-300 ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>

          {/* 图片说明 */}
          {currentPhoto.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-lg font-bold text-white drop-shadow-lg">
                {currentPhoto.caption}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {new Date(currentPhoto.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          )}
        </div>

        {/* 左右切换按钮 */}
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 指示器 */}
      <div className="mt-4 flex justify-center gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'h-2 w-6 rounded-full bg-pink-500'
                : 'h-2 w-2 rounded-full bg-pink-200 hover:bg-pink-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
