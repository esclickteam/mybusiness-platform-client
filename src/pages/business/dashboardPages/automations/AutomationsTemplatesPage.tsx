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
import { getGoogleCalendarStatus } from "../../../../api/googleCalendarApi";
import {
  createWhatsAppAutomation,
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  listWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import {
  listRequiredWhatsAppMessageTemplates,
  type RequiredWhatsAppMessageTemplateStatus,
} from "./systemAutomationCatalog";
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
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [managedWaReady, setManagedWaReady] = useState(false);
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
    [aiEntitled, calendarConnected, managedWaReady, recipes, triggers, waTemplates]
  );

  const cards = useMemo<CardModel[]>(() => {
    return WORKING_TEMPLATES.map((template) => ({
      template,
      readiness: getTemplateReadiness(template, ctx),
    })).sort((a, b) => a.template.rank - b.template.rank);
  }, [ctx]);

  const requiredWaMessages = useMemo<RequiredWhatsAppMessageTemplateStatus[]>(
    () => listRequiredWhatsAppMessageTemplates(waTemplates),
    [waTemplates]
  );
  const missingWaMessages = requiredWaMessages.filter((row) => !row.prepared);

  const visibleCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(({ template, readiness }) => {
      if (category !== "all" && !template.categories.includes(category)) {
        return false;
      }
      // Coming soon / unfinished: only when explicitly showing blocked.
      if (template.comingSoon && !showBlockedOnly) {
        return false;
      }
      if (showBlockedOnly && readiness.ready) return false;
      if (!showBlockedOnly && !readiness.ready) {
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
  const showWaChecklist =
    category === "all" || category === "whatsapp" || category === "appointments";

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
        return {
          ...node,
          data: {
            ...node.data,
            senderMode: "bizuply_managed",
            templateId:
              selectedTplId ||
              (node.data as { templateId?: string }).templateId ||
              "",
            metaTemplateId: String(
              (selectedTpl as WhatsAppTemplate)?.metaTemplateId || ""
            ),
            metaTemplateName: String(
              (selectedTpl as WhatsAppTemplate)?.metaTemplateName ||
                selectedTpl?.name ||
                ""
            ),
            language: String((selectedTpl as WhatsAppTemplate)?.language || ""),
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
      if (
        (card.template.engine === "whatsapp_simple" ||
          card.template.requiresWaTemplate) &&
        !managedWaReady &&
        businessId
      ) {
        toast.error("חברו WhatsApp Business לפני הפעלה");
        navigate(`/business/${businessId}/dashboard/whatsapp`);
        return;
      }
      toast.error(card.readiness.blocker || "לא ניתן להפעיל כרגע");
      return;
    }

    const needsWaPick =
      card.template.engine === "whatsapp_simple" ||
      card.template.requiresWaTemplate;

    if (needsWaPick) {
      if (!managedWaReady) {
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

  const confirmPicker = async () => {
    if (!picker || !businessId) return;
    if (!picker.templateId) {
      toast.error("בחרו תבנית WhatsApp מאושרת");
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

      {showWaChecklist ? (
        <div className="ax-wa-checklist" role="region" aria-label="תבניות WhatsApp להכנה">
          <div className="ax-wa-checklist__head">
            <strong>תבניות WhatsApp מאושרות להפעלה</strong>
            <p>
              כל כרטיס אוטומציה הוא blueprint בלבד — בהפעלה בוחרים תבנית Meta
              מאושרת מהקטלוג של העסק. מאושרות כרגע: {waTemplates.length}.
              {!managedWaReady
                ? " WhatsApp Business עדיין לא מוכן לשליחה."
                : ""}
            </p>
          </div>
          {!managedWaReady && businessId ? (
            <Link
              className="ax-btn ax-btn--primary"
              to={`/business/${businessId}/dashboard/whatsapp`}
            >
              לחיבור WhatsApp Business
            </Link>
          ) : null}
          {managedWaReady && waTemplates.length === 0 ? (
            <div className="ax-empty ax-empty--card" style={{ marginBottom: 12 }}>
              <strong>אין תבניות Meta מאושרות</strong>
              <p>
                הכינו תבנית ב-Meta ואשרו אותה — רק אז האוטומציה תוצג כמוכנה
                להפעלה.
              </p>
            </div>
          ) : null}
          <ul className="ax-wa-checklist__list">
            {requiredWaMessages.map((row) => (
              <li
                key={row.id}
                className={
                  row.prepared
                    ? "ax-wa-checklist__item ax-wa-checklist__item--ready"
                    : "ax-wa-checklist__item"
                }
              >
                <span className="ax-wa-checklist__status">
                  {row.prepared ? "מוכנה" : "מומלץ להכין"}
                </span>
                <div>
                  <em>{row.title}</em>
                  <small>
                    {row.reason} · שם מומלץ (לא חובה):{" "}
                    <code>{row.suggestedMetaName}</code>
                    {row.matchedTemplateName
                      ? ` · מחוברת: ${row.matchedTemplateName}`
                      : ""}
                  </small>
                </div>
              </li>
            ))}
          </ul>
          {businessId && missingWaMessages.length > 0 ? (
            <Link
              className="ax-btn ax-btn--primary"
              to={`/business/${businessId}/dashboard/whatsapp/templates`}
            >
              לניהול תבניות ההודעה ({missingWaMessages.length} מומלצות חסרות)
            </Link>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען תבניות אוטומציה ותבניות WhatsApp מאושרות...
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>
            {showBlockedOnly
              ? "אין תבניות חסומות בקטגוריה הזו"
              : "אין כרגע תבניות מוכנות להפעלה"}
          </strong>
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
                  {isWa ? "הפעל — בחר תבנית הודעה" : "הפעל עכשיו"}
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
    </div>
  );
}
