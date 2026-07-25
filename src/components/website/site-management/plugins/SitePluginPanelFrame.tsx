import React from "react";
import { ExternalLink, Save, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import BizuplyLoader from "../../../ui/BizuplyLoader";

export type PluginPanelProps = {
  siteId: string;
  businessId: string;
  editorHref: string;
  onPluginUninstalled?: (pluginKey: string) => void;
};

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5">
      <div className="min-w-0">
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "right-0.5" : "right-[calc(100%-1.625rem)]"
          }`}
        />
      </button>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {hint ? (
        <span className="block text-xs text-slate-500">{hint}</span>
      ) : null}
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputClass} min-h-[88px] resize-y py-2.5`}
    />
  );
}

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function InfoCallout({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "tip";
}) {
  const styles =
    variant === "tip"
      ? "border-amber-200 bg-amber-50/70 text-amber-900"
      : "border-blue-200 bg-blue-50/60 text-blue-900";

  return (
    <p className={`rounded-xl border px-4 py-3 text-xs font-medium leading-relaxed ${styles}`}>
      {children}
    </p>
  );
}

type SitePluginPanelFrameProps = PluginPanelProps & {
  icon: LucideIcon;
  accent: string;
  title: string;
  description: string;
  loading: boolean;
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  onSave: () => void;
  extraActions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
};

export function SitePluginPanelFrame({
  editorHref,
  icon: Icon,
  accent,
  title,
  description,
  loading,
  saving,
  message,
  onSave,
  extraActions,
  sidebar,
  children,
}: SitePluginPanelFrameProps) {
  return (
    <div dir="rtl" className="space-y-0">
      {/* Plugin management header */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <div
          className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:p-6"
          style={{
            background: `linear-gradient(180deg, ${accent}08 0%, white 60%)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              }}
            >
              <Icon size={26} strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Settings2 size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">
                  ניהול תוסף
                </span>
              </div>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500">{description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {extraActions}
            <Link
              to={editorHref}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ExternalLink size={14} />
              הוספה בעורך
            </Link>
          </div>
        </div>

        {message ? (
          <div
            className={`mx-5 mt-4 rounded-lg border px-4 py-3 text-sm font-medium md:mx-6 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="flex flex-col gap-6 p-5 md:flex-row md:p-6">
          {/* Settings form */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid min-h-[240px] place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <BizuplyLoader size="sm" label="טוען הגדרות..." />
              </div>
            ) : (
              <div className="space-y-6">{children}</div>
            )}
          </div>

          {/* Optional sidebar — tips / preview */}
          {sidebar ? (
            <aside className="w-full shrink-0 md:w-72">{sidebar}</aside>
          ) : null}
        </div>

        {/* Sticky save bar */}
        {!loading ? (
          <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-sm md:px-6">
            <p className="text-xs text-slate-500">
              שינויים נשמרים לכל האתר
            </p>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? (
                <BizuplyLoader size="xs" compact />
              ) : (
                <Save size={16} />
              )}
              שמירת הגדרות
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

export function bool(v: unknown, fallback = false) {
  return typeof v === "boolean" ? v : fallback;
}

export function num(v: unknown, fallback = 0) {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}
