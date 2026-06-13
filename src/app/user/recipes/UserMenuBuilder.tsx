import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Plus,
  Minus,
  ChefHat,
  Star,
  X,
  Beef,
  Wheat,
  Droplet,
  Search,
  Flame,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { ImageWithFallback } from "@/app/shared/components/figma/ImageWithFallback";

const imgChaGio = 'https://images.unsplash.com/photo-1606502281004-f0ac7e0e8b22?w=600&q=80';
const imgCanhChua = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80';
const imgBunCha = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgGoiCuon = 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80';
const imgBanhXeo = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80';
const imgComTam = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80';
const imgBunBo = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgPho = 'https://images.unsplash.com/photo-1535399831218-d4db1c8cfa45?w=600&q=80';

const ALL_DISHES = [
  {
    name: "Phở bò",
    cal: 500,
    protein: 28,
    fat: 14,
    carbs: 62,
    serving: "1 tô (650g)",
    score: 4.8,
    img: imgPho,
    meal: "breakfast",
    category: "Món nước",
  },
  {
    name: "Bún bò Huế",
    cal: 540,
    protein: 30,
    fat: 16,
    carbs: 64,
    serving: "1 tô (700g)",
    score: 4.7,
    img: imgBunBo,
    meal: "breakfast",
    category: "Món nước",
  },
  {
    name: "Bún chả Hà Nội",
    cal: 450,
    protein: 24,
    fat: 14,
    carbs: 55,
    serving: "1 phần (500g)",
    score: 4.7,
    img: imgBunCha,
    meal: "lunch",
    category: "Bún/Mì",
  },
  {
    name: "Cơm tấm sườn bì chả",
    cal: 680,
    protein: 35,
    fat: 22,
    carbs: 78,
    serving: "1 phần (500g)",
    score: 4.6,
    img: imgComTam,
    meal: "lunch",
    category: "Cơm",
  },
  {
    name: "Chả giò chiên",
    cal: 320,
    protein: 12,
    fat: 20,
    carbs: 25,
    serving: "3 cái (150g)",
    score: 4.3,
    img: imgChaGio,
    meal: "lunch",
    category: "Món chiên",
  },
  {
    name: "Bánh xèo miền Nam",
    cal: 380,
    protein: 15,
    fat: 18,
    carbs: 42,
    serving: "2 cái (300g)",
    score: 4.4,
    img: imgBanhXeo,
    meal: "lunch",
    category: "Món chiên",
  },
  {
    name: "Canh chua cá",
    cal: 120,
    protein: 14,
    fat: 4.5,
    carbs: 8,
    serving: "1 tô (400g)",
    score: 4.5,
    img: imgCanhChua,
    meal: "dinner",
    category: "Canh",
  },
  {
    name: "Gỏi cuốn tôm thịt",
    cal: 110,
    protein: 9,
    fat: 3,
    carbs: 13,
    serving: "2 cuốn (160g)",
    score: 4.9,
    img: imgGoiCuon,
    meal: "snack",
    category: "Món cuốn",
  },
];

const DAILY_TARGET = 2100;

const MEAL_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "breakfast", label: "🌅 Sáng" },
  { id: "lunch", label: "☀️ Trưa" },
  { id: "dinner", label: "🌙 Tối" },
  { id: "snack", label: "🥗 Phụ" },
] as const;

type MealFilter = (typeof MEAL_TABS)[number]["id"];

const mealLabels: Record<string, string> = {
  breakfast: "Sáng",
  lunch: "Trưa",
  dinner: "Tối",
  snack: "Phụ",
};
const mealColors: Record<string, string> = {
  breakfast: "bg-amber-50 text-amber-700 border-amber-200",
  lunch: "bg-blue-50 text-blue-700 border-blue-200",
  dinner: "bg-violet-50 text-violet-700 border-violet-200",
  snack: "bg-pink-50 text-pink-700 border-pink-200",
};

const calColor = (pct: number) =>
  pct >= 100
    ? "bg-red-500"
    : pct >= 80
      ? "bg-amber-400"
      : "bg-green-500";

type DishItem = (typeof ALL_DISHES)[0] & { uid: number };

export function UserMenuBuilder() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState<DishItem[]>([]);
  const [mealFilter, setMealFilter] =
    useState<MealFilter>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "default" | "cal_asc" | "cal_desc" | "score"
  >("default");

  const addDish = (d: (typeof ALL_DISHES)[0]) => {
    setMenuItems((prev) => [
      ...prev,
      { ...d, uid: Date.now() + Math.random() },
    ]);
    toast.success(`Đã thêm "${d.name}" vào thực đơn`);
  };
  const removeDish = (uid: number) => {
    const removed = menuItems.find((i) => i.uid === uid);
    setMenuItems((prev) => prev.filter((i) => i.uid !== uid));
    if (removed) {
      toast.message(`Đã bỏ "${removed.name}"`, {
        action: { label: "Hoàn tác", onClick: () => setMenuItems((p) => [...p, removed]) },
      });
    }
  };

  const totalCal = menuItems.reduce((s, i) => s + i.cal, 0);
  const totalProtein = menuItems.reduce(
    (s, i) => s + i.protein,
    0,
  );
  const totalCarbs = menuItems.reduce((s, i) => s + i.carbs, 0);
  const totalFat = menuItems.reduce((s, i) => s + i.fat, 0);
  const calPct = Math.min((totalCal / DAILY_TARGET) * 100, 100);

  const filtered = useMemo(() => {
    let list = [...ALL_DISHES];
    if (mealFilter !== "all")
      list = list.filter((d) => d.meal === mealFilter);
    if (query.trim())
      list = list.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()),
      );
    if (sortBy === "cal_asc")
      list.sort((a, b) => a.cal - b.cal);
    if (sortBy === "cal_desc")
      list.sort((a, b) => b.cal - a.cal);
    if (sortBy === "score")
      list.sort((a, b) => b.score - a.score);
    return list;
  }, [mealFilter, query, sortBy]);

  return (
    <div className="space-y-5">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <ChefHat size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">
              Xây dựng thực đơn hôm nay
            </h2>
            <p className="text-green-100 text-sm mt-0.5">
              Chọn món ăn từ danh sách để theo dõi dinh dưỡng
              theo ngày
            </p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-green-200 text-xs">
            Mục tiêu calo
          </p>
          <p className="text-2xl font-bold">
            {DAILY_TARGET.toLocaleString()}{" "}
            <span className="text-sm font-normal text-green-200">
              kcal
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5 items-start">
        {/* ── Left: dish picker ── */}
        <div className="col-span-3 space-y-4">
          {/* Search + sort bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm món ăn..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as typeof sortBy)
                  }
                  className="pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                >
                  <option value="default">Mặc định</option>
                  <option value="cal_asc">Calo tăng dần</option>
                  <option value="cal_desc">
                    Calo giảm dần
                  </option>
                  <option value="score">
                    Đánh giá cao nhất
                  </option>
                </select>
              </div>
            </div>

            {/* Meal filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setMealFilter(id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                    mealFilter === id
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dish grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
              <Search
                size={32}
                className="mx-auto mb-3 text-gray-300"
              />
              <p className="text-sm">
                Không tìm thấy món ăn phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map((d) => (
                <button
                  key={d.name}
                  onClick={() => addDish(d)}
                  className="bg-white hover:bg-green-50 border border-gray-100 hover:border-green-300 rounded-xl overflow-hidden text-left transition group shadow-sm hover:shadow-md"
                >
                  <div
                    className="relative"
                    style={{ height: 100 }}
                  >
                    <ImageWithFallback
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <span
                      className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${mealColors[d.meal]}`}
                    >
                      {mealLabels[d.meal]}
                    </span>
                    <span className="absolute bottom-2 right-2 text-[10px] text-white font-bold bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                      {d.cal} kcal
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
                      {d.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {d.serving}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex gap-1">
                        <span className="text-[9px] font-semibold text-rose-500 bg-rose-50 px-1 py-0.5 rounded">
                          P {d.protein}g
                        </span>
                        <span className="text-[9px] font-semibold text-sky-500 bg-sky-50 px-1 py-0.5 rounded">
                          F {d.fat}g
                        </span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-green-100 group-hover:bg-green-500 flex items-center justify-center transition">
                        <Plus
                          size={10}
                          className="text-green-600 group-hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Note */}
          <div className="flex items-start gap-2 text-xs text-gray-400 px-1">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              Trong tương lai danh sách sẽ bao gồm hàng nghìn
              món ăn Việt Nam với dữ liệu dinh dưỡng đầy đủ.
            </span>
          </div>
        </div>

        {/* ── Right: today's menu ── */}
        <div className="col-span-2 space-y-4 sticky top-4">
          {/* Calorie tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900 text-sm">
                Tổng dinh dưỡng hôm nay
              </p>
              {menuItems.length > 0 && (
                <button
                  onClick={() => {
                    const snapshot = menuItems;
                    setMenuItems([]);
                    toast.error(`Đã xoá ${snapshot.length} món khỏi thực đơn`, {
                      duration: 6000,
                      action: { label: "Hoàn tác", onClick: () => setMenuItems(snapshot) },
                    });
                  }}
                  className="text-xs text-red-400 hover:text-red-600 hover:underline"
                >
                  Xoá tất cả
                </button>
              )}
            </div>

            {/* Calorie bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-500">
                  Năng lượng
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {totalCal}{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    / {DAILY_TARGET} kcal
                  </span>
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${calColor(calPct)}`}
                  style={{ width: `${calPct}%` }}
                />
              </div>
              {calPct >= 100 && (
                <p className="text-[11px] text-red-500 font-medium">
                  ⚠ Đã vượt quá nhu cầu calo ngày!
                </p>
              )}
              {calPct > 0 && calPct < 100 && (
                <p className="text-[11px] text-gray-400">
                  Còn {DAILY_TARGET - totalCal} kcal có thể nạp
                  thêm
                </p>
              )}
            </div>

            {/* Macro summary */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                {
                  icon: Beef,
                  label: "Protein",
                  value: Math.round(totalProtein),
                  unit: "g",
                  color: "rose",
                },
                {
                  icon: Wheat,
                  label: "Carbs",
                  value: Math.round(totalCarbs),
                  unit: "g",
                  color: "amber",
                },
                {
                  icon: Droplet,
                  label: "Béo",
                  value: Math.round(totalFat),
                  unit: "g",
                  color: "sky",
                },
              ].map(
                ({ icon: Icon, label, value, unit, color }) => (
                  <div
                    key={label}
                    className={`rounded-xl p-3 text-center bg-${color}-50`}
                  >
                    <Icon
                      size={14}
                      className={`mx-auto mb-1 text-${color}-500`}
                    />
                    <p
                      className={`text-sm font-bold text-${color}-600`}
                    >
                      {value}
                      {unit}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {label}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Added dishes list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">
                Thực đơn đã chọn
                {menuItems.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    {menuItems.length} món
                  </span>
                )}
              </p>
              <Flame size={15} className="text-orange-400" />
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {menuItems.length === 0 ? (
                <div className="py-10 text-center">
                  <ChefHat
                    size={30}
                    className="mx-auto mb-2 text-gray-200"
                  />
                  <p className="text-xs text-gray-400">
                    Chọn món ăn bên trái để thêm vào
                  </p>
                </div>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item.uid}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${mealColors[item.meal]}`}
                        >
                          {mealLabels[item.meal]}
                        </span>
                        <span className="text-[10px] text-orange-500 font-semibold">
                          {item.cal} kcal
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDish(item.uid)}
                      className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition flex-shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {menuItems.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => toast.success("Đã lưu thực đơn hôm nay", { description: `${menuItems.length} món • ${totalCal} kcal` })}
                  className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <Star size={15} /> Lưu thực đơn hôm nay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}