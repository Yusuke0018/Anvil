import { DailyRecord } from '@/types';

function getCompletedCount(record: DailyRecord): number {
  return record.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
}

function getRecordTotalHabits(record: DailyRecord): number {
  const completed = getCompletedCount(record);
  if (record.totalHabitsAtSubmit && record.totalHabitsAtSubmit > 0) {
    return Math.max(record.totalHabitsAtSubmit, completed);
  }
  return completed;
}

export function getRecordCompletionRate(record: DailyRecord): number {
  if (!record.submitted) return 0;

  const total = getRecordTotalHabits(record);
  if (total <= 0) return 0;

  return Math.min(getCompletedCount(record) / total, 1);
}

export function isRecordPerfect(record: DailyRecord): boolean {
  return getRecordCompletionRate(record) >= 1;
}
