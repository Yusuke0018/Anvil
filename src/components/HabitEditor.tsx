'use client';

import { useState } from 'react';
import { Habit, HabitCategory } from '@/types';
import { CATEGORY_INFO, HABIT_CATEGORIES, MAX_HABITS_PER_CATEGORY } from '@/data/constants';

interface HabitEditorProps {
  habits: Habit[];
  onAdd: (name: string, category: HabitCategory) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

function compareHabits(a: Habit, b: Habit): number {
  if (a.order !== b.order) return a.order - b.order;
  if (a.createdAt !== b.createdAt) return a.createdAt.localeCompare(b.createdAt);
  return a.id.localeCompare(b.id);
}

export default function HabitEditor({ habits, onAdd, onUpdate, onDelete, onReorder }: HabitEditorProps) {
  return (
    <div className="px-4 space-y-6">
      {HABIT_CATEGORIES.map(category => (
        <CategoryEditor
          key={category}
          category={category}
          habits={habits.filter(h => h.category === category).sort(compareHabits)}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}

function CategoryEditor({
  category,
  habits,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: {
  category: HabitCategory;
  habits: Habit[];
  onAdd: (name: string, category: HabitCategory) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}) {
  const info = CATEGORY_INFO[category];
  const canAdd = habits.length < MAX_HABITS_PER_CATEGORY;
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="rpg-panel p-4">
      <h3 className="text-xs font-medium text-text-secondary mb-3 tracking-wider uppercase">
        {info.emoji} {info.label}
        <span className="ml-2 text-text-secondary pixel-num">
          {habits.length}/{MAX_HABITS_PER_CATEGORY}
        </span>
      </h3>

      <div className="space-y-2">
        {habits.map((habit, idx) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onReorder={onReorder}
            isFirst={idx === 0}
            isLast={idx === habits.length - 1}
          />
        ))}

        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="クエスト名を入力..."
              autoFocus
              className="flex-1 bg-bg-deep text-text-primary text-sm px-3 py-2 rounded-sm
                border-2 border-rpg-border-dim outline-none focus:border-accent"
            />
            <button onClick={handleAdd} className="rpg-btn rpg-btn-primary px-3 py-2 text-sm">
              追加
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(''); }}
              className="rpg-btn px-3 py-2 text-sm"
            >
              ✕
            </button>
          </div>
        ) : canAdd ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 border-2 border-dashed border-rpg-border-dim rounded-sm
              text-text-secondary text-sm transition-colors hover:border-accent/50 hover:text-accent"
          >
            + クエスト追加
          </button>
        ) : null}
      </div>
    </div>
  );
}

function HabitItem({
  habit,
  onUpdate,
  onDelete,
  onReorder,
  isFirst,
  isLast,
}: {
  habit: Habit;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== habit.name) {
      onUpdate(habit.id, trimmed);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          className="flex-1 bg-bg-deep text-text-primary text-sm px-3 py-2 rounded-sm
            border-2 border-rpg-border-dim outline-none focus:border-accent"
        />
        <button onClick={handleSave} className="rpg-btn rpg-btn-primary px-3 py-2 text-sm">
          保存
        </button>
        <button
          onClick={() => { setIsEditing(false); setEditName(habit.name); }}
          className="rpg-btn px-3 py-2 text-sm"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-bg-surface/40 border border-rpg-border-dim rounded-sm p-2.5">
      <div className="flex flex-col gap-0.5">
        {!isFirst && (
          <button
            onClick={() => onReorder(habit.id, 'up')}
            className="rpg-btn px-1.5 py-0 text-[10px] leading-tight"
            aria-label="上へ移動"
          >
            ▲
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => onReorder(habit.id, 'down')}
            className="rpg-btn px-1.5 py-0 text-[10px] leading-tight"
            aria-label="下へ移動"
          >
            ▼
          </button>
        )}
      </div>
      <span className="flex-1 text-sm text-text-primary">{habit.name}</span>
      <button
        onClick={() => { setEditName(habit.name); setIsEditing(true); }}
        className="rpg-btn px-2 py-1 text-xs sm:text-[11px]"
      >
        編集
      </button>
      {showConfirm ? (
        <div className="flex gap-1">
          <button
            onClick={() => onDelete(habit.id)}
            className="rpg-btn rpg-btn-danger px-2 py-1 text-xs sm:text-[11px]"
          >
            削除
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rpg-btn px-2 py-1 text-xs sm:text-[11px]"
          >
            戻す
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="rpg-btn px-2 py-1 text-xs sm:text-[11px]"
        >
          削除
        </button>
      )}
    </div>
  );
}
