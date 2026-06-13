import { useState } from 'react';
import { Camera, Upload, Sparkles, Flame, Beef, Wheat, Droplet, RefreshCw, Plus, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';

type FoodRecognitionProps = {
  userRole?: 'patient' | 'user';
};

export function FoodRecognition({ userRole = 'user' }: FoodRecognitionProps) {
  const [stage, setStage] = useState<'capture' | 'analyzing' | 'result'>('capture');

  if (stage === 'analyzing') {
    setTimeout(() => setStage('result'), 1800);
  }

  const handleSaveToDiary = () => {
    toast.success('Đã thêm món ăn vào nhật ký bữa ăn');
  };

  const handleRetake = () => {
    setStage('capture');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Left: Capture/Result main panel (2 cols) */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {stage === 'capture' && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-6 sm:p-12 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white">
              <Camera size={40} />
            </div>
            <h2 className="mt-4 text-gray-900">Nhận diện món ăn từ ảnh</h2>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Kéo thả ảnh vào đây hoặc chọn từ máy. AI sẽ phân tích thành phần và ước tính giá trị dinh dưỡng trong vài giây.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <button onClick={() => setStage('analyzing')} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-700">
                <Upload size={18} /> Tải ảnh lên
              </button>
              <button onClick={() => setStage('analyzing')} className="px-5 py-2.5 rounded-lg border border-emerald-600 text-emerald-600 flex items-center justify-center gap-2 hover:bg-emerald-50">
                <Camera size={18} /> Chụp ảnh
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">Hỗ trợ JPG, PNG, HEIC • Tối đa 10MB</p>
          </div>
        )}

        {stage === 'analyzing' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-16 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
              <Sparkles size={40} className="text-emerald-600" />
            </div>
            <p className="text-gray-900 mt-4">Đang phân tích ảnh...</p>
            <p className="text-sm text-gray-500 mt-1">AI đang nhận diện thành phần món ăn</p>
            <div className="mt-6 w-64 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        )}

        {stage === 'result' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="aspect-square sm:aspect-auto bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-6xl sm:text-7xl">🍜</div>
                <div className="p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Độ tin cậy 92%</p>
                    <h2 className="text-gray-900 mt-2">Phở bò</h2>
                    <p className="text-sm text-gray-500">Khẩu phần ~ 1 tô (400g)</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Việt Nam', 'Bữa sáng', 'Soup'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleRetake} className="self-start mt-3 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs flex items-center gap-1 hover:bg-gray-50">
                    <RefreshCw size={12} /> Phân tích lại
                  </button>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
              <h3 className="text-gray-900 mb-4">Giá trị dinh dưỡng</h3>
              <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl">
                <Flame size={28} className="text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-900 text-2xl">450 kcal</p>
                  <p className="text-xs text-gray-500">~25% nhu cầu hàng ngày của bạn</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Beef, label: 'Protein', value: '28g', color: 'text-rose-600 bg-rose-50' },
                  { icon: Wheat, label: 'Carb', value: '55g', color: 'text-amber-600 bg-amber-50' },
                  { icon: Droplet, label: 'Fat', value: '12g', color: 'text-sky-600 bg-sky-50' },
                  { icon: Sparkles, label: 'Natri', value: '1200mg', color: 'text-purple-600 bg-purple-50' },
                ].map((n) => (
                  <div key={n.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className={`w-9 h-9 rounded-lg ${n.color} flex items-center justify-center mx-auto mb-1`}>
                      <n.icon size={16} />
                    </div>
                    <p className="text-xs text-gray-500">{n.label}</p>
                    <p className="text-sm text-gray-900">{n.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-gray-900 mb-3">Thành phần nhận diện</h3>
              <div className="flex flex-wrap gap-2">
                {['Bánh phở', 'Thịt bò', 'Hành lá', 'Giá đỗ', 'Rau thơm', 'Nước dùng xương', 'Gừng', 'Hành tây'].map((i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm">{i}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleSaveToDiary} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-700">
                <Plus size={18} /> Ghi vào nhật ký bữa ăn
              </button>
              <button onClick={handleRetake} className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
                Chụp món khác
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right sidebar: tips + history */}
      <div className="space-y-4">
        {/* Warning */}
        {stage === 'result' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-2">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-900">Lưu ý cho bạn</p>
              <p className="text-xs text-amber-800 mt-1">
                {userRole === 'patient'
                  ? 'Món này có lượng natri khá cao (~1200mg), không phù hợp ăn quá thường xuyên với chẩn đoán Đái tháo đường type 2 của bạn.'
                  : 'Món này có lượng natri khá cao (~1200mg), không phù hợp ăn quá thường xuyên nếu bạn đang theo dõi huyết áp.'}
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-3">Mẹo chụp ảnh tốt hơn</h3>
          <ul className="space-y-2.5 text-sm text-gray-700">
            <li className="flex gap-2"><span>📐</span> Chụp thẳng từ trên xuống</li>
            <li className="flex gap-2"><span>💡</span> Đủ ánh sáng, tránh ngược sáng</li>
            <li className="flex gap-2"><span>🍽</span> Toàn bộ món vào khung hình</li>
            <li className="flex gap-2"><span>🎯</span> Mỗi ảnh một món để chính xác hơn</li>
            <li className="flex gap-2"><span>📏</span> Đặt vật chuẩn (thìa, đũa) để ước lượng kích thước</li>
          </ul>
        </div>

        {/* Recent history */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 flex items-center gap-1.5"><History size={16} /> Lịch sử gần đây</h3>
            <button className="text-xs text-emerald-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Phở bò', 'Bún chả', 'Cơm tấm', 'Bánh mì', 'Gỏi cuốn', 'Cá kho'].map((d, i) => (
              <button
                key={d}
                onClick={() => toast.info(`Xem lại: ${d}`)}
                className="rounded-lg border border-gray-100 p-2 hover:border-emerald-200 cursor-pointer transition"
              >
                <div className="aspect-square rounded-md bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-2xl">🍜</div>
                <p className="text-xs text-gray-900 mt-1 truncate">{d}</p>
                <p className="text-[10px] text-gray-500">{i + 1} ngày trước</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
