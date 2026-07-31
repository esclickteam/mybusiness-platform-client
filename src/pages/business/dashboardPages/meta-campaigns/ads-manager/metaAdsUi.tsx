import React from "react";
import { CheckCircle2, ChevronDown, Info } from "lucide-react";

export const metaBlue = "#1877F2";
export const metaPageBg = "#F0F2F5";
export const metaBorder = "#CED0D4";
export const metaCardBorder = "#E4E6EB";

export const metaInputClass =
  "h-9 w-full rounded-md border border-[#CED0D4] bg-white px-3 text-[15px] text-[#050505] outline-none transition focus:border-[#1877F2] focus:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]";

export const metaSelectClass = `${metaInputClass} appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9`;

export const metaBtnPrimary =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[#1877F2] px-3.5 text-[15px] font-semibold text-white transition hover:bg-[#166FE5] disabled:cursor-not-allowed disabled:opacity-50";

export const metaBtnSecondary =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#CED0D4] bg-white px-3.5 text-[15px] font-semibold text-[#050505] transition hover:bg-[#F0F2F5] disabled:cursor-not-allowed disabled:opacity-50";

export const metaBtnGhost =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-[15px] font-semibold text-[#1877F2] transition hover:bg-[#E7F3FF]";

export function MetaSection({
  title,
  status = "ok",
  children,
  action,
}: {
  title: string;
  status?: "ok" | "warn" | "none";
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#E4E6EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E6EB] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {status === "ok" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#31A24C]" />
          ) : status === "warn" ? (
            <Info className="h-4 w-4 shrink-0 text-[#F7B928]" />
          ) : null}
          <h2 className="truncate text-[17px] font-bold text-[#050505]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="space-y-4 px-4 py-4">{children}</div>
    </section>
  );
}

export function MetaField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[#65676B]">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-[13px] leading-snug text-[#65676B]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function MetaToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-[#050505]">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[13px] leading-snug text-[#65676B]">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-[#1877F2]" : "bg-[#CED0D4]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
            checked ? "left-4" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function MetaRadioCard({
  checked,
  onSelect,
  title,
  description,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-lg border px-3.5 py-3 text-left transition",
        checked
          ? "border-[#1877F2] bg-[#E7F3FF] shadow-[inset_0_0_0_1px_#1877F2]"
          : "border-[#CED0D4] bg-white hover:bg-[#F7F8FA]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
            checked ? "border-[#1877F2]" : "border-[#8A8D91]",
          ].join(" ")}
        >
          {checked ? (
            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold text-[#050505]">
            {title}
          </span>
          {description ? (
            <span className="mt-0.5 block text-[13px] leading-snug text-[#65676B]">
              {description}
            </span>
          ) : null}
        </span>
      </div>
    </button>
  );
}

export function MetaNotice({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-[#B5D2F5] bg-[#E7F3FF] text-[#050505]",
    warning: "border-[#F5D78E] bg-[#FFF8E5] text-[#050505]",
    success: "border-[#A6D9B3] bg-[#E7F6EC] text-[#050505]",
  };
  return (
    <div
      className={`rounded-lg border px-3.5 py-3 text-[13px] leading-snug ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

export function MetaLinkButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1877F2] hover:underline"
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

export function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E7F3FF] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#1877F2]">
      {children}
    </span>
  );
}

export function MetaSidebarCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <aside className="rounded-lg border border-[#E4E6EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-2 border-b border-[#E4E6EB] px-3.5 py-3">
        <h3 className="text-[15px] font-bold text-[#050505]">{title}</h3>
        {action}
      </div>
      <div className="px-3.5 py-3">{children}</div>
    </aside>
  );
}
