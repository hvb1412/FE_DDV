import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, User, Phone, Mail, MapPin, Calendar, Activity, Heart, AlertTriangle, Pill, Edit2, Award, Shield, FileText, Download, Trash2, Siren, Trophy, Clock, Share2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Modal, Field, Input, TagInput, Btn } from '@/app/shared/components/Modal';
import { usePatientProfile, calcBMI, calcAge } from '@/app/patient/stores/patientProfileStore';

const ALL_BADGES = [
  { id: 'first-meal', icon: '🍽️', name: 'Bữa đầu tiên', desc: 'Ghi nhật ký bữa đầu tiên' },
  { id: 'streak-7', icon: '🔥', name: 'Streak 7 ngày', desc: '7 ngày liên tiếp ghi nhật ký' },
  { id: 'streak-30', icon: '💎', name: 'Streak 30 ngày', desc: '30 ngày liên tiếp' },
  { id: 'menu-3', icon: '🥗', name: 'Theo thực đơn', desc: 'Tuân thủ thực đơn 3 ngày' },
  { id: 'water-100', icon: '💧', name: '100 ly nước', desc: 'Uống đủ 100 ly nước' },
  { id: 'learn-10', icon: '📚', name: 'Học giả', desc: 'Hoàn thành 10 bài học' },
];

const activities = [
  { t: 'Hôm nay 14:32', text: 'Ghi nhật ký bữa trưa: Cơm gà 350 kcal' },
  { t: 'Hôm nay 09:10', text: 'Hoàn thành bài học "Chất xơ và đường huyết"' },
  { t: 'Hôm qua 19:45', text: 'Cập nhật cân nặng: 63.5 kg' },
  { t: 'Hôm qua 08:00', text: 'Tuân thủ thực đơn — +5 điểm' },
  { t: '2 ngày trước', text: 'Đặt lịch tư vấn BS. Trần Thị A' },
];

export function PatientMyProfile() {
  const navigate = useNavigate();
  const { profile, update } = usePatientProfile();
  const [openModal, setOpenModal] = useState<null | 'personal' | 'medical' | 'body' | 'emergency' | 'share' | 'qr'>(null);
  const [draft, setDraft] = useState(profile);

  const startEdit = (m: 'personal' | 'medical' | 'body' | 'emergency') => { setDraft(profile); setOpenModal(m); };
  const save = () => { update(draft); setOpenModal(null); toast.success('Đã lưu hồ sơ'); };

  const changeAvatar = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { update({ avatar: reader.result as string }); toast.success('Đã cập nhật ảnh đại diện'); };
      reader.readAsDataURL(file);
    };
    input.click();
  };
  const uploadRecord = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.pdf,image/*';
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      const sizeKB = file.size / 1024;
      const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const t = new Date();
      const date = `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
      update({ records: [{ name: file.name, date, size }, ...profile.records] });
      toast.success('Đã tải lên hồ sơ y tế');
    };
    input.click();
  };
  const removeRecord = (name: string) => { update({ records: profile.records.filter((r) => r.name !== name) }); toast.success('Đã xoá hồ sơ'); };

  const bmi = calcBMI(profile.height, profile.weight);
  const age = calcAge(profile.dob);
  const initial = profile.fullName.trim().split(' ').slice(-1)[0]?.[0]?.toUpperCase() ?? 'M';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center ring-4 ring-white/30 overflow-hidden text-2xl sm:text-3xl">
                {profile.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" /> : initial}
              </div>
              <button onClick={changeAvatar} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white truncate">{profile.fullName}</h2>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5 truncate">ID: BN-2024-0827 • Tham gia 15/03/2024</p>
              <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs sm:text-sm flex-wrap">
                <span className="bg-white/15 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">🥈 Bạc</span>
                <span className="bg-white/15 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">⭐ 245 điểm</span>
                <span className="bg-white/15 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">🔥 12 ngày</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:flex-shrink-0">
            <div className="flex gap-2">
              <button onClick={() => startEdit('personal')} className="flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center justify-center gap-1.5">
                <Edit2 size={14} /> Sửa hồ sơ
              </button>
              <button onClick={() => navigate('/p/rewards')} className="flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg bg-white text-emerald-700 text-sm flex items-center justify-center gap-1.5 hover:bg-emerald-50">
                <Award size={14} /> Thưởng
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOpenModal('share')} className="flex-1 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs flex items-center justify-center gap-1"><Share2 size={12} /> Chia sẻ</button>
              <button onClick={() => setOpenModal('qr')} className="flex-1 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs flex items-center justify-center gap-1"><QrCode size={12} /> QR</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><User size={16} className="text-gray-600" /> Thông tin cá nhân</h3>
              <button onClick={() => startEdit('personal')} className="text-sm text-emerald-600 hover:underline">Sửa</button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: Calendar, label: 'Ngày sinh', value: `${profile.dob} (${age} tuổi)` },
                { icon: User, label: 'Giới tính', value: profile.gender },
                { icon: Phone, label: 'Số điện thoại', value: profile.phone },
                { icon: Mail, label: 'Email', value: profile.email },
                { icon: MapPin, label: 'Địa chỉ', value: profile.address },
                { icon: Shield, label: 'BHYT', value: profile.insurance },
              ].map((i) => (
                <div key={i.label} className="flex items-center gap-3">
                  <i.icon size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">{i.label}</p>
                    <p className="text-sm text-gray-900 truncate">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Activity size={16} className="text-gray-600" /> Chỉ số cơ bản</h3>
              <button onClick={() => startEdit('body')} className="text-sm text-emerald-600 hover:underline">Cập nhật</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4">
              {[
                { label: 'Chiều cao', value: profile.height, unit: 'cm' },
                { label: 'Cân nặng', value: profile.weight, unit: 'kg' },
                { label: 'BMI', value: bmi, unit: '' },
              ].map((s) => (
                <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-gray-900 mt-1">{s.value} <span className="text-xs text-gray-500">{s.unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><Heart size={16} className="text-red-500" /> Tiền sử bệnh</h3>
              <button onClick={() => startEdit('medical')} className="text-sm text-emerald-600 hover:underline">Sửa</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Heart size={12} /> Bệnh lý hiện tại</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.conditions.length === 0 && <span className="text-xs text-gray-400">Chưa có</span>}
                  {profile.conditions.map((c) => <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700">{c}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Dị ứng</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.allergies.length === 0 && <span className="text-xs text-gray-400">Không có</span>}
                  {profile.allergies.map((c) => <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">{c}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Pill size={12} /> Thuốc đang dùng</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {profile.medications.length === 0 && <li className="text-xs text-gray-400">Không có</li>}
                  {profile.medications.map((m) => <li key={m}>• {m}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">👨‍👩‍👧 Tiền sử gia đình</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {profile.familyHistory.length === 0 && <li className="text-xs text-gray-400">Không có</li>}
                  {profile.familyHistory.map((f) => <li key={f}>• {f}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-3">Bác sĩ phụ trách</p>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center">A</div>
              <div className="flex-1">
                <p className="text-gray-900">BS. Trần Thị A</p>
                <p className="text-xs text-gray-500">Chuyên khoa Dinh dưỡng</p>
                <p className="text-xs text-emerald-600 mt-0.5">● Đang online</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => navigate('/p/chat')} className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Nhắn tin</button>
              <button onClick={() => navigate('/p/appointments')} className="flex-1 px-3 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm hover:bg-emerald-50">Đặt lịch</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2"><FileText size={16} /> Hồ sơ y tế</h3>
              <button onClick={uploadRecord} className="text-sm text-emerald-600 hover:underline">+ Tải lên</button>
            </div>
            <div className="p-4 space-y-2">
              {profile.records.length === 0 && <p className="text-sm text-gray-400 text-center py-3">Chưa có hồ sơ nào</p>}
              {profile.records.map((f) => (
                <div key={f.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group">
                  <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600 text-xs flex-shrink-0">PDF</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{f.name}</p>
                    <p className="text-[10px] text-gray-500">{f.date} • {f.size}</p>
                  </div>
                  <button onClick={() => toast.success(`Đang tải: ${f.name}`)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition"><Download size={14} /></button>
                  <button onClick={() => removeRecord(f.name)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-50 text-red-600 transition"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency + Badges + Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-gray-900 flex items-center gap-2"><Siren size={16} className="text-red-500" /> Liên hệ khẩn cấp</h3>
            <button onClick={() => startEdit('emergency')} className="text-sm text-emerald-600 hover:underline">Sửa</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600"><User size={20} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{profile.emergency.name}</p>
                <p className="text-xs text-gray-500">{profile.emergency.relation}</p>
              </div>
            </div>
            <a href={`tel:${profile.emergency.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100">
              <Phone size={14} /> Gọi {profile.emergency.phone}
            </a>
            <p className="text-[11px] text-gray-400">Sẽ được gọi tự động khi bạn bấm SOS trong app.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-gray-900 flex items-center gap-2"><Trophy size={16} className="text-amber-500" /> Huy hiệu</h3>
            <button onClick={() => navigate('/p/rewards')} className="text-sm text-emerald-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
            {ALL_BADGES.map((b) => {
              const unlocked = profile.achievements.includes(b.id);
              return (
                <div key={b.id} title={`${b.name} — ${b.desc}`} className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-center transition ${unlocked ? 'bg-gradient-to-br from-amber-50 to-amber-100' : 'bg-gray-50 grayscale opacity-50'}`}>
                  <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
                  <p className="text-[10px] text-gray-700 mt-1 leading-tight">{b.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-900 flex items-center gap-2"><Clock size={16} className="text-gray-600" /> Hoạt động gần đây</h3>
          </div>
          <div className="p-2">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-[10px] text-gray-400">{a.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-900">🔒 Quyền riêng tư</p>
        <p className="text-xs text-amber-800 mt-1">Hồ sơ y tế chỉ chia sẻ với bác sĩ phụ trách. Bạn có thể kiểm soát ở mục Cài đặt → Quyền riêng tư.</p>
      </div>

      {/* Modals */}
      <Modal open={openModal === 'personal'} onClose={() => setOpenModal(null)} title="Sửa thông tin cá nhân" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Họ và tên"><Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} /></Field>
          <Field label="Tên đăng nhập"><Input value={draft.username} onChange={(e) => setDraft({ ...draft, username: e.target.value })} /></Field>
          <Field label="Ngày sinh (dd/mm/yyyy)"><Input value={draft.dob} onChange={(e) => setDraft({ ...draft, dob: e.target.value })} /></Field>
          <Field label="Giới tính">
            <select value={draft.gender} onChange={(e) => setDraft({ ...draft, gender: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Nam</option><option>Nữ</option><option>Khác</option>
            </select>
          </Field>
          <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
          <Field label="Số điện thoại"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Địa chỉ"><Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Mã BHYT"><Input value={draft.insurance} onChange={(e) => setDraft({ ...draft, insurance: e.target.value })} /></Field></div>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setOpenModal(null)}>Huỷ</Btn><Btn onClick={save}>Lưu</Btn></div>
      </Modal>

      <Modal open={openModal === 'body'} onClose={() => setOpenModal(null)} title="Cập nhật chỉ số cơ thể">
        <div className="space-y-4">
          <Field label="Chiều cao (cm)"><Input type="number" value={draft.height} onChange={(e) => setDraft({ ...draft, height: Number(e.target.value) })} /></Field>
          <Field label="Cân nặng (kg)"><Input type="number" step="0.1" value={draft.weight} onChange={(e) => setDraft({ ...draft, weight: Number(e.target.value) })} /></Field>
          <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">BMI dự kiến: <strong>{calcBMI(draft.height, draft.weight)}</strong></div>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setOpenModal(null)}>Huỷ</Btn><Btn onClick={save}>Lưu</Btn></div>
      </Modal>

      <Modal open={openModal === 'medical'} onClose={() => setOpenModal(null)} title="Sửa tiền sử bệnh" size="lg">
        <div className="space-y-4">
          <Field label="Bệnh lý hiện tại"><TagInput values={draft.conditions} onChange={(v) => setDraft({ ...draft, conditions: v })} /></Field>
          <Field label="Dị ứng"><TagInput values={draft.allergies} onChange={(v) => setDraft({ ...draft, allergies: v })} /></Field>
          <Field label="Thuốc đang dùng"><TagInput values={draft.medications} onChange={(v) => setDraft({ ...draft, medications: v })} /></Field>
          <Field label="Tiền sử gia đình"><TagInput values={draft.familyHistory} onChange={(v) => setDraft({ ...draft, familyHistory: v })} /></Field>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setOpenModal(null)}>Huỷ</Btn><Btn onClick={save}>Lưu</Btn></div>
      </Modal>

      <Modal open={openModal === 'emergency'} onClose={() => setOpenModal(null)} title="Sửa liên hệ khẩn cấp">
        <div className="space-y-3">
          <Field label="Họ và tên"><Input value={draft.emergency.name} onChange={(e) => setDraft({ ...draft, emergency: { ...draft.emergency, name: e.target.value } })} /></Field>
          <Field label="Số điện thoại"><Input value={draft.emergency.phone} onChange={(e) => setDraft({ ...draft, emergency: { ...draft.emergency, phone: e.target.value } })} /></Field>
          <Field label="Mối quan hệ">
            <select value={draft.emergency.relation} onChange={(e) => setDraft({ ...draft, emergency: { ...draft.emergency, relation: e.target.value } })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Vợ</option><option>Chồng</option><option>Bố</option><option>Mẹ</option><option>Con</option><option>Anh/Chị/Em</option><option>Bạn bè</option><option>Khác</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-2 mt-5"><Btn variant="ghost" onClick={() => setOpenModal(null)}>Huỷ</Btn><Btn onClick={save}>Lưu</Btn></div>
      </Modal>

      <Modal open={openModal === 'share'} onClose={() => setOpenModal(null)} title="Chia sẻ hồ sơ">
        <p className="text-sm text-gray-600 mb-3">Sao chép đường dẫn để chia sẻ hồ sơ tóm tắt với bác sĩ hoặc người thân.</p>
        <div className="flex gap-2">
          <Input readOnly value="https://dinhduongviet.vn/share/BN-2024-0827" />
          <Btn onClick={() => { navigator.clipboard?.writeText('https://dinhduongviet.vn/share/BN-2024-0827'); toast.success('Đã sao chép'); }}>Sao chép</Btn>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {['Zalo', 'Messenger', 'Email'].map((n) => (
            <button key={n} onClick={() => toast.success(`Đang mở ${n}…`)} className="py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">{n}</button>
          ))}
        </div>
      </Modal>

      <Modal open={openModal === 'qr'} onClose={() => setOpenModal(null)} title="Mã QR hồ sơ">
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl" style={{ backgroundImage: 'repeating-conic-gradient(#111 0 25%, #fff 0 50%)', backgroundSize: '12px 12px' }} />
          <p className="text-sm text-gray-700">BN-2024-0827</p>
          <p className="text-xs text-gray-500 text-center">Bác sĩ quét để xem hồ sơ tóm tắt (hiệu lực 10 phút).</p>
          <Btn onClick={() => toast.success('Đã làm mới mã QR')}>Làm mới mã</Btn>
        </div>
      </Modal>
    </div>
  );
}
