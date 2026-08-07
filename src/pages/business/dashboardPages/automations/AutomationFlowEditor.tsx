import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
import { toast } from "react-toastify";
import {
  ArrowRight,
  Loader2,
  Save,
  Trash2,
  Play,
  Pause,
  FlaskConical,
  Plus,
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
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
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
  business_owner: "בעל העסק",
  lead_owner: "אחראי הליד",
  fixed_email: "כתובת קבועה",
  custom_field: "שדה מותאם אישית",
};

function triggerSupportsAppointmentCustomerEmail(triggerKey: string) {
  const key = String(triggerKey || "");
  return key === "appointment_created" || key === "appointment_reminder";
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
  ACTION_OPTIONS,
  CONDITION_OPTIONS,
  DELAY_UNITS,
  FILTER_CHIPS,
  FLOW_ACTION_PALETTE,
  QUICK_ADD_AFTER,
  TRIGGER_CATEGORY_LABELS,
  TYPE_META,
  buildPaletteWithTriggers,
  clampRouteCount,
  defaultSourceHandle,
  ensureRouterPaths,
  findTriggerOption,
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
  if (handle.startsWith("route_")) return `ניתוב ${handle.split("_")[1]}`;
  if (handle.startsWith("path_")) return `מסלול ${handle.split("_")[1]}`;
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
  const [name, setName] = useState(workflow.name);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [testOpen, setTestOpen] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [testing, setTesting] = useState(false);
  const [filter, setFilter] = useState<PaletteFilter>("all");
  const [waConnected, setWaConnected] = useState(false);
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
  const selectedIdRef = useRef<string | null>(null);
  const savingRef = useRef(false);
  const dirty =
    name !== workflow.name ||
    serializeFlowNodes(nodes) !== serializeFlowNodes(workflow.nodes || []) ||
    serializeFlowEdges(edges) !== serializeFlowEdges(workflow.edges || []);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // If the selected module was removed, clear selection; otherwise keep the
  // inspector pinned even when React Flow briefly reports an empty selection
  // (pane click, remount after autosave, hydrate effects).
  useEffect(() => {
    if (!selectedId) return;
    if (!nodes.some((n) => n.id === selectedId)) {
      setSelectedId(null);
    }
  }, [nodes, selectedId]);

  const loadApprovedWhatsAppTemplates = useCallback(async () => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const [status, approved] = await Promise.all([
        getWhatsAppIntegrationStatus(businessId, {
          senderMode: "bizuply_managed",
        }),
        listApprovedWhatsAppTemplates(businessId, {
          senderMode: "bizuply_managed",
        }),
      ]);
      setWaConnected(Boolean(status.connected || approved.connected));
      setWaLastSyncAt(
        approved.lastTemplatesSyncAt ||
          status.lastTemplatesSyncAt ||
          status.managedStatus?.lastTemplatesSyncAt ||
          null
      );
      setWaTemplates(approved.templates || []);
      if (!approved.connected && approved.message) {
        setWaSyncError(approved.message);
      }
    } catch (error: unknown) {
      setWaTemplates([]);
      setWaSyncError(readErrorMessage(error, "לא הצלחנו לטעון תבניות WhatsApp"));
    } finally {
      setWaLoading(false);
    }
  }, [businessId]);

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
      return prev.map((n) => {
        if (n.id !== selectedId) return n;
        const nextData = {
          ...(n.data || {}),
          ...(needsRecipientDefault ? { recipientType: "lead_email" } : {}),
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
      return prev.map((n) => {
        if (n.id !== selectedId) return n;
        const nextData = {
          ...(n.data || {}),
          emailProvider: "microsoft",
          ...(needsRecipientDefault ? { recipientType: "lead_email" } : {}),
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
      }
    ) => {
      if (item.supported === false) {
        toast.info("אפשרות זו תתווסף בקרוב");
        return;
      }
      const afterId = options?.afterNodeId ?? selectedId;
      const autoConnect = options?.autoConnect !== false;
      const afterNode = afterId
        ? nodes.find((n) => n.id === afterId) || null
        : null;

      const id = newId(item.type);
      const position =
        options?.position ||
        (afterNode
          ? {
              x: afterNode.position.x + 280,
              y: afterNode.position.y + (item.type === "router" ? -40 : 0),
            }
          : { x: 120 + nodes.length * 40, y: 160 + nodes.length * 24 });

      const newNode: Node = {
        id,
        type: item.type,
        position,
        data: { ...item.defaults },
      };

      setNodes((prev) => [...prev, newNode]);

      if (autoConnect && afterNode && item.type !== "trigger") {
        const sourceHandle = pickOutgoingHandle(afterNode, edges);
        const outgoing = edges.filter(
          (e) =>
            e.source === afterNode.id &&
            (e.sourceHandle || "out") === sourceHandle
        );
        const newSourceHandle = defaultSourceHandle(
          item.type,
          item.defaults as Record<string, unknown>
        );

        setEdges((prev) => {
          let next = prev.filter(
            (e) =>
              !(
                e.source === afterNode.id &&
                (e.sourceHandle || "out") === sourceHandle
              )
          );
          next = [
            ...next,
            styleEdge({
              id: newId("e"),
              source: afterNode.id,
              target: id,
              sourceHandle,
            }),
          ];

          // Insert: reconnect previous targets through the new module
          outgoing.forEach((oldEdge, index) => {
            const handles = listSourceHandles(
              item.type,
              item.defaults as Record<string, unknown>
            );
            const outHandle = handles[Math.min(index, handles.length - 1)];
            next.push(
              styleEdge({
                id: newId("e"),
                source: id,
                target: oldEdge.target,
                sourceHandle: outHandle || newSourceHandle,
              })
            );
          });

          return next;
        });

        toast.success(
          outgoing.length
            ? "נוסף וחובר אוטומטית (כולל המשך הזרימה)"
            : "נוסף וחובר אוטומטית למודול שנבחר"
        );
      } else if (item.type === "trigger") {
        toast.success("טריגר נוסף — אפשר לחבר ממנו כמה ניתובים");
      } else {
        toast.success("מודול נוסף ללוח");
      }

      setSelectedId(id);
      window.setTimeout(() => {
        try {
          fitView({ padding: 0.2, duration: 280 });
        } catch {
          /* ignore */
        }
      }, 40);
    },
    [edges, fitView, nodes, selectedId, setEdges, setNodes]
  );

  const onDragStart = (event: React.DragEvent, item: PaletteItem) => {
    event.dataTransfer.setData(
      "application/bizuply-automation-node",
      JSON.stringify(item)
    );
    event.dataTransfer.effectAllowed = "move";
  };

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

  const deleteSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setEdges((prev) =>
      prev.filter((e) => e.source !== selectedId && e.target !== selectedId)
    );
    setSelectedId(null);
  };

  const applyGmailPublishDefaults = (list: Node[]) =>
    list.map((n) => {
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
          ...(recipientType ? {} : { recipientType: "lead_email" }),
          emailProvider: isOutlookActionKey(n.data?.actionKey)
            ? "microsoft"
            : "gmail",
        },
      };
    });

  const handleSave = async (
    quiet = false,
    nodesOverride?: Node[]
  ): Promise<boolean> => {
    if (readOnly) {
      if (!quiet) toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return false;
    }
    const nodesToPersist = applyGmailPublishDefaults(nodesOverride || nodes);
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
        edges: edges.map((e) => ({
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
        const msg = result.errors.join(" · ");
        setPublishError(msg);
        toast.error(msg);
        selectNodeFromPublishErrors(result.errors);
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
          response?: { data?: { errors?: string[]; error?: string } };
        }
      )?.response?.data;
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

  const selectedRouter =
    selectedNode?.type === "router"
      ? ensureRouterPaths((selectedNode.data || {}) as Record<string, unknown>)
      : null;

  return (
    <div className="af-editor" dir="rtl">
      <aside className="af-palette">
        <div className="af-palette__head">
          <strong>מודולים</strong>
          <p>
            לחצו להוספה — אם בחרתם מודול על הבד, החדש יתחבר אליו אוטומטית
          </p>
        </div>

        <div className="af-filter-row" role="tablist" aria-label="סינון מודולים">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              role="tab"
              aria-selected={filter === chip.key}
              className={[
                "af-filter-chip",
                filter === chip.key ? "af-filter-chip--active" : "",
              ].join(" ")}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {triggerCatalogLoading ? (
          <p className="af-palette__hint">טוען טריגרים מהשרת...</p>
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

        <div className="af-palette__group">
          {filteredPalette.map((item) => (
            <button
              key={`${item.type}-${item.key}`}
              type="button"
              className="af-palette__item"
              draggable={!readOnly && item.supported !== false}
              disabled={readOnly || item.supported === false}
              title={writeBlockedTitle}
              onDragStart={(e) => onDragStart(e, item)}
              onClick={() =>
                insertModule(item, {
                  afterNodeId: selectedId,
                  autoConnect: true,
                })
              }
              style={{ borderInlineStart: `4px solid ${item.color}` }}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
              {item.supported === false ? <em className="af-palette__hint">בקרוב</em> : null}
              <em className="af-palette__hint">
                {selectedId && item.type !== "trigger"
                  ? "לחיצה = הוספה + חיבור אוטומטי"
                  : "לחיצה להוספה · אפשר גם לגרור"}
              </em>
            </button>
          ))}
        </div>
      </aside>

      <div className="af-canvas-wrap">
        <div className="af-toolbar">
          <button type="button" className="af-toolbar__btn" onClick={onBack}>
            <ArrowRight size={14} />
            חזרה לרשימה
          </button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="af-toolbar__btn af-toolbar__name"
            aria-label="שם האוטומציה"
            disabled={readOnly}
            title={writeBlockedTitle}
          />
          <button
            type="button"
            className="af-btn af-btn--primary"
            disabled={saving || readOnly}
            title={writeBlockedTitle}
            onClick={() => handleSave()}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            שמירה
          </button>
          <button
            type="button"
            className="af-btn af-btn--primary"
            disabled={publishing || readOnly || workflow.status === "archived"}
            title={
              writeBlockedTitle ||
              (workflow.status === "archived"
                ? "לא ניתן לפרסם אוטומציה בארכיון"
                : triggerCatalogError
                  ? "יש לטעון מחדש את קטלוג הטריגרים"
                  : hasUnsupportedTrigger
                    ? "טריגר ישן או לא נתמך"
                    : workflow.status === "active"
                      ? "עדכון הגרסה המפורסמת לפי הטיוטה הנוכחית"
                      : "פרסום האוטומציה")
            }
            onClick={() => void handlePublish()}
          >
            {publishing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            {publishing
              ? "מפרסם…"
              : workflow.status === "active" || workflow.publishedVersionId
                ? "עדכון פרסום"
                : "פרסום"}
          </button>
          {workflow.status === "active" ? (
            <button
              type="button"
              className="af-toolbar__btn"
              disabled={readOnly}
              title={writeBlockedTitle}
              onClick={async () =>
                onSaved(await pauseAutomationWorkflow(businessId, workflow._id))
              }
            >
              <Pause size={14} />
              השהיה
            </button>
          ) : workflow.status === "paused" ? (
            <button
              type="button"
              className="af-toolbar__btn"
              disabled={readOnly}
              title={writeBlockedTitle}
              onClick={async () =>
                onSaved(await resumeAutomationWorkflow(businessId, workflow._id))
              }
            >
              <Play size={14} />
              המשך
            </button>
          ) : null}
          <button
            type="button"
            className="af-toolbar__btn"
            disabled={readOnly}
            title={writeBlockedTitle}
            onClick={() => setTestOpen((open) => !open)}
          >
            <FlaskConical size={14} />
            בדיקה
          </button>
          <span className="af-toolbar__state">{dirty ? "יש שינויים שלא פורסמו" : saveState === "saved" ? "נשמר" : workflow.publishedVersionId ? "פורסם" : "טיוטה"}{workflow.publishedAt ? ` · ${new Date(workflow.publishedAt).toLocaleDateString("he-IL")}` : ""}</span>
        </div>

        {publishError ? (
          <div className="af-publish-error" role="alert">
            <strong>הפרסום נכשל</strong>
            <span>{publishError}</span>
          </div>
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

        {selectedNode && selectedNode.type !== "trigger" ? (
          <div className="af-quickbar">
            <span>הוסף אחרי המודול שנבחר:</span>
            {QUICK_ADD_AFTER.map((item) => (
              <button
                key={`quick-${item.key}`}
                type="button"
                className="af-quickbar__btn"
                onClick={() =>
                  insertModule(item, {
                    afterNodeId: selectedNode.id,
                    autoConnect: true,
                  })
                }
              >
                <Plus size={12} />
                {item.filter === "router"
                  ? "פיצול"
                  : item.filter === "condition"
                    ? "תנאי"
                    : item.filter === "delay"
                      ? "המתנה"
                      : item.defaults.label
                        ? String(item.defaults.label).slice(0, 12)
                        : item.label}
              </button>
            ))}
          </div>
        ) : selectedNode?.type === "trigger" ? (
          <div className="af-quickbar">
            <span>הוסף אחרי הטריגר (יתחבר אוטומטית):</span>
            {QUICK_ADD_AFTER.map((item) => (
              <button
                key={`quick-t-${item.key}`}
                type="button"
                className="af-quickbar__btn"
                onClick={() =>
                  insertModule(item, {
                    afterNodeId: selectedNode.id,
                    autoConnect: true,
                  })
                }
              >
                <Plus size={12} />
                {item.filter === "router"
                  ? "פיצול"
                  : item.filter === "condition"
                    ? "תנאי"
                    : item.filter === "delay"
                      ? "המתנה"
                      : String(item.defaults.label || item.label).slice(0, 12)}
              </button>
            ))}
          </div>
        ) : (
          <div className="af-quickbar af-quickbar--hint">
            בחרו מודול על הבד (למשל המתנה) ואז לחצו ״פיצול״ / תנאי / פעולה —
            זה יתחבר לבד
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          nodeTypes={automationNodeTypes}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          onNodeClick={(_, node) => {
            setSelectedId(node.id);
          }}
          onSelectionChange={({ nodes: selected }) => {
            // Keep the last selected module when the canvas selection clears
            // (empty pane click / remount). Only switch when a node is chosen.
            const nextId = selected[0]?.id;
            if (nextId) setSelectedId(nextId);
          }}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable
          fitView
          deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
          proOptions={{ hideAttribution: true }}
          connectionLineStyle={{ stroke: "#7c3aed", strokeWidth: 2 }}
          defaultEdgeOptions={{
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#94a3b8"
          />
          <Controls position="bottom-left" />
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            nodeStrokeColor={(n) =>
              TYPE_META[(n.type as keyof typeof TYPE_META) || "action"]?.color ||
              "#94a3b8"
            }
            nodeColor={(n) =>
              TYPE_META[(n.type as keyof typeof TYPE_META) || "action"]?.accent ||
              "#e2e8f0"
            }
          />
        </ReactFlow>
      </div>

      <aside className="af-inspector">
        <h3>הגדרות מודול</h3>
        {!selectedNode ? (
          <div className="af-inspector__hint">
            <p>
              <strong>איך מוסיפים פיצול אחרי המתנה?</strong>
            </p>
            <ol>
              <li>לוחצים על מודול ההמתנה על הבד</li>
              <li>לוחצים למעלה על ״פיצול״ או על ״ניתוב״ בפלטה</li>
              <li>זה מתווסף ומתחבר אוטומטית — כולל המשך הזרימה הקיימת</li>
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
                <label>
                  סוג טריגר
                  {triggerCatalogLoading ? (
                    <p className="af-wa-template__state">טוען קטלוג טריגרים...</p>
                  ) : triggerCatalogError ? (
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
                  ) : (
                    <select
                      value={String(selectedNode.data?.triggerKey || "")}
                      disabled={readOnly}
                      onChange={(e) => {
                        const opt = findTriggerOption(
                          triggerCatalog,
                          e.target.value
                        );
                        if (!opt?.isPublishable) return;
                        updateSelectedData({
                          triggerKey: opt.key,
                          label: opt.label,
                        });
                      }}
                    >
                      {!findTriggerOption(
                        triggerCatalog,
                        String(selectedNode.data?.triggerKey || "")
                      ) && selectedNode.data?.triggerKey ? (
                        <option
                          value={String(selectedNode.data.triggerKey)}
                          disabled
                        >
                          {String(selectedNode.data.triggerKey)} · טריגר ישן או
                          לא נתמך
                        </option>
                      ) : null}
                      {!selectedNode.data?.triggerKey ? (
                        <option value="" disabled>
                          בחרו טריגר
                        </option>
                      ) : null}
                      {triggerCatalog.map((o) => (
                        <option
                          key={o.key}
                          value={o.key}
                          disabled={!o.isPublishable}
                        >
                          {(TRIGGER_CATEGORY_LABELS[o.category || ""]
                            ? `${TRIGGER_CATEGORY_LABELS[o.category || ""]} · `
                            : "") +
                            o.label}
                          {!o.isPublishable ? " · בקרוב" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
                {selectedNode.data?.triggerKey &&
                !triggerCatalogLoading &&
                !triggerCatalogError &&
                !findTriggerOption(
                  triggerCatalog,
                  String(selectedNode.data.triggerKey)
                ) ? (
                  <p className="af-wa-template__state af-wa-template__state--error">
                    טריגר ישן או לא נתמך
                  </p>
                ) : null}
                {findTriggerOption(
                  triggerCatalog,
                  String(selectedNode.data?.triggerKey || "")
                )?.requiredConnection ? (
                  <p className="af-wa-template__state af-wa-template__state--error">
                    חסר חיבור:{" "}
                    {
                      findTriggerOption(
                        triggerCatalog,
                        String(selectedNode.data?.triggerKey || "")
                      )?.requiredConnection
                    }
                  </p>
                ) : null}
                <label>
                  מספר ניתובים מהטריגר
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={clampRouteCount(selectedNode.data?.routeCount, 2)}
                    onChange={(e) =>
                      updateSelectedData({
                        routeCount: clampRouteCount(e.target.value, 2),
                      })
                    }
                  />
                </label>
              </>
            ) : null}

            {selectedNode.type === "router" && selectedRouter ? (
              <>
                <label>
                  מספר מסלולים
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={selectedRouter.pathCount}
                    onChange={(e) => {
                      const next = ensureRouterPaths({
                        ...selectedNode.data,
                        pathCount: clampRouteCount(e.target.value, 3),
                      });
                      updateSelectedData(next);
                    }}
                  />
                </label>
                {selectedRouter.paths.map((path, index) => (
                  <label key={path.id}>
                    שם מסלול {index + 1}
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
                      const opt = ACTION_OPTIONS.find(
                        (o) => o.value === e.target.value
                      );
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
                    {ACTION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} disabled={o.supported === false}>
                        {o.label}{o.supported === false ? " · בקרוב" : ""}
                      </option>
                    ))}
                  </select>
                </label>
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
                              (String(
                                selectedNode.data?.metaTemplateName || ""
                              ).toLowerCase() === "new_lead_received"
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
                              (String(
                                selectedNode.data?.metaTemplateName || ""
                              ).toLowerCase() === "new_lead_received"
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
                        onClick={() => void loadApprovedWhatsAppTemplates()}
                      >
                        {waLoading ? (
                          <>
                            <Loader2 size={14} className="af-spin" />
                            טוען תבניות...
                          </>
                        ) : (
                          "רענון תבניות"
                        )}
                      </button>
                    </div>

                    {waLoading ? (
                      <p className="af-wa-template__state">
                        טוען תבניות מאושרות...
                      </p>
                    ) : !waConnected ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>
                          {waSyncError ||
                            "חיבור WhatsApp המנוהל של BizUply אינו מוכן כרגע"}
                        </p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          onClick={() => void loadApprovedWhatsAppTemplates()}
                        >
                          נסיון חוזר
                        </button>
                      </div>
                    ) : waSyncError && waTemplates.length === 0 ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>{waSyncError}</p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          onClick={() => void loadApprovedWhatsAppTemplates()}
                        >
                          נסיון חוזר
                        </button>
                      </div>
                    ) : waTemplates.length === 0 ? (
                      <p className="af-wa-template__state">
                        לא נמצאו תבניות מאושרות בקטלוג המנוהל של BizUply
                      </p>
                    ) : (
                      <>
                        <label>
                          בחירת תבנית
                          <select
                            value={String(selectedNode.data?.templateId || "")}
                            disabled={readOnly}
                            onChange={(e) => {
                              const tpl =
                                waTemplates.find(
                                  (row) => row._id === e.target.value
                                ) || null;
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
                              // Rebuild strictly from Meta template variables.
                              const componentMappings =
                                buildMappingsFromTemplate(tpl, []);
                              const isBusinessAlert =
                                String(tpl.metaTemplateName || "")
                                  .toLowerCase() === "new_lead_received";
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
                          >
                            <option value="">בחרו תבנית</option>
                            {waTemplates.map((tpl) => (
                              <option key={tpl._id} value={tpl._id}>
                                {(tpl.friendlyName || tpl.name) +
                                  (tpl.isTestTemplate
                                    ? " · תבנית בדיקה"
                                    : "") +
                                  ` · ${tpl.metaTemplateName} · ${
                                    tpl.displaySecondary ||
                                    `${tpl.languageLabelHe || tpl.language} · ${
                                      tpl.categoryLabelHe || ""
                                    } · מאושרת`
                                  }`}
                              </option>
                            ))}
                          </select>
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
                                {selectedTpl.friendlyName || selectedTpl.name}
                              </strong>
                              <code dir="ltr">
                                {selectedTpl.metaTemplateName}
                              </code>
                              <span>
                                {selectedTpl.displaySecondary ||
                                  `${selectedTpl.languageLabelHe || selectedTpl.language} · ${
                                    selectedTpl.categoryLabelHe || ""
                                  } · מאושרת`}
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

                        <label>
                          נושא
                          <input
                            type="text"
                            disabled={readOnly}
                            value={String(selectedNode.data?.subject || "")}
                            placeholder="הודעה מ{{business.name}}"
                            onChange={(e) =>
                              updateSelectedData({ subject: e.target.value })
                            }
                          />
                        </label>

                        <label>
                          תוכן (HTML)
                          <textarea
                            rows={6}
                            disabled={readOnly}
                            value={String(
                              selectedNode.data?.html ||
                                selectedNode.data?.body ||
                                ""
                            )}
                            placeholder='<div dir="rtl"><p>שלום {{lead.name}}</p></div>'
                            onChange={(e) =>
                              updateSelectedData({
                                html: e.target.value,
                                body: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          טקסט פשוט (אופציונלי)
                          <textarea
                            rows={3}
                            disabled={readOnly}
                            value={String(selectedNode.data?.text || "")}
                            placeholder="גרסת טקסט ללא HTML"
                            onChange={(e) =>
                              updateSelectedData({ text: e.target.value })
                            }
                          />
                        </label>

                        {(() => {
                          const previewHtml = String(
                            selectedNode.data?.html ||
                              selectedNode.data?.body ||
                              ""
                          ).trim();
                          const previewText = String(
                            selectedNode.data?.text || ""
                          ).trim();
                          return (
                            <div className="af-gmail-preview" dir="rtl">
                              <strong>תצוגה מקדימה</strong>
                              <div className="af-gmail-preview__headers">
                                <span>
                                  מ: Gmail —{" "}
                                  {String(
                                    gmailAccount.email ||
                                      selectedNode.data?.senderEmail ||
                                      "—"
                                  )}
                                </span>
                                <span>
                                  אל:{" "}
                                  {GMAIL_RECIPIENT_LABELS[
                                    String(
                                      selectedNode.data?.recipientType ||
                                        "lead_email"
                                    )
                                  ] || "—"}
                                  {String(
                                    selectedNode.data?.recipientType || ""
                                  ) === "fixed_email" &&
                                  selectedNode.data?.fixedEmail
                                    ? ` (${String(selectedNode.data.fixedEmail)})`
                                    : ""}
                                  {String(
                                    selectedNode.data?.recipientType || ""
                                  ) === "custom_field" &&
                                  selectedNode.data?.customField
                                    ? ` (${String(selectedNode.data.customField)})`
                                    : ""}
                                </span>
                                <span>
                                  נושא:{" "}
                                  {String(
                                    selectedNode.data?.subject || ""
                                  ).trim() || "—"}
                                </span>
                              </div>
                              {!previewHtml && !previewText ? (
                                <div className="af-gmail-preview__empty">
                                  אין עדיין תוכן להצגה
                                </div>
                              ) : (
                                <>
                                  {previewHtml ? (
                                    <div
                                      className="af-gmail-preview__body"
                                      dangerouslySetInnerHTML={{
                                        __html: previewHtml,
                                      }}
                                    />
                                  ) : null}
                                  {previewText ? (
                                    <pre className="af-gmail-preview__text">
                                      {previewText}
                                    </pre>
                                  ) : null}
                                </>
                              )}
                            </div>
                          );
                        })()}
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

                        <label>
                          נושא
                          <input
                            type="text"
                            disabled={readOnly}
                            value={String(selectedNode.data?.subject || "")}
                            placeholder="הודעה מ{{business.name}}"
                            onChange={(e) =>
                              updateSelectedData({ subject: e.target.value })
                            }
                          />
                        </label>

                        <label>
                          תוכן (HTML)
                          <textarea
                            rows={6}
                            disabled={readOnly}
                            value={String(
                              selectedNode.data?.html ||
                                selectedNode.data?.body ||
                                ""
                            )}
                            placeholder='<div dir="rtl"><p>שלום {{lead.name}}</p></div>'
                            onChange={(e) =>
                              updateSelectedData({
                                html: e.target.value,
                                body: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          טקסט פשוט (אופציונלי)
                          <textarea
                            rows={3}
                            disabled={readOnly}
                            value={String(selectedNode.data?.text || "")}
                            placeholder="גרסת טקסט ללא HTML"
                            onChange={(e) =>
                              updateSelectedData({ text: e.target.value })
                            }
                          />
                        </label>

                        {(() => {
                          const previewHtml = String(
                            selectedNode.data?.html ||
                              selectedNode.data?.body ||
                              ""
                          ).trim();
                          const previewText = String(
                            selectedNode.data?.text || ""
                          ).trim();
                          return (
                            <div className="af-gmail-preview" dir="rtl">
                              <strong>תצוגה מקדימה</strong>
                              <div className="af-gmail-preview__headers">
                                <span>
                                  מ: Outlook —{" "}
                                  {String(
                                    outlookAccount.email ||
                                      selectedNode.data?.senderEmail ||
                                      "—"
                                  )}
                                </span>
                                <span>
                                  אל:{" "}
                                  {GMAIL_RECIPIENT_LABELS[
                                    String(
                                      selectedNode.data?.recipientType ||
                                        "lead_email"
                                    )
                                  ] || "—"}
                                </span>
                                <span>
                                  נושא:{" "}
                                  {String(
                                    selectedNode.data?.subject || ""
                                  ).trim() || "—"}
                                </span>
                              </div>
                              {!previewHtml && !previewText ? (
                                <div className="af-gmail-preview__empty">
                                  אין עדיין תוכן להצגה
                                </div>
                              ) : (
                                <>
                                  {previewHtml ? (
                                    <div
                                      className="af-gmail-preview__body"
                                      dangerouslySetInnerHTML={{
                                        __html: previewHtml,
                                      }}
                                    />
                                  ) : null}
                                  {previewText ? (
                                    <pre className="af-gmail-preview__text">
                                      {previewText}
                                    </pre>
                                  ) : null}
                                </>
                              )}
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}

            <button
              type="button"
              className="af-btn af-btn--danger"
              onClick={deleteSelected}
            >
              <Trash2 size={14} />
              מחק מודול
            </button>
          </>
        )}
      </aside>
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
