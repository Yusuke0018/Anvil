import { DailyRecord } from '@/types';

function getCompletedCount(record: DailyRecord): number {
  return record.checks.filter(c => c.status === 'done' || c.status === 'auto').length;
}

export function getRecordCompletionRate(
  record: DailyRecord,
  fallbackTotalHabits: number
): number {
  if (!record.submitted) return 0;

  const total = record.totalHabitsAtSubmit ?? fallbackTotalHabits;
  if (total <= 0) return 0;

  return Math.min(getCompletedCount(record) / total, 1);
}

export function isRecordPerfect(
  record: DailyRecord,
  fallbackTotalHabits: number
): boolean {
  return getRecordCompletionRate(record, fallbackTotalHabits) >= 1;
}
