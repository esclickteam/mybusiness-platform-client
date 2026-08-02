import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clock3, GitBranch, Zap, Play } from "lucide-react";
import {
  TYPE_META,
  nodeSummary,
  type AutomationNodeType,
} from "./automationFlowTypes";

const ICONS = {
  trigger: Play,
  delay: Clock3,
  condition: GitBranch,
  action: Zap,
} as const;

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

  return (
    <div
      className={[
        "af-node",
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
        <Handle
          type="target"
          position={Position.Left}
          className="af-handle"
        />
      ) : null}

      <div className="af-node__badge">
        <Icon size={12} />
        <span>{meta.title}</span>
      </div>
      <strong className="af-node__title">{title}</strong>
      <p className="af-node__summary">{summary}</p>

      {type === "condition" ? (
        <>
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
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="af-handle"
          id="out"
        />
      )}
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

export const automationNodeTypes = {
  trigger: TriggerNode,
  delay: DelayNode,
  condition: ConditionNode,
  action: ActionNode,
};
