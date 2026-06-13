import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Flame, Droplets, Activity, Pill, Stethoscope, Camera, Search, Calculator,
  MessageCircleQuestion, Award, Sparkles, ChevronRight, Calendar, MessageCircle,
  Apple, Utensils, Salad, CheckCircle2, Clock, TrendingDown, ClipboardCheck, Coffee, Cookie,
} from 'lucide-react';

const weightData = [
  { day: 'T2', w: 65.0 },
  { day: 'T3', w: 64.8 },
  { day: 'T4', w: 64.5 },
  { day: 'T5', w: 64.2 },
  { day: 'T6', w: 64.0 },
  { day: 'T7', w: 63.7 },
  { day: 'CN', w: 63.5 },
];

const reminders = [
  { id: 1, time: '08:00', title: 'Uống thuốc tiểu đường', urgent: true, done: true, icon: Pill },
  { id: 2, time: '12:00', title: 'Đo đường huyết sau ăn', urgent: false, done: false, icon: Activity },
  { id: 3, time: '15:00', title: 'Tư vấn với BS. Trần Thị A', urgent: false, done: false, icon: Stethoscope },
  { id: 4, time: '20:00', title: 'Đi bộ 30 phút', urgent: false, done: false, icon: Activity },
];

const meals = [
  { id: 'sang', label: 'Bữa sáng', time: '07:00', name: 'Phở gà',                    kcal: 380, eaten: true,  icon: Apple   },
  { id: 'phu1', label: 'Phụ sáng', time: '10:00', name: 'Sữa chua + chuối',          kcal: 180, eaten: true,  icon: Coffee  },
  { id: 'trua', label: 'Bữa trưa', time: '12:00', name: 'Cơm gạo lứt + ức gà nướng', kcal: 520, eaten: false, icon: Utensils },
  { id: 'phu2', label: 'Phụ chiều', time: '15:00', name: 'Hạt óc chó + trà xanh',    kcal: 150, eaten: false, icon: Cookie  },
  { id: 'toi',  label: 'Bữa tối',  time: '18:30', name: 'Cá hồi áp chảo + salad',    kcal: 450, eaten: false, icon: Salad   },
];

const dailyTargetKcal = 1800;
const userHeightM = 1.68;
const waterTargetL = 2.0;
const waterDrunkL = 1.2;

const streakDays = 12;

function getStreakTier(days: number) {
  if (days >= 100) return { label: 'Huyền thoại', emoji: '💎', gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500' };
  if (days >= 60)  return { label: 'Đại cao thủ', emoji: '👑', gradient: 'from-yellow-400 via-amber-500 to-orange-500' };
  if (days >= 30)  return { label: 'Cao thủ',     emoji: '⭐', gradient: 'from-red-500 via-rose-500 to-pink-500' };
  if (days >= 14)  return { label: 'Bùng cháy',   emoji: '🔥', gradient: 'from-orange-500 to-amber-500' };
  if (days >= 7)   return { label: 'Đang nóng',   emoji: '🌟', gradient: 'from-amber-400 to-yellow-500' };
  if (days >= 3)   return { label: 'Khởi động',   emoji: '✨', gradient: 'from-emerald-400 to-teal-500' };
  return { label: 'Mới bắt đầu', emoji: '🌱', gradient: 'from-slate-400 to-slate-500' };
}

export function PatientHome() {
  const navigate = useNavigate();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const streakTier = getStreakTier(streakDays);

  const eatenKcal = meals.filter((m) => m.eaten).reduce((s, m) => s + m.kcal, 0);
  const kcalProgress = Math.round((eatenKcal / dailyTargetKcal) * 100);
  const currentWeight = weightData[weightData.length - 1].w;
  const weightDelta = +(weightData[0].w - currentWeight).toFixed(1);
  const bmi = +(currentWeight / (userHeightM * userHeightM)).toFixed(1);
  const bmiLabel = bmi < 18.5 ? 'Thiếu cân' : bmi < 23 ? 'Bình thường ✓' : bmi < 25 ? 'Thừa cân' : 'Béo phì';
  const waterProgress = Math.round((waterDrunkL / waterTargetL) * 100);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Chào buổi sáng';
    if (h < 14) return 'Chào buổi trưa';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  })();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl p-4 sm:p-6 text-white shadow-md flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white/90">{greeting}, Minh 👋</p>
          <h1 className="mt-1 text-white">Hôm nay bạn đã hoàn thành {kcalProgress}% mục tiêu năng lượng</h1>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-3 text-sm text-white/90">
            <span
              title={`${streakTier.emoji} ${streakTier.label}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${streakTier.gradient} text-white shadow ring-1 ring-white/30 font-semibold text-xs`}
            >
              <Flame size={13} />
              {streakDays} ngày {streakTier.emoji}
            </span>
            <span className="text-white/70">•</span>
            <span>🥈 245 điểm</span>
            <span className="text-white/70">•</span>
            <span>Giảm cân đúng kế hoạch</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => navigate('/p/chat')} className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm flex items-center gap-2">
            <MessageCircle size={16} /> Nhắn bác sĩ
          </button>
          <button onClick={() => navigate('/p/appointments')} className="px-4 py-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-sm flex items-center gap-2">
            <Calendar size={16} /> Đặt lịch tư vấn
          </button>
        </div>
      </section>

      {/* Top stats — 4 cards */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'BMI', value: bmi.toFixed(1), sub: bmiLabel, icon: Activity, color: 'emerald' },
          { label: 'Năng lượng hôm nay', value: eatenKcal.toLocaleString('vi-VN'), sub: `/ ${dailyTargetKcal.toLocaleString('vi-VN')} kcal`, icon: Flame, color: 'orange', progress: kcalProgress },
          { label: 'Nước đã uống', value: `${waterDrunkL}L`, sub: `/ ${waterTargetL.toFixed(1)} L`, icon: Droplets, color: 'sky', progress: waterProgress },
          { label: 'Cân nặng', value: `${currentWeight} kg`, sub: `${weightDelta > 0 ? '↓' : '↑'} ${Math.abs(weightDelta)}kg / tuần`, icon: TrendingDown, color: 'violet' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem' }}>{s.value}</p>
                <p className={`text-xs mt-0.5 text-${s.color}-600`}>{s.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                <s.icon size={22} className={`text-${s.color}-600`} />
              </div>
            </div>
            {s.progress && (
              <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className={`h-full bg-${s.color}-500`} style={{ width: `${s.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Main 3-col grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today menu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
              <div className="min-w-0">
                <h3 className="text-gray-900 flex items-center gap-2"><Utensils size={18} className="text-emerald-600 flex-shrink-0" /> Thực đơn hôm nay</h3>
                <p className="text-xs text-gray-500 mt-0.5">Do BS. Trần Thị A kê — Tổng {meals.reduce((s, m) => s + m.kcal, 0).toLocaleString('vi-VN')} kcal / Mục tiêu {dailyTargetKcal.toLocaleString('vi-VN')} kcal</p>
              </div>
              <button onClick={() => navigate('/p/menu')} className="text-sm text-emerald-600 flex items-center hover:underline flex-shrink-0 whitespace-nowrap">
                Xem chi tiết <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
              {(() => {
                const upcoming = meals.filter((m) => !m.eaten).sort((a, b) => a.time.localeCompare(b.time));
                const eaten = meals.filter((m) => m.eaten).sort((a, b) => b.time.localeCompare(a.time));
                const nextUpcomingId = upcoming[0]?.id;
                return [...upcoming, ...eaten].slice(0, 3).map((m) => {
                  const isNext = m.id === nextUpcomingId;
                  return (
                    <div
                      key={m.id}
                      className={`rounded-xl border-2 p-4 transition flex flex-col h-full ${
                        !m.eaten && isNext
                          ? 'border-emerald-400 bg-emerald-50 shadow-sm ring-2 ring-emerald-100'
                          : 'border-gray-100 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center mb-3">
                        <m.icon size={32} className="text-emerald-700" />
                      </div>
                      <p className="text-xs text-gray-500">{m.label} • {m.time}</p>
                      <p className="text-sm text-gray-900 mt-0.5">{m.name}</p>
                      <p className="text-xs text-orange-600 mt-1"><Flame size={11} className="inline" /> {m.kcal} kcal</p>
                      <div className="mt-auto pt-3">
                        {m.eaten ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 size={14} /> Đã ăn
                          </span>
                        ) : (
                          <button className="w-full px-3 py-1.5 rounded-md border border-emerald-600 text-emerald-600 text-xs hover:bg-emerald-50">
                            Đánh dấu đã ăn
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            {(() => {
              const eaten = meals.filter((m) => m.eaten).reduce((s, m) => s + m.kcal, 0);
              const remainingPlan = meals.filter((m) => !m.eaten).reduce((s, m) => s + m.kcal, 0);
              const gapToTarget = Math.max(0, dailyTargetKcal - eaten - remainingPlan);
              return (
                <div className="bg-amber-50 border-t border-amber-100 p-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  {remainingPlan > 0 ? (
                    <p className="text-xs text-amber-900">
                      💡 Còn <strong>{remainingPlan.toLocaleString('vi-VN')} kcal</strong> cần nạp theo thực đơn (đã ăn {eaten.toLocaleString('vi-VN')}/{dailyTargetKcal.toLocaleString('vi-VN')} kcal mục tiêu)
                    </p>
                  ) : gapToTarget > 0 ? (
                    <p className="text-xs text-amber-900">
                      🎉 Đã hoàn tất thực đơn — còn thiếu <strong>{gapToTarget.toLocaleString('vi-VN')} kcal</strong> để đạt mục tiêu {dailyTargetKcal.toLocaleString('vi-VN')} kcal
                    </p>
                  ) : (
                    <p className="text-xs text-amber-900">🎉 Bạn đã đạt mục tiêu năng lượng hôm nay — {eaten.toLocaleString('vi-VN')} kcal</p>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Progress chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h3 className="text-gray-900 flex items-center gap-2"><Activity size={18} className="text-emerald-600 flex-shrink-0" /> Tiến trình cân nặng — 7 ngày qua</h3>
                <p className="text-xs text-emerald-600 mt-0.5">↓ Giảm 1.5kg so với tuần trước — Tuyệt vời! 🎉</p>
              </div>
              <button onClick={() => navigate('/p/health')} className="text-sm text-emerald-600 flex items-center hover:underline flex-shrink-0 whitespace-nowrap">
                Chi tiết <ChevronRight size={16} />
              </button>
            </div>
            <div style={{ width: '100%', height: 224 }} className="relative">
              {(() => {
                const w = 600, h = 224, pad = 32;
                const min = 63, max = 65.5;
                const points = weightData.map((d, i) => {
                  const x = pad + (i * (w - pad * 2)) / (weightData.length - 1);
                  const y = h - pad - ((d.w - min) / (max - min)) * (h - pad * 2);
                  return { x, y, ...d };
                });
                const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                const area = `${path} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;
                const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relX = ((e.clientX - rect.left) / rect.width) * w;
                  const idx = Math.round(((relX - pad) / (w - pad * 2)) * (weightData.length - 1));
                  setHoverIdx(Math.min(weightData.length - 1, Math.max(0, idx)));
                };
                const hovered = hoverIdx != null ? points[hoverIdx] : null;
                const prev = hoverIdx != null && hoverIdx > 0 ? points[hoverIdx - 1] : null;
                const delta = hovered && prev ? +(hovered.w - prev.w).toFixed(1) : null;
                const tooltipLeftPct = hovered ? (hovered.x / w) * 100 : 0;
                const placeRight = tooltipLeftPct < 60;
                return (
                  <>
                    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} onMouseMove={handleMove} onMouseLeave={() => setHoverIdx(null)}>
                      {[63, 64, 65].map((v) => {
                        const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
                        return (
                          <g key={`grid-${v}`}>
                            <line x1={pad} x2={w - pad} y1={y} y2={y} stroke="#f3f4f6" />
                            <text x={4} y={y + 4} fontSize={11} fill="#9ca3af">{v}</text>
                          </g>
                        );
                      })}
                      <path d={area} fill="rgba(16,185,129,0.12)" />
                      <path d={path} fill="none" stroke="#10b981" strokeWidth={3} />
                      {points.map((p, i) => (
                        <g key={`pt-${p.day}`}>
                          <circle cx={p.x} cy={p.y} r={hoverIdx === i ? 6 : 4} fill="#10b981" stroke={hoverIdx === i ? '#fff' : 'none'} strokeWidth={hoverIdx === i ? 2 : 0} />
                          <text x={p.x} y={h - 8} fontSize={11} fill={hoverIdx === i ? '#10b981' : '#9ca3af'} textAnchor="middle">{p.day}</text>
                        </g>
                      ))}
                      {hovered && <line x1={hovered.x} x2={hovered.x} y1={pad} y2={h - pad} stroke="#10b981" strokeDasharray="3 3" strokeOpacity="0.5" />}
                    </svg>
                    {hovered && (
                      <div
                        className="absolute pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs min-w-[130px]"
                        style={{ left: `${tooltipLeftPct}%`, top: 8, transform: placeRight ? 'translateX(12px)' : 'translateX(calc(-100% - 12px))' }}
                      >
                        <p className="text-gray-500 mb-1">{hovered.day}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Cân nặng
                          </span>
                          <span className="text-gray-900">{hovered.w.toFixed(1)} <span className="text-gray-400">kg</span></span>
                        </div>
                        {delta !== null && (
                          <p className={`mt-1 text-[11px] ${delta < 0 ? 'text-emerald-600' : delta > 0 ? 'text-rose-600' : 'text-gray-500'}`}>
                            {delta > 0 ? '↑' : delta < 0 ? '↓' : '•'} {Math.abs(delta)} kg so với hôm trước
                          </p>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Quick tools */}
          <div>
            <h3 className="text-gray-900 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-emerald-600" /> Công cụ tra cứu nhanh</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Camera, label: 'Nhận diện món ăn', desc: 'Chụp ảnh nhận diện', to: '/p/scan', color: 'from-pink-400 to-rose-500' },
                { icon: Search, label: 'Tra cứu thực phẩm', desc: 'Database hàng nghìn món', to: '/p/food-search', color: 'from-blue-400 to-sky-500' },
                { icon: Calculator, label: 'Tính nhu cầu', desc: 'TDEE & vi chất', to: '/p/calculator', color: 'from-amber-400 to-orange-500' },
                { icon: ClipboardCheck, label: 'Đánh giá DD', desc: 'Theo chuẩn WHO', to: '/p/assessment', color: 'from-emerald-400 to-green-500' },
                { icon: MessageCircleQuestion, label: 'Hỏi đáp AI', desc: 'Tư vấn 24/7', to: '/p/qa', color: 'from-violet-400 to-purple-500' },
                { icon: Award, label: 'Học mỗi ngày', desc: 'Mini-learning', to: '/p/learning', color: 'from-yellow-400 to-amber-500' },
                { icon: Apple, label: 'Khuyến nghị', desc: 'Theo nhóm tuổi', to: '/p/recommendations', color: 'from-teal-400 to-cyan-500' },
                { icon: Award, label: 'Đổi quà', desc: '245 điểm có', to: '/p/rewards', color: 'from-fuchsia-400 to-pink-500' },
              ].map((t) => (
                <button
                  key={t.to}
                  onClick={() => navigate(t.to)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white mb-2`}>
                    <t.icon size={20} />
                  </div>
                  <p className="text-sm text-gray-900">{t.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — 1 col */}
        <div className="space-y-6">
          {/* Appointment reminder */}
          <button
            onClick={() => navigate('/p/appointments')}
            className="w-full bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border-2 border-blue-200 shadow-sm p-4 flex items-center gap-3 hover:border-blue-400 hover:shadow-md transition text-left ring-2 ring-blue-100"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow">
              <Calendar size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Bạn có 1 lịch hẹn sắp tới</p>
              <p className="text-xs text-gray-600 mt-0.5">Nhấn để xem chi tiết lịch hẹn</p>
            </div>
            <ChevronRight size={18} className="text-blue-600 flex-shrink-0" />
          </button>

          {/* Reminders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
              <h3 className="text-gray-900 flex items-center gap-2 min-w-0"><Clock size={18} className="text-emerald-600 flex-shrink-0" /> Nhắc nhở hôm nay</h3>
              <button onClick={() => navigate('/p/reminders')} className="text-xs text-emerald-600 hover:underline flex-shrink-0 whitespace-nowrap">Xem tất cả</button>
            </div>
            {[...reminders].sort((a, b) => Number(a.done) - Number(b.done)).map((r, i, arr) => (
              <div key={r.id} className={`flex items-center gap-3 p-3 ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${r.urgent ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'} ${r.urgent && !r.done ? 'animate-pulse' : ''}`}>
                  <r.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${r.done ? 'text-gray-400 line-through' : 'text-gray-900'} truncate`}>{r.title}</p>
                  <p className="text-xs text-gray-500">{r.time}{r.urgent && !r.done ? ' • Khẩn cấp' : ''}</p>
                </div>
                {r.done ? (
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <button className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700">
                    Xong
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Learning of the day */}
          <div onClick={() => navigate('/p/learning')} className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 sm:p-7 text-white shadow-md cursor-pointer hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Award size={26} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80">Bài học hôm nay • 3 phút</p>
                <p className="mt-2 text-lg">Vì sao nên ăn cá 2 lần/tuần?</p>
                <p className="text-sm text-white/90 mt-3">🏆 Tích 10 điểm khi hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GraduationCapIcon() {
  return <Award size={20} />;
}
