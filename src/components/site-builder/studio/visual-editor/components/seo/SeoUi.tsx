import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Wand2,
} from "lucide-react";

import { getSeoFieldLengthStatus } from "../../../utils/pageSeoUtils";

/* ─── Design tokens ─── */

export const seoFieldClass =
  "h-12 w-full max-w-full rounded-2xl border border-slate-200/90 bg-white px-4 text-right text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80";

export const seoTextareaClass =
  "min-h-[108px] w-full resize-none rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80";

/* ─── SEO score ─── */

export type SeoScoreItem = {
  id: string;
  label: string;
  done: boolean;
  hint?: string;
};

export function computeSeoScore(items: SeoScoreItem[]): {
  score: number;
  items: SeoScoreItem[];
} {
  if (!items.length) return { score: 0, items };
  const done = items.filter((item) => item.done).length;
  return { score: Math.round((done / items.length) * 100), items };
}

export function SeoScoreCard({
  score,
  items,
}: {
  score: number;
  items: SeoScoreItem[];
}) {
  const tone =
    score >= 80
      ? "from-emerald-500 to-teal-500"
      : score >= 50
        ? "from-amber-500 to-orange-500"
        : "from-rose-500 to-pink-500";

  const label =
    score >= 80 ? "מצוין" : score >= 50 ? "בינוני" : "דורש שיפור";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="url(#seoScoreGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 188.5} 188.5`}
            />
            <defs>
              <linearGradient id="seoScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e"} />
                <stop offset="100%" stopColor={score >= 80 ? "#14b8a6" : score >= 50 ? "#f97316" : "#ec4899"} />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-black text-slate-900">{score}%</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-slate-900">ציון SEO לעמוד</p>
            <span
              className={`rounded-full bg-gradient-to-l ${tone} px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm`}
            >
              {label}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            השלימו את הפריטים למטה כדי לשפר את הנראות בגוגל וברשתות.
          </p>
        </div>
      </div>

      <div className="grid gap-1.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={[
              "flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold",
              item.done ? "text-emerald-700" : "text-slate-500",
            ].join(" ")}
            title={item.hint}
          >
            {item.done ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            ) : (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab bar ─── */

export function SeoTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: T; label: string; icon: React.ReactNode }>;
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="relative flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-3 pt-1 sm:px-7">
      {tabs.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={[
              "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition-all",
              isActive
                ? "bg-gradient-to-l from-blue-600 to-sky-500 text-white shadow-md shadow-blue-200/60"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900",
            ].join(" ")}
          >
            <span className={isActive ? "text-white/95" : "text-slate-400"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Smart fill banner ─── */

export function SeoSmartBanner({
  onApply,
  hint,
}: {
  onApply: () => void;
  hint?: string;
}) {
  return (
    <div className="relative mb-5 overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-l from-blue-600 via-blue-600 to-sky-500 p-[1px] shadow-lg shadow-blue-200/40">
      <div className="relative rounded-[calc(1.5rem-1px)] bg-gradient-to-l from-blue-600/95 to-sky-500/95 p-4">
        <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-sky-300/20 blur-xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm">
              <Wand2 className="h-5 w-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black text-white">SEO חכם — מילוי אוטומטי</p>
              <p className="text-xs font-semibold text-blue-50/90">
                נמלא כותרת, תיאור, מילות מפתח וכרטיס Schema מתוכן העמוד.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onApply}
            className="flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-blue-700 shadow-sm transition hover:scale-[1.02] hover:bg-blue-50 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" /> מלא אוטומטית
          </button>
        </div>

        {hint ? (
          <p className="relative mt-3 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Section card ─── */

export function SeoSection({
  icon,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3 border-b border-slate-100 bg-gradient-to-l from-slate-50/90 to-white px-4 py-3.5">
        {icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 text-blue-600 ring-1 ring-blue-100/80">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

/* ─── Field helpers ─── */

export function SeoFieldLabel({
  label,
  children,
  actions,
}: {
  label: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <div className="flex items-center gap-2">
        {actions}
        {children}
      </div>
    </div>
  );
}

export function SeoExampleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600 ring-1 ring-slate-200/60 transition hover:bg-slate-200"
    >
      <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> דוגמה
    </button>
  );
}

export function SeoLengthHint({
  value,
  idealMax,
  hardMax,
}: {
  value: string;
  idealMax: number;
  hardMax: number;
}) {
  const status = getSeoFieldLengthStatus(value, idealMax, hardMax);
  const length = String(value || "").length;
  const pct = Math.min(100, Math.round((length / idealMax) * 100));

  const barColor =
    status === "good"
      ? "bg-emerald-500"
      : status === "warn"
        ? "bg-amber-500"
        : status === "bad"
          ? "bg-rose-500"
          : "bg-slate-200";

  const textColor =
    status === "good"
      ? "text-emerald-600"
      : status === "warn"
        ? "text-amber-600"
        : status === "bad"
          ? "text-rose-600"
          : "text-slate-400";

  return (
    <div className="flex min-w-[120px] flex-col items-end gap-1">
      <p className={`text-[11px] font-black ${textColor}`}>
        {length}/{idealMax}
      </p>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SeoToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-l from-slate-50/80 to-white p-4">
      <div className="min-w-0">
        <p className="text-sm font-black text-slate-900">{label}</p>
        {description ? (
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-all",
          checked
            ? "bg-gradient-to-l from-blue-600 to-sky-500 shadow-inner shadow-blue-700/20"
            : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all",
            checked ? "right-0.5" : "right-[22px]",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function SeoHelpNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-2xl border border-blue-100/80 bg-gradient-to-l from-blue-50/90 to-sky-50/60 px-3.5 py-2.5 text-xs font-semibold leading-5 text-blue-900">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <span>{children}</span>
    </p>
  );
}

export function SeoActionLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-800"
    >
      <span className="text-slate-400 transition group-hover:text-blue-500">
        {icon}
      </span>
      {children}
      <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-60" />
    </a>
  );
}

/* ─── Previews ─── */

export function GooglePreviewCard({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[10px] font-black text-blue-600 shadow-sm ring-1 ring-slate-200/80">
          G
        </span>
        <span className="text-[11px] font-black text-slate-500">
          תצוגה מקדימה בגוגל
        </span>
      </div>
      <div className="p-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <p className="truncate text-lg font-medium text-[#1a0dab]">{title}</p>
          <p className="mt-1 flex items-center gap-1 truncate text-sm text-[#006621]">
            <span className="inline-block h-4 w-4 shrink-0 rounded-full bg-slate-100 text-[8px] leading-4 text-center text-slate-400">
              ›
            </span>
            {url.replace(/^https?:\/\//, "")}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function SocialPreviewCard({
  title,
  description,
  imageUrl,
  domain,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  domain: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1877f2] text-[10px] font-black text-white">
          f
        </span>
        <span className="text-[11px] font-black text-slate-500">
          תצוגה מקדימה לשיתוף
        </span>
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f0f2f5] shadow-sm">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
          ) : (
            <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-400">
              אין תמונת שיתוף
            </div>
          )}
          <div className="border-t border-slate-200 bg-white p-3.5">
            <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {domain}
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Advanced accordion ─── */

export function SeoAdvancedSection({
  icon,
  title,
  description,
  badge,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { label: string; tone: "recommended" | "optional" };
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-slate-50/70">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 text-blue-600 ring-1 ring-blue-100/80">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-slate-900">{title}</span>
            {badge ? (
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-black",
                  badge.tone === "recommended"
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/60"
                    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200/60",
                ].join(" ")}
              >
                {badge.label}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
            {description}
          </span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-slate-100 bg-gradient-to-b from-slate-50/50 to-white px-4 py-4">
        {children}
      </div>
    </details>
  );
}

export function SeoStatusPill({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
    warning: "bg-amber-50 text-amber-700 ring-amber-200/60",
    danger: "bg-rose-50 text-rose-700 ring-rose-200/60",
  };

  return (
    <div
      className={[
        "flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black ring-1",
        styles[tone],
      ].join(" ")}
    >
      {tone === "success" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      {children}
    </div>
  );
}
