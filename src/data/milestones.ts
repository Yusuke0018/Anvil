import { MilestoneEvent } from '@/types';

export const MILESTONE_EVENTS: MilestoneEvent[] = [
  {
    level: 10,
    name: '冒険者の旅立ち',
    emoji: '🗡️',
    message: '「最初の一歩を踏み出した。冒険の道はここから始まる。」',
  },
  {
    level: 20,
    name: '試練の洞窟',
    emoji: '⚔️',
    message: '「幾多の試練を乗り越え、剣に宿る意志を感じる。」',
  },
  {
    level: 30,
    name: '勇者の誓い',
    emoji: '🛡️',
    message: '「折れぬ心を手に入れた。もう何も恐れない。」',
  },
  {
    level: 40,
    name: '英雄の目覚め',
    emoji: '⭐',
    message: '「数えきれない冒険の果て、その姿はもはや英雄。」',
  },
  {
    level: 50,
    name: '伝説の冒険者',
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
