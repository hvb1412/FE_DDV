import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, Sparkles, ArrowLeft, ArrowRight, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const questions = [
  { id: 1, q: 'Bạn ăn rau xanh mấy bữa/ngày?', options: ['Hiếm khi', '1 bữa', '2 bữa', '3 bữa trở lên'] },
  { id: 2, q: 'Bạn ăn trái cây bao nhiêu lần/tuần?', options: ['Không ăn', '1-2 lần', '3-5 lần', 'Hàng ngày'] },
  { id: 3, q: 'Bạn uống bao nhiêu nước/ngày?', options: ['< 1L', '1-1.5L', '1.5-2L', '> 2L'] },
  { id: 4, q: 'Tần suất ăn đồ chiên rán?', options: ['Hàng ngày', '3-4 lần/tuần', '1-2 lần/tuần', 'Hiếm khi'] },
  { id: 5, q: 'Bạn vận động bao nhiêu phút/ngày?', options: ['Không', '< 15 phút', '15-30 phút', '> 30 phút'] },
  { id: 6, q: 'Bạn ngủ bao nhiêu giờ/đêm?', options: ['< 5 giờ', '5-6 giờ', '6-7 giờ', '7-8 giờ'] },
  { id: 7, q: 'Bạn có dùng thực phẩm bổ sung?', options: ['Không', 'Thỉnh thoảng', 'Thường xuyên', 'Hàng ngày'] },
];

type NutritionAssessmentProps = {
  userRole?: 'patient' | 'user';
};

export function NutritionAssessment({ userRole = 'user' }: NutritionAssessmentProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const handleSave = () => {
    toast.success('Đã lưu kết quả đánh giá');
  };

  const handleShare = () => {
    const message = userRole === 'patient'
      ? 'Đã chia sẻ kết quả với bác sĩ phụ trách'
      : 'Đã sao chép link chia sẻ';
    toast.success(message);
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    toast.info('Bắt đầu đánh giá lại');
  };

  if (done) {
    const score = Object.values(answers).reduce((s, v) => s + v, 0);
    const max = questions.length * 3;
    const percent = Math.round((score / max) * 100);
    const level = percent >= 75 ? 'Tốt' : percent >= 50 ? 'Trung bình' : 'Cần cải thiện';
    const tone = percent >= 75 ? 'from-emerald-500 to-green-600' : percent >= 50 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-600';

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Result card */}
          <div className={`bg-gradient-to-br ${tone} rounded-2xl p-4 sm:p-6 text-white text-center shadow-md lg:col-span-1`}>
            <ClipboardCheck size={48} className="mx-auto" />
            <p className="mt-3 text-white/90">Tình trạng dinh dưỡng</p>
            <h2 className="text-white mt-1">{level}</h2>
            <p className="mt-2 text-5xl">{percent}%</p>
            <p className="text-sm text-white/90">Điểm: {score}/{max}</p>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-amber-500" /> Khuyến nghị từ AI</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Bổ sung thêm rau xanh trong các bữa ăn chính (ít nhất 300g/ngày)</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Uống đủ 2 lít nước/ngày, chia nhỏ cả ngày</li>
              <li className="flex gap-2"><AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" /> Giảm tần suất đồ chiên rán xuống ≤ 2 lần/tuần</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Vận động ít nhất 30 phút/ngày, 5 ngày/tuần</li>
              <li className="flex gap-2"><AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" /> Đảm bảo ngủ đủ 7-8h mỗi đêm để cân bằng nội tiết</li>
            </ul>
          </div>
        </div>

        {/* Answer breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
          <h3 className="text-gray-900 mb-3">Chi tiết câu trả lời</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {questions.map((q) => (
              <div key={q.id} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                <span className="text-xs text-gray-500 mt-0.5">Q{q.id}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{q.q}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">→ {q.options[answers[q.id] ?? 0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleRetake} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
            Làm lại đánh giá
          </button>
          <button onClick={handleShare} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50">
            <Share2 size={16} /> {userRole === 'patient' ? 'Chia sẻ với bác sĩ' : 'Chia sẻ kết quả'}
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-700">
            <Save size={16} /> Lưu kết quả
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-700">Câu <strong className="text-gray-900">{step + 1}</strong> / {questions.length}</p>
          <p className="text-sm text-emerald-600">{Math.round(((step + 1) / questions.length) * 100)}% hoàn thành</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="flex gap-1 mt-3">
          {questions.map((qq, i) => (
            <div
              key={qq.id}
              className={`flex-1 h-1 rounded-full ${i < step ? 'bg-emerald-600' : i === step ? 'bg-emerald-400' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 shadow-sm">
        <p className="text-xs text-emerald-600 mb-2">CÂU HỎI {step + 1}</p>
        <h2 className="text-gray-900">{q.q}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {q.options.map((o, i) => (
            <button
              key={i}
              onClick={() => setAnswers({ ...answers, [q.id]: i })}
              className={`p-4 rounded-xl border-2 text-left transition ${
                answers[q.id] === i ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                  answers[q.id] === i ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-gray-900">{o}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-2">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="px-3 sm:px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50 flex items-center gap-2 hover:bg-gray-50 text-sm"
        >
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Câu trước</span><span className="sm:hidden">Trước</span>
        </button>
        <button
          onClick={() => {
            if (step < questions.length - 1) setStep(step + 1);
            else setDone(true);
          }}
          disabled={answers[q.id] === undefined}
          className="px-3 sm:px-5 py-2.5 rounded-xl bg-emerald-600 text-white disabled:opacity-50 flex items-center gap-2 hover:bg-emerald-700 text-sm"
        >
          {step === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
