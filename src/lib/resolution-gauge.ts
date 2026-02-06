import { ResolutionGauge } from '@/types';

export const INITIAL_RESOLUTION: ResolutionGauge = {
  current: 0,
  streak: 0,
  maxStreak: 0,
};

// ===== 覚悟ゲージ ティア定義 =====
export interface ResolutionTier {
  min: number;
  max: number;
  name: string;
  emoji: string;
  color: string;
}

export const RESOLUTION_TIERS: ResolutionTier[] = [
  { min: 0, max: 20, name: '冷えた炉', emoji: '🪨', color: 'gray' },
  { min: 21, max: 40, name: '燻る炎', emoji: '💨', color: 'dim' },
  { min: 41, max: 60, name: '赤い炎', emoji: '🔥', color: 'accent' },
  { min: 61, max: 80, name: '白い炎', emoji: '✨', color: 'gold' },
  { min: 81, max: 100, name: '覇気の炉', emoji: '👑', color: 'gold-glow' },
];

/** 現在値に対応するティアを返す */
export function getCurrentTier(value: number): ResolutionTier {
  return RESOLUTION_TIERS.find(t => value >= t.min && value <= t.max) ?? RESOLUTION_TIERS[0];
}

/** 日次記録確定時のゲージ上昇量を計算 */
export function calculateGaugeIncrease(completedCount: number, totalHabits: number, streak: number): number {
  if (totalHabits === 0) return 0;
  const rateBonus = Math.floor((completedCount / totalHabits) * 10);
  const streakBonus = Math.min(streak, 10);
  return Math.min(rateBonus + streakBonus, 20);
}

/** 日次記録確定時にゲージを更新 */
export function updateGaugeOnSubmit(
  gauge: ResolutionGauge,
  completedCount: number,
  totalHabits: number,
): ResolutionGauge {
  const newStreak = gauge.streak + 1;
  const increase = calculateGaugeIncrease(completedCount, totalHabits, newStreak);
  const newCurrent = Math.min(gauge.current + increase, 100);
  const newMaxStreak = Math.max(gauge.maxStreak, newStreak);
  return {
    current: newCurrent,
    streak: newStreak,
    maxStreak: newMaxStreak,
  };
}

/** アプリ起動時の減衰チェック・適用 */
export function checkAndApplyDecay(
  gauge: ResolutionGauge,
  lastSubmittedDate: string | null,
  currentDate: string,
): { gauge: ResolutionGauge; decayAmount: number; missedDays: number } {
  if (!lastSubmittedDate) {
    return { gauge, decayAmount: 0, missedDays: 0 };
  }

  const last = new Date(lastSubmittedDate);
  const current = new Date(currentDate);
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 1日以内(昨日or今日)なら減衰なし
  if (diffDays <= 1) {
    return { gauge, decayAmount: 0, missedDays: 0 };
  }

  // 未記録日数 = diffDays - 1 (最終記録日の翌日から昨日まで)
  const missedDays = diffDays - 1;
  const decayAmount = Math.min(missedDays * 5, 25);
  const newCurrent = Math.max(gauge.current - decayAmount, 0);

  return {
    gauge: {
      current: newCurrent,
      streak: 0,
      maxStreak: gauge.maxStreak,
    },
    decayAmount,
    missedDays,
  };
}
