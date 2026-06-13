import { useMemo, useState, useEffect, type ReactNode } from 'react';
import {
  Search, Eye, Pencil, Lock, Unlock, Trash2, Download, Users, X,
  UserPlus, ShieldCheck, HeartPulse, UserCircle2, Stethoscope, Calendar,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '@/app/shared/components/Pagination';

/* ---------- Types ---------- */
type Status = 'active' | 'locked';

type BaseRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: Status;
  joinedAt: string;
};

type UserRow = BaseRow & { kind: 'user' };
type AdminRow = BaseRow & { kind: 'admin'; scope: string };
type PatientRow = BaseRow & {
  kind: 'patient';
  diagnosis: string;
  assignedDoctor: string;
  treatmentStartDate: string;
  username: string;
};

type AnyRow = UserRow | PatientRow | AdminRow;
type TabKey = 'user' | 'patient' | 'admin';

/* ---------- Constants ---------- */
const PAGE_SIZE = 8;
const DOCTORS = [
  'BS. Trần Thị A',
  'BS. Nguyễn Văn B',
  'BS. Hoàng Văn E',
  'BS. Lê Thị C',
  'BS. Phạm Văn D',
];

const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

/* ---------- Seeds ---------- */
const seedUsers: UserRow[] = [
  { id: 'U001', kind: 'user', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901 111 222', status: 'active', joinedAt: '12/04/2026' },
  { id: 'U005', kind: 'user', name: 'Phạm Văn C',   email: 'phamc@gmail.com',      phone: '0902 333 444', status: 'active', joinedAt: '01/05/2026' },
  { id: 'U007', kind: 'user', name: 'Vũ Văn F',     email: 'vuf@gmail.com',        phone: '0903 555 666', status: 'locked', joinedAt: '28/04/2026' },
  { id: 'U010', kind: 'user', name: 'Bùi Thị H',    email: 'buih@gmail.com',       phone: '0904 777 888', status: 'active', joinedAt: '02/05/2026' },
  { id: 'U012', kind: 'user', name: 'Dương Thị K',  email: 'duongk@gmail.com',     phone: '0905 999 000', status: 'active', joinedAt: '15/03/2026' },
  { id: 'U014', kind: 'user', name: 'Lý Văn L',     email: 'lyl@gmail.com',        phone: '0906 222 333', status: 'active', joinedAt: '11/04/2026' },
  { id: 'U015', kind: 'user', name: 'Hồ Thị N',     email: 'hon@gmail.com',        phone: '0907 444 555', status: 'active', joinedAt: '20/05/2026' },
  { id: 'U016', kind: 'user', name: 'Đinh Văn P',   email: 'dinhp@gmail.com',      phone: '0908 666 777', status: 'locked', joinedAt: '22/05/2026' },
];

const seedPatients: PatientRow[] = [
  { id: 'P001', kind: 'patient', name: 'Trần Thị B',  email: 'tranb@gmail.com',   phone: '0911 111 222', status: 'active', joinedAt: '03/05/2026', username: 'tranb', diagnosis: 'Béo phì độ I, rối loạn lipid máu', assignedDoctor: 'BS. Trần Thị A',   treatmentStartDate: '05/05/2026' },
  { id: 'P002', kind: 'patient', name: 'Lê Thị D',    email: 'led@gmail.com',     phone: '0911 333 444', status: 'locked', joinedAt: '17/03/2026', username: 'led',   diagnosis: 'Tiểu đường type 2',                  assignedDoctor: 'BS. Nguyễn Văn B', treatmentStartDate: '20/03/2026' },
  { id: 'P003', kind: 'patient', name: 'Đặng Văn G',  email: 'dangg@gmail.com',   phone: '0911 555 666', status: 'active', joinedAt: '05/05/2026', username: 'dangg', diagnosis: 'Suy dinh dưỡng – thiếu sắt',         assignedDoctor: 'BS. Hoàng Văn E',  treatmentStartDate: '07/05/2026' },
  { id: 'P004', kind: 'patient', name: 'Ngô Văn I',   email: 'ngoi@gmail.com',    phone: '0911 777 888', status: 'active', joinedAt: '20/04/2026', username: 'ngoi',  diagnosis: 'Tăng huyết áp – cần điều chỉnh khẩu phần', assignedDoctor: 'BS. Lê Thị C', treatmentStartDate: '22/04/2026' },
  { id: 'P005', kind: 'patient', name: 'Cao Thị M',   email: 'caom@gmail.com',    phone: '0911 999 000', status: 'locked', joinedAt: '08/02/2026', username: 'caom',  diagnosis: 'Gout, cần kiểm soát purine',         assignedDoctor: 'BS. Trần Thị A',   treatmentStartDate: '12/02/2026' },
  { id: 'P006', kind: 'patient', name: 'Vũ Thị Q',    email: 'vuq@gmail.com',     phone: '0912 111 333', status: 'active', joinedAt: '18/05/2026', username: 'vuq',   diagnosis: 'Thiếu máu thai kỳ',                  assignedDoctor: 'BS. Phạm Văn D',   treatmentStartDate: '20/05/2026' },
];

const seedAdmins: AdminRow[] = [
  { id: 'A001', kind: 'admin', name: 'Quản trị viên', email: 'admin@dinhduong.vn', phone: '0900 000 001', status: 'active', joinedAt: '01/01/2026', scope: 'Toàn quyền hệ thống' },
  { id: 'A002', kind: 'admin', name: 'Lê Phòng Khám', email: 'manager@dinhduong.vn', phone: '0900 000 002', status: 'active', joinedAt: '15/01/2026', scope: 'Quản lý nội dung & người dùng' },
];

/* ---------- Helpers ---------- */
const initials = (name: string) =>
  name.replace(/^BS\.\s*/, '').split(' ').slice(-2).map(s => s[0]).join('').toUpperCase();

const slugifyUsername = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '').slice(0, 20);

/* ---------- Main ---------- */
export function AdminUsers() {
  const [tab, setTab] = useState<TabKey>('user');
  const [users, setUsers] = useState<UserRow[]>(seedUsers);
  const [patients, setPatients] = useState<PatientRow[]>(seedPatients);
  const [admins, setAdmins] = useState<AdminRow[]>(seedAdmins);

  const summary = {
    user: { total: users.length, locked: users.filter(u => u.status === 'locked').length },
    patient: { total: patients.length, locked: patients.filter(p => p.status === 'locked').length },
    admin: { total: admins.length },
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý 3 nhóm tài khoản trong hệ thống: User công khai, Bệnh nhân của phòng khám, và Quản trị viên.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            icon={<UserCircle2 size={22} />}
            label="Tài khoản User"
            value={summary.user.total}
            sub={`${summary.user.locked} bị khoá`}
            tone="sky"
          />
          <SummaryCard
            icon={<HeartPulse size={22} />}
            label="Bệnh nhân"
            value={summary.patient.total}
            sub={`${summary.patient.locked} bị khoá`}
            tone="emerald"
          />
          <SummaryCard
            icon={<ShieldCheck size={22} />}
            label="Quản trị viên"
            value={summary.admin.total}
            sub="Tài khoản đặc quyền"
            tone="amber"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 p-1.5 flex items-center gap-1.5 w-fit">
          <TabBtn active={tab === 'user'} onClick={() => setTab('user')} icon={<UserCircle2 size={16} />} label="User công khai" count={summary.user.total} />
          <TabBtn active={tab === 'patient'} onClick={() => setTab('patient')} icon={<HeartPulse size={16} />} label="Bệnh nhân" count={summary.patient.total} />
          <TabBtn active={tab === 'admin'} onClick={() => setTab('admin')} icon={<ShieldCheck size={16} />} label="Quản trị viên" count={summary.admin.total} />
        </div>

        {/* Body per tab */}
        {tab === 'user' && (
          <UserTab rows={users} setRows={setUsers} />
        )}
        {tab === 'patient' && (
          <PatientTab rows={patients} setRows={setPatients} />
        )}
        {tab === 'admin' && (
          <AdminTab rows={admins} />
        )}
      </div>
    </div>
  );
}

/* ---------- Summary card + Tab button ---------- */
function SummaryCard({ icon, label, value, sub, tone }: {
  icon: ReactNode; label: string; value: number; sub: string;
  tone: 'sky' | 'emerald' | 'amber';
}) {
  const toneMap = {
    sky: 'from-sky-500 to-sky-700 text-sky-50',
    emerald: 'from-emerald-500 to-emerald-700 text-emerald-50',
    amber: 'from-amber-500 to-amber-600 text-amber-50',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label, count }: {
  active: boolean; onClick: () => void; icon: ReactNode; label: string; count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all ${
        active
          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
        active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
      }`}>{count}</span>
    </button>
  );
}

/* =========================================================
   USER TAB — read-only, lock/unlock only
   ========================================================= */
function UserTab({ rows, setRows }: { rows: UserRow[]; setRows: (fn: (r: UserRow[]) => UserRow[]) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ kind: 'lock' | 'unlock'; row: UserRow } | null>(null);
  const [viewing, setViewing] = useState<UserRow | null>(null);

  const filtered = useMemo(() => rows.filter(r => {
    const s = search.toLowerCase();
    const ms = !s || r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || r.id.toLowerCase().includes(s);
    const mst = statusFilter === 'all' || r.status === statusFilter;
    return ms && mst;
  }), [rows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const applyLock = (id: string, target: 'lock' | 'unlock') => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: target === 'lock' ? 'locked' : 'active' } : r));
    toast.success(`Đã ${target === 'lock' ? 'khoá' : 'mở khoá'} tài khoản`);
    setConfirm(null);
  };

  return (
    <>
      <FilterBar
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Tìm theo tên, email hoặc ID..."
        right={
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khoá</option>
          </select>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? <EmptyState /> : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">Email / SĐT</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày đăng ký</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} tone="sky" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{r.email}</p>
                      <p className="text-xs text-gray-500">{r.phone}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.joinedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="Xem" onClick={() => setViewing(r)}><Eye size={15} /></IconBtn>
                        <IconBtn
                          title={r.status === 'active' ? 'Khoá' : 'Mở khoá'}
                          onClick={() => setConfirm({ kind: r.status === 'active' ? 'lock' : 'unlock', row: r })}
                        >
                          {r.status === 'active' ? <Lock size={15} /> : <Unlock size={15} />}
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />
          </>
        )}
      </div>

      {viewing && (
        <DetailModal title="Chi tiết tài khoản User" onClose={() => setViewing(null)} row={viewing} tone="sky">
          <Field label="Email" value={viewing.email} />
          <Field label="Số điện thoại" value={viewing.phone || '—'} />
          <Field label="Trạng thái" value={<StatusBadge status={viewing.status} />} />
          <Field label="Ngày đăng ký" value={viewing.joinedAt} />
        </DetailModal>
      )}

      {confirm && (
        <ConfirmModal
          kind={confirm.kind === 'lock' ? 'danger' : 'success'}
          title={`${confirm.kind === 'lock' ? 'Khoá' : 'Mở khoá'} tài khoản ${confirm.row.name}?`}
          desc={confirm.kind === 'lock'
            ? 'Người dùng sẽ không thể đăng nhập cho đến khi được mở lại. Dữ liệu cá nhân vẫn được giữ nguyên.'
            : 'Tài khoản sẽ có thể đăng nhập lại và sử dụng hệ thống bình thường.'}
          confirmLabel={confirm.kind === 'lock' ? 'Xác nhận khoá' : 'Xác nhận mở khoá'}
          icon={confirm.kind === 'lock' ? <Lock size={22} /> : <Unlock size={22} />}
          onClose={() => setConfirm(null)}
          onConfirm={() => applyLock(confirm.row.id, confirm.kind)}
        />
      )}
    </>
  );
}

/* =========================================================
   PATIENT TAB — full CRUD
   ========================================================= */
function PatientTab({ rows, setRows }: { rows: PatientRow[]; setRows: (fn: (r: PatientRow[]) => PatientRow[]) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [doctorFilter, setDoctorFilter] = useState<'all' | string>('all');
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<PatientRow | null>(null);
  const [editing, setEditing] = useState<PatientRow | null>(null);
  const [confirm, setConfirm] = useState<
    | { kind: 'lock' | 'unlock' | 'delete'; row: PatientRow }
    | null
  >(null);

  const filtered = useMemo(() => rows.filter(r => {
    const s = search.toLowerCase();
    const ms = !s || r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s)
      || r.id.toLowerCase().includes(s) || r.diagnosis.toLowerCase().includes(s);
    const mst = statusFilter === 'all' || r.status === statusFilter;
    const md = doctorFilter === 'all' || r.assignedDoctor === doctorFilter;
    return ms && mst && md;
  }), [rows, search, statusFilter, doctorFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const createPatient = (data: Omit<PatientRow, 'id' | 'kind' | 'joinedAt' | 'status'>) => {
    const nextId = `P${String(rows.length + 1).padStart(3, '0')}`;
    const row: PatientRow = { ...data, id: nextId, kind: 'patient', status: 'active', joinedAt: todayStr() };
    setRows(rs => [row, ...rs]);
    toast.success(`Đã tạo hồ sơ bệnh nhân ${data.name}`);
    setCreating(false);
  };

  const savePatient = (next: PatientRow) => {
    setRows(rs => rs.map(r => r.id === next.id ? next : r));
    toast.success(`Đã cập nhật ${next.name}`);
    setEditing(null);
  };

  const applyLock = (id: string, target: 'lock' | 'unlock') => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: target === 'lock' ? 'locked' : 'active' } : r));
    toast.success(`Đã ${target === 'lock' ? 'khoá' : 'mở khoá'} hồ sơ`);
    setConfirm(null);
  };

  const applyDelete = (id: string) => {
    setRows(rs => rs.filter(r => r.id !== id));
    toast.success('Đã xoá hồ sơ bệnh nhân');
    setConfirm(null);
  };

  return (
    <>
      <FilterBar
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Tìm theo tên, ID, chẩn đoán..."
        right={
          <>
            <select
              value={doctorFilter}
              onChange={(e) => { setDoctorFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="all">Tất cả bác sĩ phụ trách</option>
              {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khoá</option>
            </select>
            <button
              onClick={() => setCreating(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5 shadow-sm hover:shadow"
            >
              <UserPlus size={15} /> Thêm bệnh nhân
            </button>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? <EmptyState /> : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Bệnh nhân</th>
                  <th className="px-4 py-3">Chẩn đoán</th>
                  <th className="px-4 py-3">BS phụ trách</th>
                  <th className="px-4 py-3">Bắt đầu điều trị</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} tone="emerald" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.id} · {r.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 max-w-[260px] truncate" title={r.diagnosis}>{r.diagnosis}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <Stethoscope size={14} className="text-emerald-600" />
                        {r.assignedDoctor}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {r.treatmentStartDate}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="Xem" onClick={() => setViewing(r)}><Eye size={15} /></IconBtn>
                        <IconBtn title="Chỉnh sửa" onClick={() => setEditing(r)}><Pencil size={15} /></IconBtn>
                        <IconBtn
                          title={r.status === 'active' ? 'Khoá' : 'Mở khoá'}
                          onClick={() => setConfirm({ kind: r.status === 'active' ? 'lock' : 'unlock', row: r })}
                        >
                          {r.status === 'active' ? <Lock size={15} /> : <Unlock size={15} />}
                        </IconBtn>
                        <IconBtn title="Xoá" onClick={() => setConfirm({ kind: 'delete', row: r })}>
                          <Trash2 size={15} className="text-red-500" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TableFooter page={page} totalPages={totalPages} total={filtered.length} onChange={setPage} />
          </>
        )}
      </div>

      {creating && <PatientCreateModal onClose={() => setCreating(false)} onCreate={createPatient} />}
      {editing && <PatientEditModal row={editing} onClose={() => setEditing(null)} onSave={savePatient} />}
      {viewing && (
        <DetailModal title="Hồ sơ bệnh nhân" onClose={() => setViewing(null)} row={viewing} tone="emerald"
          footer={
            <button
              onClick={() => { setEditing(viewing); setViewing(null); }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5"
            >
              <Pencil size={14} /> Chỉnh sửa
            </button>
          }
        >
          <Field label="Tên đăng nhập" value={<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{viewing.username}</code>} />
          <Field label="Email" value={viewing.email} />
          <Field label="Số điện thoại" value={viewing.phone || '—'} />
          <Field label="Chẩn đoán" value={<span className="text-right">{viewing.diagnosis}</span>} />
          <Field label="BS phụ trách" value={viewing.assignedDoctor} />
          <Field label="Bắt đầu điều trị" value={viewing.treatmentStartDate} />
          <Field label="Trạng thái" value={<StatusBadge status={viewing.status} />} />
          <Field label="Ngày tạo hồ sơ" value={viewing.joinedAt} />
        </DetailModal>
      )}
      {confirm && (
        <ConfirmModal
          kind={confirm.kind === 'unlock' ? 'success' : 'danger'}
          title={
            confirm.kind === 'delete' ? `Xoá vĩnh viễn hồ sơ ${confirm.row.name}?` :
            confirm.kind === 'lock' ? `Khoá hồ sơ ${confirm.row.name}?` :
            `Mở khoá hồ sơ ${confirm.row.name}?`
          }
          desc={
            confirm.kind === 'delete'
              ? 'Toàn bộ dữ liệu điều trị, lịch hẹn và nhật ký dinh dưỡng liên quan có thể bị ảnh hưởng. Hành động không thể hoàn tác.'
              : confirm.kind === 'lock'
                ? 'Bệnh nhân sẽ không thể đăng nhập để xem phác đồ và lịch hẹn cho đến khi mở lại.'
                : 'Bệnh nhân sẽ có thể đăng nhập lại bình thường.'
          }
          confirmLabel={
            confirm.kind === 'delete' ? 'Xoá vĩnh viễn' :
            confirm.kind === 'lock' ? 'Xác nhận khoá' : 'Xác nhận mở khoá'
          }
          icon={
            confirm.kind === 'delete' ? <Trash2 size={22} /> :
            confirm.kind === 'lock' ? <Lock size={22} /> : <Unlock size={22} />
          }
          onClose={() => setConfirm(null)}
          onConfirm={() => confirm.kind === 'delete'
            ? applyDelete(confirm.row.id)
            : applyLock(confirm.row.id, confirm.kind)}
        />
      )}
    </>
  );
}

/* =========================================================
   ADMIN TAB — view only
   ========================================================= */
function AdminTab({ rows }: { rows: AdminRow[] }) {
  const [viewing, setViewing] = useState<AdminRow | null>(null);
  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Tài khoản Quản trị viên</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Tài khoản đặc quyền không thể bị khoá hoặc xoá trong giao diện này. Liên hệ kỹ thuật nếu cần thay đổi quyền hạn.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phạm vi quyền</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} tone="amber" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {r.scope}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{r.joinedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn title="Xem" onClick={() => setViewing(r)}><Eye size={15} /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewing && (
        <DetailModal title="Chi tiết Quản trị viên" onClose={() => setViewing(null)} row={viewing} tone="amber">
          <Field label="Email" value={viewing.email} />
          <Field label="Số điện thoại" value={viewing.phone || '—'} />
          <Field label="Phạm vi quyền" value={viewing.scope} />
          <Field label="Ngày tạo" value={viewing.joinedAt} />
        </DetailModal>
      )}
    </>
  );
}

/* =========================================================
   Patient Create / Edit modals
   ========================================================= */
function PatientCreateModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: Omit<PatientRow, 'id' | 'kind' | 'joinedAt' | 'status'>) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctor, setDoctor] = useState(DOCTORS[0]);
  const [start, setStart] = useState(todayStr());
  const [username, setUsername] = useState('');
  const [usernameDirty, setUsernameDirty] = useState(false);

  useEffect(() => {
    if (!usernameDirty) setUsername(slugifyUsername(name));
  }, [name, usernameDirty]);

  const submit = () => {
    if (!name.trim() || !email.trim()) { toast.error('Họ tên và email không được để trống'); return; }
    if (!diagnosis.trim()) { toast.error('Vui lòng nhập chẩn đoán'); return; }
    if (!username.trim()) { toast.error('Tên đăng nhập không được để trống'); return; }
    onCreate({ name: name.trim(), email: email.trim(), phone: phone.trim(), diagnosis: diagnosis.trim(), assignedDoctor: doctor, treatmentStartDate: start, username: username.trim() });
  };

  return (
    <ModalShell title="Thêm bệnh nhân mới" onClose={onClose} maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
            <UserPlus size={15} /> Tạo hồ sơ
          </button>
        </>
      }
    >
      <Section title="Thông tin cá nhân">
        <FormGrid>
          <FormField label="Họ tên *">
            <Input value={name} onChange={setName} placeholder="VD: Trần Thị B" />
          </FormField>
          <FormField label="Số điện thoại">
            <Input value={phone} onChange={setPhone} placeholder="VD: 0901 234 567" />
          </FormField>
          <FormField label="Email *" full>
            <Input value={email} onChange={setEmail} type="email" placeholder="patient@example.com" />
          </FormField>
        </FormGrid>
      </Section>

      <Section title="Hồ sơ điều trị">
        <FormGrid>
          <FormField label="Chẩn đoán *" full>
            <textarea
              value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
              rows={2} placeholder="VD: Béo phì độ I, rối loạn lipid máu"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none"
            />
          </FormField>
          <FormField label="Bác sĩ phụ trách *">
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
              {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Bắt đầu điều trị">
            <Input value={start} onChange={setStart} placeholder="dd/mm/yyyy" />
          </FormField>
        </FormGrid>
      </Section>

      <Section title="Tài khoản đăng nhập">
        <FormGrid>
          <FormField label="Tên đăng nhập *" full>
            <Input value={username}
              onChange={(v) => { setUsername(v); setUsernameDirty(true); }}
              placeholder="Tự sinh từ họ tên"
            />
            <p className="text-xs text-gray-500 mt-1">Mật khẩu khởi tạo sẽ được gửi qua email cho bệnh nhân.</p>
          </FormField>
        </FormGrid>
      </Section>
    </ModalShell>
  );
}

function PatientEditModal({ row, onClose, onSave }: { row: PatientRow; onClose: () => void; onSave: (n: PatientRow) => void }) {
  const [draft, setDraft] = useState<PatientRow>(row);
  useEffect(() => setDraft(row), [row]);
  const submit = () => {
    if (!draft.name.trim() || !draft.email.trim()) { toast.error('Họ tên và email không được để trống'); return; }
    onSave(draft);
  };
  return (
    <ModalShell title={`Chỉnh sửa hồ sơ ${row.name}`} onClose={onClose} maxWidth="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
            Lưu thay đổi
          </button>
        </>
      }
    >
      <Section title="Thông tin cá nhân">
        <FormGrid>
          <FormField label="Họ tên">
            <Input value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          </FormField>
          <FormField label="Số điện thoại">
            <Input value={draft.phone || ''} onChange={(v) => setDraft({ ...draft, phone: v })} />
          </FormField>
          <FormField label="Email" full>
            <Input value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} type="email" />
          </FormField>
        </FormGrid>
      </Section>
      <Section title="Hồ sơ điều trị">
        <FormGrid>
          <FormField label="Chẩn đoán" full>
            <textarea
              value={draft.diagnosis} onChange={(e) => setDraft({ ...draft, diagnosis: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none"
            />
          </FormField>
          <FormField label="Bác sĩ phụ trách">
            <select value={draft.assignedDoctor} onChange={(e) => setDraft({ ...draft, assignedDoctor: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
              {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Bắt đầu điều trị">
            <Input value={draft.treatmentStartDate} onChange={(v) => setDraft({ ...draft, treatmentStartDate: v })} />
          </FormField>
        </FormGrid>
      </Section>
    </ModalShell>
  );
}

/* =========================================================
   Shared UI primitives
   ========================================================= */
function FilterBar({ search, onSearchChange, placeholder, right }: {
  search: string; onSearchChange: (v: string) => void; placeholder: string; right: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
          />
        </div>
        {right}
      </div>
    </div>
  );
}

function TableFooter({ page, totalPages, total, onChange }: { page: number; totalPages: number; total: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
      <p className="text-gray-500">
        Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} trên {total}
      </p>
      <Pagination page={page} totalPages={totalPages} onChange={onChange} />
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: ReactNode; title: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={title}>
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {status === 'active' ? 'Hoạt động' : 'Bị khoá'}
    </span>
  );
}

function Avatar({ name, tone }: { name: string; tone: 'sky' | 'emerald' | 'amber' }) {
  const toneMap = {
    sky: 'from-sky-500 to-sky-700',
    emerald: 'from-green-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center text-white text-xs font-bold`}>
      {initials(name)}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
        <Users size={28} />
      </div>
      <h3 className="text-base font-semibold text-gray-900">Không tìm thấy bản ghi</h3>
      <p className="text-sm text-gray-500 mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm.</p>
    </div>
  );
}

function ModalShell({ title, onClose, children, footer, maxWidth = 'max-w-md' }: {
  title: string; onClose: () => void; children: ReactNode; footer: ReactNode; maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl overflow-hidden max-h-[92vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end flex-shrink-0">
          {footer}
        </div>
      </div>
    </div>
  );
}

function DetailModal({ title, onClose, row, tone, children, footer }: {
  title: string; onClose: () => void; row: BaseRow; tone: 'sky' | 'emerald' | 'amber';
  children: ReactNode; footer?: ReactNode;
}) {
  return (
    <ModalShell title={title} onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Đóng</button>
          {footer}
        </>
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <Avatar name={row.name} tone={tone} />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.id}</p>
        </div>
      </div>
      <dl className="space-y-2 text-sm">{children}</dl>
    </ModalShell>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
      <dt className="text-xs text-gray-500 uppercase tracking-wide flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800 text-right">{value}</dd>
    </div>
  );
}

function ConfirmModal({ kind, title, desc, confirmLabel, icon, onClose, onConfirm }: {
  kind: 'danger' | 'success';
  title: string; desc: string; confirmLabel: string; icon: ReactNode;
  onClose: () => void; onConfirm: () => void;
}) {
  const isSuccess = kind === 'success';
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
              isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5 last:mb-0">
      <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2.5">{title}</h4>
      {children}
    </section>
  );
}

function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
}

function FormField({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={`block ${full ? 'md:col-span-2' : ''}`}>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Input({ value, onChange, type = 'text', placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
    />
  );
}
