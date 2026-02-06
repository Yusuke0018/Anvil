'use client';

import { ResolutionGauge as ResolutionGaugeType } from '@/types';
import { getCurrentTier } from '@/lib/resolution-gauge';

interface ResolutionGaugeProps {
  gauge: ResolutionGaugeType;
}

const TIER_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  gray: { bar: 'bg-gray-500', bg: 'bg-gray-500/20', text: 'text-gray-400' },
  dim: { bar: 'bg-accent/60', bg: 'bg-accent/10', text: 'text-accent/60' },
  accent: { bar: 'bg-accent', bg: 'bg-accent/20', text: 'text-accent' },
  gold: { bar: 'bg-gold', bg: 'bg-gold/20', text: 'text-gold' },
  'gold-glow': { bar: 'bg-gold', bg: 'bg-gold/20', text: 'text-gold' },
};

export default function ResolutionGauge({ gauge }: ResolutionGaugeProps) {
  const tier = getCurrentTier(gauge.current);
  const colors = TIER_COLORS[tier.color] ?? TIER_COLORS.gray;
  const isHighTier = tier.color === 'gold' || tier.color === 'gold-glow';
  const isMaxTier = tier.color === 'gold-glow';

  return (
    <div className="px-4 mb-1">
      <div className="bg-bg-card rounded-xl px-4 py-3">
        {/* ティア名 + 連続日数 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{tier.emoji}</span>
            <span className={`text-xs font-medium ${colors.text}`}>{tier.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary">
              🔥 {gauge.streak}日連続
            </span>
            <span className="text-xs text-text-secondary/60">
              最高 {gauge.maxStreak}日
            </span>
          </div>
        </div>

        {/* ゲージバー */}
        <div className={`h-2 rounded-full ${colors.bg} overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.bar} ${isMaxTier ? 'gauge-glow' : ''}`}
            style={{ width: `${gauge.current}%` }}
          />
        </div>

        {/* ゲージ値 */}
        <div className="flex justify-end mt-1">
          <span className={`text-[10px] ${colors.text}`}>
            {gauge.current}/100
          </span>
        </div>
      </div>
    </div>
  );
}
