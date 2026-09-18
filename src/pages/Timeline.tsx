import { useState } from 'react';
import { Clock, Heart, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useTimelineStore, type TimelineEvent } from '../store/timelineStore';
import { useUserStore } from '../store/userStore';

const emojiOptions = ['🌟', '💕', '🎂', '🏖️', '🎄', '☕', '🎉', '🌹', '💍', '🏠', '✈️', '🎵', '📸', '🎓', '🧸', '💐', '🌈', '🍰', '🎁', '🌙'];

interface TimelineProps {
  registerScrollTarget: (ref: HTMLElement | null) => void;
}

export default function Timeline({ registerScrollTarget }: TimelineProps) {
  const { events, addEvent, updateEvent, removeEvent } = useTimelineStore();
  const { devMode } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    eventDate: '',
    description: '',
    icon: '🌟',
    image: '',
  });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', eventDate: '', description: '', icon: '🌟', image: '' });
    setShowForm(true);
  };

  const openEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      eventDate: event.eventDate,
      description: event.description,
      icon: event.icon || '🌟',
      image: event.image || '',
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.eventDate || !formData.description) {
      alert('请填写标题、日期和描述');
      return;
    }
    if (editingId) {
      updateEvent(editingId, formData);
    } else {
      addEvent(formData);
    }
    setFormData({ title: '', eventDate: '', description: '', icon: '🌟', image: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    removeEvent(id);
    setDeleteTarget(null);
  };

  return (
    <div ref={registerScrollTarget} className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
          <Clock className="w-8 h-8 text-rose-500" />
          我们的时间轴
        </h1>
        {devMode && (
          <button
            onClick={openAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full font-medium shadow-lg shadow-rose-300/40 hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加事件
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            {devMode ? '还没有记录哦，快来添加第一个重要时刻吧~' : '还没有时间轴记录'}
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 via-pink-300 to-purple-300 -translate-x-1/2" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={event.id}
                className={`relative flex items-start mb-12 md:${isLeft ? 'flex-row' : 'flex-row-reverse'} flex-row animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 时间点 */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full border-4 border-white shadow-md z-10" />

                {/* 卡片 */}
                <div
                  className={`ml-14 md:ml-0 md:w-[45%] ${
                    isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  } w-full`}
                >
                  <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl hover:shadow-pink-200/40 transition-all duration-300 border border-pink-100 hover:-translate-y-1 group">
                    {/* 头部：图标 + 日期 + 操作按钮 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{event.icon}</span>
                        <span className="text-sm text-rose-500 font-medium">{event.eventDate}</span>
                      </div>
                      {devMode && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(event);
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-100 hover:text-rose-500 transition-all"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(event.id);
                            }}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-all"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{event.title}</h3>

                    {/* 图片 */}
                    {event.image && (
                      <div className="mb-3 rounded-xl overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full max-h-72 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* 描述 */}
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>

                    {/* 底部装饰 */}
                    <div className="mt-4 flex items-center gap-1 text-rose-500">
                      <Heart className="w-4 h-4 fill-rose-400" />
                      <span className="text-sm">珍藏这一刻</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部 */}
      <div className="text-center py-8">
        <p className="text-rose-400">未完待续... 💕</p>
      </div>

      {/* 添加/编辑弹窗 */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-rose-500" />
              {editingId ? '编辑时刻' : '添加重要时刻'}
            </h2>

            <div className="space-y-4">
              {/* 图标选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">选择图标</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        formData.icon === emoji
                          ? 'bg-rose-100 border-2 border-rose-400 scale-110'
                          : 'bg-gray-100 hover:bg-pink-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：第一次旅行"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* 日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">日期</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="记录这个特别的时刻..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                />
              </div>

              {/* 图片URL */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  图片URL <span className="text-gray-400">(可选)</span>
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              {/* 保存按钮 */}
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.eventDate || !formData.description}
                className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-xl font-medium shadow-lg shadow-rose-300/40 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? '保存修改 💕' : '珍藏这个时刻 💕'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-700 mb-2">删除事件</h3>
            <p className="text-gray-500 mb-6">确定要删除这个事件吗？删除后无法恢复。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}