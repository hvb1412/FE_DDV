import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, CheckCheck, Trash2, Calendar, FileText,
  AlertTriangle, MessageSquare, UserPlus, Activity, Filter, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: number;
  type: 'appointment' | 'alert' | 'message' | 'new-patient' | 'menu' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  urgent?: boolean;
  link?: string;
  linkLabel?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    title: 'Cảnh báo: Bệnh nhân Lê Văn C cần theo dõi gấp',
    body: 'Chỉ số cholesterol mới cập nhật vượt ngưỡng nguy hiểm (240 mg/dL). Cần lên kế hoạch can thiệp ngay.',
    time: 'Vừa xong',
    read: false,
    urgent: true,
    link: '/reminders',
    linkLabel: 'Gửi nhắc nhở khẩn đến bệnh nhân',
  },
  {
    id: 2,
    type: 'appointment',
    title: 'Lịch tư vấn hôm nay: 3 cuộc hẹn',
    body: 'Bạn có lịch tư vấn với Nguyễn Văn A lúc 9:00, Trần Thị B lúc 11:00 và Phạm Thị D lúc 14:30.',
    time: '1 giờ trước',
    read: false,
    urgent: false,
    link: '/consultation',
    linkLabel: 'Vào phòng tư vấn',
  },
  {
    id: 3,
    type: 'alert',
    title: 'Bệnh nhân Dương Thị K chưa kiểm tra định kỳ',
    body: 'Bệnh nhân ID BN010 đã quá hạn kiểm tra định kỳ 14 ngày. Vui lòng liên hệ để đặt lại lịch hẹn.',
    time: '2 giờ trước',
    read: false,
    urgent: true,
    link: '/reminders',
    linkLabel: 'Nhắc nhở bệnh nhân ngay',
  },
  {
    id: 4,
    type: 'menu',
    title: 'Thực đơn mới cần phê duyệt',
    body: 'Có 8 thực đơn được tạo tự động đang chờ bạn xem xét và phê duyệt trước khi gửi đến bệnh nhân.',
    time: '3 giờ trước',
    read: false,
    urgent: false,
    link: '/menu-approval',
    linkLabel: 'Xem & phê duyệt thực đơn',
  },
  {
    id: 5,
    type: 'new-patient',
    title: 'Bệnh nhân mới đăng ký: Vũ Thị F',
    body: 'Bệnh nhân Vũ Thị F (34 tuổi, Nữ) đã đăng ký tư vấn. Chẩn đoán ban đầu: Thiếu máu. Hồ sơ đang chờ tiếp nhận.',
    time: '5 giờ trước',
    read: true,
    urgent: false,
    link: '/patients',
    linkLabel: 'Tiếp nhận hồ sơ',
  },
  {
    id: 6,
    type: 'message',
    title: 'Tin nhắn từ bệnh nhân Nguyễn Văn A',
    body: '"Bác sĩ ơi, em ăn theo thực đơn 3 tuần rồi nhưng cân nặng chưa giảm thêm. Em có cần điều chỉnh gì không ạ?"',
    time: 'Hôm qua, 18:45',
    read: true,
    urgent: false,
    link: '/consultation',
    linkLabel: 'Trả lời tin nhắn',
  },
  {
    id: 7,
    type: 'appointment',
    title: 'Nhắc nhở: Lịch tư vấn ngày mai',
    body: 'Bạn có 2 cuộc tư vấn trực tuyến vào ngày 09/05/2026: Hoàng Văn E (10:00) và Bùi Thị H (15:00).',
    time: 'Hôm qua, 14:00',
    read: true,
    urgent: false,
    link: '/consultation',
    linkLabel: 'Xem lịch tư vấn',
  },
  {
    id: 8,
    type: 'system',
    title: 'Cập nhật hệ thống thành công',
    body: 'Hệ thống Dinh Dưỡng Việt đã được cập nhật lên phiên bản 2.4.1 với các cải tiến về hiệu suất và bảo mật.',
    time: '2 ngày trước',
    read: true,
    urgent: false,
    link: '/',
    linkLabel: 'Về bảng điều khiển',
  },
  {
    id: 9,
    type: 'menu',
    title: 'Thực đơn tháng 5 đã được gửi đến 12 bệnh nhân',
    body: 'Hệ thống đã tự động gửi thực đơn cá nhân hóa tháng 5/2026 đến 12 bệnh nhân đang điều trị.',
    time: '3 ngày trước',
    read: true,
    urgent: false,
    link: '/menu-approval',
    linkLabel: 'Quản lý thực đơn',
  },
  {
    id: 10,
    type: 'new-patient',
    title: 'Tiếp nhận thành công: Cao Thị M',
    body: 'Hồ sơ bệnh nhân Cao Thị M đã được tạo và phân công cho bạn. Lịch khám đầu tiên: 04/05/2026.',
    time: '4 ngày trước',
    read: true,
    urgent: false,
    link: '/patients',
    linkLabel: 'Xem hồ sơ',
  },
];

const typeConfig = {
  appointment: { icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
  alert: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  message: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'new-patient': { icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50' },
  menu: { icon: FileText, color: 'text-green-700', bg: 'bg-green-100' },
  system: { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100' },
};

const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'alert', label: 'Cảnh báo' },
  { value: 'appointment', label: 'Lịch hẹn' },
  { value: 'message', label: 'Tin nhắn' },
  { value: 'menu', label: 'Thực đơn' },
  { value: 'new-patient', label: 'Bệnh nhân mới' },
];

export function DoctorNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    const removed = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (removed) {
      toast.message('Đã xoá thông báo', {
        description: removed.title,
        action: { label: 'Hoàn tác', onClick: () => setNotifications((p) => [removed, ...p]) },
      });
    }
  };

  const clearAll = () => {
    const snapshot = notifications;
    setNotifications([]);
    toast.error(`Đã xoá ${snapshot.length} thông báo`, {
      duration: 6000,
      action: { label: 'Hoàn tác', onClick: () => setNotifications(snapshot) },
    });
  };

  const handleNotifClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0 ? (
                  <span>Bạn có <span className="text-green-600 font-medium">{unreadCount} thông báo chưa đọc</span></span>
                ) : (
                  'Tất cả thông báo đã được đọc'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <CheckCheck size={16} />
                Đánh dấu tất cả đã đọc
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={15} className="text-gray-400" />
          {filterOptions.map((opt) => {
            const count =
              opt.value === 'all'
                ? notifications.length
                : opt.value === 'unread'
                ? unreadCount
                : notifications.filter((n) => n.type === opt.value).length;

            return (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === opt.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
                {count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === opt.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-16 text-center text-gray-400">
            <Bell size={44} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">Không có thông báo nào</p>
            <p className="text-sm mt-1">Tất cả thông báo đã được xử lý</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => {
              const cfg = typeConfig[notif.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`bg-white rounded-lg border shadow-sm p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all group ${
                    notif.urgent
                      ? 'border-orange-200 hover:border-orange-300'
                      : notif.read
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-green-200 hover:border-green-300'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={18} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notif.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Khẩn cấp
                          </span>
                        )}
                        <h3
                          className={`text-sm leading-snug ${
                            notif.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'
                          }`}
                        >
                          {notif.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{notif.time}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 ml-1" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{notif.body}</p>

                    {/* Link hint */}
                    {notif.link && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={12} />
                        {notif.linkLabel}
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
                    title="Xóa thông báo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}