import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

type InsertEdgeData = {
  onInsert?: (edgeId: string) => void;
  readOnly?: boolean;
};

export default function AutomationInsertEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    data,
  } = props;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const { t } = useTranslation();
  const edgeData = (data || {}) as InsertEdgeData;
  const readOnly = Boolean(edgeData.readOnly);

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {!readOnly ? (
        <EdgeLabelRenderer>
          <button
            type="button"
            className="af-edge-add"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            title={t("leftover.autoUi.insertStep", "Add a step on this connection")}
            onClick={(event) => {
              event.stopPropagation();
              edgeData.onInsert?.(id);
            }}
          >
            <Plus size={12} />
          </button>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}