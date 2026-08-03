import React from "react";

import { useVisualLibraryPage } from "../../../../runtime/visualLibraryPage";
import { resolveTemplateTextFromVisualData } from "./resolveTemplateText";

type TemplateTextProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  editId?: string;
  editLabel?: string;
} & React.HTMLAttributes<HTMLElement>;

/** Leaf text node — one editable unit in the visual editor (avoids nested split editing). */
export function TemplateText({
  as: Tag = "span",
  className,
  children,
  editId,
  editLabel,
  ...props
}: TemplateTextProps) {
  const libraryPage = useVisualLibraryPage();
  const resolved = resolveTemplateTextFromVisualData(
    editId,
    (libraryPage?.data as Record<string, any> | null) || null,
  );

  return (
    <Tag
      className={className}
      data-visual-edit-type="text"
      data-visual-editable="true"
      {...(editId ? { "data-visual-edit-id": editId } : {})}
      {...(editLabel ? { "data-visual-edit-label": editLabel } : {})}
      {...props}
    >
      {resolved !== null ? resolved : children}
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
