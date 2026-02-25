# Fund Analyzer – Missing Data for Full Parity with Symbol (Ticker) Path

The fund analysis view has been improved to borrow from the symbol/ticker design (summary cards, card-based metrics with inline interpretations, key takeaways, share-class interpretations). The backend funds API already provides many fields and `interpretations`. Below is what is **missing or not yet provided** by the backend if we want full parity with the symbol-path experience.

---

## 1. **Scores (0–100 or similar)**

| Missing field | Symbol path has | Purpose |
|---------------|-----------------|---------|
| `riskScore` | 0–100 risk score | Single “Risk” card with “Lower is better”; we currently derive a label from `riskRatingOfficial` (e.g. 1–5) only |
| `returnScore` | 0–100 return score | Single “Return” card with “Higher is better”; we show raw 1Y/3Y performance instead |
| `costScore` | 0–100 cost score | Single “Cost” card with “Lower is better”; we show min TER across share classes, not a normalized score |
| `overallScore` | 0–100 overall score | Single “Overall” card; no fund-level composite score exists |

**Backend could add (optional):**  
Fund-level `riskScore`, `returnScore`, `costScore`, `overallScore` (e.g. 0–100 or 0–1) so the UI can show the same four summary cards as the symbol path.

---

## 2. **Recommendation and reasoning**

| Missing field | Symbol path has | Purpose |
|---------------|-----------------|---------|
| `recommendation` | `BUY` \| `HOLD` \| `SELL` | Clear investment verdict with badge and color |
| `reasoning` | `string[]` | Bullet-point reasons for the recommendation |

**Backend could add (optional):**  
Fund-level `recommendation` and `reasoning[]` (or reuse/expand `interpretations` with a dedicated “recommendation” and “reasoning” keys).  
**Current workaround:** We show “What this means” from existing `interpretations`; no explicit BUY/HOLD/SELL.

---

## 3. **Per-metric “Explanation” and “Action”**

| Missing field | Symbol path has | Purpose |
|---------------|-----------------|---------|
| Per-metric `explanation` | Long-form explanation per metric | Expandable “Explanation” in MetricsGrid |
| Per-metric `action` | What to do with this metric | Expandable “Action” in MetricsGrid |
| Per-metric `riskLevel` | `High` \| `Medium` \| `Low` | Badge and color per metric card |

**Backend could add (optional):**  
For each metric that can have interpretations (e.g. `performance1y`, `volatility3y`, `totalExpenseRatio`), support:

- `interpretations[metricKey]` – short “what it means” (we already use this when present)
- `explanations[metricKey]` – longer explanation (optional)
- `actions[metricKey]` – suggested action (optional)
- `riskLevels[metricKey]` – High/Medium/Low (optional)

**Current state:** We show `interpretations` inline where keys match; no expandable explanation/action and no per-metric risk badge.

---

## 4. **Asset/fund “info” block**

| Missing / partial | Symbol path has | Purpose |
|-------------------|-----------------|---------|
| Single “Asset Information” block | Sector, Market Cap, P/E, Beta, Dividend Yield, EPS | One compact grid for identity and key stats |

**Current state:** Fund has `fundHouse`, `assetClass`, `geography`, `sector`, `industry`, etc. in the header and in Portfolio & valuation. We don’t have a single “Fund information” card that mirrors the symbol “Asset Information” grid; layout is spread across header, summary cards, and portfolio cards.  
**Optional:** Backend could expose a clear “fund info” subset; frontend can group those into one card if desired.

---

## 5. **Educational and profile-match blocks**

| Missing field | Symbol path has | Purpose |
|----------------|-----------------|---------|
| `educationalInsights` | `string[]` | “Educational Insights” card with bullet points |
| `profileMatch` | `{ strengths: string[]; concerns: string[] }` | “Profile Match Analysis” (strengths/concerns) |

**Backend could add (optional):**  
Fund-level `educationalInsights[]` and `profileMatch { strengths, concerns }` for learning and suitability.  
**Current state:** Not present for funds; Learn tab uses fund/share-class interpretations and glossary only.

---

## 6. **Data we already have and use**

- **Fund:** Performance (1Y, 3Y, 5Y, 10Y, inception), volatility, beta, Sharpe, risk rating, Morningstar, AUM, inception date, P/E, P/B, yield, benchmark, fund manager, `interpretations`.
- **Share class:** NAV, navDate, minimum investment, TER, sales charge, management fee, `interpretations`.
- **Compare:** Full comparison payload and optional `fundInterpretations` / `shareClassInterpretations`.

So the main gaps are: **normalized scores**, **explicit recommendation + reasoning**, **per-metric explanation/action/riskLevel**, and **educational/profile-match** blocks. Adding these (where the backend can support them) would bring the fund analyzer to full parity with the symbol-path design.
