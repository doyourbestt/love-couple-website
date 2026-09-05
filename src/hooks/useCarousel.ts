import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCarouselOptions {
  total: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

interface UseCarouselReturn {
  currentIndex: number;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  isDragging: boolean;
  handleDragStart: (clientX: number) => void;
  handleDragMove: (clientX: number) => void;
  handleDragEnd: () => void;
}

export function useCarousel(options: UseCarouselOptions): UseCarouselReturn {
  const { total, autoPlay = true, interval = 5000, loop = true } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((index: number) => {
    if (index < 0) {
      setCurrentIndex(loop ? total - 1 : 0);
    } else if (index >= total) {
      setCurrentIndex(loop ? 0 : total - 1);
    } else {
      setCurrentIndex(index);
    }
  }, [total, loop]);

  const goNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Auto play
  useEffect(() => {
    if (autoPlay && total > 1) {
      autoPlayRef.current = setInterval(goNext, interval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval, goNext, total]);

  // Drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragOffset.current = 0;
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    dragOffset.current = clientX - dragStartX.current;
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (dragOffset.current > threshold) {
      goPrev();
    } else if (dragOffset.current < -threshold) {
      goNext();
    }
    
    dragOffset.current = 0;
  }, [isDragging, goPrev, goNext]);

  return {
    currentIndex,
    goTo,
    goNext,
    goPrev,
    isDragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
