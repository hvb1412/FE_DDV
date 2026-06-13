import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open, onClose, title, children, size = 'md',
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const widthCls = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-2xl w-full ${widthCls} shadow-xl max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="text-xs text-gray-500 mb-1 block">{label}</span>{children}</label>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${props.className ?? ''}`} />;
}

export function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (n: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {v}
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="hover:text-emerald-900"><X size={12} /></button>
          </span>
        ))}
      </div>
      <Input placeholder={placeholder ?? 'Nhập rồi Enter để thêm…'} onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const v = (e.target as HTMLInputElement).value.trim();
          if (v) { onChange([...values, v]); (e.target as HTMLInputElement).value = ''; }
        }
      }} />
    </div>
  );
}

export function Btn({ variant = 'primary', ...props }: { variant?: 'primary' | 'ghost' | 'danger' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = variant === 'primary' ? 'bg-emerald-600 text-white hover:bg-emerald-700'
    : variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700'
    : 'border border-gray-300 text-gray-700 hover:bg-gray-50';
  return <button {...props} className={`flex-1 px-4 py-2 rounded-lg text-sm ${styles} ${props.className ?? ''}`} />;
}
