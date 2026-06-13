import { Users, HeartPulse, FileText, Activity, Download } from 'lucide-react';
import { MetricCard } from '@/app/shared/components/MetricCard';
import { SvgLineChart, SvgGroupedBarChart, SvgDonutChart } from '@/app/admin/reports/SvgCharts';
import { toast } from 'sonner';

const userGrowth = [
  { month: 'T10', users: 820 },
  { month: 'T11', users: 905 },
  { month: 'T12', users: 980 },
  { month: 'T1', users: 1056 },
  { month: 'T2', users: 1132 },
  { month: 'T3', users: 1210 },
  { month: 'T4', users: 1248 },
  { month: 'T5', users: 1284 },
];

const contentMix = [
  { name: 'Bài viết', value: 142, color: '#10b981' },
  { name: 'Công thức', value: 88, color: '#34d399' },
  { name: 'Thực đơn', value: 36, color: '#fbbf24' },
];

const appointmentsByDay = [
  { day: 'T2', completed: 18, cancelled: 2 },
  { day: 'T3', completed: 22, cancelled: 3 },
  { day: 'T4', completed: 25, cancelled: 1 },
  { day: 'T5', completed: 19, cancelled: 4 },
  { day: 'T6', completed: 28, cancelled: 2 },
  { day: 'T7', completed: 15, cancelled: 1 },
  { day: 'CN', completed: 9,  cancelled: 0 },
];

const topFoods = [
  { name: 'Cơm tẻ', queries: 1240 },
  { name: 'Ức gà',  queries: 980 },
  { name: 'Trứng', queries: 870 },
  { name: 'Cá hồi', queries: 720 },
  { name: 'Bông cải xanh', queries: 640 },
];

export function AdminReports() {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo & thống kê</h1>
            <p className="text-sm text-gray-500 mt-1">Dữ liệu tổng hợp toàn hệ thống — cập nhật 04/06/2026</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
              <option>8 tháng gần nhất</option>
              <option>3 tháng gần nhất</option>
              <option>Năm nay</option>
            </select>
            <button onClick={() => toast.success('Đang xuất báo cáo PDF...')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
              <Download size={15} /> Xuất PDF
            </button>
            <button onClick={() => toast.success('Đang xuất Excel...')} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-gray-50">
              <Download size={15} /> Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <MetricCard title="Tổng người dùng" value={1284} icon={Users} color="blue" trend="+56.6% so với 8 tháng trước" />
          <MetricCard title="Bệnh nhân theo dõi" value={326} icon={HeartPulse} color="green" trend="+18.2% tăng trưởng" />
          <MetricCard title="Lịch hẹn hoàn thành" value={892} icon={Activity} color="purple" trend="Tỷ lệ thành công 94%" />
          <MetricCard title="Nội dung xuất bản" value={266} icon={FileText} color="orange" trend="+12 trong tháng" />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Tăng trưởng người dùng</h2>
            <p className="text-xs text-gray-500 mb-4">Số lượng tài khoản theo tháng</p>
            <SvgLineChart height={260} data={userGrowth.map(d => ({ label: d.month, value: d.users }))} />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Cơ cấu nội dung</h2>
            <p className="text-xs text-gray-500 mb-4">Phân bố theo loại</p>
            <SvgDonutChart size={180} data={contentMix} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Lịch hẹn theo ngày</h2>
            <p className="text-xs text-gray-500 mb-4">Hoàn thành vs đã huỷ trong tuần</p>
            <SvgGroupedBarChart
              height={240}
              data={appointmentsByDay.map(d => ({ label: d.day, values: { completed: d.completed, cancelled: d.cancelled } }))}
              series={[
                { key: 'completed', name: 'Hoàn thành', color: '#10b981' },
                { key: 'cancelled', name: 'Đã huỷ',    color: '#f87171' },
              ]}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Top thực phẩm tra cứu</h2>
            <p className="text-xs text-gray-500 mb-4">5 thực phẩm phổ biến nhất</p>
            <ul className="space-y-3">
              {topFoods.map((f, i) => (
                <li key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{i + 1}. {f.name}</span>
                    <span className="text-xs text-gray-500">{f.queries.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${(f.queries / topFoods[0].queries) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
