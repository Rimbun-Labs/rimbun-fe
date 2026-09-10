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

export async function getBusinessProfile(customerId: string): Promise<BusinessProfile | null> {
  const { data } = await apiClient.get(`/dashboard/customers/${customerId}/business-profile`);
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
  }
): Promise<BusinessProfile> {
  const { data } = await apiClient.put(
    `/dashboard/customers/${customerId}/business-profile`,
    body
  );
  return unwrap(data);
}

export async function listBusinessAccounts(customerId: string): Promise<FinancialAccount[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/accounts`);
  return unwrap(data) ?? [];
}

export async function listReceivables(customerId: string): Promise<BusinessReceivable[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/receivables`);
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
  }
): Promise<BusinessReceivable> {
  const { data } = await apiClient.post(`/business/customers/${customerId}/receivables`, body);
  return unwrap(data);
}

export async function listObligations(customerId: string): Promise<BusinessObligation[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/obligations`);
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
  }
): Promise<BusinessObligation> {
  const { data } = await apiClient.post(`/business/customers/${customerId}/obligations`, body);
  return unwrap(data);
}

export async function listFacilities(customerId: string): Promise<FinancingFacility[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/facilities`);
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
  }
): Promise<FinancingFacility> {
  const { data } = await apiClient.post(`/business/customers/${customerId}/facilities`, body);
  return unwrap(data);
}

export async function listPlanEvents(customerId: string): Promise<BusinessPlanEvent[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/plan-events`);
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
  }
): Promise<BusinessPlanEvent> {
  const { data } = await apiClient.post(`/business/customers/${customerId}/plan-events`, body);
  return unwrap(data);
}

export async function getLatestForecast(customerId: string): Promise<BusinessForecast | null> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/forecast`);
  return unwrap(data);
}

export async function createForecast(customerId: string): Promise<BusinessForecast> {
  const { data } = await apiClient.post(`/business/customers/${customerId}/forecast`);
  return unwrap(data);
}

export async function listWarnings(customerId: string): Promise<BusinessWarning[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/warnings`);
  return unwrap(data) ?? [];
}

export async function listActions(customerId: string): Promise<BusinessAction[]> {
  const { data } = await apiClient.get(`/business/customers/${customerId}/actions`);
  return unwrap(data) ?? [];
}

export async function updateAction(
  customerId: string,
  actionId: string,
  body: { status: string; completionNotes?: string }
): Promise<BusinessAction> {
  const { data } = await apiClient.put(
    `/business/customers/${customerId}/actions/${actionId}`,
    body
  );
  return unwrap(data);
}
