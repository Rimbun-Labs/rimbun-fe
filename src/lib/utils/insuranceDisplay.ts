/**
 * Display helpers for insurance/resilience UI: product names, categories, goal types.
 * Use these so labels never show raw camelCase/snake_case and missing names have fallbacks.
 */

import { formatGoalType as formatGoalTypeFromPersona } from '@/lib/utils/personaFormatters';

type ProductWithNames = {
  insurerName?: string | null;
  productName?: string | null;
};

/** One-line display name for an insurance product. Handles missing insurer or product name. */
export function getInsuranceProductDisplayName(product: ProductWithNames): string {
  const insurer = (product.insurerName ?? '').trim();
  const name = (product.productName ?? '').trim();
  if (insurer && name) return `${insurer} – ${name}`;
  if (name) return name;
  if (insurer) return insurer;
  return 'Product name not available';
}

/** Title-case and replace underscores so we never show raw camelCase/snake_case. */
function toDisplayLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/** Format category for display (e.g. "term_life" → "Term Life"). */
export function formatInsuranceCategoryLabel(category: string | undefined | null): string {
  if (!category) return '';
  return toDisplayLabel(category);
}

/** Format subcategory for display. */
export function formatInsuranceSubcategoryLabel(subcategory: string | undefined | null): string {
  if (!subcategory) return '';
  return toDisplayLabel(subcategory);
}

/** Category + subcategory label for display (e.g. "Term life · Waiver of premium"). */
export function formatInsuranceCategoryWithSub(
  category: string | undefined | null,
  subcategory: string | undefined | null
): string {
  const cat = formatInsuranceCategoryLabel(category);
  const sub = formatInsuranceSubcategoryLabel(subcategory);
  if (!cat) return sub || '';
  return sub ? `${cat} · ${sub}` : cat;
}

/** Re-export for insurance usage so goal type is always human-readable. */
export const formatGoalType = formatGoalTypeFromPersona;

/** Need-based groups for "by need" UX. Order used for display. No "Other" – unmapped products are shown by their product category instead.
 *  Naming: "Life cover" = insurance product type; "daily life" = assets/living (avoids confusion with "lifestyle" vs "life"). */
export const INSURANCE_NEED_GROUPS = [
  { id: 'health_income', label: 'Health & income' },
  { id: 'life_family', label: 'Life cover & family' },
  { id: 'assets_lifestyle', label: 'Assets & daily life' },
] as const;

/** Need id for unmapped categories (internal only; never shown as a section). */
export const NEED_OTHER = 'other' as const;

export type InsuranceNeedId = (typeof INSURANCE_NEED_GROUPS)[number]['id'] | typeof NEED_OTHER;

/** Map product category (API value) to need group id. Case-insensitive, normalised (spaces/hyphens → underscore). */
const CATEGORY_TO_NEED: Record<string, InsuranceNeedId> = {
  medical: 'health_income',
  critical_illness: 'health_income',
  disability: 'health_income',
  health: 'health_income',
  ci: 'health_income',
  whole_life: 'life_family',
  term_life: 'life_family',
  endowment: 'life_family',
  life: 'life_family',
  pa: 'assets_lifestyle',
  personal_accident: 'assets_lifestyle',
  travel: 'assets_lifestyle',
  home: 'assets_lifestyle',
  motor: 'assets_lifestyle',
  property: 'assets_lifestyle',
  accident: 'assets_lifestyle',
  protection: 'life_family', // generic "protection" often used for life/term
};

/** Normalise API category for lookup (handles "Term Life", "term_life", "term-life"). */
function normaliseCategoryKey(category: string | undefined | null): string {
  return (category ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
}

/** Get need group id for a product category. */
export function getNeedGroupForCategory(category: string | undefined | null): InsuranceNeedId {
  const key = normaliseCategoryKey(category);
  return (key && CATEGORY_TO_NEED[key]) || NEED_OTHER;
}

/** Get display label for a need group id. Unmapped (other) has no display label – use product category instead. */
export function getNeedGroupLabel(needId: InsuranceNeedId): string {
  if (needId === NEED_OTHER) return '';
  return INSURANCE_NEED_GROUPS.find((g) => g.id === needId)?.label ?? needId;
}

/** True if this need id is a displayable need (not other). */
export function isDisplayNeed(needId: InsuranceNeedId): needId is (typeof INSURANCE_NEED_GROUPS)[number]['id'] {
  return needId !== NEED_OTHER;
}
