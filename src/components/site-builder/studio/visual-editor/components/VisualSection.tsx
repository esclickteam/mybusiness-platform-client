import React from "react";

import {
  readVisualDeleted,
  readVisualStyles,
} from "../utils/visualData";

export type VisualSectionMode = "edit" | "preview";

export type VisualSectionProps = {
  id: string;
  data?: Record<string, any>;
  mode?: VisualSectionMode;

  as?: React.ElementType;
  kind?: string;
  title?: string;

  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  editable?: boolean;
  label?: string;
} & Record<string, any>;

export default function VisualSection({
  id,
  data,
  mode = "preview",
  as: Tag = "section",
  kind,
  title,
  children,
  className,
  style,
  editable = true,
  label,
  ...props
}: VisualSectionProps) {
  const elementId = id.endsWith(".section") ? id : `${id}.section`;
  const sectionKind = kind || id.replace(/\.section$/, "");

  const deleted = data ? readVisualDeleted(data) : {};
  const styles = data ? readVisualStyles(data) : {};

  if (deleted[elementId] || deleted[id]) {
    return null;
  }

  const visualAttrs =
    editable && elementId
      ? {
          "data-visual-editable": "true",
          "data-visual-edit-id": elementId,
          "data-visual-edit-type": "section",
          "data-visual-edit-label": label || title || "סקשן",
          "data-template-section-id": sectionKind,
          "data-section-kind": sectionKind,
          "data-section-title": title || label || sectionKind,
        }
      : {
          "data-template-section-id": sectionKind,
          "data-section-kind": sectionKind,
          "data-section-title": title || label || sectionKind,
        };

  return (
    <Tag
      {...props}
      {...visualAttrs}
      className={className}
      style={{
        ...(styles[elementId] || styles[id] || {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}