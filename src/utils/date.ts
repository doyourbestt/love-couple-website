// 计算恋爱天数
export function calculateLoveDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  // 设置时间为当天的开始，避免跨天时计算错误
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// 计算下一个纪念日的天数
export function getNextAnniversaryDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 尝试今年的纪念日
  let anniversary = new Date(currentYear, start.getMonth(), start.getDate());
  
  // 如果今年的纪念日已过，计算明年的
  if (anniversary < now) {
    anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate());
  }
  
  const diff = anniversary.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// 格式化日期显示
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
