'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Habit, DailyRecord, HabitCheck, CheckStatus, LevelUpResult, HabitCategory } from '@/types';
import { loadGameState, saveGameState, getToday, getDailyRecord, saveDailyRecord } from '@/lib/storage';
import { calculateDailyXP, applyXP } from '@/lib/xp';
import { applyLevelUp, addStats } from '@/lib/stats';
import { MAX_HABITS_PER_CATEGORY } from '@/data/constants';

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const [levelUpResult, setLevelUpResult] = useState<LevelUpResult | null>(null);
  const [submittedXP, setSubmittedXP] = useState<number | null>(null);
  const [submittedAllDone, setSubmittedAllDone] = useState(false);

  // 初回ロード
  useEffect(() => {
    setState(loadGameState());
  }, []);

  // 状態変更時に保存
  useEffect(() => {
    if (state) {
      saveGameState(state);
    }
  }, [state]);

  const today = getToday();

  // 今日の記録
  const todayRecord: DailyRecord | undefined = state ? getDailyRecord(state, today) : undefined;

  // 今日の記録が提出済みか
  const isSubmitted = todayRecord?.submitted ?? false;

  // チェック状態の取得
  const getCheckStatus = useCallback((habitId: string): CheckStatus => {
    if (!todayRecord) return 'none';
    const check = todayRecord.checks.find(c => c.habitId === habitId);
    return check?.status ?? 'none';
  }, [todayRecord]);

  // チェック状態の切り替え (none → done → auto → none)
  const toggleCheck = useCallback((habitId: string) => {
    if (!state || isSubmitted) return;

    const currentStatus = getCheckStatus(habitId);
    const nextStatus: CheckStatus =
      currentStatus === 'none' ? 'done' :
      currentStatus === 'done' ? 'auto' : 'none';

    const existingChecks = todayRecord?.checks ?? [];
    const otherChecks = existingChecks.filter(c => c.habitId !== habitId);
    const newChecks: HabitCheck[] = nextStatus === 'none'
      ? otherChecks
      : [...otherChecks, { habitId, status: nextStatus }];

    const record: DailyRecord = {
      date: today,
      checks: newChecks,
      xpGained: 0,
      submitted: false,
    };

    setState(prev => prev ? saveDailyRecord(prev, record) : prev);
  }, [state, today, todayRecord, isSubmitted, getCheckStatus]);

  // 1日の記録を確定
  const submitDay = useCallback(() => {
    if (!state || isSubmitted) return;

    const checks = todayRecord?.checks ?? [];
    const completedCount = checks.filter(c => c.status === 'done' || c.status === 'auto').length;
    const totalHabits = state.habits.length;

    const allDone = completedCount === totalHabits && totalHabits > 0;

    // XP計算
    const xpGained = calculateDailyXP(state.character.level, completedCount, totalHabits);

    // 確定時の情報を保持（演出用）
    setSubmittedXP(xpGained);
    setSubmittedAllDone(allDone);

    // XP適用 & レベルアップ判定
    const xpResult = applyXP(state.character.level, state.character.currentXP, xpGained);

    // カテゴリ別達成数の集計
    const categoryCompletions = { life: 0, hobby: 0, work: 0 };
    for (const check of checks) {
      if (check.status === 'done' || check.status === 'auto') {
        const habit = state.habits.find(h => h.id === check.habitId);
        if (habit) {
          categoryCompletions[habit.category]++;
        }
      }
    }

    // レベルアップ処理
    let newStats = state.character.stats;
    let levelResult: LevelUpResult | null = null;

    if (xpResult.levelsGained > 0) {
      const totalCompletions = {
        life: state.character.totalCompletions.life + categoryCompletions.life,
        hobby: state.character.totalCompletions.hobby + categoryCompletions.hobby,
        work: state.character.totalCompletions.work + categoryCompletions.work,
      };
      levelResult = applyLevelUp(
        state.character.stats,
        state.character.level,
        xpResult.levelsGained,
        totalCompletions
      );
      newStats = addStats(state.character.stats, levelResult.statGains);
      setLevelUpResult(levelResult);
    }

    // 記録更新
    const updatedRecord: DailyRecord = {
      date: today,
      checks,
      xpGained,
      submitted: true,
    };

    setState(prev => {
      if (!prev) return prev;
      const withRecord = saveDailyRecord(prev, updatedRecord);
      return {
        ...withRecord,
        character: {
          ...withRecord.character,
          level: xpResult.level,
          currentXP: xpResult.currentXP,
          totalXP: withRecord.character.totalXP + xpGained,
          stats: newStats,
          totalCompletions: {
            life: prev.character.totalCompletions.life + categoryCompletions.life,
            hobby: prev.character.totalCompletions.hobby + categoryCompletions.hobby,
            work: prev.character.totalCompletions.work + categoryCompletions.work,
          },
        },
      };
    });
  }, [state, today, todayRecord, isSubmitted]);

  // 習慣の追加
  const addHabit = useCallback((name: string, category: HabitCategory) => {
    if (!state) return;

    const categoryHabits = state.habits.filter(h => h.category === category);
    if (categoryHabits.length >= MAX_HABITS_PER_CATEGORY) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      category,
      order: categoryHabits.length,
      createdAt: new Date().toISOString(),
    };

    setState(prev => prev ? { ...prev, habits: [...prev.habits, newHabit] } : prev);
  }, [state]);

  // 習慣の編集
  const updateHabit = useCallback((id: string, name: string) => {
    if (!state) return;
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        habits: prev.habits.map(h => h.id === id ? { ...h, name } : h),
      };
    });
  }, [state]);

  // 習慣の削除
  const deleteHabit = useCallback((id: string) => {
    if (!state) return;
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        habits: prev.habits.filter(h => h.id !== id),
      };
    });
  }, [state]);

  // レベルアップモーダルを閉じる
  const dismissLevelUp = useCallback(() => {
    setLevelUpResult(null);
  }, []);

  return {
    state,
    today,
    todayRecord,
    isSubmitted,
    getCheckStatus,
    toggleCheck,
    submitDay,
    addHabit,
    updateHabit,
    deleteHabit,
    levelUpResult,
    dismissLevelUp,
    submittedXP,
    submittedAllDone,
  };
}
