'use client';

import { Habit, HabitCategory, CheckStatus } from '@/types';
import { CATEGORY_INFO } from '@/data/constants';

interface HabitChecklistProps {
  habits: Habit[];
  getCheckStatus: (habitId: string) => CheckStatus;
  onToggle: (habitId: string) => void;
  disabled: boolean;
}

const STATUS_STYLES: Record<CheckStatus, { bg: string; icon: string; ring: string }> = {
  done: { bg: 'bg-success', icon: '✓', ring: 'ring-2 ring-success' },
  auto: { bg: 'bg-gold', icon: '★', ring: 'ring-2 ring-gold' },
  none: { bg: 'bg-bg-surface', icon: '', ring: 'ring-1 ring-text-secondary/30' },
};

function CategorySection({
  category,
  habits,
  getCheckStatus,
  onToggle,
  disabled,
}: {
  category: HabitCategory;
  habits: Habit[];
  getCheckStatus: (habitId: string) => CheckStatus;
  onToggle: (habitId: string) => void;
  disabled: boolean;
}) {
  const info = CATEGORY_INFO[category];
  const categoryHabits = habits.filter(h => h.category === category);

  if (categoryHabits.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm text-text-secondary mb-2 px-1">
        {info.emoji} {info.label}
      </h3>
      <div className="space-y-2">
        {categoryHabits.map(habit => {
          const status = getCheckStatus(habit.id);
          const style = STATUS_STYLES[status];

          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 p-3 rounded-lg bg-bg-card
                transition-all duration-150 active:scale-[0.98] disabled:opacity-50
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all ${style.bg} ${style.ring}
                  ${status !== 'none' ? 'text-bg-deep check-pop' : 'text-text-secondary'}`}
              >
                {style.icon}
              </div>
              <span className={`text-sm flex-1 text-left ${
                status === 'done' ? 'text-text-primary' :
                status === 'auto' ? 'text-gold' :
                'text-text-secondary'
              }`}>
                {habit.name}
              </span>
              {status === 'auto' && (
                <span className="text-xs text-gold/70">自動</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HabitChecklist({
  habits,
  getCheckStatus,
  onToggle,
  disabled,
}: HabitChecklistProps) {
  if (habits.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-text-secondary text-sm">
          習慣が登録されていません
        </p>
        <p className="text-text-secondary text-xs mt-1">
          下部の「習慣」タブから追加してください
        </p>
      </div>
    );
  }

  return (
    <div className="px-4">
      {(['life', 'hobby', 'work'] as HabitCategory[]).map(cat => (
        <CategorySection
          key={cat}
          category={cat}
          habits={habits}
          getCheckStatus={getCheckStatus}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
