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
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`min-h-11 rounded-2xl bg-[#7C4DFF] px-4 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/20 disabled:opacity-50 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`min-h-11 rounded-2xl border border-purple-200 bg-white px-4 text-sm font-black text-slate-700 disabled:opacity-50 ${props.className || ""}`}
    >
      {children}
    </button>
  );
}
