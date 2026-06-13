import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, Video, MapPin, Plus, CheckCircle2, X, MessageCircle, FileText, Stethoscope, Info, Mic, MicOff, VideoOff, PhoneOff, Volume2, Wifi, Signal, ShieldCheck, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { BookAppointmentModal } from '@/app/patient/appointments/BookAppointmentModal';
import { DisputeModal } from '@/app/shared/components/DisputeModal';
import { useAppointments, DEMO_PATIENT_NAME, DEMO_PATIENT_DIAGNOSIS, DEMO_DOCTOR_NAME } from '@/app/shared/stores/appointmentStore';

// Mỗi bệnh nhân chỉ có 1 bác sĩ phụ trách duy nhất.
const doctor = {
  name: 'BS. Trần Thị A',
  specialty: 'Dinh dưỡng',
  treating: 'Đái tháo đường type 2',
  avatar: 'A',
  online: true,
  email: 'tran.thi.a@dinhduong.vn',
  phone: '0901 234 567',
};

type DisplayAppt = {
  id: number; date: string; time: string; mode: 'online' | 'offline';
  status: 'confirmed' | 'pending' | 'completed' | 'disputed';
  topic: string; createdBy: 'doctor' | 'patient';
  disputeReason?: string; disputeBy?: 'doctor' | 'patient';
  disputeResolution?: 'completed' | 'cancelled'; disputeResolutionNote?: string; disputeResolvedAt?: string;
};

const UPCOMING_STATUSES = ['confirmed', 'pending_doctor', 'pending_patient'];

export function PatientAppointments() {
  const navigate = useNavigate();
  const { appointments: sharedAppts, updateStatus, addAppointment, fileDispute } = useAppointments();

  const mapStatus = (s: string): DisplayAppt['status'] =>
    s === 'confirmed' ? 'confirmed' : s === 'completed' ? 'completed' : s === 'disputed' ? 'disputed' : 'pending';

  const appointments: DisplayAppt[] = sharedAppts
    .filter(a => a.patientName === DEMO_PATIENT_NAME && UPCOMING_STATUSES.includes(a.status))
    .map(a => ({ id: a.id, date: a.date, time: a.time, mode: a.mode, status: mapStatus(a.status), topic: a.topic, createdBy: a.createdBy }));

  const past: DisplayAppt[] = sharedAppts
    .filter(a => a.patientName === DEMO_PATIENT_NAME && (a.status === 'completed' || a.status === 'disputed' || (a.status === 'cancelled' && a.dispute)))
    .map(a => ({
      id: a.id, date: a.date, time: a.time, mode: a.mode, status: mapStatus(a.status), topic: a.topic, createdBy: a.createdBy,
      disputeReason: a.dispute?.reason,
      disputeBy: a.dispute?.by,
      disputeResolution: a.dispute?.resolution,
      disputeResolutionNote: a.dispute?.resolutionNote,
      disputeResolvedAt: a.dispute?.resolvedAt,
    }));

  const [disputeFor, setDisputeFor] = useState<DisplayAppt | null>(null);

  const [tab, setTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');

  const parseDT = (date: string, time: string) => {
    const [d, m, y] = date.split('/').map(n => parseInt(n, 10));
    const [hh, mm] = time.split(':').map(n => parseInt(n, 10));
    return new Date(y || 0, (m || 1) - 1, d || 1, hh || 0, mm || 0).getTime();
  };
  const sortByDateAsc = <T extends { date: string; time: string }>(arr: T[]) =>
    [...arr].sort((a, b) => parseDT(a.date, a.time) - parseDT(b.date, b.time));

  const confirmedList = sortByDateAsc(appointments.filter(a => a.status === 'confirmed'));
  const pendingList = sortByDateAsc(appointments.filter(a => a.status === 'pending'));
  const [showBook, setShowBook] = useState(false);
  const [room, setRoom] = useState<null | { appt: DisplayAppt; phase: 'lobby' | 'connecting' | 'in-call' }>(null);
  const [roomMic, setRoomMic] = useState(true);
  const [roomCam, setRoomCam] = useState(true);
  const [roomSpeaker, setRoomSpeaker] = useState(true);
  const [roomSec, setRoomSec] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: 'patient' | 'doctor'; text: string; time: string }[]>([
    { from: 'doctor', text: `Chào bạn, mình là ${doctor.name}. Buổi tư vấn bắt đầu ngay nhé.`, time: '—' },
  ]);
  const sendChat = () => {
    const t = chatInput.trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { from: 'patient', text: t, time: now }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'doctor', text: 'Mình đã ghi nhận, sẽ trao đổi thêm trong cuộc gọi nhé.', time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 900);
  };
  const enterRoom = (a: DisplayAppt) => {
    setRoomMic(true); setRoomCam(true); setRoomSpeaker(true); setRoomSec(0);
    setChatOpen(false);
    setRoom({ appt: a, phase: 'lobby' });
  };
  const joinCall = () => {
    setRoom((r) => r ? { ...r, phase: 'connecting' } : r);
    setTimeout(() => setRoom((r) => r ? { ...r, phase: 'in-call' } : r), 1800);
  };
  const leaveRoom = () => {
    if (room?.phase === 'in-call') toast.success(`Kết thúc cuộc gọi • ${String(Math.floor(roomSec / 60)).padStart(2, '0')}:${String(roomSec % 60).padStart(2, '0')}`);
    setRoom(null);
  };
  useEffect(() => {
    if (room?.phase !== 'in-call') return;
    const t = setInterval(() => setRoomSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [room?.phase]);

  const list =
    tab === 'upcoming' ? [...confirmedList, ...pendingList]
    : tab === 'pending' ? pendingList
    : past;

  const openBook = () => setShowBook(true);

  // Luồng 1: BN huỷ yêu cầu của chính mình → cập nhật shared store
  const cancelAppt = (id: number) => {
    updateStatus(id, 'cancelled');
    toast.success('Đã huỷ lịch hẹn');
  };

  // Luồng 2: BN xác nhận lịch hẹn do bác sĩ tạo → cập nhật shared store, bác sĩ tự thấy
  const acceptAppt = (id: number) => {
    updateStatus(id, 'confirmed');
    toast.success('Đã xác nhận lịch hẹn từ bác sĩ');
  };

  const declineAppt = (id: number) => {
    updateStatus(id, 'cancelled');
    toast.success('Đã từ chối lịch hẹn do bác sĩ đề xuất');
  };

  const next = confirmedList[0] ?? pendingList[0];

  return (
    <div className="space-y-6">
      {/* Header banner — gộp giới thiệu + Mẹo nhỏ + CTA */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 rounded-2xl p-4 sm:p-5 text-white shadow-md flex items-center flex-wrap gap-4 sm:gap-5">
        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 text-2xl">
          💡
        </div>
        <div className="flex-1 min-w-[12rem]">
          <h2 className="text-white text-base">Quản lý lịch tư vấn với bác sĩ phụ trách</h2>
          <p className="text-sm text-white/90 mt-1">
            <span className="text-white">Mẹo nhỏ:</span> Chuẩn bị câu hỏi và ghi lại chỉ số sức khoẻ trước cuộc tư vấn để tận dụng tối đa thời gian với bác sĩ.
          </p>
        </div>
        <button onClick={openBook} className="px-4 py-2.5 rounded-lg bg-white text-emerald-700 text-sm flex items-center gap-1.5 hover:bg-emerald-50 flex-shrink-0 shadow-sm">
          <Plus size={16} /> Đặt lịch mới
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Calendar size={18} /></div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Sắp tới</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <p className="text-gray-900" style={{ fontSize: '1.75rem' }}>{appointments.length}</p>
              <p className="text-xs text-gray-500">lịch hẹn</p>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{next ? `Gần nhất: ${next.date.slice(0, 5)} • ${next.time}` : 'Chưa có lịch sắp tới'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white flex-shrink-0">{doctor.name.charAt(4)}</div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 flex items-center gap-1"><Stethoscope size={10} /> Bác sĩ phụ trách</p>
              <p className="text-sm text-gray-900 truncate">{doctor.name}</p>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online • 4.9★</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 flex items-center gap-1"><CheckCircle2 size={10} /> Đã hoàn thành</p>
              <div className="mt-1 flex items-baseline gap-1">
                <p className="text-gray-900" style={{ fontSize: '1.75rem' }}>{past.length}</p>
                <p className="text-xs text-gray-500">/ {past.length + appointments.length}</p>
              </div>
              <p className="text-[11px] text-violet-700 mt-0.5">{appointments.length + past.length > 0 ? Math.round((past.length / (past.length + appointments.length)) * 100) : 0}% tiến độ tổng</p>
            </div>
            {(() => {
              const total = past.length + appointments.length;
              const pct = total > 0 ? past.length / total : 0;
              const R = 22, C = 2 * Math.PI * R;
              return (
                <svg width="56" height="56" viewBox="0 0 56 56" className="flex-shrink-0">
                  <circle cx="28" cy="28" r={R} stroke="#ede9fe" strokeWidth="6" fill="none" />
                  <circle
                    cx="28" cy="28" r={R}
                    stroke="#7c3aed" strokeWidth="6" fill="none" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
                    transform="rotate(-90 28 28)"
                  />
                  <text x="28" y="32" textAnchor="middle" fontSize="13" fill="#5b21b6">{Math.round(pct * 100)}%</text>
                </svg>
              );
            })()}
          </div>
        </div>
        {next ? (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md">
            <p className="text-xs text-white/90">Lần tiếp theo</p>
            <p className="text-white mt-1">{next.date.slice(0, 5)} • {next.time}</p>
            <button onClick={() => next.mode === 'online' ? enterRoom(next) : toast.info('Cuộc hẹn tại phòng khám — hãy đến trực tiếp')} className="text-xs text-white/90 mt-1 hover:underline">
              {next.mode === 'online' ? 'Vào phòng' : 'Xem chi tiết'} →
            </button>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center text-sm text-gray-500">Chưa có lịch sắp tới</div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: list (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto max-w-full">
            <button onClick={() => setTab('upcoming')} className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap flex-shrink-0 ${tab === 'upcoming' ? 'bg-white text-emerald-600 shadow' : 'text-gray-600'}`}>
              Sắp tới ({confirmedList.length})
            </button>
            <button onClick={() => setTab('pending')} className={`px-4 py-1.5 rounded-md text-sm inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${tab === 'pending' ? 'bg-white text-amber-600 shadow' : 'text-gray-600'}`}>
              Chờ xác nhận
              <span className={`px-1.5 rounded-md text-[11px] ${tab === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>{pendingList.length}</span>
            </button>
            <button onClick={() => setTab('past')} className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap flex-shrink-0 ${tab === 'past' ? 'bg-white text-emerald-600 shadow' : 'text-gray-600'}`}>
              Đã qua ({past.length})
            </button>
          </div>

          <div className="space-y-3">
            {list.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500 text-sm">
                Chưa có lịch hẹn nào trong mục này
              </div>
            )}
            {list.map((a: any) => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4 flex-wrap">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${a.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                    {a.mode === 'online' ? <Video size={24} /> : <MapPin size={24} />}
                  </div>
                  <div className="flex-1 min-w-[12rem]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900">{doctor.name}</p>
                      <span className="text-xs text-gray-500">• {doctor.specialty}</span>
                      {tab !== 'past' && (
                        a.status === 'confirmed' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Đã xác nhận</span>
                        ) : a.createdBy === 'doctor' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Bác sĩ đề xuất • Chờ bạn xác nhận</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Chờ bác sĩ xác nhận</span>
                        )
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{a.topic}</p>
                    {tab === 'past' && a.disputeReason && (
                      <div className={`mt-2 px-2.5 py-2 rounded-md border ${a.disputeResolution ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                        <p className={`text-[11px] ${a.disputeResolution ? 'text-gray-700' : 'text-red-700'}`}>
                          <span className="font-semibold">Khiếu nại {a.disputeBy === 'patient' ? '(do bạn gửi)' : '(do bác sĩ gửi)'}:</span> {a.disputeReason}
                        </p>
                        {a.disputeResolution && (
                          <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                            <p className="text-[11px] text-gray-700">
                              <span className="font-semibold">Kết quả từ quản trị viên:</span>{' '}
                              {a.disputeResolution === 'completed' ? (
                                <span className="text-emerald-700">Buổi tư vấn được công nhận hoàn thành</span>
                              ) : (
                                <span className="text-red-700">Lịch hẹn bị huỷ — không tính phí</span>
                              )}
                              {a.disputeResolvedAt && <span className="text-gray-400"> • {a.disputeResolvedAt}</span>}
                            </p>
                            {a.disputeResolutionNote && (
                              <p className="text-[11px] text-gray-600 mt-0.5 italic">"{a.disputeResolutionNote}"</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {a.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {a.time}</span>
                      <span>{a.mode === 'online' ? '💻 Online' : '🏥 Tại phòng khám'}</span>
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap sm:flex-col gap-2 items-stretch sm:items-end w-full sm:w-auto">
                    {tab !== 'past' ? (
                      a.status === 'pending' && a.createdBy === 'doctor' ? (
                        <>
                          <button onClick={() => acceptAppt(a.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs flex items-center gap-1 hover:bg-emerald-700">
                            <CheckCircle2 size={12} /> Xác nhận
                          </button>
                          <button onClick={openBook} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs hover:bg-gray-50">Đề xuất giờ khác</button>
                          <button onClick={() => declineAppt(a.id)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs flex items-center gap-1 hover:bg-red-50">
                            <X size={12} /> Từ chối
                          </button>
                        </>
                      ) : a.status === 'pending' && a.createdBy === 'patient' ? (
                        <>
                          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs flex items-center gap-1">
                            <Clock size={12} /> Đang chờ bác sĩ
                          </span>
                          <button onClick={() => cancelAppt(a.id)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs flex items-center gap-1 hover:bg-red-50">
                            <X size={12} /> Huỷ yêu cầu
                          </button>
                        </>
                      ) : (
                        <>
                          {a.mode === 'online' && (
                            <button onClick={() => enterRoom(a)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs flex items-center gap-1 hover:bg-emerald-700">
                              <Video size={12} /> Vào phòng
                            </button>
                          )}
                          <button onClick={openBook} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs hover:bg-gray-50">Đổi lịch</button>
                          <button onClick={() => cancelAppt(a.id)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs flex items-center gap-1 hover:bg-red-50">
                            <X size={12} /> Huỷ
                          </button>
                        </>
                      )
                    ) : (
                      <>
                        {a.status === 'disputed' ? (
                          <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1 border border-red-200">
                            <AlertTriangle size={12} /> Đang khiếu nại
                          </span>
                        ) : (
                          <button onClick={() => setDisputeFor(a)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs flex items-center gap-1 hover:bg-red-50">
                            <AlertTriangle size={12} /> Báo cáo sự cố
                          </button>
                        )}
                        <button onClick={() => toast.info(`Ghi chú từ ${doctor.name} đang được tải...`)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center gap-1 hover:bg-emerald-100">
                          <FileText size={12} /> Xem ghi chú
                        </button>
                        <button onClick={openBook} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs">Đặt lại</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: assigned doctor card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <Stethoscope size={16} className="text-emerald-600" />
              <p className="text-sm text-gray-900">Bác sĩ phụ trách của bạn</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white flex-shrink-0" style={{ fontSize: '1.25rem' }}>
                  {doctor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">{doctor.name}</p>
                  <p className="text-xs text-gray-500">Chuyên khoa {doctor.specialty}</p>
                  <p className={`text-[11px] mt-0.5 ${doctor.online ? 'text-emerald-600' : 'text-gray-400'}`}>● {doctor.online ? 'Đang online' : 'Offline'}</p>
                </div>
              </div>
              <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-50/60">
                <p className="text-[11px] text-gray-600">Đang theo dõi</p>
                <p className="text-sm text-emerald-700">{doctor.treating}</p>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p>📧 {doctor.email}</p>
                <p>📞 {doctor.phone}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate('/p/chat')} className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm flex items-center justify-center gap-1.5 hover:bg-emerald-700">
                  <MessageCircle size={14} /> Nhắn tin
                </button>
                <button onClick={openBook} className="flex-1 px-3 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm flex items-center justify-center gap-1.5 hover:bg-emerald-50">
                  <Calendar size={14} /> Đặt lịch
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center flex-shrink-0 shadow">
                <Info size={18} />
              </div>
              <div className="flex-1">
                <p className="text-amber-900 font-semibold text-sm mb-1">Lưu ý quan trọng</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Bệnh nhân chỉ được phân công <span className="font-semibold">1 bác sĩ phụ trách duy nhất</span>. Mọi trao đổi và đặt lịch đều thực hiện với bác sĩ này. Nếu cần đổi bác sĩ, vui lòng liên hệ chăm sóc khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Book modal */}
      <BookAppointmentModal
        open={showBook}
        onClose={() => setShowBook(false)}
        doctor={{ name: doctor.name, specialty: doctor.specialty, avatar: doctor.avatar }}
        onConfirm={(appt) => {
          // Luồng 1: Ghi vào shared store → bác sĩ thấy ngay ở tab "Chờ tôi duyệt"
          addAppointment({
            patientName: DEMO_PATIENT_NAME,
            patientDiagnosis: DEMO_PATIENT_DIAGNOSIS,
            doctorName: DEMO_DOCTOR_NAME,
            date: appt.date,
            time: appt.time,
            mode: appt.mode,
            status: 'pending_doctor',
            topic: appt.topic || 'Tư vấn dinh dưỡng',
            createdBy: 'patient',
            notes: '',
          });
        }}
      />

      <DisputeModal
        open={!!disputeFor}
        onClose={() => setDisputeFor(null)}
        apptInfo={disputeFor ? { date: disputeFor.date, time: disputeFor.time, topic: disputeFor.topic, counterpartName: doctor.name } : { date: '', time: '', topic: '', counterpartName: '' }}
        filedBy="patient"
        onSubmit={(reason) => {
          if (!disputeFor) return;
          fileDispute(disputeFor.id, reason, 'patient');
          setDisputeFor(null);
          toast.success('Đã gửi khiếu nại đến quản trị viên');
        }}
      />

      {/* Consultation room modal */}
      {room && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full overflow-hidden border border-slate-700 transition-[max-width] ${chatOpen && room.phase === 'in-call' ? 'max-w-6xl' : 'max-w-4xl'}`}>
            <div className="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm">Phòng tư vấn online</p>
                  <p className="text-xs text-white/60 truncate">{room.appt.topic} • {room.appt.date} {room.appt.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/70 flex-shrink-0">
                {room.phase === 'in-call' && <span className="px-2 py-0.5 rounded-md bg-white/10">{String(Math.floor(roomSec / 60)).padStart(2, '0')}:{String(roomSec % 60).padStart(2, '0')}</span>}
                <span className="hidden sm:flex items-center gap-1"><Signal size={12} /> Tốt</span>
                <span className="hidden sm:flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> Mã hoá</span>
                <button onClick={leaveRoom} className="p-1.5 rounded-md hover:bg-white/10"><X size={16} /></button>
              </div>
            </div>

            {room.phase === 'lobby' && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="aspect-video rounded-xl bg-slate-700 flex items-center justify-center relative overflow-hidden">
                  {roomCam ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white" style={{ fontSize: '2rem' }}>B</div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 text-white text-xs">Bạn (xem trước)</span>
                    </>
                  ) : (
                    <div className="text-white/60 flex flex-col items-center gap-2">
                      <VideoOff size={32} /> <p className="text-xs">Camera đang tắt</p>
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <p className="text-sm text-white/70">Bạn sắp gặp</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">{doctor.avatar}</div>
                    <div>
                      <p>{doctor.name}</p>
                      <p className="text-xs text-white/60">{doctor.specialty} • {doctor.treating}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/60">Kiểm tra thiết bị</p>
                    <div className="flex gap-2">
                      <button onClick={() => setRoomMic(!roomMic)} className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm ${roomMic ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-900'}`}>
                        {roomMic ? <Mic size={14} /> : <MicOff size={14} />} {roomMic ? 'Mic bật' : 'Mic tắt'}
                      </button>
                      <button onClick={() => setRoomCam(!roomCam)} className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm ${roomCam ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-900'}`}>
                        {roomCam ? <Video size={14} /> : <VideoOff size={14} />} {roomCam ? 'Cam bật' : 'Cam tắt'}
                      </button>
                    </div>
                    <div className="text-xs text-white/60 flex items-center gap-1.5 mt-2"><Wifi size={12} className="text-emerald-400" /> Kết nối ổn định • 32 Mbps</div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button onClick={leaveRoom} className="px-4 py-2.5 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10">Thoát</button>
                    <button onClick={joinCall} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center justify-center gap-1.5">
                      <Video size={14} /> Tham gia phòng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {room.phase !== 'lobby' && (
              <>
                <div className="flex">
                  <div className={`relative bg-slate-950 flex items-center justify-center ${chatOpen && room.phase === 'in-call' ? 'flex-1 min-h-[420px]' : 'w-full aspect-video'}`}>
                    {room.phase === 'connecting' ? (
                      <div className="text-white flex flex-col items-center gap-3">
                        <div className="relative">
                          <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center" style={{ fontSize: '1.75rem' }}>{doctor.avatar}</div>
                        </div>
                        <p>Đang kết nối với {doctor.name}...</p>
                        <p className="text-xs text-white/60">Vui lòng giữ kết nối ổn định</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white" style={{ fontSize: '2.5rem' }}>{doctor.avatar}</div>
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/50 text-white text-xs">{doctor.name}</span>
                        <div className="absolute bottom-3 right-3 w-36 h-24 rounded-lg bg-slate-700 border-2 border-white/20 flex items-center justify-center text-white text-xs">
                          {roomCam ? 'Bạn' : <VideoOff size={20} />}
                        </div>
                      </>
                    )}
                  </div>
                  {chatOpen && room.phase === 'in-call' && (
                    <aside className="w-full sm:w-80 flex flex-col bg-slate-900 border-l border-white/10">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <MessageCircle size={16} className="text-emerald-400" /> Chat trong phòng
                        </div>
                        <button onClick={() => setChatOpen(false)} className="p-1 rounded hover:bg-white/10 text-white/70">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[420px]">
                        {chatMessages.map((m, i) => (
                          <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${m.from === 'patient' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                              <p className="leading-relaxed">{m.text}</p>
                              <p className={`text-[10px] mt-0.5 ${m.from === 'patient' ? 'text-emerald-100/80' : 'text-white/50'}`}>{m.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-white/10 flex items-center gap-2">
                        <input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
                          placeholder="Nhắn cho bác sĩ..."
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                        <button onClick={sendChat} className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center">
                          <Send size={14} />
                        </button>
                      </div>
                    </aside>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 py-4 bg-black/40">
                  <button onClick={() => setRoomMic(!roomMic)} title={roomMic ? 'Tắt mic' : 'Bật mic'} className={`w-12 h-12 rounded-full flex items-center justify-center ${!roomMic ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                    {roomMic ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button onClick={() => setRoomCam(!roomCam)} title={roomCam ? 'Tắt cam' : 'Bật cam'} className={`w-12 h-12 rounded-full flex items-center justify-center ${!roomCam ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                    {roomCam ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button onClick={() => setRoomSpeaker(!roomSpeaker)} title="Loa" className={`w-12 h-12 rounded-full flex items-center justify-center ${!roomSpeaker ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                    <Volume2 size={20} />
                  </button>
                  <button
                    onClick={() => setChatOpen(o => !o)}
                    title="Chat trong cuộc gọi"
                    disabled={room.phase !== 'in-call'}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center ${chatOpen ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'} disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <MessageCircle size={20} />
                    {!chatOpen && chatMessages.some(m => m.from === 'doctor') && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                    )}
                  </button>
                  <button onClick={leaveRoom} title="Kết thúc" className="px-5 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5">
                    <PhoneOff size={20} /> Rời phòng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
