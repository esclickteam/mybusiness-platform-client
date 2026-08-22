import React from "react";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

export function CrmCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[28px] border border-purple-200 bg-white p-4 shadow-[0_18px_50px_rgba(124,77,255,0.06)] sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

export function LoadingState() {
  return (
    <CrmCard>
      <div className="flex min-h-48 items-center justify-center">
        <BizuplyLoader />
      </div>
    </CrmCard>
  );
}

export function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <CrmCard>
      <div className="py-12 text-center">
        <p className="text-base font-black text-slate-700">{title}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </CrmCard>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
      <p className="font-bold">{message || "אירעה שגיאה"}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 min-h-11 rounded-xl bg-white px-4 text-sm font-black text-rose-700"
        >
          נסו שוב
        </button>
      ) : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  compact = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { compact?: boolean }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg bg-[#7C4DFF] font-semibold text-white shadow-sm transition hover:bg-[#6B3FE8] disabled:opacity-50",
        compact ? "min-h-8 px-3 text-xs" : "min-h-9 px-4 text-sm",
        props.className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  compact = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { compact?: boolean }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50",
        compact ? "min-h-8 px-3 text-xs" : "min-h-9 px-4 text-sm",
        props.className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function CompactInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C4DFF]/50 focus:ring-2 focus:ring-[#7C4DFF]/10",
        className,
      ].join(" ")}
    />
  );
}

export function CompactTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-[4.5rem] w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C4DFF]/50 focus:ring-2 focus:ring-[#7C4DFF]/10",
        className,
      ].join(" ")}
    />
  );
}

export function CompactSelect({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800 outline-none focus:border-[#7C4DFF]/50 focus:ring-2 focus:ring-[#7C4DFF]/10",
        className,
      ].join(" ")}
    >
      {children}
    </select>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-1">
      {steps.map((label, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <React.Fragment key={label}>
            {index > 0 ? <span className="h-px w-3 bg-slate-200" /> : null}
            <div
              className={[
                "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                active
                  ? "bg-[#7C4DFF]/10 text-[#7C4DFF]"
                  : done
                    ? "text-emerald-600"
                    : "text-slate-400",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold",
                  active
                    ? "bg-[#7C4DFF] text-white"
                    : done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                ].join(" ")}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
