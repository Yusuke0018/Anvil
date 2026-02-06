import { GameState, Habit, DailyRecord } from '@/types';
import { INITIAL_CHARACTER, GAME_STATE_VERSION } from '@/data/constants';

const STORAGE_KEY = 'anvil_game_state';

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultGameState(): GameState {
  return {
    version: GAME_STATE_VERSION,
    character: { ...INITIAL_CHARACTER, stats: { ...INITIAL_CHARACTER.stats }, totalCompletions: { ...INITIAL_CHARACTER.totalCompletions } },
    habits: [],
    dailyRecords: [],
    currentDate: getToday(),
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
  // v1: 初期バージョン - マイグレーション不要
  if (!state.version) {
    state.version = GAME_STATE_VERSION;
  }
  return state;
}

/**
 * 今日の日付文字列を取得
 */
export { getToday };
