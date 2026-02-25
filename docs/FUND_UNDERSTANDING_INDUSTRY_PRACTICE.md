# Helping Users Understand Investment Products / Funds – Industry Practice (Brainstorm)

Research summary of what regulators, research firms, and platforms typically provide so retail investors can understand funds. **No implementation** – use this as a brainstorm for product/backend and UX.

---

## 1. Regulatory baseline (PRIIP / KIID / prospectus-style)

These are widely considered the “minimum” for packaged retail products.

| Area | What’s typically required / expected | Why it helps users |
|------|-------------------------------------|---------------------|
| **Objectives & investment policy** | Stated investment **objectives** (e.g. capital appreciation, income, or both) and **strategy** (how the fund tries to achieve them). | Answers “What is this fund trying to do?” and “How does it do it?” |
| **Target investor / suitability** | Who the product is **intended for** (e.g. retail, experienced, long-term savers) and **investment horizon** (short / medium / long term). | Helps users self-assess “Is this for someone like me?” |
| **Risk–reward profile** | A **summary risk indicator** (e.g. 1–7 scale) plus narrative on **main risks** (market, credit, liquidity, etc.) and **possible loss** (e.g. “You could lose up to X%”). | Gives a single “risk number” plus context; supports comparison. |
| **Costs** | **All-in cost** (one number where possible), plus breakdown: entry/exit, ongoing (TER), performance fee, transaction costs. Often **scenarios** (e.g. €10k over 1/5/10 years). | Users see total cost and can compare “cheap vs expensive” easily. |
| **Past performance** | **Historical returns** (e.g. bar chart up to 10 years) with a clear **“past performance is not a guide to future performance”** disclaimer. | Puts returns in context without over-selling. |
| **Practical information** | **Complaints** process, **contact** (manufacturer / distributor), **where to get more** (prospectus, KID, website). | Users know who to ask and where to dig deeper. |

**Gap vs our current data:** We have performance, risk rating, TER/fees, and some identity. We are light on: **objectives/strategy**, **target investor/horizon**, **single risk–reward narrative**, **all-in cost scenarios**, and **complaints/contact**.

---

## 2. Prospectus / “deep” disclosure (SEC / fund docs)

What investors are told to read in a prospectus before investing.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Investment objectives** | Capital appreciation vs income vs combination; how aggressive or conservative. | Matches fund to goal (growth vs income vs balanced). |
| **Principal strategies** | How the manager picks investments (active vs passive, sectors, regions, exclusions). | “How does this fund actually work?” |
| **Principal risks** | Market, credit, liquidity, concentration, currency, etc., in plain language. | “What could go wrong?” in one place. |
| **Fees and expenses** | Management fee, TER, sales charge, other fees; often a **fee table** and **example** (e.g. $10k, 1/3/5/10 years). | Full cost picture and “what I’ll pay” examples. |
| **Past performance** | Multiple periods vs benchmark and/or peer group. | Context: “How did it do in different periods?” |

**Gap vs our current data:** We have some performance and fees; we lack **objectives**, **strategy**, **principal risks** (narrative), and **fee examples / scenarios**.

---

## 3. Research / analyst practice (Morningstar-style)

What research firms emphasise so investors look beyond “last year’s return”.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **People** | **Manager(s)** name, tenure, experience; team stability. | “Who runs my money and are they experienced?” |
| **Process** | **How** the fund picks and manages holdings; repeatability. | “Is there a clear, consistent method?” |
| **Parent** | **Fund house** quality, culture, turnover, ethics. | “Do I trust this provider?” |
| **Performance** | Returns vs **benchmark** and **peer group**; **risk-adjusted** (e.g. Sharpe); **different market conditions**. | “Good return for the risk? How did it do in bad years?” |
| **Price** | **Total cost** (TER + transaction + any other); comparison to category. | “Is it cheap or expensive for what it does?” |
| **Ratings** | **Star rating** (historical, risk-adjusted) and **analyst rating** (forward-looking view). | Quick “quality” signal and analyst view. |

**Gap vs our current data:** We have manager, fund house, performance, TER, risk rating. We lack: **process description**, **parent quality/turnover**, **peer/benchmark comparison**, **risk-adjusted metrics** (e.g. Sharpe we have; could add more), **analyst/star-style rating**, and **performance in different regimes** (e.g. down markets).

---

## 4. Portfolio and holdings

What platforms and factsheets usually show so users see “what I own”.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Top holdings** | **Top 10 (or 20)** names and **weights** (%). | “What are my biggest exposures?” |
| **Sector / region breakdown** | **Allocation** by sector, geography, asset type. | “Is this diversified or concentrated?” |
| **Concentration** | **Top 10 % of AUM**; largest single position. | “How much is in a few names?” |
| **Number of holdings** | Total number of positions. | Diversification at a glance. |
| **Key portfolio stats** | P/E, P/B, yield, duration (for bonds), etc. | “What does the portfolio look like on average?” |

**Gap vs our current data:** We have number of holdings and some valuation (P/E, P/B) at fund level. We lack: **top holdings list**, **sector/region breakdown**, **concentration metrics**, and **portfolio-level stats** (duration, yield) where relevant.

---

## 5. Liquidity and redemption

What regulators and platforms disclose so users understand “can I get my money out?”.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Dealing frequency** | Daily vs weekly vs less frequent. | “When can I buy/sell?” |
| **Cut-off times** | Deadline for same-day or next dealing. | “By when do I need to place the order?” |
| **Settlement** | When proceeds are paid (e.g. T+2, T+5). | “When do I get my money?” |
| **Redemption restrictions** | Gates, notice periods, suspension triggers (e.g. illiquid assets). | “Could I be locked in?” |
| **Liquidity risk** | Narrative on illiquid holdings and liquidity management. | “How safe is my ability to exit?” |

**Gap vs our current data:** We do not show **dealing frequency**, **cut-offs**, **settlement**, **redemption restrictions**, or **liquidity risk** narrative.

---

## 6. Distribution and tax (where relevant)

What matters to users who care about income or tax.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Distribution policy** | Accumulation vs distribution; frequency (monthly/quarterly/yearly). | “Do I get income or is it all reinvested?” |
| **Dividend / distribution yield** | Historic or forward yield. | “How much income might I get?” |
| **Tax treatment** | Whether distributions are taxable; capital gains; any withholding. | “What’s the tax impact?” (jurisdiction-dependent.) |

**Gap vs our current data:** We have distribution yield where the API provides it. We lack: **distribution policy** (acc vs dist, frequency), and **tax** (usually jurisdiction-specific; may be generic guidance only).

---

## 7. ESG / sustainable / Shariah

What’s expected for “sustainable” or “Shariah” products.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Definition** | What “ESG” or “Shariah” **means for this fund** (screens, themes, integration). | Avoids greenwashing / confusion. |
| **Strategy** | How ESG/Shariah is applied (exclusions, weightings, engagement). | “How is this different from a normal fund?” |
| **Evidence** | How the approach is **substantiated** (data, methodology). | Trust and clarity. |
| **Shariah** | **Compliance** and **board/supervisor**; any income purification. | “Is it really Shariah-compliant and how?” |

**Gap vs our current data:** We have a Shariah flag. We lack: **definition**, **strategy**, **evidence**, and **Shariah governance** detail.

---

## 8. Comparison and context

What comparison tools and platforms usually offer.

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Benchmark** | Stated **benchmark index** and **performance vs benchmark** (e.g. 1Y, 3Y, 5Y). | “Did it beat or lag the market?” |
| **Peer group** | **Category** (e.g. Global Equity) and **percentile** or rank vs peers. | “How does it compare to similar funds?” |
| **Side-by-side** | Compare **multiple funds** on fees, performance, risk, size, minimums. | Choice and trade-offs. |
| **Cost scenarios** | “If you invest €X for Y years, total cost is Z.” | Real-world cost feel. |

**Gap vs our current data:** We have benchmark where the API sends it; we have compare-by-share-class. We lack: **performance vs benchmark**, **peer category/percentile**, and **cost scenarios**.

---

## 9. Complaints, contact, and “where to go next”

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Complaints** | How to **complain** (distributor / manufacturer / ombudsman). | Redress. |
| **Contact** | **Manufacturer** and **distributor**; website; document library. | “Who do I ask?” |
| **More documents** | Link to **KID**, **prospectus**, **annual report**, **factsheet**. | Deeper due diligence. |

**Gap vs our current data:** We do not show **complaints**, **contact**, or **links to official documents**.

---

## 10. Investor education (in-context)

| Area | Typical content | Why it helps users |
|------|------------------|---------------------|
| **Glossary** | **Definitions** for TER, NAV, volatility, etc. (we have this). | Understand terms. |
| **“Why it matters”** | Short **interpretations** next to each metric (we added this). | Meaning, not just number. |
| **Warnings** | **“Past performance is not indicative of future results”**; **“You may get back less than you invest”**. | Legal and behavioural. |
| **Suitability** | “This may not be suitable if…” (e.g. short horizon, need for income). | Self-check. |

**Gap vs our current data:** We have glossary and interpretations. We could add: **standard risk warnings** and **suitability** prompts.

---

## Summary: what else would help users understand the fund?

**High impact (regulatory + industry norm):**

1. **Investment objectives and strategy** – “What is this fund for and how does it work?”
2. **Target investor / investment horizon** – “Is this for me and my timeline?”
3. **Principal risks** – Plain-language list of main risks (market, credit, liquidity, etc.).
4. **All-in cost and cost scenarios** – One number + “If you invest X for Y years, you pay Z.”
5. **Performance vs benchmark (and ideally peer)** – “Did it beat the index / category?”
6. **Complaints and contact** – Who to call and where to get full documents.

**Medium impact (research / platform norm):**

7. **Process / parent** – Short description of how the fund is run and who runs it.
8. **Top holdings + sector/region** – What’s in the portfolio and how concentrated.
9. **Dealing and liquidity** – When can I deal, when do I get my money, any locks?
10. **Distribution policy** – Acc vs dist; frequency of distributions.
11. **ESG/Shariah** – What it means for this fund and how it’s applied.

**Context and safety:**

12. **Standard disclaimers** – Past performance, capital at risk.
13. **Suitability prompts** – “Consider whether this fits your goals and horizon.”

None of the above is implemented here; this doc is for **product and backend brainstorming** so you can prioritise what to add to the API and UX next.
