import { useState, useEffect, useRef } from 'react';
import { Award, Play, Pause, Lock, CheckCircle2, Clock, Sparkles, BookOpen, Trophy, Flame, Search, Filter, Bookmark, BookmarkCheck, X, ChevronRight, Volume2, VolumeX, Maximize2, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';

const lessonBody: Record<number, { intro: string; bullets: string[]; tip: string; question: string; answer: string }> = {
  1: { intro: 'Cá là nguồn protein chất lượng cao và đặc biệt giàu omega-3 — axit béo mà cơ thể không tự tổng hợp được.', bullets: ['Omega-3 (EPA/DHA) giảm viêm và tốt cho tim mạch', 'Cá béo (cá hồi, cá thu, cá trích) chứa nhiều DHA cho não bộ', 'Hiệp hội Tim mạch Hoa Kỳ khuyến nghị 2 khẩu phần cá/tuần'], tip: 'Ưu tiên hấp/luộc/áp chảo thay vì chiên ngập dầu để giữ omega-3.', question: 'Bao nhiêu khẩu phần cá/tuần là hợp lý?', answer: '2 lần/tuần' },
  2: { intro: 'Nhãn dinh dưỡng giúp bạn so sánh thực phẩm và tránh các "bẫy" calo/đường ẩn.', bullets: ['Đọc theo "khẩu phần" — không phải cả gói', 'Chú ý đường thêm vào (added sugar) — không quá 25g/ngày', 'Natri < 2300mg/ngày, tốt nhất là < 1500mg'], tip: 'Quy tắc 5/20: dưới 5% là thấp, trên 20% là cao.', question: 'Lượng đường thêm vào tối đa mỗi ngày?', answer: '25g' },
  3: { intro: 'Nhiều sản phẩm "không đường" hoặc "ít béo" thật ra chứa đường ẩn dưới nhiều tên gọi khác nhau.', bullets: ['Siro ngô cao fructose, mật mía, dextrose đều là đường', 'Sữa chua hương vị có thể chứa 15-20g đường/hũ', 'Nước ép trái cây đóng chai chứa đường tương đương soda'], tip: 'Đọc 5 thành phần đầu tiên — nếu có đường ở vị trí cao là cảnh báo.', question: 'Sữa chua hương vị có thể chứa tới?', answer: '15-20g đường' },
  4: { intro: 'Không phải dầu ăn nào cũng giống nhau — sự khác biệt nằm ở loại chất béo và điểm bốc khói.', bullets: ['Dầu ô-liu extra virgin: tốt cho salad, không nên chiên rán nhiệt cao', 'Dầu hạt cải, dầu đậu phộng: ổn định ở nhiệt độ cao', 'Hạn chế dầu cọ và mỡ động vật do nhiều chất béo bão hoà'], tip: 'Đa dạng 2-3 loại dầu thay vì dùng một loại cho mọi món.', question: 'Dầu nào KHÔNG nên dùng để chiên ở nhiệt độ cao?', answer: 'Dầu ô-liu extra virgin' },
  5: { intro: 'Phương pháp đĩa Harvard giúp cân đối bữa ăn một cách trực quan mà không cần đong đếm.', bullets: ['1/2 đĩa: rau củ đa dạng màu sắc', '1/4 đĩa: ngũ cốc nguyên hạt (gạo lứt, yến mạch)', '1/4 đĩa: protein lành (cá, đậu, thịt nạc)'], tip: 'Thêm 1 ly nước lọc, hạn chế nước ngọt và sữa nhiều đường.', question: 'Rau củ chiếm bao nhiêu đĩa?', answer: '1/2 (một nửa)' },
  7: { intro: 'Người tiểu đường vẫn có thể ăn ngon miệng nếu chọn đúng nhóm thực phẩm và quản lý khẩu phần.', bullets: ['Nên: ngũ cốc nguyên hạt, rau xanh, đậu, cá, gia cầm bỏ da', 'Hạn chế: cơm trắng, bún phở nhiều, đồ ngọt, nước ngọt', 'Chia 3 bữa chính + 2 bữa phụ để đường huyết ổn định'], tip: 'Ăn rau trước, protein giữa, tinh bột cuối — giảm tăng đường sau ăn.', question: 'Người tiểu đường nên ăn gì để ổn định đường huyết?', answer: 'Ngũ cốc nguyên hạt + rau xanh' },
  8: { intro: 'Probiotic là vi khuẩn có lợi cho hệ tiêu hoá và hệ miễn dịch.', bullets: ['Sữa chua không đường, kefir, kim chi, dưa cải tự nhiên', 'Hỗ trợ tiêu hoá, giảm đầy hơi, tăng đề kháng', 'Cần kết hợp với prebiotic (chất xơ) để vi khuẩn phát triển'], tip: 'Ăn 1 hũ sữa chua không đường mỗi ngày là cách dễ nhất.', question: 'Nguồn probiotic phổ biến nhất?', answer: 'Sữa chua không đường' },
};

const courses = [
  { id: 1, title: 'Vì sao nên ăn cá 2 lần/tuần?', duration: '3 phút', points: 10, done: false, today: true, level: 'Cơ bản', cat: 'Thực phẩm', emoji: '🐟' },
  { id: 2, title: 'Cách đọc nhãn dinh dưỡng', duration: '5 phút', points: 15, done: true, today: false, level: 'Cơ bản', cat: 'Kỹ năng', emoji: '🏷️' },
  { id: 3, title: 'Đường ẩn trong thực phẩm chế biến', duration: '4 phút', points: 10, done: true, today: false, level: 'Cơ bản', cat: 'Cảnh báo', emoji: '🍬' },
  { id: 4, title: 'Lựa chọn dầu ăn lành mạnh', duration: '6 phút', points: 15, done: false, today: false, level: 'Trung bình', cat: 'Thực phẩm', emoji: '🫒' },
  { id: 5, title: 'Cân đối bữa ăn theo đĩa Harvard', duration: '8 phút', points: 20, done: false, today: false, level: 'Trung bình', cat: 'Kỹ năng', emoji: '🍽' },
  { id: 6, title: 'Vi chất quan trọng cho người trên 40', duration: '10 phút', points: 25, done: false, today: false, level: 'Nâng cao', cat: 'Sức khoẻ', emoji: '💊', locked: true },
  { id: 7, title: 'Tiểu đường — nên ăn gì, kiêng gì', duration: '7 phút', points: 20, done: false, today: false, level: 'Trung bình', cat: 'Bệnh lý', emoji: '🩸' },
  { id: 8, title: 'Probiotic và sức khoẻ đường ruột', duration: '5 phút', points: 15, done: false, today: false, level: 'Trung bình', cat: 'Sức khoẻ', emoji: '🦠' },
];

const LEVELS = ['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao'];

export function PatientLearning() {
  const [tab, setTab] = useState<'all' | 'todo' | 'done' | 'saved'>('all');
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('Tất cả');
  const [showFilter, setShowFilter] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [activeLesson, setActiveLesson] = useState<typeof courses[number] | null>(null);
  const [vidPlaying, setVidPlaying] = useState(false);
  const [vidMuted, setVidMuted] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [lessonTab, setLessonTab] = useState<'video' | 'notes'>('video');
  const vidTimerRef = useRef<number | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set(courses.filter((c) => c.done).map((c) => c.id)));
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [earnedFor, setEarnedFor] = useState<Set<number>>(new Set(courses.filter((c) => c.done).map((c) => c.id)));
  const [points, setPoints] = useState(245);
  const [cat, setCat] = useState('Tất cả');

  const NEXT_TIER = { name: 'Vàng', at: 500 };
  const toNextTier = Math.max(0, NEXT_TIER.at - points);
  const lessonsDoneCount = completed.size;
  const allCats = ['Tất cả', ...Array.from(new Set(courses.map((c) => c.cat)))];

  const filtered = courses.filter((c) => {
    const isDone = completed.has(c.id);
    if (tab === 'todo' && isDone) return false;
    if (tab === 'done' && !isDone) return false;
    if (tab === 'saved' && !saved.has(c.id)) return false;
    if (level !== 'Tất cả' && c.level !== level) return false;
    if (cat !== 'Tất cả' && c.cat !== cat) return false;
    if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const todayLesson = courses.find((c) => c.today);

  const openLesson = (c: typeof courses[number]) => {
    if (c.locked) {
      toast.info('Hoàn thành các bài Cơ bản & Trung bình để mở khoá bài Nâng cao');
      return;
    }
    setActiveLesson(c);
    setVidPlaying(true);
    setVidProgress(0);
    setLessonTab('video');
  };

  const lessonDurationSec = (d: string) => {
    const m = parseInt(d);
    return isNaN(m) ? 60 : m * 60;
  };

  useEffect(() => {
    if (!activeLesson || !vidPlaying) return;
    const total = lessonDurationSec(activeLesson.duration);
    vidTimerRef.current = window.setInterval(() => {
      setVidProgress((p) => {
        if (p >= total) {
          setVidPlaying(false);
          return total;
        }
        return p + 1;
      });
    }, 1000);
    return () => { if (vidTimerRef.current) window.clearInterval(vidTimerRef.current); };
  }, [activeLesson, vidPlaying]);

  const closeLesson = () => {
    setActiveLesson(null);
    setVidPlaying(false);
    setVidProgress(0);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const finishLesson = () => {
    if (!activeLesson) return;
    const c = activeLesson;
    const already = earnedFor.has(c.id);
    setCompleted((prev) => new Set(prev).add(c.id));
    if (!already) {
      setEarnedFor((prev) => new Set(prev).add(c.id));
      setPoints((p) => p + c.points);
      toast.success(`Hoàn thành "${c.title}" — +${c.points} điểm!`);
    } else {
      toast.success(`Đã ôn lại "${c.title}"`);
    }
    setActiveLesson(null);
  };

  const toggleSave = (c: typeof courses[number]) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(c.id)) { next.delete(c.id); toast('Đã bỏ khỏi "Học sau"'); }
      else { next.add(c.id); toast.success('Đã lưu vào "Học sau"'); }
      return next;
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top row: stats + today's lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-white/90">Điểm tích luỹ</p>
              <p className="mt-1 text-3xl sm:text-4xl">{points}</p>
            </div>
            <div className="text-right min-w-0">
              <p className="text-sm text-white/90">Hạng</p>
              <p className="mt-1 truncate">{points >= 1000 ? '💎 Kim cương' : points >= 500 ? '🥇 Vàng' : points >= 100 ? '🥈 Bạc' : '🥉 Đồng'}</p>
              <p className="text-xs text-white/80">{toNextTier > 0 ? `${toNextTier} điểm nữa lên ${NEXT_TIER.name}` : 'Đã đạt hạng tối đa'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <BookOpen size={16} className="mx-auto mb-1" />
              <p className="text-[10px] text-white/80">Đã học</p>
              <p className="text-sm">{lessonsDoneCount} bài</p>
            </div>
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <Bookmark size={16} className="mx-auto mb-1" />
              <p className="text-[10px] text-white/80">Học sau</p>
              <p className="text-sm">{saved.size}</p>
            </div>
            <div className="bg-white/15 rounded-lg p-2 text-center">
              <Trophy size={16} className="mx-auto mb-1" />
              <p className="text-[10px] text-white/80">Huy hiệu</p>
              <p className="text-sm">5</p>
            </div>
          </div>
        </div>

        {todayLesson && (
          <div className="lg:col-span-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 sm:p-6 text-white shadow-md flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">{todayLesson.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-white/90"><Sparkles size={14} /> Bài học hôm nay</div>
              <h3 className="text-white mt-1 truncate">{todayLesson.title}</h3>
              <p className="text-xs sm:text-sm text-white/90 mt-1">⏱ {todayLesson.duration} • {earnedFor.has(todayLesson.id) ? 'Đã nhận điểm' : `+${todayLesson.points} điểm`} • {todayLesson.level}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => openLesson(todayLesson)} className="px-3 sm:px-4 py-2 rounded-lg bg-white text-orange-600 flex items-center gap-1.5 text-sm hover:bg-orange-50">
                  <Play size={14} /> {completed.has(todayLesson.id) ? 'Học lại' : 'Bắt đầu học'}
                </button>
                <button onClick={() => toggleSave(todayLesson)} className="px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 flex items-center gap-1.5">
                  {saved.has(todayLesson.id) ? <><BookmarkCheck size={14} /> Đã lưu</> : <><Bookmark size={14} /> Học sau</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="inline-flex bg-gray-100 rounded-lg p-1 overflow-x-auto w-full lg:w-auto">
          {[
            { v: 'all', label: `Tất cả (${courses.length})` },
            { v: 'todo', label: `Chưa học (${courses.length - completed.size})` },
            { v: 'done', label: `Đã học (${completed.size})` },
            { v: 'saved', label: `Học sau (${saved.size})` },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v as any)}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-sm transition whitespace-nowrap ${tab === t.v ? 'bg-white text-emerald-600 shadow' : 'text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bài học..."
              className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full lg:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button onClick={() => setShowFilter(true)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm flex items-center gap-1.5 hover:bg-gray-50 whitespace-nowrap flex-shrink-0">
            <Filter size={14} /> <span className="hidden sm:inline">Bộ lọc{level !== 'Tất cả' && `: ${level}`}</span><span className="sm:hidden">Lọc</span>
          </button>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500 text-sm">Không tìm thấy bài học phù hợp</div>
        )}
        {filtered.map((c) => (
          <div key={c.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition ${c.locked ? 'opacity-60' : ''}`}>
            <div className="aspect-video bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center relative" style={{ fontSize: '4rem' }}>
              {c.emoji}
              {completed.has(c.id) && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              )}
              {c.locked && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <Lock size={28} />
                  <p className="text-[10px] mt-1 text-center px-3">Hoàn thành bài Trung bình để mở khoá</p>
                </div>
              )}
              <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-gray-700">{c.cat}</span>
              {!c.locked && (
                <button onClick={() => toggleSave(c)} title={saved.has(c.id) ? 'Bỏ lưu' : 'Lưu để học sau'} className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700">
                  {saved.has(c.id) ? <BookmarkCheck size={14} className="text-emerald-600" /> : <Bookmark size={14} />}
                </button>
              )}
            </div>
            <div className="p-4">
              <p className="text-gray-900 line-clamp-2 min-h-[2.5rem]">{c.title}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-0.5"><Clock size={11} /> {c.duration}</span>
                <span className="text-amber-600">{earnedFor.has(c.id) ? '✓ Đã nhận' : `+${c.points} điểm`}</span>
                <span>{c.level}</span>
              </div>
              <button
                onClick={() => openLesson(c)}
                disabled={c.locked}
                className={`w-full mt-3 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 ${
                  c.locked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                  completed.has(c.id) ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {c.locked ? <><Lock size={12} /> Đã khoá</> : completed.has(c.id) ? 'Học lại' : <><Play size={12} /> Học ngay</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h3 className="text-gray-900 flex items-center gap-2 min-w-0"><Award size={20} className="text-amber-500 flex-shrink-0" /> <span className="truncate">Huy hiệu đã đạt được</span></h3>
          <button onClick={() => setShowAllBadges(true)} className="text-sm text-emerald-600 hover:underline whitespace-nowrap">Xem tất cả 24</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {[
            { e: '🥗', name: 'Bắt đầu' },
            { e: '💪', name: '7 ngày streak' },
            { e: '🔥', name: 'Đam mê học' },
            { e: '⭐', name: 'Top 100' },
            { e: '🏆', name: 'Master' },
          ].map((b, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center" style={{ fontSize: '2rem' }}>{b.e}</div>
              <p className="text-xs text-gray-700 mt-1">{b.name}</p>
            </div>
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center opacity-40">
              <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center">
                <Lock size={20} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Khoá</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson viewer */}
      {activeLesson && (() => {
        const body = lessonBody[activeLesson.id];
        const total = lessonDurationSec(activeLesson.duration);
        const pct = (vidProgress / total) * 100;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeLesson}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl flex-shrink-0">{activeLesson.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activeLesson.title}</p>
                    <p className="text-xs text-gray-500">⏱ {activeLesson.duration} • {activeLesson.level} • {activeLesson.cat}</p>
                  </div>
                </div>
                <button onClick={closeLesson} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"><X size={16} /></button>
              </div>

              {/* Video player */}
              <div className="relative bg-slate-900 aspect-video flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-slate-900 to-emerald-900/40" />
                <div className="relative flex flex-col items-center text-white">
                  <span style={{ fontSize: '5rem' }}>{activeLesson.emoji}</span>
                  <p className="text-sm text-white/80 mt-2">{activeLesson.title}</p>
                </div>
                {!vidPlaying && vidProgress < total && (
                  <button onClick={() => setVidPlaying(true)} className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition">
                    <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg"><Play size={28} className="text-emerald-600 ml-1" fill="currentColor" /></div>
                  </button>
                )}
                {vidProgress >= total && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                    <CheckCircle2 size={36} className="text-emerald-400" />
                    <p className="mt-2">Đã xem hết video</p>
                    <button onClick={() => { setVidProgress(0); setVidPlaying(true); }} className="mt-3 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center gap-1.5">
                      <RotateCcw size={14} /> Xem lại
                    </button>
                  </div>
                )}
                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - r.left) / r.width;
                    setVidProgress(Math.max(0, Math.min(total, Math.round(ratio * total))));
                  }}>
                    <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center gap-3 text-white text-xs mt-1.5">
                    <button onClick={() => setVidPlaying((v) => !v)} className="p-1 hover:bg-white/10 rounded">
                      {vidPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => setVidMuted((v) => !v)} className="p-1 hover:bg-white/10 rounded">
                      {vidMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span className="font-mono">{fmt(vidProgress)} / {fmt(total)}</span>
                    <div className="flex-1" />
                    <button onClick={() => toast.info('Đang phát toàn màn hình (demo)')} className="p-1 hover:bg-white/10 rounded"><Maximize2 size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="px-5 pt-3 flex gap-1 border-b border-gray-100">
                <button onClick={() => setLessonTab('video')} className={`px-3 py-2 text-sm border-b-2 transition flex items-center gap-1.5 ${lessonTab === 'video' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <Play size={13} /> Video
                </button>
                <button onClick={() => setLessonTab('notes')} className={`px-3 py-2 text-sm border-b-2 transition flex items-center gap-1.5 ${lessonTab === 'notes' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <FileText size={13} /> Tóm tắt & câu hỏi
                </button>
              </div>

              <div className="p-5 overflow-y-auto text-sm text-gray-700 space-y-4">
                {lessonTab === 'video' && body && (
                  <p className="text-gray-600 italic">📝 {body.intro}</p>
                )}
                {lessonTab === 'notes' && body && (
                  <>
                    <p>{body.intro}</p>
                    <ul className="space-y-2">
                      {body.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2"><ChevronRight size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {b}</li>
                      ))}
                    </ul>
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">💡 <span className="text-amber-900">Mẹo:</span> {body.tip}</div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                      <p className="text-xs text-emerald-700">Câu hỏi củng cố</p>
                      <p className="text-sm text-gray-900 mt-1">{body.question}</p>
                      <details className="mt-2">
                        <summary className="text-xs text-emerald-700 cursor-pointer hover:underline">Xem đáp án</summary>
                        <p className="text-sm text-gray-700 mt-1">→ {body.answer}</p>
                      </details>
                    </div>
                  </>
                )}
                {!body && <p className="text-gray-500">Nội dung bài học sẽ được cập nhật sớm.</p>}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button onClick={() => toggleSave(activeLesson)} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 flex items-center gap-1.5">
                  {saved.has(activeLesson.id) ? <><BookmarkCheck size={14} /> Đã lưu</> : <><Bookmark size={14} /> Học sau</>}
                </button>
                <button
                  onClick={finishLesson}
                  disabled={vidProgress < total * 0.8 && !earnedFor.has(activeLesson.id)}
                  title={vidProgress < total * 0.8 && !earnedFor.has(activeLesson.id) ? 'Xem ít nhất 80% video để nhận điểm' : ''}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> {earnedFor.has(activeLesson.id) ? 'Hoàn thành ôn tập' : vidProgress < total * 0.8 ? `Xem tiếp (${Math.round(pct)}%)` : `Hoàn thành & nhận +${activeLesson.points} điểm`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* All badges modal */}
      {showAllBadges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAllBadges(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-gray-900 flex items-center gap-2"><Award size={18} className="text-amber-500" /> Tất cả huy hiệu (24)</h3>
              <button onClick={() => setShowAllBadges(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
            </div>
            <div className="p-5 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                { e: '🥗', n: 'Bắt đầu', got: true }, { e: '💪', n: '7 ngày streak', got: true },
                { e: '🔥', n: 'Đam mê học', got: true }, { e: '⭐', n: 'Top 100', got: true },
                { e: '🏆', n: 'Master', got: true }, { e: '📚', n: '10 bài học', got: false },
                { e: '🎯', n: 'Đúng mục tiêu', got: false }, { e: '🌟', n: 'Streak 30', got: false },
                { e: '💎', n: 'Kim cương', got: false }, { e: '🥇', n: 'Hạng Vàng', got: false },
                { e: '🍎', n: 'Yêu trái cây', got: false }, { e: '🥦', n: 'Vua rau xanh', got: false },
                { e: '💧', n: 'Đủ nước 7 ngày', got: false }, { e: '🏃', n: 'Vận động đều', got: false },
                { e: '🧘', n: 'Cân bằng', got: false }, { e: '🌙', n: 'Ngủ đúng giờ', got: false },
                { e: '☕', n: 'Giảm caffein', got: false }, { e: '🧂', n: 'Giảm muối', got: false },
                { e: '🍵', n: 'Trà xanh', got: false }, { e: '📊', n: 'Theo dõi đủ', got: false },
                { e: '🩺', n: 'Tái khám đúng hẹn', got: false }, { e: '🍱', n: 'Bento master', got: false },
                { e: '🥑', n: 'Chất béo tốt', got: false }, { e: '🌾', n: 'Ngũ cốc nguyên hạt', got: false },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <div className={`aspect-square rounded-2xl flex items-center justify-center text-2xl ${b.got ? 'bg-gradient-to-br from-amber-100 to-yellow-200' : 'bg-gray-100 grayscale opacity-40'}`}>
                    {b.got ? b.e : <Lock size={18} className="text-gray-400" />}
                  </div>
                  <p className="text-[10px] text-gray-700 mt-1 leading-tight">{b.n}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowFilter(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-sm max-h-[90vh] overflow-y-auto p-5 shadow-xl">
            <h3 className="text-gray-900 mb-3">Bộ lọc bài học</h3>
            <p className="text-xs text-gray-500 mb-2">Trình độ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-2 rounded-lg border text-sm ${level === l ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-2 mt-4">Chủ đề</p>
            <div className="flex flex-wrap gap-1.5">
              {allCats.map((cc) => (
                <button
                  key={cc}
                  onClick={() => setCat(cc)}
                  className={`px-2.5 py-1 rounded-full border text-xs ${cat === cc ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {cc}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setLevel('Tất cả'); setCat('Tất cả'); }} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">Đặt lại</button>
              <button onClick={() => setShowFilter(false)} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Áp dụng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
