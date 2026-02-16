import { Skill } from '@/types';

export const SKILLS: Skill[] = [
  // ===================================================
  // ===== life (心力系) - 自己管理から精神の覚醒へ =====
  // ===================================================
  { id: 'life-01', name: '早起きの習慣', description: '朝の光を浴びて心身を目覚めさせる', unlockLevel: 3, category: 'life' },
  { id: 'life-09', name: '朝の準備運動', description: '一日の始まりに体を整える', unlockLevel: 4, category: 'life' },
  { id: 'life-02', name: '深呼吸の術', description: '一呼吸で心を整える', unlockLevel: 5, category: 'life' },
  { id: 'life-10', name: '感謝の心得', description: '日々の恵みに気づく力', unlockLevel: 9, category: 'life' },
  { id: 'life-03', name: '継続の炎', description: '小さな積み重ねが大きな力になる', unlockLevel: 10, category: 'life' },
  { id: 'life-11', name: '心のストレッチ', description: '柔軟な心を保つ術', unlockLevel: 14, category: 'life' },
  { id: 'life-04', name: '回復の瞑想', description: '静寂の中で心力を回復する', unlockLevel: 15, category: 'life' },
  { id: 'life-12', name: '自分との対話', description: '内なる声に耳を傾ける', unlockLevel: 19, category: 'life' },
  { id: 'life-05', name: '鉄の意志', description: '困難に立ち向かう強い心', unlockLevel: 20, category: 'life' },
  { id: 'life-13', name: '朝の瞑想', description: '静かな時間で心を研ぎ澄ます', unlockLevel: 24, category: 'life' },
  { id: 'life-14', name: '逆境の受容', description: '困難をそのまま受け入れる強さ', unlockLevel: 29, category: 'life' },
  { id: 'life-06', name: '不動心', description: '何事にも動じない精神力', unlockLevel: 30, category: 'life' },
  { id: 'life-15', name: '他者への共感', description: '人の痛みを理解する力', unlockLevel: 34, category: 'life' },
  { id: 'life-16', name: '静寂の力', description: '沈黙の中に強さを見出す', unlockLevel: 39, category: 'life' },
  { id: 'life-07', name: '生命の泉', description: '尽きることのない活力の源', unlockLevel: 40, category: 'life' },
  { id: 'life-17', name: '生活の芸術', description: '日常を美しく整える技', unlockLevel: 44, category: 'life' },
  { id: 'life-18', name: '揺るがぬ根', description: '深く根を張る安定感', unlockLevel: 49, category: 'life' },
  { id: 'life-08', name: '覚醒者の心眼', description: '本質を見抜く境地', unlockLevel: 50, category: 'life' },
  { id: 'life-19', name: '感情の錬金術', description: '負の感情を力に変える', unlockLevel: 54, category: 'life' },
  { id: 'life-20', name: '内なる炎', description: '消えることのない情熱', unlockLevel: 59, category: 'life' },
  { id: 'life-21', name: '生命の律動', description: '自然のリズムと調和する', unlockLevel: 64, category: 'life' },
  { id: 'life-22', name: '慈悲の心', description: '全てを包み込む優しさ', unlockLevel: 69, category: 'life' },
  { id: 'life-23', name: '不屈の精神', description: '何度倒れても立ち上がる', unlockLevel: 74, category: 'life' },
  { id: 'life-24', name: '悟りの呼吸', description: '一呼吸で世界を感じる', unlockLevel: 79, category: 'life' },
  { id: 'life-25', name: '生命の奔流', description: '尽きぬ生命力が溢れ出す', unlockLevel: 84, category: 'life' },
  { id: 'life-26', name: '無限の活力', description: '疲れを知らぬ不滅の体', unlockLevel: 89, category: 'life' },
  { id: 'life-27', name: '魂の覚醒', description: '真の自分に目覚める', unlockLevel: 94, category: 'life' },
  { id: 'life-28', name: '永遠の炎', description: '決して消えぬ心の炎', unlockLevel: 99, category: 'life' },

  // ==================================================
  // ===== health (体力系) - 鍛錬から不屈の肉体へ =====
  // ==================================================
  { id: 'health-01', name: '水分補給の心得', description: 'こまめな給水で身体の巡りを整える', unlockLevel: 4, category: 'health' },
  { id: 'health-02', name: '歩行の習慣', description: '日々の歩行で基礎体力を養う', unlockLevel: 8, category: 'health' },
  { id: 'health-03', name: '姿勢制御', description: '正しい姿勢で疲労をためにくくする', unlockLevel: 12, category: 'health' },
  { id: 'health-04', name: '深睡眠の術', description: '睡眠の質を高めて回復力を底上げする', unlockLevel: 16, category: 'health' },
  { id: 'health-05', name: '体幹錬成', description: '軸を鍛え、安定した動作を身につける', unlockLevel: 22, category: 'health' },
  { id: 'health-06', name: '柔軟の極意', description: '可動域を広げ、しなやかな身体を作る', unlockLevel: 28, category: 'health' },
  { id: 'health-07', name: '呼吸循環', description: '呼吸のリズムで持久力を高める', unlockLevel: 34, category: 'health' },
  { id: 'health-08', name: '栄養設計', description: '食事バランスを最適化して土台を固める', unlockLevel: 40, category: 'health' },
  { id: 'health-09', name: '疲労回復プロトコル', description: '回復手順を確立し継戦能力を上げる', unlockLevel: 48, category: 'health' },
  { id: 'health-10', name: '鉄壁のコンディション', description: '乱れない生活リズムで安定を維持する', unlockLevel: 58, category: 'health' },
  { id: 'health-11', name: '持久の覇気', description: '長時間でも折れない体力を獲得する', unlockLevel: 72, category: 'health' },
  { id: 'health-12', name: '不屈の肉体', description: '試練に耐える強靭な身体を築き上げる', unlockLevel: 90, category: 'health' },

  // =====================================================
  // ===== hobby (探究力系) - 好奇心から創世の力へ =====
  // =====================================================
  { id: 'hobby-01', name: '好奇心の芽', description: '新しいことへの興味が芽生える', unlockLevel: 3, category: 'hobby' },
  { id: 'hobby-02', name: '観察眼', description: '細部に宿る美しさを見つける', unlockLevel: 5, category: 'hobby' },
  { id: 'hobby-09', name: '小さな発見', description: '日常に潜む面白さを見つける', unlockLevel: 6, category: 'hobby' },
  { id: 'hobby-03', name: '没頭の境地', description: '時間を忘れて夢中になれる', unlockLevel: 10, category: 'hobby' },
  { id: 'hobby-10', name: '趣味日記', description: '体験を言葉に残す習慣', unlockLevel: 11, category: 'hobby' },
  { id: 'hobby-04', name: '閃きの感性', description: 'ふとした瞬間にアイデアが降りてくる', unlockLevel: 15, category: 'hobby' },
  { id: 'hobby-11', name: '新しい挑戦', description: '未知の領域に踏み出す勇気', unlockLevel: 16, category: 'hobby' },
  { id: 'hobby-05', name: '創造の手', description: '頭の中のイメージを形にする力', unlockLevel: 20, category: 'hobby' },
  { id: 'hobby-12', name: '感性の磨き石', description: '五感を研ぎ澄ます', unlockLevel: 21, category: 'hobby' },
  { id: 'hobby-13', name: '美の発見者', description: 'どこにでも美しさを見出す眼', unlockLevel: 26, category: 'hobby' },
  { id: 'hobby-06', name: '探究者の直感', description: '答えへの最短ルートを感じ取る', unlockLevel: 30, category: 'hobby' },
  { id: 'hobby-14', name: '没頭の深化', description: 'より深い集中の海に潜る', unlockLevel: 31, category: 'hobby' },
  { id: 'hobby-15', name: '異分野の融合', description: '異なる知識を結びつける力', unlockLevel: 36, category: 'hobby' },
  { id: 'hobby-07', name: '無限の好奇心', description: '知りたいという欲求が止まらない', unlockLevel: 40, category: 'hobby' },
  { id: 'hobby-16', name: '直感の研磨', description: '第六感を鍛え上げる', unlockLevel: 41, category: 'hobby' },
  { id: 'hobby-17', name: '表現の自由', description: '思いを自在に形にする解放', unlockLevel: 46, category: 'hobby' },
  { id: 'hobby-08', name: '万物の理解者', description: 'あらゆる分野を横断する知識', unlockLevel: 50, category: 'hobby' },
  { id: 'hobby-18', name: '美学の追求', description: '究極の美を求めて歩む', unlockLevel: 51, category: 'hobby' },
  { id: 'hobby-19', name: '創造の泉', description: '尽きぬアイデアの源泉', unlockLevel: 56, category: 'hobby' },
  { id: 'hobby-20', name: '芸術の境地', description: '作品に命を吹き込む', unlockLevel: 61, category: 'hobby' },
  { id: 'hobby-21', name: '万象の観察者', description: 'あらゆる現象を見通す眼', unlockLevel: 66, category: 'hobby' },
  { id: 'hobby-22', name: '超越の感性', description: '常識を超えた感覚', unlockLevel: 71, category: 'hobby' },
  { id: 'hobby-23', name: '閃光の直感', description: '稲妻のような閃きを得る', unlockLevel: 76, category: 'hobby' },
  { id: 'hobby-24', name: '宇宙の探究', description: '無限の可能性を探る', unlockLevel: 81, category: 'hobby' },
  { id: 'hobby-25', name: '夢の錬成', description: '夢を現実に変える力', unlockLevel: 86, category: 'hobby' },
  { id: 'hobby-26', name: '神域の感性', description: '人を超えた美意識', unlockLevel: 91, category: 'hobby' },
  { id: 'hobby-27', name: '創世の力', description: '無から有を生み出す', unlockLevel: 96, category: 'hobby' },

  // ==================================================
  // ===== work (知力系) - 集中力から万象の理へ =====
  // ==================================================
  { id: 'work-01', name: '集中力', description: '雑念を払い、目の前のタスクに集中する', unlockLevel: 3, category: 'work' },
  { id: 'work-02', name: '段取り力', description: '効率的な手順を組み立てる', unlockLevel: 5, category: 'work' },
  { id: 'work-09', name: 'タスク整理術', description: 'やるべきことを明確にする', unlockLevel: 7, category: 'work' },
  { id: 'work-03', name: '問題分析', description: '複雑な問題を分解して理解する', unlockLevel: 10, category: 'work' },
  { id: 'work-10', name: '優先順位の見極め', description: '最も重要なことを見定める', unlockLevel: 13, category: 'work' },
  { id: 'work-04', name: '論理的思考', description: '筋道を立てて考える力', unlockLevel: 15, category: 'work' },
  { id: 'work-11', name: 'メモの達人', description: '知識を正確に記録する技', unlockLevel: 18, category: 'work' },
  { id: 'work-05', name: '戦略的視点', description: '全体を俯瞰して最適解を見出す', unlockLevel: 20, category: 'work' },
  { id: 'work-12', name: '振り返りの習慣', description: '経験から学びを抽出する', unlockLevel: 23, category: 'work' },
  { id: 'work-13', name: '効率化の知恵', description: '無駄を削ぎ落とす洞察', unlockLevel: 27, category: 'work' },
  { id: 'work-06', name: '知識の体系化', description: '散らばった情報を整理し体系化する', unlockLevel: 30, category: 'work' },
  { id: 'work-14', name: 'システム思考', description: '全体の仕組みを俯瞰する', unlockLevel: 33, category: 'work' },
  { id: 'work-15', name: '交渉の技術', description: '合意を導く対話力', unlockLevel: 37, category: 'work' },
  { id: 'work-07', name: '専門家の洞察', description: '深い経験に裏打ちされた判断力', unlockLevel: 40, category: 'work' },
  { id: 'work-16', name: 'データ分析力', description: '数字から真実を読み取る', unlockLevel: 43, category: 'work' },
  { id: 'work-17', name: 'リーダーシップ', description: '人を導く統率力', unlockLevel: 47, category: 'work' },
  { id: 'work-08', name: '叡智の結晶', description: '知識と経験が融合した最高の知性', unlockLevel: 50, category: 'work' },
  { id: 'work-18', name: '知の連鎖', description: '知識が知識を生む好循環', unlockLevel: 53, category: 'work' },
  { id: 'work-19', name: '戦略の大局観', description: '大きな流れを読む力', unlockLevel: 57, category: 'work' },
  { id: 'work-20', name: '問題の本質', description: '核心を一瞬で見抜く', unlockLevel: 62, category: 'work' },
  { id: 'work-21', name: '知恵の結実', description: '長年の知識が実を結ぶ', unlockLevel: 67, category: 'work' },
  { id: 'work-22', name: '叡智の泉', description: '深い知恵が湧き出す', unlockLevel: 72, category: 'work' },
  { id: 'work-23', name: '組織の知', description: '集合知を活かす力', unlockLevel: 77, category: 'work' },
  { id: 'work-24', name: '叡智の体現', description: '知恵そのものになる', unlockLevel: 82, category: 'work' },
  { id: 'work-25', name: '天才の閃き', description: '常人には見えぬ解を導く', unlockLevel: 87, category: 'work' },
  { id: 'work-26', name: '全知の片鱗', description: 'すべてを知る者の一端', unlockLevel: 92, category: 'work' },
  { id: 'work-27', name: '万象の理', description: '森羅万象の法則を理解する', unlockLevel: 97, category: 'work' },
];

/** 指定レベル以下で解放可能なスキルをすべて返す */
export function getSkillsForLevel(level: number): Skill[] {
  return SKILLS.filter(s => s.unlockLevel <= level);
}
