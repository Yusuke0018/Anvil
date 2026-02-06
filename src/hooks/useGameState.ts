'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Habit, DailyRecord, HabitCheck, CheckStatus, LevelUpResult, HabitCategory, Skill, Title, MilestoneEvent, ReviewEvent } from '@/types';
import { loadGameState, saveGameState, getToday, getDailyRecord, saveDailyRecord } from '@/lib/storage';
import { calculateDailyXP, applyXP } from '@/lib/xp';
import { applyLevelUp, addStats } from '@/lib/stats';
import { MAX_HABITS_PER_CATEGORY } from '@/data/constants';
import { checkNewSkills, checkNewTitles } from '@/lib/unlocks';
import { updateGaugeOnSubmit, checkAndApplyDecay } from '@/lib/resolution-gauge';
import { getMilestoneEvent } from '@/data/milestones';
import { TITLES } from '@/data/titles';

export interface WelcomeBackInfo {
  missedDays: number;
  decayAmount: number;
}

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const [levelUpResult, setLevelUpResult] = useState<LevelUpResult | null>(null);
  const [submittedXP, setSubmittedXP] = useState<number | null>(null);
  const [submittedAllDone, setSubmittedAllDone] = useState(false);
  const [welcomeBackInfo, setWelcomeBackInfo] = useState<WelcomeBackInfo | null>(null);
  const [reviewEvent, setReviewEvent] = useState<ReviewEvent | null>(null);

  // 初回ロード
  useEffect(() => {
    const loaded = loadGameState();
    const today = getToday();

    // 最終記録日を取得
    const submittedRecords = loaded.dailyRecords
      .filter(r => r.submitted)
      .sort((a, b) => b.date.localeCompare(a.date));
    const lastSubmittedDate = submittedRecords.length > 0 ? submittedRecords[0].date : null;

    // 覚悟ゲージ減衰チェック
    const decayResult = checkAndApplyDecay(loaded.resolutionGauge, lastSubmittedDate, today);
    loaded.resolutionGauge = decayResult.gauge;

    // 復帰イベント判定 (2日以上未記録)
    if (decayResult.missedDays >= 2) {
      setWelcomeBackInfo({
        missedDays: decayResult.missedDays,
        decayAmount: decayResult.decayAmount,
      });
      // 復帰チャレンジ開始
      loaded.comebackChallenge = {
        active: true,
        startDate: today,
        daysCompleted: 0,
      };
    }

    setState(loaded);
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

    const newTotalCompletions = {
      life: state.character.totalCompletions.life + categoryCompletions.life,
      hobby: state.character.totalCompletions.hobby + categoryCompletions.hobby,
      work: state.character.totalCompletions.work + categoryCompletions.work,
    };

    // マイルストーンイベント判定
    let milestoneEvent: MilestoneEvent | null = null;

    if (xpResult.levelsGained > 0) {
      levelResult = applyLevelUp(
        state.character.stats,
        state.character.level,
        xpResult.levelsGained,
        newTotalCompletions
      );
      newStats = addStats(state.character.stats, levelResult.statGains);
      milestoneEvent = getMilestoneEvent(state.character.level, xpResult.level);
    }

    // 覚悟ゲージ更新
    const newGauge = updateGaugeOnSubmit(state.resolutionGauge, completedCount, totalHabits);

    // スキル解放チェック
    const newSkills: Skill[] = checkNewSkills(xpResult.level, state.unlockedSkillIds);
    const newSkillIds = newSkills.map(s => s.id);

    // 称号解放チェック（記録日数は今回の確定を含める、maxStreakも含める）
    const submittedDays = state.dailyRecords.filter(r => r.submitted).length + 1;
    const newTitles: Title[] = checkNewTitles(
      { level: xpResult.level, submittedDays, totalCompletions: newTotalCompletions, maxStreak: newGauge.maxStreak },
      state.unlockedTitleIds
    );
    const newTitleIds = newTitles.map(t => t.id);

    // 復帰チャレンジ進行
    let newComebackChallenge = state.comebackChallenge;
    let comebackTitleUnlocked = false;
    if (newComebackChallenge?.active) {
      const newDaysCompleted = newComebackChallenge.daysCompleted + 1;
      if (newDaysCompleted >= 3) {
        // 3日達成 → 称号解放 + チャレンジ終了
        comebackTitleUnlocked = true;
        newComebackChallenge = null;
      } else {
        newComebackChallenge = { ...newComebackChallenge, daysCompleted: newDaysCompleted };
      }
    }

    // 復帰称号を新規称号に追加
    if (comebackTitleUnlocked && !state.unlockedTitleIds.includes('t-comeback') && !newTitleIds.includes('t-comeback')) {
      const comebackTitle = TITLES.find(t => t.id === 't-comeback');
      if (comebackTitle) {
        newTitles.push(comebackTitle);
        newTitleIds.push('t-comeback');
      }
    }

    // 振り返りイベント判定 (7日/30日ごと)
    const prevSubmittedDays = submittedDays - 1; // 今回確定前の日数
    const lastReviewed = state.lastReviewedSubmittedDays;
    let newLastReviewed = lastReviewed;

    // 月次振り返り (30日ごと) を優先、なければ週次 (7日ごと)
    const monthlyMilestone = Math.floor(submittedDays / 30) > Math.floor(lastReviewed / 30);
    const weeklyMilestone = Math.floor(submittedDays / 7) > Math.floor(lastReviewed / 7);

    if (monthlyMilestone || weeklyMilestone) {
      const isMonthly = monthlyMilestone;
      const periodDays = isMonthly ? 30 : 7;

      // 期間内の記録を集計
      const allSubmitted = state.dailyRecords.filter(r => r.submitted);
      const recentRecords = allSubmitted.length > 0
        ? allSubmitted.sort((a, b) => b.date.localeCompare(a.date)).slice(0, periodDays)
        : [];
      const periodXP = recentRecords.reduce((sum, r) => sum + r.xpGained, 0);
      const periodCompletions = recentRecords.reduce((sum, r) => {
        const done = r.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
        return sum + done;
      }, 0);
      const periodTotal = recentRecords.reduce((sum, _) => sum + state.habits.length, 0);
      const completionRateVal = periodTotal > 0 ? periodCompletions / periodTotal : 0;

      // この期間内の新スキル・称号数はスナップショットとして概算
      const recentSkillCount = newSkillIds.length;
      const recentTitleCount = newTitleIds.length;

      setReviewEvent({
        type: isMonthly ? 'monthly' : 'weekly',
        periodDays,
        xpGained: periodXP + xpGained, // 今回分も含む
        levelsGained: xpResult.levelsGained,
        skillsUnlocked: recentSkillCount,
        titlesUnlocked: recentTitleCount,
        completionRate: completionRateVal,
        streakBest: newGauge.maxStreak,
        startLevel: state.character.level,
        endLevel: xpResult.level,
      });

      newLastReviewed = submittedDays;
    }

    // レベルアップ結果にスキル・称号・マイルストーンを含める
    if (levelResult) {
      levelResult.newSkills = newSkills;
      levelResult.newTitles = newTitles;
      levelResult.milestoneEvent = milestoneEvent;
      setLevelUpResult(levelResult);
    } else if (newSkills.length > 0 || newTitles.length > 0) {
      // レベルアップなしでも新規解放がある場合
      setLevelUpResult({
        previousLevel: state.character.level,
        newLevel: state.character.level,
        statGains: { vitality: 0, curiosity: 0, intellect: 0 },
        newSkills,
        newTitles,
        milestoneEvent: null,
      });
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
          totalCompletions: newTotalCompletions,
        },
        unlockedSkillIds: [...prev.unlockedSkillIds, ...newSkillIds],
        unlockedTitleIds: [...prev.unlockedTitleIds, ...newTitleIds],
        resolutionGauge: newGauge,
        comebackChallenge: newComebackChallenge,
        lastReviewedSubmittedDays: newLastReviewed,
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

  // 称号を装備/解除
  const equipTitle = useCallback((titleId: string | null) => {
    if (!state) return;
    setState(prev => prev ? { ...prev, equippedTitleId: titleId } : prev);
  }, [state]);

  // レベルアップモーダルを閉じる
  const dismissLevelUp = useCallback(() => {
    setLevelUpResult(null);
  }, []);

  // 復帰モーダルを閉じる
  const dismissWelcomeBack = useCallback(() => {
    setWelcomeBackInfo(null);
  }, []);

  // 振り返りモーダルを閉じる
  const dismissReview = useCallback(() => {
    setReviewEvent(null);
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
    equipTitle,
    welcomeBackInfo,
    dismissWelcomeBack,
    reviewEvent,
    dismissReview,
  };
}
