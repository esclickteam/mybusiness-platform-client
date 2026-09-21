import React from "react";

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

export const POST_LABELS: Record<string, string> = {
  general: "General Discussion",
  collaboration: "Looking for Collaboration",
  question: "Business Question",
  advice: "Need Advice",
  opportunity: "Opportunity",
  market: "Market Question",
  feedback: "Feedback Request",
};

export function countryFlag(country?: string) {
  const code = COUNTRY_CODES[country || ""];
  if (!code) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function formatWhen(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
  const dim = size === "lg" ? "h-16 w-16" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  if (src) {
    return <img src={src} alt="" className={`${dim} rounded-2xl object-cover ring-1 ring-violet-100`} />;
  }
  return (
    <span className={`${dim} grid place-items-center rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700 ring-1 ring-indigo-100`}>
      {initials(name)}
    </span>
  );
}

export function ClubCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-violet-100/80 bg-white p-4 shadow-[0_10px_30px_rgba(99,102,241,0.06)] sm:p-5 ${className}`}>
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
      className={`inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
      className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-60 ${className}`}
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
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100";

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
      {children}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-violet-200 bg-white/70 px-4 py-10 text-center">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>
    </div>
  );
}
