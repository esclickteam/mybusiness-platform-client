import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import i18n from "../../../../i18n/i18n";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AutomationBuilderToolbar from "./automation-builder/AutomationBuilderToolbar";
import AutomationNodePicker from "./automation-builder/AutomationNodePicker";
import AutomationConfigDrawer from "./automation-builder/AutomationConfigDrawer";
import AutomationEmptyState from "./automation-builder/AutomationEmptyState";
import AutomationInsertEdge from "./automation-builder/AutomationInsertEdge";
import { MixedBidiText } from "./automation-builder/bidiText";
import {
  reconnectInsertOnEdge,
  spliceNodeAfterHandle,
} from "./automation-builder/insertNodeBetweenEdge";
import {
  resolveToolbarAddStep,
  shouldIgnoreCanvasPickerClose,
} from "./automation-builder/toolbarAddStep";
import { toast } from "react-toastify";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Loader2,
  FlaskConical,
} from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  saveAutomationWorkflow,
  publishAutomationWorkflow,
  pauseAutomationWorkflow,
  resumeAutomationWorkflow,
  dryRunAutomationWorkflow,
  fetchDryRunExample,
  fetchAutomationTriggerCatalog,
  isAutomationsReadOnly,
  type AutomationNodeType,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import {
  AUTOMATION_BILLING_API_CODES,
  getAutomationBillingUsage,
  normalizeAutomationBillingPublicCode,
  type AutomationBillingUsageOverview,
} from "../../../../api/automationBillingApi";
import {
  WHATSAPP_BILLING_API_CODES,
  isWhatsAppBillingGateCode,
  readWhatsAppBillingErrorCode,
} from "../../../../api/whatsappBillingApi";
import {
  readAutomationErrorCode,
} from "./automationUiHelpers";
import AutomationPlanModal from "./billing/AutomationPlanModal";
import AutomationCancelConfirmModal from "./billing/AutomationCancelConfirmModal";
import WhatsAppBillingSetupModal from "../whatsapp/billing/WhatsAppBillingSetupModal";
import { useWhatsAppBilling } from "../whatsapp/billing/useWhatsAppBilling";
import {
  formatHeIls,
  resolveWhatsAppUnitPriceIls,
} from "../whatsapp/billing/whatsappBillingFormat";
import ScheduleTriggerFields from "./ScheduleTriggerFields";
import AutomationUsageEstimatePanel from "./AutomationUsageEstimatePanel";
import {
  defaultScheduleConfig,
  normalizeScheduleConfig,
  type AutomationScheduleConfig,
} from "./automationSchedule";
import {
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  syncWhatsAppTemplatesForAutomation,
  type ApprovedWhatsAppTemplate,
  type WhatsAppSenderMode,
  type WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import {
  getGmailConnectUrl,
  getGmailStatus,
  type GmailPublicAccount,
} from "../../../../api/gmailApi";
import {
  getOutlookConnectUrl,
  getOutlookStatus,
  type OutlookPublicAccount,
} from "../../../../api/outlookApi";
import {
  getGoogleCalendarConnectUrl,
  getGoogleCalendarStatus,
  type GoogleCalendarStatusResponse,
} from "../../../../api/googleCalendarApi";
import { isBusinessAlertMetaTemplateName, isTestTemplateName } from "./whatsappAutomationMetaTemplates";
import { WhatsAppAutomationTemplateSelect } from "./WhatsAppAutomationTemplateSelect";
import { WhatsAppActionPreview } from "./WhatsAppActionPreview";
import { canPersistAutomationTemplateSelection } from "./whatsAppTemplateSelectFormat";
import { EmailActionTemplateFields } from "./EmailActionTemplateFields";
import {
  listVerifiedEmailSenders,
  type EmailSender,
} from "../../../../api/emailSendersApi";
import {
  nextSendEmailSenderFields,
} from "./emailProviderAutomation";

function getWaMappingPresets(t: TFunction) {
  return [
    { key: "lead:name", source: "lead", field: "name", label: t("automations.editor.mapping.leadName") },
    { key: "lead:phone", source: "lead", field: "phone", label: t("automations.editor.mapping.leadPhone") },
    { key: "lead:email", source: "lead", field: "email", label: t("automations.editor.mapping.leadEmail") },
    { key: "lead:source", source: "lead", field: "source", label: t("automations.editor.mapping.leadSource") },
    {
      key: "business:businessName",
      source: "business",
      field: "businessName",
      label: t("automations.editor.mapping.businessName"),
    },
    {
      key: "appointment:date",
      source: "appointment",
      field: "date",
      label: t("automations.editor.mapping.date"),
    },
    {
      key: "appointment:time",
      source: "appointment",
      field: "time",
      label: t("automations.editor.mapping.time"),
    },
    { key: "constant", source: "constant", field: "", label: t("automations.editor.mapping.constant") },
    {
      key: "manual",
      source: "manual",
      field: "",
      label: t("automations.editor.mapping.manual"),
    },
  ] as const;
}

/** Labels for Meta positional variables (not injected system fields). */
function getWaVariableLabels(t: TFunction): Record<string, Record<string, string>> {
  const client = t("automations.editor.mapping.clientName");
  const lead = t("automations.editor.mapping.leadName");
  const service = t("automations.editor.mapping.service");
  return {
    appointment_reminder: {
      "1": client,
      "2": t("automations.editor.mapping.timeUntil"),
      "3": t("automations.editor.mapping.appointmentTime"),
      "4": service,
    },
    appointment_thanks: { "1": client, "2": service },
    appointment_review: { "1": client, "2": service },
    new_lead_welcome: { "1": lead },
    lead_follow_up: { "1": lead },
    lead_follow_up_2: { "1": lead },
    new_client_welcome: { "1": client },
    inactive_client: { "1": client },
    new_lead_received_utility: {
      "1": lead,
      "2": t("automations.editor.mapping.leadPhone"),
      "3": t("automations.editor.mapping.leadSource"),
    },
    new_lead_received: {
      "1": lead,
      "2": t("automations.editor.mapping.leadPhone"),
      "3": t("automations.editor.mapping.leadSource"),
    },
  };
}

const WA_DEFAULT_MAPPINGS: Record<
  string,
  Record<string, { source: string; field: string }>
> = {
  appointment_reminder: {
    "1": { source: "appointment", field: "clientSnapshot.name" },
    "2": { source: "system", field: "relativeTime" },
    "3": { source: "appointment", field: "time" },
    "4": { source: "appointment", field: "serviceName" },
  },
  appointment_thanks: {
    "1": { source: "appointment", field: "clientSnapshot.name" },
    "2": { source: "appointment", field: "serviceName" },
  },
  appointment_review: {
    "1": { source: "appointment", field: "clientSnapshot.name" },
    "2": { source: "appointment", field: "serviceName" },
  },
  new_lead_welcome: { "1": { source: "lead", field: "name" } },
  lead_follow_up: { "1": { source: "lead", field: "name" } },
  lead_follow_up_2: { "1": { source: "lead", field: "name" } },
  new_client_welcome: { "1": { source: "contact", field: "fullName" } },
  inactive_client: { "1": { source: "contact", field: "fullName" } },
  new_lead_received_utility: {
    "1": { source: "lead", field: "name" },
    "2": { source: "lead", field: "phone" },
    "3": { source: "lead", field: "source" },
  },
  new_lead_received: {
    "1": { source: "lead", field: "name" },
    "2": { source: "lead", field: "phone" },
    "3": { source: "lead", field: "source" },
  },
};

function isWhatsAppActionKey(actionKey: unknown) {
  const key = String(actionKey || "");
  return key === "whatsapp_template" || key === "send_whatsapp";
}

function isGmailActionKey(actionKey: unknown) {
  return String(actionKey || "") === "send_gmail";
}

function isBizuplySendEmailActionKey(actionKey: unknown) {
  return String(actionKey || "") === "send_email";
}

function isOutlookActionKey(actionKey: unknown) {
  return String(actionKey || "") === "send_outlook";
}

function isGoogleCalendarActionKey(actionKey: unknown) {
  const key = String(actionKey || "");
  return (
    key === "google_calendar_create_event" ||
    key === "google_calendar_update_event" ||
    key === "google_calendar_delete_event"
  );
}

function getRecipientLabel(t: TFunction, key: string) {
  return t(`automations.catalog.recipients.${key}`);
}

function triggerSupportsAppointmentCustomerEmail(triggerKey: string) {
  const key = String(triggerKey || "");
  return key === "appointment_created" || key === "appointment_reminder";
}

function triggerSupportsStoreCustomerEmail(triggerKey: string) {
  const key = String(triggerKey || "");
  return (
    key === "store_order_paid" ||
    key === "order_created" ||
    key === "payment_succeeded"
  );
}

function defaultEmailRecipientType(triggerKey: string) {
  if (triggerSupportsAppointmentCustomerEmail(triggerKey)) {
    return "appointment_customer_email";
  }
  if (triggerSupportsStoreCustomerEmail(triggerKey)) {
    return "store_customer_email";
  }
  return "lead_email";
}

function mappingPresetKey(row: WhatsAppVariableMapping) {
  const source = String(row.source || "");
  if (source === "constant" || source === "manual") return source;
  return `${source}:${String(row.field || "")}`;
}

function templateVariableLabel(
  metaTemplateName: string,
  variable: string,
  t: TFunction
): string {
  const tpl = String(metaTemplateName || "").toLowerCase();
  const key = String(variable || "");
  return getWaVariableLabels(t)[tpl]?.[key] || "";
}

function buildMappingsFromTemplate(
  tpl: ApprovedWhatsAppTemplate,
  existing: WhatsAppVariableMapping[] = []
): WhatsAppVariableMapping[] {
  const variables = Array.isArray(tpl.variables) ? tpl.variables : [];
  const metaName = String(tpl.metaTemplateName || "").toLowerCase();
  const defaults = WA_DEFAULT_MAPPINGS[metaName] || {};
  return variables.map((variable) => {
    const key = String(variable);
    const prev = existing.find((row) => String(row.variable) === key);
    if (prev) {
      return {
        ...prev,
        variable: key,
      };
    }
    const fallback = defaults[key];
    return {
      variable: key,
      component: "body" as const,
      source: fallback?.source || "",
      field: fallback?.field || "",
      constantValue: "",
      required: true,
    };
  });
}
import { automationNodeTypes } from "./FlowNodes";
import {
  AI_AUTOMATION_CATALOG,
  getAiTemplateByKey,
  listSupportedAiTemplates,
} from "./aiAutomationCatalog";
import {
  getConditionOptions,
  getDelayUnits,
  getFlowActionPalette,
  getTriggerCategoryLabels,
  getTypeMeta,
  DEFAULT_NEW_TRIGGER_ROUTE_COUNT,
  buildPaletteWithTriggers,
  clampRouteCount,
  defaultSourceHandle,
  ensureRouterPaths,
  findActionOption,
  findTriggerOption,
  listInspectorActionOptions,
  listSourceHandles,
  triggerOptionFromCatalog,
  type AutomationTriggerOption,
  type PaletteFilter,
  type PaletteItem,
} from "./automationFlowTypes";

type Props = {
  businessId: string;
  workflow: AutomationWorkflow;
  readOnly?: boolean;
  onBack: () => void;
  onSaved: (workflow: AutomationWorkflow) => void;
};

function readErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "response" in error) {
    return String(
      (error as { response?: { data?: { error?: string } } }).response?.data
        ?.error || fallback
    );
  }
  return fallback;
}

function edgeLabelFromHandle(handle: string | null | undefined, t: TFunction) {
  if (!handle) return "";
  if (handle === "yes") return t("automations.common.yes");
  if (handle === "no") return t("automations.common.no");
  if (handle.startsWith("route_")) {
    return t("automations.catalog.palette.resultN", { n: handle.split("_")[1] });
  }
  if (handle.startsWith("path_")) {
    return t("automations.catalog.palette.resultN", { n: handle.split("_")[1] });
  }
  return "";
}

function styleEdge(edge: Partial<Edge>, t?: TFunction): Edge {
  const handle = edge.sourceHandle || null;
  const label = edge.label || (t ? edgeLabelFromHandle(handle, t) : "");
  const isYes = handle === "yes";
  const isNo = handle === "no";
  const stroke = isYes ? "#059669" : isNo ? "#dc2626" : "#64748b";
  return {
    id: String(edge.id),
    type: "default",
    source: String(edge.source),
    target: String(edge.target),
    sourceHandle: edge.sourceHandle || undefined,
    targetHandle: edge.targetHandle || undefined,
    label,
    animated: true,
    style: { stroke, strokeWidth: 2.25 },
    labelStyle: { fill: "#334155", fontWeight: 800, fontSize: 11 },
    labelBgStyle: { fill: "#fff", fillOpacity: 0.92 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 8,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: stroke,
    },
  };
}

function toFlowNodes(workflow: AutomationWorkflow): Node[] {
  return (workflow.nodes || []).map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position || { x: 0, y: 0 },
    data: { ...(n.data || {}) },
  }));
}

/** Keep the inspector open across autosave / node remounts. */
function withSelectedNode(nodes: Node[], selectedId: string | null): Node[] {
  if (!selectedId) return nodes.map((n) => ({ ...n, selected: false }));
  return nodes.map((n) => ({
    ...n,
    selected: n.id === selectedId,
  }));
}

function toFlowEdges(workflow: AutomationWorkflow): Edge[] {
  return (workflow.edges || []).map((e) =>
    styleEdge({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle || undefined,
      targetHandle: e.targetHandle || undefined,
      label: e.label || undefined,
    }, i18n.t.bind(i18n))
  );
}

function serializeFlowNodes(
  nodes: Array<{
    id?: string;
    type?: string;
    position?: { x?: number; y?: number };
    data?: Record<string, unknown>;
  }>
) {
  return JSON.stringify(
    (nodes || []).map((node) => ({
      id: node.id,
      type: node.type,
      position: {
        x: Math.round(Number(node.position?.x) || 0),
        y: Math.round(Number(node.position?.y) || 0),
      },
      data: node.data || {},
    }))
  );
}

function serializeFlowEdges(
  edges: Array<{
    id?: string;
    source?: string;
    target?: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    label?: unknown;
  }>
) {
  return JSON.stringify(
    (edges || []).map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      label: typeof edge.label === "string" ? edge.label : "",
    }))
  );
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function pickOutgoingHandle(
  source: Node,
  edges: Edge[]
): string {
  const type = (source.type || "action") as AutomationNodeType;
  const data = (source.data || {}) as Record<string, unknown>;
  const handles = listSourceHandles(type, data);
  const used = new Set(
    edges
      .filter((e) => e.source === source.id)
      .map((e) => e.sourceHandle || "out")
  );
  return handles.find((h) => !used.has(h)) || handles[0] || "out";
}

const builderEdgeTypes = {
  default: AutomationInsertEdge,
  smoothstep: AutomationInsertEdge,
};

function EditorInner({
  businessId,
  workflow,
  readOnly: readOnlyProp = false,
  onBack,
  onSaved,
}: Props) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const FLOW_ACTION_PALETTE = useMemo(() => getFlowActionPalette(t), [t]);
  const TYPE_META = useMemo(() => getTypeMeta(t), [t]);
  const CONDITION_OPTIONS = useMemo(() => getConditionOptions(t), [t]);
  const DELAY_UNITS = useMemo(() => getDelayUnits(t), [t]);
  const TRIGGER_CATEGORY_LABELS = useMemo(() => getTriggerCategoryLabels(t), [t]);
  const WA_MAPPING_PRESETS = useMemo(() => getWaMappingPresets(t), [t]);
  const readOnly = readOnlyProp || isAutomationsReadOnly();
  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;
  const { screenToFlowPosition, fitView } = useReactFlow();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(workflow.name);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingModalMode, setBillingModalMode] = useState<"pick" | "manage">("pick");
  const [showBillingCancelModal, setShowBillingCancelModal] = useState(false);
  const [billingUsage, setBillingUsage] =
    useState<AutomationBillingUsageOverview | null>(null);
  const [showWaBillingModal, setShowWaBillingModal] = useState(false);
  const {
    usage: waBillingUsage,
    refresh: refreshWaBilling,
  } = useWhatsAppBilling(businessId);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [testOpen, setTestOpen] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [testing, setTesting] = useState(false);
  const [filter] = useState<PaletteFilter>("all");
  const [waConnected, setWaConnected] = useState(false);
  const [waManagedModeEnabled, setWaManagedModeEnabled] = useState(true);
  const [waPrivateConnected, setWaPrivateConnected] = useState(false);
  const [waTemplates, setWaTemplates] = useState<ApprovedWhatsAppTemplate[]>([]);
  const [waLoading, setWaLoading] = useState(false);
  const [waSyncError, setWaSyncError] = useState("");
  const [waLastSyncAt, setWaLastSyncAt] = useState<string | null>(null);
  const [gmailAvailable, setGmailAvailable] = useState(false);
  const [gmailAccount, setGmailAccount] = useState<GmailPublicAccount | null>(
    null
  );
  const [gmailMessage, setGmailMessage] = useState("");
  const [gmailLoading, setGmailLoading] = useState(false);
  const [outlookAvailable, setOutlookAvailable] = useState(false);
  const [outlookAccount, setOutlookAccount] =
    useState<OutlookPublicAccount | null>(null);
  const [outlookMessage, setOutlookMessage] = useState("");
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [emailSenders, setEmailSenders] = useState<EmailSender[]>([]);
  const [calendarStatus, setCalendarStatus] =
    useState<GoogleCalendarStatusResponse | null>(null);
  const [calendarMessage, setCalendarMessage] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [triggerCatalog, setTriggerCatalog] = useState<
    AutomationTriggerOption[]
  >([]);
  const [triggerCatalogLoading, setTriggerCatalogLoading] = useState(true);
  const [triggerCatalogError, setTriggerCatalogError] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(workflow));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(workflow));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const configureAiHandled = useRef(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerEdgeId, setPickerEdgeId] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<"all" | "trigger" | "result">(
    "all"
  );
  const [pickerAfterNodeId, setPickerAfterNodeId] = useState<string | null>(
    null
  );
  const [inspectorBaseline, setInspectorBaseline] = useState<string | null>(
    null
  );
  const [drawerSessionDirty, setDrawerSessionDirty] = useState(false);
  const selectedIdRef = useRef<string | null>(null);
  const closingDrawerRef = useRef(false);
  const holdPickerOpenRef = useRef(false);
  const holdPickerOpenTimerRef = useRef<number | null>(null);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const savingRef = useRef(false);
  const dirty =
    name !== workflow.name ||
    serializeFlowNodes(nodes) !== serializeFlowNodes(workflow.nodes || []) ||
    serializeFlowEdges(edges) !== serializeFlowEdges(workflow.edges || []);

  const setSelectedIdSafe = useCallback((nextId: string | null) => {
    selectedIdRef.current = nextId;
    setSelectedId(nextId);
  }, []);

  useEffect(() => {
    return () => {
      if (holdPickerOpenTimerRef.current != null) {
        window.clearTimeout(holdPickerOpenTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);


  useEffect(() => {
    if (configureAiHandled.current || (searchParams.get("configureAi") !== "1" && !(location.state as { configureAi?: boolean } | null)?.configureAi)) return;
    const aiNode = nodes.find((node) => String(node.data?.actionKey || "").startsWith("ai_"));
    if (!aiNode) return;
    configureAiHandled.current = true;
    setSelectedIdSafe(aiNode.id);
    const next = new URLSearchParams(searchParams); next.delete("configureAi"); setSearchParams(next, { replace: true });
  }, [location.state, nodes, searchParams, setSearchParams, setSelectedIdSafe]);

  // If the selected module was removed, clear selection; otherwise keep the
  // inspector pinned even when React Flow briefly reports an empty selection
  // (pane click, remount after autosave, hydrate effects).
  useEffect(() => {
    if (!selectedId) return;
    if (!nodes.some((n) => n.id === selectedId)) {
      setSelectedIdSafe(null);
      setInspectorBaseline(null);
      setDrawerSessionDirty(false);
    }
  }, [nodes, selectedId, setSelectedIdSafe]);

  useEffect(() => {
    if (!selectedId) {
      setInspectorBaseline(null);
      setDrawerSessionDirty(false);
      return;
    }
    const node = nodes.find((n) => n.id === selectedId);
    if (!node) return;
    // New selection always starts a fresh edit session baseline.
    setInspectorBaseline(JSON.stringify(node.data || {}));
    setDrawerSessionDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-baseline on selection change
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId || inspectorBaseline == null) {
      setDrawerSessionDirty(false);
      return;
    }
    const node = nodes.find((n) => n.id === selectedId);
    if (!node) {
      setDrawerSessionDirty(false);
      return;
    }
    setDrawerSessionDirty(JSON.stringify(node.data || {}) !== inspectorBaseline);
  }, [selectedId, nodes, inspectorBaseline]);

  const loadApprovedWhatsAppTemplates = useCallback(async (
    senderMode: WhatsAppSenderMode = "bizuply_managed"
  ) => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const [managedStatus, privateStatus, approved] = await Promise.all([
        getWhatsAppIntegrationStatus(businessId, {
          senderMode: "bizuply_managed",
        }),
        getWhatsAppIntegrationStatus(businessId, {
          senderMode: "business_connected",
        }),
        listApprovedWhatsAppTemplates(businessId, {
          usableForAutomation: true,
          senderMode,
        }),
      ]);
      setWaPrivateConnected(Boolean(privateStatus.connected));
      setWaManagedModeEnabled(
        Boolean(
          managedStatus.managedModeEnabled ??
            managedStatus.managedStatus?.managedModeEnabled ??
            (approved as { managedModeEnabled?: boolean }).managedModeEnabled ??
            true
        )
      );
      setWaConnected(Boolean(approved.connected));
      setWaLastSyncAt(
        approved.lastTemplatesSyncAt ||
          (senderMode === "business_connected"
            ? privateStatus.lastTemplatesSyncAt
            : managedStatus.lastTemplatesSyncAt ||
              managedStatus.managedStatus?.lastTemplatesSyncAt) ||
          null
      );
      setWaTemplates(approved.templates || []);
      const unavailable =
        managedStatus.customerUnavailableMessage ||
        managedStatus.managedStatus?.customerUnavailableMessage ||
        approved.customerUnavailableMessage ||
        "";
      if (!approved.connected) {
        setWaSyncError(
          unavailable ||
            approved.message ||
            (senderMode === "business_connected"
              ? t("automations.editor.wa.connectBeforeSelect")
              : t("automations.editor.wa.unavailable"))
        );
      } else if (approved.message) {
        setWaSyncError(approved.message);
      }
    } catch (error: unknown) {
      setWaTemplates([]);
      setWaSyncError(readErrorMessage(error, t("automations.editor.wa.loadTemplatesError")));
    } finally {
      setWaLoading(false);
    }
  }, [businessId]);

  const refreshWhatsAppTemplatesFromMeta = useCallback(async (
    senderMode: WhatsAppSenderMode = "bizuply_managed"
  ) => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const synced = await syncWhatsAppTemplatesForAutomation(businessId, {
        senderMode,
      });
      setWaConnected(Boolean(synced.connected));
      setWaLastSyncAt(synced.lastTemplatesSyncAt || null);
      setWaTemplates(synced.templates || []);
      if (!synced.connected) {
        setWaSyncError(
          synced.customerUnavailableMessage ||
            synced.message ||
            t("automations.editor.wa.unavailable")
        );
      } else if (synced.sync?.errors?.length) {
        setWaSyncError(
          synced.sync.errors
            .map((row) => row.message || row.code || "")
            .filter(Boolean)
            .join(" · ")
        );
      }
    } catch (error: unknown) {
      setWaSyncError(
        readErrorMessage(error, t("automations.editor.wa.loadTemplatesError"))
      );
      await loadApprovedWhatsAppTemplates(senderMode);
      return;
    } finally {
      setWaLoading(false);
    }
  }, [businessId, loadApprovedWhatsAppTemplates]);

  // Templates are loaded after selectedNode / senderMode is known (see effect below).

  const loadGmailStatus = useCallback(async () => {
    setGmailLoading(true);
    setGmailMessage("");
    try {
      const status = await getGmailStatus(businessId);
      setGmailAvailable(Boolean(status.available));
      setGmailAccount(status.account);
      if (status.message) setGmailMessage(status.message);
    } catch (error: unknown) {
      setGmailAvailable(false);
      setGmailAccount(null);
      setGmailMessage(readErrorMessage(error, t("automations.editor.toasts.loadGmail")));
    } finally {
      setGmailLoading(false);
    }
  }, [businessId]);

  const loadOutlookStatus = useCallback(async () => {
    setOutlookLoading(true);
    setOutlookMessage("");
    try {
      const status = await getOutlookStatus(businessId);
      setOutlookAvailable(Boolean(status.available));
      setOutlookAccount(status.account);
      if (status.message) setOutlookMessage(status.message);
    } catch (error: unknown) {
      setOutlookAvailable(false);
      setOutlookAccount(null);
      setOutlookMessage(
        readErrorMessage(error, t("automations.editor.toasts.loadOutlook"))
      );
    } finally {
      setOutlookLoading(false);
    }
  }, [businessId]);

  const loadCalendarStatus = useCallback(async () => {
    setCalendarLoading(true);
    setCalendarMessage("");
    try {
      const status = await getGoogleCalendarStatus(businessId);
      setCalendarStatus(status);
      if (status.message) setCalendarMessage(status.message);
    } catch (error: unknown) {
      setCalendarStatus(null);
      setCalendarMessage(
        readErrorMessage(error, t("automations.editor.toasts.loadCalendar"))
      );
    } finally {
      setCalendarLoading(false);
    }
  }, [businessId]);

  const loadTriggerCatalog = useCallback(async () => {
    setTriggerCatalogLoading(true);
    setTriggerCatalogError("");
    try {
      const { triggers } = await fetchAutomationTriggerCatalog(businessId);
      const unique = new Map<string, AutomationTriggerOption>();
      for (const row of triggers) {
        const option = triggerOptionFromCatalog(row);
        if (!option) continue;
        if (!unique.has(option.key)) unique.set(option.key, option);
      }
      setTriggerCatalog(Array.from(unique.values()));
    } catch (error: unknown) {
      setTriggerCatalog([]);
      setTriggerCatalogError(
        readErrorMessage(error, t("automations.editor.toasts.loadTriggers"))
      );
    } finally {
      setTriggerCatalogLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void loadTriggerCatalog();
  }, [loadTriggerCatalog]);

  // Hydrate component mappings when a saved WhatsApp node is opened.
  useEffect(() => {
    if (!selectedId || !waTemplates.length) return;
    setNodes((prev) => {
      const node = prev.find((n) => n.id === selectedId);
      if (!node || node.type !== "action") return prev;
      if (!isWhatsAppActionKey(node.data?.actionKey || "whatsapp_template")) {
        return prev;
      }
      const templateId = String(node.data?.templateId || "");
      if (!templateId) return prev;
      const tpl = waTemplates.find((row) => row._id === templateId);
      if (!tpl) return prev;
      const variables = Array.isArray(tpl.variables) ? tpl.variables : [];
      const existing = Array.isArray(node.data?.componentMappings)
        ? (node.data.componentMappings as WhatsAppVariableMapping[])
        : [];
      const hasExtraMappings = existing.some(
        (row) =>
          !variables.some((variable) => String(row.variable) === String(variable))
      );
      const needsHydrate =
        !node.data?.metaTemplateName ||
        existing.length !== variables.length ||
        hasExtraMappings ||
        variables.some(
          (variable) =>
            !existing.some((row) => String(row.variable) === String(variable))
        );
      if (!needsHydrate) return prev;
      const componentMappings = buildMappingsFromTemplate(tpl, existing);
      return prev.map((n) =>
        n.id === selectedId
          ? {
              ...n,
              data: {
                ...(n.data || {}),
                metaTemplateId: tpl.metaTemplateId || "",
                metaTemplateName: tpl.metaTemplateName || "",
                language: tpl.language || "",
                wabaId: "",
                phoneNumberId: "",
                integrationId: "",
                componentMappings,
              },
            }
          : n
      );
    });
  }, [selectedId, waTemplates, setNodes]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) || null,
    [nodes, selectedId]
  );

  const selectedWaSenderMode = useMemo<WhatsAppSenderMode>(() => {
    const raw = String(selectedNode?.data?.senderMode || "").trim();
    if (raw === "business_connected") return "business_connected";
    return "bizuply_managed";
  }, [selectedNode?.data?.senderMode]);

  useEffect(() => {
    void loadApprovedWhatsAppTemplates(selectedWaSenderMode);
  }, [loadApprovedWhatsAppTemplates, selectedWaSenderMode]);

  const selectedWaTemplate = useMemo(() => {
    if (
      !selectedNode ||
      !isWhatsAppActionKey(selectedNode.data?.actionKey || "whatsapp_template")
    ) {
      return null;
    }
    const templateId = String(selectedNode.data?.templateId || "");
    if (!templateId) return null;
    return (
      waTemplates.find((tpl) => String(tpl._id) === templateId) || null
    );
  }, [selectedNode, waTemplates]);

  const selectedAiTemplate = useMemo(() => {
    if (selectedNode?.type !== "action") return undefined;
    const actionKey = String(selectedNode.data?.actionKey || "");
    if (!actionKey.startsWith("ai_")) return undefined;
    return (
      listSupportedAiTemplates().find((template) =>
        template.requiredAiActions.includes(actionKey)
      ) ||
      getAiTemplateByKey(actionKey) ||
      AI_AUTOMATION_CATALOG.find((template) =>
        template.requiredAiActions.includes(actionKey)
      )
    );
  }, [selectedNode]);

  const selectedGmailActionKey =
    selectedNode?.type === "action" &&
    isGmailActionKey(selectedNode.data?.actionKey)
      ? String(selectedNode.data?.actionKey || "")
      : "";

  const selectedOutlookActionKey =
    selectedNode?.type === "action" &&
    isOutlookActionKey(selectedNode.data?.actionKey)
      ? String(selectedNode.data?.actionKey || "")
      : "";

  const selectedCalendarActionKey =
    selectedNode?.type === "action" &&
    isGoogleCalendarActionKey(selectedNode.data?.actionKey)
      ? String(selectedNode.data?.actionKey || "")
      : "";

  // Only reload Gmail status when the selected Gmail action node changes —
  // not on every subject/body keystroke (that remounted the form and jumped focus).
  useEffect(() => {
    if (!selectedId || !selectedGmailActionKey) return;
    void loadGmailStatus();
  }, [selectedId, selectedGmailActionKey, loadGmailStatus]);

  useEffect(() => {
    if (!selectedId || !selectedOutlookActionKey) return;
    void loadOutlookStatus();
  }, [selectedId, selectedOutlookActionKey, loadOutlookStatus]);

  useEffect(() => {
    if (!selectedId || !selectedCalendarActionKey) return;
    void loadCalendarStatus();
  }, [selectedId, selectedCalendarActionKey, loadCalendarStatus]);

  useEffect(() => {
    void listVerifiedEmailSenders()
      .then(setEmailSenders)
      .catch(() => setEmailSenders([]));
  }, [businessId]);

  useEffect(() => {
    if (!selectedId || !emailSenders.length) return;
    setNodes((prev) => {
      const node = prev.find((n) => n.id === selectedId);
      if (!node || !isBizuplySendEmailActionKey(node.data?.actionKey)) {
        return prev;
      }
      const triggerKey = String(
        prev.find((n) => n.type === "trigger")?.data?.triggerKey || ""
      );
      const needsRecipientDefault = !String(node.data?.recipientType || "").trim();
      const nextSender = nextSendEmailSenderFields(
        {
          senderId: String(node.data?.senderId || ""),
          senderEmail: String(node.data?.senderEmail || ""),
          senderName: String(node.data?.senderName || ""),
          senderType: String(node.data?.senderType || ""),
        },
        emailSenders
      );
      if (!needsRecipientDefault && !nextSender) return prev;
      return prev.map((n) => {
        if (n.id !== selectedId) return n;
        return {
          ...n,
          data: {
            ...(n.data || {}),
            ...(needsRecipientDefault
              ? { recipientType: defaultEmailRecipientType(triggerKey) }
              : {}),
            ...(nextSender || {}),
          },
        };
      });
    });
  }, [selectedId, emailSenders, setNodes]);

  useEffect(() => {
    if (!selectedId) return;
    setNodes((prev) => {
      const node = prev.find((n) => n.id === selectedId);
      if (!node || !isGmailActionKey(node.data?.actionKey)) return prev;
      const recipientType = String(node.data?.recipientType || "").trim();
      const needsRecipientDefault = !recipientType;
      const liveSender =
        gmailAccount?.connectionStatus === "connected"
          ? String(gmailAccount.email || "")
          : "";
      const needsSenderDisplay =
        Boolean(liveSender) && node.data?.senderEmail !== liveSender;
      const hasStalePin = Boolean(node.data?.connectedAccountId);
      if (!needsRecipientDefault && !needsSenderDisplay && !hasStalePin) {
        return prev;
      }
      const triggerKey = String(
        prev.find((n) => n.type === "trigger")?.data?.triggerKey || ""
      );
      return prev.map((n) => {
        if (n.id !== selectedId) return n;
        const nextData = {
          ...(n.data || {}),
          ...(needsRecipientDefault
            ? { recipientType: defaultEmailRecipientType(triggerKey) }
            : {}),
          ...(liveSender ? { senderEmail: liveSender } : {}),
        };
        // Runtime resolve — do not pin ConnectedAccountId into workflow nodes.
        delete nextData.connectedAccountId;
        return { ...n, data: nextData };
      });
    });
  }, [selectedId, gmailAccount, setNodes]);

  useEffect(() => {
    if (!selectedId) return;
    setNodes((prev) => {
      const node = prev.find((n) => n.id === selectedId);
      if (!node || !isOutlookActionKey(node.data?.actionKey)) return prev;
      const recipientType = String(node.data?.recipientType || "").trim();
      const needsRecipientDefault = !recipientType;
      const liveSender =
        outlookAccount?.connectionStatus === "connected"
          ? String(outlookAccount.email || "")
          : "";
      const needsSenderDisplay =
        Boolean(liveSender) && node.data?.senderEmail !== liveSender;
      const hasStalePin = Boolean(node.data?.connectedAccountId);
      if (!needsRecipientDefault && !needsSenderDisplay && !hasStalePin) {
        return prev;
      }
      const triggerKey = String(
        prev.find((n) => n.type === "trigger")?.data?.triggerKey || ""
      );
      return prev.map((n) => {
        if (n.id !== selectedId) return n;
        const nextData = {
          ...(n.data || {}),
          emailProvider: "microsoft",
          ...(needsRecipientDefault
            ? { recipientType: defaultEmailRecipientType(triggerKey) }
            : {}),
          ...(liveSender ? { senderEmail: liveSender } : {}),
        };
        // Runtime resolve — do not pin ConnectedAccountId into workflow nodes.
        delete nextData.connectedAccountId;
        return { ...n, data: nextData };
      });
    });
  }, [selectedId, outlookAccount, setNodes]);

  const palette = useMemo(
    () =>
      triggerCatalog.length
        ? buildPaletteWithTriggers(triggerCatalog, t)
        : FLOW_ACTION_PALETTE,
    [triggerCatalog, t, FLOW_ACTION_PALETTE]
  );

  const filteredPalette = useMemo(() => {
    if (filter === "all") return palette;
    return palette.filter((p) => p.filter === filter);
  }, [filter, palette]);

  const selectedTriggerKey = useMemo(() => {
    const triggerNode = nodes.find((node) => node.type === "trigger");
    return String(triggerNode?.data?.triggerKey || "");
  }, [nodes]);

  const scheduledTriggerNode = useMemo(
    () =>
      nodes.find(
        (node) =>
          node.type === "trigger" &&
          String(node.data?.triggerKey || "") === "scheduled"
      ) || null,
    [nodes]
  );

  const isScheduledTrigger = Boolean(scheduledTriggerNode);

  const scheduledConfig = useMemo(() => {
    if (!scheduledTriggerNode) return null;
    return (
      normalizeScheduleConfig(
        (scheduledTriggerNode.data?.schedule as
          | Partial<AutomationScheduleConfig>
          | undefined) || {}
      ) || defaultScheduleConfig()
    );
  }, [scheduledTriggerNode]);

  const selectedTriggerOption = useMemo(
    () => findTriggerOption(triggerCatalog, selectedTriggerKey),
    [triggerCatalog, selectedTriggerKey]
  );

  const hasUnsupportedTrigger = useMemo(() => {
    if (!selectedTriggerKey) return true;
    if (triggerCatalogLoading || triggerCatalogError) return true;
    return !selectedTriggerOption?.isPublishable;
  }, [
    selectedTriggerKey,
    selectedTriggerOption,
    triggerCatalogLoading,
    triggerCatalogError,
  ]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          styleEdge({
            ...connection,
            id: newId("e"),
          }, t),
          eds
        )
      );
    },
    [setEdges]
  );

  const insertModule = useCallback(
    (
      item: PaletteItem,
      options?: {
        position?: { x: number; y: number };
        afterNodeId?: string | null;
        autoConnect?: boolean;
        edgeId?: string | null;
      }
    ) => {
      if (item.supported === false) {
        return;
      }

      const edgeId = options?.edgeId || null;
      const autoConnect = options?.autoConnect !== false;
      const newSourceHandle = defaultSourceHandle(
        item.type,
        item.defaults as Record<string, unknown>
      );
      const id = newId(item.type);

      // Resolve anchor from the latest graph snapshot (avoid stale picker closures).
      const edgeForInsert = edgeId
        ? edges.find((edge) => edge.id === edgeId) || null
        : null;
      const afterId =
        edgeForInsert?.source ||
        options?.afterNodeId ||
        pickerAfterNodeId ||
        selectedId;
      const afterNode = afterId
        ? nodes.find((n) => n.id === afterId) || null
        : null;

      // Parallel results from a trigger: grow routeCount instead of forcing "paths".
      if (
        autoConnect &&
        afterNode?.type === "trigger" &&
        item.type !== "trigger" &&
        !edgeId
      ) {
        const used = edges.filter((e) => e.source === afterNode.id).length;
        const current = clampRouteCount(afterNode.data?.routeCount, 1);
        const needed = Math.min(6, Math.max(current, used + 1));
        if (needed !== current) {
          setNodes((prev) =>
            prev.map((n) =>
              n.id === afterNode.id
                ? { ...n, data: { ...(n.data || {}), routeCount: needed } }
                : n
            )
          );
          afterNode.data = { ...(afterNode.data || {}), routeCount: needed };
        }
      }

      const siblingIndex =
        afterNode && item.type !== "trigger"
          ? edges.filter((e) => e.source === afterNode.id).length
          : 0;

      const position =
        options?.position ||
        (afterNode
          ? {
              x: afterNode.position.x + 280,
              y:
                afterNode.position.y +
                (item.type === "router" ? -40 : siblingIndex * 110),
            }
          : { x: 120 + nodes.length * 40, y: 160 + nodes.length * 24 });

      const newNode: Node = {
        id,
        type: item.type,
        position,
        data: { ...item.defaults },
      };

      setNodes((prev) => [...prev, newNode]);

      // Edge "+" insert: A→B becomes A→C→B. Resolve the edge inside setEdges(prev)
      // so a stale React closure cannot delete the wrong connections.
      if (edgeId && item.type !== "trigger") {
        let insertedOk = false;
        setEdges((prev) => {
          const result = reconnectInsertOnEdge(prev, {
            edgeId,
            newNodeId: id,
            newNodeSourceHandle: newSourceHandle,
            createEdgeId: () => newId("e"),
          });
          insertedOk = result.ok;
          if (!result.ok) return prev;
          return result.edges.map((edge) => styleEdge(edge, t));
        });
        toast.success(
          insertedOk
            ? t("automations.editor.toasts.addedAndLinked")
            : t("automations.editor.toasts.moduleAdded")
        );
      } else if (autoConnect && afterNode && item.type !== "trigger") {
        let replacedCount = 0;
        setEdges((prev) => {
          const liveAfter =
            prev.length >= 0
              ? {
                  ...afterNode,
                  data:
                    nodes.find((n) => n.id === afterNode.id)?.data ||
                    afterNode.data,
                }
              : afterNode;
          // Re-read routeCount after possible bump above.
          const afterWithRoutes = {
            ...liveAfter,
            data: {
              ...(liveAfter.data || {}),
              routeCount: clampRouteCount(
                afterNode.data?.routeCount,
                1
              ),
            },
          };
          const afterSourceHandle = pickOutgoingHandle(afterWithRoutes, prev);
          const spliced = spliceNodeAfterHandle(prev, {
            afterNodeId: afterNode.id,
            newNodeId: id,
            newNodeSourceHandle: newSourceHandle,
            afterSourceHandle,
            createEdgeId: () => newId("e"),
          });
          replacedCount = spliced.replaced.length;
          return spliced.edges.map((edge) => styleEdge(edge, t));
        });
        toast.success(
          replacedCount
            ? t("automations.editor.toasts.addedAndLinked")
            : afterNode.type === "trigger"
              ? t("automations.editor.toasts.resultAdded")
              : t("automations.editor.toasts.addedToSelected")
        );
      } else if (item.type === "trigger") {
        toast.success(t("automations.editor.toasts.triggerAdded"));
      } else {
        toast.success(t("automations.editor.toasts.moduleAdded"));
      }

      setSelectedIdSafe(id);
      setPickerOpen(false);
      setPickerEdgeId(null);
      setPickerAfterNodeId(null);
      setPickerMode("all");
      setInspectorBaseline(null);
      setDrawerSessionDirty(false);

      // Trigger pick: keep config drawer open (do not auto-open result picker).
      if (item.type === "trigger") {
        window.setTimeout(() => {
          setSelectedIdSafe(id);
          const firstField = document.querySelector(
            ".af-drawer--config input, .af-drawer--config select, .af-drawer--config textarea"
          ) as HTMLElement | null;
          firstField?.focus?.();
        }, 60);
      }

      window.setTimeout(() => {
        try {
          // Cap fitView below ReactFlow maxZoom so Zoom In stays enabled.
          fitView({ padding: 0.2, duration: 280, maxZoom: 1.5 });
        } catch {
          /* ignore */
        }
      }, 40);
    },
    [edges, fitView, nodes, pickerAfterNodeId, selectedId, setEdges, setNodes, setSelectedIdSafe]
  );

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData(
      "application/bizuply-automation-node"
    );
    if (!raw) return;
    let item: PaletteItem;
    try {
      item = JSON.parse(raw) as PaletteItem;
    } catch {
      return;
    }
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    insertModule(item, {
      position,
      afterNodeId: selectedId,
      autoConnect: true,
    });
  };

  const updateSelectedData = (patch: Record<string, unknown>) => {
    if (!selectedId) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? { ...n, data: { ...(n.data || {}), ...patch } }
          : n
      )
    );
  };

  const clearCanvasSelection = useCallback(() => {
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  const closeInspector = useCallback(
    (opts?: { discardSession?: boolean }) => {
      closingDrawerRef.current = true;
      if (opts?.discardSession && selectedIdRef.current && inspectorBaseline != null) {
        const id = selectedIdRef.current;
        let baselineData: Record<string, unknown> = {};
        try {
          baselineData = JSON.parse(inspectorBaseline) as Record<string, unknown>;
        } catch {
          baselineData = {};
        }
        setNodes((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, data: { ...baselineData }, selected: false } : { ...n, selected: false }
          )
        );
      } else {
        clearCanvasSelection();
      }
      setSelectedIdSafe(null);
      setInspectorBaseline(null);
      setDrawerSessionDirty(false);
      window.setTimeout(() => {
        closingDrawerRef.current = false;
      }, 120);
    },
    [clearCanvasSelection, inspectorBaseline, setNodes, setSelectedIdSafe]
  );

  const requestCloseInspector = useCallback(() => {
    if (drawerSessionDirty) return false;
    return true;
  }, [drawerSessionDirty]);

  const validateSelectedTriggerConfig = useCallback((): string | null => {
    const node = nodesRef.current.find((n) => n.id === selectedIdRef.current);
    if (!node || node.type !== "trigger") return null;
    const key = String(node.data?.triggerKey || "");
    if (key === "lead_status_changed") {
      const toStatus = String(node.data?.toStatus || "").trim();
      if (!toStatus) return t("automations.editor.needTargetStatus");
    }
    if (key === "appointment_reminder") {
      const hoursBefore = Number(node.data?.hoursBefore);
      if (!Number.isFinite(hoursBefore) || hoursBefore <= 0) {
        return t("automations.editor.needHoursBefore");
      }
    }
    if (key === "scheduled") {
      const schedule = normalizeScheduleConfig(
        (node.data?.schedule as Partial<AutomationScheduleConfig> | undefined) ||
          {}
      );
      if (!schedule) return t("automations.editor.invalidSchedule");
    }
    return null;
  }, []);

  const handleDrawerSave = async () => {
    const validationError = validateSelectedTriggerConfig();
    if (validationError) {
      toast.error(validationError);
      return false;
    }
    const ok = await handleSave(true);
    if (ok) {
      const node = nodesRef.current.find((n) => n.id === selectedIdRef.current);
      if (node) {
        setInspectorBaseline(JSON.stringify(node.data || {}));
        setDrawerSessionDirty(false);
      }
      toast.success(t("automations.editor.toasts.settingsSaved"));
    }
    return ok;
  };

  const handleDrawerFinish = async () => {
    const validationError = validateSelectedTriggerConfig();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const ok = await handleSave(true);
    if (!ok) return;
    closeInspector();
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setEdges((prev) =>
      prev.filter((e) => e.source !== selectedId && e.target !== selectedId)
    );
    setSelectedIdSafe(null);
    setInspectorBaseline(null);
    setDrawerSessionDirty(false);
  };

  const applyGmailPublishDefaults = (list: Node[]) => {
    const triggerKey = String(
      list.find((n) => n.type === "trigger")?.data?.triggerKey || ""
    );
    return list.map((n) => {
      if (
        !isGmailActionKey(n.data?.actionKey) &&
        !isOutlookActionKey(n.data?.actionKey)
      ) {
        return n;
      }
      const recipientType = String(n.data?.recipientType || "").trim();
      return {
        ...n,
        data: {
          ...(n.data || {}),
          ...(recipientType
            ? {}
            : { recipientType: defaultEmailRecipientType(triggerKey) }),
          emailProvider: isOutlookActionKey(n.data?.actionKey)
            ? "microsoft"
            : "gmail",
        },
      };
    });
  };

  const handleSave = async (
    quiet = false,
    nodesOverride?: Node[]
  ): Promise<boolean> => {
    if (readOnly) {
      if (!quiet) toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return false;
    }
    // Prefer refs so toolbar/drawer Save always persist the latest graph,
    // even if the callback closed over a slightly older render.
    const nodesToPersist = applyGmailPublishDefaults(
      nodesOverride || nodesRef.current
    );
    const edgesToPersist = edgesRef.current;
    setSaving(true);
    setSaveState("saving");
    try {
      const saved = await saveAutomationWorkflow(businessId, workflow._id, {
        name: name.trim() || workflow.name,
        nodes: nodesToPersist.map((n) => ({
          id: n.id,
          type: (n.type ||
            "action") as AutomationWorkflow["nodes"][number]["type"],
          position: n.position,
          data: (n.data || {}) as Record<string, unknown>,
        })),
        edges: edgesToPersist.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle || null,
          targetHandle: e.targetHandle || null,
          label: typeof e.label === "string" ? e.label : "",
        })),
      });
      onSaved(saved);
      setName(saved.name || name);
      setNodes(withSelectedNode(toFlowNodes(saved), selectedIdRef.current));
      setEdges(toFlowEdges(saved));
      setSaveState("saved");
      if (!quiet) toast.success(t("automations.editor.toasts.draftSaved"));
      return true;
    } catch (error: unknown) {
      setSaveState("error");
      toast.error(readErrorMessage(error, t("automations.editor.toasts.saveError")));
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (readOnly || !dirty || saving) return;
    const timer = window.setTimeout(() => void handleSave(true), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, name, nodes, edges, readOnly]);

  const selectNodeFromPublishErrors = (errors: string[]) => {
    const joined = errors.join(" ");
    const nodeId = joined.match(
      /(?:node|מודול|פעולה)[\s:]+([A-Za-z0-9_-]+)/i
    )?.[1];
    if (nodeId && nodes.some((node) => node.id === nodeId)) {
      setSelectedId(nodeId);
    }
  };

  const refreshBillingUsage = async () => {
    if (!businessId) return null;
    try {
      const usage = await getAutomationBillingUsage(businessId);
      setBillingUsage(usage);
      return usage;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!isScheduledTrigger || !businessId) return;
    void refreshBillingUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScheduledTrigger, businessId]);

  const openBillingGateModal = (mode: "pick" | "manage") => {
    setBillingModalMode(mode);
    setShowBillingModal(true);
    void refreshBillingUsage();
  };

  const openWhatsAppBillingGateModal = () => {
    setShowWaBillingModal(true);
    void refreshWaBilling();
  };

  const applyBillingGateCode = (code: string | null | undefined): boolean => {
    if (!code) return false;
    if (isWhatsAppBillingGateCode(code)) {
      const msg =
        code === WHATSAPP_BILLING_API_CODES.SETUP_REQUIRED
          ? t("automations.editor.toasts.waBillingRequired")
          : t("automations.editor.toasts.waBillingBlock");
      setPublishError(msg);
      toast.error(msg);
      openWhatsAppBillingGateModal();
      return true;
    }
    const normalized = normalizeAutomationBillingPublicCode(code);
    if (normalized === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) {
      const msg = t("automations.editor.toasts.planRequired");
      setPublishError(msg);
      toast.error(msg);
      openBillingGateModal("pick");
      return true;
    }
    if (normalized === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED) {
      // Soft warning only — action quota must not block publish / workflow start.
      toast.error(
        t("automations.editor.toasts.quotaExhausted")
      );
      openBillingGateModal("manage");
      return false;
    }
    if (normalized === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED) {
      const msg = t("automations.editor.toasts.billingBlocked");
      setPublishError(msg);
      toast.error(msg);
      openBillingGateModal("manage");
      return true;
    }
    return false;
  };

  const handlePublish = async () => {
    if (readOnly) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    if (workflow.status === "archived") {
      toast.error(t("automations.editor.toasts.archived"));
      return;
    }
    if (publishing) return;
    if (triggerCatalogLoading || triggerCatalogError || !triggerCatalog.length) {
      const msg = t("automations.editor.toasts.needTriggerCatalog");
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    const sendEmailNodes = nodes.filter(
      (node) =>
        node.type === "action" &&
        isBizuplySendEmailActionKey(node.data?.actionKey)
    );
    if (sendEmailNodes.length && !emailSenders.length) {
      const msg = t("automations.editor.email.noVerified");
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    if (
      sendEmailNodes.some((node) => !String(node.data?.senderId || "").trim())
    ) {
      const msg = t("automations.editor.email.noVerified");
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    if (
      sendEmailNodes.some((node) => {
        const senderId = String(node.data?.senderId || "").trim();
        return (
          senderId &&
          !emailSenders.some((row) => row.senderId === senderId)
        );
      })
    ) {
      const msg = t("automations.editor.email.senderUnavailable");
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    if (hasUnsupportedTrigger) {
      const msg = selectedTriggerOption
        ? t("automations.editor.toasts.unsupportedPublish")
        : t("automations.editor.toasts.unsupportedChoose");
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    setPublishing(true);
    setPublishError("");
    try {
      // Wait out an in-flight autosave, then always persist latest draft.
      const waitStarted = Date.now();
      while (savingRef.current && Date.now() - waitStarted < 15000) {
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
      if (savingRef.current) {
        const msg = t("automations.editor.toasts.saveTimeout");
        setPublishError(msg);
        toast.error(msg);
        return;
      }
      const nodesForPublish = applyGmailPublishDefaults(nodes);
      setNodes(nodesForPublish);
      const savedOk = await handleSave(true, nodesForPublish);
      if (!savedOk) {
        setPublishError(t("automations.editor.toasts.cannotSaveBeforePublish"));
        return;
      }
      const result = await publishAutomationWorkflow(businessId, workflow._id);
      if (result.errors?.length) {
        if (applyBillingGateCode(result.code)) {
          return;
        }
        const msg = result.errors.join(" · ");
        setPublishError(msg);
        toast.error(msg);
        selectNodeFromPublishErrors(result.errors);
        return;
      }
      if (applyBillingGateCode(result.code)) {
        return;
      }
      if (!result.workflow) {
        const msg = t("automations.editor.toasts.publishNoResponse");
        setPublishError(msg);
        toast.error(msg);
        return;
      }
      onSaved(result.workflow);
      setName(result.workflow.name || name);
      setNodes(
        withSelectedNode(toFlowNodes(result.workflow), selectedIdRef.current)
      );
      setEdges(toFlowEdges(result.workflow));
      setSaveState("saved");
      setPublishError("");
      toast.success(
        result.workflow.status === "active"
          ? t("automations.editor.toasts.publishedUpdated")
          : t("automations.editor.toasts.published")
      );
      if (result.warnings?.length) {
        toast.warn(result.warnings.join(" · "));
      }
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: { errors?: string[]; error?: string; code?: string };
          };
        }
      )?.response?.data;
      const code =
        readWhatsAppBillingErrorCode(error) ||
        readAutomationErrorCode(error) ||
        response?.code ||
        null;
      if (applyBillingGateCode(code)) {
        return;
      }
      const msg =
        response?.errors?.join(" · ") ||
        response?.error ||
        readErrorMessage(error, t("automations.editor.toasts.publishFailed"));
      setPublishError(msg);
      toast.error(msg);
      selectNodeFromPublishErrors([msg]);
    } finally {
      setPublishing(false);
    }
  };

  const handleTest = async () => {
    if (readOnly) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setTesting(true);
    try {
      const trigger = nodes.find((node) => node.type === "trigger");
      const eventType = String(trigger?.data?.triggerKey || "manual");
      const example = await fetchDryRunExample(businessId, workflow._id, eventType);
      const result = await dryRunAutomationWorkflow(businessId, workflow._id, {
        eventType,
        payload: (example || {}) as Record<string, unknown>,
      });
      setTestResult((result || {}) as Record<string, unknown>);
    } catch (error: unknown) {
      toast.error(readErrorMessage(error, t("automations.editor.toasts.testFailed")));
    } finally {
      setTesting(false);
    }
  };

  const edgesForCanvas = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: edge.type || "default",
        data: {
          ...(edge.data || {}),
          readOnly,
          onInsert: (edgeId: string) => {
            setSelectedId(null);
            setPickerMode("result");
            setPickerAfterNodeId(null);
            setPickerEdgeId(edgeId);
            setPickerOpen(true);
          },
        },
      })),
    [edges, readOnly]
  );

  const openPicker = useCallback(
    (opts?: {
      edgeId?: string | null;
      mode?: "all" | "trigger" | "result";
      afterNodeId?: string | null;
      clearSelection?: boolean;
      /** @deprecated use mode: "trigger" */
      preferTriggers?: boolean;
    }) => {
      holdPickerOpenRef.current = true;
      if (holdPickerOpenTimerRef.current != null) {
        window.clearTimeout(holdPickerOpenTimerRef.current);
      }
      holdPickerOpenTimerRef.current = window.setTimeout(() => {
        holdPickerOpenRef.current = false;
        holdPickerOpenTimerRef.current = null;
      }, 300);
      if (opts?.clearSelection) {
        setSelectedIdSafe(null);
        setInspectorBaseline(null);
        setDrawerSessionDirty(false);
      }
      setPickerEdgeId(opts?.edgeId || null);
      setPickerAfterNodeId(opts?.afterNodeId || null);
      const mode =
        opts?.mode ||
        (opts?.preferTriggers ? "trigger" : "all");
      setPickerMode(mode);
      setPickerOpen(true);
    },
    [setSelectedIdSafe]
  );

  const handleToolbarAddStep = useCallback(() => {
    const intent = resolveToolbarAddStep(selectedIdRef.current);
    // Close the config drawer without saving or discarding node data.
    // Opening the picker must not mutate the graph.
    closeInspector();
    openPicker({
      mode: intent.mode,
      afterNodeId: intent.afterNodeId,
      clearSelection: false,
    });
  }, [closeInspector, openPicker]);

  const pickerItems = filteredPalette;

  const selectedRouter =
    selectedNode?.type === "router"
      ? ensureRouterPaths((selectedNode.data || {}) as Record<string, unknown>)
      : null;

  return (
    <div className="af-builder" dir={dir}>
      <AutomationBuilderToolbar
        name={name}
        onNameChange={setName}
        onBack={onBack}
        readOnly={readOnly}
        writeBlockedTitle={writeBlockedTitle}
        dirty={dirty}
        saveState={saveState}
        saving={saving}
        publishing={publishing}
        workflow={workflow}
        onSave={() => void handleSave()}
        onPublish={() => void handlePublish()}
        onPause={async () =>
          onSaved(await pauseAutomationWorkflow(businessId, workflow._id))
        }
        onResume={async () => {
          try {
            onSaved(await resumeAutomationWorkflow(businessId, workflow._id));
          } catch (error: unknown) {
            const code =
              readWhatsAppBillingErrorCode(error) ||
              readAutomationErrorCode(error);
            if (applyBillingGateCode(code)) return;
            toast.error(
              readErrorMessage(error, t("automations.editor.toasts.resumeFailed"))
            );
          }
        }}
        onToggleTest={() => setTestOpen((open) => !open)}
        onOpenPicker={handleToolbarAddStep}
        hasUnsupportedTrigger={hasUnsupportedTrigger}
        triggerCatalogError={triggerCatalogError}
      />
      

      <div className="af-canvas-wrap">
        

        {publishError ? (
          <div className="af-publish-error" role="alert">
            <strong>{t("automations.editor.test.publishFailed")}</strong>
            <span>{publishError}</span>
          </div>
        ) : null}

        {isScheduledTrigger ? (
          <AutomationUsageEstimatePanel
            nodes={nodes}
            edges={edges}
            schedule={scheduledConfig}
            planLimit={
              billingUsage?.usage?.limit ??
              billingUsage?.plan?.actionLimit ??
              billingUsage?.plan?.executionLimit ??
              null
            }
            planName={
              billingUsage?.plan?.nameHe || billingUsage?.plan?.name || null
            }
            onOpenPlans={() => openBillingGateModal("manage")}
          />
        ) : null}

        {testOpen ? (
          <div className="af-test-panel">
            <strong>{t("automations.editor.test.title")}</strong>
            <button
              type="button"
              className="af-btn af-btn--primary"
              disabled={testing || readOnly}
              title={writeBlockedTitle}
              onClick={() => void handleTest()}
            >
              {testing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <FlaskConical size={14} />
              )}
              {t("automations.editor.test.run")}
            </button>
            {testResult ? (
              <ol>
                {(
                  (testResult.steps || testResult.nodes || []) as Array<
                    Record<string, unknown>
                  >
                ).map((step, index) => (
                  <li key={index}>
                    {String(
                      step.label ||
                        step.nodeId ||
                        step.type ||
                        t("automations.editor.stepN", { n: index + 1 })
                    )}{" "}
                    · {String(step.status || "")}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        ) : null}

        {nodes.length === 0 ? (
          <AutomationEmptyState
            readOnly={readOnly}
            onAddTrigger={() =>
              openPicker({ mode: "trigger", clearSelection: true })
            }
          />
        ) : null}

        <ReactFlow
          nodes={nodes}
          edges={edgesForCanvas}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          nodeTypes={automationNodeTypes}
          edgeTypes={builderEdgeTypes}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          onNodeClick={(_, node) => {
            if (
              shouldIgnoreCanvasPickerClose({
                holdPickerOpen: holdPickerOpenRef.current,
                closingDrawer: closingDrawerRef.current,
              })
            ) {
              return;
            }
            setPickerOpen(false);
            setPickerEdgeId(null);
            setSelectedIdSafe(node.id);
            setInspectorBaseline(null);
          }}
          onPaneClick={() => {
            if (
              shouldIgnoreCanvasPickerClose({
                holdPickerOpen: holdPickerOpenRef.current,
                closingDrawer: closingDrawerRef.current,
              })
            ) {
              return;
            }
            setPickerOpen(false);
            if (drawerSessionDirty) return;
            closeInspector();
          }}
          onSelectionChange={({ nodes: selected }) => {
            if (
              shouldIgnoreCanvasPickerClose({
                holdPickerOpen: holdPickerOpenRef.current,
                closingDrawer: closingDrawerRef.current,
              })
            ) {
              return;
            }
            const nextId = selected[0]?.id;
            if (nextId) {
              setPickerOpen(false);
              setSelectedIdSafe(nextId);
            }
          }}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable
          minZoom={0.25}
          maxZoom={4}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
          proOptions={{ hideAttribution: true }}
          connectionLineStyle={{ stroke: "#64748b", strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: "default",
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#94a3b8"
          />
          <Controls
            position="bottom-left"
            fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          />
        </ReactFlow>

      <AutomationNodePicker
        open={pickerOpen}
        items={pickerItems}
        triggerCatalog={triggerCatalog}
        mode={pickerMode}
        loading={triggerCatalogLoading}
        error={triggerCatalogError}
        readOnly={readOnly}
        writeBlockedTitle={writeBlockedTitle}
        onRetryCatalog={() => void loadTriggerCatalog()}
        onClose={() => {
          setPickerOpen(false);
          setPickerEdgeId(null);
          setPickerAfterNodeId(null);
          setPickerMode("all");
        }}
        onPick={(item) => {
          if (
            item.type === "trigger" &&
            selectedNode?.type === "trigger" &&
            !pickerEdgeId &&
            !pickerAfterNodeId
          ) {
            // Replace current trigger configuration in-place.
            // Keep an already-saved fan-out; only brand-new nodes use palette default 1.
            updateSelectedData({
              ...item.defaults,
              triggerKey: item.key,
              label: item.label.replace(/^(?:טריגר|Trigger)\s*·\s*/, ""),
              routeCount: clampRouteCount(
                selectedNode.data?.routeCount,
                DEFAULT_NEW_TRIGGER_ROUTE_COUNT
              ),
              ...(item.key === "scheduled"
                ? {
                    schedule:
                      (selectedNode.data?.schedule as
                        | Partial<AutomationScheduleConfig>
                        | undefined) || defaultScheduleConfig(),
                  }
                : { schedule: undefined }),
            });
            setPickerOpen(false);
            setPickerMode("all");
            return;
          }
          insertModule(item, {
            edgeId: pickerEdgeId,
            afterNodeId: pickerAfterNodeId || selectedId,
            autoConnect: true,
          });
        }}
      />

      <AutomationConfigDrawer
        open={Boolean(selectedNode)}
        title={
          selectedNode
            ? String(
                selectedNode.data?.label ||
                  TYPE_META[selectedNode.type as keyof typeof TYPE_META]
                    ?.title ||
                  t("automations.common.settings")
              )
            : t("automations.common.settings")
        }
        subtitle={
          selectedNode?.type === "trigger"
            ? selectedTriggerOption?.description ||
              t("automations.editor.triggerSettings")
            : selectedNode
              ? TYPE_META[selectedNode.type as keyof typeof TYPE_META]?.title
              : undefined
        }
        onClose={() => closeInspector({ discardSession: drawerSessionDirty })}
        onRequestClose={requestCloseInspector}
        allowBackdropClose={!drawerSessionDirty}
        footer={
          selectedNode ? (
            <div className="af-drawer__footer-row af-drawer__footer-row--split">
              <button
                type="button"
                className="af-btn af-btn--danger"
                onClick={deleteSelected}
              >
                {t("automations.editor.deleteModule")}
              </button>
              <div className="af-drawer__footer-actions">
                <button
                  type="button"
                  className="af-btn"
                  onClick={() =>
                    closeInspector({ discardSession: drawerSessionDirty })
                  }
                >
                  {t("automations.common.cancel")}
                </button>
                <button
                  type="button"
                  className="af-btn af-btn--secondary"
                  disabled={readOnly || saving}
                  title={writeBlockedTitle}
                  onClick={() => void handleDrawerSave()}
                >
                  {t("automations.common.save")}
                </button>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  disabled={readOnly || saving}
                  title={writeBlockedTitle}
                  onClick={() => void handleDrawerFinish()}
                >
                  {t("automations.editor.done")}
                </button>
              </div>
            </div>
          ) : null
        }
      >
        <div className="af-inspector af-inspector--drawer">
{!selectedNode ? (
          <div className="af-inspector__hint">
            <p>
              <strong>{t("automations.editor.howTitle")}</strong>
            </p>
            <ol>
              <li>{t("automations.editor.how1")}</li>
              <li>{t("automations.editor.how2")}</li>
              <li>{t("automations.editor.how3")}</li>
            </ol>
          </div>
        ) : (
          <>
            <div
              className="af-pill"
              style={{
                width: "fit-content",
                background:
                  TYPE_META[selectedNode.type as keyof typeof TYPE_META]
                    ?.accent,
                color:
                  TYPE_META[selectedNode.type as keyof typeof TYPE_META]?.color,
              }}
            >
              {TYPE_META[selectedNode.type as keyof typeof TYPE_META]?.title}
            </div>

            <label>
              {t("automations.common.title")}
              <input
                value={String(selectedNode.data?.label || "")}
                onChange={(e) => updateSelectedData({ label: e.target.value })}
                data-demo-target={
                  selectedNode.type !== "trigger" ? "automations-action-config" : undefined
                }
              />
            </label>

            {selectedNode.type === "trigger" ? (
              <>
                <div className="af-trigger-config-card">
                  <MixedBidiText
                    as="p"
                    className="af-trigger-config-card__label"
                    text={
                      TRIGGER_CATEGORY_LABELS[
                        selectedTriggerOption?.category || ""
                      ] || t("automations.catalog.nodeTypes.trigger")
                    }
                  />
                  <MixedBidiText
                    as="strong"
                    text={
                      selectedTriggerOption?.label ||
                      String(selectedNode.data?.label || t("automations.catalog.nodeTypes.trigger"))
                    }
                  />
                  <MixedBidiText
                    as="p"
                    text={
                      selectedTriggerOption?.description ||
                      t("automations.editor.triggerEvent")
                    }
                  />
                  {!selectedTriggerOption?.triggerBillable ? (
                    <span className="af-picker-item__billing">{t("automations.catalog.noCharge")}</span>
                  ) : null}
                  {triggerCatalogError ? (
                    <div className="af-wa-template__state af-wa-template__state--error">
                      <p>{triggerCatalogError}</p>
                      <button
                        type="button"
                        className="af-toolbar__btn"
                        onClick={() => void loadTriggerCatalog()}
                      >
                        {t("automations.common.retry")}
                      </button>
                    </div>
                  ) : null}
                  {selectedNode.data?.triggerKey &&
                  !triggerCatalogLoading &&
                  !triggerCatalogError &&
                  !findTriggerOption(
                    triggerCatalog,
                    String(selectedNode.data.triggerKey)
                  ) ? (
                    <p className="af-wa-template__state af-wa-template__state--error">
                      {t("automations.editor.unsupportedTrigger")}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="af-btn af-btn--secondary"
                    disabled={readOnly || triggerCatalogLoading}
                    title={writeBlockedTitle}
                    onClick={() =>
                      openPicker({
                        mode: "trigger",
                        clearSelection: false,
                      })
                    }
                  >
                    {t("automations.editor.replaceTrigger")}
                  </button>
                </div>

                {String(selectedNode.data?.triggerKey || "") ===
                "lead_status_changed" ? (
                  <div className="af-trigger-fields">
                    <p className="af-trigger-fields__heading">{t("automations.common.requiredFields")}</p>
                    <label>
                      {t("automations.editor.toStatus")}
                      <select
                        value={String(selectedNode.data?.toStatus || "")}
                        disabled={readOnly}
                        required
                        autoFocus
                        onChange={(e) =>
                          updateSelectedData({ toStatus: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          {t("automations.editor.chooseTargetStatus")}
                        </option>
                        <option value="new">{t("automations.editor.statuses.new")}</option>
                        <option value="contacted">{t("automations.editor.statuses.contacted")}</option>
                        <option value="interested">{t("automations.editor.statuses.interested")}</option>
                        <option value="converted">{t("automations.editor.statuses.converted")}</option>
                        <option value="lost">{t("automations.editor.statuses.lost")}</option>
                        <option value="old">{t("automations.editor.statuses.old")}</option>
                      </select>
                    </label>
                    {!String(selectedNode.data?.toStatus || "").trim() ? (
                      <p className="af-field-error">{t("automations.editor.needTargetStatus")}</p>
                    ) : null}
                    <p className="af-trigger-fields__heading af-trigger-fields__heading--optional">
                      {t("automations.common.optional")}
                    </p>
                    <label>
                      {t("automations.editor.fromStatus")}
                      <select
                        value={String(selectedNode.data?.fromStatus || "")}
                        disabled={readOnly}
                        onChange={(e) =>
                          updateSelectedData({ fromStatus: e.target.value })
                        }
                      >
                        <option value="">{t("automations.editor.anyStatus")}</option>
                        <option value="new">{t("automations.editor.statuses.new")}</option>
                        <option value="contacted">{t("automations.editor.statuses.contacted")}</option>
                        <option value="interested">{t("automations.editor.statuses.interested")}</option>
                        <option value="converted">{t("automations.editor.statuses.converted")}</option>
                        <option value="lost">{t("automations.editor.statuses.lost")}</option>
                        <option value="old">{t("automations.editor.statuses.old")}</option>
                      </select>
                    </label>
                  </div>
                ) : null}

                {String(selectedNode.data?.triggerKey || "") === "scheduled" ? (
                  <ScheduleTriggerFields
                    value={
                      (selectedNode.data?.schedule as
                        | Partial<AutomationScheduleConfig>
                        | undefined) || defaultScheduleConfig()
                    }
                    disabled={readOnly}
                    onChange={(schedule) => updateSelectedData({ schedule })}
                  />
                ) : null}
                <label>
                  {t("automations.editor.parallelFromTrigger")}
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={clampRouteCount(selectedNode.data?.routeCount, 1)}
                    onChange={(e) =>
                      updateSelectedData({
                        routeCount: clampRouteCount(e.target.value, 1),
                      })
                    }
                  />
                </label>
                <p className="af-inspector__hint-inline">
                  {t("automations.editor.parallelHint")}
                </p>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  disabled={readOnly}
                  title={writeBlockedTitle}
                  onClick={() =>
                    openPicker({
                      mode: "result",
                      afterNodeId: selectedNode.id,
                    })
                  }
                  data-demo-target="automations-add-action"
                >
                  {t("automations.editor.addResultToTrigger")}
                </button>
                {String(selectedNode.data?.triggerKey || "") ===
                  "appointment_reminder" ||
                String(selectedNode.data?.triggerKey || "").includes(
                  "appointment_reminder"
                ) ? (
                  <>
                    <label>
                      {t("automations.editor.hoursBefore")}
                      <input
                        type="number"
                        min={1}
                        max={168}
                        value={Number(selectedNode.data?.hoursBefore) || 24}
                        onChange={(e) =>
                          updateSelectedData({
                            hoursBefore: Math.max(
                              1,
                              Number(e.target.value) || 24
                            ),
                          })
                        }
                      />
                    </label>
                    <div className="af-reminder-presets">
                      {[
                        { hours: 2, label: t("automations.editor.preset2h") },
                        { hours: 24, label: t("automations.editor.preset1d") },
                        { hours: 48, label: t("automations.editor.preset2d") },
                        { hours: 72, label: t("automations.editor.preset3d") },
                      ].map((preset) => (
                        <button
                          key={preset.hours}
                          type="button"
                          className={`af-filter-chip${
                            Number(selectedNode.data?.hoursBefore) ===
                            preset.hours
                              ? " af-filter-chip--active"
                              : ""
                          }`}
                          disabled={readOnly}
                          onClick={() =>
                            updateSelectedData({
                              hoursBefore: preset.hours,
                              label:
                                preset.hours === 24
                                  ? t("automations.editor.reminder1d")
                                  : preset.hours === 48
                                    ? t("automations.editor.reminder2d")
                                    : t("automations.editor.reminderHours", { count: preset.hours }),
                            })
                          }
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </>
            ) : null}

            {selectedNode.type === "router" && selectedRouter ? (
              <>
                <label>
                  {t("automations.editor.routerCount")}
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={selectedRouter.pathCount}
                    onChange={(e) => {
                      const next = ensureRouterPaths({
                        ...selectedNode.data,
                        pathCount: Math.max(
                          1,
                          clampRouteCount(e.target.value, 1)
                        ),
                      });
                      updateSelectedData(next);
                    }}
                  />
                </label>
                {selectedRouter.paths.map((path, index) => (
                  <label key={path.id}>
                    {t("automations.editor.resultName", { n: index + 1 })}
                    <input
                      value={path.label}
                      onChange={(e) => {
                        const paths = selectedRouter.paths.map((p, i) =>
                          i === index ? { ...p, label: e.target.value } : p
                        );
                        updateSelectedData({
                          paths,
                          pathCount: paths.length,
                        });
                      }}
                    />
                  </label>
                ))}
              </>
            ) : null}

            {selectedNode.type === "delay" ? (
              <>
                <label>
                  {t("automations.editor.amount")}
                  <input
                    type="number"
                    min={1}
                    value={Number(selectedNode.data?.amount) || 1}
                    onChange={(e) =>
                      updateSelectedData({
                        amount: Number(e.target.value) || 1,
                      })
                    }
                  />
                </label>
                <label>
                  {t("automations.editor.unit")}
                  <select
                    value={String(selectedNode.data?.unit || "minutes")}
                    onChange={(e) =>
                      updateSelectedData({ unit: e.target.value })
                    }
                  >
                    {DELAY_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            ) : null}

            {selectedNode.type === "condition" ? (
              <label>
                {t("automations.editor.condition")}
                <select
                  value={String(
                    selectedNode.data?.conditionKey || "no_response"
                  )}
                  onChange={(e) => {
                    const opt = CONDITION_OPTIONS.find(
                      (o) => o.value === e.target.value
                    );
                    updateSelectedData({
                      conditionKey: e.target.value,
                      label: opt?.label || selectedNode.data?.label,
                    });
                  }}
                >
                  {CONDITION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {selectedNode.type === "action" ? (
              <>
                <label>
                  {t("automations.editor.actionType")}
                  <select
                    value={String(
                      selectedNode.data?.actionKey || "whatsapp_template"
                    )}
                    onChange={(e) => {
                      const opt = findActionOption(e.target.value);
                      const nextKey = e.target.value;
                      updateSelectedData({
                        actionKey: nextKey,
                        label: opt?.label || selectedNode.data?.label,
                        ...(nextKey === "send_gmail" ||
                        nextKey === "send_outlook"
                          ? {
                              recipientType:
                                selectedNode.data?.recipientType ||
                                "lead_email",
                              emailProvider:
                                nextKey === "send_outlook"
                                  ? "microsoft"
                                  : "gmail",
                            }
                          : {}),
                        ...(nextKey === "google_calendar_create_event"
                          ? {
                              title:
                                selectedNode.data?.title ||
                                t("automations.catalog.palette.meetingTitleDefault"),
                              manualEventDetails:
                                selectedNode.data?.manualEventDetails === true,
                              attendeeEmail:
                                selectedNode.data?.attendeeEmail || "",
                              location: selectedNode.data?.location || "",
                              start: selectedNode.data?.start || "",
                              end: selectedNode.data?.end || "",
                              durationMinutes:
                                selectedNode.data?.durationMinutes ?? "",
                              calendarId:
                                selectedNode.data?.calendarId || "primary",
                            }
                          : {}),
                        ...(nextKey === "google_calendar_update_event" ||
                        nextKey === "google_calendar_delete_event"
                          ? {
                              eventId:
                                selectedNode.data?.eventId ||
                                "{{appointment.googleEventId}}",
                              calendarId:
                                selectedNode.data?.calendarId || "primary",
                            }
                          : {}),
                      });
                    }}
                  >
                    {listInspectorActionOptions(
                      String(selectedNode.data?.actionKey || ""),
                      t
                    ).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedAiTemplate ? (
                  <section className="af-ai-config">
                    <p className="af-inspector__hint-inline">
                      {t("automations.aiTab.billing")}
                    </p>
                    <p className="af-trigger-fields__heading">{t("automations.editor.aiSettings")}</p>
                    {selectedAiTemplate.requiredConfiguration
                      .filter((field) => !field.advanced)
                      .map((field) => {
                        const value =
                          selectedNode.data?.[field.key] ??
                          field.defaultValue ??
                          (field.type === "boolean" ? false : "");
                        const update = (next: unknown) =>
                          updateSelectedData({ [field.key]: next });

                        if (field.type === "boolean") {
                          return (
                            <label key={field.key}>
                              <input
                                type="checkbox"
                                checked={Boolean(value)}
                                disabled={readOnly}
                                onChange={(event) => update(event.target.checked)}
                              />{" "}
                              {field.label}
                            </label>
                          );
                        }
                        if (field.type === "textarea") {
                          return (
                            <label key={field.key}>
                              {field.label}
                              <textarea
                                value={String(value)}
                                disabled={readOnly}
                                required={field.required}
                                onChange={(event) => update(event.target.value)}
                              />
                            </label>
                          );
                        }
                        if (field.type === "select") {
                          const options =
                            field.key === "channel"
                              ? [["whatsapp", "WhatsApp"], ["email", t("automations.editor.channelEmail")]]
                              : [
                                  ["professional", t("automations.editor.toneProfessional")],
                                  ["friendly", t("automations.editor.toneFriendly")],
                                  ["concise", t("automations.editor.toneConcise")],
                                ];
                          return (
                            <label key={field.key}>
                              {field.label}
                              <select
                                value={String(value)}
                                disabled={readOnly}
                                onChange={(event) => update(event.target.value)}
                              >
                                {options.map(([optionValue, optionLabel]) => (
                                  <option key={optionValue} value={optionValue}>
                                    {optionLabel}
                                  </option>
                                ))}
                              </select>
                            </label>
                          );
                        }
                        if (field.type === "multiselect") {
                          return (
                            <label key={field.key}>
                              {field.label}
                              <input
                                value={
                                  Array.isArray(value)
                                    ? value.join(", ")
                                    : String(value)
                                }
                                disabled={readOnly}
                                onChange={(event) =>
                                  update(
                                    event.target.value
                                      .split(",")
                                      .map((item) => item.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </label>
                          );
                        }
                        return (
                          <label key={field.key}>
                            {field.label}
                            <input
                              type={field.type === "number" ? "number" : "text"}
                              value={String(value)}
                              disabled={readOnly}
                              required={field.required}
                              onChange={(event) =>
                                update(
                                  field.type === "number"
                                    ? Number(event.target.value)
                                    : event.target.value
                                )
                              }
                            />
                          </label>
                        );
                      })}
                    {selectedAiTemplate.requiredConfiguration.some(
                      (field) => field.advanced
                    ) ? (
                      <details>
                        <summary>{t("automations.editor.advanced")}</summary>
                        {selectedAiTemplate.requiredConfiguration
                          .filter((field) => field.advanced)
                          .map((field) => (
                            <label key={field.key}>
                              {field.label}
                              <textarea
                                value={String(
                                  selectedNode.data?.[field.key] ??
                                    field.defaultValue ??
                                    ""
                                )}
                                disabled={readOnly}
                                onChange={(event) =>
                                  updateSelectedData({
                                    [field.key]: event.target.value,
                                  })
                                }
                              />
                            </label>
                          ))}
                      </details>
                    ) : null}
                  </section>
                ) : null}
                {isWhatsAppActionKey(
                  selectedNode.data?.actionKey || "whatsapp_template"
                ) ? (
                  <div className="af-wa-template">
                    <div className="af-wa-banner" dir={dir}>
                      <strong>{t("automations.editor.wa.bizuplyBannerTitle")}</strong>
                      <p>
                        {t("automations.editor.wa.bizuplyBannerText")}
                      </p>
                    </div>

                    <div className="af-wa-cost" dir={dir}>
                      <span className="af-wa-cost__badge">
                        {t("automations.editor.wa.oneAction")}
                      </span>
                      <span className="af-wa-cost__badge">
                        💬{" "}
                        {formatHeIls(
                          resolveWhatsAppUnitPriceIls(
                            waBillingUsage?.unitPriceIls
                          )
                        )}{" "}
                        {t("automations.editor.wa.perMessage")}
                      </span>
                      {(() => {
                        const unit = resolveWhatsAppUnitPriceIls(
                          waBillingUsage?.unitPriceIls
                        );
                        const triggerKey = String(
                          nodes.find((n) => n.type === "trigger")?.data
                            ?.triggerKey || ""
                        ).toLowerCase();
                        const scheduled = /schedule|cron|recurring|daily|weekly|monthly|timer/.test(
                          triggerKey
                        );
                        if (scheduled) {
                          return (
                            <p className="af-wa-cost__estimate">
                              {t("automations.editor.wa.estimateDaily", {
                                amount: formatHeIls(unit * 30),
                              })}
                            </p>
                          );
                        }
                        return (
                          <p className="af-wa-cost__estimate">
                            {t("automations.editor.wa.estimate100", {
                              amount: formatHeIls(unit * 100),
                            })}
                          </p>
                        );
                      })()}
                    </div>

                    <div className="af-wa-sender" dir={dir}>
                      <label>
                        {t("automations.editor.wa.sender")}
                        <select
                          value={selectedWaSenderMode}
                          disabled={readOnly || (!waManagedModeEnabled && !waPrivateConnected)}
                          onChange={(e) => {
                            const next = (
                              e.target.value === "business_connected"
                                ? "business_connected"
                                : "bizuply_managed"
                            ) as WhatsAppSenderMode;
                            updateSelectedData({
                              senderMode: next,
                              templateId: "",
                              metaTemplateId: "",
                              metaTemplateName: "",
                              language: "",
                              componentMappings: [],
                            });
                          }}
                        >
                          <option
                            value="bizuply_managed"
                            disabled={!waManagedModeEnabled}
                          >
                            {t("automations.editor.wa.managedNumber")}
                          </option>
                          <option
                            value="business_connected"
                            disabled={!waPrivateConnected}
                          >
                            {waPrivateConnected
                              ? t("automations.editor.wa.businessNumber")
                              : t("automations.editor.wa.connectBusinessNumber")}
                          </option>
                        </select>
                      </label>
                    </div>

                    <div className="af-wa-recipient" dir={dir}>
                      <label>
                        {t("automations.editor.wa.whoReceives")}
                        <select
                          value={String(
                            selectedNode.data?.recipientType ||
                              (isBusinessAlertMetaTemplateName(
                                String(selectedNode.data?.metaTemplateName || "")
                              )
                                ? "business_owner"
                                : "lead_phone")
                          )}
                          disabled={readOnly}
                          onChange={(e) => {
                            const recipientType = e.target.value;
                            updateSelectedData({
                              recipientType,
                              fixedPhone:
                                recipientType === "fixed_phone"
                                  ? String(selectedNode.data?.fixedPhone || "")
                                  : "",
                            });
                          }}
                        >
                          <option value="lead_phone">{t("automations.catalog.recipients.lead_phone")}</option>
                          <option value="business_owner">{t("automations.catalog.recipients.business_owner")}</option>
                          <option value="lead_owner">{t("automations.catalog.recipients.lead_owner")}</option>
                          <option value="fixed_phone">{t("automations.catalog.recipients.fixed_phone")}</option>
                        </select>
                      </label>
                      <p className="af-wa-recipient__hint">
                        {t("automations.editor.wa.recipient")}{" "}
                        {{
                          lead_phone: t("automations.catalog.recipients.lead_phone"),
                          business_owner: t("automations.catalog.recipients.business_owner"),
                          lead_owner: t("automations.catalog.recipients.lead_owner"),
                          fixed_phone: t("automations.catalog.recipients.fixed_phone"),
                        }[
                          String(
                            selectedNode.data?.recipientType ||
                              (isBusinessAlertMetaTemplateName(
                                String(selectedNode.data?.metaTemplateName || "")
                              )
                                ? "business_owner"
                                : "lead_phone")
                          ) as
                            | "lead_phone"
                            | "business_owner"
                            | "lead_owner"
                            | "fixed_phone"
                        ] || "—"}
                      </p>
                      {String(selectedNode.data?.recipientType || "") ===
                      "fixed_phone" ? (
                        <label>
                          {t("automations.editor.wa.fixedPhoneE164")}
                          <input
                            type="tel"
                            dir="ltr"
                            placeholder="+9725..."
                            disabled={readOnly}
                            value={String(selectedNode.data?.fixedPhone || "")}
                            onChange={(e) =>
                              updateSelectedData({
                                recipientType: "fixed_phone",
                                fixedPhone: e.target.value,
                              })
                            }
                          />
                        </label>
                      ) : null}
                    </div>

                    <div className="af-wa-template__head">
                      <span>{t("automations.editor.wa.template")}</span>
                      <button
                        type="button"
                        className="af-toolbar__btn"
                        disabled={waLoading || readOnly}
                        onClick={() =>
                              void refreshWhatsAppTemplatesFromMeta(
                                selectedWaSenderMode
                              )
                            }
                      >
                        {waLoading ? (
                          <>
                            <Loader2 size={14} className="af-spin" />
                            {t("automations.editor.wa.loadingTemplates")}
                          </>
                        ) : (
                          t("automations.editor.wa.refresh")
                        )}
                      </button>
                    </div>

                    {waLoading && waTemplates.length === 0 ? (
                      <p className="af-wa-template__state">
                        {t("automations.editor.wa.loadingTemplates")}
                      </p>
                    ) : !waConnected ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {waManagedModeEnabled
                            ? waSyncError ||
                              t("automations.editor.wa.loadTemplatesError")
                            : t("automations.editor.wa.managedOff")}
                        </p>
                        {waManagedModeEnabled ? (
                          <button
                            type="button"
                            className="af-toolbar__btn"
                            onClick={() =>
                              void refreshWhatsAppTemplatesFromMeta(
                                selectedWaSenderMode
                              )
                            }
                          >
                            {t("automations.editor.wa.retry")}
                          </button>
                        ) : (
                          <a
                            className="af-toolbar__btn"
                            href={`/business/${businessId}/dashboard/whatsapp`}
                          >
                            {t("automations.editor.wa.connectCta")}
                          </a>
                        )}
                      </div>
                    ) : waSyncError && waTemplates.length === 0 ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>{waSyncError || t("automations.editor.wa.loadTemplatesError")}</p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          onClick={() =>
                              void refreshWhatsAppTemplatesFromMeta(
                                selectedWaSenderMode
                              )
                            }
                        >
                          {t("automations.editor.wa.retry")}
                        </button>
                      </div>
                    ) : waTemplates.filter(
                        (tpl) =>
                          !tpl.isTestTemplate &&
                          tpl.automationSendable !== false &&
                          !isTestTemplateName(String(tpl.metaTemplateName || ""))
                      ).length === 0 ? (
                      <div className="af-wa-template__state">
                        <p>{t("automations.editor.wa.noneApproved")}</p>
                        <p className="af-wa-template__state-secondary">
                          {t("automations.editor.wa.noneApprovedHint")}
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={waLoading || readOnly}
                          onClick={() =>
                              void refreshWhatsAppTemplatesFromMeta(
                                selectedWaSenderMode
                              )
                            }
                        >
                          {t("automations.editor.wa.refresh")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <label className="af-wa-template__picker-label">
                          {t("automations.editor.wa.chooseTemplate")}
                          <WhatsAppAutomationTemplateSelect
                            templates={waTemplates}
                            value={String(selectedNode.data?.templateId || "")}
                            disabled={readOnly}
                            loading={waLoading}
                            savedMeta={{
                              templateId: String(
                                selectedNode.data?.templateId || ""
                              ),
                              metaTemplateName: String(
                                selectedNode.data?.metaTemplateName || ""
                              ),
                              language: String(
                                selectedNode.data?.language || ""
                              ),
                            }}
                            onChange={(tpl) => {
                              if (!tpl) {
                                updateSelectedData({
                                  templateId: "",
                                  metaTemplateId: "",
                                  metaTemplateName: "",
                                  language: "",
                                  componentMappings: [],
                                });
                                return;
                              }
                              if (!canPersistAutomationTemplateSelection(tpl)) {
                                return;
                              }
                              const componentMappings =
                                buildMappingsFromTemplate(tpl, []);
                              const isBusinessAlert =
                                isBusinessAlertMetaTemplateName(
                                  String(tpl.metaTemplateName || "")
                                );
                              updateSelectedData({
                                senderMode: selectedWaSenderMode,
                                templateId: tpl._id,
                                metaTemplateId: tpl.metaTemplateId || "",
                                metaTemplateName: tpl.metaTemplateName || "",
                                language: tpl.language || "",
                                wabaId: "",
                                phoneNumberId: "",
                                integrationId: "",
                                componentMappings,
                                recipientType: isBusinessAlert
                                  ? "business_owner"
                                  : String(
                                      selectedNode.data?.recipientType ||
                                        "lead_phone"
                                    ),
                                fixedPhone: isBusinessAlert
                                  ? ""
                                  : String(
                                      selectedNode.data?.fixedPhone || ""
                                    ),
                              });
                            }}
                          />
                        </label>

                        {(() => {
                          const selectedTpl =
                            waTemplates.find(
                              (tpl) =>
                                tpl._id ===
                                String(selectedNode.data?.templateId || "")
                            ) || null;
                          if (!selectedTpl) return null;
                          return (
                            <div className="af-wa-template__meta" dir={dir}>
                              <strong>
                                {selectedTpl.displayName ||
                                  selectedTpl.friendlyName ||
                                  selectedTpl.name}
                              </strong>
                              <code dir="ltr">
                                {selectedTpl.metaTemplateName}
                              </code>
                              <span>
                                {selectedTpl.displaySecondary ||
                                  `${selectedTpl.languageLabelHe || selectedTpl.language} · ${
                                    selectedTpl.categoryLabelHe || ""
                                  }`}
                              </span>
                              {selectedTpl.isTestTemplate ? (
                                <em>{t("automations.editor.wa.testTemplate")}</em>
                              ) : null}
                            </div>
                          );
                        })()}

                        {(() => {
                          const selectedTpl =
                            waTemplates.find(
                              (tpl) =>
                                tpl._id ===
                                String(selectedNode.data?.templateId || "")
                            ) || null;
                          const templateVars = Array.isArray(
                            selectedTpl?.variables
                          )
                            ? selectedTpl!.variables.map(String)
                            : [];
                          const mappingRows = (
                            Array.isArray(selectedNode.data?.componentMappings)
                              ? (selectedNode.data
                                  .componentMappings as WhatsAppVariableMapping[])
                              : []
                          ).filter((row) =>
                            templateVars.includes(String(row.variable))
                          );
                          if (!selectedTpl || mappingRows.length === 0) {
                            return null;
                          }
                          return (
                          <div className="af-wa-template__mappings">
                            <p>{t("automations.editor.wa.variableMapping")}</p>
                            {mappingRows.map((row, index) => {
                              const label = templateVariableLabel(
                                String(selectedTpl.metaTemplateName || ""),
                                String(row.variable),
                                t
                              );
                              return (
                              <div
                                key={`${row.variable}-${index}`}
                                className="af-wa-template__map-row"
                              >
                                <label>
                                  <span dir="ltr">
                                    {`{{${row.variable}}}`}
                                    {label ? ` ${label}` : ""}
                                  </span>
                                  <select
                                    value={mappingPresetKey(row)}
                                    disabled={readOnly}
                                    onChange={(e) => {
                                      const preset = WA_MAPPING_PRESETS.find(
                                        (p) => p.key === e.target.value
                                      );
                                      const next = mappingRows.map(
                                        (item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              source: preset?.source || "",
                                              field: preset?.field || "",
                                              constantValue:
                                                preset?.source === "constant" ||
                                                preset?.source === "manual"
                                                  ? item.constantValue || ""
                                                  : "",
                                            }
                                          : item
                                      );
                                      updateSelectedData({
                                        componentMappings: next,
                                      });
                                    }}
                                  >
                                    <option value="">{t("automations.editor.wa.chooseMapping")}</option>
                                    {WA_MAPPING_PRESETS.map((preset) => (
                                      <option
                                        key={preset.key}
                                        value={preset.key}
                                      >
                                        {preset.label}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                {row.source === "constant" ||
                                row.source === "manual" ? (
                                  <input
                                    type="text"
                                    placeholder={t("automations.common.value")}
                                    disabled={readOnly}
                                    value={String(row.constantValue || "")}
                                    onChange={(e) => {
                                      const next = mappingRows.map(
                                        (item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              constantValue: e.target.value,
                                            }
                                          : item
                                      );
                                      updateSelectedData({
                                        componentMappings: next,
                                      });
                                    }}
                                  />
                                ) : null}
                              </div>
                              );
                            })}
                          </div>
                          );
                          })()}
                      </>
                    )}

                    <WhatsAppActionPreview
                      template={selectedWaTemplate}
                      mappings={
                        Array.isArray(selectedNode.data?.componentMappings)
                          ? (selectedNode.data
                              .componentMappings as WhatsAppVariableMapping[])
                          : []
                      }
                      recipientType={String(
                        selectedNode.data?.recipientType || ""
                      )}
                      senderLabel={t("automations.editor.wa.managedNumber")}
                      hasSelection={Boolean(
                        String(selectedNode.data?.templateId || "").trim()
                      )}
                    />

                    {waLastSyncAt ? (
                      <p className="af-wa-template__sync">
                        {t("automations.editor.wa.lastSync", {
                          time: new Date(waLastSyncAt).toLocaleString(
                            getIntlLocale(i18n.language)
                          ),
                        })}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {isGmailActionKey(selectedNode.data?.actionKey) ? (
                  <div className="af-wa-template">
                    <div className="af-wa-banner" dir={dir}>
                      <strong>{t("automations.editor.gmail.bannerTitle")}</strong>
                      <p>
                        {t("automations.editor.gmail.bannerText")}
                      </p>
                    </div>

                    {gmailLoading ? (
                      <p className="af-wa-template__state">{t("automations.editor.gmail.loading")}</p>
                    ) : !gmailAvailable ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {gmailMessage ||
                            t("automations.editor.gmail.pendingApproval")}
                        </p>
                      </div>
                    ) : gmailAccount?.connectionStatus !== "connected" ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {gmailMessage ||
                            t("automations.editor.gmail.connectBeforePublish")}
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={readOnly}
                          title={writeBlockedTitle}
                          onClick={async () => {
                            try {
                              const data = await getGmailConnectUrl(
                                businessId,
                                window.location.pathname
                              );
                              if (!data?.url) {
                                throw new Error(t("automations.editor.gmail.noConnectUrl"));
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(error, t("automations.editor.gmail.connectFailed"))
                              );
                            }
                          }}
                        >
                          {t("automations.editor.gmail.connect")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir={dir}>
                          <label>
                            {t("automations.editor.wa.sender")}
                            <input
                              type="text"
                              dir="ltr"
                              disabled
                              value={`Gmail — ${String(
                                gmailAccount.email ||
                                  selectedNode.data?.senderEmail ||
                                  ""
                              )}`}
                              readOnly
                            />
                          </label>
                        </div>

                        <div className="af-wa-recipient" dir={dir}>
                          <label>
                            {t("automations.editor.gmail.whoReceives")}
                            <select
                              value={String(
                                selectedNode.data?.recipientType || "lead_email"
                              )}
                              disabled={readOnly}
                              onChange={(e) => {
                                const recipientType = e.target.value;
                                updateSelectedData({
                                  recipientType,
                                  fixedEmail:
                                    recipientType === "fixed_email"
                                      ? String(
                                          selectedNode.data?.fixedEmail || ""
                                        )
                                      : "",
                                  customField:
                                    recipientType === "custom_field"
                                      ? String(
                                          selectedNode.data?.customField || ""
                                        )
                                      : "",
                                });
                              }}
                            >
                              <option value="lead_email">{t("automations.catalog.recipients.lead_email")}</option>
                              {triggerSupportsAppointmentCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "appointment_customer_email" ? (
                                <option value="appointment_customer_email">
                                  {t("automations.catalog.recipients.appointment_customer_email")}
                                </option>
                              ) : null}
                              {triggerSupportsStoreCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "store_customer_email" ? (
                                <option value="store_customer_email">
                                  {t("automations.catalog.recipients.store_customer_email")}
                                </option>
                              ) : null}
                              <option value="business_owner">{t("automations.catalog.recipients.business_owner")}</option>
                              <option value="lead_owner">{t("automations.catalog.recipients.lead_owner")}</option>
                              <option value="fixed_email">{t("automations.catalog.recipients.fixed_email")}</option>
                              <option value="custom_field">
                                {t("automations.catalog.recipients.custom_field")}
                              </option>
                            </select>
                          </label>
                          <p className="af-wa-recipient__hint">
                            {t("automations.editor.wa.recipient")}{" "}
                            {getRecipientLabel(t, String(
                                selectedNode.data?.recipientType || "lead_email"
                              ))}
                          </p>
                          {String(selectedNode.data?.recipientType || "") ===
                          "fixed_email" ? (
                            <label>
                              {t("automations.catalog.recipients.fixed_email")}
                              <input
                                type="email"
                                dir="ltr"
                                placeholder="name@example.com"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.fixedEmail || ""
                                )}
                                onChange={(e) =>
                                  updateSelectedData({
                                    recipientType: "fixed_email",
                                    fixedEmail: e.target.value,
                                  })
                                }
                              />
                            </label>
                          ) : null}
                          {String(selectedNode.data?.recipientType || "") ===
                          "custom_field" ? (
                            <label>
                              {t("automations.editor.email.customFieldKey")}
                              <input
                                type="text"
                                dir="ltr"
                                placeholder="emailField"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.customField || ""
                                )}
                                onChange={(e) =>
                                  updateSelectedData({
                                    recipientType: "custom_field",
                                    customField: e.target.value,
                                  })
                                }
                              />
                            </label>
                          ) : null}
                        </div>

                        <EmailActionTemplateFields
                          triggerKey={selectedTriggerKey}
                          readOnly={readOnly}
                          subject={String(selectedNode.data?.subject || "")}
                          html={String(
                            selectedNode.data?.html ||
                              selectedNode.data?.body ||
                              ""
                          )}
                          text={String(selectedNode.data?.text || "")}
                          onChange={(patch) => updateSelectedData(patch)}
                          previewFromLabel={("Gmail \u2014 " + String(gmailAccount?.email || selectedNode.data?.senderEmail || "\u2014"))}
                          previewToLabel={(() => {
                                  const type = String(
                                    selectedNode.data?.recipientType ||
                                      "lead_email"
                                  );
                                  const base =
                                    getRecipientLabel(t, String(type));
                                  if (
                                    type === "fixed_email" &&
                                    selectedNode.data?.fixedEmail
                                  ) {
                                    return base + " (" + String(selectedNode.data.fixedEmail) + ")";
                                  }
                                  if (
                                    type === "custom_field" &&
                                    selectedNode.data?.customField
                                  ) {
                                    return base + " (" + String(selectedNode.data.customField) + ")";
                                  }
                                  return base;
                                })()}
                        />
                      </>
                    )}
                  </div>
                ) : null}
                {isGoogleCalendarActionKey(selectedNode.data?.actionKey) ? (
                  <div className="af-wa-template">
                    <div className="af-wa-banner" dir={dir}>
                      <strong>Google Calendar</strong>
                      <p>
                        {triggerSupportsAppointmentCustomerEmail(
                          selectedTriggerKey
                        )
                          ? t("automations.editor.calendar.fromAppointment")
                          : t("automations.editor.calendar.manualHint")}
                      </p>
                    </div>
                    {calendarLoading ? (
                      <p className="af-wa-template__state">
                        {t("automations.editor.calendar.loading")}
                      </p>
                    ) : !calendarStatus?.available ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {calendarMessage ||
                            t("automations.editor.calendar.unavailable")}
                        </p>
                      </div>
                    ) : !calendarStatus?.calendar?.connected ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {calendarStatus?.calendar?.needsGrant
                            ? t("automations.editor.calendar.needCalendarScope")
                            : t("automations.editor.calendar.connectBeforePublish")}
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={readOnly}
                          title={writeBlockedTitle}
                          onClick={async () => {
                            try {
                              const data = await getGoogleCalendarConnectUrl(
                                businessId,
                                window.location.pathname
                              );
                              if (data?.enabledLocally) {
                                await loadCalendarStatus();
                                return;
                              }
                              if (!data?.url) {
                                throw new Error(t("automations.editor.gmail.noConnectUrl"));
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(
                                  error,
                                  t("automations.editor.calendar.connectFailed")
                                )
                              );
                            }
                          }}
                        >
                          {calendarStatus?.calendar?.needsGrant
                            ? "Grant Calendar access"
                            : t("automations.editor.calendar.connect")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir={dir}>
                          <label>
                            {t("automations.editor.calendar.googleAccount")}
                            <input
                              type="text"
                              dir="ltr"
                              disabled
                              value={String(
                                calendarStatus.calendar?.googleEmail ||
                                  calendarStatus.account?.email ||
                                  ""
                              )}
                              readOnly
                            />
                          </label>
                        </div>
                        {String(selectedNode.data?.actionKey) !==
                        "google_calendar_delete_event" ? (
                          <>
                            <label>
                              {t("automations.common.title")}
                              <input
                                type="text"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.title ||
                                    selectedNode.data?.summary ||
                                    ""
                                )}
                                placeholder={t("automations.catalog.palette.meetingTitleDefault")}
                                onChange={(e) =>
                                  updateSelectedData({ title: e.target.value })
                                }
                              />
                            </label>
                            <label>
                              {t("automations.editor.calendar.description")}
                              <textarea
                                rows={3}
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.description || ""
                                )}
                                onChange={(e) =>
                                  updateSelectedData({
                                    description: e.target.value,
                                  })
                                }
                              />
                            </label>
                            {String(selectedNode.data?.actionKey) ===
                            "google_calendar_create_event" ? (
                              <>
                                {triggerSupportsAppointmentCustomerEmail(
                                  selectedTriggerKey
                                ) ? (
                                  <div
                                    className="af-wa-banner"
                                    dir={dir}
                                    style={{ marginTop: 8 }}
                                  >
                                    <p style={{ margin: 0 }}>
                                      {t("automations.editor.calendar.fromAppointmentNote")}
                                    </p>
                                  </div>
                                ) : null}
                                <label
                                  className="af-checkbox"
                                  dir={dir}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: 8,
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    disabled={readOnly}
                                    checked={
                                      selectedNode.data?.manualEventDetails ===
                                      true
                                    }
                                    onChange={(e) =>
                                      updateSelectedData({
                                        manualEventDetails: e.target.checked,
                                      })
                                    }
                                  />
                                  {t("automations.editor.calendar.setManual")}
                                </label>
                              </>
                            ) : null}
                            {(String(selectedNode.data?.actionKey) !==
                              "google_calendar_create_event" ||
                              selectedNode.data?.manualEventDetails ===
                                true) && (
                              <>
                                <label>
                                  {t("automations.editor.calendar.startOptional")}
                                  <input
                                    type="text"
                                    dir="ltr"
                                    disabled={readOnly}
                                    value={String(
                                      selectedNode.data?.start || ""
                                    )}
                                    placeholder={t("automations.editor.calendar.datetimePlaceholder")}
                                    onChange={(e) =>
                                      updateSelectedData({
                                        start: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  {t("automations.editor.calendar.endOptional")}
                                  <input
                                    type="text"
                                    dir="ltr"
                                    disabled={readOnly}
                                    value={String(selectedNode.data?.end || "")}
                                    placeholder={t("automations.editor.calendar.datetimePlaceholder")}
                                    onChange={(e) =>
                                      updateSelectedData({
                                        end: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  {t("automations.editor.calendar.durationMinutes")}
                                  <input
                                    type="number"
                                    min={5}
                                    disabled={readOnly}
                                    value={
                                      selectedNode.data?.durationMinutes ===
                                        "" ||
                                      selectedNode.data?.durationMinutes ==
                                        null
                                        ? ""
                                        : Number(
                                            selectedNode.data?.durationMinutes
                                          )
                                    }
                                    onChange={(e) =>
                                      updateSelectedData({
                                        durationMinutes:
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value),
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  {t("automations.editor.calendar.attendee")}
                                  <input
                                    type="text"
                                    dir="ltr"
                                    disabled={readOnly}
                                    value={String(
                                      selectedNode.data?.attendeeEmail || ""
                                    )}
                                    placeholder="{{appointment.clientEmail}}"
                                    onChange={(e) =>
                                      updateSelectedData({
                                        attendeeEmail: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  {t("automations.editor.calendar.location")}
                                  <input
                                    type="text"
                                    disabled={readOnly}
                                    value={String(
                                      selectedNode.data?.location || ""
                                    )}
                                    placeholder="{{appointment.address}}"
                                    onChange={(e) =>
                                      updateSelectedData({
                                        location: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                              </>
                            )}
                          </>
                        ) : null}
                        {String(selectedNode.data?.actionKey) !==
                        "google_calendar_create_event" ? (
                          <label>
                            Event ID
                            <input
                              type="text"
                              dir="ltr"
                              disabled={readOnly}
                              value={String(selectedNode.data?.eventId || "")}
                              placeholder="{{appointment.googleEventId}}"
                              onChange={(e) =>
                                updateSelectedData({ eventId: e.target.value })
                              }
                            />
                          </label>
                        ) : null}
                        <label>
                          Calendar ID
                          <input
                            type="text"
                            dir="ltr"
                            disabled={readOnly}
                            value={String(
                              selectedNode.data?.calendarId || "primary"
                            )}
                            placeholder="primary"
                            onChange={(e) =>
                              updateSelectedData({
                                calendarId: e.target.value || "primary",
                              })
                            }
                          />
                        </label>
                      </>
                    )}
                  </div>
                ) : null}
                {isOutlookActionKey(selectedNode.data?.actionKey) ? (
                  <div className="af-wa-template">
                    <div className="af-wa-banner" dir={dir}>
                      <strong>{t("automations.editor.outlook.bannerTitle")}</strong>
                      <p>
                        {t("automations.editor.outlook.bannerText")}
                      </p>
                    </div>

                    {outlookLoading ? (
                      <p className="af-wa-template__state">{t("automations.editor.outlook.loading")}</p>
                    ) : !outlookAvailable ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {outlookMessage ||
                            t("automations.editor.outlook.comingSoon")}
                        </p>
                      </div>
                    ) : outlookAccount?.connectionStatus !== "connected" ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {outlookMessage ||
                            t("automations.editor.outlook.connectBeforePublish")}
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={readOnly}
                          title={writeBlockedTitle}
                          onClick={async () => {
                            try {
                              const data = await getOutlookConnectUrl(
                                businessId,
                                window.location.pathname
                              );
                              if (!data?.url) {
                                throw new Error(t("automations.editor.gmail.noConnectUrl"));
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(error, t("automations.editor.outlook.connectFailed"))
                              );
                            }
                          }}
                        >
                          {t("automations.editor.outlook.connect")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir={dir}>
                          <label>
                            {t("automations.editor.wa.sender")}
                            <input
                              type="text"
                              dir="ltr"
                              disabled
                              value={`Outlook — ${String(
                                outlookAccount.email ||
                                  selectedNode.data?.senderEmail ||
                                  ""
                              )}`}
                              readOnly
                            />
                          </label>
                        </div>

                        <div className="af-wa-recipient" dir={dir}>
                          <label>
                            {t("automations.editor.gmail.whoReceives")}
                            <select
                              value={String(
                                selectedNode.data?.recipientType || "lead_email"
                              )}
                              disabled={readOnly}
                              onChange={(e) => {
                                const recipientType = e.target.value;
                                updateSelectedData({
                                  recipientType,
                                  emailProvider: "microsoft",
                                  fixedEmail:
                                    recipientType === "fixed_email"
                                      ? String(
                                          selectedNode.data?.fixedEmail || ""
                                        )
                                      : "",
                                  customField:
                                    recipientType === "custom_field"
                                      ? String(
                                          selectedNode.data?.customField || ""
                                        )
                                      : "",
                                });
                              }}
                            >
                              <option value="lead_email">{t("automations.catalog.recipients.lead_email")}</option>
                              {triggerSupportsAppointmentCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "appointment_customer_email" ? (
                                <option value="appointment_customer_email">
                                  {t("automations.catalog.recipients.appointment_customer_email")}
                                </option>
                              ) : null}
                              {triggerSupportsStoreCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "store_customer_email" ? (
                                <option value="store_customer_email">
                                  {t("automations.catalog.recipients.store_customer_email")}
                                </option>
                              ) : null}
                              <option value="business_owner">{t("automations.catalog.recipients.business_owner")}</option>
                              <option value="lead_owner">{t("automations.catalog.recipients.lead_owner")}</option>
                              <option value="fixed_email">{t("automations.catalog.recipients.fixed_email")}</option>
                              <option value="custom_field">
                                {t("automations.catalog.recipients.custom_field")}
                              </option>
                            </select>
                          </label>
                          <p className="af-wa-recipient__hint">
                            {t("automations.editor.wa.recipient")}{" "}
                            {getRecipientLabel(t, String(
                                selectedNode.data?.recipientType || "lead_email"
                              ))}
                          </p>
                          {String(selectedNode.data?.recipientType || "") ===
                          "fixed_email" ? (
                            <label>
                              {t("automations.catalog.recipients.fixed_email")}
                              <input
                                type="email"
                                dir="ltr"
                                placeholder="name@example.com"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.fixedEmail || ""
                                )}
                                onChange={(e) =>
                                  updateSelectedData({
                                    recipientType: "fixed_email",
                                    fixedEmail: e.target.value,
                                    emailProvider: "microsoft",
                                  })
                                }
                              />
                            </label>
                          ) : null}
                          {String(selectedNode.data?.recipientType || "") ===
                          "custom_field" ? (
                            <label>
                              {t("automations.editor.email.customFieldKey")}
                              <input
                                type="text"
                                dir="ltr"
                                placeholder="emailField"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.customField || ""
                                )}
                                onChange={(e) =>
                                  updateSelectedData({
                                    recipientType: "custom_field",
                                    customField: e.target.value,
                                    emailProvider: "microsoft",
                                  })
                                }
                              />
                            </label>
                          ) : null}
                        </div>

                        <EmailActionTemplateFields
                          triggerKey={selectedTriggerKey}
                          readOnly={readOnly}
                          subject={String(selectedNode.data?.subject || "")}
                          html={String(
                            selectedNode.data?.html ||
                              selectedNode.data?.body ||
                              ""
                          )}
                          text={String(selectedNode.data?.text || "")}
                          onChange={(patch) => updateSelectedData(patch)}
                          previewFromLabel={("Outlook \u2014 " + String(outlookAccount?.email || selectedNode.data?.senderEmail || "\u2014"))}
                          previewToLabel={(() => {
                                  const type = String(
                                    selectedNode.data?.recipientType ||
                                      "lead_email"
                                  );
                                  const base =
                                    getRecipientLabel(t, String(type));
                                  if (
                                    type === "fixed_email" &&
                                    selectedNode.data?.fixedEmail
                                  ) {
                                    return base + " (" + String(selectedNode.data.fixedEmail) + ")";
                                  }
                                  if (
                                    type === "custom_field" &&
                                    selectedNode.data?.customField
                                  ) {
                                    return base + " (" + String(selectedNode.data.customField) + ")";
                                  }
                                  return base;
                                })()}
                        />
                      </>
                    )}
                  </div>
                ) : null}
                {isBizuplySendEmailActionKey(selectedNode.data?.actionKey) ? (
                  <div className="af-wa-template" dir={dir}>
                    <div className="af-wa-banner">
                      <strong>{t("automations.editor.email.from")}</strong>
                      <p>{t("automations.editor.email.fromHelp")}</p>
                    </div>
                    {emailSenders.length ? (
                      <>
                        <label>
                          {t("automations.editor.email.from")}
                          <select
                            disabled={readOnly}
                            value={String(selectedNode.data?.senderId || "")}
                            onChange={(e) => {
                              const sender = emailSenders.find(
                                (row) => row.senderId === e.target.value
                              );
                              updateSelectedData({
                                senderId: e.target.value,
                                senderEmail: sender?.email || "",
                                senderName: sender?.displayName || "",
                                senderType: sender?.type || "",
                              });
                            }}
                          >
                            <option value="">{t("automations.editor.email.chooseVerified")}</option>
                            {(() => {
                              const selectedSenderId = String(
                                selectedNode.data?.senderId || ""
                              );
                              const selectedKnown = emailSenders.some(
                                (row) => row.senderId === selectedSenderId
                              );
                              if (!selectedSenderId || selectedKnown) return null;
                              const staleLabel =
                                String(selectedNode.data?.senderEmail || "").trim() ||
                                t("automations.editor.email.senderUnavailable");
                              return (
                                <option value={selectedSenderId}>
                                  {staleLabel}
                                </option>
                              );
                            })()}
                            {emailSenders.map((sender) => (
                              <option key={sender.senderId} value={sender.senderId}>
                                {`${String(sender.displayName || "").replace(/[<>]/g, "").trim() || sender.email} — ${sender.email}`}
                              </option>
                            ))}
                          </select>
                        </label>
                        {String(selectedNode.data?.senderId || "").trim() &&
                        !emailSenders.some(
                          (row) =>
                            row.senderId ===
                            String(selectedNode.data?.senderId || "")
                        ) ? (
                          <p className="af-wa-template__state af-wa-template__state--error">
                            {t("automations.editor.email.senderUnavailable")}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>{t("automations.editor.email.noVerified")}</p>
                        <p>
                          {t("automations.email.missingBody")}
                        </p>
                        <a href={`/business/${businessId}/dashboard/integrations#email-senders`}>
                          {t("automations.email.settingsCta")}
                        </a>
                      </div>
                    )}
                    <div className="af-wa-recipient" dir={dir}>
                      <label>
                        {t("automations.editor.email.to")}
                        <select
                          value={String(
                            selectedNode.data?.recipientType ||
                              defaultEmailRecipientType(selectedTriggerKey)
                          )}
                          disabled={readOnly}
                          onChange={(e) => {
                            const recipientType = e.target.value;
                            updateSelectedData({
                              recipientType,
                              fixedEmail:
                                recipientType === "fixed_email"
                                  ? String(selectedNode.data?.fixedEmail || "")
                                  : "",
                              customField:
                                recipientType === "custom_field"
                                  ? String(selectedNode.data?.customField || "")
                                  : "",
                            });
                          }}
                        >
                          <option value="lead_email">{t("automations.catalog.recipients.lead_email")}</option>
                          {triggerSupportsAppointmentCustomerEmail(
                            selectedTriggerKey
                          ) ||
                          String(selectedNode.data?.recipientType || "") ===
                            "appointment_customer_email" ? (
                            <option value="appointment_customer_email">
                              {t("automations.catalog.recipients.appointment_customer_email")}
                            </option>
                          ) : null}
                          {triggerSupportsStoreCustomerEmail(
                            selectedTriggerKey
                          ) ||
                          String(selectedNode.data?.recipientType || "") ===
                            "store_customer_email" ? (
                            <option value="store_customer_email">
                              {t("automations.catalog.recipients.store_customer_email")}
                            </option>
                          ) : null}
                          <option value="business_owner">{t("automations.catalog.recipients.business_owner")}</option>
                          <option value="lead_owner">{t("automations.catalog.recipients.lead_owner")}</option>
                          <option value="fixed_email">{t("automations.catalog.recipients.fixed_email")}</option>
                          <option value="custom_field">{t("automations.catalog.recipients.custom_field")}</option>
                        </select>
                      </label>
                      {String(selectedNode.data?.recipientType || "") ===
                      "fixed_email" ? (
                        <label>
                          {t("automations.catalog.recipients.fixed_email")}
                          <input
                            type="email"
                            dir="ltr"
                            placeholder="name@example.com"
                            disabled={readOnly}
                            value={String(selectedNode.data?.fixedEmail || "")}
                            onChange={(e) =>
                              updateSelectedData({
                                recipientType: "fixed_email",
                                fixedEmail: e.target.value,
                              })
                            }
                          />
                        </label>
                      ) : null}
                      {String(selectedNode.data?.recipientType || "") ===
                      "custom_field" ? (
                        <label>
                          {t("automations.editor.email.customFieldKey")}
                          <input
                            type="text"
                            dir="ltr"
                            placeholder="emailField"
                            disabled={readOnly}
                            value={String(selectedNode.data?.customField || "")}
                            onChange={(e) =>
                              updateSelectedData({
                                recipientType: "custom_field",
                                customField: e.target.value,
                              })
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                    <EmailActionTemplateFields
                      subject={String(selectedNode.data?.subject || "")}
                      html={String(selectedNode.data?.html || selectedNode.data?.body || "")}
                      text={String(selectedNode.data?.text || "")}
                      readOnly={readOnly}
                      triggerKey={selectedTriggerKey}
                      previewFromLabel={(() => {
                        const sender = emailSenders.find(
                          (row) =>
                            row.senderId ===
                            String(selectedNode.data?.senderId || "")
                        );
                        if (!sender) return t("automations.editor.email.noSender");
                        const name = String(sender.displayName || "")
                          .replace(/[<>]/g, "")
                          .trim();
                        return name
                          ? `${name} (${sender.email})`
                          : sender.email;
                      })()}
                      previewToLabel={(() => {
                        const type = String(
                          selectedNode.data?.recipientType ||
                            defaultEmailRecipientType(selectedTriggerKey)
                        );
                        const base = getRecipientLabel(t, String(type));
                        if (type === "fixed_email" && selectedNode.data?.fixedEmail) {
                          return `${base} (${String(selectedNode.data.fixedEmail)})`;
                        }
                        if (type === "custom_field" && selectedNode.data?.customField) {
                          return `${base} (${String(selectedNode.data.customField)})`;
                        }
                        return base;
                      })()}
                      onChange={(next) => updateSelectedData(next)}
                    />
                  </div>
                ) : null}
              </>
            ) : null}

          </>
        )}
      
        </div>
      </AutomationConfigDrawer>
      </div>

      {businessId ? (
        <>
          <AutomationPlanModal
            open={showBillingModal}
            businessId={businessId}
            usage={billingUsage}
            initialMode={billingModalMode}
            onClose={() => setShowBillingModal(false)}
            onUsageUpdated={async () => { await refreshBillingUsage(); }}
            onOpenCancel={() => {
              setShowBillingModal(false);
              setShowBillingCancelModal(true);
            }}
          />
          <AutomationCancelConfirmModal
            open={showBillingCancelModal}
            businessId={businessId}
            usage={billingUsage}
            onClose={() => setShowBillingCancelModal(false)}
            onCancelled={() => {
              setShowBillingCancelModal(false);
              void refreshBillingUsage();
            }}
          />
          <WhatsAppBillingSetupModal
            open={showWaBillingModal}
            businessId={businessId}
            usage={waBillingUsage}
            initialMode="setup"
            returnTo="automations"
            onClose={() => setShowWaBillingModal(false)}
            onUsageUpdated={async () => {
              await refreshWaBilling();
            }}
          />
        </>
      ) : null}
    </div>
  );
}

export default function AutomationFlowEditor(props: Props) {
  return (
    <ReactFlowProvider>
      <EditorInner {...props} />
    </ReactFlowProvider>
  );
}
