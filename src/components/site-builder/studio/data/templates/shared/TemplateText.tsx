import React from "react";

type TemplateTextProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

/** Leaf text node — one editable unit in the visual editor (avoids nested split editing). */
export function TemplateText({
  as: Tag = "span",
  className,
  children,
  ...props
}: TemplateTextProps) {
  return (
    <Tag
      className={className}
      data-visual-edit-type="text"
      data-visual-editable="true"
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Decorative glyph — not registered as editable content. */
export function TemplateDecor({
  as: Tag = "span",
  className,
  children,
  ...props
}: TemplateTextProps) {
  return (
    <Tag
      className={className}
      data-editor-only="true"
      aria-hidden="true"
      {...props}
    >
      {children}
    </Tag>
  );
}
