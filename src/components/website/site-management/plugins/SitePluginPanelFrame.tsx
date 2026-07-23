import React from "react";
import { ExternalLink, Save } from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import BizuplyLoader from "../../../ui/BizuplyLoader";
import { SitePanelCard, SitePanelHero } from "../SitePanelShell";
import { btnPrimary, btnSecondary, inputBase } from "../siteManagementUi";

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
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-violet-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "right-0.5" : "right-[calc(100%-1.375rem)]"
          }`}
        />
      </button>
    </label>
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
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

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
      className={inputBase}
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
      className={`${inputBase} min-h-[80px] resize-y py-2.5`}
    />
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
  children: React.ReactNode;
};

export function SitePluginPanelFrame({
  editorHref,
  icon,
  accent,
  title,
  description,
  loading,
  saving,
  message,
  onSave,
  extraActions,
  children,
}: SitePluginPanelFrameProps) {
  return (
    <div className="space-y-5">
      <SitePanelHero
        icon={icon}
        accent={accent}
        title={title}
        description={description}
        actions={
          <>
            {extraActions}
            <Link to={editorHref} className={btnSecondary + " h-10 text-xs"}>
              <ExternalLink size={14} />
              הוספה בעורך
            </Link>
          </>
        }
      />

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <SitePanelCard>
        {loading ? (
          <div className="grid min-h-[200px] place-items-center">
            <BizuplyLoader size="sm" label="טוען הגדרות..." />
          </div>
        ) : (
          <>
            <div className="space-y-4">{children}</div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className={btnPrimary + " h-11 disabled:opacity-60"}
              >
                {saving ? (
                  <BizuplyLoader size="xs" compact />
                ) : (
                  <Save size={16} />
                )}
                שמירת הגדרות
              </button>
            </div>
          </>
        )}
      </SitePanelCard>
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
