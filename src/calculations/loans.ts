import type {
  BlockedMoneyResult,
  StandardLoanResult,
  UpfrontFeeResult,
} from "../types/calculator";

export function monthlyPayment(
  loanAmount: number,
  annualRatePercent: number,
  numberOfPayments: number,
) {
  const rate = annualRatePercent / 100 / 12;
  if (rate === 0) return loanAmount / numberOfPayments;
  return (loanAmount * rate) / (1 - Math.pow(1 + rate, -numberOfPayments));
}

function impliedMonthlyRate(
  amountReceived: number,
  payment: number,
  numberOfPayments: number,
) {
  if (payment * numberOfPayments <= amountReceived) return 0;

  let low = 0;
  let high = 1;
  for (let i = 0; i < 100; i += 1) {
    const rate = (low + high) / 2;
    const presentValue =
      (payment * (1 - Math.pow(1 + rate, -numberOfPayments))) / rate;
    if (presentValue > amountReceived) low = rate;
    else high = rate;
  }
  return (low + high) / 2;
}

function annualize(monthlyRate: number) {
  return (Math.pow(1 + monthlyRate, 12) - 1) * 100;
}

export function calculateStandardLoan(
  loanAmount: number,
  annualRate: number,
  numberOfPayments: number,
): StandardLoanResult {
  const payment = monthlyPayment(loanAmount, annualRate, numberOfPayments);
  const totalRepayment = payment * numberOfPayments;
  return {
    loanAmount,
    monthlyPayment: payment,
    totalRepayment,
    totalInterest: totalRepayment - loanAmount,
    effectiveAnnualRate: annualize(annualRate / 100 / 12),
  };
}

export function calculateBlockedMoney(input: {
  loanAmount: number;
  annualRate: number;
  numberOfPayments: number;
  blockedAmount: number;
  blockingPeriod: number;
  expectedReturn: number;
}): BlockedMoneyResult {
  const standard = calculateStandardLoan(
    input.loanAmount,
    input.annualRate,
    input.numberOfPayments,
  );
  const opportunityCost =
    input.blockedAmount *
    (Math.pow(1 + input.expectedReturn / 100, input.blockingPeriod / 12) - 1);
  const effectiveAmountReceived = input.loanAmount - opportunityCost;
  const rate = impliedMonthlyRate(
    effectiveAmountReceived,
    standard.monthlyPayment,
    input.numberOfPayments,
  );

  return {
    ...standard,
    blockedAmount: input.blockedAmount,
    blockingPeriod: input.blockingPeriod,
    opportunityCost,
    effectiveAmountReceived,
    nominalRate: input.annualRate,
    effectiveAnnualRate: annualize(rate),
  };
}

export function calculateUpfrontFee(input: {
  loanAmount: number;
  annualRate: number;
  numberOfPayments: number;
  upfrontFee: number;
}): UpfrontFeeResult {
  const standard = calculateStandardLoan(
    input.loanAmount,
    input.annualRate,
    input.numberOfPayments,
  );
  const actualAmountReceived = input.loanAmount - input.upfrontFee;
  const rate = impliedMonthlyRate(
    actualAmountReceived,
    standard.monthlyPayment,
    input.numberOfPayments,
  );

  return {
    ...standard,
    upfrontFee: input.upfrontFee,
    actualAmountReceived,
    numberOfPayments: input.numberOfPayments,
    nominalRate: input.annualRate,
    effectiveAnnualRate: annualize(rate),
  };
}
