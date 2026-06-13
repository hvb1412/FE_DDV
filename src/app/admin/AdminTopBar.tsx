import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ChevronDown, Settings, HelpCircle, LogOut,
  LayoutDashboard, Users, Stethoscope, FileText, Database, BarChart3, CalendarClock, Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/app/shared/components/ThemeToggle';
import { NotificationPopup } from '@/app/shared/components/NotificationPopup';

type PageMeta = { title: string; subtitle?: string; icon: typeof LayoutDashboard };
const titleMap: Record<string, PageMeta> = {
  '/a':               { title: 'Tổng quan',                subtitle: 'Toàn cảnh hoạt động hệ thống',   icon: LayoutDashboard },
  '/a/users':         { title: 'Quản lý người dùng',       subtitle: 'User, Patient, Doctor, Admin',     icon: Users },
  '/a/doctors':       { title: 'Quản lý bác sĩ',           subtitle: 'Duyệt hồ sơ và theo dõi hoạt động',icon: Stethoscope },
  '/a/appointments':  { title: 'Quản lý lịch hẹn',         subtitle: 'Giám sát lịch hẹn toàn hệ thống',  icon: CalendarClock },
  '/a/content':       { title: 'Quản lý nội dung',         subtitle: 'Bài viết, công thức, thực đơn mẫu',icon: FileText },
  '/a/food-db':       { title: 'Cơ sở dữ liệu dinh dưỡng', subtitle: 'Master data thực phẩm',            icon: Database },
  '/a/reports':       { title: 'Báo cáo & thống kê',       subtitle: 'Xu hướng và chỉ số vận hành',      icon: BarChart3 },
  '/a/notifications': { title: 'Thông báo hệ thống',       subtitle: 'Gửi thông báo tới các nhóm người dùng', icon: Bell },
  '/a/settings':      { title: 'Cài đặt hệ thống',         subtitle: 'Cấu hình chung và phân quyền',     icon: Settings },
};

export function AdminTopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = titleMap[location.pathname] ?? { title: 'Quản trị', icon: LayoutDashboard };
  const PageIcon = meta.icon;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100">
          <PageIcon size={20} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-gray-900 text-base font-semibold leading-tight">{meta.title}</h2>
          {meta.subtitle && <p className="text-xs text-gray-500 mt-0.5">{meta.subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <NotificationPopup />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-bold">
              AD
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm text-gray-900 font-medium">Quản trị viên</p>
                <p className="text-xs text-gray-500">admin@dinhduong.vn</p>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/a/settings'); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left">
                <Settings size={16} /> Cài đặt
              </button>
              <button onClick={() => { setMenuOpen(false); toast.info('Trợ giúp đang phát triển'); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left">
                <HelpCircle size={16} /> Trợ giúp
              </button>
              <div className="border-t border-gray-100">
                <button
                  onClick={() => { setMenuOpen(false); toast.success('Đã đăng xuất'); navigate('/'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 text-left"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

