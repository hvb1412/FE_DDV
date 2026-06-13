import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Bell, Lock, Globe, Moon, Smartphone, Shield, ChevronRight, Eye, User, Palette, Database, LogOut } from 'lucide-react';
import { useTheme } from '@/app/shared/stores/themeStore';

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition relative ${on ? 'bg-emerald-600' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

const sections = [
  { id: 'account', label: 'Tài khoản', icon: User },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'security', label: 'Bảo mật', icon: Shield },
  { id: 'appearance', label: 'Giao diện', icon: Palette },
  { id: 'data', label: 'Dữ liệu', icon: Database },
];

export function UserSettings() {
  const navigate = useNavigate();
  const [section, setSection] = useState('notifications');
  const [notif, setNotif] = useState({ tip: true, water: true, meal: true, news: false, marketing: false });
  const [dnd, setDnd] = useState(false);
  const { resolved, mode, setMode } = useTheme();
  const dark = resolved === 'dark';
  const setDark = (v: boolean) => setMode(v ? 'dark' : 'light');
  const [biometric, setBiometric] = useState(true);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">Cài đặt</p>
          <div className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                  section === s.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <s.icon size={16} />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { toast.success('Đã đăng xuất'); navigate('/'); }} className="w-full px-4 py-3 rounded-2xl bg-white border border-red-200 text-red-600 text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-red-50">
          <LogOut size={16} /> Đăng xuất
        </button>
        <p className="text-center text-xs text-gray-400">Phiên bản 1.0.0 • Dinh Dưỡng Việt</p>
      </div>

      {/* Content panel */}
      <div className="col-span-3 space-y-4">
        {section === 'account' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Tài khoản</h3>
            <div className="space-y-4">
              {[
                { label: 'Họ và tên', value: 'Nguyễn Văn Minh' },
                { label: 'Tên đăng nhập', value: 'minh.nguyen' },
                { label: 'Email', value: 'minh.nguyen@example.com' },
                { label: 'Số điện thoại', value: '0901 234 567' },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="text-sm text-gray-900 mt-0.5">{f.value}</p>
                  </div>
                  <button className="text-sm text-emerald-600 hover:underline">Sửa</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'notifications' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-gray-900 flex items-center gap-2"><Bell size={18} /> Thông báo</h3>
                <p className="text-xs text-gray-500 mt-1">Chọn loại thông báo bạn muốn nhận</p>
              </div>
              {[
                { k: 'tip', label: 'Mẹo dinh dưỡng hàng ngày', desc: 'Một mẹo sức khoẻ mỗi sáng' },
                { k: 'water', label: 'Nhắc nhở uống nước', desc: 'Mỗi 2 giờ trong giờ hoạt động' },
                { k: 'meal', label: 'Nhắc bữa ăn đúng giờ', desc: 'Sáng, trưa, chiều, tối' },
                { k: 'news', label: 'Tin tức dinh dưỡng mới', desc: 'Bài viết & nghiên cứu mới nhất' },
                { k: 'marketing', label: 'Khuyến mãi & ưu đãi', desc: 'Voucher, sự kiện đối tác' },
              ].map((i) => (
                <div key={i.k} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{i.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{i.desc}</p>
                  </div>
                  <Toggle on={(notif as any)[i.k]} onChange={() => setNotif({ ...notif, [i.k]: !(notif as any)[i.k] })} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Chế độ không làm phiền</p>
                <p className="text-xs text-gray-500 mt-0.5">22:00 - 06:00 hàng ngày</p>
              </div>
              <Toggle on={dnd} onChange={() => setDnd(!dnd)} />
            </div>
          </>
        )}

        {section === 'security' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Shield size={18} /> Bảo mật & Quyền riêng tư</h3>
            </div>
            {[
              { icon: Lock, label: 'Đổi mật khẩu', sub: 'Đã đổi 30 ngày trước' },
              { icon: Smartphone, label: 'Xác thực 2 lớp', sub: 'Tắt — Bật để tăng bảo mật' },
              { icon: Eye, label: 'Lịch sử đăng nhập', sub: '3 thiết bị đang hoạt động' },
              { icon: Shield, label: 'Quản lý thiết bị tin cậy', sub: '2 thiết bị' },
              { icon: Database, label: 'Quyền chia sẻ dữ liệu', sub: 'Chỉ dùng cá nhân' },
            ].map((i) => (
              <button key={i.label} className="w-full flex items-center gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 text-left">
                <i.icon size={18} className="text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{i.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{i.sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <p className="text-sm text-gray-900">Đăng nhập sinh trắc học</p>
                <p className="text-xs text-gray-500 mt-0.5">Vân tay / Face ID</p>
              </div>
              <Toggle on={biometric} onChange={() => setBiometric(!biometric)} />
            </div>
          </div>
        )}

        {section === 'appearance' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Palette size={18} /> Giao diện & ngôn ngữ</h3>
            </div>
            <button className="w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
              <Globe size={18} className="text-gray-500" />
              <span className="flex-1 text-sm text-gray-900">Ngôn ngữ</span>
              <span className="text-sm text-gray-500">Tiếng Việt</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-900">Chế độ tối</p>
                  <p className="text-xs text-gray-500">Dễ nhìn vào buổi tối</p>
                </div>
              </div>
              <Toggle on={dark} onChange={() => setDark(!dark)} />
            </div>
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-900 mb-2">Chế độ giao diện</p>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-2 rounded-lg border text-sm transition ${
                      mode === m
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {m === 'light' ? 'Sáng' : m === 'dark' ? 'Tối' : 'Theo hệ thống'}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-900 mb-3">Cỡ chữ</p>
              <div className="grid grid-cols-4 gap-2">
                {['Nhỏ', 'Vừa', 'Lớn', 'Rất lớn'].map((s, i) => (
                  <button key={s} className={`py-2 rounded-lg border text-sm ${i === 1 ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'data' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-gray-900 flex items-center gap-2"><Database size={18} /> Dữ liệu của tôi</h3>
                <p className="text-xs text-gray-500 mt-1">Quyền sở hữu và xuất dữ liệu cá nhân</p>
              </div>
              <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                <div>
                  <p className="text-sm text-gray-900">Tải xuống dữ liệu dinh dưỡng</p>
                  <p className="text-xs text-gray-500 mt-0.5">CSV / PDF tổng hợp lịch sử tra cứu & tính toán</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                <div>
                  <p className="text-sm text-gray-900">Xoá lịch sử tra cứu</p>
                  <p className="text-xs text-gray-500 mt-0.5">Xoá toàn bộ lịch sử tìm kiếm thực phẩm</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-left text-red-600">
                <div>
                  <p className="text-sm">Yêu cầu xoá tài khoản</p>
                  <p className="text-xs text-red-500 mt-0.5">Không thể hoàn tác</p>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
