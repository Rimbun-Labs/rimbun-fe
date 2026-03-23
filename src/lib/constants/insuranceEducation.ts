/**
 * Copy and explanations for insurance/resilience education across the app.
 * Used on Insurance Explorer and Goal Detail so users learn what protection means.
 */

export const HEDGE_TYPE_EXPLANATIONS: Record<string, { title: string; body: string }> = {
  goal_completion_guarantee: {
    title: 'Goal completion guarantee',
    body: 'If you (or the person paying for the goal) can’t continue, this type of cover helps keep the goal funded—for example, so education or a down payment stays on track. Often used for education and family goals.',
  },
  income_floor: {
    title: 'Income floor',
    body: 'Protection that helps replace or supplement income later—for example in retirement—so you have a baseline level of income regardless of market swings.',
  },
  capital_preservation: {
    title: 'Capital preservation',
    body: 'Term or similar cover so that if something happens, your family doesn’t have to sell investments early or dip into goal savings. Helps protect wealth-building goals.',
  },
  none: {
    title: 'No specific hedge',
    body: 'For this goal type we don’t suggest a specific resilience product. You can still consider general protection (e.g. life or medical) separately.',
  },
};

/** "Stay on Track" – plain-English tooltip for the resilience/score metric */
export const STAY_ON_TRACK_TOOLTIP =
  'Stay on Track is your ability to keep your life goals (like buying a home or retiring) on track, even if something unexpected happens to your health or income.';

/** Status bands for resilience score (0–100%). Used for humanized "Stay on Track" label. */
export const RESILIENCE_STATUS_BANDS = [
  { min: 0, max: 30, label: 'Getting Started', sublabel: 'Encouraging' },
  { min: 31, max: 70, label: 'Building Your Safety Net', sublabel: 'Progressive' },
  { min: 71, max: 100, label: 'Fully Resilient', sublabel: 'Success' },
] as const;

export function getResilienceStatusString(percent: number): (typeof RESILIENCE_STATUS_BANDS)[number]['label'] {
  const p = Math.round(Math.max(0, Math.min(100, percent)));
  const band = RESILIENCE_STATUS_BANDS.find((b) => p >= b.min && p <= b.max);
  return band?.label ?? RESILIENCE_STATUS_BANDS[0].label;
}

/** Pillar labels for the Protection Progress Bar. Short labels under the bar (Health, Life cover, Assets). */
export const PROTECTION_PILLAR_LABELS: Record<string, string> = {
  health_income: 'Health',
  life_family: 'Life cover',
  assets_lifestyle: 'Assets',
};

export const INSURANCE_TERMS = {
  resilience:
    'Resilience means protecting your goals so they stay on track even if life changes—illness, loss of income, or the death of a breadwinner. Insurance and Takaful are common tools.',
  score:
    'This score shows how many of your goals have some form of protection (e.g. recommended products or cover). Higher means more of your goals are hedged.',
  indicativePremium:
    '"Indicative" or "from $X/mo" is an estimate only, not a quote. Actual premiums depend on age, health, and product terms. Use it to compare affordability before you apply.',
  indicativeLabel: 'Estimate only – get a quote from the insurer.',
  recommendedCover:
    'Recommended cover (sum assured) is the amount of protection that would help keep this goal on track if the main payor couldn’t continue. It’s a guide, not advice.',
  recommendedCoverContext:
    'Enough to cover the remaining goal amount if the payor cannot continue.',
  takaful:
    'Takaful is Shariah-compliant protection: participants contribute into a fund that pays claims, with risk and surplus shared according to Islamic principles. It plays a similar role to conventional insurance.',
};

/** Surplus sharing in Takaful (Brunei context). Shown with Takaful toggle. */
export const TAKAFUL_SURPLUS_EXPLANATION =
  'In Takaful, any leftover money in the pool is shared back with you.';

/** One-line explanation of essential cover % and how it is calculated */
export const FOUNDATION_SECURE_EXPLANATION =
  'Essential cover is your baseline protection (e.g. medical, accident, asset cover). The percentage reflects how much of this baseline is in place.';

/** Short in-card label: what counts as foundation (shown under the %). */
export const FOUNDATION_SECURE_LABEL = 'Essential cover (e.g. medical, accident, asset protection)';

/** Short explanations for product category (and optionally subcategory) for tooltips */
export const PRODUCT_CATEGORY_EXPLANATIONS: Record<string, string> = {
  'Whole life': 'Cover for life with a savings or investment element.',
  'Term life': 'Cover for a set period; pays out if you die during the term.',
  PA: 'Personal accident – cover for injury or death from accidents.',
  'Personal accident': 'Cover for injury or death from accidents.',
  Medical: 'Helps pay for medical treatment and hospitalisation.',
  'Critical illness': 'Lump sum if you’re diagnosed with a covered critical illness.',
  Disability: 'Income or lump sum if you become unable to work due to illness or injury.',
  Takaful: 'Shariah-compliant protection; risk and surplus shared among participants.',
};

export const PRODUCT_SUBCATEGORY_EXPLANATIONS: Record<string, string> = {
  ...PRODUCT_CATEGORY_EXPLANATIONS,
  'Waiver of premium': 'Premiums may be waived in specified circumstances (e.g. disability).',
  'Payor benefit': 'Covers premiums if the person paying for the policy cannot continue.',
};

/** One-liners for value indicators on the product detail page */
export const VALUE_INDICATOR_EXPLANATIONS = {
  incomeReplacementMultiplier: 'Higher = more income replaced per dollar of premium.',
  affordabilityEfficiency: 'Higher = more cover per dollar of premium.',
};

/**
 * Bridge explanations: keep legal/technical label in UI; (i) tooltip gives plain-English meaning.
 * Keys match Compare row keys and Product detail section labels where applicable.
 */
export const BRIDGE_EXPLANATIONS: Record<string, string> = {
  sumAssured:
    'This is the total cash amount paid out to you or your family if a claim is made.',
  waiverOfPremium:
    'If you become seriously ill or disabled, the insurer takes over the payments so your cover stays active for free.',
  payorBenefit:
    'If the person paying for this plan (e.g., a parent) passes away, the plan continues without further payments.',
  hedgeType:
    'This describes how the product protects your goal (e.g., by finishing the savings for you or replacing your income).',
  takaful:
    'A community-based protection model where participants share risk and any surplus funds are distributed back to members.',
  frontEndLoaded:
    'A higher portion of your initial payments goes toward setting up the policy and covering protection costs.',
  allocationSchedule:
    'A map of how much of your money is invested into savings versus how much goes toward insurance costs each year.',
  surrenderPenalty:
    'A fee charged if you cancel or withdraw your money from the plan before a certain number of years.',
  bidOfferSpread:
    'The difference between the buying and selling price of investment units within the plan.',
  goalCompleter:
    'A specific feature that ensures your target goal amount (e.g., $50,000 for Education) is reached, even if you can no longer contribute.',
  capitalCertainty:
    'How guaranteed your money is. A high score means your original savings are safe from market drops.',
  acceptanceFriction:
    "How much 'homework' is needed to join. 'Guaranteed' means no medical checkup; 'Full Underwriting' means a health review is required.",
  premium:
    'The amount you pay each month. For Takaful products this is called "contribution" in the prospectus.',
  recommendedCover:
    'This is the total cash amount that would help keep your goal on track if a claim is made (e.g., paid to your family).',
};

/** Label for monthly payment: Takaful uses "Contribution", conventional uses "Premium". */
export function getMonthlyPaymentLabel(isTakaful: boolean): { term: string; indicativeLabel: string } {
  return isTakaful
    ? { term: 'Monthly contribution', indicativeLabel: 'Estimate only – get a quote from the operator.' }
    : { term: 'Monthly premium', indicativeLabel: 'Estimate only – get a quote from the insurer.' };
}

/** Default currency for insurance display (Brunei: BND). Use for cards, compare, and product detail when product has no currency. */
export const INSURANCE_DISPLAY_CURRENCY = 'BND';

/** Number formatter for insurance amounts in the app default (BND). */
export function getInsuranceCurrencyFormat(options?: { maximumFractionDigits?: number }): Intl.NumberFormat {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: INSURANCE_DISPLAY_CURRENCY,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });
}
