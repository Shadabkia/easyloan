import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calculator,
  LockKeyhole,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import type { Language } from "../types/calculator";
import { formatPercent } from "../utils/formatting";

export default function Home({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const fa = language === "fa";
  const Arrow = fa ? ArrowLeft : ArrowRight;
  const cards = [
    {
      title: fa ? "وام استاندارد" : "Standard loan",
      description: fa
        ? "قسط ماهانه، کل بازپرداخت و سود وام معمولی را سریع ببینید."
        : "Calculate your monthly payment and total repayment for a regular loan.",
      icon: Calculator,
      path: "/calculators/standard-loan",
      badge: fa ? "محاسبه پایه" : "Simple estimate",
      accent: "bg-sky-50 text-sky-700",
    },
    {
      title: fa ? "وام با پول مسدود" : "Loan with blocked money",
      description: fa
        ? "ببینید مسدود شدن بخشی از پول، هزینه واقعی وام را چقدر افزایش می‌دهد."
        : "See the real cost when the bank keeps part of your money blocked.",
      icon: LockKeyhole,
      path: "/calculators/blocked-money",
      badge: fa ? "هزینه فرصت" : "Opportunity cost",
      accent: "bg-amber-50 text-amber-700",
    },
    {
      title: fa ? "وام با کارمزد اولیه" : "Loan with upfront fee",
      description: fa
        ? "نرخ واقعی وام را وقتی کارمزد پیش از پرداخت کسر می‌شود محاسبه کنید."
        : "Find the real rate when a fee is deducted before you receive the loan.",
      icon: ReceiptText,
      path: "/calculators/upfront-fee",
      badge: fa ? "نرخ واقعی" : "True rate",
      accent: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -start-24 top-20 size-72 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -end-20 -top-20 size-80 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-800">
              <Sparkles size={14} />
              {fa ? "محاسبه شفاف، تصمیم مطمئن" : "Clear numbers. Confident decisions."}
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {fa ? (
                <>وام شما <span className="text-teal-700">واقعاً</span> چقدر هزینه دارد؟</>
              ) : (
                <>What does your loan <span className="text-teal-700">really</span> cost?</>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {fa
                ? "نرخ اسمی همیشه همه‌چیز را نمی‌گوید. مبلغ دریافتی، کارمزد و پول مسدود را وارد کنید تا هزینه واقعی وام را در چند ثانیه بفهمید."
                : "Nominal rates do not tell the whole story. Add the amount, fees, and blocked funds to understand the true cost in seconds."}
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("calculators")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 inline-flex h-13 items-center gap-3 rounded-xl bg-teal-700 px-6 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
            >
              {fa ? "شروع محاسبه" : "Choose a calculator"}
              <Arrow size={18} />
            </button>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
              {[fa ? "رایگان و بدون ثبت‌نام" : "Free, no sign-up", fa ? "محاسبه فوری" : "Instant results", fa ? "فرمول‌های شفاف" : "Transparent math"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-teal-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
              <div className="rounded-3xl bg-teal-900 p-6 text-white">
                <p className="text-xs font-bold text-teal-200">{fa ? "نرخ اسمی وام" : "Nominal loan rate"}</p>
                <p className="mt-2 text-3xl font-black" dir="ltr">{formatPercent(18, language)}</p>
                <div className="my-6 h-px bg-white/10" />
                <p className="text-xs font-bold text-teal-200">{fa ? "نرخ مؤثر با هزینه‌ها" : "Effective rate with costs"}</p>
                <p className="mt-2 text-5xl font-black text-white" dir="ltr">{formatPercent(26.41, language)}</p>
                <p className="mt-4 text-xs leading-6 text-teal-100/75">
                  {fa ? "تفاوتی که پیش از امضای قرارداد باید بدانید." : "The difference worth knowing before you sign."}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{fa ? "مبلغ دریافتی" : "You receive"}</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{fa ? "۳٫۴ میلیارد" : "3.4 billion"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{fa ? "قسط ماهانه" : "Monthly payment"}</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{fa ? "۲۰۴ میلیون" : "204 million"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculators" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold text-teal-700">{fa ? "ابزار مناسب خودتان را انتخاب کنید" : "Choose the right tool"}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {fa ? "سه راه ساده برای دیدن هزینه واقعی" : "Three simple ways to see the real cost"}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            {fa ? "نوع وامتان را انتخاب کنید. هر محاسبه‌گر فقط اطلاعات ضروری را از شما می‌پرسد." : "Pick your loan type. Each calculator asks only for the information that matters."}
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.path} className="group flex min-h-80 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className={`grid size-13 place-items-center rounded-2xl ${card.accent}`}><Icon size={24} /></span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-500">{card.badge}</span>
                </div>
                <h3 className="mt-7 text-xl font-black text-slate-950">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{card.description}</p>
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="mt-6 flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-800 transition group-hover:border-teal-700 group-hover:bg-teal-700 group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  {fa ? "محاسبه کنید" : "Calculate"}
                  <Arrow size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold text-teal-700">{fa ? "شفاف، نه پیچیده" : "Clear, not complicated"}</p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{fa ? "عدد مهم‌تر را ببینید" : "See the number that matters"}</h2>
          </div>
          <p className="text-sm leading-8 text-slate-600">
            {fa
              ? "نرخ مؤثر سالانه نشان می‌دهد وام بر اساس پولی که واقعاً دریافت می‌کنید و اقساطی که واقعاً می‌پردازید، تقریباً چقدر برایتان هزینه دارد. جزئیات فرمول‌ها در دسترس است، اما مزاحم تصمیم‌گیری سریع شما نمی‌شود."
              : "The effective annual rate estimates what the loan costs based on the money you actually receive and the payments you actually make. Formula details are available without getting in the way of a quick decision."}
          </p>
        </div>
      </section>
    </main>
  );
}
