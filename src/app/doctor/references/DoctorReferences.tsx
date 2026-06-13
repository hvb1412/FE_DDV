import { useState } from 'react';
import { Search, BookOpen, FileText, Video, Link as LinkIcon, Download, Star, StarOff, Filter, ExternalLink } from 'lucide-react';

interface Reference {
  id: number;
  title: string;
  category: string;
  type: 'article' | 'guideline' | 'video' | 'tool';
  source: string;
  date: string;
  description: string;
  tags: string[];
  starred: boolean;
  downloadable: boolean;
}

const initialReferences: Reference[] = [
  {
    id: 1,
    title: 'Hướng dẫn dinh dưỡng cho bệnh nhân tiểu đường type 2',
    category: 'Tiểu đường',
    type: 'guideline',
    source: 'Bộ Y tế Việt Nam',
    date: '2025',
    description: 'Tài liệu hướng dẫn chi tiết về chế độ dinh dưỡng, khẩu phần ăn và thực phẩm khuyến nghị cho bệnh nhân tiểu đường type 2.',
    tags: ['tiểu đường', 'chế độ ăn', 'glucose'],
    starred: true,
    downloadable: true,
  },
  {
    id: 2,
    title: 'Bảng thành phần dinh dưỡng thực phẩm Việt Nam',
    category: 'Dinh dưỡng cơ bản',
    type: 'tool',
    source: 'Viện Dinh dưỡng Quốc gia',
    date: '2024',
    description: 'Cơ sở dữ liệu đầy đủ về thành phần dinh dưỡng của hơn 2.000 loại thực phẩm phổ biến tại Việt Nam.',
    tags: ['thực phẩm', 'dinh dưỡng', 'calories'],
    starred: true,
    downloadable: true,
  },
  {
    id: 3,
    title: 'Phác đồ điều trị tăng huyết áp bằng chế độ ăn DASH',
    category: 'Tim mạch',
    type: 'guideline',
    source: 'Hội Tim mạch học Việt Nam',
    date: '2025',
    description: 'Phác đồ điều chỉnh huyết áp thông qua chế độ ăn DASH kết hợp giảm muối và tăng cường kali.',
    tags: ['huyết áp', 'DASH', 'tim mạch'],
    starred: false,
    downloadable: true,
  },
  {
    id: 4,
    title: 'Video: Tư vấn dinh dưỡng cho bệnh nhân béo phì',
    category: 'Béo phì',
    type: 'video',
    source: 'Đại học Y Hà Nội',
    date: '2025',
    description: 'Chuỗi video hướng dẫn kỹ năng tư vấn dinh dưỡng và thay đổi hành vi ăn uống cho bệnh nhân béo phì.',
    tags: ['béo phì', 'tư vấn', 'hành vi'],
    starred: false,
    downloadable: false,
  },
  {
    id: 5,
    title: 'Nghiên cứu: Tác động của chế độ ăn Địa Trung Hải tới sức khỏe tim mạch',
    category: 'Tim mạch',
    type: 'article',
    source: 'Tạp chí Y học Việt Nam',
    date: '2024',
    description: 'Nghiên cứu lâm sàng trên 1.200 bệnh nhân về hiệu quả của chế độ ăn Địa Trung Hải trong phòng ngừa bệnh tim mạch.',
    tags: ['tim mạch', 'nghiên cứu', 'Địa Trung Hải'],
    starred: false,
    downloadable: true,
  },
  {
    id: 6,
    title: 'Hướng dẫn lập thực đơn cho bệnh nhân suy thận mãn tính',
    category: 'Thận',
    type: 'guideline',
    source: 'Bệnh viện Bạch Mai',
    date: '2025',
    description: 'Hướng dẫn chi tiết về hạn chế protein, kali, phospho và kiểm soát dịch cho bệnh nhân suy thận.',
    tags: ['thận', 'protein', 'phospho'],
    starred: true,
    downloadable: true,
  },
  {
    id: 7,
    title: 'Dinh dưỡng cho trẻ suy dinh dưỡng dưới 5 tuổi',
    category: 'Nhi khoa',
    type: 'guideline',
    source: 'UNICEF Việt Nam',
    date: '2024',
    description: 'Tài liệu hướng dẫn phục hồi dinh dưỡng cho trẻ suy dinh dưỡng cấp tính nặng và vừa.',
    tags: ['trẻ em', 'suy dinh dưỡng', 'nhi khoa'],
    starred: false,
    downloadable: true,
  },
  {
    id: 8,
    title: 'Bộ công cụ tính chỉ số BMI và nhu cầu năng lượng',
    category: 'Dinh dưỡng cơ bản',
    type: 'tool',
    source: 'WHO – Văn phòng Việt Nam',
    date: '2025',
    description: 'Công cụ trực tuyến tính BMI, nhu cầu năng lượng hàng ngày và mức độ hoạt động thể chất.',
    tags: ['BMI', 'calories', 'công cụ'],
    starred: false,
    downloadable: false,
  },
  {
    id: 9,
    title: 'Thực phẩm chức năng – Lợi ích và rủi ro trong lâm sàng',
    category: 'Dinh dưỡng cơ bản',
    type: 'article',
    source: 'Tạp chí Dinh dưỡng & Thực phẩm',
    date: '2025',
    description: 'Tổng quan về bằng chứng khoa học liên quan đến thực phẩm bổ sung và các lưu ý khi tư vấn cho bệnh nhân.',
    tags: ['thực phẩm chức năng', 'bổ sung', 'lâm sàng'],
    starred: false,
    downloadable: true,
  },
];

const typeConfig = {
  article: { label: 'Bài báo', icon: FileText, className: 'bg-blue-100 text-blue-700' },
  guideline: { label: 'Hướng dẫn', icon: BookOpen, className: 'bg-emerald-100 text-emerald-700' },
  video: { label: 'Video', icon: Video, className: 'bg-purple-100 text-purple-700' },
  tool: { label: 'Công cụ', icon: LinkIcon, className: 'bg-orange-100 text-orange-700' },
};

const categories = ['Tất cả', 'Tiểu đường', 'Tim mạch', 'Béo phì', 'Thận', 'Nhi khoa', 'Dinh dưỡng cơ bản'];

export function DoctorReferences() {
  const [references, setReferences] = useState(initialReferences);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedType, setSelectedType] = useState('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const toggleStar = (id: number) => {
    setReferences((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  const filtered = references.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'Tất cả' || r.category === selectedCategory;
    const matchType = selectedType === 'all' || r.type === selectedType;
    const matchStar = !showStarredOnly || r.starred;
    return matchSearch && matchCat && matchType && matchStar;
  });

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tài liệu tham khảo</h1>
          <p className="text-gray-500 mt-1">Thư viện hướng dẫn, nghiên cứu và công cụ hỗ trợ chuyên môn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, từ khóa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="all">Tất cả loại</option>
                <option value="guideline">Hướng dẫn</option>
                <option value="article">Bài báo</option>
                <option value="video">Video</option>
                <option value="tool">Công cụ</option>
              </select>
            </div>
            <button
              onClick={() => setShowStarredOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
                showStarredOnly
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Star size={14} className={showStarredOnly ? 'fill-yellow-400 text-yellow-400' : ''} />
              Đã đánh dấu
            </button>
            <span className="ml-auto text-sm text-gray-500">{filtered.length} tài liệu</span>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400 shadow-sm">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>Không tìm thấy tài liệu nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((ref) => {
              const cfg = typeConfig[ref.type];
              const TypeIcon = cfg.icon;
              return (
                <div
                  key={ref.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${cfg.className.replace('text-', 'text-').split(' ')[0]} bg-opacity-20`}>
                      <TypeIcon size={22} className={cfg.className.split(' ')[1]} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
                              <TypeIcon size={10} />
                              {cfg.label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{ref.category}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{ref.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{ref.source} · {ref.date}</p>
                        </div>
                        <button
                          onClick={() => toggleStar(ref.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
                          title={ref.starred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                        >
                          {ref.starred ? (
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{ref.description}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {ref.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          {ref.downloadable && (
                            <button className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 border border-emerald-200 rounded-lg text-xs hover:bg-emerald-50 transition-colors">
                              <Download size={12} />
                              Tải xuống
                            </button>
                          )}
                          <button className="flex items-center gap-1 px-3 py-1.5 text-green-600 border border-green-200 rounded-lg text-xs hover:bg-green-50 transition-colors">
                            <ExternalLink size={12} />
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}