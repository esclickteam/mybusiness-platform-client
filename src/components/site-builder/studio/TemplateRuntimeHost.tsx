import React from "react";
import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";

type TemplateRuntimeHostProps = {
  renderer: StudioTemplateRenderer;
  mode: "preview" | "editor" | "public";
  activePageId?: string;
  activePageSlug?: string;
  data?: Record<string, any>;
};

export default function TemplateRuntimeHost({
  renderer,
  mode,
  activePageId = "home",
  activePageSlug = "/",
  data = {},
}: TemplateRuntimeHostProps) {
  const TemplateComponent = renderer.Component as React.ComponentType<any>;
  const editorCss = String(renderer.editorCss || "");

  return (
    <div
      data-template-runtime-host="true"
      data-template-key={renderer.key}
      data-template-mode={mode}
      style={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      {editorCss ? <style>{editorCss}</style> : null}

      <TemplateComponent
        key={`${renderer.key}-${activePageId}-${mode}`}
        mode={mode}
        viewMode={mode}
        runtimeMode={mode}
        initialPage={activePageId}
        initialPageId={activePageId}
        pageId={activePageId}
        activePageId={activePageId}
        selectedPageId={activePageId}
        currentPageId={activePageId}
        slug={activePageSlug}
        pageSlug={activePageSlug}
        activePageSlug={activePageSlug}
        selectedPageSlug={activePageSlug}
        currentPageSlug={activePageSlug}
        data={data}
        templateData={data}
        studioData={data}
        isVisualEditor={mode === "editor"}
        isPreview={mode === "preview"}
        isPublic={mode === "public"}
        isStudioStatic={false}
      />
    </div>
  );
}