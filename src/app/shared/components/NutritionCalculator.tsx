import { useState, useMemo } from 'react';
import { Calculator, Flame, Beef, Wheat, Droplet, Info, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type NutritionCalculatorProps = {
  userRole?: 'patient' | 'user';
};

export function NutritionCalculator({ userRole = 'user' }: NutritionCalculatorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  const result = useMemo(() => {
    const bmr = gender === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = bmr * activity;
    const target = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 500 : tdee;
    const bmi = weight / Math.pow(height / 100, 2);
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      bmi: bmi.toFixed(1),
      protein: Math.round((target * 0.25) / 4),
      carb: Math.round((target * 0.5) / 4),
      fat: Math.round((target * 0.25) / 9),
    };
  }, [gender, age, height, weight, activity, goal]);

  const bmiLabel = +result.bmi < 18.5 ? 'Thiếu cân' : +result.bmi < 25 ? 'Bình thường' : +result.bmi < 30 ? 'Thừa cân' : 'Béo phì';
  const bmiTone = +result.bmi < 18.5 ? 'bg-sky-50 text-sky-700' : +result.bmi < 25 ? 'bg-emerald-50 text-emerald-700' : +result.bmi < 30 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';

  const handleSave = () => {
    toast.success('Đã lưu thông tin thành công');
  };

  const handleShare = () => {
    const message = userRole === 'patient'
      ? 'Đã chia sẻ kết quả với bác sĩ phụ trách'
      : 'Đã sao chép link chia sẻ';
    toast.success(message);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Calculator size={24} className="sm:size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white">Tính nhu cầu năng lượng & vi chất</h2>
            <p className="text-xs sm:text-sm text-white/90">Công thức Mifflin-St Jeor • Cá nhân hoá theo mục tiêu</p>
          </div>
        </div>
        <button onClick={handleShare} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0">
          <Share2 size={14} /> <span className="hidden sm:inline">{userRole === 'patient' ? 'Chia sẻ với bác sĩ' : 'Chia sẻ kết quả'}</span><span className="sm:hidden">Chia sẻ</span>
        </button>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm space-y-5">
          <h3 className="text-gray-900">Thông tin cơ thể</h3>

          <div>
            <label className="text-sm text-gray-700">Giới tính</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(['male', 'female'] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)} className={`py-2.5 rounded-lg border transition ${gender === g ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {g === 'male' ? '👨 Nam' : '👩 Nữ'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-700">Tuổi</label>
              <input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Cao (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Nặng (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Mức độ vận động</label>
            <select value={activity} onChange={(e) => setActivity(+e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
              <option value={1.2}>Ít vận động (ngồi nhiều)</option>
              <option value={1.375}>Nhẹ (tập 1-3 ngày/tuần)</option>
              <option value={1.55}>Vừa (tập 3-5 ngày/tuần)</option>
              <option value={1.725}>Cao (tập 6-7 ngày/tuần)</option>
              <option value={1.9}>Rất cao (lao động nặng)</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700">Mục tiêu</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { v: 'lose', label: 'Giảm cân', emoji: '📉' },
                { v: 'maintain', label: 'Duy trì', emoji: '⚖️' },
                { v: 'gain', label: 'Tăng cân', emoji: '📈' },
              ].map((g) => (
                <button key={g.v} onClick={() => setGoal(g.v as 'lose' | 'maintain' | 'gain')} className={`py-2.5 rounded-lg border text-sm transition ${goal === g.v ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-700">
            <Save size={16} /> Lưu thông tin
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white shadow-md">
            <div className="flex items-center gap-2 text-white/90 text-sm"><Flame size={18} /> Năng lượng khuyến nghị</div>
            <p className="mt-2 text-4xl sm:text-5xl">{result.target} <span className="text-base text-white/80">kcal/ngày</span></p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/15 rounded-lg p-3">
                <p className="text-xs text-white/80">BMR (cơ bản)</p>
                <p className="mt-0.5">{result.bmr} kcal</p>
              </div>
              <div className="bg-white/15 rounded-lg p-3">
                <p className="text-xs text-white/80">TDEE (tiêu hao)</p>
                <p className="mt-0.5">{result.tdee} kcal</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <p className="text-sm text-gray-700 mb-2">Chỉ số BMI</p>
            <div className="flex items-baseline gap-3">
              <p className="text-gray-900 text-3xl sm:text-4xl">{result.bmi}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${bmiTone}`}>{bmiLabel}</span>
            </div>
            <div className="h-2 bg-gradient-to-r from-sky-300 via-emerald-400 via-amber-400 to-red-400 rounded-full mt-3 relative">
              <div className="absolute -top-1 w-4 h-4 bg-gray-900 rounded-full border-2 border-white shadow" style={{ left: `${Math.min(Math.max((+result.bmi - 15) * 5, 0), 100)}%`, transform: 'translateX(-50%)' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <Beef size={22} className="mx-auto text-rose-600 mb-1" />
              <p className="text-xs text-gray-500">Protein</p>
              <p className="text-gray-900 mt-0.5">{result.protein}g</p>
              <p className="text-[10px] text-gray-400">25%</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <Wheat size={22} className="mx-auto text-amber-600 mb-1" />
              <p className="text-xs text-gray-500">Carb</p>
              <p className="text-gray-900 mt-0.5">{result.carb}g</p>
              <p className="text-[10px] text-gray-400">50%</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <Droplet size={22} className="mx-auto text-sky-600 mb-1" />
              <p className="text-xs text-gray-500">Fat</p>
              <p className="text-gray-900 mt-0.5">{result.fat}g</p>
              <p className="text-[10px] text-gray-400">25%</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">Kết quả tham khảo theo công thức Mifflin-St Jeor. Vui lòng tham khảo ý kiến bác sĩ trước khi áp dụng chế độ ăn cụ thể.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
