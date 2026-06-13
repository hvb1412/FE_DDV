import { useState } from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, BookOpen, FileText, Star, Search, Video, Headphones } from 'lucide-react';

const faqs = [
  { q: 'Làm sao để tính nhu cầu năng lượng của tôi?', a: 'Vào tab "Máy tính năng lượng" trên sidebar, nhập thông tin cân nặng, chiều cao, tuổi, giới tính và mức độ vận động. Hệ thống sẽ tính toán theo công thức Mifflin-St Jeor.' },
  { q: 'Bảng RDA là gì và dùng như thế nào?', a: 'RDA (Recommended Dietary Allowances) là lượng các chất dinh dưỡng khuyến nghị mỗi ngày. Vào tab "Khuyến nghị dinh dưỡng" để xem bảng chi tiết theo từng nhóm tuổi và đối tượng.' },
  { q: 'AI nhận diện món ăn có chính xác không?', a: 'AI đạt độ chính xác ~90% với các món Việt phổ biến. Bạn nên kiểm tra lại kết quả và chỉnh sửa khẩu phần nếu cần.' },
  { q: 'Dữ liệu của tôi có được bảo mật không?', a: 'Toàn bộ dữ liệu được mã hoá end-to-end. Bạn có thể tải xuống hoặc xoá bất cứ lúc nào trong Cài đặt → Dữ liệu.' },
  { q: 'Tôi có thể tìm kiếm thực phẩm theo thành phần không?', a: 'Có. Dùng tính năng "Tra cứu thực phẩm" để tìm theo tên hoặc lọc theo nhóm thực phẩm như Tinh bột, Đạm, Rau củ, Trái cây,...' },
  { q: 'Phí sử dụng ứng dụng?', a: 'Các tính năng cơ bản miễn phí. Gói Premium (89k/tháng) mở khoá phân tích chuyên sâu và lịch sử dinh dưỡng không giới hạn.' },
  { q: 'Tôi có thể hỏi chuyên gia dinh dưỡng trực tiếp không?', a: 'Có. Sử dụng tính năng "Hỏi đáp dinh dưỡng" để chat với trợ lý AI hoặc liên hệ đội ngũ hỗ trợ qua email/hotline để kết nối với chuyên gia.' },
];

const guides = [
  { title: 'Hướng dẫn sử dụng app', desc: '8 bài học • 15 phút', icon: BookOpen, color: 'text-violet-600 bg-violet-50' },
  { title: 'Cách đọc chỉ số dinh dưỡng', desc: 'Bài viết • 5 phút đọc', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  { title: 'Mẹo dùng nhận diện món ăn', desc: 'Video • 3 phút', icon: Video, color: 'text-pink-600 bg-pink-50' },
  { title: 'Tính nhu cầu năng lượng đúng cách', desc: 'Bài viết • 4 phút đọc', icon: FileText, color: 'text-amber-600 bg-amber-50' },
];

export function UserSupport() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Hero with search */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-md text-center">
        <HelpCircle size={40} className="mx-auto" />
        <h2 className="text-white mt-3">Chúng tôi có thể giúp gì cho bạn?</h2>
        <p className="text-sm text-white/90 mt-1">Đội ngũ hỗ trợ Dinh Dưỡng Việt sẵn sàng 24/7</p>
        <div className="max-w-xl mx-auto mt-5 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Tìm câu hỏi, hướng dẫn, hoặc vấn đề..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Quick contact channels */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: MessageCircle, label: 'Chat hỗ trợ', sub: 'Phản hồi < 5 phút', color: 'text-emerald-600 bg-emerald-50' },
          { icon: Phone, label: 'Hotline 1900 1234', sub: '24/7 • Miễn phí', color: 'text-blue-600 bg-blue-50' },
          { icon: Mail, label: 'Gửi email', sub: 'support@dinhduongviet.vn', color: 'text-amber-600 bg-amber-50' },
          { icon: Headphones, label: 'Video call', sub: 'Hẹn cuộc gọi 1:1', color: 'text-pink-600 bg-pink-50' },
        ].map((c) => (
          <button key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition text-left">
            <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center`}>
              <c.icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-gray-900">Câu hỏi thường gặp</h3>
            <p className="text-xs text-gray-500 mt-1">Các thắc mắc phổ biến nhất từ người dùng</p>
          </div>
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <span className="text-sm text-gray-900 flex-1 pr-3">{f.q}</span>
                {open === i ? <ChevronDown size={18} className="text-emerald-600 flex-shrink-0" /> : <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50/50">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Guides */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-gray-900">Hướng dẫn</h3>
            </div>
            <div className="p-2">
              {guides.map((g) => (
                <button key={g.title} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left">
                  <div className={`w-10 h-10 rounded-xl ${g.color} flex items-center justify-center`}>
                    <g.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{g.title}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-gray-900 mb-1">Gửi phản hồi</h3>
            <p className="text-xs text-gray-500 mb-3">Ý kiến của bạn giúp chúng tôi cải thiện</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={24} className="text-amber-400 fill-amber-400 cursor-pointer hover:scale-110 transition" />
              ))}
            </div>
            <textarea rows={3} placeholder="Chia sẻ trải nghiệm của bạn..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button className="mt-2 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">Gửi phản hồi</button>
          </div>
        </div>
      </div>
    </div>
  );
}
