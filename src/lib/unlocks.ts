import { Skill, Stats, TitleCheckContext } from '@/types';
import { SKILLS } from '@/data/skills';
import { TITLES, TitleDefinition } from '@/data/titles';
import { CATEGORY_INFO } from '@/data/constants';

/** 各能力の熟練度で解放できる未取得スキルを返す */
export function checkNewSkills(stats: Stats, unlockedIds: string[]): Skill[] {
  return SKILLS.filter(
    s => stats[CATEGORY_INFO[s.category].statKey] >= s.unlockLevel && !unlockedIds.includes(s.id)
  );
}

/** 条件を満たした未取得称号を返す */
export function checkNewTitles(context: TitleCheckContext, unlockedIds: string[]): TitleDefinition[] {
  return TITLES.filter(
    t => !unlockedIds.includes(t.id) && t.check(context)
  );
}
