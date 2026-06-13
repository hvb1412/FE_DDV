import { useState } from 'react';
import {
  CheckCircle, XCircle, Eye, ChevronDown, ChevronUp,
  Clock, User, Utensils, Filter, Search, MessageSquare,
  ThumbsUp, ThumbsDown, AlertCircle, Flame, Leaf
} from 'lucide-react';
import { toast } from 'sonner';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface Meal {
  name: string;
  calories: number;
  items: string[];
}

interface DayMenu {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

interface MenuPlan {
  id: number;
  patientName: string;
  patientId: string;
  diagnosis: string;
  goal: string;
  totalCalories: number;
  duration: string;
  generatedAt: string;
  status: ApprovalStatus;
  rejectReason?: string;
  days: DayMenu[];
}

const menuPlans: MenuPlan[] = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    patientId: 'BN001',
    diagnosis: 'Tiểu đường type 2',
    goal: 'Kiểm soát đường huyết, giảm cân',
    totalCalories: 1800,
    duration: '4 tuần',
    generatedAt: '08/05/2026, 07:30',
    status: 'pending',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 350, items: ['Cháo yến mạch không đường (200g)', 'Trứng luộc (1 quả)', 'Sữa tách béo (200ml)'] },
        lunch: { name: 'Bữa trưa', calories: 550, items: ['Cơm gạo lứt (100g)', 'Cá hấp gừng (150g)', 'Rau muống xào tỏi (200g)', 'Canh rau ngót'] },
        dinner: { name: 'Bữa tối', calories: 500, items: ['Bún gạo lứt (80g)', 'Ức gà luộc (120g)', 'Salad rau trộn dầu oliu', 'Canh bí đỏ'] },
        snack: { name: 'Bữa phụ', calories: 200, items: ['Táo (1 quả)', 'Hạt óc chó (20g)'] },
      },
      {
        day: 'Thứ 3',
        breakfast: { name: 'Bữa sáng', calories: 320, items: ['Bánh mì đen (2 lát)', 'Pho mát ít béo (30g)', 'Dưa chuột thái lát', 'Trà xanh không đường'] },
        lunch: { name: 'Bữa trưa', calories: 560, items: ['Cơm gạo lứt (100g)', 'Đậu phụ sốt cà chua (150g)', 'Bắp cải xào (200g)', 'Canh mướp'] },
        dinner: { name: 'Bữa tối', calories: 490, items: ['Khoai lang hấp (120g)', 'Tôm luộc (100g)', 'Rau xà lách trộn', 'Canh cải xanh'] },
        snack: { name: 'Bữa phụ', calories: 180, items: ['Cam (1 quả)', 'Sữa chua không đường (100g)'] },
      },
    ],
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    patientId: 'BN002',
    diagnosis: 'Tăng huyết áp',
    goal: 'Giảm natri, tăng kali, kiểm soát cân nặng',
    totalCalories: 1600,
    duration: '4 tuần',
    generatedAt: '08/05/2026, 07:31',
    status: 'pending',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 300, items: ['Yến mạch nấu sữa ít béo (150g)', 'Chuối tiêu (1 quả)', 'Trà hoa cúc'] },
        lunch: { name: 'Bữa trưa', calories: 500, items: ['Cơm trắng ít (80g)', 'Cá thu kho nghệ không muối (120g)', 'Rau dền xào tỏi (200g)', 'Canh rau ngót thịt nạc'] },
        dinner: { name: 'Bữa tối', calories: 450, items: ['Khoai tây luộc (150g)', 'Ức gà nướng không muối (100g)', 'Salad cà chua dưa leo', 'Nước lọc'] },
        snack: { name: 'Bữa phụ', calories: 170, items: ['Nho tươi (100g)', 'Hạnh nhân (15g)'] },
      },
    ],
  },
  {
    id: 3,
    patientName: 'Lê Văn C',
    patientId: 'BN003',
    diagnosis: 'Cholesterol cao',
    goal: 'Giảm LDL, tăng HDL, giảm chất béo bão hòa',
    totalCalories: 1900,
    duration: '4 tuần',
    generatedAt: '08/05/2026, 07:32',
    status: 'pending',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 380, items: ['Granola không đường (60g)', 'Sữa hạt hạnh nhân (250ml)', 'Dâu tây tươi (100g)'] },
        lunch: { name: 'Bữa trưa', calories: 580, items: ['Cơm gạo lứt (110g)', 'Cá hồi áp chảo dầu oliu (130g)', 'Bông cải xanh hấp (200g)', 'Canh nấm kim châm'] },
        dinner: { name: 'Bữa tối', calories: 520, items: ['Mì soba (80g)', 'Đậu đen nấu mềm (100g)', 'Rau spinach xào tỏi', 'Canh bắp bò'] },
        snack: { name: 'Bữa phụ', calories: 200, items: ['Bơ (1/2 quả)', 'Bánh gạo lứt (2 cái)'] },
      },
    ],
  },
  {
    id: 4,
    patientName: 'Phạm Thị D',
    patientId: 'BN004',
    diagnosis: 'Béo phì độ I',
    goal: 'Giảm cân an toàn 0.5kg/tuần',
    totalCalories: 1400,
    duration: '8 tuần',
    generatedAt: '08/05/2026, 07:33',
    status: 'pending',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 250, items: ['Trứng bác rau (2 trứng)', 'Bánh mì nguyên cám (1 lát)', 'Nước cam ép (150ml)'] },
        lunch: { name: 'Bữa trưa', calories: 450, items: ['Cơm gạo lứt (80g)', 'Ức gà luộc sả (120g)', 'Đậu cove xào (150g)', 'Canh cà rốt'] },
        dinner: { name: 'Bữa tối', calories: 400, items: ['Súp rau củ thanh đạm (300ml)', 'Bánh mì đen (1 lát)', 'Salad quinoa trộn rau'] },
        snack: { name: 'Bữa phụ', calories: 150, items: ['Sữa chua ít béo (100g)', 'Kiwi (1 quả)'] },
      },
    ],
  },
  {
    id: 5,
    patientName: 'Hoàng Văn E',
    patientId: 'BN005',
    diagnosis: 'Thiếu máu',
    goal: 'Tăng hấp thu sắt và vitamin B12',
    totalCalories: 2100,
    duration: '6 tuần',
    generatedAt: '07/05/2026, 15:00',
    status: 'approved',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 420, items: ['Gan bò xào hành (80g)', 'Cơm trắng (100g)', 'Nước cam ép (200ml)'] },
        lunch: { name: 'Bữa trưa', calories: 640, items: ['Cơm trắng (130g)', 'Thịt bò xào rau muống (150g)', 'Đậu phụ huyết (100g)', 'Canh cải bó xôi'] },
        dinner: { name: 'Bữa tối', calories: 580, items: ['Cơm trắng (100g)', 'Cá ngừ kho (120g)', 'Rau dền luộc (200g)', 'Canh nấu huyết'] },
        snack: { name: 'Bữa phụ', calories: 230, items: ['Hạt bí rang (30g)', 'Sữa tươi (200ml)', 'Mận (2 quả)'] },
      },
    ],
  },
  {
    id: 6,
    patientName: 'Vũ Thị F',
    patientId: 'BN006',
    diagnosis: 'Loãng xương',
    goal: 'Tăng canxi và vitamin D',
    totalCalories: 1750,
    duration: '4 tuần',
    generatedAt: '06/05/2026, 10:00',
    status: 'rejected',
    rejectReason: 'Bệnh nhân dị ứng sữa bò. Cần thay thế bằng các nguồn canxi không từ sữa (đậu nành, cải xanh, cá mòi).',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 350, items: ['Sữa tươi (300ml)', 'Ngũ cốc nguyên hạt (60g)', 'Chuối (1 quả)'] },
        lunch: { name: 'Bữa trưa', calories: 530, items: ['Cơm trắng (100g)', 'Cá hồi nướng (150g)', 'Bông cải xanh luộc (200g)', 'Sữa chua (100g)'] },
        dinner: { name: 'Bữa tối', calories: 490, items: ['Cơm trắng (90g)', 'Tôm hấp sả (120g)', 'Rau dền xào (150g)', 'Sữa ấm trước ngủ'] },
        snack: { name: 'Bữa phụ', calories: 200, items: ['Phô mai (30g)', 'Bánh quy nguyên cám (3 cái)'] },
      },
    ],
  },
  {
    id: 7,
    patientName: 'Bùi Thị H',
    patientId: 'BN007',
    diagnosis: 'Gout',
    goal: 'Giảm axit uric, hạn chế purin',
    totalCalories: 1700,
    duration: '4 tuần',
    generatedAt: '06/05/2026, 10:05',
    status: 'approved',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 330, items: ['Cháo trắng (200g)', 'Trứng gà luộc (1 quả)', 'Dưa gang (100g)'] },
        lunch: { name: 'Bữa trưa', calories: 520, items: ['Cơm gạo tẻ (100g)', 'Ức gà luộc (100g)', 'Dưa leo xào (150g)', 'Canh bầu'] },
        dinner: { name: 'Bữa tối', calories: 470, items: ['Miến dong (80g)', 'Đậu phụ hấp (150g)', 'Cải thảo luộc (200g)', 'Nước lọc'] },
        snack: { name: 'Bữa phụ', calories: 180, items: ['Cherry (150g)', 'Sữa ít béo (150ml)'] },
      },
    ],
  },
  {
    id: 8,
    patientName: 'Đặng Văn I',
    patientId: 'BN008',
    diagnosis: 'Suy dinh dưỡng',
    goal: 'Tăng cân, bổ sung dinh dưỡng toàn diện',
    totalCalories: 2500,
    duration: '6 tuần',
    generatedAt: '05/05/2026, 08:00',
    status: 'pending',
    days: [
      {
        day: 'Thứ 2',
        breakfast: { name: 'Bữa sáng', calories: 500, items: ['Phở bò (1 tô lớn)', 'Trứng cút (4 quả)', 'Sữa nguyên kem (200ml)'] },
        lunch: { name: 'Bữa trưa', calories: 750, items: ['Cơm trắng (150g)', 'Thịt kho tàu (150g)', 'Rau cải luộc (200g)', 'Canh chua cá', 'Tráng miệng: chuối'] },
        dinner: { name: 'Bữa tối', calories: 680, items: ['Cơm chiên trứng (150g)', 'Gà rán (1 đùi)', 'Salad rau', 'Sữa chua (200g)'] },
        snack: { name: 'Bữa phụ', calories: 380, items: ['Sinh tố bơ (250ml)', 'Bánh mì bơ (2 lát)', 'Hạt điều (30g)'] },
      },
    ],
  },
];

const statusConfig: Record<ApprovalStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Chờ duyệt', color: 'text-orange-700', bg: 'bg-orange-100', icon: Clock },
  approved: { label: 'Đã duyệt', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Từ chối', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
};

export function DoctorMenuApproval() {
  const [menus, setMenus] = useState<MenuPlan[]>(menuPlans);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | ApprovalStatus>('all');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const approve = (id: number) => {
    const prevStatus = menus.find(m => m.id === id)?.status ?? 'pending';
    setMenus(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    toast.success('Đã phê duyệt thực đơn và gửi đến bệnh nhân', {
      description: 'Bạn có 5 giây để hoàn tác hành động này.',
      duration: 5000,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          setMenus(prev => prev.map(m => m.id === id ? { ...m, status: prevStatus } : m));
          toast.message('Đã hoàn tác phê duyệt');
        },
      },
    });
  };

  const openReject = (id: number) => {
    setRejectModal({ open: true, id });
    setRejectReason('');
  };

  const confirmReject = () => {
    if (!rejectModal.id) return;
    const id = rejectModal.id;
    const prev = menus.find(m => m.id === id);
    setMenus(p => p.map(m => m.id === id ? { ...m, status: 'rejected', rejectReason } : m));
    setRejectModal({ open: false, id: null });
    toast.error('Đã từ chối thực đơn', {
      description: 'Hệ thống sẽ tạo lại theo góp ý của bạn.',
      duration: 5000,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          setMenus(p => p.map(m => m.id === id ? { ...m, status: prev?.status ?? 'pending', rejectReason: prev?.rejectReason } : m));
          toast.message('Đã hoàn tác từ chối');
        },
      },
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const filtered = menus.filter(m => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchSearch = m.patientName.toLowerCase().includes(search.toLowerCase()) ||
      m.patientId.toLowerCase().includes(search.toLowerCase()) ||
      m.diagnosis.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: menus.length,
    pending: menus.filter(m => m.status === 'pending').length,
    approved: menus.filter(m => m.status === 'approved').length,
    rejected: menus.filter(m => m.status === 'rejected').length,
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Phê duyệt thực đơn</h1>
            <p className="text-gray-500 mt-1">Xem xét và phê duyệt thực đơn tự động được tạo bởi hệ thống AI</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-700">{counts.pending} thực đơn chờ duyệt</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng thực đơn', value: counts.all, color: 'text-gray-900', bg: 'bg-white', border: 'border-gray-200' },
            { label: 'Chờ phê duyệt', value: counts.pending, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
            { label: 'Đã phê duyệt', value: counts.approved, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'Đã từ chối', value: counts.rejected, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-4 shadow-sm`}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân, chẩn đoán..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300 w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === s
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Tất cả' : statusConfig[s].label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filterStatus === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
              <Utensils size={44} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">Không tìm thấy thực đơn nào</p>
            </div>
          ) : (
            filtered.map(menu => {
              const isExpanded = expandedId === menu.id;
              const sc = statusConfig[menu.status];
              const StatusIcon = sc.icon;

              return (
                <div key={menu.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  menu.status === 'pending' ? 'border-orange-200' :
                  menu.status === 'approved' ? 'border-green-200' : 'border-red-200'
                }`}>
                  {/* Card header */}
                  <div className="p-5 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-green-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{menu.patientName}</span>
                        <span className="text-xs text-gray-400">{menu.patientId}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                          <StatusIcon size={11} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-sm text-gray-500">{menu.diagnosis}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Leaf size={12} className="text-green-500" />
                          {menu.goal}
                        </span>
                      </div>
                    </div>

                    {/* Right: meta + actions */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right hidden md:block">
                        <div className="flex items-center gap-1 justify-end">
                          <Flame size={14} className="text-orange-400" />
                          <span className="text-sm font-semibold text-gray-800">{menu.totalCalories} kcal/ngày</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Thời gian: {menu.duration}</p>
                        <p className="text-xs text-gray-400">Tạo lúc: {menu.generatedAt}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {menu.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approve(menu.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                            >
                              <ThumbsUp size={14} />
                              Duyệt
                            </button>
                            <button
                              onClick={() => openReject(menu.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors"
                            >
                              <ThumbsDown size={14} />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => toggleExpand(menu.id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={14} />
                          {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reject reason */}
                  {menu.status === 'rejected' && menu.rejectReason && (
                    <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                      <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-0.5">Lý do từ chối:</p>
                        <p className="text-xs text-red-600">{menu.rejectReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Expanded: daily menus */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50">
                      <div className="flex items-center gap-2 mb-4">
                        <Utensils size={16} className="text-green-600" />
                        <h3 className="text-sm font-semibold text-gray-800">Chi tiết thực đơn mẫu</h3>
                        <span className="text-xs text-gray-400">({menu.days.length} ngày mẫu)</span>
                      </div>
                      <div className="space-y-4">
                        {menu.days.map((day, di) => (
                          <div key={di} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-2 bg-green-600 text-white">
                              <span className="text-sm font-semibold">{day.day}</span>
                              <span className="ml-3 text-xs text-green-200">
                                Tổng: {day.breakfast.calories + day.lunch.calories + day.dinner.calories + day.snack.calories} kcal
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                              {[day.breakfast, day.lunch, day.dinner, day.snack].map((meal, mi) => (
                                <div key={mi} className="p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-700">{meal.name}</span>
                                    <span className="text-xs text-orange-500 font-medium">{meal.calories} kcal</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {meal.items.map((item, ii) => (
                                      <li key={ii} className="text-xs text-gray-500 flex gap-1">
                                        <span className="text-green-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Goal info */}
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-800 mb-1">Mục tiêu điều trị:</p>
                        <p className="text-xs text-green-700">{menu.goal}</p>
                      </div>

                      {/* Action buttons at bottom when expanded */}
                      {menu.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => { approve(menu.id); setExpandedId(null); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle size={16} />
                            Phê duyệt thực đơn này
                          </button>
                          <button
                            onClick={() => openReject(menu.id)}
                            className="flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                          >
                            <XCircle size={16} />
                            Từ chối & yêu cầu tạo lại
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setRejectModal({ open: false, id: null })}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-5 border-b border-gray-200">
              <div className="p-2 bg-red-100 rounded-lg"><XCircle size={18} className="text-red-600" /></div>
              <h2 className="text-lg font-semibold text-gray-900">Từ chối thực đơn</h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">Vui lòng cung cấp lý do từ chối để hệ thống tạo lại thực đơn phù hợp hơn.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Bệnh nhân dị ứng với hải sản, cần thay thế bằng thịt trắng..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Gợi ý lý do thường gặp:</p>
                {[
                  'Bệnh nhân có dị ứng thực phẩm chưa được ghi nhận',
                  'Lượng calo chưa phù hợp với tình trạng bệnh',
                  'Cần điều chỉnh theo sở thích ẩm thực của bệnh nhân',
                  'Thực đơn có nguyên liệu khó tìm hoặc đắt tiền',
                ].map((hint, i) => (
                  <button
                    key={i}
                    onClick={() => setRejectReason(hint)}
                    className="block w-full text-left text-xs text-gray-600 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setRejectModal({ open: false, id: null })} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
