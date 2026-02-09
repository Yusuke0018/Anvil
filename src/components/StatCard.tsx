'use client';

interface StatCardProps {
  label: string;
  emoji: string;
  value: number;
  completions: number;
  color: string;
}

export default function StatCard({ label, emoji, value, completions, color }: StatCardProps) {
  return (
    <div className="rpg-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="text-sm font-medium text-text-primary">{label}</h3>
          <p className="text-xs sm:text-[11px] text-text-secondary tracking-wider">累計達成: {completions}回</p>
        </div>
      </div>
      <div className={`text-4xl font-bold pixel-num stat-value ${color}`}>{value}</div>
    </div>
  );
}
