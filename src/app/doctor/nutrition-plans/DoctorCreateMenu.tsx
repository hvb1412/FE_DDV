import { useState } from 'react';
import { ArrowLeft, Search, Plus, Save, Send, FileDown } from 'lucide-react';
import { Link } from 'react-router';

const foodDatabase = [
  { id: 1, name: 'Cơm trắng', kcal: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
  { id: 2, name: 'Thịt gà luộc', kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
  { id: 3, name: 'Cá hồi nướng', kcal: 206, protein: 22, fat: 13, carbs: 0 },
  { id: 4, name: 'Rau cải xanh', kcal: 15, protein: 1.5, fat: 0.2, carbs: 2.8 },
  { id: 5, name: 'Trứng gà', kcal: 155, protein: 13, fat: 11, carbs: 1.1 },
  { id: 6, name: 'Sữa tươi', kcal: 61, protein: 3.2, fat: 3.3, carbs: 4.8 },
  { id: 7, name: 'Chuối', kcal: 89, protein: 1.1, fat: 0.3, carbs: 22.8 },
  { id: 8, name: 'Yến mạch', kcal: 389, protein: 16.9, fat: 6.9, carbs: 66.3 },
];

const meals = ['Bữa sáng', 'Bữa phụ sáng', 'Bữa trưa', 'Bữa phụ chiều', 'Bữa tối'];

export function DoctorCreateMenu() {
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState('weight-loss');
  const [dailyKcal, setDailyKcal] = useState(1800);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <Link to="/d" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo thực đơn cá nhân hóa</h1>
        <p className="text-gray-600 mb-8">Cho bệnh nhân: Nguyễn Văn B (BN123)</p>

        <div className="flex items-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-32 h-1 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 1: Định cấu hình nhu cầu dinh dưỡng</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Chẩn đoán</p>
                <p className="text-sm font-medium text-gray-900">Tiểu đường type 2, Tăng huyết áp</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">BMI hiện tại</p>
                <p className="text-sm font-medium text-gray-900">25.8 (Thừa cân)</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu điều trị</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'weight-loss', label: 'Giảm cân' },
                  { value: 'maintain', label: 'Duy trì' },
                  { value: 'weight-gain', label: 'Tăng cân' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTarget(option.value)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      target === option.value
                        ? 'border-green-600 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhu cầu năng lượng: {dailyKcal} kcal/ngày
              </label>
              <input
                type="range"
                min="1200"
                max="3000"
                step="100"
                value={dailyKcal}
                onChange={(e) => setDailyKcal(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Protein</p>
                <p className="text-lg font-bold text-gray-900">20%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Lipid</p>
                <p className="text-lg font-bold text-gray-900">25%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Carbohydrate</p>
                <p className="text-lg font-bold text-gray-900">55%</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Tiếp theo: Xây dựng thực đơn
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 2: Xây dựng thực đơn</h2>

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">Theo bữa</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Theo ngày</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Theo tuần</button>
              </div>

              <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tra cứu thực phẩm địa phương..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 whitespace-nowrap">
                  Tự động gợi ý thực đơn
                </button>
              </div>

              {searchTerm && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">Kết quả tìm kiếm:</p>
                  <div className="space-y-2">
                    {filteredFoods.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-blue-300 cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{food.name}</p>
                          <p className="text-xs text-gray-500">
                            {food.kcal} kcal | P: {food.protein}g | L: {food.fat}g | C: {food.carbs}g
                          </p>
                        </div>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Plus size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              {meals.map((meal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{meal}</h3>
                    <span className="text-sm text-gray-500">0 kcal</span>
                  </div>
                  <div className="min-h-16 bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Kéo thả hoặc click để thêm món ăn</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Tiếp theo: Xem trước & Xuất
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 3: Xem trước & Xuất thực đơn</h2>

            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt dinh dưỡng</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Tổng năng lượng</p>
                  <p className="text-xl font-bold text-green-600">{dailyKcal}</p>
                  <p className="text-xs text-gray-500">kcal/ngày</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Protein</p>
                  <p className="text-xl font-bold text-emerald-600">{Math.round(dailyKcal * 0.2 / 4)}g</p>
                  <p className="text-xs text-gray-500">20%</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Lipid</p>
                  <p className="text-xl font-bold text-orange-600">{Math.round(dailyKcal * 0.25 / 9)}g</p>
                  <p className="text-xs text-gray-500">25%</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Carbs</p>
                  <p className="text-xl font-bold text-purple-600">{Math.round(dailyKcal * 0.55 / 4)}g</p>
                  <p className="text-xs text-gray-500">55%</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú của bác sĩ</label>
              <textarea
                rows={4}
                placeholder="Thêm hướng dẫn, lưu ý đặc biệt cho bệnh nhân..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save size={20} />
                Lưu thực đơn
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <FileDown size={20} />
                Xuất PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Send size={20} />
                Gửi cho bệnh nhân
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}