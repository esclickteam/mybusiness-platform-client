import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
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
  getRecipeResultLabel,
  getRecipeTriggerLabel,
  recipeMatchesCategory,
  recipeMatchesQuery,
  truncateDescription,
  type TemplateCategoryId,
} from "./templateCategoryMapping";
import {
  SYSTEM_AUTOMATION_CATALOG,
  findMissingMessageTemplates,
  listReminderAutomations,
  type MessageTemplateGap,
} from "./systemAutomationCatalog";
import {
  listWhatsAppTemplates,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";

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
  const [templateGaps, setTemplateGaps] = useState<MessageTemplateGap[]>([]);
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>([]);

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
      const [result, templates] = await Promise.all([
        listAutomationRecipes(businessId),
        listWhatsAppTemplates(businessId).catch(() => [] as WhatsAppTemplate[]),
      ]);
      setRecipes(result?.recipes || []);
      setWaTemplates(templates || []);
      setTemplateGaps(findMissingMessageTemplates(templates || []));
      setRecipesError(false);
    } catch {
      setRecipes([]);
      setRecipesError(true);
      setTemplateGaps(findMissingMessageTemplates([]));
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
            כל תבנית בנויה כ־טריגר ← תוצאה, מחוברת ל־CRM, פגישות, WhatsApp ו־AI
            במערכת
          </p>
        </div>
      </header>

      {templateGaps.length > 0 ? (
        <div className="ax-template-gaps" role="status">
          <strong>חסרות תבניות הודעה מומלצות</strong>
          <p>
            כדי שהאוטומציות יעבדו חלק, כדאי ליצור/לאשר את תבניות ה־WhatsApp
            הבאות ({waTemplates.length} תבניות קיימות בעסק):
          </p>
          <ul>
            {templateGaps.map((gap) => (
              <li key={gap.id}>
                <em>{gap.title}</em> — {gap.reason}
              </li>
            ))}
          </ul>
          {businessId ? (
            <Link
              className="ax-btn ax-btn--secondary"
              to={`/business/${businessId}/dashboard/whatsapp/templates`}
            >
              לניהול תבניות WhatsApp
            </Link>
          ) : null}
        </div>
      ) : null}

      <section className="ax-system-reminders">
        <h2>תזכורות פגישה במערכת</h2>
        <p>יום לפני, יומיים לפני, או מספר שעות לפני — מחובר ליומן ול־WhatsApp.</p>
        <div className="ax-reminder-grid">
          {listReminderAutomations().map((item) => (
            <article key={item.id} className="ax-reminder-card">
              <strong>{item.title}</strong>
              <span className="ax-flow-chip">
                <em>טריגר</em> {item.triggerLabel}
              </span>
              <span className="ax-flow-chip ax-flow-chip--result">
                <em>תוצאה</em> {item.resultLabels.join(" · ")}
              </span>
              {item.timingHint ? (
                <span className="ax-reminder-card__timing">{item.timingHint}</span>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {category === "ai" ? (
        <section className="ax-ai-catalog">
          <h2>אוטומציות AI שאפשר להפעיל במערכת</h2>
          <p>
            אלה הפעולות ש־AI יודע לבצע אצלכם — דירוג לידים, סיכום שיחה, טיוטת
            תשובה, זיהוי סיכון, המלצת קמפיין ומשימות משיחה.
          </p>
          <div className="ax-ai-catalog__list">
            {SYSTEM_AUTOMATION_CATALOG.filter((row) => row.kind === "ai").map(
              (row) => (
                <div key={row.id} className="ax-ai-catalog__item">
                  <strong>{row.title}</strong>
                  <span>
                    {row.triggerLabel} → {row.resultLabels.join(" · ")}
                  </span>
                </div>
              )
            )}
          </div>
        </section>
      ) : null}

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

                <div className="ax-template-card__flow">
                  <span className="ax-flow-chip">
                    <em>טריגר</em>
                    {getRecipeTriggerLabel(recipe)}
                  </span>
                  <span className="ax-flow-arrow" aria-hidden>
                    →
                  </span>
                  <span className="ax-flow-chip ax-flow-chip--result">
                    <em>תוצאה</em>
                    {getRecipeResultLabel(recipe)}
                  </span>
                </div>

                <div className="ax-template-card__meta">
                  <span>{recipe.nodeCount} שלבים</span>
                  {recipe.pathCount > 1 ? (
                    <>
                      <span>·</span>
                      <span>{recipe.pathCount} תוצאות יחד</span>
                    </>
                  ) : null}
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
