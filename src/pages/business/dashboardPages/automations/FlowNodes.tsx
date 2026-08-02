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

const ICONS = {
  trigger: Play,
  delay: Clock3,
  condition: GitBranch,
  action: Zap,
  router: Split,
} as const;

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
              <span
                className="af-route-label"
                style={{ top: `${top}%` }}
              >
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
  const routeCount = clampRouteCount(data.routeCount, 2);
  const router = type === "router" ? ensureRouterPaths(data) : null;

  return (
    <div
      className={[
        "af-node",
        `af-node--${type}`,
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
        <Icon size={12} />
        <span>{meta.title}</span>
      </div>
      <strong className="af-node__title">{title}</strong>
      <p className="af-node__summary">{summary}</p>

      {type === "trigger" ? (
        <RouteHandles count={routeCount} prefix="route" />
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

export const TriggerNode = makeNode("trigger");
export const DelayNode = makeNode("delay");
export const ConditionNode = makeNode("condition");
export const ActionNode = makeNode("action");
export const RouterNode = makeNode("router");

export const automationNodeTypes = {
  trigger: TriggerNode,
  delay: DelayNode,
  condition: ConditionNode,
  action: ActionNode,
  router: RouterNode,
};
