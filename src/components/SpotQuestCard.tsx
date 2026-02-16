'use client';

import { useState } from 'react';
import { CheckStatus } from '@/types';

interface SpotQuestCardProps {
  questName: string | null;
  questId: string | null;
  disabled: boolean;
  getCheckStatus: (habitId: string) => CheckStatus;
  onToggle: (habitId: string) => void;
  onSave: (name: string) => void;
  onClear: () => void;
}

export default function SpotQuestCard({
  questName,
  questId,
  disabled,
  getCheckStatus,
  onToggle,
  onSave,
  onClear,
}: SpotQuestCardProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || disabled) return;
    onSave(trimmed);
    setName('');
  };

  if (!questName || !questId) {
    return (
      <div className="px-4 mb-4">
        <div className="rpg-panel p-4 space-y-3">
          <h3 className="text-xs font-medium text-text-secondary tracking-widest uppercase">▸ 当日スポット</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              disabled={disabled}
              placeholder="今日だけのスポットクエストを入力..."
              className="flex-1 bg-bg-deep text-text-primary text-sm px-3 py-2 rounded-sm border-2 border-rpg-border-dim outline-none focus:border-accent disabled:opacity-50"
            />
            <button
              onClick={handleSave}
              disabled={disabled}
              className="rpg-btn rpg-btn-primary px-3 py-2 text-sm disabled:opacity-50"
            >
              設定
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getCheckStatus(questId);
  const isChecked = status !== 'none';

  return (
    <div className="px-4 mb-4">
      <div className="rpg-panel p-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-medium text-text-secondary tracking-widest uppercase">▸ 当日スポット</h3>
          <button
            onClick={onClear}
            disabled={disabled}
            className="rpg-btn px-2 py-1 text-xs sm:text-[11px] disabled:opacity-50"
          >
            削除
          </button>
        </div>
        <button
          onClick={() => onToggle(questId)}
          disabled={disabled}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-sm border transition-all active:scale-[0.98] ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            background: isChecked ? 'var(--color-gold-dim)' : 'var(--color-bg-surface)',
            borderColor: isChecked ? 'var(--color-gold)' : 'var(--color-rpg-border-dim)',
          }}
        >
          <div className={`rpg-check-lg ${status === 'none' ? '' : 'rpg-check-done check-pop'}`}>
            {status === 'none' ? '' : '✓'}
          </div>
          <span className={`text-sm font-medium flex-1 text-left ${isChecked ? 'text-text-primary' : 'text-text-secondary'}`}>
            {questName}
          </span>
        </button>
      </div>
    </div>
  );
}
