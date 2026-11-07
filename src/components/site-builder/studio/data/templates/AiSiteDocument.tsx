import React from "react";
import type { StudioTemplateRenderer } from "./templateEditorTypes";

type AiSiteProps = {
  data?: Record<string, unknown>;
  mode?: string;
};

export const aiSiteRenderer: StudioTemplateRenderer = {
  key: "ai-site",
  name: "AI",
  editorMode: "visual-react",
  pages: [{ id: "home", name: "ראשי", slug: "home" }],
  Component: function AiSiteDocument({ data }: AiSiteProps) {
    const html = String(data?.__aiDocument || "");
    const css = String(data?.__aiCss || "");
    return (
      <div data-template-id="ai-site" style={{ width: "100%" }}>
        <style>{css}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  },
  defaultData: {},
  editorCss: "",
};
