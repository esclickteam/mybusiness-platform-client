import React, { useMemo, useState } from "react";
import {
  Braces,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";

import type { SeoSchemaType, SeoStructuredDataEntry } from "../../../../types";
import { getSchemaTypeLabel, type SchemaBuilderContext } from "./schemaTypes";
import { buildSchemaJson, defaultFormData } from "./schemaBuilders";
import { parseSchema } from "./schemaParsers";
import { validateSchemaEntry } from "./schemaValidation";
import SchemaValidationStatus from "./SchemaValidationStatus";
import SchemaJsonEditor from "./SchemaJsonEditor";

import LocalBusinessSchemaForm from "./forms/LocalBusinessSchemaForm";
import ServiceSchemaForm from "./forms/ServiceSchemaForm";
import FaqSchemaForm from "./forms/FaqSchemaForm";
import ProductSchemaForm from "./forms/ProductSchemaForm";
import OrganizationSchemaForm from "./forms/OrganizationSchemaForm";
import WebsiteSchemaForm from "./forms/WebsiteSchemaForm";
import BreadcrumbSchemaForm from "./forms/BreadcrumbSchemaForm";

type Props = {
  entry: SeoStructuredDataEntry;
  context: SchemaBuilderContext;
  defaultOpen?: boolean;
  onCommit: (entry: SeoStructuredDataEntry) => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

function renderForm(
  type: SeoSchemaType,
  value: Record<string, unknown>,
  onChange: (next: Record<string, unknown>) => void,
) {
  const forward = (next: any) => onChange(next as Record<string, unknown>);
  switch (type) {
    case "LocalBusiness":
      return <LocalBusinessSchemaForm value={value as any} onChange={forward} />;
    case "Service":
      return <ServiceSchemaForm value={value as any} onChange={forward} />;
    case "FAQPage":
      return <FaqSchemaForm value={value as any} onChange={forward} />;
    case "Product":
      return <ProductSchemaForm value={value as any} onChange={forward} />;
    case "Organization":
      return <OrganizationSchemaForm value={value as any} onChange={forward} />;
    case "WebSite":
      return <WebsiteSchemaForm value={value as any} onChange={forward} />;
    case "BreadcrumbList":
      return <BreadcrumbSchemaForm value={value as any} onChange={forward} />;
    default:
      return null;
  }
}

export default function SchemaEditorCard({
  entry,
  context,
  defaultOpen = false,
  onCommit,
  onDuplicate,
  onDelete,
}: Props) {
  const schemaType = (entry.schemaType || "Custom") as SeoSchemaType;
  const supportsForm = schemaType !== "Custom";

  const initialFormData = useMemo<Record<string, unknown>>(() => {
    if (entry.formData && Object.keys(entry.formData).length) {
      return entry.formData;
    }
    if (supportsForm && entry.json) {
      return parseSchema(schemaType, entry.json);
    }
    if (supportsForm) {
      return defaultFormData(schemaType, context);
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(defaultOpen);
  const [name, setName] = useState(entry.name || "");
  const [mode, setMode] = useState<"form" | "custom">(
    entry.mode === "form" && supportsForm ? "form" : "custom",
  );
  const [formData, setFormData] = useState<Record<string, unknown>>(initialFormData);
  const [json, setJson] = useState(entry.json || "");
  const [manuallyEdited, setManuallyEdited] = useState(
    Boolean(entry.manuallyEdited),
  );
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const validation = useMemo(
    () => validateSchemaEntry({ json, schemaType }),
    [json, schemaType],
  );

  const handleFormChange = (next: Record<string, unknown>) => {
    setFormData(next);
    if (mode === "form") {
      setJson(buildSchemaJson(schemaType, next, json));
    }
    setDirty(true);
    setSavedFlash(false);
  };

  const handleJsonChange = (nextJson: string) => {
    setJson(nextJson);
    setManuallyEdited(true);
    setDirty(true);
    setSavedFlash(false);
  };

  const enterCustom = () => {
    setMode("custom");
    setManuallyEdited(true);
    setDirty(true);
  };

  const regenerateFromForm = () => {
    const regenerated = buildSchemaJson(schemaType, formData);
    setJson(regenerated);
    setMode("form");
    setManuallyEdited(false);
    setDirty(true);
  };

  const save = () => {
    if (validation.blocking) return;
    const finalJson =
      mode === "form" && supportsForm
        ? buildSchemaJson(schemaType, formData, manuallyEdited ? json : undefined)
        : json;

    onCommit({
      ...entry,
      name: name.trim() || getSchemaTypeLabel(schemaType),
      schemaType,
      mode: supportsForm ? mode : "custom",
      json: finalJson,
      formData: supportsForm ? formData : undefined,
      manuallyEdited: mode === "custom",
      lastGeneratedAt: new Date().toISOString(),
    });
    setDirty(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 3000);
  };

  const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(
    context.previewUrl || context.publicUrl || "",
  )}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-gradient-to-l from-slate-50/90 to-white px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 text-right"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Braces className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-slate-900">
              {getSchemaTypeLabel(schemaType)}
              {name && name !== getSchemaTypeLabel(schemaType) ? (
                <span className="font-bold text-slate-400"> · {name}</span>
              ) : null}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              {mode === "form" ? "מצב טופס" : "JSON ידני"}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        <SchemaValidationStatus result={validation} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="שכפול"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50"
            aria-label="מחיקה"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-3 p-3">
          <label className="flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5 text-slate-400" />
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setDirty(true);
              }}
              placeholder="שם פנימי (לזיהוי)"
              className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-right text-xs font-bold text-slate-800 outline-none focus:border-blue-400"
            />
          </label>

          {supportsForm && mode === "form" ? (
            renderForm(schemaType, formData, handleFormChange)
          ) : supportsForm && mode === "custom" ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800">
              הקוד נערך ידנית. הטופס מוסתר כדי לא לדרוס את השינויים. אפשר "יצירה
              מחדש מהטופס" בעורך למטה כדי לחזור למצב טופס.
            </p>
          ) : (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
              Schema מותאם אישית — עריכה ידנית של ה‑JSON בלבד.
            </p>
          )}

          <SchemaJsonEditor
            json={json}
            mode={supportsForm ? mode : "custom"}
            validation={validation}
            onJsonChange={handleJsonChange}
            onEnterCustom={enterCustom}
            onRegenerateFromForm={regenerateFromForm}
          />

          {validation.blocking ? (
            <p className="text-[11px] font-bold text-rose-600">
              לא ניתן לשמור: {validation.summary}
            </p>
          ) : validation.recommendedMissing.length ? (
            <p className="text-[11px] font-bold text-amber-600">
              מומלץ להשלים: {validation.recommendedMissing.join(" · ")}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={validation.blocking}
              className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-black transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save className="h-4 w-4" /> שמירת Schema
            </button>
            <a
              href={richResultsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" /> בדיקה ב-Google
            </a>
            {savedFlash ? (
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> נשמר בכרטיס — לחצי "שמירה"
                למטה כדי לפרסם.
              </span>
            ) : dirty ? (
              <span className="text-xs font-bold text-amber-600">
                יש שינויים שלא נשמרו בכרטיס
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
