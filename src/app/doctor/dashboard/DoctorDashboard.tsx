import { Users, UserPlus, Calendar, FileCheck } from 'lucide-react';
import { MetricCard } from '@/app/shared/components/MetricCard';
import { Link } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';

const consultationData = [
  { day: 'T2', completed: 4, cancelled: 1 },
  { day: 'T3', completed: 6, cancelled: 0 },
  { day: 'T4', completed: 3, cancelled: 2 },
  { day: 'T5', completed: 7, cancelled: 1 },
  { day: 'T6', completed: 5, cancelled: 0 },
  { day: 'T7', completed: 2, cancelled: 0 },
  { day: 'CN', completed: 1, cancelled: 0 },
];

const bmiTrendData = [
  { week: 'T1', avg: 28.4 },
  { week: 'T2', avg: 28.1 },
  { week: 'T3', avg: 27.8 },
  { week: 'T4', avg: 27.5 },
  { week: 'T5', avg: 27.2 },
  { week: 'T6', avg: 26.9 },
  { week: 'T7', avg: 26.6 },
  { week: 'T8', avg: 26.3 },
];

const diagnosisData = [
  { name: 'Tiểu đường', value: 38, color: '#10b981' },
  { name: 'Tăng huyết áp', value: 27, color: '#059669' },
  { name: 'Béo phì', value: 18, color: '#34d399' },
  { name: 'Cholesterol', value: 10, color: '#6ee7b7' },
  { name: 'Khác', value: 7, color: '#a7f3d0' },
];

const progressData = [
  { month: 'T1', improving: 58, stable: 30, attention: 12 },
  { month: 'T2', improving: 62, stable: 28, attention: 10 },
  { month: 'T3', improving: 65, stable: 27, attention: 8 },
  { month: 'T4', improving: 70, stable: 24, attention: 6 },
  { month: 'T5', improving: 74, stable: 20, attention: 6 },
];

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-xs">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export function DoctorDashboard() {
  const totalPatients = diagnosisData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bảng điều khiển chuyên gia</h1>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricCard title="Tổng số bệnh nhân" value={245} icon={Users} color="blue" />
          <MetricCard title="Bệnh nhân mới tuần này" value={12} icon={UserPlus} color="green" trend="+8% so với tuần trước" />
          <MetricCard title="Lịch tư vấn hôm nay" value={5} icon={Calendar} color="purple" />
          <MetricCard title="Cần duyệt thực đơn" value={8} icon={FileCheck} color="orange" />
        </div>

        {/* Row 1: Bar + Donut */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Consultations per day */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">Tư vấn trong tuần</h2>
              <p className="text-xs text-gray-500 mt-0.5">Số buổi tư vấn hoàn thành và huỷ theo ngày</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="consultation-chart" data={consultationData} barGap={4} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltipBar />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="completed" name="Hoàn thành" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" name="Huỷ" fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Diagnosis distribution */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">Phân bổ chẩn đoán</h2>
              <p className="text-xs text-gray-500 mt-0.5">Tỉ lệ bệnh lý trong nhóm bệnh nhân</p>
            </div>
            <div className="flex flex-col items-center">
              <PieChart id="diagnosis-chart" width={160} height={160}>
                <Pie data={diagnosisData} cx={75} cy={75} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {diagnosisData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${Math.round((v / totalPatients) * 100)}%`, '']} />
              </PieChart>
              <div className="w-full space-y-1.5 mt-2">
                {diagnosisData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-700">{d.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{Math.round((d.value / totalPatients) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: BMI trend + Progress stacked */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Average BMI trend */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">Xu hướng BMI trung bình</h2>
              <p className="text-xs text-gray-500 mt-0.5">Chỉ số BMI trung bình nhóm bệnh nhân 8 tuần qua</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart id="bmi-chart" data={bmiTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis domain={[25, 30]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltipBar />} />
                <Line type="monotone" dataKey="avg" name="BMI TB" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Patient progress over months */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">Tiến triển bệnh nhân theo tháng</h2>
              <p className="text-xs text-gray-500 mt-0.5">Tỉ lệ % nhóm tiến triển tốt, ổn định, cần theo dõi</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart id="progress-chart" data={progressData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltipBar />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="improving" name="Tiến triển tốt" stackId="a" fill="#10b981" />
                <Bar dataKey="stable" name="Ổn định" stackId="a" fill="#6ee7b7" />
                <Bar dataKey="attention" name="Cần theo dõi" stackId="a" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
