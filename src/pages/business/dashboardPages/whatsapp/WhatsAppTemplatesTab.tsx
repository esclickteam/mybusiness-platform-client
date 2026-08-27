import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Trash2,
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
import { WhatsAppMetaTemplateContent } from "./WhatsAppMetaTemplateContent";
import WhatsAppVariableMappingScreen from "./WhatsAppVariableMappingScreen";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

function getMetaStatusKey(tpl: WhatsAppTemplate): string {
  const meta = String(tpl.metaStatus || "").toUpperCase();
  const quality = String(tpl.metaQualityScore || "").toUpperCase();
  if (meta === "PENDING") return "pending";
  if (meta === "IN_APPEAL") return "inAppeal";
  if (meta === "REJECTED") return "rejected";
  if (meta === "DISABLED") return "disabled";
  if (meta === "PAUSED") return "paused";
  if (meta === "APPROVED") {
    if (!quality || quality === "UNKNOWN" || quality === "PENDING") {
      return "activePendingQuality";
    }
    if (quality === "GREEN" || quality === "HIGH") return "activeHighQuality";
    if (quality === "YELLOW" || quality === "MEDIUM") return "activeMediumQuality";
    if (quality === "RED" || quality === "LOW") return "activeLowQuality";
    return "active";
  }
  if (meta === "LOCAL" || tpl.source === "local") return "localDraft";
  return "localDraft";
}

function getMetaStatusLabel(tpl: WhatsAppTemplate, t: TranslateFn): string {
  return t(`whatsapp.templates.metaStatus.${getMetaStatusKey(tpl)}`);
}

function getMappingStatusKey(tpl: WhatsAppTemplate): string | null {
  if (String(tpl.metaStatus || "").toUpperCase() !== "APPROVED") return null;
  const mapping = (tpl.mappingStatus || "") as WhatsAppMappingStatus;
  if (mapping === "ready" || tpl.mappingReady) return "ready";
  if (mapping === "partial") return "partial";
  const hasVars = (tpl.variables || []).length > 0;
  if (!hasVars) return "ready";
  return "unmapped";
}

function getMappingStatusLabel(
  tpl: WhatsAppTemplate,
  t: TranslateFn
): string | null {
  const key = getMappingStatusKey(tpl);
  if (!key) return null;
  return t(`whatsapp.templates.mappingStatus.${key}`);
}

function getMetaStatusClass(tpl: WhatsAppTemplate): string {
  const key = getMetaStatusKey(tpl);
  if (key.startsWith("active")) return "bg-emerald-50 text-emerald-700";
  if (key === "pending" || key === "inAppeal") {
    return "bg-amber-50 text-amber-700";
  }
  if (key === "rejected" || key === "disabled") {
    return "bg-rose-50 text-rose-700";
  }
  if (key === "paused") return "bg-orange-50 text-orange-700";
  return "bg-slate-100 text-slate-600";
}

function getMappingStatusClass(tpl: WhatsAppTemplate): string {
  const key = getMappingStatusKey(tpl);
  if (key === "ready") return "bg-emerald-50 text-emerald-700";
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
        .join(" ֲ· ");
      toast.success(
        statusSummary
          ? t("whatsapp.templates.syncedWithSummary", {
              count: result.synced ?? 0,
              summary: statusSummary,
            })
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
    <div className="space-y-4" dir="rtl">
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
              ׳˜׳™׳•׳˜׳” ׳׳§׳•׳׳™׳×
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

          <div className="wa-meta-wizard" style={{ border: 0, boxShadow: "none" }}>
            <WhatsAppMetaTemplateContent
              headerType={form.headerType}
              headerText={form.headerText}
              headerMediaUrl={form.headerMediaUrl}
              body={form.body}
              footer={form.footer}
              buttons={form.buttons}
              exampleValues={form.exampleValues}
              variableType={form.variableType}
              allowedButtons={[
                "quick_reply",
                "url",
                "voice_call",
                "phone_number",
                "request_contact_info",
              ]}
              onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            />
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
          const mappingLabel = t(
            isReady || !hasVars
              ? "whatsapp.templates.editMapping"
              : "whatsapp.templates.setupVariables"
          );

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
                    {tpl.language} ֲ·{" "}
                    {tpl.source === "meta"
                      ? t("whatsapp.templates.sourceMeta")
                      : t("whatsapp.templates.sourceLocal")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {(() => {
                    const metaLabel = getMetaStatusLabel(tpl, t);
                    const mappingBadge = getMappingStatusLabel(tpl, t);
                    return (
                      <>
                        <span
                          className={[
                            "rounded-md px-2 py-0.5 text-[10px] font-black",
                            getMetaStatusClass(tpl),
                          ].join(" ")}
                        >
                          {metaLabel}
                        </span>
                        {mappingBadge ? (
                          <span
                            className={[
                              "rounded-md px-2 py-0.5 text-[10px] font-black",
                              getMappingStatusClass(tpl),
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
                      {t("whatsapp.templates.testMapping")}
                    </button>
                    <button
                      type="button"
                      className={btnPrimary}
                      disabled={!isReady && hasVars}
                      title={
                        !isReady && hasVars
                          ? t("whatsapp.templates.mappingRequiredBeforeSend")
                          : undefined
                      }
                      onClick={() => {
                        if (!businessId) return;
                        navigate(`../compose?templateId=${tpl._id}`);
                      }}
                    >
                      <Send className="h-3.5 w-3.5" />
                      {t("whatsapp.templates.send")}
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
