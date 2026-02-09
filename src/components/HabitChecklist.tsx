'use client';

import { useState } from 'react';
import { Habit, HabitCategory, CheckStatus } from '@/types';
import { CATEGORY_INFO } from '@/data/constants';

interface HabitChecklistProps {
  habits: Habit[];
  getCheckStatus: (habitId: string) => CheckStatus;
  onToggle: (habitId: string) => void;
  disabled: boolean;
}

const CATEGORY_RIPPLE_COLOR: Record<HabitCategory, string> = {
  life: 'var(--color-accent)',
  hobby: 'var(--color-gold)',
  work: 'var(--color-success)',
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
  const [rippleKeys, setRippleKeys] = useState<Record<string, number>>({});

  if (categoryHabits.length === 0) return null;

  const handleToggle = (habitId: string) => {
    onToggle(habitId);
    setRippleKeys(prev => ({ ...prev, [habitId]: Date.now() }));
  };

  return (
    <div className="mb-4">
      <h3 className="text-xs text-text-secondary mb-2 px-1 tracking-wider uppercase">
        {info.emoji} {info.label}
      </h3>
      <div className="space-y-1.5">
        {categoryHabits.map(habit => {
          const status = getCheckStatus(habit.id);
          const isChecked = status !== 'none';
          const rippleKey = rippleKeys[habit.id];

          return (
            <button
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 p-2.5 rpg-panel
                transition-all duration-150 active:scale-[0.98]
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="relative">
                <div
                  className={`rpg-check ${
                    status === 'done' ? 'rpg-check-done check-pop' :
                    status === 'auto' ? 'rpg-check-auto check-pop' : ''
                  }`}
                >
                  {status === 'done' ? '✓' : status === 'auto' ? '★' : ''}
                </div>
                {isChecked && rippleKey && (
                  <div
                    key={rippleKey}
                    className="check-ripple absolute inset-0 pointer-events-none"
                    style={{ '--ripple-color': CATEGORY_RIPPLE_COLOR[category] } as React.CSSProperties}
                  />
                )}
              </div>
              <span className={`text-sm flex-1 text-left ${
                status === 'done' ? 'text-text-primary' :
                status === 'auto' ? 'text-gold' :
                'text-text-secondary'
              }`}>
                {habit.name}
              </span>
              {status === 'auto' && (
                <span className="text-xs sm:text-[11px] text-gold/70 tracking-wider">AUTO</span>
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
          クエストが登録されていません
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
