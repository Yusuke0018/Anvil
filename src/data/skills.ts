import { Skill } from '@/types';

export const SKILLS: Skill[] = [
  // ===== life (心力系) =====
  { id: 'life-01', name: '早起きの習慣', description: '朝の光を浴びて心身を目覚めさせる', unlockLevel: 3, category: 'life' },
  { id: 'life-02', name: '深呼吸の術', description: '一呼吸で心を整える', unlockLevel: 5, category: 'life' },
  { id: 'life-03', name: '継続の炎', description: '小さな積み重ねが大きな力になる', unlockLevel: 10, category: 'life' },
  { id: 'life-04', name: '回復の瞑想', description: '静寂の中で心力を回復する', unlockLevel: 15, category: 'life' },
  { id: 'life-05', name: '鉄の意志', description: '困難に立ち向かう強い心', unlockLevel: 20, category: 'life' },
  { id: 'life-06', name: '不動心', description: '何事にも動じない精神力', unlockLevel: 30, category: 'life' },
  { id: 'life-07', name: '生命の泉', description: '尽きることのない活力の源', unlockLevel: 40, category: 'life' },
  { id: 'life-08', name: '覚醒者の心眼', description: '本質を見抜く境地', unlockLevel: 50, category: 'life' },

  // ===== hobby (探究力系) =====
  { id: 'hobby-01', name: '好奇心の芽', description: '新しいことへの興味が芽生える', unlockLevel: 3, category: 'hobby' },
  { id: 'hobby-02', name: '観察眼', description: '細部に宿る美しさを見つける', unlockLevel: 5, category: 'hobby' },
  { id: 'hobby-03', name: '没頭の境地', description: '時間を忘れて夢中になれる', unlockLevel: 10, category: 'hobby' },
  { id: 'hobby-04', name: '閃きの感性', description: 'ふとした瞬間にアイデアが降りてくる', unlockLevel: 15, category: 'hobby' },
  { id: 'hobby-05', name: '創造の手', description: '頭の中のイメージを形にする力', unlockLevel: 20, category: 'hobby' },
  { id: 'hobby-06', name: '探究者の直感', description: '答えへの最短ルートを感じ取る', unlockLevel: 30, category: 'hobby' },
  { id: 'hobby-07', name: '無限の好奇心', description: '知りたいという欲求が止まらない', unlockLevel: 40, category: 'hobby' },
  { id: 'hobby-08', name: '万物の理解者', description: 'あらゆる分野を横断する知識', unlockLevel: 50, category: 'hobby' },

  // ===== work (知力系) =====
  { id: 'work-01', name: '集中力', description: '雑念を払い、目の前のタスクに集中する', unlockLevel: 3, category: 'work' },
  { id: 'work-02', name: '段取り力', description: '効率的な手順を組み立てる', unlockLevel: 5, category: 'work' },
  { id: 'work-03', name: '問題分析', description: '複雑な問題を分解して理解する', unlockLevel: 10, category: 'work' },
  { id: 'work-04', name: '論理的思考', description: '筋道を立てて考える力', unlockLevel: 15, category: 'work' },
  { id: 'work-05', name: '戦略的視点', description: '全体を俯瞰して最適解を見出す', unlockLevel: 20, category: 'work' },
  { id: 'work-06', name: '知識の体系化', description: '散らばった情報を整理し体系化する', unlockLevel: 30, category: 'work' },
  { id: 'work-07', name: '専門家の洞察', description: '深い経験に裏打ちされた判断力', unlockLevel: 40, category: 'work' },
  { id: 'work-08', name: '叡智の結晶', description: '知識と経験が融合した最高の知性', unlockLevel: 50, category: 'work' },
];

/** 指定レベル以下で解放可能なスキルをすべて返す */
export function getSkillsForLevel(level: number): Skill[] {
  return SKILLS.filter(s => s.unlockLevel <= level);
}
