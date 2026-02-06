'use client';

import { LevelUpResult } from '@/types';
import { CATEGORY_INFO } from '@/data/constants';

interface LevelUpModalProps {
  result: LevelUpResult;
  onDismiss: () => void;
}

const SPARKLE_DIRS = [
  { sx: '40px', sy: '-40px' },
  { sx: '50px', sy: '0px' },
  { sx: '40px', sy: '40px' },
  { sx: '0px', sy: '50px' },
  { sx: '-40px', sy: '40px' },
  { sx: '-50px', sy: '0px' },
  { sx: '-40px', sy: '-40px' },
  { sx: '0px', sy: '-50px' },
];

const CATEGORY_COLORS: Record<string, string> = {
  life: 'text-accent',
  hobby: 'text-gold',
  work: 'text-success',
};

export default function LevelUpModal({ result, onDismiss }: LevelUpModalProps) {
  const hasLevelUp = result.newLevel > result.previousLevel;
  const hasStats = result.statGains.vitality > 0 || result.statGains.curiosity > 0 || result.statGains.intellect > 0;
  const milestone = result.milestoneEvent;

  const stats = [
    { label: '心力', emoji: '🔥', value: result.statGains.vitality, color: 'text-accent' },
    { label: '探究力', emoji: '⚔️', value: result.statGains.curiosity, color: 'text-gold' },
    { label: '知力', emoji: '📖', value: result.statGains.intellect, color: 'text-success' },
  ];

  // アニメーション delay 計算
  let nextDelay = milestone ? 1.4 : (hasStats ? 1.0 : 0.8);
  if (hasStats) {
    nextDelay = Math.max(nextDelay, 1.0);
    nextDelay += stats.length * 0.2 + 0.2;
  }
  const skillStartDelay = nextDelay;
  nextDelay += result.newSkills.length * 0.15 + (result.newSkills.length > 0 ? 0.2 : 0);
  const titleStartDelay = nextDelay;
  nextDelay += result.newTitles.length * 0.15;
  const buttonDelay = nextDelay + 0.3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-8"
      onClick={onDismiss}
    >
      {/* 金色フラッシュ overlay */}
      {hasLevelUp && (
        <div
          className="fixed inset-0 pointer-events-none z-[51]"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,107,43,0.3) 50%, transparent 80%)',
            animation: 'screen-flash 0.6s ease-out forwards',
          }}
        />
      )}

      <div
        className="bg-bg-card border border-accent/30 rounded-2xl p-6 w-full max-w-sm relative z-[52] max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {hasLevelUp ? (
          <>
            {/* ⚒ アンビルストライク */}
            <div className="text-center mb-2">
              <div
                className="text-5xl inline-block"
                style={{ animation: 'anvil-strike 0.5s ease-out 0.2s both' }}
              >
                ⚒
              </div>
            </div>

            {/* LEVEL UP! タイトル */}
            <div className="text-center mb-4 relative">
              <div
                className="absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold/60 pointer-events-none"
                style={{ animation: 'ring-expand 0.8s ease-out 0.4s both' }}
              />
              <h2
                className="text-2xl font-bold text-accent relative"
                style={{
                  animation: 'title-burst 0.5s ease-out 0.4s both',
                  textShadow: '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,107,43,0.3)',
                }}
              >
                LEVEL UP!
              </h2>
            </div>

            {/* レベル遷移 */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className="text-2xl text-text-secondary"
                style={{ animation: 'fade-in 0.3s ease-out 0.5s both' }}
              >
                {result.previousLevel}
              </span>
              <span
                className="text-accent text-lg"
                style={{ animation: 'fade-in 0.3s ease-out 0.5s both' }}
              >
                →
              </span>
              <span
                className="text-3xl font-bold text-accent glow-pulse inline-block px-3 py-1 rounded-lg"
                style={{ animation: 'fade-in 0.3s ease-out 0.5s both' }}
              >
                {result.newLevel}
              </span>
            </div>

            {/* スパークル */}
            <div className="relative flex justify-center mb-4">
              <div className="relative w-0 h-0">
                {SPARKLE_DIRS.map((dir, i) => (
                  <span
                    key={i}
                    className="absolute text-xs pointer-events-none"
                    style={{
                      '--sx': dir.sx,
                      '--sy': dir.sy,
                      animation: `sparkle 0.6s ease-out ${0.7 + i * 0.05}s both`,
                      left: '50%',
                      top: '50%',
                    } as React.CSSProperties}
                  >
                    ✦
                  </span>
                ))}
              </div>
            </div>

            {/* マイルストーンイベント */}
            {milestone && (
              <div
                className="mb-4 rounded-xl border border-gold/30 p-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,107,43,0.06) 100%)',
                  animation: 'fade-in 0.4s ease-out 0.8s both',
                }}
              >
                <div className="text-3xl mb-1">{milestone.emoji}</div>
                <div className="text-sm font-bold text-gold mb-1">{milestone.name}</div>
                <div className="text-xs text-text-secondary leading-relaxed">{milestone.message}</div>
              </div>
            )}

            {/* ステータス上昇 (スタガード) */}
            {hasStats && (
              <div className="space-y-3 mb-4">
                {stats.map((stat, i) => (
                  <StatGain
                    key={stat.label}
                    label={stat.label}
                    emoji={stat.emoji}
                    value={stat.value}
                    color={stat.color}
                    delay={1.0 + i * 0.2}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* レベルアップなし・称号/スキルのみの場合 */
          <div className="text-center mb-4">
            <div
              className="text-4xl inline-block mb-2"
              style={{ animation: 'anvil-strike 0.5s ease-out 0.2s both' }}
            >
              🎉
            </div>
            <h2
              className="text-xl font-bold text-gold"
              style={{ animation: 'title-burst 0.5s ease-out 0.3s both' }}
            >
              NEW UNLOCK!
            </h2>
          </div>
        )}

        {/* 新スキル */}
        {result.newSkills.length > 0 && (
          <div className="mb-4">
            <div
              className="text-xs text-text-secondary mb-2 uppercase tracking-wider"
              style={{ animation: `fade-in 0.3s ease-out ${skillStartDelay - 0.1}s both` }}
            >
              New Skills
            </div>
            <div className="space-y-2">
              {result.newSkills.map((skill, i) => (
                <div
                  key={skill.id}
                  className="flex items-start gap-3 bg-bg-surface rounded-lg px-4 py-2"
                  style={{ animation: `stat-slide-in 0.4s ease-out ${skillStartDelay + i * 0.15}s both` }}
                >
                  <span className="text-lg mt-0.5">
                    {CATEGORY_INFO[skill.category].emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${CATEGORY_COLORS[skill.category]}`}>
                      {skill.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {skill.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新称号 */}
        {result.newTitles.length > 0 && (
          <div className="mb-4">
            <div
              className="text-xs text-text-secondary mb-2 uppercase tracking-wider"
              style={{ animation: `fade-in 0.3s ease-out ${titleStartDelay - 0.1}s both` }}
            >
              New Titles
            </div>
            <div className="space-y-2">
              {result.newTitles.map((title, i) => (
                <div
                  key={title.id}
                  className="flex items-start gap-3 bg-bg-surface rounded-lg px-4 py-2 border border-gold/20"
                  style={{ animation: `stat-slide-in 0.4s ease-out ${titleStartDelay + i * 0.15}s both` }}
                >
                  <span className="text-lg mt-0.5">{title.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gold">
                      {title.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {title.condition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OKボタン */}
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-accent text-white rounded-lg font-bold text-sm active:scale-[0.98] transition-transform"
          style={{ animation: `fade-in 0.3s ease-out ${buttonDelay}s both` }}
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
  delay,
}: {
  label: string;
  emoji: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="flex items-center justify-between bg-bg-surface rounded-lg px-4 py-2"
      style={{ animation: `stat-slide-in 0.4s ease-out ${delay}s both` }}
    >
      <span className="text-sm text-text-secondary">
        {emoji} {label}
      </span>
      <span
        className={`font-bold ${color} inline-block`}
        style={{ animation: `number-pop 0.4s ease-out ${delay + 0.15}s both` }}
      >
        +{value}
      </span>
    </div>
  );
}
