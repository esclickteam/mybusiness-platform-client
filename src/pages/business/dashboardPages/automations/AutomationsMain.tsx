import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Workflow,
  PencilLine,
  GitBranch,
  Zap,
  Play,
  Pause,
  Copy,
  Archive,
  History,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  deleteAutomationWorkflow,
  duplicateAutomationWorkflow,
  archiveAutomationWorkflow,
  pauseAutomationWorkflow,
  resumeAutomationWorkflow,
  getAutomationStats,
  isAutomationsReadOnly,
  listAutomationRecipes,
  listAutomationExecutions,
  listAutomationWorkflows,
  type AutomationExecution,
  type AutomationRecipeSummary,
  type AutomationStats,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import AutomationFlowEditor from "./AutomationFlowEditor";
import "./automationFlow.css";

function readErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "response" in error) {
    return String(
      (error as { response?: { data?: { error?: string } } }).response?.data
        ?.error || fallback
    );
  }
  return fallback;
}

export default function AutomationsMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth() as {
    user?: { businessId?: string | null } | null;
  };
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  const [loading, setLoading] = useState(true);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>([]);
  const [recipesError, setRecipesError] = useState(false);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [recipeFilter, setRecipeFilter] = useState<"all" | "standard" | "ai">("all");
  const [query, setQuery] = useState("");
  const [historyWorkflow, setHistoryWorkflow] = useState<AutomationWorkflow | null>(null);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAiUpgrade, setShowAiUpgrade] = useState(false);
  const [active, setActive] = useState<AutomationWorkflow | null>(null);
  const autoCreateHandled = useRef<string | null>(null);

  const standardRecipes = useMemo(
    () => recipes.filter((recipe) => (recipe.tier || "standard") !== "ai_paid"),
    [recipes]
  );
  const aiRecipes = useMemo(
    () => recipes.filter((recipe) => recipe.tier === "ai_paid"),
    [recipes]
  );
  const highlightAi = searchParams.get("tier") === "ai";
  const readOnly = isAutomationsReadOnly();
  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [list, recipeResult, statsResult] = await Promise.all([
        listAutomationWorkflows(businessId),
        listAutomationRecipes(businessId).then(
          (result) => ({ result, failed: false }),
          () => ({ result: null, failed: true })
        ),
        getAutomationStats(businessId),
      ]);
      setWorkflows(list);
      setStats(statsResult || null);
      setRecipes(recipeResult.result?.recipes || []);
      setRecipesError(recipeResult.failed);
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

  const visibleWorkflows = useMemo(
    () =>
      workflows.filter((workflow) => {
        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "failed"
              ? workflow.lastExecution?.status === "failed"
              : (workflow.status || (workflow.enabled ? "active" : "draft")) === statusFilter;
        const matchesRecipe =
          recipeFilter === "all" ||
          (recipeFilter === "ai" ? workflow.isAiRecipe : !workflow.isAiRecipe);
        const haystack = `${workflow.name} ${workflow.description || ""}`.toLowerCase();
        return matchesStatus && matchesRecipe && haystack.includes(query.trim().toLowerCase());
      }),
    [query, recipeFilter, statusFilter, workflows]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = useCallback(
    async (recipe?: string) => {
      if (!businessId) return;
      if (isAutomationsReadOnly()) {
        toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
        return;
      }
      setCreatingKey(recipe || "blank");
      try {
        const created = await createAutomationWorkflow(businessId, {
          recipe,
          useStarter: !recipe ? true : undefined,
          name: recipe ? undefined : "אוטומציה חדשה",
        });
        setWorkflows((prev) => [created, ...prev]);
        setActive(created);
        toast.success("האוטומציה מוכנה לעריכה על הבד");
      } catch (error: unknown) {
        toast.error(readErrorMessage(error, "שגיאה ביצירת אוטומציה"));
      } finally {
        setCreatingKey(null);
      }
    },
    [businessId]
  );

  const handleRecipeCreate = (recipe: AutomationRecipeSummary) => {
    if (recipe.comingSoon && !recipe.isAiRecipe && recipe.tier !== "ai_paid") return;
    if (recipe.aiLocked || recipe.canCreate === false) {
      setShowAiUpgrade(true);
      return;
    }
    void handleCreate(recipe.key);
  };

  const updateWorkflow = (saved: AutomationWorkflow) => {
    setWorkflows((previous) =>
      previous.map((workflow) => (workflow._id === saved._id ? saved : workflow))
    );
  };

  const handleLifecycle = async (
    workflow: AutomationWorkflow,
    action: "pause" | "resume" | "archive" | "duplicate"
  ) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    try {
      if (action === "duplicate") {
        const copy = await duplicateAutomationWorkflow(businessId, workflow._id);
        setWorkflows((previous) => [copy, ...previous]);
        setActive(copy);
        return;
      }
      const saved =
        action === "pause"
          ? await pauseAutomationWorkflow(businessId, workflow._id)
          : action === "resume"
            ? await resumeAutomationWorkflow(businessId, workflow._id)
            : await archiveAutomationWorkflow(businessId, workflow._id);
      updateWorkflow(saved);
      toast.success(action === "archive" ? "האוטומציה הועברה לארכיון" : "סטטוס האוטומציה עודכן");
    } catch (error: unknown) {
      toast.error(readErrorMessage(error, "לא ניתן לעדכן את האוטומציה"));
    }
  };

  const openHistory = async (workflow: AutomationWorkflow) => {
    if (!businessId) return;
    setHistoryWorkflow(workflow);
    setHistoryLoading(true);
    try {
      setExecutions(await listAutomationExecutions(businessId, workflow._id));
    } catch {
      setExecutions([]);
      toast.error("לא ניתן לטעון היסטוריית הרצות");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const recipeKey = searchParams.get("recipe");
    if (!businessId || !recipeKey || loading) return;
    if (isAutomationsReadOnly()) return;
    if (autoCreateHandled.current === recipeKey) return;
    autoCreateHandled.current = recipeKey;
    void handleCreate(recipeKey).finally(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("recipe");
      setSearchParams(next, { replace: true });
    });
  }, [businessId, handleCreate, loading, searchParams, setSearchParams]);

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    if (!window.confirm("למחוק את האוטומציה?")) return;
    try {
      await deleteAutomationWorkflow(businessId, id);
      setWorkflows((prev) => prev.filter((w) => w._id !== id));
      if (active?._id === id) setActive(null);
      toast.success("האוטומציה נמחקה");
    } catch (error: unknown) {
      toast.error(readErrorMessage(error, "שגיאה במחיקה"));
    }
  };

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <div className="af-shell mx-auto w-full max-w-[1920px]">
        {readOnly ? (
          <div
            className="af-preview-banner"
            role="status"
            data-testid="automations-preview-banner"
          >
            סביבת תצוגה מקדימה — פעולות עריכה והפעלה חסומות
          </div>
        ) : null}
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
                      בונה אוטומציות מקצועי
                    </h1>
                    <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                      כמה אוטומציות · כמה טריגרים בכל אוטומציה · כמה ניתובים ותוצאות
                      מכל טריגר — בסגנון Make / n8n.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-violet-600" />
                    <span className="text-xs font-black text-violet-700">
                      Multi-trigger · Multi-route
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="af-list">
              {stats && (
                <div className="af-stat-grid">
                  <div className="af-stat"><strong>{stats.total}</strong><span>אוטומציות</span></div>
                  <div className="af-stat"><strong>{stats.active}</strong><span>פעילות</span></div>
                  <div className="af-stat"><strong>{stats.runsLast30Days}</strong><span>הרצות ב־30 יום</span></div>
                  <div className="af-stat"><strong>{stats.failedLast30Days}</strong><span>הרצות שנכשלו</span></div>
                </div>
              )}
              <div className="af-list__toolbar">
                <div>
                  <strong style={{ fontSize: 15 }}>
                    תבניות אוטומציה
                  </strong>
                  <p className="af-muted">
                    בחרו תבנית מקצועית עם פיצולים, או התחילו בד ריק.
                  </p>
                </div>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  onClick={() => handleCreate()}
                  disabled={!businessId || Boolean(creatingKey) || readOnly}
                  title={writeBlockedTitle}
                >
                  {creatingKey === "blank" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  אוטומציה חדשה
                </button>
                <button
                  type="button"
                  className="af-btn"
                  onClick={() => document.getElementById("af-recipes")?.scrollIntoView({ behavior: "smooth" })}
                >
                  השתמשו בתבנית
                </button>
              </div>

              <div id="af-recipes" className="af-list__cards">
                {recipesError ? (
                  <div className="af-empty">לא ניתן לטעון את התבניות כרגע. נסו לרענן.</div>
                ) : null}
                {standardRecipes.map((recipe) => (
                  <article key={recipe.key} className="af-card af-card--recipe">
                    <div className="af-card__icon">
                      <Zap size={16} />
                    </div>
                    <div className="af-card__title">{recipe.name}</div>
                    <p className="af-muted">{recipe.description}</p>
                    <div className="af-card__meta">
                      {recipe.triggerCount} טריגרים · {recipe.nodeCount} מודולים ·{" "}
                      {recipe.pathCount} חיבורים
                    </div>
                    <button
                      type="button"
                      className="af-btn af-btn--primary"
                      disabled={
                        !businessId ||
                        Boolean(creatingKey) ||
                        Boolean(recipe.comingSoon) ||
                        readOnly
                      }
                      title={writeBlockedTitle}
                      onClick={() => handleRecipeCreate(recipe)}
                    >
                      {creatingKey === recipe.key ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      {recipe.comingSoon ? "בקרוב" : "צור מהמתכון"}
                    </button>
                  </article>
                ))}
              </div>

              {aiRecipes.length > 0 && (
                <>
                  <div
                    className="af-list__toolbar"
                    style={{
                      marginTop: 12,
                      border: highlightAi
                        ? "1px solid #f59e0b"
                        : undefined,
                      borderRadius: 16,
                      padding: highlightAi ? 12 : undefined,
                      background: highlightAi ? "#fffbeb" : undefined,
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 15 }}>
                        אוטומציות AI · בתשלום נוסף
                      </strong>
                      <p className="af-muted">
                        היועץ ממליץ — כאן בונים ומריצים את הפעולות האוטומטיות
                        המתקדמות.
                      </p>
                    </div>
                    <span className="af-pill af-pill--on">AI Paid</span>
                  </div>

                  <div className="af-list__cards">
                    {aiRecipes.map((recipe) => (
                      <article
                        key={recipe.key}
                        className="af-card af-card--recipe"
                        style={{
                          borderColor: "#fbbf24",
                          background:
                            "linear-gradient(180deg,#fffbeb 0%,#ffffff 55%)",
                        }}
                      >
                        <div
                          className="af-card__icon"
                          style={{ background: "#fef3c7", color: "#b45309" }}
                        >
                          <Sparkles size={16} />
                        </div>
                        <div className="af-card__title">{recipe.name}</div>
                        <p className="af-muted">{recipe.description}</p>
                        <div className="af-card__meta">
                          {recipe.triggerCount} טריגרים · {recipe.nodeCount}{" "}
                          מודולים · {recipe.pathCount} חיבורים
                        </div>
                        <button
                          type="button"
                          className="af-btn af-btn--primary"
                          disabled={
                            !businessId ||
                            Boolean(creatingKey) ||
                            Boolean(
                              recipe.comingSoon &&
                                !recipe.isAiRecipe &&
                                recipe.tier !== "ai_paid"
                            ) ||
                            readOnly
                          }
                          title={writeBlockedTitle}
                          onClick={() => handleRecipeCreate(recipe)}
                        >
                          {creatingKey === recipe.key ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Plus size={14} />
                          )}
                          {recipe.aiLocked || recipe.canCreate === false ? "למידע על התוסף" : recipe.comingSoon && !recipe.isAiRecipe && recipe.tier !== "ai_paid" ? "בקרוב" : "בנה אוטומציית AI"}
                        </button>
                      </article>
                    ))}
                  </div>
                </>
              )}

              <div className="af-list__toolbar" style={{ marginTop: 8 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>האוטומציות שלי</strong>
                  <p className="af-muted">
                    אפשר ליצור כמה אוטומציות נפרדות — כל אחת עם טריגרים וניתובים משלה.
                  </p>
                </div>
                <div className="af-filter-row">
                  <label className="af-search"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש אוטומציה" /></label>
                  {["all", "draft", "active", "paused", "archived", "failed"].map((value) => (
                    <button key={value} type="button" className={`af-filter-chip ${statusFilter === value ? "af-filter-chip--active" : ""}`} onClick={() => setStatusFilter(value)}>
                      {{ all: "הכל", draft: "טיוטות", active: "פעילות", paused: "מושהות", archived: "ארכיון", failed: "נכשלו לאחרונה" }[value]}
                    </button>
                  ))}
                  <button type="button" className={`af-filter-chip ${recipeFilter === "standard" ? "af-filter-chip--active" : ""}`} onClick={() => setRecipeFilter(recipeFilter === "standard" ? "all" : "standard")}>רגיל</button>
                  <button type="button" className={`af-filter-chip ${recipeFilter === "ai" ? "af-filter-chip--active" : ""}`} onClick={() => setRecipeFilter(recipeFilter === "ai" ? "all" : "ai")}>AI</button>
                </div>
              </div>

              {loading ? (
                <div className="af-empty">
                  <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                  טוען אוטומציות...
                </div>
              ) : visibleWorkflows.length === 0 ? (
                <div className="af-empty">
                  <Workflow className="mx-auto mb-3 h-8 w-8 text-violet-500" />
                  <strong style={{ display: "block", marginBottom: 6 }}>
                    עוד אין אוטומציות
                  </strong>
                  התחילו ממתכון רגיל או ממתכון AI למעלה.
                </div>
              ) : (
                <div className="af-list__cards">
                  {visibleWorkflows.map((wf) => {
                    const triggers = (wf.nodes || []).filter(
                      (n) => n.type === "trigger"
                    ).length;
                    const status = wf.status || (wf.enabled ? "active" : "draft");
                    const statusLabel = { draft: "טיוטה", active: "פעילה", paused: "מושהית", archived: "ארכיון", failed: "נכשלה" }[status] || "טיוטה";
                    return (
                      <article key={wf._id} className="af-card">
                        <div className="af-card__title">{wf.name}</div>
                        {wf.description ? <p className="af-muted">{wf.description}</p> : null}
                        <div className="af-card__meta">
                          טריגר: {triggers ? String((wf.nodes.find((node) => node.type === "trigger")?.data?.label || "לא הוגדר")) : "לא הוגדר"} · {(wf.nodes || []).length} מודולים
                        </div>
                        <span className={`af-pill af-status--${status}`}>{statusLabel}</span>
                        <div className="af-card__meta">
                          {wf.publishedVersionId ? `גרסה שפורסמה${wf.publishedAt ? ` · ${new Date(wf.publishedAt).toLocaleDateString("he-IL")}` : ""}` : "טרם פורסמה"}
                          {wf.recipeId ? ` · מתכון: ${wf.recipeId}` : ""}<br />
                          עודכנה: {wf.updatedAt ? new Date(wf.updatedAt).toLocaleDateString("he-IL") : "—"} · הרצה אחרונה: {wf.lastRunAt ? new Date(wf.lastRunAt).toLocaleString("he-IL") : "אין"}
                        </div>
                        {wf.stats ? <div className="af-card__meta">הרצות {wf.stats.runs} · הצליחו {wf.stats.success} · נכשלו {wf.stats.failed}</div> : null}
                        {wf.lastExecution ? <div className={`af-execution af-execution--${wf.lastExecution.status}`}>הרצה אחרונה: {wf.lastExecution.status}{wf.lastExecution.error ? ` · ${wf.lastExecution.error}` : ""}</div> : null}
                        <div className="af-card__actions">
                          <button
                            type="button"
                            className="af-btn af-btn--primary"
                            onClick={() => setActive(wf)}
                          >
                            <PencilLine size={14} />
                            עריכת זרימה
                          </button>
                          {status === "active" ? (
                            <button
                              type="button"
                              className="af-btn"
                              disabled={readOnly}
                              title={writeBlockedTitle}
                              onClick={() => void handleLifecycle(wf, "pause")}
                            >
                              <Pause size={14} />
                              השהיה
                            </button>
                          ) : status === "paused" ? (
                            <button
                              type="button"
                              className="af-btn"
                              disabled={readOnly}
                              title={writeBlockedTitle}
                              onClick={() => void handleLifecycle(wf, "resume")}
                            >
                              <Play size={14} />
                              המשך
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="af-btn"
                            disabled={readOnly}
                            title={writeBlockedTitle}
                            onClick={() => void handleLifecycle(wf, "duplicate")}
                          >
                            <Copy size={14} />
                            שכפול
                          </button>
                          <button
                            type="button"
                            className="af-btn"
                            disabled={readOnly}
                            title={writeBlockedTitle}
                            onClick={() => setActive(wf)}
                          >
                            <Play size={14} />
                            בדיקה
                          </button>
                          <button type="button" className="af-btn" onClick={() => void openHistory(wf)}><History size={14} />היסטוריה</button>
                          {status !== "archived" ? (
                            <button
                              type="button"
                              className="af-btn"
                              disabled={readOnly}
                              title={writeBlockedTitle}
                              onClick={() => void handleLifecycle(wf, "archive")}
                            >
                              <Archive size={14} />
                              ארכוב
                            </button>
                          ) : null}
                          {status === "draft" ? (
                          <button
                            type="button"
                            className="af-btn af-btn--danger"
                            disabled={readOnly}
                            title={writeBlockedTitle}
                            onClick={() => handleDelete(wf._id)}
                          >
                            <Trash2 size={14} />
                            מחיקה
                          </button>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : businessId ? (
          <AutomationFlowEditor
            businessId={businessId}
            workflow={active}
            readOnly={readOnly}
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
        {showAiUpgrade ? (
          <div className="af-modal-backdrop" role="dialog" aria-modal="true">
            <div className="af-modal">
              <button type="button" className="af-modal__close" onClick={() => setShowAiUpgrade(false)}><X size={16} /></button>
              <h2>אוטומציות AI · בתשלום נוסף</h2>
              <p>מתכון זה דורש תוסף אוטומציות AI פעיל. לאחר הפעלת התוסף תוכלו ליצור ולערוך אותו.</p>
              <button type="button" className="af-btn af-btn--primary" onClick={() => setShowAiUpgrade(false)}>הבנתי</button>
            </div>
          </div>
        ) : null}
        {historyWorkflow ? (
          <div className="af-modal-backdrop" role="dialog" aria-modal="true">
            <div className="af-modal af-modal--wide">
              <button type="button" className="af-modal__close" onClick={() => setHistoryWorkflow(null)}><X size={16} /></button>
              <h2>היסטוריית הרצות · {historyWorkflow.name}</h2>
              {historyLoading ? <Loader2 className="animate-spin" /> : executions.length ? (
                <div className="af-history-list">{executions.map((execution) => <div key={execution.executionId} className={`af-execution af-execution--${execution.status}`}><strong>{execution.status}</strong> · {execution.createdAt ? new Date(execution.createdAt).toLocaleString("he-IL") : "—"}{execution.error ? ` · ${execution.error}` : ""}</div>)}</div>
              ) : <div className="af-empty">עדיין אין היסטוריית הרצות לאוטומציה זו.</div>}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
