import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptText } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { calculateUpfrontFee } from "../calculations/loans";
import {
  CalculatorLayout,
  CashFlowTimeline,
  CurrencyField,
  InfoBox,
  LoadingResult,
  NumberField,
  RateComparison,
  ResultsPanel,
  SubmitButton,
} from "../components/ui";
import { useSimulatedCalculation } from "../hooks/useSimulatedCalculation";
import type { Language, UpfrontFeeResult } from "../types/calculator";
import { formatCurrency, formatPercent } from "../utils/formatting";

type FormValues = {
  loanAmount: number;
  annualRate: number;
  numberOfPayments: number;
  upfrontFee: number;
};

export default function UpfrontFee({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const fa = language === "fa";
  const required = fa ? "این مقدار را وارد کنید." : "Please enter a value.";
  const nonnegative = fa ? "مقدار نمی‌تواند منفی باشد." : "Value cannot be negative.";
  const schema = z.object({
    loanAmount: z.number({ error: required }).positive(fa ? "مبلغ وام باید بیشتر از صفر باشد." : "Loan amount must be greater than zero."),
    annualRate: z.number({ error: required }).min(0, nonnegative),
    numberOfPayments: z.number({ error: required }).int().positive(fa ? "تعداد اقساط باید بیشتر از صفر باشد." : "Payments must be greater than zero."),
    upfrontFee: z.number({ error: required }).min(0, nonnegative),
  }).superRefine((values, context) => {
    if (values.upfrontFee >= values.loanAmount) {
      context.addIssue({
        code: "custom",
        path: ["upfrontFee"],
        message: fa ? "کارمزد باید کمتر از مبلغ وام باشد." : "Upfront fee must be less than the loan amount.",
      });
    }
  });
  const { result, loading, calculate } = useSimulatedCalculation<UpfrontFeeResult>();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <CalculatorLayout
      title={fa ? "وام با کارمزد اولیه" : "Loan with Upfront Fee"}
      description={fa ? "هزینه واقعی وامی را ببینید که کارمزد آن پیش از واریز، از مبلغ وام کسر می‌شود." : "Calculate the real cost when the lender deducts a fee before giving you the money."}
      icon={ReceiptText}
      language={language}
      navigate={navigate}
      form={
        <form className="space-y-5" onSubmit={handleSubmit((values) => calculate(() => calculateUpfrontFee(values)))}>
          <Controller name="loanAmount" control={control} render={({ field }) => (
            <CurrencyField label={fa ? "مبلغ وام" : "Loan amount"} placeholder="4,000,000,000" language={language} value={field.value} onChange={field.onChange} error={errors.loanAmount} />
          )} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller name="annualRate" control={control} render={({ field }) => (
              <NumberField label={fa ? "نرخ سود سالانه" : "Annual interest rate"} helper={fa ? "نرخ اسمی اعلام‌شده" : "The stated nominal rate"} placeholder="23" suffix="%" value={field.value} onChange={field.onChange} error={errors.annualRate} />
            )} />
            <Controller name="numberOfPayments" control={control} render={({ field }) => (
              <NumberField label={fa ? "تعداد اقساط" : "Number of payments"} placeholder="24" suffix={fa ? "ماه" : "months"} value={field.value} onChange={field.onChange} error={errors.numberOfPayments} />
            )} />
          </div>
          <Controller name="upfrontFee" control={control} render={({ field }) => (
            <CurrencyField label={fa ? "کارمزد اولیه" : "Upfront fee"} helper={fa ? "این مبلغ پیش از واریز وام از آن کسر می‌شود." : "This amount is deducted before the loan is paid to you."} placeholder="600,000,000" language={language} value={field.value} onChange={field.onChange} error={errors.upfrontFee} />
          )} />
          <SubmitButton language={language} disabled={!isValid} loading={loading} />
          <InfoBox language={language} variant="fee" />
        </form>
      }
      results={loading ? <LoadingResult language={language} /> : result && (
        <div className="space-y-5">
          <ResultsPanel
            language={language}
            title={fa ? "نرخ سود مؤثر سالانه" : "Effective annual interest rate"}
            value={formatPercent(result.effectiveAnnualRate, language)}
            subtitle={fa ? "نرخ مؤثر از نرخ اسمی بالاتر است، چون کارمزد مبلغی را که واقعاً دریافت می‌کنید کاهش می‌دهد." : "Your effective rate is higher because the upfront fee reduces what you actually receive."}
            items={[
              { label: fa ? "مبلغ واقعی دریافتی" : "Actual amount received", value: formatCurrency(result.actualAmountReceived, language), emphasis: true },
              { label: fa ? "قسط ماهانه" : "Monthly payment", value: formatCurrency(result.monthlyPayment, language) },
              { label: fa ? "کارمزد اولیه" : "Upfront fee", value: formatCurrency(result.upfrontFee, language) },
              { label: fa ? "کل بازپرداخت" : "Total repayment", value: formatCurrency(result.totalRepayment, language) },
              { label: fa ? "مبلغ اسمی وام" : "Nominal loan amount", value: formatCurrency(result.loanAmount, language) },
              { label: fa ? "تعداد اقساط" : "Number of payments", value: String(result.numberOfPayments) },
            ]}
            details={
              <div className="space-y-2">
                <p>{fa ? "مبلغ واقعی دریافتی = مبلغ وام − کارمزد اولیه" : "Actual amount received = loan amount − upfront fee"}</p>
                <p>{fa ? "اقساط بر مبنای کل مبلغ اسمی وام محاسبه می‌شوند." : "Payments are calculated from the full nominal loan amount."}</p>
                <p>{fa ? "نرخ مؤثر از جریان نقدی مبلغ واقعی دریافتی در برابر تمام اقساط به‌دست می‌آید." : "The effective rate is implied by actual cash received versus all monthly payments."}</p>
              </div>
            }
          />
          <RateComparison nominal={result.nominalRate} effective={result.effectiveAnnualRate} language={language} />
          <CashFlowTimeline received={result.actualAmountReceived} payment={result.monthlyPayment} payments={result.numberOfPayments} language={language} />
        </div>
      )}
    />
  );
}
