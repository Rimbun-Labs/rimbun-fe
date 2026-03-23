/**
 * Document parse API types – bank statements and product brochures (PDS).
 * Aligned with backend POST /api/v1/documents/parse and POST /api/v1/spending/from-statement.
 */

export type DocumentSource = 'explicit' | 'inferred' | 'not_disclosed';

export interface BankStatementTransactionDto {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  confidence?: number;
  source?: DocumentSource;
}

export interface BankStatementSummaryDto {
  periodStart?: string;
  periodEnd?: string;
  openingBalance?: number;
  closingBalance?: number;
  totalCredits?: number;
  totalDebits?: number;
  currency?: string;
  confidence?: number;
  source?: DocumentSource;
}

export interface BankStatementResponseDto {
  transactions: BankStatementTransactionDto[];
  summary?: BankStatementSummaryDto;
}

export interface SuggestedForSpendingDto {
  monthlySpending: number;
  emergencyFundCurrent: number;
  emergencyFundTarget?: number;
  monthlyIncomeProxy?: number;
}

/** Parse response when documentType is bank_statement */
export interface DocumentParseBankStatementResponse {
  documentType: 'bank_statement';
  bankStatement: BankStatementResponseDto;
  suggestedForSpending?: SuggestedForSpendingDto;
}

/**
 * Product DNA from PDS parse. Shape matches backend ProductDnaResponseDto;
 * we pass it through to POST .../enrich-from-pds.
 */
export type ProductDnaResponseDto = Record<string, unknown>;

/** Parse response when documentType is insurance_pds */
export interface DocumentParsePdsResponse {
  documentType: 'insurance_pds';
  productDna: ProductDnaResponseDto;
}

/** Union: parse can return either bank statement or PDS */
export type DocumentParseResponse =
  | DocumentParseBankStatementResponse
  | DocumentParsePdsResponse;

/** Request body for applying bank statement to spending */
export interface ApplyBankStatementRequest {
  bankStatement: BankStatementResponseDto;
}

/** Response from POST /spending/from-statement */
export interface ApplyBankStatementResponse {
  success: true;
  derived: {
    monthlySpending: number;
    emergencyFundCurrent: number;
    emergencyFundTarget?: number;
  };
  suggestedMonthlyIncome?: number;

  // Phase 2 (optional) – derived from categorized statement
  burnRate?: number; // expenses / income (e.g. 0.85 = 85%)
  categoryTotals?: {
    essential: number;
    discretionary: number;
    debt: number;
  };
}

/** Backend error shape for document parse */
export interface DocumentParseErrorBody {
  error?: string;
  message?: string;
}
