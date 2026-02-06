'use client';

import { LevelUpResult } from '@/types';

interface LevelUpModalProps {
  result: LevelUpResult;
  onDismiss: () => void;
}

export default function LevelUpModal({ result, onDismiss }: LevelUpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-8"
      onClick={onDismiss}
    >
      <div
        className="bg-bg-card border border-accent/30 rounded-2xl p-6 w-full max-w-sm modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* レベルアップ表示 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚒</div>
          <h2 className="text-xl font-bold text-accent">LEVEL UP!</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-2xl text-text-secondary">{result.previousLevel}</span>
            <span className="text-accent">→</span>
            <span className="text-3xl font-bold text-accent glow-pulse inline-block px-3 py-1 rounded-lg">
              {result.newLevel}
            </span>
          </div>
        </div>

        {/* ステータス上昇 */}
        <div className="space-y-3 mb-6">
          <StatGain label="心力" emoji="🔥" value={result.statGains.vitality} color="text-accent" />
          <StatGain label="探究力" emoji="⚔️" value={result.statGains.curiosity} color="text-gold" />
          <StatGain label="知力" emoji="📖" value={result.statGains.intellect} color="text-success" />
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-accent text-white rounded-lg font-bold text-sm active:scale-[0.98] transition-transform"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function StatGain({
  label,
  emoji,
  value,
  color,
}: {
  label: string;
  emoji: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-bg-surface rounded-lg px-4 py-2">
      <span className="text-sm text-text-secondary">
        {emoji} {label}
      </span>
      <span className={`font-bold ${color}`}>+{value}</span>
    </div>
  );
}
