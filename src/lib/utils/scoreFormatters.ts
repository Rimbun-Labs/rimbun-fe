/**
 * Format assessment score percentages (risk profile, knowledge level, etc.) for display.
 * Backend may send decimals; we show whole numbers only to avoid questions about derivation.
 */
export function formatScorePercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const n = Number(value);
  const rounded = Math.round(n);
  return `${rounded}%`;
}
