# Funds API – Frontend alignment

Base path: **`/api/v1/investment/funds`**

**Auth:**
- **Fund data (list, detail, compare, glossary):** No auth required; endpoints are public.
- **Profile fit:** When you want suitability scores per fund, send **`Authorization: Bearer <firebaseIdToken>`** and **`includeFit=true`** (or `1`). The backend returns **`profileFit`** on each fund only when the user is authenticated and `includeFit` is set.

---

## Response wrapper (all endpoints)

All success responses use this wrapper; only `data` changes by endpoint.

```json
{
  "data": { ... },
  "meta": {
    "timestamp": 1738142400000,
    "version": "1.0"
  }
}
```

- Use **`response.data`** for the payload.
- Use **`response.meta`** for timestamp/version if needed.

---

## Sample responses

### 1. Glossary — `GET /api/v1/investment/funds/glossary`

**`data`:**

```json
{
  "terms": [
    {
      "termId": "nav",
      "term": "NAV (Net Asset Value)",
      "definition": "The price of one unit of the fund. It reflects the total value of the fund's assets minus its liabilities, divided by the number of units. NAV is calculated at the end of each business day.",
      "shortExplanation": "The price per unit you would pay or receive when buying or selling the fund."
    },
    {
      "termId": "totalExpenseRatio",
      "term": "Total Expense Ratio (TER)",
      "definition": "The annual cost of running the fund as a percentage of its assets. It includes management fees, administrative costs, and other operating expenses. A high expense ratio reduces your net returns over time.",
      "shortExplanation": "Ongoing yearly cost of the fund; lower means more of your money stays invested."
    },
    {
      "termId": "peRatio",
      "term": "P/E Ratio",
      "definition": "Price-to-earnings ratio of the fund's holdings; used for equity funds.",
      "shortExplanation": "Valuation metric for equity holdings; lower may indicate cheaper stocks."
    }
  ]
}
```

Frontend: use `data.terms`; key by `termId` (or `term`) for tooltips and “What’s this?” links.

---

### 2. List funds — `GET /api/v1/investment/funds`

**`data`:**

```json
{
  "funds": [
    {
      "fundId": "baiduri_global_equity_fund",
      "name": "Global Equity Fund",
      "source": "baiduri",
      "fundHouse": "Baiduri Capital",
      "assetClass": "Equity",
      "geography": "Global",
      "shariahCompliant": false,
      "isActive": true,
      "alternativeName": null,
      "symbol": null,
      "bloombergTicker": null,
      "sector": null,
      "industry": null,
      "riskRatingOfficial": "5",
      "riskRatingInternal": null,
      "investmentHorizonOfficial": null,
      "investmentHorizonInternal": null,
      "esgClassification": null,
      "aum": null,
      "aumCurrency": null,
      "aumDate": null,
      "inceptionDate": null,
      "performance1y": "0.118",
      "performance3y": "0.068",
      "performance5y": null,
      "performance10y": null,
      "performanceInception": null,
      "volatility3y": "0.158",
      "beta3y": null,
      "sharpeRatio": null,
      "numberOfHoldings": null,
      "yieldToMaturity": null,
      "effectiveDurationYears": null,
      "peRatio": null,
      "pbRatio": null,
      "morningstarRating": null,
      "yield": null,
      "distributionYield": null,
      "benchmark": null,
      "portfolioMetrics": null,
      "statisticalAnalysis": null,
      "fundManager": null,
      "subManagers": null,
      "custodian": null,
      "trustee": null,
      "distributors": null,
      "shariahAdvisors": null,
      "portfolioManagers": null,
      "interpretations": {
        "volatility3y": "Moderate–high volatility.",
        "performance1y": "1-year return: 11.80%.",
        "performance3y": "3-year annualised return: 6.80%.",
        "riskRatingOfficial": "Risk rating 5 (higher risk).",
        "sharpeRatio": null
      }
    }
  ],
  "total": 12,
  "limit": 50,
  "offset": 0
}
```

- `interpretations` only when `?includeInterpretations=true` (or `1`).
- **`profileFit`** only when user is **authenticated** and **`?includeFit=true`** (or `1`). See [Profile fit](#profile-fit) below.
- Decimals as strings (e.g. `"0.118"` = 11.8%); missing data as `null`.
- Pagination: `total`, `limit`, `offset`.

**Query parameters (list):** `source`, `assetClass`, `geography`, `shariahCompliant`, `search`, `limit`, `offset`, `includeInterpretations`, **`includeFit`** (when authenticated, to get `profileFit` per fund).

---

### 3. Fund detail — `GET /api/v1/investment/funds/:fundId`

**`data`:**

```json
{
  "fund": {
    "fundId": "baiduri_global_equity_fund",
    "name": "Global Equity Fund",
    "source": "baiduri",
    "fundHouse": "Baiduri Capital",
    "assetClass": "Equity",
    "geography": "Global",
    "shariahCompliant": false,
    "isActive": true,
    "riskRatingOfficial": "5",
    "performance1y": "0.118",
    "performance3y": "0.068",
    "volatility3y": "0.158",
    "interpretations": {
      "volatility3y": "Moderate–high volatility.",
      "performance1y": "1-year return: 11.80%.",
      "performance3y": "3-year annualised return: 6.80%.",
      "riskRatingOfficial": "Risk rating 5 (higher risk).",
      "sharpeRatio": null
    }
  },
  "shareClasses": [
    {
      "shareClassId": "baiduri_global_equity_fund_A_USD",
      "fundId": "baiduri_global_equity_fund",
      "className": "Class A USD (Acc)",
      "currency": "USD",
      "isActive": true,
      "nav": "18.92",
      "navDate": "2025-01-15",
      "minimumInitialAmount": "2000",
      "minimumInitialCurrency": "USD",
      "salesChargeCurrent": "0.04",
      "managementFee": "0.012",
      "totalExpenseRatio": "0.015",
      "interpretations": {
        "nav": "NAV 18.92 USD per unit (as at 2025-01-15).",
        "minimumInitialAmount": "Minimum initial investment: 2,000 USD.",
        "salesChargeCurrent": "Sales charge: 4.00%.",
        "managementFee": "Management fee: 1.20%.",
        "totalExpenseRatio": "Total yearly cost is 1.50% of your investment."
      }
    },
    {
      "shareClassId": "baiduri_global_equity_fund_B_USD",
      "className": "Class B USD (Acc)",
      "currency": "USD",
      "nav": "17.65",
      "navDate": "2025-01-15",
      "minimumInitialAmount": "5000",
      "minimumInitialCurrency": "USD",
      "salesChargeCurrent": "0",
      "managementFee": "0.01",
      "totalExpenseRatio": "0.012",
      "interpretations": { ... }
    }
  ]
}
```

- `data.fund`: full fund (same shape as list item); many fields may be `null`.
- **`data.fund.profileFit`** only when user is **authenticated** and **`?includeFit=true`** (or `1`).
- `data.shareClasses`: array of share-class objects; optional `interpretations` when requested.

**Query parameters (detail):** **`includeFit`** (when authenticated), `includeInterpretations`.

---

### 4. Profile fit

When the request is **authenticated** (`Authorization: Bearer <firebaseIdToken>`) and **`includeFit=true`** (or `1`), each fund in list/detail may include:

```ts
profileFit?: FundProfileFitDto;

interface FundProfileFitDto {
  score: number;           // 0–1 (e.g. 0.85 = 85% match)
  reasons: string[];       // Human-readable reasons (e.g. "Risk level matches your profile")
  matchDetails: {
    risk:     { match: boolean; reason: string };
    horizon:  { match: boolean; reason: string };
    shariah:  { match: boolean; reason: string } | null;   // null if no Shariah preference
    assetClassAlignment: { match: boolean; reason: string; weightUsed: number } | null;
  };
}
```

- **`score`:** Overall fit 0–1. Use for sorting (“best match first”), badges, or a “fits your profile” indicator.
- **`reasons`:** Short bullets to show in the UI.
- **`matchDetails`:** Per-dimension feedback (risk, horizon, Shariah, asset class). `reason` explains why it matches or doesn’t; `weightUsed` is the allocation weight used for asset-class alignment when applicable.

---

### 5. Compare — `GET /api/v1/investment/funds/compare?shareClassIds=id1,id2`

**`data`:**

```json
{
  "comparison": [
    {
      "shareClassId": "baiduri_global_equity_fund_A_USD",
      "fundId": "baiduri_global_equity_fund",
      "fundName": "Global Equity Fund",
      "source": "baiduri",
      "assetClass": "Equity",
      "geography": "Global",
      "shariahCompliant": false,
      "className": "Class A USD (Acc)",
      "currency": "USD",
      "riskRatingOfficial": "5",
      "performance1y": "0.118",
      "performance3y": "0.068",
      "volatility3y": "0.158",
      "nav": "18.92",
      "navDate": "2025-01-15",
      "minimumInitialAmount": "2000",
      "minimumInitialCurrency": "USD",
      "salesChargeCurrent": "0.04",
      "managementFee": "0.012",
      "totalExpenseRatio": "0.015",
      "fundInterpretations": { ... },
      "shareClassInterpretations": { ... }
    },
    { ... }
  ]
}
```

- Each element = one share class with fund + share-class fields.
- Optional `fundInterpretations` and `shareClassInterpretations` when `?includeInterpretations=true`.

---

## Frontend presentation rules

Use the full data structure from the API, but **present and break it down** for user experience.

| Rule | Example |
|------|--------|
| Always use `response.data` for payload | `const payload = response.data` |
| Decimals as strings | `"0.118"` → display as **11.8%** |
| Dates | `"2025-01-15"` → format as needed (e.g. “15 Jan 2025”) |
| Missing data | `null` → show **“N/A”**, **“—”**, or omit the row |
| Interpretations | Only when `?includeInterpretations=true` or `1`; show as “What this means” next to or under the metric |
| Profile fit | Only when **authenticated** and `?includeFit=true` or `1`; show score, reasons, and matchDetails (risk, horizon, Shariah, asset class) |

### Presentation

- **Group** data into sections (e.g. Identity, Performance & risk, Costs, Share classes, Insights).
- **Label** with human-readable names (e.g. `totalExpenseRatio` → “TER (annual)”, `performance1y` → “1-year return”).
- **Format** decimals, dates, and nulls consistently.
- **Use interpretations** when present: show plain-language text from `fund.interpretations`, `shareClass.interpretations`, or compare’s `fundInterpretations` / `shareClassInterpretations`.
- **Link to glossary** where it helps (e.g. TER, NAV, P/E) using `termId` from `GET /investment/funds/glossary`.

### Principle

- **Backend** = source of truth for what exists.
- **Frontend** = source of truth for how it’s shown (sections, order, labels, formatting, interpretations, glossary links).

Show everything that’s relevant; hide or collapse only when it improves clarity (e.g. long optional fields in a “More details” section).
