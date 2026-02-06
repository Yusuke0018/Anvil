'use client';

import { useState } from 'react';
import { Habit, HabitCategory } from '@/types';
import { CATEGORY_INFO, MAX_HABITS_PER_CATEGORY } from '@/data/constants';

interface HabitEditorProps {
  habits: Habit[];
  onAdd: (name: string, category: HabitCategory) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitEditor({ habits, onAdd, onUpdate, onDelete }: HabitEditorProps) {
  return (
    <div className="px-4 space-y-6">
      {(['life', 'hobby', 'work'] as HabitCategory[]).map(category => (
        <CategoryEditor
          key={category}
          category={category}
          habits={habits.filter(h => h.category === category)}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
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
}: {
  category: HabitCategory;
  habits: Habit[];
  onAdd: (name: string, category: HabitCategory) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
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
    <div>
      <h3 className="text-sm font-medium text-text-secondary mb-3">
        {info.emoji} {info.label}
        <span className="ml-2 text-xs text-text-secondary/60">
          {habits.length} / {MAX_HABITS_PER_CATEGORY}
        </span>
      </h3>

      <div className="space-y-2">
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}

        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="習慣名を入力..."
              autoFocus
              className="flex-1 bg-bg-surface text-text-primary text-sm px-3 py-2 rounded-lg
                border border-accent/30 outline-none focus:border-accent"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-accent text-white text-sm rounded-lg font-medium"
            >
              追加
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(''); }}
              className="px-3 py-2 bg-bg-surface text-text-secondary text-sm rounded-lg"
            >
              ✕
            </button>
          </div>
        ) : canAdd ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 border border-dashed border-text-secondary/30 rounded-lg
              text-text-secondary text-sm transition-colors hover:border-accent/50 hover:text-accent"
          >
            + 追加
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
}: {
  habit: Habit;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
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
          className="flex-1 bg-bg-surface text-text-primary text-sm px-3 py-2 rounded-lg
            border border-accent/30 outline-none focus:border-accent"
        />
        <button
          onClick={handleSave}
          className="px-3 py-2 bg-accent text-white text-sm rounded-lg font-medium"
        >
          保存
        </button>
        <button
          onClick={() => { setIsEditing(false); setEditName(habit.name); }}
          className="px-3 py-2 bg-bg-surface text-text-secondary text-sm rounded-lg"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-bg-card rounded-lg p-3">
      <span className="flex-1 text-sm text-text-primary">{habit.name}</span>
      <button
        onClick={() => { setEditName(habit.name); setIsEditing(true); }}
        className="text-text-secondary text-xs px-2 py-1 rounded hover:text-accent transition-colors"
      >
        編集
      </button>
      {showConfirm ? (
        <div className="flex gap-1">
          <button
            onClick={() => onDelete(habit.id)}
            className="text-danger text-xs px-2 py-1 rounded bg-danger/10"
          >
            削除
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-text-secondary text-xs px-2 py-1 rounded"
          >
            戻す
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-text-secondary text-xs px-2 py-1 rounded hover:text-danger transition-colors"
        >
          削除
        </button>
      )}
    </div>
  );
}
