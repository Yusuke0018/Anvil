'use client';

import { ResolutionGauge as ResolutionGaugeType } from '@/types';
import { getCurrentTier } from '@/lib/resolution-gauge';

interface ResolutionGaugeProps {
  gauge: ResolutionGaugeType;
}

const TIER_BAR_CLASS: Record<string, string> = {
  gray: 'rpg-bar-gray',
  dim: 'rpg-bar-dim',
  accent: 'rpg-bar-accent',
  gold: 'rpg-bar-gold',
  'gold-glow': 'rpg-bar-gold-glow',
};

const TIER_TEXT_COLOR: Record<string, string> = {
  gray: 'text-text-secondary',
  dim: 'text-accent/60',
  accent: 'text-accent',
  gold: 'text-gold',
  'gold-glow': 'text-gold',
};

export default function ResolutionGauge({ gauge }: ResolutionGaugeProps) {
  const tier = getCurrentTier(gauge.current);
  const barClass = TIER_BAR_CLASS[tier.color] ?? 'rpg-bar-gray';
  const textColor = TIER_TEXT_COLOR[tier.color] ?? 'text-text-secondary';
  const isMaxTier = tier.color === 'gold-glow';

  return (
    <div className="px-4 mb-1">
      <div className="rpg-panel px-3 py-2.5">
        {/* ティア名 + 連続日数 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{tier.emoji}</span>
            <span className={`text-xs font-medium ${textColor}`}>{tier.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-[11px] text-text-secondary pixel-num">
              🔥 {gauge.streak}日連続
            </span>
            <span className="text-xs sm:text-[11px] text-text-secondary/80 pixel-num">
              MAX {gauge.maxStreak}日
            </span>
          </div>
        </div>

        {/* ゲージバー */}
        <div className="rpg-bar">
          <div
            className={`rpg-bar-fill ${barClass} ${isMaxTier ? 'gauge-glow' : ''}`}
            style={{ width: `${gauge.current}%` }}
          />
        </div>

        {/* ゲージ値 */}
        <div className="flex justify-end mt-1">
          <span className={`text-xs sm:text-[11px] pixel-num ${textColor}`}>
            {gauge.current}/100
          </span>
        </div>
      </div>
    </div>
  );
}
