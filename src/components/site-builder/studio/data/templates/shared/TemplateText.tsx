import React from "react";

import { useVisualLibraryPage } from "../../../../runtime/visualLibraryPage";
import {
  resolveTemplateRichHtmlFromVisualData,
  resolveTemplateTextFromVisualData,
} from "./resolveTemplateText";
import {
  hasRichMarkup,
  sanitizeRichHtml,
} from "../../../visual-editor/utils/richTextHtml";

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
  const data = (libraryPage?.data as Record<string, any> | null) || null;
  const resolved = resolveTemplateTextFromVisualData(editId, data);
  const richHtml = resolveTemplateRichHtmlFromVisualData(editId, data);
  const safeHtml =
    richHtml && hasRichMarkup(richHtml) ? sanitizeRichHtml(richHtml) : "";

  return (
    <Tag
      className={className}
      data-visual-edit-type="text"
      data-visual-editable="true"
      {...(editId ? { "data-visual-edit-id": editId } : {})}
      {...(editLabel ? { "data-visual-edit-label": editLabel } : {})}
      {...props}
      {...(safeHtml ? { dangerouslySetInnerHTML: { __html: safeHtml } } : {})}
    >
      {safeHtml ? null : resolved !== null ? resolved : children}
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
