import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { calculateStandardLoan } from "../calculations/loans";
import {
  CalculatorLayout,
  CurrencyField,
  InfoBox,
  LoadingResult,
  NumberField,
  ResultsPanel,
  SubmitButton,
} from "../components/ui";
import { useSimulatedCalculation } from "../hooks/useSimulatedCalculation";
import type { Language, StandardLoanResult } from "../types/calculator";
import { formatCurrency, formatPercent } from "../utils/formatting";

type FormValues = { loanAmount: number; annualRate: number; numberOfPayments: number };

export default function StandardLoan({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const fa = language === "fa";
  const required = fa ? "این مقدار را وارد کنید." : "Please enter a value.";
  const schema = z.object({
    loanAmount: z.number({ error: required }).positive(fa ? "مبلغ وام باید بیشتر از صفر باشد." : "Loan amount must be greater than zero."),
    annualRate: z.number({ error: required }).min(0, fa ? "نرخ سود نمی‌تواند منفی باشد." : "Interest rate cannot be negative."),
    numberOfPayments: z.number({ error: required }).int(fa ? "تعداد اقساط باید عدد صحیح باشد." : "Payments must be a whole number.").positive(fa ? "تعداد اقساط باید بیشتر از صفر باشد." : "Payments must be greater than zero."),
  });
  const { result, loading, calculate } = useSimulatedCalculation<StandardLoanResult>();
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <CalculatorLayout
      title={fa ? "محاسبه‌گر وام استاندارد" : "Standard Loan Calculator"}
      description={fa ? "جزئیات وام را وارد کنید تا قسط ماهانه و کل بازپرداخت را ببینید." : "Enter your loan details to calculate your monthly payment and total repayment."}
      icon={Calculator}
      language={language}
      navigate={navigate}
      form={
        <form className="space-y-5" onSubmit={handleSubmit((values) => calculate(() => calculateStandardLoan(values.loanAmount, values.annualRate, values.numberOfPayments)))}>
          <Controller name="loanAmount" control={control} render={({ field }) => (
            <CurrencyField label={fa ? "مبلغ وام" : "Loan amount"} placeholder="4,000,000,000" language={language} value={field.value} onChange={field.onChange} error={errors.loanAmount} />
          )} />
          <Controller name="annualRate" control={control} render={({ field }) => (
            <NumberField label={fa ? "نرخ سود سالانه" : "Annual interest rate"} helper={fa ? "نرخ سود اسمی سالانه اعلام‌شده توسط وام‌دهنده." : "The nominal annual interest rate provided by the lender."} placeholder="4" suffix="%" value={field.value} onChange={field.onChange} error={errors.annualRate} />
          )} />
          <Controller name="numberOfPayments" control={control} render={({ field }) => (
            <NumberField label={fa ? "تعداد اقساط" : "Number of payments"} helper={fa ? "تعداد کل پرداخت‌های ماهانه را وارد کنید." : "Enter the total number of monthly payments."} placeholder="24" suffix={fa ? "ماه" : "months"} value={field.value} onChange={field.onChange} error={errors.numberOfPayments} />
          )} />
          <SubmitButton language={language} disabled={!isValid} loading={loading} />
          <InfoBox language={language} variant="standard" />
        </form>
      }
      results={loading ? <LoadingResult language={language} /> : result && (
        <ResultsPanel
          language={language}
          title={fa ? "قسط ماهانه شما" : "Your monthly payment"}
          value={`${formatCurrency(result.monthlyPayment, language)} ${fa ? "ریال" : "IRR"}`}
          subtitle={fa ? "این مبلغ بر اساس نرخ اسمی و تعداد اقساط شما محاسبه شده است." : "Based on your nominal rate and number of monthly payments."}
          items={[
            { label: fa ? "مبلغ وام" : "Loan amount", value: formatCurrency(result.loanAmount, language) },
            { label: fa ? "کل بازپرداخت" : "Total repayment", value: formatCurrency(result.totalRepayment, language), emphasis: true },
            { label: fa ? "کل سود پرداختی" : "Total interest", value: formatCurrency(result.totalInterest, language) },
            { label: fa ? "نرخ مؤثر سالانه" : "Effective annual rate", value: formatPercent(result.effectiveAnnualRate, language) },
          ]}
          details={
            <div className="space-y-2">
              <p>{fa ? "نرخ ماهانه = نرخ سالانه ÷ ۱۲" : "Monthly rate = annual rate ÷ 12"}</p>
              <p>{fa ? "قسط ماهانه با فرمول استاندارد PMT محاسبه می‌شود." : "Monthly payment is calculated using the standard PMT formula."}</p>
              <p>{fa ? "کل بازپرداخت = قسط ماهانه × تعداد اقساط" : "Total repayment = monthly payment × number of payments"}</p>
              <p>{fa ? "کل سود = کل بازپرداخت − مبلغ وام" : "Total interest = total repayment − loan amount"}</p>
            </div>
          }
        />
      )}
    />
  );
}
