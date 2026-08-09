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
  publishAutomationWorkflow,
  type AutomationRecipeSummary,
  type AutomationTriggerCatalogItem,
} from "../../../../api/automationWorkflowApi";
import { getGoogleCalendarStatus } from "../../../../api/googleCalendarApi";
import {
  createWhatsAppAutomation,
  listApprovedWhatsAppTemplates,
  listWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import { TEMPLATE_CATEGORIES, type TemplateCategoryId } from "./templateCategoryMapping";
import {
  WORKING_TEMPLATES,
  getTemplateReadiness,
  listUsableWaTemplates,
  type TemplateReadiness,
  type WorkingTemplate,
} from "./workingTemplates";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

type CardModel = {
  template: WorkingTemplate;
  readiness: TemplateReadiness;
};

function cardIcon(template: WorkingTemplate) {
  if (template.categories.includes("ai")) return Sparkles;
  if (template.categories.includes("appointments")) return CalendarDays;
  if (template.categories.includes("whatsapp")) return MessageCircle;
  if (template.categories.includes("email")) return Mail;
  if (template.categories.includes("crm")) return Users;
  if (template.categories.includes("leads")) return Zap;
  return Workflow;
}

export default function AutomationsTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>([]);
  const [triggers, setTriggers] = useState<AutomationTriggerCatalogItem[]>([]);
  const [waTemplates, setWaTemplates] = useState<
    Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>
  >([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [aiEntitled, setAiEntitled] = useState(false);
  const [query, setQuery] = useState("");
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [picker, setPicker] = useState<{
    template: WorkingTemplate;
    readiness: TemplateReadiness;
    templateId: string;
  } | null>(null);

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
      const [recipeResult, catalog, approved, allTpl, calendar] =
        await Promise.all([
          listAutomationRecipes(businessId),
          fetchAutomationTriggerCatalog(businessId).catch(() => ({
            triggers: [] as AutomationTriggerCatalogItem[],
          })),
          listApprovedWhatsAppTemplates(businessId).catch(() => ({
            templates: [] as ApprovedWhatsAppTemplate[],
          })),
          listWhatsAppTemplates(businessId, { approvedOnly: true }).catch(
            () => [] as WhatsAppTemplate[]
          ),
          getGoogleCalendarStatus(businessId).catch(() => null),
        ]);

      const wa = [
        ...(approved.templates || []),
        ...(allTpl || []),
      ];
      // de-dupe by id
      const byId = new Map<string, WhatsAppTemplate | ApprovedWhatsAppTemplate>();
      for (const tpl of wa) {
        const id = String((tpl as { _id?: string })._id || "");
        if (id && !byId.has(id)) byId.set(id, tpl);
      }

      setRecipes(recipeResult?.recipes || []);
      setAiEntitled(Boolean(recipeResult?.aiAutomationsEntitled));
      setTriggers(catalog.triggers || []);
      setWaTemplates(listUsableWaTemplates(Array.from(byId.values())));
      setCalendarConnected(
        Boolean(
          calendar?.calendar?.connected ||
            calendar?.account?.connectionStatus === "connected"
        )
      );
    } catch {
      setRecipes([]);
      setTriggers([]);
      setWaTemplates([]);
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

  const ctx = useMemo(
    () => ({
      recipes,
      triggers,
      waTemplates,
      calendarConnected,
      aiEntitled,
    }),
    [aiEntitled, calendarConnected, recipes, triggers, waTemplates]
  );

  const cards = useMemo<CardModel[]>(() => {
    return WORKING_TEMPLATES.map((template) => ({
      template,
      readiness: getTemplateReadiness(template, ctx),
    })).sort((a, b) => a.template.rank - b.template.rank);
  }, [ctx]);

  const visibleCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(({ template, readiness }) => {
      if (category !== "all" && !template.categories.includes(category)) {
        return false;
      }
      if (!showBlockedOnly && !readiness.ready) return false;
      if (showBlockedOnly && readiness.ready) return false;
      if (!q) return true;
      return [
        template.name,
        template.description,
        template.triggerLabel,
        template.resultLabels.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [cards, category, query, showBlockedOnly]);

  const readyCount = cards.filter((c) => c.readiness.ready).length;

  const activateWhatsApp = async (
    template: WorkingTemplate,
    templateId: string
  ) => {
    if (!businessId || !template.whatsappTrigger) return;
    await createWhatsAppAutomation(businessId, {
      name: template.name,
      trigger: template.whatsappTrigger,
      templateId,
      hoursBefore: template.hoursBefore,
      delayMinutes: template.delayMinutes,
      delayHours: template.delayHours,
      delayDays: template.delayDays,
      enabled: true,
    });
    toast.success("האוטומציה הופעלה ופועלת");
    navigate(`/business/${businessId}/dashboard/whatsapp/automations`);
  };

  const activateWorkflow = async (
    template: WorkingTemplate,
    readiness: TemplateReadiness,
    waTemplateId?: string
  ) => {
    if (!businessId) return;

    const preferGraph =
      Boolean(template.buildGraph) &&
      (template.requiresWaTemplate ||
        template.engine === "workflow_graph" ||
        !readiness.recipe ||
        readiness.recipe.canCreate === false ||
        readiness.recipe.aiLocked ||
        readiness.recipe.comingSoon);

    // Backend recipe only when it can create AND we don't need to inject WA template
    if (
      !preferGraph &&
      template.engine === "workflow_recipe" &&
      readiness.recipe &&
      readiness.recipe.canCreate !== false &&
      !readiness.recipe.aiLocked &&
      !readiness.recipe.comingSoon
    ) {
      const created = await createAutomationWorkflow(businessId, {
        recipe: readiness.recipe.key,
        name: template.name,
      });
      try {
        await publishAutomationWorkflow(businessId, created._id);
        toast.success("האוטומציה נוצרה והופעלה");
      } catch (error: unknown) {
        toast.error(
          readAutomationErrorMessage(
            error,
            "נוצרה אבל לא הופעלה — השלימו הגדרות ופרסמו בבונה"
          )
        );
      }
      navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
      return;
    }

    if (!template.buildGraph) {
      throw new Error("אין גרף הפעלה לתבנית זו");
    }
    const triggerKey = readiness.resolvedTriggerKey || "";
    if (!triggerKey) throw new Error("חסר טריגר מאושר");

    const graph = template.buildGraph({
      triggerKey,
      waTemplateId: waTemplateId || readiness.suggestedWaTemplateId,
    });
    const created = await createAutomationWorkflow(businessId, {
      useStarter: false,
      name: template.name,
      description: template.description,
      nodes: graph.nodes,
      edges: graph.edges,
    });
    try {
      await publishAutomationWorkflow(businessId, created._id);
      toast.success("האוטומציה נוצרה והופעלה");
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(
          error,
          "נוצרה אבל לא הופעלה — בדקו תבנית הודעה/חיבור ופרסמו"
        )
      );
    }
    navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
  };

  const handleActivate = async (card: CardModel) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    if (!card.readiness.ready) {
      toast.error(card.readiness.blocker || "לא ניתן להפעיל כרגע");
      return;
    }

    const needsWaPick =
      card.template.engine === "whatsapp_simple" ||
      card.template.requiresWaTemplate;

    if (needsWaPick) {
      setPicker({
        template: card.template,
        readiness: card.readiness,
        templateId: card.readiness.suggestedWaTemplateId || "",
      });
      return;
    }

    setCreatingKey(card.template.key);
    try {
      await activateWorkflow(card.template, card.readiness);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בהפעלת האוטומציה"));
    } finally {
      setCreatingKey(null);
    }
  };

  const confirmPicker = async () => {
    if (!picker || !businessId) return;
    if (!picker.templateId) {
      toast.error("בחרו תבנית הודעת WhatsApp");
      return;
    }
    setCreatingKey(picker.template.key);
    try {
      if (picker.template.engine === "whatsapp_simple") {
        await activateWhatsApp(picker.template, picker.templateId);
      } else {
        await activateWorkflow(
          picker.template,
          picker.readiness,
          picker.templateId
        );
      }
      setPicker(null);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בהפעלת האוטומציה"));
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
            רק אוטומציות שאפשר להפעיל באמת במערכת — טריגר ← תוצאה, בלי טיוטות.
          </p>
        </div>
        <div className="ax-templates__stats">
          <strong>{readyCount}</strong>
          <span>מוכנות להפעלה עכשיו</span>
        </div>
      </header>

      <div className="ax-templates__toolbar">
        <label className="ax-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חפש תבנית שעובדת"
          />
        </label>
        <div className="ax-filters" role="tablist" aria-label="קטגוריות">
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
        <label className="ax-templates__toggle">
          <input
            type="checkbox"
            checked={showBlockedOnly}
            onChange={(e) => setShowBlockedOnly(e.target.checked)}
          />
          הצג מה שחסר חיבור/תבנית הודעה
        </label>
      </div>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          בודק מה באמת אפשר להפעיל בעסק שלכם...
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>
            {showBlockedOnly
              ? "אין תבניות חסומות בקטגוריה הזו"
              : "אין כרגע תבניות מוכנות להפעלה"}
          </strong>
          <p>
            {showBlockedOnly
              ? "נסו קטגוריה אחרת."
              : "אשרו תבנית WhatsApp או חברו יומן/AI — ואז התבניות יופיעו כאן להפעלה מיידית."}
          </p>
          {businessId ? (
            <Link
              className="ax-btn ax-btn--primary"
              to={`/business/${businessId}/dashboard/whatsapp/templates`}
            >
              לתבניות WhatsApp
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="ax-template-grid">
          {visibleCards.map(({ template, readiness }) => {
            const Icon = cardIcon(template);
            const busy = creatingKey === template.key;
            const isAi = template.categories.includes("ai");

            return (
              <article key={template.key} className="ax-template-card">
                <div className="ax-template-card__top">
                  <span className="ax-template-card__icon" aria-hidden>
                    {isAi ? <Bot size={18} /> : <Icon size={18} />}
                  </span>
                  <div className="ax-template-card__badges">
                    {isAi ? (
                      <span className="ax-badge ax-badge--draft">AI</span>
                    ) : null}
                    {template.engine === "whatsapp_simple" ? (
                      <span className="ax-badge ax-badge--active">WhatsApp</span>
                    ) : (
                      <span className="ax-badge ax-badge--active">זרימה</span>
                    )}
                    {readiness.ready ? (
                      <span className="ax-badge ax-badge--active">מוכן</span>
                    ) : (
                      <span className="ax-badge ax-badge--paused">חסר משהו</span>
                    )}
                  </div>
                </div>

                <h3 className="ax-template-card__title">{template.name}</h3>
                <p className="ax-template-card__desc">{template.description}</p>

                <div className="ax-template-card__flow">
                  <span className="ax-flow-chip">
                    <em>טריגר</em>
                    {template.triggerLabel}
                  </span>
                  <span className="ax-flow-arrow" aria-hidden>
                    →
                  </span>
                  <span className="ax-flow-chip ax-flow-chip--result">
                    <em>תוצאה</em>
                    {template.resultLabels.join(" · ")}
                  </span>
                </div>

                {!readiness.ready && readiness.blocker ? (
                  <p className="ax-template-card__blocker">{readiness.blocker}</p>
                ) : readiness.suggestedWaTemplateName ? (
                  <p className="ax-template-card__hint">
                    תבנית הודעה מוצעת: {readiness.suggestedWaTemplateName}
                  </p>
                ) : null}

                <button
                  type="button"
                  className="ax-btn ax-btn--primary ax-template-card__cta"
                  disabled={
                    !businessId ||
                    Boolean(creatingKey) ||
                    !readiness.ready ||
                    readOnly
                  }
                  title={
                    !readiness.ready
                      ? readiness.blocker
                      : writeBlockedTitle
                  }
                  onClick={() => void handleActivate({ template, readiness })}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {readiness.ready ? "הפעל עכשיו" : "לא מוכן"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {picker ? (
        <div className="af-modal-backdrop" role="dialog" aria-modal="true">
          <div className="af-modal ax-activate-modal">
            <button
              type="button"
              className="af-modal__close"
              onClick={() => setPicker(null)}
            >
              <X size={16} />
            </button>
            <h2>הפעלת «{picker.template.name}»</h2>
            <p>בחרו תבנית WhatsApp מאושרת — האוטומציה תופעל מיד, בלי טיוטה.</p>
            <label>
              תבנית הודעה
              <select
                value={picker.templateId}
                onChange={(e) =>
                  setPicker((prev) =>
                    prev ? { ...prev, templateId: e.target.value } : prev
                  )
                }
              >
                <option value="">בחרו תבנית</option>
                {waTemplates.map((tpl) => {
                  const id = String((tpl as { _id?: string })._id || "");
                  return (
                    <option key={id} value={id}>
                      {tpl.name || tpl.key || id}
                    </option>
                  );
                })}
              </select>
            </label>
            <div className="ax-activate-modal__actions">
              <button
                type="button"
                className="af-btn"
                onClick={() => setPicker(null)}
              >
                ביטול
              </button>
              <button
                type="button"
                className="af-btn af-btn--primary"
                disabled={!picker.templateId || Boolean(creatingKey)}
                onClick={() => void confirmPicker()}
              >
                {creatingKey ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                הפעל עכשיו
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
