import { useState } from 'react';
import { Settings, Shield, Database, Palette, ClipboardList, Save, UserCheck, FileEdit, ShieldAlert, Stethoscope, AlertTriangle, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'general' | 'security' | 'integrations' | 'branding' | 'audit';

type LogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  ip: string;
  type: 'user' | 'doctor' | 'content' | 'warning';
};

const logs: LogEntry[] = [
  { id: 'L1', actor: 'admin@dinhduongviet.vn', action: 'Khoá tài khoản',     target: 'user U0042',    time: '04/06/2026 16:12', ip: '113.161.4.21', type: 'warning' },
  { id: 'L2', actor: 'admin@dinhduongviet.vn', action: 'Duyệt hồ sơ bác sĩ', target: 'BS. Trần Thị A',time: '04/06/2026 14:35', ip: '113.161.4.21', type: 'doctor' },
  { id: 'L3', actor: 'admin@dinhduongviet.vn', action: 'Xuất bản bài viết',  target: 'A001',          time: '04/06/2026 11:08', ip: '113.161.4.21', type: 'content' },
  { id: 'L4', actor: 'system',                 action: '3 lần đăng nhập sai',target: 'admin account', time: '04/06/2026 09:50', ip: '45.118.92.4',  type: 'warning' },
  { id: 'L5', actor: 'admin@dinhduongviet.vn', action: 'Cập nhật cài đặt',   target: 'Branding',      time: '03/06/2026 18:22', ip: '113.161.4.21', type: 'user' },
];

const logCfg = {
  user:    { icon: UserCheck,   cls: 'bg-blue-50 text-blue-600' },
  doctor:  { icon: Stethoscope, cls: 'bg-emerald-50 text-emerald-600' },
  content: { icon: FileEdit,    cls: 'bg-purple-50 text-purple-600' },
  warning: { icon: ShieldAlert, cls: 'bg-orange-50 text-orange-600' },
};

const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: 'general',      label: 'Cài đặt chung',    icon: Settings },
  { key: 'security',     label: 'Bảo mật',          icon: Shield },
  { key: 'integrations', label: 'Tích hợp',         icon: Database },
  { key: 'branding',     label: 'Giao diện',        icon: Palette },
  { key: 'audit',        label: 'Nhật ký hệ thống', icon: ClipboardList },
];

const sectionMeta: Record<Exclude<Tab, 'integrations' | 'audit'>, { label: string; desc: string }> = {
  general:  { label: 'Cài đặt chung', desc: 'Tên hệ thống, email liên hệ, múi giờ, ngôn ngữ và quy tắc đăng ký sẽ áp dụng cho toàn bộ người dùng.' },
  security: { label: 'Bảo mật',       desc: 'Chính sách mật khẩu, 2FA, thời gian phiên và ngưỡng khoá tài khoản sẽ áp dụng ngay sau khi lưu — có thể ảnh hưởng đến phiên đăng nhập hiện tại.' },
  branding: { label: 'Giao diện',     desc: 'Tên thương hiệu, slogan, màu chủ đạo và logo sẽ hiển thị trên toàn ứng dụng cho mọi người dùng.' },
};

export function AdminSettings() {
  const [tab, setTab] = useState<Tab>('general');
  const [pendingSave, setPendingSave] = useState<Exclude<Tab, 'integrations' | 'audit'> | null>(null);

  const requestSave = (section: Exclude<Tab, 'integrations' | 'audit'>) => setPendingSave(section);
  const confirmSave = () => {
    if (!pendingSave) return;
    toast.success(`Đã lưu thay đổi: ${sectionMeta[pendingSave].label}`);
    setPendingSave(null);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Tabs */}
          <aside className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2">
              {tabs.map(t => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                      active ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <Icon size={16} /> {t.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <section className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            {tab === 'general' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Cài đặt chung</h2>
                <p className="text-xs text-gray-500 mb-6">Cấu hình cơ bản của hệ thống</p>
                <div className="space-y-4">
                  <Field label="Tên hệ thống" defaultValue="Dinh Dưỡng Việt" />
                  <Field label="Email liên hệ" defaultValue="support@dinhduongviet.vn" />
                  <Field label="Múi giờ mặc định" defaultValue="(GMT+7) Hà Nội" />
                  <Field label="Ngôn ngữ mặc định" defaultValue="Tiếng Việt" />
                  <Toggle label="Cho phép đăng ký tài khoản mới" defaultChecked />
                  <Toggle label="Yêu cầu xác thực email khi đăng ký" defaultChecked />
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button onClick={() => requestSave('general')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
                      <Save size={15} /> Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Bảo mật</h2>
                <p className="text-xs text-gray-500 mb-6">Chính sách mật khẩu, đăng nhập, phiên làm việc</p>
                <div className="space-y-4">
                  <Field label="Độ dài mật khẩu tối thiểu" defaultValue="8" />
                  <Toggle label="Bắt buộc mật khẩu có chữ hoa, chữ thường, số" defaultChecked />
                  <Toggle label="Bật xác thực 2 lớp (2FA) cho tài khoản Admin" defaultChecked />
                  <Field label="Thời gian hết phiên (phút)" defaultValue="60" />
                  <Field label="Số lần đăng nhập sai trước khi khoá" defaultValue="5" />
                  <Toggle label="Cảnh báo khi đăng nhập từ thiết bị/IP lạ" defaultChecked />
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button onClick={() => requestSave('security')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
                      <Save size={15} /> Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'integrations' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Tích hợp</h2>
                <p className="text-xs text-gray-500 mb-6">Dịch vụ bên thứ ba</p>
                <div className="space-y-3">
                  <IntegrationItem name="SMTP Email" desc="Dịch vụ gửi email OTP và thông báo" status="connected" />
                  <IntegrationItem name="Cloud Storage" desc="Lưu trữ ảnh hồ sơ và tài liệu" status="connected" />
                  <IntegrationItem name="SMS Gateway" desc="Gửi OTP qua tin nhắn" status="disconnected" />
                  <IntegrationItem name="Google Analytics" desc="Theo dõi hành vi người dùng" status="connected" />
                  <IntegrationItem name="Stripe Payments" desc="Cổng thanh toán dịch vụ tư vấn" status="disconnected" />
                </div>
              </div>
            )}

            {tab === 'branding' && (
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Giao diện</h2>
                <p className="text-xs text-gray-500 mb-6">Thương hiệu hiển thị trên ứng dụng</p>
                <div className="space-y-4">
                  <Field label="Tên thương hiệu hiển thị" defaultValue="Dinh Dưỡng Việt" />
                  <Field label="Slogan" defaultValue="Sống khoẻ mỗi ngày" />
                  <div>
                    <label className="text-sm text-gray-700">Màu chủ đạo</label>
                    <div className="mt-2 flex items-center gap-2">
                      {['#10b981', '#059669', '#0ea5e9', '#8b5cf6', '#f59e0b'].map(c => (
                        <button key={c} className="w-9 h-9 rounded-lg border-2 border-white shadow-sm ring-1 ring-gray-200" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <Toggle label="Hiển thị logo trên màn hình đăng nhập" defaultChecked />
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button onClick={() => requestSave('branding')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
                      <Save size={15} /> Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'audit' && (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-1">Nhật ký hệ thống</h2>
                  <p className="text-xs text-gray-500">Mọi hành động nhạy cảm được ghi lại với thời gian và IP</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {logs.map(l => {
                    const cfg = logCfg[l.type]; const Icon = cfg.icon;
                    return (
                      <li key={l.id} className="p-4 flex items-start gap-3 hover:bg-gray-50/50">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{l.actor}</span>{' '}
                            <span className="text-gray-600">{l.action}</span>{' '}
                            <span className="font-medium text-gray-800">{l.target}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{l.time} · IP {l.ip}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>

      {pendingSave && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPendingSave(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                pendingSave === 'security' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {pendingSave === 'security' ? <AlertTriangle size={22} /> : <Save size={22} />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận lưu thay đổi: {sectionMeta[pendingSave].label}?
              </h3>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                {sectionMeta[pendingSave].desc}
              </p>
              {pendingSave === 'security' && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                  Thay đổi bảo mật có thể buộc người dùng đăng nhập lại hoặc đổi mật khẩu nếu không đạt yêu cầu mới.
                </p>
              )}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
              <button onClick={() => setPendingSave(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">
                Huỷ
              </button>
              <button
                onClick={confirmSave}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium inline-flex items-center gap-1.5 ${
                  pendingSave === 'security' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Save size={14} /> Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      <input defaultValue={defaultValue} className="mt-1.5 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400" />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-sm text-gray-700">{label}</label>
      <button onClick={() => setOn(!on)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${on ? 'bg-green-600' : 'bg-gray-300'}`}>
        <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function IntegrationItem({ name, desc, status }: { name: string; desc: string; status: 'connected' | 'disconnected' }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Database size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
          status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {status === 'connected' ? 'Đã kết nối' : 'Chưa kết nối'}
        </span>
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">
          {status === 'connected' ? 'Cấu hình' : 'Kết nối'}
        </button>
      </div>
    </div>
  );
}
