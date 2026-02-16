'use client';

interface StatCardProps {
  label: string;
  emoji: string;
  mastery: number;
  currentXP: number;
  nextXP: number;
  completions: number;
  color: string;
}

export default function StatCard({ label, emoji, mastery, currentXP, nextXP, completions, color }: StatCardProps) {
  return (
    <div className="rpg-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="text-sm font-medium text-text-primary">{label}</h3>
          <p className="text-xs sm:text-[11px] text-text-secondary tracking-wider">累計達成: {completions}回</p>
        </div>
      </div>
      <div className={`text-3xl font-bold pixel-num stat-value ${color}`}>熟練度 {mastery}</div>
      <p className="text-xs sm:text-[11px] text-text-secondary mt-1 pixel-num">
        {currentXP} / {nextXP} XP
      </p>
    </div>
  );
}
