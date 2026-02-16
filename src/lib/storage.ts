import { GameState, Habit, DailyRecord } from '@/types';
import { INITIAL_CHARACTER, GAME_STATE_VERSION } from '@/data/constants';
import { INITIAL_RESOLUTION } from '@/lib/resolution-gauge';

const STORAGE_KEY = 'anvil_game_state';

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCompletedCount(record: DailyRecord): number {
  return record.checks.filter(c => c.status === 'done').length;
}

function getObservedCheckCount(record: DailyRecord): number {
  return new Set(record.checks.map(c => c.habitId)).size;
}

function countHabitsExistingOnDate(habits: Habit[], date: string): number {
  const dateEnd = new Date(`${date}T23:59:59.999`);
  return habits.filter((habit) => {
    const createdAtMs = new Date(habit.createdAt).getTime();
    return Number.isFinite(createdAtMs) && createdAtMs <= dateEnd.getTime();
  }).length;
}

/**
 * 旧データの totalHabitsAtSubmit 未保存レコードを補完
 * その日の総クエスト数に近い値を推定して保存する
 */
function backfillDailyRecordTotals(state: GameState): void {
  const submittedRecords = state.dailyRecords
    .filter(r => r.submitted)
    .sort((a, b) => a.date.localeCompare(b.date));

  const knownTotals = submittedRecords.map((record) =>
    record.totalHabitsAtSubmit && record.totalHabitsAtSubmit > 0
      ? record.totalHabitsAtSubmit
      : null
  );

  for (let i = 0; i < submittedRecords.length; i++) {
    const record = submittedRecords[i];
    if (record.totalHabitsAtSubmit && record.totalHabitsAtSubmit > 0) continue;

    const completed = getCompletedCount(record);
    const observedChecks = getObservedCheckCount(record);
    const byCreatedAt = countHabitsExistingOnDate(state.habits, record.date);

    let previousKnown = 0;
    for (let j = i - 1; j >= 0; j--) {
      const known = knownTotals[j];
      if (typeof known === 'number' && known > 0) {
        previousKnown = known;
        break;
      }
    }

    let nextKnown = 0;
    for (let j = i + 1; j < knownTotals.length; j++) {
      const known = knownTotals[j];
      if (typeof known === 'number' && known > 0) {
        nextKnown = known;
        break;
      }
    }

    const neighborHint = Math.max(previousKnown, nextKnown);
    const inferredTotal = Math.max(completed, observedChecks, byCreatedAt, neighborHint);

    if (inferredTotal > 0) {
      record.totalHabitsAtSubmit = inferredTotal;
      knownTotals[i] = inferredTotal;
    }
  }
}

/**
 * 旧データ互換: auto ステータスを done に正規化
 */
function normalizeLegacyAutoChecks(state: GameState): void {
  for (const record of state.dailyRecords) {
    for (const check of record.checks) {
      const status = (check as { status?: string }).status;
      if (status === 'auto') {
        check.status = 'done';
      }
    }
  }
}

function hasLegacyAutoChecks(state: GameState): boolean {
  return state.dailyRecords.some(record =>
    record.checks.some(check => (check as { status?: string }).status === 'auto')
  );
}

function hasMissingTotalSnapshots(state: GameState): boolean {
  return state.dailyRecords.some(record =>
    record.submitted && (!record.totalHabitsAtSubmit || record.totalHabitsAtSubmit <= 0)
  );
}

function defaultGameState(): GameState {
  return {
    version: GAME_STATE_VERSION,
    character: {
      ...INITIAL_CHARACTER,
      stats: { ...INITIAL_CHARACTER.stats },
      statXP: {
        vitality: { ...INITIAL_CHARACTER.statXP.vitality },
        curiosity: { ...INITIAL_CHARACTER.statXP.curiosity },
        intellect: { ...INITIAL_CHARACTER.statXP.intellect },
      },
      totalCompletions: { ...INITIAL_CHARACTER.totalCompletions },
    },
    habits: [],
    spotQuests: [],
    dailyRecords: [],
    currentDate: getToday(),
    unlockedSkillIds: [],
    unlockedTitleIds: [],
    equippedTitleId: null,
    resolutionGauge: { ...INITIAL_RESOLUTION },
    comebackChallenge: null,
    lastReviewedSubmittedDays: 0,
  };
}

/**
 * localStorage からゲーム状態を読み込み
 */
export function loadGameState(): GameState {
  if (typeof window === 'undefined') return defaultGameState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultGameState();

    const parsed = JSON.parse(raw) as GameState;
    return migrateState(parsed);
  } catch {
    return defaultGameState();
  }
}

/**
 * ゲーム状態を localStorage に保存
 */
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

/**
 * 習慣リストの取得
 */
export function loadHabits(state: GameState): Habit[] {
  return state.habits;
}

/**
 * 習慣リストの保存
 */
export function saveHabits(state: GameState, habits: Habit[]): GameState {
  return { ...state, habits };
}

/**
 * 日次記録の取得 (日付指定)
 */
export function getDailyRecord(state: GameState, date: string): DailyRecord | undefined {
  return state.dailyRecords.find(r => r.date === date);
}

/**
 * 日次記録の保存/更新
 */
export function saveDailyRecord(state: GameState, record: DailyRecord): GameState {
  const idx = state.dailyRecords.findIndex(r => r.date === record.date);
  const records = [...state.dailyRecords];
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  return { ...state, dailyRecords: records };
}

/**
 * データマイグレーション
 */
function migrateState(state: GameState): GameState {
  if (!state.version) {
    state.version = 1;
  }

  // v1 → v2: スキル・称号システム追加
  if (state.version === 1) {
    state.unlockedSkillIds = [];
    state.unlockedTitleIds = [];
    state.equippedTitleId = null;
    state.version = 2;
  }

  // v2 → v3: 覚悟ゲージ・復帰チャレンジ追加
  if (state.version === 2) {
    state.resolutionGauge = { ...INITIAL_RESOLUTION };
    state.comebackChallenge = null;
    state.version = 3;
  }

  // v3 → v4: 振り返りイベント追加
  if (state.version === 3) {
    state.lastReviewedSubmittedDays = 0;
    state.version = 4;
  }

  // v4 → v5: 能力別XP追加
  if (state.version === 4) {
    state.character.statXP = {
      vitality: { currentXP: 0, totalXP: 0 },
      curiosity: { currentXP: 0, totalXP: 0 },
      intellect: { currentXP: 0, totalXP: 0 },
    };
    state.version = 5;
  }

  // v5 → v6: 当日限定スポットクエスト追加
  if (state.version === 5) {
    state.spotQuests = [];
    state.version = 6;
  }

  // v6 → v7: 日次記録の総クエスト数スナップショット補完
  if (state.version === 6) {
    backfillDailyRecordTotals(state);
    state.version = 7;
  }

  // v7 → v8: auto ステータス廃止
  if (state.version === 7) {
    normalizeLegacyAutoChecks(state);
    state.version = 8;
  }

  if (!state.character.statXP) {
    state.character.statXP = {
      vitality: { currentXP: 0, totalXP: 0 },
      curiosity: { currentXP: 0, totalXP: 0 },
      intellect: { currentXP: 0, totalXP: 0 },
    };
  }

  if (!state.spotQuests) {
    state.spotQuests = [];
  }

  if (hasLegacyAutoChecks(state)) {
    normalizeLegacyAutoChecks(state);
  }

  if (hasMissingTotalSnapshots(state)) {
    backfillDailyRecordTotals(state);
  }

  return state;
}

/**
 * 今日の日付文字列を取得
 */
export { getToday };
