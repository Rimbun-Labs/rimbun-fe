/**
 * Funds API types – aligned with backend /api/v1/investment/funds
 * Response wrapper: { data: T; meta: { timestamp, version } }
 */

/** Filter: source (provider) */
export type FundSource = 'baiduri' | 'bibd';

/** Filter: asset class (backend values) */
export type FundAssetClass =
  | 'Equity'
  | 'Bond'
  | 'Multi-Asset'
  | 'REIT'
  | 'Money Market'
  | 'Fixed Income'
  | 'Other';

/** Glossary term from GET /investment/funds/glossary */
export interface GlossaryTerm {
  termId: string;
  term: string;
  definition: string;
  shortExplanation?: string;
}

/** Profile fit (only when authenticated and includeFit=true) */
export interface FundProfileFitDto {
  /** Backend may send 0–1 (e.g. 0.85) or 0–100 (e.g. 85); use fundFitScoreToPercent() for display */
  score: number;
  reasons: string[];
  matchDetails: {
    risk: { match: boolean; reason: string };
    horizon: { match: boolean; reason: string };
    shariah: { match: boolean; reason: string } | null;
    assetClassAlignment: { match: boolean; reason: string; weightUsed: number } | null;
  };
}

/** List item from GET /investment/funds (backend sends decimals as strings, e.g. "0.118") */
export interface FundListItem {
  fundId: string;
  name: string;
  source: string;
  fundHouse: string;
  assetClass: string;
  geography: string;
  shariahCompliant: boolean;
  isActive: boolean;
  /** Performance (decimals as strings: "0.118" = 11.8%) */
  performance1y: string | null;
  performance3y: string | null;
  performance5y?: string | null;
  performance10y?: string | null;
  performanceInception?: string | null;
  volatility3y: string | null;
  beta3y?: string | null;
  sharpeRatio?: string | null;
  riskRatingOfficial: string | null;
  riskRatingInternal?: string | null;
  /** Short "what this fund is" (e.g. for search cards and fund header) */
  description?: string | null;
  /** Human-readable risk level from backend (e.g. "Lower risk", "Medium", "Higher risk") */
  riskLevel?: string | null;
  /** Investment horizon (e.g. "Long term", "At least 5 years") */
  investmentHorizonOfficial?: string | null;
  investmentHorizonInternal?: string | null;
  /** Valuation / portfolio (strings from backend) */
  aum?: string | null;
  aumCurrency?: string | null;
  aumDate?: string | null;
  inceptionDate?: string | null;
  numberOfHoldings?: number | null;
  peRatio?: string | null;
  pbRatio?: string | null;
  yield?: string | null;
  distributionYield?: string | null;
  yieldToMaturity?: string | null;
  effectiveDurationYears?: string | null;
  morningstarRating?: string | null;
  benchmark?: string | null;
  portfolioMetrics?: unknown;
  statisticalAnalysis?: unknown;
  /** Identity / metadata */
  alternativeName?: string | null;
  symbol?: string | null;
  bloombergTicker?: string | null;
  sector?: string | null;
  industry?: string | null;
  esgClassification?: string | null;
  fundManager?: string | null;
  subManagers?: string | null;
  custodian?: string | null;
  trustee?: string | null;
  distributors?: string | null;
  shariahAdvisors?: string | null;
  portfolioManagers?: string | null;
  interpretations?: Record<string, string>;
  /** Only when authenticated and includeFit=true */
  profileFit?: FundProfileFitDto;
}

/** Share class from fund detail (backend sends amounts/fees as strings) */
export interface ShareClassListItem {
  shareClassId: string;
  fundId: string;
  className: string;
  currency: string;
  isin: string;
  nav: string | null;
  navDate: string;
  minimumInitialAmount: string | null;
  minimumInitialCurrency: string;
  salesChargeCurrent: string | null;
  managementFee: string | null;
  totalExpenseRatio: string | null;
  isActive: boolean;
  interpretations?: Record<string, string>;
}

/** Row from GET /investment/funds/compare (amounts/fees as strings from backend) */
export interface FundCompareItem {
  shareClassId: string;
  fundId: string;
  fundName: string;
  className: string;
  currency: string;
  assetClass: string;
  geography: string;
  shariahCompliant: boolean;
  nav: string | null;
  navDate: string;
  minimumInitialAmount: string | null;
  minimumInitialCurrency: string;
  salesChargeCurrent: string | null;
  managementFee: string | null;
  totalExpenseRatio: string | null;
  performance1y: string | null;
  performance3y: string | null;
  volatility3y: string | null;
  riskRatingOfficial: string | null;
  fundInterpretations?: Record<string, string>;
  shareClassInterpretations?: Record<string, string>;
}

/** Response: GET /investment/funds/glossary */
export interface GlossaryResponse {
  terms: GlossaryTerm[];
}

/** Response: GET /investment/funds */
export interface FundListResponse {
  funds: FundListItem[];
  total: number;
  limit: number;
  offset: number;
}

/** Response: GET /investment/funds/:fundId */
export interface FundDetailResponse {
  fund: FundListItem;
  shareClasses: ShareClassListItem[];
}

/** Response: GET /investment/funds/compare */
export interface FundCompareResponse {
  comparison: FundCompareItem[];
}

/** Backend success wrapper (use response.data) */
export interface FundsApiMeta {
  timestamp: number;
  version: string;
}

/** Backend error shape */
export interface FundsApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

/** List funds query params */
export interface FundListParams {
  source?: FundSource | string;
  assetClass?: FundAssetClass | string;
  geography?: string;
  shariahCompliant?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  includeInterpretations?: boolean;
  /** When true and user is authenticated, response includes profileFit per fund */
  includeFit?: boolean;
}
