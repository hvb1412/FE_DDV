import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import {
  Home, UtensilsCrossed, HeartPulse, MessageCircle, Calendar, BellRing,
  Camera, Search, Calculator, ClipboardCheck, MessageCircleQuestion, BookMarked,
  GraduationCap, Award, Bell, User, Settings, HelpCircle, ArrowLeftRight, ChevronDown, LogOut, Leaf,
  Menu, X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { NotificationPopup } from '@/app/shared/components/NotificationPopup';
import { ThemeToggle } from '@/app/shared/components/ThemeToggle';

const navGroups = [
  {
    label: 'TỔNG QUAN',
    items: [
      { to: '/p/home', icon: Home, label: 'Trang chủ' },
      { to: '/p/menu', icon: UtensilsCrossed, label: 'Thực đơn của tôi' },
      { to: '/p/health', icon: HeartPulse, label: 'Sức khoẻ của tôi' },
    ],
  },
  {
    label: 'TƯƠNG TÁC VỚI BÁC SĨ',
    items: [
      { to: '/p/chat', icon: MessageCircle, label: 'Tin nhắn', badge: 2 },
      { to: '/p/appointments', icon: Calendar, label: 'Lịch hẹn' },
      { to: '/p/reminders', icon: BellRing, label: 'Nhắc nhở' },
    ],
  },
  {
    label: 'CÔNG CỤ DINH DƯỠNG',
    items: [
      { to: '/p/scan', icon: Camera, label: 'Nhận diện món ăn' },
      { to: '/p/food-search', icon: Search, label: 'Tra cứu thực phẩm' },
      { to: '/p/calculator', icon: Calculator, label: 'Tính nhu cầu năng lượng' },
      { to: '/p/assessment', icon: ClipboardCheck, label: 'Đánh giá dinh dưỡng' },
      { to: '/p/qa', icon: MessageCircleQuestion, label: 'Hỏi đáp AI' },
      { to: '/p/recommendations', icon: BookMarked, label: 'Nhu cầu khuyến nghị' },
    ],
  },
  {
    label: 'HỌC & THƯỞNG',
    items: [
      { to: '/p/learning', icon: GraduationCap, label: 'Học mỗi ngày' },
      { to: '/p/rewards', icon: Award, label: 'Điểm thưởng' },
    ],
  },
];

type PageMeta = { title: string; subtitle: string; icon: typeof Home };
const titleMap: Record<string, PageMeta> = {
  '/p/home':            { title: 'Trang chủ',                       subtitle: 'Chào mừng trở lại, Minh', icon: Home },
  '/p/menu':            { title: 'Thực đơn của tôi',                subtitle: 'Kế hoạch ăn uống cá nhân hoá', icon: UtensilsCrossed },
  '/p/health':          { title: 'Sức khoẻ của tôi',                subtitle: 'Theo dõi chỉ số và tiến độ', icon: HeartPulse },
  '/p/chat':            { title: 'Tin nhắn',                        subtitle: 'Trao đổi với bác sĩ và đội ngũ hỗ trợ', icon: MessageCircle },
  '/p/appointments':    { title: 'Lịch hẹn',                        subtitle: 'Quản lý lịch tư vấn và tái khám', icon: Calendar },
  '/p/reminders':       { title: 'Nhắc nhở của tôi',                subtitle: 'Lịch uống thuốc, đo chỉ số, ăn uống', icon: BellRing },
  '/p/scan':            { title: 'Nhận diện món ăn',                subtitle: 'Chụp ảnh để phân tích dinh dưỡng', icon: Camera },
  '/p/food-search':     { title: 'Tra cứu thực phẩm',               subtitle: 'Thông tin dinh dưỡng hàng nghìn món', icon: Search },
  '/p/calculator':      { title: 'Tính nhu cầu năng lượng',         subtitle: 'BMR, TDEE và phân bổ vĩ chất', icon: Calculator },
  '/p/assessment':      { title: 'Đánh giá dinh dưỡng',             subtitle: 'Đo lường tình trạng và khuyến nghị', icon: ClipboardCheck },
  '/p/qa':              { title: 'Hỏi đáp dinh dưỡng',              subtitle: 'AI trả lời câu hỏi của bạn', icon: MessageCircleQuestion },
  '/p/recommendations': { title: 'Nhu cầu dinh dưỡng khuyến nghị',  subtitle: 'Theo độ tuổi, giới tính, tình trạng', icon: BookMarked },
  '/p/learning':        { title: 'Học mỗi ngày',                    subtitle: 'Bài học và mẹo dinh dưỡng', icon: GraduationCap },
  '/p/rewards':         { title: 'Điểm thưởng & Huy hiệu',          subtitle: 'Khích lệ duy trì thói quen tốt', icon: Award },
  '/p/notifications':   { title: 'Thông báo',                       subtitle: 'Cập nhật từ hệ thống và đội ngũ y tế', icon: Bell },
  '/p/profile':         { title: 'Hồ sơ của tôi',                   subtitle: 'Thông tin cá nhân và mục tiêu', icon: User },
  '/p/settings':        { title: 'Cài đặt',                         subtitle: 'Tuỳ chỉnh tài khoản và quyền riêng tư', icon: Settings },
  '/p/support':         { title: 'Hỗ trợ',                          subtitle: 'Liên hệ và hướng dẫn sử dụng', icon: HelpCircle },
};

export function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = titleMap[location.pathname] ?? { title: 'Dinh Dưỡng Việt', subtitle: '', icon: Home };
  const PageIcon = meta.icon;

  // Đóng drawer khi chuyển trang (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  const goTo = (to: string) => {
    setUserMenuOpen(false);
    navigate(to);
  };

  const doLogout = () => {
    setUserMenuOpen(false);
    toast.success('Đã đăng xuất. Hẹn gặp lại!');
    navigate('/');
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen flex flex-col flex-shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #14532d 0%, #166534 45%, #15803d 100%)' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-green-900/40 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
            <Leaf size={24} className="text-green-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-base font-bold leading-tight">Dinh Dưỡng Việt</h1>
            <p className="text-xs text-green-300 mt-0.5">Cá nhân hoá sức khoẻ</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-green-100 hover:bg-white/15 transition"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-green-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white ring-2 ring-white/30">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Nguyễn Văn Minh</p>
              <p className="text-xs text-green-300">🥈 Bạc • 245 điểm</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 sidebar-scroll">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] text-green-400 px-3 mb-1 tracking-wider">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? 'bg-white text-green-700 shadow font-semibold'
                          : 'text-green-100 hover:bg-white/15'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span className="text-sm flex-1">{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden app-main">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition flex-shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100 flex-shrink-0">
              <PageIcon size={20} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-gray-900 text-base font-semibold leading-tight truncate">{meta.title}</h2>
              {meta.subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate hidden sm:block">{meta.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <ThemeToggle />
            <NotificationPopup />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className={`flex items-center gap-2 p-1 rounded-lg transition ${
                  userMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white ring-2 ring-white">
                  M
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-64 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50 overflow-hidden"
                >
                  {/* Header — click to open full profile */}
                  <button
                    onClick={() => goTo('/p/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white flex-shrink-0">
                      M
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">Nguyễn Văn Minh</p>
                      <p className="text-xs text-gray-500 truncate">minh.nguyen@example.com</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">🥈 Bạc • 245 điểm</p>
                    </div>
                  </button>

                  {/* Navigation items */}
                  {[
                    { to: '/p/profile', icon: User, label: 'Hồ sơ của tôi' },
                    { to: '/p/settings', icon: Settings, label: 'Cài đặt' },
                    { to: '/p/support', icon: HelpCircle, label: 'Trợ giúp' },
                  ].map((m) => {
                    const active = location.pathname === m.to;
                    return (
                      <button
                        key={m.to}
                        role="menuitem"
                        onClick={() => goTo(m.to)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition ${
                          active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <m.icon size={16} />
                        <span className="flex-1">{m.label}</span>
                        {active && <span className="text-[10px] text-emerald-600">●</span>}
                      </button>
                    );
                  })}

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      role="menuitem"
                      onClick={doLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 text-left transition"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
