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
  Power,
  PowerOff,
} from "lucide-react";
import {
  saveAutomationWorkflow,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { listWhatsAppTemplates, type WhatsAppTemplate } from "../../../../api/whatsappApi";
import { automationNodeTypes } from "./FlowNodes";
import {
  ACTION_OPTIONS,
  CONDITION_OPTIONS,
  DELAY_UNITS,
  PALETTE,
  TRIGGER_OPTIONS,
  TYPE_META,
  type PaletteItem,
} from "./automationFlowTypes";

type Props = {
  businessId: string;
  workflow: AutomationWorkflow;
  onBack: () => void;
  onSaved: (workflow: AutomationWorkflow) => void;
};

function toFlowNodes(workflow: AutomationWorkflow): Node[] {
  return (workflow.nodes || []).map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position || { x: 0, y: 0 },
    data: { ...(n.data || {}) },
  }));
}

function toFlowEdges(workflow: AutomationWorkflow): Edge[] {
  return (workflow.edges || []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle || undefined,
    targetHandle: e.targetHandle || undefined,
    label: e.label || undefined,
    animated: true,
    style: { stroke: "#94a3b8", strokeWidth: 2 },
  }));
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function EditorInner({ businessId, workflow, onBack, onSaved }: Props) {
  const { screenToFlowPosition } = useReactFlow();
  const [name, setName] = useState(workflow.name);
  const [enabled, setEnabled] = useState(Boolean(workflow.enabled));
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(workflow));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(workflow));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listWhatsAppTemplates(businessId)
      .then((list) => {
        if (!cancelled) setTemplates(list || []);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) || null,
    [nodes, selectedId]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: newId("e"),
            animated: true,
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
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
    const id = newId(item.type);
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: item.type,
        position,
        data: { ...item.defaults },
      },
    ]);
    setSelectedId(id);
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

  const handleSave = async (nextEnabled = enabled) => {
    setSaving(true);
    try {
      const saved = await saveAutomationWorkflow(businessId, workflow._id, {
        name: name.trim() || workflow.name,
        enabled: nextEnabled,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: (n.type || "action") as AutomationWorkflow["nodes"][number]["type"],
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
      setEnabled(Boolean(saved.enabled));
      onSaved(saved);
      toast.success("האוטומציה נשמרה");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? String(
              (error as { response?: { data?: { error?: string } } }).response
                ?.data?.error || ""
            )
          : "";
      toast.error(message || "שגיאה בשמירת האוטומציה");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="af-editor" dir="rtl">
      <aside className="af-palette">
        <div className="af-palette__title">מודולים</div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#64748b" }}>
          גררו לבד הציור כמו ב־Make / n8n
        </p>
        {PALETTE.map((item) => (
          <button
            key={`${item.type}-${item.key}`}
            type="button"
            className="af-palette__item"
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            style={{ borderInlineStart: `4px solid ${item.color}` }}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
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
            className="af-toolbar__btn"
            style={{ minWidth: 180, fontWeight: 900 }}
            aria-label="שם האוטומציה"
          />
          <button
            type="button"
            className="af-btn af-btn--primary"
            disabled={saving}
            onClick={() => handleSave()}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            שמירה
          </button>
          <button
            type="button"
            className="af-toolbar__btn"
            disabled={saving}
            onClick={() => handleSave(!enabled)}
          >
            {enabled ? <PowerOff size={14} /> : <Power size={14} />}
            {enabled ? "כבה" : "הפעל"}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={automationNodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={({ nodes: selected }) => {
            setSelectedId(selected[0]?.id || null);
          }}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
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
          <p style={{ margin: 0, color: "#64748b", fontSize: 13, fontWeight: 600 }}>
            בחרו מודול בבד הציור או גררו מודול חדש מהצד.
          </p>
        ) : (
          <>
            <div
              className="af-pill af-pill--on"
              style={{
                width: "fit-content",
                background:
                  TYPE_META[selectedNode.type as keyof typeof TYPE_META]?.accent,
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
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
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
                      updateSelectedData({ amount: Number(e.target.value) || 1 })
                    }
                  />
                </label>
                <label>
                  יחידה
                  <select
                    value={String(selectedNode.data?.unit || "minutes")}
                    onChange={(e) => updateSelectedData({ unit: e.target.value })}
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
                  value={String(selectedNode.data?.conditionKey || "no_response")}
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
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                {String(selectedNode.data?.actionKey || "whatsapp_template") ===
                "whatsapp_template" ? (
                  <label>
                    תבנית וואטסאפ
                    <select
                      value={String(selectedNode.data?.templateId || "")}
                      onChange={(e) =>
                        updateSelectedData({ templateId: e.target.value })
                      }
                    >
                      <option value="">בחרו תבנית</option>
                      {templates.map((tpl) => (
                        <option key={tpl._id} value={tpl._id}>
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </label>
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
