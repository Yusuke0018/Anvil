'use client';

import { useGameState } from '@/hooks/useGameState';
import HabitEditor from '@/components/HabitEditor';
import BottomNav from '@/components/BottomNav';

export default function HabitsPage() {
  const { state, addHabit, updateHabit, deleteHabit } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-lg font-bold tracking-wide">
          <span className="text-accent">📋</span> 習慣管理
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          各カテゴリ最大3つまで登録できます
        </p>
      </header>

      <HabitEditor
        habits={state.habits}
        onAdd={addHabit}
        onUpdate={updateHabit}
        onDelete={deleteHabit}
      />

      <BottomNav />
    </>
  );
}
