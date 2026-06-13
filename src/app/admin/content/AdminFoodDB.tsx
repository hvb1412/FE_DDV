import { useMemo, useState, type ReactNode } from 'react';
import { Search, Pencil, Trash2, Upload, Plus, Database, X, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type Group = 'vegetable' | 'meat-fish' | 'grain' | 'dairy' | 'fruit' | 'other';
type Unit = '100g' | 'khẩu phần';

/* ---------- Nutrient schema ----------
 * Backend lưu đầy đủ vi chất theo chuẩn FCT/USDA.
 * Form bắt buộc capture đủ; bảng chỉ hiển thị 4 cột macro để dễ đọc.
 * --------------------------------------*/
type Macros = {
  calories: number; // kcal
  water: number;    // g
  protein: number;  // g
  carb: number;     // g
  fiber: number;    // g (Celluloza / chất xơ)
  sugar: number;    // g (đường tổng)
  fat: number;      // g (lipid tổng)
  saturated: number; // g
  monounsat: number; // g
  polyunsat: number; // g
  trans: number;     // g
  cholesterol: number; // mg
  ash: number;       // g (Tro)
  purine: number;    // mg (Purin)
};

type Vitamins = {
  vitA: number;   // µg RAE (Retinol)
  vitB1: number;  // mg (Thiamin)
  vitB2: number;  // mg (Riboflavin)
  vitB3: number;  // mg (PP / Niacin)
  vitB5: number;  // mg (Pantothenic)
  vitB6: number;  // mg
  vitB7: number;  // µg (H / Biotin)
  vitB9: number;  // µg (Folat — folate tự nhiên)
  folicAcid: number; // µg (Folic acid — B9 dạng tổng hợp)
  vitB12: number; // µg
  vitC: number;   // mg
  vitD: number;   // µg (Calciferol)
  vitE: number;   // mg (Alpha-tocopherol)
  vitK: number;   // µg (Phylloquinone)
};

type Minerals = {
  calcium: number;    // mg
  iron: number;       // mg
  magnesium: number;  // mg
  phosphorus: number; // mg
  potassium: number;  // mg
  sodium: number;     // mg
  zinc: number;       // mg
  copper: number;     // mg
  manganese: number;  // mg
  selenium: number;   // µg
  iodine: number;     // µg
};

type FattyAcids = {
  omega3: number; // mg (tổng, tham chiếu nhanh)
  omega6: number; // mg (tổng, tham chiếu nhanh)
};

type Sugars = {
  galactose: number; // g
  maltose: number;
  lactose: number;
  fructose: number;
  glucose: number;
  sucrose: number;
};

type Isoflavones = {
  total: number;     // mg
  daidzein: number;
  genistein: number;
  glycitein: number;
};

type SaturatedFA = {
  palmitic: number;    // mg (C16:0)
  margaric: number;    // mg (C17:0)
  stearic: number;     // mg (C18:0)
  arachidic: number;   // mg (C20:0)
  behenic: number;     // mg (C22:0)
  lignoceric: number;  // mg (C24:0)
};

type MUFA = {
  myristoleic: number; // mg (C14:1)
  palmitoleic: number; // mg (C16:1)
  oleic: number;       // mg (C18:1)
};

type PUFA = {
  linoleic: number;     // mg (C18:2 n6)
  linolenic: number;    // mg (C18:3 n3)
  arachidonic: number;  // mg (C20:4)
  epa: number;          // mg (C20:5 n3 — Eicosapentaenoic)
  dha: number;          // mg (C22:6 n3 — Docosahexaenoic)
};

type Sterols = {
  phytosterol: number; // mg (cholesterol đã có trong macros)
};

type Carotenoids = {
  betaCarotene: number;      // µg
  alphaCarotene: number;     // µg
  betaCryptoxanthin: number; // µg
  lycopene: number;          // µg
  luteinZeaxanthin: number;  // µg
};

type AminoAcids = {
  // Essential
  histidine: number;     // mg
  isoleucine: number;
  leucine: number;
  lysine: number;
  methionine: number;
  phenylalanine: number;
  threonine: number;
  tryptophan: number;
  valine: number;
  // Conditionally essential / non-essential
  arginine: number;
  cystine: number;
  tyrosine: number;
  alanine: number;
  asparticAcid: number;
  glutamicAcid: number;
  glycine: number;
  proline: number;
  serine: number;
};

type Food = {
  id: string;
  name: string;
  nameEn?: string;
  group: Group;
  unit: Unit;
  servingGrams: number;
  source: string;
  sourceCode?: string;
  macros: Macros;
  sugars: Sugars;
  vitamins: Vitamins;
  minerals: Minerals;
  fattyAcids: FattyAcids;
  saturatedFA: SaturatedFA;
  mufa: MUFA;
  pufa: PUFA;
  sterols: Sterols;
  isoflavones: Isoflavones;
  carotenoids: Carotenoids;
  aminoAcids: AminoAcids;
};

const groupBadge: Record<Group, { label: string; cls: string }> = {
  vegetable: { label: 'Rau củ',    cls: 'bg-emerald-100 text-emerald-700' },
  'meat-fish': { label: 'Thịt cá', cls: 'bg-rose-100 text-rose-700' },
  grain:     { label: 'Ngũ cốc',  cls: 'bg-amber-100 text-amber-700' },
  dairy:     { label: 'Sữa',      cls: 'bg-sky-100 text-sky-700' },
  fruit:     { label: 'Trái cây', cls: 'bg-pink-100 text-pink-700' },
  other:     { label: 'Khác',     cls: 'bg-gray-100 text-gray-600' },
};

/* ---------- Helpers ---------- */
const zeroMacros = (): Macros => ({ calories: 0, water: 0, protein: 0, carb: 0, fiber: 0, sugar: 0, fat: 0, saturated: 0, monounsat: 0, polyunsat: 0, trans: 0, cholesterol: 0, ash: 0, purine: 0 });
const zeroVitamins = (): Vitamins => ({ vitA: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB5: 0, vitB6: 0, vitB7: 0, vitB9: 0, folicAcid: 0, vitB12: 0, vitC: 0, vitD: 0, vitE: 0, vitK: 0 });
const zeroMinerals = (): Minerals => ({ calcium: 0, iron: 0, magnesium: 0, phosphorus: 0, potassium: 0, sodium: 0, zinc: 0, copper: 0, manganese: 0, selenium: 0, iodine: 0 });
const zeroFA = (): FattyAcids => ({ omega3: 0, omega6: 0 });
const zeroSug = (): Sugars => ({ galactose: 0, maltose: 0, lactose: 0, fructose: 0, glucose: 0, sucrose: 0 });
const zeroIso = (): Isoflavones => ({ total: 0, daidzein: 0, genistein: 0, glycitein: 0 });
const zeroSat = (): SaturatedFA => ({ palmitic: 0, margaric: 0, stearic: 0, arachidic: 0, behenic: 0, lignoceric: 0 });
const zeroMUFA = (): MUFA => ({ myristoleic: 0, palmitoleic: 0, oleic: 0 });
const zeroPUFA = (): PUFA => ({ linoleic: 0, linolenic: 0, arachidonic: 0, epa: 0, dha: 0 });
const zeroSterols = (): Sterols => ({ phytosterol: 0 });
const zeroCar = (): Carotenoids => ({ betaCarotene: 0, alphaCarotene: 0, betaCryptoxanthin: 0, lycopene: 0, luteinZeaxanthin: 0 });
const zeroAA = (): AminoAcids => ({
  histidine: 0, isoleucine: 0, leucine: 0, lysine: 0, methionine: 0, phenylalanine: 0, threonine: 0, tryptophan: 0, valine: 0,
  arginine: 0, cystine: 0, tyrosine: 0, alanine: 0, asparticAcid: 0, glutamicAcid: 0, glycine: 0, proline: 0, serine: 0,
});

const blankFood = (): Food => ({
  id: '', name: '', nameEn: '', group: 'vegetable', unit: '100g', servingGrams: 100,
  source: 'Viện Dinh dưỡng QG', sourceCode: '',
  macros: zeroMacros(), sugars: zeroSug(), vitamins: zeroVitamins(), minerals: zeroMinerals(),
  fattyAcids: zeroFA(), saturatedFA: zeroSat(), mufa: zeroMUFA(), pufa: zeroPUFA(),
  sterols: zeroSterols(), isoflavones: zeroIso(), carotenoids: zeroCar(), aminoAcids: zeroAA(),
});

const seed: Food[] = [
  {
    id: 'F001', name: 'Rau muống luộc', nameEn: 'Boiled water spinach', group: 'vegetable', unit: '100g', servingGrams: 100,
    source: 'Viện Dinh dưỡng QG', sourceCode: 'VN-VEG-001',
    macros: { ...zeroMacros(), calories: 30, water: 92.0, protein: 2.5, carb: 5.4, fiber: 2.1, sugar: 0.8, fat: 0.3, saturated: 0.1, monounsat: 0.0, polyunsat: 0.1, trans: 0, cholesterol: 0 },
    vitamins: { ...zeroVitamins(), vitA: 315, vitC: 55, vitB9: 57, vitK: 250, vitE: 0.9 },
    minerals: { ...zeroMinerals(), calcium: 77, iron: 1.7, magnesium: 71, phosphorus: 39, potassium: 312, sodium: 65 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: zeroAA(),
  },
  {
    id: 'F002', name: 'Ức gà nướng', nameEn: 'Grilled chicken breast', group: 'meat-fish', unit: '100g', servingGrams: 100,
    source: 'USDA', sourceCode: 'USDA-171477',
    macros: { ...zeroMacros(), calories: 165, water: 65.3, protein: 31, carb: 0, fiber: 0, sugar: 0, fat: 3.6, saturated: 1.0, monounsat: 1.2, polyunsat: 0.8, trans: 0, cholesterol: 85 },
    vitamins: { ...zeroVitamins(), vitB3: 13.7, vitB6: 0.6, vitB12: 0.3 },
    minerals: { ...zeroMinerals(), phosphorus: 220, potassium: 256, sodium: 74, zinc: 1.0, selenium: 27.6 },
    fattyAcids: { omega3: 70, omega6: 760 },
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: { histidine: 960, isoleucine: 1640, leucine: 2330, lysine: 2640, methionine: 860, phenylalanine: 1230, threonine: 1320, tryptophan: 360, valine: 1540, arginine: 1890, cystine: 410, tyrosine: 1040, alanine: 1690, asparticAcid: 2780, glutamicAcid: 4640, glycine: 1530, proline: 1230, serine: 1070 },
  },
  {
    id: 'F003', name: 'Cơm trắng', nameEn: 'White rice (cooked)', group: 'grain', unit: '100g', servingGrams: 100,
    source: 'Viện Dinh dưỡng QG', sourceCode: 'VN-GRA-001',
    macros: { ...zeroMacros(), calories: 130, water: 68.4, protein: 2.7, carb: 28, fiber: 0.4, sugar: 0.1, fat: 0.3, saturated: 0.1, monounsat: 0.1, polyunsat: 0.1, trans: 0, cholesterol: 0 },
    vitamins: { ...zeroVitamins(), vitB1: 0.02, vitB3: 0.4, vitB9: 3 },
    minerals: { ...zeroMinerals(), calcium: 10, iron: 0.2, magnesium: 12, phosphorus: 43, potassium: 35, sodium: 1, zinc: 0.5 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: zeroAA(),
  },
  {
    id: 'F004', name: 'Sữa tươi không đường', nameEn: 'Unsweetened fresh milk', group: 'dairy', unit: '100g', servingGrams: 100,
    source: 'Vinamilk', sourceCode: 'VNM-MILK-100',
    macros: { ...zeroMacros(), calories: 42, water: 88, protein: 3.4, carb: 5, fiber: 0, sugar: 5, fat: 1, saturated: 0.6, monounsat: 0.3, polyunsat: 0.05, trans: 0, cholesterol: 5 },
    vitamins: { ...zeroVitamins(), vitA: 46, vitB2: 0.18, vitB12: 0.5, vitD: 1.3 },
    minerals: { ...zeroMinerals(), calcium: 113, magnesium: 10, phosphorus: 84, potassium: 132, sodium: 43, zinc: 0.4 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: zeroAA(),
  },
  {
    id: 'F005', name: 'Chuối tiêu', nameEn: 'Banana', group: 'fruit', unit: '100g', servingGrams: 100,
    source: 'USDA', sourceCode: 'USDA-173944',
    macros: { ...zeroMacros(), calories: 89, water: 74.9, protein: 1.1, carb: 23, fiber: 2.6, sugar: 12, fat: 0.3, saturated: 0.1, monounsat: 0.03, polyunsat: 0.07, trans: 0, cholesterol: 0 },
    vitamins: { ...zeroVitamins(), vitB6: 0.4, vitC: 8.7, vitB9: 20 },
    minerals: { ...zeroMinerals(), calcium: 5, iron: 0.3, magnesium: 27, phosphorus: 22, potassium: 358, sodium: 1, zinc: 0.2 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: zeroAA(),
  },
  {
    id: 'F006', name: 'Cá hồi áp chảo', nameEn: 'Pan-seared salmon', group: 'meat-fish', unit: '100g', servingGrams: 100,
    source: 'USDA', sourceCode: 'USDA-175168',
    macros: { ...zeroMacros(), calories: 208, water: 64.9, protein: 20, carb: 0, fiber: 0, sugar: 0, fat: 13, saturated: 3.1, monounsat: 3.8, polyunsat: 3.9, trans: 0, cholesterol: 55 },
    vitamins: { ...zeroVitamins(), vitB3: 8.0, vitB6: 0.6, vitB12: 3.2, vitD: 11.0, vitE: 1.1 },
    minerals: { ...zeroMinerals(), calcium: 9, iron: 0.3, magnesium: 27, phosphorus: 200, potassium: 363, sodium: 59, selenium: 36.5 },
    fattyAcids: { omega3: 2260, omega6: 666 },
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: { histidine: 590, isoleucine: 920, leucine: 1620, lysine: 1830, methionine: 590, phenylalanine: 780, threonine: 875, tryptophan: 224, valine: 1030, arginine: 1200, cystine: 220, tyrosine: 680, alanine: 1210, asparticAcid: 2050, glutamicAcid: 2980, glycine: 960, proline: 710, serine: 820 },
  },
  {
    id: 'F007', name: 'Bánh mì nguyên cám', nameEn: 'Whole wheat bread', group: 'grain', unit: '100g', servingGrams: 100,
    source: 'USDA', sourceCode: 'USDA-172684',
    macros: { ...zeroMacros(), calories: 247, water: 38, protein: 13, carb: 41, fiber: 7, sugar: 6, fat: 3.4, saturated: 0.7, monounsat: 0.7, polyunsat: 1.4, trans: 0, cholesterol: 0 },
    vitamins: { ...zeroVitamins(), vitB1: 0.4, vitB3: 4.4, vitB9: 42, vitE: 0.5 },
    minerals: { ...zeroMinerals(), calcium: 107, iron: 2.5, magnesium: 82, phosphorus: 202, potassium: 248, sodium: 472, zinc: 1.9 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: zeroCar(),
    aminoAcids: zeroAA(),
  },
  {
    id: 'F008', name: 'Cà rốt', nameEn: 'Carrot', group: 'vegetable', unit: '100g', servingGrams: 100,
    source: 'Viện Dinh dưỡng QG', sourceCode: 'VN-VEG-008',
    macros: { ...zeroMacros(), calories: 41, water: 88, protein: 0.9, carb: 9.6, fiber: 2.8, sugar: 4.7, fat: 0.2, saturated: 0.0, monounsat: 0.0, polyunsat: 0.1, trans: 0, cholesterol: 0 },
    vitamins: { ...zeroVitamins(), vitA: 835, vitC: 5.9, vitK: 13.2, vitB6: 0.14 },
    minerals: { ...zeroMinerals(), calcium: 33, iron: 0.3, magnesium: 12, phosphorus: 35, potassium: 320, sodium: 69 },
    fattyAcids: zeroFA(),
    sugars: zeroSug(),
    saturatedFA: zeroSat(),
    mufa: zeroMUFA(),
    pufa: zeroPUFA(),
    sterols: zeroSterols(),
    isoflavones: zeroIso(),
    carotenoids: { ...zeroCar(), betaCarotene: 8285, alphaCarotene: 3477, luteinZeaxanthin: 256 },
    aminoAcids: zeroAA(),
  },
];

/* ---------- Component ---------- */
export function AdminFoodDB() {
  const [rows, setRows] = useState<Food[]>(seed);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<'all' | Group>('all');
  const [editing, setEditing] = useState<Food | null>(null);
  const [confirmDel, setConfirmDel] = useState<Food | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const filtered = useMemo(() => rows.filter(r => {
    const s = search.toLowerCase();
    return (!s || r.name.toLowerCase().includes(s) || (r.nameEn || '').toLowerCase().includes(s) || r.id.toLowerCase().includes(s))
      && (groupFilter === 'all' || r.group === groupFilter);
  }), [rows, search, groupFilter]);

  const onSave = (next: Food) => {
    if (!next.name.trim()) { toast.error('Vui lòng nhập tên thực phẩm'); return; }
    if (next.macros.calories < 0) { toast.error('Calo không hợp lệ'); return; }
    if (next.id) {
      setRows(rs => rs.map(r => r.id === next.id ? next : r));
      toast.success(`Đã cập nhật "${next.name}"`);
    } else {
      const nums = rows.map(r => parseInt(r.id.slice(1), 10) || 0);
      const nextNum = Math.max(0, ...nums) + 1;
      const id = `F${String(nextNum).padStart(3, '0')}`;
      setRows(rs => [...rs, { ...next, id }]);
      toast.success(`Đã thêm "${next.name}" vào cơ sở dữ liệu`);
    }
    setEditing(null);
  };

  const doDelete = (food: Food) => {
    setRows(rs => rs.filter(r => r.id !== food.id));
    toast.success(`Đã xoá "${food.name}"`);
    setConfirmDel(null);
  };

  const startSync = () => {
    setSyncing(true);
    toast.info('Đang đồng bộ dữ liệu từ cơ sở dữ liệu cấp trên...', { id: 'sync' });
    // Mock: gọi backend, ở môi trường thực sẽ là fetch(...)
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      setLastSync(stamp);
      toast.success('Đồng bộ thành công', {
        id: 'sync',
        description: `${rows.length} bản ghi đã được đối chiếu • Cập nhật lúc ${stamp}`,
      });
    }, 1600);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cơ sở dữ liệu dinh dưỡng</h1>
            <p className="text-sm text-gray-500 mt-1">
              Đối chiếu, đồng bộ với cơ sở dữ liệu cấp trên và quản lý chi tiết hồ sơ vi chất từng thực phẩm.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastSync && (
              <div className="text-xs text-gray-500 inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" /> Đồng bộ lần cuối: <span className="font-medium text-gray-700">{lastSync}</span>
              </div>
            )}
            <button
              onClick={startSync}
              disabled={syncing}
              className="px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
            </button>
          </div>
        </div>

        {/* Filter + actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên VN, tên tiếng Anh hoặc mã..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value="all">Tất cả nhóm</option>
              <option value="vegetable">Rau củ</option>
              <option value="meat-fish">Thịt cá</option>
              <option value="grain">Ngũ cốc</option>
              <option value="dairy">Sữa</option>
              <option value="fruit">Trái cây</option>
              <option value="other">Khác</option>
            </select>
            <button
              onClick={() => toast.info('Mở trình nhập CSV')}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Upload size={14} /> Nhập CSV
            </button>
            <button
              onClick={() => setEditing(blankFood())}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium flex items-center gap-1.5"
            >
              <Plus size={14} /> Thêm thực phẩm
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Database size={28} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Chưa có thực phẩm</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Thêm thực phẩm mới, nhập từ CSV hoặc đồng bộ từ CSDL cấp trên.</p>
              <button onClick={() => setEditing(blankFood())} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
                + Thêm thực phẩm
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Tên thực phẩm</th>
                  <th className="px-4 py-3">Nhóm</th>
                  <th className="px-4 py-3">Đơn vị</th>
                  <th className="px-4 py-3 text-right">Calo (kcal)</th>
                  <th className="px-4 py-3 text-right">Protein (g)</th>
                  <th className="px-4 py-3 text-right">Carb (g)</th>
                  <th className="px-4 py-3 text-right">Chất béo (g)</th>
                  <th className="px-4 py-3">Nguồn</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.id}{r.nameEn ? ` · ${r.nameEn}` : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${groupBadge[r.group].cls}`}>
                        {groupBadge[r.group].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.macros.calories}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.macros.protein}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.macros.carb}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.macros.fat}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {r.source}
                      {r.sourceCode && <span className="block text-[10px] text-gray-400">{r.sourceCode}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(r)} title="Chỉnh sửa" className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDel(r)} title="Xoá" className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && <FoodEditor food={editing} onClose={() => setEditing(null)} onSave={onSave} />}
      {confirmDel && (
        <ConfirmDeleteModal
          food={confirmDel}
          onClose={() => setConfirmDel(null)}
          onConfirm={() => doDelete(confirmDel)}
        />
      )}
    </div>
  );
}

/* =========================================================
   Food editor — full nutrient profile
   ========================================================= */
function FoodEditor({ food, onClose, onSave }: { food: Food; onClose: () => void; onSave: (f: Food) => void }) {
  const [draft, setDraft] = useState<Food>(food);
  const [openBasics, setOpenBasics] = useState(true);
  const [openMacros, setOpenMacros] = useState(true);
  const [openVitamins, setOpenVitamins] = useState(false);
  const [openMinerals, setOpenMinerals] = useState(false);
  const [openSug, setOpenSug] = useState(false);
  const [openFA, setOpenFA] = useState(false);
  const [openSat, setOpenSat] = useState(false);
  const [openMUFA, setOpenMUFA] = useState(false);
  const [openPUFA, setOpenPUFA] = useState(false);
  const [openSterol, setOpenSterol] = useState(false);
  const [openIso, setOpenIso] = useState(false);
  const [openCar, setOpenCar] = useState(false);
  const [openAA, setOpenAA] = useState(false);

  const setMacro = (k: keyof Macros, v: number) => setDraft({ ...draft, macros: { ...draft.macros, [k]: v } });
  const setSug = (k: keyof Sugars, v: number) => setDraft({ ...draft, sugars: { ...draft.sugars, [k]: v } });
  const setVit = (k: keyof Vitamins, v: number) => setDraft({ ...draft, vitamins: { ...draft.vitamins, [k]: v } });
  const setMin = (k: keyof Minerals, v: number) => setDraft({ ...draft, minerals: { ...draft.minerals, [k]: v } });
  const setFA = (k: keyof FattyAcids, v: number) => setDraft({ ...draft, fattyAcids: { ...draft.fattyAcids, [k]: v } });
  const setSat = (k: keyof SaturatedFA, v: number) => setDraft({ ...draft, saturatedFA: { ...draft.saturatedFA, [k]: v } });
  const setMUFA = (k: keyof MUFA, v: number) => setDraft({ ...draft, mufa: { ...draft.mufa, [k]: v } });
  const setPUFA = (k: keyof PUFA, v: number) => setDraft({ ...draft, pufa: { ...draft.pufa, [k]: v } });
  const setSterol = (k: keyof Sterols, v: number) => setDraft({ ...draft, sterols: { ...draft.sterols, [k]: v } });
  const setIso = (k: keyof Isoflavones, v: number) => setDraft({ ...draft, isoflavones: { ...draft.isoflavones, [k]: v } });
  const setCar = (k: keyof Carotenoids, v: number) => setDraft({ ...draft, carotenoids: { ...draft.carotenoids, [k]: v } });
  const setAA = (k: keyof AminoAcids, v: number) => setDraft({ ...draft, aminoAcids: { ...draft.aminoAcids, [k]: v } });

  const validate = (): string | null => {
    if (!draft.name.trim()) return 'Tên thực phẩm không được để trống';
    if (!draft.source.trim()) return 'Vui lòng nhập nguồn dữ liệu';
    if (draft.servingGrams <= 0) return 'Khối lượng khẩu phần phải > 0';
    const m = draft.macros;
    if (m.calories < 0 || m.protein < 0 || m.carb < 0 || m.fat < 0) return 'Giá trị dinh dưỡng không được âm';
    // Sanity: fiber + sugar không vượt carb (đôi khi không bằng do tròn số), cho phép sai số 1g
    if (m.fiber + m.sugar > m.carb + 1) return 'Fiber + Sugar không thể lớn hơn Carb tổng';
    if (m.saturated + m.monounsat + m.polyunsat + m.trans > m.fat + 1) return 'Tổng các loại chất béo không thể lớn hơn Chất béo tổng';
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-semibold text-gray-900">{draft.id ? `Chỉnh sửa: ${food.name}` : 'Thêm thực phẩm mới'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Nhập đầy đủ hồ sơ vi chất theo chuẩn cơ sở dữ liệu dinh dưỡng</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {/* Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 flex items-start gap-2 text-xs text-blue-800">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <p>Tất cả giá trị tính trên đơn vị đã chọn (mặc định 100g). Để trống = 0. Hệ thống lưu trữ đầy đủ vi chất, nhưng bảng chính chỉ hiển thị macro để dễ tra cứu.</p>
          </div>

          <Accordion open={openBasics} onToggle={() => setOpenBasics(o => !o)} title="Thông tin cơ bản" required>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Tên tiếng Việt *" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="VD: Rau muống luộc" />
              <TextField label="Tên tiếng Anh" value={draft.nameEn || ''} onChange={(v) => setDraft({ ...draft, nameEn: v })} placeholder="VD: Boiled water spinach" />
              <SelectField label="Nhóm thực phẩm *" value={draft.group} onChange={(v) => setDraft({ ...draft, group: v as Group })}
                options={[
                  ['vegetable', 'Rau củ'], ['meat-fish', 'Thịt cá'], ['grain', 'Ngũ cốc'],
                  ['dairy', 'Sữa'], ['fruit', 'Trái cây'], ['other', 'Khác'],
                ]} />
              <SelectField label="Đơn vị tính" value={draft.unit} onChange={(v) => setDraft({ ...draft, unit: v as Unit })}
                options={[['100g', '100g'], ['khẩu phần', 'khẩu phần']]} />
              <NumberField label="Khối lượng khẩu phần (g)" value={draft.servingGrams} onChange={(v) => setDraft({ ...draft, servingGrams: v })} />
              <TextField label="Nguồn dữ liệu *" value={draft.source} onChange={(v) => setDraft({ ...draft, source: v })} placeholder="Viện Dinh dưỡng QG / USDA..." />
              <TextField label="Mã nguồn" value={draft.sourceCode || ''} onChange={(v) => setDraft({ ...draft, sourceCode: v })} placeholder="VD: USDA-171477" />
            </div>
          </Accordion>

          <Accordion open={openMacros} onToggle={() => setOpenMacros(o => !o)} title="Macro & năng lượng" required>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Calo (kcal)" value={draft.macros.calories} onChange={(v) => setMacro('calories', v)} />
              <NumberField label="Nước (g)" value={draft.macros.water} onChange={(v) => setMacro('water', v)} />
              <NumberField label="Protein (g)" value={draft.macros.protein} onChange={(v) => setMacro('protein', v)} />
              <NumberField label="Carb tổng (g)" value={draft.macros.carb} onChange={(v) => setMacro('carb', v)} />
              <NumberField label="↳ Chất xơ (g)" value={draft.macros.fiber} onChange={(v) => setMacro('fiber', v)} />
              <NumberField label="↳ Đường (g)" value={draft.macros.sugar} onChange={(v) => setMacro('sugar', v)} />
              <NumberField label="Chất béo tổng (g)" value={draft.macros.fat} onChange={(v) => setMacro('fat', v)} />
              <NumberField label="↳ Bão hoà (g)" value={draft.macros.saturated} onChange={(v) => setMacro('saturated', v)} />
              <NumberField label="↳ Đơn không bão hoà (g)" value={draft.macros.monounsat} onChange={(v) => setMacro('monounsat', v)} />
              <NumberField label="↳ Đa không bão hoà (g)" value={draft.macros.polyunsat} onChange={(v) => setMacro('polyunsat', v)} />
              <NumberField label="↳ Trans fat (g)" value={draft.macros.trans} onChange={(v) => setMacro('trans', v)} />
              <NumberField label="Cholesterol (mg)" value={draft.macros.cholesterol} onChange={(v) => setMacro('cholesterol', v)} />
              <NumberField label="Tro / Ash (g)" value={draft.macros.ash} onChange={(v) => setMacro('ash', v)} />
              <NumberField label="Purin (mg)" value={draft.macros.purine} onChange={(v) => setMacro('purine', v)} />
            </div>
          </Accordion>

          <Accordion open={openVitamins} onToggle={() => setOpenVitamins(o => !o)} title="Vitamin">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Vitamin A (µg RAE)" value={draft.vitamins.vitA} onChange={(v) => setVit('vitA', v)} />
              <NumberField label="Vitamin B1 / Thiamin (mg)" value={draft.vitamins.vitB1} onChange={(v) => setVit('vitB1', v)} />
              <NumberField label="Vitamin B2 / Riboflavin (mg)" value={draft.vitamins.vitB2} onChange={(v) => setVit('vitB2', v)} />
              <NumberField label="Vitamin B3 / Niacin (mg)" value={draft.vitamins.vitB3} onChange={(v) => setVit('vitB3', v)} />
              <NumberField label="Vitamin B5 / Pantothenic (mg)" value={draft.vitamins.vitB5} onChange={(v) => setVit('vitB5', v)} />
              <NumberField label="Vitamin B6 (mg)" value={draft.vitamins.vitB6} onChange={(v) => setVit('vitB6', v)} />
              <NumberField label="Vitamin B7 / Biotin (µg)" value={draft.vitamins.vitB7} onChange={(v) => setVit('vitB7', v)} />
              <NumberField label="Folat (µg)" value={draft.vitamins.vitB9} onChange={(v) => setVit('vitB9', v)} />
              <NumberField label="Vitamin B9 / Folic acid (µg)" value={draft.vitamins.folicAcid} onChange={(v) => setVit('folicAcid', v)} />
              <NumberField label="Vitamin B12 (µg)" value={draft.vitamins.vitB12} onChange={(v) => setVit('vitB12', v)} />
              <NumberField label="Vitamin C (mg)" value={draft.vitamins.vitC} onChange={(v) => setVit('vitC', v)} />
              <NumberField label="Vitamin D (µg)" value={draft.vitamins.vitD} onChange={(v) => setVit('vitD', v)} />
              <NumberField label="Vitamin E (mg)" value={draft.vitamins.vitE} onChange={(v) => setVit('vitE', v)} />
              <NumberField label="Vitamin K (µg)" value={draft.vitamins.vitK} onChange={(v) => setVit('vitK', v)} />
            </div>
          </Accordion>

          <Accordion open={openMinerals} onToggle={() => setOpenMinerals(o => !o)} title="Khoáng chất">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Canxi (mg)" value={draft.minerals.calcium} onChange={(v) => setMin('calcium', v)} />
              <NumberField label="Sắt (mg)" value={draft.minerals.iron} onChange={(v) => setMin('iron', v)} />
              <NumberField label="Magie (mg)" value={draft.minerals.magnesium} onChange={(v) => setMin('magnesium', v)} />
              <NumberField label="Photpho (mg)" value={draft.minerals.phosphorus} onChange={(v) => setMin('phosphorus', v)} />
              <NumberField label="Kali (mg)" value={draft.minerals.potassium} onChange={(v) => setMin('potassium', v)} />
              <NumberField label="Natri (mg)" value={draft.minerals.sodium} onChange={(v) => setMin('sodium', v)} />
              <NumberField label="Kẽm (mg)" value={draft.minerals.zinc} onChange={(v) => setMin('zinc', v)} />
              <NumberField label="Đồng (mg)" value={draft.minerals.copper} onChange={(v) => setMin('copper', v)} />
              <NumberField label="Mangan (mg)" value={draft.minerals.manganese} onChange={(v) => setMin('manganese', v)} />
              <NumberField label="Selen (µg)" value={draft.minerals.selenium} onChange={(v) => setMin('selenium', v)} />
              <NumberField label="I-ốt (µg)" value={draft.minerals.iodine} onChange={(v) => setMin('iodine', v)} />
            </div>
          </Accordion>

          <Accordion open={openSug} onToggle={() => setOpenSug(o => !o)} title="Đường chi tiết (g)">
            <p className="text-[11px] text-gray-500 mb-2">Tổng đường đã khai báo ở phần Macro. Đây là breakdown 6 loại đường đơn / đôi.</p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Galactoza" value={draft.sugars.galactose} onChange={(v) => setSug('galactose', v)} />
              <NumberField label="Maltoza" value={draft.sugars.maltose} onChange={(v) => setSug('maltose', v)} />
              <NumberField label="Lactoza" value={draft.sugars.lactose} onChange={(v) => setSug('lactose', v)} />
              <NumberField label="Fructoza" value={draft.sugars.fructose} onChange={(v) => setSug('fructose', v)} />
              <NumberField label="Glucoza" value={draft.sugars.glucose} onChange={(v) => setSug('glucose', v)} />
              <NumberField label="Sacaroza" value={draft.sugars.sucrose} onChange={(v) => setSug('sucrose', v)} />
            </div>
          </Accordion>

          <Accordion open={openFA} onToggle={() => setOpenFA(o => !o)} title="Axit béo Omega (tổng tham chiếu)">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Omega-3 (mg)" value={draft.fattyAcids.omega3} onChange={(v) => setFA('omega3', v)} />
              <NumberField label="Omega-6 (mg)" value={draft.fattyAcids.omega6} onChange={(v) => setFA('omega6', v)} />
            </div>
          </Accordion>

          <Accordion open={openSat} onToggle={() => setOpenSat(o => !o)} title="Acid béo no — chi tiết (mg)">
            <p className="text-[11px] text-gray-500 mb-2">Tổng "Bão hoà" đã khai báo ở phần Macro. Đây là breakdown từng acid.</p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Palmitic (C16:0)" value={draft.saturatedFA.palmitic} onChange={(v) => setSat('palmitic', v)} />
              <NumberField label="Margaric (C17:0)" value={draft.saturatedFA.margaric} onChange={(v) => setSat('margaric', v)} />
              <NumberField label="Stearic (C18:0)" value={draft.saturatedFA.stearic} onChange={(v) => setSat('stearic', v)} />
              <NumberField label="Arachidic (C20:0)" value={draft.saturatedFA.arachidic} onChange={(v) => setSat('arachidic', v)} />
              <NumberField label="Behenic (C22:0)" value={draft.saturatedFA.behenic} onChange={(v) => setSat('behenic', v)} />
              <NumberField label="Lignoceric (C24:0)" value={draft.saturatedFA.lignoceric} onChange={(v) => setSat('lignoceric', v)} />
            </div>
          </Accordion>

          <Accordion open={openMUFA} onToggle={() => setOpenMUFA(o => !o)} title="Acid béo không no — 1 nối đôi (mg)">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Myristoleic (C14:1)" value={draft.mufa.myristoleic} onChange={(v) => setMUFA('myristoleic', v)} />
              <NumberField label="Palmitoleic (C16:1)" value={draft.mufa.palmitoleic} onChange={(v) => setMUFA('palmitoleic', v)} />
              <NumberField label="Oleic (C18:1)" value={draft.mufa.oleic} onChange={(v) => setMUFA('oleic', v)} />
            </div>
          </Accordion>

          <Accordion open={openPUFA} onToggle={() => setOpenPUFA(o => !o)} title="Acid béo không no — nhiều nối đôi (mg)">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Linoleic (C18:2 n6)" value={draft.pufa.linoleic} onChange={(v) => setPUFA('linoleic', v)} />
              <NumberField label="Linolenic (C18:3 n3)" value={draft.pufa.linolenic} onChange={(v) => setPUFA('linolenic', v)} />
              <NumberField label="Arachidonic (C20:4)" value={draft.pufa.arachidonic} onChange={(v) => setPUFA('arachidonic', v)} />
              <NumberField label="EPA (C20:5 n3)" value={draft.pufa.epa} onChange={(v) => setPUFA('epa', v)} />
              <NumberField label="DHA (C22:6 n3)" value={draft.pufa.dha} onChange={(v) => setPUFA('dha', v)} />
            </div>
          </Accordion>

          <Accordion open={openSterol} onToggle={() => setOpenSterol(o => !o)} title="Sterol (mg)">
            <p className="text-[11px] text-gray-500 mb-2">Cholesterol đã khai báo ở phần Macro. Phytosterol là sterol thực vật.</p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Phytosterol" value={draft.sterols.phytosterol} onChange={(v) => setSterol('phytosterol', v)} />
            </div>
          </Accordion>

          <Accordion open={openIso} onToggle={() => setOpenIso(o => !o)} title="Isoflavon (mg)">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Tổng số isoflavon" value={draft.isoflavones.total} onChange={(v) => setIso('total', v)} />
              <NumberField label="Daidzein" value={draft.isoflavones.daidzein} onChange={(v) => setIso('daidzein', v)} />
              <NumberField label="Genistein" value={draft.isoflavones.genistein} onChange={(v) => setIso('genistein', v)} />
              <NumberField label="Glycitein" value={draft.isoflavones.glycitein} onChange={(v) => setIso('glycitein', v)} />
            </div>
          </Accordion>

          <Accordion open={openCar} onToggle={() => setOpenCar(o => !o)} title="Carotenoid (µg)">
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Beta-caroten" value={draft.carotenoids.betaCarotene} onChange={(v) => setCar('betaCarotene', v)} />
              <NumberField label="Alpha-caroten" value={draft.carotenoids.alphaCarotene} onChange={(v) => setCar('alphaCarotene', v)} />
              <NumberField label="Beta-cryptoxanthin" value={draft.carotenoids.betaCryptoxanthin} onChange={(v) => setCar('betaCryptoxanthin', v)} />
              <NumberField label="Lycopen" value={draft.carotenoids.lycopene} onChange={(v) => setCar('lycopene', v)} />
              <NumberField label="Lutein + Zeaxanthin" value={draft.carotenoids.luteinZeaxanthin} onChange={(v) => setCar('luteinZeaxanthin', v)} />
            </div>
          </Accordion>

          <Accordion open={openAA} onToggle={() => setOpenAA(o => !o)} title="Axit amin (mg)">
            <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-2">Thiết yếu</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <NumberField label="Histidine" value={draft.aminoAcids.histidine} onChange={(v) => setAA('histidine', v)} />
              <NumberField label="Isoleucine" value={draft.aminoAcids.isoleucine} onChange={(v) => setAA('isoleucine', v)} />
              <NumberField label="Leucine" value={draft.aminoAcids.leucine} onChange={(v) => setAA('leucine', v)} />
              <NumberField label="Lysine" value={draft.aminoAcids.lysine} onChange={(v) => setAA('lysine', v)} />
              <NumberField label="Methionine" value={draft.aminoAcids.methionine} onChange={(v) => setAA('methionine', v)} />
              <NumberField label="Phenylalanine" value={draft.aminoAcids.phenylalanine} onChange={(v) => setAA('phenylalanine', v)} />
              <NumberField label="Threonine" value={draft.aminoAcids.threonine} onChange={(v) => setAA('threonine', v)} />
              <NumberField label="Tryptophan" value={draft.aminoAcids.tryptophan} onChange={(v) => setAA('tryptophan', v)} />
              <NumberField label="Valine" value={draft.aminoAcids.valine} onChange={(v) => setAA('valine', v)} />
            </div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-2">Không thiết yếu / có điều kiện</p>
            <div className="grid grid-cols-3 gap-3">
              <NumberField label="Arginin" value={draft.aminoAcids.arginine} onChange={(v) => setAA('arginine', v)} />
              <NumberField label="Cystin" value={draft.aminoAcids.cystine} onChange={(v) => setAA('cystine', v)} />
              <NumberField label="Tyrosin" value={draft.aminoAcids.tyrosine} onChange={(v) => setAA('tyrosine', v)} />
              <NumberField label="Alanin" value={draft.aminoAcids.alanine} onChange={(v) => setAA('alanine', v)} />
              <NumberField label="Aspartic acid" value={draft.aminoAcids.asparticAcid} onChange={(v) => setAA('asparticAcid', v)} />
              <NumberField label="Glutamic acid" value={draft.aminoAcids.glutamicAcid} onChange={(v) => setAA('glutamicAcid', v)} />
              <NumberField label="Glycin" value={draft.aminoAcids.glycine} onChange={(v) => setAA('glycine', v)} />
              <NumberField label="Prolin" value={draft.aminoAcids.proline} onChange={(v) => setAA('proline', v)} />
              <NumberField label="Serin" value={draft.aminoAcids.serine} onChange={(v) => setAA('serine', v)} />
            </div>
          </Accordion>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
            {draft.id ? 'Lưu thay đổi' : 'Thêm vào CSDL'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Form primitives ---------- */
function Accordion({ open, onToggle, title, required, children }: {
  open: boolean; onToggle: () => void; title: string; required?: boolean; children: ReactNode;
}) {
  return (
    <section className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3 py-2.5 bg-gray-50 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium text-gray-800"
      >
        {open ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
        <span>{title}</span>
        {required && <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Bắt buộc</span>}
      </button>
      {open && <div className="p-3">{children}</div>}
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
      </select>
    </label>
  );
}

function ConfirmDeleteModal({ food, onClose, onConfirm }: { food: Food; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-red-100 text-red-600">
            <Trash2 size={22} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Xoá vĩnh viễn thực phẩm?</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Bạn sắp xoá <span className="font-medium text-gray-800">"{food.name}"</span> ({food.id}) cùng toàn bộ hồ sơ vi chất đi kèm. Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700">
            Xoá vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}
