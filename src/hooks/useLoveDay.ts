import { useMemo } from 'react';
import { calculateLoveDays, getNextAnniversaryDays } from '../utils/date';

interface LoveDayInfo {
  days: number;
  nextAnniversary: number;
}

export function useLoveDay(startDate: string): LoveDayInfo {
  return useMemo(() => {
    return {
      days: calculateLoveDays(startDate),
      nextAnniversary: getNextAnniversaryDays(startDate),
    };
  }, [startDate]);
}
