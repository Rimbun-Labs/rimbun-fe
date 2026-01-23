/**
 * Investment Holdings Types
 * Similar structure to banking products for consistency
 */

export type InvestmentAssetClass = 'equities' | 'bonds' | 'real_estate' | 'cash' | 'commodities' | 'crypto' | 'other';

export type InvestmentType = 
  | 'stock' 
  | 'bond' 
  | 'mutual_fund' 
  | 'etf' 
  | 'real_estate_investment' 
  | 'savings_account' 
  | 'fixed_deposit'
  | 'commodity'
  | 'cryptocurrency'
  | 'other';

export interface InvestmentHolding {
  id: string;
  holdingId: string; // Product/asset identifier
  name: string; // e.g., "Apple Inc.", "S&P 500 ETF", "BND Government Bond"
  type: InvestmentType;
  assetClass: InvestmentAssetClass;
  symbol?: string; // Stock ticker, ETF symbol, etc.
  institution?: string; // Broker, bank, or platform name
  addedDate: string; // ISO date string
  currentValue: number; // Current market value
  quantity?: number; // Number of shares/units
  averageCost?: number; // Average cost per unit
  totalCost?: number; // Total cost basis
  purchaseDate?: string; // ISO date string
  lastUpdated?: string; // ISO date string
  notes?: string;
  // Performance metrics (calculated)
  gainLoss?: number; // Current value - total cost
  gainLossPercent?: number; // (gainLoss / totalCost) * 100
}

export interface InvestmentHoldingsResponse {
  holdings: InvestmentHolding[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  byAssetClass: {
    [key in InvestmentAssetClass]?: {
      holdings: InvestmentHolding[];
      totalValue: number;
      percentage: number;
    };
  };
}

export interface AddHoldingRequest {
  holding: {
    holdingId: string;
    name: string;
    type: InvestmentType;
    assetClass: InvestmentAssetClass;
    symbol?: string;
    institution?: string;
    currentValue: number;
    quantity?: number;
    averageCost?: number;
    totalCost?: number;
    purchaseDate?: string;
    notes?: string;
  };
}

export interface UpdateHoldingRequest {
  currentValue?: number;
  quantity?: number;
  averageCost?: number;
  totalCost?: number;
  lastUpdated?: string;
  notes?: string;
}



