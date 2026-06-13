import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import {
  Home, Search, Calculator, ClipboardCheck, MessageCircleQuestion,
  BookMarked, Camera, HelpCircle, Bell, User, Settings, ChevronDown,
  LogOut, ArrowLeftRight, UtensilsCrossed, Leaf, ChefHat,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NotificationPopup } from '@/app/shared/components/NotificationPopup';
import { ThemeToggle } from '@/app/shared/components/ThemeToggle';

const navGroups = [
  {
    label: 'TỔNG QUAN',
    items: [
      { to: '/u/home', icon: Home, label: 'Trang chủ' },
    ],
  },
  {
    label: 'CÔNG CỤ DINH DƯỠNG',
    items: [
      { to: '/u/calculator', icon: Calculator, label: 'Tính nhu cầu năng lượng' },
      { to: '/u/food-search', icon: Search, label: 'Tra cứu thực phẩm' },
      { to: '/u/dish-search', icon: UtensilsCrossed, label: 'Tra cứu món ăn' },
      { to: '/u/menu-builder', icon: ChefHat, label: 'Lên thực đơn hôm nay' },
      { to: '/u/recommendations', icon: BookMarked, label: 'Nhu cầu khuyến nghị' },
      { to: '/u/assessment', icon: ClipboardCheck, label: 'Đánh giá dinh dưỡng' },
      { to: '/u/recognition', icon: Camera, label: 'Nhận diện món ăn' },
    ],
  },
  {
    label: 'HỖ TRỢ',
    items: [
      { to: '/u/qa', icon: MessageCircleQuestion, label: 'Hỏi đáp dinh dưỡng' },
      { to: '/u/support', icon: HelpCircle, label: 'Hỗ trợ' },
    ],
  },
  {
    label: 'TÀI KHOẢN',
    items: [
      { to: '/u/profile', icon: User, label: 'Hồ sơ cá nhân' },
      { to: '/u/settings', icon: Settings, label: 'Cài đặt' },
    ],
  },
];

type PageMeta = { title: string; subtitle: string; icon: typeof Home };
const titleMap: Record<string, PageMeta> = {
  '/u/home':            { title: 'Trang chủ',                       subtitle: 'Chào mừng, Nguyễn Văn Minh',          icon: Home },
  '/u/calculator':      { title: 'Tính nhu cầu năng lượng',         subtitle: 'BMR, TDEE và phân bổ vi chất',        icon: Calculator },
  '/u/food-search':     { title: 'Tra cứu thực phẩm',               subtitle: 'Giá trị dinh dưỡng hàng nghìn món',   icon: Search },
  '/u/dish-search':     { title: 'Tra cứu món ăn',                  subtitle: 'Thông tin dinh dưỡng món ăn Việt',    icon: UtensilsCrossed },
  '/u/menu-builder':    { title: 'Lên thực đơn hôm nay',            subtitle: 'Tự xây dựng thực đơn theo nhu cầu',   icon: ChefHat },
  '/u/recommendations': { title: 'Nhu cầu dinh dưỡng khuyến nghị',  subtitle: 'Theo độ tuổi, giới tính, tình trạng', icon: BookMarked },
  '/u/assessment':      { title: 'Đánh giá dinh dưỡng',             subtitle: 'Đo lường tình trạng và khuyến nghị',  icon: ClipboardCheck },
  '/u/recognition':     { title: 'Nhận diện món ăn',                subtitle: 'Chụp ảnh để phân tích dinh dưỡng',    icon: Camera },
  '/u/qa':              { title: 'Hỏi đáp dinh dưỡng',              subtitle: 'AI trả lời câu hỏi của bạn',          icon: MessageCircleQuestion },
  '/u/support':         { title: 'Hỗ trợ',                          subtitle: 'Liên hệ và hướng dẫn sử dụng',        icon: HelpCircle },
  '/u/profile':         { title: 'Hồ sơ cá nhân',                   subtitle: 'Thông tin cá nhân và mục tiêu',       icon: User },
  '/u/settings':        { title: 'Cài đặt',                         subtitle: 'Tuỳ chỉnh tài khoản và quyền riêng tư', icon: Settings },
  '/u/notifications':   { title: 'Thông báo',                       subtitle: 'Cập nhật từ hệ thống',                icon: Bell },
};

export function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const meta = titleMap[location.pathname] ?? { title: 'Dinh Dưỡng Việt', subtitle: '', icon: Home };
  const PageIcon = meta.icon;

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-64 h-screen flex flex-col flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #14532d 0%, #166534 45%, #15803d 100%)' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-green-900/40 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
            <Leaf size={24} className="text-green-300" />
          </div>
          <div>
            <h1 className="text-white text-base font-bold leading-tight">Dinh Dưỡng Việt</h1>
            <p className="text-xs text-green-300 mt-0.5">Hệ thống dinh dưỡng</p>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-green-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold ring-2 ring-white/30 flex-shrink-0">
              NM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">Nguyễn Văn Minh</p>
              <p className="text-xs text-green-300">Người dùng</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 sidebar-scroll">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] text-green-400 px-3 mb-1 tracking-wider font-semibold">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm ${
                        isActive
                          ? 'bg-white text-green-700 shadow font-semibold'
                          : 'text-green-100 hover:bg-white/15'
                      }`
                    }
                  >
                    <item.icon size={17} />
                    <span className="flex-1 leading-tight">{item.label}</span>
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
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Tìm kiếm thực phẩm, món ăn..."
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <ThemeToggle />
            <NotificationPopup />

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                  NM
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium">Nguyễn Văn Minh</p>
                    <p className="text-xs text-gray-500">minh.nguyen@example.com</p>
                  </div>
                  {[
                    { icon: User, label: 'Hồ sơ cá nhân', to: '/u/profile' },
                    { icon: Settings, label: 'Cài đặt', to: '/u/settings' },
                    { icon: HelpCircle, label: 'Trợ giúp', to: '/u/support' },
                  ].map((m) => (
                    <button
                      key={m.label}
                      onClick={() => { setUserMenuOpen(false); navigate(m.to); }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left"
                    >
                      <m.icon size={16} />
                      {m.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => { setUserMenuOpen(false); toast.success('Đã đăng xuất'); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 text-left"
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
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
