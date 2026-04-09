/** Matches backend `Word` schema enum (lowercase). */
export const WORD_OVERALL_TONE_VALUES = [
  'formal',
  'informal',
  'neutral',
  'academic',
  'technical',
  'colloquial',
  'literary',
] as const;

export type WordOverallTone = (typeof WORD_OVERALL_TONE_VALUES)[number];

export const WORD_OVERALL_TONE_LABELS: Record<WordOverallTone, string> = {
  formal: 'Formal',
  informal: 'Informal',
  neutral: 'Neutral',
  academic: 'Academic',
  technical: 'Technical',
  colloquial: 'Colloquial',
  literary: 'Literary',
};

/** Map API value to a valid select value (lowercase) or ''. */
export function normalizeOverallToneForForm(value: string | undefined | null): string {
  if (value == null || String(value).trim() === '') return '';
  const lower = String(value).trim().toLowerCase();
  return WORD_OVERALL_TONE_VALUES.includes(lower as WordOverallTone) ? lower : '';
}
