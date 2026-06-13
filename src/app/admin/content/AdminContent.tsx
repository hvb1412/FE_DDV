import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Search, Eye, Pencil, Trash2, FileText, BookOpen, UtensilsCrossed, ListChecks, X, Calendar, User as UserIcon, Tag, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

type TabKey = 'articles' | 'recipes' | 'menus';
type ContentStatus = 'published' | 'pending' | 'draft';

type Item = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: ContentStatus;
  date: string;
  excerpt: string;
};

const seed: Record<TabKey, Item[]> = {
  articles: [
    { id: 'A001', title: '10 món ăn tốt cho người tiểu đường', author: 'BS. Trần Thị A',  category: 'Bệnh lý',   status: 'published', date: '02/06/2026', excerpt: 'Tổng hợp 10 món ăn quen thuộc giúp kiểm soát đường huyết, phù hợp khẩu vị người Việt và dễ chuẩn bị tại nhà.' },
    { id: 'A002', title: 'Hiểu đúng về Carbohydrate',         author: 'BS. Hoàng Văn E',  category: 'Kiến thức', status: 'pending',   date: '04/06/2026', excerpt: 'Phân biệt carb đơn – carb phức và cách lựa chọn carb lành mạnh cho từng nhóm đối tượng.' },
    { id: 'A003', title: 'Dinh dưỡng cho mẹ bầu 3 tháng đầu', author: 'BS. Phạm Thị F',   category: 'Phụ nữ',    status: 'draft',     date: '05/06/2026', excerpt: 'Các nhóm chất thiết yếu và thực phẩm nên tránh trong tam cá nguyệt đầu tiên.' },
    { id: 'A004', title: 'Cách đọc nhãn dinh dưỡng',          author: 'BS. Lê Văn G',     category: 'Kiến thức', status: 'published', date: '31/05/2026', excerpt: 'Hướng dẫn đọc và so sánh nhãn dinh dưỡng khi đi siêu thị, kèm ví dụ minh hoạ.' },
    { id: 'A005', title: 'Protein cho người tập gym',         author: 'BS. Vũ Thị H',     category: 'Thể thao',  status: 'pending',   date: '03/06/2026', excerpt: 'Lượng protein cần thiết theo cân nặng & cường độ tập, cách phân bổ trong ngày.' },
  ],
  recipes: [
    { id: 'R001', title: 'Canh chua cá lóc',          author: 'BS. Trần Thị A', category: 'Món canh',    status: 'published', date: '01/06/2026', excerpt: 'Công thức canh chua truyền thống, ít muối, giàu omega-3 từ cá lóc.' },
    { id: 'R002', title: 'Gà hấp gừng ít muối',       author: 'BS. Hoàng Văn E', category: 'Món chính',  status: 'published', date: '28/05/2026', excerpt: 'Món hấp giữ trọn dinh dưỡng, phù hợp người tăng huyết áp.' },
    { id: 'R003', title: 'Salad ức gà rau xanh',      author: 'BS. Lê Văn G',    category: 'Món khai vị', status: 'draft',     date: '04/06/2026', excerpt: 'Salad low-carb dùng ức gà luộc và rau lá xanh, dressing dầu olive.' },
    { id: 'R004', title: 'Cháo yến mạch hạt sen',     author: 'BS. Phạm Thị F',  category: 'Bữa sáng',   status: 'pending',   date: '05/06/2026', excerpt: 'Bữa sáng giàu chất xơ hoà tan, hỗ trợ giấc ngủ và tiêu hoá.' },
  ],
  menus: [
    { id: 'M001', title: 'Thực đơn 7 ngày cho tiểu đường',  author: 'BS. Trần Thị A',  category: 'Bệnh lý', status: 'published', date: '02/06/2026', excerpt: '7 ngày × 3 bữa chính + 2 bữa phụ, tổng năng lượng 1600 kcal/ngày.' },
    { id: 'M002', title: 'Thực đơn giảm cân 1500 kcal',     author: 'BS. Hoàng Văn E', category: 'Giảm cân', status: 'published', date: '30/05/2026', excerpt: 'Thực đơn cân bằng macro, ưu tiên rau – đạm nạc – ngũ cốc nguyên hạt.' },
    { id: 'M003', title: 'Thực đơn ăn chay đầy đủ dinh dưỡng', author: 'BS. Vũ Thị H', category: 'Chế độ',   status: 'pending',   date: '04/06/2026', excerpt: 'Đảm bảo protein – B12 – sắt cho người ăn chay trường, không thiếu vi chất.' },
  ],
};

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'articles', label: 'Bài viết dinh dưỡng', icon: BookOpen },
  { key: 'recipes',  label: 'Công thức món ăn',    icon: UtensilsCrossed },
  { key: 'menus',    label: 'Thực đơn mẫu',         icon: ListChecks },
];

const statusBadge: Record<ContentStatus, { label: string; cls: string }> = {
  published: { label: 'Đã xuất bản', cls: 'bg-green-100 text-green-700' },
  pending:   { label: 'Chờ duyệt',   cls: 'bg-amber-100 text-amber-700' },
  draft:     { label: 'Nháp',        cls: 'bg-gray-100 text-gray-600' },
};

export function AdminContent() {
  const [active, setActive] = useState<TabKey>('articles');
  const [data, setData] = useState(seed);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');

  const [viewing, setViewing] = useState<Item | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Item | null>(null);
  const [confirmPub, setConfirmPub] = useState<Item | null>(null);

  const categories = useMemo(() => Array.from(new Set(data[active].map(i => i.category))), [data, active]);

  const filtered = data[active].filter(i => {
    const s = search.toLowerCase();
    const matchSearch = !s || i.title.toLowerCase().includes(s) || i.author.toLowerCase().includes(s);
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const applyTogglePublish = (item: Item) => {
    const nextStatus: ContentStatus = item.status === 'published' ? 'draft' : 'published';
    setData(d => ({
      ...d,
      [active]: d[active].map(i => i.id === item.id ? { ...i, status: nextStatus } : i),
    }));
    toast.success(nextStatus === 'published' ? `Đã xuất bản "${item.title}"` : `Đã gỡ xuất bản "${item.title}"`);
    setConfirmPub(null);
  };

  const saveEdit = (next: Item) => {
    setData(d => ({ ...d, [active]: d[active].map(i => i.id === next.id ? next : i) }));
    toast.success(`Đã cập nhật "${next.title}"`);
    setEditing(null);
  };

  const createItem = (payload: Omit<Item, 'id'>) => {
    const prefix = active === 'articles' ? 'A' : active === 'recipes' ? 'R' : 'M';
    setData(d => {
      const nums = d[active].map(i => parseInt(i.id.slice(1), 10) || 0);
      const next = Math.max(0, ...nums) + 1;
      const id = `${prefix}${String(next).padStart(3, '0')}`;
      const item: Item = { ...payload, id };
      return { ...d, [active]: [item, ...d[active]] };
    });
    toast.success(`Đã tạo "${payload.title}"`);
    setCreating(false);
  };

  const doDelete = (item: Item) => {
    setData(d => ({ ...d, [active]: d[active].filter(i => i.id !== item.id) }));
    toast.success(`Đã xoá "${item.title}"`);
    setConfirmDel(null);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-4 inline-flex">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setActive(t.key); setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tiêu đề hoặc tác giả..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="all">Tất cả danh mục</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="pending">Chờ duyệt</option>
              <option value="draft">Nháp</option>
            </select>
            <button
              onClick={() => setCreating(true)}
              className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium"
            >
              + Tạo mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <FileText size={28} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Chưa có nội dung</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Thử thay đổi bộ lọc hoặc tạo nội dung mới.</p>
              <button onClick={() => setCreating(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
                + Tạo nội dung mới
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Tác giả</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày đăng</th>
                  <th className="px-4 py-3">Xuất bản</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{i.title}</p>
                      <p className="text-xs text-gray-500">{i.id}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{i.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{i.category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[i.status].cls}`}>
                        {statusBadge[i.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{i.date}</td>
                    <td className="px-4 py-3">
                      <button
                        role="switch"
                        aria-checked={i.status === 'published'}
                        onClick={() => setConfirmPub(i)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                          i.status === 'published' ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          i.status === 'published' ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewing(i)} title="Xem" className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Eye size={15} /></button>
                        <button onClick={() => setEditing(i)} title="Chỉnh sửa" className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDel(i)} title="Xoá" className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewing && (
        <ViewModal
          item={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); }}
        />
      )}
      {editing && (
        <EditModal
          item={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
      {creating && (
        <CreateModal
          tabLabel={tabs.find(t => t.key === active)!.label}
          categories={categories}
          onClose={() => setCreating(false)}
          onCreate={createItem}
        />
      )}
      {confirmPub && (
        <ConfirmPublishModal
          item={confirmPub}
          onClose={() => setConfirmPub(null)}
          onConfirm={() => applyTogglePublish(confirmPub)}
        />
      )}
      {confirmDel && (
        <ConfirmDeleteModal
          item={confirmDel}
          onClose={() => setConfirmDel(null)}
          onConfirm={() => doDelete(confirmDel)}
        />
      )}
    </div>
  );
}

/* ---------- Modals ---------- */
function ModalShell({ title, onClose, children, footer, maxWidth = 'max-w-lg' }: {
  title: string; onClose: () => void; children: ReactNode; footer: ReactNode; maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl w-full ${maxWidth} shadow-2xl overflow-hidden max-h-[92vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end flex-shrink-0">{footer}</div>
      </div>
    </div>
  );
}

function ViewModal({ item, onClose, onEdit }: { item: Item; onClose: () => void; onEdit: () => void }) {
  return (
    <ModalShell
      title="Chi tiết nội dung"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Đóng</button>
          <button onClick={onEdit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium inline-flex items-center gap-1.5">
            <Pencil size={14} /> Chỉnh sửa
          </button>
        </>
      }
    >
      <div className="mb-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[item.status].cls}`}>
          {statusBadge[item.status].label}
        </span>
        <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">{item.title}</h2>
        <p className="text-xs text-gray-500 mt-1">{item.id}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Meta icon={<UserIcon size={14} />} label="Tác giả" value={item.author} />
        <Meta icon={<Tag size={14} />} label="Danh mục" value={item.category} />
        <Meta icon={<Calendar size={14} />} label="Ngày đăng" value={item.date} />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Tóm tắt</p>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg p-3">{item.excerpt}</p>
      </div>
    </ModalShell>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide flex items-center gap-1.5">{icon}{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}

function EditModal({ item, categories, onClose, onSave }: {
  item: Item; categories: string[]; onClose: () => void; onSave: (n: Item) => void;
}) {
  const [draft, setDraft] = useState<Item>(item);
  useEffect(() => setDraft(item), [item]);
  const submit = () => {
    if (!draft.title.trim()) { toast.error('Tiêu đề không được để trống'); return; }
    if (!draft.author.trim()) { toast.error('Tác giả không được để trống'); return; }
    if (!draft.category.trim()) { toast.error('Danh mục không được để trống'); return; }
    onSave(draft);
  };
  return (
    <ModalShell
      title="Chỉnh sửa nội dung"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
            Lưu thay đổi
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Tiêu đề">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tác giả">
            <input
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
          </Field>
          <Field label="Danh mục">
            <input
              list="content-cats"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
            <datalist id="content-cats">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Trạng thái">
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as ContentStatus })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="published">Đã xuất bản</option>
              <option value="pending">Chờ duyệt</option>
              <option value="draft">Nháp</option>
            </select>
          </Field>
          <Field label="Ngày đăng">
            <input
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              placeholder="dd/mm/yyyy"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
          </Field>
        </div>
        <Field label="Tóm tắt">
          <textarea
            rows={4}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none"
          />
        </Field>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CreateModal({ tabLabel, categories, onClose, onCreate }: {
  tabLabel: string; categories: string[]; onClose: () => void; onCreate: (n: Omit<Item, 'id'>) => void;
}) {
  const today = (() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  })();
  const [draft, setDraft] = useState<Omit<Item, 'id'>>({
    title: '', author: '', category: categories[0] || '', status: 'draft', date: today, excerpt: '',
  });
  const submit = () => {
    if (!draft.title.trim()) { toast.error('Tiêu đề không được để trống'); return; }
    if (!draft.author.trim()) { toast.error('Tác giả không được để trống'); return; }
    if (!draft.category.trim()) { toast.error('Danh mục không được để trống'); return; }
    onCreate({
      title: draft.title.trim(),
      author: draft.author.trim(),
      category: draft.category.trim(),
      status: draft.status,
      date: draft.date.trim() || today,
      excerpt: draft.excerpt.trim(),
    });
  };
  return (
    <ModalShell
      title={`Tạo ${tabLabel.toLowerCase()} mới`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm font-medium">
            Tạo nội dung
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Tiêu đề *">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="VD: 10 món ăn tốt cho người tiểu đường"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tác giả *">
            <input
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              placeholder="VD: BS. Trần Thị A"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
          </Field>
          <Field label="Danh mục *">
            <input
              list="content-cats-create"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Chọn hoặc nhập mới"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
            <datalist id="content-cats-create">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Trạng thái">
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as ContentStatus })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="draft">Nháp</option>
              <option value="pending">Chờ duyệt</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </Field>
          <Field label="Ngày đăng">
            <input
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              placeholder="dd/mm/yyyy"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
            />
          </Field>
        </div>
        <Field label="Tóm tắt">
          <textarea
            rows={4}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            placeholder="Mô tả ngắn gọn nội dung..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 resize-none"
          />
        </Field>
      </div>
    </ModalShell>
  );
}

function ConfirmPublishModal({ item, onClose, onConfirm }: { item: Item; onClose: () => void; onConfirm: () => void }) {
  const isPublishing = item.status !== 'published';
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            isPublishing ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {isPublishing ? <BookOpen size={22} /> : <FileText size={22} />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isPublishing ? 'Xác nhận xuất bản nội dung?' : 'Gỡ xuất bản nội dung?'}
          </h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            {isPublishing ? (
              <>Nội dung <span className="font-medium text-gray-800">"{item.title}"</span> sẽ hiển thị công khai cho người dùng. Bạn có chắc chắn muốn xuất bản?</>
            ) : (
              <>Nội dung <span className="font-medium text-gray-800">"{item.title}"</span> sẽ chuyển về trạng thái <span className="font-medium">Nháp</span> và ẩn khỏi người dùng.</>
            )}
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
              isPublishing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isPublishing ? 'Xác nhận xuất bản' : 'Gỡ xuất bản'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ item, onClose, onConfirm }: { item: Item; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-red-100 text-red-600">
            <Trash2 size={22} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Xoá vĩnh viễn nội dung?</h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Bạn sắp xoá <span className="font-medium text-gray-800">"{item.title}"</span> ({item.id}). Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-white">Huỷ</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700">
            Xoá vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}
