// Phase 2: 覚悟ゲージ
// 型定義は types/index.ts に先行定義済み
// このファイルはPhase 2で実装予定

import { ResolutionGauge } from '@/types';

export const INITIAL_RESOLUTION: ResolutionGauge = {
  current: 0,
  streak: 0,
  maxStreak: 0,
};
