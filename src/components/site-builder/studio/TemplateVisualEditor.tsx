import React from "react";

import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";

import VisualEditorShell from "./visual-editor/VisualEditorShell";
import { useVisualEditorState } from "./visual-editor/hooks/useVisualEditorState";

type TemplateVisualEditorProps = {
  renderer: StudioTemplateRenderer;
  businessId?: string;
  initialData?: Record<string, any>;
  onBack?: () => void;
  onSave?: (payload: {
    templateKey: string;
    editorMode: "visual-react";
    data: Record<string, any>;
    updatedAt: string;
    published?: boolean;
    status?: "draft" | "published";
    slug?: string;
    publicUrl?: string;
    siteDomain?: string;
    domain?: {
      slug: string;
      published: boolean;
    };
    htmlSnapshot?: string;
    snapshotPageId?: string;
    templateEditorMode?: "visual-react";
    templateData?: Record<string, any>;
    projectData?: Record<string, any>;
  }) => void | Promise<void>;
};

function cloneData<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch {
    return {} as T;
  }
}

function normalizeSlug(value: unknown) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\//, "").replace(/\/$/, "");
}

function readInitialActivePageId(data: Record<string, any>) {
  return (
    String(data?.__activePageId || "") ||
    String(data?.activePageId || "") ||
    String(data?.editor?.activePageId || "") ||
    "home"
  );
}

export default function TemplateVisualEditor({
  renderer,
  businessId,
  initialData,
  onBack,
  onSave,
}: TemplateVisualEditorProps) {
  const baseData = React.useMemo(() => {
    return {
      ...(cloneData(renderer.defaultData || {}) as Record<string, any>),
      ...(cloneData(initialData || {}) as Record<string, any>),
    };
  }, [renderer.defaultData, initialData]);

  const activePageId = React.useMemo(
    () => readInitialActivePageId(baseData),
    [baseData],
  );

  const editor = useVisualEditorState({
    renderer,
    businessId,
    initialData: baseData,
    slug: normalizeSlug(
      baseData.__siteSlug ||
        baseData.slug ||
        baseData.domain?.slug ||
        baseData.__slug,
    ),
    publicUrl: String(baseData.__publicUrl || baseData.publicUrl || ""),
    siteDomain: String(baseData.__siteDomain || baseData.siteDomain || ""),
    activePageId,
    onSave,
  });

  return (
    <VisualEditorShell
      editor={editor}
      onBack={onBack}
    />
  );
}
