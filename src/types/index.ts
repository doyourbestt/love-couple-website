// 用户配置
export interface UserConfig {
  partnerName: string;
  startDate: string;
  avatar?: string;
}

// 照片项
export interface PhotoItem {
  id: string;
  src: string;
  createdAt: number;
  caption?: string;
  edited?: boolean;
}

// 贴纸类型
export type StickerType = 'heart' | 'star' | 'flower' | 'text';

// 贴纸项
export interface StickerItem {
  id: string;
  type: StickerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  content?: string;
}

// 编辑器状态
export interface EditorState {
  currentPhoto: PhotoItem | null;
  stickers: StickerItem[];
  filter: string;
  history: EditorSnapshot[];
  historyIndex: number;
}

// 编辑器快照
export interface EditorSnapshot {
  stickers: StickerItem[];
  filter: string;
}

// 卡片主题
export interface CardTheme {
  id: string;
  name: string;
  background: string;
  fontColor: string;
  decoration: string;
}

// 导航项
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
