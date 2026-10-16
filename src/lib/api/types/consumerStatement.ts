export type BalanceDirection = "up" | "down" | "flat";

export interface ConsumerStatementMonth {
  period: string;
  openingBalance: number;
  closingBalance: number;
  moneyIn: number;
  moneyOut: number;
  direction: BalanceDirection;
  debtRepayments: number;
  debtShare: number;
  debtShareOfIncome: number;
  debtAndRentShareOfIncome: number;
  surplus: number;
  cashWithdrawals: number;
  offStatementAmount: number;
  offStatementShare: number;
  livingCosts: number;
  cardPaymentRepeats: boolean;
}

export interface ConsumerStatementReading {
  months: ConsumerStatementMonth[];
  income: {
    salaryDetected: boolean;
    salaryAmount: number | null;
    salaryDay: number | null;
    salaryStable: boolean;
    sideIncomeAmount: number | null;
    sideIncomeStable: boolean;
  };
  runway: {
    balance: number;
    livingCostMonthly: number;
    mustPayMonthly: number;
    weeksOfLivingCosts: number;
    weeksOfMustPay: number;
  };
  minimumPayment: boolean;
  newLoanInLatestMonth: boolean;
  product: {
    suggestBuffer: boolean;
    suggestMoreCredit: boolean;
    episodicTravel: boolean;
    offerFamilies: string[];
  };
  labeledSpend: Record<string, number>;
}
