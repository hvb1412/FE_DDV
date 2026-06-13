import { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, Clock, User, Stethoscope, AlertTriangle, CheckCircle2, XCircle, Eye, Video, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAppointments, type ApptStatus, type SharedAppt } from '@/app/shared/stores/appointmentStore';
import { Pagination } from '@/app/shared/components/Pagination';

const PAGE_SIZE = 10;

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';

const statusBadge: Record<ApptStatus, { label: string; cls: string }> = {
  pending_doctor:  { label: 'Chờ BS duyệt',      cls: 'bg-amber-100 text-amber-700' },
  pending_patient: { label: 'Chờ BN xác nhận',   cls: 'bg-amber-100 text-amber-700' },
  confirmed:       { label: 'Đã xác nhận',       cls: 'bg-blue-100 text-blue-700' },
  completed:       { label: 'Hoàn thành',        cls: 'bg-green-100 text-green-700' },
  cancelled:       { label: 'Đã huỷ',            cls: 'bg-gray-100 text-gray-600' },
  rejected:        { label: 'Đã từ chối',        cls: 'bg-gray-100 text-gray-600' },
  disputed:        { label: 'Khiếu nại',         cls: 'bg-red-100 text-red-700' },
};

const isPending = (s: ApptStatus) => s === 'pending_doctor' || s === 'pending_patient';

export function AdminAppointments() {
  const { appointments, resolveDispute } = useAppointments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<SharedAppt | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => appointments.filter(a => {
    const s = search.toLowerCase();
    const matchS = !s || a.patientName.toLowerCase().includes(s) || a.doctorName.toLowerCase().includes(s) || String(a.id).includes(s);
    const matchST = statusFilter === 'all'
      ? true
      : statusFilter === 'pending'
      ? isPending(a.status)
      : a.status === statusFilter;
    return matchS && matchST;
  }), [appointments, search, statusFilter]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const disputed = appointments.filter(a => a.status === 'disputed').length;
  const pending = appointments.filter(a => isPending(a.status)).length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  const doResolve = (id: number, to: 'completed' | 'cancelled') => {
    resolveDispute(id, to, resolveNote.trim() || undefined);
    toast.success(to === 'completed' ? 'Đã đánh dấu hoàn thành' : 'Đã huỷ lịch hẹn', {
      description: 'Bệnh nhân và bác sĩ sẽ nhận được thông báo về kết quả xử lý',
    });
    setSelected(null);
    setResolveNote('');
  };

  const openDetail = (a: SharedAppt) => { setSelected(a); setResolveNote(''); };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={18} /></div>
            <div>
              <p className="text-xs text-gray-500">Chờ xác nhận</p>
              <p className="text-xl font-bold text-gray-900">{pending}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Calendar size={18} /></div>
            <div>
              <p className="text-xs text-gray-500">Đã xác nhận</p>
              <p className="text-xl font-bold text-gray-900">{confirmed}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-xs text-gray-500">Hoàn thành</p>
              <p className="text-xl font-bold text-gray-900">{completed}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><AlertTriangle size={18} /></div>
            <div>
              <p className="text-xs text-gray-500">Khiếu nại</p>
              <p className="text-xl font-bold text-red-600">{disputed}</p>
            </div>
          </div>
        </div>

        {disputed > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Có {disputed} lịch hẹn đang bị khiếu nại</p>
              <p className="text-xs text-red-700 mt-0.5">Mở chi tiết để xem lý do, sau đó chọn "Đánh dấu hoàn thành" (chấp nhận buổi tư vấn hợp lệ) hoặc "Huỷ lịch hẹn" (hoàn tiền/không tính phí).</p>
            </div>
            <button onClick={() => setStatusFilter('disputed')} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700">Xem danh sách</button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo bệnh nhân, bác sĩ, mã lịch hẹn..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FilterStatus)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã huỷ</option>
              <option value="disputed">Khiếu nại</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Bệnh nhân</th>
                <th className="px-4 py-3">Bác sĩ</th>
                <th className="px-4 py-3">Ngày giờ</th>
                <th className="px-4 py-3">Chủ đề</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(a => (
                <tr key={a.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#{a.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700"><span className="flex items-center gap-2"><User size={14} className="text-gray-400" />{a.patientName}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.doctorName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{a.date} · {a.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.topic}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[a.status].cls}`}>
                      {statusBadge[a.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openDetail(a)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Không có lịch hẹn nào</td></tr>
              )}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
              <p className="text-gray-500">
                Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trên {filtered.length}
              </p>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Chi tiết lịch hẹn</h2>
                  <p className="text-xs text-gray-500 mt-0.5">#{selected.id} • Tạo bởi {selected.createdBy === 'patient' ? 'bệnh nhân' : 'bác sĩ'}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[selected.status].cls}`}>
                  {statusBadge[selected.status].label}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Bệnh nhân</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5"><User size={14} className="text-gray-400" />{selected.patientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.patientDiagnosis}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bác sĩ</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5"><Stethoscope size={14} className="text-gray-400" />{selected.doctorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày & giờ</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selected.date} · {selected.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hình thức</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 flex items-center gap-1.5">
                    {selected.mode === 'online' ? <><Video size={14} className="text-blue-500" /> Online</> : <><MapPin size={14} className="text-amber-500" /> Tại phòng khám</>}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Chủ đề</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{selected.topic}</p>
                </div>
                {selected.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Ghi chú</p>
                    <p className="text-sm text-gray-700 mt-0.5 italic">"{selected.notes}"</p>
                  </div>
                )}
              </div>

              {selected.dispute && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1.5">
                    <AlertTriangle size={13} /> Khiếu nại bởi {selected.dispute.by === 'patient' ? 'bệnh nhân' : 'bác sĩ'} • {selected.dispute.filedAt}
                  </p>
                  <p className="text-sm text-red-900">{selected.dispute.reason}</p>
                  <p className="text-[11px] text-red-700 mt-1">Trạng thái trước khi khiếu nại: {statusBadge[selected.dispute.previousStatus].label}</p>
                  {selected.dispute.resolution && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="text-[11px] text-red-700">Đã xử lý {selected.dispute.resolvedAt} bởi quản trị viên</p>
                      <p className="text-xs text-red-900 mt-0.5">Kết quả: <span className="font-medium">{selected.dispute.resolution === 'completed' ? 'Đánh dấu hoàn thành' : 'Huỷ lịch hẹn'}</span></p>
                      {selected.dispute.resolutionNote && <p className="text-xs text-red-800 mt-1 italic">"{selected.dispute.resolutionNote}"</p>}
                    </div>
                  )}
                </div>
              )}

              {(() => {
                const pairHistory = appointments.filter(a =>
                  a.id !== selected.id &&
                  a.dispute &&
                  a.patientName === selected.patientName &&
                  a.doctorName === selected.doctorName,
                );
                if (pairHistory.length === 0) return null;
                return (
                  <div className="mt-2 border border-amber-200 bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle size={13} /> Lịch sử khiếu nại giữa {selected.patientName} & {selected.doctorName}
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Cặp BN-BS này đã có {pairHistory.length} khiếu nại khác — cân nhắc khi xử lý.</p>
                    <div className="mt-2 space-y-1.5 max-h-40 overflow-auto">
                      {pairHistory.map(h => (
                        <div key={h.id} className="text-[11px] bg-white border border-amber-200 rounded px-2 py-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">#{h.id} • {h.date} {h.time}</span>
                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${statusBadge[h.status].cls}`}>{statusBadge[h.status].label}</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">"{h.dispute?.reason}"</p>
                          {h.dispute?.resolution && (
                            <p className="text-gray-500 mt-0.5">→ Đã xử lý: {h.dispute.resolution === 'completed' ? 'Hoàn thành' : 'Huỷ'} ({h.dispute.resolvedAt})</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {selected.status === 'disputed' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 mt-2">Ghi chú xử lý (tuỳ chọn)</label>
                  <textarea
                    rows={2}
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                    placeholder="Lý do quyết định, dành cho lịch sử xử lý..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex items-center justify-end gap-2">
              {selected.status === 'disputed' ? (
                <>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Đóng</button>
                  <button onClick={() => doResolve(selected.id, 'cancelled')} className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 inline-flex items-center gap-1.5 border border-red-200">
                    <XCircle size={15} /> Huỷ lịch hẹn
                  </button>
                  <button onClick={() => doResolve(selected.id, 'completed')} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 inline-flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Đánh dấu hoàn thành
                  </button>
                </>
              ) : (
                <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300">Đóng</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
