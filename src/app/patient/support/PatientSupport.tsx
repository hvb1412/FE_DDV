import { useEffect, useRef, useState } from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, BookOpen, FileText, Star, Search, Video, Headphones, Send, X, Calendar, Bug, ThumbsUp, ThumbsDown, Inbox, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Modal, Field, Input, Btn } from '@/app/shared/components/Modal';

const faqs = [
  { q: 'Làm sao để đặt lịch tư vấn với bác sĩ?', a: 'Vào tab "Lịch hẹn" trên sidebar hoặc nhấn "Đặt lịch" trong hồ sơ bác sĩ phụ trách. Chọn ngày giờ và xác nhận.' },
  { q: 'Thực đơn của tôi do ai tạo?', a: 'Thực đơn được bác sĩ/chuyên gia dinh dưỡng phụ trách cá nhân hoá dựa trên chẩn đoán, chỉ số sức khoẻ và sở thích.' },
  { q: 'Tôi có thể đổi bác sĩ phụ trách không?', a: 'Có. Vào Cài đặt → Bác sĩ phụ trách → Yêu cầu đổi. Đội ngũ hỗ trợ sẽ liên hệ trong 24h.' },
  { q: 'Dữ liệu sức khoẻ của tôi có an toàn không?', a: 'Toàn bộ dữ liệu được mã hoá end-to-end và chỉ bác sĩ phụ trách có quyền xem.' },
  { q: 'Cách tính điểm thưởng?', a: 'Bạn nhận điểm khi hoàn thành bài học, ghi nhật ký, tuân thủ thực đơn, đo chỉ số đúng giờ.' },
  { q: 'AI nhận diện món ăn có chính xác không?', a: 'AI đạt độ chính xác ~90% với các món Việt phổ biến. Bạn nên kiểm tra và chỉnh khẩu phần nếu cần.' },
  { q: 'Phí sử dụng ứng dụng?', a: 'Tính năng cơ bản miễn phí. Gói Premium (89k/tháng) mở khoá tư vấn không giới hạn và phân tích chuyên sâu.' },
];

type Guide = { title: string; desc: string; icon: LucideIcon; color: string; content: string };
const guides: Guide[] = [
  { title: 'Hướng dẫn sử dụng app', desc: '8 bài • 15 phút', icon: BookOpen, color: 'text-violet-600 bg-violet-50',
    content: `1. Cài đặt và đăng nhập\n2. Thiết lập mục tiêu sức khoẻ\n3. Nhận thực đơn từ bác sĩ\n4. Ghi nhật ký bữa ăn\n5. Theo dõi tiến độ\n6. Tương tác với bác sĩ\n7. Nhận điểm thưởng\n8. Tuỳ chỉnh & bảo mật` },
  { title: 'Cách đọc chỉ số dinh dưỡng', desc: '5 phút đọc', icon: FileText, color: 'text-blue-600 bg-blue-50',
    content: `• Năng lượng (kcal): tổng calo cho khẩu phần.\n• Protein: 0.8-1.2g/kg/ngày.\n• Carb: phân biệt đường tự do và tinh bột.\n• Chất béo: ưu tiên không bão hoà.\n• Chất xơ: ≥25g/ngày.\n• Natri: <2000mg/ngày.` },
  { title: 'Mẹo dùng nhận diện món ăn', desc: 'Video • 3 phút', icon: Video, color: 'text-pink-600 bg-pink-50',
    content: `• Chụp từ trên xuống, đầy đủ ánh sáng.\n• Đĩa tương phản.\n• Tránh chụp nhiều món chồng nhau.\n• Kiểm tra lại khẩu phần.\n• Báo lỗi để cải thiện AI.` },
  { title: 'Quản lý lịch nhắc thuốc', desc: '4 phút đọc', icon: FileText, color: 'text-amber-600 bg-amber-50',
    content: `1. Vào "Nhắc nhở" → "+ Thêm".\n2. Chọn loại: thuốc, đo chỉ số, ăn uống.\n3. Đặt thời gian + lặp lại.\n4. Bật âm báo / rung.\n5. Nhấn "Đã làm" để tích điểm.` },
];

const initialTickets = [
  { id: 'T-1042', topic: 'Không nhận được thông báo nhắc thuốc', status: 'Đã giải quyết', date: '20/05/2026', priority: 'Trung bình' },
  { id: 'T-1031', topic: 'Sai khẩu phần khi nhận diện món Phở', status: 'Đang xử lý', date: '28/05/2026', priority: 'Thấp' },
];

type ChatMsg = { role: 'me' | 'agent'; text: string; time: string };
const now = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const QUICK_REPLIES = ['Đặt lịch tư vấn', 'Đổi bác sĩ', 'Lỗi nhận diện món', 'Hỏi về Premium'];

export function PatientSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [query, setQuery] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [faqVote, setFaqVote] = useState<Record<number, 'up' | 'down'>>({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { role: 'agent', text: 'Xin chào! Tôi là trợ lý hỗ trợ Dinh Dưỡng Việt. Tôi có thể giúp gì cho bạn?', time: now() },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => { chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight); }, [chatMsgs, chatOpen]);

  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [videoModal, setVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({ date: '', time: '09:00', topic: '' });
  const [bugModal, setBugModal] = useState(false);
  const [bug, setBug] = useState({ title: '', detail: '', severity: 'medium' });
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState<typeof initialTickets[0] | null>(null);

  const filteredFaqs = faqs.filter((f) =>
    !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  const submitFeedback = () => {
    if (rating === 0) { toast.error('Chọn số sao'); return; }
    if (!feedback.trim()) { toast.error('Nhập nội dung phản hồi'); return; }
    toast.success('Cảm ơn bạn đã gửi phản hồi!');
    setRating(0); setFeedback('');
  };

  const voteFaq = (i: number, v: 'up' | 'down') => {
    setFaqVote({ ...faqVote, [i]: v });
    toast.success(v === 'up' ? 'Cảm ơn phản hồi!' : 'Chúng tôi sẽ cải thiện câu trả lời');
  };

  const sendChat = (text?: string) => {
    const msg = (text ?? chatInput).trim();
    if (!msg) return;
    setChatMsgs((prev) => [...prev, { role: 'me', text: msg, time: now() }]);
    setChatInput('');
    setTimeout(() => {
      const lower = msg.toLowerCase();
      const reply =
        lower.includes('hẹn') || lower.includes('lịch') ? 'Bạn có thể đặt lịch tại tab "Lịch hẹn". Cần tôi hướng dẫn chi tiết hơn không?'
        : lower.includes('thuốc') ? 'Lịch nhắc thuốc nằm ở tab "Nhắc nhở". Bạn cần thêm hay sửa nhắc?'
        : lower.includes('thực đơn') || lower.includes('menu') ? 'Thực đơn do bác sĩ duyệt, xem ở "Thực đơn của tôi".'
        : lower.includes('đổi') || lower.includes('bác sĩ') ? 'Để đổi bác sĩ phụ trách, vào Cài đặt → Bác sĩ phụ trách → Yêu cầu đổi.'
        : lower.includes('lỗi') || lower.includes('sai') ? 'Cảm ơn bạn. Bạn có thể gửi báo lỗi chi tiết trong mục "Báo lỗi" để đội kỹ thuật xử lý.'
        : lower.includes('premium') || lower.includes('phí') ? 'Premium 89k/tháng — mở khoá tư vấn không giới hạn. Xem chi tiết tại Cài đặt → Gói Premium.'
        : 'Cảm ơn bạn. Tôi đã ghi nhận và sẽ kết nối với chuyên viên trong ít phút.';
      setChatMsgs((prev) => [...prev, { role: 'agent', text: reply, time: now() }]);
    }, 700);
  };

  const bookVideoCall = () => {
    if (!videoForm.date) { toast.error('Chọn ngày'); return; }
    if (!videoForm.topic.trim()) { toast.error('Nhập chủ đề'); return; }
    setVideoModal(false);
    toast.success(`Đã đặt video call ${videoForm.date} lúc ${videoForm.time}`);
    setVideoForm({ date: '', time: '09:00', topic: '' });
  };

  const submitBug = () => {
    if (!bug.title.trim() || !bug.detail.trim()) { toast.error('Nhập đủ tiêu đề và mô tả'); return; }
    const id = `T-${1100 + tickets.length}`;
    const t = new Date();
    const date = `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
    setTickets([{ id, topic: bug.title, status: 'Đang xử lý', date, priority: bug.severity === 'high' ? 'Cao' : bug.severity === 'low' ? 'Thấp' : 'Trung bình' }, ...tickets]);
    setBug({ title: '', detail: '', severity: 'medium' });
    setBugModal(false);
    toast.success(`Đã tạo ticket ${id}`);
  };

  const channels = [
    { icon: MessageCircle, label: 'Chat hỗ trợ', sub: 'Phản hồi < 5 phút', color: 'text-emerald-600 bg-emerald-50', run: () => setChatOpen(true) },
    { icon: Phone, label: 'Hotline 1900 1234', sub: '24/7 • Miễn phí', color: 'text-blue-600 bg-blue-50', run: () => { window.location.href = 'tel:19001234'; } },
    { icon: Mail, label: 'Gửi email', sub: 'support@dinhduongviet.vn', color: 'text-amber-600 bg-amber-50', run: () => { window.location.href = 'mailto:support@dinhduongviet.vn'; } },
    { icon: Headphones, label: 'Video call', sub: 'Hẹn cuộc gọi 1:1', color: 'text-pink-600 bg-pink-50', run: () => setVideoModal(true) },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-5 sm:p-8 text-white shadow-md text-center">
        <HelpCircle size={40} className="mx-auto" />
        <h2 className="text-white mt-3">Chúng tôi có thể giúp gì cho bạn?</h2>
        <p className="text-sm text-white/90 mt-1">Đội ngũ hỗ trợ Dinh Dưỡng Việt sẵn sàng 24/7</p>
        <div className="max-w-xl mx-auto mt-5 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm câu hỏi, hướng dẫn, hoặc vấn đề..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {channels.map((c) => (
          <button key={c.label} onClick={c.run} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4 hover:shadow-md hover:border-emerald-200 transition text-left">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}><c.icon size={20} className="sm:size-[22]" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{c.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{c.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-gray-900">Câu hỏi thường gặp</h3>
              <p className="text-xs text-gray-500 mt-1">Các thắc mắc phổ biến nhất</p>
            </div>
            {filteredFaqs.length === 0 && <div className="p-6 text-center text-sm text-gray-500">Không tìm thấy câu hỏi phù hợp</div>}
            {filteredFaqs.map((f, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <span className="text-sm text-gray-900 flex-1 pr-3">{f.q}</span>
                  {openFaq === i ? <ChevronDown size={18} className="text-emerald-600 flex-shrink-0" /> : <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 bg-gray-50/50">
                    <p className="text-sm text-gray-600 mb-3">{f.a}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Câu trả lời này có hữu ích?</span>
                      <button onClick={() => voteFaq(i, 'up')} className={`p-1.5 rounded ${faqVote[i] === 'up' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-200'}`}><ThumbsUp size={14} /></button>
                      <button onClick={() => voteFaq(i, 'down')} className={`p-1.5 rounded ${faqVote[i] === 'down' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-200'}`}><ThumbsDown size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tickets history */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-gray-900 flex items-center gap-2"><Inbox size={18} /> Lịch sử yêu cầu hỗ trợ</h3>
                <p className="text-xs text-gray-500 mt-1">Các ticket bạn đã gửi</p>
              </div>
              <button onClick={() => setBugModal(true)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center gap-1.5">
                <Bug size={14} /> Báo lỗi
              </button>
            </div>
            {tickets.length === 0 && <p className="p-6 text-center text-sm text-gray-400">Chưa có ticket nào</p>}
            {tickets.map((t) => (
              <button key={t.id} onClick={() => setActiveTicket(t)} className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 text-left">
                <div>
                  <p className="text-sm text-gray-900">{t.topic}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.id} • {t.date} • Ưu tiên: {t.priority}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${t.status === 'Đã giải quyết' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {t.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="text-gray-900">Hướng dẫn</h3></div>
            <div className="p-2">
              {guides.map((g) => (
                <button key={g.title} onClick={() => setActiveGuide(g)} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left">
                  <div className={`w-10 h-10 rounded-xl ${g.color} flex items-center justify-center`}><g.icon size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{g.title}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-gray-900 mb-1">Gửi phản hồi</h3>
            <p className="text-xs text-gray-500 mb-3">Ý kiến của bạn giúp chúng tôi cải thiện</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} onClick={() => setRating(s)} className={`cursor-pointer hover:scale-110 transition ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Chia sẻ trải nghiệm..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={submitFeedback} className="mt-2 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Gửi phản hồi</button>
          </div>
        </div>
      </div>

      {/* Guide viewer */}
      <Modal open={activeGuide !== null} onClose={() => setActiveGuide(null)} title={activeGuide?.title ?? ''} size="lg">
        <p className="text-xs text-gray-500 mb-3">{activeGuide?.desc}</p>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">{activeGuide?.content}</pre>
      </Modal>

      {/* Video call */}
      <Modal open={videoModal} onClose={() => setVideoModal(false)} title="Đặt lịch video call hỗ trợ">
        <div className="space-y-3">
          <Field label="Ngày"><Input type="date" value={videoForm.date} onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })} /></Field>
          <Field label="Giờ">
            <select value={videoForm.time} onChange={(e) => setVideoForm({ ...videoForm, time: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {['09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Chủ đề"><Input value={videoForm.topic} onChange={(e) => setVideoForm({ ...videoForm, topic: e.target.value })} placeholder="VD: Hướng dẫn dùng nhận diện món" /></Field>
        </div>
        <div className="flex gap-2 mt-5">
          <Btn variant="ghost" onClick={() => setVideoModal(false)}>Huỷ</Btn>
          <Btn onClick={bookVideoCall}><Calendar size={14} className="inline mr-1" /> Đặt lịch</Btn>
        </div>
      </Modal>

      {/* Bug report */}
      <Modal open={bugModal} onClose={() => setBugModal(false)} title="Báo lỗi / Tạo ticket hỗ trợ" size="lg">
        <div className="space-y-3">
          <Field label="Tiêu đề"><Input value={bug.title} onChange={(e) => setBug({ ...bug, title: e.target.value })} placeholder="VD: Không nhận được thông báo" /></Field>
          <Field label="Mô tả chi tiết">
            <textarea rows={4} value={bug.detail} onChange={(e) => setBug({ ...bug, detail: e.target.value })} placeholder="Mô tả thao tác đã làm và lỗi gặp phải..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </Field>
          <Field label="Mức độ">
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'low', label: 'Thấp' },
                { v: 'medium', label: 'Trung bình' },
                { v: 'high', label: 'Cao' },
              ] as const).map((s) => (
                <button key={s.v} onClick={() => setBug({ ...bug, severity: s.v })} className={`py-2 rounded-lg border text-sm ${bug.severity === s.v ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700'}`}>{s.label}</button>
              ))}
            </div>
          </Field>
        </div>
        <div className="flex gap-2 mt-5">
          <Btn variant="ghost" onClick={() => setBugModal(false)}>Huỷ</Btn>
          <Btn onClick={submitBug}>Gửi báo lỗi</Btn>
        </div>
      </Modal>

      {/* Ticket detail */}
      <Modal open={activeTicket !== null} onClose={() => setActiveTicket(null)} title={`Chi tiết ticket ${activeTicket?.id ?? ''}`}>
        {activeTicket && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Trạng thái:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs ${activeTicket.status === 'Đã giải quyết' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{activeTicket.status}</span>
            </div>
            <p><span className="text-gray-500">Chủ đề:</span> {activeTicket.topic}</p>
            <p><span className="text-gray-500">Ngày gửi:</span> {activeTicket.date}</p>
            <p><span className="text-gray-500">Ưu tiên:</span> {activeTicket.priority}</p>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
              {activeTicket.status === 'Đã giải quyết'
                ? 'Đã xử lý: vấn đề được khắc phục trong phiên bản 1.0.0. Vui lòng cập nhật app phiên bản mới nhất.'
                : 'Đội ngũ hỗ trợ đang điều tra. Chúng tôi sẽ phản hồi trong 24h qua email hoặc thông báo trong app.'}
            </div>
            <Btn onClick={() => { setActiveTicket(null); setChatOpen(true); }}>Tiếp tục trao đổi qua chat</Btn>
          </div>
        )}
      </Modal>

      {/* Chat floating panel */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Headphones size={18} /></div>
              <div>
                <p className="text-sm">Hỗ trợ Dinh Dưỡng Việt</p>
                <p className="text-[11px] text-white/80">● Đang trực tuyến</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center"><X size={18} /></button>
          </div>
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatMsgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.role === 'me' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}>
                  {m.text}
                  <p className={`text-[10px] mt-1 ${m.role === 'me' ? 'text-white/70' : 'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 pt-2 flex gap-1.5 flex-wrap border-t border-gray-100">
            {QUICK_REPLIES.map((q) => (
              <button key={q} onClick={() => sendChat(q)} className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100">{q}</button>
            ))}
          </div>
          <div className="p-3 flex items-center gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }} placeholder="Nhập tin nhắn..." className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={() => sendChat()} className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"><Send size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
