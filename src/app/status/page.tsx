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
        <div className="text-text-secondary text-sm">Loading...</div>
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
        <h1 className="text-lg font-bold tracking-wide">
          <span className="text-accent">📊</span> ステータス
        </h1>
        <ThemeToggle />
      </header>

      <LevelBar level={character.level} currentXP={character.currentXP} />

      {/* ステータスカード */}
      <div className="px-4 space-y-3">
        <StatCard
          label="心力"
          emoji="🔥"
          value={character.stats.vitality}
          completions={character.totalCompletions.life}
          color="text-accent"
        />
        <StatCard
          label="探究力"
          emoji="⚔️"
          value={character.stats.curiosity}
          completions={character.totalCompletions.hobby}
          color="text-gold"
        />
        <StatCard
          label="知力"
          emoji="📖"
          value={character.stats.intellect}
          completions={character.totalCompletions.work}
          color="text-success"
        />
      </div>

      {/* スキル一覧 */}
      <div className="px-4 mt-6">
        <div className="bg-bg-card rounded-xl p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">スキル</h3>
          <div className="space-y-4">
            {skillsByCategory.map(({ category, info, skills }) => (
              <div key={category}>
                <div className="text-xs text-text-secondary mb-2">
                  {info.emoji} {info.statLabel}
                </div>
                <div className="space-y-1.5">
                  {skills.map(skill => {
                    const unlocked = state.unlockedSkillIds.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                          unlocked ? 'bg-bg-surface' : 'bg-bg-surface/40'
                        }`}
                      >
                        {unlocked ? (
                          <>
                            <span className={`text-sm font-medium shrink-0 ${
                              category === 'life' ? 'text-accent' :
                              category === 'hobby' ? 'text-gold' : 'text-success'
                            }`}>
                              {skill.name}
                            </span>
                            <span className="text-xs text-text-secondary flex-1 text-right">
                              {skill.description}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-text-secondary/50">🔒</span>
                            <span className="text-sm text-text-secondary/50">
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
        <div className="bg-bg-card rounded-xl p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3">称号</h3>
          <div className="space-y-2">
            {TITLES.map(title => {
              const unlocked = state.unlockedTitleIds.includes(title.id);
              const equipped = state.equippedTitleId === title.id;
              return (
                <button
                  key={title.id}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                    equipped
                      ? 'bg-bg-surface ring-2 ring-gold/60'
                      : unlocked
                        ? 'bg-bg-surface active:scale-[0.98]'
                        : 'bg-bg-surface/40 cursor-default'
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
                          {equipped && <span className="text-xs text-gold/70 ml-2">装備中</span>}
                        </div>
                        <div className="text-xs text-text-secondary">{title.condition}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lg opacity-40">🔒</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-secondary/50">???</div>
                        <div className="text-xs text-text-secondary/40">{title.condition}</div>
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
        <div className="bg-bg-card rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium text-text-secondary mb-2">概要</h3>
          <InfoRow label="総獲得XP" value={`${character.totalXP.toLocaleString()} XP`} />
          <InfoRow label="次レベルまで" value={`${(needed - character.currentXP).toLocaleString()} XP`} />
          <InfoRow label="1習慣あたりXP" value={`${perHabit} XP`} />
          <InfoRow label="記録日数" value={`${submittedDays}日`} />
        </div>
      </div>

      <BottomNav />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
