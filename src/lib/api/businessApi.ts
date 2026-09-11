import { apiClient } from "./client";

export type BusinessProfile = {
  id: string;
  tenantId: string;
  customerId: string;
  legalName: string;
  tradingName: string | null;
  registrationNumber: string | null;
  industryCode: string | null;
  industryLabel: string | null;
  countryCode: string | null;
  baseCurrency: string;
  metadata?: Record<string, unknown>;
};

export type FinancialAccount = {
  id: string;
  externalAccountId: string;
  institutionName: string | null;
  accountType: string | null;
  displayName: string | null;
  currency: string;
  currentBalance: string | null;
  availableBalance: string | null;
  balanceAsOf: string | null;
  balanceSource: string | null;
  status: string;
  lastSyncedAt: string | null;
};

export type BusinessReceivable = {
  id: string;
  externalId: string | null;
  originalAmount: string;
  outstandingAmount: string;
  currency: string;
  status: string;
  dueDate: string | null;
  source: string;
};

export type BusinessObligation = {
  id: string;
  externalId: string | null;
  obligationType: string;
  amount: string;
  currency: string;
  status: string;
  dueDate: string | null;
  source: string;
};

export type FinancingFacility = {
  id: string;
  facilityType: string;
  lenderName: string | null;
  outstandingPrincipal: string | null;
  availableAmount: string | null;
  currency: string;
  status: string;
  source: string;
};

export type BusinessPlanEvent = {
  id: string;
  eventType: string;
  title: string;
  expectedDate: string | null;
  amount: string | null;
  currency: string | null;
  status: string;
  scenario: string;
  source: string;
};

export type BusinessForecast = {
  id: string;
  currency: string;
  minBalance30d: string | null;
  minBalance60d: string | null;
  minBalance90d: string | null;
  shortfallDate: string | null;
  shortfallAmount: string | null;
  confidence: string | null;
  projectedBalances: Array<{ day: number; projectedBalance: number }>;
  inputCompleteness?: Record<string, number>;
  qualityFlags?: string[];
  explanation?: Record<string, unknown>;
  asOf?: string;
};

export type BusinessWarning = {
  id: string;
  warningType: string;
  severity: string;
  title: string;
  rationale: string;
  status: string;
  evidence?: Record<string, unknown>;
};

export type BusinessAction = {
  id: string;
  actionType: string;
  priority: string;
  title: string;
  rationale: string;
  status: string;
  dueDate: string | null;
  evidence?: Record<string, unknown>;
};

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function getDesignatedBusinessSubject(): Promise<{
  tenantId: string;
  customerId: string;
  externalCustomerId: string;
}> {
  const { data } = await apiClient.get("/business/me/subject");
  return unwrap(data);
}

export async function getBusinessProfile(
  customerId: string,
): Promise<BusinessProfile | null> {
  const { data } = await apiClient.get(
    `/dashboard/customers/${customerId}/business-profile`,
  );
  return unwrap(data);
}

export async function upsertBusinessProfile(
  customerId: string,
  body: {
    legalName: string;
    baseCurrency: string;
    tradingName?: string;
    countryCode?: string;
    industryCode?: string;
    industryLabel?: string;
  },
): Promise<BusinessProfile> {
  const { data } = await apiClient.put(
    `/dashboard/customers/${customerId}/business-profile`,
    body,
  );
  return unwrap(data);
}

export async function listBusinessAccounts(
  customerId: string,
): Promise<FinancialAccount[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/accounts`,
  );
  return unwrap(data) ?? [];
}

export async function listReceivables(
  customerId: string,
): Promise<BusinessReceivable[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/receivables`,
  );
  return unwrap(data) ?? [];
}

export async function createReceivable(
  customerId: string,
  body: {
    originalAmount: number;
    outstandingAmount: number;
    currency: string;
    dueDate?: string;
    status?: string;
    externalId?: string;
    source?: string;
  },
): Promise<BusinessReceivable> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/receivables`,
    body,
  );
  return unwrap(data);
}

export async function listObligations(
  customerId: string,
): Promise<BusinessObligation[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/obligations`,
  );
  return unwrap(data) ?? [];
}

export async function createObligation(
  customerId: string,
  body: {
    obligationType: string;
    amount: number;
    currency: string;
    dueDate?: string;
    status?: string;
    externalId?: string;
    source?: string;
  },
): Promise<BusinessObligation> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/obligations`,
    body,
  );
  return unwrap(data);
}

export async function listFacilities(
  customerId: string,
): Promise<FinancingFacility[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/facilities`,
  );
  return unwrap(data) ?? [];
}

export async function createFacility(
  customerId: string,
  body: {
    facilityType: string;
    currency: string;
    outstandingPrincipal?: number;
    availableAmount?: number;
    lenderName?: string;
    source?: string;
  },
): Promise<FinancingFacility> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/facilities`,
    body,
  );
  return unwrap(data);
}

export async function listPlanEvents(
  customerId: string,
): Promise<BusinessPlanEvent[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/plan-events`,
  );
  return unwrap(data) ?? [];
}

export async function createPlanEvent(
  customerId: string,
  body: {
    eventType: string;
    title: string;
    expectedDate?: string;
    amount?: number;
    currency?: string;
    scenario?: string;
    source?: string;
  },
): Promise<BusinessPlanEvent> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/plan-events`,
    body,
  );
  return unwrap(data);
}

export async function getBusinessOverview(
  customerId: string,
): Promise<BusinessOverview> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/overview`,
  );
  return unwrap(data);
}

export type BusinessOverviewWeeklyPoint = {
  week: number;
  day: number;
  date: string;
  projectedBalance: number;
  netFlow: number;
  confirmedNet: number;
  expectedNet: number;
  plannedNet: number;
  modelledNet: number;
};

export type BusinessOverviewMetric = {
  code: string;
  suppressed: boolean;
  suppressionReason?: string;
  value: unknown;
  unit?: string;
  currency?: string;
  asOf: string;
  confidence: number;
  calculationVersion: string;
  formula: string;
  evidence: Record<string, unknown>;
};

export type BusinessOverviewForecast = {
  id: string;
  scenario?: string;
  confidence: string | null;
  qualityFlags: unknown;
  modelVersion: string;
  weeklyBalances: BusinessOverviewWeeklyPoint[];
  minBalanceHorizon: number | null;
  minBalanceDate: string | null;
  shortfallDate: string | null;
  shortfallAmount: string | null;
  expectedInBeforeLow: number;
  commitmentsBeforeLow: number;
  eventEvidence: Array<Record<string, unknown>>;
  calculationVersion: string;
  bufferBreachDate?: string | null;
};

export type BusinessClaimType =
  | "observed"
  | "calculated"
  | "conditional"
  | "benchmark_based";

export type BusinessImpactBasis =
  | "gross_amount"
  | "minimum_cash_change"
  | "funding_need_reduction"
  | "cost_saving";

export type BusinessEvidenceQuality = "complete" | "partial" | "insufficient";

export type BusinessOverviewAction = {
  id: string;
  title: string;
  rationale: string;
  why?: string;
  priority: string;
  dueDate: string | null;
  actionType: string | null;
  impactIdr: number | null;
  impactCurrency: string | null;
  impactKind: string | null;
  impactLabel: string | null;
  claimType?: BusinessClaimType | null;
  impactBasis?: BusinessImpactBasis | null;
  evidenceQuality?: BusinessEvidenceQuality | null;
  grossAmountIdr?: number | null;
  assumptions?: string[];
  standaloneMinCashChangeIdr?: number | null;
  standaloneFundingNeedReductionIdr?: number | null;
  sequentialFundingNeedReductionIdr?: number | null;
  urgency: string;
  urgencyLabel: string;
  baselineSummary: string | null;
  scenarioSummary: string | null;
  baselineMetric?: Record<string, unknown> | null;
  scenarioMetric?: Record<string, unknown> | null;
  evidenceRows: Array<{
    label: string;
    amount: number | null;
    date: string | null;
    detail: string | null;
  }>;
  relatedEntityIds: string[];
  effectiveDate: string | null;
  validUntil: string | null;
  actionKey: string | null;
  evidence?: Record<string, unknown>;
};

export type BusinessOverviewCashSummary = {
  baselineFundingNeedIdr?: number;
  conditionalFundingReductionIdr?: number;
  residualFundingNeedIfActionsSucceedIdr?: number;
  verifiedMissingCashIdr?: number;
  estimatedCostOpportunityIdr?: number;
  /** @deprecated use conditionalFundingReductionIdr */
  addressableCashPressureIdr: number;
  /** @deprecated use residualFundingNeedIfActionsSucceedIdr */
  residualFundingNeedIdr: number;
  residualFundingDate: string | null;
  cashBufferTargetIdr?: number | null;
  /** @deprecated use estimatedCostOpportunityIdr */
  costSavingsIdr: number;
  openActionCount: number;
  attribution: Array<Record<string, unknown>>;
};

export type BusinessOverview = {
  asOf: string;
  demoBadge: boolean;
  baseCurrency: string;
  cashAvailable: number;
  cashPositionComplete: boolean;
  cashPosition: Array<{
    accountId: string;
    balanceAsOf: string | null;
    observedBalance: number | null;
    transactionNetAfterBalance: number;
    calculatedBalance: number | null;
  }>;
  excludedCurrencies: string[];
  accountCount: number;
  forecast: BusinessOverviewForecast | null;
  planOverlay: BusinessOverviewForecast | null;
  cashSummary?: BusinessOverviewCashSummary;
  primaryAction: BusinessOverviewAction | null;
  actions: BusinessOverviewAction[];
  warnings: Array<{
    id: string;
    title: string;
    rationale: string;
    severity: string;
    warningType: string;
    evidence?: Record<string, unknown>;
  }>;
  capabilities: {
    active: Array<"high_frequency_sales" | "invoice_led">;
    sources: Record<string, Array<"declared" | "industry" | "facts">>;
    high_frequency_sales: boolean;
    invoice_led: boolean;
  };
  modules: {
    high_frequency_sales: {
      capability: "high_frequency_sales";
      label: string;
      metrics: BusinessOverviewMetric[];
      settlement: {
        matchedCount: number;
        unmatchedCount: number;
        reconciliationRate: number | null;
        periodStart?: string;
        periodEnd?: string;
        calculationVersion: string;
        unmatchedAmount?: number;
        actionableMissingCount?: number;
        actionableMissingAmount?: number;
      };
    } | null;
    invoice_led: {
      capability: "invoice_led";
      label: string;
      metrics: BusinessOverviewMetric[];
      actions: Array<Record<string, unknown>>;
    } | null;
  };
  freshness: {
    latestBalanceAsOf: string | null;
    accountsSyncedAt: string | null;
    salesDaysInPeriod: number;
    openReceivableCount: number;
    openReceivableAmount?: number | null;
  };
};

export async function getLatestForecast(
  customerId: string,
): Promise<BusinessForecast | null> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/forecast`,
  );
  return unwrap(data);
}

export async function listWarnings(
  customerId: string,
): Promise<BusinessWarning[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/warnings`,
  );
  return unwrap(data) ?? [];
}

export async function listActions(
  customerId: string,
): Promise<BusinessAction[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/actions`,
  );
  return unwrap(data) ?? [];
}

export async function updateAction(
  customerId: string,
  actionId: string,
  body: {
    status: string;
    completionNotes?: string;
    outcome?: "recovered" | "negotiated" | "completed" | "attempted_no_result";
    actualAmount?: number;
    completedAt?: string;
  },
): Promise<BusinessAction> {
  const { data } = await apiClient.put(
    `/business/customers/${customerId}/actions/${actionId}`,
    body,
  );
  return unwrap(data);
}

export type BusinessImportSourceType =
  | "account_balances_csv"
  | "bank_csv"
  | "pos_csv"
  | "invoices_csv"
  | "bills_csv"
  | "invoice_payments_csv"
  | "settlements_csv";

export type BusinessImportTemplate = {
  sourceType: BusinessImportSourceType;
  label: string;
  headers: string[];
  sampleCsv: string;
};

export type BusinessImportPreview = {
  sourceType: BusinessImportSourceType;
  filename: string | null;
  contentHash: string;
  delimiter: "," | ";";
  headers: string[];
  mapping: Record<string, string | null>;
  requiredFields: string[];
  mappableFields?: string[];
  baseCurrency: string;
  previewRows: Array<{
    rowNumber: number;
    payload: Record<string, string | number | null>;
    validationState: "valid" | "invalid";
    errorCodes: string[];
    errorMessage?: string;
  }>;
  summary: {
    rowCount: number;
    validCount: number;
    invalidCount: number;
    createdEstimate: number;
    errorCodes: string[];
  };
};

export type BusinessImportBatch = {
  id: string;
  sourceType: string;
  originalFilename: string | null;
  status: string;
  rowCount: number | null;
  createdCount: number | null;
  skippedCount: number | null;
  errorCount: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  contentHash: string | null;
  createdAt: string;
  completedAt: string | null;
  reversedAt: string | null;
  hasOriginal?: boolean;
  originalByteSize?: number | null;
};

export async function listImportTemplates(): Promise<BusinessImportTemplate[]> {
  const { data } = await apiClient.get("/business/import-templates");
  return unwrap(data) ?? [];
}

export async function listImportBatches(
  customerId: string,
): Promise<BusinessImportBatch[]> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/imports`,
  );
  return unwrap(data) ?? [];
}

export type BusinessImportBatchDetail = {
  batch: BusinessImportBatch & { hasOriginal?: boolean };
  headers: string[];
  rows: Array<{ rowNumber: number; cells: string[] }>;
  totalRows: number;
  limit: number;
  offset: number;
  truncated: boolean;
  failedRows: Array<{
    rowNumber: number;
    errorCodes: string[];
    errorMessage: string | null;
    sample: Record<string, string>;
  }>;
  message?: string;
};

export async function getImportBatch(
  customerId: string,
  batchId: string,
  params?: { limit?: number; offset?: number },
): Promise<BusinessImportBatchDetail> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/imports/${batchId}`,
    { params },
  );
  return unwrap(data);
}

export async function downloadImportOriginal(
  customerId: string,
  batchId: string,
): Promise<{ filename: string; mimeType: string; csvText: string }> {
  const { data } = await apiClient.get(
    `/business/customers/${customerId}/imports/${batchId}/original`,
  );
  return unwrap(data);
}

export async function previewImport(
  customerId: string,
  body: {
    sourceType: BusinessImportSourceType;
    filename?: string;
    csvText: string;
    mapping?: Record<string, string | null>;
  },
): Promise<BusinessImportPreview> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/imports/preview`,
    body,
  );
  return unwrap(data);
}

export async function confirmImport(
  customerId: string,
  body: {
    sourceType: BusinessImportSourceType;
    filename?: string;
    csvText: string;
    mapping: Record<string, string | null>;
  },
): Promise<{
  batch: BusinessImportBatch;
  duplicate: boolean;
  message?: string;
  forecastId?: string;
}> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/imports/confirm`,
    body,
  );
  return unwrap(data);
}

export async function reverseImport(
  customerId: string,
  batchId: string,
): Promise<{ batch: BusinessImportBatch; alreadyReversed: boolean }> {
  const { data } = await apiClient.post(
    `/business/customers/${customerId}/imports/${batchId}/reverse`,
  );
  return unwrap(data);
}
