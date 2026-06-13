import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblings?: number;
  boundary?: number;
}

type Item = number | 'left-gap' | 'right-gap';

function buildRange(page: number, totalPages: number, siblings: number, boundary: number): Item[] {
  if (totalPages <= 1) return [1];

  const minVisible = boundary * 2 + siblings * 2 + 3;
  if (totalPages <= minVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPages = Array.from({ length: boundary }, (_, i) => i + 1);
  const endPages = Array.from({ length: boundary }, (_, i) => totalPages - boundary + 1 + i);

  const siblingStart = Math.max(page - siblings, boundary + 2);
  const siblingEnd = Math.min(page + siblings, totalPages - boundary - 1);

  const items: Item[] = [...startPages];
  if (siblingStart > boundary + 1) {
    items.push('left-gap');
  } else if (boundary + 1 < totalPages - boundary) {
    items.push(boundary + 1);
  }

  for (let i = siblingStart; i <= siblingEnd; i++) items.push(i);

  if (siblingEnd < totalPages - boundary) {
    items.push('right-gap');
  } else if (totalPages - boundary > boundary) {
    items.push(totalPages - boundary);
  }

  for (const p of endPages) {
    if (!items.includes(p)) items.push(p);
  }

  return items;
}

export function Pagination({ page, totalPages, onChange, siblings = 1, boundary = 1 }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildRange(page, totalPages, siblings, boundary);
  const goPrev = () => page > 1 && onChange(page - 1);
  const goNext = () => page < totalPages && onChange(page + 1);
  const jumpLeft = () => onChange(Math.max(1, page - (siblings * 2 + 1)));
  const jumpRight = () => onChange(Math.min(totalPages, page + (siblings * 2 + 1)));

  const btnBase = 'min-w-8 h-8 px-2 rounded-lg text-sm transition-colors flex items-center justify-center';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={goPrev}
        disabled={page === 1}
        aria-label="Trang trước"
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((it, idx) => {
        if (it === 'left-gap' || it === 'right-gap') {
          return (
            <button
              key={`${it}-${idx}`}
              onClick={it === 'left-gap' ? jumpLeft : jumpRight}
              aria-label={it === 'left-gap' ? 'Lùi nhanh' : 'Tiến nhanh'}
              className={`${btnBase} text-gray-400 hover:bg-gray-100 hover:text-gray-700`}
            >
              …
            </button>
          );
        }
        const active = it === page;
        return (
          <button
            key={it}
            onClick={() => onChange(it)}
            aria-current={active ? 'page' : undefined}
            className={`${btnBase} ${
              active
                ? 'bg-green-600 text-white shadow-sm'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {it}
          </button>
        );
      })}

      <button
        onClick={goNext}
        disabled={page === totalPages}
        aria-label="Trang sau"
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
