import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Activity, HeartPulse, Droplet, Scale, Calendar, Clock, Bell, CheckCircle2, AlertTriangle, ChevronRight, MessageCircle, Target, Pencil, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type GoalType = 'lose' | 'gain' | 'maintain';
type Goal = { type: GoalType; startWeight: number; targetWeight: number; weeks: number; startedAt: string };
const LATEST_WEIGHT = 63.5;
const DEFAULT_GOAL: Goal = { type: 'lose', startWeight: 65, targetWeight: 60, weeks: 8, startedAt: '2026-04-03' };

function suggestType(current: number, target: number): GoalType {
  if (Math.abs(current - target) < 0.5) return 'maintain';
  return target < current ? 'lose' : 'gain';
}
function ratePerWeek(start: number, target: number, weeks: number) {
  if (!weeks) return 0;
  return Math.abs(start - target) / weeks;
}
function rateSafety(rate: number, type: GoalType) {
  if (type === 'maintain') return { label: 'Duy trì cân nặng', tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (rate <= 0.5) return { label: '≈ ' + rate.toFixed(2) + ' kg/tuần — An toàn', tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (rate <= 1) return { label: '≈ ' + rate.toFixed(2) + ' kg/tuần — Khả thi', tone: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: '≈ ' + rate.toFixed(2) + ' kg/tuần — Quá nhanh, không khuyến nghị', tone: 'text-red-700 bg-red-50 border-red-200' };
}
function weeksElapsed(startedAt: string) {
  const ms = Date.now() - new Date(startedAt).getTime();
  return Math.max(0, ms / (1000 * 60 * 60 * 24 * 7));
}

function dayLabel(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}
const weightData90 = Array.from({ length: 90 }, (_, i) => {
  const idx = 89 - i;
  return { day: dayLabel(idx), w: 65 - Math.sin(idx / 5) * 0.8 - (89 - idx) * 0.02 };
});
const bpData90 = Array.from({ length: 90 }, (_, i) => {
  const idx = 89 - i;
  return { day: dayLabel(idx), sys: 120 + Math.sin(idx / 2) * 8 + Math.cos(idx / 7) * 3, dia: 78 + Math.cos(idx / 2) * 5 + Math.sin(idx / 9) * 2 };
});
const glucoseData90 = Array.from({ length: 90 }, (_, i) => {
  const idx = 89 - i;
  return { day: dayLabel(idx), v: 5.8 + Math.sin(idx / 2) * 1.2 + Math.cos(idx / 5) * 0.4 };
});

const tabs = [
  { id: 'weight', label: 'Cân nặng', icon: Scale },
  { id: 'bp', label: 'Huyết áp', icon: HeartPulse },
  { id: 'glucose', label: 'Đường huyết', icon: Droplet },
];

type Status = 'safe' | 'watch' | 'alert';
const statusMeta: Record<Status, { label: string; chip: string; dot: string; ring: string }> = {
  safe: { label: 'An toàn', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', ring: 'ring-emerald-100' },
  watch: { label: 'Theo dõi', chip: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', ring: 'ring-amber-100' },
  alert: { label: 'Cảnh báo', chip: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', ring: 'ring-red-100' },
};

const todayMetrics: { key: string; label: string; value: string; unit: string; range: string; status: Status; lastAt: string; icon: typeof Droplet }[] = [
  { key: 'glucose', label: 'Đường huyết', value: '6.2', unit: 'mmol/L', range: 'Ngưỡng BS: 4.0 – 7.0', status: 'watch', lastAt: '13:45 (45 phút trước)', icon: Droplet },
  { key: 'bp', label: 'Huyết áp', value: '120/78', unit: 'mmHg', range: 'Ngưỡng BS: ≤ 130/85', status: 'safe', lastAt: 'Sáng nay 07:00', icon: HeartPulse },
  { key: 'weight', label: 'Cân nặng', value: '63.5', unit: 'kg', range: 'Mục tiêu: 60.0 kg', status: 'safe', lastAt: 'Sáng nay 07:30', icon: Scale },
];

const upcomingTasks = [
  { time: '15:00', label: 'Đo đường huyết sau ăn trưa', from: 'BS. Trần Thị A', urgent: false },
  { time: '20:00', label: 'Uống Metformin 500mg', from: 'BS. Trần Thị A', urgent: true },
  { time: '22:00', label: 'Đo huyết áp trước ngủ', from: 'BS. Trần Thị A', urgent: false },
];

const doctorNotes = [
  { doctor: 'BS. Trần Thị A', specialty: 'Dinh dưỡng', date: '19/05', note: 'Đường huyết có xu hướng tăng. Hãy giảm tinh bột tinh chế và đo lại sau ăn 2h trong 3 ngày tới.', avatar: 'A', tone: 'bg-emerald-100 text-emerald-700' },
  { doctor: 'BS. Trần Thị A', specialty: 'Dinh dưỡng', date: '18/05', note: 'Huyết áp ổn định, tiếp tục đo 2 lần/ngày. Hạn chế muối dưới 5g/ngày để hỗ trợ kiểm soát đường huyết tốt hơn.', avatar: 'A', tone: 'bg-emerald-100 text-emerald-700' },
];

const historyTimeline = [
  {
    date: 'Hôm nay',
    items: [
      { time: '13:45', type: 'Đường huyết', value: '6.2 mmol/L', note: 'Sau ăn 2h', icon: Droplet, color: 'text-sky-600 bg-sky-50' },
      { time: '07:30', type: 'Cân nặng', value: '63.5 kg', note: 'Sau ngủ dậy', icon: Scale, color: 'text-violet-600 bg-violet-50' },
      { time: '07:00', type: 'Huyết áp', value: '120/78 mmHg', note: '—', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
    ],
  },
  {
    date: 'Hôm qua',
    items: [
      { time: '07:15', type: 'Cân nặng', value: '63.7 kg', note: '—', icon: Scale, color: 'text-violet-600 bg-violet-50' },
      { time: '07:00', type: 'Đường huyết', value: '5.9 mmol/L', note: 'Lúc đói', icon: Droplet, color: 'text-sky-600 bg-sky-50' },
    ],
  },
  {
    date: '18/05',
    items: [
      { time: '12:00', type: 'Đường huyết', value: '6.2 mmol/L', note: 'Sau ăn 2h', icon: Droplet, color: 'text-sky-600 bg-sky-50' },
      { time: '07:20', type: 'Cân nặng', value: '64.0 kg', note: 'Cảm thấy khoẻ', icon: Scale, color: 'text-violet-600 bg-violet-50' },
    ],
  },
];

export function PatientHealth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('glucose');
  const [range, setRange] = useState<'7' | '30' | '90'>('30');
  const [showAdd, setShowAdd] = useState(false);
  const [quickType, setQuickType] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal | null>(DEFAULT_GOAL);
  const [showGoal, setShowGoal] = useState(false);
  const [gStart, setGStart] = useState<string>(String(LATEST_WEIGHT));
  const [gTarget, setGTarget] = useState<string>('60');
  const [gWeeks, setGWeeks] = useState<string>('8');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'Cân nặng' | 'Huyết áp' | 'Đường huyết'>('all');

  const openGoalModal = () => {
    if (goal) {
      setGStart(String(goal.startWeight));
      setGTarget(String(goal.targetWeight));
      setGWeeks(String(goal.weeks));
    } else {
      setGStart(String(LATEST_WEIGHT));
      setGTarget(String(Math.max(45, LATEST_WEIGHT - 5)));
      setGWeeks('8');
    }
    setShowGoal(true);
  };

  const preview = useMemo(() => {
    const s = parseFloat(gStart), t = parseFloat(gTarget), w = parseInt(gWeeks);
    if (isNaN(s) || isNaN(t) || isNaN(w) || w <= 0) return null;
    const type = suggestType(s, t);
    const rate = ratePerWeek(s, t, w);
    return { type, rate, safety: rateSafety(rate, type) };
  }, [gStart, gTarget, gWeeks]);

  const saveGoal = () => {
    const s = parseFloat(gStart), t = parseFloat(gTarget), w = parseInt(gWeeks);
    if (isNaN(s) || isNaN(t) || isNaN(w) || w <= 0) {
      toast.error('Vui lòng nhập đầy đủ và hợp lệ');
      return;
    }
    const isNew = !goal;
    setGoal({ type: suggestType(s, t), startWeight: s, targetWeight: t, weeks: w, startedAt: new Date().toISOString().slice(0, 10) });
    setShowGoal(false);
    toast.success(isNew ? 'Đã đặt mục tiêu mới' : 'Đã cập nhật mục tiêu');
  };

  const goalView = useMemo(() => {
    if (!goal) return null;
    const total = Math.abs(goal.startWeight - goal.targetWeight);
    const done = goal.type === 'lose'
      ? Math.max(0, goal.startWeight - LATEST_WEIGHT)
      : goal.type === 'gain'
      ? Math.max(0, LATEST_WEIGHT - goal.startWeight)
      : 0;
    const pct = goal.type === 'maintain' ? 100 : total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    const elapsed = weeksElapsed(goal.startedAt);
    const remaining = Math.max(0, Math.ceil(goal.weeks - elapsed));
    const onTrack = pct >= (elapsed / goal.weeks) * 100 - 5;
    const title =
      goal.type === 'lose' ? `Giảm về ${goal.targetWeight}kg trong ${goal.weeks} tuần`
      : goal.type === 'gain' ? `Tăng lên ${goal.targetWeight}kg trong ${goal.weeks} tuần`
      : `Duy trì ${goal.targetWeight}kg trong ${goal.weeks} tuần`;
    return { pct, remaining, onTrack, title };
  }, [goal]);

  const openQuickLog = (type: string) => {
    setQuickType(type);
    setShowAdd(true);
  };

  const submitLog = () => {
    setShowAdd(false);
    toast.success('Đã ghi nhận chỉ số mới');
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 rounded-2xl p-4 sm:p-5 text-white shadow-md flex items-center flex-wrap gap-4 sm:gap-5">
        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 text-2xl">
          💗
        </div>
        <div className="flex-1 min-w-[12rem]">
          <h2 className="text-white text-base">Theo dõi các chỉ số sức khoẻ của bạn</h2>
          <p className="text-sm text-white/90 mt-1">
            <span className="text-white">Lưu ý:</span> Các chỉ số được đồng bộ với bác sĩ phụ trách. Ghi nhận đều đặn để bác sĩ theo dõi và điều chỉnh phác đồ kịp thời.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <button onClick={openGoalModal} className="flex-1 sm:flex-none justify-center px-3 py-2.5 rounded-lg bg-white/15 text-white text-sm flex items-center gap-1.5 hover:bg-white/25 ring-1 ring-white/30">
            <Target size={14} /> {goal ? 'Đổi mục tiêu' : 'Đặt mục tiêu'}
          </button>
          <button onClick={() => setShowAdd(true)} className="flex-1 sm:flex-none justify-center px-3 py-2.5 rounded-lg bg-white text-emerald-700 text-sm flex items-center gap-1.5 hover:bg-emerald-50 shadow-sm">
            <Plus size={14} /> Ghi nhận mới
          </button>
        </div>
      </div>

      {/* Tình trạng hôm nay */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3 border-b border-gray-100">
          <div className="min-w-0">
            <h3 className="text-gray-900">Tình trạng hôm nay</h3>
            <p className="text-xs text-gray-500 mt-0.5">So sánh với ngưỡng an toàn do bác sĩ phụ trách thiết lập</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0 whitespace-nowrap">Cập nhật {new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-gray-100">
          {todayMetrics.map((m) => {
            const meta = statusMeta[m.status];
            return (
              <div key={m.key} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ring-4 ${meta.ring} bg-white flex items-center justify-center`}>
                    <m.icon size={18} className="text-gray-700" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${meta.chip} flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{m.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-gray-900" style={{ fontSize: '1.75rem' }}>{m.value}</p>
                  <p className="text-sm text-gray-500">{m.unit}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={11} /> {m.lastAt}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.range}</p>
                <button onClick={() => openQuickLog(m.key)} className="mt-3 w-full px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs hover:bg-gray-50 flex items-center justify-center gap-1">
                  <Plus size={12} /> Ghi {m.label.toLowerCase()}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Việc cần làm tiếp theo + Lưu ý từ bác sĩ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Next tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-emerald-600" />
              <h3 className="text-gray-900">Việc cần làm tiếp theo</h3>
            </div>
            <button onClick={() => navigate('/p/reminders')} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTasks.map((t) => (
              <div key={t.time + t.label} className="px-5 py-3 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${t.urgent ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <p className="text-xs">{t.time.split(':')[0]}h</p>
                  <p className="text-[10px]">{t.time.split(':')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900 truncate">{t.label}</p>
                    {t.urgent && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-700">Quan trọng</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Từ: {t.from}</p>
                </div>
                <button onClick={() => navigate('/p/reminders')} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Làm ngay</button>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor notes */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-700" />
              <h3 className="text-amber-800">Lưu ý từ bác sĩ phụ trách</h3>
            </div>
            <button onClick={() => navigate('/p/chat')} className="text-xs text-amber-700 hover:underline flex items-center gap-1">
              Trao đổi <MessageCircle size={12} />
            </button>
          </div>
          <div className="divide-y divide-amber-100">
            {doctorNotes.map((n) => (
              <div key={n.doctor + n.date} className="p-4 flex gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.tone}`}>{n.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-gray-900">{n.doctor}</p>
                    <span className="text-xs text-gray-500">• {n.specialty}</span>
                    <span className="text-xs text-gray-400">• {n.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{n.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goal + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal */}
        {goal && goalView ? (
          <button
            type="button"
            onClick={openGoalModal}
            className="text-left bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-md flex flex-col hover:ring-2 hover:ring-emerald-300 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/90 flex items-center gap-1.5"><Target size={14} /> Mục tiêu của bạn</p>
              <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25" title="Chỉnh sửa">
                <Pencil size={13} className="text-white" />
              </span>
            </div>
            <p className="mt-2">{goalView.title}</p>
            <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${goalView.pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-white/90 mt-2">
              <span>Đã đi {goalView.pct}%</span>
              <span>{goalView.remaining > 0 ? `Còn ${goalView.remaining} tuần` : 'Đã đến hạn'}</span>
            </div>
            <p className="text-xs text-white/90 mt-2">{goalView.onTrack ? '✨ Đang đúng tiến độ' : '⚠️ Hơi chậm so với kế hoạch'}</p>

            <div className="mt-auto pt-4 border-t border-white/20 mt-4">
              <p className="text-xs text-white/80">BMI hiện tại</p>
              <div className="flex items-baseline gap-1">
                <p style={{ fontSize: '1.5rem' }}>22.4</p>
                <p className="text-xs text-white/80">Bình thường</p>
              </div>
              <div className="h-1.5 bg-gradient-to-r from-blue-300 via-green-400 to-red-400 rounded-full relative mt-2">
                <div className="absolute -top-1 w-3 h-3 bg-white rounded-full border-2 border-emerald-600 shadow" style={{ left: '40%', transform: 'translateX(-50%)' }} />
              </div>
            </div>
          </button>
        ) : (
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 text-white shadow-md flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center ring-1 ring-white/30">
              <Target size={22} />
            </div>
            <p className="text-white mt-3">Bạn chưa đặt mục tiêu</p>
            <p className="text-sm text-white/90 mt-1">
              Đặt mục tiêu cân nặng giúp bạn theo dõi tiến độ và bác sĩ điều chỉnh chế độ phù hợp.
            </p>
            <button onClick={openGoalModal} className="mt-4 px-4 py-2 rounded-lg bg-white text-emerald-700 text-sm flex items-center gap-1.5 hover:bg-emerald-50 shadow-sm">
              <Plus size={14} /> Đặt mục tiêu
            </button>
            <div className="mt-auto pt-4 border-t border-white/20 mt-4 w-full">
              <p className="text-xs text-white/80">BMI hiện tại</p>
              <div className="flex items-baseline gap-1">
                <p style={{ fontSize: '1.5rem' }}>22.4</p>
                <p className="text-xs text-white/80">Bình thường</p>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex gap-2 overflow-x-auto max-w-full">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition whitespace-nowrap flex-shrink-0 ${
                    tab === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>
            <div className="inline-flex bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
              {(['7', '30', '90'] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded text-xs ${range === r ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'}`}>
                  {r}N
                </button>
              ))}
            </div>
          </div>
          <h3 className="text-gray-900 mb-3">
            {tab === 'weight' ? 'Cân nặng (kg)' : tab === 'bp' ? 'Huyết áp (mmHg)' : 'Đường huyết (mmol/L)'}
          </h3>
          <div style={{ width: '100%', height: 260 }} className="relative">
            {(() => {
              const W = 800, H = 260, P = 36;
              const n = parseInt(range);
              const wSlice = weightData90.slice(-n);
              const bSlice = bpData90.slice(-n);
              const gSlice = glucoseData90.slice(-n);
              const series: { name: string; values: number[]; color: string; fill?: string; labels: string[]; min: number; max: number; unit: string; format: (v: number) => string }[] =
                tab === 'weight'
                  ? [{ name: 'Cân nặng', values: wSlice.map((d) => d.w), labels: wSlice.map((d) => d.day), color: '#10b981', fill: 'rgba(16,185,129,0.18)', min: 62, max: 66, unit: 'kg', format: (v) => v.toFixed(1) }]
                  : tab === 'bp'
                  ? [
                      { name: 'Tâm thu', values: bSlice.map((d) => d.sys), labels: bSlice.map((d) => d.day), color: '#ef4444', min: 60, max: 140, unit: 'mmHg', format: (v) => v.toFixed(0) },
                      { name: 'Tâm trương', values: bSlice.map((d) => d.dia), labels: bSlice.map((d) => d.day), color: '#f97316', min: 60, max: 140, unit: 'mmHg', format: (v) => v.toFixed(0) },
                    ]
                  : [{ name: 'Đường huyết', values: gSlice.map((d) => d.v), labels: gSlice.map((d) => d.day), color: '#0ea5e9', fill: 'rgba(14,165,233,0.15)', min: 3, max: 9, unit: 'mmol/L', format: (v) => v.toFixed(1) }];
              const min = series[0].min, max = series[0].max;
              const labels = series[0].labels;
              const x = (i: number) => P + (i * (W - P * 2)) / (labels.length - 1);
              const y = (v: number) => H - P - ((v - min) / (max - min)) * (H - P * 2);
              const gridTicks = 4;
              const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = ((e.clientX - rect.left) / rect.width) * W;
                const idx = Math.round(((relX - P) / (W - P * 2)) * (labels.length - 1));
                setHoverIdx(Math.min(labels.length - 1, Math.max(0, idx)));
              };
              const tooltipLeftPct = hoverIdx != null ? (x(hoverIdx) / W) * 100 : 0;
              const placeRight = tooltipLeftPct < 60;
              return (
                <>
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '100%' }}
                    onMouseMove={handleMove}
                    onMouseLeave={() => setHoverIdx(null)}
                  >
                    {Array.from({ length: gridTicks + 1 }, (_, i) => {
                      const v = min + ((max - min) * i) / gridTicks;
                      const yy = y(v);
                      return (
                        <g key={`g-${i}`}>
                          <line x1={P} x2={W - P} y1={yy} y2={yy} stroke="#f3f4f6" strokeDasharray="3 3" />
                          <text x={4} y={yy + 4} fontSize={11} fill="#9ca3af">{v.toFixed(tab === 'glucose' ? 1 : 0)}</text>
                        </g>
                      );
                    })}
                    {labels.map((lab, i) => (
                      i % Math.max(1, Math.ceil(labels.length / 10)) === 0 ? (
                        <text key={`lab-${i}`} x={x(i)} y={H - 12} fontSize={11} fill="#9ca3af" textAnchor="middle">{lab}</text>
                      ) : null
                    ))}
                    {series.map((s, si) => {
                      const path = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
                      const area = s.fill ? `${path} L${x(s.values.length - 1)},${H - P} L${x(0)},${H - P} Z` : null;
                      return (
                        <g key={`s-${si}`}>
                          {area && <path d={area} fill={s.fill} />}
                          <path d={path} fill="none" stroke={s.color} strokeWidth={2} />
                          {s.values.map((v, i) => (
                            <circle key={`d-${si}-${i}`} cx={x(i)} cy={y(v)} r={hoverIdx === i ? 5 : 3} fill={s.color} stroke={hoverIdx === i ? '#fff' : 'none'} strokeWidth={hoverIdx === i ? 2 : 0} />
                          ))}
                        </g>
                      );
                    })}
                    {hoverIdx != null && (
                      <line x1={x(hoverIdx)} x2={x(hoverIdx)} y1={P} y2={H - P} stroke="#9ca3af" strokeDasharray="3 3" />
                    )}
                  </svg>
                  {hoverIdx != null && (
                    <div
                      className="absolute pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs min-w-[140px]"
                      style={{
                        left: `${tooltipLeftPct}%`,
                        top: 8,
                        transform: placeRight ? 'translateX(12px)' : 'translateX(calc(-100% - 12px))',
                      }}
                    >
                      <p className="text-gray-500 mb-1">{labels[hoverIdx]}</p>
                      {series.map((s) => (
                        <div key={s.name} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-gray-700">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            {s.name}
                          </span>
                          <span className="text-gray-900">{s.format(s.values[hoverIdx])} <span className="text-gray-400">{s.unit}</span></span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Lịch sử dạng timeline */}
      {(() => {
        const filterChips: { id: typeof historyFilter; label: string }[] = [
          { id: 'all', label: 'Tất cả' },
          { id: 'Cân nặng', label: 'Cân nặng' },
          { id: 'Huyết áp', label: 'Huyết áp' },
          { id: 'Đường huyết', label: 'Đường huyết' },
        ];
        const filteredGroups = historyTimeline
          .map((g) => ({ ...g, items: historyFilter === 'all' ? g.items : g.items.filter((it) => it.type === historyFilter) }))
          .filter((g) => g.items.length > 0);
        const visibleGroups = historyExpanded ? filteredGroups : filteredGroups.slice(0, 2);
        const totalItems = filteredGroups.reduce((n, g) => n + g.items.length, 0);
        const visibleItems = visibleGroups.reduce((n, g) => n + g.items.length, 0);
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3 border-b border-gray-100">
              <div className="min-w-0">
                <h3 className="text-gray-900">Lịch sử ghi nhận gần đây</h3>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị {visibleItems} / {totalItems} ghi nhận</p>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full -mx-1 px-1">
                {filterChips.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setHistoryFilter(c.id); setHistoryExpanded(false); }}
                    className={`px-2.5 py-1 rounded-full text-xs border transition whitespace-nowrap flex-shrink-0 ${
                      historyFilter === c.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-500">Chưa có ghi nhận nào ở mục này</p>
              </div>
            ) : (
              <div className="px-5 py-4">
                {visibleGroups.map((group, gi) => (
                  <div key={group.date} className={gi > 0 ? 'mt-5' : ''}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{group.date}</span>
                      <span className="text-xs text-gray-400">{group.items.length} mục</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="relative pl-5">
                      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-100" />
                      <div className="space-y-2.5">
                        {group.items.map((it) => (
                          <div key={it.time + it.type} className="relative group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition">
                            <span className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ring-2 ring-gray-200 ${it.color.split(' ')[1]}`} />
                            <div className={`w-10 h-10 rounded-xl ${it.color} flex items-center justify-center flex-shrink-0`}>
                              <it.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <p className="text-sm text-gray-900 truncate">{it.type}</p>
                                <span className="text-xs text-gray-400 flex items-center gap-0.5"><Clock size={10} />{it.time}</span>
                              </div>
                              {it.note !== '—' && <p className="text-xs text-gray-500 mt-0.5 truncate">{it.note}</p>}
                            </div>
                            <p className="text-sm text-gray-900 whitespace-nowrap">{it.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredGroups.length > 2 && (
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-center">
                <button
                  onClick={() => setHistoryExpanded((v) => !v)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  {historyExpanded ? 'Thu gọn' : `Xem tất cả (${totalItems})`}
                  <ChevronRight size={12} className={`transition-transform ${historyExpanded ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Goal modal */}
      {showGoal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowGoal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100">
                <Target size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-gray-900">{goal ? 'Đổi mục tiêu cân nặng' : 'Đặt mục tiêu cân nặng'}</h3>
                <p className="text-xs text-gray-500">Mục tiêu giúp bạn và bác sĩ theo dõi tiến độ</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Cân nặng hiện tại (kg)</label>
                  <input value={gStart} onChange={(e) => setGStart(e.target.value)} type="number" step="0.1" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  <p className="text-[11px] text-gray-400 mt-0.5">Lần ghi gần nhất: {LATEST_WEIGHT}kg</p>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Cân nặng mục tiêu (kg)</label>
                  <input value={gTarget} onChange={(e) => setGTarget(e.target.value)} type="number" step="0.1" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">Thời hạn (tuần)</label>
                <input value={gWeeks} onChange={(e) => setGWeeks(e.target.value)} type="number" min="1" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
                <div className="flex gap-1.5 mt-2">
                  {[4, 8, 12, 24].map((w) => (
                    <button key={w} type="button" onClick={() => setGWeeks(String(w))} className={`px-2.5 py-1 rounded-full text-xs border ${gWeeks === String(w) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                      {w} tuần
                    </button>
                  ))}
                </div>
              </div>
              {preview && (
                <div className={`rounded-xl p-3 border ${preview.safety.tone} flex items-start gap-2`}>
                  <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p>{preview.type === 'lose' ? 'Mục tiêu: Giảm cân' : preview.type === 'gain' ? 'Mục tiêu: Tăng cân' : 'Mục tiêu: Duy trì cân nặng'}</p>
                    <p className="mt-0.5">{preview.safety.label}</p>
                    {preview.type !== 'maintain' && preview.rate > 1 && (
                      <p className="mt-0.5 opacity-90">Khuyến nghị an toàn: 0.25 – 0.5 kg/tuần</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              {goal && (
                <button
                  onClick={() => { setGoal(null); setShowGoal(false); toast.success('Đã xoá mục tiêu'); }}
                  className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
                >
                  Xoá
                </button>
              )}
              <button onClick={() => setShowGoal(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Huỷ</button>
              <button onClick={saveGoal} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 size={14} /> Lưu mục tiêu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAdd(false); setQuickType(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-gray-900 mb-4">Ghi nhận chỉ số mới</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Loại chỉ số</label>
                <select defaultValue={quickType ?? 'glucose'} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg">
                  <option value="weight">Cân nặng (kg)</option>
                  <option value="bp">Huyết áp (mmHg)</option>
                  <option value="glucose">Đường huyết (mmol/L)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700">Giá trị</label>
                <input type="text" placeholder="VD: 6.2 hoặc 120/78" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-700">Ghi chú (tuỳ chọn)</label>
                <input type="text" placeholder="VD: Sau ăn 2h" className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setShowAdd(false); setQuickType(null); }} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Huỷ</button>
              <button onClick={submitLog} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 size={14} /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
