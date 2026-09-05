import React, { useRef } from 'react';
import {
  Sparkles,
  Calendar,
  Heart,
  Code,
  Edit3,
  Upload,
  X,
  Check,
  Plus,
} from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { usePhotoStore } from '../store/photoStore';
import { useEditorUI } from '../store/editorUI';
import { useLoveDay } from '../hooks/useLoveDay';
import type { PhotoItem } from '../types';

export const HomePage: React.FC = () => {
  const {
    partnerName,
    startDate,
    setPartnerName,
    setStartDate,
    devMode,
    toggleDevMode,
  } = useUserStore();
  const { photos, updatePhoto, addPhoto, removePhoto } = usePhotoStore();
  // 用 selector 订阅，确保 store 变化触发组件重新渲染
  const editingPhotoId = useEditorUI((s) => s.editingPhotoId);
  const addingNew = useEditorUI((s) => s.addingNew);
  console.log('[DBG] editingPhotoId=', editingPhotoId, 'photos=', photos.length);
  const setEditingPhotoId = useEditorUI((s) => s.setEditingPhotoId);
  const setAddingNew = useEditorUI((s) => s.setAddingNew);
  const { days } = useLoveDay(startDate);

  // 编辑 CP 名称 / 日期
  const [editingField, setEditingField] = React.useState<'name' | 'date' | null>(
    null
  );
  const [tempValue, setTempValue] = React.useState('');

  // 编辑某条动态（仅缓存编辑表单数据，不缓存 id）
  const [editCaption, setEditCaption] = React.useState('');
  const [editUrl, setEditUrl] = React.useState('');

  // 新增动态
  const [newCaption, setNewCaption] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const sortedPhotos = [...photos].sort((a, b) => b.createdAt - a.createdAt);
  const editingPhoto = editingPhotoId
    ? sortedPhotos.find((p) => p.id === editingPhotoId) || null
    : null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  // ---- 编辑 CP 名称 / 日期 ----
  const startEditField = (field: 'name' | 'date') => {
    if (!devMode) return;
    setEditingField(field);
    setTempValue(field === 'name' ? partnerName : startDate);
  };
  const saveField = () => {
    if (editingField === 'name') setPartnerName(tempValue);
    if (editingField === 'date') setStartDate(tempValue);
    setEditingField(null);
  };

  // ---- 编辑动态 ----
  // 移除局部 startEditPhoto，改为编辑按钮直接调用（避免状态被 React 闭包锁住）
  const savePhoto = () => {
    if (!editingPhotoId) return;
    updatePhoto(editingPhotoId, {
      caption: editCaption,
      src: editUrl,
      edited: true,
    });
    setEditingPhotoId(null);
  };
  const closePhotoEditor = () => setEditingPhotoId(null);

  // ---- 上传图片 ----
  const handleNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const publishNew = () => {
    if (!newUrl.trim()) return;
    addPhoto(newUrl);
    setNewUrl('');
    setNewCaption('');
    setAddingNew(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white pb-28">
      {/* 顶部 CP 标识 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 px-4 pb-10 pt-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

        <button
          onClick={(e) => {
            const target = e.currentTarget;
            const now = Date.now();
            const last = Number(target.dataset.lastClick || 0);
            const count = Number(target.dataset.clickCount || 0);
            if (now - last > 1500) {
              target.dataset.clickCount = '1';
            } else {
              target.dataset.clickCount = String(count + 1);
            }
            target.dataset.lastClick = String(now);
            if (Number(target.dataset.clickCount) >= 5) {
              toggleDevMode();
              target.dataset.clickCount = '0';
            }
          }}
          className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          title="连点 5 次开启/关闭开发者模式"
        >
          <Code size={16} />
        </button>

        <div className="relative z-10 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-200" />
            <span className="text-sm font-medium tracking-widest text-white/90">
              CP 小屋
            </span>
            <Sparkles className="h-4 w-4 text-yellow-200" />
          </div>

          {editingField === 'name' ? (
            <div className="mx-auto flex max-w-xs items-center gap-2">
              <input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 rounded-lg bg-white/90 px-3 py-1.5 text-center text-lg font-bold text-gray-800 focus:outline-none"
                autoFocus
              />
              <button
                onClick={saveField}
                className="rounded-full bg-white p-1.5 text-green-500 shadow"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="rounded-full bg-white p-1.5 text-gray-400 shadow"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <h1
              onClick={() => startEditField('name')}
              className={`text-2xl font-bold text-white drop-shadow-md ${
                devMode ? 'cursor-pointer rounded-lg outline outline-2 outline-dashed outline-yellow-300/70' : ''
              }`}
            >
              {partnerName}
              {devMode && <Edit3 className="ml-2 inline h-4 w-4 text-yellow-200" />}
            </h1>
          )}

          {editingField === 'date' ? (
            <div className="mx-auto mt-3 flex max-w-xs items-center gap-2">
              <input
                type="date"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm text-gray-800 focus:outline-none"
              />
              <button
                onClick={saveField}
                className="rounded-full bg-white p-1.5 text-green-500 shadow"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="rounded-full bg-white p-1.5 text-gray-400 shadow"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => startEditField('date')}
              className={`mt-3 flex items-center justify-center gap-2 text-sm text-white/90 ${
                devMode ? 'cursor-pointer rounded-lg outline outline-2 outline-dashed outline-yellow-300/70' : ''
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>始于 {startDate.replace(/-/g, '/')}</span>
              {devMode && <Edit3 className="h-3 w-3 text-yellow-200" />}
            </div>
          )}

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-white text-white" />
            <span className="text-sm font-bold text-white">
              在一起 <span className="text-lg">{days}</span> 天
            </span>
          </div>

          {devMode && (
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-bold text-yellow-900 shadow-lg">
              <Code size={14} />
              开发者模式已开启 · 点击任意内容可编辑
              <button
                onClick={toggleDevMode}
                className="ml-1 rounded-full bg-yellow-900/20 px-2 py-0.5 text-[10px]"
              >
                关闭
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 动态列表 */}
      <div className="px-4 py-6">
        {devMode && !addingNew && !editingPhotoId && (
          <button
            onClick={() => setAddingNew(true)}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-300 bg-white/50 py-3 text-sm font-bold text-rose-500 transition-all hover:scale-[1.01] hover:bg-rose-50 active:scale-95"
          >
            <Plus size={18} />
            添加新动态
          </button>
        )}

        {addingNew && (
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg ring-2 ring-yellow-300">
            <h3 className="mb-3 font-bold text-gray-800">新动态</h3>
            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="一句话文案"
              rows={2}
              className="mb-2 w-full resize-none rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
            />
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={newUrl.startsWith('data:') ? '[已选择本地图片]' : newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="图片 URL"
                className="flex-1 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-pink-50 px-3 text-pink-500"
                title="上传本地图片"
              >
                <Upload size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleNewFile}
              />
            </div>
            {newUrl && (
              <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-pink-50">
                <img src={newUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={publishNew}
                className="flex-1 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 py-2 font-medium text-white"
              >
                发布
              </button>
              <button
                onClick={() => {
                  setAddingNew(false);
                  setNewUrl('');
                  setNewCaption('');
                }}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-500"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {sortedPhotos.length === 0 && !addingNew ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-400">还没有内容，开发者模式下可添加~</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedPhotos.map((photo) => (
              <article
                key={photo.id}
                className={`relative overflow-hidden rounded-2xl bg-white shadow-md shadow-pink-100 ${
                  devMode ? 'ring-2 ring-yellow-300/50' : ''
                }`}
              >
                {devMode && (
                  <div className="absolute right-2 top-2 z-20 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const newCaption = window.prompt('修改文案', photo.caption || '');
                        if (newCaption === null) return;
                        const newUrl = window.prompt('修改图片 URL', photo.src);
                        if (newUrl === null || !newUrl.trim()) return;
                        updatePhoto(photo.id, { caption: newCaption, src: newUrl, edited: true });
                      }}
                      className="rounded-full bg-white/90 p-1.5 text-pink-500 shadow hover:bg-pink-50"
                      title="编辑"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('删除这条动态？')) removePhoto(photo.id);
                      }}
                      className="rounded-full bg-white/90 p-1.5 text-red-500 shadow hover:bg-red-50"
                      title="删除"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {photo.caption && (
                  <div className="px-4 pb-3">
                    <p
                      onClick={() => {
                        if (!devMode) return;
                        setEditCaption(photo.caption || '');
                        setEditUrl(photo.src);
                        setEditingPhotoId(photo.id);
                      }}
                      className={`text-[15px] leading-relaxed text-gray-700 ${
                        devMode ? 'cursor-pointer rounded outline outline-1 outline-dashed outline-yellow-300' : ''
                      }`}
                    >
                      {photo.caption}
                    </p>
                  </div>
                )}

                <div
                  onClick={() => {
                    if (!devMode) return;
                    setEditCaption(photo.caption || '');
                    setEditUrl(photo.src);
                    setEditingPhotoId(photo.id);
                  }}
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-pink-50 ${
                    devMode ? 'cursor-pointer' : ''
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption || '回忆'}
                    className="h-full w-full object-cover"
                  />
                  {devMode && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all hover:bg-black/30">
                      <div className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-700 opacity-0 transition-opacity hover:opacity-100">
                        <Edit3 className="mr-1 inline h-3 w-3" /> 点击替换图片
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 编辑弹窗 */}
        {editingPhotoId && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center">
            <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">编辑动态</h3>
                <button
                  onClick={closePhotoEditor}
                  className="rounded-full bg-gray-100 p-1.5 text-gray-500"
                >
                  <X size={16} />
                </button>
              </div>
              <label className="mb-1 block text-xs text-gray-500">文案</label>
              <textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                rows={3}
                className="mb-3 w-full resize-none rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
              />
              <label className="mb-1 block text-xs text-gray-500">图片 URL / 上传</label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={editUrl.startsWith('data:') ? '[本地图片]' : editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                />
                <button
                  onClick={() => editFileInputRef.current?.click()}
                  className="rounded-lg bg-pink-50 px-3 text-pink-500"
                >
                  <Upload size={18} />
                </button>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEditFile}
                />
              </div>
              {editUrl && (
                <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-pink-50">
                  <img src={editUrl} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={savePhoto}
                  className="flex-1 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 font-medium text-white"
                >
                  保存
                </button>
                <button
                  onClick={closePhotoEditor}
                  className="rounded-lg bg-gray-100 px-5 py-2.5 text-gray-500"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-xs text-pink-500">
            <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
            <span>未完待续 · 一直更新中</span>
            <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
