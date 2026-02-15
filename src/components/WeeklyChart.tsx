'use client';

import { DailyRecord } from '@/types';
import { getRecordCompletionRate } from '@/lib/completion-rate';

interface WeeklyChartProps {
  dailyRecords: DailyRecord[];
  fallbackTotalHabits: number;
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export default function WeeklyChart({ dailyRecords, fallbackTotalHabits }: WeeklyChartProps) {
  if (fallbackTotalHabits === 0) return null;

  const today = new Date();
  const days: { date: string; label: string; rate: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const weekday = WEEKDAY_LABELS[d.getDay()];

    const record = dailyRecords.find(r => r.date === dateStr && r.submitted);
    let rate = 0;
    if (record) {
      rate = Math.round(getRecordCompletionRate(record, fallbackTotalHabits) * 100);
    }

    days.push({ date: dateStr, label: weekday, rate });
  }

  const W = 320;
  const H = 140;
  const padL = 12;
  const padR = 12;
  const padT = 20;
  const padB = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barGap = 8;
  const barW = (chartW - barGap * 6) / 7;

  return (
    <div className="px-4 mb-4">
      <div className="rpg-panel p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-3 tracking-wider">週間達成率</h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* ベースライン */}
          <line
            x1={padL} y1={padT + chartH}
            x2={W - padR} y2={padT + chartH}
            stroke="var(--color-rpg-border-dim)" strokeWidth="0.5"
          />

          {days.map((day, i) => {
            const x = padL + i * (barW + barGap);
            const barH = (day.rate / 100) * chartH;
            const y = padT + chartH - barH;

            const color =
              day.rate === 100 ? 'var(--color-accent)' :
              day.rate > 0 ? 'var(--color-gold)' :
              'var(--color-rpg-border-dim)';

            const minBarH = day.rate > 0 ? Math.max(barH, 3) : 3;
            const minY = padT + chartH - minBarH;

            return (
              <g key={day.date}>
                {/* バー */}
                <rect
                  x={x}
                  y={day.rate > 0 ? y : minY}
                  width={barW}
                  height={day.rate > 0 ? barH : minBarH}
                  rx={2}
                  fill={color}
                  opacity={day.rate === 0 ? 0.3 : 0.85}
                />
                {/* 達成率% */}
                <text
                  x={x + barW / 2}
                  y={day.rate > 0 ? y - 4 : minY - 4}
                  textAnchor="middle"
                  fill="var(--color-text-secondary)"
                  fontSize="8"
                >
                  {day.rate}%
                </text>
                {/* 曜日ラベル */}
                <text
                  x={x + barW / 2}
                  y={H - 2}
                  textAnchor="middle"
                  fill="var(--color-text-secondary)"
                  fontSize="9"
                >
                  {day.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
