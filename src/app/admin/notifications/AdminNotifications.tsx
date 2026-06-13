import { useState } from 'react';
import { Bell, Send, Users, Stethoscope, HeartPulse, Megaphone, AlertCircle, Info, CheckCircle2, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

type Audience = 'all' | 'users' | 'patients' | 'doctors';
type NotifType = 'announcement' | 'warning' | 'info' | 'success';

type Sent = {
  id: string;
  title: string;
  audience: Audience;
  type: NotifType;
  sentAt: string;
  recipients: number;
};

const audienceLabel: Record<Audience, string> = {
  all: 'Tất cả người dùng',
  users: 'Người dùng thường',
  patients: 'Bệnh nhân',
  doctors: 'Bác sĩ',
};

const typeConfig: Record<NotifType, { label: string; icon: LucideIcon; cls: string }> = {
  announcement: { label: 'Thông báo',   icon: Megaphone,   cls: 'bg-blue-100 text-blue-700' },
  warning:      { label: 'Cảnh báo',    icon: AlertCircle, cls: 'bg-amber-100 text-amber-700' },
  info:         { label: 'Thông tin',   icon: Info,        cls: 'bg-gray-100 text-gray-700' },
  success:      { label: 'Tin tốt',     icon: CheckCircle2,cls: 'bg-green-100 text-green-700' },
};

const initial: Sent[] = [
  { id: 'N001', title: 'Bảo trì hệ thống 06/06 23:00 - 01:00', audience: 'all',     type: 'warning',      sentAt: '04/06/2026 14:20', recipients: 1284 },
  { id: 'N002', title: 'Tính năng mới: Đánh giá bữa ăn bằng AI', audience: 'users', type: 'announcement', sentAt: '02/06/2026 09:00', recipients: 940 },
  { id: 'N003', title: 'Cập nhật quy định khám tư vấn dinh dưỡng', audience: 'doctors', type: 'info',     sentAt: '30/05/2026 10:30', recipients: 18 },
  { id: 'N004', title: 'Chương trình ưu đãi tháng 6', audience: 'patients', type: 'success',           sentAt: '28/05/2026 16:00', recipients: 326 },
];

type TabKey = 'history' | 'compose';

export function AdminNotifications() {
  const [tab, setTab] = useState<TabKey>('history');
  const [history, setHistory] = useState(initial);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [type, setType] = useState<NotifType>('announcement');

  const audCount: Record<Audience, number> = { all: 1284, users: 940, patients: 326, doctors: 18 };

  const send = () => {
    if (!title.trim() || title.trim().length < 4) { toast.error('Tiêu đề phải có ít nhất 4 ký tự'); return; }
    if (!body.trim() || body.trim().length < 10) { toast.error('Nội dung phải có ít nhất 10 ký tự'); return; }
    if (body.length > 4000) { toast.error('Nội dung tối đa 4000 ký tự'); return; }
    const newItem: Sent = {
      id: `N${String(history.length + 100).padStart(3, '0')}`,
      title: title.trim(), audience, type,
      sentAt: new Date().toLocaleString('vi-VN'),
      recipients: audCount[audience],
    };
    setHistory([newItem, ...history]);
    setTitle(''); setBody('');
    setTab('history');
    toast.success(`Đã gửi thông báo đến ${newItem.recipients.toLocaleString('vi-VN')} người`);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8 space-y-6">
        {/* Page header + tabs */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trung tâm thông báo</h1>
            <p className="text-sm text-gray-500 mt-1">Xem các thông báo đã gửi hoặc soạn thông báo mới cho người dùng.</p>
          </div>
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition ${
                tab === 'history' ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell size={15} /> Lịch sử thông báo
              <span className={`ml-1 px-1.5 rounded-md text-[11px] font-semibold ${tab === 'history' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {history.length}
              </span>
            </button>
            <button
              onClick={() => setTab('compose')}
              className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition ${
                tab === 'compose' ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Send size={15} /> Soạn thông báo
            </button>
          </div>
        </div>

        {tab === 'compose' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 text-white flex items-center justify-center">
              <Send size={16} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Soạn thông báo</h2>
              <p className="text-xs text-gray-500">Gửi đến nhóm người dùng — hỗ trợ thông báo hệ thống dài</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-12 gap-6">
            {/* Left column — settings */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Loại thông báo</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(Object.keys(typeConfig) as NotifType[]).map(k => {
                    const cfg = typeConfig[k]; const Icon = cfg.icon;
                    const active = type === k;
                    return (
                      <button key={k} onClick={() => setType(k)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                          active ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        <Icon size={13} /> {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Đối tượng</label>
                <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)}
                  className="mt-1.5 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
                  <option value="all">Tất cả ({audCount.all.toLocaleString('vi-VN')})</option>
                  <option value="users">Người dùng ({audCount.users.toLocaleString('vi-VN')})</option>
                  <option value="patients">Bệnh nhân ({audCount.patients})</option>
                  <option value="doctors">Bác sĩ ({audCount.doctors})</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Sẽ gửi đến</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{audCount[audience].toLocaleString('vi-VN')}</p>
                <p className="text-xs text-gray-500">{audienceLabel[audience]}</p>
              </div>

              <button onClick={send}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center justify-center gap-1.5">
                <Send size={15} /> Gửi thông báo
              </button>
            </div>

            {/* Right column — title + body */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Tiêu đề</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120}
                  placeholder="Ví dụ: Bảo trì hệ thống ngày 06/06 từ 23:00..."
                  className="mt-1.5 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400" />
                <p className="text-[11px] text-gray-400 mt-1">{title.length}/120</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Nội dung</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} maxLength={4000}
                  placeholder="Nội dung chi tiết. Hỗ trợ thông báo hệ thống dài: mô tả nguyên nhân, phạm vi ảnh hưởng, các bước người dùng cần làm, kênh liên hệ hỗ trợ..."
                  className="mt-1.5 w-full px-3 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 leading-relaxed min-h-[280px] resize-y" />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-gray-400">Mẹo: kéo góc dưới phải để mở rộng vùng soạn thảo</p>
                  <p className="text-[11px] text-gray-400">{body.length}/4000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        )}

        {tab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <Bell size={18} className="text-gray-500" />
            <div>
              <h2 className="font-semibold text-gray-900">Lịch sử thông báo</h2>
              <p className="text-xs text-gray-500">{history.length} thông báo đã gửi</p>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {history.map(n => {
              const cfg = typeConfig[n.type]; const Icon = cfg.icon;
              return (
                <li key={n.id} className="p-5 hover:bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.cls}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          {n.audience === 'doctors' ? <Stethoscope size={12} /> : n.audience === 'patients' ? <HeartPulse size={12} /> : <Users size={12} />}
                          {audienceLabel[n.audience]}
                        </span>
                        <span>·</span>
                        <span>{n.recipients.toLocaleString('vi-VN')} người nhận</span>
                        <span>·</span>
                        <span>{n.sentAt}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {history.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-500">Chưa có thông báo nào được gửi.</div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
