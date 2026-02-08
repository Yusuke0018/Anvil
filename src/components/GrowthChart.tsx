'use client';

import { DailyRecord } from '@/types';

interface GrowthChartProps {
  dailyRecords: DailyRecord[];
  currentLevel: number;
}

export default function GrowthChart({ dailyRecords, currentLevel }: GrowthChartProps) {
  const submitted = dailyRecords
    .filter(r => r.submitted)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (submitted.length < 2) {
    return (
      <div className="px-4 mb-4">
        <div className="rpg-panel p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3 tracking-wider">成長曲線</h3>
          <div className="text-xs text-text-secondary text-center py-8">
            2日以上の記録で成長グラフが表示されます
          </div>
        </div>
      </div>
    );
  }

  const dataPoints: { date: string; cumulativeXP: number }[] = [];
  let cumXP = 0;
  for (const record of submitted) {
    cumXP += record.xpGained;
    dataPoints.push({ date: record.date, cumulativeXP: cumXP });
  }

  const W = 320;
  const H = 160;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxXP = Math.max(...dataPoints.map(d => d.cumulativeXP), 1);
  const n = dataPoints.length;

  const points = dataPoints.map((d, i) => ({
    x: padL + (i / (n - 1)) * chartW,
    y: padT + chartH - (d.cumulativeXP / maxXP) * chartH,
  }));

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M ${padL},${padT + chartH} ` +
    points.map(p => `L ${p.x},${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x},${padT + chartH} Z`;

  const yLabels = [0, Math.round(maxXP / 2), maxXP];

  const firstDate = dataPoints[0].date.slice(5);
  const lastDate = dataPoints[dataPoints.length - 1].date.slice(5);

  return (
    <div className="px-4 mb-4">
      <div className="rpg-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-secondary tracking-wider">成長曲線</h3>
          <span className="text-xs text-accent pixel-num">Lv.{currentLevel} / {cumXP.toLocaleString()} EXP</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="xp-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yLabels.map((val, i) => {
            const y = padT + chartH - (val / maxXP) * chartH;
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--color-rpg-border-dim)" strokeWidth="0.5" />
                <text x={padL - 4} y={y + 3} textAnchor="end" fill="var(--color-text-secondary)" fontSize="8">
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#xp-gradient)" />

          <polyline
            points={polyline}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3.5"
            fill="var(--color-accent)"
            stroke="var(--color-bg-card)"
            strokeWidth="1.5"
          />

          <text x={padL} y={H - 4} fill="var(--color-text-secondary)" fontSize="8">{firstDate}</text>
          <text x={W - padR} y={H - 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize="8">{lastDate}</text>

          <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="var(--color-rpg-border-dim)" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
