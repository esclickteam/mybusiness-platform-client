import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
// MessageCircle used by cardIcon for whatsapp category
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
import {
  AUTOMATION_BILLING_API_CODES,
  hasActiveAutomationPlan,
  readAutomationBillingErrorCode,
} from "../../../../api/automationBillingApi";
import { getGoogleCalendarStatus } from "../../../../api/googleCalendarApi";
import {
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  listWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import { TEMPLATE_CATEGORIES, type TemplateCategoryId } from "./templateCategoryMapping";
import {
  AI_BILLING_SAFE_MESSAGE,
  getAiTemplateByKey,
} from "./aiAutomationCatalog";
import {
  WORKING_TEMPLATES,
  buildWhatsAppSimpleGraph,
  getTemplateReadiness,
  getWaTemplateId,
  isWhatsAppFacingTemplate,
  listUsableWaTemplates,
  type TemplateReadiness,
  type WorkingTemplate,
} from "./workingTemplates";
import {
  defaultMappingsForMetaTemplate,
  isBusinessAlertMetaTemplateName,
} from "./whatsappAutomationMetaTemplates";
import { resolveApprovedMetaTemplateForAutomation } from "./whatsappAutomationTemplateResolver";
import { useAutomationBilling } from "./billing/useAutomationBilling";
import AutomationPlanModal from "./billing/AutomationPlanModal";
import AutomationCancelConfirmModal from "./billing/AutomationCancelConfirmModal";

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

function cardMatchesHighlight(
  template: WorkingTemplate,
  highlightKey: string
): boolean {
  const key = String(highlightKey || "").trim();
  if (!key) return false;
  if (template.key === key || template.recipeKey === key) return true;
  const ai = getAiTemplateByKey(key);
  if (!ai) return false;
  return (
    template.key === ai.templateKey ||
    template.recipeKey === ai.recipeKey ||
    template.key === ai.recipeKey
  );
}

export default function AutomationsTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const {
    usage: billingUsage,
    refresh: refreshBilling,
    loading: billingLoading,
  } = useAutomationBilling(businessId);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<AutomationRecipeSummary[]>([]);
  const [triggers, setTriggers] = useState<AutomationTriggerCatalogItem[]>([]);
  const [waTemplates, setWaTemplates] = useState<
    Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>
  >([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [managedWaReady, setManagedWaReady] = useState(false);
  const [managedModeEnabled, setManagedModeEnabled] = useState(true);
  const [waUnavailableMessage, setWaUnavailableMessage] = useState<string | null>(
    null
  );
  const [aiEntitled, setAiEntitled] = useState(false);
  const [query, setQuery] = useState("");
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [picker, setPicker] = useState<{
    template: WorkingTemplate;
    readiness: TemplateReadiness;
    templateId: string;
  } | null>(null);
  const [aiPreview, setAiPreview] = useState<CardModel | null>(null);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const highlightHandled = useRef<string | null>(null);

  const hasPlan = hasActiveAutomationPlan(billingUsage);
  const planGateReady = !billingLoading || billingUsage !== null;

  const initialCategory = (searchParams.get("focus") === "ai" ||
  searchParams.get("tier") === "ai" ||
  Boolean(searchParams.get("highlight"))
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
      const [recipeResult, catalog, approved, allTpl, calendar, waStatus] =
        await Promise.all([
          listAutomationRecipes(businessId),
          fetchAutomationTriggerCatalog(businessId).catch(() => ({
            triggers: [] as AutomationTriggerCatalogItem[],
          })),
          listApprovedWhatsAppTemplates(businessId, {
            senderMode: "bizuply_managed",
          }).catch(() => ({
            templates: [] as ApprovedWhatsAppTemplate[],
            connected: false,
            readyToSend: false,
          })),
          listWhatsAppTemplates(businessId, { approvedOnly: true }).catch(
            () => [] as WhatsAppTemplate[]
          ),
          getGoogleCalendarStatus(businessId).catch(() => null),
          getWhatsAppIntegrationStatus(businessId, {
            senderMode: "bizuply_managed",
          }).catch(() => null),
        ]);

      const byId = new Map<string, WhatsAppTemplate | ApprovedWhatsAppTemplate>();
      for (const tpl of [
        ...(approved.templates || []),
        ...(allTpl || []),
      ]) {
        const id = getWaTemplateId(tpl);
        if (id && !byId.has(id)) byId.set(id, tpl);
      }

      setRecipes(recipeResult?.recipes || []);
      setAiEntitled(Boolean(recipeResult?.aiAutomationsEntitled));
      setTriggers(catalog.triggers || []);
      setWaTemplates(listUsableWaTemplates(Array.from(byId.values())));
      setManagedWaReady(
        Boolean(
          waStatus?.readyToSend ||
            waStatus?.managedStatus?.ready ||
            (approved as { readyToSend?: boolean }).readyToSend ||
            (approved.connected && (approved.templates || []).length > 0)
        )
      );
      const modeOn =
        waStatus?.managedModeEnabled ??
        waStatus?.managedStatus?.managedModeEnabled ??
        true;
      setManagedModeEnabled(Boolean(modeOn));
      setWaUnavailableMessage(
        waStatus?.customerUnavailableMessage ||
          waStatus?.managedStatus?.customerUnavailableMessage ||
          (approved as { customerUnavailableMessage?: string })
            .customerUnavailableMessage ||
          null
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
      setManagedModeEnabled(false);
      setWaUnavailableMessage(null);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const focusAi =
      searchParams.get("focus") === "ai" ||
      searchParams.get("tier") === "ai" ||
      Boolean(searchParams.get("highlight"));
    const pickPlan = searchParams.get("pickPlan") === "1";
    const highlight = String(searchParams.get("highlight") || "").trim();

    if (focusAi) setCategory("ai");
    if (pickPlan) setPlanModalOpen(true);

    if (focusAi || pickPlan || highlight) {
      const next = new URLSearchParams(searchParams);
      next.delete("focus");
      next.delete("tier");
      next.delete("pickPlan");
      // Keep highlight until cards are painted & scrolled; cleared in highlight effect.
      if (!highlight) next.delete("highlight");
      if (
        [...next.keys()].join("|") !== [...searchParams.keys()].join("|") ||
        [...next.values()].join("|") !== [...searchParams.values()].join("|")
      ) {
        setSearchParams(next, { replace: true });
      }
    }

    if (highlight && highlightHandled.current !== highlight) {
      setHighlightedKey(highlight);
    }
  }, [searchParams, setSearchParams]);

  const openPlanPicker = useCallback(() => {
    setPlanModalOpen(true);
  }, []);

  const ensureAutomationPlanOrOpenBilling = useCallback((): boolean => {
    if (!planGateReady) return false;
    if (hasPlan) return true;
    toast.error("כדי להפעיל אוטומציה יש לבחור חבילת פעולות");
    openPlanPicker();
    return false;
  }, [hasPlan, openPlanPicker, planGateReady]);

  const ctx = useMemo(
    () => ({
      recipes,
      triggers,
      waTemplates,
      managedWaReady,
      calendarConnected,
      aiEntitled,
    }),
    [aiEntitled, calendarConnected, managedWaReady, recipes, triggers, waTemplates]
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
      if (template.comingSoon) {
        return false;
      }
      if (!readiness.ready) {
        // Keep WhatsApp-facing blueprints visible so users can see blockers/CTA
        if (!(category === "whatsapp" && isWhatsAppFacingTemplate(template))) {
          return false;
        }
      }
      if (!q) return true;
      return [
        template.name,
        template.description,
        template.triggerLabel,
        template.resultLabels.join(" "),
        ...(template.keywords || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [cards, category, query]);

  const visibleCategories = useMemo(() => TEMPLATE_CATEGORIES.filter((item) => item.id === "all" || cards.some(({ template }) => template.categories.includes(item.id))), [cards]);

  const categoryCards = useMemo(
    () =>
      cards.filter(
        ({ template }) =>
          category === "all" || template.categories.includes(category)
      ),
    [cards, category]
  );
  const readyCount = categoryCards.filter((c) => c.readiness.ready).length;

  useEffect(() => {
    if (!highlightedKey || loading) return;
    if (highlightHandled.current === highlightedKey) return;
    const match = visibleCards.find(({ template }) =>
      cardMatchesHighlight(template, highlightedKey)
    );
    if (!match) {
      // Avoid infinite retries once the catalog finished loading.
      if (cards.length > 0) {
        highlightHandled.current = highlightedKey;
        setHighlightedKey(null);
      }
      return;
    }
    highlightHandled.current = highlightedKey;
    const id = `ax-template-${match.template.key}`;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const next = new URLSearchParams(searchParams);
      if (next.has("highlight")) {
        next.delete("highlight");
        setSearchParams(next, { replace: true });
      }
    }, 120);
    const clearHighlight = window.setTimeout(() => {
      setHighlightedKey(null);
    }, 2600);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [
    cards.length,
    highlightedKey,
    loading,
    searchParams,
    setSearchParams,
    visibleCards,
  ]);

  const activateWhatsAppAsWorkflow = async (
    template: WorkingTemplate,
    readiness: TemplateReadiness,
    templateId: string
  ) => {
    if (!businessId) return;
    const triggerKey = readiness.resolvedTriggerKey || "";
    if (!triggerKey) throw new Error("חסר טריגר מאושר");

    const selectedTpl = waTemplates.find(
      (tpl) => getWaTemplateId(tpl) === templateId
    );
    const metaName = String(
      (selectedTpl as WhatsAppTemplate)?.metaTemplateName ||
        selectedTpl?.name ||
        ""
    );
    const resolvedMeta = resolveApprovedMetaTemplateForAutomation({
      automationTemplateKey: template.key,
      preferredMetaName: template.waPreferredMetaName || metaName,
      waTemplates,
      allowBusinessAlert: template.allowBusinessAlert,
    });
    const graph = buildWhatsAppSimpleGraph(template, {
      triggerKey,
      waTemplateId: templateId,
    });
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
            templateId,
            // Meta identity — separate from blueprint key
            metaTemplateId: String(
              (selectedTpl as WhatsAppTemplate)?.metaTemplateId || ""
            ),
            metaTemplateName: String(
              resolvedMeta.metaTemplateName || metaName
            ),
            language: String(
              resolvedMeta.language ||
                (selectedTpl as WhatsAppTemplate)?.language ||
                ""
            ),
            blueprintKey: template.key,
            blueprintTrigger: template.whatsappTrigger || "",
            componentMappings:
              resolvedMeta.variableMappings.length > 0
                ? resolvedMeta.variableMappings
                : defaultMappingsForMetaTemplate(metaName),
            recipientType:
              resolvedMeta.recipientType ||
              (isBusinessAlertMetaTemplateName(metaName)
                ? "business_owner"
                : "lead_phone"),
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

  const activateWorkflow = async (
    template: WorkingTemplate,
    readiness: TemplateReadiness,
    waTemplateId?: string
  ) => {
    if (!businessId) return;

    const isAi = template.categories.includes("ai");
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
      if (!isAi) try {
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
      navigate(`/business/${businessId}/dashboard/automations/${created._id}${isAi ? "?configureAi=1" : ""}`);
      return;
    }

    if (!template.buildGraph) {
      throw new Error("אין גרף הפעלה לתבנית זו");
    }
    const triggerKey = readiness.resolvedTriggerKey || "";
    if (!triggerKey) throw new Error("חסר טריגר מאושר");

    const selectedTplId =
      waTemplateId || readiness.suggestedWaTemplateId || "";
    const selectedTpl = waTemplates.find(
      (tpl) => getWaTemplateId(tpl) === selectedTplId
    );
    const graph = template.buildGraph({
      triggerKey,
      waTemplateId: selectedTplId,
    });
    const nodes = graph.nodes.map((node) => {
      if (
        node.type === "action" &&
        String((node.data as { actionKey?: string }).actionKey || "") ===
          "whatsapp_template"
      ) {
        const nodeMetaName = String(
          (node.data as { metaTemplateName?: string }).metaTemplateName || ""
        )
          .trim()
          .toLowerCase();
        const nodeSpecificTpl = nodeMetaName
          ? waTemplates.find((tpl) => {
              const meta = String(
                (tpl as WhatsAppTemplate).metaTemplateName ||
                  tpl.name ||
                  tpl.key ||
                  ""
              )
                .trim()
                .toLowerCase();
              const status = String(
                (tpl as WhatsAppTemplate).metaStatus || ""
              )
                .trim()
                .toUpperCase();
              return meta === nodeMetaName && status === "APPROVED";
            })
          : null;
        const resolvedTpl = (nodeSpecificTpl || selectedTpl) as
          | WhatsAppTemplate
          | undefined;
        const resolvedId = nodeSpecificTpl
          ? getWaTemplateId(nodeSpecificTpl)
          : selectedTplId ||
            (node.data as { templateId?: string }).templateId ||
            "";
        return {
          ...node,
          data: {
            ...node.data,
            senderMode: "bizuply_managed",
            templateId: resolvedId,
            metaTemplateId: String(resolvedTpl?.metaTemplateId || ""),
            metaTemplateName: String(
              resolvedTpl?.metaTemplateName ||
                (node.data as { metaTemplateName?: string }).metaTemplateName ||
                resolvedTpl?.name ||
                ""
            ),
            language: String(
              resolvedTpl?.language ||
                (node.data as { language?: string }).language ||
                ""
            ),
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
    if (!isAi) try {
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
    navigate(`/business/${businessId}/dashboard/automations/${created._id}${isAi ? "?configureAi=1" : ""}`);
  };

  const handleActivate = async (card: CardModel) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    if (!ensureAutomationPlanOrOpenBilling()) {
      return;
    }
    if (!card.readiness.ready) {
      if (
        (card.template.engine === "whatsapp_simple" ||
          card.template.requiresWaTemplate) &&
        !managedWaReady &&
        businessId
      ) {
        if (managedModeEnabled) {
          toast.error(
            waUnavailableMessage ||
              "שירות WhatsApp אינו זמין כרגע. יש לפנות לתמיכה."
          );
          return;
        }
        toast.error("חברו WhatsApp Business לפני הפעלה");
        navigate(`/business/${businessId}/dashboard/whatsapp`);
        return;
      }
      toast.error(card.readiness.blocker || "לא ניתן להפעיל כרגע");
      return;
    }

    if (card.template.categories.includes("ai")) {
      setAiPreview(card);
      return;
    }

    const needsWaPick =
      card.template.engine === "whatsapp_simple" ||
      card.template.requiresWaTemplate;

    if (needsWaPick) {
      if (!managedWaReady) {
        if (managedModeEnabled) {
          toast.error(
            waUnavailableMessage ||
              "שירות WhatsApp אינו זמין כרגע. יש לפנות לתמיכה."
          );
          return;
        }
        toast.error("חברו WhatsApp Business לפני הפעלה");
        navigate(`/business/${businessId}/dashboard/whatsapp`);
        return;
      }
      if (!waTemplates.length) {
        toast.error(
          "אין תבניות Meta מאושרות (APPROVED) לבחירה — הכינו תבנית ואשרו אותה ב-Meta"
        );
        return;
      }
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

  const confirmAiPreview = async () => {
    if (!aiPreview || !businessId) return;
    if (!ensureAutomationPlanOrOpenBilling()) {
      return;
    }
    setCreatingKey(aiPreview.template.key);
    try {
      await activateWorkflow(aiPreview.template, aiPreview.readiness);
      setAiPreview(null);
    } catch (error: unknown) {
      const code = readAutomationBillingErrorCode(error);
      if (code === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) {
        toast.error("כדי להפעיל אוטומציה יש לבחור חבילת פעולות");
        openPlanPicker();
        return;
      }
      toast.error(readAutomationErrorMessage(error, "שגיאה בהפעלת האוטומציה"));
    } finally {
      setCreatingKey(null);
    }
  };

  const confirmPicker = async () => {
    if (!picker || !businessId) return;
    if (!picker.templateId) {
      toast.error("בחרו תבנית WhatsApp מאושרת");
      return;
    }
    setCreatingKey(picker.template.key);
    try {
      if (picker.template.engine === "whatsapp_simple") {
        await activateWhatsAppAsWorkflow(
          picker.template,
          picker.readiness,
          picker.templateId
        );
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
            בחרו אוטומציה ← בחרו תבנית WhatsApp מאושרת ← הפעלה מיידית.
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
          {visibleCategories.map((item) => (
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
          טוען תבניות אוטומציה...
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>אין כרגע תבניות מוכנות להפעלה</strong>
          <p>נסו קטגוריה אחרת או רעננו את העמוד.</p>
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
            const isWa = isWhatsAppFacingTemplate(template);
            const isHighlighted =
              Boolean(highlightedKey) &&
              cardMatchesHighlight(template, highlightedKey || "");
            const ctaLabel = !hasPlan
              ? "בחר חבילת אוטומציות"
              : isWa
                ? "הפעל — בחר תבנית הודעה"
                : isAi
                  ? "הפעל תבנית"
                  : "הפעל עכשיו";

            return (
              <article
                key={template.key}
                id={`ax-template-${template.key}`}
                data-template-key={template.key}
                data-recipe-key={template.recipeKey || ""}
                className={`ax-template-card${isHighlighted ? " ax-template-card--highlight" : ""}`}
              >
                <div className="ax-template-card__top">
                  <span className="ax-template-card__icon" aria-hidden>
                    {isAi ? <Bot size={18} /> : <Icon size={18} />}
                  </span>
                  <div className="ax-template-card__badges">
                    {isAi ? (
                      <span className="ax-badge ax-badge--draft">AI</span>
                    ) : null}
                    {isWa ? (
                      <span className="ax-badge ax-badge--active">WhatsApp</span>
                    ) : (
                      <span className="ax-badge ax-badge--active">זרימה</span>
                    )}
                    {template.comingSoon ? (
                      <span className="ax-badge ax-badge--paused">בקרוב</span>
                    ) : readiness.ready ? (
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
                ) : isWa ? (
                  <p className="ax-template-card__hint">
                    {readiness.suggestedWaTemplateName
                      ? `תבנית מוצעת: ${readiness.suggestedWaTemplateName}`
                      : "בהפעלה תבחרו תבנית WhatsApp מאושרת"}
                  </p>
                ) : null}

                <button
                  type="button"
                  className="ax-btn ax-btn--primary ax-template-card__cta"
                  disabled={
                    !businessId ||
                    Boolean(creatingKey) ||
                    readOnly ||
                    (!hasPlan
                      ? !planGateReady
                      : !readiness.ready)
                  }
                  title={
                    !hasPlan
                      ? "נדרשת חבילת אוטומציות פעילה"
                      : !readiness.ready
                        ? readiness.blocker
                        : writeBlockedTitle
                  }
                  onClick={() => {
                    if (!hasPlan) {
                      openPlanPicker();
                      return;
                    }
                    void handleActivate({ template, readiness });
                  }}
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {ctaLabel}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {aiPreview ? (
        <div className="af-modal-backdrop" role="dialog" aria-modal="true">
          <div className="af-modal ax-activate-modal">
            <button
              type="button"
              className="af-modal__close"
              onClick={() => setAiPreview(null)}
            >
              <X size={16} />
            </button>
            <h2>{aiPreview.template.name}</h2>
            {(() => {
              const catalog = getAiTemplateByKey(
                aiPreview.template.recipeKey || aiPreview.template.key
              );
              const explanation = catalog?.customerExplanation;
              return (
                <>
                  <p>
                    <strong>מתי מתחיל:</strong>{" "}
                    {explanation?.startsWhen || aiPreview.template.triggerLabel}
                  </p>
                  <p>
                    <strong>מה ה-AI עושה:</strong>{" "}
                    {explanation?.aiDoes ||
                      aiPreview.template.resultLabels[0] ||
                      "—"}
                  </p>
                  <p>
                    <strong>אחר כך:</strong>{" "}
                    {explanation?.afterwards ||
                      aiPreview.template.resultLabels[1] ||
                      "—"}
                  </p>
                  <p>
                    <strong>מערכות:</strong>{" "}
                    {(explanation?.systems || ["CRM", "התראות"]).join(" · ")}
                  </p>
                  <p>
                    <strong>פעולות משוערות:</strong>{" "}
                    {explanation?.estimatedActions ?? 2}
                  </p>
                  <p className="ax-template-card__hint">{AI_BILLING_SAFE_MESSAGE}</p>
                </>
              );
            })()}
            <div className="ax-activate-modal__actions">
              <button
                type="button"
                className="af-btn"
                onClick={() => setAiPreview(null)}
              >
                ביטול
              </button>
              <button
                type="button"
                className="af-btn af-btn--primary"
                disabled={Boolean(creatingKey)}
                onClick={() => {
                  if (!hasPlan) {
                    setAiPreview(null);
                    openPlanPicker();
                    return;
                  }
                  void confirmAiPreview();
                }}
              >
                {creatingKey ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                {hasPlan ? "הפעל תבנית" : "בחר חבילת אוטומציות"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
            <p>
              בחרו תבנית WhatsApp מאושרת מהרשימה שלכם — האוטומציה תופעל מיד.
            </p>
            <label>
              תבנית הודעה מאושרת
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
                  const id = getWaTemplateId(tpl);
                  return (
                    <option key={id} value={id}>
                      {(tpl as ApprovedWhatsAppTemplate).friendlyName ||
                        tpl.name ||
                        tpl.key ||
                        id}
                      {tpl.metaTemplateName ? ` · ${tpl.metaTemplateName}` : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            {!waTemplates.length ? (
              <p className="ax-template-card__blocker">
                אין תבניות מאושרות עדיין — הכינו מהרשימה למעלה ואשרו ב-Meta.
              </p>
            ) : null}
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

      {businessId ? (
        <>
          <AutomationPlanModal
            open={planModalOpen}
            businessId={businessId}
            usage={billingUsage}
            initialMode="pick"
            onClose={() => setPlanModalOpen(false)}
            onUsageUpdated={async () => {
              await refreshBilling();
            }}
            onOpenCancel={() => {
              setPlanModalOpen(false);
              setCancelModalOpen(true);
            }}
          />
          <AutomationCancelConfirmModal
            open={cancelModalOpen}
            businessId={businessId}
            usage={billingUsage}
            onClose={() => setCancelModalOpen(false)}
            onCancelled={() => {
              setCancelModalOpen(false);
              void refreshBilling();
            }}
          />
        </>
      ) : null}
    </div>
  );
}
