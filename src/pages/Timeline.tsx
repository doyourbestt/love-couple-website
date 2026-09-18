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
    <div ref={registerScrollTarget} className="max-w-4xl mx-auto px-4 py-10 relative z-10">
      {/* 顶部标题 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-coral via-pink-soft to-purple-light bg-clip-text text-transparent">
            我们的时间轴
          </h1>
          <p className="text-text-secondary text-sm mt-1">回顾每一个值得珍藏的时刻 ⏳</p>
        </div>
        {devMode && (
          <button
            onClick={openAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-coral to-pink-soft text-white rounded-full font-medium shadow-lg shadow-coral/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加事件
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-card-bg backdrop-blur-sm rounded-3xl border border-pink-soft/20">
          <Clock className="w-16 h-16 text-pink-soft mx-auto mb-4" />
          <p className="text-xl text-text-secondary">
            {devMode ? '还没有记录哦，快来添加第一个重要时刻吧~' : '还没有时间轴记录'}
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* 桌面端：中央竖线 / 手机端：左侧竖线 */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-coral via-pink-soft to-purple-light -translate-x-1/2" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={event.id}
                className={`relative mb-12 flex items-start animate-fade-in-up ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* 时间点 */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-coral to-pink-soft rounded-full border-4 border-white shadow-md z-10" />

                {/* 桌面端左右留空 + 日期 */}
                <div className={`hidden md:flex w-[45%] ${isLeft ? 'justify-end pr-8' : 'justify-start pl-8'} items-center`}>
                  <div className={`text-text-secondary text-sm ${isLeft ? 'text-right' : 'text-left'}`}>
                    <div className="font-bold text-coral">{event.eventDate}</div>
                  </div>
                </div>

                {/* 卡片 */}
                <div className="ml-14 md:ml-0 md:w-[45%] w-[calc(100%-3.5rem)] group">
                  <div className="bg-card-bg backdrop-blur-sm rounded-3xl p-6 shadow-md shadow-pink-soft/10 hover:shadow-xl hover:shadow-pink-soft/25 transition-all duration-300 hover:-translate-y-1 border border-pink-soft/20">
                    {/* 移动端日期 + 图标 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{event.icon}</span>
                        <span className="md:hidden text-sm text-coral font-bold">
                          {event.eventDate}
                        </span>
                      </div>
                      {devMode && (
                        <div className="flex items-center gap-1 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(event);
                            }}
                            className="w-8 h-8 rounded-full bg-purple-light/40 flex items-center justify-center text-text-secondary hover:bg-pink-soft/40 hover:text-coral transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(event.id);
                            }}
                            className="w-8 h-8 rounded-full bg-purple-light/40 flex items-center justify-center text-text-secondary hover:bg-light-red/40 hover:text-coral transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-2">
                      {event.title}
                    </h3>

                    {/* 图片 */}
                    {event.image && (
                      <div className="mb-3 rounded-2xl overflow-hidden bg-pink-soft/10">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full max-h-72 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* 描述 */}
                    <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                      {event.description}
                    </p>

                    {/* 底部装饰 */}
                    <div className="mt-4 flex items-center gap-1 text-rose-gold text-xs">
                      <Heart className="w-3.5 h-3.5 fill-pink-soft text-pink-soft" />
                      <span>珍藏这一刻</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 底部 */}
      <div className="text-center py-8 text-rose-gold text-sm">
        <p>未完待续... 💕</p>
      </div>

      {/* 添加/编辑弹窗 */}
      {showForm && (
        <div
          className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-purple-light/30 rounded-full flex items-center justify-center hover:bg-purple-light/50 transition-colors"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>

            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-coral" />
              {editingId ? '编辑时刻' : '添加重要时刻'}
            </h2>

            <div className="space-y-4">
              {/* 图标选择 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">选择图标</label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        formData.icon === emoji
                          ? 'bg-pink-soft/30 border-2 border-coral scale-110'
                          : 'bg-purple-light/20 hover:bg-pink-soft/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：第一次旅行"
                  className="w-full px-4 py-3 rounded-xl border border-pink-soft/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all bg-purple-light/10"
                />
              </div>

              {/* 日期 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">日期</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-soft/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all bg-purple-light/10"
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="记录这个特别的时刻..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-pink-soft/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all resize-none bg-purple-light/10"
                />
              </div>

              {/* 图片URL */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  图片URL <span className="text-text-secondary">(可选)</span>
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-soft/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all bg-purple-light/10"
                />
              </div>

              {/* 保存按钮 */}
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.eventDate || !formData.description}
                className="w-full py-3 bg-gradient-to-r from-coral to-pink-soft text-white rounded-xl font-medium shadow-lg shadow-coral/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-text-primary mb-2">删除事件</h3>
            <p className="text-text-secondary mb-6">确定要删除这个事件吗？删除后无法恢复。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-purple-light/30 text-text-primary font-medium hover:bg-purple-light/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 rounded-xl bg-coral text-white font-medium hover:bg-coral/90 transition-colors"
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