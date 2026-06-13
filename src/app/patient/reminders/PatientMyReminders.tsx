import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Pill, Activity, Apple, Droplet, Bell, CheckCircle2, Clock, AlertTriangle, Plus, Settings2, X } from 'lucide-react';

const initialReminders = [
  { id: 1, type: 'medication', icon: Pill, title: 'Uống Metformin 500mg', time: '08:00', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: true, done: true, color: 'text-red-600 bg-red-50' },
  { id: 2, type: 'measurement', icon: Activity, title: 'Đo đường huyết sau ăn sáng', time: '09:30', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: false, done: true, color: 'text-amber-600 bg-amber-50' },
  { id: 3, type: 'water', icon: Droplet, title: 'Uống 1 cốc nước', time: '08:00 – 20:00', from: 'Hệ thống', repeat: 'Mỗi 2 giờ', urgent: false, done: false, color: 'text-sky-600 bg-sky-50',
    slots: [
      { time: '08:00', done: true },
      { time: '10:00', done: true },
      { time: '12:00', done: false },
      { time: '14:00', done: false },
      { time: '16:00', done: false },
      { time: '18:00', done: false },
      { time: '20:00', done: false },
    ] as { time: string; done: boolean }[],
  },
  { id: 4, type: 'measurement', icon: Activity, title: 'Đo đường huyết sau ăn trưa', time: '13:30', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: false, done: false, color: 'text-amber-600 bg-amber-50' },
  { id: 5, type: 'diet', icon: Apple, title: 'Bữa phụ chiều — Hạt + trà xanh', time: '15:00', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: false, done: false, color: 'text-emerald-600 bg-emerald-50' },
  { id: 6, type: 'exercise', icon: Activity, title: 'Đi bộ 30 phút', time: '17:30', from: 'BS. Trần Thị A', repeat: '5 ngày/tuần', urgent: false, done: false, color: 'text-violet-600 bg-violet-50' },
  { id: 7, type: 'medication', icon: Pill, title: 'Uống Metformin 500mg', time: '20:00', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: true, done: false, color: 'text-red-600 bg-red-50' },
  { id: 8, type: 'measurement', icon: Activity, title: 'Đo huyết áp trước ngủ', time: '22:00', from: 'BS. Trần Thị A', repeat: 'Hàng ngày', urgent: false, done: false, color: 'text-rose-600 bg-rose-50' },
];

const categories = [
  { id: 'all', label: 'Tất cả', icon: Bell },
  { id: 'medication', label: 'Thuốc', icon: Pill },
  { id: 'measurement', label: 'Đo chỉ số', icon: Activity },
  { id: 'diet', label: 'Bữa ăn', icon: Apple },
  { id: 'water', label: 'Uống nước', icon: Droplet },
];

type Slot = { time: string; done: boolean };
type Reminder = (typeof initialReminders)[number] & { slots?: Slot[] };

const isDone = (r: Reminder) => (r.slots ? r.slots.every((s) => s.done) : r.done);

const typeMeta: Record<string, { icon: typeof Pill; color: string }> = {
  medication: { icon: Pill, color: 'text-red-600 bg-red-50' },
  measurement: { icon: Activity, color: 'text-amber-600 bg-amber-50' },
  diet: { icon: Apple, color: 'text-emerald-600 bg-emerald-50' },
  exercise: { icon: Activity, color: 'text-violet-600 bg-violet-50' },
  water: { icon: Droplet, color: 'text-sky-600 bg-sky-50' },
};

const newReminderTypes = [
  { id: 'medication', label: 'Thuốc' },
  { id: 'measurement', label: 'Đo chỉ số' },
  { id: 'diet', label: 'Bữa ăn' },
  { id: 'exercise', label: 'Vận động' },
];

export function PatientMyReminders() {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<Reminder[]>(initialReminders);
  const firedRef = useRef<Set<string>>(new Set());

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Add-form state
  const [form, setForm] = useState({ title: '', type: 'medication', time: '08:00', repeat: 'Hàng ngày' });

  // Settings state
  const [settings, setSettings] = useState({ browserNotif: true, sound: true, snoozeMin: 15 });

  const addReminder = () => {
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tên nhắc nhở');
      return;
    }
    const meta = typeMeta[form.type] ?? typeMeta.medication;
    const newItem: Reminder = {
      id: Math.max(0, ...items.map((i) => i.id)) + 1,
      type: form.type,
      icon: meta.icon,
      title: form.title.trim(),
      time: form.time,
      from: 'Bạn tự tạo',
      repeat: form.repeat,
      urgent: false,
      done: false,
      color: meta.color,
    };
    setItems([newItem, ...items]);
    setShowAdd(false);
    setForm({ title: '', type: 'medication', time: '08:00', repeat: 'Hàng ngày' });
    toast.success('Đã thêm nhắc nhở mới');
  };

  const snooze = (id: number) => {
    const r = items.find((i) => i.id === id);
    if (!r) return;
    const [h, m] = r.time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m + settings.snoozeMin, 0, 0);
    const newTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    setItems(items.map((i) => (i.id === id ? { ...i, time: newTime } : i)));
    firedRef.current.delete(`${new Date().toISOString().slice(0, 10)}-${id}`);
    toast(`⏰ Đã hoãn "${r.title}" thêm ${settings.snoozeMin} phút`, { description: `Nhắc lại lúc ${newTime}` });
  };

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const toggle = (id: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !isDone(i), slots: i.slots ? i.slots.map((s) => ({ ...s, done: !isDone(i) })) : undefined } : i)));

  const toggleSlot = (id: number, slotIndex: number) =>
    setItems(items.map((i) => (i.id === id && i.slots ? { ...i, slots: i.slots.map((s, idx) => (idx === slotIndex ? { ...s, done: !s.done } : s)) } : i)));

  const tryBrowserNotif = (title: string, body: string, tag: string) => {
    if (!settings.browserNotif) return;
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification(title, { body, tag }); } catch {}
    }
  };

  // Scheduler: check every 30s; if any slot/time matches current HH:MM and not done — fire reminder
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dayKey = now.toISOString().slice(0, 10);
      items.forEach((r) => {
        if (r.slots) {
          r.slots.forEach((s, idx) => {
            if (s.time === hhmm && !s.done) {
              const key = `${dayKey}-${r.id}-${idx}`;
              if (firedRef.current.has(key)) return;
              firedRef.current.add(key);
              toast(`💧 ${r.title}`, { description: `Đến giờ — slot ${s.time}` });
              tryBrowserNotif(r.title, `Đến giờ uống nước (${s.time})`, key);
            }
          });
        } else if (r.time === hhmm && !r.done) {
          const key = `${dayKey}-${r.id}`;
          if (firedRef.current.has(key)) return;
          firedRef.current.add(key);
          toast(`🔔 ${r.title}`, { description: `Đến giờ — ${r.time}` });
          tryBrowserNotif(r.title, `Đến giờ (${r.time})`, key);
        }
      });
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [items, settings.browserNotif]);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);
  const pending = items.filter((i) => !isDone(i)).length;
  const urgent = items.filter((i) => i.urgent && !isDone(i)).length;
  const done = items.length - pending;
  const completionRate = Math.round((done / items.length) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header banner — gộp giới thiệu + lưu ý + CTA */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5">
        <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 ring-1 ring-white/20 text-xl sm:text-2xl">
            🔔
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-base">Tổng hợp nhắc nhở do bác sĩ và hệ thống tạo</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              <span className="text-white">Lưu ý:</span> Nhắc nhở được bác sĩ tạo dựa trên chẩn đoán. Đừng tự ý dừng thuốc — liên hệ bác sĩ nếu có vấn đề.
            </p>
          </div>
        </div>
        <div className="flex gap-2 lg:flex-shrink-0">
          <button onClick={() => setShowSettings(true)} className="px-3 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm flex items-center gap-1.5 flex-1 lg:flex-none justify-center">
            <Settings2 size={14} /> Cài đặt
          </button>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2.5 rounded-lg bg-white text-emerald-700 text-sm flex items-center gap-1.5 hover:bg-emerald-50 shadow-sm flex-1 lg:flex-none justify-center whitespace-nowrap">
            <Plus size={14} /> Thêm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
            <Clock size={18} className="text-amber-600" />
          </div>
          <p className="text-xs text-gray-500">Cần làm</p>
          <p className="text-gray-900" style={{ fontSize: '1.5rem' }}>{pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-2">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <p className="text-xs text-gray-500">Quan trọng</p>
          <p className="text-gray-900" style={{ fontSize: '1.5rem' }}>{urgent}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="text-xs text-gray-500">Đã hoàn thành</p>
          <p className="text-gray-900" style={{ fontSize: '1.5rem' }}>{done}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 text-white shadow-md">
          <p className="text-xs text-white/90">Tỉ lệ tuân thủ hôm nay</p>
          <p className="text-white mt-2" style={{ fontSize: '1.5rem' }}>{completionRate}%</p>
          <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Filter sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit">
          <p className="text-sm text-gray-900 mb-3">Phân loại</p>
          <div className="space-y-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  filter === c.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <c.icon size={16} />
                <span className="flex-1 text-left">{c.label}</span>
                <span className="text-xs text-gray-400">
                  {c.id === 'all' ? items.length : items.filter((i) => i.type === c.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {[...filtered].sort((a, b) => {
            const aDone = isDone(a);
            const bDone = isDone(b);
            if (aDone !== bDone) return Number(aDone) - Number(bDone);
            // Pin water reminder to top when not fully done
            if (!aDone) {
              if (a.type === 'water' && b.type !== 'water') return -1;
              if (b.type === 'water' && a.type !== 'water') return 1;
            }
            return 0;
          }).map((r) => {
            const rDone = isDone(r);
            const slotsDone = r.slots ? r.slots.filter((s) => s.done).length : 0;
            const slotsTotal = r.slots?.length ?? 0;
            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl border ${r.urgent && !rDone ? 'border-red-300' : 'border-gray-100'} p-4 shadow-sm ${r.slots ? '' : 'flex items-center gap-4'}`}
              >
                <div className={r.slots ? 'flex items-center gap-3 sm:gap-4' : 'contents'}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${r.color} ${r.urgent && !rDone ? 'animate-pulse' : ''} flex-shrink-0`}>
                    <r.icon size={20} className="sm:size-[22]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-gray-900 ${rDone ? 'line-through text-gray-400' : ''}`}>{r.title}</p>
                      {r.urgent && !rDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700">Quan trọng</span>
                      )}
                      {rDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Đã xong</span>
                      )}
                      {r.slots && !rDone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">{slotsDone}/{slotsTotal} ly</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1 whitespace-nowrap"><Clock size={11} /> {r.time}</span>
                      <span className="whitespace-nowrap">{r.repeat}</span>
                      <span className="truncate">Từ: {r.from}</span>
                    </div>
                  </div>
                  {!r.slots && !rDone && <button onClick={() => snooze(r.id)} className="text-xs text-gray-500 hover:text-gray-700 hidden sm:inline whitespace-nowrap">Hoãn {settings.snoozeMin}p</button>}
                  {!r.slots && (
                    <button
                      onClick={() => toggle(r.id)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap ${
                        rDone ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {rDone ? 'Bỏ' : <><CheckCircle2 size={14} /> <span className="hidden sm:inline">Đánh dấu</span> xong</>}
                    </button>
                  )}
                </div>
                {r.slots && (() => {
                  const now = new Date();
                  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  const nextSlot = r.slots.find((s) => !s.done && s.time > hhmm);
                  const progressPct = Math.round((slotsDone / slotsTotal) * 100);
                  return (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-700">👆 Bấm vào từng giờ để đánh dấu <strong>đã uống</strong> ly nước đó</span>
                        </div>
                        <span className="text-xs text-sky-700">
                          {slotsDone === slotsTotal
                            ? '🎉 Đã uống đủ nước hôm nay'
                            : nextSlot
                            ? `⏰ Ly tiếp theo: ${nextSlot.time}`
                            : '⚠️ Còn ly chưa uống'}
                        </span>
                      </div>

                      <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-sky-500 transition-all" style={{ width: `${progressPct}%` }} />
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
                        {r.slots.map((s, idx) => {
                          const isCurrent = s.time <= hhmm && !s.done && (!r.slots![idx + 1] || r.slots![idx + 1].time > hhmm);
                          const isPast = s.time < hhmm && !s.done && !isCurrent;
                          return (
                            <button
                              key={s.time}
                              onClick={() => toggleSlot(r.id, idx)}
                              title={s.done ? `Đã uống lúc ${s.time} — bấm để bỏ đánh dấu` : `Bấm để đánh dấu đã uống ly ${s.time}`}
                              className={`relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition ${
                                s.done
                                  ? 'bg-sky-100 border-sky-300 text-sky-800'
                                  : isCurrent
                                  ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-200 animate-pulse'
                                  : isPast
                                  ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                  : 'bg-white border-dashed border-gray-300 text-gray-500 hover:border-sky-400 hover:bg-sky-50'
                              }`}
                            >
                              {/* Cup icon */}
                              <span className="relative inline-flex items-center justify-center">
                                <Droplet size={20} className={s.done ? 'fill-sky-500 text-sky-500' : isCurrent ? 'text-amber-600' : 'text-gray-400'} />
                                {s.done && (
                                  <CheckCircle2 size={10} className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full text-sky-600" />
                                )}
                              </span>
                              <span className="text-[11px] leading-none">{s.time}</span>
                              <span className={`text-[9px] leading-none ${s.done ? 'text-sky-600' : isCurrent ? 'text-amber-700' : isPast ? 'text-red-600' : 'text-gray-400'}`}>
                                {s.done ? 'Đã uống' : isCurrent ? 'Tới giờ!' : isPast ? 'Bỏ lỡ' : 'Sắp tới'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2.5">
                        💧 Mỗi ly ~250 ml • Hệ thống sẽ tự nhắc bạn khi đến giờ
                      </p>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add reminder modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Thêm nhắc nhở mới</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700 block mb-1.5">Tên nhắc nhở</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: Uống vitamin tổng hợp"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1.5">Loại</label>
                <div className="flex flex-wrap gap-2">
                  {newReminderTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm({ ...form, type: t.id })}
                      className={`px-3 py-2 rounded-lg text-sm border transition ${
                        form.type === t.id ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 block mb-1.5">Giờ</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 block mb-1.5">Lặp lại</label>
                  <select
                    value={form.repeat}
                    onChange={(e) => setForm({ ...form, repeat: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-white"
                  >
                    <option>Hàng ngày</option>
                    <option>5 ngày/tuần</option>
                    <option>Hàng tuần</option>
                    <option>Một lần</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={addReminder} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 flex items-center justify-center gap-1.5">
                <Plus size={14} /> Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Cài đặt nhắc nhở</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  const next = !settings.browserNotif;
                  setSettings({ ...settings, browserNotif: next });
                  if (next && typeof Notification !== 'undefined' && Notification.permission === 'default') {
                    Notification.requestPermission().catch(() => {});
                  }
                }}
                className="w-full flex items-center justify-between py-3 px-1"
              >
                <div className="text-left">
                  <p className="text-sm text-gray-900">Thông báo trình duyệt</p>
                  <p className="text-xs text-gray-500">Hiện thông báo khi đến giờ</p>
                </div>
                <span className={`w-11 h-6 rounded-full transition relative flex-shrink-0 ${settings.browserNotif ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${settings.browserNotif ? 'left-[22px]' : 'left-0.5'}`} />
                </span>
              </button>
              <button
                onClick={() => setSettings({ ...settings, sound: !settings.sound })}
                className="w-full flex items-center justify-between py-3 px-1 border-t border-gray-100"
              >
                <div className="text-left">
                  <p className="text-sm text-gray-900">Âm thanh nhắc nhở</p>
                  <p className="text-xs text-gray-500">Phát âm báo khi có nhắc nhở mới</p>
                </div>
                <span className={`w-11 h-6 rounded-full transition relative flex-shrink-0 ${settings.sound ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${settings.sound ? 'left-[22px]' : 'left-0.5'}`} />
                </span>
              </button>
              <div className="py-3 px-1 border-t border-gray-100">
                <p className="text-sm text-gray-900 mb-2">Thời gian hoãn (Hoãn)</p>
                <div className="flex gap-2">
                  {[5, 10, 15, 30].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSettings({ ...settings, snoozeMin: m })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm border transition ${
                        settings.snoozeMin === m ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {m}p
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSettings(false);
                toast.success('Đã lưu cài đặt');
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
