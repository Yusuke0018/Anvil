'use client';

import { useGameState } from '@/hooks/useGameState';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
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
  const { state, equipTitle } = useGameState();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

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
              未装備です（下の称号一覧から選択できます）
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

      {/* スキル一覧 */}
      <div className="px-4 mt-4">
        <div className="rpg-panel p-4">
          <h3 className="text-xs font-medium text-text-secondary mb-1 tracking-widest uppercase">▸ スキル図鑑</h3>
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
                              CATEGORY_COLORS[category]
                            }`}>
                              {skill.name}
                            </span>
                            <span className="text-xs text-gold flex-1 text-right tracking-wider">
                              所持済み
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-text-secondary">🔒</span>
                            <span className="text-sm text-text-secondary pixel-num">
                              {info.statLabel} 熟練度 {skill.unlockLevel} で解放
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
                        <div className="text-sm text-text-secondary">???</div>
                        <div className="text-xs text-text-secondary">{title.condition}</div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
