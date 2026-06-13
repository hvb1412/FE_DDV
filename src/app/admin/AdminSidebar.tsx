import {
  LayoutDashboard, Users, Stethoscope, FileText, Database,
  BarChart3, Bell, Settings, Leaf, ShieldCheck, CalendarClock,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAppointments } from '@/app/shared/stores/appointmentStore';

const navItems = [
  { name: 'Tổng quan',                  icon: LayoutDashboard, path: '/a' },
  { name: 'Người dùng',                 icon: Users,           path: '/a/users' },
  { name: 'Bác sĩ',                     icon: Stethoscope,     path: '/a/doctors' },
  { name: 'Lịch hẹn',                   icon: CalendarClock,   path: '/a/appointments', badgeKey: 'disputed' as const },
  { name: 'Nội dung',                   icon: FileText,        path: '/a/content' },
  { name: 'Cơ sở dữ liệu dinh dưỡng',   icon: Database,        path: '/a/food-db' },
  { name: 'Báo cáo & thống kê',         icon: BarChart3,       path: '/a/reports' },
  { name: 'Thông báo',                  icon: Bell,            path: '/a/notifications' },
  { name: 'Cài đặt hệ thống',           icon: Settings,        path: '/a/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { appointments } = useAppointments();
  const disputedCount = appointments.filter(a => a.status === 'disputed').length;

  return (
    <aside
      className="w-64 h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #14532d 0%, #166534 45%, #15803d 100%)',
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-green-900/40 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
          <Leaf size={24} className="text-green-300" />
        </div>
        <div>
          <h1 className="text-white text-base font-bold leading-tight">Dinh Dưỡng Việt</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-amber-900">
              <ShieldCheck size={10} /> Admin
            </span>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="p-4 border-b border-green-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Quản trị viên</p>
            <p className="text-xs text-green-300">Toàn quyền hệ thống</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/a'
              ? location.pathname === '/a'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-green-700 shadow font-semibold'
                  : 'text-green-100 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium flex-1">{item.name}</span>
              {item.badgeKey === 'disputed' && disputedCount > 0 && (
                <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  isActive ? 'bg-red-100 text-red-700' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {disputedCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer brand */}
      <div className="px-4 py-3 border-t border-green-900/40 flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center ring-1 ring-white/10 flex-shrink-0">
          <Leaf size={14} className="text-green-300" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] text-green-100 font-semibold">© 2026 Dinh Dưỡng Việt</p>
          <p className="text-[10px] text-green-300/80">Vì sức khoẻ người Việt</p>
        </div>
      </div>
    </aside>
  );
}
