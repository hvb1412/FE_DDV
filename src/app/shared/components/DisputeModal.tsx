import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface DisputeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  apptInfo: { date: string; time: string; topic: string; counterpartName: string };
  filedBy: 'doctor' | 'patient';
}

const REASONS_BY_PATIENT = [
  'Bác sĩ không có mặt tại buổi tư vấn',
  'Bác sĩ đến trễ quá lâu',
  'Chất lượng tư vấn không như mong đợi',
  'Bị tính phí sai',
  'Khác',
];

const REASONS_BY_DOCTOR = [
  'Bệnh nhân không tham gia buổi tư vấn',
  'Bệnh nhân đến trễ quá lâu',
  'Hành vi không phù hợp trong buổi tư vấn',
  'Khác',
];

export function DisputeModal({ open, onClose, onSubmit, apptInfo, filedBy }: DisputeModalProps) {
  const [preset, setPreset] = useState<string>('');
  const [detail, setDetail] = useState('');

  if (!open) return null;

  const presets = filedBy === 'patient' ? REASONS_BY_PATIENT : REASONS_BY_DOCTOR;
  const counterpartLabel = filedBy === 'patient' ? 'bác sĩ' : 'bệnh nhân';

  const submit = () => {
    const reason = preset && preset !== 'Khác' ? `${preset}${detail.trim() ? ` — ${detail.trim()}` : ''}` : detail.trim();
    if (!preset) { toast.error('Vui lòng chọn lý do khiếu nại'); return; }
    if (preset === 'Khác' && reason.length < 10) { toast.error('Vui lòng mô tả chi tiết (tối thiểu 10 ký tự)'); return; }
    onSubmit(reason);
    setPreset('');
    setDetail('');
  };

  const close = () => { setPreset(''); setDetail(''); onClose(); };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={close}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Báo cáo sự cố / Khiếu nại</h3>
              <p className="text-xs text-gray-500">Quản trị viên sẽ xem xét trong 24h</p>
            </div>
          </div>
          <button onClick={close} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
            <p className="text-gray-600 text-xs">Lịch hẹn liên quan</p>
            <p className="text-gray-900 mt-0.5">{apptInfo.topic}</p>
            <p className="text-xs text-gray-500 mt-0.5">{apptInfo.date} • {apptInfo.time} • với {counterpartLabel} {apptInfo.counterpartName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lý do khiếu nại <span className="text-red-500">*</span></label>
            <div className="space-y-1.5">
              {presets.map(r => (
                <label key={r} className={`flex items-start gap-2 px-3 py-2 rounded-lg border cursor-pointer ${preset === r ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="dispute-reason"
                    checked={preset === r}
                    onChange={() => setPreset(r)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-gray-800">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mô tả chi tiết {preset === 'Khác' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Mô tả thêm để admin nắm rõ tình huống..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Thông tin này được gửi đến đội quản trị. Trạng thái lịch hẹn sẽ chuyển sang "Khiếu nại" cho đến khi được giải quyết.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={close} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center gap-1.5">
            <AlertTriangle size={14} /> Gửi khiếu nại
          </button>
        </div>
      </div>
    </div>
  );
}
