import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Star,
  Edit3, Save, X, Camera, Stethoscope, GraduationCap, Clock,
  CheckCircle, TrendingUp, Users, MessageSquare, FileText,
} from 'lucide-react';
import { toast } from 'sonner';

const stats = [
  { label: 'Bệnh nhân đang theo dõi', value: '245', icon: Users, color: 'emerald' },
  { label: 'Tư vấn đã thực hiện', value: '1,830', icon: MessageSquare, color: 'blue' },
  { label: 'Thực đơn đã tạo', value: '612', icon: FileText, color: 'purple' },
  { label: 'Đánh giá trung bình', value: '4.9★', icon: Star, color: 'amber' },
];

const certifications = [
  { name: 'Chứng chỉ Dinh dưỡng lâm sàng — Bộ Y tế Việt Nam', year: '2018' },
  { name: 'Chứng chỉ Tư vấn đái tháo đường — IDF', year: '2020' },
  { name: 'Chứng chỉ Dinh dưỡng nhi khoa nâng cao', year: '2021' },
  { name: 'Chứng nhận Quản lý cân nặng lâm sàng — ASPEN', year: '2023' },
];

const education = [
  { degree: 'Tiến sĩ Dinh dưỡng học', school: 'Đại học Y Hà Nội', year: '2015 – 2019' },
  { degree: 'Thạc sĩ Dinh dưỡng lâm sàng', school: 'Đại học Y Dược TP.HCM', year: '2012 – 2014' },
  { degree: 'Bác sĩ Đa khoa', school: 'Đại học Y Hà Nội', year: '2006 – 2012' },
];

const workSchedule = [
  { day: 'Thứ 2', slots: ['08:00 – 12:00', '14:00 – 17:00'], active: true },
  { day: 'Thứ 3', slots: ['08:00 – 12:00'], active: true },
  { day: 'Thứ 4', slots: ['14:00 – 17:00'], active: true },
  { day: 'Thứ 5', slots: ['08:00 – 12:00', '14:00 – 17:00'], active: true },
  { day: 'Thứ 6', slots: ['08:00 – 11:00'], active: true },
  { day: 'Thứ 7', slots: [], active: false },
  { day: 'CN', slots: [], active: false },
];

const expertise = [
  'Dinh dưỡng lâm sàng', 'Đái tháo đường', 'Tăng huyết áp', 'Béo phì',
  'Dinh dưỡng thể thao', 'Rối loạn lipid máu', 'Dinh dưỡng ung thư', 'Dinh dưỡng nhi khoa',
];

export function DoctorProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'BS. Trần Thị A',
    title: 'Tiến sĩ • Chuyên khoa Dinh dưỡng',
    email: 'tran.thi.a@dinhduong.vn',
    phone: '0912 345 678',
    address: 'Bệnh viện Dinh dưỡng TP.HCM, 15 Trần Hưng Đạo, Q.1',
    experience: '12 năm kinh nghiệm',
    bio: 'Bác sĩ chuyên khoa Dinh dưỡng với hơn 12 năm kinh nghiệm trong lĩnh vực dinh dưỡng lâm sàng và tư vấn chế độ ăn cho bệnh nhân mắc bệnh mãn tính. Tốt nghiệp Tiến sĩ tại Đại học Y Hà Nội, hiện đang công tác tại Bệnh viện Dinh dưỡng TP.HCM. Chuyên sâu về quản lý dinh dưỡng cho bệnh nhân đái tháo đường type 2, tăng huyết áp và rối loạn chuyển hoá.',
  });
  const [draft, setDraft] = useState(form);

  const startEdit = () => { setDraft(form); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => { setForm(draft); setEditing(false); toast.success('Đã cập nhật hồ sơ chuyên gia'); };

  const field = (key: keyof typeof draft, label: string, multiline = false) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={draft[key]}
          onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={draft[key]}
          onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-6">

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600" />

          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md">
                  TA
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition">
                  <Camera size={13} className="text-gray-500" />
                </button>
              </div>

              {/* Edit / Save buttons */}
              {editing ? (
                <div className="flex gap-2 mb-1">
                  <button onClick={cancelEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition">
                    <X size={14} /> Huỷ
                  </button>
                  <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition">
                    <Save size={14} /> Lưu thay đổi
                  </button>
                </div>
              ) : (
                <button onClick={startEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition mb-1">
                  <Edit3 size={14} /> Chỉnh sửa hồ sơ
                </button>
              )}
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                {field('name', 'Họ và tên')}
                {field('title', 'Chức danh / Chuyên khoa')}
                {field('email', 'Email')}
                {field('phone', 'Số điện thoại')}
                {field('address', 'Địa chỉ công tác')}
                {field('experience', 'Kinh nghiệm')}
                <div className="col-span-2">{field('bio', 'Giới thiệu bản thân', true)}</div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
                <p className="text-emerald-600 text-sm mt-0.5 flex items-center gap-1.5">
                  <Stethoscope size={14} /> {form.title}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {form.email}</span>
                  <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {form.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {form.address}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {form.experience}</span>
                </div>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed max-w-3xl">{form.bio}</p>
              </>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-${s.color}-50 flex items-center justify-center flex-shrink-0`}>
                <s.icon size={20} className={`text-${s.color}-600`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left col */}
          <div className="space-y-6">
            {/* Expertise */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-600" /> Lĩnh vực chuyên môn
              </h2>
              <div className="flex flex-wrap gap-2">
                {expertise.map(e => (
                  <span key={e} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-100">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Work schedule */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-emerald-600" /> Lịch làm việc
              </h2>
              <div className="space-y-2">
                {workSchedule.map(d => (
                  <div key={d.day} className="flex items-center justify-between text-sm">
                    <span className={`w-12 text-xs font-medium ${d.active ? 'text-gray-700' : 'text-gray-300'}`}>{d.day}</span>
                    {d.active ? (
                      <div className="flex flex-col items-end gap-0.5">
                        {d.slots.map(s => (
                          <span key={s} className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">Nghỉ</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col (2 cols) */}
          <div className="col-span-2 space-y-6">
            {/* Education */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600" /> Học vấn
              </h2>
              <div className="space-y-4">
                {education.map((e, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={16} className="text-green-600" />
                      </div>
                      {i < education.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-2" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">{e.degree}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{e.school}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{e.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={16} className="text-emerald-600" /> Chứng chỉ & Chứng nhận
              </h2>
              <div className="space-y-3">
                {certifications.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={15} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Cấp năm {c.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications placeholder */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-600" /> Công trình nghiên cứu
              </h2>
              <div className="space-y-3">
                {[
                  { title: 'Hiệu quả chế độ ăn low-carb trên bệnh nhân ĐTĐ type 2 tại Việt Nam', journal: 'Tạp chí Y học TP.HCM, 2023' },
                  { title: 'Mô hình can thiệp dinh dưỡng cá nhân hoá qua ứng dụng di động', journal: 'Vietnam Journal of Medicine, 2022' },
                  { title: 'Khảo sát tình trạng dinh dưỡng bệnh nhân nội trú tại BV Dinh dưỡng', journal: 'Tạp chí Dinh dưỡng & Thực phẩm, 2021' },
                ].map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 rounded-full bg-emerald-400 flex-shrink-0 mt-1" style={{ minHeight: 36 }} />
                    <div>
                      <p className="text-sm text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.journal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
