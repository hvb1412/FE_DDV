import { useNavigate } from 'react-router';
import {
  Calculator, Search, UtensilsCrossed, BookMarked, ClipboardCheck,
  Camera, MessageCircleQuestion, HelpCircle, Flame, Droplets,
  TrendingUp, Scale, ChevronRight, Sparkles, Info, Plus, ChefHat,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/shared/components/figma/ImageWithFallback';

const imgChaGio = 'https://images.unsplash.com/photo-1606502281004-f0ac7e0e8b22?w=600&q=80';
const imgCanhChua = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80';
const imgBunCha = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgGoiCuon = 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80';
const imgBanhXeo = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80';
const imgComTam = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80';
const imgBunBo = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgPho = 'https://images.unsplash.com/photo-1535399831218-d4db1c8cfa45?w=600&q=80';

const greeting = (() => {
  const h = new Date().getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 14) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
})();

const DISHES = [
  { name: 'Chả giò chiên', cal: 320, protein: 12, fat: 20, carbs: 25, serving: '3 cái (150g)', score: 4.3, img: imgChaGio, meal: 'lunch' },
  { name: 'Canh chua cá', cal: 120, protein: 14, fat: 4.5, carbs: 8, serving: '1 tô (400g)', score: 4.5, img: imgCanhChua, meal: 'dinner' },
  { name: 'Bún chả Hà Nội', cal: 450, protein: 24, fat: 14, carbs: 55, serving: '1 phần (500g)', score: 4.7, img: imgBunCha, meal: 'lunch' },
  { name: 'Gỏi cuốn tôm thịt', cal: 110, protein: 9, fat: 3, carbs: 13, serving: '2 cuốn (160g)', score: 4.9, img: imgGoiCuon, meal: 'snack' },
  { name: 'Bánh xèo miền Nam', cal: 380, protein: 15, fat: 18, carbs: 42, serving: '2 cái (300g)', score: 4.4, img: imgBanhXeo, meal: 'lunch' },
  { name: 'Cơm tấm sườn bì chả', cal: 680, protein: 35, fat: 22, carbs: 78, serving: '1 phần (500g)', score: 4.6, img: imgComTam, meal: 'lunch' },
  { name: 'Bún bò Huế', cal: 540, protein: 30, fat: 16, carbs: 64, serving: '1 tô (700g)', score: 4.7, img: imgBunBo, meal: 'breakfast' },
  { name: 'Phở bò', cal: 500, protein: 28, fat: 14, carbs: 62, serving: '1 tô (650g)', score: 4.8, img: imgPho, meal: 'breakfast' },
];

const RECOMMENDED = {
  breakfast: { dish: DISHES[7], note: 'Nhiều protein, no lâu — lý tưởng cho buổi sáng' },
  lunch:     { dish: DISHES[2], note: 'Cân bằng dinh dưỡng, vừa phải calo cho trưa' },
  dinner:    { dish: DISHES[1], note: 'Ít calo, nhiều rau — phù hợp bữa tối nhẹ' },
};

const tools = [
  { icon: Calculator,          label: 'Tính nhu cầu năng lượng', desc: 'TDEE & vi chất',      to: '/u/calculator',      color: 'from-orange-400 to-amber-500' },
  { icon: Search,              label: 'Tra cứu thực phẩm',       desc: 'Database dinh dưỡng', to: '/u/food-search',     color: 'from-blue-400 to-sky-500' },
  { icon: UtensilsCrossed,     label: 'Tra cứu món ăn',          desc: 'Từ khóa / hình ảnh',  to: '/u/dish-search',     color: 'from-purple-400 to-violet-500' },
  { icon: BookMarked,          label: 'Nhu cầu khuyến nghị',     desc: 'Bảng RDA',            to: '/u/recommendations', color: 'from-teal-400 to-cyan-500' },
  { icon: ClipboardCheck,      label: 'Đánh giá dinh dưỡng',    desc: 'BMI & tình trạng',    to: '/u/assessment',      color: 'from-emerald-400 to-green-500' },
  { icon: Camera,              label: 'Nhận diện món ăn',        desc: 'AI từ ảnh chụp',      to: '/u/recognition',     color: 'from-pink-400 to-rose-500' },
  { icon: MessageCircleQuestion, label: 'Hỏi đáp dinh dưỡng',  desc: 'Tư vấn AI 24/7',      to: '/u/qa',              color: 'from-indigo-400 to-blue-500' },
  { icon: HelpCircle,          label: 'Hỗ trợ',                  desc: 'FAQ & liên hệ',       to: '/u/support',         color: 'from-gray-400 to-slate-500' },
];

const tips = [
  { emoji: '💧', text: 'Uống đủ 2 lít nước mỗi ngày để duy trì sức khoẻ tốt' },
  { emoji: '🥦', text: 'Ăn đa dạng màu sắc rau củ để bổ sung nhiều vi chất' },
  { emoji: '🚫', text: 'Hạn chế thực phẩm chế biến sẵn và đồ ăn mặn' },
  { emoji: '🏃', text: 'Tập thể dục 30 phút mỗi ngày giúp tăng chuyển hoá' },
  { emoji: '🌅', text: 'Ăn sáng đầy đủ giúp duy trì năng lượng cả ngày' },
];

export function UserHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: 200 }}>
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxoZWFsdGh5JTIwZm9vZCUyMHZlZ2V0YWJsZXMlMjBudXRyaXRpb24lMjBWaWV0bmFtZXNlfGVufDF8fHx8MTc3OTU5NzM4NHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="" className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-emerald-700/60" />
        <div className="relative z-10 flex items-center justify-between p-8">
          <div>
            <p className="text-green-200 text-sm tracking-wide">{greeting} 👋</p>
            <h1 className="mt-1 text-white font-bold" style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>
              Xin chào, Nguyễn Văn Minh!
            </h1>
            <p className="text-green-100/90 text-sm mt-2 max-w-md leading-relaxed">
              Hãy bắt đầu hành trình dinh dưỡng khoẻ mạnh. Tra cứu thực phẩm, tính toán năng lượng và lên thực đơn cho hôm nay.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button onClick={() => navigate('/u/calculator')} className="px-5 py-2.5 rounded-xl bg-white text-green-700 hover:bg-green-50 text-sm font-semibold flex items-center gap-2 shadow-md transition">
                <Calculator size={16} /> Tính nhu cầu ngay
              </button>
              <button onClick={() => navigate('/u/menu-builder')} className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm flex items-center gap-2 backdrop-blur-sm transition">
                <ChefHat size={16} /> Lên thực đơn hôm nay
              </button>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-2 pr-2 select-none">
            <div className="flex gap-2">
              {['🥦', '🥕', '🍅'].map((e) => (
                <div key={e} className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">{e}</div>
              ))}
            </div>
            <div className="flex gap-2">
              {['🍎', '🥑', '🫐'].map((e) => (
                <div key={e} className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">{e}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-4 gap-4">
        {[
          { label: 'Chỉ số BMI',         value: '22.5',  sub: 'Bình thường ✓',  icon: Scale,      color: 'emerald' },
          { label: 'Calo mục tiêu',      value: '2,100', sub: 'kcal / ngày',    icon: Flame,      color: 'orange' },
          { label: 'Nước cần uống',      value: '2.0L',  sub: 'Mỗi ngày',      icon: Droplets,   color: 'sky' },
          { label: 'Protein khuyến nghị', value: '60g',  sub: 'Mỗi ngày',      icon: TrendingUp, color: 'violet' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-gray-900 mt-1 font-bold" style={{ fontSize: '1.6rem' }}>{s.value}</p>
                <p className={`text-xs mt-0.5 text-${s.color}-600`}>{s.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-${s.color}-50 flex items-center justify-center flex-shrink-0`}>
                <s.icon size={22} className={`text-${s.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Recommended menu ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" /> Thực đơn gợi ý hôm nay
          </h3>
          <button onClick={() => navigate('/u/menu-builder')} className="text-xs text-green-600 flex items-center gap-1 hover:underline">
            Tự lên thực đơn <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {([
            { slot: 'breakfast', label: '🌅 Bữa sáng', ...RECOMMENDED.breakfast },
            { slot: 'lunch',     label: '☀️ Bữa trưa',  ...RECOMMENDED.lunch },
            { slot: 'dinner',    label: '🌙 Bữa tối',   ...RECOMMENDED.dinner },
          ] as const).map(({ slot, label, dish, note }) => (
            <div key={slot} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition">
              <div className="relative" style={{ height: 140 }}>
                <ImageWithFallback src={dish.img} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">{label}</span>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <p className="text-white font-semibold text-sm drop-shadow">{dish.name}</p>
                  <span className="text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">{dish.cal} kcal</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-gray-500 leading-relaxed">{note}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex gap-2">
                    {[
                      { label: 'P', value: dish.protein, color: 'text-rose-600 bg-rose-50' },
                      { label: 'C', value: dish.carbs,   color: 'text-amber-600 bg-amber-50' },
                      { label: 'F', value: dish.fat,     color: 'text-sky-600 bg-sky-50' },
                    ].map(({ label: l, value, color }) => (
                      <span key={l} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${color}`}>{l} {value}g</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/u/menu-builder')}
                    className="flex items-center gap-1 text-xs text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"
                  >
                    <Plus size={12} /> Thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Menu builder CTA ── */}
      <section
        onClick={() => navigate('/u/menu-builder')}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-green-200 transition group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
            <ChefHat size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Lên thực đơn hôm nay</p>
            <p className="text-sm text-gray-500 mt-0.5">Chọn món ăn, theo dõi calo và dinh dưỡng theo ngày</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {DISHES.slice(0, 4).map((d) => (
              <div key={d.name} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm -ml-2 first:ml-0">
                <ImageWithFallback src={d.img} alt={d.name} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-white shadow-sm -ml-2 flex items-center justify-center">
              <Plus size={14} className="text-gray-400" />
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </section>

      {/* ── Tools + Tips ── */}
      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2">
            <Sparkles size={18} className="text-green-600" /> Công cụ tra cứu & tính toán
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {tools.map((t) => (
              <button key={t.to} onClick={() => navigate(t.to)}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white mb-3`}>
                  <t.icon size={20} />
                </div>
                <p className="text-sm text-gray-900 font-medium leading-tight group-hover:text-green-700">{t.label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold text-sm flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-green-600" /> Tra cứu nhanh món ăn
              </h3>
              <button onClick={() => navigate('/u/dish-search')} className="text-xs text-green-600 flex items-center hover:underline">
                Xem tất cả <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['Phở bò', 'Bún bò Huế', 'Cơm tấm', 'Gỏi cuốn', 'Bún chả', 'Canh chua cá', 'Bánh xèo', 'Chả giò'].map((dish) => (
                <button key={dish} onClick={() => navigate('/u/dish-search')}
                  className="px-3 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition text-center">
                  {dish}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: tips + info */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl shadow-md p-5 text-white">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" /> Mẹo dinh dưỡng hôm nay
            </h3>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/20 last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-base mt-0.5">{tip.emoji}</div>
                  <p className="text-xs text-white/90 leading-relaxed">{tip.text}</p>
                </div>
              ))}
              <button onClick={() => navigate('/u/qa')} className="w-full text-center text-xs text-white font-semibold py-2 rounded-lg bg-white/15 hover:bg-white/25 transition mt-1">
                Hỏi thêm về dinh dưỡng →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Info size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nguồn dữ liệu</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">Viện Dinh dưỡng Quốc gia Việt Nam</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Dữ liệu cập nhật theo Bảng thành phần thực phẩm Việt Nam & USDA FoodData Central.
                </p>
                <button onClick={() => navigate('/u/support')} className="mt-3 text-xs text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition font-medium">
                  Tìm hiểu thêm →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
