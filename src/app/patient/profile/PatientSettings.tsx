import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Lock, Globe, Moon, Smartphone, Shield, ChevronRight, Eye, User, Palette, Database, LogOut, CheckCircle2, Monitor, Tablet, Crown, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/app/shared/stores/themeStore';
import { usePatientProfile } from '@/app/patient/stores/patientProfileStore';
import { usePatientPrefs, applyFontSize } from '@/app/patient/stores/patientPrefsStore';
import { Modal, Field, Input, Btn } from '@/app/shared/components/Modal';

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
  { id: 'premium', label: 'Gói Premium', icon: Crown },
  { id: 'linked', label: 'Tài khoản liên kết', icon: Link2 },
];

type SecModal = null | 'password' | '2fa' | 'sessions' | 'devices' | 'sharing' | 'shareNew' | 'premium' | 'language';

export function PatientSettings() {
  const navigate = useNavigate();
  const { profile, update } = usePatientProfile();
  const { prefs, update: updatePrefs } = usePatientPrefs();
  const [section, setSection] = useState('notifications');
  const { resolved, mode, setMode } = useTheme();
  const dark = resolved === 'dark';
  const setDark = (v: boolean) => setMode(v ? 'dark' : 'light');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editField, setEditField] = useState<null | 'fullName' | 'username' | 'email' | 'phone'>(null);
  const [draftValue, setDraftValue] = useState('');
  const [secModal, setSecModal] = useState<SecModal>(null);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [otp, setOtp] = useState('');

  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome trên MacBook Pro', icon: Monitor, location: 'TP. Hồ Chí Minh', lastActive: 'Đang hoạt động', current: true },
    { id: '2', device: 'Safari trên iPhone 15', icon: Smartphone, location: 'TP. Hồ Chí Minh', lastActive: '2 giờ trước', current: false },
    { id: '3', device: 'Chrome trên iPad', icon: Tablet, location: 'Hà Nội', lastActive: '3 ngày trước', current: false },
  ]);
  const [trustedDevices, setTrustedDevices] = useState([
    { id: '1', name: 'iPhone 15 của Minh', added: '12/04/2026' },
    { id: '2', name: 'MacBook Pro 14"', added: '15/03/2024' },
  ]);
  const [sharedDoctors, setSharedDoctors] = useState([
    { id: '1', name: 'BS. Trần Thị A', spec: 'Dinh dưỡng', until: 'Vĩnh viễn', primary: true },
  ]);
  const [shareForm, setShareForm] = useState({ name: '', spec: 'Dinh dưỡng', duration: '7' });

  const notif = prefs.notif, dnd = prefs.dnd, biometric = prefs.biometric, twoFA = prefs.twoFA, fontIdx = prefs.fontIdx;

  const logout = () => { toast.success('Đã đăng xuất'); navigate('/'); };
  const openEdit = (k: 'fullName' | 'username' | 'email' | 'phone') => { setEditField(k); setDraftValue((profile as any)[k]); };
  const saveEdit = () => {
    if (!editField) return;
    if (!draftValue.trim()) { toast.error('Không được để trống'); return; }
    update({ [editField]: draftValue } as any);
    toast.success('Đã lưu'); setEditField(null);
  };
  const changePassword = () => {
    if (!pwd.current || !pwd.next) { toast.error('Vui lòng nhập đủ thông tin'); return; }
    if (pwd.next.length < 8) { toast.error('Mật khẩu mới cần ≥ 8 ký tự'); return; }
    if (pwd.next !== pwd.confirm) { toast.error('Xác nhận mật khẩu không khớp'); return; }
    toast.success('Đã đổi mật khẩu'); setPwd({ current: '', next: '', confirm: '' }); setSecModal(null);
  };
  const verify2FA = () => {
    if (otp.length !== 6) { toast.error('OTP phải 6 số'); return; }
    updatePrefs({ twoFA: true }); setOtp(''); setSecModal(null); toast.success('Đã bật xác thực 2 lớp');
  };
  const downloadData = () => {
    const data = { profile, prefs, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `dinh-duong-viet-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url); toast.success('Đã tải xuống dữ liệu');
  };
  const addSharedDoctor = () => {
    if (!shareForm.name.trim()) { toast.error('Nhập tên bác sĩ'); return; }
    setSharedDoctors([...sharedDoctors, { id: String(Date.now()), name: shareForm.name, spec: shareForm.spec, until: `${shareForm.duration} ngày`, primary: false }]);
    setShareForm({ name: '', spec: 'Dinh dưỡng', duration: '7' });
    setSecModal('sharing'); toast.success('Đã cấp quyền chia sẻ');
  };
  const revokeShare = (id: string) => { setSharedDoctors(sharedDoctors.filter((d) => d.id !== id)); toast.success('Đã huỷ quyền'); };
  const endSession = (id: string) => { setSessions(sessions.filter((s) => s.id !== id)); toast.success('Đã đăng xuất thiết bị'); };
  const removeTrusted = (id: string) => { setTrustedDevices(trustedDevices.filter((d) => d.id !== id)); toast.success('Đã xoá'); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="space-y-4">
        {/* Mobile: horizontal pills */}
        <div className="lg:hidden -mx-1 px-1 overflow-x-auto">
          <div className="inline-flex gap-2 pb-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setSection(s.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${section === s.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
                <s.icon size={14} /> {s.label}
              </button>
            ))}
          </div>
        </div>
        {/* Desktop sidebar */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">Cài đặt</p>
          <div className="space-y-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setSection(s.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${section === s.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                <s.icon size={16} />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
        <button onClick={logout} className="hidden lg:flex w-full px-4 py-3 rounded-2xl bg-white border border-red-200 text-red-600 text-sm items-center justify-center gap-2 shadow-sm hover:bg-red-50">
          <LogOut size={16} /> Đăng xuất
        </button>
        <p className="hidden lg:block text-center text-xs text-gray-400">Phiên bản 1.0.0 • Dinh Dưỡng Việt</p>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {section === 'account' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Tài khoản</h3>
            <div className="space-y-4">
              {([
                { k: 'fullName', label: 'Họ và tên' },
                { k: 'username', label: 'Tên đăng nhập' },
                { k: 'email', label: 'Email' },
                { k: 'phone', label: 'Số điện thoại' },
              ] as const).map((f) => (
                <div key={f.k} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="text-sm text-gray-900 mt-0.5">{(profile as any)[f.k]}</p>
                  </div>
                  <button onClick={() => openEdit(f.k)} className="text-sm text-emerald-600 hover:underline">Sửa</button>
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
                { k: 'medication', label: 'Nhắc uống thuốc', desc: 'Theo lịch bác sĩ kê' },
                { k: 'appointment', label: 'Lịch hẹn tư vấn', desc: 'Trước cuộc hẹn 30 phút' },
                { k: 'message', label: 'Tin nhắn từ bác sĩ', desc: 'Khi có tin nhắn mới' },
                { k: 'tip', label: 'Mẹo & bài học hàng ngày', desc: 'Một mẹo/ngày' },
                { k: 'marketing', label: 'Khuyến mãi & ưu đãi', desc: 'Voucher, sự kiện' },
              ].map((i) => (
                <div key={i.k} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{i.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{i.desc}</p>
                  </div>
                  <Toggle on={(notif as any)[i.k]} onChange={() => updatePrefs({ notif: { ...notif, [i.k]: !(notif as any)[i.k] } as any })} />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Chế độ không làm phiền</p>
                <p className="text-xs text-gray-500 mt-0.5">22:00 - 06:00 hàng ngày</p>
              </div>
              <Toggle on={dnd} onChange={() => updatePrefs({ dnd: !dnd })} />
            </div>
          </>
        )}

        {section === 'security' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Shield size={18} /> Bảo mật & Quyền riêng tư</h3>
            </div>
            {[
              { icon: Lock, label: 'Đổi mật khẩu', sub: 'Đã đổi 30 ngày trước', action: () => setSecModal('password') },
              { icon: Smartphone, label: 'Xác thực 2 lớp', sub: twoFA ? 'Đang bật' : 'Tắt — Bật để tăng bảo mật', action: () => setSecModal('2fa') },
              { icon: Eye, label: 'Lịch sử đăng nhập', sub: `${sessions.length} thiết bị đang hoạt động`, action: () => setSecModal('sessions') },
              { icon: Shield, label: 'Thiết bị tin cậy', sub: `${trustedDevices.length} thiết bị`, action: () => setSecModal('devices') },
              { icon: Database, label: 'Quyền chia sẻ dữ liệu', sub: `${sharedDoctors.length} bác sĩ có quyền xem`, action: () => setSecModal('sharing') },
            ].map((i) => (
              <button key={i.label} onClick={i.action} className="w-full flex items-center gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 text-left">
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
              <Toggle on={biometric} onChange={() => updatePrefs({ biometric: !biometric })} />
            </div>
          </div>
        )}

        {section === 'appearance' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Palette size={18} /> Giao diện & ngôn ngữ</h3>
            </div>
            <button onClick={() => setSecModal('language')} className="w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
              <Globe size={18} className="text-gray-500" />
              <span className="flex-1 text-sm text-gray-900">Ngôn ngữ</span>
              <span className="text-sm text-gray-500">{prefs.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`py-2 rounded-lg border text-sm transition ${mode === m ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    {m === 'light' ? 'Sáng' : m === 'dark' ? 'Tối' : 'Theo hệ thống'}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-900 mb-3">Cỡ chữ</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Nhỏ', 'Vừa', 'Lớn', 'Rất lớn'].map((s, i) => (
                  <button key={s} onClick={() => { updatePrefs({ fontIdx: i }); applyFontSize(i); toast.success(`Cỡ chữ: ${s}`); }} className={`py-2 rounded-lg border text-sm ${i === fontIdx ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
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
              <button onClick={downloadData} className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                <div>
                  <p className="text-sm text-gray-900">Tải xuống dữ liệu sức khoẻ</p>
                  <p className="text-xs text-gray-500 mt-0.5">JSON tổng hợp hồ sơ + tuỳ chỉnh</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button onClick={() => setSecModal('shareNew')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 text-left">
                <div>
                  <p className="text-sm text-gray-900">Chia sẻ dữ liệu với bác sĩ mới</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cấp quyền tạm thời 7-30 ngày</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button onClick={() => setConfirmDelete(true)} className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-left text-red-600">
                <div>
                  <p className="text-sm">Yêu cầu xoá tài khoản</p>
                  <p className="text-xs text-red-500 mt-0.5">Không thể hoàn tác</p>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {section === 'premium' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-md">
              <div className="flex items-center gap-3">
                <Crown size={32} />
                <div>
                  <h3 className="text-white">Dinh Dưỡng Việt Premium</h3>
                  <p className="text-sm text-white/90">{prefs.premium ? 'Đang hoạt động — Hết hạn 30/06/2026' : 'Mở khoá toàn bộ tính năng cao cấp'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-3">Quyền lợi Premium</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  'Tư vấn không giới hạn với bác sĩ chuyên gia',
                  'Phân tích dinh dưỡng chuyên sâu hàng tuần',
                  'Thực đơn cá nhân hoá theo bệnh lý',
                  'Ưu tiên hỗ trợ 24/7',
                  'Không quảng cáo',
                  'Tải xuống báo cáo PDF chuyên nghiệp',
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {p}</li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Tháng', price: '89.000đ', sub: '/tháng' },
                  { name: '6 tháng', price: '459.000đ', sub: 'tiết kiệm 15%', highlight: true },
                  { name: 'Năm', price: '799.000đ', sub: 'tiết kiệm 25%' },
                ].map((p) => (
                  <button key={p.name} onClick={() => { updatePrefs({ premium: true }); toast.success(`Đã đăng ký gói ${p.name}`); }} className={`p-4 rounded-xl border-2 text-left transition ${p.highlight ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                    <p className="text-sm text-gray-700">{p.name}</p>
                    <p className="text-gray-900 mt-1">{p.price}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{p.sub}</p>
                  </button>
                ))}
              </div>
              {prefs.premium && (
                <button onClick={() => { updatePrefs({ premium: false }); toast.success('Đã huỷ Premium'); }} className="mt-4 w-full px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50">Huỷ đăng ký</button>
              )}
            </div>
          </div>
        )}

        {section === 'linked' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Link2 size={18} /> Tài khoản liên kết</h3>
              <p className="text-xs text-gray-500 mt-1">Đăng nhập nhanh qua các tài khoản đã liên kết</p>
            </div>
            {([
              { k: 'google', label: 'Google', icon: '🔵', sub: profile.email },
              { k: 'apple', label: 'Apple ID', icon: '⚫', sub: 'Chưa liên kết' },
              { k: 'facebook', label: 'Facebook', icon: '🔷', sub: 'Chưa liên kết' },
            ] as const).map((p) => {
              const linked = (prefs.linked as any)[p.k];
              return (
                <div key={p.k} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center" style={{ fontSize: '1.25rem' }}>{p.icon}</div>
                    <div>
                      <p className="text-sm text-gray-900">{p.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{linked ? p.sub : 'Chưa liên kết'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { updatePrefs({ linked: { ...prefs.linked, [p.k]: !linked } }); toast.success(linked ? `Đã huỷ liên kết ${p.label}` : `Đã liên kết ${p.label}`); }}
                    className={`px-4 py-1.5 rounded-lg text-sm ${linked ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >
                    {linked ? 'Huỷ liên kết' : 'Liên kết'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={editField !== null} onClose={() => setEditField(null)} title={`Sửa ${editField === 'fullName' ? 'họ và tên' : editField === 'username' ? 'tên đăng nhập' : editField === 'email' ? 'email' : editField === 'phone' ? 'số điện thoại' : ''}`}>
        <Input value={draftValue} onChange={(e) => setDraftValue(e.target.value)} autoFocus />
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setEditField(null)}>Huỷ</Btn><Btn onClick={saveEdit}>Lưu</Btn></div>
      </Modal>

      <Modal open={secModal === 'password'} onClose={() => setSecModal(null)} title="Đổi mật khẩu">
        <div className="space-y-3">
          <Field label="Mật khẩu hiện tại"><Input type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} /></Field>
          <Field label="Mật khẩu mới (≥ 8 ký tự)"><Input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} /></Field>
          <Field label="Xác nhận mật khẩu mới"><Input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} /></Field>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setSecModal(null)}>Huỷ</Btn><Btn onClick={changePassword}>Đổi mật khẩu</Btn></div>
      </Modal>

      <Modal open={secModal === '2fa'} onClose={() => setSecModal(null)} title="Xác thực 2 lớp">
        {twoFA ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm">
              <CheckCircle2 size={18} /> 2FA đang bật cho tài khoản.
            </div>
            <p className="text-sm text-gray-600">Mỗi lần đăng nhập từ thiết bị mới sẽ cần OTP gửi tới {profile.phone}.</p>
            <Btn variant="danger" onClick={() => { updatePrefs({ twoFA: false }); setSecModal(null); toast.success('Đã tắt 2FA'); }}>Tắt 2FA</Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Đã gửi OTP 6 số tới {profile.phone}. Vui lòng nhập mã.</p>
            <Field label="Mã OTP"><Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" /></Field>
            <p className="text-xs text-gray-400">Mẹo: nhập 6 số bất kỳ để giả lập.</p>
            <div className="flex gap-2"><Btn variant="ghost" onClick={() => setSecModal(null)}>Huỷ</Btn><Btn onClick={verify2FA}>Xác thực</Btn></div>
          </div>
        )}
      </Modal>

      <Modal open={secModal === 'sessions'} onClose={() => setSecModal(null)} title="Lịch sử đăng nhập" size="lg">
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
              <s.icon size={20} className="text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Phiên hiện tại</span>}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.location} • {s.lastActive}</p>
              </div>
              {!s.current && <button onClick={() => endSession(s.id)} className="text-xs text-red-600 hover:underline">Đăng xuất</button>}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={secModal === 'devices'} onClose={() => setSecModal(null)} title="Thiết bị tin cậy">
        <p className="text-xs text-gray-500 mb-3">Thiết bị tin cậy bỏ qua xác thực 2 lớp khi đăng nhập.</p>
        <div className="space-y-2">
          {trustedDevices.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500">Thêm ngày {d.added}</p>
              </div>
              <button onClick={() => removeTrusted(d.id)} className="text-xs text-red-600 hover:underline">Xoá</button>
            </div>
          ))}
          {trustedDevices.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Chưa có thiết bị tin cậy</p>}
        </div>
      </Modal>

      <Modal open={secModal === 'sharing'} onClose={() => setSecModal(null)} title="Quyền chia sẻ dữ liệu" size="lg">
        <div className="space-y-2 mb-4">
          {sharedDoctors.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">{d.name.split(' ').slice(-1)[0][0]}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{d.name} {d.primary && <span className="text-[10px] text-emerald-600">• Phụ trách chính</span>}</p>
                <p className="text-xs text-gray-500">{d.spec} • Hiệu lực: {d.until}</p>
              </div>
              {!d.primary && <button onClick={() => revokeShare(d.id)} className="text-xs text-red-600 hover:underline">Huỷ quyền</button>}
            </div>
          ))}
        </div>
        <Btn onClick={() => setSecModal('shareNew')}>+ Cấp quyền cho bác sĩ mới</Btn>
      </Modal>

      <Modal open={secModal === 'shareNew'} onClose={() => setSecModal(null)} title="Chia sẻ với bác sĩ mới">
        <div className="space-y-3">
          <Field label="Tên bác sĩ"><Input value={shareForm.name} onChange={(e) => setShareForm({ ...shareForm, name: e.target.value })} placeholder="VD: BS. Lê Văn B" /></Field>
          <Field label="Chuyên khoa">
            <select value={shareForm.spec} onChange={(e) => setShareForm({ ...shareForm, spec: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Dinh dưỡng</option><option>Nội tổng quát</option><option>Tim mạch</option><option>Nội tiết</option><option>Khác</option>
            </select>
          </Field>
          <Field label="Thời hạn">
            <select value={shareForm.duration} onChange={(e) => setShareForm({ ...shareForm, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="7">7 ngày</option><option value="14">14 ngày</option><option value="30">30 ngày</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setSecModal(null)}>Huỷ</Btn><Btn onClick={addSharedDoctor}>Cấp quyền</Btn></div>
      </Modal>

      <Modal open={secModal === 'language'} onClose={() => setSecModal(null)} title="Chọn ngôn ngữ">
        <div className="space-y-2">
          {([
            { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
            { code: 'en', label: 'English', flag: '🇺🇸' },
          ] as const).map((l) => (
            <button key={l.code} onClick={() => { updatePrefs({ language: l.code }); setSecModal(null); toast.success(`Đã chuyển sang ${l.label}`); }} className={`w-full flex items-center gap-3 p-3 rounded-lg border ${prefs.language === l.code ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <span style={{ fontSize: '1.5rem' }}>{l.flag}</span>
              <span className="flex-1 text-left text-sm text-gray-900">{l.label}</span>
              {prefs.language === l.code && <Check size={16} className="text-emerald-600" />}
            </button>
          ))}
        </div>
      </Modal>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setConfirmDelete(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
            <h3 className="text-gray-900 mb-2">Xác nhận xoá tài khoản?</h3>
            <p className="text-sm text-gray-600">Toàn bộ dữ liệu sức khoẻ, lịch hẹn và lịch sử sẽ bị xoá vĩnh viễn.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">Huỷ</button>
              <button onClick={() => { setConfirmDelete(false); toast.success('Đã gửi yêu cầu xoá tài khoản'); }} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">Xác nhận xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
