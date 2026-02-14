'use client';

import { Stats, StatXPMap } from '@/types';
import { expToNextStatLevel } from '@/lib/xp';

interface StatsOverviewProps {
  stats: Stats;
  statXP: StatXPMap;
}

const STAT_CONFIG = [
  { key: 'vitality' as const, label: 'STR', fullLabel: '心力', emoji: '🔥', color: 'text-[#e05050]' },
  { key: 'curiosity' as const, label: 'DEX', fullLabel: '探究力', emoji: '⚔️', color: 'text-accent' },
  { key: 'intellect' as const, label: 'INT', fullLabel: '知力', emoji: '📖', color: 'text-[#5088e0]' },
];

export default function StatsOverview({ stats, statXP }: StatsOverviewProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2">
        {STAT_CONFIG.map(({ key, label, fullLabel, emoji, color }) => (
          <div
            key={key}
            className="flex-1 rpg-panel p-3 text-center"
          >
            <div className="text-lg mb-0.5">{emoji}</div>
            <div className={`text-lg font-bold pixel-num stat-value ${color}`}>Lv.{stats[key]}</div>
            <div className="text-xs sm:text-[11px] text-text-secondary pixel-num mt-0.5">
              {statXP[key].currentXP}/{expToNextStatLevel(stats[key])}
            </div>
            <div className="text-xs sm:text-[11px] text-text-secondary mt-1 tracking-wider">{label}</div>
            <div className="text-xs text-text-secondary">{fullLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
