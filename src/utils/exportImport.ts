// 导出导入工具：把当前所有配置打包成 JSON
import { useUserStore } from '../store/userStore';
import { usePhotoStore } from '../store/photoStore';

export interface ExportedConfig {
  version: number;
  exportedAt: string;
  user: {
    partnerName: string;
    startDate: string;
    avatar?: string;
  };
  photos: Array<{
    id: string;
    src: string;
    caption?: string;
    createdAt: number;
    edited?: boolean;
  }>;
}

// 导出当前所有配置
export function exportConfig(): ExportedConfig {
  const user = useUserStore.getState();
  const photos = usePhotoStore.getState();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    user: {
      partnerName: user.partnerName,
      startDate: user.startDate,
      avatar: user.avatar,
    },
    photos: photos.photos.map((p) => ({
      id: p.id,
      src: p.src,
      caption: p.caption,
      createdAt: p.createdAt,
      edited: p.edited,
    })),
  };
}

// 触发浏览器下载 JSON
export function downloadConfig(): void {
  const config = exportConfig();
  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `love-config-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 导入配置（应用到 store）
export function importConfig(config: ExportedConfig): void {
  if (config.user) {
    useUserStore.getState().setPartnerName(config.user.partnerName);
    useUserStore.getState().setStartDate(config.user.startDate);
    if (config.user.avatar) {
      useUserStore.getState().setAvatar(config.user.avatar);
    }
  }
  if (config.photos) {
    // 清空旧照片，导入新照片
    const photoStore = usePhotoStore.getState();
    // 重置为新数据
    photoStore.reorderPhotos(config.photos);
  }
}

// 从文件读取并导入
export function importFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        importConfig(config);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}