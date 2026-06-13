import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, User, Activity, FileText, Calendar, Clock, Video, MapPin, X, CheckCircle2, TrendingUp, CheckCircle, AlertTriangle, Save, Bell, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';
import { useAppointments, type ApptMode } from '@/app/shared/stores/appointmentStore';

type Progress = 'improving' | 'stable' | 'needs-attention';

const progressOptions: { value: Progress; label: string; icon: typeof TrendingUp; style: string; activeStyle: string }[] = [
  { value: 'improving',       label: 'Tiến triển tốt', icon: TrendingUp,    style: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50', activeStyle: 'bg-emerald-500 border-emerald-500 text-white shadow-md' },
  { value: 'stable',          label: 'Ổn định',        icon: CheckCircle,   style: 'border-green-200 text-green-700 hover:bg-green-50',       activeStyle: 'bg-green-500 border-green-500 text-white shadow-md' },
  { value: 'needs-attention', label: 'Cần theo dõi',   icon: AlertTriangle, style: 'border-orange-200 text-orange-700 hover:bg-orange-50',    activeStyle: 'bg-orange-500 border-orange-500 text-white shadow-md' },
];

const weightData = [
  { month: 'T1', weight: 85, bmi: 28.5 },
  { month: 'T2', weight: 83, bmi: 27.8 },
  { month: 'T3', weight: 81, bmi: 27.2 },
  { month: 'T4', weight: 79, bmi: 26.5 },
  { month: 'T5', weight: 77, bmi: 25.8 },
];

const labResults = [
  { test: 'Huyết áp', value: '140/90', normal: '120/80', status: 'high' },
  { test: 'Glucose', value: '126 mg/dL', normal: '70-100', status: 'high' },
  { test: 'Cholesterol', value: '205 mg/dL', normal: '<200', status: 'high' },
  { test: 'HbA1c', value: '6.8%', normal: '<5.7%', status: 'high' },
  { test: 'BMI', value: '25.8', normal: '18.5-24.9', status: 'high' },
];

const activities = [
  { date: '08/05/2026', type: 'Tư vấn trực tuyến', note: 'Đánh giá tiến triển giảm cân' },
  { date: '01/05/2026', type: 'Tạo thực đơn', note: 'Thực đơn giảm cân 1800 kcal/ngày' },
  { date: '24/04/2026', type: 'Xét nghiệm', note: 'Cập nhật kết quả xét nghiệm máu' },
  { date: '15/04/2026', type: 'Tư vấn', note: 'Khám lần đầu, thiết lập kế hoạch' },
];

// Tên và chẩn đoán bệnh nhân hiện tại (trong thực tế sẽ lấy từ params/API)
const PATIENT_NAME = 'Nguyễn Văn B';
const PATIENT_DIAGNOSIS = 'Tiểu đường type 2, Tăng huyết áp';

interface CreateApptModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreateApptModal({ onClose, onCreated }: CreateApptModalProps) {
  const { addAppointment } = useAppointments();
  const [date, setDate] = useState('2026-06-11');
  const [time, setTime] = useState('09:00');
  const [mode, setMode] = useState<ApptMode>('online');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!topic.trim()) { toast.error('Vui lòng nhập chủ đề lịch hẹn'); return; }
    const [y, m, d] = date.split('-');
    addAppointment({
      patientName: PATIENT_NAME,
      patientDiagnosis: PATIENT_DIAGNOSIS,
      date: `${d}/${m}/${y}`,
      time,
      mode,
      topic: topic.trim(),
      notes: notes.trim(),
      status: 'pending_patient',
      createdBy: 'doctor',
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>
          <h3 className="text-gray-900 text-lg">Đã gửi lịch hẹn!</h3>
          <p className="text-gray-600 text-sm mt-2">
            Yêu cầu lịch hẹn đã được gửi đến <strong>{PATIENT_NAME}</strong>.
            Bệnh nhân sẽ nhận thông báo và xác nhận.
          </p>
          <div className="mt-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 text-left w-full">
            <p className="font-medium mb-1">📋 Chi tiết lịch hẹn</p>
            <p>{topic} • {time} ngày {date.split('-').reverse().join('/')}</p>
            <p>{mode === 'online' ? '💻 Online (Video call)' : '🏥 Tại phòng khám'}</p>
          </div>
          <div className="flex gap-3 mt-6 w-full">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
              Đóng
            </button>
            <button onClick={onCreated} className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 flex items-center justify-center gap-1.5">
              <Calendar size={14} /> Xem quản lý lịch hẹn
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-100 rounded-xl"><Calendar size={18} className="text-green-600" /></div>
            <div>
              <h2 className="font-semibold text-gray-900">Tạo lịch hẹn cho bệnh nhân</h2>
              <p className="text-xs text-gray-500 mt-0.5">Yêu cầu sẽ được gửi đến bệnh nhân để xác nhận</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
        </div>

        {/* Patient info */}
        <div className="mx-5 mt-4 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{PATIENT_NAME}</p>
            <p className="text-xs text-gray-500">{PATIENT_DIAGNOSIS}</p>
          </div>
        </div>

        <div className="mx-5 mt-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-700">
          <Bell size={13} className="mt-0.5 flex-shrink-0 text-blue-500" />
          <span>Sau khi tạo, hệ thống sẽ gửi thông báo đến bệnh nhân. Lịch hẹn xác nhận khi bệnh nhân đồng ý.</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn <span className="text-red-500">*</span></label>
              <input type="date" value={date} min="2026-06-03" onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ hẹn <span className="text-red-500">*</span></label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức</label>
            <div className="flex gap-3">
              {([['online', 'Online (Video call)', '💻'], ['offline', 'Tại phòng khám', '🏥']] as const).map(([val, label, emoji]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2 transition ${mode === val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề / Mục đích <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 appearance-none pr-8 bg-white"
              >
                <option value="">-- Chọn nhanh --</option>
                <option>Kiểm tra HbA1c định kỳ</option>
                <option>Xét nghiệm mỡ máu</option>
                <option>Tái khám sau điều trị</option>
                <option>Tư vấn điều chỉnh thực đơn</option>
                <option>Đánh giá tiến triển giảm cân</option>
                <option>Kiểm tra huyết áp định kỳ</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Hoặc nhập chủ đề khác..."
              className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho bệnh nhân</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Hướng dẫn chuẩn bị, yêu cầu đặc biệt (vd: nhịn ăn trước 8 tiếng)..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Huỷ</button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Bell size={14} /> Gửi yêu cầu đến bệnh nhân
          </button>
        </div>
      </div>
    </div>
  );
}

export function DoctorPatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [progress, setProgress] = useState<Progress>('needs-attention');
  const [savedProgress, setSavedProgress] = useState<Progress>('needs-attention');

  const currentOption = progressOptions.find(o => o.value === progress)!;
  const savedOption = progressOptions.find(o => o.value === savedProgress)!;
  const hasChanged = progress !== savedProgress;

  const handleSaveProgress = () => {
    setSavedProgress(progress);
    toast.success(`Đã cập nhật tiến triển: ${currentOption.label}`);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <Link to="/d" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          <span>Quay lại bảng điều khiển</span>
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User size={40} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nguyễn Văn B</h1>
                <p className="text-gray-500 text-sm mt-0.5">ID: {id} • Nam, 45 tuổi • Tiểu đường type 2</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <savedOption.icon size={13} className={savedProgress === 'improving' ? 'text-emerald-600' : savedProgress === 'stable' ? 'text-green-600' : 'text-orange-500'} />
                  <span className={`text-xs font-medium ${savedProgress === 'improving' ? 'text-emerald-600' : savedProgress === 'stable' ? 'text-green-600' : 'text-orange-500'}`}>
                    {savedOption.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress editor */}
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2 font-medium">Cập nhật tiến triển sức khoẻ</p>
              <div className="flex items-center gap-2">
                {progressOptions.map(opt => {
                  const Icon = opt.icon;
                  const isActive = progress === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setProgress(opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition ${isActive ? opt.activeStyle : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Icon size={14} />
                      {opt.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleSaveProgress}
                  disabled={!hasChanged}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${hasChanged ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <Save size={14} /> Lưu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-green-600" />
              Thông tin cá nhân
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="text-sm font-medium text-gray-900">Nguyễn Văn B</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tuổi</p>
                <p className="text-sm font-medium text-gray-900">45 tuổi</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giới tính</p>
                <p className="text-sm font-medium text-gray-900">Nam</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cân nặng</p>
                <p className="text-sm font-medium text-gray-900">77 kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Chiều cao</p>
                <p className="text-sm font-medium text-gray-900">172 cm</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BMI</p>
                <p className="text-sm font-medium text-orange-600">25.8 (Thừa cân)</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tiền sử bệnh</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Bệnh lý nền</p>
                  <p className="text-sm text-gray-900">Tiểu đường type 2, Tăng huyết áp</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dị ứng</p>
                  <p className="text-sm text-gray-900">Không có</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Thuốc đang dùng</p>
                  <p className="text-sm text-gray-900">Metformin 500mg, Lisinopril 10mg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-green-600" />
                Biểu đồ theo dõi sức khỏe
              </h2>

              <div className="mb-4">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">1 tháng</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">3 tháng</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">1 năm</button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis key="yaxis-left" yAxisId="left" label={{ value: 'Cân nặng (kg)', angle: -90, position: 'insideLeft' }} />
                  <YAxis key="yaxis-right" yAxisId="right" orientation="right" label={{ value: 'BMI', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line key="line-weight" yAxisId="left" type="monotone" dataKey="weight" stroke="#16a34a" name="Cân nặng" strokeWidth={2} />
                  <Line key="line-bmi" yAxisId="right" type="monotone" dataKey="bmi" stroke="#059669" name="BMI" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                Kết quả xét nghiệm
              </h2>

              <div className="space-y-3">
                {labResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.test}</p>
                      <p className="text-xs text-gray-500">Bình thường: {result.normal}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${result.status === 'high' ? 'text-orange-600' : 'text-green-600'}`}>
                        {result.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-green-600" />
              Lịch sử hoạt động
            </h2>

            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0 w-20 text-sm text-gray-500">{activity.date}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thực đơn & Dinh dưỡng</h2>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-emerald-900">Thực đơn hiện tại</p>
                <p className="text-xs text-emerald-700 mt-1">Chế độ giảm cân 1800 kcal/ngày</p>
                <p className="text-xs text-gray-600 mt-2">Cập nhật: 01/05/2026</p>
              </div>

              <Link
                to="/create-menu"
                className="block w-full px-4 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
              >
                Tạo thực đơn y khoa
              </Link>

              <button
                onClick={() => setShowBooking(true)}
                className="block w-full px-4 py-3 bg-teal-600 text-white text-center rounded-lg hover:bg-teal-700 transition-colors"
              >
                Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <CreateApptModal
          onClose={() => setShowBooking(false)}
          onCreated={() => { setShowBooking(false); navigate('/d/appointments'); }}
        />
      )}
    </div>
  );
}
