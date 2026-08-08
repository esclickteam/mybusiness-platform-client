import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Plus, Sparkles, X, Zap } from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  isAutomationsReadOnly,
  listAutomationRecipes,
  type AutomationRecipeSummary,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

/**
 * Phase 2: move templates off Home.
 * Phase 3 will redesign search/categories/card polish.
 */
export default function AutomationsTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>([]);
  const [recipesError, setRecipesError] = useState(false);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [showAiUpgrade, setShowAiUpgrade] = useState(false);

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;
  const focusAi =
    searchParams.get("focus") === "ai" || searchParams.get("tier") === "ai";

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const result = await listAutomationRecipes(businessId);
      setRecipes(result?.recipes || []);
      setRecipesError(false);
    } catch {
      setRecipes([]);
      setRecipesError(true);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void load();
  }, [load]);

  const standardRecipes = useMemo(
    () => recipes.filter((recipe) => (recipe.tier || "standard") !== "ai_paid"),
    [recipes]
  );
  const aiRecipes = useMemo(
    () => recipes.filter((recipe) => recipe.tier === "ai_paid"),
    [recipes]
  );

  const handleCreate = async (recipe: AutomationRecipeSummary) => {
    if (!businessId) return;
    if (recipe.comingSoon && !recipe.isAiRecipe && recipe.tier !== "ai_paid") {
      return;
    }
    if (recipe.aiLocked || recipe.canCreate === false) {
      setShowAiUpgrade(true);
      return;
    }
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setCreatingKey(recipe.key);
    try {
      const created = await createAutomationWorkflow(businessId, {
        recipe: recipe.key,
      });
      toast.success("האוטומציה נוצרה מהתבנית");
      navigate(`../${created._id}`);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
    } finally {
      setCreatingKey(null);
    }
  };

  return (
    <div className="ax-page">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">תבניות אוטומציה</h1>
          <p className="ax-home__subtitle">
            בחרו תבנית מוכנה והמשיכו לעריכה על הבד. עיצוב מלא של הקטלוג יגיע בשלב
            הבא.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען תבניות...
        </div>
      ) : recipesError ? (
        <div className="ax-empty ax-empty--card">לא ניתן לטעון את התבניות כרגע.</div>
      ) : (
        <>
          <div className="af-list__cards">
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
                  onClick={() => void handleCreate(recipe)}
                >
                  {creatingKey === recipe.key ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  {recipe.comingSoon ? "בקרוב" : "השתמש בתבנית"}
                </button>
              </article>
            ))}
          </div>

          {aiRecipes.length > 0 ? (
            <>
              <div
                className="af-list__toolbar"
                style={{
                  marginTop: 20,
                  border: focusAi ? "1px solid #e2e8f0" : undefined,
                  borderRadius: 12,
                  padding: focusAi ? 12 : undefined,
                  background: focusAi ? "#f8fafc" : undefined,
                }}
              >
                <div>
                  <strong style={{ fontSize: 15 }}>תבניות AI</strong>
                  <p className="af-muted">
                    חלק מהתבניות דורשות תוסף AI וחלקן מסומנות כבקרוב.
                  </p>
                </div>
                <span className="ax-badge ax-badge--draft">
                  <Sparkles size={12} />
                  AI
                </span>
              </div>
              <div className="af-list__cards">
                {aiRecipes.map((recipe) => (
                  <article key={recipe.key} className="af-card">
                    <div className="af-card__icon" style={{ background: "#f8fafc" }}>
                      <Sparkles size={16} />
                    </div>
                    <div className="af-card__title">{recipe.name}</div>
                    <p className="af-muted">{recipe.description}</p>
                    <div className="af-card__meta">
                      {recipe.triggerCount} טריגרים · {recipe.nodeCount} מודולים
                    </div>
                    <button
                      type="button"
                      className="af-btn af-btn--primary"
                      disabled={!businessId || Boolean(creatingKey) || readOnly}
                      title={writeBlockedTitle}
                      onClick={() => void handleCreate(recipe)}
                    >
                      {creatingKey === recipe.key ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      {recipe.aiLocked || recipe.canCreate === false
                        ? "למידע על התוסף"
                        : recipe.comingSoon &&
                            !recipe.isAiRecipe &&
                            recipe.tier !== "ai_paid"
                          ? "בקרוב"
                          : "השתמש בתבנית"}
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </>
      )}

      {showAiUpgrade ? (
        <div className="af-modal-backdrop" role="dialog" aria-modal="true">
          <div className="af-modal">
            <button
              type="button"
              className="af-modal__close"
              onClick={() => setShowAiUpgrade(false)}
            >
              <X size={16} />
            </button>
            <h2>אוטומציות AI · בתשלום נוסף</h2>
            <p>
              מתכון זה דורש תוסף אוטומציות AI פעיל. לאחר הפעלת התוסף תוכלו ליצור
              ולערוך אותו.
            </p>
            <button
              type="button"
              className="af-btn af-btn--primary"
              onClick={() => setShowAiUpgrade(false)}
            >
              הבנתי
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
