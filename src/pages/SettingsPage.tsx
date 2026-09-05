import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Save, RotateCcw, Heart, Code } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const {
    partnerName,
    startDate,
    setPartnerName,
    setStartDate,
    reset,
    devMode,
    setDevMode,
  } = useUserStore();
  const [name, setName] = useState(partnerName);
  const [date, setDate] = useState(startDate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setPartnerName(name);
    setStartDate(date);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleReset = () => {
    if (confirm('确定恢复默认设置吗？这不会影响照片。')) {
      reset();
      setName('彤彤 ❤️ 苏木');
      setDate('2026-09-03');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white pb-28">
      <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 px-4 pb-6 pt-8">
        <h1 className="text-center text-2xl font-bold text-white drop-shadow-md">
          设置
        </h1>
        <p className="mt-2 text-center text-sm text-white/90">
          自定义你的 CP 小屋
        </p>
      </div>

      <div className="-mt-3 space-y-4 px-4">
        {/* 开发者模式开关 */}
        <div
          className={`rounded-2xl bg-white p-5 shadow-md ${
            devMode ? 'shadow-yellow-200 ring-2 ring-yellow-300' : 'shadow-pink-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  devMode ? 'bg-yellow-300 text-yellow-900' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Code size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">开发者模式</div>
                <div className="text-xs text-gray-400">
                  开启后所有内容可点击直接编辑
                </div>
              </div>
            </div>
            <button
              onClick={() => setDevMode(!devMode)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                devMode ? 'bg-yellow-400' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  devMode ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          {devMode && (
            <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
              ✅ 已开启。返回首页，点击任意 CP 名称、日期、文案或图片即可直接修改。
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md shadow-pink-100">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            CP 名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：彤彤 ❤️ 苏木"
            className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm focus:border-pink-400 focus:outline-none"
          />
          <p className="mt-2 text-xs text-gray-400">
            提示：可用 ❤️ 或其他 emoji 分隔两个名字
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md shadow-pink-100">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            起始日期
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm focus:border-pink-400 focus:outline-none"
          />
          <p className="mt-2 text-xs text-gray-400">用于计算「在一起 N 天」</p>
        </div>

        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 font-medium text-white shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95"
        >
          {saved ? (
            <>
              <Heart className="h-4 w-4 fill-white" />
              已保存
            </>
          ) : (
            <>
              <Save size={18} />
              保存设置
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pink-200 py-3 text-sm text-pink-500 transition-colors hover:bg-pink-50"
        >
          <RotateCcw size={16} />
          恢复默认设置
        </button>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>彤彤和苏木的 CP 小屋</p>
          <p className="mt-1">v1.0 · 用心记录每一份甜蜜</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
