import { useState } from 'react';
import { Search, Camera, Flame, Beef, Wheat, Droplet, Heart, Plus, Filter, X, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useFavorites, useDiary, todayKey, type DiaryEntry } from '@/app/patient/stores/patientFoodStore';

const foods = [
  { id: 1, name: 'Cơm trắng', emoji: '🍚', cat: 'Tinh bột', kcal: 130, protein: 2.7, carb: 28, fat: 0.3, per: '100g', tag: 'Phổ biến' },
  { id: 2, name: 'Ức gà luộc', emoji: '🍗', cat: 'Đạm', kcal: 165, protein: 31, carb: 0, fat: 3.6, per: '100g', tag: 'Giàu protein' },
  { id: 3, name: 'Cá hồi', emoji: '🐟', cat: 'Đạm', kcal: 208, protein: 20, carb: 0, fat: 13, per: '100g', tag: 'Omega-3' },
  { id: 4, name: 'Trứng gà', emoji: '🥚', cat: 'Đạm', kcal: 155, protein: 13, carb: 1.1, fat: 11, per: '100g', tag: 'Phổ biến' },
  { id: 5, name: 'Bông cải xanh', emoji: '🥦', cat: 'Rau', kcal: 34, protein: 2.8, carb: 7, fat: 0.4, per: '100g', tag: 'Ít kcal' },
  { id: 6, name: 'Chuối', emoji: '🍌', cat: 'Trái cây', kcal: 89, protein: 1.1, carb: 23, fat: 0.3, per: '100g', tag: 'Kali cao' },
  { id: 7, name: 'Sữa tươi không đường', emoji: '🥛', cat: 'Sữa', kcal: 42, protein: 3.4, carb: 5, fat: 1, per: '100ml', tag: '' },
  { id: 8, name: 'Bánh mì trắng', emoji: '🍞', cat: 'Tinh bột', kcal: 265, protein: 9, carb: 49, fat: 3.2, per: '100g', tag: '' },
  { id: 9, name: 'Hạt óc chó', emoji: '🌰', cat: 'Hạt', kcal: 654, protein: 15, carb: 14, fat: 65, per: '100g', tag: 'Tốt cho tim' },
  { id: 10, name: 'Khoai lang', emoji: '🍠', cat: 'Tinh bột', kcal: 86, protein: 1.6, carb: 20, fat: 0.1, per: '100g', tag: 'Chỉ số GI thấp' },
  { id: 11, name: 'Sữa chua không đường', emoji: '🥣', cat: 'Sữa', kcal: 59, protein: 3.5, carb: 4.7, fat: 3.3, per: '100g', tag: '' },
  { id: 12, name: 'Cà rốt', emoji: '🥕', cat: 'Rau', kcal: 41, protein: 0.9, carb: 10, fat: 0.2, per: '100g', tag: 'Vitamin A' },
];

type Food = typeof foods[0];

const cats = ['Tất cả', 'Tinh bột', 'Đạm', 'Rau', 'Trái cây', 'Sữa', 'Hạt'];
const meals = ['Bữa sáng', 'Phụ sáng', 'Bữa trưa', 'Phụ chiều', 'Bữa tối', 'Phụ tối'];

type FoodSearchProps = {
  userRole?: 'patient' | 'user';
};

export function FoodSearch({ userRole = 'user' }: FoodSearchProps) {
  const isPatient = userRole === 'patient';
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Tất cả');
  const [onlyFav, setOnlyFav] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [maxKcal, setMaxKcal] = useState(700);
  const [sortBy, setSortBy] = useState<'default' | 'kcal-asc' | 'kcal-desc' | 'protein-desc'>('default');
  const [selected, setSelected] = useState<Food>(foods[1]);
  const [localFavs, setLocalFavs] = useState<number[]>([]);
  const [diaryFood, setDiaryFood] = useState<Food | null>(null);
  const [meal, setMeal] = useState(meals[2]);
  const [qty, setQty] = useState(100);

  const favStore = useFavorites();
  const diaryStore = useDiary();

  const hasFav = (id: number) => (isPatient ? favStore.has(id) : localFavs.includes(id));
  const toggleFavorite = (id: number, name: string) => {
    if (isPatient) {
      const wasFav = favStore.has(id);
      favStore.toggle(id);
      toast.success(wasFav ? `Đã xóa "${name}" khỏi yêu thích` : `Đã thêm "${name}" vào yêu thích`);
    } else {
      setLocalFavs((prev) => {
        const exists = prev.includes(id);
        toast.success(exists ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
        return exists ? prev.filter((x) => x !== id) : [...prev, id];
      });
    }
  };

  const onAddClick = (food: Food) => {
    if (isPatient) {
      setDiaryFood(food);
      setMeal(meals[2]);
      setQty(100);
    } else {
      toast.success(`Đã thêm ${food.name} vào nhật ký bữa ăn`);
    }
  };

  const submitDiary = () => {
    if (!diaryFood) return;
    const ratio = qty / 100;
    const entry: Omit<DiaryEntry, 'id' | 'createdAt'> = {
      foodId: diaryFood.id,
      name: diaryFood.name,
      emoji: diaryFood.emoji,
      meal,
      qty,
      per: diaryFood.per.replace(/[\d.]/g, '').trim() || 'g',
      kcal: Math.round(diaryFood.kcal * ratio),
      protein: +(diaryFood.protein * ratio).toFixed(1),
      carb: +(diaryFood.carb * ratio).toFixed(1),
      fat: +(diaryFood.fat * ratio).toFixed(1),
      date: todayKey(),
    };
    diaryStore.add(entry);
    const id = `temp-${Date.now()}`;
    toast.success(`Đã thêm ${diaryFood.name} vào ${meal.toLowerCase()}`, {
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          const last = diaryStore.entries[diaryStore.entries.length - 1];
          if (last && last.foodId === entry.foodId) diaryStore.remove(last.id);
        },
      },
    });
    void id;
    setDiaryFood(null);
  };

  const filtered = foods
    .filter(
      (f) =>
        (cat === 'Tất cả' || f.cat === cat) &&
        f.name.toLowerCase().includes(q.toLowerCase()) &&
        (!onlyFav || hasFav(f.id)) &&
        f.kcal <= maxKcal,
    )
    .sort((a, b) => {
      if (sortBy === 'kcal-asc') return a.kcal - b.kcal;
      if (sortBy === 'kcal-desc') return b.kcal - a.kcal;
      if (sortBy === 'protein-desc') return b.protein - a.protein;
      return 0;
    });

  const activeFilterCount = (maxKcal < 700 ? 1 : 0) + (sortBy !== 'default' ? 1 : 0);
  const resetFilters = () => { setMaxKcal(700); setSortBy('default'); };

  const todayEntries = isPatient ? diaryStore.entries.filter((e) => e.date === todayKey()) : [];
  const todayKcal = todayEntries.reduce((s, e) => s + e.kcal, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search hero */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <Search size={16} className="text-gray-400 ml-1 flex-shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm thực phẩm... (VD: gạo, ức gà, cá hồi)"
            className="flex-1 min-w-0 px-1 py-1 text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={() => setOnlyFav((v) => !v)}
          className={`px-2.5 py-1.5 rounded-md border text-xs flex items-center gap-1 transition flex-shrink-0 ${
            onlyFav ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Heart size={12} fill={onlyFav ? 'currentColor' : 'none'} /> <span className="hidden sm:inline">Yêu thích</span>
        </button>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`px-2.5 py-1.5 rounded-md border text-xs flex items-center gap-1 transition ${
              showFilter || activeFilterCount > 0
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={12} /> Bộ lọc
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px]">{activeFilterCount}</span>
            )}
          </button>
          {showFilter && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-50 p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-gray-600">Năng lượng tối đa</label>
                    <span className="text-xs text-emerald-700">≤ {maxKcal} kcal</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={700}
                    step={50}
                    value={maxKcal}
                    onChange={(e) => setMaxKcal(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Sắp xếp</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {([
                      ['default', 'Mặc định'],
                      ['kcal-asc', 'Kcal ↑'],
                      ['kcal-desc', 'Kcal ↓'],
                      ['protein-desc', 'Protein ↓'],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`px-2 py-1.5 rounded-md text-xs border transition ${
                          sortBy === key
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-100">
                  <button onClick={resetFilters} className="text-xs text-gray-600 hover:text-gray-900">
                    Đặt lại
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <button className="px-2.5 py-1.5 rounded-md bg-pink-50 text-pink-600 hover:bg-pink-100 flex items-center gap-1 text-xs flex-shrink-0">
          <Camera size={12} /> <span className="hidden sm:inline">Tìm bằng ảnh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: filters + results (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Categories */}
          <div className="-mx-1 px-1 overflow-x-auto">
            <div className="inline-flex gap-2 pb-1">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                    cat === c ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Results table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs text-gray-600 border-b border-gray-100">
              <div className="col-span-5">Thực phẩm</div>
              <div className="col-span-1 text-right">Kcal</div>
              <div className="col-span-1 text-right">P (g)</div>
              <div className="col-span-1 text-right">C (g)</div>
              <div className="col-span-1 text-right">F (g)</div>
              <div className="col-span-3 text-right">Hành động</div>
            </div>
            {filtered.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelected(f)}
                className={`w-full px-3 sm:px-4 py-3 border-b border-gray-50 text-left transition cursor-pointer ${
                  selected.id === f.id ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Desktop: grid row */}
                <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center text-xl flex-shrink-0">{f.emoji}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-gray-900 truncate">{f.name}</p>
                        {f.tag && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">{f.tag}</span>}
                      </div>
                      <p className="text-xs text-gray-500">{f.cat} • {f.per}</p>
                    </div>
                  </div>
                  <div className="col-span-1 text-right text-sm text-orange-600">{f.kcal}</div>
                  <div className="col-span-1 text-right text-sm text-gray-700">{f.protein}</div>
                  <div className="col-span-1 text-right text-sm text-gray-700">{f.carb}</div>
                  <div className="col-span-1 text-right text-sm text-gray-700">{f.fat}</div>
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(f.id, f.name); }}
                      className={`p-1.5 rounded-md ${hasFav(f.id) ? 'bg-pink-50 text-pink-600' : 'hover:bg-pink-50 text-gray-400 hover:text-pink-600'}`}
                    >
                      <Heart size={14} fill={hasFav(f.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddClick(f); }}
                      className="px-2 py-1 rounded-md bg-emerald-600 text-white text-xs flex items-center gap-1 hover:bg-emerald-700"
                    >
                      <Plus size={12} /> Thêm
                    </button>
                  </div>
                </div>
                {/* Mobile: stacked card */}
                <div className="sm:hidden flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center text-2xl flex-shrink-0">{f.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm text-gray-900 truncate">{f.name}</p>
                      {f.tag && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">{f.tag}</span>}
                    </div>
                    <p className="text-xs text-gray-500">{f.cat} • {f.per}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
                      <span className="text-orange-600 whitespace-nowrap">{f.kcal} kcal</span>
                      <span className="text-gray-500">P {f.protein}g</span>
                      <span className="text-gray-500">C {f.carb}g</span>
                      <span className="text-gray-500">F {f.fat}g</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(f.id, f.name); }}
                      className={`p-1.5 rounded-md ${hasFav(f.id) ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-400'}`}
                    >
                      <Heart size={14} fill={hasFav(f.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddClick(f); }}
                      className="p-1.5 rounded-md bg-emerald-600 text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Search size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm">{onlyFav ? 'Chưa có món yêu thích nào phù hợp' : 'Không tìm thấy thực phẩm phù hợp'}</p>
                <p className="text-xs text-gray-400 mt-1">Thử tìm với từ khóa khác</p>
              </div>
            )}
          </div>

          {/* Today's diary panel (patient only) */}
          {isPatient && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-600" />
                  <h4 className="text-sm text-gray-900">Đã thêm hôm nay</h4>
                  <span className="text-xs text-gray-500">({todayEntries.length} món)</span>
                </div>
                <div className="text-xs text-gray-600">
                  Tổng: <span className="text-orange-600">{todayKcal} kcal</span>
                </div>
              </div>
              {todayEntries.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  Chưa thêm món nào hôm nay. Nhấn <span className="text-emerald-700">Thêm</span> ở bảng trên để ghi vào nhật ký.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {todayEntries
                    .slice()
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((e) => (
                      <div key={e.id} className="px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-base">{e.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{e.name}</p>
                          <p className="text-xs text-gray-500">{e.meal} • {e.qty}{e.per}</p>
                        </div>
                        <div className="text-xs text-orange-600 w-16 text-right">{e.kcal} kcal</div>
                        <button
                          onClick={() => {
                            diaryStore.remove(e.id);
                            toast.success('Đã xóa khỏi nhật ký');
                          }}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: detail panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:sticky lg:top-4">
            <div className="bg-gradient-to-br from-emerald-100 to-green-200 p-4 sm:p-6 text-center text-5xl sm:text-6xl">
              {selected.emoji}
            </div>
            <div className="p-5">
              <h3 className="text-gray-900">{selected.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{selected.cat} • {selected.per}</p>
              {selected.tag && <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{selected.tag}</span>}

              <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-3 mt-4">
                <Flame size={28} className="text-orange-600" />
                <div>
                  <p className="text-xs text-gray-600">Năng lượng</p>
                  <p className="text-gray-900">{selected.kcal} kcal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Beef size={16} className="mx-auto text-rose-600 mb-1" />
                  <p className="text-[10px] text-gray-500">Protein</p>
                  <p className="text-sm text-gray-900">{selected.protein}g</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Wheat size={16} className="mx-auto text-amber-600 mb-1" />
                  <p className="text-[10px] text-gray-500">Carb</p>
                  <p className="text-sm text-gray-900">{selected.carb}g</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Droplet size={16} className="mx-auto text-sky-600 mb-1" />
                  <p className="text-[10px] text-gray-500">Fat</p>
                  <p className="text-sm text-gray-900">{selected.fat}g</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleFavorite(selected.id, selected.name)}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm flex items-center justify-center gap-1 transition ${
                    hasFav(selected.id)
                      ? 'border-pink-300 bg-pink-50 text-pink-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={14} fill={hasFav(selected.id) ? 'currentColor' : 'none'} /> Yêu thích
                </button>
                <button
                  onClick={() => onAddClick(selected)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                >
                  Thêm nhật ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-to-diary modal (patient only) */}
      {isPatient && diaryFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDiaryFood(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900">Thêm vào nhật ký</h3>
              <button onClick={() => setDiaryFood(null)} className="p-1 rounded-md text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl">{diaryFood.emoji}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{diaryFood.name}</p>
                  <p className="text-xs text-gray-500">{diaryFood.cat} • {diaryFood.kcal} kcal/{diaryFood.per}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Chọn bữa</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {meals.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMeal(m)}
                      className={`px-2 py-2 rounded-lg text-xs border transition ${
                        meal === m
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Khẩu phần ({diaryFood.per.replace(/[\d.]/g, '').trim() || 'g'})
                </label>
                <div className="flex items-center gap-2">
                  {[50, 100, 150, 200].map((v) => (
                    <button
                      key={v}
                      onClick={() => setQty(v)}
                      className={`px-3 py-1.5 rounded-md text-xs border transition ${
                        qty === v ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 0))}
                    className="flex-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500">Kcal</p>
                  <p className="text-sm text-orange-600">{Math.round(diaryFood.kcal * (qty / 100))}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">P</p>
                  <p className="text-sm text-gray-900">{(diaryFood.protein * (qty / 100)).toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">C</p>
                  <p className="text-sm text-gray-900">{(diaryFood.carb * (qty / 100)).toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">F</p>
                  <p className="text-sm text-gray-900">{(diaryFood.fat * (qty / 100)).toFixed(1)}g</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex gap-2 justify-end">
              <button
                onClick={() => setDiaryFood(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={submitDiary}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
