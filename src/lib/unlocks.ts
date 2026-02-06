import { Skill, TitleCheckContext } from '@/types';
import { SKILLS } from '@/data/skills';
import { TITLES, TitleDefinition } from '@/data/titles';

/** 現在レベルで解放できる未取得スキルを返す */
export function checkNewSkills(level: number, unlockedIds: string[]): Skill[] {
  return SKILLS.filter(
    s => s.unlockLevel <= level && !unlockedIds.includes(s.id)
  );
}

/** 条件を満たした未取得称号を返す */
export function checkNewTitles(context: TitleCheckContext, unlockedIds: string[]): TitleDefinition[] {
  return TITLES.filter(
    t => !unlockedIds.includes(t.id) && t.check(context)
  );
}
