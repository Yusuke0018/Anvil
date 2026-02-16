'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Habit, DailyRecord, HabitCheck, CheckStatus, LevelUpResult, HabitCategory, Skill, Title, MilestoneEvent, ReviewEvent } from '@/types';
import { loadGameState, saveGameState, getToday, getDailyRecord, saveDailyRecord } from '@/lib/storage';
import { calculateDailyXP, applyXP, calculateStatXP, applyStatXP } from '@/lib/xp';
import { MAX_HABITS_PER_CATEGORY } from '@/data/constants';
import { checkNewSkills, checkNewTitles } from '@/lib/unlocks';
import { updateGaugeOnSubmit, checkAndApplyDecay } from '@/lib/resolution-gauge';
import { getMilestoneEvent } from '@/data/milestones';
import { TITLES } from '@/data/titles';
import { getRecordCompletionRate } from '@/lib/completion-rate';

export interface WelcomeBackInfo {
  missedDays: number;
  decayAmount: number;
}

function getSpotQuestCheckId(date: string): string {
  return `spot:${date}`;
}

function compareHabitsByOrder(a: Habit, b: Habit): number {
  if (a.order !== b.order) return a.order - b.order;
  if (a.createdAt !== b.createdAt) return a.createdAt.localeCompare(b.createdAt);
  return a.id.localeCompare(b.id);
}

function sortCategoryHabits(habits: Habit[], category: HabitCategory): Habit[] {
  return habits
    .filter(h => h.category === category)
    .sort(compareHabitsByOrder);
}

function normalizeCategoryOrders(habits: Habit[], category: HabitCategory): Habit[] {
  const sorted = sortCategoryHabits(habits, category);
  const orderById = new Map(sorted.map((habit, index) => [habit.id, index]));

  return habits.map((habit) => {
    if (habit.category !== category) return habit;
    const nextOrder = orderById.get(habit.id);
    if (nextOrder === undefined || nextOrder === habit.order) return habit;
    return { ...habit, order: nextOrder };
  });
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
    loaded.spotQuests = loaded.spotQuests.filter(q => q.date === today);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回ロード時の復帰通知表示用
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
  const todaySpotQuest = state?.spotQuests.find(q => q.date === today) ?? null;
  const spotQuestCheckId = todaySpotQuest ? getSpotQuestCheckId(todaySpotQuest.date) : null;
  const todayQuestIds = state
    ? [...state.habits.map(h => h.id), ...(spotQuestCheckId ? [spotQuestCheckId] : [])]
    : [];

  // 今日の記録が提出済みか
  const isSubmitted = todayRecord?.submitted ?? false;

  // チェック状態の取得
  const getCheckStatus = useCallback((habitId: string): CheckStatus => {
    if (!todayRecord) return 'none';
    const check = todayRecord.checks.find(c => c.habitId === habitId);
    return check?.status ?? 'none';
  }, [todayRecord]);

  // チェック状態の切り替え (none → done → none)
  const toggleCheck = useCallback((habitId: string) => {
    if (!state || isSubmitted) return;

    const currentStatus = getCheckStatus(habitId);
    const nextStatus: CheckStatus = currentStatus === 'none' ? 'done' : 'none';

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

    const habitIdSet = new Set(state.habits.map(h => h.id));
    const activeSpotQuest = state.spotQuests.find(q => q.date === today) ?? null;
    const activeSpotQuestCheckId = activeSpotQuest ? getSpotQuestCheckId(activeSpotQuest.date) : null;

    const checks = (todayRecord?.checks ?? []).filter(c =>
      habitIdSet.has(c.habitId) || c.habitId === activeSpotQuestCheckId
    );
    const completedHabitCount = checks.filter(
      c => c.status === 'done' && habitIdSet.has(c.habitId)
    ).length;
    const spotCompleted = activeSpotQuestCheckId
      ? checks.some(c => c.habitId === activeSpotQuestCheckId && c.status === 'done')
      : false;
    const completedCount = completedHabitCount + (spotCompleted ? 1 : 0);
    const totalQuests = state.habits.length + (activeSpotQuest ? 1 : 0);

    const allDone = completedCount === totalQuests && totalQuests > 0;

    // XP計算
    const xpGained = calculateDailyXP(state.character.level, completedCount, totalQuests);

    // 確定時の情報を保持（演出用）
    setSubmittedXP(xpGained);
    setSubmittedAllDone(allDone);

    // XP適用 & レベルアップ判定
    const xpResult = applyXP(state.character.level, state.character.currentXP, xpGained);

    // カテゴリ別達成数の集計
    const categoryCompletions = { life: 0, health: 0, hobby: 0, work: 0 };
    for (const check of checks) {
      if (check.status === 'done') {
        const habit = state.habits.find(h => h.id === check.habitId);
        if (habit) {
          if (habit.category === 'life') {
            categoryCompletions.life++;
          } else if (habit.category === 'health') {
            categoryCompletions.health++;
          } else if (habit.category === 'hobby') {
            categoryCompletions.hobby++;
          } else if (habit.category === 'work') {
            categoryCompletions.work++;
          }
        }
      }
    }
    if (spotCompleted) {
      categoryCompletions.life++;
      categoryCompletions.health++;
      categoryCompletions.hobby++;
      categoryCompletions.work++;
    }

    // 能力別XP/レベル処理（心力/体力/探究力/知力は独立成長）
    const newStats = { ...state.character.stats };
    const newStatXP = {
      vitality: { ...state.character.statXP.vitality },
      stamina: { ...state.character.statXP.stamina },
      curiosity: { ...state.character.statXP.curiosity },
      intellect: { ...state.character.statXP.intellect },
    };
    const statLevelGains = { vitality: 0, stamina: 0, curiosity: 0, intellect: 0 };

    const statTargets = [
      { statKey: 'vitality' as const, completed: categoryCompletions.life },
      { statKey: 'stamina' as const, completed: categoryCompletions.health },
      { statKey: 'curiosity' as const, completed: categoryCompletions.hobby },
      { statKey: 'intellect' as const, completed: categoryCompletions.work },
    ];

    for (const target of statTargets) {
      const gainedStatXP = calculateStatXP(newStats[target.statKey], target.completed);
      const statResult = applyStatXP(newStats[target.statKey], newStatXP[target.statKey].currentXP, gainedStatXP);
      newStats[target.statKey] = statResult.level;
      newStatXP[target.statKey] = {
        currentXP: statResult.currentXP,
        totalXP: newStatXP[target.statKey].totalXP + gainedStatXP,
      };
      statLevelGains[target.statKey] = statResult.levelsGained;
    }

    const hasStatLevelUp =
      statLevelGains.vitality > 0 ||
      statLevelGains.stamina > 0 ||
      statLevelGains.curiosity > 0 ||
      statLevelGains.intellect > 0;
    let levelResult: LevelUpResult | null = null;

    const newTotalCompletions = {
      life: state.character.totalCompletions.life + categoryCompletions.life,
      health: state.character.totalCompletions.health + categoryCompletions.health,
      hobby: state.character.totalCompletions.hobby + categoryCompletions.hobby,
      work: state.character.totalCompletions.work + categoryCompletions.work,
    };

    // マイルストーンイベント判定
    let milestoneEvent: MilestoneEvent | null = null;
    if (xpResult.levelsGained > 0) {
      milestoneEvent = getMilestoneEvent(state.character.level, xpResult.level);
    }

    if (xpResult.levelsGained > 0 || hasStatLevelUp) {
      levelResult = {
        previousLevel: state.character.level,
        newLevel: xpResult.level,
        statGains: statLevelGains,
        newSkills: [],
        newTitles: [],
        milestoneEvent,
      };
    }

    // 覚悟ゲージ更新
    const newGauge = updateGaugeOnSubmit(state.resolutionGauge, completedCount, totalQuests);

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

    // 記録更新（当日のクエスト総数をスナップショット保存）
    const updatedRecord: DailyRecord = {
      date: today,
      checks,
      xpGained,
      submitted: true,
      totalHabitsAtSubmit: totalQuests,
    };

    // 振り返りイベント判定 (7日/30日ごと)
    const lastReviewed = state.lastReviewedSubmittedDays;
    let newLastReviewed = lastReviewed;

    // 月次振り返り (30日ごと) を優先、なければ週次 (7日ごと)
    const monthlyMilestone = Math.floor(submittedDays / 30) > Math.floor(lastReviewed / 30);
    const weeklyMilestone = Math.floor(submittedDays / 7) > Math.floor(lastReviewed / 7);

    if (monthlyMilestone || weeklyMilestone) {
      const isMonthly = monthlyMilestone;
      const periodDays = isMonthly ? 30 : 7;

      // 期間内の記録を集計
      const allSubmitted = [...state.dailyRecords.filter(r => r.submitted), updatedRecord];
      const recentRecords = allSubmitted.length > 0
        ? allSubmitted.sort((a, b) => b.date.localeCompare(a.date)).slice(0, periodDays)
        : [];
      const periodXP = recentRecords.reduce((sum, r) => sum + r.xpGained, 0);
      const completionRateVal = recentRecords.length > 0
        ? recentRecords.reduce(
          (sum, r) => sum + getRecordCompletionRate(r),
          0
        ) / recentRecords.length
        : 0;

      // この期間内の新スキル・称号数はスナップショットとして概算
      const recentSkillCount = newSkillIds.length;
      const recentTitleCount = newTitleIds.length;

      setReviewEvent({
        type: isMonthly ? 'monthly' : 'weekly',
        periodDays,
        xpGained: periodXP,
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
        statGains: { vitality: 0, stamina: 0, curiosity: 0, intellect: 0 },
        newSkills,
        newTitles,
        milestoneEvent: null,
      });
    }

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
          statXP: newStatXP,
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
    const trimmed = name.trim();
    if (!trimmed) return;

    setState(prev => {
      if (!prev) return prev;

      const normalizedHabits = normalizeCategoryOrders(prev.habits, category);
      const categoryHabits = sortCategoryHabits(normalizedHabits, category);
      if (categoryHabits.length >= MAX_HABITS_PER_CATEGORY) return prev;

      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: trimmed,
        category,
        order: categoryHabits.length,
        createdAt: new Date().toISOString(),
      };

      return { ...prev, habits: [...normalizedHabits, newHabit] };
    });
  }, []);

  // 習慣の編集
  const updateHabit = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        habits: prev.habits.map(h => h.id === id ? { ...h, name: trimmed } : h),
      };
    });
  }, []);

  // 習慣の削除
  const deleteHabit = useCallback((id: string) => {
    setState(prev => {
      if (!prev) return prev;
      const target = prev.habits.find(h => h.id === id);
      if (!target) return prev;
      const filteredHabits = prev.habits.filter(h => h.id !== id);
      return {
        ...prev,
        habits: normalizeCategoryOrders(filteredHabits, target.category),
      };
    });
  }, []);

  // 習慣の並び替え
  const reorderHabit = useCallback((habitId: string, direction: 'up' | 'down') => {
    setState(prev => {
      if (!prev) return prev;
      const target = prev.habits.find(h => h.id === habitId);
      if (!target) return prev;

      const normalizedHabits = normalizeCategoryOrders(prev.habits, target.category);
      const categoryHabits = sortCategoryHabits(normalizedHabits, target.category);

      const idx = categoryHabits.findIndex(h => h.id === habitId);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= categoryHabits.length) return prev;

      const swapped = [...categoryHabits];
      [swapped[idx], swapped[swapIdx]] = [swapped[swapIdx], swapped[idx]];
      const orderById = new Map(swapped.map((habit, index) => [habit.id, index]));

      return {
        ...prev,
        habits: normalizedHabits.map(h => {
          if (h.category !== target.category) return h;
          const nextOrder = orderById.get(h.id);
          if (nextOrder === undefined || nextOrder === h.order) return h;
          return { ...h, order: nextOrder };
        }),
      };
    });
  }, []);

  // 当日スポットクエストの設定/更新
  const setTodaySpotQuest = useCallback((name: string) => {
    if (!state || isSubmitted) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    setState(prev => {
      if (!prev) return prev;
      const withoutToday = prev.spotQuests.filter(q => q.date !== today);
      return {
        ...prev,
        spotQuests: [...withoutToday, { date: today, name: trimmed }],
      };
    });
  }, [state, today, isSubmitted]);

  // 当日スポットクエストの削除
  const clearTodaySpotQuest = useCallback(() => {
    if (!state || isSubmitted) return;
    const spotId = getSpotQuestCheckId(today);

    setState(prev => {
      if (!prev) return prev;

      const withoutToday = prev.spotQuests.filter(q => q.date !== today);
      const record = getDailyRecord(prev, today);
      if (!record) {
        return { ...prev, spotQuests: withoutToday };
      }

      const nextRecord: DailyRecord = {
        ...record,
        checks: record.checks.filter(c => c.habitId !== spotId),
      };
      const withRecord = saveDailyRecord(prev, nextRecord);
      return { ...withRecord, spotQuests: withoutToday };
    });
  }, [state, today, isSubmitted]);

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
    todaySpotQuest,
    spotQuestCheckId,
    todayQuestIds,
    getCheckStatus,
    toggleCheck,
    submitDay,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabit,
    setTodaySpotQuest,
    clearTodaySpotQuest,
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
