'use client';

import { useGameState } from '@/hooks/useGameState';
import GrowthChart from '@/components/GrowthChart';
import WeeklyChart from '@/components/WeeklyChart';
import CalendarView from '@/components/CalendarView';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { getRecordCompletionRate, isRecordPerfect } from '@/lib/completion-rate';

export default function HistoryPage() {
  const { state } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  const { character, dailyRecords, habits } = state;
  const submitted = dailyRecords.filter(r => r.submitted);
  const totalDays = submitted.length;
  const totalXP = character.totalXP;

  const avgCompletionRate = totalDays > 0
    ? submitted.reduce(
      (sum, r) => sum + getRecordCompletionRate(r, habits.length),
      0
    ) / totalDays
    : 0;

  const perfectDays = submitted.filter(r => isRecordPerfect(r, habits.length)).length;

  const maxDailyXP = submitted.length > 0
    ? Math.max(...submitted.map(r => r.xpGained))
    : 0;

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <h1 className="text-lg font-bold tracking-wider">
          <span className="text-accent">📜</span> 冒険記録
        </h1>
        <ThemeToggle />
      </header>

      <GrowthChart dailyRecords={dailyRecords} currentLevel={character.level} />

      <WeeklyChart dailyRecords={dailyRecords} fallbackTotalHabits={habits.length} />

      {/* 統計サマリー */}
      <div className="px-4 mb-4">
        <div className="rpg-panel p-4">
          <h3 className="text-xs font-medium text-text-secondary mb-3 tracking-widest uppercase">▸ 統計</h3>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="冒険日数" value={`${totalDays}日`} />
            <StatBox label="全達成日" value={`${perfectDays}日`} />
            <StatBox label="平均達成率" value={`${Math.round(avgCompletionRate * 100)}%`} />
            <StatBox label="総獲得EXP" value={`${totalXP.toLocaleString()}`} />
            <StatBox label="最高日次EXP" value={`${maxDailyXP.toLocaleString()}`} />
            <StatBox label="現在レベル" value={`Lv.${character.level}`} />
          </div>
        </div>
      </div>

      <CalendarView dailyRecords={dailyRecords} fallbackTotalHabits={habits.length} />

      <BottomNav />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface/40 border border-rpg-border-dim rounded-sm px-3 py-2.5">
      <div className="text-xs sm:text-[11px] text-text-secondary tracking-wider">{label}</div>
      <div className="text-sm font-bold text-text-primary mt-0.5 pixel-num">{value}</div>
    </div>
  );
}
