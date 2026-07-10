import React from "react";

import { readVisualContent } from "../utils/visualData";

export type VisualTextMode = "edit" | "preview";

export type VisualTextProps = {
  id: string;
  data?: Record<string, any>;
  mode?: VisualTextMode;

  as?: React.ElementType;
  children?: React.ReactNode;
  fallback?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  editable?: boolean;
  label?: string;

  preserveWhitespace?: boolean;
} & Record<string, any>;

export default function VisualText({
  id,
  data,
  as: Tag = "span",
  children,
  fallback,
  className,
  style,
  editable = true,
  label = "טקסט",
  preserveWhitespace = false,
  ...props
}: VisualTextProps) {
  const item = id && data ? readVisualContent(data)[id] : undefined;

  const content =
    item?.text !== undefined
      ? item.text
      : children !== undefined
        ? children
        : fallback !== undefined
          ? fallback
          : "";

  const visualAttrs =
    editable && id
      ? {
          "data-visual-editable": "true",
          "data-visual-edit-id": id,
          "data-visual-edit-type": "text",
          "data-visual-edit-label": label,
        }
      : {};

  return (
    <Tag
      {...props}
      {...visualAttrs}
      className={className}
      style={{
        ...(preserveWhitespace ? { whiteSpace: "pre-wrap" } : {}),
        ...style,
      }}
    >
      {content}
    </Tag>
  );
}