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
  const progressPercent = nextXP > 0
    ? Math.min(100, Math.max(0, Math.round((currentXP / nextXP) * 100)))
    : 0;

  return (
    <div className="rpg-panel p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{emoji}</span>
          <div className="min-w-0">
            <h3 className={`text-base sm:text-lg font-bold leading-tight ${color}`}>{label}</h3>
            <p className="text-xs sm:text-[11px] text-text-secondary tracking-wider mt-0.5">
              累計達成: {completions}回
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] text-text-secondary tracking-widest">熟練度</p>
          <p className={`text-2xl font-bold pixel-num stat-value leading-none mt-0.5 ${color}`}>{mastery}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs sm:text-[11px] text-text-secondary pixel-num">
          <span>次の成長まで</span>
          <span>{currentXP} / {nextXP} XP</span>
        </div>
        <div className="mt-1.5 h-2 rounded-sm bg-bg-deep/50 border border-rpg-border-dim/40 overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
