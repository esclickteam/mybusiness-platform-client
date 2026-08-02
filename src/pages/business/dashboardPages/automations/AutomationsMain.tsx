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
  GitBranch,
  Zap,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  createAutomationWorkflow,
  deleteAutomationWorkflow,
  listAutomationRecipes,
  listAutomationWorkflows,
  type AutomationRecipeSummary,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { FALLBACK_RECIPES } from "./automationFlowTypes";
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
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>(FALLBACK_RECIPES);
  const [active, setActive] = useState<AutomationWorkflow | null>(null);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [list, recipeList] = await Promise.all([
        listAutomationWorkflows(businessId),
        listAutomationRecipes(businessId).catch(() => FALLBACK_RECIPES),
      ]);
      setWorkflows(list);
      if (recipeList?.length) setRecipes(recipeList);
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

  const handleCreate = async (recipe?: string) => {
    if (!businessId) return;
    setCreatingKey(recipe || "blank");
    try {
      const created = await createAutomationWorkflow(businessId, {
        recipe,
        useStarter: !recipe ? true : undefined,
        name: recipe
          ? undefined
          : "אוטומציה חדשה",
      });
      setWorkflows((prev) => [created, ...prev]);
      setActive(created);
      toast.success("האוטומציה מוכנה לעריכה על הבד");
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
      setCreatingKey(null);
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
              <div className="af-list__toolbar">
                <div>
                  <strong style={{ fontSize: 15 }}>4 מתכונים מוכנים</strong>
                  <p className="af-muted">
                    בחרו תבנית מקצועית עם פיצולים, או התחילו בד ריק.
                  </p>
                </div>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  onClick={() => handleCreate()}
                  disabled={!businessId || Boolean(creatingKey)}
                >
                  {creatingKey === "blank" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  בד ריק + סטרטר
                </button>
              </div>

              <div className="af-list__cards">
                {recipes.slice(0, 4).map((recipe) => (
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
                      disabled={!businessId || Boolean(creatingKey)}
                      onClick={() => handleCreate(recipe.key)}
                    >
                      {creatingKey === recipe.key ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      צור מהמתכון
                    </button>
                  </article>
                ))}
              </div>

              <div className="af-list__toolbar" style={{ marginTop: 8 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>האוטומציות שלי</strong>
                  <p className="af-muted">
                    אפשר ליצור כמה אוטומציות נפרדות — כל אחת עם טריגרים וניתובים משלה.
                  </p>
                </div>
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
                  התחילו מאחד מ־4 המתכונים למעלה.
                </div>
              ) : (
                <div className="af-list__cards">
                  {workflows.map((wf) => {
                    const triggers = (wf.nodes || []).filter(
                      (n) => n.type === "trigger"
                    ).length;
                    const routes = (wf.edges || []).length;
                    return (
                      <article key={wf._id} className="af-card">
                        <div className="af-card__title">{wf.name}</div>
                        <div className="af-card__meta">
                          {triggers} טריגרים · {(wf.nodes || []).length} מודולים ·{" "}
                          {routes} ניתובים
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
