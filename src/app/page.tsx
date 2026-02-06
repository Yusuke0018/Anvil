'use client';

import { useGameState } from '@/hooks/useGameState';
import LevelBar from '@/components/LevelBar';
import HabitChecklist from '@/components/HabitChecklist';
import StatsOverview from '@/components/StatsOverview';
import DailySubmit from '@/components/DailySubmit';
import LevelUpModal from '@/components/LevelUpModal';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import ResolutionGauge from '@/components/ResolutionGauge';
import WelcomeBackModal from '@/components/WelcomeBackModal';
import ComebackBanner from '@/components/ComebackBanner';
import { TITLES } from '@/data/titles';

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
    welcomeBackInfo,
    dismissWelcomeBack,
  } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  const equippedTitle = state.equippedTitleId
    ? TITLES.find(t => t.id === state.equippedTitleId)
    : null;

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-wide">
            <span className="text-accent">⚒</span> Anvil
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-text-secondary">{today}</p>
            {equippedTitle && (
              <span className="text-xs text-gold">
                {equippedTitle.icon} {equippedTitle.name}
              </span>
            )}
          </div>
        </div>
        <ThemeToggle />
      </header>

      <LevelBar level={state.character.level} currentXP={state.character.currentXP} />

      <ResolutionGauge gauge={state.resolutionGauge} />

      {state.comebackChallenge?.active && (
        <ComebackBanner challenge={state.comebackChallenge} />
      )}

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

      {welcomeBackInfo && (
        <WelcomeBackModal
          missedDays={welcomeBackInfo.missedDays}
          decayAmount={welcomeBackInfo.decayAmount}
          onDismiss={dismissWelcomeBack}
        />
      )}

      <BottomNav />
    </>
  );
}
