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
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import {
  deleteWhatsAppTemplate,
  duplicateWhatsAppTemplate,
  listWhatsAppTemplates,
  refreshWhatsAppTemplate,
  syncWhatsAppTemplates,
  type WhatsAppMappingStatus,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { lifecycleBucket } from "./whatsappTemplateEditorModel";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import WhatsAppCreateTemplateWizard from "./WhatsAppCreateTemplateWizard";
import WhatsAppVariableMappingScreen from "./WhatsAppVariableMappingScreen";
import WhatsAppTemplateDrawer from "./WhatsAppTemplateDrawer";
import { formatWhatsAppTemplateCategory } from "../automations/whatsAppTemplateSelectFormat";
import { formatQualityRating } from "./hubFormat";
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

export default function WhatsAppTemplatesTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mappingTemplate, setMappingTemplate] =
    useState<WhatsAppTemplate | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerTemplate, setDrawerTemplate] = useState<WhatsAppTemplate | null>(
    null
  );
  const previousMetaStatus = useRef<Record<string, string>>({});

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return templates.filter((tpl) => {
      const st = String(tpl.metaStatus || "").toUpperCase();
      const bucket = lifecycleBucket(tpl);
      if (statusFilter === "local" && bucket !== "local") return false;
      if (statusFilter === "sync_error" && bucket !== "sync_error") return false;
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
      setShowForm(true);
      const next = new URLSearchParams(searchParams);
      next.delete("create");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (tpl: WhatsAppTemplate) => {
    setEditingId(tpl._id);
    setShowForm(true);
  };

  const handleDuplicate = async (id: string) => {
    if (!businessId) return;
    try {
      await duplicateWhatsAppTemplate(businessId, id);
      toast.success(t("whatsapp.wizard.duplicated"));
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t("whatsapp.wizard.draftFailed"));
    }
  };

  const handleRefresh = async (id: string) => {
    if (!businessId) return;
    try {
      const result = await refreshWhatsAppTemplate(businessId, id);
      if (result.skipped && result.reason === "throttled") {
        toast.info(t("whatsapp.wizard.refreshThrottled"));
      } else if (result.skipped && result.reason === "local_draft") {
        toast.info(t("whatsapp.wizard.localOnly"));
      } else {
        toast.success(t("whatsapp.wizard.refreshed"));
      }
      await load({ quiet: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t("whatsapp.errors.syncTemplates"));
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
    <div className="space-y-4" dir={getTextDirection(i18n.language)} data-demo-target="whatsapp-templates">
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
            ["local", t("whatsapp.wizard.filters.local")],
            ["approved", t("whatsapp.hub.approved")],
            ["pending", t("whatsapp.hub.pending")],
            ["rejected", t("whatsapp.hub.rejected")],
            ["paused", t("whatsapp.templates.metaStatus.paused")],
            ["sync_error", t("whatsapp.wizard.filters.syncError")],
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

      {showForm && businessId && (
        <WhatsAppCreateTemplateWizard
          key={editingId || "new"}
          businessId={businessId}
          initialTemplate={
            editingId
              ? templates.find((tpl) => tpl._id === editingId) || null
              : null
          }
          onClose={resetForm}
          onSubmitted={load}
        />
      )}

      <div className={`${cardBase} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-start text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2.5 font-black">{t("whatsapp.templates.name")}</th>
                <th className="hidden px-3 py-2.5 font-black lg:table-cell">
                  {t("whatsapp.templates.columns.preview", "Preview")}
                </th>
                <th className="px-3 py-2.5 font-black">{t("whatsapp.templates.columns.language", "Lang")}</th>
                <th className="hidden px-3 py-2.5 font-black md:table-cell">
                  {t("whatsapp.templates.columns.category", "Category")}
                </th>
                <th className="px-3 py-2.5 font-black">{t("whatsapp.templates.columns.status", "Status")}</th>
                <th className="hidden px-3 py-2.5 font-black xl:table-cell">
                  {t("whatsapp.templates.columns.quality", "Quality")}
                </th>
                <th className="hidden px-3 py-2.5 font-black sm:table-cell">
                  {t("whatsapp.templates.columns.updated", "Updated")}
                </th>
                <th className="px-3 py-2.5 font-black">{t("whatsapp.templates.columns.actions", "Actions")}</th>
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
                        {formatQualityRating(tpl.metaQualityScore, t) || "—"}
                      </td>
                      <td className="hidden px-3 py-2.5 text-xs font-semibold text-slate-500 sm:table-cell">
                        {updated
                          ? new Date(updated).toLocaleDateString(i18n.language)
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
                            onClick={() => startEdit(tpl)}
                          >
                            {t("whatsapp.templates.edit", { defaultValue: "Edit" })}
                          </button>
                          <button
                            type="button"
                            className={`${btnSecondary} !px-2 !py-1 text-[10px]`}
                            onClick={() => void handleDuplicate(tpl._id)}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            className={`${btnSecondary} !px-2 !py-1 text-[10px]`}
                            onClick={() => void handleRefresh(tpl._id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
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
