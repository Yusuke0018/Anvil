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
    <div className="px-4 py-4">
      <div className="rpg-panel p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary tracking-wider uppercase">Lv</span>
            <span className="text-2xl font-bold text-accent pixel-num stat-value">{level}</span>
          </div>
          <span className="text-xs text-text-secondary pixel-num">
            {currentXP} / {needed} EXP
          </span>
        </div>
        <div className="rpg-bar">
          <div
            className={`rpg-bar-fill rpg-bar-xp xp-bar-animate${percent >= 80 ? ' xp-glow' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
