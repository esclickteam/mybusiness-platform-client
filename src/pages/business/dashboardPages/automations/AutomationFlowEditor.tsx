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
  Power,
  PowerOff,
  Plus,
} from "lucide-react";
import {
  saveAutomationWorkflow,
  type AutomationNodeType,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import {
  listWhatsAppTemplates,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
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
  onBack: () => void;
  onSaved: (workflow: AutomationWorkflow) => void;
};

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

function EditorInner({ businessId, workflow, onBack, onSaved }: Props) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [name, setName] = useState(workflow.name);
  const [enabled, setEnabled] = useState(Boolean(workflow.enabled));
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<PaletteFilter>("all");
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

  const handleSave = async (nextEnabled = enabled) => {
    setSaving(true);
    try {
      const saved = await saveAutomationWorkflow(businessId, workflow._id, {
        name: name.trim() || workflow.name,
        enabled: nextEnabled,
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
              draggable
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
          />
          <button
            type="button"
            className="af-btn af-btn--primary"
            disabled={saving}
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
            className="af-toolbar__btn"
            disabled={saving}
            onClick={() => handleSave(!enabled)}
          >
            {enabled ? <PowerOff size={14} /> : <Power size={14} />}
            {enabled ? "כבה" : "הפעל"}
          </button>
        </div>

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
                      <option key={o.value} value={o.value}>
                        {o.label}
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
