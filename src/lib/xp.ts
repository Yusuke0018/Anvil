import {
  BASE_XP_PER_HABIT,
  XP_COMPOUND_RATE,
  FULL_COMPLETION_BONUS_RATE,
  MAX_HABITS_PER_CATEGORY,
  TOTAL_HABITS_MAX,
  LEVEL_DAY_CURVE,
} from '@/data/constants';

/**
 * ピースワイズ線形補間でレベルに応じた目標日数を算出
 */
function targetDays(level: number): number {
  const curve = LEVEL_DAY_CURVE;

  if (level <= curve[0][0]) return curve[0][1];
  if (level >= curve[curve.length - 1][0]) return curve[curve.length - 1][1];

  for (let i = 0; i < curve.length - 1; i++) {
    const [lvA, dayA] = curve[i];
    const [lvB, dayB] = curve[i + 1];
    if (level >= lvA && level <= lvB) {
      const t = (level - lvA) / (lvB - lvA);
      return dayA + t * (dayB - dayA);
    }
  }

  return curve[curve.length - 1][1];
}

/**
 * 習慣1つ達成あたりのXP (2%複利成長)
 */
export function xpPerHabit(level: number): number {
  return Math.floor(BASE_XP_PER_HABIT * Math.pow(XP_COMPOUND_RATE, level));
}

/**
 * 全習慣達成ボーナスXP
 */
export function fullCompletionBonus(level: number, habitCount: number): number {
  return Math.floor(xpPerHabit(level) * habitCount * FULL_COMPLETION_BONUS_RATE);
}

/**
 * 1日の合計XP (全達成時)
 */
export function dailyXP(level: number, habitCount: number = TOTAL_HABITS_MAX): number {
  const base = xpPerHabit(level) * habitCount;
  const bonus = fullCompletionBonus(level, habitCount);
  return base + bonus;
}

/**
 * 次のレベルに必要なXP
 */
export function expToNextLevel(level: number, habitCount: number = TOTAL_HABITS_MAX): number {
  const days = targetDays(level);
  const daily = dailyXP(level, habitCount);
  return Math.floor(days * daily);
}

/**
 * 心力/探究力/知力の次レベル必要XP
 * 各カテゴリ上限(3クエスト)を前提に算出
 */
export function expToNextStatLevel(level: number): number {
  return expToNextLevel(level, MAX_HABITS_PER_CATEGORY);
}

/**
 * 日次のXP計算 (完了した習慣数に応じて)
 */
export function calculateDailyXP(
  level: number,
  completedCount: number,
  totalHabitCount: number
): number {
  const perHabit = xpPerHabit(level);
  let xp = perHabit * completedCount;

  // 全達成ボーナス
  if (completedCount === totalHabitCount && totalHabitCount > 0) {
    xp += fullCompletionBonus(level, totalHabitCount);
  }

  return xp;
}

/**
 * XP追加後のレベル計算
 * 複数レベルアップの可能性に対応
 */
export function applyXP(
  currentLevel: number,
  currentXP: number,
  gainedXP: number
): { level: number; currentXP: number; levelsGained: number } {
  let level = currentLevel;
  let xp = currentXP + gainedXP;
  let levelsGained = 0;

  while (xp >= expToNextLevel(level)) {
    xp -= expToNextLevel(level);
    level++;
    levelsGained++;
  }

  return { level, currentXP: xp, levelsGained };
}

/**
 * 能力別XP計算 (カテゴリ内で達成したクエスト数のみ反映)
 */
export function calculateStatXP(level: number, completedCount: number): number {
  return xpPerHabit(level) * completedCount;
}

/**
 * 能力別XP追加後のレベル計算
 */
export function applyStatXP(
  currentLevel: number,
  currentXP: number,
  gainedXP: number
): { level: number; currentXP: number; levelsGained: number } {
  let level = currentLevel;
  let xp = currentXP + gainedXP;
  let levelsGained = 0;

  while (xp >= expToNextStatLevel(level)) {
    xp -= expToNextStatLevel(level);
    level++;
    levelsGained++;
  }

  return { level, currentXP: xp, levelsGained };
}
