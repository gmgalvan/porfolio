import type { Locale } from "@/i18n/ui";
import { ui } from "@/i18n/ui";

function toMonths(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function currentYearMonth(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** "Jun 2017" / "jun 2017" */
export function formatMonth(ym: string, locale: Locale): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

/** "Jun 2017 – Dec 2018" / "Feb 2024 – Present" */
export function formatPeriod(start: string, end: string | null, locale: Locale): string {
  return `${formatMonth(start, locale)} – ${end ? formatMonth(end, locale) : ui[locale].present}`;
}

/** Certification dates: "Oct 2024 – Oct 2026", "Sep 2020", "Valid until Oct 2026", or "". */
export function formatCertificationDates(issued: string | null, expires: string | null, locale: Locale): string {
  if (issued && expires) return `${formatMonth(issued, locale)} – ${formatMonth(expires, locale)}`;
  if (issued) return formatMonth(issued, locale);
  if (expires) return `${ui[locale].validUntil} ${formatMonth(expires, locale)}`;
  return "";
}

/** Inclusive month count, e.g. 2019-02 → 2019-11 = 10 months. Ongoing periods count until `now`. */
export function monthsBetween(start: string, end: string | null, now = new Date()): number {
  return toMonths(end ?? currentYearMonth(now)) - toMonths(start) + 1;
}

/** "1 yr 7 mos" / "1 año 7 meses" */
export function formatDuration(start: string, end: string | null, locale: Locale, now = new Date()): string {
  const total = Math.max(1, monthsBetween(start, end, now));
  return ui[locale].duration(Math.floor(total / 12), total % 12);
}
