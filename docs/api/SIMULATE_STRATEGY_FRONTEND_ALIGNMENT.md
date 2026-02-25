# Simulate-Strategy API – Frontend Alignment

Aligns frontend with `POST /api/v1/goals/simulate-strategy` for **real-fund simulation** (optional `goalFundSelections`).

---

## 1. Endpoint (unchanged)

- **Method/URL:** `POST /api/v1/goals/simulate-strategy`
- **Auth:** Authenticated user; backend uses userId from token/session
- **Response wrapper:** `{ data: SimulateStrategyResponse }`

---

## 2. Request body

**Required (unchanged):**

- **`strategy`** — `"priority"` | `"timeline"` | `"proportional"` | `"required_savings"`
- **`monthlyBudget`** — number > 0

**Optional (unchanged):**

- **`goalIds`** — string[] — limit simulation to these goals
- **`includeInactive`** — boolean — include inactive goals

**Optional (real-fund simulation):**

- **`goalFundSelections`** — `Record<string, GoalFundSelection>`
  - **Key:** goal ID (UUID from backend)
  - **Value:** `GoalFundSelection`:
    - **`fundIds`** — string[] — fund IDs from funds API (e.g. `/api/v1/investment/funds`)
    - **`weights`** — number[] (optional) — allocation per fund; if omitted, equal weight

Example:

```json
{
  "strategy": "priority",
  "monthlyBudget": 500,
  "goalFundSelections": {
    "goal-uuid-abc": {
      "fundIds": ["fund-uuid-1", "fund-uuid-2"],
      "weights": [0.6, 0.4]
    }
  }
}
```

- If **`goalFundSelections`** is omitted or empty: behavior unchanged (asset-class assumptions, linear projection).
- If **`goalFundSelections[goalId]`** is present with at least one `fundId`: that goal uses real fund performance (e.g. 3y annualized) and compounding.

---

## 3. Response (unchanged)

- **`strategy`**, **`monthlyBudget`**, **`totalAllocated`**, **`remainingBudget`**, **`allocations`**, **`warnings`**, **`reasoning`**
- Each **`allocations[]`** item: **`goalId`**, **`goalName`**, **`currentContribution`**, **`suggestedContribution`**, **`reason`**, **`projectedCompletionYear`**, **`projectedCompletionMonth`**, **`monthsToComplete`**, **`timeDifference`**

No new response fields.

---

## 4. Frontend implementation

| Item | Notes |
|------|--------|
| **Types** | `GoalFundSelection` and `goalFundSelections` on `SimulateStrategyRequest` in `src/lib/api/types/goals.ts`. `GoalMetadata` may include `selectedFundIds` / `selectedFundWeights` for persistence. |
| **IDs** | Use backend **goal IDs** (UUIDs) as keys in `goalFundSelections`. Use backend **fund IDs** (from `/api/v1/investment/funds` or fund fit) in `fundIds`. |
| **When to send** | Send `goalFundSelections` only when the user has chosen specific funds for a goal. Otherwise omit. |
| **Weights** | If sent, `weights` length should match `fundIds`; backend normalizes. If omitted, backend uses equal weight. |
| **AllocationStrategySimulator** | Builds `goalFundSelections` from `goal.metadata.selectedFundIds` (and optional `selectedFundWeights`) when present; passes in simulate-strategy request. |
| **Backward compatibility** | Requests without `goalFundSelections` are valid and behave as before. |

---

## 5. Goal metadata fallback

The backend may also read **goal metadata** (`metadata.selectedFundIds` / `metadata.selectedFundWeights`) when **`goalFundSelections`** is not provided for that goal. The frontend can:

- Pass fund choices **only in the request** via `goalFundSelections`, or
- Persist selected funds on the goal (e.g. `metadata.selectedFundIds` / `metadata.selectedFundWeights`) and either build `goalFundSelections` from it (as in AllocationStrategySimulator) or rely on backend fallback.

For explicit control per request, building and sending **`goalFundSelections`** from goal metadata (when present) is the current approach.

---

## 6. Summary

- Same endpoint and response.
- Optional **`goalFundSelections`** shape: goal ID → `{ fundIds, weights? }`.
- Send when the user has selected funds for a goal; omit otherwise.
- No breaking changes.
