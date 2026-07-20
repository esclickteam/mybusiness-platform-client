import React from "react";
import { useParams } from "react-router-dom";

import { getStudioTemplateById } from "../components/site-builder/studio/data/templates";

/**
 * Standalone, isolated render of a template using the exact same preview the
 * template gallery "צפייה" uses (the real built template). Meant to be embedded
 * in an <iframe> as a live preview on the templates gallery cards.
 */
export default function EmbedTemplatePreviewPage() {
  const { templateKey = "" } = useParams<{ templateKey: string }>();

  const template = getStudioTemplateById(templateKey);

  const previewValue =
    (template as any)?.Preview ||
    (template as any)?.PreviewComponent ||
    (template as any)?.preview ||
    (template as any)?.component ||
    (template as any)?.Component;

  if (React.isValidElement(previewValue)) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#fff" }}>
        {previewValue}
      </div>
    );
  }

  if (typeof previewValue === "function") {
    const PreviewComponent = previewValue as React.ComponentType<any>;
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#fff" }}>
        <PreviewComponent mode="preview" />
      </div>
    );
  }

  return <div style={{ minHeight: "100vh", background: "#fff" }} />;
}
