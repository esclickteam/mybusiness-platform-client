import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
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
import { getGmailStatus } from "../../../../api/gmailApi";
import { getOutlookStatus } from "../../../../api/outlookApi";
import {
  listVerifiedEmailSenders,
  type EmailSender,
} from "../../../../api/emailSendersApi";
import {
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  listWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import { TEMPLATE_CATEGORIES, type TemplateCategoryId } from "./templateCategoryMapping";
import { getAiTemplateByKey } from "./aiAutomationCatalog";
import {
  aiTemplateDescription,
  aiTemplateTitle,
} from "../../../../i18n/aiAutomationLabels";
import {
  workingTemplateCopy,
  workingTemplateSearchHaystack,
} from "../../../../i18n/workingTemplateCopy";
import {
  WORKING_TEMPLATES,
  buildWhatsAppSimpleGraph,
  getTemplateReadiness,
  getWaTemplateId,
  isTemplateVisibleInCatalog,
  isWhatsAppFacingTemplate,
  templateMatchesGalleryCategory,
  listUsableWaTemplates,
  type TemplateReadiness,
  type WorkingTemplate,
} from "./workingTemplates";
import {
  EMAIL_PROVIDER_OPTIONS,
  formatBusinessSenderLabel,
  pickDefaultBusinessSender,
  type EmailProviderId,
  resolveEmailProvider,
} from "./emailProviderAutomation";
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
  const { t } = useTranslation();
  const dir = useLocaleDir();
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
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [businessSenders, setBusinessSenders] = useState<EmailSender[]>([]);
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
    emailProvider: EmailProviderId | "";
    senderId: string;
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
      const [recipeResult, catalog, approved, allTpl, calendar, gmail, outlook, waStatus, senders] =
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
          getGmailStatus(businessId).catch(() => null),
          getOutlookStatus(businessId).catch(() => null),
          getWhatsAppIntegrationStatus(businessId, {
            senderMode: "bizuply_managed",
          }).catch(() => null),
          listVerifiedEmailSenders().catch(() => [] as EmailSender[]),
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
      setGmailConnected(
        Boolean(
          gmail?.account?.connectionStatus === "connected" &&
            gmail?.account?.hasGmailSend !== false
        )
      );
      setOutlookConnected(
        Boolean(
          outlook?.available !== false &&
            outlook?.account?.connectionStatus === "connected" &&
            outlook?.account?.hasMailSend !== false
        )
      );
      setBusinessSenders(Array.isArray(senders) ? senders : []);
    } catch {
      setRecipes([]);
      setTriggers([]);
      setWaTemplates([]);
      setManagedWaReady(false);
      setManagedModeEnabled(false);
      setWaUnavailableMessage(null);
      setGmailConnected(false);
      setOutlookConnected(false);
      setBusinessSenders([]);
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
    toast.error(t("automations.toasts.planRequired"));
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
      gmailConnected,
      outlookConnected,
      aiEntitled,
    }),
    [aiEntitled, calendarConnected, gmailConnected, outlookConnected, managedWaReady, recipes, triggers, waTemplates]
  );

  const cards = useMemo<CardModel[]>(() => {
    return WORKING_TEMPLATES.map((template) => ({
      template,
      readiness: getTemplateReadiness(template, ctx),
    })).sort((a, b) => a.template.rank - b.template.rank);
  }, [ctx]);

  const visibleCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    const seen = new Set<string>();
    return cards
      .filter(({ template, readiness }) => {
        if (!templateMatchesGalleryCategory(template, category)) {
          return false;
        }
        if (!isTemplateVisibleInCatalog(template, readiness, category)) {
          return false;
        }
        if (seen.has(template.key)) return false;
        seen.add(template.key);
        if (!q) return true;
        return workingTemplateSearchHaystack(t, template)
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        const aiA = a.template.categories.includes("ai") ? 1 : 0;
        const aiB = b.template.categories.includes("ai") ? 1 : 0;
        if (aiA !== aiB) return aiA - aiB;
        return a.template.rank - b.template.rank;
      });
  }, [cards, category, query, t]);

  const visibleCategories = useMemo(() => TEMPLATE_CATEGORIES.filter((item) => item.id === "all" || cards.some(({ template }) => template.categories.includes(item.id))), [cards]);

  const catalogCount = visibleCards.length;

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
    if (!triggerKey) throw new Error(t("automations.errors.missingTrigger"));

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
      name: workingTemplateCopy(t, template).name,
      description: workingTemplateCopy(t, template).description,
      nodes,
      edges: graph.edges,
    });
    try {
      await publishAutomationWorkflow(businessId, created._id);
      toast.success(t("automations.toasts.createdAndEnabled"));
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(
          error,
          t("automations.toasts.createdNotEnabled")
        )
      );
    }
    navigate(`/business/${businessId}/dashboard/automations/${created._id}`);
  };

  const activateWorkflow = async (
    template: WorkingTemplate,
    readiness: TemplateReadiness,
    waTemplateId?: string,
    emailProvider?: EmailProviderId,
    businessSender?: EmailSender | null
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
        name: workingTemplateCopy(t, template).name,
      });
      if (!isAi) try {
        await publishAutomationWorkflow(businessId, created._id);
        toast.success(t("automations.toasts.createdAndEnabled"));
      } catch (error: unknown) {
        toast.error(
          readAutomationErrorMessage(
            error,
            t("automations.toasts.createdNotEnabledBuilder")
          )
        );
      }
      navigate(`/business/${businessId}/dashboard/automations/${created._id}${isAi ? "?configureAi=1" : ""}`);
      return;
    }

    if (!template.buildGraph) {
      throw new Error(t("automations.errors.missingGraph"));
    }
    const triggerKey = readiness.resolvedTriggerKey || "";
    if (!triggerKey) throw new Error(t("automations.errors.missingTrigger"));

    const selectedTplId =
      waTemplateId || readiness.suggestedWaTemplateId || "";
    const selectedTpl = waTemplates.find(
      (tpl) => getWaTemplateId(tpl) === selectedTplId
    );
    const graph = template.buildGraph({
      triggerKey,
      waTemplateId: selectedTplId,
      emailProvider,
      businessSender: businessSender
        ? {
            senderId: businessSender.senderId,
            email: businessSender.email,
            displayName: businessSender.displayName,
            type: businessSender.type,
            isDefault: businessSender.isDefault,
          }
        : null,
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
      name: workingTemplateCopy(t, template).name,
      description: workingTemplateCopy(t, template).description,
      nodes,
      edges: graph.edges,
    });
    if (!isAi) try {
      await publishAutomationWorkflow(businessId, created._id);
      toast.success(t("automations.toasts.createdAndEnabled"));
    } catch (error: unknown) {
      toast.error(
        readAutomationErrorMessage(
          error,
          t("automations.toasts.createdNotEnabled")
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
              t("automations.toasts.waUnavailable")
          );
          return;
        }
        toast.error(t("automations.toasts.connectWhatsApp"));
        navigate(`/business/${businessId}/dashboard/whatsapp`);
        return;
      }
      toast.error(card.readiness.blocker || t("automations.toasts.notReady"));
      return;
    }

    if (card.template.categories.includes("ai")) {
      setAiPreview(card);
      return;
    }

    const needsWaPick =
      card.template.engine === "whatsapp_simple" ||
      card.template.requiresWaTemplate;
    const emailProvider = resolveEmailProvider(ctx, null);
    const needsEmailChoice = Boolean(card.template.requiresEmailProvider);

    if (needsWaPick || needsEmailChoice) {
      if (needsWaPick) {
        if (!managedWaReady) {
          if (managedModeEnabled) {
            toast.error(
              waUnavailableMessage ||
                t("automations.toasts.waUnavailable")
            );
            return;
          }
          toast.error(t("automations.toasts.connectWhatsApp"));
          navigate(`/business/${businessId}/dashboard/whatsapp`);
          return;
        }
        if (!waTemplates.length) {
          toast.error(
            t("automations.toasts.noApprovedTemplates")
          );
          return;
        }
      }
      setPicker({
        template: card.template,
        readiness: card.readiness,
        templateId: card.readiness.suggestedWaTemplateId || "",
        emailProvider:
          emailProvider ||
          (!gmailConnected && !outlookConnected && businessSenders.length
            ? "business"
            : ""),
        senderId: pickDefaultBusinessSender(businessSenders)?.senderId || "",
      });
      return;
    }

    setCreatingKey(card.template.key);
    try {
      await activateWorkflow(
        card.template,
        card.readiness,
        undefined,
        emailProvider || undefined
      );
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.activateError")));
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
        toast.error(t("automations.toasts.planRequired"));
        openPlanPicker();
        return;
      }
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.activateError")));
    } finally {
      setCreatingKey(null);
    }
  };

  const confirmPicker = async () => {
    if (!picker || !businessId) return;
    const needsWa =
      picker.template.engine === "whatsapp_simple" ||
      Boolean(picker.template.requiresWaTemplate);
    const needsEmail = Boolean(picker.template.requiresEmailProvider);
    if (needsWa && !picker.templateId) {
      toast.error(t("automations.toasts.selectWaTemplate"));
      return;
    }
    if (needsEmail && !picker.emailProvider) {
      toast.error(t("automations.toasts.selectEmailProvider"));
      return;
    }
    if (picker.emailProvider === "gmail" && !gmailConnected) {
      toast.error(t("automations.email.providerRequired"));
      navigate(`/business/${businessId}/dashboard/automations/connections`);
      return;
    }
    if (picker.emailProvider === "outlook" && !outlookConnected) {
      toast.error(t("automations.email.providerRequired"));
      navigate(`/business/${businessId}/dashboard/automations/connections`);
      return;
    }
    if (picker.emailProvider === "business" && !picker.senderId) {
      toast.error(t("automations.email.missingTitle"));
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
          picker.templateId || undefined,
          picker.emailProvider || undefined,
          picker.emailProvider === "business"
            ? businessSenders.find((row) => row.senderId === picker.senderId) ||
              null
            : null
        );
      }
      setPicker(null);
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, t("automations.toasts.activateError")));
    } finally {
      setCreatingKey(null);
    }
  };

  return (
    <div className="ax-page ax-templates">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">{t("automations.templates.title")}</h1>
          <p className="ax-home__subtitle">
            {t("automations.templates.subtitle")}
          </p>
        </div>
        <div className="ax-templates__stats">
          <strong>{catalogCount}</strong>
          <span>
            {category === "all"
              ? t("automations.templates.catalogCount")
              : t("automations.templates.categoryCount")}
          </span>
        </div>
      </header>

      <div className="ax-templates__toolbar">
        <label className="ax-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("automations.templates.searchPlaceholder")}
          />
        </label>
        <div className="ax-filters" role="tablist" aria-label={t("automations.templates.categoriesAria")}>
          {visibleCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={category === item.id}
              className={`ax-chip${category === item.id ? " ax-chip--active" : ""}`}
              onClick={() => setCategory(item.id)}
            >
              {t(`automations.templates.categories.${item.id}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          {t("automations.templates.loading")}
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>{t("automations.templates.emptyTitle")}</strong>
          <p>{t("automations.templates.emptyText")}</p>
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => void load()}
          >
            {t("automations.templates.refresh")}
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
              ? t("automations.templates.ctaPickPlan")
              : isWa
                ? t("automations.templates.ctaPickMessage")
                : isAi
                  ? t("automations.templates.ctaEnableAi")
                  : t("automations.templates.ctaEnableNow");

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
                      <span className="ax-badge ax-badge--active">{t("automations.templates.badgeFlow")}</span>
                    )}
                    {template.comingSoon ? (
                      <span className="ax-badge ax-badge--paused">{t("automations.templates.badgeComingSoon")}</span>
                    ) : readiness.ready ? (
                      <span className="ax-badge ax-badge--active">{t("automations.templates.badgeReady")}</span>
                    ) : (
                      <span className="ax-badge ax-badge--paused">{t("automations.templates.badgeMissing")}</span>
                    )}
                  </div>
                </div>

                <h3 className="ax-template-card__title">
                  {(() => {
                    const catalog = getAiTemplateByKey(
                      template.key || template.recipeKey
                    );
                    return catalog
                      ? aiTemplateTitle(t, catalog)
                      : workingTemplateCopy(t, template).name;
                  })()}
                </h3>
                <p className="ax-template-card__desc">
                  {(() => {
                    const catalog = getAiTemplateByKey(
                      template.key || template.recipeKey
                    );
                    return catalog
                      ? aiTemplateDescription(t, catalog)
                      : workingTemplateCopy(t, template).description;
                  })()}
                </p>

                <div className="ax-template-card__flow">
                  <span className="ax-flow-chip">
                    <em>{t("automations.templates.trigger")}</em>
                    {workingTemplateCopy(t, template).triggerLabel}
                  </span>
                  <span className="ax-flow-arrow" aria-hidden>
                    →
                  </span>
                  <span className="ax-flow-chip ax-flow-chip--result">
                    <em>{t("automations.templates.result")}</em>
                    {workingTemplateCopy(t, template).resultLabels.join(" · ")}
                  </span>
                </div>

                {!readiness.ready && readiness.blocker ? (
                  <p className="ax-template-card__blocker">{readiness.blocker}</p>
                ) : isWa ? (
                  <p className="ax-template-card__hint">
                    {readiness.suggestedWaTemplateName
                      ? t("automations.templates.suggestedTemplate", { name: readiness.suggestedWaTemplateName })
                      : t("automations.templates.chooseWaOnEnable")}
                  </p>
                ) : null}

                <button
                  type="button"
                  className="ax-btn ax-btn--primary ax-template-card__cta"
                  disabled={
                    !businessId ||
                    Boolean(creatingKey) ||
                    readOnly ||
                    (!hasPlan ? !planGateReady : !readiness.ready)
                  }
                  title={
                    !hasPlan
                      ? t("automations.templates.planRequiredTitle")
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
            <h2>
              {(() => {
                const catalog = getAiTemplateByKey(
                  aiPreview.template.recipeKey || aiPreview.template.key
                );
                return catalog
                  ? aiTemplateTitle(t, catalog)
                  : aiPreview.template.name;
              })()}
            </h2>
            {(() => {
              const catalog = getAiTemplateByKey(
                aiPreview.template.recipeKey || aiPreview.template.key
              );
              const explanation = catalog?.customerExplanation;
              return (
                <>
                  <p>
                    <strong>{t("automations.templates.aiStartsWhen")}</strong>{" "}
                    {explanation?.startsWhen || aiPreview.template.triggerLabel}
                  </p>
                  <p>
                    <strong>{t("automations.templates.aiDoes")}</strong>{" "}
                    {explanation?.aiDoes ||
                      aiPreview.template.resultLabels[0] ||
                      t("automations.templates.aiDefaultResult")}
                  </p>
                  <p>
                    <strong>{t("automations.templates.aiAfterwards")}</strong>{" "}
                    {explanation?.afterwards ||
                      aiPreview.template.resultLabels[1] ||
                      t("automations.templates.aiDefaultResult")}
                  </p>
                  <p>
                    <strong>{t("automations.templates.aiSystems")}</strong>{" "}
                    {(explanation?.systems || ["CRM", t("automations.ai.defaultSystems")]).join(" · ")}
                  </p>
                  <p>
                    <strong>{t("automations.templates.aiEstimated")}</strong>{" "}
                    {explanation?.estimatedActions ?? 2}
                  </p>
                  <p className="ax-template-card__hint">{t("automations.ai.billingSafe")}</p>
                </>
              );
            })()}
            <div className="ax-activate-modal__actions">
              <button
                type="button"
                className="af-btn"
                onClick={() => setAiPreview(null)}
              >
                {t("automations.common.cancel")}
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
                {hasPlan ? t("automations.templates.ctaEnableAi") : t("automations.templates.ctaPickPlan")}
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
            <h2>{t("automations.templates.activateTitle", { name: workingTemplateCopy(t, picker.template).name })}</h2>
            {picker.template.engine === "whatsapp_simple" ||
            picker.template.requiresWaTemplate ? (
              <>
                <p>
                  {t("automations.templates.chooseApprovedWa")}
                </p>
                <label>
                  {t("automations.templates.approvedMessageTemplate")}
                  <select
                    value={picker.templateId}
                    onChange={(e) =>
                      setPicker((prev) =>
                        prev ? { ...prev, templateId: e.target.value } : prev
                      )
                    }
                  >
                    <option value="">{t("automations.templates.chooseTemplate")}</option>
                    {waTemplates.map((tpl) => {
                      const id = getWaTemplateId(tpl);
                      return (
                        <option key={id} value={id}>
                          {(tpl as ApprovedWhatsAppTemplate).friendlyName ||
                            tpl.name ||
                            tpl.key ||
                            id}
                          {tpl.metaTemplateName
                            ? ` · ${tpl.metaTemplateName}`
                            : ""}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {!waTemplates.length ? (
                  <p className="ax-template-card__blocker">
                    {t("automations.templates.noApprovedYet")}
                  </p>
                ) : null}
              </>
            ) : (
              <p>{t("automations.templates.chooseEmailAccount")}</p>
            )}
            {picker.template.requiresEmailProvider ? (
              <>
                <label>
                  {t("automations.templates.emailAccount")}
                  <select
                    value={picker.emailProvider}
                    onChange={(e) => {
                      const next = e.target.value as EmailProviderId | "";
                      setPicker((prev) =>
                        prev
                          ? {
                              ...prev,
                              emailProvider: next,
                              senderId:
                                next === "business"
                                  ? pickDefaultBusinessSender(businessSenders)
                                      ?.senderId || ""
                                  : prev.senderId,
                            }
                          : prev
                      );
                    }}
                  >
                    <option value="">{t("automations.templates.chooseProvider")}</option>
                    {EMAIL_PROVIDER_OPTIONS.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.id === "business"
                          ? t("automations.email.business")
                          : provider.label}
                      </option>
                    ))}
                  </select>
                </label>
                {picker.emailProvider === "business" ? (
                  businessSenders.length ? (
                    <label>
                      {t("automations.templates.from")}
                      <select
                        value={picker.senderId}
                        onChange={(e) =>
                          setPicker((prev) =>
                            prev
                              ? { ...prev, senderId: e.target.value }
                              : prev
                          )
                        }
                      >
                        {businessSenders.length > 1 ? (
                          <option value="">{t("automations.templates.chooseBusinessEmail")}</option>
                        ) : null}
                        {businessSenders.map((sender) => (
                          <option key={sender.senderId} value={sender.senderId}>
                            {formatBusinessSenderLabel(sender)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <div className="ax-template-card__blocker" dir={dir}>
                      <p>
                        <strong>{t("automations.email.missingTitle")}</strong>
                      </p>
                      <p>{t("automations.email.missingBody")}</p>
                      <a
                        href={`/business/${businessId}/dashboard/integrations#email-senders`}
                      >
                        {t("automations.email.settingsCta")}
                      </a>
                    </div>
                  )
                ) : null}
              </>
            ) : null}
            <div className="ax-activate-modal__actions">
              <button
                type="button"
                className="af-btn"
                onClick={() => setPicker(null)}
              >
                {t("automations.common.cancel")}
              </button>
              <button
                type="button"
                className="af-btn af-btn--primary"
                disabled={
                  Boolean(creatingKey) ||
                  ((picker.template.engine === "whatsapp_simple" ||
                    Boolean(picker.template.requiresWaTemplate)) &&
                    !picker.templateId) ||
                  (Boolean(picker.template.requiresEmailProvider) &&
                    (!picker.emailProvider ||
                      (picker.emailProvider === "business" &&
                        !picker.senderId)))
                }
                onClick={() => void confirmPicker()}
              >
                {creatingKey ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}
                {t("automations.templates.ctaEnableNow")}
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
