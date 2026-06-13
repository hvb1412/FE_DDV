import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, MessageCircle, Calendar, Pill, Award, Sparkles, CheckCheck, Trash2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

const initial = [
  { id: 1, type: 'message', icon: MessageCircle, title: 'Tin nhắn từ BS. Trần Thị A', body: 'Tuần sau mình hẹn tái khám online vào thứ 3 lúc 15:00 nhé?', time: '5 phút trước', read: false, color: 'text-emerald-600 bg-emerald-50' },
  { id: 2, type: 'reminder', icon: Pill, title: 'Đã đến giờ uống thuốc', body: 'Metformin 500mg — 12:00', time: '15 phút trước', read: false, color: 'text-red-600 bg-red-50' },
  { id: 3, type: 'appointment', icon: Calendar, title: 'Lịch hẹn được xác nhận', body: 'BS. Trần Thị A xác nhận lịch tái khám 21/05 lúc 15:00', time: '2 giờ trước', read: true, color: 'text-blue-600 bg-blue-50' },
  { id: 4, type: 'achievement', icon: Award, title: 'Bạn vừa nhận huy hiệu mới! 🏆', body: 'Huy hiệu "Streak 12 ngày" — Tiếp tục cố gắng nhé!', time: 'Hôm qua', read: true, color: 'text-amber-600 bg-amber-50' },
  { id: 5, type: 'tip', icon: Sparkles, title: 'Mẹo dinh dưỡng hôm nay', body: 'Ăn cá hồi 2 lần/tuần giúp giảm cholesterol xấu và tốt cho tim mạch.', time: 'Hôm qua', read: true, color: 'text-violet-600 bg-violet-50' },
  { id: 6, type: 'message', icon: MessageCircle, title: 'Điều dưỡng Hoa đã gửi tin', body: 'Bạn nhớ uống đủ nước nhé, hôm nay mới được 1.2L thôi.', time: '2 ngày trước', read: true, color: 'text-emerald-600 bg-emerald-50' },
  { id: 7, type: 'appointment', icon: Calendar, title: 'Sắp tới lịch hẹn', body: 'Còn 2 ngày nữa đến lịch tái khám với BS. Trần Thị A', time: '2 ngày trước', read: true, color: 'text-blue-600 bg-blue-50' },
];

const categories = [
  { id: 'all', label: 'Tất cả', icon: Bell },
  { id: 'message', label: 'Tin nhắn', icon: MessageCircle },
  { id: 'reminder', label: 'Nhắc nhở', icon: Pill },
  { id: 'appointment', label: 'Lịch hẹn', icon: Calendar },
  { id: 'achievement', label: 'Thành tích', icon: Award },
  { id: 'tip', label: 'Mẹo & Tin tức', icon: Sparkles },
];

const routeFor: Record<string, string> = {
  message: '/p/chat',
  reminder: '/p/reminders',
  appointment: '/p/appointments',
  achievement: '/p/rewards',
  tip: '/p/learning',
};

export function PatientNotifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initial);
  const [cat, setCat] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const openItem = (n: typeof initial[number]) => {
    setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
    const dest = routeFor[n.type];
    if (dest) navigate(dest);
  };

  const list = items.filter((i) => (cat === 'all' || i.type === cat) && (!onlyUnread || !i.read));
  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">{unreadCount} thông báo chưa đọc</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate('/p/settings')} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm flex items-center gap-1.5 hover:bg-gray-50 flex-1 sm:flex-none justify-center">
            <Settings2 size={14} /> Cài đặt
          </button>
          <button
            onClick={() => {
              const snapshot = items;
              setItems(items.map((i) => ({ ...i, read: true })));
              toast.success('Đã đánh dấu tất cả là đã đọc', {
                action: { label: 'Hoàn tác', onClick: () => setItems(snapshot) },
              });
            }}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm flex items-center gap-1.5 hover:bg-emerald-700 flex-1 sm:flex-none justify-center whitespace-nowrap"
          >
            <CheckCheck size={14} /> <span className="hidden sm:inline">Đánh dấu đã đọc tất cả</span><span className="sm:hidden">Đọc tất cả</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Mobile: horizontal pills */}
        <div className="lg:hidden space-y-2">
          <div className="-mx-1 px-1 overflow-x-auto">
            <div className="inline-flex gap-2 pb-1">
              {categories.map((c) => {
                const count = c.id === 'all' ? items.length : items.filter((i) => i.type === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                      cat === c.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    <c.icon size={14} />
                    {c.label}
                    <span className={`text-xs ${cat === c.id ? 'text-white/80' : 'text-gray-400'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <label className="flex items-center gap-2 px-1 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="rounded" />
            Chỉ hiển thị chưa đọc
          </label>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit">
          <p className="text-sm text-gray-900 mb-3">Phân loại</p>
          <div className="space-y-1">
            {categories.map((c) => {
              const count = c.id === 'all' ? items.length : items.filter((i) => i.type === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                    cat === c.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <c.icon size={16} />
                  <span className="flex-1 text-left">{c.label}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 mt-4 p-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="rounded" />
            Chỉ hiển thị chưa đọc
          </label>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl border ${n.read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/30'} p-3 sm:p-4 shadow-sm flex gap-3 sm:gap-4 hover:shadow-md transition`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${n.color} flex items-center justify-center flex-shrink-0`}>
                <n.icon size={20} className="sm:size-[22]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-gray-900 truncate ${!n.read ? '' : 'text-gray-700'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.body}</p>
                <p className="text-xs text-gray-400 mt-2">{n.time}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => openItem(n)} className="text-xs text-emerald-600 hover:underline">Xem</button>
                <button
                  onClick={() => {
                    const removed = n;
                    setItems(items.filter((i) => i.id !== n.id));
                    toast.message('Đã xoá thông báo', {
                      description: removed.title,
                      action: { label: 'Hoàn tác', onClick: () => setItems((p) => [removed, ...p]) },
                    });
                  }}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Bell size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Không có thông báo nào trong phân loại này</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
