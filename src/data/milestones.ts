import { MilestoneEvent } from '@/types';

export const MILESTONE_EVENTS: MilestoneEvent[] = [
  {
    level: 10,
    name: '鍛冶師の目覚め',
    emoji: '🔨',
    message: '「炉の温もりを知った。これが鍛冶の道の始まりだ。」',
  },
  {
    level: 20,
    name: '試練の炎',
    emoji: '⚔️',
    message: '「幾度の鍛錬を経て、刃に宿る意志を感じる。」',
  },
  {
    level: 30,
    name: '鋼の誓い',
    emoji: '🛡️',
    message: '「折れぬ心を手に入れた。もう何も恐れない。」',
  },
  {
    level: 40,
    name: '名匠の境地',
    emoji: '⭐',
    message: '「一打一打に魂を込める。その技、もはや芸術。」',
  },
  {
    level: 50,
    name: '伝説の刻印',
    emoji: '👑',
    message: '「伝説はここに刻まれた。その名は永遠に語り継がれる。」',
  },
];

/** 前回レベル→新レベルの間にマイルストーンがあれば返す (最も高いものを1つ) */
export function getMilestoneEvent(previousLevel: number, newLevel: number): MilestoneEvent | null {
  const milestones = MILESTONE_EVENTS.filter(
    m => m.level > previousLevel && m.level <= newLevel
  );
  return milestones.length > 0 ? milestones[milestones.length - 1] : null;
}
