// 简化版的 cn 函数，避免外部依赖
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}