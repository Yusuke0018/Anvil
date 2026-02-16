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

const CATEGORY_BORDER_COLOR: Record<HabitCategory, string> = {
  life: 'var(--color-accent)',
  hobby: 'var(--color-gold)',
  work: 'var(--color-success)',
};

const CATEGORY_BG_TINT: Record<HabitCategory, string> = {
  life: 'var(--color-accent-dim)',
  hobby: 'var(--color-gold-dim)',
  work: 'var(--color-success-dim)',
};

function compareHabits(a: Habit, b: Habit): number {
  if (a.order !== b.order) return a.order - b.order;
  if (a.createdAt !== b.createdAt) return a.createdAt.localeCompare(b.createdAt);
  return a.id.localeCompare(b.id);
}

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
  const categoryHabits = habits.filter(h => h.category === category).sort(compareHabits);
  const [rippleKeys, setRippleKeys] = useState<Record<string, number>>({});

  if (categoryHabits.length === 0) return null;

  const doneCount = categoryHabits.filter(h => {
    const s = getCheckStatus(h.id);
    return s === 'done';
  }).length;
  const allDone = doneCount === categoryHabits.length;

  const handleToggle = (habitId: string) => {
    onToggle(habitId);
    setRippleKeys(prev => ({ ...prev, [habitId]: Date.now() }));
  };

  return (
    <div
      className="mb-5 rpg-panel overflow-hidden"
      style={{
        borderColor: allDone ? CATEGORY_BORDER_COLOR[category] : undefined,
        boxShadow: allDone ? `0 0 12px ${CATEGORY_BG_TINT[category]}, inset 0 0 0 1px ${CATEGORY_BG_TINT[category]}` : undefined,
      }}
    >
      {/* カテゴリヘッダー */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: CATEGORY_BG_TINT[category] }}
      >
        <h3 className="text-sm font-bold tracking-wider" style={{ color: CATEGORY_BORDER_COLOR[category] }}>
          {info.emoji} {info.label}
        </h3>
        <span
          className="text-xs font-bold pixel-num px-2 py-0.5 rounded-sm"
          style={{
            color: allDone ? 'var(--color-bg-card)' : CATEGORY_BORDER_COLOR[category],
            background: allDone ? CATEGORY_BORDER_COLOR[category] : 'transparent',
            border: allDone ? 'none' : `1px solid ${CATEGORY_BORDER_COLOR[category]}40`,
          }}
        >
          {doneCount}/{categoryHabits.length}
        </span>
      </div>

      {/* クエスト一覧 */}
      <div className="p-2.5 space-y-2">
        {categoryHabits.map(habit => {
          const status = getCheckStatus(habit.id);
          const isChecked = status !== 'none';
          const rippleKey = rippleKeys[habit.id];

          return (
            <button
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              disabled={disabled}
              className={`quest-item w-full flex items-center gap-3.5 px-3.5 py-3 rounded-sm
                transition-all duration-150 active:scale-[0.98]
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                background: isChecked ? CATEGORY_BG_TINT[category] : 'var(--color-bg-surface)',
                borderLeft: `3px solid ${isChecked ? CATEGORY_BORDER_COLOR[category] : 'var(--color-rpg-border-dim)'}`,
              }}
            >
              <div className="relative">
                <div
                  className={`rpg-check-lg ${status === 'done' ? 'rpg-check-done check-pop' : ''}`}
                >
                  {status === 'done' ? '✓' : ''}
                </div>
                {isChecked && rippleKey && (
                  <div
                    key={rippleKey}
                    className="check-ripple absolute inset-0 pointer-events-none"
                    style={{ '--ripple-color': CATEGORY_RIPPLE_COLOR[category] } as React.CSSProperties}
                  />
                )}
              </div>
              <span className={`text-base font-medium flex-1 text-left ${
                status === 'done' ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {habit.name}
              </span>
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
      <div className="px-4 py-10 text-center">
        <p className="text-text-secondary text-base">
          クエストが登録されていません
        </p>
        <p className="text-text-secondary text-sm mt-1.5">
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
