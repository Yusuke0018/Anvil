'use client';

import { ReviewEvent } from '@/types';

interface ReviewModalProps {
  review: ReviewEvent;
  onDismiss: () => void;
}

export default function ReviewModal({ review, onDismiss }: ReviewModalProps) {
  const isMonthly = review.type === 'monthly';
  const emoji = isMonthly ? '📜' : '📋';
  const title = isMonthly ? '月の冒険報告' : '週の冒険報告';
  const periodLabel = isMonthly ? '30日間' : '7日間';

  const ratePercent = Math.round(review.completionRate * 100);

  let message: string;
  if (ratePercent >= 90) {
    message = '素晴らしい冒険だ。その道は明るく輝いている。';
  } else if (ratePercent >= 70) {
    message = '着実に腕を磨いている。この調子で進め。';
  } else if (ratePercent >= 50) {
    message = '半ばを超えた。まだまだ伸びしろがある。';
  } else if (ratePercent >= 30) {
    message = '道は険しいが、足は止まっていない。一歩ずつ進もう。';
  } else {
    message = '冒険の道に立つだけでも価値がある。続けることが力だ。';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center rpg-modal-overlay px-8"
      onClick={onDismiss}
    >
      <div
        className="rpg-modal p-6 w-full max-w-sm relative modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2" style={{ animation: 'anvil-strike 0.5s ease-out 0.2s both' }}>
            {emoji}
          </div>
          <h2
            className="text-lg font-bold text-gold pixel-num"
            style={{ animation: 'title-burst 0.5s ease-out 0.4s both' }}
          >
            {title}
          </h2>
          <p className="text-xs text-text-secondary mt-1">{periodLabel}の冒険成果</p>
        </div>

        <div className="space-y-1.5 mb-4" style={{ animation: 'fade-in 0.3s ease-out 0.6s both' }}>
          <ReviewStat label="レベル" value={review.startLevel === review.endLevel
            ? `Lv.${review.endLevel}`
            : `Lv.${review.startLevel} → Lv.${review.endLevel}`
          } highlight={review.levelsGained > 0} />
          <ReviewStat label="獲得EXP" value={`${review.xpGained.toLocaleString()} EXP`} />
          <ReviewStat label="達成率" value={`${ratePercent}%`} highlight={ratePercent >= 80} />
          <ReviewStat label="最高連続" value={`${review.streakBest}日`} highlight={review.streakBest >= 7} />
          {review.skillsUnlocked > 0 && (
            <ReviewStat label="新スキル" value={`${review.skillsUnlocked}個`} highlight />
          )}
          {review.titlesUnlocked > 0 && (
            <ReviewStat label="新称号" value={`${review.titlesUnlocked}個`} highlight />
          )}
        </div>

        <div
          className="text-center mb-4 px-2"
          style={{ animation: 'fade-in 0.3s ease-out 0.8s both' }}
        >
          <p className="text-xs text-text-secondary italic leading-relaxed">
            「{message}」
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-3 rpg-btn rpg-btn-primary text-sm"
          style={{ animation: 'fade-in 0.3s ease-out 1.0s both' }}
        >
          次の冒険へ
        </button>
      </div>
    </div>
  );
}

function ReviewStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center rpg-panel px-4 py-2">
      <span className="text-xs text-text-secondary">{label}</span>
      <span className={`text-sm font-bold pixel-num ${highlight ? 'text-gold stat-value' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  );
}
