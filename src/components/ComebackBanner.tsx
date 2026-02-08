'use client';

import { ComebackChallenge } from '@/types';

interface ComebackBannerProps {
  challenge: ComebackChallenge;
}

export default function ComebackBanner({ challenge }: ComebackBannerProps) {
  if (!challenge.active) return null;

  const dots = [0, 1, 2];

  return (
    <div className="px-4 mb-2">
      <div className="rpg-panel px-4 py-3 flex items-center justify-between rpg-border-glow">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <span className="text-xs font-medium text-accent tracking-wider">
            復帰チャレンジ: {challenge.daysCompleted}/3日
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {dots.map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm border transition-all ${
                i < challenge.daysCompleted
                  ? 'bg-accent border-accent scale-110'
                  : 'bg-bg-deep border-rpg-border-dim'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
