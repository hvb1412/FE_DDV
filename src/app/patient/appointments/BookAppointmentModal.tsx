import { useState, useRef, useEffect } from 'react';
import { Video, MapPin, ChevronLeft, ChevronRight, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

function ComboTime({
  value,
  placeholder,
  options,
  onChange,
  onBlurPad,
  suffix,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  onBlurPad?: boolean;
  suffix?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && listRef.current && value) {
      const active = listRef.current.querySelector<HTMLButtonElement>(`button[data-val="${value}"]`);
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, value]);

  const filtered = value ? options.filter((o) => o.startsWith(value)) : options;
  const display = filtered.length > 0 ? filtered : options;

  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            if (onBlurPad) {
              const v = e.target.value.replace(/\D/g, '');
              if (v) onChange(v.padStart(2, '0'));
            }
          }}
          placeholder={placeholder}
          maxLength={2}
          className="w-full pl-2 pr-6 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700"
          tabIndex={-1}
        >
          <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 left-0 right-0 max-h-44 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        >
          {display.map((o) => (
            <button
              key={o}
              type="button"
              data-val={o}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                value === o ? 'bg-emerald-600 text-white hover:bg-emerald-600' : 'text-gray-700'
              }`}
            >
              <span>{o}{suffix ?? ''}</span>
              {value === o && <CheckCircle2 size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const busySlots = new Set(['08:30', '10:00', '14:30', '16:00']);
const genSlots = (startH: number, endH: number) => {
  const out: string[] = [];
  for (let h = startH; h < endH; h++) {
    out.push(`${String(h).padStart(2, '0')}:00`);
    out.push(`${String(h).padStart(2, '0')}:30`);
  }
  return out;
};
const morningSlots = genSlots(8, 12);
const afternoonSlots = genSlots(14, 18);

export type BookedAppt = {
  date: string;
  time: string;
  mode: 'online' | 'offline';
  topic: string;
};

export type BookDoctor = {
  name: string;
  specialty: string;
  avatar: string;
};

export function BookAppointmentModal({
  open,
  onClose,
  doctor,
  onConfirm,
  initialDate = 22,
}: {
  open: boolean;
  onClose: () => void;
  doctor: BookDoctor;
  onConfirm?: (appt: BookedAppt) => void;
  initialDate?: number;
}) {
  const [bookMode, setBookMode] = useState<'online' | 'offline'>('online');
  const [bookTopic, setBookTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState<string>('');
  const [monthOffset, setMonthOffset] = useState(0);
  const effectiveTime = customTime || selectedSlot;

  useEffect(() => {
    if (open) {
      setSelectedSlot(null);
      setCustomTime('');
      setBookTopic('');
      setBookMode('online');
      setSelectedDate(initialDate);
      setMonthOffset(0);
    }
  }, [open, initialDate]);

  if (!open) return null;

  const confirmBook = () => {
    if (!effectiveTime) { toast.error('Vui lòng chọn giờ tư vấn'); return; }
    const month = 5 + monthOffset;
    const appt: BookedAppt = {
      date: `${String(selectedDate).padStart(2, '0')}/${String(month).padStart(2, '0')}/2026`,
      time: effectiveTime,
      mode: bookMode,
      topic: bookTopic || `Tư vấn ${doctor.specialty.toLowerCase()}`,
    };
    onConfirm?.(appt);
    toast.success(`Đã đặt lịch với ${doctor.name} lúc ${effectiveTime} ngày ${selectedDate}/${String(month).padStart(2, '0')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900">Đặt lịch tư vấn</h3>
              <p className="text-sm text-gray-500 mt-0.5">Chọn thời gian phù hợp với lịch của bạn</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white flex-shrink-0">{doctor.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">{doctor.name}</p>
                <span className="text-[10px] text-gray-500">• {doctor.specialty}</span>
              </div>
              <p className="text-[11px] text-gray-500">Bác sĩ phụ trách của bạn</p>
            </div>
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setMonthOffset((m) => m - 1)} className="p-1 hover:bg-white rounded"><ChevronLeft size={16} /></button>
                <p className="text-sm text-gray-900">Tháng {5 + monthOffset} / 2026</p>
                <button onClick={() => setMonthOffset((m) => m + 1)} className="p-1 hover:bg-white rounded"><ChevronRight size={16} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                  <div key={d} className="text-[10px] text-gray-500 py-1">{d}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    disabled={d < 21 && monthOffset === 0}
                    className={`aspect-square rounded-lg text-sm ${
                      d === selectedDate
                        ? 'bg-emerald-600 text-white'
                        : (d < 21 && monthOffset === 0)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-white text-gray-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start sm:items-center justify-between flex-wrap gap-2 mb-2">
                <p className="text-sm text-gray-700">Chọn giờ</p>
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" /> Còn trống
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200" /> Đang chọn
                  </span>
                  <span className="flex items-center gap-1 text-rose-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-200 ring-2 ring-rose-100" /> Đã đặt
                  </span>
                </div>
              </div>
              {(() => {
                const SlotBtn = ({ s }: { s: string }) => {
                  const isBusy = busySlots.has(s);
                  const isPicked = selectedSlot === s;
                  return (
                    <button
                      onClick={() => { if (!isBusy) { setSelectedSlot(s); setCustomTime(''); } }}
                      disabled={isBusy}
                      title={isBusy ? 'Khung giờ này đã có bệnh nhân khác' : `Chọn ${s}`}
                      className={`relative py-1.5 rounded-lg text-xs border-2 transition flex items-center justify-center gap-1 ${
                        isBusy
                          ? 'border-rose-200 bg-rose-50 text-rose-400 line-through cursor-not-allowed'
                          : isPicked
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200'
                          : 'border-emerald-300 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-sm'
                      }`}
                    >
                      {!isBusy && !isPicked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      {isPicked && <CheckCircle2 size={11} />}
                      {isBusy && <X size={10} strokeWidth={3} className="text-rose-500" />}
                      {s}
                    </button>
                  );
                };
                return (
                  <div className="rounded-lg border border-gray-200 p-3 space-y-3">
                    <div>
                      <p className="text-[11px] text-gray-500 mb-1.5">🌅 Buổi sáng (08:00 – 12:00)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {morningSlots.map((s) => <SlotBtn key={s} s={s} />)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-1.5">🌇 Buổi chiều (14:00 – 18:00)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {afternoonSlots.map((s) => <SlotBtn key={s} s={s} />)}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {(() => {
                const [curH, curM] = (customTime && /^\d{1,2}:\d{1,2}$/.test(customTime))
                  ? customTime.split(':')
                  : ['', ''];
                const norm = (v: string) => v.replace(/\D/g, '').slice(0, 2);
                const setH = (h: string) => {
                  const v = norm(h);
                  if (v && parseInt(v, 10) > 23) return;
                  setCustomTime(`${v}:${curM || '00'}`);
                  setSelectedSlot(null);
                };
                const setM = (m: string) => {
                  const v = norm(m);
                  if (v && parseInt(v, 10) > 59) return;
                  setCustomTime(`${curH || '08'}:${v}`);
                  setSelectedSlot(null);
                };
                const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
                const mins = ['00', '15', '30', '45'];
                return (
                  <div className="mt-2 flex items-center flex-wrap gap-1.5">
                    <span className="text-[11px] text-gray-600 flex-shrink-0">Giờ khác:</span>
                    <ComboTime value={curH} placeholder="Giờ" options={hours} onChange={setH} onBlurPad suffix="h" />
                    <span className="text-gray-400 text-xs">:</span>
                    <ComboTime value={curM} placeholder="Phút" options={mins} onChange={setM} onBlurPad suffix="'" />
                    <span className="text-[10px] text-amber-600 flex-shrink-0">⚠ Cần BS duyệt</span>
                  </div>
                );
              })()}

              <p className="text-sm text-gray-700 mt-4 mb-2">Hình thức</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button onClick={() => setBookMode('online')} className={`py-2 rounded-lg text-sm flex items-center justify-center gap-1 ${bookMode === 'online' ? 'bg-emerald-50 border border-emerald-600 text-emerald-700' : 'border border-gray-200 text-gray-700 hover:border-emerald-300'}`}>
                  <Video size={14} /> Online
                </button>
                <button onClick={() => setBookMode('offline')} className={`py-2 rounded-lg text-sm flex items-center justify-center gap-1 ${bookMode === 'offline' ? 'bg-emerald-50 border border-emerald-600 text-emerald-700' : 'border border-gray-200 text-gray-700 hover:border-emerald-300'}`}>
                  <MapPin size={14} /> Tại phòng
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-4 mb-1">Nội dung tư vấn</p>
          <textarea
            rows={3}
            value={bookTopic}
            onChange={(e) => setBookTopic(e.target.value)}
            placeholder={`VD: Em muốn trao đổi với ${doctor.name} về...`}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex gap-2 mt-5">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700">Huỷ</button>
            <button onClick={confirmBook} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white flex items-center justify-center gap-1 hover:bg-emerald-700">
              <CheckCircle2 size={16} /> Xác nhận đặt lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
