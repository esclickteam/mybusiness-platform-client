import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Workflow,
  PencilLine,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  createAutomationWorkflow,
  deleteAutomationWorkflow,
  listAutomationWorkflows,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import AutomationFlowEditor from "./AutomationFlowEditor";
import "./automationFlow.css";

export default function AutomationsMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth() as {
    user?: { businessId?: string | null } | null;
  };
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [active, setActive] = useState<AutomationWorkflow | null>(null);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const list = await listAutomationWorkflows(businessId);
      setWorkflows(list);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? String(
              (error as { response?: { data?: { error?: string } } }).response
                ?.data?.error || ""
            )
          : "";
      toast.error(message || "שגיאה בטעינת האוטומציות");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async () => {
    if (!businessId) return;
    setCreating(true);
    try {
      const created = await createAutomationWorkflow(businessId, {
        name: "אוטומציה חדשה",
        useStarter: true,
      });
      setWorkflows((prev) => [created, ...prev]);
      setActive(created);
      toast.success("נוצרה אוטומציה חדשה — גררו מודולים ובנו את הזרימה");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? String(
              (error as { response?: { data?: { error?: string } } }).response
                ?.data?.error || ""
            )
          : "";
      toast.error(message || "שגיאה ביצירת אוטומציה");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!window.confirm("למחוק את האוטומציה?")) return;
    try {
      await deleteAutomationWorkflow(businessId, id);
      setWorkflows((prev) => prev.filter((w) => w._id !== id));
      if (active?._id === id) setActive(null);
      toast.success("האוטומציה נמחקה");
    } catch {
      toast.error("שגיאה במחיקה");
    }
  };

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <div className="af-shell mx-auto w-full max-w-[1920px]">
        {!active ? (
          <>
            <header className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="relative overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-l from-violet-50/80 via-sky-50/50 to-cyan-50/40"
                />
                <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      {t("automations.shell.badge", "אוטומציות")}
                    </p>
                    <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      {t("automations.shell.title", "אוטומציות")}
                    </h1>
                    <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                      בונה תהליכים ויזואלי בסגנון Make / n8n — גררו מודולים,
                      חברו ביניהם, והפעילו.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5">
                    <Workflow className="h-3.5 w-3.5 text-violet-600" />
                    <span className="text-xs font-black text-violet-700">
                      Drag & Drop Builder
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="af-list">
              <div className="af-list__toolbar">
                <div>
                  <strong style={{ fontSize: 15 }}>התהליכים שלי</strong>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#64748b",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    כל אוטומציה היא בד ציור עם טריגרים, תנאים ופעולות.
                  </p>
                </div>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  onClick={handleCreate}
                  disabled={!businessId || creating}
                >
                  {creating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  אוטומציה חדשה
                </button>
              </div>

              {loading ? (
                <div className="af-empty">
                  <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                  טוען אוטומציות...
                </div>
              ) : workflows.length === 0 ? (
                <div className="af-empty">
                  <Workflow className="mx-auto mb-3 h-8 w-8 text-violet-500" />
                  <strong style={{ display: "block", marginBottom: 6 }}>
                    עוד אין אוטומציות
                  </strong>
                  צרו תהליך ראשון וגררו מודולים לבד הציור — כמו ב־Make וב־n8n.
                </div>
              ) : (
                <div className="af-list__cards">
                  {workflows.map((wf) => (
                    <article key={wf._id} className="af-card">
                      <div className="af-card__title">{wf.name}</div>
                      <div className="af-card__meta">
                        {(wf.nodes || []).length} מודולים ·{" "}
                        {(wf.edges || []).length} חיבורים
                      </div>
                      <span
                        className={`af-pill ${
                          wf.enabled ? "af-pill--on" : "af-pill--off"
                        }`}
                      >
                        {wf.enabled ? "פעיל" : "כבוי"}
                      </span>
                      <div className="af-card__actions">
                        <button
                          type="button"
                          className="af-btn af-btn--primary"
                          onClick={() => setActive(wf)}
                        >
                          <PencilLine size={14} />
                          עריכת זרימה
                        </button>
                        <button
                          type="button"
                          className="af-btn af-btn--danger"
                          onClick={() => handleDelete(wf._id)}
                        >
                          <Trash2 size={14} />
                          מחיקה
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : businessId ? (
          <AutomationFlowEditor
            businessId={businessId}
            workflow={active}
            onBack={() => {
              setActive(null);
              void load();
            }}
            onSaved={(saved) => {
              setActive(saved);
              setWorkflows((prev) =>
                prev.map((w) => (w._id === saved._id ? saved : w))
              );
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
