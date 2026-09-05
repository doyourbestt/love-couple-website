import React, { useState, useRef } from 'react';
import { usePhotoStore } from '../store/photoStore';
import { Edit2, Trash2, Plus, Save, X, Image as ImageIcon } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { photos, addPhoto, removePhoto, updatePhoto, clearAll } = usePhotoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 按时间倒序
  const sortedPhotos = [...photos].sort((a, b) => b.createdAt - a.createdAt);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addPhoto(dataUrl, newCaption);
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (id: string, caption: string, src: string) => {
    setEditingId(id);
    setEditCaption(caption);
    setEditUrl(src);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updatePhoto(editingId, { caption: editCaption, src: editUrl, edited: true });
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (!newUrl.trim()) return;
    addPhoto(newUrl, newCaption);
    setNewUrl('');
    setNewCaption('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white pb-28">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 px-4 pb-6 pt-8">
        <h1 className="text-center text-2xl font-bold text-white drop-shadow-md">
          动态管理
        </h1>
        <p className="mt-2 text-center text-sm text-white/90">
          一句话配一张图，自由编辑内容
        </p>
      </div>

      <div className="-mt-3 px-4">
        {/* 操作栏 */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-3 text-white shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            <span className="font-medium">发新动态</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-pink-500 shadow-lg shadow-pink-100 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ImageIcon size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* 添加动态弹窗 */}
        {showAdd && (
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">发布新动态</h3>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <label className="mb-1 block text-xs text-gray-500">
              图片 URL（也可点击右侧 🖼️ 上传本地图片）
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="mb-2 w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
            />
            <label className="mb-1 block text-xs text-gray-500">
              一句话文案
            </label>
            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="今天想和彤彤说..."
              rows={3}
              className="mb-3 w-full resize-none rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
            />
            <button
              onClick={handleAddNew}
              className="w-full rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 text-white transition-all hover:scale-[1.02] active:scale-95"
            >
              发布
            </button>
          </div>
        )}

        {/* 动态列表 */}
        <div className="space-y-4">
          {sortedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md shadow-pink-100"
            >
              {editingId === photo.id ? (
                // 编辑模式
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">编辑这条动态</h3>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <label className="mb-1 block text-xs text-gray-500">
                    图片 URL
                  </label>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="mb-2 w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                  />
                  <label className="mb-1 block text-xs text-gray-500">
                    文案
                  </label>
                  <textarea
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    rows={3}
                    className="mb-3 w-full resize-none rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    onClick={saveEdit}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 text-white transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Save size={16} />
                    保存修改
                  </button>
                </div>
              ) : (
                // 预览模式
                <div>
                  {photo.caption && (
                    <p className="px-4 pb-3 pt-3 text-[15px] leading-relaxed text-gray-700">
                      {photo.caption}
                    </p>
                  )}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-pink-50">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 px-3 py-3">
                    <button
                      onClick={() =>
                        startEdit(photo.id, photo.caption || '', photo.src)
                      }
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-100"
                    >
                      <Edit2 size={14} />
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定要删除这条动态吗？')) {
                          removePhoto(photo.id);
                        }
                      }}
                      className="flex items-center justify-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {photos.length > 0 && (
          <button
            onClick={() => {
              if (confirm('确定要清空所有动态吗？此操作不可恢复。')) {
                clearAll();
              }
            }}
            className="mt-6 w-full rounded-2xl border-2 border-pink-200 py-3 text-sm text-pink-500 transition-colors hover:bg-pink-50"
          >
            清空所有动态
          </button>
        )}

        {photos.length === 0 && (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-400">还没有动态，点击上方发布吧~</p>
          </div>
        )}
      </div>
    </div>
  );
};
