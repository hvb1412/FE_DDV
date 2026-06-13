import { useState } from 'react';
import {
  Video, Mic, PhoneOff, MessageSquare, FileText, X, CheckCircle, Plus, Trash2,
  Pill, ClipboardList, UserCog, ChevronRight, Clock, User, Activity, Maximize2, Minimize2,
} from 'lucide-react';
import { toast } from 'sonner';

const appointments = [
  { id: 1, patientName: 'Nguyễn Văn A', time: '09:00', diagnosis: 'Tiểu đường type 2', status: 'pending', bmi: '25.8', bp: '140/90', glucose: '126', mainDx: 'Tiểu đường type 2, Tăng huyết áp' },
  { id: 2, patientName: 'Trần Thị B', time: '10:30', diagnosis: 'Tăng huyết áp', status: 'pending', bmi: '27.1', bp: '150/95', glucose: '98', mainDx: 'Tăng huyết áp độ I' },
  { id: 3, patientName: 'Lê Văn C', time: '14:00', diagnosis: 'Cholesterol cao', status: 'pending', bmi: '28.4', bp: '130/85', glucose: '110', mainDx: 'Rối loạn lipid máu' },
  { id: 4, patientName: 'Phạm Thị D', time: '15:30', diagnosis: 'Béo phì', status: 'completed', bmi: '31.2', bp: '125/80', glucose: '105', mainDx: 'Béo phì độ I' },
];

type ModalType = 'note' | 'profile' | 'prescription' | null;

interface Drug {
  id: number;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}

export function DoctorConsultation() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [videoFullscreen, setVideoFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'patient', text: 'Xin chào bác sĩ!' },
    { from: 'doctor', text: '' },
  ]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPrescription, setSavedPrescription] = useState(false);

  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('follow-up');
  const [profileData, setProfileData] = useState({ weight: '72', height: '168', bloodPressure: '140/90', glucose: '126', notes: '' });
  const [drugs, setDrugs] = useState<Drug[]>([{ id: 1, name: '', dose: '', frequency: '', duration: '' }]);
  const [prescriptionNote, setPrescriptionNote] = useState('');

  const selected = appointments.find(a => a.id === selectedId) ?? null;

  const addDrug = () => setDrugs(prev => [...prev, { id: Date.now(), name: '', dose: '', frequency: '', duration: '' }]);
  const removeDrug = (id: number) => {
    const removed = drugs.find(d => d.id === id);
    setDrugs(prev => prev.filter(d => d.id !== id));
    if (removed) toast.message('Đã xoá thuốc', { description: removed.name || 'Thuốc chưa đặt tên', action: { label: 'Hoàn tác', onClick: () => setDrugs(p => [...p, removed]) } });
  };
  const updateDrug = (id: number, field: keyof Drug, value: string) =>
    setDrugs(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));

  const closeModal = () => {
    setActiveModal(null);
    setSavedNote(false);
    setSavedProfile(false);
    setSavedPrescription(false);
  };

  const handleSelect = (id: number) => {
    setSelectedId(prev => prev === id ? null : id);
    setActiveModal(null);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tư vấn trực tuyến</h1>

        <div className={`grid gap-6 ${selected ? 'grid-cols-3' : 'grid-cols-1 max-w-xl'}`}>
          {/* ── Appointment list ── */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Lịch hẹn hôm nay</h2>
            <p className="text-xs text-gray-500 mb-4">Chọn một lịch hẹn để bắt đầu tư vấn</p>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => handleSelect(apt.id)}
                  className={`w-full text-left p-4 border rounded-xl transition-all ${
                    selectedId === apt.id
                      ? 'border-green-500 bg-green-50 ring-1 ring-green-400'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${selectedId === apt.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                        <p className="text-xs text-gray-500">{apt.diagnosis}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Clock size={12} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-600">{apt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {apt.status === 'pending' ? 'Chờ bắt đầu' : 'Hoàn thành'}
                    </span>
                    {selectedId === apt.id ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1"><ChevronRight size={12} /> Đang xem</span>
                    ) : apt.status === 'pending' ? (
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">Nhấn để mở <ChevronRight size={12} /></span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Detail panel (shown only when an appointment is selected) ── */}
          {selected && (
            <div className="col-span-2 space-y-6">
              {/* Patient banner */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{selected.patientName}</p>
                    <p className="text-sm text-white/80">{selected.diagnosis} • {selected.time}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                  <X size={14} />
                </button>
              </div>

              {/* Video room + Chat */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Phòng tư vấn</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Đang chờ bệnh nhân
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-gray-900 rounded-xl flex items-center justify-center mb-5" style={{ height: 260 }}>
                    <div className="text-center">
                      <Video size={56} className="text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Video hiển thị khi bắt đầu cuộc gọi</p>
                    </div>
                    <button
                      onClick={() => setVideoFullscreen(true)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition"
                      title="Phóng to"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button className="p-4 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition hover:scale-105"><Video size={22} /></button>
                    <button className="p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-md transition hover:scale-105"><Mic size={22} /></button>
                    <button className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition hover:scale-105"><PhoneOff size={22} /></button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={18} className="text-green-600" /> Chat tư vấn
                  </h3>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto space-y-3" style={{ minHeight: 200 }}>
                    <div className="flex gap-2">
                      <div className="bg-green-100 text-green-900 px-4 py-2.5 rounded-xl rounded-tl-none max-w-[80%] text-sm">
                        Xin chào bác sĩ!
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-emerald-100 text-emerald-900 px-4 py-2.5 rounded-xl rounded-tr-none max-w-[80%] text-sm">
                        Chào {selected.patientName.split(' ').pop()}! Hôm nay bạn cảm thấy thế nào?
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 font-medium">Gửi</button>
                  </div>
                </div>
              </div>

              {/* Health info + Actions */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" /> Thông tin sức khoẻ — {selected.patientName}
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">BMI</p>
                      <p className="font-bold text-green-900">{selected.bmi}</p>
                      <p className="text-xs text-orange-600 mt-0.5">Thừa cân</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Huyết áp</p>
                      <p className="font-bold text-emerald-900">{selected.bp}</p>
                      <p className="text-xs text-orange-600 mt-0.5">Cao</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Glucose</p>
                      <p className="font-bold text-purple-900">{selected.glucose}</p>
                      <p className="text-xs text-gray-500 mt-0.5">mg/dL</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Activity size={12} /> Chẩn đoán chính</p>
                    <p className="text-sm text-gray-800">{selected.mainDx}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Hành động</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveModal('note')}
                      className="w-full px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-1.5"
                    >
                      <ClipboardList size={14} /> Ghi chú tư vấn
                    </button>
                    <button
                      onClick={() => setActiveModal('profile')}
                      className="w-full px-3 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center justify-center gap-1.5"
                    >
                      <UserCog size={14} /> Cập nhật hồ sơ
                    </button>
                    <button
                      onClick={() => setActiveModal('prescription')}
                      className="w-full px-3 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center justify-center gap-1.5"
                    >
                      <Pill size={14} /> Kê đơn thuốc
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Video fullscreen overlay ── */}
      {videoFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-black/60">
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Đang chờ bệnh nhân</span>
              {selected && <span className="text-gray-400 text-sm">• {selected.patientName}</span>}
            </div>
            <button
              onClick={() => setVideoFullscreen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition"
            >
              <Minimize2 size={15} /> Thu nhỏ
            </button>
          </div>

          {/* Body: video + chat side by side */}
          <div className="flex-1 flex overflow-hidden">
            {/* Video */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Video size={80} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Video hiển thị khi bắt đầu cuộc gọi</p>
                </div>
              </div>
              {/* Controls */}
              <div className="flex items-center justify-center gap-5 py-6 bg-black/60">
                <button className="p-4 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg transition hover:scale-105"><Video size={24} /></button>
                <button className="p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-lg transition hover:scale-105"><Mic size={24} /></button>
                <button className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition hover:scale-105" onClick={() => setVideoFullscreen(false)}><PhoneOff size={24} /></button>
              </div>
            </div>

            {/* Chat panel */}
            <div className="w-80 flex flex-col bg-gray-900 border-l border-white/10">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <MessageSquare size={16} className="text-green-400" />
                <span className="text-white text-sm font-medium">Chat tư vấn</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chatMessages.filter(m => m.text).map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${m.from === 'doctor' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-100 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {chatMessages.filter(m => m.text).length === 0 && (
                  <p className="text-gray-500 text-xs text-center mt-4">Chưa có tin nhắn nào</p>
                )}
              </div>
              <div className="px-3 py-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      setChatMessages(prev => [...prev, { from: 'doctor', text: chatMessage.trim() }]);
                      setChatMessage('');
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                  onClick={() => {
                    if (chatMessage.trim()) {
                      setChatMessages(prev => [...prev, { from: 'doctor', text: chatMessage.trim() }]);
                      setChatMessage('');
                    }
                  }}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {activeModal === 'note' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg"><ClipboardList size={18} className="text-green-600" /></div>
                    <h2 className="text-lg font-semibold text-gray-900">Ghi chú sau tư vấn</h2>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bệnh nhân</p>
                    <p className="text-sm font-medium text-gray-900">{selected?.patientName} — {selected?.diagnosis}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại ghi chú</label>
                    <select value={noteType} onChange={e => setNoteType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                      <option value="follow-up">Tái khám theo dõi</option>
                      <option value="diet">Điều chỉnh chế độ ăn</option>
                      <option value="medication">Điều chỉnh thuốc</option>
                      <option value="urgent">Cần xử lý khẩn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung ghi chú <span className="text-red-500">*</span></label>
                    <textarea rows={5} value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Tóm tắt buổi tư vấn, hướng dẫn tiếp theo..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lịch tái khám tiếp theo</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" defaultValue="2026-06-05" />
                  </div>
                  {savedNote && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      <CheckCircle size={16} /> Ghi chú đã được lưu thành công!
                    </div>
                  )}
                </div>
                <div className="flex gap-3 p-5 border-t border-gray-200">
                  <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
                  <button onClick={() => { setSavedNote(true); toast.success('Đã lưu ghi chú tư vấn'); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Lưu ghi chú</button>
                </div>
              </>
            )}

            {activeModal === 'profile' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg"><UserCog size={18} className="text-emerald-600" /></div>
                    <h2 className="text-lg font-semibold text-gray-900">Cập nhật hồ sơ bệnh nhân</h2>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bệnh nhân</p>
                    <p className="text-sm font-medium text-gray-900">{selected?.patientName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Cân nặng (kg)', key: 'weight', type: 'number' },
                      { label: 'Chiều cao (cm)', key: 'height', type: 'number' },
                      { label: 'Huyết áp', key: 'bloodPressure', type: 'text', placeholder: 'vd: 120/80' },
                      { label: 'Glucose (mg/dL)', key: 'glucose', type: 'number' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={profileData[f.key as keyof typeof profileData]} onChange={e => setProfileData(p => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú bổ sung</label>
                    <textarea rows={3} value={profileData.notes} onChange={e => setProfileData(p => ({ ...p, notes: e.target.value }))} placeholder="Tình trạng sức khỏe mới nhất..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
                  </div>
                  {savedProfile && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                      <CheckCircle size={16} /> Hồ sơ đã được cập nhật thành công!
                    </div>
                  )}
                </div>
                <div className="flex gap-3 p-5 border-t border-gray-200">
                  <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
                  <button onClick={() => { setSavedProfile(true); toast.success('Đã cập nhật hồ sơ bệnh nhân'); }} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Lưu thay đổi</button>
                </div>
              </>
            )}

            {activeModal === 'prescription' && (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-100 rounded-lg"><Pill size={18} className="text-teal-600" /></div>
                    <h2 className="text-lg font-semibold text-gray-900">Kê đơn thuốc</h2>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bệnh nhân</p>
                    <p className="text-sm font-medium text-gray-900">{selected?.patientName} — {selected?.mainDx}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Danh sách thuốc</label>
                      <button onClick={addDrug} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"><Plus size={14} /> Thêm thuốc</button>
                    </div>
                    <div className="space-y-3">
                      {drugs.map((drug, idx) => (
                        <div key={drug.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">Thuốc {idx + 1}</span>
                            {drugs.length > 1 && <button onClick={() => removeDrug(drug.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Tên thuốc" value={drug.name} onChange={e => updateDrug(drug.id, 'name', e.target.value)} className="col-span-2 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-300 bg-white" />
                            <input type="text" placeholder="Liều dùng (vd: 500mg)" value={drug.dose} onChange={e => updateDrug(drug.id, 'dose', e.target.value)} className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-300 bg-white" />
                            <input type="text" placeholder="Tần suất (vd: 2 lần/ngày)" value={drug.frequency} onChange={e => updateDrug(drug.id, 'frequency', e.target.value)} className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-300 bg-white" />
                            <input type="text" placeholder="Thời gian (vd: 30 ngày)" value={drug.duration} onChange={e => updateDrug(drug.id, 'duration', e.target.value)} className="col-span-2 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-300 bg-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lưu ý cho bệnh nhân</label>
                    <textarea rows={3} value={prescriptionNote} onChange={e => setPrescriptionNote(e.target.value)} placeholder="Hướng dẫn sử dụng, tác dụng phụ cần lưu ý..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
                  </div>
                  {savedPrescription && (
                    <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 text-sm">
                      <CheckCircle size={16} /> Đơn thuốc đã được lưu và gửi đến bệnh nhân!
                    </div>
                  )}
                </div>
                <div className="flex gap-3 p-5 border-t border-gray-200">
                  <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
                  <button onClick={() => { setSavedPrescription(true); toast.success('Đã lưu đơn thuốc và gửi tới bệnh nhân'); }} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Lưu & Gửi đơn</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
