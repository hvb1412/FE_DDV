import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Users, HeartPulse, Stethoscope, FileText, UserPlus, ClipboardCheck, Download,
  ShieldAlert, CheckCircle2, AlertTriangle, FileEdit, UserCheck, ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { MetricCard } from '@/app/shared/components/MetricCard';
import { SvgLineChart, SvgBarChart } from '@/app/admin/reports/SvgCharts';
import { toast } from 'sonner';

const initialNewUsers = [
  { week: 'T1', users: 24 },
  { week: 'T2', users: 32 },
  { week: 'T3', users: 28 },
  { week: 'T4', users: 41 },
  { week: 'T5', users: 38 },
  { week: 'T6', users: 47 },
  { week: 'T7', users: 52 },
  { week: 'T8', users: 61 },
];

const initialLookups = [
  { day: 'T2', queries: 320 },
  { day: 'T3', queries: 410 },
  { day: 'T4', queries: 290 },
  { day: 'T5', queries: 480 },
  { day: 'T6', queries: 530 },
  { day: 'T7', queries: 610 },
  { day: 'CN', queries: 440 },
];

const initialKpis = [
  { title: 'Tổng người dùng',         value: 1284, route: '/a/users',   trend: '+47 trong 7 ngày qua' },
  { title: 'Bệnh nhân đang theo dõi', value: 326,  route: '/a/users',   trend: '+12 so với tuần trước' },
  { title: 'Bác sĩ hoạt động',        value: 18,   route: '/a/doctors', trend: '2 chờ duyệt hồ sơ' },
  { title: 'Bài viết đã xuất bản',    value: 142,  route: '/a/content', trend: '5 chờ duyệt nội dung' },
];

const kpiVisuals = [
  { icon: Users,       color: 'blue'   as const },
  { icon: HeartPulse,  color: 'green'  as const },
  { icon: Stethoscope, color: 'purple' as const },
  { icon: FileText,    color: 'orange' as const },
];

function jitter(v: number, pct = 0.05) {
  const delta = Math.round(v * pct * (Math.random() * 2 - 1));
  return Math.max(0, v + delta);
}

type EventType = 'user' | 'doctor' | 'content' | 'warning';
type Event = {
  id: string;
  actor: string;
  action: string;
  time: string;
  type: EventType;
};

const initialEvents: Event[] = [
  { id: 'e1', actor: 'Nguyễn Văn A',  action: 'đăng ký tài khoản người dùng mới',       time: '2 phút trước', type: 'user' },
  { id: 'e2', actor: 'BS. Trần Thị A', action: 'gửi yêu cầu duyệt hồ sơ chuyên gia',    time: '15 phút trước', type: 'doctor' },
  { id: 'e3', actor: 'Phạm Văn C',     action: 'xuất bản bài viết "10 món ăn cho người tiểu đường"', time: '38 phút trước', type: 'content' },
  { id: 'e4', actor: 'Hệ thống',       action: 'phát hiện 3 lần đăng nhập sai mật khẩu', time: '1 giờ trước',  type: 'warning' },
  { id: 'e5', actor: 'Lê Thị D',       action: 'cập nhật hồ sơ bệnh nhân',               time: '2 giờ trước',  type: 'user' },
  { id: 'e6', actor: 'BS. Hoàng Văn E',action: 'tạo lịch hẹn cho bệnh nhân Trần Thị B',  time: '3 giờ trước',  type: 'doctor' },
];

const eventConfig: Record<EventType, { icon: LucideIcon; color: string; route: string; label: string }> = {
  user:    { icon: UserCheck,    color: 'bg-blue-50 text-blue-600',       route: '/a/users',         label: 'Người dùng' },
  doctor:  { icon: Stethoscope,  color: 'bg-emerald-50 text-emerald-600', route: '/a/doctors',       label: 'Bác sĩ' },
  content: { icon: FileEdit,     color: 'bg-purple-50 text-purple-600',   route: '/a/content',       label: 'Nội dung' },
  warning: { icon: ShieldAlert,  color: 'bg-orange-50 text-orange-600',   route: '/a/notifications', label: 'Bảo mật' },
};

type FilterKey = 'all' | EventType;

export function AdminDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [kpiData, setKpiData] = useState(initialKpis);
  const [newUsersData, setNewUsersData] = useState(initialNewUsers);
  const [lookupData, setLookupData] = useState(initialLookups);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);

  const filteredEvents = useMemo(
    () => initialEvents.filter(e => filter === 'all' || e.type === filter),
    [filter]
  );

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setKpiData(prev => prev.map(k => ({ ...k, value: jitter(k.value, 0.04) })));
      setNewUsersData(prev => prev.map(d => ({ ...d, users: jitter(d.users, 0.08) })));
      setLookupData(prev => prev.map(d => ({ ...d, queries: jitter(d.queries, 0.08) })));
      setLastUpdated(new Date());
      setRefreshing(false);
      toast.success('Đã làm mới dữ liệu');
    }, 500);
  };

  const kpis = kpiData.map((k, i) => ({ ...k, ...kpiVisuals[i] }));

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
            <p className="text-sm text-gray-500 mt-1">Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')} · {lastUpdated.toLocaleDateString('vi-VN')}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Đang làm mới...' : 'Làm mới'}
          </button>
        </div>

        {/* KPI cards (clickable) */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {kpis.map((k) => (
            <button
              key={k.title}
              onClick={() => navigate(k.route)}
              className="text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg h-full block"
            >
              <MetricCard title={k.title} value={k.value} icon={k.icon} color={k.color} trend={k.trend} />
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">Người dùng mới theo tuần</h2>
                <p className="text-xs text-gray-500 mt-0.5">8 tuần gần nhất</p>
              </div>
              <button onClick={() => navigate('/a/reports')} className="text-xs text-green-600 hover:text-green-700 font-medium">
                Xem báo cáo →
              </button>
            </div>
            <SvgLineChart height={280} data={newUsersData.map(d => ({ label: d.week, value: d.users }))} />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="font-semibold text-gray-900">Lượt tra cứu dinh dưỡng</h2>
                <p className="text-xs text-gray-500 mt-0.5">7 ngày gần nhất</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">Tổng tuần</p>
                  <p className="text-lg font-bold text-emerald-700 leading-tight">
                    {lookupData.reduce((s, d) => s + d.queries, 0).toLocaleString('vi-VN')}
                  </p>
                </div>
                <button onClick={() => navigate('/a/food-db')} className="text-xs text-green-600 hover:text-green-700 font-medium">
                  Mở CSDL →
                </button>
              </div>
            </div>
            <SvgBarChart height={280} data={lookupData.map(d => ({ label: d.day, value: d.queries }))} />
          </div>
        </div>

        {/* Activity + Quick actions */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">Hoạt động gần đây</h2>
                <p className="text-xs text-gray-500 mt-0.5">Các sự kiện vừa xảy ra trong hệ thống</p>
              </div>
              <button onClick={() => navigate('/a/settings')} className="text-xs text-green-600 hover:text-green-700 font-medium">
                Xem nhật ký →
              </button>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {(['all', 'user', 'doctor', 'content', 'warning'] as FilterKey[]).map(k => {
                const active = filter === k;
                const label = k === 'all' ? 'Tất cả' : eventConfig[k].label;
                return (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                      active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {filteredEvents.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">Không có sự kiện trong bộ lọc này.</div>
            ) : (
              <ul className="space-y-2">
                {filteredEvents.map((e) => {
                  const cfg = eventConfig[e.type];
                  const Icon = cfg.icon;
                  return (
                    <li key={e.id}>
                      <button
                        onClick={() => navigate(cfg.route)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{e.actor}</span> {e.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{e.time}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-2" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Thao tác nhanh</h2>
            <p className="text-xs text-gray-500 mb-4">Các hành động thường dùng</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/a/doctors')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-emerald-50 text-left transition"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Thêm bác sĩ</p>
                  <p className="text-[11px] text-gray-500">Cấp tài khoản mới</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/a/content')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-emerald-50 text-left transition"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ClipboardCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Duyệt nội dung</p>
                  <p className="text-[11px] text-gray-500">5 mục chờ duyệt</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/a/reports')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-emerald-50 text-left transition"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Download size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Xuất báo cáo</p>
                  <p className="text-[11px] text-gray-500">PDF / Excel toàn hệ thống</p>
                </div>
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Trạng thái hệ thống</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-gray-700">API hoạt động bình thường</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-gray-700">Sao lưu mới nhất: 04:00 hôm nay</span>
                </div>
                <button
                  onClick={() => navigate('/a/notifications')}
                  className="flex items-center gap-2 text-xs w-full hover:bg-amber-50 rounded p-1 -m-1 transition text-left"
                >
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                  <span className="text-gray-700 flex-1">2 cảnh báo bảo mật chờ xử lý</span>
                  <ChevronRight size={12} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
