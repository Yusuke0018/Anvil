'use client';

import { useState } from 'react';
import { DailyRecord } from '@/types';

interface CalendarViewProps {
  dailyRecords: DailyRecord[];
  totalHabits: number;
}

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // 月曜始まり: getDay() は日=0, 月=1... → 月=0, 火=1... 日=6 に変換
  const startOffset = (firstDay.getDay() + 6) % 7;
  return { daysInMonth: lastDay.getDate(), startOffset };
}

function formatMonth(year: number, month: number): string {
  return `${year}年${month + 1}月`;
}

export default function CalendarView({ dailyRecords, totalHabits }: CalendarViewProps) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const { daysInMonth, startOffset } = getMonthDays(viewYear, viewMonth);

  // 今月の記録をMapに
  const recordMap = new Map<string, DailyRecord>();
  for (const r of dailyRecords) {
    recordMap.set(r.date, r);
  }

  const goBack = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const goForward = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="px-4 mb-4">
      <div className="bg-bg-card rounded-xl p-4">
        {/* ヘッダー: 月ナビゲーション */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={goBack} className="text-text-secondary px-2 py-1 active:scale-95">◀</button>
          <h3 className="text-sm font-medium text-text-primary">{formatMonth(viewYear, viewMonth)}</h3>
          <button onClick={goForward} className="text-text-secondary px-2 py-1 active:scale-95">▶</button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] text-text-secondary">{d}</div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1">
          {/* 空セル (月初のオフセット) */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* 日付セル */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = recordMap.get(dateStr);
            const isToday = dateStr === today;

            let bgColor = '';
            let dotColor = '';

            if (record?.submitted) {
              const completedCount = record.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
              const rate = totalHabits > 0 ? completedCount / totalHabits : 0;
              if (rate >= 1) {
                bgColor = 'bg-accent/20';
                dotColor = 'bg-accent';
              } else if (rate > 0) {
                bgColor = 'bg-gold/15';
                dotColor = 'bg-gold';
              } else {
                bgColor = 'bg-bg-surface';
                dotColor = 'bg-text-secondary/40';
              }
            }

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${bgColor} ${
                  isToday ? 'ring-1 ring-accent/50' : ''
                }`}
              >
                <span className={`text-[10px] ${isToday ? 'text-accent font-bold' : 'text-text-secondary'}`}>
                  {day}
                </span>
                {dotColor && (
                  <div className={`w-1 h-1 rounded-full ${dotColor} mt-0.5`} />
                )}
              </div>
            );
          })}
        </div>

        {/* 凡例 */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <LegendItem color="bg-accent" label="全達成" />
          <LegendItem color="bg-gold" label="一部達成" />
          <LegendItem color="bg-text-secondary/40" label="記録のみ" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] text-text-secondary">{label}</span>
    </div>
  );
}
