'use client';

import { useGameState } from '@/hooks/useGameState';
import StatCard from '@/components/StatCard';
import LevelBar from '@/components/LevelBar';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { expToNextLevel, xpPerHabit } from '@/lib/xp';

export default function StatusPage() {
  const { state } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  const { character } = state;
  const needed = expToNextLevel(character.level);
  const perHabit = xpPerHabit(character.level);
  const submittedDays = state.dailyRecords.filter(r => r.submitted).length;

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <h1 className="text-lg font-bold tracking-wide">
          <span className="text-accent">📊</span> ステータス
        </h1>
        <ThemeToggle />
      </header>

      <LevelBar level={character.level} currentXP={character.currentXP} />

      {/* ステータスカード */}
      <div className="px-4 space-y-3">
        <StatCard
          label="心力"
          emoji="🔥"
          value={character.stats.vitality}
          completions={character.totalCompletions.life}
          color="text-accent"
        />
        <StatCard
          label="探究力"
          emoji="⚔️"
          value={character.stats.curiosity}
          completions={character.totalCompletions.hobby}
          color="text-gold"
        />
        <StatCard
          label="知力"
          emoji="📖"
          value={character.stats.intellect}
          completions={character.totalCompletions.work}
          color="text-success"
        />
      </div>

      {/* 概要情報 */}
      <div className="px-4 mt-6">
        <div className="bg-bg-card rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium text-text-secondary mb-2">概要</h3>
          <InfoRow label="総獲得XP" value={`${character.totalXP.toLocaleString()} XP`} />
          <InfoRow label="次レベルまで" value={`${(needed - character.currentXP).toLocaleString()} XP`} />
          <InfoRow label="1習慣あたりXP" value={`${perHabit} XP`} />
          <InfoRow label="記録日数" value={`${submittedDays}日`} />
        </div>
      </div>

      <BottomNav />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
