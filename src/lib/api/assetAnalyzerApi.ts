import { apiClient } from './client';

const API_BASE_URL = 'http://localhost:3001/api/v1/asset-analyzer';

export interface AssetSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: number;
}

export interface AssetSearchResponse {
  success: boolean;
  data: {
    query: string;
    results: AssetSearchResult[];
    count: number;
  };
  timestamp: string;
}

export interface AssetInfo {
  name: string;
  sector: string;
  marketCap: number;
  peRatio: number;
  beta: number;
  dividendYield: number;
  eps: number;
}

export interface MetricAnalysis {
  interpretation: string;
  explanation: string;
  action: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface AssetAnalysis {
  riskScore: number;
  returnScore: number;
  costScore: number;
  overallScore: number;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  reasoning: string[];
}

export interface AssetAnalysisResponse {
  success: boolean;
  data: {
    symbol: string;
    assetInfo: AssetInfo;
    analysis: AssetAnalysis;
    metrics: {
      recommended: string[];
      actual: Record<string, number>;
      analysis: Record<string, MetricAnalysis>;
    };
    timestamp: string;
  };
  timestamp: string;
}

export interface EducationalAnalysisResponse extends AssetAnalysisResponse {
  data: {
    symbol: string;
    assetInfo: AssetInfo;
    analysis: AssetAnalysis;
    metrics: {
      recommended: string[];
      actual: Record<string, number>;
      analysis: Record<string, MetricAnalysis>;
    };
    educationalInsights?: string[];
    profileMatch?: {
      strengths: string[];
      concerns: string[];
    };
    timestamp: string;
  };
}

export interface ComparisonResponse {
  success: boolean;
  data: {
    assets: AssetAnalysisResponse['data'][];
    comparison: {
      bestPerformer: string;
      worstPerformer: string;
      keyDifferences: string[];
    };
  };
  timestamp: string;
}

export class AssetAnalyzerApi {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Search for assets
  async searchAssets(query: string): Promise<AssetSearchResponse> {
    return this.request<AssetSearchResponse>(`/search?q=${encodeURIComponent(query)}`);
  }

  // Get research analysis for an asset
  async analyzeAsset(symbol: string): Promise<AssetAnalysisResponse> {
    return this.request<AssetAnalysisResponse>(`/${symbol}`);
  }

  // Get educational analysis for an asset with user context
  async analyzeAssetEducational(symbol: string, responseGroupId: string): Promise<EducationalAnalysisResponse> {
    return this.request<EducationalAnalysisResponse>(`/${symbol}/educational?responseGroupId=${responseGroupId}`);
  }

  // Compare multiple assets
  async compareAssets(symbols: string[]): Promise<ComparisonResponse> {
    const symbolsParam = symbols.join(',');
    return this.request<ComparisonResponse>(`/compare?symbols=${symbolsParam}`);
  }
}

export const assetAnalyzerApi = new AssetAnalyzerApi();
