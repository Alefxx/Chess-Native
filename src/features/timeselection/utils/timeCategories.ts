import type { TimeOption } from '@/features/timeselection/service/time.service';

export type TimeCategoryKey = 'bullet' | 'blitz' | 'rapid' | 'classical';

export const TIME_CATEGORIES: readonly {
  key: TimeCategoryKey;
  label: string;
  description: string;
}[] = [
  { key: 'bullet', label: 'Bullet', description: 'Até 3 minutos' },
  { key: 'blitz', label: 'Blitz', description: 'Até 10 minutos' },
  { key: 'rapid', label: 'Rápida', description: 'Até 60 minutos' },
  { key: 'classical', label: 'Clássica', description: 'Mais de 60 minutos' },
];

export const getTimeOptionId = (time: TimeOption) => time.slug || time._id || time.id || '';

export function getTimeCategory(time: TimeOption): TimeCategoryKey {
  const estimatedMinutes = time.minutos + (time.incremento * 40) / 60;
  if (estimatedMinutes <= 3) return 'bullet';
  if (estimatedMinutes <= 10) return 'blitz';
  if (estimatedMinutes <= 60) return 'rapid';
  return 'classical';
}

export function groupTimeOptions(times: TimeOption[]) {
  return TIME_CATEGORIES.map((category) => ({
    ...category,
    times: times.filter((time) => getTimeCategory(time) === category.key && getTimeOptionId(time)),
  })).filter((category) => category.times.length > 0);
}
