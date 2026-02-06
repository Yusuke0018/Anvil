'use client';

import { Stats } from '@/types';

interface StatsOverviewProps {
  stats: Stats;
}

const STAT_CONFIG = [
  { key: 'vitality' as const, label: '心力', emoji: '🔥', color: 'text-accent' },
  { key: 'curiosity' as const, label: '探究力', emoji: '⚔️', color: 'text-gold' },
  { key: 'intellect' as const, label: '知力', emoji: '📖', color: 'text-success' },
];

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2">
        {STAT_CONFIG.map(({ key, label, emoji, color }) => (
          <div
            key={key}
            className="flex-1 bg-bg-card rounded-lg p-3 text-center"
          >
            <div className="text-lg mb-1">{emoji}</div>
            <div className={`text-xl font-bold ${color}`}>{stats[key]}</div>
            <div className="text-xs text-text-secondary mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
