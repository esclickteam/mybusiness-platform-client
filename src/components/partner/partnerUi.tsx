import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export const PARTNER_FONT = '"Assistant", "Heebo", "Rubik", sans-serif';

export function PartnerCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[16px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export function PartnerBadge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "violet" | "sky" | "amber" | "emerald" | "slate" | "rose" | "orange";
}) {
  const tones: Record<string, string> = {
    violet: "bg-[#F3E8FF] text-[#6B21A8]",
    sky: "bg-[#E0F2FE] text-[#075985]",
    amber: "bg-[#FFEDD5] text-[#9A3412]",
    emerald: "bg-[#DCFCE7] text-[#166534]",
    slate: "bg-[#F1F5F9] text-[#475569]",
    rose: "bg-[#FFE4E6] text-[#9F1239]",
    orange: "bg-[#FFEDD5] text-[#C2410C]",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
        tones[tone] || tones.slate
      }`}
    >
      {children}
    </span>
  );
}

export function PartnerMetricCard({
  label,
  value,
  hint,
  icon,
  iconClassName = "bg-violet-100 text-violet-700",
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start justify-between gap-3 p-5">
      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-[32px] font-black leading-none text-slate-900">{value}</p>
        {hint ? (
          <p className="mt-2 text-xs font-bold text-emerald-600">{hint}</p>
        ) : null}
      </div>
      {icon ? (
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${iconClassName}`}>
          {icon}
        </span>
      ) : null}
    </div>
  );
  if (href) {
    return (
      <Link to={href} className="block">
        <PartnerCard className="transition hover:-translate-y-0.5 hover:border-violet-200">
          {inner}
        </PartnerCard>
      </Link>
    );
  }
  return <PartnerCard>{inner}</PartnerCard>;
}

export function PartnerPrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-2.5 text-sm font-black text-white shadow-[0_8px_20px_rgba(15,23,42,0.16)] transition hover:bg-slate-800 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function PartnerGhostButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function PartnerFileButton({
  accept,
  disabled,
  onFile,
  children,
  className = "",
  variant = "primary",
  inputId,
}: {
  accept: string;
  disabled?: boolean;
  onFile: (file: File) => void;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  inputId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Button = variant === "ghost" ? PartnerGhostButton : PartnerPrimaryButton;
  return (
    <span className={`relative inline-flex ${className}`.trim()}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
      <Button type="button" disabled={disabled} className="w-full" onClick={() => inputRef.current?.click()}>
        {children}
      </Button>
    </span>
  );
}

export function PartnerSearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
      />
    </label>
  );
}

export function PartnerSelect({
  value,
  onChange,
  children,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none"
      >
        {children}
      </select>
    </label>
  );
}

export function PartnerQuickAction({
  to,
  label,
  icon,
  tone,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  tone: "violet" | "emerald" | "orange" | "sky";
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function PartnerEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 py-10 text-center text-sm font-bold text-slate-400">{children}</p>
  );
}

export function PartnerInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none ring-violet-200 placeholder:text-slate-400 focus:ring-2 ${className}`}
    />
  );
}

export function PartnerTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none ring-violet-200 placeholder:text-slate-400 focus:ring-2 ${className}`}
    />
  );
}
