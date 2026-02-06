import { Stats, CategoryCompletions, LevelUpResult } from '@/types';
import { STAT_GROWTH_TIERS } from '@/data/constants';

/**
 * レベルに応じた1レベルあたりのステータス上昇値を算出
 * 段階的加速: Lv1-20で+1〜2, Lv21-50で+3〜5, Lv51+で+8〜15
 */
export function perStatGrowth(level: number): number {
  for (const tier of STAT_GROWTH_TIERS) {
    if (level <= tier.maxLevel) {
      // ティア内で線形補間
      const prevMax = STAT_GROWTH_TIERS.indexOf(tier) === 0
        ? 0
        : STAT_GROWTH_TIERS[STAT_GROWTH_TIERS.indexOf(tier) - 1].maxLevel;
      const range = tier.maxLevel === Infinity ? 50 : tier.maxLevel - prevMax;
      const progress = Math.min((level - prevMax) / range, 1);
      return Math.floor(
        tier.minGrowth + progress * (tier.maxGrowth - tier.minGrowth)
      );
    }
  }
  const lastTier = STAT_GROWTH_TIERS[STAT_GROWTH_TIERS.length - 1];
  return lastTier.maxGrowth;
}

/**
 * レベルアップ時のステータス成長をカテゴリ比例で配分
 * 各カテゴリの習慣達成数に応じて3ステータスに振り分け
 */
export function distributeStatGrowth(
  level: number,
  completions: CategoryCompletions
): Stats {
  const growth = perStatGrowth(level);
  const total = completions.life + completions.hobby + completions.work;

  if (total === 0) {
    // 達成データなし → 均等配分
    const each = Math.max(1, Math.floor(growth / 3));
    return { vitality: each, curiosity: each, intellect: each };
  }

  // 比率計算 (最低1を保証)
  const lifeRatio = completions.life / total;
  const hobbyRatio = completions.hobby / total;
  const workRatio = completions.work / total;

  return {
    vitality: Math.max(1, Math.round(growth * lifeRatio * 3)),
    curiosity: Math.max(1, Math.round(growth * hobbyRatio * 3)),
    intellect: Math.max(1, Math.round(growth * workRatio * 3)),
  };
}

/**
 * レベルアップを適用してステータスを更新
 */
export function applyLevelUp(
  currentStats: Stats,
  currentLevel: number,
  levelsGained: number,
  completions: CategoryCompletions
): LevelUpResult {
  const totalGains: Stats = { vitality: 0, curiosity: 0, intellect: 0 };

  for (let i = 0; i < levelsGained; i++) {
    const lvl = currentLevel + i + 1;
    const gains = distributeStatGrowth(lvl, completions);
    totalGains.vitality += gains.vitality;
    totalGains.curiosity += gains.curiosity;
    totalGains.intellect += gains.intellect;
  }

  return {
    previousLevel: currentLevel,
    newLevel: currentLevel + levelsGained,
    statGains: totalGains,
  };
}

/**
 * ステータスを加算
 */
export function addStats(base: Stats, gains: Stats): Stats {
  return {
    vitality: base.vitality + gains.vitality,
    curiosity: base.curiosity + gains.curiosity,
    intellect: base.intellect + gains.intellect,
  };
}
