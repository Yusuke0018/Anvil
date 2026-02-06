'use client';

import { useGameState } from '@/hooks/useGameState';
import LevelBar from '@/components/LevelBar';
import HabitChecklist from '@/components/HabitChecklist';
import StatsOverview from '@/components/StatsOverview';
import DailySubmit from '@/components/DailySubmit';
import LevelUpModal from '@/components/LevelUpModal';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
  const {
    state,
    today,
    isSubmitted,
    getCheckStatus,
    toggleCheck,
    submitDay,
    levelUpResult,
    dismissLevelUp,
    submittedXP,
    submittedAllDone,
  } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-wide">
            <span className="text-accent">⚒</span> Anvil
          </h1>
          <p className="text-xs text-text-secondary mt-1">{today}</p>
        </div>
        <ThemeToggle />
      </header>

      <LevelBar level={state.character.level} currentXP={state.character.currentXP} />

      <StatsOverview stats={state.character.stats} />

      <div className="mt-2">
        <HabitChecklist
          habits={state.habits}
          getCheckStatus={getCheckStatus}
          onToggle={toggleCheck}
          disabled={isSubmitted}
        />
      </div>

      <DailySubmit
        level={state.character.level}
        habits={state.habits}
        getCheckStatus={getCheckStatus}
        isSubmitted={isSubmitted}
        onSubmit={submitDay}
        xpGained={submittedXP}
        wasAllDone={submittedAllDone}
      />

      {levelUpResult && (
        <LevelUpModal result={levelUpResult} onDismiss={dismissLevelUp} />
      )}

      <BottomNav />
    </>
  );
}
