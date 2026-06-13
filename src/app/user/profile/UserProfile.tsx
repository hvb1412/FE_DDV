import { useState } from 'react';
import { Camera, User, Phone, Mail, MapPin, Calendar, Activity, Target, Edit2, TrendingDown, TrendingUp, Minus, Flame, Droplets, Scale, CheckCircle2, Leaf } from 'lucide-react';

const goals = [
  { id: 'lose', label: 'Giảm cân', icon: TrendingDown, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'maintain', label: 'Duy trì', icon: Minus, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'gain', label: 'Tăng cân', icon: TrendingUp, color: 'text-blue-600 bg-blue-50 border-blue-200' },
];

const dietPrefs = [
  { label: 'Không kiêng cữ', active: true },
  { label: 'Ít carb', active: false },
  { label: 'Nhiều protein', active: true },
  { label: 'Chay', active: false },
  { label: 'Không gluten', active: false },
  { label: 'Ít muối', active: false },
  { label: 'Ít đường', active: true },
];

const allergies = ['Đậu phộng', 'Hải sản'];

const recentActivity = [
  { action: 'Tra cứu thực phẩm', detail: 'Ức gà luộc, Cơm trắng', time: '2 giờ trước', icon: '🔍' },
  { action: 'Tính nhu cầu năng lượng', detail: 'TDEE: 2,150 kcal/ngày', time: 'Hôm qua', icon: '🧮' },
  { action: 'Đánh giá dinh dưỡng', detail: 'Điểm: 78% — Tốt', time: '3 ngày trước', icon: '📋' },
  { action: 'Nhận diện món ăn', detail: 'Phở bò — 450 kcal', time: '5 ngày trước', icon: '📷' },
];

export function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [activeGoal, setActiveGoal] = useState('maintain');
  const [prefs, setPrefs] = useState(dietPrefs);

  const bmi = 22.5;
  const bmiLabel = bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì';
  const bmiColor = bmi < 18.5 ? 'text-sky-600' : bmi < 25 ? 'text-emerald-600' : bmi < 30 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 p-8 flex items-center gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-white/20 ring-4 ring-white/30 flex items-center justify-center" style={{ fontSize: '2.2rem' }}>
              NM
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-green-700 flex items-center justify-center shadow-md hover:bg-green-50 transition">
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-white" style={{ fontSize: '1.5rem' }}>Nguyễn Văn Minh</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs flex items-center gap-1">
                <Leaf size={11} /> Người dùng
              </span>
            </div>
            <p className="text-green-200 text-sm mt-1">Tham gia từ 01/01/2026 • minh.nguyen@example.com</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs flex items-center gap-1.5">
                🔥 Streak <strong>12 ngày</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs flex items-center gap-1.5">
                🔍 <strong>47</strong> lần tra cứu
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/15 text-white text-xs flex items-center gap-1.5">
                📋 Đánh giá: <strong>78%</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-green-700 hover:bg-green-50 text-sm font-semibold shadow-md transition flex-shrink-0"
          >
            <Edit2 size={15} /> {editing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Col 1: Personal info + body stats */}
        <div className="space-y-5">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
                <User size={16} className="text-gray-500" /> Thông tin cá nhân
              </h3>
              {!editing && <button className="text-xs text-emerald-600 hover:underline">Sửa</button>}
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: Calendar, label: 'Ngày sinh', value: '15/03/1990 (36 tuổi)' },
                { icon: User, label: 'Giới tính', value: 'Nam' },
                { icon: Phone, label: 'Số điện thoại', value: '0901 234 567' },
                { icon: Mail, label: 'Email', value: 'minh.nguyen@example.com' },
                { icon: MapPin, label: 'Địa chỉ', value: 'Quận 1, TP. Hồ Chí Minh' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon size={15} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{item.label}</p>
                    {editing ? (
                      <input defaultValue={item.value} className="mt-0.5 w-full text-sm text-gray-900 border-b border-emerald-300 focus:outline-none bg-transparent py-0.5" />
                    ) : (
                      <p className="text-sm text-gray-900 truncate">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
                <Activity size={16} className="text-gray-500" /> Chỉ số cơ thể
              </h3>
              <button className="text-xs text-emerald-600 hover:underline">Cập nhật</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Cao', value: '170', unit: 'cm' },
                  { label: 'Nặng', value: '63.5', unit: 'kg' },
                  { label: 'BMI', value: '22.5', unit: '' },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500">{s.label}</p>
                    <p className="text-gray-900 font-semibold mt-0.5">{s.value}<span className="text-xs text-gray-400 ml-0.5">{s.unit}</span></p>
                  </div>
                ))}
              </div>

              {/* BMI bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-gray-500">Chỉ số BMI</p>
                  <span className={`text-xs font-semibold ${bmiColor}`}>{bmiLabel}</span>
                </div>
                <div className="h-2.5 bg-gradient-to-r from-sky-300 via-emerald-400 via-amber-400 to-red-400 rounded-full relative">
                  <div
                    className="absolute -top-1 w-4 h-4 bg-white rounded-full border-2 border-gray-700 shadow"
                    style={{ left: `${Math.min(Math.max((bmi - 15) * 5, 0), 100)}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[9px] text-gray-400">
                  <span>Thiếu cân</span><span>Bình thường</span><span>Thừa cân</span>
                </div>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-2.5">
                  <Flame size={16} className="text-orange-500" />
                  <div>
                    <p className="text-[10px] text-gray-500">Calo/ngày</p>
                    <p className="text-sm font-semibold text-gray-900">2,100 kcal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-sky-50 rounded-xl p-2.5">
                  <Droplets size={16} className="text-sky-500" />
                  <div>
                    <p className="text-[10px] text-gray-500">Nước/ngày</p>
                    <p className="text-sm font-semibold text-gray-900">2.0 L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Goals + dietary preferences */}
        <div className="space-y-5">
          {/* Goal */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
                <Target size={16} className="text-gray-500" /> Mục tiêu sức khoẻ
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGoal(g.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition ${
                      activeGoal === g.id ? g.color : 'border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <g.icon size={18} />
                    <span className="text-xs font-medium">{g.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Mức vận động', value: 'Vừa phải (3–5 ngày/tuần)' },
                  { label: 'Calo mục tiêu', value: '2,100 kcal/ngày' },
                  { label: 'Protein mục tiêu', value: '130g / ngày' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="text-xs text-gray-500">{r.label}</p>
                    <p className="text-xs font-medium text-gray-900">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dietary preferences */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2 text-sm font-semibold">
                <Leaf size={16} className="text-gray-500" /> Sở thích ăn uống
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {prefs.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setPrefs(prefs.map((x, j) => j === i ? { ...x, active: !x.active } : x))}
                    className={`px-3 py-1.5 rounded-full text-xs border transition flex items-center gap-1 ${
                      p.active ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    {p.active && <CheckCircle2 size={11} />}
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">⚠️ Dị ứng / Không dung nạp</p>
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((a) => (
                    <span key={a} className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs border border-red-100">{a}</span>
                  ))}
                  <button className="px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-400 text-xs hover:border-gray-400">+ Thêm</button>
                </div>
              </div>
            </div>
          </div>

          {/* Scale chart placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 text-sm font-semibold flex items-center gap-2">
                <Scale size={16} className="text-gray-500" /> Cân nặng 6 tháng qua
              </h3>
              <span className="text-xs text-emerald-600">▼ −1.5 kg</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {[65, 64.8, 64.5, 64.2, 63.8, 63.5].map((w, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md ${i === 5 ? 'bg-emerald-500' : 'bg-emerald-200'}`}
                    style={{ height: `${((w - 62) / 4) * 100}%` }}
                  />
                  <p className="text-[9px] text-gray-400">{['T1', 'T2', 'T3', 'T4', 'T5', 'T6'][i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Recent activity + tips */}
        <div className="space-y-5">
          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 text-sm font-semibold">Hoạt động gần đây</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{a.action}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{a.detail}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{a.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement / streak banner */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-md">
            <p className="text-sm font-semibold">🔥 Streak 12 ngày liên tiếp!</p>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Bạn đã tra cứu dinh dưỡng 12 ngày liên tiếp. Tiếp tục để giữ vững thói quen ăn uống lành mạnh!
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < 12 ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
            <p className="text-[10px] text-white/70 mt-1.5">12/14 ngày mục tiêu tháng này</p>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">Truy cập nhanh</p>
            <div className="space-y-1.5">
              {[
                { emoji: '🧮', label: 'Tính lại nhu cầu năng lượng', to: '/u/calculator' },
                { emoji: '📋', label: 'Làm bài đánh giá dinh dưỡng', to: '/u/assessment' },
                { emoji: '💬', label: 'Hỏi đáp với AI', to: '/u/qa' },
                { emoji: '⚙️', label: 'Cài đặt tài khoản', to: '/u/settings' },
              ].map((link) => (
                <a key={link.label} href={link.to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-base">{link.emoji}</span>
                  <span className="text-sm text-gray-700 flex-1">{link.label}</span>
                  <span className="text-gray-300">›</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
