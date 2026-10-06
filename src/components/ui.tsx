import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  ChevronDown,
  CircleDollarSign,
  Info,
  Languages,
  LoaderCircle,
  Menu,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { FieldError } from "react-hook-form";
import type { Language } from "../types/calculator";
import {
  formatCurrency,
  formatInputNumber,
  formatPercent,
  parseInputNumber,
} from "../utils/formatting";

export function Header({
  language,
  setLanguage,
  navigate,
  currentPath,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  navigate: (path: string) => void;
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);
  const fa = language === "fa";
  const links = [
    { label: fa ? "خانه" : "Home", path: "/" },
    { label: fa ? "محاسبه‌گرها" : "Calculators", path: "/#calculators" },
    { label: fa ? "درباره" : "About", path: "/#about" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 rounded-xl text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-teal-700 text-white shadow-sm">
            <CircleDollarSign size={22} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-base font-extrabold text-slate-900">
              {fa ? "وام‌سنج" : "LoanLens"}
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              {fa ? "هزینه واقعی وام" : "Real loan cost"}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label={fa ? "ناوبری اصلی" : "Main navigation"}>
          {links.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                currentPath === link.path || (link.path === "/" && currentPath === "/")
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(fa ? "en" : "fa")}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            aria-label={fa ? "Switch to English" : "تغییر زبان به فارسی"}
          >
            <Languages size={17} />
            {fa ? "EN" : "فا"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            aria-label={fa ? "باز کردن منو" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white p-3 md:hidden">
          {links.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => {
                navigate(link.path);
                setOpen(false);
              }}
              className="block w-full rounded-xl px-4 py-3 text-start text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>;
}

export function BackButton({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const fa = language === "fa";
  const Arrow = fa ? ArrowRight : ArrowLeft;
  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-500 transition hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
    >
      <Arrow size={17} />
      {fa ? "بازگشت به خانه" : "Back to home"}
    </button>
  );
}

export function CurrencyField({
  label,
  helper,
  value,
  onChange,
  error,
  placeholder,
  language,
}: {
  label: string;
  helper?: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: FieldError;
  placeholder: string;
  language: Language;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-800">{label}</span>
      {helper && <span className="mb-2.5 block text-xs leading-5 text-slate-500">{helper}</span>}
      <div className={`flex h-13 items-center rounded-xl border bg-white transition focus-within:ring-3 ${
        error
          ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-100"
          : "border-slate-200 focus-within:border-teal-600 focus-within:ring-teal-100"
      }`}>
        <input
          inputMode="decimal"
          value={formatInputNumber(value)}
          onChange={(event) => onChange(parseInputNumber(event.target.value))}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-base font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300"
          aria-invalid={Boolean(error)}
        />
        <span className="border-s border-slate-200 px-3 text-xs font-bold text-slate-500">
          {language === "fa" ? "ریال" : "IRR"}
        </span>
      </div>
      {error && <span className="mt-2 block text-xs font-semibold text-rose-600">{error.message}</span>}
    </label>
  );
}

export function NumberField({
  label,
  helper,
  value,
  onChange,
  error,
  placeholder,
  suffix,
}: {
  label: string;
  helper?: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: FieldError;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-800">{label}</span>
      {helper && <span className="mb-2.5 block text-xs leading-5 text-slate-500">{helper}</span>}
      <div className={`flex h-13 items-center rounded-xl border bg-white transition focus-within:ring-3 ${
        error
          ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-100"
          : "border-slate-200 focus-within:border-teal-600 focus-within:ring-teal-100"
      }`}>
        <input
          inputMode="decimal"
          value={value ?? ""}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(event.target.value === "" || !Number.isFinite(parsed) ? undefined : parsed);
          }}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-base font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300"
          aria-invalid={Boolean(error)}
        />
        {suffix && <span className="border-s border-slate-200 px-3 text-xs font-bold text-slate-500">{suffix}</span>}
      </div>
      {error && <span className="mt-2 block text-xs font-semibold text-rose-600">{error.message}</span>}
    </label>
  );
}

export function CalculatorLayout({
  title,
  description,
  icon: Icon,
  language,
  navigate,
  form,
  results,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  language: Language;
  navigate: (path: string) => void;
  form: ReactNode;
  results?: ReactNode;
}) {
  return (
    <PageShell>
      <BackButton language={language} navigate={navigate} />
      <div className="mb-9 flex max-w-3xl items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-800">
          <Icon size={24} />
        </span>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
        </div>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">{form}</section>
        <section aria-live="polite">{results ?? <EmptyResult language={language} />}</section>
      </div>
    </PageShell>
  );
}

export function LoadingResult({ language }: { language: Language }) {
  const fa = language === "fa";
  return (
    <div
      className="grid min-h-72 place-items-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      role="status"
    >
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
          <LoaderCircle className="animate-spin" size={25} />
        </span>
        <p className="mt-4 font-extrabold text-slate-700">{fa ? "در حال محاسبه" : "Calculating"}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {fa ? "نتیجه به‌زودی نمایش داده می‌شود." : "Your result will appear in a moment."}
        </p>
      </div>
    </div>
  );
}

function EmptyResult({ language }: { language: Language }) {
  const fa = language === "fa";
  return (
    <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Calculator size={25} />
        </span>
        <p className="mt-4 font-extrabold text-slate-700">{fa ? "نتیجه اینجا نمایش داده می‌شود" : "Your result will appear here"}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{fa ? "اطلاعات وام را وارد کنید و دکمه محاسبه را بزنید." : "Enter your loan details and select calculate."}</p>
      </div>
    </div>
  );
}

export function ResultsPanel({
  language,
  value,
  title,
  subtitle,
  items,
  details,
}: {
  language: Language;
  value: string;
  title: string;
  subtitle: string;
  items: { label: string; value: string; emphasis?: boolean }[];
  details: ReactNode;
}) {
  const fa = language === "fa";
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl bg-teal-900 p-6 text-white shadow-xl shadow-teal-950/10 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-teal-50">
            {fa ? "نتیجه محاسبه" : "Your result"}
          </span>
          <ShieldCheck className="text-teal-300" size={24} />
        </div>
        <p className="text-sm font-bold text-teal-100">{title}</p>
        <p className="mt-2 text-4xl font-black tracking-tight sm:text-5xl" dir="ltr">{value}</p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-teal-100/80">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-4 ${
              item.emphasis ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-xs font-semibold leading-5 text-slate-500">{item.label}</p>
            <p className="mt-2 break-words text-base font-black text-slate-900" dir="ltr">{item.value}</p>
          </div>
        ))}
      </div>
      <details className="group rounded-2xl border border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-extrabold text-slate-800">
          {fa ? "نمایش جزئیات محاسبه" : "Show calculation details"}
          <ChevronDown className="transition group-open:rotate-180" size={18} />
        </summary>
        <div className="border-t border-slate-100 p-5 text-sm leading-7 text-slate-600">{details}</div>
      </details>
    </div>
  );
}

export function InfoBox({ language, variant }: { language: Language; variant: "standard" | "blocked" | "fee" }) {
  const fa = language === "fa";
  const text = variant === "blocked"
    ? fa ? "وقتی بخشی از پول در دسترس شما نیست، وام می‌تواند گران‌تر از نرخ اسمی باشد." : "If some money is unavailable to you, the loan can cost more than its nominal rate suggests."
    : variant === "fee"
      ? fa ? "کسر کارمزد یعنی پول کمتری دریافت می‌کنید، اما اقساط بر مبنای کل وام است." : "A deducted fee means you receive less while repayments are still based on the full loan."
      : fa ? "نرخ مؤثر، هزینه تقریبی سالانه وام بر اساس پول دریافتی و پرداخت‌های واقعی شماست." : "The effective rate is the approximate annual cost based on what you receive and actually pay.";
  return (
    <div className="flex gap-3 rounded-2xl bg-sky-50 p-4 text-sky-950">
      <Info className="mt-0.5 shrink-0 text-sky-700" size={18} />
      <div>
        <p className="text-sm font-extrabold">{fa ? "نرخ سود مؤثر چیست؟" : "What is the effective interest rate?"}</p>
        <p className="mt-1 text-xs leading-6 text-sky-900/75">{text}</p>
      </div>
    </div>
  );
}

export function RateComparison({
  nominal,
  effective,
  language,
}: {
  nominal: number;
  effective: number;
  language: Language;
}) {
  const fa = language === "fa";
  const width = Math.max(16, Math.min(100, (nominal / Math.max(effective, nominal)) * 100));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="font-extrabold text-slate-900">{fa ? "مقایسه نرخ اسمی و مؤثر" : "Nominal vs. effective rate"}</p>
      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
            <span>{fa ? "نرخ اسمی" : "Nominal rate"}</span><span dir="ltr">{formatPercent(nominal, language)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-400" style={{ width: `${width}%` }} /></div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs font-bold text-teal-800">
            <span>{fa ? "نرخ مؤثر" : "Effective rate"}</span><span dir="ltr">{formatPercent(effective, language)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-teal-100"><div className="h-full w-full rounded-full bg-teal-600" /></div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-500">
        {fa ? "نرخ مؤثر بالاتر است، چون در دوره مسدودی به تمام پول دسترسی ندارید." : "The effective rate is higher because you do not have full access to the money during the blocking period."}
      </p>
    </div>
  );
}

export function CashFlowTimeline({
  received,
  payment,
  payments,
  language,
}: {
  received: number;
  payment: number;
  payments: number;
  language: Language;
}) {
  const fa = language === "fa";
  const points = [
    { title: fa ? "امروز" : "Today", detail: `${fa ? "دریافت می‌کنید" : "You receive"} ${formatCurrency(received, language)}`, positive: true },
    { title: fa ? "ماه اول" : "Month 1", detail: `${fa ? "پرداخت" : "Pay"} ${formatCurrency(payment, language)}` },
    { title: "•••", detail: fa ? "اقساط ماهانه برابر" : "Equal monthly payments" },
    { title: `${fa ? "ماه" : "Month"} ${new Intl.NumberFormat(fa ? "fa-IR" : "en-US").format(payments)}`, detail: `${fa ? "پرداخت نهایی" : "Final payment"} ${formatCurrency(payment, language)}` },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="font-extrabold text-slate-900">{fa ? "مسیر جریان پول" : "Your cash flow"}</p>
      <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-4">
        {points.map((point, index) => (
          <div className="contents" key={point.title}>
            <div className="flex flex-col items-center">
              <span className={`mt-1 size-3 rounded-full ring-4 ${point.positive ? "bg-teal-600 ring-teal-100" : "bg-slate-400 ring-slate-100"}`} />
              {index < points.length - 1 && <span className="min-h-12 w-px flex-1 bg-slate-200" />}
            </div>
            <div className="pb-5">
              <p className="text-sm font-extrabold text-slate-800">{point.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{point.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-900">
        {fa ? "شما کمتر از مبلغ اسمی دریافت می‌کنید، اما بازپرداخت بر پایه کل مبلغ وام است." : "You receive less than the nominal amount, but repay based on the full loan."}
      </p>
    </div>
  );
}

export function SubmitButton({
  language,
  disabled,
  loading,
}: {
  language: Language;
  disabled?: boolean;
  loading?: boolean;
}) {
  const fa = language === "fa";
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading}
      className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {loading ? <LoaderCircle className="animate-spin" size={18} /> : <Calculator size={18} />}
      {loading ? (fa ? "در حال محاسبه" : "Calculating") : fa ? "محاسبه وام" : "Calculate loan"}
    </button>
  );
}

export function Footer({ language }: { language: Language }) {
  const fa = language === "fa";
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>{fa ? "وام‌سنج؛ برای تصمیم‌گیری مالی آگاهانه‌تر" : "LoanLens — clearer numbers, better loan decisions."}</p>
        <p>{fa ? "نتایج تقریبی‌اند و جایگزین مشاوره مالی نیستند." : "Estimates only; not financial advice."}</p>
      </div>
    </footer>
  );
}
