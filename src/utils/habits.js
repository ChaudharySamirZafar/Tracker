export const HABITS = [
  { key: 'steps', label: '10K Steps', type: 'bool' },
  { key: 'water', label: '2L Water', type: 'bool' },
  { key: 'weight', label: 'Weight (kg)', type: 'number' },
  { key: 'quran', label: 'Quran', type: 'bool' },
  { key: 'underCalories', label: 'Under Calories', type: 'bool' },
];

export const BOOL_HABITS = HABITS.filter((h) => h.type === 'bool');

export function getScore(dayData) {
  if (!dayData) return 0;
  let score = 0;
  if (dayData.steps) score++;
  if (dayData.water) score++;
  if (dayData.quran) score++;
  if (dayData.underCalories) score++;
  if (dayData.weight !== undefined && dayData.weight !== null && dayData.weight !== '') score++;
  return score;
}
