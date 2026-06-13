import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ChevronDown, User, Settings, HelpCircle, LogOut,
  LayoutDashboard, Users, Video, MessageCircle, BellRing, ClipboardCheck, BookOpen, FilePlus, Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import { NotificationPopup } from '@/app/shared/components/NotificationPopup';
import { ThemeToggle } from '@/app/shared/components/ThemeToggle';

type PageMeta = { title: string; subtitle?: string; icon: typeof LayoutDashboard };
const titleMap: Record<string, PageMeta> = {
  '/':              { title: 'Bảng điều khiển',     subtitle: 'Tổng quan hoạt động chuyên môn', icon: LayoutDashboard },
  '/d':             { title: 'Bảng điều khiển',     subtitle: 'Tổng quan hoạt động chuyên môn', icon: LayoutDashboard },
  '/patients':      { title: 'Danh sách bệnh nhân', subtitle: 'Quản lý hồ sơ bệnh nhân',         icon: Users },
  '/consultation':  { title: 'Tư vấn trực tuyến',   subtitle: 'Lịch và phòng tư vấn video',      icon: Video },
  '/chat':          { title: 'Chat với bệnh nhân',  subtitle: 'Trao đổi nhanh với bệnh nhân',    icon: MessageCircle },
  '/reminders':     { title: 'Nhắc nhở bệnh nhân',  subtitle: 'Gửi nhắc nhở chăm sóc',           icon: BellRing },
  '/menu-approval': { title: 'Phê duyệt thực đơn',  subtitle: 'Xem xét thực đơn AI đề xuất',     icon: ClipboardCheck },
  '/references':    { title: 'Tài liệu tham khảo',  subtitle: 'Hướng dẫn dinh dưỡng & nghiên cứu', icon: BookOpen },
  '/notifications': { title: 'Thông báo',           subtitle: 'Cập nhật từ hệ thống và bệnh nhân', icon: Bell },
  '/create-menu':   { title: 'Tạo thực đơn',        subtitle: 'Lập thực đơn cho bệnh nhân',      icon: FilePlus },
};

export function DoctorTopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const path = location.pathname.startsWith('/patient/') ? '/patients' : location.pathname;
  const meta = titleMap[path] ?? { title: 'Dinh Dưỡng Việt', icon: LayoutDashboard };
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
              TA
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm text-gray-900 font-medium">Bác sĩ Trần Thị A</p>
                <p className="text-xs text-gray-500">tran.thi.a@dinhduong.vn</p>
              </div>
              <button onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left">
                <User size={16} /> Hồ sơ chuyên gia
              </button>
              <button onClick={() => { setMenuOpen(false); toast.info('Trang cài đặt đang phát triển'); }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left">
                <Settings size={16} /> Cài đặt
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/references'); }}
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
