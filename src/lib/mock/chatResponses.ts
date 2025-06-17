interface ChatResponse {
  content: string;
  followUps: string[];
}

interface ProfileBasedResponses {
  [key: string]: {
    [key: string]: ChatResponse;
  };
}

// Topic-based fallback responses
export const topicFallbackResponses: { [key: string]: ChatResponse } = {
  'stock-analysis': {
    content: `I can help you analyze stocks. Here are some specific areas we can explore:

1. Fundamental Analysis
   • Financial ratios (PE, PB, ROE)
   • Growth metrics
   • Profitability analysis
   • Balance sheet strength

2. Technical Analysis
   • Price trends
   • Volume analysis
   • Support/resistance levels
   • Technical indicators

3. Company Analysis
   • Business model
   • Competitive advantages
   • Management quality
   • Industry position

What specific aspect of stock analysis interests you?`,
    followUps: [
      "Show me how to analyze financial ratios",
      "Explain technical analysis basics",
      "How to evaluate company fundamentals",
      "What metrics should I focus on?"
    ]
  },
  'market-research': {
    content: `I can help you understand market trends and conditions. Here are key areas we can explore:

1. Market Analysis
   • Sector performance
   • Market breadth
   • Volatility indicators
   • Market sentiment

2. Economic Indicators
   • Interest rates
   • Inflation data
   • Economic growth
   • Employment trends

3. Sector Analysis
   • Industry trends
   • Competitive landscape
   • Growth opportunities
   • Risk factors

What aspect of market research would you like to explore?`,
    followUps: [
      "Show me current market trends",
      "Analyze sector performance",
      "Explain market indicators",
      "What sectors are growing?"
    ]
  },
  'income-investing': {
    content: `I can help you find income-generating investments. Here are the main areas we can explore:

1. Dividend Stocks
   • High-yield opportunities
   • Dividend growth
   • Payout sustainability
   • Sector distribution

2. Fixed Income
   • Corporate bonds
   • Government securities
   • Municipal bonds
   • Bond ETFs

3. Alternative Income
   • REITs
   • Preferred stocks
   • Master Limited Partnerships
   • Income-focused ETFs

What type of income investment interests you?`,
    followUps: [
      "Find high-dividend stocks",
      "Show me bond opportunities",
      "Explain REIT investing",
      "Compare income strategies"
    ]
  }
};

// Contextual follow-up responses
export const contextualFollowUps: { [key: string]: string[] } = {
  'stocks': [
    "Show me growth stocks",
    "Find undervalued opportunities",
    "Compare stock metrics",
    "Analyze company fundamentals"
  ],
  'bonds': [
    "Find corporate bonds",
    "Show government securities",
    "Compare bond yields",
    "Explain bond ratings"
  ],
  'market': [
    "Show market trends",
    "Analyze sector performance",
    "Compare market indicators",
    "Find growth opportunities"
  ],
  'education': [
    "Explain key metrics",
    "Show investment strategies",
    "Compare different approaches",
    "Learn about risk management"
  ]
};

// Keep existing mock responses
export const mockChatResponses: ProfileBasedResponses = {
  // Conservative Profile
  CONSERVATIVE: {
    "Help me find undervalued stocks": {
      content: `I'll help you find undervalued stocks that match your conservative profile. Let's look at some key metrics:

1. Johnson & Johnson (JNJ)
   - Current Price: $155.20
   - PE Ratio: 15.2 (Industry Avg: 22.5)
   - Dividend Yield: 2.8%
   - Free Cash Flow: $18.5B
   - Debt-to-Equity: 0.35
   - 5-year Beta: 0.65

   Why it's undervalued:
   • Trading below industry PE ratio
   • Strong balance sheet with AAA credit rating
   • Consistent dividend growth for 60+ years
   • Diversified business model across healthcare

2. Procter & Gamble (PG)
   - Current Price: $145.80
   - PE Ratio: 24.8 (Industry Avg: 28.3)
   - Dividend Yield: 2.5%
   - Free Cash Flow: $15.2B
   - Debt-to-Equity: 0.45
   - 5-year Beta: 0.45

   Why it's undervalued:
   • Premium brands with pricing power
   • Strong international presence
   • High return on invested capital (ROIC)
   • Consistent earnings growth

Would you like to:
- See a detailed financial analysis of either stock?
- Compare their historical performance?
- Learn about their competitive advantages?
- Find more undervalued stocks in other sectors?`,
      followUps: [
        "Show me JNJ's financial analysis",
        "Compare their historical performance",
        "Explain their competitive advantages",
        "Find more undervalued stocks"
      ]
    },
    "Show me stocks with strong fundamentals": {
      content: `Based on your conservative profile, here are stocks with exceptional fundamentals:

1. Microsoft (MSFT)
   Financial Health:
   • Revenue Growth: 15% YoY
   • Operating Margin: 42%
   • Free Cash Flow: $65B
   • Return on Equity: 35%
   • Net Cash Position: $80B

   Business Strengths:
   • Cloud leadership (Azure)
   • Strong enterprise software
   • Recurring revenue model
   • High customer retention

2. Visa (V)
   Financial Health:
   • Revenue Growth: 12% YoY
   • Operating Margin: 65%
   • Free Cash Flow: $18B
   • Return on Equity: 40%
   • Net Cash Position: $15B

   Business Strengths:
   • Global payment network
   • High barriers to entry
   • Strong pricing power
   • Low capital requirements

Would you like to:
- See their detailed financial metrics?
- Compare their growth rates?
- Learn about their business models?
- Find more fundamentally strong stocks?`,
      followUps: [
        "Show me their financial metrics",
        "Compare their growth rates",
        "Explain their business models",
        "Find more strong stocks"
      ]
    }
  },

  // Moderate Profile
  MODERATE: {
    "Find me growth stocks with strong fundamentals": {
      content: `Based on your moderate risk profile, here are some growth stocks with solid fundamentals:

1. Microsoft (MSFT)
   - Revenue Growth: 15% YoY
   - Operating Margin: 42%
   - Free Cash Flow: $65B
   - R&D Investment: $25B

2. Adobe (ADBE)
   - Revenue Growth: 12% YoY
   - Operating Margin: 35%
   - Free Cash Flow: $7.5B
   - Recurring Revenue: 85%

3. Salesforce (CRM)
   - Revenue Growth: 11% YoY
   - Operating Margin: 20%
   - Free Cash Flow: $6.2B
   - Customer Retention: 95%

Would you like to:
- See their technical analysis?
- Compare their growth metrics?
- Analyze their competitive position?`,
      followUps: [
        "Show me their technical indicators",
        "Compare their growth metrics",
        "Analyze their market position",
        "Find more stocks with similar growth"
      ]
    },
    "Find me ETFs with low expense ratios": {
      content: `Here are some cost-effective ETFs that match your moderate risk profile:

1. Vanguard Total Stock Market ETF (VTI)
   - Expense Ratio: 0.03%
   - AUM: $1.2T
   - Holdings: 4,000+ stocks
   - 10-year Return: 12.5%

2. iShares Core S&P 500 ETF (IVV)
   - Expense Ratio: 0.03%
   - AUM: $400B
   - Holdings: 500 stocks
   - 10-year Return: 12.8%

3. Schwab US Broad Market ETF (SCHB)
   - Expense Ratio: 0.03%
   - AUM: $50B
   - Holdings: 2,500+ stocks
   - 10-year Return: 12.3%

Would you like to:
- Compare their sector allocations?
- See their historical performance?
- Analyze their tracking error?`,
      followUps: [
        "Show me their sector breakdown",
        "Compare their historical returns",
        "Analyze their tracking error",
        "Find more ETFs with similar characteristics"
      ]
    }
  },

  // Aggressive Profile
  AGGRESSIVE: {
    "Find me high-growth tech stocks": {
      content: `Based on your aggressive profile, here are some high-growth tech opportunities:

1. NVIDIA (NVDA)
   - Revenue Growth: 126% YoY
   - Gross Margin: 72%
   - R&D Investment: $8.5B
   - Market Position: AI/GPU Leader

2. Cloudflare (NET)
   - Revenue Growth: 32% YoY
   - Gross Margin: 78%
   - R&D Investment: $400M
   - Market Position: Cloud Security

3. Datadog (DDOG)
   - Revenue Growth: 25% YoY
   - Gross Margin: 80%
   - R&D Investment: $300M
   - Market Position: Cloud Monitoring

Would you like to:
- See their technical analysis?
- Compare their growth metrics?
- Analyze their competitive position?`,
      followUps: [
        "Show me their technical indicators",
        "Compare their growth metrics",
        "Analyze their market position",
        "Find more high-growth tech stocks"
      ]
    },
    "Find me emerging market opportunities": {
      content: `Here are some high-potential emerging market opportunities:

1. Taiwan Semiconductor (TSM)
   - Market Cap: $600B
   - Revenue Growth: 15% YoY
   - R&D Investment: $5B
   - Market Position: Semiconductor Leader

2. MercadoLibre (MELI)
   - Market Cap: $80B
   - Revenue Growth: 40% YoY
   - Gross Margin: 45%
   - Market Position: Latin American E-commerce

3. Sea Limited (SE)
   - Market Cap: $40B
   - Revenue Growth: 35% YoY
   - Gross Margin: 40%
   - Market Position: Southeast Asian Tech

Would you like to:
- See their technical analysis?
- Compare their growth metrics?
- Analyze their market risks?`,
      followUps: [
        "Show me their technical indicators",
        "Compare their growth metrics",
        "Analyze their market risks",
        "Find more emerging market opportunities"
      ]
    }
  }
};

// Keep existing educational responses
export const educationalResponses: { [key: string]: ChatResponse } = {
  "What is PE Ratio?": {
    content: `The Price-to-Earnings (PE) Ratio is a key valuation metric that helps determine if a stock is overvalued or undervalued.

How it works:
• PE Ratio = Stock Price / Earnings Per Share
• Lower PE = Potentially undervalued
• Higher PE = Potentially overvalued

Example:
• Stock Price: $100
• Earnings Per Share: $5
• PE Ratio = $100 / $5 = 20

What it means:
• PE of 20 means you're paying $20 for every $1 of earnings
• Compare to industry average to determine if it's high or low
• Consider company's growth rate when interpreting PE

Would you like to:
- Learn about other valuation metrics?
- See how PE ratio varies by industry?
- Understand how to use PE ratio in stock selection?`,
    followUps: [
      "Tell me about other metrics",
      "Show industry PE ratios",
      "How to use PE ratio"
    ]
  },
  "What is Dividend Yield?": {
    content: `Dividend Yield is a financial ratio that shows how much a company pays in dividends relative to its stock price.

How it works:
• Dividend Yield = Annual Dividends Per Share / Stock Price
• Expressed as a percentage
• Higher yield = More income per dollar invested

Example:
• Annual Dividend: $2 per share
• Stock Price: $50
• Dividend Yield = $2 / $50 = 4%

What it means:
• 4% yield means you earn $4 for every $100 invested
• Compare to industry average and interest rates
• Consider dividend growth rate and payout ratio

Would you like to:
- Learn about dividend growth?
- Understand payout ratios?
- See how to evaluate dividend sustainability?`,
    followUps: [
      "Tell me about dividend growth",
      "What is payout ratio?",
      "How to evaluate dividends"
    ]
  },
  "What is Free Cash Flow?": {
    content: `Free Cash Flow (FCF) is the cash a company generates after accounting for capital expenditures. It's a key measure of financial health.

How it works:
• FCF = Operating Cash Flow - Capital Expenditures
• Shows how much cash is available for:
  - Dividends
  - Share buybacks
  - Debt reduction
  - Acquisitions

Example:
• Operating Cash Flow: $100M
• Capital Expenditures: $30M
• Free Cash Flow = $100M - $30M = $70M

What it means:
• Higher FCF = More financial flexibility
• Positive FCF = Company can fund growth
• FCF Yield = FCF / Market Cap (like a dividend yield)

Would you like to:
- Learn about FCF yield?
- Understand how to use FCF in valuation?
- See how to compare FCF across companies?`,
    followUps: [
      "Tell me about FCF yield",
      "How to use FCF in valuation",
      "How to compare FCF"
    ]
  }
};

// Keep existing action-based responses
export const actionBasedResponses = {
  "Find me stocks with high dividend yield": {
    content: `Here are stocks with dividend yields above 4%:

1. AT&T (T)
   - Dividend Yield: 6.8%
   - Payout Ratio: 65%
   - 5-year Dividend Growth: 2%
   - Credit Rating: BBB

2. Verizon (VZ)
   - Dividend Yield: 6.5%
   - Payout Ratio: 60%
   - 5-year Dividend Growth: 2%
   - Credit Rating: BBB+

3. Altria (MO)
   - Dividend Yield: 8.2%
   - Payout Ratio: 75%
   - 5-year Dividend Growth: 4%
   - Credit Rating: BBB

Would you like to:
- See their dividend history?
- Compare their payout ratios?
- Analyze their dividend sustainability?`,
    followUps: [
      "Show me their dividend history",
      "Compare their payout ratios",
      "Analyze their dividend sustainability",
      "Find more high-yield stocks"
    ]
  },
  "Find me stocks with strong buy ratings": {
    content: `Here are stocks with strong buy ratings from analysts:

1. Amazon (AMZN)
   - Buy Ratings: 45
   - Hold Ratings: 5
   - Sell Ratings: 0
   - Average Price Target: $200 (20% upside)

2. Meta (META)
   - Buy Ratings: 40
   - Hold Ratings: 8
   - Sell Ratings: 2
   - Average Price Target: $400 (15% upside)

3. Alphabet (GOOGL)
   - Buy Ratings: 42
   - Hold Ratings: 6
   - Sell Ratings: 2
   - Average Price Target: $160 (18% upside)

Would you like to:
- See their recent analyst reports?
- Compare their price targets?
- Analyze their consensus ratings?`,
    followUps: [
      "Show me their analyst reports",
      "Compare their price targets",
      "Analyze their consensus ratings",
      "Find more strongly rated stocks"
    ]
  }
}; 