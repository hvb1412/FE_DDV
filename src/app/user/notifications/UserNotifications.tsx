import { useState } from 'react';
import { Bell, Sparkles, Droplets, Award, TrendingUp, CheckCheck, Trash2, Settings2, Camera, MessageCircleQuestion } from 'lucide-react';
import { toast } from 'sonner';

const initial = [
  { id: 1, type: 'tip', icon: Sparkles, title: 'Mẹo dinh dưỡng hôm nay', body: 'Ăn cá hồi 2 lần/tuần giúp giảm cholesterol xấu và tốt cho tim mạch.', time: '8 phút trước', read: false, color: 'text-violet-600 bg-violet-50' },
  { id: 2, type: 'water', icon: Droplets, title: 'Nhắc nhở uống nước', body: 'Bạn mới uống được 0.8L hôm nay. Hãy uống thêm để đạt mục tiêu 2L nhé!', time: '30 phút trước', read: false, color: 'text-sky-600 bg-sky-50' },
  { id: 3, type: 'achievement', icon: Award, title: 'Bạn vừa đạt streak 12 ngày! 🔥', body: 'Tuyệt vời! Bạn đã tra cứu dinh dưỡng 12 ngày liên tiếp. Huy hiệu "Kiên trì" đã được mở khóa.', time: '2 giờ trước', read: false, color: 'text-amber-600 bg-amber-50' },
  { id: 4, type: 'tip', icon: TrendingUp, title: 'Kết quả đánh giá dinh dưỡng', body: 'Điểm đánh giá của bạn tháng này đạt 78% — Tốt hơn tháng trước 5 điểm!', time: 'Hôm qua', read: true, color: 'text-emerald-600 bg-emerald-50' },
  { id: 5, type: 'recognition', icon: Camera, title: 'Nhận diện hoàn thành', body: 'AI đã nhận diện thành công "Phở bò" với độ chính xác 92%. Giá trị: ~450 kcal.', time: 'Hôm qua', read: true, color: 'text-pink-600 bg-pink-50' },
  { id: 6, type: 'water', icon: Droplets, title: 'Uống đủ nước hôm qua 💧', body: 'Bạn đã uống đủ 2L nước hôm qua. Tiếp tục duy trì thói quen tốt này!', time: '2 ngày trước', read: true, color: 'text-sky-600 bg-sky-50' },
  { id: 7, type: 'tip', icon: Sparkles, title: 'Mẹo dinh dưỡng', body: 'Chia nhỏ bữa ăn thành 5-6 lần/ngày giúp ổn định đường huyết và kiểm soát cân nặng hiệu quả hơn.', time: '3 ngày trước', read: true, color: 'text-violet-600 bg-violet-50' },
  { id: 8, type: 'qa', icon: MessageCircleQuestion, title: 'Câu hỏi của bạn đã có phản hồi', body: 'AI đã trả lời câu hỏi "Mỗi ngày nên ăn bao nhiêu protein?" của bạn.', time: '4 ngày trước', read: true, color: 'text-indigo-600 bg-indigo-50' },
];

const categories = [
  { id: 'all', label: 'Tất cả', icon: Bell },
  { id: 'tip', label: 'Mẹo & Kết quả', icon: Sparkles },
  { id: 'water', label: 'Nhắc nhở', icon: Droplets },
  { id: 'achievement', label: 'Thành tích', icon: Award },
  { id: 'recognition', label: 'Nhận diện', icon: Camera },
  { id: 'qa', label: 'Hỏi đáp', icon: MessageCircleQuestion },
];

export function UserNotifications() {
  const [items, setItems] = useState(initial);
  const [cat, setCat] = useState('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const list = items.filter((i) => (cat === 'all' || i.type === cat) && (!onlyUnread || !i.read));
  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{unreadCount} thông báo chưa đọc</p>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm flex items-center gap-1.5 hover:bg-gray-50">
            <Settings2 size={14} /> Cài đặt thông báo
          </button>
          <button
            onClick={() => {
              const snapshot = items;
              setItems(items.map((i) => ({ ...i, read: true })));
              toast.success('Đã đánh dấu tất cả là đã đọc', {
                action: { label: 'Hoàn tác', onClick: () => setItems(snapshot) },
              });
            }}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm flex items-center gap-1.5 hover:bg-emerald-700"
          >
            <CheckCheck size={14} /> Đánh dấu đã đọc tất cả
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit">
          <p className="text-sm text-gray-900 mb-3">Phân loại</p>
          <div className="space-y-1">
            {categories.map((c) => {
              const count = c.id === 'all' ? items.length : items.filter((i) => i.type === c.id).length;
              const unread = c.id === 'all' ? unreadCount : items.filter((i) => i.type === c.id && !i.read).length;
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
                  {unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 mt-4 p-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="rounded" />
            Chỉ hiển thị chưa đọc
          </label>
        </div>

        {/* Notification list */}
        <div className="col-span-3 space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => setItems(items.map((i) => i.id === n.id ? { ...i, read: true } : i))}
              className={`bg-white rounded-2xl border ${n.read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/30'} p-4 shadow-sm flex gap-4 hover:shadow-md transition cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-xl ${n.color} flex items-center justify-center flex-shrink-0`}>
                <n.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.body}</p>
                <p className="text-xs text-gray-400 mt-2">{n.time}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const removed = n;
                    setItems(items.filter((i) => i.id !== n.id));
                    toast.message('Đã xoá thông báo', {
                      description: removed.title,
                      action: { label: 'Hoàn tác', onClick: () => setItems((p) => [removed, ...p]) },
                    });
                  }}
                  className="p-1.5 text-gray-300 hover:bg-gray-100 hover:text-red-500 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Bell size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">Không có thông báo nào</p>
              <p className="text-gray-400 text-xs mt-1">Các thông báo mới sẽ xuất hiện tại đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
