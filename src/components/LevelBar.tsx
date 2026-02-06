'use client';

import { expToNextLevel } from '@/lib/xp';

interface LevelBarProps {
  level: number;
  currentXP: number;
}

export default function LevelBar({ level, currentXP }: LevelBarProps) {
  const needed = expToNextLevel(level);
  const percent = Math.min((currentXP / needed) * 100, 100);

  return (
    <div className="px-4 py-5">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-text-secondary text-sm">Lv.</span>
          <span className="text-3xl font-bold text-accent">{level}</span>
        </div>
        <span className="text-text-secondary text-sm">
          {currentXP} / {needed} XP
        </span>
      </div>
      <div className="h-3 bg-bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out xp-bar-animate"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
