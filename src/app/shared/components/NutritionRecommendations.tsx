import { useState } from 'react';
import { Info, Baby, User, UserCircle, Heart, Activity, Download, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const groups = [
  { id: 'child', label: 'Trẻ em', sub: '1-9 tuổi', icon: Baby, color: 'text-pink-600 bg-pink-50' },
  { id: 'teen', label: 'Vị thành niên', sub: '10-18 tuổi', icon: User, color: 'text-blue-600 bg-blue-50' },
  { id: 'adult', label: 'Trưởng thành', sub: '19-59 tuổi', icon: UserCircle, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'elder', label: 'Người cao tuổi', sub: '60+', icon: Heart, color: 'text-amber-600 bg-amber-50' },
  { id: 'pregnant', label: 'Phụ nữ có thai', sub: '3 thai kỳ', icon: Heart, color: 'text-rose-600 bg-rose-50' },
  { id: 'athlete', label: 'Vận động viên', sub: 'Tập luyện cao', icon: Activity, color: 'text-violet-600 bg-violet-50' },
];

const data = {
  energy: '2000-2400 kcal/ngày',
  protein: '60-75g',
  fat: '55-65g',
  carb: '300-350g',
  fiber: '20-25g',
  water: '2-2.5 L',
  micronutrients: [
    { name: 'Canxi', value: '800-1000mg', sources: 'Sữa, tôm, cá nhỏ' },
    { name: 'Sắt', value: '11-27mg', sources: 'Thịt đỏ, gan, rau xanh' },
    { name: 'Kẽm', value: '8-11mg', sources: 'Hàu, thịt, hạt' },
    { name: 'Vitamin A', value: '600-900 µg', sources: 'Cà rốt, gan, trứng' },
    { name: 'Vitamin D', value: '15 µg', sources: 'Nắng, cá béo, trứng' },
    { name: 'Vitamin C', value: '75-90mg', sources: 'Cam, ổi, ớt chuông' },
    { name: 'Folate', value: '400 µg', sources: 'Rau lá, đậu, gan' },
    { name: 'I-ốt', value: '150 µg', sources: 'Muối i-ốt, hải sản' },
    { name: 'Vitamin B12', value: '2.4 µg', sources: 'Thịt, cá, trứng, sữa' },
  ],
};

export function NutritionRecommendations() {
  const [group, setGroup] = useState('adult');

  const handleReference = () => {
    toast.info('Nguồn: Viện Dinh dưỡng Quốc gia (2016) & WHO/FAO RDA');
  };

  const handleDownload = () => {
    toast.success('Đang chuẩn bị file PDF...');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-sky-600 rounded-2xl p-4 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-white">Nhu cầu dinh dưỡng khuyến nghị (RDA)</h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1">Theo Viện Dinh dưỡng Quốc gia Việt Nam (2016) & WHO</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleReference} className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
            <BookOpen size={14} /> <span className="hidden sm:inline">Nguồn </span>tham khảo
          </button>
          <button onClick={handleDownload} className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
            <Download size={14} /> <span className="hidden sm:inline">Tải </span>PDF
          </button>
        </div>
      </div>

      {/* Group selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition ${
              group === g.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-300'
            }`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${g.color}`}>
              <g.icon size={18} className="sm:size-5" />
            </div>
            <p className="text-sm text-gray-900 mt-2 truncate">{g.label}</p>
            <p className="text-xs text-gray-500 truncate">{g.sub}</p>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Macros */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4">Năng lượng & chất chính</h3>
          <div className="space-y-2">
            {[
              { label: 'Năng lượng', value: data.energy, tone: 'bg-orange-50 text-orange-700' },
              { label: 'Protein', value: data.protein, tone: 'bg-rose-50 text-rose-700' },
              { label: 'Chất béo', value: data.fat, tone: 'bg-sky-50 text-sky-700' },
              { label: 'Carbohydrate', value: data.carb, tone: 'bg-amber-50 text-amber-700' },
              { label: 'Chất xơ', value: data.fiber, tone: 'bg-emerald-50 text-emerald-700' },
              { label: 'Nước', value: data.water, tone: 'bg-blue-50 text-blue-700' },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700">{m.label}</span>
                <span className={`text-sm px-2 py-0.5 rounded-full ${m.tone}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Micronutrients */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Vitamin & khoáng chất</h3>
            <p className="text-xs text-gray-500">RDA / ngày</p>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-sm min-w-[420px]">
              <thead className="text-xs text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="text-left py-2">Vi chất</th>
                  <th className="text-left py-2">Khuyến nghị</th>
                  <th className="text-left py-2">Nguồn thực phẩm</th>
                </tr>
              </thead>
              <tbody>
                {data.micronutrients.map((m) => (
                  <tr key={m.name} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 text-gray-900">{m.name}</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs whitespace-nowrap">{m.value}</span></td>
                    <td className="py-2.5 text-gray-600 text-xs">{m.sources}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Distribution chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-3">Phân bố năng lượng khuyến nghị</h3>
          <div className="h-6 rounded-full overflow-hidden flex">
            <div className="bg-rose-400 flex items-center justify-center text-white text-xs" style={{ width: '15%' }}>P 15%</div>
            <div className="bg-amber-400 flex items-center justify-center text-white text-xs" style={{ width: '60%' }}>C 60%</div>
            <div className="bg-sky-400 flex items-center justify-center text-white text-xs" style={{ width: '25%' }}>F 25%</div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Cân đối 3 chất sinh năng lượng cho người trưởng thành Việt Nam</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">Lưu ý quan trọng</p>
            <p className="text-xs text-blue-800 mt-1">
              Đây là giá trị khuyến nghị trung bình. Nhu cầu thực tế phụ thuộc vào cân nặng, mức độ vận động, tình trạng sức khoẻ và điều kiện sinh lý của từng cá nhân.
              Hãy dùng <strong>Máy tính nhu cầu năng lượng</strong> để tính chính xác hơn cho bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
