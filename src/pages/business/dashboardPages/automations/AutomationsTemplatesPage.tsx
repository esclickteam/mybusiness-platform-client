import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bot,
  CalendarDays,
  Loader2,
  Mail,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  isAutomationsReadOnly,
  listAutomationRecipes,
  type AutomationRecipeSummary,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import {
  TEMPLATE_CATEGORIES,
  getRecipeTriggerLabel,
  recipeMatchesCategory,
  recipeMatchesQuery,
  truncateDescription,
  type TemplateCategoryId,
} from "./templateCategoryMapping";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

function recipeIcon(recipe: AutomationRecipeSummary) {
  if (recipe.tier === "ai_paid" || recipe.isAiRecipe) return Sparkles;
  const key = recipe.key;
  if (key.includes("appointment")) return CalendarDays;
  if (key.includes("whatsapp") || key.includes("auto_reply")) return MessageCircle;
  if (key.includes("client") || key.includes("crm")) return Users;
  if (key.includes("mail") || key.includes("email")) return Mail;
  if (key.includes("lead")) return Zap;
  return Workflow;
}

export default function AutomationsTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>([]);
  const [recipesError, setRecipesError] = useState(false);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [showAiUpgrade, setShowAiUpgrade] = useState(false);
  const [query, setQuery] = useState("");

  const initialCategory = (searchParams.get("focus") === "ai" ||
  searchParams.get("tier") === "ai"
    ? "ai"
    : "all") as TemplateCategoryId;
  const [category, setCategory] = useState<TemplateCategoryId>(initialCategory);

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

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

  useEffect(() => {
    if (searchParams.get("focus") === "ai" || searchParams.get("tier") === "ai") {
      setCategory("ai");
      const next = new URLSearchParams(searchParams);
      next.delete("focus");
      next.delete("tier");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const visibleRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          recipeMatchesCategory(recipe, category) &&
          recipeMatchesQuery(recipe, query)
      ),
    [category, query, recipes]
  );

  const isHardComingSoon = (recipe: AutomationRecipeSummary) =>
    Boolean(
      recipe.comingSoon &&
        !recipe.isAiRecipe &&
        recipe.tier !== "ai_paid"
    );

  const handleCreate = async (recipe: AutomationRecipeSummary) => {
    if (!businessId) return;
    // Preserve existing gating: AI recipes may be marked comingSoon but still
    // open the entitlement upgrade flow / create when allowed.
    if (isHardComingSoon(recipe)) return;
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
      navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
    } finally {
      setCreatingKey(null);
    }
  };

  return (
    <div className="ax-page ax-templates">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">תבניות אוטומציה</h1>
          <p className="ax-home__subtitle">
            התחל מתהליך מוכן והתאם אותו לעסק שלך
          </p>
        </div>
      </header>

      <div className="ax-templates__toolbar">
        <label className="ax-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חפש תבנית"
          />
        </label>
        <div className="ax-filters" role="tablist" aria-label="קטגוריות תבניות">
          {TEMPLATE_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={category === item.id}
              className={`ax-chip${category === item.id ? " ax-chip--active" : ""}`}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען תבניות...
        </div>
      ) : recipesError ? (
        <div className="ax-empty ax-empty--card">
          לא ניתן לטעון את התבניות כרגע.
        </div>
      ) : visibleRecipes.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>לא נמצאו תבניות</strong>
          <p>נסו קטגוריה אחרת או שנו את החיפוש.</p>
        </div>
      ) : (
        <div className="ax-template-grid">
          {visibleRecipes.map((recipe) => {
            const Icon = recipeIcon(recipe);
            const isAi = recipe.tier === "ai_paid" || Boolean(recipe.isAiRecipe);
            const locked = Boolean(recipe.aiLocked || recipe.canCreate === false);
            const hardComingSoon = isHardComingSoon(recipe);
            const showComingSoonBadge =
              hardComingSoon || (isAi && Boolean(recipe.comingSoon));
            const busy = creatingKey === recipe.key;

            return (
              <article key={recipe.key} className="ax-template-card">
                <div className="ax-template-card__top">
                  <span className="ax-template-card__icon" aria-hidden>
                    {isAi ? <Bot size={18} /> : <Icon size={18} />}
                  </span>
                  <div className="ax-template-card__badges">
                    {isAi ? <span className="ax-badge ax-badge--draft">AI</span> : null}
                    {showComingSoonBadge ? (
                      <span className="ax-badge ax-badge--paused">בקרוב</span>
                    ) : null}
                    {locked ? (
                      <span className="ax-badge ax-badge--draft">Premium</span>
                    ) : null}
                  </div>
                </div>

                <h3 className="ax-template-card__title">{recipe.name}</h3>
                <p className="ax-template-card__desc">
                  {truncateDescription(recipe.description)}
                </p>

                <div className="ax-template-card__meta">
                  <span>{getRecipeTriggerLabel(recipe)}</span>
                  <span>·</span>
                  <span>{recipe.nodeCount} שלבים</span>
                </div>

                <button
                  type="button"
                  className="ax-btn ax-btn--primary ax-template-card__cta"
                  disabled={
                    !businessId ||
                    Boolean(creatingKey) ||
                    hardComingSoon ||
                    (readOnly && !locked)
                  }
                  title={
                    hardComingSoon
                      ? "תבנית זו תהיה זמינה בקרוב"
                      : writeBlockedTitle
                  }
                  onClick={() => void handleCreate(recipe)}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {hardComingSoon
                    ? "בקרוב"
                    : locked
                      ? "למידע על התוסף"
                      : "השתמש בתבנית"}
                </button>
              </article>
            );
          })}
        </div>
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
