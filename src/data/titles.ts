import { Title, TitleCheckContext } from '@/types';

export interface TitleDefinition extends Title {
  check: (ctx: TitleCheckContext) => boolean;
}

export const TITLES: TitleDefinition[] = [
  // =========================================
  // ===== レベル系 (鍛冶師の成長物語) =====
  // =========================================
  {
    id: 't-lv2', name: '鉄の卵', icon: '🥚',
    description: '鍛冶の道に足を踏み入れた者', condition: 'Lv2到達',
    check: (ctx) => ctx.level >= 2,
  },
  {
    id: 't-lv5', name: '見習い冒険者', icon: '🌱',
    description: '冒険の第一歩を踏み出した者', condition: 'Lv5到達',
    check: (ctx) => ctx.level >= 5,
  },
  {
    id: 't-lv8', name: '槌の持ち手', icon: '🔧',
    description: '初めて槌を握った見習い', condition: 'Lv8到達',
    check: (ctx) => ctx.level >= 8,
  },
  {
    id: 't-lv10', name: '駆け出しの鍛冶師', icon: '🔨',
    description: '鍛錬の基礎を身につけた者', condition: 'Lv10到達',
    check: (ctx) => ctx.level >= 10,
  },
  {
    id: 't-lv12', name: '銅の心得', icon: '🟤',
    description: '柔らかき金属を知る者', condition: 'Lv12到達',
    check: (ctx) => ctx.level >= 12,
  },
  {
    id: 't-lv17', name: '炉の理解者', icon: '🏠',
    description: '炎の性質を理解した者', condition: 'Lv17到達',
    check: (ctx) => ctx.level >= 17,
  },
  {
    id: 't-lv20', name: '熟練の職人', icon: '⚒',
    description: '確かな腕を持つ職人', condition: 'Lv20到達',
    check: (ctx) => ctx.level >= 20,
  },
  {
    id: 't-lv22', name: '鋼の感触', icon: '🪨',
    description: '鋼の声が聞こえ始めた者', condition: 'Lv22到達',
    check: (ctx) => ctx.level >= 22,
  },
  {
    id: 't-lv25', name: '四分の一の道', icon: '🗺️',
    description: '長き道の四分の一を歩んだ', condition: 'Lv25到達',
    check: (ctx) => ctx.level >= 25,
  },
  {
    id: 't-lv28', name: '炎読みの技', icon: '🔥',
    description: '炎の色で温度を読む職人', condition: 'Lv28到達',
    check: (ctx) => ctx.level >= 28,
  },
  {
    id: 't-lv30', name: '歴戦の勇者', icon: '⚔️',
    description: '数々の試練を乗り越えた勇者', condition: 'Lv30到達',
    check: (ctx) => ctx.level >= 30,
  },
  {
    id: 't-lv32', name: '刃紋の見極め', icon: '🔍',
    description: '美しき刃紋を見極める眼', condition: 'Lv32到達',
    check: (ctx) => ctx.level >= 32,
  },
  {
    id: 't-lv35', name: '三十五の試練', icon: '⚡',
    description: '数多の試練を経た強者', condition: 'Lv35到達',
    check: (ctx) => ctx.level >= 35,
  },
  {
    id: 't-lv38', name: '鍛冶場の柱', icon: '🏛️',
    description: '仲間から頼られる存在', condition: 'Lv38到達',
    check: (ctx) => ctx.level >= 38,
  },
  {
    id: 't-lv42', name: '玉鋼の使い手', icon: '💎',
    description: '最高の素材を扱う腕前', condition: 'Lv42到達',
    check: (ctx) => ctx.level >= 42,
  },
  {
    id: 't-lv45', name: '四十五の刻印', icon: '📜',
    description: '歴史に名を刻む者', condition: 'Lv45到達',
    check: (ctx) => ctx.level >= 45,
  },
  {
    id: 't-lv48', name: '炉の賢者', icon: '🧙',
    description: '炉のすべてを知り尽くす', condition: 'Lv48到達',
    check: (ctx) => ctx.level >= 48,
  },
  {
    id: 't-lv50', name: '伝説の鍛冶師', icon: '👑',
    description: '伝説に名を刻む鍛冶の達人', condition: 'Lv50到達',
    check: (ctx) => ctx.level >= 50,
  },
  {
    id: 't-lv52', name: '伝説の継承者', icon: '📖',
    description: '先人の技を受け継ぐ者', condition: 'Lv52到達',
    check: (ctx) => ctx.level >= 52,
  },
  {
    id: 't-lv55', name: '星鉄の探求者', icon: '⭐',
    description: '天より降りし鉄を求める', condition: 'Lv55到達',
    check: (ctx) => ctx.level >= 55,
  },
  {
    id: 't-lv58', name: '五十八の境地', icon: '🌊',
    description: '言葉を超えた理解の域', condition: 'Lv58到達',
    check: (ctx) => ctx.level >= 58,
  },
  {
    id: 't-lv60', name: '達人の域', icon: '🏆',
    description: '到達者のみが知る世界', condition: 'Lv60到達',
    check: (ctx) => ctx.level >= 60,
  },
  {
    id: 't-lv63', name: '刀匠の魂', icon: '⚔️',
    description: '刃に魂を宿す匠', condition: 'Lv63到達',
    check: (ctx) => ctx.level >= 63,
  },
  {
    id: 't-lv65', name: '六十五の極み', icon: '🗻',
    description: '極限へと到達する者', condition: 'Lv65到達',
    check: (ctx) => ctx.level >= 65,
  },
  {
    id: 't-lv68', name: '火神の弟子', icon: '🔱',
    description: '炎の神に認められし者', condition: 'Lv68到達',
    check: (ctx) => ctx.level >= 68,
  },
  {
    id: 't-lv70', name: '名匠の証', icon: '🎖️',
    description: '世に知られる名匠', condition: 'Lv70到達',
    check: (ctx) => ctx.level >= 70,
  },
  {
    id: 't-lv73', name: '鍛冶の哲人', icon: '📿',
    description: '鍛冶を通じ真理に至る', condition: 'Lv73到達',
    check: (ctx) => ctx.level >= 73,
  },
  {
    id: 't-lv75', name: '七十五の高み', icon: '🦅',
    description: '高みへと昇りゆく者', condition: 'Lv75到達',
    check: (ctx) => ctx.level >= 75,
  },
  {
    id: 't-lv78', name: '天鉄の加護', icon: '🛡️',
    description: '天より降りし鉄の守護', condition: 'Lv78到達',
    check: (ctx) => ctx.level >= 78,
  },
  {
    id: 't-lv80', name: '覇者の風格', icon: '👑',
    description: '覇気が自然と溢れ出す', condition: 'Lv80到達',
    check: (ctx) => ctx.level >= 80,
  },
  {
    id: 't-lv83', name: '炉神の使徒', icon: '🌟',
    description: '炉の神に仕えし者', condition: 'Lv83到達',
    check: (ctx) => ctx.level >= 83,
  },
  {
    id: 't-lv85', name: '八十五の頂', icon: '⛰️',
    description: '頂に手が届く者', condition: 'Lv85到達',
    check: (ctx) => ctx.level >= 85,
  },
  {
    id: 't-lv88', name: '究極の一打', icon: '💥',
    description: '一打に全てを込める', condition: 'Lv88到達',
    check: (ctx) => ctx.level >= 88,
  },
  {
    id: 't-lv90', name: '仙人鍛冶', icon: '🧓',
    description: '人の域を超えた鍛冶師', condition: 'Lv90到達',
    check: (ctx) => ctx.level >= 90,
  },
  {
    id: 't-lv93', name: '星鍛ちの匠', icon: '🌠',
    description: '星をも鍛える技を持つ', condition: 'Lv93到達',
    check: (ctx) => ctx.level >= 93,
  },
  {
    id: 't-lv95', name: '九十五の到達', icon: '🏔️',
    description: '頂点を目前にした者', condition: 'Lv95到達',
    check: (ctx) => ctx.level >= 95,
  },
  {
    id: 't-lv98', name: '天地の鍛冶師', icon: '🌍',
    description: '天と地を繋ぐ鍛冶師', condition: 'Lv98到達',
    check: (ctx) => ctx.level >= 98,
  },
  {
    id: 't-lv100', name: '覇王の炉', icon: '👑',
    description: 'すべてを極めし伝説の鍛冶師', condition: 'Lv100到達',
    check: (ctx) => ctx.level >= 100,
  },

  // ===== 記録日数系 =====
  {
    id: 't-firstday', name: 'はじまりの一歩', icon: '👣',
    description: 'すべてはここから始まった', condition: '初回記録確定',
    check: (ctx) => ctx.submittedDays >= 1,
  },
  {
    id: 't-days7', name: '一週間の誓い', icon: '📅',
    description: '7日間の鍛錬を達成した者', condition: '7日間記録',
    check: (ctx) => ctx.submittedDays >= 7,
  },
  {
    id: 't-days30', name: '月の旅人', icon: '🌙',
    description: '30日の旅路を歩んだ者', condition: '30日間記録',
    check: (ctx) => ctx.submittedDays >= 30,
  },
  {
    id: 't-days100', name: '百日修行者', icon: '🏔',
    description: '100日の修行を積んだ達人', condition: '100日間記録',
    check: (ctx) => ctx.submittedDays >= 100,
  },

  // ===== カテゴリ達成系 =====
  {
    id: 't-life50', name: '心の探求者', icon: '🔥',
    description: '心力の道を深く歩む者', condition: '人生カテゴリ50回達成',
    check: (ctx) => ctx.totalCompletions.life >= 50,
  },
  {
    id: 't-hobby50', name: '好奇心の冒険家', icon: '🧭',
    description: '探究心に導かれし冒険家', condition: '趣味カテゴリ50回達成',
    check: (ctx) => ctx.totalCompletions.hobby >= 50,
  },
  {
    id: 't-work50', name: '知の錬金術師', icon: '📖',
    description: '知識を力に変える錬金術師', condition: '仕事カテゴリ50回達成',
    check: (ctx) => ctx.totalCompletions.work >= 50,
  },

  // ===== 合計達成系 =====
  {
    id: 't-total100', name: '百錬の士', icon: '💎',
    description: '百の鍛錬を経た強者', condition: '合計100回達成',
    check: (ctx) => ctx.totalCompletions.life + ctx.totalCompletions.hobby + ctx.totalCompletions.work >= 100,
  },
  {
    id: 't-total500', name: '千鍛万錬', icon: '🌟',
    description: '極めし鍛錬の果てに至る者', condition: '合計500回達成',
    check: (ctx) => ctx.totalCompletions.life + ctx.totalCompletions.hobby + ctx.totalCompletions.work >= 500,
  },

  // ===== 特殊系 =====
  {
    id: 't-balanced', name: 'バランスマスター', icon: '⚖️',
    description: '全ての道を均等に歩む賢者', condition: '各カテゴリ30回以上',
    check: (ctx) => ctx.totalCompletions.life >= 30 && ctx.totalCompletions.hobby >= 30 && ctx.totalCompletions.work >= 30,
  },

  // ===== 連続達成系 =====
  {
    id: 't-streak7', name: '七日の炎', icon: '🔥',
    description: '七日間途切れぬ炎を灯した者', condition: '7日連続記録',
    check: (ctx) => ctx.maxStreak >= 7,
  },
  {
    id: 't-streak30', name: '月炎の守護者', icon: '🌕',
    description: '三十日の月光に導かれし守護者', condition: '30日連続記録',
    check: (ctx) => ctx.maxStreak >= 30,
  },

  // ===== 復帰系 =====
  {
    id: 't-comeback', name: '不死鳥の帰還', icon: '🔥',
    description: '炉に再び火を灯した不屈の鍛冶師', condition: '復帰チャレンジ達成',
    check: () => false, // プログラムで直接解放する
  },
];
