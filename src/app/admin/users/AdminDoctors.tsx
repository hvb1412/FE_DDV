import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Search, Eye, Pencil, Stethoscope, FileText, GraduationCap, Award, X, Plus, Lock, Unlock, Star, Trash2, Mail, Phone, ChevronDown, Check,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '@/app/shared/components/Pagination';

type DoctorStatus = 'active' | 'inactive';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  license: string;
  degree: string;
  bio: string;
  patients: number;
  rating: number;
  status: DoctorStatus;
  joinedAt: string;
  username: string;
};

const seed: Doctor[] = [
  { id: 'D001', name: 'BS. Trần Thị A', specialty: 'Dinh dưỡng lâm sàng', email: 'tran.thi.a@dinhduong.vn', phone: '0901 234 567', license: 'GPHN-2019-1024', degree: 'BS. ĐH Y Hà Nội (2015)',     bio: '8 năm kinh nghiệm, chuyên đái tháo đường và rối loạn chuyển hoá.', patients: 64, rating: 4.9, status: 'active',   joinedAt: '10/01/2026', username: 'tran.thi.a' },
  { id: 'D002', name: 'BS. Hoàng Văn E', specialty: 'Tim mạch',             email: 'hoang.e@dinhduong.vn',   phone: '0902 345 678', license: 'GPHN-2018-0810', degree: 'BS. ĐH Y Dược TPHCM (2014)', bio: 'Chuyên khoa tim mạch và tăng huyết áp.',                          patients: 48, rating: 4.7, status: 'active',   joinedAt: '21/02/2026', username: 'hoang.e' },
  { id: 'D003', name: 'BS. Phạm Thị F',  specialty: 'Nhi khoa',             email: 'pham.f@dinhduong.vn',    phone: '0903 456 789', license: 'GPHN-2021-0455', degree: 'BS. ĐH Y Hà Nội (2020)',     bio: 'Mới gia nhập phòng khám, phụ trách bệnh nhân nhi.',               patients: 12, rating: 4.6, status: 'active',   joinedAt: '03/05/2026', username: 'pham.f' },
  { id: 'D004', name: 'BS. Lê Văn G',    specialty: 'Lão khoa',             email: 'le.g@dinhduong.vn',      phone: '0904 567 890', license: 'GPHN-2016-2233', degree: 'BS. ĐH Y Hà Nội (2010)',     bio: 'Chăm sóc dinh dưỡng người cao tuổi.',                             patients: 32, rating: 4.5, status: 'active',   joinedAt: '15/03/2026', username: 'le.g' },
  { id: 'D005', name: 'BS. Vũ Thị H',    specialty: 'Sản khoa',             email: 'vu.h@dinhduong.vn',      phone: '0905 678 901', license: 'GPHN-2022-1100', degree: 'BS. ĐH Y Huế (2021)',        bio: 'Đang tạm nghỉ thai sản.',                                         patients: 0,  rating: 0,   status: 'inactive', joinedAt: '28/04/2026', username: 'vu.h' },
  { id: 'D006', name: 'BS. Đặng Văn I',  specialty: 'Tiêu hoá',             email: 'dang.i@dinhduong.vn',    phone: '0906 789 012', license: 'GPHN-2017-7788', degree: 'BS. ĐH Y Dược TPHCM (2012)', bio: 'Chuyên dinh dưỡng cho bệnh tiêu hoá.',                            patients: 22, rating: 4.6, status: 'active',   joinedAt: '04/04/2026', username: 'dang.i' },
];

const PAGE_SIZE = 8;
const SPECIALTIES = ['Dinh dưỡng lâm sàng', 'Dinh dưỡng cộng đồng', 'Tim mạch', 'Nội tiết', 'Nhi khoa', 'Lão khoa', 'Sản khoa', 'Tiêu hoá', 'Cơ xương khớp'];

const statusBadge: Record<DoctorStatus, { label: string; cls: string }> = {
  active:   { label: 'Đang hoạt động', cls: 'bg-green-100 text-green-700' },
  inactive: { label: 'Tạm khoá',       cls: 'bg-gray-100 text-gray-600' },
};

const initials = (name: string) =>
  name.replace(/^BS\.\s*/, '').split(' ').slice(-2).map(s => s[0]).join('').toUpperCase();

const todayStr = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export function AdminDoctors() {
  const [rows, setRows] = useState<Doctor[]>(seed);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DoctorStatus>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<'all' | string>('all');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: 'toggle' | 'delete'; doctor: Doctor } | null>(null);

  const filtered = useMemo(() => rows.filter(r => {
    const s = search.toLowerCase();
    const match = !s || r.name.toLowerCase().includes(s) || r.specialty.toLowerCase().includes(s) || r.id.toLowerCase().includes(s) || r.email.toLowerCase().includes(s);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSpec = specialtyFilter === 'all' || r.specialty === specialtyFilter;
    return match && matchStatus && matchSpec;
  }), [rows, search, statusFilter, specialtyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => ({
    total:    rows.length,
    active:   rows.filter(r => r.status === 'active').length,
    inactive: rows.filter(r => r.status === 'inactive').length,
    patients: rows.reduce((sum, r) => sum + r.patients, 0),
  }), [rows]);

  const addDoctor = (d: Omit<Doctor, 'id' | 'joinedAt' | 'patients' | 'rating' | 'status'>) => {
    const newId = `D${String(rows.length + 1).padStart(3, '0')}`;
    const next: Doctor = { ...d, id: newId, joinedAt: todayStr(), patients: 0, rating: 0, status: 'active' };
    setRows(rs => [next, ...rs]);
    toast.success(`Đã cấp tài khoản cho ${next.name}`, {
      description: `Username: ${next.username} • Mật khẩu tạm đã gửi tới ${next.email}`,
    });
    setCreating(false);
  };

  const saveEdit = (next: Doctor) => {
    setRows(rs => rs.map(r => r.id === next.id ? next : r));
    toast.success(`Đã cập nhật hồ sơ ${next.name}`);
    setEditing(null);
  };

  const toggleStatus = (d: Doctor) => {
    setRows(rs => rs.map(r => r.id === d.id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r));
    toast.success(d.status === 'active' ? `Đã tạm khoá tài khoản ${d.name}` : `Đã kích hoạt lại ${d.name}`);
    setConfirm(null);
  };

  const removeDoctor = (d: Doctor) => {
    setRows(rs => rs.filter(r => r.id !== d.id));
    toast.success(`Đã xoá ${d.name} khỏi hệ thống`);
    setConfirm(null);
    setViewing(null);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bác sĩ</h1>
            <p className="text-sm text-gray-500 mt-1">Admin cấp tài khoản trực tiếp cho bác sĩ của phòng khám. Mọi bác sĩ tại đây đều đã được xác minh hồ sơ ngoài hệ thống.</p>
          </div>
          <button onClick={() => setCreating(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-2 shadow-sm hover:opacity-95">
            <Plus size={16} /> Thêm bác sĩ mới
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <SummaryCard label="Tổng bác sĩ" value={counts.total} tone="slate" icon={Stethoscope} />
          <SummaryCard label="Đang hoạt động" value={counts.active} tone="green" icon={Stethoscope}
            onClick={() => { setStatusFilter('active'); setPage(1); }} />
          <SummaryCard label="Tạm khoá" value={counts.inactive} tone="gray" icon={Lock}
            onClick={() => { setStatusFilter('inactive'); setPage(1); }} />
          <SummaryCard label="Tổng bệnh nhân được phụ trách" value={counts.patients} tone="emerald" icon={Award} />
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm theo tên, email hoặc chuyên khoa..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
            <select
              value={specialtyFilter}
              onChange={(e) => { setSpecialtyFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="all">Tất cả chuyên khoa</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm khoá</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Không tìm thấy bác sĩ</h3>
              <p className="text-sm text-gray-500 mt-1">Thử thay đổi bộ lọc hoặc thêm bác sĩ mới.</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3">Họ tên</th>
                    <th className="px-4 py-3">Chuyên khoa</th>
                    <th className="px-4 py-3">Liên hệ</th>
                    <th className="px-4 py-3">Bệnh nhân</th>
                    <th className="px-4 py-3">Đánh giá</th>
                    <th className="px-4 py-3">Ngày cấp tài khoản</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                            {initials(r.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.name}</p>
                            <p className="text-xs text-gray-500">{r.id} · @{r.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.specialty}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p className="flex items-center gap-1"><Mail size={11} className="text-gray-400" /> {r.email}</p>
                        <p className="flex items-center gap-1 mt-0.5"><Phone size={11} className="text-gray-400" /> {r.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.patients}</td>
                      <td className="px-4 py-3">
                        {r.rating > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            {r.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Chưa có</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.joinedAt}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[r.status].cls}`}>
                          {statusBadge[r.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewing(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Xem chi tiết">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setEditing(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="Chỉnh sửa">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setConfirm({ kind: 'toggle', doctor: r })} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={r.status === 'active' ? 'Tạm khoá' : 'Kích hoạt'}>
                            {r.status === 'active' ? <Lock size={15} /> : <Unlock size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
                <p className="text-gray-500">
                  Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trên {filtered.length}
                </p>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>

      {viewing && (
        <DoctorDetailModal
          doctor={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
          onToggleStatus={() => setConfirm({ kind: 'toggle', doctor: viewing })}
          onDelete={() => setConfirm({ kind: 'delete', doctor: viewing })}
        />
      )}
      {editing && <DoctorEditModal row={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}
      {creating && <DoctorCreateModal existingUsernames={rows.map(r => r.username)} onClose={() => setCreating(false)} onCreate={addDoctor} />}
      {confirm && (
        <ConfirmModal
          confirm={confirm}
          onCancel={() => setConfirm(null)}
          onToggle={toggleStatus}
          onDelete={removeDoctor}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, tone, icon: Icon, onClick }: {
  label: string; value: number; tone: 'amber' | 'green' | 'red' | 'slate' | 'gray' | 'emerald'; icon: LucideIcon; onClick?: () => void;
}) {
  const toneCls = {
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    green:   'bg-green-50 text-green-700 border-green-200',
    red:     'bg-red-50 text-red-700 border-red-200',
    slate:   'bg-slate-50 text-slate-700 border-slate-200',
    gray:    'bg-gray-50 text-gray-700 border-gray-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[tone];
  const C = onClick ? 'button' : 'div';
  return (
    <C onClick={onClick} className={`text-left p-4 rounded-xl border bg-white shadow-sm transition flex items-center gap-4 ${onClick ? 'hover:shadow cursor-pointer' : ''}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${toneCls}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </C>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        <Icon size={12} /> {label}
      </div>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function DoctorDetailModal({ doctor, onClose, onEdit, onToggleStatus, onDelete }: {
  doctor: Doctor; onClose: () => void; onEdit: () => void; onToggleStatus: () => void; onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">
              {initials(doctor.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-xs text-gray-500">{doctor.id} · @{doctor.username}</p>
            </div>
          </div>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[doctor.status].cls}`}>
            {statusBadge[doctor.status].label}
          </span>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock icon={Stethoscope} label="Chuyên khoa" value={doctor.specialty} />
            <InfoBlock icon={Award} label="Chứng chỉ hành nghề" value={doctor.license} />
            <InfoBlock icon={GraduationCap} label="Bằng cấp" value={doctor.degree} />
            <InfoBlock icon={Star} label="Bệnh nhân / Đánh giá" value={`${doctor.patients} BN · ${doctor.rating > 0 ? doctor.rating.toFixed(1) + '★' : 'Chưa có'}`} />
            <InfoBlock icon={Mail} label="Email" value={doctor.email} />
            <InfoBlock icon={Phone} label="Số điện thoại" value={doctor.phone} />
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <FileText size={12} /> Giới thiệu
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{doctor.bio}</p>
          </div>

          <div className="text-xs text-gray-500">
            Cấp tài khoản: <span className="text-gray-700">{doctor.joinedAt}</span>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end flex-wrap">
          <button onClick={onDelete} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 inline-flex items-center gap-1.5">
            <Trash2 size={14} /> Xoá
          </button>
          <button onClick={onToggleStatus} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white inline-flex items-center gap-1.5">
            {doctor.status === 'active' ? <><Lock size={14} /> Tạm khoá</> : <><Unlock size={14} /> Kích hoạt</>}
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Đóng</button>
          <button onClick={onEdit} className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
            <Pencil size={14} /> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400';

function SpecialtyCombobox({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const q = value.trim().toLowerCase();
  const filtered = q ? options.filter(o => o.toLowerCase().includes(q)) : options;
  const isCustom = value.trim().length > 0 && !options.some(o => o.toLowerCase() === q);

  return (
    <div ref={wrapRef} className="relative mt-1">
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Chọn hoặc tự nhập chuyên khoa"
          className="w-full pl-3 pr-9 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
        />
        <button
          type="button"
          onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
          className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-gray-400">Không có gợi ý phù hợp</li>
            ) : filtered.map(opt => {
              const active = opt.toLowerCase() === q;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-green-50 ${active ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}`}
                  >
                    <span>{opt}</span>
                    {active && <Check size={14} className="text-green-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
          {isCustom && (
            <div className="border-t border-gray-100 px-3 py-2 text-xs text-gray-500 bg-gray-50">
              Sẽ dùng giá trị tự nhập: <span className="font-medium text-gray-800">{value.trim()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      {children}
    </label>
  );
}

function DoctorEditModal({ row, onClose, onSave }: { row: Doctor; onClose: () => void; onSave: (next: Doctor) => void }) {
  const [draft, setDraft] = useState<Doctor>(row);
  useEffect(() => setDraft(row), [row]);

  const submit = () => {
    if (!draft.name.trim() || !draft.email.trim() || !draft.specialty.trim()) {
      toast.error('Họ tên, email và chuyên khoa không được để trống');
      return;
    }
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa hồ sơ bác sĩ</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Họ tên" required>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
            </Labeled>
            <Labeled label="Chuyên khoa" required>
              <select value={draft.specialty} onChange={(e) => setDraft({ ...draft, specialty: e.target.value })} className={`${inputCls} bg-white`}>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Labeled>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Email" required>
              <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} />
            </Labeled>
            <Labeled label="Số điện thoại">
              <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputCls} />
            </Labeled>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Labeled label="Chứng chỉ hành nghề">
              <input value={draft.license} onChange={(e) => setDraft({ ...draft, license: e.target.value })} className={inputCls} />
            </Labeled>
            <Labeled label="Bằng cấp">
              <input value={draft.degree} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} className={inputCls} />
            </Labeled>
          </div>
          <Labeled label="Giới thiệu">
            <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className={inputCls} />
          </Labeled>
          <p className="text-[11px] text-gray-500">Username @{draft.username} không thể chỉnh sửa sau khi đã cấp tài khoản.</p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorCreateModal({ existingUsernames, onClose, onCreate }: {
  existingUsernames: string[];
  onClose: () => void;
  onCreate: (d: Omit<Doctor, 'id' | 'joinedAt' | 'patients' | 'rating' | 'status'>) => void;
}) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [degree, setDegree] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');

  const suggestUsername = () => {
    if (!name.trim()) { toast.error('Nhập họ tên trước để gợi ý username'); return; }
    const slug = name.replace(/^BS\.\s*/i, '').toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '.');
    setUsername(slug);
  };

  const submit = () => {
    if (!name.trim()) return toast.error('Vui lòng nhập họ tên');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Email không hợp lệ');
    if (!phone.trim()) return toast.error('Vui lòng nhập số điện thoại');
    if (!license.trim()) return toast.error('Vui lòng nhập chứng chỉ hành nghề');
    if (!username.trim()) return toast.error('Vui lòng tạo username');
    if (existingUsernames.includes(username.trim())) return toast.error('Username đã tồn tại');
    onCreate({
      name: name.startsWith('BS.') ? name : `BS. ${name}`,
      specialty,
      email: email.trim(),
      phone: phone.trim(),
      license: license.trim(),
      degree: degree.trim() || 'Chưa cập nhật',
      bio: bio.trim() || 'Bác sĩ mới được cấp tài khoản.',
      username: username.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Thêm bác sĩ mới</h3>
              <p className="text-xs text-gray-500">Cấp tài khoản cho bác sĩ đã được phòng khám tuyển dụng & xác minh hồ sơ.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <Section title="Thông tin cá nhân">
            <div className="grid grid-cols-2 gap-3">
              <Labeled label="Họ tên" required>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="vd: Nguyễn Văn A" className={inputCls} />
              </Labeled>
              <Labeled label="Chuyên khoa" required>
                <SpecialtyCombobox value={specialty} onChange={setSpecialty} options={SPECIALTIES} />
              </Labeled>
              <Labeled label="Email công vụ" required>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="bsa@dinhduong.vn" className={inputCls} />
              </Labeled>
              <Labeled label="Số điện thoại" required>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901 234 567" className={inputCls} />
              </Labeled>
            </div>
          </Section>

          <Section title="Hồ sơ chuyên môn">
            <div className="grid grid-cols-2 gap-3">
              <Labeled label="Chứng chỉ hành nghề" required>
                <input value={license} onChange={(e) => setLicense(e.target.value)} placeholder="GPHN-YYYY-XXXX" className={inputCls} />
              </Labeled>
              <Labeled label="Bằng cấp">
                <input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="BS. ĐH Y Hà Nội (2018)" className={inputCls} />
              </Labeled>
            </div>
            <Labeled label="Giới thiệu">
              <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Kinh nghiệm, lĩnh vực chuyên sâu..." className={inputCls} />
            </Labeled>
          </Section>

          <Section title="Tài khoản đăng nhập">
            <Labeled label="Username" required>
              <div className="flex gap-2 mt-1">
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="vd: nguyen.van.a" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400" />
                <button type="button" onClick={suggestUsername} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">Gợi ý từ tên</button>
              </div>
            </Labeled>
            <p className="text-[11px] text-gray-500 mt-2">
              Mật khẩu tạm sẽ được hệ thống tự sinh và gửi qua email công vụ. Bác sĩ buộc phải đổi mật khẩu khi đăng nhập lần đầu.
            </p>
          </Section>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
            <Plus size={14} /> Cấp tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ConfirmModal({ confirm, onCancel, onToggle, onDelete }: {
  confirm: { kind: 'toggle' | 'delete'; doctor: Doctor };
  onCancel: () => void;
  onToggle: (d: Doctor) => void;
  onDelete: (d: Doctor) => void;
}) {
  const isDelete = confirm.kind === 'delete';
  const isLocking = confirm.kind === 'toggle' && confirm.doctor.status === 'active';
  const title = isDelete
    ? `Xoá ${confirm.doctor.name}?`
    : isLocking ? `Tạm khoá tài khoản ${confirm.doctor.name}?` : `Kích hoạt lại ${confirm.doctor.name}?`;
  const desc = isDelete
    ? 'Toàn bộ dữ liệu lịch hẹn, bệnh nhân phụ trách của bác sĩ này sẽ cần được phân lại. Hành động không thể hoàn tác.'
    : isLocking
      ? 'Bác sĩ sẽ không thể đăng nhập và không nhận lịch hẹn mới. Lịch hẹn đã xác nhận vẫn được giữ.'
      : 'Bác sĩ có thể đăng nhập và tiếp tục nhận lịch hẹn mới.';
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            isDelete || isLocking ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {isDelete ? <Trash2 size={22} /> : isLocking ? <Lock size={22} /> : <Unlock size={22} />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button
            onClick={() => isDelete ? onDelete(confirm.doctor) : onToggle(confirm.doctor)}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
              isDelete || isLocking ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isDelete ? 'Xoá vĩnh viễn' : isLocking ? 'Tạm khoá' : 'Kích hoạt'}
          </button>
        </div>
      </div>
    </div>
  );
}
