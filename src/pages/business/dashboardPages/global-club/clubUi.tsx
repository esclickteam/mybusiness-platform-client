import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { clubSend } from "./clubApi";

export const COUNTRIES = [
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile",
  "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany",
  "Greece", "India", "Ireland", "Israel", "Italy", "Japan", "Kenya", "Mexico",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Poland", "Portugal",
  "Singapore", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland",
  "United Arab Emirates", "United Kingdom", "United States",
];

const COUNTRY_CODES: Record<string, string> = {
  Argentina: "AR", Australia: "AU", Austria: "AT", Belgium: "BE", Brazil: "BR",
  Canada: "CA", Chile: "CL", China: "CN", Colombia: "CO", Denmark: "DK",
  Egypt: "EG", Finland: "FI", France: "FR", Germany: "DE", Greece: "GR",
  India: "IN", Ireland: "IE", Israel: "IL", Italy: "IT", Japan: "JP", Kenya: "KE",
  Mexico: "MX", Netherlands: "NL", "New Zealand": "NZ", Nigeria: "NG", Norway: "NO",
  Poland: "PL", Portugal: "PT", Singapore: "SG", "South Africa": "ZA",
  "South Korea": "KR", Spain: "ES", Sweden: "SE", Switzerland: "CH",
  "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US",
};

export const CATEGORIES = [
  "Professional services", "Marketing", "Software", "Retail", "Manufacturing",
  "Hospitality", "Health", "Education", "Finance", "Real estate", "Logistics",
  "Creative", "Consulting", "E-commerce", "Other",
];

export const POST_TYPE_KEYS = ["general", "collaboration", "question", "advice", "opportunity", "market", "feedback"] as const;

export function countryFlag(country?: string) {
  const code = COUNTRY_CODES[country || ""];
  if (!code) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function formatWhen(value?: string | null, locale?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale || undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatWhenRelative(value?: string | null, locale?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const delta = Date.now() - date.getTime();
  const minutes = Math.round(delta / 60000);
  try {
    const rtf = new Intl.RelativeTimeFormat(locale || undefined, { numeric: "auto" });
    if (Math.abs(minutes) < 60) return rtf.format(-minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(-hours, "hour");
    const days = Math.round(hours / 24);
    if (Math.abs(days) < 7) return rtf.format(-days, "day");
  } catch {
    /* fall through */
  }
  return formatWhen(value, locale);
}

export function formatCount(value: number, locale?: string) {
  return Number(value || 0).toLocaleString(locale || undefined);
}

export function initials(name?: string) {
  const parts = String(name || "C").trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "C";
}

export function ClubAvatar({
  name,
  photoUrl,
  logoUrl,
  size = "md",
}: {
  name?: string;
  photoUrl?: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const src = photoUrl || logoUrl;
  const dim = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-10 w-10" : "h-12 w-12";
  if (src) {
    return <img src={src} alt="" className={`${dim} rounded-full object-cover ring-2 ring-white shadow-[0_8px_24px_rgba(76,29,149,0.18)]`} />;
  }
  return (
    <span className={`${dim} grid place-items-center rounded-full bg-[linear-gradient(135deg,#F3EEFF,#E0E7FF)] text-sm font-black text-[#5B2CFF] ring-2 ring-white shadow-[0_8px_24px_rgba(76,29,149,0.12)]`}>
      {initials(name)}
    </span>
  );
}

export function ClubCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[24px] border border-violet-100/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] backdrop-blur-sm sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl bg-[#7C4DFF] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,77,255,0.28)] transition hover:bg-[#6B3FE8] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#7C4DFF]/40 hover:text-[#5B2CFF] disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#7C4DFF]/50 focus:ring-2 focus:ring-[#7C4DFF]/15";

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5B2CFF]">
      {children}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-violet-200 bg-white/80 px-4 py-12 text-center">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>
    </div>
  );
}

export function ClubSectionTitle({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker ? <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7C4DFF]">{kicker}</p> : null}
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function clubChipClass(active?: boolean) {
  return `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
    active ? "bg-[#7C4DFF] text-white shadow-[0_8px_18px_rgba(124,77,255,0.28)]" : "bg-white text-slate-600 ring-1 ring-violet-100 hover:text-[#5B2CFF]"
  }`;
}

export function ClubMemberText({
  text,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const [translated, setTranslated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!text) return null;
  return (
    <div>
      <p className={className}>{translated ?? text}</p>
      <button
        type="button"
        className="mt-1 text-xs font-semibold text-indigo-600"
        disabled={busy}
        onClick={async () => {
          if (translated) {
            setTranslated(null);
            return;
          }
          setBusy(true);
          try {
            const data = await clubSend<{ text: string }>("post", "/club/translate", {
              text,
              target: getIntlLocale(i18n.language),
            });
            setTranslated(data.text || text);
          } catch {
            setTranslated(text);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? t("club.common.translating") : translated ? t("club.common.showOriginal") : t("club.common.translate")}
      </button>
    </div>
  );
}
