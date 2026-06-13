import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Circle, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: number;
  patientName: string;
  initials: string;
  diagnosis: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    initials: 'NA',
    diagnosis: 'Tiểu đường type 2',
    lastMessage: 'Thưa bác sĩ, hôm nay đường huyết của con là 145 ạ',
    lastTime: '10:32',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'patient', text: 'Thưa bác sĩ, cho con hỏi về chế độ ăn ạ', time: '09:15', read: true },
      { id: 2, sender: 'doctor', text: 'Chào anh Văn A! Anh cứ hỏi nhé, tôi sẵn lòng giải đáp.', time: '09:18', read: true },
      { id: 3, sender: 'patient', text: 'Con nên ăn bao nhiêu tinh bột mỗi bữa ạ?', time: '09:20', read: true },
      { id: 4, sender: 'doctor', text: 'Với tiểu đường type 2, anh nên giới hạn khoảng 45–60g tinh bột mỗi bữa. Ưu tiên gạo lứt, khoai lang thay vì cơm trắng.', time: '09:25', read: true },
      { id: 5, sender: 'patient', text: 'Dạ con hiểu rồi ạ, cảm ơn bác sĩ!', time: '09:27', read: true },
      { id: 6, sender: 'patient', text: 'Thưa bác sĩ, hôm nay đường huyết của con là 145 ạ', time: '10:32', read: false },
      { id: 7, sender: 'patient', text: 'Con đã ăn theo hướng dẫn rồi nhưng vẫn còn cao', time: '10:33', read: false },
    ],
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    initials: 'TB',
    diagnosis: 'Tăng huyết áp',
    lastMessage: 'Dạ, con sẽ đo huyết áp 2 lần/ngày theo lịch ạ',
    lastTime: '09:45',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: 'doctor', text: 'Chào chị Trần Thị B! Chị đo huyết áp sáng nay chưa?', time: '08:00', read: true },
      { id: 2, sender: 'patient', text: 'Dạ con vừa đo xong ạ, 135/85 ạ bác sĩ', time: '08:10', read: true },
      { id: 3, sender: 'doctor', text: 'Tốt hơn rồi đó chị! Chị tiếp tục duy trì chế độ ăn ít muối và uống thuốc đúng giờ nhé.', time: '08:15', read: true },
      { id: 4, sender: 'patient', text: 'Dạ, con sẽ đo huyết áp 2 lần/ngày theo lịch ạ', time: '09:45', read: true },
    ],
  },
  {
    id: 3,
    patientName: 'Lê Văn C',
    initials: 'LC',
    diagnosis: 'Cholesterol cao',
    lastMessage: 'Bác sĩ ơi, con có thể ăn trứng không ạ?',
    lastTime: 'Hôm qua',
    unread: 1,
    online: false,
    messages: [
      { id: 1, sender: 'patient', text: 'Thưa bác sĩ, kết quả xét nghiệm mới của con đây ạ', time: '14:00', read: true },
      { id: 2, sender: 'doctor', text: 'Cảm ơn anh Lê Văn C. LDL của anh còn 165, cần cải thiện thêm. Tôi điều chỉnh thực đơn cho anh nhé.', time: '14:30', read: true },
      { id: 3, sender: 'patient', text: 'Bác sĩ ơi, con có thể ăn trứng không ạ?', time: '16:20', read: false },
    ],
  },
  {
    id: 4,
    patientName: 'Phạm Thị D',
    initials: 'PD',
    diagnosis: 'Béo phì',
    lastMessage: 'Con đã giảm được 2kg trong tháng này ạ!',
    lastTime: 'Hôm qua',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'patient', text: 'Con đã giảm được 2kg trong tháng này ạ!', time: '11:00', read: true },
      { id: 2, sender: 'doctor', text: 'Tuyệt vời chị Phạm Thị D! Tiến độ rất tốt. Chị tiếp tục duy trì nhé, mục tiêu tháng tới giảm thêm 1.5–2kg là lý tưởng.', time: '11:15', read: true },
    ],
  },
  {
    id: 5,
    patientName: 'Hoàng Minh E',
    initials: 'HE',
    diagnosis: 'Thiếu máu',
    lastMessage: 'Bác sĩ cho con hỏi về thực phẩm giàu sắt ạ',
    lastTime: '2 ngày trước',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'patient', text: 'Bác sĩ cho con hỏi về thực phẩm giàu sắt ạ', time: '09:00', read: true },
      { id: 2, sender: 'doctor', text: 'Chào anh Hoàng Minh E! Thực phẩm giàu sắt tốt gồm: thịt đỏ, gan, đậu lăng, rau bina, hạt bí ngô. Ăn kèm vitamin C để hấp thu tốt hơn nhé.', time: '09:30', read: true },
    ],
  },
];

export function DoctorChat() {
  const [searchParams] = useSearchParams();
  const initialId = (() => {
    const name = searchParams.get('name');
    if (!name) return 1;
    const match = conversations.find(c =>
      c.patientName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(c.patientName.split(' ').pop()!.toLowerCase())
    );
    return match ? match.id : 1;
  })();

  const [activeId, setActiveId] = useState<number>(initialId);
  const [convos, setConvos] = useState<Conversation[]>(conversations);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;

  const filtered = convos.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, active?.messages.length]);

  const openConvo = (id: number) => {
    setActiveId(id);
    setConvos(prev =>
      prev.map(c => c.id === id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c)
    );
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: 'doctor',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setConvos(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: newMsg.time }
          : c
      )
    );
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const totalUnread = convos.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">

      {/* ── Conversation list ── */}
      <div className="w-80 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tin nhắn</h1>
              {totalUnread > 0 && (
                <p className="text-xs text-green-600 font-medium">{totalUnread} tin chưa đọc</p>
              )}
            </div>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bệnh nhân..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => openConvo(c.id)}
              className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                activeId === c.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activeId === c.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {c.initials}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm truncate ${c.unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                    {c.patientName}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0 ml-1">{c.lastTime}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{c.diagnosis}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xs truncate max-w-[160px] ${c.unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                    {c.lastMessage}
                  </p>
                  {c.unread > 0 && (
                    <span className="shrink-0 ml-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-green-700">
                {active.initials}
              </div>
              {active.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{active.patientName}</p>
              <div className="flex items-center gap-1">
                <Circle size={6} className={active.online ? 'fill-green-500 text-green-500' : 'fill-gray-300 text-gray-300'} />
                <span className="text-xs text-gray-500">
                  {active.online ? 'Đang hoạt động' : 'Ngoại tuyến'} · {active.diagnosis}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Gọi thoại">
              <Phone size={18} />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors" title="Gọi video">
              <Video size={18} />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {active.messages.map((msg, idx) => {
            const isDoctor = msg.sender === 'doctor';
            const prevSender = idx > 0 ? active.messages[idx - 1].sender : null;
            const showAvatar = !isDoctor && prevSender !== 'patient';

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                {!isDoctor && (
                  <div className={`w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                    {active.initials}
                  </div>
                )}
                <div className={`max-w-sm ${isDoctor ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isDoctor
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 px-1 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                    {isDoctor && (
                      <CheckCheck size={12} className={msg.read ? 'text-green-500' : 'text-gray-400'} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-end gap-3">
            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Nhập tin nhắn... (Enter để gửi)"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 resize-none bg-gray-50 leading-relaxed"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
