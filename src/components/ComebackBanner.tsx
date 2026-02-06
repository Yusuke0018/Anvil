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
      <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <span className="text-xs font-medium text-accent">
            復帰チャレンジ: {challenge.daysCompleted}/3日
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {dots.map(i => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < challenge.daysCompleted
                  ? 'bg-accent scale-110'
                  : 'bg-bg-surface'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
