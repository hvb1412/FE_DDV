import { useState } from 'react';
import {
  Calendar, Clock, Video, MapPin, Plus, CheckCircle2, X, ChevronDown,
  User, Bell, Search, CalendarPlus, RefreshCw, AlertCircle, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppointments, type SharedAppt, type ApptStatus, type ApptMode, DEMO_DOCTOR_NAME } from '@/app/shared/stores/appointmentStore';
import { DisputeModal } from '@/app/shared/components/DisputeModal';

type TabKey = 'pending_doctor' | 'pending_patient' | 'confirmed' | 'past' | 'all';

const PATIENTS = [
  { name: 'Nguyễn Văn A', diagnosis: 'Tiểu đường type 2' },
  { name: 'Trần Thị B', diagnosis: 'Tăng huyết áp' },
  { name: 'Lê Văn C', diagnosis: 'Cholesterol cao' },
  { name: 'Phạm Thị D', diagnosis: 'Béo phì độ I' },
  { name: 'Hoàng Văn E', diagnosis: 'Rối loạn lipid máu' },
  { name: 'Vũ Thị F', diagnosis: 'Tiểu đường type 2' },
];

const STATUS_LABEL: Record<ApptStatus, { label: string; color: string }> = {
  pending_doctor: { label: 'Chờ bác sĩ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending_patient: { label: 'Chờ bệnh nhân xác nhận', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Hoàn thành', color: 'bg-green-50 text-green-700 border-green-200' },
  disputed: { label: 'Đang khiếu nại', color: 'bg-red-50 text-red-700 border-red-200' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Đã huỷ', color: 'bg-gray-50 text-gray-500 border-gray-200' },
};

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (appt: Omit<SharedAppt, 'id' | 'status' | 'createdBy'>) => void;
}

function CreateAppointmentModal({ onClose, onSubmit }: CreateModalProps) {
  const [patient, setPatient] = useState(PATIENTS[0].name);
  const [date, setDate] = useState('2026-06-11');
  const [time, setTime] = useState('09:00');
  const [mode, setMode] = useState<ApptMode>('online');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const selectedPatient = PATIENTS.find(p => p.name === patient) ?? PATIENTS[0];

  const handleSubmit = () => {
    if (!topic.trim()) { toast.error('Vui lòng nhập chủ đề lịch hẹn'); return; }
    const [y, m, d] = date.split('-');
    onSubmit({
      patientName: patient,
      patientDiagnosis: selectedPatient.diagnosis,
      doctorName: DEMO_DOCTOR_NAME,
      date: `${d}/${m}/${y}`,
      time,
      mode,
      topic: topic.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-100 rounded-xl"><CalendarPlus size={18} className="text-green-600" /></div>
            <div>
              <h2 className="font-semibold text-gray-900">Tạo lịch hẹn mới</h2>
              <p className="text-xs text-gray-500 mt-0.5">Yêu cầu sẽ được gửi đến bệnh nhân để xác nhận</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
        </div>

        <div className="mx-5 mt-4 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-700">
          <Bell size={13} className="mt-0.5 flex-shrink-0 text-blue-500" />
          <span>Sau khi tạo, hệ thống sẽ gửi thông báo đến bệnh nhân. Lịch hẹn xác nhận khi bệnh nhân đồng ý.</span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh nhân <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                value={patient}
                onChange={e => setPatient(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none pr-8 bg-white"
              >
                {PATIENTS.map(p => (
                  <option key={p.name} value={p.name}>{p.name} — {p.diagnosis}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn <span className="text-red-500">*</span></label>
              <input type="date" value={date} min="2026-06-03" onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ hẹn <span className="text-red-500">*</span></label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức</label>
            <div className="flex gap-3">
              {([['online', 'Online (Video call)', '💻'], ['offline', 'Tại phòng khám', '🏥']] as const).map(([val, label, emoji]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2 transition ${mode === val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề / Mục đích <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="vd: Kiểm tra HbA1c định kỳ, Tái khám sau điều trị..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho bệnh nhân</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Hướng dẫn chuẩn bị, yêu cầu đặc biệt..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Huỷ</button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Bell size={14} /> Gửi yêu cầu đến bệnh nhân
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProposeTimeModalProps {
  appointment: SharedAppt;
  onClose: () => void;
  onSubmit: (date: string, time: string) => void;
}

function ProposeTimeModal({ appointment, onClose, onSubmit }: ProposeTimeModalProps) {
  const [date, setDate] = useState('2026-06-10');
  const [time, setTime] = useState('09:00');

  const handleSubmit = () => {
    const [y, m, d] = date.split('-');
    onSubmit(`${d}/${m}/${y}`, time);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Đề xuất giờ khác</h2>
            <p className="text-xs text-gray-500 mt-0.5">{appointment.patientName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày mới</label>
            <input type="date" value={date} min="2026-06-03" onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mới</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Huỷ</button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700">Gửi đề xuất</button>
        </div>
      </div>
    </div>
  );
}

export function DoctorAppointments() {
  const { appointments, addAppointment, updateStatus, updateAppointment, fileDispute } = useAppointments();

  const [activeTab, setActiveTab] = useState<TabKey>('pending_doctor');
  const [showCreate, setShowCreate] = useState(false);
  const [proposeFor, setProposeFor] = useState<SharedAppt | null>(null);
  const [search, setSearch] = useState('');
  const [simulatingId, setSimulatingId] = useState<number | null>(null);
  const [disputeFor, setDisputeFor] = useState<SharedAppt | null>(null);

  const pendingDoctorCount = appointments.filter(a => a.status === 'pending_doctor').length;
  const pendingPatientCount = appointments.filter(a => a.status === 'pending_patient').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const isPast = (a: SharedAppt) => a.status === 'completed' || a.status === 'disputed' || (a.status === 'cancelled' && !!a.dispute);
  const pastCount = appointments.filter(isPast).length;

  const filtered = appointments.filter(a => {
    const matchTab = activeTab === 'all'
      ? true
      : activeTab === 'past'
      ? isPast(a)
      : a.status === activeTab;
    const matchSearch = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.topic.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Luồng 1: BS duyệt yêu cầu từ BN
  const approve = (id: number) => {
    updateStatus(id, 'confirmed');
    toast.success('Đã duyệt lịch hẹn • Bệnh nhân nhận được thông báo xác nhận', { duration: 4000 });
  };

  const reject = (id: number, name: string) => {
    updateStatus(id, 'rejected');
    toast.info(`Đã từ chối yêu cầu của ${name} • Hệ thống đã gửi thông báo`);
  };

  const proposeNewTime = (appt: SharedAppt, newDate: string, newTime: string) => {
    updateAppointment(appt.id, { date: newDate, time: newTime, status: 'pending_patient', createdBy: 'doctor' });
    setProposeFor(null);
    toast.success(`Đã đề xuất giờ mới cho ${appt.patientName} (${newDate} ${newTime}) • Chờ bệnh nhân xác nhận`, { duration: 4000 });
  };

  // Luồng 2: BS tạo lịch hẹn → gửi cho BN
  const createAppointment = (data: Omit<SharedAppt, 'id' | 'status' | 'createdBy'>) => {
    addAppointment({ ...data, status: 'pending_patient', createdBy: 'doctor' });
    setShowCreate(false);
    setActiveTab('pending_patient');
    toast.success(`Đã gửi yêu cầu lịch hẹn đến ${data.patientName}`, {
      description: `${data.date} lúc ${data.time} • Chờ bệnh nhân xác nhận`,
      duration: 5000,
    });
  };

  const cancelSentRequest = (id: number, name: string) => {
    updateStatus(id, 'cancelled');
    toast.info(`Đã huỷ yêu cầu gửi đến ${name}`);
  };

  // Mô phỏng BN xác nhận (Luồng 2 demo) — cập nhật shared store, patient portal sẽ tự cập nhật
  const simulatePatientConfirm = (id: number, name: string) => {
    setSimulatingId(id);
    setTimeout(() => {
      updateStatus(id, 'confirmed');
      setSimulatingId(null);
      toast.success(`${name} đã xác nhận lịch hẹn!`, { description: 'Trạng thái cập nhật tự động ở cả 2 phía', duration: 4000 });
    }, 1500);
  };

  const cancelConfirmed = (id: number) => {
    updateStatus(id, 'cancelled');
    toast.info('Đã huỷ lịch hẹn đã xác nhận');
  };

  const TABS: { key: TabKey; label: string; count?: number }[] = [
    { key: 'pending_doctor', label: 'Chờ tôi duyệt', count: pendingDoctorCount },
    { key: 'pending_patient', label: 'Chờ bệnh nhân xác nhận', count: pendingPatientCount },
    { key: 'confirmed', label: 'Đã xác nhận', count: confirmedCount },
    { key: 'past', label: 'Đã qua', count: pastCount },
    { key: 'all', label: 'Tất cả' },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
            <p className="text-sm text-gray-500 mt-1">Duyệt yêu cầu từ bệnh nhân và tạo lịch hẹn mới</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm"
          >
            <Plus size={18} /> Tạo lịch hẹn mới
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              {pendingDoctorCount > 0 && (
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {pendingDoctorCount}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingDoctorCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Chờ tôi duyệt</p>
            <p className="text-[11px] text-amber-600 mt-1">Luồng 1: BN đã đặt lịch</p>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Bell size={20} className="text-blue-600" />
              </div>
              {pendingPatientCount > 0 && (
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {pendingPatientCount}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingPatientCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Chờ bệnh nhân xác nhận</p>
            <p className="text-[11px] text-blue-600 mt-1">Luồng 2: Tôi đã tạo lịch</p>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Đã xác nhận</p>
            <p className="text-[11px] text-emerald-600 mt-1">Cả 2 bên đồng ý</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Calendar size={20} className="text-gray-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => !['rejected', 'cancelled'].includes(a.status)).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Tổng lịch hẹn</p>
            <p className="text-[11px] text-gray-400 mt-1">Đang hoạt động</p>
          </div>
        </div>

        {/* Flow explanation */}
        <div className="grid grid-cols-2 gap-4 mb-7">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Bệnh nhân đặt lịch → Bác sĩ duyệt</p>
              <p className="text-xs text-amber-700 mt-0.5">BN gửi yêu cầu qua nút "Đặt lịch tư vấn" • Bạn duyệt • BN nhận thông báo xác nhận</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Bác sĩ tạo lịch → Bệnh nhân xác nhận</p>
              <p className="text-xs text-blue-700 mt-0.5">Bạn tạo lịch hẹn • Hệ thống gửi thông báo • BN xác nhận → trạng thái cập nhật 2 phía</p>
            </div>
          </div>
        </div>

        {/* Search + Tabs + List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex gap-1 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition ${activeTab === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm bệnh nhân, chủ đề..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-52"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không có lịch hẹn nào trong mục này</p>
              </div>
            )}

            {filtered.map(appt => {
              const statusInfo = STATUS_LABEL[appt.status];
              const isSimulating = simulatingId === appt.id;

              return (
                <div key={appt.id} className="px-6 py-5 hover:bg-gray-50/50 transition">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${appt.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                      {appt.mode === 'online' ? <Video size={22} /> : <MapPin size={22} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                          <User size={13} className="text-gray-400" />
                          {appt.patientName}
                        </div>
                        <span className="text-xs text-gray-400">• {appt.patientDiagnosis}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {appt.createdBy === 'patient' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">BN đặt</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">Tôi tạo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 mt-1">{appt.topic}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {appt.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {appt.time}</span>
                        <span>{appt.mode === 'online' ? '💻 Online' : '🏥 Tại phòng khám'}</span>
                      </div>
                      {appt.notes && (
                        <p className="text-xs text-gray-400 mt-1.5 italic">"{appt.notes}"</p>
                      )}
                      {appt.dispute && (
                        <div className={`mt-2 px-3 py-2 rounded-lg border ${appt.dispute.resolution ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                          <p className={`text-[11px] font-medium flex items-center gap-1 ${appt.dispute.resolution ? 'text-gray-700' : 'text-red-700'}`}>
                            <AlertTriangle size={11} /> Khiếu nại {appt.dispute.by === 'patient' ? '(BN gửi)' : '(tôi gửi)'} • {appt.dispute.filedAt}
                          </p>
                          <p className={`text-xs mt-1 ${appt.dispute.resolution ? 'text-gray-700' : 'text-red-800'}`}>{appt.dispute.reason}</p>
                          {appt.dispute.resolution ? (
                            <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                              <p className="text-[11px] text-gray-700">
                                <span className="font-semibold">Quản trị viên đã xử lý:</span>{' '}
                                {appt.dispute.resolution === 'completed' ? (
                                  <span className="text-emerald-700">Công nhận hoàn thành</span>
                                ) : (
                                  <span className="text-red-700">Huỷ lịch hẹn</span>
                                )}
                                {appt.dispute.resolvedAt && <span className="text-gray-400"> • {appt.dispute.resolvedAt}</span>}
                              </p>
                              {appt.dispute.resolutionNote && (
                                <p className="text-[11px] text-gray-600 mt-0.5 italic">"{appt.dispute.resolutionNote}"</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-red-600 mt-1 italic">Đang chờ quản trị viên xử lý</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-end flex-shrink-0">
                      {/* Luồng 1: BN đặt, chờ BS duyệt */}
                      {appt.status === 'pending_doctor' && (
                        <>
                          <button onClick={() => approve(appt.id)} className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> Duyệt lịch
                          </button>
                          <button onClick={() => setProposeFor(appt)} className="px-3.5 py-1.5 border border-blue-300 text-blue-700 text-xs rounded-lg hover:bg-blue-50 transition flex items-center gap-1.5">
                            <Clock size={12} /> Đề xuất giờ khác
                          </button>
                          <button onClick={() => reject(appt.id, appt.patientName)} className="px-3.5 py-1.5 border border-red-300 text-red-600 text-xs rounded-lg hover:bg-red-50 transition flex items-center gap-1.5">
                            <X size={12} /> Từ chối
                          </button>
                        </>
                      )}

                      {/* Luồng 2: BS tạo, chờ BN xác nhận */}
                      {appt.status === 'pending_patient' && (
                        <>
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-lg flex items-center gap-1.5 border border-blue-200">
                            <Clock size={11} /> Đã gửi đến BN
                          </span>
                          <button
                            onClick={() => simulatePatientConfirm(appt.id, appt.patientName)}
                            disabled={isSimulating}
                            className="px-3 py-1.5 border border-emerald-300 text-emerald-700 text-xs rounded-lg hover:bg-emerald-50 transition flex items-center gap-1.5 disabled:opacity-60"
                          >
                            {isSimulating ? (
                              <><RefreshCw size={11} className="animate-spin" /> Đang xử lý...</>
                            ) : (
                              <><RefreshCw size={11} /> Mô phỏng BN xác nhận</>
                            )}
                          </button>
                          <button onClick={() => cancelSentRequest(appt.id, appt.patientName)} className="px-3 py-1.5 border border-red-300 text-red-600 text-xs rounded-lg hover:bg-red-50 transition flex items-center gap-1.5">
                            <X size={12} /> Huỷ yêu cầu
                          </button>
                        </>
                      )}

                      {appt.status === 'confirmed' && (
                        <>
                          {appt.mode === 'online' && (
                            <button onClick={() => toast.info('Chuyển sang trang Tư vấn trực tuyến để bắt đầu')} className="px-3.5 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition flex items-center gap-1.5">
                              <Video size={12} /> Bắt đầu tư vấn
                            </button>
                          )}
                          <button onClick={() => cancelConfirmed(appt.id)} className="px-3.5 py-1.5 border border-red-300 text-red-600 text-xs rounded-lg hover:bg-red-50 transition flex items-center gap-1.5">
                            <X size={12} /> Huỷ lịch
                          </button>
                        </>
                      )}

                      {appt.status === 'completed' && (
                        <>
                          <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200 flex items-center gap-1.5">
                            <CheckCircle2 size={11} /> Đã hoàn thành
                          </span>
                          <button onClick={() => setDisputeFor(appt)} className="px-3 py-1.5 border border-red-300 text-red-600 text-xs rounded-lg hover:bg-red-50 transition flex items-center gap-1.5">
                            <AlertTriangle size={11} /> Báo cáo sự cố
                          </button>
                        </>
                      )}

                      {appt.status === 'disputed' && (
                        <span className="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
                          <AlertTriangle size={11} /> Đang khiếu nại
                        </span>
                      )}

                      {(appt.status === 'rejected' || appt.status === 'cancelled') && (
                        <span className="text-xs text-gray-400 italic">{appt.status === 'rejected' ? 'Đã từ chối' : 'Đã huỷ'}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCreate && <CreateAppointmentModal onClose={() => setShowCreate(false)} onSubmit={createAppointment} />}
      {proposeFor && (
        <ProposeTimeModal
          appointment={proposeFor}
          onClose={() => setProposeFor(null)}
          onSubmit={(date, time) => proposeNewTime(proposeFor, date, time)}
        />
      )}
      <DisputeModal
        open={!!disputeFor}
        onClose={() => setDisputeFor(null)}
        filedBy="doctor"
        apptInfo={disputeFor ? { date: disputeFor.date, time: disputeFor.time, topic: disputeFor.topic, counterpartName: disputeFor.patientName } : { date: '', time: '', topic: '', counterpartName: '' }}
        onSubmit={(reason) => {
          if (!disputeFor) return;
          fileDispute(disputeFor.id, reason, 'doctor');
          toast.success('Đã gửi khiếu nại đến quản trị viên', { description: 'Trạng thái lịch hẹn chuyển sang "Đang khiếu nại"', duration: 4000 });
          setDisputeFor(null);
        }}
      />
    </div>
  );
}
