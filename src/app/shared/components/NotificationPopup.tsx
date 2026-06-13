import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Bell, X, CheckCheck, Calendar, AlertTriangle, MessageSquare, FileText, Activity,
  UserPlus, Pill, Award, Sparkles, MessageCircle, ChevronRight, ShieldAlert, Stethoscope, FileEdit,
} from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  urgent?: boolean;
}

const doctorNotifications: Notification[] = [
  { id: 1, type: 'alert', title: 'Bệnh nhân Lê Văn C cần theo dõi gấp', body: 'Chỉ số cholesterol vượt ngưỡng nguy hiểm (240 mg/dL). Cần can thiệp ngay.', time: 'Vừa xong', read: false, urgent: true },
  { id: 2, type: 'appointment', title: 'Lịch tư vấn hôm nay: 3 cuộc hẹn', body: 'Nguyễn Văn A lúc 9:00, Trần Thị B lúc 11:00, Phạm Thị D lúc 14:30.', time: '1 giờ trước', read: false },
  { id: 3, type: 'menu', title: 'Thực đơn mới cần phê duyệt', body: '8 thực đơn đang chờ xem xét trước khi gửi đến bệnh nhân.', time: '3 giờ trước', read: false },
  { id: 4, type: 'message', title: 'Tin nhắn mới từ Nguyễn Văn A', body: 'Bác sĩ ơi, hôm nay tôi thấy chóng mặt sau khi ăn sáng...', time: '4 giờ trước', read: true },
  { id: 5, type: 'new-patient', title: 'Bệnh nhân mới được chuyển tiếp', body: 'Bệnh nhân Hoàng Văn G (Tiểu đường type 2) được phân công cho bạn.', time: 'Hôm qua', read: true },
];

const patientNotifications: Notification[] = [
  { id: 1, type: 'message', title: 'Tin nhắn từ BS. Trần Thị A', body: 'Tuần sau mình hẹn tái khám online vào thứ 3 lúc 15:00 nhé?', time: '5 phút trước', read: false },
  { id: 2, type: 'reminder', title: 'Đã đến giờ uống thuốc', body: 'Metformin 500mg — 12:00', time: '15 phút trước', read: false, urgent: true },
  { id: 3, type: 'appointment', title: 'Lịch hẹn được xác nhận', body: 'BS. Trần Thị A xác nhận lịch tái khám 21/05 lúc 15:00', time: '2 giờ trước', read: false },
  { id: 4, type: 'achievement', title: 'Bạn vừa nhận huy hiệu mới! 🏆', body: 'Huy hiệu "Streak 12 ngày" — Tiếp tục cố gắng nhé!', time: 'Hôm qua', read: true },
  { id: 5, type: 'tip', title: 'Mẹo dinh dưỡng hôm nay', body: 'Ăn cá hồi 2 lần/tuần giúp giảm cholesterol xấu và tốt cho tim mạch.', time: 'Hôm qua', read: true },
];

const userNotifications: Notification[] = [
  { id: 1, type: 'tip', title: 'Bài viết mới: Ăn gì để khoẻ mạnh?', body: 'Khám phá 7 nhóm thực phẩm nên có trong bữa ăn hàng ngày.', time: '10 phút trước', read: false },
  { id: 2, type: 'achievement', title: 'Bạn đã hoàn thành bài học hôm nay', body: '+10 điểm thưởng vào kho điểm của bạn.', time: '1 giờ trước', read: false },
  { id: 3, type: 'tip', title: 'Cập nhật khuyến nghị dinh dưỡng', body: 'Bộ Y tế vừa công bố hướng dẫn mới cho người trưởng thành.', time: 'Hôm qua', read: true },
];

const adminNotifications: Notification[] = [
  { id: 1, type: 'security', title: '3 lần đăng nhập sai liên tiếp', body: 'Tài khoản admin@dinhduong.vn từ IP 45.118.92.4 — vui lòng kiểm tra.', time: '10 phút trước', read: false, urgent: true },
  { id: 2, type: 'doctor-approval', title: '2 hồ sơ bác sĩ chờ duyệt', body: 'BS. Trần Thị A và BS. Hoàng Văn E gửi yêu cầu xác minh.', time: '1 giờ trước', read: false },
  { id: 3, type: 'content-approval', title: '5 bài viết chờ duyệt nội dung', body: 'Hàng đợi xuất bản đang tăng — xem xét sớm để tránh tồn đọng.', time: '3 giờ trước', read: false },
  { id: 4, type: 'system', title: 'Sao lưu hệ thống thành công', body: 'Bản sao lưu 04:00 hôm nay đã hoàn tất (1.2 GB).', time: 'Hôm nay', read: true },
  { id: 5, type: 'system', title: 'Bảo trì hệ thống sắp diễn ra', body: 'Lịch bảo trì 06/06 23:00 - 01:00, người dùng sẽ được thông báo.', time: 'Hôm qua', read: true },
];

const typeIcon: Record<string, typeof Bell> = {
  alert: AlertTriangle,
  appointment: Calendar,
  message: MessageSquare,
  menu: FileText,
  'new-patient': UserPlus,
  system: Activity,
  reminder: Pill,
  achievement: Award,
  tip: Sparkles,
  security: ShieldAlert,
  'doctor-approval': Stethoscope,
  'content-approval': FileEdit,
};

const typeColor: Record<string, string> = {
  alert: 'bg-red-100 text-red-600',
  appointment: 'bg-blue-100 text-blue-600',
  message: 'bg-emerald-100 text-emerald-600',
  menu: 'bg-purple-100 text-purple-600',
  'new-patient': 'bg-green-100 text-green-600',
  system: 'bg-gray-100 text-gray-500',
  reminder: 'bg-red-100 text-red-600',
  achievement: 'bg-amber-100 text-amber-600',
  tip: 'bg-violet-100 text-violet-600',
  security: 'bg-orange-100 text-orange-600',
  'doctor-approval': 'bg-emerald-100 text-emerald-600',
  'content-approval': 'bg-purple-100 text-purple-600',
};

function resolveRole(pathname: string) {
  if (pathname.startsWith('/a')) return { data: adminNotifications, viewAll: '/a/notifications' };
  if (pathname.startsWith('/p')) return { data: patientNotifications, viewAll: '/p/notifications' };
  if (pathname.startsWith('/u')) return { data: userNotifications, viewAll: '/u/notifications' };
  return { data: doctorNotifications, viewAll: '/d/notifications' };
}

export function NotificationPopup() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = resolveRole(location.pathname);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(role.data);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(resolveRole(location.pathname).data);
  }, [location.pathname]);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const goViewAll = () => {
    setOpen(false);
    navigate(role.viewAll);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg hover:bg-gray-100"
        aria-label="Thông báo"
      >
        <Bell size={20} className="text-gray-700" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-gray-700" />
              <span className="font-semibold text-gray-900 text-sm">Thông báo</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">{unread} mới</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-emerald-50">
                  <CheckCheck size={13} /> Đọc tất cả
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map(n => {
                const Icon = typeIcon[n.type] ?? Activity;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition hover:bg-gray-50 ${!n.read ? 'bg-emerald-50/40' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${typeColor[n.type] ?? 'bg-gray-100 text-gray-500'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug line-clamp-1 ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                          {n.urgent && <span className="text-red-500 mr-1">⚠</span>}
                          {n.title}
                        </p>
                        <button
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 text-gray-300 hover:text-gray-500 mt-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <button
            onClick={goViewAll}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 border-t border-gray-100 text-sm text-emerald-600 hover:bg-emerald-50 font-medium"
          >
            Xem tất cả thông báo
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
