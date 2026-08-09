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
  getRecipeDisplayDescription,
  getRecipeDisplayName,
  getRecipeResultCount,
  getRecipeResultLabel,
  getRecipeTriggerLabel,
  recipeMatchesCategory,
  type TemplateCategoryId,
} from "./templateCategoryMapping";
import {
  findMissingMessageTemplates,
  type MessageTemplateGap,
} from "./systemAutomationCatalog";
import {
  LOCAL_REMINDER_TEMPLATES,
  buildReminderAutomationGraph,
  type LocalAutomationTemplate,
} from "./localTemplateGraphs";
import {
  listWhatsAppTemplates,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

type TemplateCard =
  | {
      kind: "recipe";
      key: string;
      name: string;
      description: string;
      triggerLabel: string;
      resultLabel: string;
      nodeCount: number;
      resultCount: number;
      categories: TemplateCategoryId[];
      isAi: boolean;
      locked: boolean;
      hardComingSoon: boolean;
      showComingSoonBadge: boolean;
      recipe: AutomationRecipeSummary;
    }
  | {
      kind: "local";
      key: string;
      name: string;
      description: string;
      triggerLabel: string;
      resultLabel: string;
      nodeCount: number;
      resultCount: number;
      categories: TemplateCategoryId[];
      isAi: boolean;
      locked: boolean;
      hardComingSoon: boolean;
      showComingSoonBadge: boolean;
      local: LocalAutomationTemplate;
    };

function recipeIcon(card: TemplateCard) {
  if (card.isAi) return Sparkles;
  const key = card.key;
  if (key.includes("appointment") || key.includes("reminder")) {
    return CalendarDays;
  }
  if (key.includes("whatsapp") || key.includes("auto_reply")) return MessageCircle;
  if (key.includes("client") || key.includes("crm")) return Users;
  if (key.includes("mail") || key.includes("email")) return Mail;
  if (key.includes("lead")) return Zap;
  return Workflow;
}

function matchesQuery(card: TemplateCard, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [card.name, card.description, card.triggerLabel, card.resultLabel, card.key]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function matchesCategory(card: TemplateCard, category: TemplateCategoryId) {
  if (category === "all") return true;
  return card.categories.includes(category);
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

  const cards = useMemo<TemplateCard[]>(() => {
    const recipeCards: TemplateCard[] = recipes.map((recipe) => {
      const isAi = recipe.tier === "ai_paid" || Boolean(recipe.isAiRecipe);
      const locked = Boolean(recipe.aiLocked || recipe.canCreate === false);
      const hardComingSoon = Boolean(
        recipe.comingSoon && !recipe.isAiRecipe && recipe.tier !== "ai_paid"
      );
      return {
        kind: "recipe",
        key: recipe.key,
        name: getRecipeDisplayName(recipe),
        description: getRecipeDisplayDescription(recipe),
        triggerLabel: getRecipeTriggerLabel(recipe),
        resultLabel: getRecipeResultLabel(recipe),
        nodeCount: recipe.nodeCount,
        resultCount: getRecipeResultCount(recipe),
        categories: (() => {
          // Use mapping helper without importing private list — filter via recipeMatchesCategory.
          return TEMPLATE_CATEGORIES.map((c) => c.id).filter(
            (id) => id !== "all" && recipeMatchesCategory(recipe, id)
          );
        })(),
        isAi,
        locked,
        hardComingSoon,
        showComingSoonBadge:
          hardComingSoon || (isAi && Boolean(recipe.comingSoon)),
        recipe,
      };
    });

    const localCards: TemplateCard[] = LOCAL_REMINDER_TEMPLATES.map((local) => ({
      kind: "local",
      key: local.key,
      name: local.name,
      description: local.description,
      triggerLabel: local.triggerLabel,
      resultLabel: local.resultLabels.join(" · "),
      nodeCount: local.nodeCount,
      resultCount: local.resultCount,
      categories: local.categories as TemplateCategoryId[],
      isAi: false,
      locked: false,
      hardComingSoon: false,
      showComingSoonBadge: false,
      local,
    }));

    // Local reminders first in appointments view; otherwise after standard recipes.
    return [...localCards, ...recipeCards];
  }, [recipes]);

  const visibleCards = useMemo(
    () =>
      cards.filter(
        (card) => matchesCategory(card, category) && matchesQuery(card, query)
      ),
    [cards, category, query]
  );

  const handleCreateRecipe = async (recipe: AutomationRecipeSummary) => {
    if (!businessId) return;
    const hardComingSoon = Boolean(
      recipe.comingSoon && !recipe.isAiRecipe && recipe.tier !== "ai_paid"
    );
    if (hardComingSoon) return;
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

  const handleCreateLocal = async (local: LocalAutomationTemplate) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setCreatingKey(local.key);
    try {
      const graph = buildReminderAutomationGraph(local);
      const created = await createAutomationWorkflow(businessId, {
        useStarter: false,
        name: local.name,
        description: local.description,
        nodes: graph.nodes,
        edges: graph.edges,
      });
      toast.success("נוצרה אוטומציה: טריגר ← תוצאה");
      navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
    } finally {
      setCreatingKey(null);
    }
  };

  const handleCreate = (card: TemplateCard) => {
    if (card.kind === "local") {
      void handleCreateLocal(card.local);
      return;
    }
    void handleCreateRecipe(card.recipe);
  };

  return (
    <div className="ax-page ax-templates">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">תבניות אוטומציה</h1>
          <p className="ax-home__subtitle">
            כל תבנית היא טריגר ← תוצאה. בחרו תבנית והמשיכו לערוך בבונה.
          </p>
        </div>
      </header>

      {templateGaps.length > 0 ? (
        <div className="ax-template-gaps" role="status">
          <strong>חסרות תבניות הודעה מומלצות</strong>
          <p>
            כדי שהאוטומציות ישלחו WhatsApp, כדאי ליצור/לאשר את התבניות הבאות (
            {waTemplates.length} קיימות בעסק):
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
      ) : recipesError && visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          לא ניתן לטעון את התבניות כרגע.
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>לא נמצאו תבניות</strong>
          <p>נסו קטגוריה אחרת או שנו את החיפוש.</p>
        </div>
      ) : (
        <div className="ax-template-grid">
          {visibleCards.map((card) => {
            const Icon = recipeIcon(card);
            const busy = creatingKey === card.key;

            return (
              <article key={card.key} className="ax-template-card">
                <div className="ax-template-card__top">
                  <span className="ax-template-card__icon" aria-hidden>
                    {card.isAi ? <Bot size={18} /> : <Icon size={18} />}
                  </span>
                  <div className="ax-template-card__badges">
                    {card.kind === "local" ? (
                      <span className="ax-badge ax-badge--draft">מוכן</span>
                    ) : null}
                    {card.isAi ? (
                      <span className="ax-badge ax-badge--draft">AI</span>
                    ) : null}
                    {card.showComingSoonBadge ? (
                      <span className="ax-badge ax-badge--paused">בקרוב</span>
                    ) : null}
                    {card.locked ? (
                      <span className="ax-badge ax-badge--draft">Premium</span>
                    ) : null}
                  </div>
                </div>

                <h3 className="ax-template-card__title">{card.name}</h3>
                <p className="ax-template-card__desc">{card.description}</p>

                <div className="ax-template-card__flow">
                  <span className="ax-flow-chip">
                    <em>טריגר</em>
                    {card.triggerLabel}
                  </span>
                  <span className="ax-flow-arrow" aria-hidden>
                    →
                  </span>
                  <span className="ax-flow-chip ax-flow-chip--result">
                    <em>תוצאה</em>
                    {card.resultLabel}
                  </span>
                </div>

                <div className="ax-template-card__meta">
                  <span>{card.nodeCount} שלבים</span>
                  {card.resultCount > 1 ? (
                    <>
                      <span>·</span>
                      <span>{card.resultCount} תוצאות יחד</span>
                    </>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="ax-btn ax-btn--primary ax-template-card__cta"
                  disabled={
                    !businessId ||
                    Boolean(creatingKey) ||
                    card.hardComingSoon ||
                    (readOnly && !card.locked)
                  }
                  title={
                    card.hardComingSoon
                      ? "תבנית זו תהיה זמינה בקרוב"
                      : writeBlockedTitle
                  }
                  onClick={() => handleCreate(card)}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {card.hardComingSoon
                    ? "בקרוב"
                    : card.locked
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
