import { Title, TitleCheckContext } from '@/types';

export interface TitleDefinition extends Title {
  check: (ctx: TitleCheckContext) => boolean;
}

export const TITLES: TitleDefinition[] = [
  // ===== レベル系 =====
  {
    id: 't-lv5', name: '見習い冒険者', icon: '🌱',
    description: '冒険の第一歩を踏み出した者', condition: 'Lv5到達',
    check: (ctx) => ctx.level >= 5,
  },
  {
    id: 't-lv10', name: '駆け出しの鍛冶師', icon: '🔨',
    description: '鍛錬の基礎を身につけた者', condition: 'Lv10到達',
    check: (ctx) => ctx.level >= 10,
  },
  {
    id: 't-lv20', name: '熟練の職人', icon: '⚒',
    description: '確かな腕を持つ職人', condition: 'Lv20到達',
    check: (ctx) => ctx.level >= 20,
  },
  {
    id: 't-lv30', name: '歴戦の勇者', icon: '⚔️',
    description: '数々の試練を乗り越えた勇者', condition: 'Lv30到達',
    check: (ctx) => ctx.level >= 30,
  },
  {
    id: 't-lv50', name: '伝説の鍛冶師', icon: '👑',
    description: '伝説に名を刻む鍛冶の達人', condition: 'Lv50到達',
    check: (ctx) => ctx.level >= 50,
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
