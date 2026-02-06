import { HabitCategory } from '@/types';

// ===== XP計算 =====
export const BASE_XP_PER_HABIT = 10;
export const XP_COMPOUND_RATE = 1.02; // 2%複利
export const FULL_COMPLETION_BONUS_RATE = 0.30; // 全達成ボーナス 30%
export const MAX_HABITS_PER_CATEGORY = 3;
export const TOTAL_HABITS_MAX = MAX_HABITS_PER_CATEGORY * 3; // 9

// ===== レベルアップ日数 (ピースワイズ線形補間) =====
// [level, targetDays] のペア
export const LEVEL_DAY_CURVE: [number, number][] = [
  [1, 1],
  [10, 2],
  [30, 3],
  [50, 4],
  [80, 5],
  [100, 6.5],
];

// ===== ステータス成長 =====
export const STAT_GROWTH_TIERS: { maxLevel: number; minGrowth: number; maxGrowth: number }[] = [
  { maxLevel: 20, minGrowth: 1, maxGrowth: 2 },
  { maxLevel: 50, minGrowth: 3, maxGrowth: 5 },
  { maxLevel: Infinity, minGrowth: 8, maxGrowth: 15 },
];

// ===== カテゴリ表示情報 =====
export const CATEGORY_INFO: Record<HabitCategory, { label: string; emoji: string; statLabel: string; statKey: string }> = {
  life: { label: '人生', emoji: '🔥', statLabel: '心力', statKey: 'vitality' },
  hobby: { label: '趣味', emoji: '⚔️', statLabel: '探究力', statKey: 'curiosity' },
  work: { label: '仕事', emoji: '📖', statLabel: '知力', statKey: 'intellect' },
};

// ===== UI =====
export const COLORS = {
  bgDeep: '#0f0f13',
  bgCard: '#1a1a24',
  bgSurface: '#252535',
  accent: '#ff6b2b',
  gold: '#ffd700',
  textPrimary: '#e8e6e3',
  textSecondary: '#9996a6',
  success: '#4ade80',
  danger: '#ef4444',
} as const;

// ===== 初期ステート =====
export const INITIAL_CHARACTER: import('@/types').CharacterStatus = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  stats: { vitality: 1, curiosity: 1, intellect: 1 },
  totalCompletions: { life: 0, hobby: 0, work: 0 },
};

export const GAME_STATE_VERSION = 2;
