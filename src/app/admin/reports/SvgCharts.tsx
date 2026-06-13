import { useState } from 'react';

type Pt = { label: string; value: number };

export function SvgLineChart({
  data, height = 220, stroke = '#10b981', fill = 'rgba(16,185,129,0.12)',
}: { data: Pt[]; height?: number; stroke?: string; fill?: string }) {
  const w = 600;
  const h = height;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const span = Math.max(1, max - min);
  const top = max + span * 0.1;
  const bot = Math.max(0, min - span * 0.1);
  const yFor = (v: number) => padT + innerH - ((v - bot) / (top - bot)) * innerH;
  const xFor = (i: number) => padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const pts = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(' ');
  const area = `M ${xFor(0)},${padT + innerH} L ${pts.split(' ').join(' L ')} L ${xFor(data.length - 1)},${padT + innerH} Z`;
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => bot + ((top - bot) * i) / yTicks);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="overflow-visible">
      {ticks.map((t, i) => (
        <g key={`t${i}`}>
          <line x1={padL} x2={w - padR} y1={yFor(t)} y2={yFor(t)} stroke="#f3f4f6" />
          <text x={padL - 6} y={yFor(t) + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{Math.round(t)}</text>
        </g>
      ))}
      <path d={area} fill={fill} />
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={`p${i}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <circle cx={xFor(i)} cy={yFor(d.value)} r={hover === i ? 6 : 4} fill={stroke} stroke="#fff" strokeWidth={2} />
          <rect x={xFor(i) - 16} y={padT} width={32} height={innerH} fill="transparent" />
          <text x={xFor(i)} y={h - 8} textAnchor="middle" fontSize={11} fill="#9ca3af">{d.label}</text>
          {hover === i && (
            <g>
              <rect x={xFor(i) - 32} y={yFor(d.value) - 32} width={64} height={22} rx={6} fill="#111827" />
              <text x={xFor(i)} y={yFor(d.value) - 17} textAnchor="middle" fontSize={11} fill="#fff">{d.value}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export function SvgBarChart({
  data, height = 220, fill = '#34d399',
}: { data: Pt[]; height?: number; fill?: string }) {
  const w = 600;
  const h = height;
  const padL = 44, padR = 16, padT = 28, padB = 36;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = Math.max(...data.map(d => d.value), 1);
  const top = max * 1.15;
  const yFor = (v: number) => padT + innerH - (v / top) * innerH;
  const slot = innerW / data.length;
  const barW = Math.min(56, slot * 0.62);
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (top * i) / yTicks);
  const [hover, setHover] = useState<number | null>(null);
  const gradId = `bar-grad-${fill.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={`t${i}`}>
          <line x1={padL} x2={w - padR} y1={yFor(t)} y2={yFor(t)} stroke="#f3f4f6" strokeDasharray={i === 0 ? '0' : '3 3'} />
          <text x={padL - 8} y={yFor(t) + 4} textAnchor="end" fontSize={12} fill="#9ca3af">{Math.round(t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = padL + slot * i + slot / 2;
        const by = yFor(d.value);
        const bh = padT + innerH - by;
        const active = hover === i;
        return (
          <g key={`b${i}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={cx - slot / 2 + 2} y={padT} width={slot - 4} height={innerH} fill="transparent" />
            <rect
              x={cx - barW / 2}
              y={by}
              width={barW}
              height={bh}
              rx={8}
              fill={`url(#${gradId})`}
              opacity={hover === null || active ? 1 : 0.55}
              style={{ transition: 'opacity 120ms' }}
            />
            <text x={cx} y={by - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="#065f46">
              {d.value.toLocaleString('vi-VN')}
            </text>
            <text x={cx} y={h - 10} textAnchor="middle" fontSize={12} fill="#6b7280" fontWeight={active ? 600 : 400}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function SvgDonutChart({
  data, size = 200, thickness = 32,
}: { data: { name: string; value: number; color: string }[]; size?: number; thickness?: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 4;
  const inner = r - thickness;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const arcs = data.map((d) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const x3 = cx + inner * Math.cos(end),   y3 = cy + inner * Math.sin(end);
    const x4 = cx + inner * Math.cos(start), y4 = cy + inner * Math.sin(start);
    return { d, path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z` };
  });
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.d.color} />)}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={20} fontWeight={600} fill="#111827">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize={11} fill="#6b7280">tổng</text>
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-gray-700">{d.name}</span>
            <span className="text-gray-500">({Math.round((d.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SvgGroupedBarChart({
  data, series, height = 240,
}: {
  data: { label: string; values: Record<string, number> }[];
  series: { key: string; name: string; color: string }[];
  height?: number;
}) {
  const w = 600;
  const h = height;
  const padL = 36, padR = 12, padT = 12, padB = 40;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const max = Math.max(1, ...data.flatMap(d => series.map(s => d.values[s.key] ?? 0)));
  const top = max * 1.1;
  const yFor = (v: number) => padT + innerH - (v / top) * innerH;
  const slot = innerW / data.length;
  const groupW = Math.min(slot * 0.7, series.length * 18 + (series.length - 1) * 4);
  const barW = (groupW - (series.length - 1) * 4) / series.length;
  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (top * i) / yTicks);
  const [hover, setHover] = useState<{ i: number; s: number } | null>(null);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="overflow-visible">
      {ticks.map((t, i) => (
        <g key={`t${i}`}>
          <line x1={padL} x2={w - padR} y1={yFor(t)} y2={yFor(t)} stroke="#f3f4f6" />
          <text x={padL - 6} y={yFor(t) + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{Math.round(t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const groupStart = padL + slot * i + (slot - groupW) / 2;
        return (
          <g key={`g${i}`}>
            {series.map((s, si) => {
              const v = d.values[s.key] ?? 0;
              const x = groupStart + si * (barW + 4);
              const y = yFor(v);
              const bh = padT + innerH - y;
              const active = hover?.i === i && hover?.s === si;
              return (
                <g key={s.key} onMouseEnter={() => setHover({ i, s: si })} onMouseLeave={() => setHover(null)}>
                  <rect x={x} y={y} width={barW} height={bh} rx={4} fill={s.color} opacity={hover === null || active ? 1 : 0.6} />
                  {active && (
                    <g>
                      <rect x={x + barW / 2 - 32} y={y - 26} width={64} height={20} rx={6} fill="#111827" />
                      <text x={x + barW / 2} y={y - 12} textAnchor="middle" fontSize={11} fill="#fff">{s.name}: {v}</text>
                    </g>
                  )}
                </g>
              );
            })}
            <text x={padL + slot * i + slot / 2} y={h - 22} textAnchor="middle" fontSize={11} fill="#9ca3af">{d.label}</text>
          </g>
        );
      })}
      {series.map((s, i) => (
        <g key={s.key} transform={`translate(${padL + i * 100}, ${h - 8})`}>
          <circle cx={5} cy={-3} r={5} fill={s.color} />
          <text x={14} y={1} fontSize={11} fill="#6b7280">{s.name}</text>
        </g>
      ))}
    </svg>
  );
}
