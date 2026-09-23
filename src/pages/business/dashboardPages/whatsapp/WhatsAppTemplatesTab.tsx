import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { toast } from "react-toastify";
import {
  Loader2,
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
import WhatsAppTemplateDrawer from "./WhatsAppTemplateDrawer";
import { formatWhatsAppTemplateCategory } from "../automations/whatsAppTemplateSelectFormat";
import {
  metaTemplateStatusKey,
  metaTemplateStatusLabel,
} from "../../../../i18n/whatsappMappingCopy";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

function getMetaStatusKey(tpl: WhatsAppTemplate): string {
  return metaTemplateStatusKey(tpl.metaStatus, tpl.metaQualityScore, tpl.source);
}

function getMetaStatusLabel(tpl: WhatsAppTemplate, t: TranslateFn): string {
  return metaTemplateStatusLabel(
    t,
    tpl.metaStatus,
    tpl.metaQualityScore,
    tpl.source,
  );
}

function getMappingStatusKey(tpl: WhatsAppTemplate): string | null {
  if (String(tpl.metaStatus || "").toUpperCase() !== "APPROVED") return null;
  if (!(tpl.variables || []).length) return null;
  const mapping = (tpl.mappingStatus || "") as WhatsAppMappingStatus;
  if (mapping === "ready" || tpl.mappingReady) return "ready";
  if (mapping === "partial") return "partial";
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
  if (key === "pending" || key === "inAppeal" || key === "pendingDeletion") {
    return "bg-amber-50 text-amber-700";
  }
  if (key === "rejected" || key === "disabled" || key === "deleted") {
    return "bg-rose-50 text-rose-700";
  }
  if (key === "paused" || key === "limitExceeded") return "bg-orange-50 text-orange-700";
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
  const { t, i18n } = useTranslation();
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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerTemplate, setDrawerTemplate] = useState<WhatsAppTemplate | null>(
    null
  );
  const previousMetaStatus = useRef<Record<string, string>>({});

  const bodyVariables = useMemo(
    () => extractMetaVariables(form.body),
    [form.body]
  );

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return templates.filter((tpl) => {
      const st = String(tpl.metaStatus || "").toUpperCase();
      if (statusFilter === "approved" && st !== "APPROVED") return false;
      if (statusFilter === "pending" && st !== "PENDING" && st !== "IN_APPEAL") {
        return false;
      }
      if (statusFilter === "rejected" && st !== "REJECTED") return false;
      if (
        statusFilter === "paused" &&
        st !== "PAUSED" &&
        st !== "DISABLED"
      ) {
        return false;
      }
      if (!q) return true;
      return (
        tpl.name.toLowerCase().includes(q) ||
        String(tpl.metaTemplateName || "").toLowerCase().includes(q) ||
        String(tpl.language || "").toLowerCase().includes(q) ||
        String(tpl.category || "").toLowerCase().includes(q)
      );
    });
  }, [templates, statusFilter, searchQuery]);

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

  const notifyApprovals = (rows: WhatsAppTemplate[]) => {
    const prev = previousMetaStatus.current;
    rows.forEach((tpl) => {
      const current = String(tpl.metaStatus || "").toUpperCase();
      const before = prev[tpl._id];
      if (before === "PENDING" && current === "APPROVED") {
        toast.success(
          t("whatsapp.templates.approvedAutoToast", { name: tpl.name })
        );
      }
      prev[tpl._id] = current;
    });
  };

  const load = async (opts: { quiet?: boolean } = {}) => {
    if (!businessId) return;
    if (!opts.quiet) setLoading(true);
    try {
      const data = await listWhatsAppTemplates(businessId);
      setTemplates(data);
      notifyApprovals(data);
    } catch (error: any) {
      if (!opts.quiet) {
        toast.error(
          error?.response?.data?.error || t("whatsapp.errors.loadTemplates")
        );
      }
    } finally {
      if (!opts.quiet) setLoading(false);
    }
  };

  const handleSyncFromMeta = async () => {
    if (!businessId) return;
    try {
      setSyncing(true);
      const result = await syncWhatsAppTemplates(businessId);
      setTemplates(result.templates || (await listWhatsAppTemplates(businessId)));
      const statusSummary = (result.rawStatuses || [])
        .map(
          (row) =>
            `${row.name}: ${metaTemplateStatusLabel(t, row.status, row.qualityScore)}`
        )
        .slice(0, 5)
        .join(" · ");
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

  const hasPendingReview = templates.some((tpl) => {
    const status = String(tpl.metaStatus || "").toUpperCase();
    return status === "PENDING" || status === "IN_APPEAL";
  });

  useEffect(() => {
    if (!businessId || !hasPendingReview) return;
    const timer = window.setInterval(() => {
      void load({ quiet: true });
    }, 15000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, hasPendingReview]);

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
    <div className="space-y-4" dir={getTextDirection(i18n.language)}>
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

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", t("whatsapp.hub.total")],
            ["approved", t("whatsapp.hub.approved")],
            ["pending", t("whatsapp.hub.pending")],
            ["rejected", t("whatsapp.hub.rejected")],
            ["paused", "Paused"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={[
              "rounded-full border px-3 py-1 text-xs font-black transition",
              statusFilter === key
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
            onClick={() => setStatusFilter(key)}
          >
            {label}
          </button>
        ))}
        <input
          className={`${inputBase} ms-auto max-w-xs`}
          placeholder={t("whatsapp.templates.searchPlaceholder", {
            defaultValue: "Search templates…",
          })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
                {t("whatsapp.templates.localDraftBadge")}
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

      <div className={`${cardBase} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-start text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2.5 font-black">{t("whatsapp.templates.name")}</th>
                <th className="hidden px-3 py-2.5 font-black lg:table-cell">
                  Preview
                </th>
                <th className="px-3 py-2.5 font-black">Lang</th>
                <th className="hidden px-3 py-2.5 font-black md:table-cell">
                  Category
                </th>
                <th className="px-3 py-2.5 font-black">Status</th>
                <th className="hidden px-3 py-2.5 font-black xl:table-cell">
                  Quality
                </th>
                <th className="hidden px-3 py-2.5 font-black sm:table-cell">
                  Updated
                </th>
                <th className="px-3 py-2.5 font-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-10 text-center text-xs font-semibold text-slate-400"
                  >
                    {t("whatsapp.templates.empty", {
                      defaultValue: "No templates found",
                    })}
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((tpl) => {
                  const isApproved =
                    String(tpl.metaStatus || "").toUpperCase() === "APPROVED";
                  const preview = String(tpl.body || "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 72);
                  const updated = tpl.updatedAt || tpl.lastSyncedAt;
                  return (
                    <tr
                      key={tpl._id}
                      className="cursor-pointer border-b border-slate-50 transition hover:bg-emerald-50/40"
                      onClick={() => setDrawerTemplate(tpl)}
                    >
                      <td className="px-3 py-2.5">
                        <p className="font-black text-slate-900">{tpl.name}</p>
                        {tpl.rejectionReason ? (
                          <p className="mt-0.5 max-w-[220px] truncate text-[10px] font-semibold text-rose-600">
                            {tpl.rejectionReason}
                          </p>
                        ) : null}
                      </td>
                      <td className="hidden max-w-[240px] px-3 py-2.5 text-xs font-medium text-slate-500 lg:table-cell">
                        <span className="line-clamp-2">
                          {preview || "—"}
                          {preview.length >= 72 ? "…" : ""}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-bold text-slate-600">
                        {tpl.language}
                      </td>
                      <td className="hidden px-3 py-2.5 text-xs font-semibold text-slate-600 md:table-cell">
                        {formatWhatsAppTemplateCategory(tpl)}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={[
                            "inline-flex rounded-md px-2 py-0.5 text-[10px] font-black",
                            getMetaStatusClass(tpl),
                          ].join(" ")}
                        >
                          {getMetaStatusLabel(tpl, t)}
                        </span>
                      </td>
                      <td className="hidden px-3 py-2.5 text-xs font-bold text-slate-600 xl:table-cell">
                        {tpl.metaQualityScore || "—"}
                      </td>
                      <td className="hidden px-3 py-2.5 text-xs font-semibold text-slate-500 sm:table-cell">
                        {updated
                          ? new Date(updated).toLocaleDateString()
                          : "—"}
                      </td>
                      <td
                        className="px-3 py-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-1">
                          {isApproved ? (
                            <button
                              type="button"
                              className={`${btnSecondary} !px-2 !py-1 text-[10px]`}
                              onClick={() => {
                                if (!businessId) return;
                                navigate(
                                  `../messages/compose?templateId=${tpl._id}`
                                );
                              }}
                            >
                              <Send className="h-3 w-3" />
                              {t("whatsapp.templates.send")}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className={`${btnSecondary} !px-2 !py-1 text-[10px]`}
                            onClick={() => setDrawerTemplate(tpl)}
                          >
                            {t("whatsapp.hub.view", { defaultValue: "View" })}
                          </button>
                          <button
                            type="button"
                            className={`${btnSecondary} !px-2 !py-1 text-[10px]`}
                            onClick={() => void handleDelete(tpl._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WhatsAppTemplateDrawer
        open={Boolean(drawerTemplate)}
        template={drawerTemplate}
        onClose={() => setDrawerTemplate(null)}
        onEdit={(tpl) => {
          setDrawerTemplate(null);
          startEdit(tpl);
        }}
        onDelete={(tpl) => {
          setDrawerTemplate(null);
          void handleDelete(tpl._id);
        }}
        onMap={(tpl) => {
          setDrawerTemplate(null);
          setMappingTemplate(tpl);
        }}
      />
    </div>
  );
}
