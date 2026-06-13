import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Apple, Utensils, Salad, Coffee, Cookie, ChevronLeft, ChevronRight, CheckCircle2,
  Flame, Beef, Wheat, Droplet, Info, Download, Printer, MessageCircle, Stethoscope, X,
} from 'lucide-react';
import { toast } from 'sonner';

const week = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

type Meal = {
  id: string; label: string; time: string; name: string;
  kcal: number; protein: number; carb: number; fat: number;
  icon: typeof Apple; eaten: boolean; ingredients: string[]; recipe: string;
};

const initialMeals: Meal[] = [
  { id: 'sang', label: 'Bữa sáng', time: '07:00', name: 'Phở gà', kcal: 380, protein: 22, carb: 50, fat: 8, icon: Apple, eaten: true, ingredients: ['Bánh phở 100g', 'Ức gà 80g', 'Hành lá', 'Giá đỗ'], recipe: 'Luộc ức gà, xé sợi. Trần bánh phở, xếp ra tô, thêm hành lá, giá đỗ, chan nước dùng.' },
  { id: 'phu1', label: 'Phụ sáng', time: '10:00', name: 'Sữa chua + chuối', kcal: 180, protein: 6, carb: 28, fat: 4, icon: Coffee, eaten: true, ingredients: ['Sữa chua không đường 100ml', 'Chuối 1 quả'], recipe: 'Cắt chuối lát, trộn cùng sữa chua, thêm hạt chia nếu thích.' },
  { id: 'trua', label: 'Bữa trưa', time: '12:00', name: 'Cơm gạo lứt + ức gà nướng', kcal: 520, protein: 38, carb: 60, fat: 12, icon: Utensils, eaten: false, ingredients: ['Gạo lứt 80g', 'Ức gà 120g', 'Rau cải', 'Dầu olive 1 thìa'], recipe: 'Ướp ức gà với tiêu, dầu olive, nướng 180°C trong 20 phút. Ăn kèm cơm gạo lứt và rau cải luộc.' },
  { id: 'phu2', label: 'Phụ chiều', time: '15:00', name: 'Hạt óc chó + trà xanh', kcal: 150, protein: 4, carb: 8, fat: 12, icon: Cookie, eaten: false, ingredients: ['Hạt óc chó 20g', 'Trà xanh không đường'], recipe: 'Ăn hạt sống hoặc rang nhẹ, uống kèm trà xanh ấm.' },
  { id: 'toi', label: 'Bữa tối', time: '18:30', name: 'Cá hồi áp chảo + salad', kcal: 450, protein: 32, carb: 25, fat: 22, icon: Salad, eaten: false, ingredients: ['Cá hồi 120g', 'Salad rau xanh 150g', 'Dầu olive', 'Chanh'], recipe: 'Áp chảo cá hồi 3-4 phút mỗi mặt với chút dầu olive. Trộn salad với dầu olive và nước cốt chanh.' },
];

const doctor = {
  name: 'BS. Trần Thị A',
  specialty: 'Dinh dưỡng',
  diagnosis: 'Đái tháo đường type 2',
  updatedAt: '18/05/2026',
  note: 'Hạn chế đường đơn và tinh bột tinh chế. Ưu tiên gạo lứt, rau xanh, protein nạc. Đo đường huyết sau ăn 2h.',
};

export function PatientMenu() {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(3);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [selectedMealId, setSelectedMealId] = useState<string>('trua');
  const [showExport, setShowExport] = useState<null | 'print' | 'pdf'>(null);
  const [exportScope, setExportScope] = useState<'today' | 'week'>('today');

  const selectedMeal = meals.find((m) => m.id === selectedMealId) ?? meals[0];

  const markEaten = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, eaten: true } : m)));
    toast.success('Đã ghi nhận bữa ăn');
  };

  const totalKcal = meals.reduce((s, m) => s + m.kcal, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarb = meals.reduce((s, m) => s + m.carb, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);
  const eatenKcal = meals.filter((m) => m.eaten).reduce((s, m) => s + m.kcal, 0);

  const dayLabel = `Thứ ${selectedDay === 6 ? 'CN' : selectedDay + 2}, ${18 + selectedDay}/5/2026`;

  const doExport = (mode: 'print' | 'pdf') => {
    const w = window.open('', '_blank', 'width=900,height=1000');
    if (!w) {
      toast.error('Trình duyệt đã chặn cửa sổ in. Hãy bật pop-up.');
      return;
    }
    const escape = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
    const dayBlocks =
      exportScope === 'today'
        ? [{ title: dayLabel, meals }]
        : week.map((d, i) => ({
            title: `${d === 'CN' ? 'Chủ nhật' : 'Thứ ' + (i + 2)} — ${18 + i}/5/2026`,
            meals: initialMeals.map((m) => ({ ...m, eaten: false })),
          }));
    const totalsHtml = (ms: Meal[]) => {
      const k = ms.reduce((s, m) => s + m.kcal, 0);
      const p = ms.reduce((s, m) => s + m.protein, 0);
      const c = ms.reduce((s, m) => s + m.carb, 0);
      const f = ms.reduce((s, m) => s + m.fat, 0);
      return `<div class="totals"><span>${k} kcal</span><span>P ${p}g</span><span>C ${c}g</span><span>F ${f}g</span></div>`;
    };
    const blocksHtml = dayBlocks
      .map(
        (b) => `
      <section class="day">
        <h2>${escape(b.title)}</h2>
        ${totalsHtml(b.meals)}
        <table>
          <thead><tr><th style="width:80px">Giờ</th><th>Bữa</th><th>Món</th><th style="width:80px">Kcal</th><th style="width:140px">P / C / F</th></tr></thead>
          <tbody>
            ${b.meals
              .map(
                (m) => `<tr>
              <td>${escape(m.time)}</td>
              <td>${escape(m.label)}</td>
              <td><div class="meal-name">${escape(m.name)}</div><div class="meal-ing">${escape(m.ingredients.join(', '))}</div></td>
              <td>${m.kcal}</td>
              <td>${m.protein}g / ${m.carb}g / ${m.fat}g</td>
            </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </section>`,
      )
      .join('');

    const title = `Thực đơn ${exportScope === 'today' ? 'ngày ' + dayLabel : 'tuần ' + (20 + weekOffset) + ', tháng 5/2026'} — ${doctor.name}`;
    w.document.write(`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>${escape(title)}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;padding:32px;margin:0}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #10b981;padding-bottom:12px;margin-bottom:18px}
  .head h1{margin:0 0 4px;font-size:20px;color:#065f46}
  .head .meta{font-size:12px;color:#6b7280}
  .doctor{font-size:13px;color:#374151;margin-top:6px}
  .note{background:#ecfdf5;border-left:4px solid #10b981;padding:10px 14px;border-radius:6px;margin-bottom:18px;font-size:13px;color:#065f46}
  .day{margin-bottom:24px;page-break-inside:avoid}
  .day h2{font-size:15px;margin:0 0 6px;color:#065f46;background:#f0fdf4;padding:8px 12px;border-radius:6px}
  .totals{display:flex;gap:12px;font-size:12px;color:#374151;margin:6px 0 10px;padding-left:12px}
  .totals span{padding:2px 8px;background:#f3f4f6;border-radius:999px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;background:#f9fafb;border-bottom:1px solid #e5e7eb;padding:8px;color:#374151;font-weight:600}
  td{border-bottom:1px solid #f3f4f6;padding:8px;vertical-align:top}
  .meal-name{font-weight:600}
  .meal-ing{color:#6b7280;font-size:11px;margin-top:2px}
  .foot{margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;display:flex;justify-content:space-between}
  @media print { body{padding:18px} .no-print{display:none} }
</style></head><body>
  <div class="head">
    <div>
      <h1>${escape(title)}</h1>
      <div class="doctor"><strong>${escape(doctor.name)}</strong> — ${escape(doctor.specialty)} • Chẩn đoán: ${escape(doctor.diagnosis)}</div>
      <div class="meta">Cập nhật: ${escape(doctor.updatedAt)} • Bệnh nhân: Nguyễn Văn Minh</div>
    </div>
    <div class="meta" style="text-align:right">In: ${new Date().toLocaleString('vi-VN')}</div>
  </div>
  <div class="note"><strong>Lưu ý từ bác sĩ:</strong> ${escape(doctor.note)}</div>
  ${blocksHtml}
  <div class="foot"><span>Dinh Dưỡng Việt — Hệ thống chăm sóc dinh dưỡng</span><span>Trang 1</span></div>
  <script>window.onload=function(){${mode === 'print' ? 'window.print();' : 'setTimeout(function(){window.print();},150);'}};</script>
</body></html>`);
    w.document.close();
    toast.success(mode === 'pdf' ? 'Cửa sổ in đã mở — chọn "Save as PDF" để lưu file' : 'Đang gửi tới máy in...');
    setShowExport(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner: doctor & diagnosis + note */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-4 border-b border-gray-100">
          <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
              <Stethoscope size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-900">{doctor.name}</p>
                <span className="text-xs text-gray-500">• {doctor.specialty}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">{doctor.diagnosis}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Cập nhật {doctor.updatedAt} • Cá nhân hoá cho Nguyễn Văn Minh</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap lg:flex-shrink-0">
            <button onClick={() => setShowExport('print')} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm flex items-center gap-1.5 hover:bg-gray-50 flex-1 lg:flex-none justify-center">
              <Printer size={14} /> In
            </button>
            <button onClick={() => setShowExport('pdf')} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm flex items-center gap-1.5 hover:bg-gray-50 flex-1 lg:flex-none justify-center">
              <Download size={14} /> PDF
            </button>
            <button onClick={() => navigate('/p/chat')} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm flex items-center gap-1.5 hover:bg-emerald-700 flex-1 lg:flex-none justify-center whitespace-nowrap">
              <MessageCircle size={14} /> <span className="hidden sm:inline">Trao đổi với</span> BS
            </button>
          </div>
        </div>

        {/* Inline note */}
        <div className="px-5 py-3 flex items-start gap-2 border-t border-amber-100 bg-amber-50/40">
          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-amber-700">Lưu ý từ bác sĩ:</span> {doctor.note}
          </p>
        </div>
      </div>

      {/* Week selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} /></button>
          <p className="text-gray-900">Tuần {20 + weekOffset} — Tháng 5, 2026</p>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {week.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className={`p-2 sm:p-3 rounded-xl text-center transition ${i === selectedDay ? 'bg-emerald-600 text-white shadow' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
            >
              <p className="text-xs">{d}</p>
              <p className="mt-1 text-sm sm:text-base">{18 + i}</p>
              <p className="text-[9px] sm:text-[10px] mt-1">{i < selectedDay ? '✓' : i === selectedDay ? 'Nay' : ''}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[...meals].sort((a, b) => Number(a.eaten) - Number(b.eaten)).map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMealId(m.id)}
              className={`bg-white rounded-2xl border-2 p-4 shadow-sm cursor-pointer transition ${
                selectedMealId === m.id ? 'border-emerald-500' : 'border-transparent hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center flex-shrink-0">
                  <m.icon size={22} className="text-emerald-700 sm:size-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-500">{m.label} • {m.time}</p>
                    {m.eaten && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Đã ăn</span>}
                  </div>
                  <p className="text-gray-900 mt-0.5 truncate">{m.name}</p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-600 flex-wrap">
                    <span className="text-orange-600 whitespace-nowrap"><Flame size={11} className="inline" /> {m.kcal} kcal</span>
                    <span>P {m.protein}g</span>
                    <span>C {m.carb}g</span>
                    <span>F {m.fat}g</span>
                  </div>
                </div>
                {m.eaten ? (
                  <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <button onClick={(e) => markEaten(m.id, e)} className="px-2 sm:px-3 py-1.5 rounded-md border border-emerald-600 text-emerald-600 text-xs sm:text-sm hover:bg-emerald-50 flex-shrink-0 whitespace-nowrap">
                    Đã ăn
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-md">
            <p className="text-sm text-white/90">Năng lượng đã nạp hôm nay</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p style={{ fontSize: '2rem' }}>{eatenKcal.toLocaleString('vi-VN')}</p>
              <p className="text-sm text-white/80">/ 1,800 kcal mục tiêu</p>
            </div>
            <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${Math.min(100, (eatenKcal / 1800) * 100)}%` }} />
            </div>
            <p className="text-xs text-white/90 mt-2">Thực đơn tổng {totalKcal.toLocaleString('vi-VN')} kcal • Còn lại {Math.max(0, 1800 - eatenKcal).toLocaleString('vi-VN')} kcal</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: Beef, label: 'Protein', value: `${totalProtein}g` },
                { icon: Wheat, label: 'Carb', value: `${totalCarb}g` },
                { icon: Droplet, label: 'Fat', value: `${totalFat}g` },
              ].map((m) => (
                <div key={m.label} className="bg-white/15 rounded-lg p-2 text-center">
                  <m.icon size={14} className="mx-auto text-white/80 mb-0.5" />
                  <p className="text-[10px] text-white/80">{m.label}</p>
                  <p className="text-sm">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500">{selectedMeal.label}</p>
            <h3 className="text-gray-900 mt-1">{selectedMeal.name}</h3>
            <p className="text-sm text-orange-600 mt-1"><Flame size={12} className="inline" /> {selectedMeal.kcal} kcal</p>

            <p className="text-xs text-gray-500 mt-4 mb-1">Thành phần</p>
            <ul className="text-sm text-gray-700 space-y-0.5">
              {selectedMeal.ingredients.map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 mt-4 mb-1">Cách chế biến</p>
            <p className="text-sm text-gray-700">{selectedMeal.recipe}</p>

            <button onClick={() => toast.info(`Đang mở video hướng dẫn: ${selectedMeal.name}`)} className="w-full mt-4 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
              Xem video hướng dẫn
            </button>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowExport(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {showExport === 'print' ? <Printer size={18} className="text-emerald-600" /> : <Download size={18} className="text-emerald-600" />}
                <h3 className="text-gray-900">{showExport === 'print' ? 'In thực đơn' : 'Xuất thực đơn PDF'}</h3>
              </div>
              <button onClick={() => setShowExport(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">Phạm vi</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setExportScope('today')}
                    className={`p-3 rounded-xl border-2 text-left transition ${exportScope === 'today' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className="text-sm text-gray-900">Hôm nay</p>
                    <p className="text-xs text-gray-500 mt-0.5">{dayLabel}</p>
                  </button>
                  <button
                    onClick={() => setExportScope('week')}
                    className={`p-3 rounded-xl border-2 text-left transition ${exportScope === 'week' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className="text-sm text-gray-900">Cả tuần</p>
                    <p className="text-xs text-gray-500 mt-0.5">Tuần {20 + weekOffset}, T5/2026</p>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700">
                <p>Thực đơn được kê bởi: <span className="text-gray-900">{doctor.name}</span> • {doctor.diagnosis}</p>
                {showExport === 'pdf' && <p className="mt-1 text-gray-500">Trình duyệt sẽ mở hộp thoại in — chọn <span className="text-gray-900">"Save as PDF"</span> ở mục Destination để lưu thành file.</p>}
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowExport(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Huỷ</button>
              <button onClick={() => doExport(showExport)} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5">
                {showExport === 'print' ? <><Printer size={14} /> In ngay</> : <><Download size={14} /> Tạo PDF</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
