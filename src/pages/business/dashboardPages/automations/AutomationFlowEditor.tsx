import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  isAutomationsReadOnly,
  type AutomationNodeType,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { Link } from "react-router-dom";
import {
  getWhatsAppIntegrationStatus,
  listApprovedWhatsAppTemplates,
  syncWhatsAppTemplates,
  type ApprovedWhatsAppTemplate,
  type WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";

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

function isWhatsAppActionKey(actionKey: unknown) {
  const key = String(actionKey || "");
  return key === "whatsapp_template" || key === "send_whatsapp";
}

function mappingPresetKey(row: WhatsAppVariableMapping) {
  const source = String(row.source || "");
  if (source === "constant" || source === "manual") return source;
  return `${source}:${String(row.field || "")}`;
}
import { automationNodeTypes } from "./FlowNodes";
import {
  ACTION_OPTIONS,
  CONDITION_OPTIONS,
  DELAY_UNITS,
  FILTER_CHIPS,
  PALETTE,
  QUICK_ADD_AFTER,
  TRIGGER_OPTIONS,
  TYPE_META,
  clampRouteCount,
  defaultSourceHandle,
  ensureRouterPaths,
  listSourceHandles,
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [testOpen, setTestOpen] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [testing, setTesting] = useState(false);
  const [filter, setFilter] = useState<PaletteFilter>("all");
  const [waConnected, setWaConnected] = useState(false);
  const [waTemplates, setWaTemplates] = useState<ApprovedWhatsAppTemplate[]>([]);
  const [waLoading, setWaLoading] = useState(false);
  const [waSyncing, setWaSyncing] = useState(false);
  const [waSyncError, setWaSyncError] = useState("");
  const [waLastSyncAt, setWaLastSyncAt] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(workflow));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(workflow));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dirty =
    name !== workflow.name ||
    JSON.stringify(nodes.map((node) => ({ id: node.id, type: node.type, position: node.position, data: node.data }))) !== JSON.stringify(workflow.nodes) ||
    JSON.stringify(edges.map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle || null, targetHandle: edge.targetHandle || null, label: typeof edge.label === "string" ? edge.label : "" }))) !== JSON.stringify(workflow.edges);

  const loadApprovedWhatsAppTemplates = useCallback(async () => {
    setWaLoading(true);
    setWaSyncError("");
    try {
      const [status, approved] = await Promise.all([
        getWhatsAppIntegrationStatus(businessId),
        listApprovedWhatsAppTemplates(businessId),
      ]);
      setWaConnected(Boolean(status.connected || approved.connected));
      setWaLastSyncAt(
        approved.lastTemplatesSyncAt || status.lastTemplatesSyncAt || null
      );
      setWaTemplates(approved.templates || []);
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

  const handleSyncWhatsAppTemplates = async () => {
    setWaSyncing(true);
    setWaSyncError("");
    try {
      const synced = await syncWhatsAppTemplates(businessId);
      setWaLastSyncAt(synced.lastTemplatesSyncAt || new Date().toISOString());
      await loadApprovedWhatsAppTemplates();
      toast.success("התבניות סונכרנו מ-Meta");
    } catch (error: unknown) {
      setWaSyncError(
        readErrorMessage(error, "לא הצלחנו לסנכרן את התבניות. נסו שוב")
      );
    } finally {
      setWaSyncing(false);
    }
  };

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
      const needsHydrate =
        !node.data?.metaTemplateName ||
        existing.length !== variables.length ||
        variables.some(
          (variable) =>
            !existing.some((row) => String(row.variable) === String(variable))
        );
      if (!needsHydrate) return prev;
      const componentMappings = variables.map((variable) => {
        const prevRow = existing.find(
          (row) => String(row.variable) === String(variable)
        );
        return (
          prevRow || {
            variable: String(variable),
            component: "body" as const,
            source: "",
            field: "",
            constantValue: "",
            required: true,
          }
        );
      });
      return prev.map((n) =>
        n.id === selectedId
          ? {
              ...n,
              data: {
                ...(n.data || {}),
                metaTemplateId: tpl.metaTemplateId || "",
                metaTemplateName: tpl.metaTemplateName || "",
                language: tpl.language || "",
                wabaId: tpl.wabaId || "",
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

  const filteredPalette = useMemo(() => {
    if (filter === "all") return PALETTE;
    return PALETTE.filter((p) => p.filter === filter);
  }, [filter]);

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

  const handleSave = async (quiet = false) => {
    if (readOnly) {
      if (!quiet) toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setSaving(true);
    setSaveState("saving");
    try {
      const saved = await saveAutomationWorkflow(businessId, workflow._id, {
        name: name.trim() || workflow.name,
        nodes: nodes.map((n) => ({
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
      setSaveState("saved");
      if (!quiet) toast.success("הטיוטה נשמרה");
    } catch (error: unknown) {
      toast.error(readErrorMessage(error, "שגיאה בשמירת האוטומציה"));
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

  const handlePublish = async () => {
    if (readOnly) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    setPublishing(true);
    try {
      if (dirty) await handleSave(true);
      const result = await publishAutomationWorkflow(businessId, workflow._id);
      if (result.errors?.length) {
        toast.error(result.errors.join(" · "));
        const nodeId = result.errors
          .join(" ")
          .match(/(?:node|מודול)[\s:]+([A-Za-z0-9_-]+)/i)?.[1];
        if (nodeId && nodes.some((node) => node.id === nodeId)) {
          setSelectedId(nodeId);
        }
        return;
      }
      onSaved(result.workflow);
      toast.success("האוטומציה פורסמה");
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { errors?: string[]; error?: string } } })?.response?.data;
      toast.error(
        response?.errors?.join(" · ") ||
          response?.error ||
          readErrorMessage(error, "לא ניתן לפרסם את האוטומציה")
      );
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
            disabled={
              publishing || saving || workflow.status === "archived" || readOnly
            }
            title={writeBlockedTitle}
            onClick={() => void handlePublish()}
          >
            <Play size={14} />
            פרסום
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
          onSelectionChange={({ nodes: selected }) => {
            setSelectedId(selected[0]?.id || null);
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
                  <select
                    value={String(selectedNode.data?.triggerKey || "new_lead")}
                    onChange={(e) => {
                      const opt = TRIGGER_OPTIONS.find(
                        (o) => o.value === e.target.value
                      );
                      updateSelectedData({
                        triggerKey: e.target.value,
                        label: opt?.label || selectedNode.data?.label,
                      });
                    }}
                  >
                    {TRIGGER_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} disabled={o.supported === false}>
                        {o.label}{o.supported === false ? " · בקרוב" : ""}
                      </option>
                    ))}
                  </select>
                </label>
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
                      updateSelectedData({
                        actionKey: e.target.value,
                        label: opt?.label || selectedNode.data?.label,
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
                    <div className="af-wa-template__head">
                      <span>תבנית WhatsApp</span>
                      {waConnected ? (
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          disabled={waSyncing || waLoading || readOnly}
                          onClick={() => void handleSyncWhatsAppTemplates()}
                        >
                          {waSyncing ? (
                            <>
                              <Loader2 size={14} className="af-spin" />
                              טוען תבניות מ-Meta...
                            </>
                          ) : (
                            "רענון תבניות מ-Meta"
                          )}
                        </button>
                      ) : null}
                    </div>

                    {!waConnected ? (
                      <div className="af-wa-template__state">
                        <p>יש לחבר חשבון WhatsApp לפני בחירת תבנית</p>
                        <Link
                          className="af-btn af-btn--primary"
                          to="../whatsapp/settings"
                        >
                          חיבור WhatsApp
                        </Link>
                      </div>
                    ) : waSyncing ? (
                      <p className="af-wa-template__state">
                        טוען תבניות מ-Meta...
                      </p>
                    ) : waSyncError ? (
                      <div className="af-wa-template__state af-wa-template__state--error">
                        <p>{waSyncError}</p>
                        <button
                          type="button"
                          className="af-toolbar__btn"
                          onClick={() => void handleSyncWhatsAppTemplates()}
                        >
                          נסיון חוזר
                        </button>
                      </div>
                    ) : !waLastSyncAt && waTemplates.length === 0 ? (
                      <div className="af-wa-template__state">
                        <p>יש לסנכרן את התבניות המאושרות מ-Meta</p>
                        <button
                          type="button"
                          className="af-btn af-btn--primary"
                          disabled={waSyncing || readOnly}
                          onClick={() => void handleSyncWhatsAppTemplates()}
                        >
                          רענון תבניות מ-Meta
                        </button>
                      </div>
                    ) : waTemplates.length === 0 ? (
                      <p className="af-wa-template__state">
                        לא נמצאו תבניות מאושרות בחשבון Meta של העסק
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
                              const variables = Array.isArray(tpl.variables)
                                ? tpl.variables
                                : [];
                              const existing = Array.isArray(
                                selectedNode.data?.componentMappings
                              )
                                ? (selectedNode.data
                                    .componentMappings as WhatsAppVariableMapping[])
                                : [];
                              const componentMappings = variables.map(
                                (variable) => {
                                  const prev = existing.find(
                                    (row) =>
                                      String(row.variable) === String(variable)
                                  );
                                  return (
                                    prev || {
                                      variable: String(variable),
                                      component: "body" as const,
                                      source: "",
                                      field: "",
                                      constantValue: "",
                                      required: true,
                                    }
                                  );
                                }
                              );
                              updateSelectedData({
                                templateId: tpl._id,
                                metaTemplateId: tpl.metaTemplateId || "",
                                metaTemplateName: tpl.metaTemplateName || "",
                                language: tpl.language || "",
                                wabaId: tpl.wabaId || "",
                                componentMappings,
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

                        {Array.isArray(selectedNode.data?.componentMappings) &&
                        (selectedNode.data.componentMappings as WhatsAppVariableMapping[])
                          .length > 0 ? (
                          <div className="af-wa-template__mappings">
                            <p>מיפוי משתנים</p>
                            {(
                              selectedNode.data
                                .componentMappings as WhatsAppVariableMapping[]
                            ).map((row, index) => (
                              <div
                                key={`${row.variable}-${index}`}
                                className="af-wa-template__map-row"
                              >
                                <label>
                                  <span dir="ltr">{`{{${row.variable}}}`}</span>
                                  <select
                                    value={mappingPresetKey(row)}
                                    disabled={readOnly}
                                    onChange={(e) => {
                                      const preset = WA_MAPPING_PRESETS.find(
                                        (p) => p.key === e.target.value
                                      );
                                      const next = (
                                        selectedNode.data
                                          .componentMappings as WhatsAppVariableMapping[]
                                      ).map((item, i) =>
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
                                      const next = (
                                        selectedNode.data
                                          .componentMappings as WhatsAppVariableMapping[]
                                      ).map((item, i) =>
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
                            ))}
                          </div>
                        ) : null}
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
