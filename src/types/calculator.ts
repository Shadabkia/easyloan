export type Language = "fa" | "en";

export type StandardLoanResult = {
  loanAmount: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  effectiveAnnualRate: number;
};

export type BlockedMoneyResult = StandardLoanResult & {
  blockedAmount: number;
  blockingPeriod: number;
  opportunityCost: number;
  effectiveAmountReceived: number;
  nominalRate: number;
};

export type UpfrontFeeResult = StandardLoanResult & {
  upfrontFee: number;
  actualAmountReceived: number;
  numberOfPayments: number;
  nominalRate: number;
};
