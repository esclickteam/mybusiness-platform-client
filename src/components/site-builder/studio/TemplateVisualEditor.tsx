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
    visualEditorPayload?: Record<string, any>;
  }) => void | Promise<void>;
};

const VISUAL_CONTENT_KEY = "__content";
const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_DELETED_KEY = "__deletedElements";
const VISUAL_FORM_KEY = "__formBuilderByElement";

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

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
    String(data?.snapshotPageId || "") ||
    "home"
  );
}

function mergeVisualData(
  ...sources: Array<Record<string, any> | undefined | null>
) {
  const merged: Record<string, any> = {};

  sources.forEach((source) => {
    if (!isPlainObject(source)) return;

    Object.entries(source).forEach(([key, value]) => {
      if (
        key === VISUAL_CONTENT_KEY ||
        key === VISUAL_STYLE_KEY ||
        key === VISUAL_ANIMATION_KEY ||
        key === VISUAL_DELETED_KEY ||
        key === VISUAL_FORM_KEY
      ) {
        merged[key] = {
          ...(isPlainObject(merged[key]) ? merged[key] : {}),
          ...(isPlainObject(value) ? value : {}),
        };

        return;
      }

      merged[key] = value;
    });
  });

  return merged;
}

function extractVisualDataFromInitialData(initialData?: Record<string, any>) {
  const source = isPlainObject(initialData) ? initialData : {};

  const templateData = isPlainObject(source.templateData)
    ? source.templateData
    : {};

  const visualEditorPayload = isPlainObject(source.visualEditorPayload)
    ? source.visualEditorPayload
    : {};

  const visualPayloadData = isPlainObject(visualEditorPayload.data)
    ? visualEditorPayload.data
    : {};

  const visualPayloadTemplateData = isPlainObject(
    visualEditorPayload.templateData,
  )
    ? visualEditorPayload.templateData
    : {};

  const projectData = isPlainObject(source.projectData)
    ? source.projectData
    : {};

  const projectDataData = isPlainObject(projectData.data)
    ? projectData.data
    : {};

  const projectTemplateData = isPlainObject(projectData.templateData)
    ? projectData.templateData
    : {};

  const data = isPlainObject(source.data) ? source.data : {};

  return mergeVisualData(
    source,
    data,
    projectData,
    projectDataData,
    projectTemplateData,
    templateData,
    visualPayloadData,
    visualPayloadTemplateData,
  );
}

function countContentKeys(data: Record<string, any>) {
  const content = isPlainObject(data?.[VISUAL_CONTENT_KEY])
    ? data[VISUAL_CONTENT_KEY]
    : {};

  return Object.keys(content).length;
}

export default function TemplateVisualEditor({
  renderer,
  businessId,
  initialData,
  onBack,
  onSave,
}: TemplateVisualEditorProps) {
  const baseData = React.useMemo(() => {
    const defaultData = cloneData(
      renderer.defaultData || {},
    ) as Record<string, any>;

    const savedVisualData = extractVisualDataFromInitialData(
      cloneData(initialData || {}) as Record<string, any>,
    );

    const merged = mergeVisualData(defaultData, savedVisualData);

    console.log("[TemplateVisualEditor baseData]", {
      templateKey: renderer.key,
      businessId,
      defaultKeys: Object.keys(defaultData || {}),
      initialKeys: Object.keys(initialData || {}),
      finalKeys: Object.keys(merged || {}),
      hasContent: isPlainObject(merged.__content),
      contentKeysCount: countContentKeys(merged),
      contentKeys: Object.keys(
        isPlainObject(merged.__content) ? merged.__content : {},
      ),
      hasTemplateData: isPlainObject(initialData?.templateData),
      hasVisualEditorPayload: isPlainObject(initialData?.visualEditorPayload),
      hasProjectData: isPlainObject(initialData?.projectData),
    });

    return merged;
  }, [renderer.defaultData, renderer.key, initialData, businessId]);

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

  return <VisualEditorShell editor={editor} onBack={onBack} />;
}