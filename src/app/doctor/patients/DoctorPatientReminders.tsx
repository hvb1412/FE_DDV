import { useState } from 'react';
import {
  Bell, AlertTriangle, Calendar, Pill, Activity,
  Utensils, Send, CheckCheck, Clock, Plus, X,
  Search, Filter, PhoneCall, MessageSquare, User,
  ChevronDown, ChevronUp, Siren, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

type ReminderType = 'urgent' | 'appointment' | 'medication' | 'measurement' | 'diet' | 'custom';
type ReminderStatus = 'pending' | 'sent' | 'acknowledged' | 'overdue';

interface Reminder {
  id: number;
  patientId: string;
  patientName: string;
  patientPhone: string;
  diagnosis: string;
  type: ReminderType;
  title: string;
  message: string;
  dueDate: string;
  status: ReminderStatus;
  channel: 'sms' | 'call' | 'app';
  createdAt: string;
  note?: string;
}

const initialReminders: Reminder[] = [
  {
    id: 1,
    patientId: 'BN003',
    patientName: 'Lê Văn C',
    patientPhone: '0933 111 222',
    diagnosis: 'Cholesterol cao',
    type: 'urgent',
    title: 'Chỉ số cholesterol vượt ngưỡng nguy hiểm',
    message: 'Chỉ số cholesterol của bạn đo ngày 08/05 là 240 mg/dL, vượt ngưỡng nguy hiểm. Vui lòng liên hệ bác sĩ ngay hoặc đến phòng khám trong hôm nay.',
    dueDate: '08/05/2026',
    status: 'pending',
    channel: 'call',
    createdAt: 'Hôm nay, 08:00',
  },
  {
    id: 2,
    patientId: 'BN010',
    patientName: 'Dương Thị K',
    patientPhone: '0999 345 678',
    diagnosis: 'Suy dinh dưỡng',
    type: 'appointment',
    title: 'Quá hạn kiểm tra định kỳ 14 ngày',
    message: 'Bạn đã quá hạn lịch kiểm tra định kỳ 14 ngày. Vui lòng đặt lại lịch hẹn để bác sĩ theo dõi tiến trình điều trị.',
    dueDate: '24/04/2026',
    status: 'overdue',
    channel: 'sms',
    createdAt: 'Hôm nay, 07:30',
  },
  {
    id: 3,
    patientId: 'BN007',
    patientName: 'Đặng Văn G',
    patientPhone: '0966 999 000',
    diagnosis: 'Gout',
    type: 'medication',
    title: 'Nhắc uống thuốc Allopurinol buổi tối',
    message: 'Nhắc nhở: Hôm nay bạn chưa cập nhật nhật ký uống thuốc. Vui lòng uống Allopurinol 300mg vào buổi tối sau ăn và xác nhận trong ứng dụng.',
    dueDate: '08/05/2026',
    status: 'pending',
    channel: 'app',
    createdAt: 'Hôm nay, 18:00',
  },
  {
    id: 4,
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    patientPhone: '0912 345 678',
    diagnosis: 'Tiểu đường type 2',
    type: 'measurement',
    title: 'Chưa cập nhật chỉ số glucose hôm nay',
    message: 'Bạn chưa ghi nhận chỉ số đường huyết hôm nay. Vui lòng đo và cập nhật vào ứng dụng để bác sĩ theo dõi liên tục.',
    dueDate: '08/05/2026',
    status: 'sent',
    channel: 'app',
    createdAt: 'Hôm nay, 09:00',
    note: 'Đã gửi lúc 09:15',
  },
  {
    id: 5,
    patientId: 'BN002',
    patientName: 'Trần Thị B',
    patientPhone: '0987 654 321',
    diagnosis: 'Tăng huyết áp',
    type: 'diet',
    title: 'Nhắc tuân thủ chế độ ăn ít muối',
    message: 'Theo dõi tuần này cho thấy huyết áp của bạn tăng nhẹ. Hãy chú ý hạn chế muối dưới 2g/ngày, tránh thức ăn chế biến sẵn và tăng cường rau xanh.',
    dueDate: '08/05/2026',
    status: 'acknowledged',
    channel: 'sms',
    createdAt: 'Hôm qua, 14:00',
    note: 'Bệnh nhân đã xác nhận',
  },
  {
    id: 6,
    patientId: 'BN004',
    patientName: 'Phạm Thị D',
    patientPhone: '0911 222 333',
    diagnosis: 'Béo phì',
    type: 'measurement',
    title: 'Nhắc cân nặng tuần này',
    message: 'Đã đến giờ cân nặng định kỳ hàng tuần! Vui lòng cân và cập nhật số liệu vào ứng dụng để theo dõi tiến trình giảm cân của bạn.',
    dueDate: '08/05/2026',
    status: 'pending',
    channel: 'app',
    createdAt: 'Hôm nay, 07:00',
  },
  {
    id: 7,
    patientId: 'BN005',
    patientName: 'Hoàng Văn E',
    patientPhone: '0944 555 666',
    diagnosis: 'Tim mạch',
    type: 'appointment',
    title: 'Lịch tái khám ngày 12/05/2026',
    message: 'Nhắc nhở: Bạn có lịch tái khám vào ngày 12/05/2026 lúc 10:00 tại phòng khám. Vui lòng xác nhận lịch hẹn.',
    dueDate: '12/05/2026',
    status: 'sent',
    channel: 'sms',
    createdAt: 'Hôm qua, 09:00',
    note: 'Gửi SMS lúc 09:05',
  },
  {
    id: 8,
    patientId: 'BN006',
    patientName: 'Vũ Thị F',
    patientPhone: '0955 777 888',
    diagnosis: 'Thiếu máu',
    type: 'diet',
    title: 'Nhắc bổ sung thực phẩm giàu sắt',
    message: 'Hôm nay bạn có nhớ ăn thực phẩm giàu sắt chưa? Theo thực đơn: gan bò xào, rau dền, đậu đen. Kết hợp với nước cam để tăng hấp thu sắt.',
    dueDate: '08/05/2026',
    status: 'acknowledged',
    channel: 'app',
    createdAt: 'Hôm nay, 11:30',
    note: 'Bệnh nhân phản hồi tích cực',
  },
];

const patients = [
  { id: 'BN001', name: 'Nguyễn Văn A', phone: '0912 345 678', diagnosis: 'Tiểu đường type 2' },
  { id: 'BN002', name: 'Trần Thị B', phone: '0987 654 321', diagnosis: 'Tăng huyết áp' },
  { id: 'BN003', name: 'Lê Văn C', phone: '0933 111 222', diagnosis: 'Cholesterol cao' },
  { id: 'BN004', name: 'Phạm Thị D', phone: '0911 222 333', diagnosis: 'Béo phì' },
  { id: 'BN005', name: 'Hoàng Văn E', phone: '0944 555 666', diagnosis: 'Tim mạch' },
  { id: 'BN006', name: 'Vũ Thị F', phone: '0955 777 888', diagnosis: 'Thiếu máu' },
  { id: 'BN007', name: 'Đặng Văn G', phone: '0966 999 000', diagnosis: 'Gout' },
  { id: 'BN008', name: 'Bùi Thị H', phone: '0977 123 456', diagnosis: 'Loãng xương' },
  { id: 'BN009', name: 'Ngô Văn I', phone: '0988 234 567', diagnosis: 'Tiểu đường type 2' },
  { id: 'BN010', name: 'Dương Thị K', phone: '0999 345 678', diagnosis: 'Suy dinh dưỡng' },
  { id: 'BN011', name: 'Lý Văn L', phone: '0900 456 789', diagnosis: 'Thận mãn tính' },
  { id: 'BN012', name: 'Cao Thị M', phone: '0901 567 890', diagnosis: 'Tăng huyết áp' },
];

const typeConfig: Record<ReminderType, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  urgent:      { label: 'Khẩn cấp',      color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-300',    icon: Siren },
  appointment: { label: 'Lịch hẹn',      color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Calendar },
  medication:  { label: 'Uống thuốc',    color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: Pill },
  measurement: { label: 'Đo chỉ số',     color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: Activity },
  diet:        { label: 'Chế độ ăn',     color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: Utensils },
  custom:      { label: 'Tùy chỉnh',     color: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-200',   icon: Bell },
};

const statusConfig: Record<ReminderStatus, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Chờ gửi',       color: 'text-orange-700', bg: 'bg-orange-100' },
  sent:         { label: 'Đã gửi',        color: 'text-blue-700',   bg: 'bg-blue-100' },
  acknowledged: { label: 'Đã xác nhận',  color: 'text-green-700',  bg: 'bg-green-100' },
  overdue:      { label: 'Quá hạn',       color: 'text-red-700',    bg: 'bg-red-100' },
};

const channelConfig = {
  sms:  { label: 'SMS',          icon: MessageSquare, color: 'text-emerald-600' },
  call: { label: 'Gọi điện',     icon: PhoneCall,     color: 'text-blue-600' },
  app:  { label: 'Thông báo App',icon: Bell,          color: 'text-purple-600' },
};

const messageTemplates: Record<ReminderType, string[]> = {
  urgent: [
    'Chỉ số của bạn vừa vượt ngưỡng nguy hiểm. Vui lòng liên hệ bác sĩ ngay hoặc đến phòng khám trong hôm nay.',
    'Tình trạng sức khỏe của bạn cần được xử lý khẩn. Hãy gọi ngay cho chúng tôi hoặc đến cơ sở y tế gần nhất.',
  ],
  appointment: [
    'Bạn có lịch hẹn sắp tới. Vui lòng xác nhận hoặc liên hệ để đổi lịch nếu không tiện.',
    'Nhắc nhở: bạn đã quá hạn lịch kiểm tra định kỳ. Hãy đặt lại lịch hẹn sớm nhất có thể.',
  ],
  medication: [
    'Đừng quên uống thuốc theo đơn hôm nay. Uống đúng giờ giúp điều trị hiệu quả hơn.',
    'Nhắc nhở uống thuốc buổi tối. Vui lòng uống thuốc sau ăn và xác nhận trong ứng dụng.',
  ],
  measurement: [
    'Vui lòng đo và cập nhật chỉ số sức khỏe hôm nay để bác sĩ theo dõi tiến trình điều trị.',
    'Đã đến giờ kiểm tra định kỳ hàng tuần. Hãy cân và ghi lại kết quả vào ứng dụng.',
  ],
  diet: [
    'Hãy tuân thủ chế độ ăn theo thực đơn bác sĩ đã lên. Điều này rất quan trọng cho quá trình điều trị.',
    'Nhắc bổ sung thực phẩm theo hướng dẫn dinh dưỡng hôm nay. Hãy kiểm tra thực đơn trong ứng dụng.',
  ],
  custom: [],
};

export function DoctorPatientReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [filterType, setFilterType] = useState<'all' | ReminderType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ReminderStatus>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    patientId: '',
    type: 'appointment' as ReminderType,
    title: '',
    message: '',
    dueDate: '',
    channel: 'app' as 'sms' | 'call' | 'app',
  });

  const sendReminder = (id: number) => {
    const prev = reminders.find(r => r.id === id);
    setReminders(p => p.map(r => r.id === id ? { ...r, status: 'sent', note: `Đã gửi lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` } : r));
    toast.success('Đã gửi nhắc nhở', {
      description: `Tới ${prev?.patientName} qua ${channelConfig[prev!.channel].label}`,
      action: prev ? {
        label: 'Hoàn tác',
        onClick: () => setReminders(p => p.map(r => r.id === id ? prev : r)),
      } : undefined,
    });
  };

  const markAcknowledged = (id: number) => {
    const prev = reminders.find(r => r.id === id);
    setReminders(p => p.map(r => r.id === id ? { ...r, status: 'acknowledged', note: 'Đã xác nhận thủ công' } : r));
    toast.success('Đã đánh dấu bệnh nhân xác nhận', {
      action: prev ? {
        label: 'Hoàn tác',
        onClick: () => setReminders(p => p.map(r => r.id === id ? prev : r)),
      } : undefined,
    });
  };

  const deleteReminder = (id: number) => {
    const removed = reminders.find(r => r.id === id);
    if (!removed) return;
    setReminders(p => p.filter(r => r.id !== id));
    toast.error('Đã xoá nhắc nhở', {
      description: removed.title,
      duration: 6000,
      action: {
        label: 'Hoàn tác',
        onClick: () => setReminders(p => [removed, ...p]),
      },
    });
  };

  const handleCreate = () => {
    if (!form.patientId || !form.title || !form.message || !form.dueDate) return;
    const patient = patients.find(p => p.id === form.patientId)!;
    const newReminder: Reminder = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      diagnosis: patient.diagnosis,
      type: form.type,
      title: form.title,
      message: form.message,
      dueDate: form.dueDate,
      status: 'pending',
      channel: form.channel,
      createdAt: 'Vừa tạo',
    };
    setReminders(prev => [newReminder, ...prev]);
    setShowCreateModal(false);
    setForm({ patientId: '', type: 'appointment', title: '', message: '', dueDate: '', channel: 'app' });
    toast.success('Đã tạo nhắc nhở mới', { description: `Cho ${patient.name} • Hạn ${form.dueDate}` });
  };

  const filtered = reminders.filter(r => {
    const matchType = filterType === 'all' || r.type === filterType;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const counts = {
    pending: reminders.filter(r => r.status === 'pending').length,
    overdue: reminders.filter(r => r.status === 'overdue').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    acknowledged: reminders.filter(r => r.status === 'acknowledged').length,
  };

  const selectedPatient = patients.find(p => p.id === form.patientId);

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nhắc nhở bệnh nhân</h1>
            <p className="text-gray-500 mt-1">Gửi nhắc nhở khẩn cấp, lịch hẹn, thuốc và chế độ ăn cho bệnh nhân</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tạo nhắc nhở mới
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Chờ gửi',      value: counts.pending,      bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-700', icon: Clock },
            { label: 'Quá hạn',      value: counts.overdue,      bg: 'bg-red-50',    border: 'border-red-200',    color: 'text-red-700',    icon: AlertTriangle },
            { label: 'Đã gửi',       value: counts.sent,         bg: 'bg-blue-50',   border: 'border-blue-200',   color: 'text-blue-700',   icon: Send },
            { label: 'Đã xác nhận',  value: counts.acknowledged, bg: 'bg-green-50',  border: 'border-green-200',  color: 'text-green-700',  icon: CheckCheck },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4 shadow-sm flex items-center gap-4`}>
                <div className={`p-2 rounded-lg bg-white/70`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bệnh nhân, tiêu đề..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300 w-56"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-400" />
            {(['all', 'urgent', 'appointment', 'medication', 'measurement', 'diet', 'custom'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === t
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'all' ? 'Tất cả loại' : typeConfig[t].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'pending', 'overdue', 'sent', 'acknowledged'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-gray-800 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Mọi trạng thái' : statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
              <Bell size={44} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Không có nhắc nhở nào</p>
              <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo nhắc nhở mới</p>
            </div>
          ) : (
            filtered.map(reminder => {
              const tc = typeConfig[reminder.type];
              const sc = statusConfig[reminder.status];
              const ch = channelConfig[reminder.channel];
              const TypeIcon = tc.icon;
              const ChannelIcon = ch.icon;
              const isExpanded = expandedId === reminder.id;

              return (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                    reminder.type === 'urgent' ? 'border-red-300 ring-1 ring-red-200' :
                    reminder.status === 'overdue' ? 'border-orange-300' : `${tc.border}`
                  }`}
                >
                  <div className="p-4 flex items-start gap-4">
                    {/* Type icon */}
                    <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon size={18} className={tc.color} />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tc.bg} ${tc.color}`}>
                            {tc.label}
                          </span>
                          {reminder.type === 'urgent' && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                              ⚡ KHẨN
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">{reminder.createdAt}</span>
                      </div>

                      <p className="text-sm font-semibold text-gray-900 mt-1.5">{reminder.title}</p>

                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User size={11} />
                          <span>{reminder.patientName}</span>
                          <span className="text-gray-300">•</span>
                          <span>{reminder.patientId}</span>
                          <span className="text-gray-300">•</span>
                          <span>{reminder.diagnosis}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={11} />
                          <span>Hạn: {reminder.dueDate}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${ch.color}`}>
                          <ChannelIcon size={11} />
                          <span>{ch.label}</span>
                        </div>
                      </div>

                      {reminder.note && (
                        <p className="text-xs text-gray-400 mt-1 italic">{reminder.note}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(reminder.status === 'pending' || reminder.status === 'overdue') && (
                        <button
                          onClick={() => sendReminder(reminder.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            reminder.type === 'urgent'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <Send size={12} />
                          Gửi ngay
                        </button>
                      )}
                      {reminder.status === 'sent' && (
                        <button
                          onClick={() => markAcknowledged(reminder.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          <CheckCheck size={12} />
                          Xác nhận
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : reminder.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Nội dung
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded message */}
                  {isExpanded && (
                    <div className={`border-t ${tc.border} px-4 py-3 ${tc.bg}`}>
                      <p className="text-xs font-semibold text-gray-600 mb-1.5">Nội dung tin nhắn sẽ gửi:</p>
                      <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-white/60">
                        {reminder.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">Gửi qua:</span>
                        <span className={`flex items-center gap-1 text-xs font-medium ${ch.color}`}>
                          <ChannelIcon size={11} />
                          {ch.label} — {reminder.patientPhone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Create modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg"><Bell size={18} className="text-green-600" /></div>
                <h2 className="text-lg font-semibold text-gray-900">Tạo nhắc nhở mới</h2>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Patient select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhân <span className="text-red-500">*</span></label>
                <select
                  value={form.patientId}
                  onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <option value="">-- Chọn bệnh nhân --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id}) — {p.diagnosis}</option>
                  ))}
                </select>
                {selectedPatient && (
                  <p className="text-xs text-gray-400 mt-1">📞 {selectedPatient.phone}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại nhắc nhở</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(typeConfig) as ReminderType[]).map(t => {
                    const Icon = typeConfig[t].icon;
                    return (
                      <button
                        key={t}
                        onClick={() => setForm(f => ({ ...f, type: t, message: messageTemplates[t][0] || '' }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          form.type === t
                            ? `${typeConfig[t].bg} ${typeConfig[t].color} ${typeConfig[t].border} border`
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={13} />
                        {typeConfig[t].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Nhập tiêu đề nhắc nhở..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* Message with templates */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Nội dung tin nhắn <span className="text-red-500">*</span></label>
                </div>
                {messageTemplates[form.type].length > 0 && (
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><RefreshCw size={10} /> Mẫu nhanh:</span>
                    {messageTemplates[form.type].map((tpl, i) => (
                      <button
                        key={i}
                        onClick={() => setForm(f => ({ ...f, message: tpl }))}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
                      >
                        Mẫu {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Nhập nội dung nhắc nhở sẽ gửi đến bệnh nhân..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </div>

              {/* Due date + Channel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kênh gửi</label>
                  <select
                    value={form.channel}
                    onChange={e => setForm(f => ({ ...f, channel: e.target.value as 'sms' | 'call' | 'app' }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <option value="app">📱 Thông báo App</option>
                    <option value="sms">💬 SMS</option>
                    <option value="call">📞 Gọi điện</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.patientId || !form.title || !form.message || !form.dueDate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                Tạo & lưu nhắc nhở
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
