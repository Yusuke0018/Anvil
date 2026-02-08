'use client';

import { CheckStatus } from '@/types';
import { xpPerHabit, fullCompletionBonus } from '@/lib/xp';

interface DailySubmitProps {
  level: number;
  habits: { id: string }[];
  getCheckStatus: (habitId: string) => CheckStatus;
  isSubmitted: boolean;
  onSubmit: () => void;
  xpGained: number | null;
  wasAllDone: boolean;
}

const CONFETTI_COLORS = ['#e8a020', '#ffd700', '#50c878', '#5088e0', '#e05050', '#a878d0'];

export default function DailySubmit({
  level,
  habits,
  getCheckStatus,
  isSubmitted,
  onSubmit,
  xpGained,
  wasAllDone,
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
        <div className="rpg-panel p-4 text-center relative overflow-hidden">
          <div
            className="submit-flash absolute inset-0 pointer-events-none"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />

          {xpGained != null && xpGained > 0 && (
            <div className="float-up-anim text-2xl font-black text-accent pixel-num mb-1">
              +{xpGained} EXP
            </div>
          )}

          {wasAllDone && (
            <div className="relative h-6 mb-1">
              {CONFETTI_COLORS.map((color, i) => (
                <span
                  key={i}
                  className="confetti absolute text-lg"
                  style={{
                    color,
                    left: `${15 + i * 13}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>
          )}

          <p className="fade-in-delayed text-success text-sm font-medium">
            本日の冒険記録を確定しました
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* EXPプレビュー */}
      <div className="rpg-panel p-3 mb-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">
            達成: {completedCount} / {totalCount}
          </span>
          <div className="text-right">
            <span className="text-accent font-bold pixel-num">+{baseXP} EXP</span>
            {bonus > 0 && (
              <span className="text-gold font-bold pixel-num ml-2">+{bonus} BONUS</span>
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
        className={`w-full py-3 text-sm font-bold transition-all
          ${totalCount === 0
            ? 'rpg-btn opacity-50 cursor-not-allowed'
            : allDone
              ? 'rpg-btn rpg-btn-primary btn-glow-strong'
              : 'rpg-btn rpg-btn-primary'
          }`}
      >
        {totalCount === 0 ? 'クエストを追加してください' : `冒険記録を確定 → +${totalXP} EXP`}
      </button>
    </div>
  );
}
