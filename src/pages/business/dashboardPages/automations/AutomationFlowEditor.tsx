import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { nextSendEmailSenderFields } from "./emailProviderAutomation";

const WA_MAPPING_PRESETS = [
  { key: "lead:name", source: "lead", field: "name", label: "שם הליד" },
  { key: "lead:phone", source: "lead", field: "phone", label: "טלפון הליד" },
  { key: "lead:email", source: "lead", field: "email", label: "אימייל הליד" },
  { key: "lead:source", source: "lead", field: "source", label: "מקור הליד" },
  {
    key: "business:businessName",
    source: "business",
    field: "businessName",
    label: "שם העסק",
  },
  {
    key: "appointment:date",
    source: "appointment",
    field: "date",
    label: "תאריך",
  },
  {
    key: "appointment:time",
    source: "appointment",
    field: "time",
    label: "שעה",
  },
  { key: "constant", source: "constant", field: "", label: "ערך קבוע" },
  {
    key: "manual",
    source: "manual",
    field: "",
    label: "שדה מותאם אישית / ערך ידני",
  },
] as const;

/** Labels for Meta positional variables (not injected system fields). */
const WA_VARIABLE_LABELS: Record<string, Record<string, string>> = {
  appointment_reminder: {
    "1": "שם הלקוח",
    "2": "זמן עד הפגישה",
    "3": "שעת הפגישה",
    "4": "שירות",
  },
  appointment_thanks: { "1": "שם הלקוח", "2": "שירות" },
  appointment_review: { "1": "שם הלקוח", "2": "שירות" },
  new_lead_welcome: { "1": "שם הליד" },
  lead_follow_up: { "1": "שם הליד" },
  lead_follow_up_2: { "1": "שם הליד" },
  new_client_welcome: { "1": "שם הלקוח" },
  inactive_client: { "1": "שם הלקוח" },
  new_lead_received_utility: {
    "1": "שם הליד",
    "2": "טלפון הליד",
    "3": "מקור הליד",
  },
  new_lead_received: {
    "1": "שם הליד",
    "2": "טלפון הליד",
    "3": "מקור הליד",
  },
};

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

const GMAIL_RECIPIENT_LABELS: Record<string, string> = {
  lead_email: "אימייל הליד",
  appointment_customer_email: "הלקוח שקבע תור",
  store_customer_email: "הלקוח בהזמנה",
  business_owner: "בעל העסק",
  lead_owner: "אחראי הליד",
  fixed_email: "כתובת קבועה",
  custom_field: "שדה מותאם אישית",
};

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
  variable: string
): string {
  const tpl = String(metaTemplateName || "").toLowerCase();
  const key = String(variable || "");
  return WA_VARIABLE_LABELS[tpl]?.[key] || "";
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
  AI_BILLING_SAFE_MESSAGE,
  getAiTemplateByKey,
  listSupportedAiTemplates,
} from "./aiAutomationCatalog";
import {
  CONDITION_OPTIONS,
  DELAY_UNITS,
  FLOW_ACTION_PALETTE,
  TRIGGER_CATEGORY_LABELS,
  TYPE_META,
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

function edgeLabelFromHandle(handle?: string | null) {
  if (!handle) return "";
  if (handle === "yes") return "כן";
  if (handle === "no") return "לא";
  if (handle.startsWith("route_")) return `תוצאה ${handle.split("_")[1]}`;
  if (handle.startsWith("path_")) return `תוצאה ${handle.split("_")[1]}`;
  return "";
}

function styleEdge(edge: Partial<Edge>): Edge {
  const handle = edge.sourceHandle || null;
  const label = edge.label || edgeLabelFromHandle(handle);
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
    })
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

  const loadApprovedWhatsAppTemplates = useCallback(async () => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const [status, approved] = await Promise.all([
        getWhatsAppIntegrationStatus(businessId, {
          senderMode: "bizuply_managed",
        }),
        listApprovedWhatsAppTemplates(businessId, {
          usableForAutomation: true,
        }),
      ]);
      setWaConnected(Boolean(status.connected || approved.connected));
      setWaManagedModeEnabled(
        Boolean(
          status.managedModeEnabled ??
            status.managedStatus?.managedModeEnabled ??
            true
        )
      );
      setWaLastSyncAt(
        approved.lastTemplatesSyncAt ||
          status.lastTemplatesSyncAt ||
          status.managedStatus?.lastTemplatesSyncAt ||
          null
      );
      setWaTemplates(approved.templates || []);
      const unavailable =
        status.customerUnavailableMessage ||
        status.managedStatus?.customerUnavailableMessage ||
        (approved as { customerUnavailableMessage?: string })
          .customerUnavailableMessage ||
        "";
      if (!approved.connected) {
        setWaSyncError(
          unavailable ||
            approved.message ||
            "שירות WhatsApp אינו זמין כרגע. יש לפנות לתמיכה."
        );
      } else if (approved.message) {
        setWaSyncError(approved.message);
      }
    } catch (error: unknown) {
      setWaTemplates([]);
      setWaSyncError(readErrorMessage(error, "לא הצלחנו לטעון את תבניות WhatsApp"));
    } finally {
      setWaLoading(false);
    }
  }, [businessId]);

  const refreshWhatsAppTemplatesFromMeta = useCallback(async () => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const synced = await syncWhatsAppTemplatesForAutomation(businessId);
      setWaConnected(Boolean(synced.connected));
      setWaLastSyncAt(synced.lastTemplatesSyncAt || null);
      setWaTemplates(synced.templates || []);
      if (!synced.connected) {
        setWaSyncError(
          synced.customerUnavailableMessage ||
            synced.message ||
            "שירות WhatsApp אינו זמין כרגע. יש לפנות לתמיכה."
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
        readErrorMessage(error, "לא הצלחנו לטעון את תבניות WhatsApp")
      );
      // Keep existing templates on sync failure; still try a list refetch.
      await loadApprovedWhatsAppTemplates();
      return;
    } finally {
      setWaLoading(false);
    }
  }, [businessId, loadApprovedWhatsAppTemplates]);

  useEffect(() => {
    void loadApprovedWhatsAppTemplates();
  }, [loadApprovedWhatsAppTemplates]);

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
      setGmailMessage(readErrorMessage(error, "לא הצלחנו לטעון את סטטוס Gmail"));
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
        readErrorMessage(error, "לא הצלחנו לטעון את סטטוס Outlook")
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
        readErrorMessage(error, "לא הצלחנו לטעון את סטטוס Google Calendar")
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
        readErrorMessage(error, "לא הצלחנו לטעון את קטלוג הטריגרים")
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
        ? buildPaletteWithTriggers(triggerCatalog)
        : FLOW_ACTION_PALETTE,
    [triggerCatalog]
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
          }),
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
          return result.edges.map((edge) => styleEdge(edge));
        });
        toast.success(
          insertedOk
            ? "נוסף וחובר אוטומטית (כולל המשך הזרימה)"
            : "מודול נוסף ללוח"
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
          return spliced.edges.map((edge) => styleEdge(edge));
        });
        toast.success(
          replacedCount
            ? "נוסף וחובר אוטומטית (כולל המשך הזרימה)"
            : afterNode.type === "trigger"
              ? "תוצאה נוספה לטריגר"
              : "נוסף וחובר אוטומטית למודול שנבחר"
        );
      } else if (item.type === "trigger") {
        toast.success("טריגר נוסף — בחרו מה יקרה אוטומטית");
      } else {
        toast.success("מודול נוסף ללוח");
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
      if (!toStatus) return "יש לבחור סטטוס יעד";
    }
    if (key === "appointment_reminder") {
      const hoursBefore = Number(node.data?.hoursBefore);
      if (!Number.isFinite(hoursBefore) || hoursBefore <= 0) {
        return "יש להגדיר כמה שעות לפני הפגישה";
      }
    }
    if (key === "scheduled") {
      const schedule = normalizeScheduleConfig(
        (node.data?.schedule as Partial<AutomationScheduleConfig> | undefined) ||
          {}
      );
      if (!schedule) return "הגדרות לוח הזמנים אינן תקינות";
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
      toast.success("ההגדרות נשמרו");
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
      if (!quiet) toast.success("הטיוטה נשמרה");
      return true;
    } catch (error: unknown) {
      setSaveState("error");
      toast.error(readErrorMessage(error, "שגיאה בשמירת האוטומציה"));
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
          ? "נדרש להגדיר חיוב WhatsApp לפני הפעלת האוטומציה."
          : "לא ניתן להפעיל אוטומציה עקב מצב חיוב WhatsApp";
      setPublishError(msg);
      toast.error(msg);
      openWhatsAppBillingGateModal();
      return true;
    }
    const normalized = normalizeAutomationBillingPublicCode(code);
    if (normalized === AUTOMATION_BILLING_API_CODES.PLAN_REQUIRED) {
      const msg = "כדי להפעיל אוטומציה יש לבחור חבילת פעולות";
      setPublishError(msg);
      toast.error(msg);
      openBillingGateModal("pick");
      return true;
    }
    if (normalized === AUTOMATION_BILLING_API_CODES.QUOTA_EXHAUSTED) {
      // Soft warning only — action quota must not block publish / workflow start.
      toast.error(
        "מכסת הפעולות החודשית נוצלה — פעולות מחויבות ייחסמו עד לשדרוג"
      );
      openBillingGateModal("manage");
      return false;
    }
    if (normalized === AUTOMATION_BILLING_API_CODES.BILLING_BLOCKED) {
      const msg = "לא ניתן להפעיל אוטומציות עקב מצב התשלום של החבילה";
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
      toast.error("לא ניתן לפרסם אוטומציה בארכיון");
      return;
    }
    if (publishing) return;
    if (triggerCatalogLoading || triggerCatalogError || !triggerCatalog.length) {
      const msg = "יש לטעון את קטלוג הטריגרים לפני פרסום";
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
      const msg = "לא הוגדר מייל עסקי מאומת";
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    if (
      sendEmailNodes.some((node) => !String(node.data?.senderId || "").trim())
    ) {
      const msg = "לא הוגדר מייל עסקי מאומת";
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
      const msg = "השולח שנבחר אינו מאומת";
      setPublishError(msg);
      toast.error(msg);
      return;
    }
    if (hasUnsupportedTrigger) {
      const msg = selectedTriggerOption
        ? "הטריגר שנבחר עדיין לא נתמך לפרסום"
        : "טריגר ישן או לא נתמך — יש לבחור טריגר נתמך לפני פרסום";
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
        const msg = "השמירה לוקחת יותר מדי זמן — נסו שוב";
        setPublishError(msg);
        toast.error(msg);
        return;
      }
      const nodesForPublish = applyGmailPublishDefaults(nodes);
      setNodes(nodesForPublish);
      const savedOk = await handleSave(true, nodesForPublish);
      if (!savedOk) {
        setPublishError("לא ניתן לשמור את הטיוטה לפני פרסום");
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
        const msg = "הפרסום הצליח אך לא התקבלה תשובה תקינה מהשרת";
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
          ? "האוטומציה פורסמה ועדכנה"
          : "האוטומציה פורסמה"
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
        readErrorMessage(error, "לא ניתן לפרסם את האוטומציה");
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
      toast.error(readErrorMessage(error, "בדיקת האוטומציה נכשלה"));
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

  const pickerItems = filteredPalette;

  const selectedRouter =
    selectedNode?.type === "router"
      ? ensureRouterPaths((selectedNode.data || {}) as Record<string, unknown>)
      : null;

  return (
    <div className="af-builder" dir="rtl">
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
              readErrorMessage(error, "לא ניתן להפעיל מחדש את האוטומציה")
            );
          }
        }}
        onToggleTest={() => setTestOpen((open) => !open)}
        onOpenPicker={() => openPicker({ clearSelection: true })}
        hasUnsupportedTrigger={hasUnsupportedTrigger}
        triggerCatalogError={triggerCatalogError}
      />
      

      <div className="af-canvas-wrap">
        

        {publishError ? (
          <div className="af-publish-error" role="alert">
            <strong>הפרסום נכשל</strong>
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
            <strong>מצב בדיקה — לא יישלחו הודעות ולא יתבצעו שינויים</strong>
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
              הריצו בדיקה
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
                        `שלב ${index + 1}`
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
            if (closingDrawerRef.current) return;
            setPickerOpen(false);
            setPickerEdgeId(null);
            setSelectedIdSafe(node.id);
            setInspectorBaseline(null);
          }}
          onPaneClick={() => {
            setPickerOpen(false);
            if (drawerSessionDirty) return;
            closeInspector();
          }}
          onSelectionChange={({ nodes: selected }) => {
            if (closingDrawerRef.current) return;
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
            updateSelectedData({
              ...item.defaults,
              triggerKey: item.key,
              label: item.label.replace(/^טריגר ·\s*/, ""),
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
                  "הגדרות"
              )
            : "הגדרות"
        }
        subtitle={
          selectedNode?.type === "trigger"
            ? selectedTriggerOption?.description ||
              "הגדרות הטריגר שמתחיל את האוטומציה"
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
                מחק מודול
              </button>
              <div className="af-drawer__footer-actions">
                <button
                  type="button"
                  className="af-btn"
                  onClick={() =>
                    closeInspector({ discardSession: drawerSessionDirty })
                  }
                >
                  ביטול
                </button>
                <button
                  type="button"
                  className="af-btn af-btn--secondary"
                  disabled={readOnly || saving}
                  title={writeBlockedTitle}
                  onClick={() => void handleDrawerSave()}
                >
                  שמור
                </button>
                <button
                  type="button"
                  className="af-btn af-btn--primary"
                  disabled={readOnly || saving}
                  title={writeBlockedTitle}
                  onClick={() => void handleDrawerFinish()}
                >
                  סיום
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
              <strong>איך בונים אוטומציה?</strong>
            </p>
            <ol>
              <li>בוחרים טריגר (מתי זה קורה)</li>
              <li>מוסיפים תוצאה — מה יקרה אוטומטית</li>
              <li>רוצים כמה תוצאות יחד? הוסיפו עוד תוצאה מהטריגר — בלי מסלולים</li>
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
              כותרת
              <input
                value={String(selectedNode.data?.label || "")}
                onChange={(e) => updateSelectedData({ label: e.target.value })}
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
                      ] || "טריגר"
                    }
                  />
                  <MixedBidiText
                    as="strong"
                    text={
                      selectedTriggerOption?.label ||
                      String(selectedNode.data?.label || "טריגר")
                    }
                  />
                  <MixedBidiText
                    as="p"
                    text={
                      selectedTriggerOption?.description ||
                      "האירוע שמתחיל את האוטומציה"
                    }
                  />
                  {!selectedTriggerOption?.triggerBillable ? (
                    <span className="af-picker-item__billing">ללא חיוב</span>
                  ) : null}
                  {triggerCatalogError ? (
                    <div className="af-wa-template__state af-wa-template__state--error">
                      <p>{triggerCatalogError}</p>
                      <button
                        type="button"
                        className="af-toolbar__btn"
                        onClick={() => void loadTriggerCatalog()}
                      >
                        נסיון חוזר
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
                      טריגר ישן או לא נתמך — יש לבחור טריגר נתמך מחדש
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
                    החלף טריגר
                  </button>
                </div>

                {String(selectedNode.data?.triggerKey || "") ===
                "lead_status_changed" ? (
                  <div className="af-trigger-fields">
                    <p className="af-trigger-fields__heading">שדות חובה</p>
                    <label>
                      לסטטוס
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
                          בחרו סטטוס יעד
                        </option>
                        <option value="new">חדש</option>
                        <option value="contacted">נוצר קשר</option>
                        <option value="interested">מתעניין</option>
                        <option value="converted">הפך ללקוח</option>
                        <option value="lost">אבוד</option>
                        <option value="old">ישן</option>
                      </select>
                    </label>
                    {!String(selectedNode.data?.toStatus || "").trim() ? (
                      <p className="af-field-error">יש לבחור סטטוס יעד</p>
                    ) : null}
                    <p className="af-trigger-fields__heading af-trigger-fields__heading--optional">
                      אופציונלי
                    </p>
                    <label>
                      מסטטוס
                      <select
                        value={String(selectedNode.data?.fromStatus || "")}
                        disabled={readOnly}
                        onChange={(e) =>
                          updateSelectedData({ fromStatus: e.target.value })
                        }
                      >
                        <option value="">כל סטטוס</option>
                        <option value="new">חדש</option>
                        <option value="contacted">נוצר קשר</option>
                        <option value="interested">מתעניין</option>
                        <option value="converted">הפך ללקוח</option>
                        <option value="lost">אבוד</option>
                        <option value="old">ישן</option>
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
                  כמה תוצאות יחד מהטריגר
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
                  כל תוצאה רצה במקביל — בלי מסלולים נפרדים.
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
                >
                  הוסף תוצאה לטריגר
                </button>
                {String(selectedNode.data?.triggerKey || "") ===
                  "appointment_reminder" ||
                String(selectedNode.data?.triggerKey || "").includes(
                  "appointment_reminder"
                ) ? (
                  <>
                    <label>
                      מתי לשלוח תזכורת (שעות לפני)
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
                        { hours: 2, label: "שעתיים לפני" },
                        { hours: 24, label: "יום לפני" },
                        { hours: 48, label: "יומיים לפני" },
                        { hours: 72, label: "3 ימים לפני" },
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
                                  ? "תזכורת פגישה — יום לפני"
                                  : preset.hours === 48
                                    ? "תזכורת פגישה — יומיים לפני"
                                    : `תזכורת פגישה — ${preset.hours} שעות לפני`,
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
                  כמה תוצאות יחד
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={selectedRouter.pathCount}
                    onChange={(e) => {
                      const next = ensureRouterPaths({
                        ...selectedNode.data,
                        pathCount: Math.max(
                          2,
                          clampRouteCount(e.target.value, 2)
                        ),
                      });
                      updateSelectedData(next);
                    }}
                  />
                </label>
                {selectedRouter.paths.map((path, index) => (
                  <label key={path.id}>
                    שם תוצאה {index + 1}
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
                  כמות
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
                  יחידה
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
                תנאי
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
                  סוג פעולה
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
                                "פגישה עם {{appointment.clientName}}",
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
                      String(selectedNode.data?.actionKey || "")
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
                      {AI_BILLING_SAFE_MESSAGE}
                    </p>
                    <p className="af-trigger-fields__heading">הגדרות AI</p>
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
                              ? [["whatsapp", "WhatsApp"], ["email", "אימייל"]]
                              : [
                                  ["professional", "מקצועי"],
                                  ["friendly", "ידידותי"],
                                  ["concise", "קצר"],
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
                        <summary>מתקדם</summary>
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
                    <div className="af-wa-banner" dir="rtl">
                      <strong>שליחה באמצעות מספר BizUply</strong>
                      <p>
                        עד להפעלת חיבור WhatsApp אישי לעסק, ההודעות יישלחו מהמספר
                        המרכזי של BizUply בשם העסק שלך.
                      </p>
                    </div>

                    <div className="af-wa-cost" dir="rtl">
                      <span className="af-wa-cost__badge">
                        ⚡ 1 פעולת אוטומציה
                      </span>
                      <span className="af-wa-cost__badge">
                        💬{" "}
                        {formatHeIls(
                          resolveWhatsAppUnitPriceIls(
                            waBillingUsage?.unitPriceIls
                          )
                        )}{" "}
                        להודעת WhatsApp
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
                              הערכה בלבד: לדוגמה הודעה אחת ביום ≈{" "}
                              {formatHeIls(unit * 30)} לחודש
                            </p>
                          );
                        }
                        return (
                          <p className="af-wa-cost__estimate">
                            הערכה בלבד: לדוגמה 100 הודעות ≈{" "}
                            {formatHeIls(unit * 100)}
                          </p>
                        );
                      })()}
                    </div>

                    <div className="af-wa-sender" dir="rtl">
                      <label>
                        שולח
                        <select
                          value="bizuply_managed"
                          disabled
                          onChange={() => undefined}
                        >
                          <option value="bizuply_managed">
                            מספר BizUply המנוהל
                          </option>
                          <option value="business_connected" disabled>
                            חיבור מספר WhatsApp של העסק — בקרוב
                          </option>
                        </select>
                      </label>
                    </div>

                    <div className="af-wa-recipient" dir="rtl">
                      <label>
                        למי לשלוח את ההודעה?
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
                          <option value="lead_phone">טלפון הליד</option>
                          <option value="business_owner">בעל העסק</option>
                          <option value="lead_owner">אחראי הליד</option>
                          <option value="fixed_phone">מספר קבוע</option>
                        </select>
                      </label>
                      <p className="af-wa-recipient__hint">
                        נמען:{" "}
                        {{
                          lead_phone: "טלפון הליד",
                          business_owner: "בעל העסק",
                          lead_owner: "אחראי הליד",
                          fixed_phone: "מספר קבוע",
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
                          מספר קבוע (E.164)
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
                      <span>תבנית WhatsApp</span>
                      <button
                        type="button"
                        className="af-toolbar__btn"
                        disabled={waLoading || readOnly}
                        onClick={() => void refreshWhatsAppTemplatesFromMeta()}
                      >
                        {waLoading ? (
                          <>
                            <Loader2 size={14} className="af-spin" />
                            תבניות נטענות...
                          </>
                        ) : (
                          "רענון תבניות"
                        )}
                      </button>
                    </div>

                    {waLoading && waTemplates.length === 0 ? (
                      <p className="af-wa-template__state">
                        תבניות נטענות...
                      </p>
                    ) : !waConnected ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {waManagedModeEnabled
                            ? waSyncError ||
                              "לא הצלחנו לטעון את תבניות WhatsApp"
                            : "יש לחבר WhatsApp Business של העסק — המצב המנוהל כבוי כרגע."}
                        </p>
                        {waManagedModeEnabled ? (
                          <button
                            type="button"
                            className="af-toolbar__btn"
                            onClick={() => void refreshWhatsAppTemplatesFromMeta()}
                          >
                            נסו שוב
                          </button>
                        ) : (
                          <a
                            className="af-toolbar__btn"
                            href={`/business/${businessId}/dashboard/whatsapp`}
                          >
                            לחיבור WhatsApp Business
                          </a>
                        )}
                      </div>
                    ) : waSyncError && waTemplates.length === 0 ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>{waSyncError || "לא הצלחנו לטעון את תבניות WhatsApp"}</p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          onClick={() => void refreshWhatsAppTemplatesFromMeta()}
                        >
                          נסו שוב
                        </button>
                      </div>
                    ) : waTemplates.filter(
                        (tpl) =>
                          !tpl.isTestTemplate &&
                          tpl.automationSendable !== false &&
                          !isTestTemplateName(String(tpl.metaTemplateName || ""))
                      ).length === 0 ? (
                      <div className="af-wa-template__state">
                        <p>אין תבניות WhatsApp מאושרות זמינות</p>
                        <p className="af-wa-template__state-secondary">
                          לאחר אישור תבנית ב-Meta, רעננו את הרשימה.
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={waLoading || readOnly}
                          onClick={() => void refreshWhatsAppTemplatesFromMeta()}
                        >
                          רענון תבניות
                        </button>
                      </div>
                    ) : (
                      <>
                        <label className="af-wa-template__picker-label">
                          בחירת תבנית
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
                                senderMode: "bizuply_managed",
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
                            <div className="af-wa-template__meta" dir="rtl">
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
                                <em>תבנית בדיקה</em>
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
                            <p>מיפוי משתנים</p>
                            {mappingRows.map((row, index) => {
                              const label = templateVariableLabel(
                                String(selectedTpl.metaTemplateName || ""),
                                String(row.variable)
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
                                    <option value="">בחרו מיפוי</option>
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
                                    placeholder="ערך"
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
                      senderLabel="מספר BizUply המנוהל"
                      hasSelection={Boolean(
                        String(selectedNode.data?.templateId || "").trim()
                      )}
                    />

                    {waLastSyncAt ? (
                      <p className="af-wa-template__sync">
                        סנכרון אחרון:{" "}
                        {new Date(waLastSyncAt).toLocaleString("he-IL")}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {isGmailActionKey(selectedNode.data?.actionKey) ? (
                  <div className="af-wa-template">
                    <div className="af-wa-banner" dir="rtl">
                      <strong>שליחה דרך Gmail המחובר</strong>
                      <p>
                        המייל יישלח מחשבון Gmail שחיברתם לעסק. אין שימוש ב-SMTP
                        ואין שליחה דרך BizUply.
                      </p>
                    </div>

                    {gmailLoading ? (
                      <p className="af-wa-template__state">טוען סטטוס Gmail...</p>
                    ) : !gmailAvailable ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {gmailMessage ||
                            "Gmail נמצא כרגע בתהליך אישור מול Google"}
                        </p>
                      </div>
                    ) : gmailAccount?.connectionStatus !== "connected" ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {gmailMessage ||
                            "יש לחבר חשבון Gmail לפני פרסום האוטומציה"}
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
                                throw new Error("לא התקבל קישור התחברות");
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(error, "התחברות Gmail נכשלה")
                              );
                            }
                          }}
                        >
                          חיבור Gmail
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir="rtl">
                          <label>
                            שולח
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

                        <div className="af-wa-recipient" dir="rtl">
                          <label>
                            למי לשלוח את המייל?
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
                              <option value="lead_email">אימייל הליד</option>
                              {triggerSupportsAppointmentCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "appointment_customer_email" ? (
                                <option value="appointment_customer_email">
                                  אימייל הלקוח שקבע תור
                                </option>
                              ) : null}
                              {triggerSupportsStoreCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "store_customer_email" ? (
                                <option value="store_customer_email">
                                  אימייל הלקוח בהזמנה
                                </option>
                              ) : null}
                              <option value="business_owner">בעל העסק</option>
                              <option value="lead_owner">אחראי הליד</option>
                              <option value="fixed_email">כתובת קבועה</option>
                              <option value="custom_field">
                                שדה מותאם אישית
                              </option>
                            </select>
                          </label>
                          <p className="af-wa-recipient__hint">
                            נמען:{" "}
                            {GMAIL_RECIPIENT_LABELS[
                              String(
                                selectedNode.data?.recipientType || "lead_email"
                              )
                            ] || "—"}
                          </p>
                          {String(selectedNode.data?.recipientType || "") ===
                          "fixed_email" ? (
                            <label>
                              כתובת קבועה
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
                              שדה מותאם (מפתח)
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
                                    GMAIL_RECIPIENT_LABELS[type] || "\u2014";
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
                    <div className="af-wa-banner" dir="rtl">
                      <strong>Google Calendar</strong>
                      <p>
                        {triggerSupportsAppointmentCustomerEmail(
                          selectedTriggerKey
                        )
                          ? "פרטי האירוע יילקחו מהפגישה (תאריך, שעה, משך, משתתף ומיקום)."
                          : "האירוע נוצר ביומן Google של העסק. ניתן להזין זמנים ידנית או להשאיר ריק כאשר יש פגישה בהקשר."}
                      </p>
                    </div>
                    {calendarLoading ? (
                      <p className="af-wa-template__state">
                        טוען סטטוס Google Calendar...
                      </p>
                    ) : !calendarStatus?.available ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {calendarMessage ||
                            "Google Calendar אינו זמין לעסק זה כרגע"}
                        </p>
                      </div>
                    ) : !calendarStatus?.calendar?.connected ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {calendarStatus?.calendar?.needsGrant
                            ? "יש לאשר הרשאת Calendar (Gmail כבר מחובר)"
                            : "יש לחבר Google Calendar לפני פרסום האוטומציה"}
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
                                throw new Error("לא התקבל קישור התחברות");
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(
                                  error,
                                  "התחברות Google Calendar נכשלה"
                                )
                              );
                            }
                          }}
                        >
                          {calendarStatus?.calendar?.needsGrant
                            ? "Grant Calendar access"
                            : "חיבור Google Calendar"}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir="rtl">
                          <label>
                            חשבון Google
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
                              כותרת
                              <input
                                type="text"
                                disabled={readOnly}
                                value={String(
                                  selectedNode.data?.title ||
                                    selectedNode.data?.summary ||
                                    ""
                                )}
                                placeholder="פגישה עם {{appointment.clientName}}"
                                onChange={(e) =>
                                  updateSelectedData({ title: e.target.value })
                                }
                              />
                            </label>
                            <label>
                              תיאור
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
                                    dir="rtl"
                                    style={{ marginTop: 8 }}
                                  >
                                    <p style={{ margin: 0 }}>
                                      פרטי האירוע יילקחו מהפגישה
                                    </p>
                                  </div>
                                ) : null}
                                <label
                                  className="af-checkbox"
                                  dir="rtl"
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
                                  הגדר פרטי אירוע ידנית
                                </label>
                              </>
                            ) : null}
                            {(String(selectedNode.data?.actionKey) !==
                              "google_calendar_create_event" ||
                              selectedNode.data?.manualEventDetails ===
                                true) && (
                              <>
                                <label>
                                  התחלה (אופציונלי — ברירת מחדל מפגישה)
                                  <input
                                    type="text"
                                    dir="ltr"
                                    disabled={readOnly}
                                    value={String(
                                      selectedNode.data?.start || ""
                                    )}
                                    placeholder="YYYY-MM-DD HH:mm או ריק"
                                    onChange={(e) =>
                                      updateSelectedData({
                                        start: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  סיום (אופציונלי)
                                  <input
                                    type="text"
                                    dir="ltr"
                                    disabled={readOnly}
                                    value={String(selectedNode.data?.end || "")}
                                    placeholder="YYYY-MM-DD HH:mm או ריק"
                                    onChange={(e) =>
                                      updateSelectedData({
                                        end: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                                <label>
                                  משך בדקות (אם אין סיום)
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
                                  משתתף (אימייל)
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
                                  מיקום
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
                    <div className="af-wa-banner" dir="rtl">
                      <strong>שליחה דרך Outlook / Microsoft 365 המחובר</strong>
                      <p>
                        המייל יישלח מחשבון Outlook שחיברתם לעסק. אין שימוש ב-SMTP
                        ואין fallback לספק אחר.
                      </p>
                    </div>

                    {outlookLoading ? (
                      <p className="af-wa-template__state">טוען סטטוס Outlook...</p>
                    ) : !outlookAvailable ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {outlookMessage ||
                            "Outlook / Microsoft 365 יהיה זמין בקרוב"}
                        </p>
                      </div>
                    ) : outlookAccount?.connectionStatus !== "connected" ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {outlookMessage ||
                            "יש לחבר חשבון Outlook לפני פרסום האוטומציה"}
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
                                throw new Error("לא התקבל קישור התחברות");
                              }
                              window.location.href = data.url;
                            } catch (error: unknown) {
                              toast.error(
                                readErrorMessage(error, "התחברות Outlook נכשלה")
                              );
                            }
                          }}
                        >
                          חיבור Outlook
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="af-wa-sender" dir="rtl">
                          <label>
                            שולח
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

                        <div className="af-wa-recipient" dir="rtl">
                          <label>
                            למי לשלוח את המייל?
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
                              <option value="lead_email">אימייל הליד</option>
                              {triggerSupportsAppointmentCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "appointment_customer_email" ? (
                                <option value="appointment_customer_email">
                                  אימייל הלקוח שקבע תור
                                </option>
                              ) : null}
                              {triggerSupportsStoreCustomerEmail(
                                selectedTriggerKey
                              ) ||
                              String(
                                selectedNode.data?.recipientType || ""
                              ) === "store_customer_email" ? (
                                <option value="store_customer_email">
                                  אימייל הלקוח בהזמנה
                                </option>
                              ) : null}
                              <option value="business_owner">בעל העסק</option>
                              <option value="lead_owner">אחראי הליד</option>
                              <option value="fixed_email">כתובת קבועה</option>
                              <option value="custom_field">
                                שדה מותאם אישית
                              </option>
                            </select>
                          </label>
                          <p className="af-wa-recipient__hint">
                            נמען:{" "}
                            {GMAIL_RECIPIENT_LABELS[
                              String(
                                selectedNode.data?.recipientType || "lead_email"
                              )
                            ] || "—"}
                          </p>
                          {String(selectedNode.data?.recipientType || "") ===
                          "fixed_email" ? (
                            <label>
                              כתובת קבועה
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
                              שדה מותאם (מפתח)
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
                                    GMAIL_RECIPIENT_LABELS[type] || "\u2014";
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
                  <div className="af-wa-template" dir="rtl">
                    <div className="af-wa-banner">
                      <strong>מאת</strong>
                      <p>המייל יישלח מכתובת עסקית מאומתת של העסק.</p>
                    </div>
                    {emailSenders.length ? (
                      <label>
                        מאת
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
                          <option value="">בחרו מייל עסקי מאומת</option>
                          {emailSenders.map((sender) => (
                            <option key={sender.senderId} value={sender.senderId}>
                              {`${String(sender.displayName || "").replace(/[<>]/g, "").trim() || sender.email} — ${sender.email}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>לא הוגדר מייל עסקי מאומת</p>
                        <p>
                          כדי לשלוח מהמייל העסקי של העסק, יש להשלים קודם את הגדרת
                          המייל ואימותו.
                        </p>
                        <a href={`/business/${businessId}/dashboard/integrations#email-senders`}>
                          הגדרת מייל עסקי
                        </a>
                      </div>
                    )}
                    <div className="af-wa-recipient" dir="rtl">
                      <label>
                        אל
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
                          <option value="lead_email">אימייל הליד</option>
                          {triggerSupportsAppointmentCustomerEmail(
                            selectedTriggerKey
                          ) ||
                          String(selectedNode.data?.recipientType || "") ===
                            "appointment_customer_email" ? (
                            <option value="appointment_customer_email">
                              אימייל הלקוח שקבע תור
                            </option>
                          ) : null}
                          {triggerSupportsStoreCustomerEmail(
                            selectedTriggerKey
                          ) ||
                          String(selectedNode.data?.recipientType || "") ===
                            "store_customer_email" ? (
                            <option value="store_customer_email">
                              אימייל הלקוח בהזמנה
                            </option>
                          ) : null}
                          <option value="business_owner">בעל העסק</option>
                          <option value="lead_owner">אחראי הליד</option>
                          <option value="fixed_email">כתובת קבועה</option>
                          <option value="custom_field">שדה מותאם אישית</option>
                        </select>
                      </label>
                      {String(selectedNode.data?.recipientType || "") ===
                      "fixed_email" ? (
                        <label>
                          כתובת קבועה
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
                          שדה מותאם (מפתח)
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
                        if (!sender) return "לא הוגדר מייל שולח";
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
                        const base = GMAIL_RECIPIENT_LABELS[type] || "—";
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
