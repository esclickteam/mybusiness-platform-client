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
  fetchAutomationTriggerCatalog,
  isAutomationsReadOnly,
  listAutomationRecipes,
  type AutomationRecipeSummary,
  type AutomationTriggerCatalogItem,
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
  LOCAL_SYSTEM_TEMPLATES,
  buildLocalAutomationGraph,
  isActiveSystemRecipeKey,
  resolveTriggerKeyFromCatalog,
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
      localFallback?: LocalAutomationTemplate;
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
  if (key.includes("appointment") || key.includes("reminder") || key.includes("gcal")) {
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
  const [triggerCatalog, setTriggerCatalog] = useState<
    AutomationTriggerCatalogItem[]
  >([]);
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
      const [result, templates, catalog] = await Promise.all([
        listAutomationRecipes(businessId),
        listWhatsAppTemplates(businessId).catch(() => [] as WhatsAppTemplate[]),
        fetchAutomationTriggerCatalog(businessId).catch(() => ({
          triggers: [] as AutomationTriggerCatalogItem[],
        })),
      ]);
      setRecipes(result?.recipes || []);
      setWaTemplates(templates || []);
      setTriggerCatalog(catalog?.triggers || []);
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

  const localByCatalogId = useMemo(() => {
    const map = new Map<string, LocalAutomationTemplate>();
    for (const local of LOCAL_SYSTEM_TEMPLATES) {
      map.set(local.catalogId, local);
      if (local.recipeKey) map.set(local.recipeKey, local);
    }
    return map;
  }, []);

  const cards = useMemo<TemplateCard[]>(() => {
    const recipeKeys = new Set(recipes.map((r) => r.key));

    const recipeCards: TemplateCard[] = recipes.map((recipe) => {
      const isAi = recipe.tier === "ai_paid" || Boolean(recipe.isAiRecipe);
      // Entitlement lock only — do not treat live system recipes as Coming Soon.
      const locked = Boolean(recipe.aiLocked);
      const backendComingSoon = Boolean(recipe.comingSoon);
      const activeService = isActiveSystemRecipeKey(recipe.key) || isAi;
      const hardComingSoon =
        backendComingSoon && !activeService && !isAi;
      const localFallback = localByCatalogId.get(recipe.key);

      return {
        kind: "recipe",
        key: recipe.key,
        name: getRecipeDisplayName(recipe),
        description: getRecipeDisplayDescription(recipe),
        triggerLabel: getRecipeTriggerLabel(recipe),
        resultLabel: getRecipeResultLabel(recipe),
        nodeCount: recipe.nodeCount,
        resultCount: getRecipeResultCount(recipe),
        categories: TEMPLATE_CATEGORIES.map((c) => c.id).filter(
          (id) => id !== "all" && recipeMatchesCategory(recipe, id)
        ),
        isAi,
        locked,
        hardComingSoon,
        // Never show Coming Soon on AI / active system services — only Premium if locked.
        showComingSoonBadge: hardComingSoon,
        recipe,
        localFallback,
      };
    });

    const localCards: TemplateCard[] = LOCAL_SYSTEM_TEMPLATES.filter((local) => {
      // Prefer backend recipe card when the same flow already exists.
      if (local.recipeKey && recipeKeys.has(local.recipeKey)) return false;
      if (recipeKeys.has(local.catalogId)) return false;
      return true;
    }).map((local) => ({
      kind: "local" as const,
      key: local.key,
      name: local.name,
      description: local.description,
      triggerLabel: local.triggerLabel,
      resultLabel: local.resultLabels.join(" · "),
      nodeCount: local.nodeCount,
      resultCount: local.resultCount,
      categories: local.categories as TemplateCategoryId[],
      isAi: Boolean(local.isAi),
      locked: false,
      hardComingSoon: false,
      showComingSoonBadge: false,
      local,
    }));

    // Local first (reminders/system gaps), then recipes — AI locals fill if recipes missing.
    return [...localCards, ...recipeCards];
  }, [localByCatalogId, recipes]);

  const visibleCards = useMemo(
    () =>
      cards.filter(
        (card) => matchesCategory(card, category) && matchesQuery(card, query)
      ),
    [cards, category, query]
  );

  const createFromLocal = async (local: LocalAutomationTemplate) => {
    if (!businessId) return;
    const resolvedTriggerKey =
      resolveTriggerKeyFromCatalog(local, triggerCatalog) || local.triggerKey;
    const graph = buildLocalAutomationGraph(local, { resolvedTriggerKey });
    const created = await createAutomationWorkflow(businessId, {
      useStarter: false,
      name: local.name,
      description: local.description,
      nodes: graph.nodes,
      edges: graph.edges,
    });
    toast.success("נוצרה אוטומציה פעילה: טריגר ← תוצאה");
    navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
  };

  const handleCreateRecipe = async (
    recipe: AutomationRecipeSummary,
    localFallback?: LocalAutomationTemplate
  ) => {
    if (!businessId) return;
    if (recipe.aiLocked) {
      setShowAiUpgrade(true);
      return;
    }
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setCreatingKey(recipe.key);
    try {
      // Prefer backend recipe graph when available.
      try {
        const created = await createAutomationWorkflow(businessId, {
          recipe: recipe.key,
        });
        toast.success("האוטומציה נוצרה מהתבנית");
        navigate(
          `/business/${businessId}/dashboard/automations/${created._id}`
        );
        return;
      } catch (recipeError: unknown) {
        if (localFallback) {
          await createFromLocal(localFallback);
          return;
        }
        throw recipeError;
      }
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
      // If linked recipe exists and isn't entitlement-locked, try it first.
      const linked = recipes.find((r) => r.key === local.recipeKey);
      if (linked && !linked.aiLocked) {
        try {
          const created = await createAutomationWorkflow(businessId, {
            recipe: linked.key,
          });
          toast.success("האוטומציה נוצרה מהתבנית");
          navigate(
            `/business/${businessId}/dashboard/automations/${created._id}`
          );
          return;
        } catch {
          // fall through to local graph
        }
      }
      await createFromLocal(local);
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
    void handleCreateRecipe(card.recipe, card.localFallback);
  };

  return (
    <div className="ax-page ax-templates">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">תבניות אוטומציה</h1>
          <p className="ax-home__subtitle">
            תבניות פעילות לפי השירותים במערכת — CRM, פגישות, WhatsApp, אימייל,
            יומן ו־AI. כל תבנית: טריגר ← תוצאה.
          </p>
        </div>
      </header>

      {templateGaps.length > 0 ? (
        <div className="ax-template-gaps" role="status">
          <strong>חסרות תבניות הודעת WhatsApp</strong>
          <p>
            האוטומציות יווצרו, אבל לשליחה צריך לאשר תבניות Meta (
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
          טוען תבניות מהמערכת...
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
                    {card.isAi ? (
                      <span className="ax-badge ax-badge--draft">AI</span>
                    ) : null}
                    {!card.hardComingSoon && !card.locked ? (
                      <span className="ax-badge ax-badge--active">פעיל</span>
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
              תבנית זו דורשת תוסף אוטומציות AI פעיל. אחרי ההפעלה אפשר ליצור
              ולהריץ אותה במערכת.
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
