import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Clock3,
  GitBranch,
  Zap,
  Play,
  Split,
} from "lucide-react";
import {
  TYPE_META,
  clampRouteCount,
  ensureRouterPaths,
  nodeSummary,
  type AutomationNodeType,
} from "./automationFlowTypes";
import { nodeBillingBadgeLabel } from "./automationActionCost";

const ICONS = {
  trigger: Play,
  delay: Clock3,
  condition: GitBranch,
  action: Zap,
  router: Split,
} as const;

function providerLabel(type: AutomationNodeType, data: Record<string, unknown>) {
  if (type === "trigger") return "טריגר";
  if (type === "delay") return "המתנה";
  if (type === "condition") return "תנאי";
  if (type === "router") return "פיצול";
  const key = String(data.actionKey || "");
  if (key.includes("gmail")) return "תוצאה · Gmail";
  if (key.includes("outlook")) return "תוצאה · Outlook";
  if (key.includes("calendar")) return "תוצאה · Calendar";
  if (key.includes("whatsapp") || key === "send_whatsapp") return "תוצאה · WhatsApp";
  if (key.startsWith("ai_")) return "תוצאה · AI";
  return "תוצאה";
}

function RouteHandles({
  count,
  prefix,
  labels,
}: {
  count: number;
  prefix: string;
  labels?: string[];
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => {
        const top = ((index + 1) / (count + 1)) * 100;
        return (
          <React.Fragment key={`${prefix}_${index + 1}`}>
            <Handle
              type="source"
              position={Position.Right}
              id={`${prefix}_${index + 1}`}
              className="af-handle af-handle--route"
              style={{ top: `${top}%` }}
            />
            {labels?.[index] ? (
              <span className="af-route-label" style={{ top: `${top}%` }}>
                {labels[index]}
              </span>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

function FlowNodeShell({
  type,
  data,
  selected,
}: {
  type: AutomationNodeType;
  data: Record<string, unknown>;
  selected?: boolean;
}) {
  const meta = TYPE_META[type];
  const Icon = ICONS[type];
  const title = String(data.label || meta.title);
  const summary = nodeSummary(data, type);
  const routeCount = clampRouteCount(data.routeCount, 1);
  const router = type === "router" ? ensureRouterPaths(data) : null;
  const provider = providerLabel(type, data);
  const isWhatsAppAction =
    type === "action" &&
    (String(data.actionKey || "").includes("whatsapp") ||
      String(data.actionKey || "") === "send_whatsapp");
  const costLabel = nodeBillingBadgeLabel({
    nodeType: type,
    actionKey: String(data.actionKey || ""),
  });
  const triggerRouteLabels =
    type === "trigger" && routeCount > 1
      ? Array.from({ length: routeCount }, (_, i) => `תוצאה ${i + 1}`)
      : undefined;

  return (
    <div
      className={[
        "af-node",
        `af-node--${type}`,
        type === "trigger" ? "af-node--role-trigger" : "",
        type === "action" ? "af-node--role-result" : "",
        selected ? "af-node--selected" : "",
      ].join(" ")}
      style={
        {
          "--af-color": meta.color,
          "--af-accent": meta.accent,
        } as React.CSSProperties
      }
    >
      {type !== "trigger" ? (
        <Handle type="target" position={Position.Left} className="af-handle" />
      ) : null}

      <div className="af-node__badge">
        <Icon size={11} />
        <span>{provider}</span>
      </div>
      <span
        className={`af-node__cost${
          costLabel === "ללא חיוב" ? " af-node__cost--free" : ""
        }`}
      >
        {costLabel}
      </span>
      {isWhatsAppAction ? (
        <span className="af-node__wa-cost" title="0.20 ₪ להודעת WhatsApp">
          💬 0.20 ₪
        </span>
      ) : null}
      <strong className="af-node__title">{title}</strong>
      {summary ? <p className="af-node__summary">{summary}</p> : null}

      {type === "trigger" ? (
        <RouteHandles
          count={routeCount}
          prefix="route"
          labels={triggerRouteLabels}
        />
      ) : null}

      {type === "router" && router ? (
        <RouteHandles
          count={router.pathCount}
          prefix="path"
          labels={router.paths.map((p) => p.label)}
        />
      ) : null}

      {type === "condition" ? (
        <>
          <span className="af-route-label af-route-label--yes">כן</span>
          <span className="af-route-label af-route-label--no">לא</span>
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            className="af-handle af-handle--yes"
            style={{ top: "35%" }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="no"
            className="af-handle af-handle--no"
            style={{ top: "70%" }}
          />
        </>
      ) : null}

      {type === "delay" || type === "action" ? (
        <Handle
          type="source"
          position={Position.Right}
          className="af-handle"
          id="out"
        />
      ) : null}
    </div>
  );
}

function makeNode(type: AutomationNodeType) {
  return memo(function AutomationNode({ data, selected }: NodeProps) {
    return (
      <FlowNodeShell
        type={type}
        data={(data || {}) as Record<string, unknown>}
        selected={selected}
      />
    );
  });
}

export const automationNodeTypes = {
  trigger: makeNode("trigger"),
  delay: makeNode("delay"),
  condition: makeNode("condition"),
  action: makeNode("action"),
  router: makeNode("router"),
};
