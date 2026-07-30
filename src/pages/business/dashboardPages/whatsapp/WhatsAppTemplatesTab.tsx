import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Bold,
  FileText,
  Image as ImageIcon,
  Italic,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Strikethrough,
  Trash2,
  Video,
} from "lucide-react";
import {
  createWhatsAppTemplate,
  deleteWhatsAppTemplate,
  listWhatsAppTemplates,
  syncWhatsAppTemplates,
  updateWhatsAppTemplate,
  type WhatsAppHeaderType,
  type WhatsAppMappingStatus,
  type WhatsAppTemplate,
  type WhatsAppTemplateButton,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import WhatsAppCreateTemplateWizard from "./WhatsAppCreateTemplateWizard";
import WhatsAppVariableMappingScreen from "./WhatsAppVariableMappingScreen";

function getMetaStatusLabel(tpl: WhatsAppTemplate): string {
  if (tpl.metaStatusLabelHe) return tpl.metaStatusLabelHe;
  const meta = String(tpl.metaStatus || "").toUpperCase();
  const quality = String(tpl.metaQualityScore || "").toUpperCase();
  if (meta === "PENDING") return "בבדיקה";
  if (meta === "IN_APPEAL") return "בערעור";
  if (meta === "REJECTED") return "נדחתה";
  if (meta === "DISABLED") return "מושבתת";
  if (meta === "PAUSED") return "מושהית";
  if (meta === "APPROVED") {
    if (!quality || quality === "UNKNOWN" || quality === "PENDING") {
      return "פעילה - בהמתנה לבדיקה";
    }
    if (quality === "GREEN" || quality === "HIGH") return "פעילה - איכות גבוהה";
    if (quality === "YELLOW" || quality === "MEDIUM") {
      return "פעילה - איכות בינונית";
    }
    if (quality === "RED" || quality === "LOW") return "פעילה - איכות נמוכה";
    return "פעילה";
  }
  if (meta === "LOCAL" || tpl.source === "local") return "טיוטה מקומית";
  return meta || "טיוטה מקומית";
}

function getMappingStatusLabel(tpl: WhatsAppTemplate): string | null {
  if (String(tpl.metaStatus || "").toUpperCase() !== "APPROVED") return null;
  const mapping = (tpl.mappingStatus || "") as WhatsAppMappingStatus;
  if (mapping === "ready" || tpl.mappingReady) return "מוכנה לשליחה";
  if (mapping === "partial") return "הגדרת המשתנים לא הושלמה";
  const hasVars = (tpl.variables || []).length > 0;
  if (!hasVars) return "מוכנה לשליחה";
  return "המשתנים עדיין לא הוגדרו";
}

function getMetaStatusClass(label: string): string {
  if (label.startsWith("פעילה")) return "bg-emerald-50 text-emerald-700";
  if (label === "בבדיקה" || label === "בערעור") {
    return "bg-amber-50 text-amber-700";
  }
  if (label === "נדחתה" || label === "מושבתת") {
    return "bg-rose-50 text-rose-700";
  }
  if (label === "מושהית") return "bg-orange-50 text-orange-700";
  return "bg-slate-100 text-slate-600";
}

function getMappingStatusClass(label: string): string {
  if (label === "מוכנה לשליחה") return "bg-emerald-50 text-emerald-700";
  return "bg-sky-50 text-sky-700";
}

type OutletCtx = { businessId: string | null };

const CATEGORIES = [
  "appointment_reminder",
  "promotion",
  "follow_up",
  "welcome",
  "custom",
] as const;

const BODY_MAX = 1024;
const HEADER_MAX = 60;
const FOOTER_MAX = 60;
const BUTTON_TEXT_MAX = 40;
const URL_MAX = 2000;

type TemplateForm = {
  name: string;
  category: WhatsAppTemplate["category"];
  language: string;
  variableType: "number" | "name";
  headerType: WhatsAppHeaderType;
  headerText: string;
  headerMediaUrl: string;
  body: string;
  footer: string;
  exampleValues: Record<string, string>;
  buttons: WhatsAppTemplateButton[];
};

const emptyForm: TemplateForm = {
  name: "",
  category: "custom",
  language: "he",
  variableType: "number",
  headerType: "none",
  headerText: "",
  headerMediaUrl: "",
  body: "",
  footer: "",
  exampleValues: {},
  buttons: [],
};

function extractMetaVariables(body: string) {
  const matches = Array.from(String(body).matchAll(/\{\{\s*(\d+)\s*\}\}/g));
  const seen = new Set<string>();
  const vars: string[] = [];
  for (const match of matches) {
    const key = match[1];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    vars.push(key);
  }
  return vars.sort((a, b) => Number(a) - Number(b));
}

function nextMetaVariableToken(body: string) {
  const nums = extractMetaVariables(body).map(Number);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `{{${next}}}`;
}

function wrapSelection(
  textarea: HTMLTextAreaElement | null,
  value: string,
  before: string,
  after: string,
  onChange: (next: string) => void
) {
  if (!textarea) {
    onChange(`${value}${before}${after}`);
    return;
  }
  const start = textarea.selectionStart ?? value.length;
  const end = textarea.selectionEnd ?? value.length;
  const selected = value.slice(start, end) || "טקסט";
  const next =
    value.slice(0, start) + before + selected + after + value.slice(end);
  onChange(next.slice(0, BODY_MAX));
  requestAnimationFrame(() => {
    const pos = start + before.length + selected.length + after.length;
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
  });
}

function normalizeExampleValues(
  raw: WhatsAppTemplate["exampleValues"]
): Record<string, string> {
  if (!raw) return {};
  if (raw instanceof Map) {
    return Object.fromEntries(raw.entries());
  }
  return { ...raw };
}

export default function WhatsAppTemplatesTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [mappingTemplate, setMappingTemplate] =
    useState<WhatsAppTemplate | null>(null);

  const bodyVariables = useMemo(
    () => extractMetaVariables(form.body),
    [form.body]
  );

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setEditingId(null);
      setForm(emptyForm);
      setShowForm(true);
      const next = new URLSearchParams(searchParams);
      next.delete("create");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setForm((prev) => {
      const nextExamples = { ...prev.exampleValues };
      let changed = false;
      bodyVariables.forEach((key) => {
        if (nextExamples[key] == null) {
          nextExamples[key] = "";
          changed = true;
        }
      });
      Object.keys(nextExamples).forEach((key) => {
        if (!bodyVariables.includes(key)) {
          delete nextExamples[key];
          changed = true;
        }
      });
      return changed ? { ...prev, exampleValues: nextExamples } : prev;
    });
  }, [bodyVariables]);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await listWhatsAppTemplates(businessId);
      setTemplates(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadTemplates")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFromMeta = async () => {
    if (!businessId) return;
    try {
      setSyncing(true);
      const result = await syncWhatsAppTemplates(businessId);
      setTemplates(result.templates || (await listWhatsAppTemplates(businessId)));
      const statusSummary = (result.rawStatuses || [])
        .map((row) => `${row.name}: ${row.labelHe || row.status}`)
        .slice(0, 5)
        .join(" · ");
      toast.success(
        statusSummary
          ? `סונכרנו ${result.synced ?? 0} תבניות מ-Meta. ${statusSummary}`
          : t("whatsapp.templates.synced", {
              count: result.synced ?? 0,
            })
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.syncTemplates")
      );
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (tpl: WhatsAppTemplate) => {
    setEditingId(tpl._id);
    setForm({
      name: tpl.name,
      category: tpl.category,
      language: tpl.language || "he",
      variableType: tpl.variableType || "number",
      headerType: tpl.headerType || "none",
      headerText: tpl.headerText || "",
      headerMediaUrl: tpl.headerMediaUrl || "",
      body: tpl.body,
      footer: tpl.footer || "",
      exampleValues: normalizeExampleValues(tpl.exampleValues),
      buttons: (tpl.buttons || []).map((btn) => ({
        type: btn.type || "url",
        text: btn.text || "",
        url: btn.url || "",
        urlType: btn.urlType || "static",
        exampleUrl: btn.exampleUrl || "",
        phoneNumber: btn.phoneNumber || "",
      })),
    });
    setShowForm(true);
  };

  const insertVariable = () => {
    const token = nextMetaVariableToken(form.body);
    const textarea = bodyRef.current;
    if (!textarea) {
      setForm((prev) => ({
        ...prev,
        body: `${prev.body}${prev.body && !/\s$/.test(prev.body) ? " " : ""}${token}`.slice(
          0,
          BODY_MAX
        ),
      }));
      return;
    }
    const start = textarea.selectionStart ?? form.body.length;
    const end = textarea.selectionEnd ?? form.body.length;
    const next = (
      form.body.slice(0, start) +
      token +
      form.body.slice(end)
    ).slice(0, BODY_MAX);
    setForm((prev) => ({ ...prev, body: next }));
    requestAnimationFrame(() => {
      const pos = start + token.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const updateButton = (
    index: number,
    patch: Partial<WhatsAppTemplateButton>
  ) => {
    setForm((prev) => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) =>
        i === index ? { ...btn, ...patch } : btn
      ),
    }));
  };

  const handleSave = async () => {
    if (!businessId) return;
    if (!form.name.trim() || !form.body.trim()) {
      toast.error(t("whatsapp.templates.required"));
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      language: form.language,
      variableType: form.variableType,
      headerType: form.headerType,
      headerText: form.headerText.trim().slice(0, HEADER_MAX),
      headerMediaUrl: form.headerMediaUrl.trim(),
      body: form.body.trim().slice(0, BODY_MAX),
      footer: form.footer.trim().slice(0, FOOTER_MAX),
      exampleValues: form.exampleValues,
      buttons: form.buttons,
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateWhatsAppTemplate(businessId, editingId, payload);
        toast.success(t("whatsapp.templates.updated"));
      } else {
        await createWhatsAppTemplate(businessId, payload);
        toast.success(t("whatsapp.templates.created"));
      }
      resetForm();
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.saveTemplate")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.templates.confirmDelete"))) return;
    try {
      await deleteWhatsAppTemplate(businessId, id);
      toast.success(t("whatsapp.templates.deleted"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.deleteTemplate")
      );
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  if (mappingTemplate && businessId) {
    return (
      <WhatsAppVariableMappingScreen
        businessId={businessId}
        template={mappingTemplate}
        onClose={() => setMappingTemplate(null)}
        onSaved={(updated) => {
          setTemplates((prev) =>
            prev.map((tpl) =>
              tpl._id === updated._id ? { ...tpl, ...updated } : tpl
            )
          );
          setMappingTemplate((prev) =>
            prev && prev._id === updated._id ? { ...prev, ...updated } : prev
          );
          load();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.templates.title")}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {t("whatsapp.templates.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            disabled={syncing}
            onClick={handleSyncFromMeta}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t("whatsapp.templates.syncFromMeta")}
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {t("whatsapp.templates.create")}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800">
        {t("whatsapp.templates.metaOnlyHint")}
      </p>

      {showForm && !editingId && businessId && (
        <WhatsAppCreateTemplateWizard
          businessId={businessId}
          onClose={resetForm}
          onSubmitted={load}
        />
      )}

      {showForm && editingId && (
        <section className={`${cardBase} space-y-5 p-4 sm:p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {t("whatsapp.templates.editTitle")}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {t("whatsapp.templates.metaEditorHint")}
              </p>
            </div>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
              Local draft
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.name")}
              </span>
              <input
                className={inputBase}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.category")}
              </span>
              <select
                className={inputBase}
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as WhatsAppTemplate["category"],
                  }))
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`whatsapp.categories.${cat}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Variable type — like Meta */}
          <div className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.templates.variableType")}
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["number", "whatsapp.templates.variableTypeNumber"],
                  ["name", "whatsapp.templates.variableTypeName"],
                ] as const
              ).map(([value, labelKey]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, variableType: value }))
                  }
                  className={[
                    "rounded-xl border px-3 py-3 text-start text-sm font-bold transition",
                    form.variableType === value
                      ? "border-sky-300 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-200",
                  ].join(" ")}
                >
                  {t(labelKey)}
                  {value === "number" && (
                    <span dir="ltr" className="mt-1 block text-xs font-medium text-slate-400">
                      {"{{1}} {{2}} {{3}}"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Media sample — like Meta */}
          <div className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.templates.mediaSample")}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {(
                [
                  ["none", "whatsapp.templates.mediaNone", null],
                  ["image", "whatsapp.templates.mediaImage", ImageIcon],
                  ["video", "whatsapp.templates.mediaVideo", Video],
                  ["document", "whatsapp.templates.mediaDocument", FileText],
                  ["location", "whatsapp.templates.mediaLocation", MapPin],
                ] as const
              ).map(([value, labelKey, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      headerType: value,
                      headerText:
                        value === "text" ? prev.headerText : prev.headerText,
                    }))
                  }
                  className={[
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-bold transition",
                    form.headerType === value
                      ? "border-sky-300 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-200",
                  ].join(" ")}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {t(labelKey)}
                </button>
              ))}
            </div>
            {form.headerType !== "none" && form.headerType !== "text" && (
              <label className="mt-2 grid gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  {t("whatsapp.templates.mediaUrl")}
                </span>
                <input
                  className={inputBase}
                  dir="ltr"
                  value={form.headerMediaUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      headerMediaUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </label>
            )}
          </div>

          {/* Header text */}
          <label className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.header")}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {form.headerText.length}/{HEADER_MAX}
              </span>
            </div>
            <input
              className={inputBase}
              value={form.headerText}
              maxLength={HEADER_MAX}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  headerText: e.target.value,
                  headerType:
                    e.target.value.trim() && prev.headerType === "none"
                      ? "text"
                      : prev.headerType === "text" && !e.target.value.trim()
                        ? "none"
                        : prev.headerType,
                }))
              }
              placeholder={t("whatsapp.templates.headerPlaceholder")}
            />
          </label>

          {/* Body */}
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.body")}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {form.body.length}/{BODY_MAX}
              </span>
            </div>
            <textarea
              ref={bodyRef}
              className={`${inputBase} min-h-[160px] py-3`}
              value={form.body}
              maxLength={BODY_MAX}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  body: e.target.value.slice(0, BODY_MAX),
                }))
              }
              placeholder={t("whatsapp.templates.bodyPlaceholder")}
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                className={btnSecondary}
                onClick={insertVariable}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("whatsapp.templates.addVariable")}
              </button>
              <button
                type="button"
                className={btnSecondary}
                title="Bold"
                onClick={() =>
                  wrapSelection(bodyRef.current, form.body, "*", "*", (next) =>
                    setForm((prev) => ({ ...prev, body: next }))
                  )
                }
              >
                <Bold className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={btnSecondary}
                title="Italic"
                onClick={() =>
                  wrapSelection(bodyRef.current, form.body, "_", "_", (next) =>
                    setForm((prev) => ({ ...prev, body: next }))
                  )
                }
              >
                <Italic className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={btnSecondary}
                title="Strikethrough"
                onClick={() =>
                  wrapSelection(bodyRef.current, form.body, "~", "~", (next) =>
                    setForm((prev) => ({ ...prev, body: next }))
                  )
                }
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={btnSecondary}
                title="Monospace"
                onClick={() =>
                  wrapSelection(
                    bodyRef.current,
                    form.body,
                    "```",
                    "```",
                    (next) => setForm((prev) => ({ ...prev, body: next }))
                  )
                }
              >
                {"</>"}
              </button>
            </div>
          </div>

          {/* Variable samples — like Meta */}
          {bodyVariables.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <h4 className="text-sm font-black text-slate-900">
                {t("whatsapp.templates.variableSamples")}
              </h4>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                {t("whatsapp.templates.variableSamplesHint")}
              </p>
              <div className="mt-3 grid gap-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("whatsapp.templates.body")}
                </p>
                {bodyVariables.map((key) => (
                  <label key={key} className="grid gap-1.5">
                    <span dir="ltr" className="text-xs font-black text-sky-700">
                      {`{{${key}}}`}
                    </span>
                    <input
                      className={inputBase}
                      value={form.exampleValues[key] || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          exampleValues: {
                            ...prev.exampleValues,
                            [key]: e.target.value,
                          },
                        }))
                      }
                      placeholder={t("whatsapp.templates.samplePlaceholder", {
                        n: key,
                      })}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <label className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.footer")}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {form.footer.length}/{FOOTER_MAX}
              </span>
            </div>
            <input
              className={inputBase}
              value={form.footer}
              maxLength={FOOTER_MAX}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, footer: e.target.value }))
              }
              placeholder={t("whatsapp.templates.footerPlaceholder")}
            />
          </label>

          {/* Buttons — like Meta */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {t("whatsapp.templates.buttons")}
                </h4>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {t("whatsapp.templates.buttonsHint")}
                </p>
              </div>
              <button
                type="button"
                className={btnSecondary}
                disabled={form.buttons.length >= 10}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    buttons: [
                      ...prev.buttons,
                      {
                        type: "url",
                        text: "",
                        url: "",
                        urlType: "dynamic",
                        exampleUrl: "",
                        phoneNumber: "",
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-3.5 w-3.5" />
                {t("whatsapp.templates.addButton")}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {form.buttons.map((btn, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-600">
                      {t("whatsapp.templates.buttonN", { n: index + 1 })}
                    </span>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          buttons: prev.buttons.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1.5">
                      <span className="text-xs font-black text-slate-600">
                        {t("whatsapp.templates.buttonAction")}
                      </span>
                      <select
                        className={inputBase}
                        value={btn.type}
                        onChange={(e) =>
                          updateButton(index, {
                            type: e.target.value as WhatsAppTemplateButton["type"],
                          })
                        }
                      >
                        <option value="url">
                          {t("whatsapp.templates.buttonVisitWebsite")}
                        </option>
                        <option value="phone_number">
                          {t("whatsapp.templates.buttonCallPhone")}
                        </option>
                        <option value="quick_reply">
                          {t("whatsapp.templates.buttonQuickReply")}
                        </option>
                      </select>
                    </label>
                    <label className="grid gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-slate-600">
                          {t("whatsapp.templates.buttonText")}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {(btn.text || "").length}/{BUTTON_TEXT_MAX}
                        </span>
                      </div>
                      <input
                        className={inputBase}
                        maxLength={BUTTON_TEXT_MAX}
                        value={btn.text}
                        onChange={(e) =>
                          updateButton(index, { text: e.target.value })
                        }
                      />
                    </label>
                    {btn.type === "url" && (
                      <>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-black text-slate-600">
                            {t("whatsapp.templates.urlType")}
                          </span>
                          <select
                            className={inputBase}
                            value={btn.urlType || "static"}
                            onChange={(e) =>
                              updateButton(index, {
                                urlType: e.target
                                  .value as WhatsAppTemplateButton["urlType"],
                              })
                            }
                          >
                            <option value="static">
                              {t("whatsapp.templates.urlStatic")}
                            </option>
                            <option value="dynamic">
                              {t("whatsapp.templates.urlDynamic")}
                            </option>
                          </select>
                        </label>
                        <label className="grid gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-600">
                              {t("whatsapp.templates.websiteUrl")}
                            </span>
                            <span
                              dir="ltr"
                              className="text-[11px] font-bold text-sky-700"
                            >
                              {btn.urlType === "dynamic" ? "{{1}}" : ""}
                            </span>
                          </div>
                          <input
                            className={inputBase}
                            dir="ltr"
                            maxLength={URL_MAX}
                            value={btn.url || ""}
                            onChange={(e) =>
                              updateButton(index, { url: e.target.value })
                            }
                            placeholder="https://example.com/path"
                          />
                        </label>
                        {btn.urlType === "dynamic" && (
                          <label className="grid gap-1.5 sm:col-span-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-600">
                                {t("whatsapp.templates.sampleUrl")}
                              </span>
                              <span
                                dir="ltr"
                                className="text-[11px] font-bold text-sky-700"
                              >
                                {"{{1}}"}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                              {t("whatsapp.templates.sampleUrlHint")}
                            </p>
                            <input
                              className={inputBase}
                              dir="ltr"
                              value={btn.exampleUrl || ""}
                              onChange={(e) =>
                                updateButton(index, {
                                  exampleUrl: e.target.value,
                                })
                              }
                              placeholder="abc123?token=sample"
                            />
                          </label>
                        )}
                      </>
                    )}
                    {btn.type === "phone_number" && (
                      <label className="grid gap-1.5 sm:col-span-2">
                        <span className="text-xs font-black text-slate-600">
                          {t("whatsapp.templates.phoneNumber")}
                        </span>
                        <input
                          className={inputBase}
                          dir="ltr"
                          value={btn.phoneNumber || ""}
                          onChange={(e) =>
                            updateButton(index, {
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="+972501234567"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              disabled={saving}
              onClick={handleSave}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("whatsapp.templates.save")}
            </button>
            <button type="button" className={btnSecondary} onClick={resetForm}>
              {t("whatsapp.templates.cancel")}
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((tpl) => {
          const isApproved = tpl.metaStatus === "APPROVED";
          const isReady = Boolean(tpl.mappingReady || tpl.mappingStatus === "ready");
          const hasVars = (tpl.variables || []).length > 0;
          const mappingLabel =
            isReady || !hasVars ? "עריכת מיפוי" : "הגדרת משתנים";

          return (
            <article key={tpl._id} className={`${cardBase} flex flex-col p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                    {tpl.metaCategory ||
                      t(`whatsapp.categories.${tpl.category}`, {
                        defaultValue: tpl.category,
                      })}
                  </p>
                  <h3 className="mt-1 text-base font-black text-slate-900">
                    {tpl.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {tpl.language} ·{" "}
                    {tpl.source === "meta" ? "מטא" : "מקומית"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {(() => {
                    const metaLabel = getMetaStatusLabel(tpl);
                    const mappingBadge = getMappingStatusLabel(tpl);
                    return (
                      <>
                        <span
                          className={[
                            "rounded-md px-2 py-0.5 text-[10px] font-black",
                            getMetaStatusClass(metaLabel),
                          ].join(" ")}
                        >
                          {metaLabel}
                        </span>
                        {mappingBadge ? (
                          <span
                            className={[
                              "rounded-md px-2 py-0.5 text-[10px] font-black",
                              getMappingStatusClass(mappingBadge),
                            ].join(" ")}
                          >
                            {mappingBadge}
                          </span>
                        ) : null}
                      </>
                    );
                  })()}
                  {tpl.isSystem && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                      {t("whatsapp.templates.system")}
                    </span>
                  )}
                </div>
              </div>
              {tpl.headerText ? (
                <p className="mt-2 text-sm font-bold text-slate-800">
                  {tpl.headerText}
                </p>
              ) : null}
              <p className="mt-3 flex-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-600">
                {tpl.body}
              </p>
              {tpl.footer ? (
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {tpl.footer}
                </p>
              ) : null}
              {!!tpl.buttons?.length && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {tpl.buttons.map((btn, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-center text-[11px] font-bold text-slate-700"
                    >
                      {btn.text || t("whatsapp.templates.buttonN", { n: i + 1 })}
                    </span>
                  ))}
                </div>
              )}
              {!!tpl.variables?.length && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tpl.variables.map((variable, index) => {
                    const label = /^\d+$/.test(String(variable))
                      ? String(variable)
                      : String(index + 1);
                    return (
                      <span
                        key={`${label}-${index}`}
                        dir="ltr"
                        className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                      >
                        {`{{${label}}}`}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {isApproved ? (
                  <>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => setMappingTemplate(tpl)}
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                      {mappingLabel}
                    </button>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => setMappingTemplate(tpl)}
                    >
                      בדיקת מיפוי
                    </button>
                    <button
                      type="button"
                      className={btnPrimary}
                      disabled={!isReady && hasVars}
                      title={
                        !isReady && hasVars
                          ? "יש להשלים את הגדרת המשתנים לפני השליחה"
                          : undefined
                      }
                      onClick={() => {
                        if (!businessId) return;
                        navigate(`../compose?templateId=${tpl._id}`);
                      }}
                    >
                      <Send className="h-3.5 w-3.5" />
                      שליחה
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={btnSecondary}
                    disabled={tpl.source === "meta"}
                    title={
                      tpl.source === "meta"
                        ? t("whatsapp.templates.metaReadOnly")
                        : undefined
                    }
                    onClick={() => startEdit(tpl)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("whatsapp.templates.edit")}
                  </button>
                )}
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => handleDelete(tpl._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("whatsapp.templates.delete")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
