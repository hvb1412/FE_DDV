import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Search, Filter, UserPlus, Eye, MessageSquare, Download,
  Users, TrendingUp, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Pagination } from '@/app/shared/components/Pagination';

interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  diagnosis: string;
  progress: 'stable' | 'improving' | 'needs-attention';
  lastVisit: string;
  phone: string;
  nextAppointment?: string;
}

const allPatients: Patient[] = [
  { id: 'BN001', name: 'Nguyễn Văn A', gender: 'Nam', age: 45, diagnosis: 'Tiểu đường type 2', progress: 'improving', lastVisit: '05/05/2026', phone: '0912 345 678', nextAppointment: '12/05/2026' },
  { id: 'BN002', name: 'Trần Thị B', gender: 'Nữ', age: 38, diagnosis: 'Tăng huyết áp', progress: 'stable', lastVisit: '04/05/2026', phone: '0987 654 321', nextAppointment: '11/05/2026' },
  { id: 'BN003', name: 'Lê Văn C', gender: 'Nam', age: 52, diagnosis: 'Cholesterol cao', progress: 'needs-attention', lastVisit: '01/05/2026', phone: '0933 111 222' },
  { id: 'BN004', name: 'Phạm Thị D', gender: 'Nữ', age: 29, diagnosis: 'Béo phì', progress: 'improving', lastVisit: '03/05/2026', phone: '0911 222 333', nextAppointment: '10/05/2026' },
  { id: 'BN005', name: 'Hoàng Văn E', gender: 'Nam', age: 61, diagnosis: 'Tim mạch', progress: 'stable', lastVisit: '02/05/2026', phone: '0944 555 666' },
  { id: 'BN006', name: 'Vũ Thị F', gender: 'Nữ', age: 34, diagnosis: 'Thiếu máu', progress: 'improving', lastVisit: '06/05/2026', phone: '0955 777 888', nextAppointment: '13/05/2026' },
  { id: 'BN007', name: 'Đặng Văn G', gender: 'Nam', age: 48, diagnosis: 'Gout', progress: 'needs-attention', lastVisit: '28/04/2026', phone: '0966 999 000' },
  { id: 'BN008', name: 'Bùi Thị H', gender: 'Nữ', age: 55, diagnosis: 'Loãng xương', progress: 'stable', lastVisit: '07/05/2026', phone: '0977 123 456', nextAppointment: '14/05/2026' },
  { id: 'BN009', name: 'Ngô Văn I', gender: 'Nam', age: 40, diagnosis: 'Tiểu đường type 2', progress: 'improving', lastVisit: '06/05/2026', phone: '0988 234 567' },
  { id: 'BN010', name: 'Dương Thị K', gender: 'Nữ', age: 27, diagnosis: 'Suy dinh dưỡng', progress: 'needs-attention', lastVisit: '30/04/2026', phone: '0999 345 678', nextAppointment: '09/05/2026' },
  { id: 'BN011', name: 'Lý Văn L', gender: 'Nam', age: 65, diagnosis: 'Thận mãn tính', progress: 'stable', lastVisit: '05/05/2026', phone: '0900 456 789' },
  { id: 'BN012', name: 'Cao Thị M', gender: 'Nữ', age: 43, diagnosis: 'Tăng huyết áp', progress: 'improving', lastVisit: '04/05/2026', phone: '0901 567 890', nextAppointment: '15/05/2026' },
];

const PAGE_SIZE = 8;

const progressConfig = {
  stable: { label: 'Ổn định', className: 'bg-green-100 text-green-700', icon: CheckCircle, iconColor: 'text-green-500' },
  improving: { label: 'Tiến triển tốt', className: 'bg-emerald-100 text-emerald-700', icon: TrendingUp, iconColor: 'text-emerald-500' },
  'needs-attention': { label: 'Cần theo dõi', className: 'bg-orange-100 text-orange-700', icon: AlertTriangle, iconColor: 'text-orange-500' },
};

export function DoctorPatientList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterProgress, setFilterProgress] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = allPatients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchProgress = filterProgress === 'all' || p.progress === filterProgress;
    const matchGender = filterGender === 'all' || p.gender === filterGender;
    return matchSearch && matchProgress && matchGender;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    total: allPatients.length,
    improving: allPatients.filter((p) => p.progress === 'improving').length,
    stable: allPatients.filter((p) => p.progress === 'stable').length,
    needsAttention: allPatients.filter((p) => p.progress === 'needs-attention').length,
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: 'progress' | 'gender', val: string) => {
    if (type === 'progress') setFilterProgress(val);
    else setFilterGender(val);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách bệnh nhân</h1>
            <p className="text-gray-500 mt-1">Quản lý và theo dõi toàn bộ bệnh nhân của bạn</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Thêm bệnh nhân mới
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-green-50 rounded-lg"><Users size={20} className="text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Tổng bệnh nhân</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp size={20} className="text-emerald-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Tiến triển tốt</p>
              <p className="text-xl font-bold text-emerald-600">{stats.improving}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle size={20} className="text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Ổn định</p>
              <p className="text-xl font-bold text-green-600">{stats.stable}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-orange-50 rounded-lg"><AlertTriangle size={20} className="text-orange-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Cần theo dõi</p>
              <p className="text-xl font-bold text-orange-600">{stats.needsAttention}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Search & Filters */}
          <div className="p-5 border-b border-gray-200 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, ID hoặc chẩn đoán..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterProgress}
                onChange={(e) => handleFilterChange('progress', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              >
                <option value="all">Tất cả tiến triển</option>
                <option value="improving">Tiến triển tốt</option>
                <option value="stable">Ổn định</option>
                <option value="needs-attention">Cần theo dõi</option>
              </select>
              <select
                value={filterGender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              >
                <option value="all">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <span className="ml-auto text-sm text-gray-500">{filtered.length} bệnh nhân</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính / Tuổi</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chẩn đoán</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến triển</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần khám cuối</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lịch hẹn tới</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                      <Users size={40} className="mx-auto mb-2 opacity-30" />
                      <p>Không tìm thấy bệnh nhân nào</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((patient) => {
                    const cfg = progressConfig[patient.progress];
                    const ProgressIcon = cfg.icon;
                    return (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{patient.id}</span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-green-600 text-xs font-semibold">
                                {patient.name.split(' ').slice(-1)[0][0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                              <p className="text-xs text-gray-400">{patient.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.gender} · {patient.age} tuổi
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{patient.diagnosis}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}>
                            <ProgressIcon size={12} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                          {patient.nextAppointment ? (
                            <span className="text-green-600 font-medium">{patient.nextAppointment}</span>
                          ) : (
                            <span className="text-gray-400">Chưa đặt lịch</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/patient/${patient.id}`}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Xem hồ sơ"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => navigate(`/chat?name=${encodeURIComponent(patient.name)}`)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Nhắn tin"
                            >
                              <MessageSquare size={15} />
                            </button>
                            <button
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Xuất thực đơn"
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} bệnh nhân
              </p>
              <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thêm bệnh nhân mới</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" placeholder="Nhập họ và tên..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi</label>
                  <input type="number" placeholder="Tuổi" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
                    <option>Nam</option>
                    <option>Nữ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" placeholder="0xxx xxx xxx" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán</label>
                <input type="text" placeholder="Nhập chẩn đoán..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Thêm bệnh nhân
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}