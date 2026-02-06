'use client';

import { CheckStatus } from '@/types';
import { xpPerHabit, fullCompletionBonus } from '@/lib/xp';

interface DailySubmitProps {
  level: number;
  habits: { id: string }[];
  getCheckStatus: (habitId: string) => CheckStatus;
  isSubmitted: boolean;
  onSubmit: () => void;
}

export default function DailySubmit({
  level,
  habits,
  getCheckStatus,
  isSubmitted,
  onSubmit,
}: DailySubmitProps) {
  const completedCount = habits.filter(
    h => getCheckStatus(h.id) === 'done' || getCheckStatus(h.id) === 'auto'
  ).length;
  const totalCount = habits.length;
  const allDone = completedCount === totalCount && totalCount > 0;

  const baseXP = xpPerHabit(level) * completedCount;
  const bonus = allDone ? fullCompletionBonus(level, totalCount) : 0;
  const totalXP = baseXP + bonus;

  if (isSubmitted) {
    return (
      <div className="px-4 py-4">
        <div className="bg-bg-card rounded-lg p-4 text-center border border-success/30">
          <p className="text-success text-sm font-medium">本日の記録を確定しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* XPプレビュー */}
      <div className="bg-bg-card rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">
            達成: {completedCount} / {totalCount}
          </span>
          <div className="text-right">
            <span className="text-accent font-bold">+{baseXP} XP</span>
            {bonus > 0 && (
              <span className="text-gold font-bold ml-2">+{bonus} ボーナス</span>
            )}
          </div>
        </div>
        {allDone && (
          <p className="text-xs mt-1 text-right gold-shimmer font-bold">🎉 全達成ボーナス!</p>
        )}
      </div>

      {/* 確定ボタン */}
      <button
        onClick={onSubmit}
        disabled={totalCount === 0}
        className={`w-full py-3 rounded-lg font-bold text-sm transition-all
          ${totalCount === 0
            ? 'bg-bg-surface text-text-secondary cursor-not-allowed'
            : allDone
              ? 'bg-accent text-white active:scale-[0.98] btn-glow-strong'
              : 'bg-accent/80 text-white active:scale-[0.98]'
          }`}
      >
        {totalCount === 0 ? '習慣を追加してください' : `確定して +${totalXP} XP 獲得`}
      </button>
    </div>
  );
}
