'use client';

import { useGameState } from '@/hooks/useGameState';
import StatCard from '@/components/StatCard';
import LevelBar from '@/components/LevelBar';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { expToNextLevel, xpPerHabit } from '@/lib/xp';
import { SKILLS } from '@/data/skills';
import { TITLES } from '@/data/titles';
import { CATEGORY_INFO } from '@/data/constants';
import { HabitCategory } from '@/types';

export default function StatusPage() {
  const { state, equipTitle } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  const { character } = state;
  const needed = expToNextLevel(character.level);
  const perHabit = xpPerHabit(character.level);
  const submittedDays = state.dailyRecords.filter(r => r.submitted).length;

  const skillsByCategory = (['life', 'hobby', 'work'] as HabitCategory[]).map(cat => ({
    category: cat,
    info: CATEGORY_INFO[cat],
    skills: SKILLS.filter(s => s.category === cat),
  }));

  return (
    <>
      <header className="px-4 pt-6 pb-2 flex items-start justify-between">
        <h1 className="text-lg font-bold tracking-wider">
          <span className="text-accent">🛡️</span> ステータス
        </h1>
        <ThemeToggle />
      </header>

      <LevelBar level={character.level} currentXP={character.currentXP} />

      {/* ステータスカード */}
      <div className="px-4 space-y-3">
        <StatCard
          label="心力 (STR)"
          emoji="🔥"
          value={character.stats.vitality}
          completions={character.totalCompletions.life}
          color="text-[#e05050]"
        />
        <StatCard
          label="探究力 (DEX)"
          emoji="⚔️"
          value={character.stats.curiosity}
          completions={character.totalCompletions.hobby}
          color="text-accent"
        />
        <StatCard
          label="知力 (INT)"
          emoji="📖"
          value={character.stats.intellect}
          completions={character.totalCompletions.work}
          color="text-[#5088e0]"
        />
      </div>

      {/* スキル一覧 */}
      <div className="px-4 mt-6">
        <div className="rpg-panel p-4">
          <h3 className="text-xs font-medium text-text-secondary mb-3 tracking-widest uppercase">▸ スキル</h3>
          <div className="space-y-4">
            {skillsByCategory.map(({ category, info, skills }) => (
              <div key={category}>
                <div className="text-xs sm:text-[11px] text-text-secondary mb-2 tracking-wider">
                  {info.emoji} {info.statLabel}
                </div>
                <div className="space-y-1.5">
                  {skills.map(skill => {
                    const unlocked = state.unlockedSkillIds.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`flex items-center gap-3 rounded-sm px-3 py-2 border ${
                          unlocked
                            ? 'bg-bg-surface/60 border-rpg-border-dim'
                            : 'bg-bg-deep/40 border-bg-surface/30'
                        }`}
                      >
                        {unlocked ? (
                          <>
                            <span className={`text-sm font-medium shrink-0 ${
                              category === 'life' ? 'text-[#e05050]' :
                              category === 'hobby' ? 'text-accent' : 'text-[#5088e0]'
                            }`}>
                              {skill.name}
                            </span>
                            <span className="text-xs text-text-secondary flex-1 text-right">
                              {skill.description}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-text-secondary/40">🔒</span>
                            <span className="text-sm text-text-secondary/40 pixel-num">
                              Lv.{skill.unlockLevel} で解放
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 称号一覧 */}
      <div className="px-4 mt-4">
        <div className="rpg-panel p-4">
          <h3 className="text-xs font-medium text-text-secondary mb-3 tracking-widest uppercase">▸ 称号</h3>
          <div className="space-y-2">
            {TITLES.map(title => {
              const unlocked = state.unlockedTitleIds.includes(title.id);
              const equipped = state.equippedTitleId === title.id;
              return (
                <button
                  key={title.id}
                  className={`w-full flex items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-all border ${
                    equipped
                      ? 'bg-bg-surface/60 border-gold/60 rpg-border-glow'
                      : unlocked
                        ? 'bg-bg-surface/40 border-rpg-border-dim active:scale-[0.98]'
                        : 'bg-bg-deep/40 border-bg-surface/30 cursor-default'
                  }`}
                  onClick={() => {
                    if (!unlocked) return;
                    equipTitle(equipped ? null : title.id);
                  }}
                >
                  {unlocked ? (
                    <>
                      <span className="text-lg">{title.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${equipped ? 'text-gold' : 'text-text-primary'}`}>
                          {title.name}
                          {equipped && <span className="text-xs sm:text-[11px] text-gold/70 ml-2 tracking-wider">装備中</span>}
                        </div>
                        <div className="text-xs text-text-secondary">{title.condition}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lg opacity-30">🔒</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-secondary/40">???</div>
                        <div className="text-xs text-text-secondary/30">{title.condition}</div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 概要情報 */}
      <div className="px-4 mt-4">
        <div className="rpg-panel p-4 space-y-2">
          <h3 className="text-xs font-medium text-text-secondary mb-2 tracking-widest uppercase">▸ 概要</h3>
          <InfoRow label="総獲得EXP" value={`${character.totalXP.toLocaleString()} EXP`} />
          <InfoRow label="次レベルまで" value={`${(needed - character.currentXP).toLocaleString()} EXP`} />
          <InfoRow label="1クエストあたりEXP" value={`${perHabit} EXP`} />
          <InfoRow label="冒険日数" value={`${submittedDays}日`} />
          <InfoRow label="連続達成" value={`${state.resolutionGauge.streak}日`} />
          <InfoRow label="最高連続" value={`${state.resolutionGauge.maxStreak}日`} />
          <InfoRow label="覚悟ゲージ" value={`${state.resolutionGauge.current}/100`} />
        </div>
      </div>

      <BottomNav />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-rpg-border-dim/30 pb-1.5">
      <span className="text-text-secondary text-xs">{label}</span>
      <span className="text-text-primary font-medium pixel-num text-xs">{value}</span>
    </div>
  );
}
