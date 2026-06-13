import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Send, Paperclip, Image as ImageIcon, Smile, Phone, Video, CheckCheck, Calendar, Search, MoreVertical, Pin, X, Mic, MicOff, VideoOff, PhoneOff, Volume2, BellOff, Trash2, Flag, FileText, Mail, MapPin, Award, Clock } from 'lucide-react';
import { BookAppointmentModal } from '@/app/patient/appointments/BookAppointmentModal';

type Msg = { id: number; from: 'me' | 'doctor'; text: string; time: string; read?: boolean };
type CallMode = 'voice' | 'video';

const initialMsgs: Msg[] = [
  { id: 1, from: 'doctor', text: 'Chào Minh, hôm nay em cảm thấy thế nào?', time: '09:15' },
  { id: 2, from: 'me', text: 'Dạ chào bác sĩ, em vẫn ổn. Sáng nay em đo đường huyết 5.6 mmol/L ạ.', time: '09:18', read: true },
  { id: 3, from: 'doctor', text: 'Tốt lắm, chỉ số ổn định. Em nhớ uống thuốc đầy đủ và đi bộ 30 phút mỗi ngày nhé.', time: '09:20' },
  { id: 4, from: 'doctor', text: 'Tuần sau mình hẹn tái khám online vào thứ 3 lúc 15:00 nhé?', time: '09:20' },
  { id: 5, from: 'me', text: 'Vâng ạ, em sẽ đặt lịch luôn.', time: '09:22', read: true },
];

const contacts = [
  { id: 'doctor', name: 'BS. Trần Thị A', role: 'Bác sĩ phụ trách — Dinh dưỡng', last: 'Tuần sau mình hẹn tái khám...', time: '09:20', unread: 0, online: true, pinned: true },
  { id: 'support', name: 'Hỗ trợ Dinh Dưỡng Việt', role: 'Chăm sóc khách hàng', last: 'Cảm ơn bạn đã phản hồi', time: '3 ngày', unread: 0, online: true, pinned: false },
];

export function PatientChat() {
  const [selectedId, setSelectedId] = useState('doctor');
  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [call, setCall] = useState<{ mode: CallMode; state: 'ringing' | 'in-call' } | null>(null);
  const [callSec, setCallSec] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [muteUntil, setMuteUntil] = useState<number | null>(null);
  const [muteOpen, setMuteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [inChatSearch, setInChatSearch] = useState(false);
  const [inChatQuery, setInChatQuery] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const contact = contacts.find((c) => c.id === selectedId)!;
  const muteNotif = muteUntil !== null && (muteUntil === 0 || muteUntil > Date.now());
  const formatMuteUntil = () => {
    if (muteUntil === 0) return 'Đến khi bật lại';
    if (!muteUntil) return '';
    const d = new Date(muteUntil);
    const sameDay = d.toDateString() === new Date().toDateString();
    return sameDay ? `đến ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` : `đến ${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (call?.state !== 'in-call') return;
    const t = setInterval(() => setCallSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [call?.state]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { id: Date.now(), from: 'me', text: input, time: 'Vừa xong', read: false }]);
    setInput('');
  };

  const startCall = (mode: CallMode) => {
    setCallSec(0);
    setMuted(false);
    setCamOff(false);
    setCall({ mode, state: 'ringing' });
    setTimeout(() => {
      setCall((c) => (c ? { ...c, state: 'in-call' } : null));
    }, 2200);
  };

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const endCall = () => {
    if (call?.state === 'in-call') {
      toast.success(`Đã kết thúc cuộc gọi • ${formatSec(callSec)}`);
    } else {
      toast('Đã huỷ cuộc gọi');
    }
    setCall(null);
  };

  const menuActions = [
    { icon: FileText, label: 'Xem hồ sơ bác sĩ', action: () => setProfileOpen(true) },
    { icon: Search, label: 'Tìm trong cuộc trò chuyện', action: () => { setInChatSearch(true); setInChatQuery(''); } },
    { icon: BellOff, label: muteNotif ? 'Bật lại thông báo' : 'Tắt thông báo', action: () => { if (muteNotif) { setMuteUntil(null); toast.success('Đã bật lại thông báo'); } else { setMuteOpen(true); } } },
    { icon: Flag, label: 'Báo cáo', action: () => { setReportOpen(true); setReportReason(''); setReportDetail(''); } },
    { icon: Trash2, label: 'Xoá lịch sử trò chuyện', danger: true, action: () => setConfirmClear(true) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-160px)] lg:h-[calc(100vh-112px)]">
      {/* Contacts list */}
      <div className="hidden lg:flex lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-900 mb-3">Tin nhắn</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm cuộc trò chuyện..."
              className="w-full pl-8 pr-8 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(() => {
            const q = search.trim().toLowerCase();
            const filtered = contacts.filter((c) =>
              !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.last.toLowerCase().includes(q)
            );
            if (filtered.length === 0) {
              return (
                <div className="px-4 py-8 text-center text-xs text-gray-500">
                  <Search size={20} className="mx-auto text-gray-300 mb-2" />
                  Không tìm thấy cuộc trò chuyện nào
                </div>
              );
            }
            return filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center gap-3 p-3 text-left border-b border-gray-50 transition ${
                selectedId === c.id ? 'bg-emerald-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white">
                  {c.name.replace(/^(BS\.|Điều dưỡng|Hỗ trợ)\s*/, '').charAt(0)}
                </div>
                {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm text-gray-900 truncate flex items-center gap-1">
                    {c.pinned && <Pin size={10} className="text-gray-400" />}
                    {c.name}
                  </p>
                  <p className="text-[10px] text-gray-500 flex-shrink-0">{c.time}</p>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-gray-500 truncate">{c.last}</p>
                  {c.unread > 0 && (
                    <span className="ml-2 min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center px-1">{c.unread}</span>
                  )}
                </div>
              </div>
            </button>
            ));
          })()}
        </div>
      </div>

      {/* Chat window */}
      <div className="col-span-1 lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-5 py-3 border-b border-gray-100 flex items-center gap-2 sm:gap-3 relative">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white">
              {contact.name.charAt(4)}
            </div>
            {contact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 flex items-center gap-1.5 truncate">
              <span className="truncate">{contact.name}</span>
              {muteNotif && <span className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0"><BellOff size={12} /> {formatMuteUntil()}</span>}
            </p>
            <p className="text-xs text-emerald-600 truncate">● {contact.online ? 'Đang online' : 'Offline'} • {contact.role}</p>
          </div>
          <button onClick={() => startCall('voice')} title="Gọi thoại" className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition flex-shrink-0"><Phone size={18} /></button>
          <button onClick={() => startCall('video')} title="Gọi video" className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition flex-shrink-0"><Video size={18} /></button>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen((v) => !v)} className={`p-2 rounded-lg transition ${menuOpen ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`}><MoreVertical size={18} /></button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-20">
                {menuActions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => { a.action(); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-gray-50 ${a.danger ? 'text-red-600' : 'text-gray-700'}`}
                  >
                    <a.icon size={15} />
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* In-chat search bar */}
        {inChatSearch && (
          <div className="px-4 py-2 border-b border-gray-100 bg-amber-50/40 flex items-center gap-2">
            <Search size={14} className="text-gray-500 flex-shrink-0" />
            <input
              autoFocus
              value={inChatQuery}
              onChange={(e) => setInChatQuery(e.target.value)}
              placeholder="Tìm trong cuộc trò chuyện..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            {inChatQuery && (
              <span className="text-[11px] text-gray-500">
                {msgs.filter((m) => m.text.toLowerCase().includes(inChatQuery.toLowerCase())).length} kết quả
              </span>
            )}
            <button onClick={() => { setInChatSearch(false); setInChatQuery(''); }} className="p-1 rounded hover:bg-gray-200 text-gray-500"><X size={14} /></button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
          <p className="text-center text-xs text-gray-400">Hôm nay</p>
          {(() => {
            const q = inChatQuery.trim().toLowerCase();
            const visible = q ? msgs.filter((m) => m.text.toLowerCase().includes(q)) : msgs;
            if (q && visible.length === 0) {
              return <p className="text-center text-xs text-gray-500 py-6">Không tìm thấy tin nhắn nào khớp “{inChatQuery}”</p>;
            }
            return visible.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {m.from === 'doctor' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs mr-2 self-end">A</div>
              )}
              <div className={`max-w-[80%] sm:max-w-[60%] ${m.from === 'me' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-900 border border-gray-100'} rounded-2xl px-4 py-2 shadow-sm`}>
                <p className="text-sm">
                  {q ? m.text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, i) =>
                    part.toLowerCase() === q ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark> : part
                  ) : m.text}
                </p>
                <p className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${m.from === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                  {m.time}
                  {m.from === 'me' && <CheckCheck size={12} />}
                </p>
              </div>
            </div>
            ));
          })()}
          {/* Quick action card */}
          {msgs.length > 0 && !inChatQuery && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs mr-2 self-end">A</div>
              <div className="max-w-[80%] sm:max-w-[60%] bg-white border border-emerald-200 rounded-2xl p-3 shadow-sm">
                <p className="text-xs text-emerald-700">📅 Đề xuất từ bác sĩ</p>
                <p className="text-sm text-gray-900 mt-1">Đặt lịch tái khám online — Thứ 3, 15:00</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => toast.success('Đã xác nhận lịch hẹn')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs flex items-center gap-1.5 hover:bg-emerald-700">
                    <Calendar size={12} /> Xác nhận
                  </button>
                  <button onClick={() => toast('Đã gửi yêu cầu đổi giờ')} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs">Đổi giờ</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 px-2 sm:px-3 py-3 flex items-center gap-1 sm:gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex-shrink-0 hidden sm:inline-flex"><Paperclip size={18} /></button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex-shrink-0"><ImageIcon size={18} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 min-w-0 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg flex-shrink-0 hidden sm:inline-flex"><Smile size={18} /></button>
          <button onClick={send} className="px-3 sm:px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 text-sm flex-shrink-0">
            <Send size={14} /> <span className="hidden sm:inline">Gửi</span>
          </button>
        </div>
      </div>

      {/* Info panel */}
      <div className="hidden lg:block lg:col-span-3 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 mx-auto flex items-center justify-center text-white" style={{ fontSize: '1.5rem' }}>
            A
          </div>
          <p className="text-gray-900 mt-3">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.role}</p>
          <p className="text-xs text-emerald-600 mt-1">● Đang online</p>
          <div className="flex justify-center gap-2 mt-3">
            <button onClick={() => startCall('voice')} title="Gọi thoại" className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"><Phone size={16} /></button>
            <button onClick={() => startCall('video')} title="Gọi video" className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"><Video size={16} /></button>
            {selectedId === 'doctor' && (
              <button onClick={() => setBookOpen(true)} title="Đặt lịch hẹn" className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"><Calendar size={16} /></button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-900 mb-2">Lịch hẹn sắp tới</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-xs text-emerald-700">Thứ 3, 26/05 • 15:00</p>
            <p className="text-sm text-gray-900 mt-1">Tái khám online</p>
            <button onClick={() => navigate('/p/appointments')} className="text-xs text-emerald-600 mt-2 hover:underline">Xem chi tiết →</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-900 mb-2">Tệp đã chia sẻ</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-600 text-xs">PDF</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 truncate">Ket-qua-xet-nghiem.pdf</p>
                <p className="text-[10px] text-gray-500">18/05</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 text-xs">IMG</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 truncate">don-thuoc-15-5.jpg</p>
                <p className="text-[10px] text-gray-500">15/05</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor profile modal */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setProfileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="relative h-28 bg-gradient-to-br from-emerald-400 to-green-600">
              <button onClick={() => setProfileOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center z-10"><X size={16} /></button>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border-4 border-white shadow-lg flex items-center justify-center text-white" style={{ fontSize: '2rem' }}>
                {contact.name.charAt(4)}
              </div>
            </div>
            <div className="px-5 pb-5 pt-14 text-center">
              <p className="text-gray-900">{contact.name}</p>
              <p className="text-xs text-gray-500">{contact.role}</p>
              <div className="mt-4 space-y-2 text-sm text-left bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-gray-700"><Award size={14} className="text-emerald-600 flex-shrink-0" /> Thạc sĩ Dinh dưỡng — ĐH Y Hà Nội</div>
                <div className="flex items-center gap-2 text-gray-700"><Clock size={14} className="text-emerald-600 flex-shrink-0" /> 12 năm kinh nghiệm</div>
                <div className="flex items-center gap-2 text-gray-700"><MapPin size={14} className="text-emerald-600 flex-shrink-0" /> Phòng khám Dinh Dưỡng Việt — Q. Cầu Giấy</div>
                <div className="flex items-center gap-2 text-gray-700"><Mail size={14} className="text-emerald-600 flex-shrink-0" /> bs.tranthia@dinhduongviet.vn</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 rounded-lg py-2">
                  <p className="text-emerald-700">4.9★</p>
                  <p className="text-[10px] text-gray-500">Đánh giá</p>
                </div>
                <div className="bg-emerald-50 rounded-lg py-2">
                  <p className="text-emerald-700">320+</p>
                  <p className="text-[10px] text-gray-500">Bệnh nhân</p>
                </div>
                <div className="bg-emerald-50 rounded-lg py-2">
                  <p className="text-emerald-700">8h–18h</p>
                  <p className="text-[10px] text-gray-500">Làm việc</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                Chuyên tư vấn dinh dưỡng cho bệnh nhân tiểu đường, tim mạch và rối loạn chuyển hoá. Tận tâm theo dõi từng chỉ số của bệnh nhân.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mute duration modal */}
      {muteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setMuteOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center"><BellOff size={18} /></div>
                <div>
                  <p className="text-sm text-gray-900">Tắt thông báo</p>
                  <p className="text-xs text-gray-500">Chọn khoảng thời gian</p>
                </div>
              </div>
              <button onClick={() => setMuteOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
            </div>
            <div className="p-3 space-y-1">
              {([
                { label: 'Trong 30 phút', ms: 30 * 60 * 1000 },
                { label: 'Trong 1 giờ', ms: 60 * 60 * 1000 },
                { label: 'Trong 8 giờ', ms: 8 * 60 * 60 * 1000 },
                { label: 'Trong 24 giờ', ms: 24 * 60 * 60 * 1000 },
                { label: 'Cho đến khi tôi bật lại', ms: 0 },
              ] as const).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setMuteUntil(opt.ms === 0 ? 0 : Date.now() + opt.ms);
                    setMuteOpen(false);
                    toast.success(`Đã tắt thông báo ${opt.label.toLowerCase()}`);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setReportOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Flag size={18} /></div>
                <div>
                  <p className="text-sm text-gray-900">Báo cáo cuộc trò chuyện</p>
                  <p className="text-xs text-gray-500">Báo cáo sẽ được hệ thống xem xét trong 24h</p>
                </div>
              </div>
              <button onClick={() => setReportOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-gray-600">Lý do báo cáo</p>
              <div className="space-y-1.5">
                {['Nội dung không phù hợp', 'Lừa đảo / mạo danh', 'Quấy rối', 'Spam quảng cáo', 'Khác'].map((r) => (
                  <label key={r} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${reportReason === r ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input type="radio" name="report-reason" checked={reportReason === r} onChange={() => setReportReason(r)} className="accent-rose-600" />
                    {r}
                  </label>
                ))}
              </div>
              <textarea
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value)}
                rows={3}
                placeholder="Mô tả chi tiết (không bắt buộc)..."
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setReportOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Huỷ</button>
              <button
                onClick={() => {
                  if (!reportReason) { toast.error('Vui lòng chọn lý do'); return; }
                  toast.success('Đã gửi báo cáo. Cảm ơn bạn!');
                  setReportOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm clear history */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setConfirmClear(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><Trash2 size={20} /></div>
              <p className="text-center text-gray-900 mt-3">Xoá toàn bộ lịch sử?</p>
              <p className="text-center text-xs text-gray-500 mt-1">Hành động này không thể hoàn tác. Tin nhắn sẽ bị xoá khỏi thiết bị của bạn.</p>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setConfirmClear(false)} className="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Huỷ</button>
              <button
                onClick={() => { setMsgs([]); setConfirmClear(false); toast.success('Đã xoá lịch sử'); }}
                className="px-4 py-2 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking modal */}
      <BookAppointmentModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        doctor={{ name: contact.name, specialty: 'Dinh dưỡng', avatar: contact.name.charAt(4) }}
      />

      {/* Call modal */}
      {call && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl ${call.mode === 'video' ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-black' : 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900'}`}>
            {call.mode === 'video' && (
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                {!camOff ? (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white" style={{ fontSize: '3rem' }}>
                    {contact.name.charAt(4)}
                  </div>
                ) : (
                  <div className="text-white/60 flex flex-col items-center gap-2">
                    <VideoOff size={48} />
                    <p className="text-sm">Đối phương đã tắt camera</p>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 w-32 h-24 rounded-lg bg-slate-700 border-2 border-white/20 flex items-center justify-center text-white text-xs">
                  {camOff ? <VideoOff size={20} /> : 'Bạn'}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {call.state === 'ringing' ? 'Đang kết nối...' : formatSec(callSec)}
                </div>
              </div>
            )}

            {call.mode === 'voice' && (
              <div className="py-12 flex flex-col items-center text-white">
                <div className="relative">
                  {call.state === 'ringing' && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                      <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                    </>
                  )}
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center" style={{ fontSize: '3rem' }}>
                    {contact.name.charAt(4)}
                  </div>
                </div>
                <p className="mt-5 text-lg">{contact.name}</p>
                <p className="text-sm text-white/70 mt-1">
                  {call.state === 'ringing' ? 'Đang đổ chuông...' : `Đang gọi • ${formatSec(callSec)}`}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 py-5 bg-black/30 backdrop-blur-sm">
              <button
                onClick={() => setMuted(!muted)}
                title={muted ? 'Bật mic' : 'Tắt mic'}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${muted ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                {muted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              {call.mode === 'video' && (
                <button
                  onClick={() => setCamOff(!camOff)}
                  title={camOff ? 'Bật camera' : 'Tắt camera'}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${camOff ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}
                >
                  {camOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              )}
              <button
                onClick={() => setSpeaker(!speaker)}
                title="Loa ngoài"
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${!speaker ? 'bg-white text-slate-900' : 'bg-white/15 text-white hover:bg-white/25'}`}
              >
                <Volume2 size={20} />
              </button>
              <button
                onClick={endCall}
                title="Kết thúc"
                className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
              >
                <PhoneOff size={22} />
              </button>
            </div>

            <button onClick={endCall} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
