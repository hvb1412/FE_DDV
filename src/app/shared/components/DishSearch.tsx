import { useState, useRef, useCallback } from "react";
import {
  Search,
  Camera,
  Upload,
  X,
  CheckCircle2,
  Star,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from "lucide-react";
import { ImageWithFallback } from "@/app/shared/components/figma/ImageWithFallback";
import { toast } from 'sonner';

const imgChaGio = 'https://images.unsplash.com/photo-1606502281004-f0ac7e0e8b22?w=600&q=80';
const imgCanhChua = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80';
const imgBunCha = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgGoiCuon = 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80';
const imgBanhXeo = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80';
const imgComTam = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80';
const imgBunBo = 'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=600&q=80';
const imgPho = 'https://images.unsplash.com/photo-1535399831218-d4db1c8cfa45?w=600&q=80';

const DISHES = [
  {
    name: "Chả giò chiên",
    cal: 320,
    protein: 12,
    fat: 20,
    carbs: 25,
    serving: "3 cái (150g)",
    score: 4.3,
    img: imgChaGio,
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
  },
  {
    name: "Phở bò",
    cal: 500,
    protein: 28,
    fat: 14,
    carbs: 62,
    serving: "1 tô (650g)",
    score: 4.8,
    img: imgPho,
  },
];

const calColor = (cal: number) =>
  cal < 200
    ? "text-emerald-600 bg-emerald-50"
    : cal < 400
      ? "text-amber-600 bg-amber-50"
      : "text-rose-600 bg-rose-50";

export function DishSearch() {
  const [tab, setTab] = useState<"keyword" | "image">("keyword");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof DISHES)[0] | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = DISHES.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleImageChange = (f: File) => {
    setImagePreview(URL.createObjectURL(f));
    setAnalyzed(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) handleImageChange(f);
  }, []);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      toast.success('Nhận diện món ăn thành công!');
    }, 1800);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Vui lòng nhập tên món ăn');
      return;
    }
    if (filtered.length === 0) {
      toast.info('Không tìm thấy món ăn phù hợp');
    } else {
      toast.success(`Tìm thấy ${filtered.length} món ăn`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 w-fit">
        {[
          {
            id: "keyword" as const,
            label: "Theo từ khóa",
            Icon: Search,
          },
          {
            id: "image" as const,
            label: "Theo hình ảnh",
            Icon: Camera,
          },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === id
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "keyword" && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nhập tên món ăn... (VD: phở bò, bún chả)"
                  className="pl-10 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition"
              >
                <Search size={16} /> Tìm kiếm
              </button>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-4 gap-5 items-start">
            {/* Dish cards */}
            <div
              className={
                selected
                  ? "col-span-3 grid grid-cols-3 gap-4"
                  : "col-span-4 grid grid-cols-4 gap-4"
              }
            >
              {filtered.map((d) => (
                <button
                  key={d.name}
                  onClick={() =>
                    setSelected(
                      selected?.name === d.name ? null : d,
                    )
                  }
                  className={`bg-white rounded-2xl border-2 shadow-sm text-left hover:shadow-md transition overflow-hidden group ${
                    selected?.name === d.name
                      ? "border-green-500"
                      : "border-gray-100 hover:border-green-200"
                  }`}
                >
                  {/* Photo */}
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 140 }}
                  >
                    <ImageWithFallback
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Rating badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                      <Star
                        size={11}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {d.score}
                      </span>
                    </div>
                    {/* Cal badge */}
                    <div
                      className={`absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${calColor(d.cal)} bg-opacity-90`}
                    >
                      {d.cal} kcal
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {d.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {d.serving}
                    </p>
                    <div className="grid grid-cols-3 gap-1 mt-2">
                      <div className="text-center bg-blue-50 rounded-lg py-1">
                        <p className="text-xs font-bold text-blue-600">
                          {d.protein}g
                        </p>
                        <p className="text-[9px] text-gray-400">
                          P
                        </p>
                      </div>
                      <div className="text-center bg-yellow-50 rounded-lg py-1">
                        <p className="text-xs font-bold text-yellow-600">
                          {d.fat}g
                        </p>
                        <p className="text-[9px] text-gray-400">
                          F
                        </p>
                      </div>
                      <div className="text-center bg-purple-50 rounded-lg py-1">
                        <p className="text-xs font-bold text-purple-600">
                          {d.carbs}g
                        </p>
                        <p className="text-[9px] text-gray-400">
                          C
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
                  <div
                    className="relative"
                    style={{ height: 180 }}
                  >
                    <ImageWithFallback
                      src={selected.img}
                      alt={selected.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                    >
                      <X size={14} className="text-gray-600" />
                    </button>
                    <div
                      className={`absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${calColor(selected.cal)}`}
                    >
                      {selected.cal} kcal
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-gray-900 font-semibold">
                        {selected.name}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star
                          size={13}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {selected.score}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selected.serving}
                    </p>

                    <div className="mt-4 space-y-2">
                      {[
                        {
                          icon: Flame,
                          label: "Năng lượng",
                          value: `${selected.cal} kcal`,
                          color: "text-orange-500 bg-orange-50",
                        },
                        {
                          icon: Beef,
                          label: "Protein",
                          value: `${selected.protein}g`,
                          color: "text-rose-500 bg-rose-50",
                        },
                        {
                          icon: Wheat,
                          label: "Carbohydrate",
                          value: `${selected.carbs}g`,
                          color: "text-amber-500 bg-amber-50",
                        },
                        {
                          icon: Droplet,
                          label: "Chất béo",
                          value: `${selected.fat}g`,
                          color: "text-sky-500 bg-sky-50",
                        },
                      ].map(
                        ({
                          icon: Icon,
                          label,
                          value,
                          color,
                        }) => (
                          <div
                            key={label}
                            className={`flex items-center gap-3 p-2.5 rounded-xl ${color.split(" ")[1]}`}
                          >
                            <Icon
                              size={16}
                              className={color.split(" ")[0]}
                            />
                            <span className="text-xs text-gray-600 flex-1">
                              {label}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "image" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Tải ảnh món ăn lên
            </h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {!imagePreview ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-56 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-green-400 hover:bg-green-50/50 transition"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload
                      size={24}
                      className="text-gray-400"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Kéo thả hoặc nhấn để chọn ảnh
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP tối đa 10MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setAnalyzed(false);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageChange(f);
              }}
            />
            {imagePreview && (
              <button
                onClick={analyze}
                disabled={analyzing}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl text-sm mt-4 transition"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                    Đang nhận diện...
                  </>
                ) : (
                  <>
                    <Camera size={16} /> Nhận diện món ăn
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Kết quả nhận diện
            </h3>
            {!analyzed ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-gray-300">
                <Camera size={48} className="mb-3" />
                <p className="text-sm text-gray-400">
                  Tải ảnh lên để nhận diện món ăn và xem thông
                  tin dinh dưỡng
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">
                    Nhận diện thành công!
                  </span>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <p className="font-semibold text-gray-800">
                    Phở bò Hà Nội
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Độ tin cậy: 92% • Khẩu phần: 1 tô ~650g
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Năng lượng",
                      value: "500 kcal",
                      bg: "bg-orange-50",
                      text: "text-orange-600",
                    },
                    {
                      label: "Protein",
                      value: "28g",
                      bg: "bg-blue-50",
                      text: "text-blue-600",
                    },
                    {
                      label: "Chất béo",
                      value: "14g",
                      bg: "bg-yellow-50",
                      text: "text-yellow-600",
                    },
                    {
                      label: "Carbohydrate",
                      value: "62g",
                      bg: "bg-purple-50",
                      text: "text-purple-600",
                    },
                  ].map(({ label, value, bg, text }) => (
                    <div
                      key={label}
                      className={`p-3 rounded-xl ${bg}`}
                    >
                      <p className="text-xs text-gray-500">
                        {label}
                      </p>
                      <p
                        className={`text-sm font-bold ${text}`}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
