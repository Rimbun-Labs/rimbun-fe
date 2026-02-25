/**
 * Fund data formatters – align with backend (decimals as strings, dates YYYY-MM-DD).
 * Use for display only; null/empty → "—" or "N/A".
 */

const NA = '—';

/**
 * Backend sends decimals as strings (e.g. "0.118" = 11.8%).
 * Returns formatted percentage for display (no extra decimals), or "—" if null/empty.
 */
export function formatFundPercent(value: string | number | null | undefined): string {
  if (value == null || value === '') return NA;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return NA;
  const pct = n * 100;
  return `${Number.isInteger(pct) ? pct : parseFloat(pct.toFixed(2))}%`;
}

/**
 * Performance/volatility: backend may send decimal (0.118) or already % (11.8).
 * Uses decimal if |value| <= 1, else treats as percentage. No extra decimals.
 */
export function formatFundPerformance(value: string | number | null | undefined): string {
  if (value == null || value === '') return NA;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return NA;
  if (Math.abs(n) <= 1) {
    const pct = n * 100;
    return `${Number.isInteger(pct) ? pct : parseFloat(pct.toFixed(2))}%`;
  }
  const pct = n;
  return `${Number.isInteger(pct) ? pct : parseFloat(pct.toFixed(2))}%`;
}

/**
 * Profile fit score: backend may send 0–1 (e.g. 0.82) or 0–100 (e.g. 82).
 * Returns 0–100 for display; if value > 1, treats as already percentage.
 */
export function fundFitScoreToPercent(score: number): number {
  if (Number.isNaN(score)) return 0;
  if (score > 1) return Math.round(Math.min(100, Math.max(0, score)));
  return Math.round(score * 100);
}

/**
 * Same as formatFundPercent but for values already in percentage (e.g. risk rating 1–5).
 * If value is 0–1 range, treats as decimal; if 1–10, treats as whole number. No extra decimals.
 */
export function formatFundPercentOrNumber(value: string | number | null | undefined): string {
  if (value == null || value === '') return NA;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return NA;
  if (n <= 1 && n >= -1) {
    const pct = n * 100;
    return `${Number.isInteger(pct) ? pct : parseFloat(pct.toFixed(2))}%`;
  }
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
}

/**
 * Format amount string (e.g. "2000") with locale.
 */
export function formatFundAmount(value: string | number | null | undefined): string {
  if (value == null || value === '') return NA;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return NA;
  return n.toLocaleString();
}

/**
 * Format date string YYYY-MM-DD to readable (e.g. "15 Jan 2025").
 */
export function formatFundDate(value: string | null | undefined): string {
  if (value == null || value === '') return NA;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return value;
  }
}

/**
 * Display value for any fund field: null/empty → "—".
 */
export function formatFundValue(value: string | number | boolean | null | undefined): string {
  if (value == null || value === '') return NA;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/**
 * Ratio-style metrics (P/E, P/B, Sharpe): show as number, no %. Use backend precision, max 2 decimals.
 */
export function formatFundRatio(value: string | number | null | undefined): string {
  if (value == null || value === '') return NA;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) return NA;
  const formatted = n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return formatted;
}

/**
 * Convert camelCase or PascalCase to title case for display (e.g. "riskRatingOfficial" → "Risk rating official").
 * Use for API keys shown as labels so user-facing text is consistent.
 */
export function camelCaseToTitleCase(value: string | null | undefined): string {
  if (value == null || value === '') return '';
  const withSpaces = value
    .replace(/([A-Z])/g, ' $1')
    .replace(/([a-z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .trim();
  const titleCase = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
  return titleCase;
}
