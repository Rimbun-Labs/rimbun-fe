import { MetricCategory } from './metrics';

interface MetricExplanation {
  overview: string;
  details: string;
  practiceQuestion: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

interface MetricContent {
  [key: string]: {
    [key in MetricCategory]?: MetricExplanation;
  };
}

export const metricContent: MetricContent = {
  historicalReturn: {
    Growth: {
      overview: "Historical return shows how much a stock's value has grown in the past, helping you see its growth over time.",
      details: "Historical return measures the increase in a stock's value over a period, including any extra money paid out, like a bonus. For example, if a stock's value goes from $50 to $60 in a year and pays a $1 bonus, the return is 22%. It helps you understand how the stock did before, but the future might be different. Check past patterns to learn more, and we'll guide you as you go!",
      practiceQuestion: {
        question: "If a stock's value rises from $50 to $60 and pays a $1 bonus in a year, what's its historical return?",
        options: ["10%", "12%", "20%", "22%"],
        correct: 3,
        explanation: "Historical return = ((Ending Value - Starting Value + Bonus) / Starting Value) × 100 = (($60 - $50 + $1) / $50) × 100 = 22%. This includes the value increase and bonus."
      }
    }
  },
  appreciation: {
    Growth: {
      overview: "Appreciation shows how much an investment's value has increased over time, helping you see its growth potential.",
      details: "Appreciation measures how much an investment's value has gone up over a period. For example, if an investment's value rises from $100 to $150 in three years, that's a 50% increase. It helps you understand how much the investment has grown, which can add to your overall gains. However, market changes can affect future growth. Compare it to other investments to understand its growth better. We'll explore more as you learn!",
      practiceQuestion: {
        question: "If a stock's price rises from $100 to $150 over 3 years, what's the total appreciation?",
        options: ["33%", "50%", "75%", "150%"],
        correct: 1,
        explanation: "Appreciation = ((Ending Value - Starting Value) / Starting Value) × 100 = (($150 - $100) / $100) × 100 = 50%. This shows the value increase over time."
      }
    }
  },
  volatility: {
    Risk: {
      overview: "Volatility tells you how much a stock's price moves up and down, helping you understand its risk level.",
      details: "Volatility measures how much a stock's price changes over time, showing how risky it might be. A stock that moves 25% in a month has high volatility, meaning bigger price swings, while one that moves 5% is more stable. Larger swings can mean higher risk but also a chance for bigger gains. Think about how comfortable you are with price changes as you choose stocks. Let's learn more about risk as we go!",
      practiceQuestion: {
        question: "If a stock's price changes a lot each month, what does that tell you?",
        options: ["It's very stable", "It has high volatility", "It will definitely grow", "It has low risk"],
        correct: 1,
        explanation: "High volatility means the price moves a lot, making it riskier but with potential for bigger gains. Option A is incorrect because stable means small changes, and Option C is wrong because volatility doesn't guarantee growth."
      }
    }
  },
  beta: {
    Risk: {
      overview: "Beta shows how much a stock moves with the overall market, helping you understand its risk compared to the market.",
      details: "Beta measures how a stock's price changes when the market changes. A value of 1 means it moves the same as the market, while 1.5 means it moves 50% more, making it riskier. A value of 0.5 means it moves less, suggesting lower risk. For example, if the market rises 10%, a stock with a beta of 1.5 might rise 15%. It helps you see how market changes affect the stock. We'll dive deeper as you learn!",
      practiceQuestion: {
        question: "If a stock's beta is 1.5 and the market rises 10%, how much might the stock rise?",
        options: ["5%", "10%", "15%", "20%"],
        correct: 2,
        explanation: "Beta of 1.5 means the stock moves 1.5 times the market. If the market rises 10%, the stock might rise 15% (1.5 × 10%), assuming it follows the market trend."
      }
    }
  },
  sharpeRatio: {
    Risk: {
      overview: "The Sharpe Ratio shows if a stock's extra gains are worth the risk, helping you pick better options.",
      details: "The Sharpe Ratio compares a stock's extra gains to its risk, using a safe choice like a government bond as a baseline. For example, if a stock gains 10%, the safe choice is 2%, and its price swings 15%, the ratio is 0.53, meaning you get 0.53 units of extra gain per unit of risk. A higher number means better gains for the risk. Use it to compare stocks, but risk isn't fully captured. We'll guide you more as you go!",
      practiceQuestion: {
        question: "If a stock gains 8%, the safe choice is 2%, and its price swings 10%, what's the Sharpe Ratio?",
        options: ["0.2", "0.4", "0.6", "0.8"],
        correct: 2,
        explanation: "Sharpe Ratio = (Gain - Safe Choice) / Price Swings = (8% - 2%) / 10% = 0.6. This shows 0.6 units of extra gain per unit of risk."
      }
    }
  },
  trackingError: {
    Risk: {
      overview: "Tracking error shows how much a stock fund differs from its target, helping you see if it follows its goal.",
      details: "Tracking error measures how much a stock fund's gains differ from its target, like an index it's supposed to match. A 2% error means the fund might gain 8% when the target gains 10%. It helps you check if the fund sticks to its plan, though fees or market changes can affect it. For example, a fund with a 2% error might not match its target exactly. Use it to pick a fund that stays close to your goals. Let's learn more ahead!",
      practiceQuestion: {
        question: "If a fund's tracking error is 3% and the target gains 10%, what's a possible fund gain?",
        options: ["7%", "10%", "13%", "30%"],
        correct: 0,
        explanation: "A 3% tracking error means the fund can differ by up to 3%. If the target gains 10%, a possible fund gain is 7% (10% - 3%)."
      }
    }
  },
  expenseRatio: {
    Cost: {
      overview: "The expense ratio shows the yearly cost of owning a fund, helping you see how much you keep after fees.",
      details: "The expense ratio is the yearly fee you pay to own a fund, shown as a percentage of your investment. For example, a $10,000 fund with a 1% fee costs $100 a year, reducing what you keep. A lower fee means you keep more of your money over time. It's important to check this cost when choosing a fund, as small fees can add up. We'll help you save more as you learn!",
      practiceQuestion: {
        question: "If you have $20,000 in a fund with a 0.5% fee, how much do you pay each year?",
        options: ["$50", "$100", "$200", "$500"],
        correct: 1,
        explanation: "The fee is $20,000 × 0.5% = $100, reducing what you keep each year. Option C is incorrect because $200 would be a 1% fee, not 0.5%."
      }
    }
  },
  peRatio: {
    Valuation: {
      overview: "The P/E ratio helps you see if a stock's price matches the money it makes, showing if it's a good buy.",
      details: "The P/E ratio compares a stock's price to the money the company makes per share. For example, if a stock costs $150 and makes $6 per share, the ratio is 25, meaning you pay $25 for each $1 the company earns. A high number might mean people expect big growth, while a low number could suggest a better buy—but compare it to similar stocks. It helps you decide if the price is worth it. We'll guide you further as you learn!",
      practiceQuestion: {
        question: "If a stock costs $50 and makes $5 per share, is it a good buy if similar stocks cost $8 per $1 the company earns?",
        options: ["Yes", "No", "Maybe", "Can't tell"],
        correct: 1,
        explanation: "No, because $50 for $5 is $10 per $1 earned, higher than $8, suggesting it's not the best buy. Option A is incorrect because a lower number usually means a better deal."
      }
    }
  },
  creditRating: {
    Risk: {
      overview: "Credit rating shows how safe a bond is, helping you see the risk of not getting your money back.",
      details: "Credit rating measures how likely a bond issuer is to pay you back, based on their financial health. Ratings range from high (like AAA, very safe) to low (like BB, more risky). A higher rating means less risk of losing money, but it might offer lower gains. For example, a bond with a BBB rating has more risk than an AA-rated bond. Use this to pick bonds that match your comfort with risk. We'll guide you as you learn!",
      practiceQuestion: {
        question: "Is a bond with a BBB rating safer than one with an AA rating?",
        options: ["Yes", "No", "Maybe", "Can't tell"],
        correct: 1,
        explanation: "No, an AA rating is higher than BBB, meaning it's safer with less risk of not getting paid back. Option A is incorrect because a lower rating means more risk."
      }
    }
  },
  duration: {
    Risk: {
      overview: "Duration shows how much a bond's price might change if interest rates move, helping you understand its risk.",
      details: "Duration measures how sensitive a bond's price is to changes in interest rates. A duration of 5 means if rates rise by 1%, the bond's price might drop 5%. For example, a bond with a duration of 4 will lose more value than one with a duration of 2 if rates go up. It helps you see how risky a bond is to rate changes, so you can choose one that fits your plans. Let's learn more as we go!",
      practiceQuestion: {
        question: "If interest rates rise by 1% and a bond's duration is 4, how much might its price drop?",
        options: ["1%", "2%", "4%", "8%"],
        correct: 2,
        explanation: "Duration of 4 means a 1% rate rise might cause a 4% price drop (1% × 4). Option D is incorrect because it doubles the effect."
      }
    }
  },
  ytm: {
    Return: {
      overview: "Yield to Maturity (YTM) shows the total gain you might get from a bond if you hold it until it's due, helping you see its full return.",
      details: "Yield to Maturity (YTM) is the total yearly gain you might get from a bond if you keep it until it pays back your money, including interest payments and price changes. For example, a YTM of 5% on a $1,000 bond means you might earn $50 a year until it's due. It helps you compare bonds to see which gives the best return, but rates can change over time. We'll explore more as you learn!",
      practiceQuestion: {
        question: "If a $1,000 bond has a YTM of 4%, how much might you earn yearly until it's due?",
        options: ["$20", "$40", "$60", "$80"],
        correct: 1,
        explanation: "YTM of 4% on $1,000 means you might earn $1,000 × 4% = $40 yearly. Option C is incorrect because $60 would be a 6% YTM."
      }
    }
  },
  couponRate: {
    Income: {
      overview: "Coupon rate shows the yearly interest a bond pays, helping you see the income you'll get while holding it.",
      details: "Coupon rate is the yearly interest a bond pays, shown as a percentage of its starting value. For example, a $1,000 bond with a 4% coupon rate pays $40 each year in interest. It tells you how much steady income you'll get from the bond, which is useful if you want regular payments. The rate stays the same until the bond is due, but market changes might affect its price. We'll guide you as you go!",
      practiceQuestion: {
        question: "If a $1,000 bond has a 3% coupon rate, how much interest does it pay yearly?",
        options: ["$15", "$30", "$45", "$60"],
        correct: 1,
        explanation: "Coupon rate of 3% on $1,000 means it pays $1,000 × 3% = $30 yearly in interest. Option C is incorrect because $45 would be a 4.5% rate."
      }
    }
  },
  aum: {
    'ETF Liquidity': {
      overview: "Assets Under Management (AUM) shows the total value of a fund, helping you see its size and stability.",
      details: "Assets Under Management (AUM) is the total money invested in a fund, showing how big it is. For example, a fund with $500 million AUM is larger than one with $50 million, often meaning it's more stable and easier to trade. A bigger AUM can mean lower costs and better access to your money, but very large funds might be less flexible. Use this to pick a fund that fits your needs. Let's explore more as you go!",
      practiceQuestion: {
        question: "Which fund might be more stable: one with $100 million AUM or $1 billion AUM?",
        options: ["$100 million", "$1 billion", "Both are the same", "Can't tell"],
        correct: 1,
        explanation: "A $1 billion AUM fund is larger, often meaning more stability and easier trading. Option A is incorrect because smaller funds can be less stable."
      }
    }
  },
  tradingVolume: {
    'ETF Liquidity': {
      overview: "Trading volume shows how many shares of a fund are bought and sold daily, helping you see how easy it is to trade.",
      details: "Trading volume measures how many shares of a fund people buy and sell each day. A fund with 1 million shares traded daily is easier to buy or sell than one with 100,000 shares, because more people are trading it. High trading volume often means lower costs when you trade, as it's more active. Use this to pick a fund you can trade without delays. We'll guide you further as you learn!",
      practiceQuestion: {
        question: "Which fund might be easier to trade: one with 1 million shares traded daily or 100,000 shares?",
        options: ["1 million shares", "100,000 shares", "Both are the same", "Can't tell"],
        correct: 0,
        explanation: "1 million shares traded daily means more activity, making it easier to trade. Option B is incorrect because lower volume can mean delays or higher costs."
      }
    }
  },
  capRate: {
    Valuation: {
      overview: "Cap rate shows the yearly return you might get from a real estate investment, helping you see its value.",
      details: "Cap rate, or capitalization rate, measures the yearly return from a real estate property based on its income and value. It's the income after expenses divided by the property's price. For example, if a property makes $10,000 a year after expenses and costs $100,000, the cap rate is 10%. A higher cap rate might mean a better return but could also mean more risk. Use it to compare properties and see if the return fits your goals. We'll guide you as you learn!",
      practiceQuestion: {
        question: "If a property makes $20,000 yearly after expenses and costs $200,000, what's the cap rate?",
        options: ["5%", "10%", "15%", "20%"],
        correct: 1,
        explanation: "Cap rate = (Yearly Income After Expenses / Property Price) × 100 = ($20,000 / $200,000) × 100 = 10%. Option C is incorrect because $15% would need a $30,000 income."
      }
    }
  },
  cashFlow: {
    Income: {
      overview: "Cash flow shows the money you have left from a real estate investment each year, helping you see your actual income.",
      details: "Cash flow is the money you keep from a real estate property each year after paying all expenses, like maintenance or loans. For example, if a property earns $30,000 in rent but has $20,000 in expenses, your cash flow is $10,000. Positive cash flow means you're earning money, while negative means you're losing. It helps you understand if the property will bring in steady income. Let's explore more as you go!",
      practiceQuestion: {
        question: "If a property earns $40,000 in rent yearly but has $35,000 in expenses, what's the cash flow?",
        options: ["$5,000", "$10,000", "$15,000", "$20,000"],
        correct: 0,
        explanation: "Cash flow = Yearly Income - Expenses = $40,000 - $35,000 = $5,000. Option B is incorrect because $10,000 would need expenses of $30,000."
      }
    }
  },
  noi: {
    Income: {
      overview: "Net Operating Income (NOI) shows the yearly income a real estate property makes after expenses, helping you see its earning power.",
      details: "Net Operating Income (NOI) is the yearly income from a real estate property after subtracting operating expenses, like repairs or taxes, but before loan payments. For example, if a property earns $50,000 in rent and has $15,000 in expenses, the NOI is $35,000. It helps you see how much the property earns on its own, which is useful for comparing investments. Higher NOI means stronger earnings. We'll guide you further as you learn!",
      practiceQuestion: {
        question: "If a property earns $60,000 yearly and has $20,000 in operating expenses, what's the NOI?",
        options: ["$20,000", "$30,000", "$40,000", "$50,000"],
        correct: 2,
        explanation: "NOI = Yearly Income - Operating Expenses = $60,000 - $20,000 = $40,000. Option D is incorrect because $50,000 would need expenses of $10,000."
      }
    }
  },
  accessibility: {
    Liquidity: {
      overview: "Accessibility shows how easily you can get your money from a cash investment, helping you see how quickly you can use it.",
      details: "Accessibility measures how fast you can take your money out of a cash investment, like a savings account or money market fund. For example, a savings account might let you withdraw money anytime, while a certificate of deposit (CD) might lock it for a year. High accessibility means you can use your money quickly, but it might earn less. It helps you pick a cash option that fits your needs for quick access. We'll guide you as you learn!",
      practiceQuestion: {
        question: "Which cash investment likely has higher accessibility: a savings account or a one-year certificate of deposit (CD)?",
        options: ["Savings account", "One-year CD", "Both are the same", "Can't tell"],
        correct: 0,
        explanation: "A savings account usually lets you withdraw money anytime, while a one-year CD locks it for a year, so the savings account has higher accessibility. Option B is incorrect because CDs have more restrictions."
      }
    }
  },
  interestRate: {
    Return: {
      overview: "Interest rate shows the yearly gain you get from a cash investment, helping you see how much it will grow.",
      details: "Interest rate is the yearly percentage you earn on a cash investment, like a savings account or certificate of deposit (CD). For example, a $10,000 investment with a 2% interest rate earns $200 a year. It helps you understand how much your money will grow over time, but rates can change with the market. Higher rates mean more gains, but they might come with restrictions. We'll explore more as you go!",
      practiceQuestion: {
        question: "If you have $10,000 in a cash investment with a 3% interest rate, how much will you earn in a year?",
        options: ["$150", "$200", "$300", "$400"],
        correct: 2,
        explanation: "Interest = $10,000 × 3% = $300 earned in a year. Option D is incorrect because $400 would be a 4% rate."
      }
    }
  },
  inflationRisk: {
    Risk: {
      overview: "Inflation risk shows how much a cash investment might lose value over time, helping you understand its real growth.",
      details: "Inflation risk measures the chance that a cash investment's gains won't keep up with rising prices, called inflation. For example, if your investment earns 2% a year but inflation is 3%, your money's value drops by 1% in real terms. It helps you see if your cash will still buy as much in the future. Higher inflation means more risk of losing value. Let's learn more about protecting your money as we go!",
      practiceQuestion: {
        question: "If a cash investment earns 1% yearly but inflation is 3%, what's the real change in your money's value?",
        options: ["Gains 1%", "Loses 2%", "Gains 3%", "No change"],
        correct: 1,
        explanation: "Real change = Investment Gain - Inflation = 1% - 3% = -2%, meaning your money loses 2% in value. Option A is incorrect because inflation outpaces the gain."
      }
    }
  },
  dividendYield: {
    Income: {
      overview: "Dividend yield shows how much a company pays in dividends compared to its stock price, helping you see your potential income.",
      details: "Dividend yield is the yearly dividend payment divided by the stock's price, shown as a percentage. For example, if a stock costs $100 and pays $3 in yearly dividends, the yield is 3%. A higher yield means more income, but it's important to check if the company can keep paying dividends. Some companies, like utilities, often have higher yields (e.g., 4-5%), while growth companies might pay less or no dividends. Use this to find stocks that provide steady income. We'll guide you as you learn!",
      practiceQuestion: {
        question: "If a stock costs $50 and pays $2 in yearly dividends, what's the dividend yield?",
        options: ["2%", "4%", "6%", "8%"],
        correct: 1,
        explanation: "Dividend yield = (Yearly Dividend / Stock Price) × 100 = ($2 / $50) × 100 = 4%. Option A is incorrect because 2% would be a $1 dividend."
      }
    }
  }
};