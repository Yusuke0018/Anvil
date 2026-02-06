// ===== カテゴリ =====
export type HabitCategory = 'life' | 'hobby' | 'work';

// ===== 習慣 =====
export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  order: number;
  createdAt: string; // ISO date
}

// ===== 日次チェック結果 =====
export type CheckStatus = 'done' | 'auto' | 'none';

export interface HabitCheck {
  habitId: string;
  status: CheckStatus;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  checks: HabitCheck[];
  xpGained: number;
  submitted: boolean;
}

// ===== キャラクターステータス =====
export interface CharacterStatus {
  level: number;
  currentXP: number;
  totalXP: number;
  stats: Stats;
  totalCompletions: CategoryCompletions;
}

export interface Stats {
  // 心力 (人生カテゴリから成長)
  vitality: number;
  // 探究力 (趣味カテゴリから成長)
  curiosity: number;
  // 知力 (仕事カテゴリから成長)
  intellect: number;
}

export interface CategoryCompletions {
  life: number;
  hobby: number;
  work: number;
}

// ===== スキル =====
export interface Skill {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  category: HabitCategory;
}

// ===== 称号 =====
export interface Title {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
}

// ===== ゲーム全体状態 =====
export interface GameState {
  version: number;
  character: CharacterStatus;
  habits: Habit[];
  dailyRecords: DailyRecord[];
  currentDate: string; // YYYY-MM-DD
  unlockedSkillIds: string[];
  unlockedTitleIds: string[];
  equippedTitleId: string | null;
  resolutionGauge: ResolutionGauge;
  comebackChallenge: ComebackChallenge | null;
  lastReviewedSubmittedDays: number;
}

// ===== 振り返りイベント =====
export interface ReviewEvent {
  type: 'weekly' | 'monthly';
  periodDays: number;
  xpGained: number;
  levelsGained: number;
  skillsUnlocked: number;
  titlesUnlocked: number;
  completionRate: number;
  streakBest: number;
  startLevel: number;
  endLevel: number;
}

// ===== 覚悟ゲージ =====
export interface ResolutionGauge {
  current: number; // 0-100
  streak: number; // 連続達成日数
  maxStreak: number;
}

// ===== 復帰チャレンジ =====
export interface ComebackChallenge {
  active: boolean;
  startDate: string;
  daysCompleted: number;
}

// ===== マイルストーンイベント =====
export interface MilestoneEvent {
  level: number;
  name: string;
  emoji: string;
  message: string;
}

// ===== レベルアップ結果 =====
export interface LevelUpResult {
  newLevel: number;
  statGains: Stats;
  previousLevel: number;
  newSkills: Skill[];
  newTitles: Title[];
  milestoneEvent: MilestoneEvent | null;
}

// ===== 称号チェック用コンテキスト =====
export interface TitleCheckContext {
  level: number;
  submittedDays: number;
  totalCompletions: CategoryCompletions;
  maxStreak: number;
}
