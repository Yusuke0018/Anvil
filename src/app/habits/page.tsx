'use client';

import { useGameState } from '@/hooks/useGameState';
import HabitEditor from '@/components/HabitEditor';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function HabitsPage() {
  const { state, addHabit, updateHabit, deleteHabit } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <header className="px-4 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-wider">
            <span className="text-accent">📋</span> クエスト管理
          </h1>
          <p className="text-[10px] text-text-secondary mt-1 tracking-wider">
            各カテゴリ最大3つまで登録可能
          </p>
        </div>
        <ThemeToggle />
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
