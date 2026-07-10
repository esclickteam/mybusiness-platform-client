import React from "react";

import { readVisualContent } from "../utils/visualData";

export type VisualLinkMode = "edit" | "preview";

export type VisualLinkProps = {
  id: string;
  data?: Record<string, any>;
  mode?: VisualLinkMode;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  editable?: boolean;
  label?: string;

  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel" | "children" | "className" | "style" | "onClick"
>;

function normalizeLinkHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "#";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("sms:")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

export default function VisualLink({
  id,
  data,
  mode = "preview",
  href = "#",
  target = "_self",
  rel,
  children,
  className,
  style,
  editable = true,
  label = "קישור",
  onClick,
  ...props
}: VisualLinkProps) {
  const item = id && data ? readVisualContent(data)[id] : undefined;

  const finalHref = normalizeLinkHref(String(item?.href || href || "#"));
  const finalTarget = String(item?.target || target || "_self");
  const finalRel =
    item?.rel ||
    rel ||
    (finalTarget === "_blank" ? "noopener noreferrer" : undefined);

  const visualAttrs =
    editable && id
      ? {
          "data-visual-editable": "true",
          "data-visual-edit-id": id,
          "data-visual-edit-type": "button",
          "data-visual-edit-label": label,
          "data-visual-link-href": finalHref,
          "data-visual-link-target": finalTarget,
          "data-link-url": finalHref,
        }
      : {};

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (mode === "edit") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return (
    <a
      {...props}
      {...visualAttrs}
      href={finalHref}
      target={finalTarget}
      rel={finalRel}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
