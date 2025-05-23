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
    }
  };