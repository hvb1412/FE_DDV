import { useState } from 'react';
import { Send, Sparkles, MessageCircleQuestion, Bot, User as UserIcon, History, BookOpen, Lightbulb } from 'lucide-react';

type Msg = { id: number; from: 'me' | 'ai'; text: string };

const suggested = [
  'Đái tháo đường nên ăn gì?',
  'Cách giảm cân an toàn?',
  'Thực phẩm giàu canxi?',
  'Người cao huyết áp kiêng gì?',
  'Trẻ em cần bao nhiêu protein/ngày?',
  'Có nên ăn trứng mỗi ngày?',
  'Uống nước detox có tốt không?',
  'Mẹ bầu nên bổ sung gì?',
];

const topics = [
  { name: 'Đái tháo đường', count: 23, color: 'bg-rose-50 text-rose-700' },
  { name: 'Cao huyết áp', count: 18, color: 'bg-amber-50 text-amber-700' },
  { name: 'Giảm cân', count: 31, color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Mẹ và bé', count: 15, color: 'bg-pink-50 text-pink-700' },
  { name: 'Người cao tuổi', count: 12, color: 'bg-sky-50 text-sky-700' },
  { name: 'Thể thao', count: 9, color: 'bg-purple-50 text-purple-700' },
];

type AIChatProps = {
  userRole?: 'patient' | 'user';
};

export function AIChat({ userRole = 'user' }: AIChatProps) {
  const initialMsg: Msg[] = [
    {
      id: 1,
      from: 'ai',
      text: userRole === 'patient'
        ? 'Xin chào Minh! Tôi là trợ lý dinh dưỡng AI 🍎\n\nDựa trên hồ sơ của bạn (Đái tháo đường type 2, mục tiêu giảm cân), tôi có thể giúp bạn:\n• Gợi ý thực đơn phù hợp\n• Tư vấn dinh dưỡng theo bệnh lý\n• Giải đáp thắc mắc về thực phẩm\n\nBạn muốn hỏi gì hôm nay?'
        : 'Xin chào! Tôi là trợ lý dinh dưỡng AI 🍎\n\nTôi có thể giúp bạn:\n• Gợi ý thực đơn phù hợp\n• Tư vấn dinh dưỡng theo nhu cầu\n• Giải đáp thắc mắc về thực phẩm\n\nBạn muốn hỏi gì hôm nay?'
    },
  ];

  const [msgs, setMsgs] = useState<Msg[]>(initialMsg);
  const [input, setInput] = useState('');

  const ask = (text: string) => {
    if (!text.trim()) return;
    const newMsgs: Msg[] = [...msgs, { id: Date.now(), from: 'me', text }];
    setMsgs(newMsgs);
    setInput('');
    setTimeout(() => {
      setMsgs([
        ...newMsgs,
        {
          id: Date.now() + 1,
          from: 'ai',
          text: 'Với câu hỏi của bạn, tôi gợi ý: ưu tiên thực phẩm giàu chất xơ (rau xanh, ngũ cốc nguyên cám), chia nhỏ bữa ăn 5-6 lần/ngày, hạn chế đường tinh chế. Bạn nên trao đổi thêm với bác sĩ phụ trách để có kế hoạch phù hợp nhất với tình trạng cụ thể. 💚',
        },
      ]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)]">
      {/* Sidebar left: topics & history */}
      <div className="hidden lg:block lg:col-span-3 space-y-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <p>Trợ lý AI Dinh dưỡng</p>
          </div>
          <p className="text-xs text-white/80 mt-1">Được huấn luyện trên dữ liệu Viện Dinh dưỡng & WHO</p>
          <button onClick={() => setMsgs(initialMsg)} className="w-full mt-3 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm">
            + Cuộc hội thoại mới
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-900 mb-3 flex items-center gap-1.5"><BookOpen size={14} /> Chủ đề phổ biến</p>
          <div className="space-y-1.5">
            {topics.map((t) => (
              <button key={t.name} onClick={() => ask(`Tôi muốn biết về ${t.name}`)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left">
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.name}</span>
                <span className="text-xs text-gray-400">{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-900 mb-2 flex items-center gap-1.5"><History size={14} /> Hội thoại gần đây</p>
          <div className="space-y-1.5">
            {['Đường huyết sau ăn cao', 'Có nên uống cà phê?', 'Thực đơn 1800 kcal'].map((c) => (
              <button key={c} onClick={() => ask(c)} className="w-full text-left text-xs text-gray-600 p-2 rounded-lg hover:bg-gray-50 truncate">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat main */}
      <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-violet-50/20 to-white">
          {msgs.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {m.from === 'ai' && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={16} className="sm:size-[18]" />
                </div>
              )}
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${m.from === 'me' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-900 border border-gray-100 shadow-sm'}`}>
                <p className="text-sm whitespace-pre-line">{m.text}</p>
              </div>
              {m.from === 'me' && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white flex-shrink-0">
                  <UserIcon size={16} className="sm:size-[18]" />
                </div>
              )}
            </div>
          ))}

          {msgs.length <= 1 && (
            <div className="pt-4 max-w-2xl mx-auto">
              <p className="text-sm text-gray-700 mb-3 flex items-center gap-1.5"><Lightbulb size={16} className="text-amber-500" /> Câu hỏi gợi ý cho bạn</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggested.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="text-left p-3 rounded-xl bg-white border border-violet-200 text-gray-700 text-sm hover:bg-violet-50 hover:border-violet-400 transition flex items-center gap-2"
                  >
                    <MessageCircleQuestion size={14} className="text-violet-500 flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder="Đặt câu hỏi về dinh dưỡng..."
              className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
            />
            <button onClick={() => ask(input)} className="px-4 py-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm hover:opacity-90 flex items-center gap-1.5">
              <Send size={14} /> Gửi
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">⚠️ Thông tin AI chỉ mang tính tham khảo. Luôn trao đổi với bác sĩ trước khi áp dụng.</p>
        </div>
      </div>
    </div>
  );
}
