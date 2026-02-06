'use client';

import { useGameState } from '@/hooks/useGameState';
import GrowthChart from '@/components/GrowthChart';
import CalendarView from '@/components/CalendarView';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function HistoryPage() {
  const { state } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  const { character, dailyRecords, habits } = state;
  const submitted = dailyRecords.filter(r => r.submitted);
  const totalDays = submitted.length;
  const totalXP = character.totalXP;

  // 達成率 (全日平均)
  const avgCompletionRate = totalDays > 0
    ? submitted.reduce((sum, r) => {
        const done = r.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
        const total = habits.length || 1;
        return sum + done / total;
      }, 0) / totalDays
    : 0;

  // 全達成日数
  const perfectDays = submitted.filter(r => {
    const done = r.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
    return done === habits.length && habits.length > 0;
  }).length;

  // 日別XPの最高値
  const maxDailyXP = submitted.length > 0
    ? Math.max(...submitted.map(r => r.xpGained))
    : 0;

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <h1 className="text-lg font-bold tracking-wide">
          <span className="text-accent">📜</span> 履歴
        </h1>
        <ThemeToggle />
      </header>

      <GrowthChart dailyRecords={dailyRecords} currentLevel={character.level} />

      {/* 統計サマリー */}
      <div className="px-4 mb-4">
        <div className="bg-bg-card rounded-xl p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">統計</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="記録日数" value={`${totalDays}日`} />
            <StatBox label="全達成日" value={`${perfectDays}日`} />
            <StatBox label="平均達成率" value={`${Math.round(avgCompletionRate * 100)}%`} />
            <StatBox label="総獲得XP" value={`${totalXP.toLocaleString()}`} />
            <StatBox label="最高日次XP" value={`${maxDailyXP.toLocaleString()}`} />
            <StatBox label="現在レベル" value={`Lv.${character.level}`} />
          </div>
        </div>
      </div>

      <CalendarView dailyRecords={dailyRecords} totalHabits={habits.length} />

      <BottomNav />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface rounded-lg px-3 py-2.5">
      <div className="text-[10px] text-text-secondary">{label}</div>
      <div className="text-sm font-bold text-text-primary mt-0.5">{value}</div>
    </div>
  );
}
