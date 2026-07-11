import React from "react";

import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";

import VisualEditorShell from "./visual-editor/VisualEditorShell";
import { useVisualEditorState } from "./visual-editor/hooks/useVisualEditorState";

type VisualSavePayload = {
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
};

type TemplateVisualEditorProps = {
  renderer: StudioTemplateRenderer;
  businessId?: string;
  initialData?: Record<string, any>;

  slug?: string;
  publicUrl?: string;
  siteDomain?: string;
  isSaving?: boolean;

  onBack?: () => void;
  onSave?: (payload: VisualSavePayload) => void | Promise<void>;
};

const VISUAL_CONTENT_KEY = "__content";
const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_DELETED_KEY = "__deletedElements";
const VISUAL_LAYOUT_KEY = "__layout";
const VISUAL_ATTRIBUTE_KEY = "__attributes";
const VISUAL_RESPONSIVE_KEY = "__responsive";
const VISUAL_LOCKED_KEY = "__lockedElements";
const VISUAL_HIDDEN_KEY = "__hiddenElements";
const VISUAL_FORM_KEY = "__formBuilderByElement";

const VISUAL_COLLECTION_KEYS = new Set([
  VISUAL_CONTENT_KEY,
  VISUAL_STYLE_KEY,
  VISUAL_ANIMATION_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_HIDDEN_KEY,
  VISUAL_FORM_KEY,
  "__formBuilder",
]);

function hasOwnKey(source: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function hasVisualSnapshot(source: Record<string, any>) {
  return Array.from(VISUAL_COLLECTION_KEYS).some((key) =>
    hasOwnKey(source, key),
  );
}

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
      /*
        מפות העורך הן snapshot מלא, לא patch.
        אם מקור חדש כולל את המפה — מחליפים אותה במלואה, גם כשהיא ריקה.
        כך מחיקות לא חוזרות בגלל merge עם נתונים ישנים.
      */
      if (VISUAL_COLLECTION_KEYS.has(key)) {
        merged[key] = isPlainObject(value) ? cloneData(value) : {};
        return;
      }

      merged[key] = value;
    });
  });

  return merged;
}

function pickPersistedVisualSnapshot(source: Record<string, any>) {
  const result: Record<string, any> = {};

  VISUAL_COLLECTION_KEYS.forEach((key) => {
    result[key] = isPlainObject(source?.[key])
      ? cloneData(source[key])
      : {};
  });

  [
    "__activePageId",
    "__siteSlug",
    "__publicUrl",
    "__siteDomain",
    "snapshotPageId",
  ].forEach((key) => {
    if (hasOwnKey(source, key)) {
      result[key] = source[key];
    }
  });

  return result;
}

function extractVisualDataFromInitialData(initialData?: Record<string, any>) {
  const source = isPlainObject(initialData) ? initialData : {};

  const templateData = isPlainObject(source.templateData)
    ? source.templateData
    : {};

  const visualEditorPayload = isPlainObject(source.visualEditorPayload)
    ? source.visualEditorPayload
    : {};

  const projectData = isPlainObject(source.projectData)
    ? source.projectData
    : {};

  const data = isPlainObject(source.data) ? source.data : {};

  const wrappedSource = Boolean(
    isPlainObject(source.templateData) ||
      isPlainObject(source.visualEditorPayload) ||
      isPlainObject(source.projectData) ||
      isPlainObject(source.data),
  );

  /*
    WebsiteStudioPage מעביר בדרך כלל data שטוח שכבר נבחר מהשרת.
    במקרה כזה הוא מקור האמת ואין למזג לתוכו עותקים פנימיים ישנים.
  */
  if (!wrappedSource || hasVisualSnapshot(source)) {
    return pickPersistedVisualSnapshot(source);
  }

  const candidates = [
    isPlainObject(visualEditorPayload.data) ? visualEditorPayload.data : {},
    isPlainObject(visualEditorPayload.templateData)
      ? visualEditorPayload.templateData
      : {},
    templateData,
    data,
    isPlainObject(projectData.data) ? projectData.data : {},
    isPlainObject(projectData.templateData) ? projectData.templateData : {},
    projectData,
  ];

  const authoritative =
    candidates.find((candidate) => hasVisualSnapshot(candidate)) ||
    candidates.find((candidate) => Object.keys(candidate).length > 0) ||
    {};

  return pickPersistedVisualSnapshot(authoritative);
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
  slug,
  publicUrl,
  siteDomain,
  isSaving,
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

  const normalizedSlug = React.useMemo(() => {
    return normalizeSlug(
      slug ||
        baseData.__siteSlug ||
        baseData.slug ||
        baseData.domain?.slug ||
        baseData.__slug,
    );
  }, [slug, baseData]);

  const resolvedPublicUrl = React.useMemo(() => {
    return String(publicUrl || baseData.__publicUrl || baseData.publicUrl || "");
  }, [publicUrl, baseData]);

  const resolvedSiteDomain = React.useMemo(() => {
    return String(
      siteDomain || baseData.__siteDomain || baseData.siteDomain || "",
    );
  }, [siteDomain, baseData]);

  const handleVisualSave = React.useCallback(
    async (payload: VisualSavePayload) => {
      if (typeof onSave !== "function") {
        console.warn("[TemplateVisualEditor save] missing onSave prop", {
          templateKey: renderer.key,
        });
        return;
      }

      const payloadData = isPlainObject(payload.data) ? payload.data : {};

      const finalData = mergeVisualData(
        baseData,
        payloadData,
        {
          __activePageId: payload.snapshotPageId || activePageId,
          __siteSlug: normalizedSlug,
          __publicUrl: resolvedPublicUrl,
          __siteDomain: resolvedSiteDomain,
        },
      );

      const finalPayload: VisualSavePayload = {
        ...payload,
        templateKey: String(payload.templateKey || renderer.key || ""),
        editorMode: "visual-react",
        templateEditorMode: "visual-react",
        data: finalData,
        templateData: finalData,
        projectData: {
          ...(isPlainObject(payload.projectData) ? payload.projectData : {}),
          data: finalData,
          templateData: finalData,
          editorMode: "visual-react",
          templateKey: String(payload.templateKey || renderer.key || ""),
          activePageId: payload.snapshotPageId || activePageId,
        },
        visualEditorPayload: {
          ...(isPlainObject(payload.visualEditorPayload)
            ? payload.visualEditorPayload
            : {}),
          data: finalData,
          templateData: finalData,
          editorMode: "visual-react",
          templateKey: String(payload.templateKey || renderer.key || ""),
          activePageId: payload.snapshotPageId || activePageId,
        },
        slug: normalizeSlug(payload.slug || normalizedSlug),
        publicUrl: String(payload.publicUrl || resolvedPublicUrl || ""),
        siteDomain: String(payload.siteDomain || resolvedSiteDomain || ""),
        domain: {
          slug: normalizeSlug(payload.domain?.slug || normalizedSlug),
          published:
            payload.status === "published" ||
            Boolean(payload.published) ||
            Boolean(payload.domain?.published),
        },
        status: payload.status || "draft",
        published:
          payload.status === "published" ||
          Boolean(payload.published) ||
          Boolean(payload.domain?.published),
        snapshotPageId: String(payload.snapshotPageId || activePageId || "home"),
        updatedAt: payload.updatedAt || new Date().toISOString(),
      };

      console.log("[TemplateVisualEditor save -> WebsiteStudioPage]", {
        templateKey: finalPayload.templateKey,
        status: finalPayload.status,
        published: finalPayload.published,
        slug: finalPayload.slug,
        publicUrl: finalPayload.publicUrl,
        siteDomain: finalPayload.siteDomain,
        snapshotPageId: finalPayload.snapshotPageId,
        contentKeysCount: countContentKeys(finalPayload.data),
        deletedKeysCount: Object.keys(
          isPlainObject(finalPayload.data?.[VISUAL_DELETED_KEY])
            ? finalPayload.data[VISUAL_DELETED_KEY]
            : {},
        ).length,
        emptyTextCount: Object.values(
          isPlainObject(finalPayload.data?.[VISUAL_CONTENT_KEY])
            ? finalPayload.data[VISUAL_CONTENT_KEY]
            : {},
        ).filter(
          (item) => isPlainObject(item) && item.text === "",
        ).length,
        dataKeys: Object.keys(finalPayload.data || {}),
      });

      await onSave(finalPayload);
    },
    [
      onSave,
      renderer.key,
      baseData,
      activePageId,
      normalizedSlug,
      resolvedPublicUrl,
      resolvedSiteDomain,
    ],
  );

  const editor = useVisualEditorState({
    renderer,
    businessId,
    initialData: baseData,
    slug: normalizedSlug,
    publicUrl: resolvedPublicUrl,
    siteDomain: resolvedSiteDomain,
    activePageId,
    onSave: handleVisualSave,
  });

  return (
    <VisualEditorShell
      editor={{
        ...(editor as any),
        isSaving: Boolean(isSaving || (editor as any).isSaving),
      }}
      onBack={onBack}
    />
  );
}