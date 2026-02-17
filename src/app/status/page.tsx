'use client';

import { useGameState } from '@/hooks/useGameState';
import StatCard from '@/components/StatCard';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { expToNextStatLevel } from '@/lib/xp';
import { SKILLS } from '@/data/skills';
import { TITLES } from '@/data/titles';
import { CATEGORY_INFO } from '@/data/constants';
import { HabitCategory } from '@/types';

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  life: 'text-[#e05050]',
  health: 'text-[#4fbf7f]',
  hobby: 'text-accent',
  work: 'text-[#5088e0]',
};

export default function StatusPage() {
  const { state } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  const { character } = state;
  const equippedTitle = state.equippedTitleId
    ? TITLES.find(t => t.id === state.equippedTitleId) ?? null
    : null;
  const unlockedTitles = TITLES.filter(t => state.unlockedTitleIds.includes(t.id));
  const unlockedSkills = SKILLS.filter(s => state.unlockedSkillIds.includes(s.id));

  const skillsByCategory = (['life', 'health', 'hobby', 'work'] as HabitCategory[]).map(cat => ({
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

      <div className="px-4 mt-4 space-y-3">
        <StatCard
          label="心力 (STR)"
          emoji="🔥"
          mastery={character.stats.vitality}
          currentXP={character.statXP.vitality.currentXP}
          nextXP={expToNextStatLevel(character.stats.vitality)}
          completions={character.totalCompletions.life}
          color="text-[#e05050]"
        />
        <StatCard
          label="体力 (VIT)"
          emoji="💪"
          mastery={character.stats.stamina}
          currentXP={character.statXP.stamina.currentXP}
          nextXP={expToNextStatLevel(character.stats.stamina)}
          completions={character.totalCompletions.health}
          color="text-[#4fbf7f]"
        />
        <StatCard
          label="探究力 (DEX)"
          emoji="⚔️"
          mastery={character.stats.curiosity}
          currentXP={character.statXP.curiosity.currentXP}
          nextXP={expToNextStatLevel(character.stats.curiosity)}
          completions={character.totalCompletions.hobby}
          color="text-accent"
        />
        <StatCard
          label="知力 (INT)"
          emoji="📖"
          mastery={character.stats.intellect}
          currentXP={character.statXP.intellect.currentXP}
          nextXP={expToNextStatLevel(character.stats.intellect)}
          completions={character.totalCompletions.work}
          color="text-[#5088e0]"
        />
      </div>

      <div className="px-4 mt-4">
        <div className="rpg-panel p-4">
          <h3 className="text-xs font-medium text-text-secondary mb-3 tracking-widest uppercase">▸ 現在の所持</h3>
          {equippedTitle ? (
            <div className="flex items-center gap-3 rounded-sm px-3 py-2.5 bg-bg-surface/60 border border-gold/60 rpg-border-glow">
              <span className="text-xl">{equippedTitle.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-gold">{equippedTitle.name}</div>
                <div className="text-xs text-text-secondary">{equippedTitle.condition}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm px-3 py-2.5 bg-bg-deep/40 border border-bg-surface/30 text-sm text-text-secondary">
              現在装備中の称号はありません
            </div>
          )}
          <p className="text-xs sm:text-[11px] text-text-secondary mt-2">
            所持称号: <span className="pixel-num">{unlockedTitles.length}</span> / {TITLES.length} ・
            所持スキル: <span className="pixel-num">{unlockedSkills.length}</span> / {SKILLS.length}
          </p>
          {unlockedSkills.length === 0 ? (
            <div className="rounded-sm px-3 py-2.5 mt-3 bg-bg-deep/40 border border-bg-surface/30 text-sm text-text-secondary">
              まだスキルはありません。各能力の熟練度を上げると解放されます。
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {skillsByCategory.map(({ category, info, skills }) => {
                const owned = skills.filter(skill => state.unlockedSkillIds.includes(skill.id));
                if (owned.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="text-xs sm:text-[11px] text-text-secondary mb-1.5 tracking-wider">
                      {info.emoji} {info.statLabel} / 所持 {owned.length}個
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {owned.map(skill => (
                        <span
                          key={skill.id}
                          className={`text-xs rounded-sm px-2 py-1 border bg-bg-surface/60 border-rpg-border-dim ${CATEGORY_COLORS[category]}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
