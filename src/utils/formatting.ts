import type { Language } from "../types/calculator";

export function formatCurrency(value: number, language: Language) {
  return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatPercent(value: number, language: Language) {
  const formatted = new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted}${language === "fa" ? "٪" : "%"}`;
}

export function formatInputNumber(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

export function parseInputNumber(value: string) {
  const parsed = Number(value.replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}
