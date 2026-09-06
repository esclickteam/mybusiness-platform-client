import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  RotateCcw,
  Wand2,
  XCircle,
} from "lucide-react";

import type { SchemaValidationResult } from "./schemaValidation";

type Props = {
  json: string;
  mode: "form" | "custom";
  validation: SchemaValidationResult;
  onJsonChange: (json: string) => void;
  onEnterCustom: () => void;
  onRegenerateFromForm: () => void;
};

export default function SchemaJsonEditor({
  json,
  mode,
  validation,
  onJsonChange,
  onEnterCustom,
  onRegenerateFromForm,
}: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      onJsonChange(JSON.stringify(JSON.parse(json), null, 2));
    } catch {
      /* ignore invalid json on format */
    }
  };

  const copy = () => {
    try {
      navigator.clipboard?.writeText(json);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const confirmEnterCustom = () => {
    if (mode === "custom") return;
    const ok = window.confirm(t("studio.schema.confirmAdvanced"));
    if (ok) onEnterCustom();
  };

  const confirmRegenerate = () => {
    const ok = window.confirm(t("studio.schema.confirmRegenerate"));
    if (ok) onRegenerateFromForm();
  };

  return (
    <details className="group/json mt-3 rounded-2xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-3 text-xs font-black text-blue-600">
        <ChevronDown className="h-4 w-4 transition group-open/json:rotate-180" />
        {t("studio.schema.jsonLdTitle")}
        {mode === "custom" ? (
          <span className="ms-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
            {t("studio.schema.editedManually")}
          </span>
        ) : null}
      </summary>

      <div className="space-y-2 border-t border-slate-100 px-3.5 py-3">
        {mode === "form" ? (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
            {t("studio.schema.autoFromForm")}
          </p>
        ) : null}

        <textarea
          value={json}
          readOnly={mode === "form"}
          onChange={(event) => onJsonChange(event.target.value)}
          dir="ltr"
          spellCheck={false}
          className={[
            "min-h-[180px] w-full max-w-full resize-y rounded-xl border px-3 py-2 font-mono text-xs leading-5 text-slate-900 outline-none focus:border-blue-400",
            mode === "form"
              ? "border-slate-200 bg-slate-50"
              : "border-slate-300 bg-white",
          ].join(" ")}
        />

        <div className="flex flex-wrap items-center gap-2">
          {mode === "form" ? (
            <button
              type="button"
              onClick={confirmEnterCustom}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:bg-slate-50"
            >
              <Wand2 className="h-3.5 w-3.5" /> {t("studio.schema.switchAdvanced")}
            </button>
          ) : (
            <button
              type="button"
              onClick={confirmRegenerate}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t("studio.schema.regenerateFromForm")}
            </button>
          )}
          <button
            type="button"
            onClick={format}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:bg-slate-50"
          >
            {t("studio.schema.format")}
          </button>
          <button
            type="button"
            onClick={copy}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:bg-slate-50"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t("studio.schema.copied")}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> {t("studio.schema.copy")}
              </>
            )}
          </button>
          <span className="ms-auto">
            {validation.jsonError ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600" dir="ltr">
                <XCircle className="h-3.5 w-3.5" /> {validation.jsonError}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> {t("studio.schema.jsonValid")}
              </span>
            )}
          </span>
        </div>
      </div>
    </details>
  );
}
