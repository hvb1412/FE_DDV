import {
  Home,
  Users,
  Video,
  FileText,
  Bell,
  ClipboardCheck,
  BellRing,
  MessageSquare,
  Leaf,
  CalendarClock,
} from "lucide-react";
import { Link, useLocation } from "react-router";

export function DoctorSidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Bảng điều khiển", icon: Home, path: "/d" },
    {
      name: "Danh sách bệnh nhân",
      icon: Users,
      path: "/patients",
    },
    {
      name: "Quản lý lịch hẹn",
      icon: CalendarClock,
      path: "/appointments",
    },
    {
      name: "Tư vấn trực tuyến",
      icon: Video,
      path: "/consultation",
    },
    {
      name: "Chat với bệnh nhân",
      icon: MessageSquare,
      path: "/chat",
    },
    {
      name: "Nhắc nhở bệnh nhân",
      icon: BellRing,
      path: "/reminders",
    },
    {
      name: "Phê duyệt thực đơn",
      icon: ClipboardCheck,
      path: "/menu-approval",
    },
    {
      name: "Tài liệu tham khảo",
      icon: FileText,
      path: "/references",
    },
    { name: "Thông báo", icon: Bell, path: "/notifications" },
  ];

  return (
    <aside
      className="w-64 h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #14532d 0%, #166534 45%, #15803d 100%)",
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-green-900/40 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10">
          <Leaf size={24} className="text-green-300" />
        </div>
        <div>
          <h1 className="text-white text-base font-bold leading-tight">Dinh Dưỡng Việt</h1>
          <p className="text-xs text-green-300 mt-0.5">Chuyên gia sức khỏe</p>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-green-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
            <span className="text-white font-semibold text-sm">
              TA
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Bác sĩ: Trần Thị A
            </p>
            <p className="text-xs text-green-300">
              Chuyên gia dinh dưỡng
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white text-green-700 shadow font-semibold"
                  : "text-green-100 hover:bg-white/15 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}