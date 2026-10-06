import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { calculateBlockedMoney } from "../calculations/loans";
import {
  CalculatorLayout,
  CurrencyField,
  InfoBox,
  LoadingResult,
  NumberField,
  RateComparison,
  ResultsPanel,
  SubmitButton,
} from "../components/ui";
import { useSimulatedCalculation } from "../hooks/useSimulatedCalculation";
import type { BlockedMoneyResult, Language } from "../types/calculator";
import { formatCurrency, formatPercent } from "../utils/formatting";

type FormValues = {
  loanAmount: number;
  annualRate: number;
  numberOfPayments: number;
  blockedAmount: number;
  blockingPeriod: number;
  expectedReturn: number;
};

export default function BlockedMoney({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const fa = language === "fa";
  const required = fa ? "این مقدار را وارد کنید." : "Please enter a value.";
  const positive = fa ? "مقدار باید بیشتر از صفر باشد." : "Value must be greater than zero.";
  const nonnegative = fa ? "مقدار نمی‌تواند منفی باشد." : "Value cannot be negative.";
  const schema = z.object({
    loanAmount: z.number({ error: required }).positive(positive),
    annualRate: z.number({ error: required }).min(0, nonnegative),
    numberOfPayments: z.number({ error: required }).int().positive(positive),
    blockedAmount: z.number({ error: required }).min(0, nonnegative),
    blockingPeriod: z.number({ error: required }).min(0, nonnegative),
    expectedReturn: z.number({ error: required }).min(0, nonnegative),
  }).superRefine((values, context) => {
    if (values.blockedAmount > values.loanAmount) {
      context.addIssue({
        code: "custom",
        path: ["blockedAmount"],
        message: fa ? "مبلغ مسدود نمی‌تواند بیشتر از مبلغ وام باشد." : "Blocked amount cannot be greater than the loan amount.",
      });
    }
  });
  const { result, loading, calculate } = useSimulatedCalculation<BlockedMoneyResult>();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <CalculatorLayout
      title={fa ? "وام با پول مسدود" : "Loan with Blocked Money"}
      description={fa ? "اگر بانک بخشی از پول را موقتاً مسدود کند، بازدهی از‌دست‌رفته هزینه واقعی وام را افزایش می‌دهد." : "Estimate the real cost when the bank temporarily blocks part of your loan and you lose the return it could have earned."}
      icon={LockKeyhole}
      language={language}
      navigate={navigate}
      form={
        <form className="space-y-5" onSubmit={handleSubmit((values) => calculate(() => calculateBlockedMoney(values)))}>
          <Controller name="loanAmount" control={control} render={({ field }) => (
            <CurrencyField label={fa ? "مبلغ وام" : "Loan amount"} placeholder="4,000,000,000" language={language} value={field.value} onChange={field.onChange} error={errors.loanAmount} />
          )} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller name="annualRate" control={control} render={({ field }) => (
              <NumberField label={fa ? "نرخ سود سالانه" : "Annual interest rate"} helper={fa ? "نرخ اسمی وام" : "The nominal loan rate"} placeholder="4" suffix="%" value={field.value} onChange={field.onChange} error={errors.annualRate} />
            )} />
            <Controller name="numberOfPayments" control={control} render={({ field }) => (
              <NumberField label={fa ? "تعداد اقساط" : "Number of payments"} placeholder="24" suffix={fa ? "ماه" : "months"} value={field.value} onChange={field.onChange} error={errors.numberOfPayments} />
            )} />
          </div>
          <Controller name="blockedAmount" control={control} render={({ field }) => (
            <CurrencyField label={fa ? "مبلغ مسدود" : "Blocked amount"} helper={fa ? "بانک چه مبلغی را از دسترس شما خارج می‌کند؟" : "How much money will the bank keep unavailable to you?"} placeholder="4,000,000,000" language={language} value={field.value} onChange={field.onChange} error={errors.blockedAmount} />
          )} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller name="blockingPeriod" control={control} render={({ field }) => (
              <NumberField label={fa ? "دوره مسدودی" : "Blocking period"} placeholder="5" suffix={fa ? "ماه" : "months"} value={field.value} onChange={field.onChange} error={errors.blockingPeriod} />
            )} />
            <Controller name="expectedReturn" control={control} render={({ field }) => (
              <NumberField label={fa ? "بازده سالانه مورد انتظار" : "Expected annual return"} helper={fa ? "بازدهی احتمالی این پول" : "Return the money could earn"} placeholder="3.33" suffix="%" value={field.value} onChange={field.onChange} error={errors.expectedReturn} />
            )} />
          </div>
          <SubmitButton language={language} disabled={!isValid} loading={loading} />
          <InfoBox language={language} variant="blocked" />
        </form>
      }
      results={loading ? <LoadingResult language={language} /> : result && (
        <div className="space-y-5">
          <ResultsPanel
            language={language}
            title={fa ? "نرخ سود مؤثر سالانه" : "Effective annual interest rate"}
            value={formatPercent(result.effectiveAnnualRate, language)}
            subtitle={fa ? "برآورد هزینه واقعی سالانه پس از درنظرگرفتن پول مسدود و بازدهی ازدست‌رفته." : "Estimated actual annual cost after accounting for blocked money and its lost return."}
            items={[
              { label: fa ? "مبلغ مؤثر دریافتی" : "Effective amount received", value: formatCurrency(result.effectiveAmountReceived, language), emphasis: true },
              { label: fa ? "قسط ماهانه" : "Monthly payment", value: formatCurrency(result.monthlyPayment, language) },
              { label: fa ? "هزینه فرصت" : "Opportunity cost", value: formatCurrency(result.opportunityCost, language) },
              { label: fa ? "کل بازپرداخت" : "Total repayment", value: formatCurrency(result.totalRepayment, language) },
              { label: fa ? "مبلغ مسدود" : "Blocked amount", value: formatCurrency(result.blockedAmount, language) },
              { label: fa ? "دوره مسدودی" : "Blocking period", value: `${result.blockingPeriod} ${fa ? "ماه" : "months"}` },
            ]}
            details={
              <div className="space-y-2">
                <p>{fa ? "هزینه فرصت = مبلغ مسدود × ((۱ + بازده سالانه)^(ماه ÷ ۱۲) − ۱)" : "Opportunity cost = blocked amount × ((1 + annual return)^(months ÷ 12) − 1)"}</p>
                <p>{fa ? "مبلغ مؤثر دریافتی = مبلغ وام − هزینه فرصت" : "Effective amount received = loan amount − opportunity cost"}</p>
                <p>{fa ? "نرخ ماهانه از جریان نقدی مبلغ دریافتی و تمام اقساط به‌دست می‌آید و سپس سالانه می‌شود." : "The monthly rate is implied by the amount received and all payments, then annualized."}</p>
              </div>
            }
          />
          <RateComparison nominal={result.nominalRate} effective={result.effectiveAnnualRate} language={language} />
        </div>
      )}
    />
  );
}
