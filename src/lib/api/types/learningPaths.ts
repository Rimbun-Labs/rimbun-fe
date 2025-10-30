export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningPathSection {
    title: string;
    content: string;
    difficulty: Difficulty;
    relatedMetrics?: string[];
    practicalExample?: string;
  }
  
  export interface LearningPathContent {
    title: string;
    description: string;
    sections: LearningPathSection[];
    keyMetrics: string[];
  }
  
  export interface LearningPaths {
    [key: string]: LearningPathContent;
  }
  
  export const learningPathsContent: LearningPaths = {
    equities: {
      title: "Equities",
      description: "Discover how equities can grow your money over time and why they're a key part of many investment plans.",
      keyMetrics: ['historicalReturn', 'volatility', 'beta', 'peRatio', 'dividendYield', 'expenseRatio'],
      sections: [
        {
          title: "What are Equities?",
          content: "Equities are shares of ownership in a company, like stocks you can buy on the stock market. When you buy a stock, you own a small piece of that company and can benefit if it grows. For example, if you buy Apple stock, you're an Apple shareholder! Equities can grow your money over time through historical returns, which measure past performance (e.g., Apple's stock grew 233% from 2000–2005). However, they can also be risky because prices change daily. This section introduces you to the basics of stocks and ETFs (Exchange-Traded Funds), which bundle many stocks together for easier investing. You'll learn how equities can fit into your investment goals.",
          difficulty: "Beginner",
          relatedMetrics: ["historicalReturn"]
        },
        {
          title: "Understanding Volatility",
          content: "Equities can be exciting, but their prices move up and down—sometimes a lot! This movement is called volatility, and it measures how much a stock's price swings. A stock with high volatility (e.g., 30%) might drop or gain 30% in a year, which can feel risky. A low volatility stock (e.g., 15%) is steadier, better for cautious investors. Another metric, beta, shows how a stock moves compared to the market (e.g., a beta of 1.0 means it moves with the market). In this section, you'll learn how to check these metrics and decide if a stock's ups and downs match your comfort level.",
          difficulty: "Beginner",
          relatedMetrics: ["volatility", "beta"]
        },
        {
          title: "Key Metrics for Stocks",
          content: "Picking stocks means looking at numbers that tell you about a company's value and growth. One key metric is the P/E ratio (Price-to-Earnings Ratio), which shows how much you're paying for each dollar of the company's earnings. A lower P/E ratio (e.g., 15) might mean a stock is undervalued, while a higher one (e.g., 30) might mean it's pricey but growing fast, like tech stocks. Another metric, dividend yield, tells you how much a company pays in dividends per share (e.g., 2% means $2 per $100 invested). This section teaches you how to use these metrics to compare stocks and find ones that fit your goals, whether you want growth or steady income.",
          difficulty: "Intermediate",
          relatedMetrics: ["peRatio", "dividendYield"]
        },
        {
          title: "Diversifying with ETFs",
          content: "Buying individual stocks can be risky, but ETFs (Exchange-Traded Funds) let you invest in many stocks at once, spreading out your risk. For example, an S&P 500 ETF holds shares in 500 big companies, so you're not betting on just one! ETFs have an expense ratio, a small fee you pay yearly (e.g., 0.1% means $1 per $1,000 invested), which you'll want to keep low. They also cover different sectors, like tech or healthcare, so you can choose what fits your interests. This section explains how ETFs work, how to pick ones with a low expense ratio, and why diversification lowers risk.",
          difficulty: "Intermediate",
          relatedMetrics: ["expenseRatio"]
        },
        {
          title: "Growth vs. Value Investing",
          content: "There are two main styles of stock investing: growth and value. Growth stocks, like many tech companies, focus on fast earnings increases, often with high P/E ratio values (e.g., 40) because investors expect big future gains. Value stocks are undervalued gems, with lower P/E ratio values (e.g., 10), offering steady returns through dividends or price increases. Both have risks: growth stocks can crash if they don't meet expectations, while value stocks might stay undervalued. This section helps you decide which style suits your goals and risk tolerance, using metrics like growth rate for growth stocks and dividend yield for value stocks. It's a step toward building a strategy that matches your investor profile.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "dividendYield", "growthRate"]
        },
        {
          title: "Market Timing Risks",
          content: "Some investors try to 'time' the market—buying low and selling high—but this is tricky! Markets go through cycles (bull markets for rising prices, bear markets for falling ones), and guessing the right moment is hard. The timing risk means you might miss out on gains if you wait too long or sell too early. For example, if you sold during a 2008 dip, you'd miss the 2009 recovery. This section explores why long-term investing often beats timing, using historical data to show how market cycles work. You'll learn to focus on your goals, not short-term price changes, and avoid common mistakes.",
          difficulty: "Advanced",
          relatedMetrics: ["timingRisk"]
        }
      ]
    },
    bonds: {
      title: "Bonds",
      description: "Learn how bonds can bring steady income to your portfolio and help balance risk with other investments.",
      keyMetrics: ['couponRate', 'ytm', 'creditRating', 'duration', 'defaultRisk'],
      sections: [
        {
          title: "What are Bonds?",
          content: "Bonds are like loans you give to companies or governments. In return, they pay you interest over time, called the coupon rate (e.g., 3% means $30 yearly per $1,000 invested), and return your money at the end, called maturity. The yield to maturity (YTM) shows your total return if you hold the bond until it matures, combining interest and price changes. Bonds are generally safer than stocks, making them great for steady income and preserving your money. This section covers the basics of how bonds work, why they're a safe choice, and how to understand yield to maturity to pick the right ones. It's perfect for beginners looking for stability in their investments.",
          difficulty: "Beginner",
          relatedMetrics: ["couponRate", "ytm"]
        },
        {
          title: "Safety and Income",
          content: "Bonds are often chosen for their safety, but not all bonds are equal! The credit rating tells you how likely the issuer is to pay you back—AAA is the safest (like U.S. Treasury bonds), while lower ratings (e.g., BB) are riskier but pay higher interest. Treasury bonds are backed by the government, making them super safe, with a coupon rate like 2%. This section explains how to pick bonds based on credit rating to match your risk comfort, and why bonds provide steady income through interest payments. It's a great starting point for cautious investors.",
          difficulty: "Beginner",
          relatedMetrics: ["creditRating", "couponRate"]
        },
        {
          title: "Interest Rate Risks",
          content: "Bonds are safe, but they're not risk-free! When interest rates rise, bond prices fall, and the duration metric shows how much. A bond with a duration of 5 will drop 5% in price if rates rise 1%. For example, in 2022, rates rose, and many bonds lost value temporarily. This section teaches you how duration and convexity (a measure of price sensitivity) help you understand this risk, so you can pick bonds that won't swing too much if rates change. It's a key skill for planning your investments, especially if you're worried about price drops.",
          difficulty: "Intermediate",
          relatedMetrics: ["duration", "convexity"]
        },
        {
          title: "Corporate vs. Government Bonds",
          content: "Bonds come in two main types: government (like Treasuries) and corporate (issued by companies). Government bonds are safer, with high credit ratings (e.g., AAA), but offer lower yields (e.g., 2% YTM). Corporate bonds can pay more (e.g., 4% YTM), but carry default risk—the chance the company can't pay you back, especially if their credit rating is lower (e.g., BBB). This section compares the two, helping you decide which fits your risk level and income goals. You'll learn how to balance safety and returns, a crucial step for building a bond portfolio.",
          difficulty: "Intermediate",
          relatedMetrics: ["creditRating", "ytm", "defaultRisk"]
        },
        {
          title: "Bond Laddering Strategy",
          content: "A bond ladder is a smart way to manage your bond investments. You buy bonds with different maturities (e.g., 1, 3, 5 years), creating a maturity ladder. When one bond matures, you reinvest the money, keeping your income steady and reducing interest rate risk. For example, if rates rise, only part of your money is affected, not all of it. This section teaches you how to build a bond ladder, using metrics like duration to pick bonds and plan your cash flow. It's an advanced strategy that ensures you're prepared for changing rates while earning consistent interest.",
          difficulty: "Advanced",
          relatedMetrics: ["duration", "maturityLadder"]
        }
      ]
    },
    realestate: {
      title: "Real Estate",
      description: "Find out how real estate can make you money through rent and growth in property value over time.",
      keyMetrics: ['appreciation', 'capRate', 'rentalIncome', 'loanToValue', 'debtService'],
      sections: [
        {
          title: "Real Estate Basics",
          content: "Real estate investing means buying property to earn money, either through rent or price growth. When a property's value rises over time, that's called appreciation—for example, a house bought for $200,000 in 2010 might be worth $300,000 by 2020, a 50% increase! You can also earn rental income by leasing it out, like $1,000 a month. Real estate can be a great way to grow your money, but it's less liquid than stocks—you can't sell it as quickly. This section covers the basics of real estate, how appreciation and rental income work, and why it's a popular investment. It's perfect for beginners curious about property.",
          difficulty: "Beginner",
          relatedMetrics: ["appreciation", "rentalIncome"]
        },
        {
          title: "Understanding Cap Rates",
          content: "A key metric in real estate is the cap rate (capitalization rate), which shows your yearly return from a property, not counting price changes. It's calculated as annual rental income divided by the property's price. For example, a $200,000 property earning $12,000 a year in rent has a cap rate of 6% ($12,000 / $200,000). A higher cap rate means better returns, but often more risk (e.g., a less desirable area). This section explains how to use cap rate to compare properties and decide if a real estate investment is worth it for your goals.",
          difficulty: "Beginner",
          relatedMetrics: ["capRate", "rentalIncome"]
        },
        {
          title: "REITs for Beginners",
          content: "Don't want to buy a whole property? REITs (Real Estate Investment Trusts) let you invest in real estate without owning it directly. They're like ETFs for property—you buy shares in a company that owns buildings, and they pay you a dividend yield (e.g., 4% means $4 per $100 invested). REITs are more liquid than physical property, with liquidity meaning you can sell shares easily on the stock market. This section introduces REITs, how they work, and why they're a great way to start in real estate. You'll learn to check dividend yield and liquidity to pick REITs that fit your needs.",
          difficulty: "Intermediate",
          relatedMetrics: ["dividendYield", "liquidity"]
        },
        {
          title: "Market Cycles in Real Estate",
          content: "Real estate prices don't always go up—they follow cycles, just like stocks. The housing index (e.g., FHFA HPI) tracks price changes over time; for example, prices fell 20% during the 2008 crisis but rose 50% from 2012–2020. These economic cycles are influenced by interest rates, jobs, and demand. This section teaches you how to understand these cycles and their impact on real estate investments. You'll learn why timing matters and how to spot opportunities (e.g., buying in a dip) or risks (e.g., overpaying in a boom). It's a step toward smarter property investing.",
          difficulty: "Intermediate",
          relatedMetrics: ["housingIndex", "economicCycles"]
        },
        {
          title: "Leverage in Real Estate",
          content: "Many real estate investors use loans to buy properties, a strategy called leverage. The loan-to-value ratio (LTV) shows how much you're borrowing—e.g., borrowing $150,000 for a $200,000 property is a 75% LTV. Leverage can boost returns (if the property grows in value), but it also adds risk: you'll owe debt service (monthly loan payments), which can strain your budget if rent doesn't cover it. This section explains how leverage works, how to calculate loan-to-value, and why debt service matters for cash flow. It's an advanced topic for those ready to take on bigger real estate investments.",
          difficulty: "Advanced",
          relatedMetrics: ["loanToValue", "debtService"]
        }
      ]
    },
    cash: {
      title: "Cash",
      description: "See how cash keeps your money safe and ready to use, while understanding its role in your investment plan.",
      keyMetrics: ['interestRate', 'inflationRisk', 'liquidity', 'opportunityCost'],
      sections: [
        {
          title: "Liquidity and Safety",
          content: "Cash investments, like savings accounts, are the safest way to keep your money. They offer high liquidity, meaning you can access your funds anytime, and they earn a small amount of interest, called the interest rate (e.g., 1% means $10 per year on $1,000). Cash is perfect for emergencies or short-term goals because there's almost no risk of losing money. However, the returns are low compared to stocks or bonds, so it's not great for long-term growth. This section covers why cash is a safe choice, how interest rate works, and when to use it in your plan. It's a great starting point for cautious investors looking for stability.",
          difficulty: "Beginner",
          relatedMetrics: ["liquidity", "interestRate"]
        },
        {
          title: "Inflation Risks",
          content: "While cash is safe, it has a hidden risk: inflation. The inflation risk happens when prices rise faster than your interest rate. For example, if your savings account earns 1% but inflation is 3%, your money loses 2% in buying power each year—$1,000 feels like $980 after a year. This section explains how inflation erodes your savings over time and why keeping too much in cash can hurt your long-term goals. You'll learn to watch inflation risk and decide when to move money into other investments, like bonds, for better returns.",
          difficulty: "Beginner",
          relatedMetrics: ["inflationRisk", "interestRate"]
        },
        {
          title: "High-Yield Savings Options",
          content: "Not all cash investments are the same! Beyond regular savings accounts, you can use high-yield savings accounts or money market funds, which often pay higher interest rates (e.g., 2% instead of 0.5%). Certificates of Deposit (CDs) lock your money for a set time (e.g., 1 year) but offer better CD rates, like 3%. These options still keep your money safe and liquid, but they help you earn more. This section explores these alternatives, teaching you how to compare interest rates and CD rates to get the most from your cash. It's a step toward making your savings work harder.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate", "cdRates"]
        },
        {
          title: "Opportunity Costs of Cash",
          content: "Holding too much cash can cost you more than you think! The opportunity cost is what you miss out on by not investing elsewhere—like earning 5% in bonds or 8% in stocks instead of 1% in cash. For example, $10,000 in cash at 1% grows to $10,100 in a year, but in stocks at 8%, it could've been $10,800—a $700 difference! This section explains how opportunity cost affects your long-term goals and why balancing cash with other investments can grow your money faster. It's an advanced concept for users ready to think beyond safety.",
          difficulty: "Advanced",
          relatedMetrics: ["opportunityCost", "interestRate"]
        }
      ]
    },
    islamicfinance: {
      title: "Islamic Finance",
      description: "Learn about Sharia-compliant investment principles and ethical finance practices.",
      keyMetrics: ['shariaCompliance', 'profitSharing', 'debtRatio', 'interestFree', 'ethicalScreening'],
      sections: [
        {
          title: "Introduction to Islamic Finance",
          content: "Islamic finance follows Sharia (Islamic law) principles that prohibit interest (riba) and promote ethical investing. Instead of traditional interest-based loans, Islamic finance uses profit-sharing arrangements where both parties share in profits and losses. This creates a more equitable system where risk is shared fairly. Islamic finance also avoids investments in prohibited industries like alcohol, gambling, or weapons. This section introduces the core principles of Islamic finance and how they differ from conventional banking.",
          difficulty: "Beginner",
          relatedMetrics: ["profitSharing", "shariaCompliance"]
        },
        {
          title: "Sharia-Compliant Investment Vehicles",
          content: "Islamic investments use unique structures like Mudarabah (profit-sharing), Musharakah (partnership), and Sukuk (Islamic bonds). Mudarabah allows one party to provide capital while the other provides expertise, sharing profits according to agreed ratios. Musharakah creates true partnerships where all parties contribute capital and share both profits and losses. Sukuk are asset-backed securities that comply with Sharia law. These structures ensure Sharia compliance while providing investment opportunities that align with Islamic values.",
          difficulty: "Beginner",
          relatedMetrics: ["shariaCompliance", "profitSharing"]
        },
        {
          title: "Screening and Compliance",
          content: "Islamic investment screening involves checking companies for Sharia compliance through ethical screening processes. This includes avoiding companies with high debt ratios (typically over 33%), those involved in prohibited activities, or those earning significant interest income. Islamic funds use specialized screening committees to ensure investments meet Sharia standards. This section explains how to evaluate investments for Islamic compliance and understand the screening criteria used by Islamic financial institutions.",
          difficulty: "Intermediate",
          relatedMetrics: ["ethicalScreening", "debtRatio", "shariaCompliance"]
        },
        {
          title: "Islamic Banking Products",
          content: "Islamic banking offers alternatives to conventional products. Instead of savings accounts earning interest, Islamic banks offer interest-free savings accounts that may share profits from halal investments. Home financing uses diminishing Musharakah where the bank and customer jointly own the property, with the customer gradually buying out the bank's share. Islamic credit cards avoid interest charges, instead charging fixed fees for services. This section covers the main Islamic banking products and how they work differently from conventional banking.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestFree", "profitSharing"]
        },
        {
          title: "Global Islamic Finance Markets",
          content: "The global Islamic finance market has grown significantly, with Malaysia, Saudi Arabia, and the UAE leading in Islamic banking assets. Islamic finance principles are increasingly adopted by conventional institutions seeking ethical investment options. The market includes Islamic mutual funds, ETFs, and even Islamic fintech solutions. Understanding Sharia compliance requirements across different jurisdictions helps investors navigate this growing market. This section explores the global landscape of Islamic finance and emerging opportunities.",
          difficulty: "Advanced",
          relatedMetrics: ["shariaCompliance", "ethicalScreening"]
        },
        {
          title: "Risk Management in Islamic Finance",
          content: "Islamic finance faces unique risks including Sharia compliance risk, where investments may become non-compliant due to business changes. Operational risk is higher due to complex profit-sharing structures requiring careful monitoring. Liquidity risk can be challenging since Islamic banks cannot access conventional interbank lending. However, Islamic finance promotes more stable, asset-backed investments that can reduce overall portfolio risk. This section covers risk management strategies specific to Islamic finance investments.",
          difficulty: "Advanced",
          relatedMetrics: ["profitSharing", "shariaCompliance", "debtRatio"]
        }
      ]
    },
    esginvesting: {
      title: "ESG Investing",
      description: "Explore Environmental, Social, and Governance investing principles for sustainable returns.",
      keyMetrics: ['carbonFootprint', 'esgScore', 'sustainabilityRating', 'socialImpact', 'governanceScore'],
      sections: [
        {
          title: "Understanding ESG Investing",
          content: "ESG (Environmental, Social, Governance) investing considers how companies impact the world beyond just financial returns. Environmental factors include carbon footprint, energy efficiency, and waste management. Social factors cover labor practices, community relations, and product safety. Governance examines board diversity, executive compensation, and transparency. Companies with strong ESG practices often show better long-term performance and lower risk. This section introduces ESG investing and why it matters for both returns and impact.",
          difficulty: "Beginner",
          relatedMetrics: ["esgScore", "carbonFootprint"]
        },
        {
          title: "Environmental Factors",
          content: "Environmental criteria focus on how companies manage their impact on the planet. Key metrics include carbon footprint (greenhouse gas emissions), water usage, renewable energy adoption, and waste reduction. Companies with low carbon footprint and strong environmental policies often have competitive advantages as regulations tighten. Environmental investing also includes clean energy, sustainable agriculture, and green technology sectors. This section explains how to evaluate companies' environmental performance and identify sustainable investment opportunities.",
          difficulty: "Beginner",
          relatedMetrics: ["carbonFootprint", "sustainabilityRating"]
        },
        {
          title: "Social Impact Investing",
          content: "Social factors examine how companies treat people - employees, customers, and communities. This includes fair labor practices, workplace diversity, product safety, and community engagement. Social impact investing goes further by actively seeking investments that create positive social change, such as affordable housing, education technology, or healthcare access. Companies with strong social practices often have better employee retention, customer loyalty, and brand reputation. This section covers social investing strategies and how to measure social impact.",
          difficulty: "Intermediate",
          relatedMetrics: ["socialImpact", "esgScore"]
        },
        {
          title: "Governance and Corporate Ethics",
          content: "Governance examines how companies are managed and controlled. Key factors include board independence, executive compensation alignment, shareholder rights, and transparency. Strong governance scores indicate companies with ethical leadership, clear policies, and accountability mechanisms. Poor governance can lead to scandals, regulatory issues, and financial losses. This section explains how to assess corporate governance and why it's crucial for long-term investment success.",
          difficulty: "Intermediate",
          relatedMetrics: ["governanceScore", "esgScore"]
        },
        {
          title: "ESG Rating Systems",
          content: "ESG ratings help investors compare companies' sustainability performance. Major rating agencies use different methodologies, so understanding their approaches is important. Sustainability rating systems typically score companies on environmental, social, and governance factors, often using letter grades or numerical scores. Some focus on risk management while others emphasize positive impact. This section explains how to interpret ESG ratings and use them in investment decisions.",
          difficulty: "Intermediate",
          relatedMetrics: ["sustainabilityRating", "esgScore"]
        },
        {
          title: "ESG Investment Strategies",
          content: "ESG investing strategies range from exclusion (avoiding harmful industries) to inclusion (actively seeking sustainable companies). Impact investing targets specific social or environmental outcomes while seeking financial returns. ESG integration incorporates sustainability factors into traditional financial analysis. Thematic investing focuses on specific ESG themes like clean energy or gender equality. This section explores different ESG investment approaches and how to build a sustainable portfolio.",
          difficulty: "Advanced",
          relatedMetrics: ["esgScore", "socialImpact", "sustainabilityRating"]
        },
        {
          title: "Measuring ESG Performance",
          content: "Measuring ESG performance requires both quantitative metrics and qualitative assessment. Carbon footprint reduction, social impact metrics, and governance score improvements can be tracked over time. However, ESG impact often takes years to materialize, requiring patient capital and long-term thinking. Investors should look for companies with clear ESG targets, regular reporting, and third-party verification. This section covers how to measure and track ESG performance in your investment portfolio.",
          difficulty: "Advanced",
          relatedMetrics: ["carbonFootprint", "socialImpact", "governanceScore", "sustainabilityRating"]
        }
      ]
    },
    'risk-management': {
      title: "Risk Management",
      description: "Understand risk assessment and portfolio protection strategies for better investment outcomes.",
      keyMetrics: ['volatility', 'beta', 'maxDrawdown', 'sharpeRatio', 'var'],
      sections: [
        {
          title: "Introduction to Investment Risk",
          difficulty: "Beginner",
          relatedMetrics: ["volatility"],
          content: "Investment risk is the possibility of losing money or not achieving expected returns. Every investment carries some degree of risk - the key is understanding and managing it appropriately. For example, a stock with high volatility of 30% can swing 30% up or down in a single year, creating significant potential for both gains and losses. Understanding risk helps you make informed decisions and protects your portfolio from significant downturns. Risk and return go hand-in-hand: generally, higher potential returns come with higher risk. This section introduces the fundamental concepts of investment risk and why it's essential to understand before investing."
        },
        {
          title: "Types of Investment Risk",
          difficulty: "Beginner",
          relatedMetrics: ["inflationRisk", "defaultRisk"],
          content: "Different types of risk affect investments in various ways. Market risk refers to overall market movements that affect all stocks - for example, during the 2008 financial crisis, the S&P 500 dropped 37%, impacting nearly every stock regardless of individual company quality. Credit risk involves the chance that a borrower defaults - corporate bonds with BBB ratings carry higher credit risk than AAA-rated bonds, but pay higher interest to compensate. Liquidity risk means you might not be able to sell an asset quickly - a house is less liquid than a stock, which you can sell instantly. Inflation risk erodes purchasing power - if inflation is 3% and your investment returns 1%, you're losing 2% in real value. Concentration risk occurs when too much capital is in one investment, sector, or geographic region. This section explains these risk types with practical examples to help you identify and assess risks in your own portfolio."
        },
        {
          title: "Risk Measurement Tools",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "beta", "sharpeRatio", "maxDrawdown"],
          content: "Understanding risk requires measuring it using specific tools and metrics. Volatility measures how much an asset's price fluctuates - a stock with 15% volatility is steadier than one with 30% volatility. Beta shows how a stock moves relative to the market - a beta of 1.5 means the stock typically moves 50% more than the overall market. If the market drops 10%, a stock with beta 1.5 usually falls about 15%. The Sharpe ratio measures risk-adjusted returns - a ratio above 1.0 indicates you're being well compensated for risk, while below 0.5 suggests poor risk-adjusted performance. Maximum drawdown reveals the largest peak-to-trough decline an asset has experienced, showing your potential worst-case scenario. Value at Risk (VaR) estimates potential losses over a specific time period - for example, a 5% VaR at $10,000 means there's a 5% chance of losing more than $10,000 in a given time frame. This section explains these metrics in practical terms and how to use them to assess portfolio risk."
        },
        {
          title: "Diversification Strategies",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "beta"],
          content: "Diversification is the most powerful risk management tool available to individual investors. By spreading investments across different asset classes, sectors, geographic regions, and investment styles, you reduce portfolio volatility without sacrificing too much return potential. For example, a portfolio of 100% stocks might have 20% volatility, but adding 30% bonds reduces volatility to approximately 12% while maintaining 70% of the expected returns. Correlation is key - investing in two tech stocks isn't true diversification since they move together. Better diversification mixes stocks and bonds, which historically have low correlation. Geographic diversification across developed and emerging markets provides exposure to different economic cycles. Sector diversification ensures you're not overexposed to one industry. Studies show that adding just 10% bonds to an all-stock portfolio can reduce volatility by 25% while only reducing returns by about 5%. This section teaches you practical diversification strategies and how to implement them in your portfolio."
        },
        {
          title: "Risk Management Techniques",
          difficulty: "Advanced",
          relatedMetrics: ["maxDrawdown", "sharpeRatio"],
          content: "Advanced risk management techniques help protect your portfolio during downturns. Hedging uses derivatives like options to offset potential losses - for example, buying put options can protect against a 10% decline in your stock holdings, though it costs roughly 2-3% of portfolio value annually. Position sizing limits exposure to any single investment - a common rule is never putting more than 5% of your portfolio in one stock, which limits damage if that stock crashes 50%. Stop-loss orders automatically sell if prices drop below a threshold - setting a 10% stop-loss means you'll sell before losses exceed that level, though it can trigger during temporary dips. Dynamic asset allocation adjusts your stock/bond mix based on market conditions - reducing stock exposure when markets are expensive and increasing it when markets are cheap. Dollar-cost averaging reduces timing risk by investing fixed amounts regularly regardless of prices. This section explores these techniques and how to implement them based on your risk tolerance and investment goals."
        },
        {
          title: "Building Your Risk Management Plan",
          difficulty: "Advanced",
          relatedMetrics: ["sharpeRatio", "volatility", "maxDrawdown"],
          content: "A comprehensive risk management plan helps you navigate markets successfully. Start by assessing your risk capacity - someone with 30 years to retirement can handle more volatility than someone retiring in 5 years. Your risk tolerance determines asset allocation - aggressive investors might choose 90% stocks, moderate investors 60-70%, while conservative investors might prefer 40% stocks with the rest in bonds and cash. Set appropriate position limits to prevent overexposure - professional investors rarely put more than 5% in any single stock. Establish rebalancing rules to maintain your target allocation - when stocks outperform and push your allocation from 70% to 80%, rebalance back. Monitor your Sharpe ratio to ensure you're getting adequate risk-adjusted returns - aim for at least 0.75, with 1.0 or higher being excellent. Prepare for maximum drawdown scenarios - if your portfolio has historically dropped 30%, ensure you can emotionally and financially handle that before investing. This section guides you through creating a personalized risk management framework that protects your investments while allowing for growth."
        }
      ]
    },
    'market-analysis': {
      title: "Market Analysis",
      description: "Learn fundamental and technical analysis techniques for better investment decisions.",
      keyMetrics: ['peRatio', 'pbRatio', 'debtToEquity', 'currentRatio', 'roe'],
      sections: [
        {
          title: "Introduction to Market Analysis",
          difficulty: "Beginner",
          relatedMetrics: ["peRatio"],
          content: "Market analysis helps you evaluate securities, sectors, and entire markets to make informed investment decisions rather than guessing. Fundamental analysis examines company financials and business fundamentals to determine if a stock is undervalued or overvalued. Technical analysis studies price patterns and trends to identify entry and exit points. Combining both approaches gives you a complete picture - fundamental analysis answers 'what to buy' while technical analysis helps with 'when to buy'. For example, you might use fundamental analysis to identify a great company trading at a fair price, then use technical analysis to wait for an optimal entry point, potentially saving 5-10% on your purchase price. Understanding market analysis is essential for avoiding emotional decisions and building confidence in your investment choices."
        },
        {
          title: "Fundamental Analysis Basics",
          difficulty: "Beginner",
          relatedMetrics: ["peRatio", "roe", "debtToEquity"],
          content: "Fundamental analysis evaluates a company's intrinsic value by examining financial statements, business model, competitive position, management quality, and industry trends. Key metrics include the P/E ratio (Price-to-Earnings), which shows how much you're paying for earnings - a P/E of 15 means you pay $15 for each dollar of earnings. ROE (Return on Equity) measures profitability - good companies typically have ROE above 15%. Debt-to-equity ratio shows financial health - a ratio under 1.0 is generally conservative, while over 2.0 suggests high leverage risk. Current ratio measures short-term solvency - companies should have a ratio above 1.0 to cover immediate obligations. For example, analyzing a company with P/E of 12, ROE of 18%, and debt-to-equity of 0.8 suggests a healthy, profitable investment at a reasonable price. This section teaches you how to read financial statements and use these metrics to identify quality investments."
        },
        {
          title: "Technical Analysis Basics",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility"],
          content: "Technical analysis studies price movements, volume patterns, and market indicators to identify optimal entry and exit points. Chart patterns like 'head and shoulders' or 'double bottoms' signal potential price reversals. Moving averages smooth out price volatility - a stock trading above its 200-day moving average often indicates an uptrend. Support levels are price points where buying typically emerges, while resistance levels are where selling often occurs - buying near support and selling near resistance can improve returns. Momentum indicators like RSI (Relative Strength Index) show when stocks are overbought (above 70) or oversold (below 30), suggesting potential reversal points. Volume confirms price movements - price increases on high volume are more reliable than on low volume. For example, if a stock breaks above $50 with volume 50% above average, this is stronger than the same move on weak volume. This section teaches you how to use these tools to time your investments more effectively."
        },
        {
          title: "Economic Analysis",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate", "inflationRisk"],
          content: "Economic analysis examines macroeconomic factors that significantly affect markets and individual investments. Interest rate changes have profound impacts - when central banks raise rates from 2% to 4%, bond prices typically fall while high-dividend stocks become more attractive relative to growth stocks. Inflation erodes purchasing power - running at 3% means your investments need to return at least 3% just to maintain real value. GDP growth rates signal economic strength - during expansion periods, stocks typically outperform bonds. Employment data provides context for consumer spending - strong employment usually supports stock markets. Understanding how these factors interact helps you position your portfolio appropriately. For example, when economic indicators suggest rising inflation and interest rates, reducing bond exposure and increasing inflation-hedge assets like real estate or commodities can protect your portfolio. This section explains how to monitor economic indicators and adjust your investments accordingly."
        },
        {
          title: "Sector Analysis",
          difficulty: "Advanced",
          relatedMetrics: ["historicalReturn"],
          content: "Sector analysis evaluates different industry groups to identify trends, opportunities, and risks that affect investment performance. Different sectors perform differently through economic cycles - defensive sectors like utilities and consumer staples tend to outperform during recessions, while cyclical sectors like technology and industrials typically lead during expansions. Technological disruption can dramatically shift sector dynamics - the rise of electric vehicles has created opportunities in energy storage while challenging traditional automotive suppliers. Regulatory changes significantly impact sectors - healthcare policy changes affect pharmaceutical and insurance companies, while environmental regulations reshape energy sectors. Sector rotation strategies attempt to position in outperforming sectors while avoiding underperforming ones - for example, shifting from growth to value sectors when interest rates rise. Understanding sector correlations helps with portfolio construction - energy and technology sectors often have low correlation, providing diversification benefits. This section teaches you how to analyze sectors and position your portfolio to benefit from sector trends."
        },
        {
          title: "Putting It All Together",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "volatility", "historicalReturn"],
          content: "Successful market analysis combines fundamental, technical, and economic analysis into a cohesive investment framework. Start with fundamental analysis to identify quality companies with strong financials, competitive advantages, and good management - these are your 'buy list'. Then use economic analysis to assess timing - avoid buying during economic downturns if you can't handle volatility. Technical analysis helps with entry points - buy quality stocks during technical oversold conditions when they dip below support levels. A practical example: you identify a great company with strong fundamentals (low P/E, high ROE) during favorable economic conditions, then wait for a technical entry when the stock breaks above its 50-day moving average on increasing volume. Handling contradictory signals requires judgment - if fundamentals are strong but technicals are weak, consider dollar-cost averaging rather than lump-sum investing. Monitor your investments regularly, adjusting when fundamentals deteriorate or economic conditions change. This section guides you through integrating all analytical approaches to make informed, confident investment decisions."
        }
      ]
    },
    'portfolio-optimization': {
      title: "Portfolio Optimization",
      description: "Master portfolio construction techniques for optimal risk-return balance.",
      keyMetrics: ['sharpeRatio', 'treynorRatio', 'jensenAlpha', 'informationRatio', 'trackingError'],
      sections: [
        {
          title: "Portfolio Theory Fundamentals",
          difficulty: "Beginner",
          relatedMetrics: ["sharpeRatio", "historicalReturn"],
          content: "Modern Portfolio Theory (MPT) demonstrates that combining assets with different risk-return characteristics creates optimal portfolios superior to individual assets. The fundamental insight is that diversification reduces risk without proportionally reducing returns. For example, a portfolio of 100% stocks might have 20% volatility, but adding 30% bonds reduces volatility to approximately 12% while maintaining 70% of the expected returns. The efficient frontier represents the optimal balance - it shows portfolios offering the highest expected return for each level of risk. An investor choosing between two portfolios with the same expected return should always choose the one with lower volatility. Historical data shows that proper diversification has reduced portfolio volatility by 30-40% compared to single-asset portfolios while preserving 60-80% of returns. This section introduces the core concepts of portfolio theory and why diversification works."
        },
        {
          title: "Asset Allocation Strategies",
          difficulty: "Beginner",
          relatedMetrics: ["historicalReturn", "volatility"],
          content: "Asset allocation is the most important factor in portfolio performance, determining how you divide investments among different asset classes based on your goals, time horizon, and risk tolerance. Age-based allocation follows the rule of thumb: percentage of stocks equals 110 minus your age - so at age 30, hold 80% stocks; at age 50, hold 60% stocks. Risk-based allocation adjusts for risk tolerance: conservative investors might choose 40% stocks and 60% bonds, moderate investors 60% stocks and 40% bonds, while aggressive investors might prefer 90% stocks and 10% bonds. Strategic allocation sets long-term target weights and sticks to them regardless of short-term market movements. Tactical allocation makes short-term adjustments to exploit opportunities - for example, temporarily increasing stock allocation when markets are cheap. Studies show that strategic allocation can achieve 85% of optimal portfolio returns with much less trading and lower costs. This section helps you choose an allocation strategy that matches your situation."
        },
        {
          title: "Risk-Return Optimization",
          difficulty: "Intermediate",
          relatedMetrics: ["sharpeRatio", "volatility", "historicalReturn"],
          content: "Portfolio optimization uses mathematical models to find the optimal combination of assets that maximizes expected return for a given level of risk. The core concept is correlation - assets with low or negative correlation provide better diversification than highly correlated ones. For example, stocks and bonds have historically had low correlation (around 0.3), meaning when stocks drop 10%, bonds typically fall only 3%, providing cushion during market downturns. The Sharpe ratio measures risk-adjusted returns - optimizing for this ratio helps create portfolios that provide superior returns per unit of risk. A portfolio with a Sharpe ratio of 1.0 is excellent, meaning returns substantially exceed risk-free rates adjusted for volatility. Modern optimization techniques use historical return data and correlations to construct efficient portfolios - for example, a 70/30 stock/bond portfolio might have expected returns of 8% with 12% volatility and Sharpe ratio of 0.8. This section explains optimization concepts in practical terms and how to apply them to your portfolio."
        },
        {
          title: "Rebalancing Strategies",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "sharpeRatio"],
          content: "Rebalancing maintains target allocation by selling outperforming assets and buying underperforming ones to restore original weights. Calendar-based rebalancing adjusts at fixed intervals - quarterly or annually - which is simple but may rebalance too frequently (triggering taxes and fees) or too infrequently (allowing drift). Threshold-based rebalancing triggers when allocations drift significantly from targets - for example, if your 70% stock target moves to 75% due to market gains, rebalance back to 70%. This approach is more tax-efficient and captures market momentum while preventing excessive drift. A 5% drift threshold works well for most investors. Momentum-based rebalancing adjusts based on performance trends - letting winners run and cutting losers short. Tax-efficient rebalancing uses new contributions to adjust allocations rather than selling assets, avoiding capital gains taxes. Studies show rebalancing 1-2 times annually captures 90% of optimization benefits while minimizing transaction costs. This section teaches you how to choose and implement rebalancing strategies that work for your situation."
        },
        {
          title: "Advanced Portfolio Techniques",
          difficulty: "Advanced",
          relatedMetrics: ["sharpeRatio", "treynorRatio", "historicalReturn"],
          content: "Advanced techniques can enhance portfolio diversification and potentially improve risk-adjusted returns beyond traditional asset allocation. Factor investing targets specific risk factors like value, size, momentum, and quality - these factors have historically outperformed markets, with value factors showing 2-3% annual outperformance over long periods. Alternative investments like private equity, hedge funds, and commodities provide low correlation with stocks and bonds - adding 10-15% alternatives can reduce portfolio volatility by 15-20%. International diversification across developed and emerging markets exposes you to different economic cycles, regulations, and growth opportunities - developed markets provide stability while emerging markets offer higher growth potential. Risk parity portfolios allocate based on risk contribution rather than capital - aiming for equal risk from each asset class creates more balanced portfolios that typically perform better during market stress. These advanced techniques require more research and potentially higher fees, but can significantly improve portfolio efficiency for sophisticated investors willing to learn and implement them."
        },
        {
          title: "Building Your Optimal Portfolio",
          difficulty: "Advanced",
          relatedMetrics: ["sharpeRatio", "volatility", "historicalReturn"],
          content: "Constructing your optimal portfolio requires systematically combining theory with practical constraints. Start with your risk capacity and tolerance to determine target asset allocation - someone with 30 years to retirement and moderate risk tolerance might target 70% stocks, 25% bonds, 5% alternatives. Next, diversify within each asset class: within stocks, spread across market caps (large, mid, small), sectors, and geographies (domestic and international). Use low-cost index funds and ETFs to implement your allocation efficiently. Calculate your expected portfolio volatility using weighted averages - a 70/25/5 stock/bond/alternatives portfolio might have 13% annual volatility. Monitor your Sharpe ratio to ensure you're getting adequate risk-adjusted returns - aim for 0.75 or higher. Rebalance annually or when allocations drift 5% from targets. Review and adjust quarterly: if your risk tolerance or circumstances change, modify allocation accordingly. Track performance against benchmarks to ensure you're on track. This section provides a practical, step-by-step framework for building a portfolio optimized for your specific goals and constraints."
        }
      ]
    },
    // Individual Metrics for Learning Library
    'historicalReturn': {
      title: "Historical Return",
      description: "Learn how to measure and interpret historical investment performance to understand past growth patterns.",
      keyMetrics: ['historicalReturn'],
      sections: [
        {
          title: "Overview",
          content: "Historical return shows how much a stock's value has grown in the past, helping you see its growth over time.",
          difficulty: "Beginner",
          relatedMetrics: ["historicalReturn"]
        },
        {
          title: "Understanding Historical Return",
          content: "Historical return measures the increase in a stock's value over a period, including any extra money paid out, like a bonus. For example, if a stock's value goes from $50 to $60 in a year and pays a $1 bonus, the return is 22%. It helps you understand how the stock did before, but the future might be different. Check past patterns to learn more, and we'll guide you as you go!",
          difficulty: "Intermediate",
          relatedMetrics: ["historicalReturn"]
        },
        {
          title: "Practice Question",
          content: "If a stock's value rises from $50 to $60 and pays a $1 bonus in a year, what's its historical return? Options: A) 10% B) 12% C) 20% D) 22%. The correct answer is D) 22%. Historical return = ((Ending Value - Starting Value + Bonus) / Starting Value) × 100 = (($60 - $50 + $1) / $50) × 100 = 22%. This includes the value increase and bonus.",
          difficulty: "Advanced",
          relatedMetrics: ["historicalReturn"]
        }
      ]
    },
    'appreciation': {
      title: "Appreciation",
      description: "Understand how investment appreciation works and how to measure value increases over time.",
      keyMetrics: ['appreciation'],
      sections: [
        {
          title: "Overview",
          content: "Appreciation shows how much an investment's value has increased over time, helping you see its growth potential.",
          difficulty: "Beginner",
          relatedMetrics: ["appreciation"]
        },
        {
          title: "Understanding Appreciation",
          content: "Appreciation measures how much an investment's value has gone up over a period. For example, if an investment's value rises from $100 to $150 in three years, that's a 50% increase. It helps you understand how much the investment has grown, which can add to your overall gains. However, market changes can affect future growth. Compare it to other investments to understand its growth better. We'll explore more as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["appreciation"]
        },
        {
          title: "Practice Question",
          content: "If a stock's price rises from $100 to $150 over 3 years, what's the total appreciation? Options: A) 33% B) 50% C) 75% D) 150%. The correct answer is B) 50%. Appreciation = ((Ending Value - Starting Value) / Starting Value) × 100 = (($150 - $100) / $100) × 100 = 50%. This shows the value increase over time.",
          difficulty: "Advanced",
          relatedMetrics: ["appreciation"]
        }
      ]
    },
    'volatility': {
      title: "Volatility",
      description: "Learn about price volatility and how it affects investment risk and potential returns.",
      keyMetrics: ['volatility'],
      sections: [
        {
          title: "Overview",
          content: "Volatility tells you how much a stock's price moves up and down, helping you understand its risk level.",
          difficulty: "Beginner",
          relatedMetrics: ["volatility"]
        },
        {
          title: "Understanding Volatility",
          content: "Volatility measures how much a stock's price changes over time, showing how risky it might be. A stock that moves 25% in a month has high volatility, meaning bigger price swings, while one that moves 5% is more stable. Larger swings can mean higher risk but also a chance for bigger gains. Think about how comfortable you are with price changes as you choose stocks. Let's learn more about risk as we go!",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility"]
        },
        {
          title: "Practice Question",
          content: "If a stock's price changes a lot each month, what does that tell you? Options: A) It's very stable B) It has high volatility C) It will definitely grow D) It has low risk. The correct answer is B) It has high volatility. High volatility means the price moves a lot, making it riskier but with potential for bigger gains. Option A is incorrect because stable means small changes, and Option C is wrong because volatility doesn't guarantee growth.",
          difficulty: "Advanced",
          relatedMetrics: ["volatility"]
        }
      ]
    },
    'beta': {
      title: "Beta",
      description: "Understand beta coefficient and how it measures a stock's sensitivity to market movements.",
      keyMetrics: ['beta'],
      sections: [
        {
          title: "Overview",
          content: "Beta shows how much a stock moves with the overall market, helping you understand its risk compared to the market.",
          difficulty: "Beginner",
          relatedMetrics: ["beta"]
        },
        {
          title: "Understanding Beta",
          content: "Beta measures how a stock's price changes when the market changes. A value of 1 means it moves the same as the market, while 1.5 means it moves 50% more, making it riskier. A value of 0.5 means it moves less, suggesting lower risk. For example, if the market rises 10%, a stock with a beta of 1.5 might rise 15%. It helps you see how market changes affect the stock. We'll dive deeper as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["beta"]
        },
        {
          title: "Practice Question",
          content: "If a stock's beta is 1.5 and the market rises 10%, how much might the stock rise? Options: A) 5% B) 10% C) 15% D) 20%. The correct answer is C) 15%. Beta of 1.5 means the stock moves 1.5 times the market. If the market rises 10%, the stock might rise 15% (1.5 × 10%), assuming it follows the market trend.",
          difficulty: "Advanced",
          relatedMetrics: ["beta"]
        }
      ]
    },
    'peRatio': {
      title: "P/E Ratio",
      description: "Learn about price-to-earnings ratio and how it helps evaluate stock valuation.",
      keyMetrics: ['peRatio'],
      sections: [
        {
          title: "Overview",
          content: "P/E ratio compares a stock's price to its earnings, helping you see if it's expensive or cheap compared to its profits.",
          difficulty: "Beginner",
          relatedMetrics: ["peRatio"]
        },
        {
          title: "Understanding P/E Ratio",
          content: "P/E ratio is calculated by dividing the stock price by earnings per share. A P/E of 20 means you pay $20 for every $1 of earnings. Lower P/E ratios might suggest a cheaper stock, while higher ratios could mean investors expect growth. Compare P/E ratios within the same industry for better context. We'll explore valuation as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["peRatio"]
        },
        {
          title: "Practice Question",
          content: "If a stock costs $50 and has earnings of $2.50 per share, what's the P/E ratio? Options: A) 10 B) 15 C) 20 D) 25. The correct answer is C) 20. P/E ratio = Stock Price / Earnings Per Share = $50 / $2.50 = 20. This means you pay $20 for every $1 of earnings.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio"]
        }
      ]
    },
    'dividendYield': {
      title: "Dividend Yield",
      description: "Understand dividend yield and how it measures income from stock investments.",
      keyMetrics: ['dividendYield'],
      sections: [
        {
          title: "Overview",
          content: "Dividend yield shows how much a company pays in dividends compared to its stock price, helping you see your potential income.",
          difficulty: "Beginner",
          relatedMetrics: ["dividendYield"]
        },
        {
          title: "Understanding Dividend Yield",
          content: "Dividend yield is the yearly dividend payment divided by the stock's price, shown as a percentage. For example, if a stock costs $100 and pays $3 in yearly dividends, the yield is 3%. A higher yield means more income, but it's important to check if the company can keep paying dividends. Some companies, like utilities, often have higher yields (e.g., 4-5%), while growth companies might pay less or no dividends. Use this to find stocks that provide steady income. We'll guide you as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["dividendYield"]
        },
        {
          title: "Practice Question",
          content: "If a stock costs $50 and pays $2 in yearly dividends, what's the dividend yield? Options: A) 2% B) 4% C) 6% D) 8%. The correct answer is B) 4%. Dividend yield = (Yearly Dividend / Stock Price) × 100 = ($2 / $50) × 100 = 4%. Option A is incorrect because 2% would be a $1 dividend.",
          difficulty: "Advanced",
          relatedMetrics: ["dividendYield"]
        }
      ]
    },
    'sharpeRatio': {
      title: "Sharpe Ratio",
      description: "Learn about the Sharpe ratio and how it measures risk-adjusted returns.",
      keyMetrics: ['sharpeRatio'],
      sections: [
        {
          title: "Overview",
          content: "Sharpe ratio shows how much extra return you get for the risk you take, helping you compare investments fairly.",
          difficulty: "Beginner",
          relatedMetrics: ["sharpeRatio"]
        },
        {
          title: "Understanding Sharpe Ratio",
          content: "Sharpe ratio is calculated by subtracting the risk-free rate from the investment's return, then dividing by its volatility. A higher Sharpe ratio means better risk-adjusted returns. For example, if an investment returns 12% with 10% volatility and the risk-free rate is 2%, the Sharpe ratio is 1.0. This helps you see which investments give you more return for the risk you take. We'll explore risk-adjusted returns as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["sharpeRatio"]
        },
        {
          title: "Practice Question",
          content: "If an investment returns 15% with 12% volatility and the risk-free rate is 3%, what's the Sharpe ratio? Options: A) 0.8 B) 1.0 C) 1.2 D) 1.5. The correct answer is B) 1.0. Sharpe ratio = (Return - Risk-free rate) / Volatility = (15% - 3%) / 12% = 12% / 12% = 1.0.",
          difficulty: "Advanced",
          relatedMetrics: ["sharpeRatio"]
        }
      ]
    },
    'trackingError': {
      title: "Tracking Error",
      description: "Understand tracking error and how it measures how closely a fund follows its benchmark.",
      keyMetrics: ['trackingError'],
      sections: [
        {
          title: "Overview",
          content: "Tracking error shows how much a fund's performance differs from its benchmark, helping you see how closely it follows its target.",
          difficulty: "Beginner",
          relatedMetrics: ["trackingError"]
        },
        {
          title: "Understanding Tracking Error",
          content: "Tracking error measures the standard deviation of the difference between a fund's returns and its benchmark returns. A low tracking error (e.g., 1-2%) means the fund closely follows its benchmark, while a high tracking error (e.g., 5-8%) means it deviates significantly. Index funds typically have low tracking error, while actively managed funds may have higher tracking error. This helps you understand how predictable a fund's performance is relative to its benchmark. We'll explore fund performance as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["trackingError"]
        },
        {
          title: "Practice Question",
          content: "If a fund has returns of [10%, 12%, 8%, 11%] and its benchmark has returns of [9%, 11%, 9%, 10%], what does this suggest about tracking error? Options: A) Very low tracking error B) Low tracking error C) High tracking error D) Cannot determine. The correct answer is B) Low tracking error. The fund's returns are very close to the benchmark returns, suggesting low tracking error.",
          difficulty: "Advanced",
          relatedMetrics: ["trackingError"]
        }
      ]
    },
    'expenseRatio': {
      title: "Expense Ratio",
      description: "Learn about expense ratios and how they affect your investment returns.",
      keyMetrics: ['expenseRatio'],
      sections: [
        {
          title: "Overview",
          content: "Expense ratio shows how much a fund charges in fees each year, helping you see the cost of investing.",
          difficulty: "Beginner",
          relatedMetrics: ["expenseRatio"]
        },
        {
          title: "Understanding Expense Ratio",
          content: "Expense ratio is the annual fee charged by a fund, expressed as a percentage of assets. For example, a 0.5% expense ratio means you pay $5 annually for every $1,000 invested. Lower expense ratios mean more of your money stays invested and grows. Index funds typically have low expense ratios (0.1-0.3%), while actively managed funds may have higher ratios (0.5-1.5%). This fee is automatically deducted from the fund's returns, so it affects your net performance. We'll explore fund costs as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["expenseRatio"]
        },
        {
          title: "Practice Question",
          content: "If you invest $10,000 in a fund with a 0.75% expense ratio, how much do you pay in fees annually? Options: A) $7.50 B) $75 C) $750 D) $7,500. The correct answer is B) $75. Annual fees = Investment × Expense ratio = $10,000 × 0.75% = $75.",
          difficulty: "Advanced",
          relatedMetrics: ["expenseRatio"]
        }
      ]
    },
    'creditRating': {
      title: "Credit Rating",
      description: "Understand credit ratings and how they assess the creditworthiness of bonds and issuers.",
      keyMetrics: ['creditRating'],
      sections: [
        {
          title: "Overview",
          content: "Credit rating shows how likely a bond issuer is to pay back their debt, helping you assess the risk of bond investments.",
          difficulty: "Beginner",
          relatedMetrics: ["creditRating"]
        },
        {
          title: "Understanding Credit Rating",
          content: "Credit ratings are letter grades (AAA, AA, A, BBB, BB, B, CCC, CC, C, D) that assess the creditworthiness of bond issuers. AAA is the highest rating (safest), while D means the issuer has defaulted. Investment-grade bonds (AAA to BBB) are considered safer but offer lower yields, while junk bonds (BB and below) are riskier but offer higher yields. Credit rating agencies like Moody's, S&P, and Fitch provide these ratings based on financial analysis. This helps you choose bonds that match your risk tolerance. We'll explore bond investing as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["creditRating"]
        },
        {
          title: "Practice Question",
          content: "Which bond would typically offer higher yields? Options: A) AAA-rated corporate bond B) BBB-rated corporate bond C) BB-rated corporate bond D) They would all offer the same yield. The correct answer is C) BB-rated corporate bond. Lower credit ratings (higher risk) typically offer higher yields to compensate investors for the additional risk.",
          difficulty: "Advanced",
          relatedMetrics: ["creditRating"]
        }
      ]
    },
    'duration': {
      title: "Duration",
      description: "Learn about bond duration and how it measures interest rate sensitivity.",
      keyMetrics: ['duration'],
      sections: [
        {
          title: "Overview",
          content: "Duration shows how much a bond's price changes when interest rates change, helping you understand interest rate risk.",
          difficulty: "Beginner",
          relatedMetrics: ["duration"]
        },
        {
          title: "Understanding Duration",
          content: "Duration measures a bond's sensitivity to interest rate changes, expressed in years. For example, a bond with a duration of 5 will drop about 5% in price if interest rates rise 1%. Longer duration bonds are more sensitive to rate changes, while shorter duration bonds are less sensitive. This helps you choose bonds that match your interest rate outlook and risk tolerance. We'll explore bond risk as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["duration"]
        },
        {
          title: "Practice Question",
          content: "If a bond has a duration of 7 and interest rates rise by 2%, approximately how much will the bond's price change? Options: A) +14% B) +7% C) -7% D) -14%. The correct answer is D) -14%. Bond prices fall when interest rates rise. Price change ≈ -Duration × Interest rate change = -7 × 2% = -14%.",
          difficulty: "Advanced",
          relatedMetrics: ["duration"]
        }
      ]
    },
    'ytm': {
      title: "Yield to Maturity",
      description: "Learn about yield to maturity and how it measures the total return of a bond investment.",
      keyMetrics: ['ytm'],
      sections: [
        {
          title: "Overview",
          content: "Yield to maturity shows the total return you'll get if you hold a bond until it matures, helping you compare bond investments.",
          difficulty: "Beginner",
          relatedMetrics: ["ytm"]
        },
        {
          title: "Understanding Yield to Maturity",
          content: "Yield to maturity (YTM) is the total return expected on a bond if held until maturity, including interest payments and any capital gain or loss. It's calculated as the internal rate of return that makes the present value of all future cash flows equal to the bond's current price. YTM helps you compare bonds with different prices, coupon rates, and maturities on an equal basis. For example, a bond trading at a discount will have a YTM higher than its coupon rate. We'll explore bond returns as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["ytm"]
        },
        {
          title: "Practice Question",
          content: "If a bond is trading at a discount (below face value), how does its yield to maturity compare to its coupon rate? Options: A) YTM equals coupon rate B) YTM is lower than coupon rate C) YTM is higher than coupon rate D) Cannot determine. The correct answer is C) YTM is higher than coupon rate. When a bond trades at a discount, the YTM includes both the coupon payments and the capital gain from buying below face value.",
          difficulty: "Advanced",
          relatedMetrics: ["ytm"]
        }
      ]
    },
    'couponRate': {
      title: "Coupon Rate",
      description: "Understand coupon rates and how they determine the interest payments on bonds.",
      keyMetrics: ['couponRate'],
      sections: [
        {
          title: "Overview",
          content: "Coupon rate shows the annual interest rate a bond pays, helping you understand the income you'll receive from bond investments.",
          difficulty: "Beginner",
          relatedMetrics: ["couponRate"]
        },
        {
          title: "Understanding Coupon Rate",
          content: "Coupon rate is the annual interest rate paid by a bond, expressed as a percentage of the bond's face value. For example, a bond with a 5% coupon rate and $1,000 face value pays $50 annually in interest. The coupon rate is fixed when the bond is issued and doesn't change, regardless of market conditions. Higher coupon rates provide more income but may indicate higher risk. This helps you choose bonds that match your income needs and risk tolerance. We'll explore bond income as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["couponRate"]
        },
        {
          title: "Practice Question",
          content: "If a bond has a face value of $1,000 and a coupon rate of 6%, how much interest does it pay annually? Options: A) $6 B) $60 C) $600 D) $6,000. The correct answer is B) $60. Annual interest = Face value × Coupon rate = $1,000 × 6% = $60.",
          difficulty: "Advanced",
          relatedMetrics: ["couponRate"]
        }
      ]
    },
    'aum': {
      title: "Assets Under Management",
      description: "Learn about assets under management and how it indicates fund size and stability.",
      keyMetrics: ['aum'],
      sections: [
        {
          title: "Overview",
          content: "Assets under management shows how much money a fund manages, helping you assess its size and stability.",
          difficulty: "Beginner",
          relatedMetrics: ["aum"]
        },
        {
          title: "Understanding Assets Under Management",
          content: "Assets under management (AUM) is the total market value of all investments managed by a fund or investment company. Larger AUM can indicate fund stability and investor confidence, but very large funds may face challenges in finding suitable investments or maintaining performance. AUM affects expense ratios (larger funds often have lower expense ratios due to economies of scale) and liquidity. This helps you evaluate fund quality and potential performance. We'll explore fund characteristics as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["aum"]
        },
        {
          title: "Practice Question",
          content: "How might a fund's AUM affect its expense ratio? Options: A) Larger AUM always means higher expense ratios B) Larger AUM typically means lower expense ratios C) AUM has no effect on expense ratios D) Smaller AUM means lower expense ratios. The correct answer is B) Larger AUM typically means lower expense ratios. Larger funds benefit from economies of scale, allowing them to spread fixed costs over more assets and offer lower expense ratios.",
          difficulty: "Advanced",
          relatedMetrics: ["aum"]
        }
      ]
    },
    'tradingVolume': {
      title: "Trading Volume",
      description: "Understand trading volume and how it indicates market activity and liquidity.",
      keyMetrics: ['tradingVolume'],
      sections: [
        {
          title: "Overview",
          content: "Trading volume shows how many shares or units of a security are traded, helping you understand market activity and liquidity.",
          difficulty: "Beginner",
          relatedMetrics: ["tradingVolume"]
        },
        {
          title: "Understanding Trading Volume",
          content: "Trading volume is the number of shares or units traded during a specific period (daily, weekly, etc.). High volume indicates active trading and good liquidity, making it easier to buy or sell without significantly affecting the price. Low volume may mean less liquidity and wider bid-ask spreads. Volume often increases during significant price movements, news events, or earnings announcements. This helps you assess how easily you can trade a security and whether price movements are supported by trading activity. We'll explore market dynamics as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["tradingVolume"]
        },
        {
          title: "Practice Question",
          content: "What does high trading volume typically indicate? Options: A) Low liquidity B) High liquidity C) No effect on liquidity D) Decreased market interest. The correct answer is B) High liquidity. High trading volume indicates active market participation, making it easier to buy or sell securities without significantly impacting prices.",
          difficulty: "Advanced",
          relatedMetrics: ["tradingVolume"]
        }
      ]
    },
    'capRate': {
      title: "Capitalization Rate",
      description: "Learn about cap rates and how they evaluate real estate investment returns.",
      keyMetrics: ['capRate'],
      sections: [
        {
          title: "Overview",
          content: "Capitalization rate shows the expected return on a real estate investment, helping you evaluate property investments.",
          difficulty: "Beginner",
          relatedMetrics: ["capRate"]
        },
        {
          title: "Understanding Capitalization Rate",
          content: "Capitalization rate (cap rate) is calculated by dividing a property's net operating income by its current market value. For example, a property generating $50,000 in net income and valued at $1,000,000 has a 5% cap rate. Higher cap rates may indicate higher risk or better return potential, while lower cap rates may suggest safer, more stable investments. Cap rates help you compare different real estate investments and assess whether they meet your return expectations. We'll explore real estate investing as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["capRate"]
        },
        {
          title: "Practice Question",
          content: "If a property generates $80,000 in net operating income and is valued at $1,200,000, what's the cap rate? Options: A) 6.67% B) 6.0% C) 5.33% D) 5.0%. The correct answer is A) 6.67%. Cap rate = Net operating income / Property value = $80,000 / $1,200,000 = 6.67%.",
          difficulty: "Advanced",
          relatedMetrics: ["capRate"]
        }
      ]
    },
    'cashFlow': {
      title: "Cash Flow",
      description: "Learn about cash flow and how it measures a company's financial health.",
      keyMetrics: ['cashFlow'],
      sections: [
        {
          title: "Overview",
          content: "Cash flow shows how much money a company generates and spends, helping you assess its financial health and sustainability.",
          difficulty: "Beginner",
          relatedMetrics: ["cashFlow"]
        },
        {
          title: "Understanding Cash Flow",
          content: "Cash flow measures the movement of money in and out of a company. Positive cash flow means the company is generating more cash than it's spending, which is generally good for business operations and growth. Cash flow includes operating activities (day-to-day business), investing activities (buying/selling assets), and financing activities (borrowing/repaying debt). This helps you understand whether a company can pay its bills, invest in growth, and return money to shareholders. We'll explore financial health as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["cashFlow"]
        },
        {
          title: "Practice Question",
          content: "What does positive operating cash flow typically indicate about a company? Options: A) The company is losing money B) The company is profitable C) The company has good liquidity D) Both B and C. The correct answer is D) Both B and C. Positive operating cash flow indicates the company is generating cash from its core business operations, suggesting profitability and good liquidity.",
          difficulty: "Advanced",
          relatedMetrics: ["cashFlow"]
        }
      ]
    },
    'noi': {
      title: "Net Operating Income",
      description: "Understand net operating income and how it measures real estate profitability.",
      keyMetrics: ['noi'],
      sections: [
        {
          title: "Overview",
          content: "Net operating income shows how much profit a real estate property generates from operations, helping you evaluate property investments.",
          difficulty: "Beginner",
          relatedMetrics: ["noi"]
        },
        {
          title: "Understanding Net Operating Income",
          content: "Net operating income (NOI) is calculated by subtracting operating expenses from gross rental income. It represents the property's profitability before financing costs and taxes. For example, if a property generates $100,000 in rent and has $30,000 in operating expenses, the NOI is $70,000. NOI is used to calculate cap rates and assess property value. Higher NOI generally indicates better property performance and investment potential. This helps you compare different real estate investments and evaluate their income-generating ability. We'll explore real estate analysis as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["noi"]
        },
        {
          title: "Practice Question",
          content: "If a property generates $120,000 in gross rental income and has $40,000 in operating expenses, what's the NOI? Options: A) $80,000 B) $160,000 C) $40,000 D) $120,000. The correct answer is A) $80,000. NOI = Gross rental income - Operating expenses = $120,000 - $40,000 = $80,000.",
          difficulty: "Advanced",
          relatedMetrics: ["noi"]
        }
      ]
    },
    'accessibility': {
      title: "Accessibility",
      description: "Learn about investment accessibility and how it affects your ability to invest in different assets.",
      keyMetrics: ['accessibility'],
      sections: [
        {
          title: "Overview",
          content: "Accessibility shows how easy it is to invest in different types of assets, helping you understand investment barriers and opportunities.",
          difficulty: "Beginner",
          relatedMetrics: ["accessibility"]
        },
        {
          title: "Understanding Accessibility",
          content: "Investment accessibility refers to how easily individual investors can access different types of investments. Some investments like stocks and ETFs are highly accessible through regular brokerage accounts, while others like private equity or hedge funds may require high minimum investments or accredited investor status. Accessibility affects diversification opportunities and investment costs. Understanding accessibility helps you build portfolios that match your investment capacity and goals. We'll explore investment options as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["accessibility"]
        },
        {
          title: "Practice Question",
          content: "Which investment is typically most accessible to individual investors? Options: A) Private equity B) Hedge funds C) Publicly traded stocks D) Venture capital. The correct answer is C) Publicly traded stocks. Publicly traded stocks are easily accessible through regular brokerage accounts with low minimum investments, unlike private investments that often require high minimums or accredited investor status.",
          difficulty: "Advanced",
          relatedMetrics: ["accessibility"]
        }
      ]
    },
    'interestRate': {
      title: "Interest Rate",
      description: "Understand interest rates and how they affect various investment returns.",
      keyMetrics: ['interestRate'],
      sections: [
        {
          title: "Overview",
          content: "Interest rates show the cost of borrowing money or the return on lending, helping you understand how they affect different investments.",
          difficulty: "Beginner",
          relatedMetrics: ["interestRate"]
        },
        {
          title: "Understanding Interest Rates",
          content: "Interest rates are the percentage charged for borrowing money or paid for lending money. They affect bond prices (higher rates = lower bond prices), stock valuations (higher rates = lower stock valuations), and economic growth. Central banks use interest rates to control inflation and economic activity. When rates rise, bonds become more attractive relative to stocks, and vice versa. This helps you understand how interest rate changes affect your portfolio and investment decisions. We'll explore economic factors as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate"]
        },
        {
          title: "Practice Question",
          content: "How do rising interest rates typically affect bond prices? Options: A) Bond prices rise B) Bond prices fall C) Bond prices stay the same D) It depends on the bond type. The correct answer is B) Bond prices fall. When interest rates rise, existing bonds with lower rates become less attractive, causing their prices to fall to match the new higher-rate environment.",
          difficulty: "Advanced",
          relatedMetrics: ["interestRate"]
        }
      ]
    },
    'inflationRisk': {
      title: "Inflation Risk",
      description: "Learn about inflation risk and how it affects the purchasing power of your investments.",
      keyMetrics: ['inflationRisk'],
      sections: [
        {
          title: "Overview",
          content: "Inflation risk shows how rising prices can reduce the purchasing power of your investments, helping you understand this important risk factor.",
          difficulty: "Beginner",
          relatedMetrics: ["inflationRisk"]
        },
        {
          title: "Understanding Inflation Risk",
          content: "Inflation risk is the possibility that rising prices will reduce the purchasing power of your investments. For example, if inflation is 3% and your investment returns 2%, you're actually losing 1% in real purchasing power. Cash investments are most vulnerable to inflation risk, while stocks and real estate historically provide some protection against inflation. Understanding inflation risk helps you choose investments that can maintain or grow your purchasing power over time. We'll explore risk management as you learn!",
          difficulty: "Intermediate",
          relatedMetrics: ["inflationRisk"]
        },
        {
          title: "Practice Question",
          content: "If inflation is 4% and your investment returns 2%, what's your real return? Options: A) +6% B) +2% C) -2% D) -4%. The correct answer is C) -2%. Real return = Nominal return - Inflation = 2% - 4% = -2%. You're losing purchasing power despite the positive nominal return.",
          difficulty: "Advanced",
          relatedMetrics: ["inflationRisk"]
        }
      ]
    },
    'retirement-planning': {
      title: "Retirement Planning",
      description: "Build your retirement strategy with systematic savings and smart withdrawal planning",
      keyMetrics: ['historicalReturn', 'inflationRisk', 'dividendYield', 'interestRate'],
      sections: [
        {
          title: "Why Retirement Planning Matters",
          content: "Retirement planning is about building enough wealth to sustain your lifestyle after you stop working. The key is starting early and being consistent. The concept of historical return shows us that stocks have historically returned around 7-10% annually, which can significantly grow your retirement nest egg over decades. For example, if you invest $500 monthly for 30 years at 7% annual returns, you'd accumulate over $1 million by retirement time - all from just $180,000 in contributions. Starting early gives compound interest more time to work, where your earnings generate their own earnings. This magical effect of compounding is what makes retirement planning achievable for most people. Time is your greatest asset because it allows modest contributions to grow into substantial retirement funds. This section will help you understand why retirement planning matters, how compound interest works, and why every year you delay costs you significantly in the long run.",
          difficulty: "Beginner",
          relatedMetrics: ["historicalReturn"]
        },
        {
          title: "Understanding Retirement Needs",
          content: "To plan effectively, you need to estimate how much you'll actually need in retirement. A common rule of thumb is that you'll need 70-80% of your pre-retirement income to maintain your lifestyle, accounting for reduced expenses like commuting, work clothes, and payroll taxes. For someone earning $50,000 annually, this means planning for $35,000 to $40,000 per year in retirement expenses. With rising life expectancy, you might need to plan for 20-30 years of retirement expenses. Understanding inflation risk is crucial here - what costs $40,000 today might cost $80,000 in 25 years if inflation averages 3% annually. This section helps you calculate your retirement number and understand how inflation risk affects your long-term financial needs.",
          difficulty: "Beginner",
          relatedMetrics: ["inflationRisk"]
        },
        {
          title: "Retirement Savings Vehicles",
          content: "Different retirement accounts offer different tax advantages and contribution limits. Employer-sponsored 401(k) plans allow you to contribute pre-tax dollars up to $23,000 annually, with some employers matching your contributions for additional growth. Individual Retirement Accounts (IRAs) provide tax benefits whether traditional (pre-tax contributions) or Roth (post-tax contributions with tax-free withdrawals). The dividend yield of your investments within these accounts can help grow your retirement savings through passive income. For example, a portfolio with a 3% dividend yield means you're earning $3,000 annually for every $100,000 invested, which can be reinvested to accelerate growth. This section explains how different retirement accounts work, their tax implications, and how to choose the best options for your situation.",
          difficulty: "Intermediate",
          relatedMetrics: ["dividendYield", "historicalReturn"]
        },
        {
          title: "Withdrawal Strategies",
          content: "How you withdraw money in retirement is just as important as how you save it. The 4% rule suggests withdrawing 4% of your portfolio value in the first year, adjusted for inflation annually. This rule assumes your investments will generate historical returns sufficient to sustain withdrawals over 30 years. However, this isn't guaranteed - market conditions affect the sustainability of your withdrawal rate. Dividend yield becomes important here because income-producing investments can help sustain withdrawals without needing to sell assets during market downturns. A portfolio generating 3-4% dividend yield might allow you to withdraw income without touching principal, preserving your capital for future needs. This section covers withdrawal strategies that help your retirement savings last throughout your lifetime while managing inflation risk.",
          difficulty: "Intermediate",
          relatedMetrics: ["dividendYield", "historicalReturn", "inflationRisk"]
        },
        {
          title: "Building Your Retirement Portfolio",
          content: "A successful retirement portfolio balances growth and safety, gradually shifting toward more conservative assets as you approach retirement age. The concept of historical return guides asset allocation - you need stocks for growth but bonds for stability. In your 20s and 30s, a 80-90% stock allocation makes sense because historical returns show stocks outperform over long periods. As you approach retirement, shifting to 50-60% stocks helps protect what you've built. Interest rate movements affect bond values in retirement portfolios, requiring understanding of how changing interest rates impact your fixed-income holdings. This section explains how to build and adjust your retirement portfolio over time, using a combination of historical return data, dividend yield income, and understanding of inflation risk to create a sustainable retirement plan.",
          difficulty: "Advanced",
          relatedMetrics: ["historicalReturn", "interestRate", "dividendYield", "inflationRisk"]
        }
      ]
    },
    'financial-planning': {
      title: "Financial Planning",
      description: "Build a solid financial foundation before investing",
      keyMetrics: ['interestRate', 'inflationRisk', 'historicalReturn', 'volatility'],
      sections: [
        {
          title: "The Foundation of Financial Planning",
          content: "Financial planning is about creating a roadmap for your money that aligns with your life goals. It's not just about investing - it's about managing cash flow, reducing debt, building emergency funds, and ensuring financial stability before taking investment risks. Understanding how interest rates affect your debts is crucial - high credit card debt at 20% interest can destroy wealth faster than most investments can create it. The interest rate you pay on debt determines how quickly you should prioritize paying it off versus investing. This foundation includes budgeting, debt management, and emergency fund building, creating the stability needed for successful investing. This section introduces the core principles of financial planning and why a strong financial foundation is essential before taking on investment risks.",
          difficulty: "Beginner",
          relatedMetrics: ["interestRate"]
        },
        {
          title: "Emergency Funds and Cash Management",
          content: "An emergency fund is your financial safety net, protecting you from unexpected expenses without derailing your investment plans. The general recommendation is 3-6 months of essential expenses, but this varies based on job security, family situation, and overall financial stability. The interest rate on high-yield savings accounts affects how quickly your emergency fund grows - while typically low, every little bit helps. Understanding inflation risk is important even for emergency funds because money sitting in low-yield accounts loses purchasing power over time. The trade-off is maintaining liquidity and safety versus earning higher returns elsewhere. This section explains how to build an emergency fund, where to keep it, and how to balance liquidity needs with inflation risk management to maintain your financial foundation.",
          difficulty: "Beginner",
          relatedMetrics: ["interestRate", "inflationRisk"]
        },
        {
          title: "Debt Management Strategies",
          content: "Effective debt management involves understanding interest rates and prioritizing which debts to pay off first. High-interest credit card debt (often 15-25% interest rates) should typically be paid before investing, because guaranteed savings from eliminating debt often exceed investment returns. Understanding how interest rates compound against you helps prioritize debt payoff - a $10,000 credit card balance at 20% interest costs $2,000 annually in interest alone. Reducing debt creates a guaranteed return equivalent to the interest rate you're paying. This section covers the debt avalanche method (paying highest interest rates first), debt snowball method (paying smallest balances first), and how to decide between investing and paying down debt based on interest rate comparisons with expected investment returns.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate"]
        },
        {
          title: "Before You Start Investing",
          content: "Before investing, ensure you have adequate insurance coverage, manageable debt loads, and a stable income source. Understanding volatility is crucial for new investors - you need to mentally and financially prepare for market ups and downs before committing capital. Reviewing historical return data helps set realistic expectations rather than expecting quick riches. An investment's historical return provides context but doesn't guarantee future performance, so you need financial stability to weather potential losses. This section explains what financial planning milestones to reach before starting to invest, including debt-to-income ratios, emergency fund adequacy, and how to mentally prepare for the volatility inherent in investing. Building a strong financial foundation first ensures that investment setbacks won't derail your overall financial security.",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "historicalReturn"]
        },
        {
          title: "Integrating Financial Planning with Investing",
          content: "Financial planning and investing work together, not separately. Your financial plan determines how much you can safely invest, what your time horizon is, and what level of volatility you can handle. Understanding both inflation risk and investment volatility helps align your financial plan with your investment strategy - you need enough growth to beat inflation but enough stability to sleep at night. The interest rate environment affects both your debts and your investment returns, requiring an integrated view of your entire financial picture. Historical return data guides your expectations, but your financial plan determines your ability to take risks and stay invested during downturns. This section explains how to integrate financial planning with investing, ensuring your investment strategy supports your overall financial goals while managing inflation risk and volatility through diversification and proper asset allocation.",
          difficulty: "Advanced",
          relatedMetrics: ["historicalReturn", "volatility", "inflationRisk", "interestRate"]
        }
      ]
    },
    'value-growth-investing': {
      title: "Value vs Growth Investing",
      description: "Compare different investment styles and learn when to use each strategy",
      keyMetrics: ['peRatio', 'growthRate', 'dividendYield', 'historicalReturn'],
      sections: [
        {
          title: "Understanding Value and Growth Styles",
          content: "Value and growth represent two fundamental approaches to stock investing, each with different philosophies and expected outcomes. Value investing focuses on finding stocks trading below their intrinsic worth, looking for bargains in the market. Growth investing targets companies with strong potential for future earnings expansion, often willing to pay premium prices for rapid growth prospects. The P/E ratio is a key metric for distinguishing between value and growth stocks - value stocks typically have lower P/E ratios (often under 15), while growth stocks have higher P/E ratios (often 30-100 or more) reflecting future growth expectations. This section introduces the core differences between value and growth investing, explaining the P/E ratio and how it helps identify which style a stock represents.",
          difficulty: "Beginner",
          relatedMetrics: ["peRatio"]
        },
        {
          title: "Value Investing Principles",
          content: "Value investing seeks to buy stocks for less than they're worth, often focusing on companies with strong fundamentals that are temporarily out of favor. Value investors look for low P/E ratios, suggesting the stock price hasn't caught up with earnings potential. Dividend yield often factors into value investing, as many value stocks are mature companies paying regular dividends, providing income while you wait for price appreciation. Historical returns show that value stocks have outperformed growth over very long periods, though with significant periods of underperformance. The strategy requires patience and emotional discipline, buying when others are selling and holding through market cycles. This section explains value investing principles, how P/E ratios and dividend yield help identify value opportunities, and what historical return patterns tell us about value investing performance.",
          difficulty: "Intermediate",
          relatedMetrics: ["peRatio", "dividendYield", "historicalReturn"]
        },
        {
          title: "Growth Investing Principles",
          content: "Growth investing focuses on companies with exceptional potential for earnings expansion, often in emerging industries or rapidly expanding sectors. These stocks often have high P/E ratios because investors pay premium prices for fast-growing companies, betting on continued expansion. Growth stocks typically have lower or no dividend yields because the companies reinvest profits into expansion rather than paying shareholders. Growth investors prioritize the growth rate of earnings and revenue over current valuations, willing to pay up for companies with strong expansion prospects. Historical returns for growth stocks show periods of outperformance, particularly in bull markets, but also higher volatility and sharper declines during downturns. This section explains growth investing principles, how to identify growth opportunities using P/E ratios and growth rate metrics, and what to expect from growth-oriented portfolios.",
          difficulty: "Intermediate",
          relatedMetrics: ["peRatio", "growthRate"]
        },
        {
          title: "When to Use Each Strategy",
          content: "Choosing between value and growth depends on your investment goals, risk tolerance, and market conditions. Value investing suits those seeking steady returns with less volatility, often attracting investors in or near retirement who need income through dividend yield. Growth investing appeals to investors with longer time horizons who can weather higher volatility in pursuit of superior returns. Market cycles matter - value tends to outperform during economic recoveries while growth excels during expansion phases. The P/E ratio environment matters too - when value stocks have unusually low P/E ratios relative to growth, historical return patterns suggest value may outperform going forward. This section helps you decide which style fits your situation and how market conditions affect the relative attractiveness of value versus growth approaches.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "growthRate", "dividendYield", "historicalReturn"]
        },
        {
          title: "Building a Balanced Approach",
          content: "Many successful investors combine both value and growth strategies rather than choosing exclusively between them. A balanced portfolio might include 60% value stocks for stability and dividend income, and 40% growth stocks for appreciation potential. Monitoring P/E ratios helps maintain appropriate valuation exposure, avoiding overconcentration in either expensive growth or excessively cheap value names. Dividend yield from value holdings provides income while growth holdings offer capital appreciation potential. Historical return data supports diversification across both styles rather than betting entirely on one approach. This section explains how to build a balanced portfolio incorporating both value and growth styles, using P/E ratios to maintain valuation discipline and dividend yield to provide income, while leveraging historical return patterns to guide allocation decisions.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "dividendYield", "growthRate", "historicalReturn"]
        },
        {
          title: "Market Cycles and Style Performance",
          content: "Neither value nor growth consistently outperforms - market cycles drive style leadership. During bull markets, growth stocks often surge as investors chase momentum and expansion stories. During bear markets and recessions, value stocks often hold up better due to lower valuations and income from dividend yield. The P/E ratio spread between growth and value provides signals about market sentiment and potential reversals. Historical returns show that extreme P/E ratio differences between value and growth often correct over time, with whichever style is more undervalued tending to outperform in subsequent periods. Understanding these cycles helps you position your portfolio appropriately and avoid chasing recent winners. This section explores how market cycles affect value versus growth performance, using P/E ratio analysis and historical return patterns to guide style allocation decisions based on market conditions and relative valuations.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "growthRate", "dividendYield", "historicalReturn"]
        }
      ]
    },
    'economic-fundamentals': {
      title: "Economic Fundamentals",
      description: "Understand how economic factors affect your investments",
      keyMetrics: ['interestRate', 'inflationRisk', 'historicalReturn', 'dividendYield'],
      sections: [
        {
          title: "How Economics Impact Investments",
          content: "Economic fundamentals directly affect investment returns through multiple channels. Interest rate movements influence bond prices and stock valuations - rising rates typically hurt bonds and growth stocks while helping value stocks. Inflation risk erodes purchasing power, making it essential to invest in assets that historically outpace inflation. Understanding economic fundamentals helps you position your portfolio for different market environments and anticipate how economic changes might affect your investments. Historical return data shows how different asset classes respond to economic cycles, providing guidance for portfolio adjustments. This section introduces the key economic concepts that affect investments and how interest rate changes, inflation risk, and economic growth impact the historical returns of various asset classes.",
          difficulty: "Beginner",
          relatedMetrics: ["interestRate", "inflationRisk", "historicalReturn"]
        },
        {
          title: "Interest Rates and Investment Markets",
          content: "Interest rates are among the most influential economic factors affecting investments. When the central bank raises interest rates, bond prices typically fall because existing bonds with lower yields become less attractive. Higher rates also increase the discount rate used to value stocks, typically reducing stock prices, especially for growth stocks with distant earnings. However, higher rates often benefit value stocks and dividend-paying companies that provide current income. The interest rate environment affects every asset class - real estate becomes less attractive when rates rise, cash holdings earn more but still face inflation risk. Understanding how interest rate movements affect different investments helps you position your portfolio appropriately. This section explains the relationship between interest rates and investment performance, covering how rate changes affect bonds, stocks, real estate, and cash, helping you make informed decisions based on interest rate outlooks.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate", "dividendYield"]
        },
        {
          title: "Inflation's Impact on Investments",
          content: "Inflation risk is a critical consideration because it erodes the purchasing power of fixed-income investments and cash holdings. When inflation rises, assets that provide fixed payments like bonds lose real value, though higher coupon payments help offset this. Stocks often provide some inflation protection because companies can raise prices and grow revenue. Historical return data shows that stocks have outpaced inflation over long periods, with average annual returns of 7-10% compared to average inflation of 2-3%. Dividend yield helps combat inflation because companies typically increase dividend payments over time, providing rising income streams. Real estate and certain commodities also tend to keep pace with inflation. Understanding how different investments respond to inflation risk helps you build portfolios that maintain purchasing power over time. This section explores inflation's impact on various assets and how to position your portfolio to manage inflation risk while pursuing historical returns that outpace rising costs of living.",
          difficulty: "Intermediate",
          relatedMetrics: ["inflationRisk", "dividendYield", "historicalReturn"]
        },
        {
          title: "Economic Cycles and Your Portfolio",
          content: "Economic expansions and contractions create investment opportunities and risks that vary by asset class. During expansions, stocks typically perform well as earnings grow and investor confidence rises. During recessions, bonds and defensive stocks often outperform while cyclical companies struggle. The interest rate environment reflects economic conditions - central banks typically lower rates during slowdowns to stimulate growth and raise rates during expansions to control inflation. Understanding these cycles helps you adjust your asset allocation between stocks, bonds, and cash based on economic signals. Historical return data shows that recession-resistant portfolios (heavy in bonds and defensive stocks) underperform during expansions but provide stability during downturns. Dividend yield becomes particularly valuable during recessions when capital appreciation is scarce but income helps support returns. This section explains economic cycles and how to adjust your portfolio using interest rate signals, inflation risk assessment, and historical return patterns to position for different economic environments.",
          difficulty: "Advanced",
          relatedMetrics: ["interestRate", "inflationRisk", "dividendYield", "historicalReturn"]
        },
        {
          title: "Global Economic Factors",
          content: "In today's interconnected world, global economic factors affect your investments regardless of where you invest. Currency movements impact international investments when you convert foreign returns back to your home currency. Global interest rate differences drive capital flows, affecting asset prices worldwide. Inflation risk varies by country but affects all investments through global supply chains and currency impacts. International diversification helps manage country-specific risks while exposing you to different economic cycles and dividend yield environments. Historical return patterns differ significantly across countries and regions, with emerging markets showing higher volatility and potential returns than developed markets. Understanding global economic fundamentals helps you navigate international investing and position for different regional opportunities. This section covers global economic factors affecting investments, including currency impacts, interest rate differentials, how inflation risk varies internationally, and how international diversification can improve portfolio historical returns while managing volatility.",
          difficulty: "Advanced",
          relatedMetrics: ["interestRate", "inflationRisk", "historicalReturn"]
        },
        {
          title: "Using Economic Indicators for Investment Decisions",
          content: "Economic indicators provide signals about market direction and investment opportunities. Unemployment rates, GDP growth, consumer spending, and manufacturing activity all signal economic health and potential asset performance. Central bank policy regarding interest rates provides clear signals about economic stimulus or restraint. Monitoring inflation risk indicators helps you assess whether your portfolio is positioned to outpace rising costs. These indicators don't provide perfect market timing signals, but they help you understand the economic context for your investment decisions. Historical return data combined with economic indicators helps validate investment strategies and set realistic expectations. For example, when economic indicators suggest recession risk, reducing stock exposure and increasing bond allocation can protect capital, though it might mean missing some historical return potential. This section explains key economic indicators, how to interpret them, and how to use this information along with interest rate outlooks, inflation risk assessments, and historical return patterns to make informed investment decisions.",
          difficulty: "Advanced",
          relatedMetrics: ["interestRate", "inflationRisk", "historicalReturn"]
        }
      ]
    },
    'behavioral-finance': {
      title: "Behavioral Finance",
      description: "Master the psychology of investing to avoid common mistakes",
      keyMetrics: ['volatility', 'historicalReturn', 'timingRisk', 'sharpeRatio'],
      sections: [
        {
          title: "Understanding Investment Psychology",
          content: "Behavioral finance explores how psychology affects investment decisions, often in ways that hurt returns. Our brains evolved for survival in ancient environments, not for navigating modern financial markets. This mismatch causes systematic investing mistakes that historical return data shows reduce investor performance. Key psychological factors include overconfidence (believing our stock-picking ability exceeds reality), loss aversion (feeling losses twice as strongly as gains), and herd mentality (following the crowd into hot investments). Understanding these psychological factors is the first step toward better investment decisions. This section introduces behavioral finance and explains how human psychology creates common investing mistakes that hinder portfolio performance despite understanding volatility and historical return principles.",
          difficulty: "Beginner",
          relatedMetrics: ["volatility", "historicalReturn"]
        },
        {
          title: "Common Behavioral Biases",
          content: "Investment psychology includes many biases that lead to poor decisions. Confirmation bias makes us seek information confirming our existing beliefs while ignoring contradictory evidence. Anchoring causes us to fixate on entry prices, making it hard to cut losses or take profits. Recency bias leads us to extrapolate recent trends, buying after rallies and selling after corrections. These biases often cause investors to buy high and sell low, the opposite of wealth-building behavior. Volatility triggers emotional responses that amplify these biases - seeing portfolio values drop during market corrections can trigger panic selling despite historical return patterns showing recovery. This section explores common behavioral biases affecting investors and how understanding them can help you make more rational decisions despite emotional reactions to volatility and historical return variations.",
          difficulty: "Beginner",
          relatedMetrics: ["volatility", "historicalReturn"]
        },
        {
          title: "Emotions and Market Timing",
          content: "Attempting to time markets emotionally leads to the timing risk that damages long-term returns. When markets rise, greed drives investors to buy at peaks after missing initial gains. When markets fall, fear drives investors to sell at bottoms after volatility becomes unbearable. Historical return data consistently shows that missing just a few of the market's best days significantly reduces overall returns. Despite understanding this, emotional reactions to volatility often override rational analysis. The psychological desire to avoid losses leads investors to take actions that ultimately destroy wealth - selling during volatility-induced corrections even when historical return patterns suggest holding would be wiser. This section explains how emotions drive poor market timing decisions and why understanding both volatility and historical return patterns helps you avoid emotional investing mistakes.",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "historicalReturn", "timingRisk"]
        },
        {
          title: "Overconfidence and Excessive Trading",
          content: "Overconfidence leads investors to believe they can time markets, pick winning stocks, or outsmart professional portfolio managers. This results in excessive trading that generates commissions and taxes while reducing returns. Historical return data shows that individual investors severely underperform market averages, largely due to frequent trading driven by overconfidence. The illusion of control makes investors think they can navigate volatility better than the market, leading to actions that reduce rather than enhance returns. Studies consistently show that less confident, buy-and-hold investors achieve better outcomes despite experiencing the same volatility. This section explores how overconfidence damages investment performance and why understanding historical return patterns supports a patient, disciplined approach rather than active trading attempts. Learning to recognize overconfidence helps you make fewer, better decisions.",
          difficulty: "Intermediate",
          relatedMetrics: ["volatility", "historicalReturn", "timingRisk"]
        },
        {
          title: "Building Better Investment Habits",
          content: "Overcoming behavioral finance pitfalls requires systematic approaches to counteract psychology's negative effects. Dollar-cost averaging reduces timing risk by investing fixed amounts regularly regardless of market conditions, neutralizing emotional reactions to volatility. Creating an investment plan and sticking to it prevents emotional deviations during stressful periods. Understanding historical return patterns and expected volatility helps set realistic expectations that reduce panic during inevitable market downturns. Regular portfolio reviews based on predetermined criteria rather than market movements help maintain discipline. Focusing on long-term historical return goals rather than short-term volatility helps maintain perspective. This section provides practical strategies for overcoming psychological investing traps, including how to use automatic investing, maintain perspective on volatility and historical returns, and build habits that support wealth accumulation despite emotional challenges.",
          difficulty: "Advanced",
          relatedMetrics: ["volatility", "historicalReturn", "timingRisk"]
        },
        {
          title: "Risk-Adjusted Thinking",
          content: "True investment sophistication involves understanding risk-adjusted returns, not just raw performance. The Sharpe ratio measures returns per unit of risk, helping you compare investments fairly. Understanding that volatility can be both a risk and an opportunity helps you maintain perspective during market fluctuations. Historical return data adjusted for volatility shows which investments provide superior risk-adjusted performance, guiding portfolio construction. Behavioral finance research shows that investors often make poor decisions when they focus on raw returns without considering risk-adjusted metrics. Understanding the relationship between volatility and historical returns helps you appreciate the risk-reward tradeoff inherent in all investments. This section explains risk-adjusted thinking using metrics like the Sharpe ratio, how to evaluate investments considering both volatility and historical returns, and why this perspective helps avoid behavioral finance pitfalls by focusing on long-term efficiency rather than short-term emotional reactions.",
          difficulty: "Advanced",
          relatedMetrics: ["volatility", "historicalReturn", "sharpeRatio", "timingRisk"]
        }
      ]
    }
  };