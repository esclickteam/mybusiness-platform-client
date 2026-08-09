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
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import { TEMPLATE_CATEGORIES, type TemplateCategoryId } from "./templateCategoryMapping";
import {
  WORKING_TEMPLATES,
  getTemplateReadiness,
  getWaTemplateId,
  isWhatsAppFacingTemplate,
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
  const [managedWaReady, setManagedWaReady] = useState(false);
  const [managedWaMessage, setManagedWaMessage] = useState("");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [aiEntitled, setAiEntitled] = useState(false);
  const [query, setQuery] = useState("");
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);

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
      const [recipeResult, catalog, managedStatus, approved, calendar] =
        await Promise.all([
          listAutomationRecipes(businessId),
          fetchAutomationTriggerCatalog(businessId).catch(() => ({
            triggers: [] as AutomationTriggerCatalogItem[],
          })),
          getWhatsAppIntegrationStatus(businessId, {
            senderMode: "bizuply_managed",
          }).catch(() => null),
          listApprovedWhatsAppTemplates(businessId, {
            senderMode: "bizuply_managed",
          }).catch(() => ({
            templates: [] as ApprovedWhatsAppTemplate[],
            connected: false,
            message: "",
          })),
          getGoogleCalendarStatus(businessId).catch(() => null),
        ]);

      const byId = new Map<string, WhatsAppTemplate | ApprovedWhatsAppTemplate>();
      for (const tpl of approved.templates || []) {
        const id = getWaTemplateId(tpl);
        if (id && !byId.has(id)) byId.set(id, tpl);
      }
      const usable = listUsableWaTemplates(Array.from(byId.values()));

      const ready = Boolean(
        managedStatus?.readyToSend ||
          managedStatus?.connected ||
          managedStatus?.managedStatus?.ready ||
          managedStatus?.managedStatus?.configured ||
          approved.connected ||
          usable.length > 0
      );

      setRecipes(recipeResult?.recipes || []);
      setAiEntitled(Boolean(recipeResult?.aiAutomationsEntitled));
      setTriggers(catalog.triggers || []);
      setWaTemplates(usable);
      setManagedWaReady(ready);
      setManagedWaMessage(
        String(
          approved.message ||
            managedStatus?.managedStatus?.reason ||
            ""
        )
      );
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
      setManagedWaReady(false);
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
      managedWaReady,
      calendarConnected,
      aiEntitled,
    }),
    [
      aiEntitled,
      calendarConnected,
      managedWaReady,
      recipes,
      triggers,
      waTemplates,
    ]
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
      const showBlockedWaInCategory =
        category === "whatsapp" &&
        isWhatsAppFacingTemplate(template) &&
        !readiness.ready;

      if (showBlockedOnly) {
        if (readiness.ready) return false;
      } else if (!readiness.ready && !showBlockedWaInCategory) {
        return false;
      }
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

  const categoryCards = useMemo(
    () =>
      cards.filter(
        ({ template }) =>
          category === "all" || template.categories.includes(category)
      ),
    [cards, category]
  );
  const readyCount = categoryCards.filter((c) => c.readiness.ready).length;
  const blockedWaCount = cards.filter(
    (c) => isWhatsAppFacingTemplate(c.template) && !c.readiness.ready
  ).length;

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
    toast.success("האוטומציה הופעלה אוטומטית ופועלת");
    navigate(`/business/${businessId}/dashboard/automations`);
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
    // Bake managed sender mode into WhatsApp action nodes
    const nodes = graph.nodes.map((node) => {
      if (
        node.type === "action" &&
        String((node.data as { actionKey?: string }).actionKey || "") ===
          "whatsapp_template"
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            senderMode: "bizuply_managed",
            templateId:
              waTemplateId ||
              readiness.suggestedWaTemplateId ||
              (node.data as { templateId?: string }).templateId ||
              "",
          },
        };
      }
      return node;
    });

    const created = await createAutomationWorkflow(businessId, {
      useStarter: false,
      name: template.name,
      description: template.description,
      nodes,
      edges: graph.edges,
    });
    try {
      await publishAutomationWorkflow(businessId, created._id);
      toast.success("האוטומציה נוצרה והופעלה");
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(
          error,
          "נוצרה אבל לא הופעלה — בדקו הגדרות ופרסמו"
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

    setCreatingKey(card.template.key);
    try {
      // WhatsApp: auto-pick BizUply managed catalog template — no picker, no WA page
      if (
        card.template.engine === "whatsapp_simple" ||
        card.template.requiresWaTemplate
      ) {
        const templateId = card.readiness.suggestedWaTemplateId || "";
        if (!templateId) {
          throw new Error(
            "לא נמצאה תבנית בקטלוג המנוהל של BizUply — רעננו ונסו שוב"
          );
        }
        if (card.template.engine === "whatsapp_simple") {
          await activateWhatsApp(card.template, templateId);
        } else {
          await activateWorkflow(card.template, card.readiness, templateId);
        }
        return;
      }

      await activateWorkflow(card.template, card.readiness);
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
            הפעלה אוטומטית דרך WhatsApp המנוהל של BizUply — טריגר ← תוצאה, בלי
            חיבור ידני ובלי טיוטות.
          </p>
        </div>
        <div className="ax-templates__stats">
          <strong>{readyCount}</strong>
          <span>
            {category === "all"
              ? "מוכנות להפעלה עכשיו"
              : "מוכנות בקטגוריה זו"}
          </span>
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
          הצג מה שעדיין לא מוכן
        </label>
      </div>

      {!loading && managedWaReady ? (
        <div className="ax-managed-wa" role="status">
          <MessageCircle size={16} aria-hidden />
          <div>
            <strong>WhatsApp BizUply מחובר אוטומטית</strong>
            <p>
              הקטלוג המנוהל פעיל
              {waTemplates.length
                ? ` · ${waTemplates.length} תבניות הודעה מוכנות`
                : ""}
              . לחיצה על «הפעל עכשיו» מפעילה את האוטומציה מיד.
            </p>
          </div>
        </div>
      ) : null}

      {!loading && !managedWaReady && blockedWaCount > 0 ? (
        <div className="ax-template-gaps" role="status">
          <strong>WhatsApp המנוהל של BizUply אינו זמין כרגע</strong>
          <p>
            {managedWaMessage ||
              "אין צורך לחבר WhatsApp ידנית — זה חיבור קבוע של BizUply. רעננו את הקטלוג ונסו שוב."}
          </p>
          <div className="ax-template-gaps__actions">
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => void load()}
            >
              רענון קטלוג מנוהל
            </button>
            {category !== "whatsapp" ? (
              <button
                type="button"
                className="ax-btn"
                onClick={() => setCategory("whatsapp")}
              >
                הצג אוטומציות WhatsApp
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען קטלוג WhatsApp המנוהל של BizUply...
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
              : "רעננו את הקטלוג המנוהל או בחרו קטגוריה אחרת."}
          </p>
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => void load()}
          >
            רענון
          </button>
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
                    {template.engine === "whatsapp_simple" ||
                    template.categories.includes("whatsapp") ? (
                      <span className="ax-badge ax-badge--active">WhatsApp</span>
                    ) : (
                      <span className="ax-badge ax-badge--active">זרימה</span>
                    )}
                    {readiness.ready ? (
                      <span className="ax-badge ax-badge--active">מוכן</span>
                    ) : (
                      <span className="ax-badge ax-badge--paused">ממתין</span>
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
                    נבחר אוטומטית מהקטלוג: {readiness.suggestedWaTemplateName}
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
                    !readiness.ready ? readiness.blocker : writeBlockedTitle
                  }
                  onClick={() => void handleActivate({ template, readiness })}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {readiness.ready ? "הפעל עכשיו" : "ממתין לקטלוג"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
