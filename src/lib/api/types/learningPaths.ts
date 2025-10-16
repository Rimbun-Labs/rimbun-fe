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
          content: "Equities are shares of ownership in a company, like stocks you can buy on the stock market. When you buy a stock, you own a small piece of that company and can benefit if it grows. For example, if you buy Apple stock, you're an Apple shareholder! Equities can grow your money over time through `historicalReturn`, which measures past performance (e.g., Apple's stock grew 233% from 2000–2005). However, they can also be risky because prices change daily. This section introduces you to the basics of stocks and ETFs (Exchange-Traded Funds), which bundle many stocks together for easier investing. You'll learn how equities can fit into your investment goals.",
          difficulty: "Beginner",
          relatedMetrics: ["historicalReturn"]
        },
        {
          title: "Understanding Volatility",
          content: "Equities can be exciting, but their prices move up and down—sometimes a lot! This movement is called `volatility`, and it measures how much a stock's price swings. A stock with high `volatility` (e.g., 30%) might drop or gain 30% in a year, which can feel risky. A low `volatility` stock (e.g., 15%) is steadier, better for cautious investors. Another metric, `beta`, shows how a stock moves compared to the market (e.g., a `beta` of 1.0 means it moves with the market). In this section, you'll learn how to check these metrics and decide if a stock's ups and downs match your comfort level.",
          difficulty: "Beginner",
          relatedMetrics: ["volatility", "beta"]
        },
        {
          title: "Key Metrics for Stocks",
          content: "Picking stocks means looking at numbers that tell you about a company's value and growth. One key metric is the `peRatio` (Price-to-Earnings Ratio), which shows how much you're paying for each dollar of the company's earnings. A lower `peRatio` (e.g., 15) might mean a stock is undervalued, while a higher one (e.g., 30) might mean it's pricey but growing fast, like tech stocks. Another metric, `dividendYield`, tells you how much a company pays in dividends per share (e.g., 2% means $2 per $100 invested). This section teaches you how to use these metrics to compare stocks and find ones that fit your goals, whether you want growth or steady income.",
          difficulty: "Intermediate",
          relatedMetrics: ["peRatio", "dividendYield"]
        },
        {
          title: "Diversifying with ETFs",
          content: "Buying individual stocks can be risky, but ETFs (Exchange-Traded Funds) let you invest in many stocks at once, spreading out your risk. For example, an S&P 500 ETF holds shares in 500 big companies, so you're not betting on just one! ETFs have an `expenseRatio`, a small fee you pay yearly (e.g., 0.1% means $1 per $1,000 invested), which you'll want to keep low. They also cover different sectors, like tech or healthcare, so you can choose what fits your interests. This section explains how ETFs work, how to pick ones with a low `expenseRatio`, and why diversification lowers risk.",
          difficulty: "Intermediate",
          relatedMetrics: ["expenseRatio"]
        },
        {
          title: "Growth vs. Value Investing",
          content: "There are two main styles of stock investing: growth and value. Growth stocks, like many tech companies, focus on fast earnings increases, often with high `peRatio` values (e.g., 40) because investors expect big future gains. Value stocks are undervalued gems, with lower `peRatio` values (e.g., 10), offering steady returns through dividends or price increases. Both have risks: growth stocks can crash if they don't meet expectations, while value stocks might stay undervalued. This section helps you decide which style suits your goals and risk tolerance, using metrics like `growthRate` for growth stocks and `dividendYield` for value stocks. It's a step toward building a strategy that matches your investor profile.",
          difficulty: "Advanced",
          relatedMetrics: ["peRatio", "dividendYield", "growthRate"]
        },
        {
          title: "Market Timing Risks",
          content: "Some investors try to 'time' the market—buying low and selling high—but this is tricky! Markets go through cycles (`bullMarket` for rising prices, `bearMarket` for falling ones), and guessing the right moment is hard. The `timingRisk` means you might miss out on gains if you wait too long or sell too early. For example, if you sold during a 2008 dip, you'd miss the 2009 recovery. This section explores why long-term investing often beats timing, using historical data to show how market cycles work. You'll learn to focus on your goals, not short-term price changes, and avoid common mistakes.",
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
          content: "Bonds are like loans you give to companies or governments. In return, they pay you interest over time, called the `couponRate` (e.g., 3% means $30 yearly per $1,000 invested), and return your money at the end, called maturity. The `ytm` (Yield to Maturity) shows your total return if you hold the bond until it matures, combining interest and price changes. Bonds are generally safer than stocks, making them great for steady income and preserving your money. This section covers the basics of how bonds work, why they're a safe choice, and how to understand `ytm` to pick the right ones. It's perfect for beginners looking for stability in their investments.",
          difficulty: "Beginner",
          relatedMetrics: ["couponRate", "ytm"]
        },
        {
          title: "Safety and Income",
          content: "Bonds are often chosen for their safety, but not all bonds are equal! The `creditRating` tells you how likely the issuer is to pay you back—AAA is the safest (like U.S. Treasury bonds), while lower ratings (e.g., BB) are riskier but pay higher interest. Treasury bonds are backed by the government, making them super safe, with a `couponRate` like 2%. This section explains how to pick bonds based on `creditRating` to match your risk comfort, and why bonds provide steady income through interest payments. It's a great starting point for cautious investors.",
          difficulty: "Beginner",
          relatedMetrics: ["creditRating", "couponRate"]
        },
        {
          title: "Interest Rate Risks",
          content: "Bonds are safe, but they're not risk-free! When interest rates rise, bond prices fall, and the `duration` metric shows how much. A bond with a `duration` of 5 will drop 5% in price if rates rise 1%. For example, in 2022, rates rose, and many bonds lost value temporarily. This section teaches you how `duration` and `convexity` (a measure of price sensitivity) help you understand this risk, so you can pick bonds that won't swing too much if rates change. It's a key skill for planning your investments, especially if you're worried about price drops.",
          difficulty: "Intermediate",
          relatedMetrics: ["duration", "convexity"]
        },
        {
          title: "Corporate vs. Government Bonds",
          content: "Bonds come in two main types: government (like Treasuries) and corporate (issued by companies). Government bonds are safer, with high `creditRating` (e.g., AAA), but offer lower yields (e.g., 2% `ytm`). Corporate bonds can pay more (e.g., 4% `ytm`), but carry `defaultRisk`—the chance the company can't pay you back, especially if their `creditRating` is lower (e.g., BBB). This section compares the two, helping you decide which fits your risk level and income goals. You'll learn how to balance safety and returns, a crucial step for building a bond portfolio.",
          difficulty: "Intermediate",
          relatedMetrics: ["creditRating", "ytm", "defaultRisk"]
        },
        {
          title: "Bond Laddering Strategy",
          content: "A bond ladder is a smart way to manage your bond investments. You buy bonds with different maturities (e.g., 1, 3, 5 years), creating a `maturityLadder`. When one bond matures, you reinvest the money, keeping your income steady and reducing interest rate risk. For example, if rates rise, only part of your money is affected, not all of it. This section teaches you how to build a bond ladder, using metrics like `duration` to pick bonds and plan your cash flow. It's an advanced strategy that ensures you're prepared for changing rates while earning consistent interest.",
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
          content: "Real estate investing means buying property to earn money, either through rent or price growth. When a property's value rises over time, that's called `appreciation`—for example, a house bought for $200,000 in 2010 might be worth $300,000 by 2020, a 50% increase! You can also earn `rentalIncome` by leasing it out, like $1,000 a month. Real estate can be a great way to grow your money, but it's less liquid than stocks—you can't sell it as quickly. This section covers the basics of real estate, how `appreciation` and `rentalIncome` work, and why it's a popular investment. It's perfect for beginners curious about property.",
          difficulty: "Beginner",
          relatedMetrics: ["appreciation", "rentalIncome"]
        },
        {
          title: "Understanding Cap Rates",
          content: "A key metric in real estate is the `capRate` (Capitalization Rate), which shows your yearly return from a property, not counting price changes. It's calculated as annual `rentalIncome` divided by the property's price. For example, a $200,000 property earning $12,000 a year in rent has a `capRate` of 6% ($12,000 / $200,000). A higher `capRate` means better returns, but often more risk (e.g., a less desirable area). This section explains how to use `capRate` to compare properties and decide if a real estate investment is worth it for your goals.",
          difficulty: "Beginner",
          relatedMetrics: ["capRate", "rentalIncome"]
        },
        {
          title: "REITs for Beginners",
          content: "Don't want to buy a whole property? REITs (Real Estate Investment Trusts) let you invest in real estate without owning it directly. They're like ETFs for property—you buy shares in a company that owns buildings, and they pay you a `dividendYield` (e.g., 4% means $4 per $100 invested). REITs are more liquid than physical property, with `liquidity` meaning you can sell shares easily on the stock market. This section introduces REITs, how they work, and why they're a great way to start in real estate. You'll learn to check `dividendYield` and `liquidity` to pick REITs that fit your needs.",
          difficulty: "Intermediate",
          relatedMetrics: ["dividendYield", "liquidity"]
        },
        {
          title: "Market Cycles in Real Estate",
          content: "Real estate prices don't always go up—they follow cycles, just like stocks. The `housingIndex` (e.g., FHFA HPI) tracks price changes over time; for example, prices fell 20% during the 2008 crisis but rose 50% from 2012–2020. These `economicCycles` are influenced by interest rates, jobs, and demand. This section teaches you how to understand these cycles and their impact on real estate investments. You'll learn why timing matters and how to spot opportunities (e.g., buying in a dip) or risks (e.g., overpaying in a boom). It's a step toward smarter property investing.",
          difficulty: "Intermediate",
          relatedMetrics: ["housingIndex", "economicCycles"]
        },
        {
          title: "Leverage in Real Estate",
          content: "Many real estate investors use loans to buy properties, a strategy called leverage. The `loanToValue` ratio (LTV) shows how much you're borrowing—e.g., borrowing $150,000 for a $200,000 property is a 75% LTV. Leverage can boost returns (if the property grows in value), but it also adds risk: you'll owe `debtService` (monthly loan payments), which can strain your budget if rent doesn't cover it. This section explains how leverage works, how to calculate `loanToValue`, and why `debtService` matters for cash flow. It's an advanced topic for those ready to take on bigger real estate investments.",
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
          content: "Cash investments, like savings accounts, are the safest way to keep your money. They offer high `liquidity`, meaning you can access your funds anytime, and they earn a small amount of interest, called the `interestRate` (e.g., 1% means $10 per year on $1,000). Cash is perfect for emergencies or short-term goals because there's almost no risk of losing money. However, the returns are low compared to stocks or bonds, so it's not great for long-term growth. This section covers why cash is a safe choice, how `interestRate` works, and when to use it in your plan. It's a great starting point for cautious investors looking for stability.",
          difficulty: "Beginner",
          relatedMetrics: ["liquidity", "interestRate"]
        },
        {
          title: "Inflation Risks",
          content: "While cash is safe, it has a hidden risk: inflation. The `inflationRisk` happens when prices rise faster than your `interestRate`. For example, if your savings account earns 1% but inflation is 3%, your money loses 2% in buying power each year—$1,000 feels like $980 after a year. This section explains how inflation erodes your savings over time and why keeping too much in cash can hurt your long-term goals. You'll learn to watch `inflationRisk` and decide when to move money into other investments, like bonds, for better returns.",
          difficulty: "Beginner",
          relatedMetrics: ["inflationRisk", "interestRate"]
        },
        {
          title: "High-Yield Savings Options",
          content: "Not all cash investments are the same! Beyond regular savings accounts, you can use high-yield savings accounts or `moneyMarket` funds, which often pay higher `interestRate` (e.g., 2% instead of 0.5%). Certificates of Deposit (CDs) lock your money for a set time (e.g., 1 year) but offer better `cdRates`, like 3%. These options still keep your money safe and liquid, but they help you earn more. This section explores these alternatives, teaching you how to compare `interestRate` and `cdRates` to get the most from your cash. It's a step toward making your savings work harder.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestRate", "cdRates"]
        },
        {
          title: "Opportunity Costs of Cash",
          content: "Holding too much cash can cost you more than you think! The `opportunityCost` is what you miss out on by not investing elsewhere—like earning 5% in bonds or 8% in stocks instead of 1% in cash. For example, $10,000 in cash at 1% grows to $10,100 in a year, but in stocks at 8%, it could've been $10,800—a $700 difference! This section explains how `opportunityCost` affects your long-term goals and why balancing cash with other investments can grow your money faster. It's an advanced concept for users ready to think beyond safety.",
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
          content: "Islamic finance follows Sharia (Islamic law) principles that prohibit interest (riba) and promote ethical investing. Instead of traditional interest-based loans, Islamic finance uses `profitSharing` arrangements where both parties share in profits and losses. This creates a more equitable system where risk is shared fairly. Islamic finance also avoids investments in prohibited industries like alcohol, gambling, or weapons. This section introduces the core principles of Islamic finance and how they differ from conventional banking.",
          difficulty: "Beginner",
          relatedMetrics: ["profitSharing", "shariaCompliance"]
        },
        {
          title: "Sharia-Compliant Investment Vehicles",
          content: "Islamic investments use unique structures like Mudarabah (profit-sharing), Musharakah (partnership), and Sukuk (Islamic bonds). Mudarabah allows one party to provide capital while the other provides expertise, sharing profits according to agreed ratios. Musharakah creates true partnerships where all parties contribute capital and share both profits and losses. Sukuk are asset-backed securities that comply with Sharia law. These structures ensure `shariaCompliance` while providing investment opportunities that align with Islamic values.",
          difficulty: "Beginner",
          relatedMetrics: ["shariaCompliance", "profitSharing"]
        },
        {
          title: "Screening and Compliance",
          content: "Islamic investment screening involves checking companies for Sharia compliance through `ethicalScreening` processes. This includes avoiding companies with high `debtRatio` (typically over 33%), those involved in prohibited activities, or those earning significant interest income. Islamic funds use specialized screening committees to ensure investments meet Sharia standards. This section explains how to evaluate investments for Islamic compliance and understand the screening criteria used by Islamic financial institutions.",
          difficulty: "Intermediate",
          relatedMetrics: ["ethicalScreening", "debtRatio", "shariaCompliance"]
        },
        {
          title: "Islamic Banking Products",
          content: "Islamic banking offers alternatives to conventional products. Instead of savings accounts earning interest, Islamic banks offer `interestFree` savings accounts that may share profits from halal investments. Home financing uses diminishing Musharakah where the bank and customer jointly own the property, with the customer gradually buying out the bank's share. Islamic credit cards avoid interest charges, instead charging fixed fees for services. This section covers the main Islamic banking products and how they work differently from conventional banking.",
          difficulty: "Intermediate",
          relatedMetrics: ["interestFree", "profitSharing"]
        },
        {
          title: "Global Islamic Finance Markets",
          content: "The global Islamic finance market has grown significantly, with Malaysia, Saudi Arabia, and the UAE leading in Islamic banking assets. Islamic finance principles are increasingly adopted by conventional institutions seeking ethical investment options. The market includes Islamic mutual funds, ETFs, and even Islamic fintech solutions. Understanding `shariaCompliance` requirements across different jurisdictions helps investors navigate this growing market. This section explores the global landscape of Islamic finance and emerging opportunities.",
          difficulty: "Advanced",
          relatedMetrics: ["shariaCompliance", "ethicalScreening"]
        },
        {
          title: "Risk Management in Islamic Finance",
          content: "Islamic finance faces unique risks including Sharia compliance risk, where investments may become non-compliant due to business changes. Operational risk is higher due to complex `profitSharing` structures requiring careful monitoring. Liquidity risk can be challenging since Islamic banks cannot access conventional interbank lending. However, Islamic finance promotes more stable, asset-backed investments that can reduce overall portfolio risk. This section covers risk management strategies specific to Islamic finance investments.",
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
          content: "ESG (Environmental, Social, Governance) investing considers how companies impact the world beyond just financial returns. Environmental factors include `carbonFootprint`, energy efficiency, and waste management. Social factors cover labor practices, community relations, and product safety. Governance examines board diversity, executive compensation, and transparency. Companies with strong ESG practices often show better long-term performance and lower risk. This section introduces ESG investing and why it matters for both returns and impact.",
          difficulty: "Beginner",
          relatedMetrics: ["esgScore", "carbonFootprint"]
        },
        {
          title: "Environmental Factors",
          content: "Environmental criteria focus on how companies manage their impact on the planet. Key metrics include `carbonFootprint` (greenhouse gas emissions), water usage, renewable energy adoption, and waste reduction. Companies with low `carbonFootprint` and strong environmental policies often have competitive advantages as regulations tighten. Environmental investing also includes clean energy, sustainable agriculture, and green technology sectors. This section explains how to evaluate companies' environmental performance and identify sustainable investment opportunities.",
          difficulty: "Beginner",
          relatedMetrics: ["carbonFootprint", "sustainabilityRating"]
        },
        {
          title: "Social Impact Investing",
          content: "Social factors examine how companies treat people - employees, customers, and communities. This includes fair labor practices, workplace diversity, product safety, and community engagement. `socialImpact` investing goes further by actively seeking investments that create positive social change, such as affordable housing, education technology, or healthcare access. Companies with strong social practices often have better employee retention, customer loyalty, and brand reputation. This section covers social investing strategies and how to measure social impact.",
          difficulty: "Intermediate",
          relatedMetrics: ["socialImpact", "esgScore"]
        },
        {
          title: "Governance and Corporate Ethics",
          content: "Governance examines how companies are managed and controlled. Key factors include board independence, executive compensation alignment, shareholder rights, and transparency. Strong `governanceScore` indicates companies with ethical leadership, clear policies, and accountability mechanisms. Poor governance can lead to scandals, regulatory issues, and financial losses. This section explains how to assess corporate governance and why it's crucial for long-term investment success.",
          difficulty: "Intermediate",
          relatedMetrics: ["governanceScore", "esgScore"]
        },
        {
          title: "ESG Rating Systems",
          content: "ESG ratings help investors compare companies' sustainability performance. Major rating agencies use different methodologies, so understanding their approaches is important. `sustainabilityRating` systems typically score companies on environmental, social, and governance factors, often using letter grades or numerical scores. Some focus on risk management while others emphasize positive impact. This section explains how to interpret ESG ratings and use them in investment decisions.",
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
          content: "Measuring ESG performance requires both quantitative metrics and qualitative assessment. `carbonFootprint` reduction, `socialImpact` metrics, and `governanceScore` improvements can be tracked over time. However, ESG impact often takes years to materialize, requiring patient capital and long-term thinking. Investors should look for companies with clear ESG targets, regular reporting, and third-party verification. This section covers how to measure and track ESG performance in your investment portfolio.",
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
          content: "Investment risk refers to the possibility of losing money or not achieving expected returns. Understanding different types of risk is crucial for making informed investment decisions and protecting your portfolio from significant losses."
        },
        {
          title: "Types of Investment Risk",
          difficulty: "Beginner",
          content: "Common types of investment risk include market risk (overall market movements), credit risk (borrower default), liquidity risk (difficulty selling assets), inflation risk (purchasing power erosion), and concentration risk (overexposure to specific assets or sectors)."
        },
        {
          title: "Risk Measurement Tools",
          difficulty: "Intermediate",
          content: "Key risk measurement tools include volatility (price fluctuation), beta (sensitivity to market movements), Value at Risk (VaR) (potential loss over a time period), maximum drawdown (largest peak-to-trough decline), and Sharpe ratio (risk-adjusted returns)."
        },
        {
          title: "Diversification Strategies",
          difficulty: "Intermediate",
          content: "Diversification reduces risk by spreading investments across different asset classes, sectors, geographic regions, and investment styles. Effective diversification can help reduce portfolio volatility while maintaining return potential."
        },
        {
          title: "Risk Management Techniques",
          difficulty: "Advanced",
          content: "Advanced risk management techniques include hedging (using derivatives to offset risk), position sizing (limiting exposure to individual investments), stop-loss orders (automatic selling at predetermined prices), and dynamic asset allocation (adjusting portfolio based on market conditions)."
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
          content: "Market analysis involves evaluating securities, sectors, or entire markets to make informed investment decisions. It combines fundamental analysis (examining company financials and business prospects) with technical analysis (studying price patterns and market trends)."
        },
        {
          title: "Fundamental Analysis Basics",
          difficulty: "Beginner",
          content: "Fundamental analysis evaluates a company's intrinsic value by examining financial statements, business model, competitive position, management quality, and industry trends. This approach helps identify undervalued or overvalued investments."
        },
        {
          title: "Technical Analysis Basics",
          difficulty: "Intermediate",
          content: "Technical analysis studies price movements, volume patterns, and market indicators to predict future price direction. Common tools include chart patterns, moving averages, support and resistance levels, and momentum indicators."
        },
        {
          title: "Economic Analysis",
          difficulty: "Intermediate",
          content: "Economic analysis examines macroeconomic factors that affect markets, including interest rates, inflation, GDP growth, employment data, and central bank policies. Understanding these factors helps assess overall market conditions and sector opportunities."
        },
        {
          title: "Sector Analysis",
          difficulty: "Advanced",
          content: "Sector analysis evaluates different industry groups to identify trends, opportunities, and risks. This involves understanding sector-specific drivers, regulatory changes, technological disruption, and cyclical patterns that affect performance."
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
          content: "Modern Portfolio Theory (MPT) suggests that investors can construct optimal portfolios by combining assets with different risk-return characteristics. The goal is to maximize expected return for a given level of risk or minimize risk for a given level of expected return."
        },
        {
          title: "Asset Allocation Strategies",
          difficulty: "Beginner",
          content: "Asset allocation involves dividing investments among different asset classes (stocks, bonds, real estate, commodities). Common strategies include strategic allocation (long-term target weights), tactical allocation (short-term adjustments), and dynamic allocation (rules-based rebalancing)."
        },
        {
          title: "Risk-Return Optimization",
          difficulty: "Intermediate",
          content: "Portfolio optimization uses mathematical models to find the optimal combination of assets. The efficient frontier represents portfolios that offer the highest expected return for each level of risk. Investors choose portfolios based on their risk tolerance and return objectives."
        },
        {
          title: "Rebalancing Strategies",
          difficulty: "Intermediate",
          content: "Rebalancing involves periodically adjusting portfolio weights to maintain target allocations. Strategies include calendar-based rebalancing (quarterly, annually), threshold-based rebalancing (when allocations drift significantly), and momentum-based rebalancing (adjusting based on performance trends)."
        },
        {
          title: "Advanced Portfolio Techniques",
          difficulty: "Advanced",
          content: "Advanced techniques include factor investing (targeting specific risk factors), alternative investments (hedge funds, private equity, commodities), international diversification, and risk parity (equal risk contribution from each asset). These strategies can enhance diversification and potentially improve risk-adjusted returns."
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
    }
  };