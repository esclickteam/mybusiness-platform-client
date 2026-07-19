import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type {
  DeviceMode,
  PageTemplate,
  SiteSavePayload,
  ActiveStudioPanel,
  StylePatch,
  ThemePalette,
  WebsiteStudioPageProps,
  StudioSitePage,
  StudioSitePageType,
  SiteSeoSettings,
  SitePageSeoSettings,
} from "./types";
import type { ReadyWebsiteTemplateSeed } from "./data/readyWebsiteTypes";

import StudioTopbar from "./StudioTopbar";
import StudioSidebar from "./StudioSidebar";
import StudioCanvas from "./StudioCanvas";
import TemplateVisualEditor from "./TemplateVisualEditor";
import PageSettingsModal, {
  type PageSettingsModalTab,
} from "./visual-editor/components/PageSettingsModal";
import {
  normalizePageSeo,
  normalizeSiteSeoSettings,
} from "./utils/pageSeoUtils";

import { getStudioTemplateRenderer } from "./data/templates/templateRendererRegistry";

import { initBizuplyEditor } from "./grapes/initEditor";

/*
  WebsiteStudioPage only needs the editor as a runtime object.
  Keeping the type local prevents VS Code from failing when the optional
  GrapesJS type package is not resolved by this client build.
*/
type Editor = any;

import {
  createCanvasCss,
  defaultCanvasCss,
  defaultWebsiteHtml,
} from "./grapes/canvasTheme";

import { normalizePageSlug } from "./data/linkUtils";
import { materializePageVisualData } from "../../../utils/materializeAiSitePlan";
import type { VisualLibraryPageTemplate } from "./visual-editor/library/visualLibraryTypes";
import {
  slimSitePageNavSources,
  syncSitePageTitlesIntoVisualData,
} from "./visual-editor/utils/syncNavWithSitePages";

export type StudioPageSection = {
  id: string;
  title: string;
  kind: string;
  tagName: string;
};

type ClientPortalVariableType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "checkbox"
  | "checklist"
  | "status"
  | "file"
  | "image"
  | "email"
  | "phone";

type ClientPortalVariableSource =
  | "business_input"
  | "client_input"
  | "crm_client"
  | "appointments"
  | "payments"
  | "tasks"
  | "files"
  | "custom";

type ClientPortalVariable = {
  id: string;
  key: string;
  label: string;
  type: ClientPortalVariableType;
  source: ClientPortalVariableSource;
  scope: "per_client" | "global";
  visibleToClient: boolean;
  editableByClient: boolean;
  required: boolean;
  placeholder?: string;
  options?: string[];
  createdAt: string;
  updatedAt: string;
};

type ClientPortalPageConfig = {
  enabled: boolean;
  loginRequired: boolean;
  accessMode: "assigned_clients" | "paid_clients" | "all_clients";
  dataMode: "per_client" | "global";
  monthlyPrice: number;
  currency: string;
  variables: ClientPortalVariable[];
};

type StudioSitePageWithPortal = StudioSitePage & {
  clientPortal?: ClientPortalPageConfig;

  /*
    Visual React pages keep the complete visual snapshot here as well.
    This field already exists in the server payload; it is declared locally
    so TypeScript also allows reading and updating it in WebsiteStudioPage.
  */
  visualEditorPayload?: Record<string, any>;
};

const BIZUPLY_PUBLIC_SITE_DOMAIN =
  process.env.NEXT_PUBLIC_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const STUDIO_TEMPLATE_DEBUG = true;

function studioDebug(label: string, payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;

  try {
    console.log(`[BizUply Studio DEBUG] ${label}`, payload ?? "");
  } catch {
    /* noop */
  }
}

function studioWarn(label: string, payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;

  try {
    console.warn(`[BizUply Studio WARN] ${label}`, payload ?? "");
  } catch {
    /* noop */
  }
}

function studioError(label: string, payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;

  try {
    console.error(`[BizUply Studio ERROR] ${label}`, payload ?? "");
  } catch {
    /* noop */
  }
}

function studioGroup(label: string, payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;

  try {
    console.groupCollapsed(`[BizUply Studio] ${label}`);
    if (payload !== undefined) console.log(payload);
  } catch {
    /* noop */
  }
}

function studioGroupEnd() {
  if (!STUDIO_TEMPLATE_DEBUG) return;

  try {
    console.groupEnd();
  } catch {
    /* noop */
  }
}

function getTextLength(value: unknown) {
  return String(value || "").length;
}

function summarizeStudioPagesForDebug(pages: Array<any>) {
  return (Array.isArray(pages) ? pages : []).map((page) => ({
    id: page?.id,
    title: page?.title,
    slug: page?.slug,
    isHome: Boolean(page?.isHome),
    htmlLength: getTextLength(page?.html),
    cssLength: getTextLength(page?.css),
    hasProjectData: Boolean(page?.projectData),
    htmlPreview: String(page?.html || "").slice(0, 220),
  }));
}

const sectionKindLabels: Record<string, string> = {
  header: "Header",
  hero: "פתיח",
  welcome: "Welcome",
  about: "אודות",
  team: "צוות",
  services: "שירותים",
  gallery: "גלריה",
  contact: "יצירת קשר",
  promotion: "מבצע",
  subscribe: "הרשמה",
  testimonials: "המלצות",
  reviews: "ביקורות",
  clients: "לקוחות",
  store: "חנות / מוצרים",
  booking: "תיאום תורים",
  bookings: "תיאום תורים",
  events: "אירועים",
  club: "מועדון לקוחות",
  bot: "בוט חכם",
  social: "רשתות חברתיות",
  course: "קורס",
  miniSaas: "Mini SaaS",
  basic: "בסיסי",
  text: "טקסט",
  list: "רשימה",
  form: "טופס",
  forms: "טופס",
  section: "סקשן",
  footer: "Footer",
};

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeBusinessSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\u0590-\u05FF]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function buildPublicSiteUrl(value: string) {
  const clean = normalizeBusinessSlug(value) || "your-business";
  return `https://${clean}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`;
}

function isObjectIdLikeSlug(value: string) {
  return /^[a-f0-9]{24}$/i.test(String(value || "").trim());
}

function extractSlugFromPublicUrl(value: string) {
  const clean = String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^\/\//, "")
    .split("/")[0]
    .split(":")[0];

  return normalizeBusinessSlug(clean.split(".")[0] || "");
}

function normalizePublicBusinessSlug(value: string) {
  const clean = normalizeBusinessSlug(value);

  if (!clean) return "";
  if (clean === "your-business") return "";
  if (isObjectIdLikeSlug(clean)) return "";

  return clean;
}

function getPublicSlugFromSavedSite(site: any) {
  return (
    normalizePublicBusinessSlug(String(site?.slug || "")) ||
    normalizePublicBusinessSlug(String(site?.domain?.slug || "")) ||
    normalizePublicBusinessSlug(extractSlugFromPublicUrl(String(site?.publicUrl || ""))) ||
    ""
  );
}

function createBlankPageHtml(pageTitle: string) {
  return `
<main data-studio-page="true" class="min-h-screen bg-white">
  <section
    data-section-kind="basic"
    data-section-title="עמוד ריק"
    class="mx-auto flex min-h-[460px] w-full max-w-[1180px] items-center justify-center px-6 py-24 text-center"
  >
    <div class="mx-auto max-w-xl rounded-[32px] border border-dashed border-slate-200 bg-slate-50 px-8 py-10">
      <p class="mb-3 text-sm font-black text-violet-700">עמוד חדש</p>
      <h1 class="text-4xl font-black tracking-[-0.04em] text-slate-950">${pageTitle}</h1>
      <p class="mt-4 text-base font-bold leading-8 text-slate-500">
        התחילי להוסיף סקשנים מהתפריט בצד.
      </p>
    </div>
  </section>
</main>`;
}

function createDefaultClientPortalConfig(): ClientPortalPageConfig {
  return {
    enabled: false,
    loginRequired: true,
    accessMode: "assigned_clients",
    dataMode: "per_client",
    monthlyPrice: 0,
    currency: "USD",
    variables: [],
  };
}

function createInitialPages(): StudioSitePageWithPortal[] {
  const now = new Date().toISOString();

  return [
    {
      id: "home",
      title: "דף הבית",
      slug: "",
      type: "home",
      isHome: true,
      html: defaultWebsiteHtml,
      css: defaultCanvasCss,
      createdAt: now,
      updatedAt: now,
      clientPortal: createDefaultClientPortalConfig(),
    },
  ];
}

function snapshotPages(
  pages: StudioSitePageWithPortal[],
  editor: Editor,
  activePageId: string,
): StudioSitePageWithPortal[] {
  return pages.map((page) => {
    if (page.id !== activePageId) return page;

    return {
      ...page,
      html: editor.getHtml(),
      css: editor.getCss(),
      projectData: editor.getProjectData(),
      updatedAt: new Date().toISOString(),
    };
  });
}

function loadPageIntoEditor(
  editor: Editor,
  page: StudioSitePageWithPortal,
  options?: { forceHtml?: boolean },
) {
  const html = page.html || createBlankPageHtml(page.title);
  const css = page.css || defaultCanvasCss;

  studioDebug("loadPageIntoEditor:start", {
    pageId: page.id,
    title: page.title,
    slug: page.slug,
    forceHtml: Boolean(options?.forceHtml),
    hasProjectData: Boolean(page.projectData),
    htmlLength: html.length,
    cssLength: css.length,
    htmlSample: html.slice(0, 300),
  });

  try {
    if (
      !options?.forceHtml &&
      page.projectData &&
      typeof editor.loadProjectData === "function"
    ) {
      studioDebug("loadPageIntoEditor:loadProjectData", {
        pageId: page.id,
      });
      editor.loadProjectData(page.projectData as any);
    } else {
      studioDebug("loadPageIntoEditor:setComponents", {
        pageId: page.id,
      });
      editor.setComponents(html);
      editor.setStyle(css);
    }

    editor.select(null);

    window.setTimeout(() => {
      try {
        editor.refresh();

        const wrapper = editor.getWrapper?.();
        const sections = wrapper?.find?.("[data-section-kind]") || [];

        studioDebug("loadPageIntoEditor:after-refresh", {
          pageId: page.id,
          wrapperReady: Boolean(wrapper),
          dataSectionKindCount: sections.length,
          editorHtmlLength: String(editor.getHtml?.() || "").length,
          editorCssLength: String(editor.getCss?.() || "").length,
        });
      } catch (refreshError) {
        studioError("loadPageIntoEditor:refresh-error", refreshError);
      }
    }, 0);
  } catch (error) {
    studioError("loadPageIntoEditor:error", error);
    editor.setComponents(html);
    editor.setStyle(css);
    editor.select(null);

    window.setTimeout(() => {
      try {
        editor.refresh();
      } catch (refreshError) {
        studioError("loadPageIntoEditor:fallback-refresh-error", refreshError);
      }
    }, 0);
  }
}

function getComponentText(component: any) {
  try {
    const text =
      component.get?.("content") ||
      component.view?.el?.innerText ||
      component.toHTML?.()?.replace(/<[^>]+>/g, " ") ||
      "";

    return String(text).replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function isReadyEditor(editor: Editor | null | undefined): editor is Editor {
  return Boolean(
    editor &&
      typeof editor.getWrapper === "function" &&
      typeof editor.getSelected === "function"
  );
}

function extractSectionsFromEditor(
  editor: Editor | null | undefined
): StudioPageSection[] {
  if (!isReadyEditor(editor)) return [];

  const wrapper: any = editor.getWrapper();

  if (!wrapper || typeof wrapper.find !== "function") return [];

  const editableMarked = [
    ...(wrapper.find?.('[data-bizuply-editor-section="true"]') || []),
  ];

  const dataMarked = [
    ...(wrapper.find?.("[data-section-kind]") || []),
    ...(wrapper.find?.("[data-bizuply-block]") || []),
  ];

  const fallbackSections = [
    ...(wrapper.find?.("header") || []),
    ...(wrapper.find?.("section") || []),
    ...(wrapper.find?.("footer") || []),
  ];

  const found: any[] = editableMarked.length
    ? editableMarked
    : dataMarked.length
      ? dataMarked
      : fallbackSections;

  const unique = new Map<string, any>();

  found.forEach((component) => {
    const cid = component?.cid || component?.getId?.() || component?.get?.("id");
    if (!cid) return;
    unique.set(cid, component);
  });

  return Array.from(unique.values()).map((component, index) => {
    const attrs = component?.getAttributes?.() || {};
    const tagName = String(component?.get?.("tagName") || "").toLowerCase();

    const kind =
      attrs["data-section-kind"] ||
      attrs["data-bizuply-block"] ||
      (tagName === "header"
        ? "header"
        : tagName === "footer"
          ? "footer"
          : "section");

    let id = attrs.id || attrs["data-studio-section-id"];

    if (!id) {
      id = `section-${index + 1}-${uid("s")}`;
      component?.addAttributes?.({
        id,
        "data-studio-section-id": id,
      });
    } else if (!attrs["data-studio-section-id"]) {
      component?.addAttributes?.({
        "data-studio-section-id": id,
      });
    }

    const titleFromAttr =
      attrs["data-section-title"] ||
      attrs["data-block-title"] ||
      attrs["aria-label"];

    const heading =
      component?.find?.("h1")?.[0] ||
      component?.find?.("h2")?.[0] ||
      component?.find?.("h3")?.[0];

    const headingText = heading ? getComponentText(heading) : "";
    const label = sectionKindLabels[String(kind)] || String(kind);

    return {
      id,
      title: titleFromAttr || headingText || `${label} ${index + 1}`,
      kind: String(kind),
      tagName: tagName || "section",
    };
  });
}

function clientPortalVariableTypeLabel(type: ClientPortalVariableType) {
  if (type === "text") return "טקסט קצר";
  if (type === "textarea") return "טקסט ארוך";
  if (type === "number") return "מספר";
  if (type === "date") return "תאריך";
  if (type === "checkbox") return "צ׳קבוקס";
  if (type === "checklist") return "רשימת סימון";
  if (type === "status") return "סטטוס";
  if (type === "file") return "קובץ";
  if (type === "image") return "תמונה";
  if (type === "email") return "מייל";
  if (type === "phone") return "טלפון";
  return type;
}

function clientPortalVariableSourceLabel(source: ClientPortalVariableSource) {
  if (source === "business_input") return "העסק ממלא";
  if (source === "client_input") return "הלקוח ממלא";
  if (source === "crm_client") return "נמשך מתיק הלקוח";
  if (source === "appointments") return "נמשך מפגישות";
  if (source === "payments") return "נמשך מתשלומים";
  if (source === "tasks") return "נמשך ממשימות";
  if (source === "files") return "נמשך מקבצים";
  return "מותאם אישית";
}

function cleanVariableKey(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "")
    .replace(/^(\d)/, "_$1")
    .slice(0, 50);
}

function getStoredAuthToken() {
  if (typeof window === "undefined") return "";

  const keys = [
    "token",
    "authToken",
    "accessToken",
    "jwt",
    "bizuplyToken",
    "businessToken",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return "";
}

function buildAuthHeaders(extraHeaders?: Record<string, string>) {
  const token = getStoredAuthToken();

  return {
    ...(extraHeaders || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


function asPlainObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, any>;
}


function cleanVisualData(value: any, seen = new WeakSet<object>()): any {
  if (value === null) return null;

  const valueType = typeof value;

  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean"
  ) {
    return value;
  }

  if (
    valueType === "undefined" ||
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    return undefined;
  }

  if (typeof window !== "undefined") {
    if (
      value instanceof Node ||
      value instanceof Element ||
      value instanceof HTMLElement ||
      value instanceof Document ||
      value instanceof Window
    ) {
      return undefined;
    }
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => cleanVisualData(item, seen))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    if (seen.has(value)) return undefined;
    seen.add(value);

    const blockedKeys = new Set([
      "node",
      "element",
      "domNode",
      "root",
      "canvasElement",
      "canvasRef",
      "selectedElement",
      "hoveredElement",
      "lastClickedVisualNode",
      "editingNode",
      "ref",
      "current",
      "ownerDocument",
      "parentNode",
      "parentElement",
      "children",
      "childNodes",
      "__reactFiber",
      "__reactProps",
      "__reactInternalInstance",
      "_owner",
      "_store",
      "__sitePages",
      "__previousSitePageTitles",
    ]);

    const output: Record<string, any> = {};

    Object.entries(value).forEach(([key, item]) => {
      if (blockedKeys.has(key)) return;
      if (key.startsWith("__react")) return;
      if (key.startsWith("_react")) return;

      const cleaned = cleanVisualData(item, seen);

      if (cleaned !== undefined) {
        output[key] = cleaned;
      }
    });

    seen.delete(value);

    return output;
  }

  return undefined;
}




const BLOCKED_SAVE_KEYS = new Set([
  "node",
  "element",
  "domNode",
  "root",
  "canvasElement",
  "canvasRef",
  "selectedElement",
  "hoveredElement",
  "lastClickedVisualNode",
  "editingNode",
  "ref",
  "current",
  "ownerDocument",
  "parentNode",
  "parentElement",
  "children",
  "childNodes",
  "firstChild",
  "lastChild",
  "nextSibling",
  "previousSibling",
  "__reactFiber",
  "__reactProps",
  "_owner",
  "_store",
  /* Runtime-only nav sync helpers — must never hit the site save API. */
  "__sitePages",
  "__previousSitePageTitles",
]);

function isDomOrBrowserObject(value: any) {
  if (!value || typeof value !== "object") return false;

  if (typeof Node !== "undefined" && value instanceof Node) return true;
  if (typeof Element !== "undefined" && value instanceof Element) return true;
  if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) return true;
  if (typeof Document !== "undefined" && value instanceof Document) return true;
  if (typeof Window !== "undefined" && value instanceof Window) return true;
  if (typeof Event !== "undefined" && value instanceof Event) return true;

  return false;
}

function cleanDataForJsonSave<T = any>(value: T, depth = 0, seen = new WeakSet<object>()): T {
  if (value === null) return value;

  const valueType = typeof value;

  if (valueType === "undefined" || valueType === "function" || valueType === "symbol") {
    return undefined as T;
  }

  if (valueType === "bigint") {
    return String(value) as T;
  }

  if (valueType !== "object") {
    return value;
  }

  if (isDomOrBrowserObject(value)) {
    return undefined as T;
  }

  if (depth > 18) {
    return undefined as T;
  }

  const objectValue = value as any;

  if (seen.has(objectValue)) {
    return undefined as T;
  }

  seen.add(objectValue);

  if (Array.isArray(objectValue)) {
    return objectValue
      .map((item) => cleanDataForJsonSave(item, depth + 1, seen))
      .filter((item) => item !== undefined) as T;
  }

  if (objectValue instanceof Date) {
    return objectValue.toISOString() as T;
  }

  const output: Record<string, any> = {};

  Object.entries(objectValue).forEach(([key, item]) => {
    if (!key) return;
    if (BLOCKED_SAVE_KEYS.has(key)) return;
    if (key.startsWith("__react") || key.startsWith("_react")) return;
    if (key.includes("Fiber") || key.includes("fiber")) return;

    const cleaned = cleanDataForJsonSave(item, depth + 1, seen);

    if (cleaned !== undefined) {
      output[key] = cleaned;
    }
  });

  return output as T;
}

function buildSafeVisualPayloadForSave(visualPayload: {
  templateKey: string;
  editorMode: "visual-react" | "renderer";
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
}) {
  const cleanData = cleanDataForJsonSave<Record<string, any>>(visualPayload.data || {}) || {};
  const htmlSnapshot = String(visualPayload.htmlSnapshot || "").trim();

  return {
    templateKey: String(visualPayload.templateKey || ""),
    editorMode: visualPayload.editorMode || "visual-react",
    data: cleanData,
    updatedAt: visualPayload.updatedAt || new Date().toISOString(),
    published: Boolean(visualPayload.published),
    status: visualPayload.status,
    slug: String(visualPayload.slug || ""),
    publicUrl: String(visualPayload.publicUrl || ""),
    siteDomain: String(visualPayload.siteDomain || ""),
    domain: cleanDataForJsonSave(asPlainObject(visualPayload.domain)),
    snapshotPageId: String(visualPayload.snapshotPageId || ""),
    htmlSnapshotLength: htmlSnapshot.length,
    hasHtmlSnapshot: htmlSnapshot.length > 0,
  };
}

function readTemplateSeedFromStorage(): ReadyWebsiteTemplateSeed | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  const templateFromQuery = String(params.get("template") || "")
    .trim()
    .toLowerCase();

  const templateFromPath =
    window.location.pathname
      .match(/\/templates\/([^/]+)(?:\/|$)/i)?.[1]
      ?.trim()
      ?.toLowerCase() || "";

  const templateFromUrl = templateFromQuery || templateFromPath;

  studioDebug("readTemplateSeedFromStorage:start", {
    templateFromQuery,
    templateFromPath,
    templateFromUrl,
    href: window.location.href,
    pathname: window.location.pathname,
  });

  if (!templateFromUrl) {
    studioWarn("readTemplateSeedFromStorage:no-template-query-or-path");
    return null;
  }

  try {
    const raw = window.localStorage.getItem("bizuply-selected-template-data");

    studioDebug("readTemplateSeedFromStorage:localStorage", {
      hasRaw: Boolean(raw),
      rawLength: raw?.length || 0,
    });

    if (raw) {
      const parsed = JSON.parse(raw);

      const parsedKey = String(parsed?.key || parsed?.id || "")
        .trim()
        .toLowerCase();

      const parsedRendererKey = String(
        parsed?.rendererKey || parsed?.key || parsed?.id || "",
      )
        .trim()
        .toLowerCase();

      studioDebug("readTemplateSeedFromStorage:parsed", {
        parsedKey,
        parsedRendererKey,
        templateFromUrl,
        name: parsed?.name,
        renderMode: parsed?.renderMode,
        editorMode: parsed?.editorMode,
        blocksCount: Array.isArray(parsed?.blocks) ? parsed.blocks.length : 0,
        hasPalette: Boolean(parsed?.palette),
        hasColors: Boolean(parsed?.colors),
        hasFonts: Boolean(parsed?.fonts),
        hasLayoutSettings: Boolean(parsed?.layoutSettings),
      });

      const matchesTemplateFromUrl =
        parsedKey === templateFromUrl || parsedRendererKey === templateFromUrl;

      if (matchesTemplateFromUrl) {
        const normalizedKey = parsedKey || parsedRendererKey || templateFromUrl;
        const normalizedRendererKey =
          parsedRendererKey || parsedKey || templateFromUrl;

        const seed = {
          ...parsed,
          id: normalizedKey,
          key: normalizedKey,
          rendererKey: normalizedRendererKey,
          renderMode: parsed.renderMode || "registry",
          editorMode: parsed.editorMode || "renderer",
          name: parsed.name || normalizedKey || "Template",
          category: parsed.category || "business",
          description: parsed.description || "",
          heroTitle: parsed.heroTitle || parsed.name || "",
          heroSubtitle: parsed.heroSubtitle || parsed.description || "",
          palette: parsed.palette || parsed.colors || {},
          colors: parsed.colors || parsed.palette || {},
          fonts: parsed.fonts || {},
          layoutSettings: parsed.layoutSettings || {},
          blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
          pages: Array.isArray(parsed.pages) ? parsed.pages : [],
          editor: parsed.editor || {},
        } as ReadyWebsiteTemplateSeed;

        studioDebug("readTemplateSeedFromStorage:success-from-storage", {
          id: seed.id,
          key: (seed as any).key,
          rendererKey: (seed as any).rendererKey,
          renderMode: (seed as any).renderMode,
          editorMode: (seed as any).editorMode,
          name: seed.name,
        });

        return seed;
      }

      studioWarn("readTemplateSeedFromStorage:storage-key-mismatch-fallback-to-url", {
        parsedKey,
        parsedRendererKey,
        templateFromUrl,
      });
    }

    /*
      חשוב:
      אם אין localStorage או שיש בו תבנית אחרת,
      עדיין בונים seed מינימלי לפי ה-URL:
      /templates/chanel/preview
      כדי שהתבנית תיכנס ל-React renderer ולא ל-GrapesJS סטטי.
    */
    const renderer = getStudioTemplateRenderer(templateFromUrl);

    if (renderer?.Component) {
      const fallbackSeed = {
        id: templateFromUrl,
        key: templateFromUrl,
        rendererKey: templateFromUrl,
        renderMode: "registry",
        editorMode: "renderer",
        name: renderer.name || templateFromUrl,
        category: "business",
        description: "",
        heroTitle: renderer.name || templateFromUrl,
        heroSubtitle: "",
        palette: {},
        colors: {},
        fonts: {},
        layoutSettings: {},
        blocks: [],
        pages: [],
        editor: {
          slug: templateFromUrl,
          activePageId: "home",
          pages: [],
        },
      } as unknown as ReadyWebsiteTemplateSeed;

      studioDebug("readTemplateSeedFromStorage:success-from-url-renderer", {
        templateFromUrl,
        rendererKey: renderer.key,
        rendererName: renderer.name,
      });

      return fallbackSeed;
    }

    studioWarn("readTemplateSeedFromStorage:no-renderer-found", {
      templateFromUrl,
    });

    return null;
  } catch (error) {
    studioError("readTemplateSeedFromStorage:error", error);
    return null;
  }
}

type WebsiteStudioPageRuntimeProps = WebsiteStudioPageProps & {
  initialTemplateId?: string;
  initialTemplateSeed?: ReadyWebsiteTemplateSeed;
  forceTemplateLoad?: boolean;
};

type VisualTemplateSavePayload = {
  templateKey: string;
  editorMode: "visual-react" | "renderer";
  data?: Record<string, any>;
  templateData?: Record<string, any>;
  projectData?: Record<string, any>;
  visualEditorPayload?: Record<string, any>;
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
  /** Site-wide custom code (CSS/Head/Body/JS) */
  customCode?: Record<string, any>;
};


type BuiltTemplatePages = {
  slug: string;
  pages: StudioSitePageWithPortal[];
  activePageId: string;
};

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSeedPaletteValue(
  seed: ReadyWebsiteTemplateSeed,
  key:
    | "primary"
    | "secondary"
    | "accent"
    | "background"
    | "surface"
    | "text"
    | "muted"
    | "dark",
  fallback: string,
) {
  const palette = seed.palette as Record<string, string> | undefined;
  return palette?.[key] || fallback;
}

function createTemplateCss(seed: ReadyWebsiteTemplateSeed) {
  const primary = getSeedPaletteValue(seed, "primary", "#2F241B");
  const secondary = getSeedPaletteValue(seed, "secondary", "#6D5A49");
  const accent = getSeedPaletteValue(seed, "accent", "#9A6F3B");
  const background = getSeedPaletteValue(seed, "background", "#F6F2EA");
  const text = getSeedPaletteValue(seed, "text", "#27231f");
  const muted = getSeedPaletteValue(seed, "muted", "#756b60");

  return `${defaultCanvasCss}\n\n
:root {
  --biz-primary: ${primary};
  --biz-secondary: ${secondary};
  --biz-accent: ${accent};
  --biz-bg: ${background};
  --biz-text: ${text};
  --biz-muted: ${muted};
}

.bizuply-template-site {
  background: var(--biz-bg);
  color: var(--biz-text);
  font-family: Inter, Arial, sans-serif;
}

.bizuply-template-site h1,
.bizuply-template-site h2,
.bizuply-template-site .serif-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 400;
  letter-spacing: -0.055em;
}

.bizuply-template-site a,
.bizuply-template-site button {
  cursor: pointer;
}

.bizuply-reveal-up {
  animation: bizuplyRevealUp 0.8s ease both;
}

.bizuply-float-soft {
  animation: bizuplyFloatSoft 4.8s ease-in-out infinite;
}

.bizuply-marquee-track {
  animation: bizuplyMarquee 28s linear infinite;
}

@keyframes bizuplyRevealUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bizuplyFloatSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

@keyframes bizuplyMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

[data-section-kind] {
  scroll-margin-top: 120px;
}
`;
}

function createVelmoraShellHtml(content: string, activeLabel: string) {
  return `
<main data-studio-page="true" data-bizuply-site="true" data-template-id="velmora" dir="rtl" class="bizuply-template-site min-h-screen bg-[#f6f2ea] text-[#27231f]">
  <header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-40 bg-[#f6f2ea]/90 px-4 py-4 backdrop-blur-xl">
    <div class="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center rounded-[10px] border border-black/10 bg-white/90 px-5 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
      <nav class="hidden items-center gap-8 text-sm font-bold text-black/55 lg:flex">
        <a data-editable-link="true" href="#about" class="hover:text-black">אודות</a>
        <a data-editable-link="true" href="#shop" class="hover:text-black">חנות</a>
        <a data-editable-link="true" href="#collections" class="hover:text-black">קולקציות</a>
      </nav>
      <div class="text-center">
        <div class="serif-title text-[28px] uppercase tracking-[0.08em] text-[#27231f]">ATELIER NOA</div>
        <div class="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-black/45">Boutique</div>
      </div>
      <nav class="hidden items-center justify-end gap-8 text-sm font-bold text-black/55 lg:flex">
        <a data-editable-link="true" href="#styling" class="hover:text-black">סטיילינג</a>
        <a data-editable-link="true" href="#contact" class="hover:text-black">צור קשר</a>
        <a data-editable-link="true" href="#cart" class="rounded-[5px] bg-[#292318] px-5 py-3 text-white hover:bg-black">סל קניות</a>
      </nav>
    </div>
  </header>

  ${content}

  <footer data-section-kind="footer" data-section-title="Footer" class="border-t border-black/10 bg-[#e8dfcf] px-6 py-14">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
      <section>
        <div class="serif-title text-4xl uppercase tracking-[0.08em]">ATELIER NOA</div>
        <p class="mt-5 max-w-md text-sm leading-8 text-black/55">אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה לכל קהל יעד.</p>
        <div class="mt-7 flex flex-wrap gap-2"><span class="rounded-full border border-black/10 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black/45">Fashion Store</span><span class="rounded-full border border-black/10 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black/45">RTL</span></div>
      </section>
      <section><h3 class="mb-4 border-b border-black/10 pb-3 text-sm font-black">עמודי האתר</h3><div class="grid gap-3 text-sm text-black/55"><a>בית</a><a>אודות</a><a>חנות</a><a>קולקציות</a><a>סטיילינג</a><a>צור קשר</a></div></section>
      <section><h3 class="mb-4 border-b border-black/10 pb-3 text-sm font-black">מידע חשוב</h3><div class="grid gap-3 text-sm text-black/55"><a>תקנון אתר</a><a>מדיניות פרטיות</a><a>נגישות</a></div></section>
      <section><h3 class="mb-4 border-b border-black/10 pb-3 text-sm font-black">שירות לקוחות</h3><div class="grid gap-3 text-sm text-black/55"><a>שאלות נפוצות</a><a>משלוחים והחזרות</a><a>שירות והזמנות</a></div><a data-editable-link="true" href="#contact" class="mt-6 inline-flex rounded-[4px] bg-[#292318] px-5 py-3 text-sm font-bold text-white">יצירת קשר</a></section>
    </div>
  </footer>
</main>`;
}

function createVelmoraHomeContent(seed: ReadyWebsiteTemplateSeed) {
  const heroTitle = escapeHtml(seed.heroTitle || "אופנה שמרגישה בדיוק נכון");
  const heroSubtitle = escapeHtml(
    seed.heroSubtitle ||
      "בוטיק אופנה נקי, מדויק וגמיש לעריכה מלאה בתוך BizUply.",
  );

  const galleryImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=90",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=90",
  ];

  const productCards = [
    ["שמלת NOA", "₪349", galleryImages[5]],
    [
      "תיק Resort",
      "₪260",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=90",
    ],
    ["חליפת Atelier", "₪390", galleryImages[2]],
    ["חולצת Silk", "₪190", galleryImages[3]],
  ];

  return `
  <section id="hero" data-section-kind="hero" data-section-title="Hero" class="overflow-hidden px-6 pb-24 pt-24 text-center">
    <p class="bizuply-reveal-up mx-auto max-w-3xl text-sm font-bold tracking-[0.28em] text-black/40">בוטיק אופנה · סטיילינג אישי · קולקציות נבחרות</p>
    <h1 class="serif-title bizuply-reveal-up mx-auto mt-8 max-w-5xl text-[64px] leading-[0.95] text-[#2f241b] md:text-[92px]">${heroTitle}</h1>
    <p class="bizuply-reveal-up mx-auto mt-7 max-w-3xl text-lg leading-9 text-black/55">${heroSubtitle}</p>
    <a data-editable-link="true" href="#shop" class="bizuply-reveal-up mt-9 inline-flex rounded-[4px] bg-[#292318] px-9 py-4 text-sm font-black text-white">לכל הקולקציות</a>
    <div class="mx-auto mt-20 flex max-w-6xl items-end justify-center gap-4 overflow-hidden">
      ${galleryImages.map((image, index) => `<img data-section-kind="gallery" data-section-title="Hero card ${index + 1}" class="bizuply-float-soft h-[${index === 2 ? "360" : index === 1 || index === 3 ? "300" : "240"}px] w-[${index === 2 ? "190" : "155"}px] rounded-t-3xl object-cover shadow-2xl" src="${image}" />`).join("")}
    </div>
  </section>

  <section id="about" data-section-kind="about" data-section-title="About" class="grid min-h-[760px] bg-white lg:grid-cols-2">
    <div class="flex flex-col justify-between px-8 py-20 lg:px-16"><div><p class="text-sm font-black uppercase tracking-[0.22em] text-black/40">About</p><h2 class="serif-title mt-8 max-w-xl text-6xl leading-tight text-[#2f241b]">סגנון שמתחיל בפרטים הקטנים</h2></div><div class="grid gap-8 text-base leading-8 text-black/55 md:grid-cols-2"><p>כאן אפשר לערוך את סיפור המותג, החזון והסגנון של העסק.</p><p>העמוד בנוי מבלוקים שניתנים לבחירה, שינוי, מחיקה ושכפול.</p></div></div>
    <img class="h-full min-h-[620px] w-full object-cover" src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=90" />
  </section>

  <section id="shop" data-section-kind="store" data-section-title="Shop Products" class="bg-[#f6f2ea] px-6 py-24"><div class="mx-auto max-w-7xl"><div class="mb-12 flex items-end justify-between gap-6"><div><p class="text-sm font-black uppercase tracking-[0.22em] text-black/40">Shop</p><h2 class="serif-title mt-4 text-6xl">מוצרים נבחרים</h2></div><a data-editable-link="true" href="#shop" class="rounded-md border border-black/15 bg-white px-6 py-3 text-sm font-black">מעבר לחנות</a></div><div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">${productCards.map(([title, price, image]) => `<article data-section-kind="product" data-section-title="${title}" class="group overflow-hidden rounded-xl bg-white shadow-sm"><img class="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105" src="${image}" /><div class="p-5"><p class="text-xs font-black uppercase tracking-[0.18em] text-black/35">REF. VLM</p><h3 class="mt-2 text-2xl font-black">${title}</h3><p class="mt-3 text-lg font-black">${price}</p></div></article>`).join("")}</div></div></section>

  <section id="collections" data-section-kind="gallery" data-section-title="Moving Gallery" class="overflow-hidden bg-white py-24"><div class="px-6"><h2 class="serif-title text-6xl">קולקציות שנבחרו בקפידה</h2></div><div class="mt-12 overflow-hidden"><div class="bizuply-marquee-track flex w-max gap-5 px-6">${[...galleryImages, ...galleryImages].map((image) => `<img class="h-[360px] w-[260px] shrink-0 object-cover shadow-lg" src="${image}" />`).join("")}</div></div></section>

  <section id="styling" data-section-kind="services" data-section-title="Personal Styling" class="bg-[#f6f2ea] px-6 py-28"><div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div><p class="text-sm font-black uppercase tracking-[0.22em] text-black/40">Custom</p><h2 class="serif-title mt-5 text-6xl leading-tight">סטיילינג אישי שמותאם לקהל שלך</h2><p class="mt-6 max-w-xl text-lg leading-9 text-black/55">בלוק שירותים לעריכה מלאה: תהליך עבודה, המלצות, התאמה אישית וטופס פנייה.</p></div><div class="grid grid-cols-2 gap-5"><img class="h-[420px] w-full object-cover" src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90" /><img class="mt-16 h-[420px] w-full object-cover" src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90" /></div></div></section>

  <section id="contact" data-section-kind="contact" data-section-title="Contact" class="bg-white px-6 py-24"><div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p class="text-sm font-black uppercase tracking-[0.22em] text-black/40">Contact</p><h2 class="serif-title mt-5 text-6xl">יצירת קשר</h2><p class="mt-6 text-lg leading-9 text-black/55">אפשר לערוך כאן פרטי עסק, טופס, שעות פעילות וקישורים.</p></div><form class="grid gap-4 rounded-xl border border-black/10 bg-[#f6f2ea] p-7"><input class="h-14 rounded-md border border-black/10 bg-white px-4 text-sm" placeholder="שם מלא" /><input class="h-14 rounded-md border border-black/10 bg-white px-4 text-sm" placeholder="טלפון" /><input class="h-14 rounded-md border border-black/10 bg-white px-4 text-sm" placeholder="אימייל" /><textarea class="min-h-[140px] rounded-md border border-black/10 bg-white p-4 text-sm" placeholder="הודעה"></textarea><button class="h-14 rounded-md bg-[#292318] font-black text-white">שליחה</button></form></div></section>`;
}

function createVelmoraInfoContent(title: string, eyebrow: string) {
  return `<section data-section-kind="info" data-section-title="${escapeHtml(title)}" class="bg-[#f6f2ea] px-6 py-24"><div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[320px_1fr]"><aside class="h-fit rounded-xl border border-black/10 bg-white/70 p-6 shadow-xl"><p class="text-xs font-black uppercase tracking-[0.22em] text-black/35">${escapeHtml(eyebrow)}</p><h1 class="serif-title mt-4 text-5xl text-[#2f241b]">${escapeHtml(title)}</h1><p class="mt-4 text-sm leading-7 text-black/55">עמוד דוגמה לעריכה מלאה בעורך.</p></aside><article class="rounded-xl border border-black/10 bg-white p-10 shadow-xl"><p class="text-sm tracking-[0.26em] text-black/40">${escapeHtml(eyebrow)}</p><h2 class="serif-title mt-5 text-6xl text-[#2f241b]">${escapeHtml(title)}</h2><p class="mt-8 max-w-3xl text-lg leading-9 text-black/60">כאן מחליפים את התוכן לטקסט אמיתי של העסק. המבנה כולל כותרת, פתיח, סעיפים, כרטיסים וכפתורי מעבר.</p>${["כללי", "פרטים חשובים", "יצירת קשר", "עדכון אחרון"].map((item, i) => `<section data-section-kind="basic" data-section-title="${item}" class="mt-8 border-t border-black/10 pt-7"><h3 class="serif-title text-4xl">${i + 1}. ${item}</h3><p class="mt-4 leading-8 text-black/55">טקסט דוגמה בלבד. ניתן לערוך, למחוק, לשכפל ולהוסיף בלוקים נוספים.</p></section>`).join("")}</article></div></section>`;
}

function createVelmoraShopContent() {
  const images = [
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=90",
  ];
  const products = Array.from({ length: 24 }).map((_, index) => ({
    title: `פריט בוטיק ${index + 1}`,
    price: `₪${169 + index * 10}`,
    image: images[index % images.length],
  }));
  return `<section id="shop" data-section-kind="store" data-section-title="Shop Page" class="bg-[#f6f2ea] px-6 py-24"><div class="mx-auto max-w-7xl"><p class="text-sm font-black uppercase tracking-[0.22em] text-black/40">Shop</p><h1 class="serif-title mt-5 text-7xl text-[#2f241b]">חנות</h1><p class="mt-6 max-w-2xl text-lg leading-9 text-black/55">עמוד חנות מלא לדוגמה עם מוצרים, מחירים ותמונות להחלפה.</p><div class="mt-12 grid gap-6 md:grid-cols-3 xl:grid-cols-4">${products.map((product) => `<article data-section-kind="product" data-section-title="${product.title}" class="group overflow-hidden rounded-xl bg-white shadow-sm"><img class="h-[330px] w-full object-cover transition duration-700 group-hover:scale-105" src="${product.image}" /><div class="p-5"><h3 class="text-xl font-black">${product.title}</h3><p class="mt-2 font-black">${product.price}</p><a data-editable-link="true" href="#product" class="mt-4 inline-flex rounded-md bg-[#292318] px-4 py-2 text-xs font-black text-white">צפייה במוצר</a></div></article>`).join("")}</div></div></section>`;
}


function normalizeStudioTemplateKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getSeedRendererKey(seed: ReadyWebsiteTemplateSeed) {
  return normalizeStudioTemplateKey(
    (seed as any).rendererKey || (seed as any).key || seed.id,
  );
}

function getSeedRenderMode(seed: ReadyWebsiteTemplateSeed) {
  return (seed as any).renderMode === "blocks" ? "blocks" : "registry";
}

function getSeedEditorMode(seed: ReadyWebsiteTemplateSeed) {
  return (seed as any).editorMode === "blocks" ? "blocks" : "renderer";
}

function shouldUseTemplateRenderer(seed: ReadyWebsiteTemplateSeed) {
  const rendererKey = getSeedRendererKey(seed);
  const renderMode = getSeedRenderMode(seed);
  const editorMode = getSeedEditorMode(seed);

  return Boolean(rendererKey) && (renderMode === "registry" || editorMode === "renderer");
}

function getTemplateRendererBySeed(seed: ReadyWebsiteTemplateSeed) {
  const id = normalizeStudioTemplateKey(seed.id);
  const key = normalizeStudioTemplateKey((seed as any).key);
  const rendererKey = getSeedRendererKey(seed);

  const rendererByRendererKey = rendererKey
    ? getStudioTemplateRenderer(rendererKey)
    : null;

  const rendererByKey =
    rendererByRendererKey || !key ? null : getStudioTemplateRenderer(key);

  const rendererById =
    rendererByRendererKey || rendererByKey || !id
      ? null
      : getStudioTemplateRenderer(id);

  const renderer = rendererByRendererKey || rendererByKey || rendererById;

  studioDebug("getTemplateRendererBySeed", {
    id,
    key,
    rendererKey,
    renderMode: getSeedRenderMode(seed),
    editorMode: getSeedEditorMode(seed),
    found: Boolean(renderer),
    foundBy: rendererByRendererKey
      ? "rendererKey"
      : rendererByKey
        ? "key"
        : rendererById
          ? "id"
          : "none",
    foundRendererKey: renderer?.key,
    rendererName: renderer?.name,
    rendererPagesCount: Array.isArray(renderer?.pages)
      ? renderer.pages.length
      : 0,
  });

  return renderer;
}

function getTemplateIdFromSeed(seed: ReadyWebsiteTemplateSeed) {
  return getSeedRendererKey(seed) || normalizeStudioTemplateKey(seed.id);
}

function getTitleFromHtmlSlice(htmlSlice: string, fallback: string) {
  const headingMatch = htmlSlice.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
  const raw = headingMatch?.[1] || "";
  const clean = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  return clean || fallback;
}

function inferEditableSectionKind(
  tagName: string,
  htmlSlice: string,
  index: number,
) {
  const tag = String(tagName || "").toLowerCase();
  const source = String(htmlSlice || "").toLowerCase();

  if (tag === "header") return "header";
  if (tag === "footer") return "footer";

  if (
    source.includes("contact") ||
    source.includes("צור קשר") ||
    source.includes("יצירת קשר")
  ) {
    return "contact";
  }

  if (
    source.includes("cart") ||
    source.includes("checkout") ||
    source.includes("סל קניות")
  ) {
    return "cart";
  }

  if (
    source.includes("shop") ||
    source.includes("store") ||
    source.includes("product") ||
    source.includes("חנות") ||
    source.includes("מוצרים")
  ) {
    return "store";
  }

  if (
    source.includes("gallery") ||
    source.includes("collection") ||
    source.includes("collections") ||
    source.includes("קולקציות") ||
    source.includes("גלר")
  ) {
    return "gallery";
  }

  if (
    source.includes("about") ||
    source.includes("אודות")
  ) {
    return "about";
  }

  if (
    source.includes("styling") ||
    source.includes("services") ||
    source.includes("service") ||
    source.includes("סטיילינג") ||
    source.includes("שירות")
  ) {
    return "services";
  }

  if (
    source.includes("testimonial") ||
    source.includes("review") ||
    source.includes("המלצות") ||
    source.includes("ביקורות")
  ) {
    return "testimonials";
  }

  if (index <= 2) return "hero";

  return "section";
}

function normalizeRendererSectionKind(value: unknown) {
  const clean = String(value || "").trim();
  return clean || "section";
}

function normalizeRendererSectionTitle(value: unknown) {
  const clean = String(value || "").trim();
  if (!clean) return "Section";
  return sectionKindLabels[clean] || clean;
}

function ensureEditableSectionMarkers(
  html: string,
  templateId: string,
  rendererPage?: any,
) {
  const pageSections = Array.isArray(rendererPage?.sections)
    ? rendererPage.sections.map(normalizeRendererSectionKind)
    : [];

  const regularSectionKinds = pageSections.filter(
    (kind: string) => kind !== "header" && kind !== "footer",
  );

  let regularSectionIndex = 0;
  let editableIndex = 0;

  const markedHtml = String(html || "").replace(
    /<(header|section|footer)(\s[^>]*)?>/gi,
    (
      fullMatch: string,
      tagName: string,
      attrs: string = "",
      offset: number,
      fullHtml: string,
    ) => {
      if (
        /data-section-kind\s*=/i.test(fullMatch) ||
        /data-bizuply-block\s*=/i.test(fullMatch)
      ) {
        if (!/data-bizuply-editor-section\s*=/i.test(fullMatch)) {
          return fullMatch.replace(
            />$/,
            ' data-bizuply-editor-section="true">',
          );
        }

        return fullMatch;
      }

      const lowerTag = String(tagName || "").toLowerCase();
      let kind = "section";

      if (lowerTag === "header") {
        kind = "header";
      } else if (lowerTag === "footer") {
        kind = "footer";
      } else if (regularSectionKinds[regularSectionIndex]) {
        kind = regularSectionKinds[regularSectionIndex];
        regularSectionIndex += 1;
      } else {
        const htmlSlice = fullHtml.slice(offset, offset + 2400);
        kind = inferEditableSectionKind(tagName, htmlSlice, editableIndex + 1);
      }

      editableIndex += 1;

      const htmlSlice = fullHtml.slice(offset, offset + 2400);
      const fallbackTitle = normalizeRendererSectionTitle(kind);
      const title = getTitleFromHtmlSlice(htmlSlice, fallbackTitle);
      const safeTitle = escapeHtml(title);
      const safeKind = escapeHtml(kind);
      const editorMarker =
        pageSections.length === 0 ||
        pageSections.includes(kind) ||
        lowerTag === "header" ||
        lowerTag === "footer";

      return `<${tagName}${attrs || ""} data-section-kind="${safeKind}" data-section-title="${safeTitle}"${
        editorMarker ? ' data-bizuply-editor-section="true"' : ""
      }>`;
    },
  );

  studioDebug("ensureEditableSectionMarkers", {
    templateId,
    pageId: rendererPage?.id,
    pageSections,
    beforeDataSectionKindCount:
      (String(html || "").match(/data-section-kind=/g) || []).length,
    afterDataSectionKindCount:
      (markedHtml.match(/data-section-kind=/g) || []).length,
    editorSectionCount:
      (markedHtml.match(/data-bizuply-editor-section="true"/g) || []).length,
    htmlLength: markedHtml.length,
  });

  return markedHtml;
}


function normalizeStaticTemplateRuntimeHtml(html: string) {
  return String(html || "").replace(
    /class="([^"]*transition-all[^"]*ease-out[^"]*opacity-0[^"]*)"/g,
    (_fullMatch: string, className: string) => {
      const visibleClassName = String(className)
        .replace(/\btranslate-y-10\b/g, "translate-y-0")
        .replace(/\btranslate-y-12\b/g, "translate-y-0")
        .replace(/\bopacity-0\b/g, "opacity-100");

      return `class="${visibleClassName}"`;
    },
  );
}

function renderRegisteredTemplateToStaticHtml(
  seed: ReadyWebsiteTemplateSeed,
  rendererPage?: any,
  data?: Record<string, any>,
) {
  const renderer = getTemplateRendererBySeed(seed);
  const templateId = getTemplateIdFromSeed(seed);

  const pageId = String(rendererPage?.id || "home");
  const rawSlug = String(rendererPage?.slug || pageId || "").trim();

  const pageSlug =
    pageId === "home" || rawSlug === "/" || rawSlug === ""
      ? "/"
      : rawSlug.startsWith("/")
        ? rawSlug
        : `/${rawSlug}`;

  if (!renderer?.Component) {
    studioWarn("renderRegisteredTemplateToStaticHtml:no-renderer-component", {
      templateId,
      pageId,
      pageSlug,
    });
    return "";
  }

  try {
    const TemplateComponent = renderer.Component as React.ComponentType<any>;

    const rawHtml = renderToStaticMarkup(
      <TemplateComponent
        initialPage={pageId}
        initialPageId={pageId}
        activePageId={pageId}
        currentPageId={pageId}
        pageId={pageId}
        initialSlug={pageSlug}
        activePageSlug={pageSlug}
        currentPageSlug={pageSlug}
        pageSlug={pageSlug}
        mode="public"
        data={data}
        templateData={data}
        isStudioStatic
      />,
    );

    let visibleStaticHtml = normalizeStaticTemplateRuntimeHtml(rawHtml);

    /*
      הגנה חשובה:
      אם קומפוננטת התבנית עדיין רינדרה בפנים home,
      מתקנים את ה-data attributes לפני שמירה למונגו.
    */
    visibleStaticHtml = visibleStaticHtml
      .replace(
        /data-active-page-id="[^"]*"/g,
        `data-active-page-id="${escapeHtml(pageId)}"`,
      )
      .replace(
        /data-active-page-slug="[^"]*"/g,
        `data-active-page-slug="${escapeHtml(pageSlug)}"`,
      );

    const editableHtml = ensureEditableSectionMarkers(
      visibleStaticHtml,
      templateId,
      rendererPage,
    );

    studioDebug("renderRegisteredTemplateToStaticHtml:success", {
      templateId,
      pageId,
      pageSlug,
      rendererKey: renderer.key,
      rendererName: renderer.name,
      rawHtmlLength: rawHtml.length,
      editableHtmlLength: editableHtml.length,
      activePageIdInHtml:
        editableHtml.match(/data-active-page-id="([^"]*)"/)?.[1] || "",
      activePageSlugInHtml:
        editableHtml.match(/data-active-page-slug="([^"]*)"/)?.[1] || "",
      sample: editableHtml.slice(0, 300),
    });

    return `
<div
  data-studio-page="true"
  data-bizuply-site="true"
  data-template-id="${escapeHtml(templateId)}"
  data-template-page-id="${escapeHtml(pageId)}"
  data-template-page-slug="${escapeHtml(pageSlug)}"
  class="min-h-screen"
>
  ${editableHtml}
</div>`;
  } catch (error) {
    studioError("renderRegisteredTemplateToStaticHtml:error", {
      templateId,
      pageId,
      pageSlug,
      error,
    });
    return "";
  }
}

function createRegisteredTemplateCss(seed: ReadyWebsiteTemplateSeed) {
  const templateId = getTemplateIdFromSeed(seed);
  const safeTemplateId = escapeHtml(templateId);
  const renderer = getTemplateRendererBySeed(seed);
  const templateEditorCss = String((renderer as any)?.editorCss || "");

  return `${defaultCanvasCss}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  overflow-x: hidden;
}

[data-bizuply-site="true"] {
  min-height: 100vh;
}

[data-template-id="${safeTemplateId}"] {
  direction: rtl;
  min-height: 100vh;
}

[data-template-id="${safeTemplateId}"],
[data-template-id="${safeTemplateId}"] * {
  box-sizing: border-box;
}

[data-template-id="${safeTemplateId}"] img,
[data-template-id="${safeTemplateId}"] video {
  display: block;
  max-width: 100%;
}

[data-template-id="${safeTemplateId}"] a,
[data-template-id="${safeTemplateId}"] button {
  cursor: pointer;
}

/*
  CSS כללי לעורך בלבד.
  לא שמים כאן אפקטים ספציפיים של תבנית.
  כל תבנית מוסיפה CSS משלה דרך templateRendererRegistry -> editorCss.
*/
[data-template-id="${safeTemplateId}"] .serif-title,
[data-template-id="${safeTemplateId}"] [class*="font-family:Georgia"],
[data-template-id="${safeTemplateId}"] [class*="Georgia"] {
  font-family: Georgia, 'Times New Roman', serif;
}

[data-template-id="${safeTemplateId}"] [style*="visibility:hidden"],
[data-template-id="${safeTemplateId}"] [style*="visibility: hidden"] {
  visibility: visible !important;
}

[data-section-kind] {
  scroll-margin-top: 120px;
}

/* Template-specific editor CSS */
${templateEditorCss}
`;
}

function createPagesFromRegisteredRenderer(
  seed: ReadyWebsiteTemplateSeed,
  data?: Record<string, any>,
): BuiltTemplatePages | null {
  const renderer = getTemplateRendererBySeed(seed);
  const templateId = getTemplateIdFromSeed(seed);

  if (!renderer?.Component) {
    studioWarn("createPagesFromRegisteredRenderer:no-renderer", {
      templateId,
      seedName: seed.name,
      seedKey: (seed as any).key,
    });
    return null;
  }

  const now = new Date().toISOString();
  const css = createRegisteredTemplateCss(seed);

  const rendererPages =
    Array.isArray(renderer.pages) && renderer.pages.length
      ? renderer.pages
      : [
          {
            id: "home",
            name: seed.name || "Home",
            slug: "/",
            sections: ["header", "hero", "footer"],
          },
        ];

  studioDebug("createPagesFromRegisteredRenderer:pages-source", {
    templateId,
    rendererKey: renderer.key,
    rendererPagesCount: rendererPages.length,
  });

  const pages = rendererPages.map((page: any, index: number) => {
    const pageId = String(page.id || `page-${index + 1}`);
    const isHome = pageId === "home" || page.slug === "/" || index === 0;
    const cleanSlug = isHome
      ? ""
      : String(page.slug || pageId).replace(/^\//, "").replace(/\/$/, "");
    const html = renderRegisteredTemplateToStaticHtml(seed, page, data);

    return {
      id: pageId,
      title: String(page.name || page.title || pageId),
      slug: cleanSlug,
      type: (isHome ? "home" : pageId === "shop" ? "store" : "blank") as StudioSitePageType,
      isHome,
      html,
      css,
      createdAt: now,
      updatedAt: now,
      clientPortal: createDefaultClientPortalConfig(),
    };
  });

  const built = {
    slug: normalizeBusinessSlug(getSeedRendererKey(seed) || seed.name || "template") || "template",
    activePageId: pages.find((page) => page.isHome)?.id || pages[0]?.id || "home",
    pages,
  };

  studioDebug("createPagesFromRegisteredRenderer:built-1-to-1", {
    templateId,
    slug: built.slug,
    activePageId: built.activePageId,
    pagesCount: built.pages.length,
    pages: built.pages.map((page) => ({
      id: page.id,
      title: page.title,
      htmlLength: String(page.html || "").length,
      editorSectionCount:
        (String(page.html || "").match(/data-bizuply-editor-section="true"/g) || []).length,
    })),
  });

  return built;
}

function createVelmoraTemplatePages(
  seed: ReadyWebsiteTemplateSeed,
): BuiltTemplatePages {
  const now = new Date().toISOString();
  const css = createTemplateCss(seed);
  const pageInputs = [
    {
      id: "home",
      title: "דף הבית",
      slug: "",
      type: "home",
      isHome: true,
      content: createVelmoraHomeContent(seed),
    },
    {
      id: "shop",
      title: "חנות",
      slug: "shop",
      type: "store",
      content: createVelmoraShopContent(),
    },
    {
      id: "product",
      title: "עמוד מוצר",
      slug: "product",
      type: "product",
      content: createVelmoraInfoContent("עמוד מוצר", "PRODUCT"),
    },
    {
      id: "about",
      title: "אודות",
      slug: "about",
      type: "about",
      content: createVelmoraInfoContent("אודות", "ABOUT"),
    },
    {
      id: "projects",
      title: "קולקציות",
      slug: "collections",
      type: "gallery",
      content: createVelmoraInfoContent("קולקציות", "COLLECTIONS"),
    },
    {
      id: "custom",
      title: "סטיילינג",
      slug: "styling",
      type: "services",
      content: createVelmoraInfoContent("סטיילינג אישי", "CUSTOM"),
    },
    {
      id: "contact",
      title: "צור קשר",
      slug: "contact",
      type: "contact",
      content: createVelmoraInfoContent("צור קשר", "CONTACT"),
    },
    {
      id: "cart",
      title: "סל קניות",
      slug: "cart",
      type: "cart",
      content: createVelmoraInfoContent("סל קניות", "CART"),
    },
    {
      id: "terms",
      title: "תקנון אתר",
      slug: "terms",
      type: "info",
      content: createVelmoraInfoContent("תקנון אתר", "TERMS"),
    },
    {
      id: "privacy",
      title: "מדיניות פרטיות",
      slug: "privacy",
      type: "info",
      content: createVelmoraInfoContent("מדיניות פרטיות", "PRIVACY"),
    },
    {
      id: "accessibility",
      title: "נגישות",
      slug: "accessibility",
      type: "info",
      content: createVelmoraInfoContent("נגישות", "ACCESSIBILITY"),
    },
    {
      id: "faq",
      title: "שאלות נפוצות",
      slug: "faq",
      type: "info",
      content: createVelmoraInfoContent("שאלות נפוצות", "FAQ"),
    },
    {
      id: "shipping",
      title: "משלוחים והחזרות",
      slug: "shipping",
      type: "info",
      content: createVelmoraInfoContent("משלוחים והחזרות", "SHIPPING"),
    },
    {
      id: "orders",
      title: "שירות והזמנות",
      slug: "orders",
      type: "info",
      content: createVelmoraInfoContent("שירות והזמנות", "ORDERS"),
    },
  ];

  return {
    slug: normalizeBusinessSlug(seed.id || seed.name || "velmora") || "velmora",
    activePageId: "home",
    pages: pageInputs.map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      type: page.type as StudioSitePageType,
      isHome: Boolean(page.isHome),
      html: createVelmoraShellHtml(page.content, page.title),
      css,
      createdAt: now,
      updatedAt: now,
      clientPortal: createDefaultClientPortalConfig(),
    })),
  };
}

function createGenericTemplatePages(
  seed: ReadyWebsiteTemplateSeed,
): BuiltTemplatePages {
  const now = new Date().toISOString();
  const primary = getSeedPaletteValue(seed, "primary", "#0f172a");
  const background = getSeedPaletteValue(seed, "background", "#ffffff");
  const text = getSeedPaletteValue(seed, "text", "#0f172a");
  const muted = getSeedPaletteValue(seed, "muted", "#64748b");
  const name = escapeHtml(seed.name || "BizUply Template");
  const title = escapeHtml(seed.heroTitle || seed.name || "אתר עסקי מוכן");
  const subtitle = escapeHtml(
    seed.heroSubtitle || seed.description || "תבנית אתר מוכנה לעריכה מלאה.",
  );

  const sections = (Array.isArray(seed.blocks) ? seed.blocks : [])
    .map((block: any, index) => {
      const kind = escapeHtml(block.type || "section");
      const blockTitle = escapeHtml(block.title || `${kind} ${index + 1}`);
      return `<section id="${kind}-${index}" data-section-kind="${kind}" data-section-title="${blockTitle}" class="px-6 py-24" style="background:${index % 2 ? "#ffffff" : background};color:${text};"><div class="mx-auto max-w-6xl"><p class="text-sm font-black uppercase tracking-[0.24em]" style="color:${muted};">${kind}</p><h2 class="mt-4 text-5xl font-black tracking-[-0.05em]">${blockTitle}</h2><p class="mt-5 max-w-2xl text-base leading-8" style="color:${muted};">בלוק מוכן מתוך התבנית. אפשר לבחור אותו, לערוך טקסטים, לשנות צבעים ולהחליף תמונות.</p></div></section>`;
    })
    .join("");

  const html = `<main data-studio-page="true" data-bizuply-site="true" data-template-id="${escapeHtml(getTemplateIdFromSeed(seed))}" class="bizuply-template-site min-h-screen" style="background:${background};color:${text};"><header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-40 bg-white/90 px-6 py-5 backdrop-blur-xl"><div class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm"><div class="text-2xl font-black">${name}</div><nav class="hidden gap-6 text-sm font-bold text-slate-500 md:flex"><a data-editable-link="true" href="#about">אודות</a><a data-editable-link="true" href="#services">שירותים</a><a data-editable-link="true" href="#contact">צור קשר</a></nav></div></header><section id="hero" data-section-kind="hero" data-section-title="Hero" class="px-6 py-28 text-center"><h1 class="mx-auto max-w-5xl text-6xl font-black tracking-[-0.06em] md:text-8xl">${title}</h1><p class="mx-auto mt-7 max-w-2xl text-lg leading-9" style="color:${muted};">${subtitle}</p><a data-editable-link="true" href="#contact" class="mt-9 inline-flex rounded-2xl px-8 py-4 text-sm font-black text-white" style="background:${primary};">יצירת קשר</a></section>${sections}<footer data-section-kind="footer" data-section-title="Footer" class="px-6 py-14" style="background:${primary};color:white;"><div class="mx-auto max-w-6xl"><div class="text-3xl font-black">${name}</div><p class="mt-3 max-w-md text-sm leading-7 text-white/70">${escapeHtml(seed.description || "")}</p></div></footer></main>`;

  return {
    slug:
      normalizeBusinessSlug(seed.id || seed.name || "template") || "template",
    activePageId: "home",
    pages: [
      {
        id: "home",
        title: "דף הבית",
        slug: "",
        type: "home",
        isHome: true,
        html,
        css: createTemplateCss(seed),
        createdAt: now,
        updatedAt: now,
        clientPortal: createDefaultClientPortalConfig(),
      },
    ],
  };
}

function isVelmoraTemplate(seed: ReadyWebsiteTemplateSeed) {
  const id = String(seed.id || "").trim().toLowerCase();
  const name = String(seed.name || "").trim().toLowerCase();

  return id === "velmora" || name.includes("velmora");
}

function hasUsefulTemplateHtml(pages: StudioSitePageWithPortal[]) {
  const homePage =
    pages.find((page) => page.isHome || page.id === "home") || pages[0];

  const html = String(homePage?.html || "");

  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const dataSectionKindCount =
    (html.match(/data-section-kind=/g) || []).length;

  const dataBizuplyBlockCount =
    (html.match(/data-bizuply-block=/g) || []).length;

  const editableSectionsCount = dataSectionKindCount + dataBizuplyBlockCount;

  const hasEditableSections = editableSectionsCount > 0;

  const hasVisualContent =
    html.includes("<img") ||
    html.includes("background-image") ||
    html.includes("unsplash.com");

  const hasEnoughContent = textOnly.length > 80;

  const useful = hasEditableSections && (hasVisualContent || hasEnoughContent);

  studioDebug("hasUsefulTemplateHtml:strict", {
    pageId: homePage?.id,
    htmlLength: html.length,
    textLength: textOnly.length,
    dataSectionKindCount,
    dataBizuplyBlockCount,
    editableSectionsCount,
    hasEditableSections,
    hasVisualContent,
    hasEnoughContent,
    useful,
    sample: html.slice(0, 300),
  });

  return useful;
}

function createPagesFromTemplateSeed(
  seed: ReadyWebsiteTemplateSeed,
  data?: Record<string, any>,
): BuiltTemplatePages {
  const templateId = getTemplateIdFromSeed(seed);
  const rendererKey = getSeedRendererKey(seed);
  const renderMode = getSeedRenderMode(seed);
  const editorMode = getSeedEditorMode(seed);

  studioDebug("createPagesFromTemplateSeed:start", {
    templateId,
    rendererKey,
    renderMode,
    editorMode,
    seedName: seed.name,
    seedKey: (seed as any).key,
    blocksCount: Array.isArray(seed.blocks) ? seed.blocks.length : 0,
  });

  const registeredTemplate = createPagesFromRegisteredRenderer(seed, data);

  if (registeredTemplate) {
    return registeredTemplate;
  }

  if (shouldUseTemplateRenderer(seed)) {
    studioWarn("createPagesFromTemplateSeed:renderer-requested-but-not-found", {
      templateId,
      rendererKey,
      renderMode,
      editorMode,
    });
  }

  return createGenericTemplatePages(seed);
}

/**
 * Keep every template page (home/about/services/…) even when the server only
 * saved one page. Overlay saved visual data onto matching ids, then append
 * extra library/custom pages that are not part of the template.
 */
function mergeTemplateAndSavedPages(
  templatePages: StudioSitePageWithPortal[],
  savedPages: StudioSitePageWithPortal[],
): StudioSitePageWithPortal[] {
  const templateList = Array.isArray(templatePages) ? templatePages : [];
  const savedList = Array.isArray(savedPages) ? savedPages : [];

  if (!templateList.length) return savedList;
  if (!savedList.length) return templateList;

  const savedById = new Map(
    savedList.map((page) => [String(page.id || "").trim(), page]),
  );
  const templateIds = new Set(
    templateList.map((page) => String(page.id || "").trim()).filter(Boolean),
  );

  const mergedTemplatePages = templateList.map((templatePage) => {
    const id = String(templatePage.id || "").trim();
    const saved = savedById.get(id);
    if (!saved) return templatePage;

    const savedVisual =
      extractVisualDataFromPayload({
        data: (saved as any).data,
        templateData: (saved as any).templateData,
        projectData: (saved as any).projectData,
        visualEditorPayload: (saved as any).visualEditorPayload,
      }) || {};

    const hasSavedVisual = Object.keys(savedVisual).length > 0;

    return {
      ...templatePage,
      ...saved,
      id: templatePage.id,
      title: String(saved.title || templatePage.title || id),
      slug:
        templatePage.isHome || saved.isHome
          ? templatePage.slug
          : String(saved.slug ?? templatePage.slug ?? ""),
      type: templatePage.type || saved.type,
      isHome: Boolean(templatePage.isHome || saved.isHome),
      html: saved.html || templatePage.html,
      css: saved.css || templatePage.css,
      clientPortal:
        saved.clientPortal ||
        templatePage.clientPortal ||
        createDefaultClientPortalConfig(),
      ...(hasSavedVisual
        ? {
            data: savedVisual,
            templateData: savedVisual,
            projectData: {
              ...asPlainObject(templatePage.projectData),
              ...asPlainObject(saved.projectData),
              data: savedVisual,
              templateData: savedVisual,
            },
            visualEditorPayload: {
              ...asPlainObject((templatePage as any).visualEditorPayload),
              ...asPlainObject((saved as any).visualEditorPayload),
              data: savedVisual,
              templateData: savedVisual,
              activePageId: id,
            },
          }
        : {}),
    } as StudioSitePageWithPortal;
  });

  const extraPages = savedList.filter((page) => {
    const id = String(page.id || "").trim();
    if (!id || templateIds.has(id)) return false;
    // Keep library / blank / custom pages that are not part of the template.
    return true;
  });

  return [...mergedTemplatePages, ...extraPages];
}


const VISUAL_STYLE_KEY = "__styles";
const VISUAL_ANIMATION_KEY = "__animations";
const VISUAL_CONTENT_KEY = "__content";
const VISUAL_DELETED_KEY = "__deletedElements";
const VISUAL_LAYOUT_KEY = "__layout";
const VISUAL_ATTRIBUTE_KEY = "__attributes";
const VISUAL_RESPONSIVE_KEY = "__responsive";
const VISUAL_LOCKED_KEY = "__lockedElements";
const VISUAL_HIDDEN_KEY = "__hiddenElements";
const VISUAL_INSERTED_ELEMENTS_KEY = "__insertedElements";
const VISUAL_INSERTED_SECTIONS_KEY = "__insertedSections";
const VISUAL_SECTION_ORDER_KEY = "__sectionOrder";
const FORM_BUILDER_KEY = "__formBuilder";
const FORM_BUILDER_BY_ELEMENT_KEY = "__formBuilderByElement";

type PublishedVisualDeviceMode = "desktop" | "tablet" | "mobile";

type PublishedVisualContentValue = {
  text?: string;

  src?: string;
  url?: string;
  secureUrl?: string;
  secure_url?: string;
  originalUrl?: string;
  poster?: string;
  alt?: string;
  title?: string;

  mediaType?: string;
  resourceType?: string;
  resource_type?: string;
  mimeType?: string;
  mime_type?: string;

  href?: string;
  target?: "_self" | "_blank" | string;
  rel?: string;

  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: string;

  value?: string;
  placeholder?: string;
  checked?: boolean;

  uploadState?: string;

  [key: string]: any;
};

type PublishedVisualLayoutItem = {
  x?: number;
  y?: number;

  width?: string | number;
  height?: string | number;

  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;

  position?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;

  translateX?: number;
  translateY?: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;

  zIndex?: string | number;
  order?: string | number;

  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  gap?: string | number;

  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;

  overflow?: string;
  aspectRatio?: string | number;

  freePosition?: boolean;

  [key: string]: any;
};

type PublishedVisualResponsiveItem = {
  styles?: StylePatch;
  layout?: PublishedVisualLayoutItem;
  hidden?: boolean;
};

type PublishedVisualContentMap = Record<
  string,
  PublishedVisualContentValue
>;
type PublishedVisualStyleMap = Record<string, StylePatch>;
type PublishedVisualAnimationMap = Record<string, string>;
type PublishedVisualDeletedMap = Record<string, boolean>;
type PublishedVisualLayoutMap = Record<
  string,
  PublishedVisualLayoutItem
>;
type PublishedVisualAttributeValue =
  | string
  | number
  | boolean
  | null;
type PublishedVisualAttributeMap = Record<
  string,
  Record<string, PublishedVisualAttributeValue>
>;
type PublishedVisualResponsiveMap = Record<
  string,
  Partial<
    Record<
      PublishedVisualDeviceMode,
      PublishedVisualResponsiveItem
    >
  >
>;
type PublishedVisualBooleanMap = Record<string, boolean>;

const PUBLISHED_AUTO_VISUAL_SELECTOR = [
  "header",
  "footer",
  "section",
  "nav",
  "article",
  "main",
  "aside",
  "div",
  "ul",
  "ol",
  "li",
  "form",
  "label",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "strong",
  "small",
  "em",
  "b",
  "i",
  "button",
  "a",
  "img",
  "picture",
  "video",
  "source",
  "svg",
  "hr",
  "input",
  "textarea",
  "select",
].join(",");

const PUBLISHED_STRUCTURE_SELECTOR = [
  "[data-template-section-id]",
  "[data-section-kind]",
  "[data-bizuply-block]",
  "[data-studio-section-id]",
  "header",
  "footer",
  "section",
  "main",
  "article",
  "nav",
  "aside",
  "form",
].join(",");

const PUBLISHED_EDITOR_ONLY_SELECTOR = [
  "[data-visual-editor-only='true']",
  "[data-visual-selection-box='true']",
  "[data-visual-selection-overlay='true']",
  "[data-visual-toolbar-layer='true']",
  "[data-visual-context-menu-layer='true']",
  ".visual-selection-overlay",
  ".visual-floating-toolbar",
  ".visual-context-menu",
  ".visual-inspector-panel",
].join(",");

const VISUAL_ROOT_COLLECTION_KEYS = new Set([
  VISUAL_CONTENT_KEY,
  VISUAL_STYLE_KEY,
  VISUAL_ANIMATION_KEY,
  VISUAL_DELETED_KEY,
  VISUAL_LAYOUT_KEY,
  VISUAL_ATTRIBUTE_KEY,
  VISUAL_RESPONSIVE_KEY,
  VISUAL_LOCKED_KEY,
  VISUAL_HIDDEN_KEY,
  VISUAL_INSERTED_ELEMENTS_KEY,
  VISUAL_INSERTED_SECTIONS_KEY,
  VISUAL_SECTION_ORDER_KEY,
  "__customCode",
  FORM_BUILDER_BY_ELEMENT_KEY,
  FORM_BUILDER_KEY,
]);

function readPublishedMap<T extends Record<string, any>>(
  data: Record<string, any>,
  key: string,
): T {
  const value = data?.[key];

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as T;
  }

  return {} as T;
}

function readPublishedVisualStyles(
  data: Record<string, any>,
): PublishedVisualStyleMap {
  return readPublishedMap<PublishedVisualStyleMap>(
    data,
    VISUAL_STYLE_KEY,
  );
}

function readPublishedVisualAnimations(
  data: Record<string, any>,
): PublishedVisualAnimationMap {
  return readPublishedMap<PublishedVisualAnimationMap>(
    data,
    VISUAL_ANIMATION_KEY,
  );
}

function readPublishedVisualContent(
  data: Record<string, any>,
): PublishedVisualContentMap {
  return readPublishedMap<PublishedVisualContentMap>(
    data,
    VISUAL_CONTENT_KEY,
  );
}

function readPublishedVisualDeleted(
  data: Record<string, any>,
): PublishedVisualDeletedMap {
  return readPublishedMap<PublishedVisualDeletedMap>(
    data,
    VISUAL_DELETED_KEY,
  );
}

function readPublishedVisualLayout(
  data: Record<string, any>,
): PublishedVisualLayoutMap {
  return readPublishedMap<PublishedVisualLayoutMap>(
    data,
    VISUAL_LAYOUT_KEY,
  );
}

function readPublishedVisualAttributes(
  data: Record<string, any>,
): PublishedVisualAttributeMap {
  return readPublishedMap<PublishedVisualAttributeMap>(
    data,
    VISUAL_ATTRIBUTE_KEY,
  );
}

function readPublishedVisualResponsive(
  data: Record<string, any>,
): PublishedVisualResponsiveMap {
  return readPublishedMap<PublishedVisualResponsiveMap>(
    data,
    VISUAL_RESPONSIVE_KEY,
  );
}

function readPublishedVisualLocked(
  data: Record<string, any>,
): PublishedVisualBooleanMap {
  return readPublishedMap<PublishedVisualBooleanMap>(
    data,
    VISUAL_LOCKED_KEY,
  );
}

function readPublishedVisualHidden(
  data: Record<string, any>,
): PublishedVisualBooleanMap {
  return readPublishedMap<PublishedVisualBooleanMap>(
    data,
    VISUAL_HIDDEN_KEY,
  );
}

function hasOwnVisualRootKey(
  source: Record<string, any>,
  key: string,
) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function hasVisualRootSnapshot(source: Record<string, any>) {
  return Array.from(VISUAL_ROOT_COLLECTION_KEYS).some((key) =>
    hasOwnVisualRootKey(source, key),
  );
}

function pickVisualCollectionsOnly(source: Record<string, any>) {
  const input = asPlainObject(source);
  const output: Record<string, any> = {};

  VISUAL_ROOT_COLLECTION_KEYS.forEach((key) => {
    const value = input[key];

    output[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? cleanDataForJsonSave(value) || {}
        : {};
  });

  [
    "__activePageId",
    "__siteSlug",
    "__publicUrl",
    "__siteDomain",
    "__published",
    "__status",
    "__blankVisualPage",
    "__libraryPage",
    "__libraryPageTemplateId",
    "snapshotPageId",
  ].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      output[key] = cleanDataForJsonSave(input[key]);
    }
  });

  return output;
}

function mergeVisualRootData(
  ...sources: Array<Record<string, any> | null | undefined>
) {
  const merged: Record<string, any> = {};

  sources.forEach((source) => {
    const object = asPlainObject(source);

    if (!Object.keys(object).length) return;

    Object.entries(object).forEach(([key, value]) => {
      /*
        כל מפת עורך היא snapshot מלא.
        מקור מאוחר יותר מחליף את המפה הקודמת גם כשהמפה החדשה ריקה.
        כך מחיקות, איפוס עיצוב והסרת תוכן לא חוזרים אחרי רענון.
      */
      if (VISUAL_ROOT_COLLECTION_KEYS.has(key)) {
        merged[key] =
          value && typeof value === "object" && !Array.isArray(value)
            ? cleanDataForJsonSave(value) || {}
            : {};

        return;
      }

      const cleaned = cleanDataForJsonSave(value);

      if (cleaned !== undefined) {
        merged[key] = cleaned;
      }
    });
  });

  return merged;
}

function extractVisualDataFromPayload(value: unknown) {
  const payload = asPlainObject(value);
  const visualEditorPayload = asPlainObject(
    payload.visualEditorPayload,
  );
  const projectData = asPlainObject(payload.projectData);

  const candidates = [
    asPlainObject(payload.data),
    asPlainObject(payload.templateData),
    asPlainObject(visualEditorPayload.data),
    asPlainObject(visualEditorPayload.templateData),
    asPlainObject(projectData.data),
    asPlainObject(projectData.templateData),
    projectData,
  ];

  const authoritative =
    candidates.find((candidate) =>
      hasVisualRootSnapshot(candidate),
    ) ||
    candidates.find(
      (candidate) => Object.keys(candidate).length > 0,
    ) ||
    {};

  return mergeVisualRootData(authoritative);
}

function buildCleanVisualDataForSave(
  visualPayload: Record<string, any>,
  _currentServerVisualData?: Record<string, any> | null,
) {
  const extractedData = extractVisualDataFromPayload(visualPayload);

  /*
    Snapshot חדש הוא מקור האמת.
    לא מחזירים לתוכו מפות ישנות מהשרת.
  */
  return (
    cleanDataForJsonSave<Record<string, any>>(
      pickVisualCollectionsOnly(extractedData),
    ) || {}
  );
}

function getVisualContentKeys(data: Record<string, any>) {
  return Object.keys(readPublishedVisualContent(data || {}) || {});
}

function safePublishedCssSelectorValue(value: string) {
  if (
    typeof CSS !== "undefined" &&
    typeof CSS.escape === "function"
  ) {
    return CSS.escape(String(value || ""));
  }

  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

function normalizePublishedVisualIdPart(value: unknown) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "element"
  );
}

function getPublishedDirectVisualId(node: Element) {
  return String(
    node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-field") ||
      node.getAttribute("data-image-field") ||
      node.getAttribute("data-visual-field") ||
      node.getAttribute("data-visual-image-field") ||
      node.getAttribute("data-template-field") ||
      node.getAttribute("data-content-field") ||
      node.getAttribute("data-media-field") ||
      "",
  ).trim();
}

function normalizePublishedVisualType(value: unknown) {
  const clean = String(value || "").trim().toLowerCase();

  if (clean === "section") return "section";

  if (
    clean === "text" ||
    clean === "heading" ||
    clean === "paragraph"
  ) {
    return "text";
  }

  if (
    clean === "image" ||
    clean === "video" ||
    clean === "media" ||
    clean === "raw"
  ) {
    return "image";
  }

  if (
    clean === "button" ||
    clean === "link" ||
    clean === "control"
  ) {
    return "button";
  }

  if (clean === "line") return "line";
  if (clean === "icon" || clean === "svg") return "icon";
  if (clean === "box" || clean === "container") return "box";

  return "";
}

function getPublishedAutoVisualType(node: Element) {
  const explicitType = normalizePublishedVisualType(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  );

  if (explicitType) return explicitType;

  if (
    node.matches(
      "[data-template-section-id], [data-section-kind], [data-bizuply-block], [data-studio-section-id]",
    )
  ) {
    return "section";
  }

  const tagName = String(node.tagName || "").toLowerCase();

  if (
    tagName === "img" ||
    tagName === "picture" ||
    tagName === "video" ||
    tagName === "source"
  ) {
    return "image";
  }

  if (
    tagName === "button" ||
    tagName === "a" ||
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea"
  ) {
    return "button";
  }

  if (
    [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "strong",
      "small",
      "label",
      "em",
      "b",
      "i",
      "blockquote",
      "figcaption",
    ].includes(tagName)
  ) {
    return "text";
  }

  if (
    [
      "header",
      "footer",
      "section",
      "main",
      "article",
      "nav",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  if (tagName === "svg" || tagName === "path") return "icon";
  if (tagName === "hr") return "line";

  return "box";
}

function isIgnoredPublishedVisualNode(node: Element) {
  const tagName = String(node.tagName || "").toLowerCase();

  if (
    [
      "script",
      "style",
      "meta",
      "link",
      "title",
      "br",
      "noscript",
      "template",
    ].includes(tagName)
  ) {
    return true;
  }

  return Boolean(node.closest(PUBLISHED_EDITOR_ONLY_SELECTOR));
}

function getPublishedPagePart(
  node: Element,
  root: HTMLElement,
) {
  return normalizePublishedVisualIdPart(
    node
      .closest("[data-template-page-id]")
      ?.getAttribute("data-template-page-id") ||
      root
        .querySelector("[data-template-page-id]")
        ?.getAttribute("data-template-page-id") ||
      root.getAttribute("data-template-page-id") ||
      root.getAttribute("data-visual-page-id") ||
      root.getAttribute("data-page-id") ||
      "page",
  );
}

function getPublishedStructureNode(
  node: Element,
  root: HTMLElement,
) {
  const structure = node.closest(PUBLISHED_STRUCTURE_SELECTOR);

  if (!structure || !root.contains(structure)) return null;

  return structure as HTMLElement;
}

function getPublishedSectionPart(
  node: Element,
  root: HTMLElement,
) {
  const structure = getPublishedStructureNode(node, root);

  if (!structure) return "page";

  const explicit =
    structure.getAttribute("data-template-section-id") ||
    structure.getAttribute("data-section-kind") ||
    structure.getAttribute("data-bizuply-block") ||
    structure.getAttribute("data-studio-section-id") ||
    structure.getAttribute("id") ||
    "";

  if (explicit) {
    return normalizePublishedVisualIdPart(explicit);
  }

  const structures = Array.from(
    root.querySelectorAll<HTMLElement>(
      PUBLISHED_STRUCTURE_SELECTOR,
    ),
  );

  const tagName = normalizePublishedVisualIdPart(
    String(structure.tagName || "section").toLowerCase(),
  );

  return `${tagName}-${Math.max(
    1,
    structures.indexOf(structure) + 1,
  )}`;
}

function getPublishedStableDomPath(
  node: HTMLElement,
  scope: HTMLElement,
) {
  const parts: string[] = [];
  let current: HTMLElement | null = node;

  while (current && current !== scope) {
    const parent = current.parentElement;

    if (!parent) break;

    const siblings = Array.from(parent.children).filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement &&
        !isIgnoredPublishedVisualNode(item),
    );

    const index = Math.max(0, siblings.indexOf(current));
    const tagName = normalizePublishedVisualIdPart(
      String(current.tagName || "element").toLowerCase(),
    );

    parts.unshift(`${tagName}-${index + 1}`);
    current = parent;
  }

  return parts.join(".");
}

function buildPublishedStableVisualId(
  node: HTMLElement,
  root: HTMLElement,
) {
  const explicitHtmlId = String(
    node.getAttribute("id") || "",
  ).trim();

  if (explicitHtmlId) {
    return [
      getPublishedPagePart(node, root),
      "html-id",
      normalizePublishedVisualIdPart(explicitHtmlId),
    ].join(".");
  }

  const visualType = getPublishedAutoVisualType(node);
  const tagName = normalizePublishedVisualIdPart(
    String(node.tagName || "element").toLowerCase(),
  );
  const pagePart = getPublishedPagePart(node, root);
  const structure = getPublishedStructureNode(node, root);
  const sectionPart = getPublishedSectionPart(node, root);

  if (structure === node && visualType === "section") {
    return `${pagePart}.${sectionPart}.section`;
  }

  const scope =
    structure || root || node.parentElement || node;

  const domPath = getPublishedStableDomPath(node, scope);

  return [
    pagePart,
    sectionPart,
    normalizePublishedVisualIdPart(visualType),
    tagName,
    domPath || `${tagName}-1`,
  ]
    .filter(Boolean)
    .join(".");
}

function stampPublishedEditableElements(root: HTMLElement) {
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(
      PUBLISHED_AUTO_VISUAL_SELECTOR,
    ),
  );

  nodes.forEach((element) => {
    if (isIgnoredPublishedVisualNode(element)) return;

    if (element.tagName.toLowerCase() === "path") {
      return;
    }

    const visualType = getPublishedAutoVisualType(element);
    const directId = getPublishedDirectVisualId(element);
    const stableId =
      directId || buildPublishedStableVisualId(element, root);

    element.setAttribute("data-visual-edit-id", stableId);
    element.setAttribute("data-visual-editable", "true");
    element.setAttribute("data-visual-edit-type", visualType);
    element.setAttribute("data-visual-type", visualType);

    if (!directId) {
      element.setAttribute("data-visual-auto-id", "true");
    }

    if (!element.getAttribute("data-visual-edit-label")) {
      const label =
        String(element.getAttribute("aria-label") || "").trim() ||
        String(element.getAttribute("alt") || "").trim() ||
        String(element.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 50) ||
        String(element.tagName || "element").toLowerCase();

      element.setAttribute("data-visual-edit-label", label);
    }
  });
}

function publishedCssPropertyName(key: string) {
  if (key.startsWith("--")) return key;

  return key.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`,
  );
}

function publishedCssValue(
  value: string | number | boolean,
) {
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value || "").trim();
}

function selectorForPublishedVisualElement(elementId: string) {
  const rawId = String(elementId || "").trim();
  const safeId = safePublishedCssSelectorValue(rawId);
  const idParts = rawId.split(".").filter(Boolean);

  const sectionId =
    rawId.endsWith(".section") && idParts.length >= 2
      ? idParts[idParts.length - 2]
      : "";

  const selectors = [
    `[data-visual-edit-id="${safeId}"]`,
    `img[data-field="${safeId}"]`,
    `video[data-field="${safeId}"]`,
    `[data-field="${safeId}"]`,
    `img[data-image-field="${safeId}"]`,
    `video[data-image-field="${safeId}"]`,
    `[data-image-field="${safeId}"]`,
    `[data-visual-field="${safeId}"]`,
    `[data-visual-image-field="${safeId}"]`,
    `[data-template-field="${safeId}"]`,
    `[data-content-field="${safeId}"]`,
    `[data-media-field="${safeId}"]`,
  ];

  if (rawId.endsWith(".section") && sectionId) {
    const safeSectionId =
      safePublishedCssSelectorValue(sectionId);

    selectors.push(
      `[data-template-section-id="${safeSectionId}"]`,
    );
    selectors.push(
      `[data-section-kind="${safeSectionId}"]`,
    );
    selectors.push(
      `[data-bizuply-block="${safeSectionId}"]`,
    );
    selectors.push(
      `[data-studio-section-id="${safeSectionId}"]`,
    );
  }

  return Array.from(new Set(selectors)).join(",\n");
}

function queryPublishedVisualElements(
  root: HTMLElement,
  elementId: string,
) {
  const selector = selectorForPublishedVisualElement(
    elementId,
  ).replace(/\n/g, "");

  try {
    return Array.from(
      root.querySelectorAll<HTMLElement>(selector),
    );
  } catch (error) {
    studioWarn("queryPublishedVisualElements:selector-failed", {
      elementId,
      selector,
      error,
    });

    return [];
  }
}

function queryPublishedVisualElement(
  root: HTMLElement,
  elementId: string,
): HTMLElement | null {
  return queryPublishedVisualElements(root, elementId)[0] || null;
}

function getPublishedContentMediaSrc(
  value: PublishedVisualContentValue,
) {
  return String(
    value.secureUrl ||
      value.secure_url ||
      value.url ||
      value.src ||
      value.originalUrl ||
      value.poster ||
      "",
  ).trim();
}

function isPublishedVideoUrl(value: string) {
  const clean = String(value || "").toLowerCase();

  return (
    clean.includes("/video/upload/") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.includes("video/")
  );
}

function getPublishedContentMediaType(
  value: PublishedVisualContentValue,
  src: string,
) {
  const explicit = String(
    value.mediaType ||
      value.resourceType ||
      value.resource_type ||
      value.mimeType ||
      value.mime_type ||
      "",
  ).toLowerCase();

  if (explicit.includes("video")) return "video";
  if (explicit.includes("image")) return "image";
  if (isPublishedVideoUrl(src)) return "video";

  return src ? "image" : "";
}

function copyPublishedMediaAttributes(
  source: HTMLElement,
  target: HTMLElement,
) {
  Array.from(source.attributes || []).forEach((attribute) => {
    const name = attribute.name;
    const value = attribute.value;

    if (["src", "srcset", "poster"].includes(name)) return;
    if (
      name === "alt" &&
      target.tagName.toLowerCase() === "video"
    ) {
      return;
    }

    target.setAttribute(name, value);
  });
}

function makePublishedVideoElement(
  source: HTMLElement,
  src: string,
  value: PublishedVisualContentValue,
) {
  const video = document.createElement("video");

  copyPublishedMediaAttributes(source, video);

  video.setAttribute("src", src);
  video.setAttribute(
    "preload",
    String(value.preload || "metadata"),
  );
  video.setAttribute("playsinline", "true");
  video.setAttribute("data-visual-media-type", "video");
  video.setAttribute("data-resource-type", "video");
  video.setAttribute("data-visual-current-src", src);

  video.controls = value.controls !== false;
  video.autoplay = Boolean(value.autoplay);
  video.muted =
    value.muted !== undefined ? Boolean(value.muted) : true;
  video.loop = Boolean(value.loop);
  video.playsInline =
    value.playsInline !== undefined
      ? Boolean(value.playsInline)
      : true;

  if (value.poster) {
    video.setAttribute("poster", String(value.poster));
  }

  if (value.alt) {
    video.setAttribute("title", value.alt);
    video.setAttribute("aria-label", value.alt);
  }

  return video;
}

function makePublishedImageElement(
  source: HTMLElement,
  src: string,
  alt?: string,
) {
  const image = document.createElement("img");

  copyPublishedMediaAttributes(source, image);

  image.setAttribute("src", src);
  image.setAttribute("data-visual-media-type", "image");
  image.setAttribute("data-resource-type", "image");
  image.setAttribute("data-visual-current-src", src);
  image.setAttribute("alt", alt || "");

  return image;
}

function applyPublishedTextToNode(
  node: HTMLElement,
  text: string,
) {
  if (node instanceof HTMLInputElement) {
    node.value = text;
    node.setAttribute("value", text);
    node.setAttribute("placeholder", text);
    return true;
  }

  if (node instanceof HTMLTextAreaElement) {
    node.value = text;
    node.textContent = text;
    node.setAttribute("placeholder", text);
    return true;
  }

  if (node instanceof HTMLSelectElement) {
    return false;
  }

  node.textContent = text;
  return true;
}

function applyPublishedMediaToNode(
  node: HTMLElement,
  src: string,
  value: PublishedVisualContentValue,
  mediaType: string,
) {
  if (!src) return false;

  const normalizedType =
    mediaType === "video" ? "video" : "image";

  const targetMedia =
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement
      ? node
      : ((node.querySelector(
          "img,video",
        ) as HTMLElement | null) || node);

  if (normalizedType === "video") {
    if (targetMedia instanceof HTMLVideoElement) {
      targetMedia.setAttribute("src", src);
      targetMedia.setAttribute(
        "preload",
        String(value.preload || "metadata"),
      );
      targetMedia.setAttribute("playsinline", "true");
      targetMedia.setAttribute(
        "data-visual-media-type",
        "video",
      );
      targetMedia.setAttribute("data-resource-type", "video");
      targetMedia.setAttribute(
        "data-visual-current-src",
        src,
      );

      targetMedia.controls = value.controls !== false;
      targetMedia.autoplay = Boolean(value.autoplay);
      targetMedia.muted =
        value.muted !== undefined
          ? Boolean(value.muted)
          : true;
      targetMedia.loop = Boolean(value.loop);
      targetMedia.playsInline =
        value.playsInline !== undefined
          ? Boolean(value.playsInline)
          : true;

      if (value.poster) {
        targetMedia.setAttribute(
          "poster",
          String(value.poster),
        );
      }

      if (value.alt) {
        targetMedia.setAttribute("title", value.alt);
        targetMedia.setAttribute("aria-label", value.alt);
      }

      return true;
    }

    if (targetMedia instanceof HTMLImageElement) {
      const video = makePublishedVideoElement(
        targetMedia,
        src,
        value,
      );

      targetMedia.replaceWith(video);
      return true;
    }

    const existing = targetMedia.querySelector?.(
      "img,video",
    ) as HTMLElement | null;

    if (existing) {
      const video = makePublishedVideoElement(
        existing,
        src,
        value,
      );

      existing.replaceWith(video);
      return true;
    }

    targetMedia.setAttribute(
      "data-visual-current-src",
      src,
    );
    targetMedia.setAttribute("data-video-src", src);
    targetMedia.setAttribute(
      "data-visual-media-type",
      "video",
    );
    targetMedia.setAttribute("data-resource-type", "video");
    targetMedia.style.backgroundImage = `url("${src}")`;
    targetMedia.style.backgroundSize = "cover";
    targetMedia.style.backgroundPosition = "center";

    return true;
  }

  if (targetMedia instanceof HTMLImageElement) {
    targetMedia.setAttribute("src", src);
    targetMedia.setAttribute(
      "data-visual-current-src",
      src,
    );
    targetMedia.setAttribute(
      "data-visual-media-type",
      "image",
    );
    targetMedia.setAttribute("data-resource-type", "image");
    targetMedia.setAttribute("alt", value.alt || "");

    return true;
  }

  if (targetMedia instanceof HTMLVideoElement) {
    const image = makePublishedImageElement(
      targetMedia,
      src,
      value.alt,
    );

    targetMedia.replaceWith(image);
    return true;
  }

  const existing = targetMedia.querySelector?.(
    "img,video",
  ) as HTMLElement | null;

  if (existing) {
    if (existing instanceof HTMLImageElement) {
      existing.setAttribute("src", src);
      existing.setAttribute(
        "data-visual-current-src",
        src,
      );
      existing.setAttribute("alt", value.alt || "");
      return true;
    }

    const image = makePublishedImageElement(
      existing,
      src,
      value.alt,
    );

    existing.replaceWith(image);
    return true;
  }

  targetMedia.setAttribute(
    "data-visual-current-src",
    src,
  );
  targetMedia.setAttribute("data-image-src", src);
  targetMedia.setAttribute(
    "data-visual-media-type",
    "image",
  );
  targetMedia.setAttribute("data-resource-type", "image");
  targetMedia.style.backgroundImage = `url("${src}")`;
  targetMedia.style.backgroundSize = "cover";
  targetMedia.style.backgroundPosition = "center";

  return true;
}

function publishedStylePatchToCss(
  style: Record<string, any>,
) {
  return Object.entries(style || {})
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "",
    )
    .map(
      ([key, value]) =>
        `  ${publishedCssPropertyName(
          key,
        )}: ${publishedCssValue(
          value as string | number | boolean,
        )} !important;`,
    )
    .join("\n");
}

function applyPublishedStylePatchToNode(
  node: HTMLElement,
  style: Record<string, any>,
) {
  let appliedCount = 0;

  Object.entries(style || {}).forEach(([key, rawValue]) => {
    if (
      rawValue === undefined ||
      rawValue === null ||
      rawValue === ""
    ) {
      return;
    }

    const property = publishedCssPropertyName(key);
    const value = publishedCssValue(
      rawValue as string | number | boolean,
    );

    try {
      node.style.setProperty(property, value, "important");
      appliedCount += 1;

      if (property === "color") {
        node.style.setProperty(
          "-webkit-text-fill-color",
          value,
          "important",
        );
      }
    } catch (error) {
      studioWarn(
        "applyPublishedStylePatchToNode:invalid-style",
        {
          property,
          value,
          error,
        },
      );
    }
  });

  return appliedCount;
}

function publishedLayoutToStyle(
  layout: PublishedVisualLayoutItem | undefined,
) {
  if (!layout) return {};

  const style: Record<string, any> = {};

  [
    "width",
    "height",
    "minWidth",
    "maxWidth",
    "minHeight",
    "maxHeight",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "order",
    "display",
    "flexDirection",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "gap",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridColumn",
    "gridRow",
    "overflow",
    "aspectRatio",
  ].forEach((key) => {
    const value = layout[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      style[key] = value;
    }
  });

  const translateX = Number(
    layout.translateX ?? layout.x ?? 0,
  );
  const translateY = Number(
    layout.translateY ?? layout.y ?? 0,
  );

  if (translateX || translateY) {
    style.translate = `${translateX}px ${translateY}px`;
  }

  if (
    layout.rotate !== undefined &&
    layout.rotate !== null &&
    Number(layout.rotate) !== 0
  ) {
    style.rotate = `${Number(layout.rotate)}deg`;
  }

  if (
    layout.scaleX !== undefined ||
    layout.scaleY !== undefined
  ) {
    style.scale = `${Number(
      layout.scaleX ?? 1,
    )} ${Number(
      layout.scaleY ?? layout.scaleX ?? 1,
    )}`;
  }

  return style;
}

function applyPublishedStylesInline(
  root: HTMLElement,
  data: Record<string, any>,
) {
  const styles = readPublishedVisualStyles(data);
  const missingSelectors: Array<{
    elementId: string;
    selector: string;
  }> = [];

  let appliedElementCount = 0;
  let appliedPropertyCount = 0;

  Object.entries(styles || {}).forEach(
    ([elementId, style]) => {
      const nodes = queryPublishedVisualElements(
        root,
        elementId,
      );

      if (!nodes.length) {
        missingSelectors.push({
          elementId,
          selector: selectorForPublishedVisualElement(
            elementId,
          ).replace(/\n/g, ""),
        });

        return;
      }

      nodes.forEach((node) => {
        const count = applyPublishedStylePatchToNode(
          node,
          style as Record<string, any>,
        );

        if (count > 0) {
          appliedElementCount += 1;
          appliedPropertyCount += count;
        }
      });
    },
  );

  return {
    appliedElementCount,
    appliedPropertyCount,
    missingSelectors,
  };
}

function applyPublishedLayoutInline(
  root: HTMLElement,
  data: Record<string, any>,
) {
  let appliedElementCount = 0;
  let appliedPropertyCount = 0;

  Object.entries(readPublishedVisualLayout(data)).forEach(
    ([elementId, layout]) => {
      const nodes = queryPublishedVisualElements(
        root,
        elementId,
      );
      const style = publishedLayoutToStyle(layout);

      nodes.forEach((node) => {
        const count = applyPublishedStylePatchToNode(
          node,
          style,
        );

        if (count > 0) {
          appliedElementCount += 1;
          appliedPropertyCount += count;
        }
      });
    },
  );

  return {
    appliedElementCount,
    appliedPropertyCount,
  };
}

function applyPublishedAttributesInline(
  root: HTMLElement,
  data: Record<string, any>,
) {
  let appliedElementCount = 0;
  let appliedAttributeCount = 0;

  Object.entries(readPublishedVisualAttributes(data)).forEach(
    ([elementId, attributes]) => {
      const nodes = queryPublishedVisualElements(
        root,
        elementId,
      );

      nodes.forEach((node) => {
        let changed = false;

        Object.entries(attributes || {}).forEach(
          ([key, value]) => {
            if (
              key === "data-visual-edit-id" ||
              key === "data-visual-edit-type" ||
              key === "data-visual-type"
            ) {
              return;
            }

            if (key === "className" || key === "class") {
              if (value === null || value === "") {
                node.removeAttribute("class");
              } else {
                node.setAttribute("class", String(value));
              }

              appliedAttributeCount += 1;
              changed = true;
              return;
            }

            if (
              value === null ||
              value === false ||
              value === ""
            ) {
              node.removeAttribute(key);
              appliedAttributeCount += 1;
              changed = true;
              return;
            }

            if (value === true) {
              node.setAttribute(key, "");
              appliedAttributeCount += 1;
              changed = true;
              return;
            }

            node.setAttribute(key, String(value));
            appliedAttributeCount += 1;
            changed = true;
          },
        );

        if (changed) {
          appliedElementCount += 1;
        }
      });
    },
  );

  return {
    appliedElementCount,
    appliedAttributeCount,
  };
}

function applyPublishedLockedAndHiddenInline(
  root: HTMLElement,
  data: Record<string, any>,
) {
  let lockedCount = 0;
  let hiddenCount = 0;

  Object.entries(readPublishedVisualLocked(data)).forEach(
    ([elementId, locked]) => {
      if (!locked) return;

      queryPublishedVisualElements(root, elementId).forEach(
        (node) => {
          node.setAttribute("data-visual-locked", "true");
          lockedCount += 1;
        },
      );
    },
  );

  Object.entries(readPublishedVisualHidden(data)).forEach(
    ([elementId, hidden]) => {
      if (!hidden) return;

      queryPublishedVisualElements(root, elementId).forEach(
        (node) => {
          node.setAttribute("data-visual-hidden", "true");
          node.style.setProperty(
            "visibility",
            "hidden",
            "important",
          );
          node.style.setProperty(
            "pointer-events",
            "none",
            "important",
          );
          hiddenCount += 1;
        },
      );
    },
  );

  return {
    lockedCount,
    hiddenCount,
  };
}

function getPublishedAnimationCssValue(animation: string) {
  const clean = String(animation || "").trim();

  if (!clean || clean === "none") return "";

  if (clean === "fade-up") {
    return "bizuplyVisualFadeUp 680ms cubic-bezier(0.22,1,0.36,1) both";
  }

  if (clean === "fade-in") {
    return "bizuplyVisualFadeIn 620ms ease both";
  }

  if (clean === "zoom-in") {
    return "bizuplyVisualZoomIn 620ms cubic-bezier(0.22,1,0.36,1) both";
  }

  if (clean === "slide-right") {
    return "bizuplyVisualSlideRight 650ms cubic-bezier(0.22,1,0.36,1) both";
  }

  if (clean === "slide-left") {
    return "bizuplyVisualSlideLeft 650ms cubic-bezier(0.22,1,0.36,1) both";
  }

  if (clean === "blur-reveal") {
    return "bizuplyVisualBlurReveal 760ms cubic-bezier(0.22,1,0.36,1) both";
  }

  if (clean === "float-soft") {
    return "bizuplyVisualFloatSoft 4s ease-in-out infinite";
  }

  if (clean === "pulse-soft") {
    return "bizuplyVisualPulseSoft 3s ease-in-out infinite";
  }

  return clean;
}

function buildPublishedResponsiveCss(
  data: Record<string, any>,
) {
  const responsive = readPublishedVisualResponsive(data);
  const chunks: string[] = [];

  const mediaQueries: Record<
    PublishedVisualDeviceMode,
    string
  > = {
    desktop: "(min-width: 901px)",
    tablet: "(min-width: 481px) and (max-width: 900px)",
    mobile: "(max-width: 480px)",
  };

  (
    ["desktop", "tablet", "mobile"] as PublishedVisualDeviceMode[]
  ).forEach((device) => {
    const rules: string[] = [];

    Object.entries(responsive).forEach(
      ([elementId, deviceMap]) => {
        const item = deviceMap?.[device];

        if (!item) return;

        const mergedStyle = {
          ...(item.styles || {}),
          ...publishedLayoutToStyle(item.layout),
        };

        if (item.hidden) {
          mergedStyle.display = "none";
        }

        const css = publishedStylePatchToCss(mergedStyle);

        if (!css) return;

        rules.push(
          `${selectorForPublishedVisualElement(
            elementId,
          )} {\n${css}\n}`,
        );
      },
    );

    if (rules.length) {
      chunks.push(
        `@media ${mediaQueries[device]} {\n${rules.join(
          "\n\n",
        )}\n}`,
      );
    }
  });

  return chunks.join("\n\n");
}

function buildPublishedVisualRuntimeCss(
  data: Record<string, any>,
) {
  const styles = readPublishedVisualStyles(data);
  const animations = readPublishedVisualAnimations(data);
  const layout = readPublishedVisualLayout(data);
  const responsiveCss = buildPublishedResponsiveCss(data);
  const chunks: string[] = [
    `
@keyframes bizuplyVisualFadeUp {
  from {
    opacity: 0;
    transform: translate3d(0, 28px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bizuplyVisualZoomIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bizuplyVisualSlideRight {
  from {
    opacity: 0;
    transform: translate3d(34px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualSlideLeft {
  from {
    opacity: 0;
    transform: translate3d(-34px, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualBlurReveal {
  from {
    opacity: 0;
    filter: blur(14px);
    transform: translate3d(0, 18px, 0);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes bizuplyVisualFloatSoft {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(0, -14px, 0);
  }
}

@keyframes bizuplyVisualPulseSoft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.78;
    transform: scale(1.025);
  }
}

[data-visual-editable="true"] {
  outline: none !important;
}

[data-link-url] {
  cursor: pointer;
}

[data-visual-hidden="true"] {
  visibility: hidden !important;
  pointer-events: none !important;
}

[data-visual-deleted="true"] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  [data-visual-edit-id] {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`,
  ];

  Object.entries(styles).forEach(([elementId, style]) => {
    const css = publishedStylePatchToCss(
      style as Record<string, any>,
    );

    if (!css) return;

    chunks.push(
      `${selectorForPublishedVisualElement(
        elementId,
      )} {\n${css}\n}`,
    );
  });

  Object.entries(layout).forEach(([elementId, item]) => {
    const css = publishedStylePatchToCss(
      publishedLayoutToStyle(item),
    );

    if (!css) return;

    chunks.push(
      `${selectorForPublishedVisualElement(
        elementId,
      )} {\n${css}\n}`,
    );
  });

  Object.entries(animations).forEach(
    ([elementId, animation]) => {
      const animationCss =
        getPublishedAnimationCssValue(animation);

      if (!animationCss) {
        chunks.push(
          `${selectorForPublishedVisualElement(
            elementId,
          )} {\n  animation: none !important;\n}`,
        );
        return;
      }

      chunks.push(
        `${selectorForPublishedVisualElement(
          elementId,
        )} {\n  animation: ${animationCss} !important;\n}`,
      );
    },
  );

  Object.entries(readPublishedVisualHidden(data)).forEach(
    ([elementId, hidden]) => {
      if (!hidden) return;

      chunks.push(
        `${selectorForPublishedVisualElement(
          elementId,
        )} {\n  visibility: hidden !important;\n  pointer-events: none !important;\n}`,
      );
    },
  );

  Object.entries(readPublishedVisualDeleted(data)).forEach(
    ([elementId, deleted]) => {
      if (!deleted) return;

      chunks.push(
        `${selectorForPublishedVisualElement(
          elementId,
        )} {\n  display: none !important;\n}`,
      );
    },
  );

  if (responsiveCss) {
    chunks.push(responsiveCss);
  }

  return chunks.filter(Boolean).join("\n\n");
}

function normalizePublishedHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

function applyPublishedLinkToNode(
  node: HTMLElement,
  hrefValue: string,
  targetValue?: string,
  relValue?: string,
) {
  const href = normalizePublishedHref(hrefValue);

  const clearLinkAttrs = () => {
    node.removeAttribute("href");
    node.removeAttribute("target");
    node.removeAttribute("rel");
    node.removeAttribute("data-link-url");
    node.removeAttribute("data-href");
    node.removeAttribute("data-visual-link-href");
    node.removeAttribute("data-visual-link-target");
    node.removeAttribute("onclick");

    if (node.getAttribute("role") === "link") {
      node.removeAttribute("role");
    }

    node.removeAttribute("tabindex");
  };

  if (!href) {
    clearLinkAttrs();
    return;
  }

  const tagName = String(node.tagName || "").toLowerCase();
  const target =
    targetValue === "_blank" ? "_blank" : "_self";
  const rel =
    target === "_blank"
      ? relValue || "noopener noreferrer"
      : "";

  const canReceiveLink =
    tagName === "a" ||
    tagName === "button" ||
    tagName === "img" ||
    tagName === "input";

  if (!canReceiveLink) {
    clearLinkAttrs();
    return;
  }

  node.setAttribute("data-visual-link-href", href);
  node.setAttribute("data-visual-link-target", target);
  node.setAttribute("data-link-url", href);
  node.removeAttribute("onclick");

  if (node instanceof HTMLAnchorElement) {
    node.setAttribute("href", href);
    node.setAttribute("target", target);

    if (rel) {
      node.setAttribute("rel", rel);
    } else {
      node.removeAttribute("rel");
    }

    return;
  }

  if (tagName === "button") {
    node.setAttribute(
      "type",
      node.getAttribute("type") || "button",
    );
  }
}

function applyPublishedVisualDataToHtml(
  html: string,
  data: Record<string, any>,
) {
  if (typeof document === "undefined") {
    studioWarn(
      "applyPublishedVisualDataToHtml:document-undefined",
      {
        htmlLength: getTextLength(html),
        contentKeys: Object.keys(
          readPublishedVisualContent(data),
        ),
      },
    );

    return html;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(html || "");

  stampPublishedEditableElements(wrapper);

  const deleted = readPublishedVisualDeleted(data);
  const deletedElementIds = new Set(
    Object.entries(deleted)
      .filter(([, isDeleted]) => isDeleted === true)
      .map(([elementId]) => elementId),
  );

  const contentEntries = Object.entries(
    readPublishedVisualContent(data),
  );

  const missingContentSelectors: Array<{
    elementId: string;
    selector: string;
  }> = [];

  let appliedTextCount = 0;
  let appliedMediaCount = 0;
  let appliedLinkCount = 0;

  contentEntries.forEach(([elementId, rawValue]) => {
    if (deletedElementIds.has(elementId)) return;

    const value = asPlainObject(
      rawValue,
    ) as PublishedVisualContentValue;

    const node = queryPublishedVisualElement(
      wrapper,
      elementId,
    );

    if (!node) {
      missingContentSelectors.push({
        elementId,
        selector: selectorForPublishedVisualElement(
          elementId,
        ).replace(/\n/g, ""),
      });

      return;
    }

    const type = getPublishedAutoVisualType(node);
    const mediaSrc = getPublishedContentMediaSrc(value);
    const mediaType = getPublishedContentMediaType(
      value,
      mediaSrc,
    );

    if (mediaSrc) {
      if (
        applyPublishedMediaToNode(
          node,
          mediaSrc,
          value,
          mediaType,
        )
      ) {
        appliedMediaCount += 1;
      }
    }

    if (
      value.text !== undefined &&
      !mediaSrc &&
      (
        type === "text" ||
        type === "button" ||
        type === "box" ||
        type === "section"
      )
    ) {
      if (
        applyPublishedTextToNode(
          node,
          String(value.text ?? ""),
        )
      ) {
        appliedTextCount += 1;
      }
    }

    if (value.href !== undefined) {
      applyPublishedLinkToNode(
        node,
        value.href || "",
        value.target,
        value.rel,
      );
      appliedLinkCount += 1;
    }
  });

  const inlineStyleResult =
    applyPublishedStylesInline(wrapper, data);
  const inlineLayoutResult =
    applyPublishedLayoutInline(wrapper, data);
  const inlineAttributeResult =
    applyPublishedAttributesInline(wrapper, data);
  const lockedHiddenResult =
    applyPublishedLockedAndHiddenInline(wrapper, data);

  const missingDeletedSelectors: Array<{
    elementId: string;
    selector: string;
  }> = [];

  let appliedDeletedCount = 0;

  Object.entries(deleted).forEach(
    ([elementId, isDeleted]) => {
      if (!isDeleted) return;

      const nodes = queryPublishedVisualElements(
        wrapper,
        elementId,
      );

      if (!nodes.length) {
        missingDeletedSelectors.push({
          elementId,
          selector: selectorForPublishedVisualElement(
            elementId,
          ).replace(/\n/g, ""),
        });

        return;
      }

      nodes.forEach((node) => {
        node.setAttribute("data-visual-deleted", "true");
        node.remove();
        appliedDeletedCount += 1;
      });
    },
  );

  const resultHtml = wrapper.innerHTML;

  studioDebug("applyPublishedVisualDataToHtml:done", {
    htmlLengthBefore: getTextLength(html),
    htmlLengthAfter: getTextLength(resultHtml),

    appliedTextCount,
    appliedMediaCount,
    appliedLinkCount,
    appliedDeletedCount,

    appliedInlineStyleElementCount:
      inlineStyleResult.appliedElementCount,
    appliedInlineStylePropertyCount:
      inlineStyleResult.appliedPropertyCount,

    appliedInlineLayoutElementCount:
      inlineLayoutResult.appliedElementCount,
    appliedInlineLayoutPropertyCount:
      inlineLayoutResult.appliedPropertyCount,

    appliedAttributeElementCount:
      inlineAttributeResult.appliedElementCount,
    appliedAttributeCount:
      inlineAttributeResult.appliedAttributeCount,

    appliedLockedCount: lockedHiddenResult.lockedCount,
    appliedHiddenCount: lockedHiddenResult.hiddenCount,

    missingContentSelectorsCount:
      missingContentSelectors.length,
    missingContentSelectors:
      missingContentSelectors.slice(0, 50),

    missingInlineStyleSelectorsCount:
      inlineStyleResult.missingSelectors.length,
    missingInlineStyleSelectors:
      inlineStyleResult.missingSelectors.slice(0, 50),

    missingDeletedSelectorsCount:
      missingDeletedSelectors.length,
    missingDeletedSelectors:
      missingDeletedSelectors.slice(0, 50),

    resultPreview: resultHtml.slice(0, 320),
  });

  return resultHtml;
}

function buildPublishedVisualPages(
  sourcePages: StudioSitePageWithPortal[],
  visualPayload: {
    data: Record<string, any>;
    updatedAt: string;
    templateKey: string;
    activePageId: string;
    published?: boolean;
    status?: "draft" | "published";
  },
): StudioSitePageWithPortal[] {
  const visualCss = buildPublishedVisualRuntimeCss(
    visualPayload.data,
  );

  studioDebug("buildPublishedVisualPages:start", {
    templateKey: visualPayload.templateKey,
    pagesCount: sourcePages.length,
    sourcePages: summarizeStudioPagesForDebug(sourcePages),
    visualCssLength: getTextLength(visualCss),

    contentKeys: Object.keys(
      readPublishedVisualContent(visualPayload.data),
    ),
    styleKeys: Object.keys(
      readPublishedVisualStyles(visualPayload.data),
    ),
    animationKeys: Object.keys(
      readPublishedVisualAnimations(visualPayload.data),
    ),
    layoutKeys: Object.keys(
      readPublishedVisualLayout(visualPayload.data),
    ),
    attributeKeys: Object.keys(
      readPublishedVisualAttributes(visualPayload.data),
    ),
    responsiveKeys: Object.keys(
      readPublishedVisualResponsive(visualPayload.data),
    ),
    lockedKeys: Object.keys(
      readPublishedVisualLocked(visualPayload.data),
    ),
    hiddenKeys: Object.keys(
      readPublishedVisualHidden(visualPayload.data),
    ),
    deletedKeys: Object.keys(
      readPublishedVisualDeleted(visualPayload.data),
    ),
  });

  const hasActivePage = sourcePages.some(
    (page) => page.id === visualPayload.activePageId,
  );
  const nextPages = sourcePages.map((page, index) => {
    const isActivePage =
      page.id === visualPayload.activePageId ||
      (!hasActivePage &&
        visualPayload.activePageId === "home" &&
        (page.isHome || page.id === "home" || index === 0));

    /*
      נתוני ה-DOM שנשלחו שייכים רק לעמוד הפעיל. החלתם על כל העמודים
      ערבבה תוכן ישן/חדש בין מסלולים ציבוריים שונים.
    */
    if (!isActivePage) return page;

    const html = applyPublishedVisualDataToHtml(
      page.html || "",
      visualPayload.data,
    );

    const css = `${page.css || ""}\n\n/* BizUply visual editor published CSS */\n${visualCss}`;

    return {
      ...page,
      html,
      css,
      projectData: {
        ...asPlainObject(page.projectData),
        editorMode: "visual-react",
        templateKey: visualPayload.templateKey,
        templateData: visualPayload.data,
        data: visualPayload.data,
        updatedAt: visualPayload.updatedAt,
      },
      updatedAt: visualPayload.updatedAt,
    } as StudioSitePageWithPortal;
  });

  studioDebug("buildPublishedVisualPages:done", {
    pagesCount: nextPages.length,
    pages: summarizeStudioPagesForDebug(nextPages),
  });

  return nextPages;
}

function pickVisualTemplateDataFromSavedSite(
  site: any,
  expectedTemplateKey?: string,
): Record<string, any> | null {
  const expectedKey = normalizeStudioTemplateKey(
    expectedTemplateKey || "",
  );

  const candidates: Array<{
    label: string;
    value: unknown;
    templateKey?: unknown;
  }> = [];

  const siteObject = asPlainObject(site);
  const projectData = asPlainObject(siteObject.projectData);
  const visualEditorPayload = asPlainObject(
    siteObject.visualEditorPayload,
  );
  const activePage = asPlainObject(siteObject.activePage);
  const activePageProjectData = asPlainObject(
    activePage.projectData,
  );
  const activePageVisualPayload = asPlainObject(
    activePage.visualEditorPayload,
  );

  candidates.push({
    label: "site.visualEditorPayload.data",
    value: visualEditorPayload.data,
    templateKey: visualEditorPayload.templateKey,
  });

  candidates.push({
    label: "site.visualEditorPayload.templateData",
    value: visualEditorPayload.templateData,
    templateKey: visualEditorPayload.templateKey,
  });

  candidates.push({
    label: "site.templateData",
    value: siteObject.templateData,
    templateKey: siteObject.templateKey,
  });

  candidates.push({
    label: "site.data",
    value: siteObject.data,
    templateKey: siteObject.templateKey,
  });

  candidates.push({
    label: "site.activePage.visualEditorPayload.data",
    value: activePageVisualPayload.data,
    templateKey: activePageVisualPayload.templateKey,
  });

  candidates.push({
    label:
      "site.activePage.visualEditorPayload.templateData",
    value: activePageVisualPayload.templateData,
    templateKey: activePageVisualPayload.templateKey,
  });

  candidates.push({
    label: "site.activePage.projectData.data",
    value: activePageProjectData.data,
    templateKey: activePageProjectData.templateKey,
  });

  candidates.push({
    label:
      "site.activePage.projectData.templateData",
    value: activePageProjectData.templateData,
    templateKey: activePageProjectData.templateKey,
  });

  candidates.push({
    label: "site.projectData.data",
    value: projectData.data,
    templateKey: projectData.templateKey,
  });

  candidates.push({
    label: "site.projectData.templateData",
    value: projectData.templateData,
    templateKey: projectData.templateKey,
  });

  if (Array.isArray(siteObject.pages)) {
    siteObject.pages.forEach((page: any, index: number) => {
      const pageProjectData = asPlainObject(
        page?.projectData,
      );
      const pageVisualPayload = asPlainObject(
        page?.visualEditorPayload,
      );

      candidates.push({
        label: `site.pages[${index}].visualEditorPayload.data`,
        value: pageVisualPayload.data,
        templateKey: pageVisualPayload.templateKey,
      });

      candidates.push({
        label: `site.pages[${index}].visualEditorPayload.templateData`,
        value: pageVisualPayload.templateData,
        templateKey: pageVisualPayload.templateKey,
      });

      candidates.push({
        label: `site.pages[${index}].projectData.data`,
        value: pageProjectData.data,
        templateKey: pageProjectData.templateKey,
      });

      candidates.push({
        label: `site.pages[${index}].projectData.templateData`,
        value: pageProjectData.templateData,
        templateKey: pageProjectData.templateKey,
      });
    });
  }

  for (const candidate of candidates) {
    const data = asPlainObject(candidate.value);

    if (!Object.keys(data).length) continue;

    const candidateKey = normalizeStudioTemplateKey(
      candidate.templateKey,
    );

    const keyMatches =
      !expectedKey ||
      !candidateKey ||
      candidateKey === expectedKey;

    if (!keyMatches) continue;

    studioDebug(
      "pickVisualTemplateDataFromSavedSite:found",
      {
        source: candidate.label,
        expectedKey,
        candidateKey,
        dataKeys: Object.keys(data),

        contentKeys: Object.keys(
          readPublishedVisualContent(data),
        ),
        styleKeys: Object.keys(
          readPublishedVisualStyles(data),
        ),
        layoutKeys: Object.keys(
          readPublishedVisualLayout(data),
        ),
        responsiveKeys: Object.keys(
          readPublishedVisualResponsive(data),
        ),
        deletedKeys: Object.keys(
          readPublishedVisualDeleted(data),
        ),
      },
    );

    return pickVisualCollectionsOnly(data);
  }

  studioWarn(
    "pickVisualTemplateDataFromSavedSite:not-found",
    {
      expectedKey,
      hasSite: Boolean(site),
      siteProjectDataKeys: Object.keys(projectData),
      siteKeys: Object.keys(siteObject),
    },
  );

  return null;
}

export default function WebsiteStudioPage({
  businessId,
  siteId,
  initialSlug = "your-business",
  initialTemplateId,
  initialTemplateSeed,
  forceTemplateLoad = false,
  onSave,
}: WebsiteStudioPageRuntimeProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const loadedFromServerRef = useRef(false);

  const selectedTemplateSeed = useMemo(() => {
    if (forceTemplateLoad && initialTemplateSeed) {
      return initialTemplateSeed;
    }

    return readTemplateSeedFromStorage();
  }, [forceTemplateLoad, initialTemplateSeed]);

  const shouldLoadSelectedTemplate = Boolean(selectedTemplateSeed);

  const selectedTemplateRenderer = useMemo(() => {
    if (!selectedTemplateSeed) return null;

    return getTemplateRendererBySeed(selectedTemplateSeed);
  }, [selectedTemplateSeed]);

  const isVisualReactTemplate = Boolean(
    selectedTemplateRenderer?.Component &&
      selectedTemplateSeed &&
      shouldUseTemplateRenderer(selectedTemplateSeed),
  );

  const [serverVisualTemplateData, setServerVisualTemplateData] =
    useState<Record<string, any> | null>(null);
  const [serverVisualTemplateLoaded, setServerVisualTemplateLoaded] =
    useState(false);
  const [siteCustomCode, setSiteCustomCode] = useState<Record<string, any>>(
    () => ({
      enabled: true,
      css: "",
      headHtml: "",
      bodyStartHtml: "",
      bodyEndHtml: "",
      javascript: "",
    }),
  );

  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>(null);
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(() => {
    return normalizePublicBusinessSlug(initialSlug) || "your-business";
  });
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");

  const [publishSlugModalOpen, setPublishSlugModalOpen] = useState(false);
  const [publishSlugDraft, setPublishSlugDraft] = useState(() => {
    return normalizePublicBusinessSlug(initialSlug) || "";
  });
  const [publishSlugChecking, setPublishSlugChecking] = useState(false);
  const [publishSlugAvailable, setPublishSlugAvailable] = useState<boolean | null>(null);
  const [publishSlugError, setPublishSlugError] = useState("");
  const [pendingVisualPublishPayload, setPendingVisualPublishPayload] =
    useState<VisualTemplateSavePayload | null>(null);

  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);
  const [publishedSiteUrl, setPublishedSiteUrl] = useState("");

  const [ready, setReady] = useState(false);
  const [loadingSite, setLoadingSite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [activePalette, setActivePalette] = useState<ThemePalette | null>(null);

  const [pages, setPages] = useState<StudioSitePageWithPortal[]>(() => {
    if (selectedTemplateSeed) {
      return createPagesFromTemplateSeed(selectedTemplateSeed).pages;
    }

    return createInitialPages();
  });
  const [siteName, setSiteName] = useState("האתר שלי");
  const [siteSeoSettings, setSiteSeoSettings] = useState<SiteSeoSettings>(() =>
    normalizeSiteSeoSettings(null),
  );
  const [pageSettingsModal, setPageSettingsModal] = useState<{
    open: boolean;
    pageId: string;
    tab: PageSettingsModalTab;
  }>({
    open: false,
    pageId: "",
    tab: "seo",
  });
  const [activePageId, setActivePageId] = useState(() => {
    if (selectedTemplateSeed) {
      return createPagesFromTemplateSeed(selectedTemplateSeed).activePageId;
    }

    return "home";
  });
  /** Shared template visual edits kept while switching between non-library pages */
  const [visualSessionData, setVisualSessionData] = useState<Record<string, any>>(
    {},
  );
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [activePageSections, setActivePageSections] = useState<
    StudioPageSection[]
  >([]);
  const [clientPortalModalOpen, setClientPortalModalOpen] = useState(false);

  const activePage = useMemo(() => {
    return pages.find((page) => page.id === activePageId) || pages[0];
  }, [pages, activePageId]);

  const activePageClientPortal = useMemo(() => {
    return activePage?.clientPortal || createDefaultClientPortalConfig();
  }, [activePage]);

  const publicUrl = useMemo(() => {
    /*
      Prefer the real published URL that came back from the server (custom
      domain or live slug). Fall back to the current slug, and only use the
      generic placeholder when the site was never published/saved.
    */
    const fromSession = String(
      (visualSessionData as any)?.__publicUrl || "",
    ).trim();
    if (fromSession) return fromSession.replace(/\/+$/, "");

    const cleanSlug = normalizePublicBusinessSlug(slug);
    if (cleanSlug) return buildPublicSiteUrl(cleanSlug);

    return buildPublicSiteUrl("your-business");
  }, [slug, visualSessionData]);

  const publicUrlIsPlaceholder =
    !normalizePublicBusinessSlug(slug) &&
    !String((visualSessionData as any)?.__publicUrl || "").trim();

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !isObjectIdLikeSlug(slug);

  const editorStageClass =
    "relative min-h-0 flex-1 overflow-hidden bg-[#eef1f8]";

  // Visual templates: always expose the full page list from the renderer
  // (home/about/services/…), even before/without a rich server payload.
  useEffect(() => {
    if (!isVisualReactTemplate || !selectedTemplateSeed) return;

    const templatePages =
      createPagesFromTemplateSeed(selectedTemplateSeed).pages;

    if (!templatePages.length) return;

    setPages((previousPages) =>
      mergeTemplateAndSavedPages(templatePages, previousPages),
    );
  }, [
    isVisualReactTemplate,
    selectedTemplateSeed,
    selectedTemplateRenderer?.key,
  ]);

  useEffect(() => {
    if (!isVisualReactTemplate || !businessId) {
      setServerVisualTemplateLoaded(true);
      return;
    }

    let alive = true;

    async function loadVisualSiteFromServer() {
      setServerVisualTemplateLoaded(false);

      try {
        studioDebug("loadVisualSiteFromServer:start", {
          businessId,
          siteId,
          templateKey: selectedTemplateRenderer?.key,
        });

        const loadUrl = siteId
          ? `/api/site-builder/sites/${siteId}`
          : `/api/site-builder/site/${businessId}`;

        const res = await fetch(loadUrl, {
          method: "GET",
          credentials: "include",
          headers: buildAuthHeaders(),
        });

        const data = await res.json().catch(() => null);

        studioDebug("loadVisualSiteFromServer:response", {
          ok: res.ok,
          status: res.status,
          hasSite: Boolean(data?.site),
          siteSlug: data?.site?.slug,
          siteStatus: data?.site?.status,
          sitePublished: data?.site?.published,
          siteProjectDataKeys: Object.keys(asPlainObject(data?.site?.projectData)),
        });

        if (!alive) return;

        if (!res.ok || !data?.site) {
          setServerVisualTemplateData(null);
          return;
        }

        const loadedSiteCode = asPlainObject(
          data.site.customCode || data.site.__customCode,
        );
        setSiteCustomCode({
          enabled: loadedSiteCode.enabled !== false,
          css: String(loadedSiteCode.css || ""),
          headHtml: String(loadedSiteCode.headHtml || ""),
          bodyStartHtml: String(loadedSiteCode.bodyStartHtml || ""),
          bodyEndHtml: String(loadedSiteCode.bodyEndHtml || ""),
          javascript: String(loadedSiteCode.javascript || ""),
          ...(loadedSiteCode.updatedAt
            ? { updatedAt: String(loadedSiteCode.updatedAt) }
            : {}),
        });

        if (data.site.name) {
          setSiteName(String(data.site.name));
        }

        setSiteSeoSettings(
          normalizeSiteSeoSettings(data.site.seoSettings || data.site.seo),
        );

        const savedTemplateData = pickVisualTemplateDataFromSavedSite(
          data.site,
          selectedTemplateRenderer?.key || getSeedRendererKey(selectedTemplateSeed as ReadyWebsiteTemplateSeed),
        );

        const serverSlug = getPublicSlugFromSavedSite(data.site);

        if (serverSlug) {
          setSlug(serverSlug);
        }

        const serverPublicUrl =
          data.site.publicUrl ||
          (serverSlug ? buildPublicSiteUrl(serverSlug) : "");

        const savedTemplateDataWithSiteMeta = savedTemplateData
          ? {
              ...savedTemplateData,
              __siteSlug: serverSlug,
              __publicUrl: serverPublicUrl,
              __siteDomain: data.site.siteDomain || BIZUPLY_PUBLIC_SITE_DOMAIN,
              __published: Boolean(data.site.published),
              __status: data.site.status || "",
            }
          : null;

        if (savedTemplateDataWithSiteMeta) {
          setServerVisualTemplateData(savedTemplateDataWithSiteMeta);
        } else {
          setServerVisualTemplateData(null);
        }

        // Hydrate studio pages from saved payloads, but never drop template pages
        // (server often persists only the active page — e.g. home only).
        const templatePages = selectedTemplateSeed
          ? createPagesFromTemplateSeed(selectedTemplateSeed).pages
          : [];

        if (Array.isArray(data.site.pages) && data.site.pages.length) {
          const savedPages = data.site.pages.map((page: any) => {
            const visual =
              (page?.templateData && Object.keys(page.templateData).length
                ? page.templateData
                : null) ||
              (page?.data && Object.keys(page.data).length ? page.data : null) ||
              (page?.projectData?.templateData &&
              Object.keys(page.projectData.templateData).length
                ? page.projectData.templateData
                : null) ||
              {};

            return {
              ...page,
              clientPortal:
                page.clientPortal || createDefaultClientPortalConfig(),
              data: visual,
              templateData: visual,
              projectData: {
                ...(page.projectData || {}),
                editorMode: "visual-react",
                templateKey:
                  page.templateKey ||
                  data.site.templateKey ||
                  selectedTemplateRenderer?.key,
                data: visual,
                templateData: visual,
              },
            };
          }) as StudioSitePageWithPortal[];

          const nextPages = mergeTemplateAndSavedPages(
            templatePages,
            savedPages,
          );

          setPages(nextPages);

          const preferred =
            data.site.activePageId ||
            nextPages.find((p: any) => p.isHome)?.id ||
            nextPages[0]?.id;

          if (preferred) {
            setActivePageId(preferred);
          }
        } else {
          // Fallback: restore freshly generated AI pages from local cache
          try {
            const cached = localStorage.getItem("bizuply-ai-site-visual");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed?.pages) && parsed.pages.length) {
                const cachedPages = parsed.pages.map((page: any) => ({
                  ...page,
                  clientPortal:
                    page.clientPortal || createDefaultClientPortalConfig(),
                })) as StudioSitePageWithPortal[];

                setPages(
                  mergeTemplateAndSavedPages(templatePages, cachedPages),
                );
                if (parsed.activePageId) {
                  setActivePageId(parsed.activePageId);
                }
              } else if (templatePages.length) {
                setPages(templatePages);
              }
            } else if (templatePages.length) {
              setPages(templatePages);
            }
          } catch {
            if (templatePages.length) {
              setPages(templatePages);
            }
          }
        }
      } catch (error) {
        studioError("loadVisualSiteFromServer:error", error);

        if (alive) {
          setServerVisualTemplateData(null);
        }
      } finally {
        if (alive) {
          setServerVisualTemplateLoaded(true);
        }
      }
    }

    loadVisualSiteFromServer();

    return () => {
      alive = false;
    };
  }, [
    isVisualReactTemplate,
    businessId,
    siteId,
    initialSlug,
    selectedTemplateRenderer?.key,
    selectedTemplateSeed,
  ]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    if (!businessId || !slug || slug === "your-business" || !slugValid) {
      setSlugAvailable(null);
      setSlugError("");
      setSlugChecking(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSlugChecking(true);
      setSlugError("");

      try {
        const res = await fetch(
          `/api/site-builder/slug/check?slug=${encodeURIComponent(
            slug,
          )}&businessId=${encodeURIComponent(businessId)}`,
          {
            method: "GET",
            credentials: "include",
            headers: buildAuthHeaders(),
          },
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setSlugAvailable(false);
          setSlugError(data?.error || "שגיאה בבדיקת הסאב דומיין");
          return;
        }

        const available = Boolean(data?.available);

        setSlugAvailable(available);
        setSlugError(
          available ? "" : data?.error || "הסאב דומיין הזה כבר תפוס",
        );
      } catch {
        setSlugAvailable(false);
        setSlugError("שגיאה בבדיקת הסאב דומיין");
      } finally {
        setSlugChecking(false);
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [businessId, slug, slugValid]);

  const syncSections = (editor: Editor | null | undefined) => {
    window.setTimeout(() => {
      try {
        if (!editor || !isReadyEditor(editor)) {
          studioWarn("syncSections:editor-not-ready");
          setActivePageSections([]);
          return;
        }

        const wrapper = editor.getWrapper?.();

        if (!wrapper || typeof wrapper.find !== "function") {
          studioWarn("syncSections:wrapper-not-ready");
          setActivePageSections([]);
          return;
        }

        const sections = extractSectionsFromEditor(editor);

        studioDebug("syncSections:success", {
          sectionsCount: sections.length,
          sections: sections.map((section) => ({
            id: section.id,
            kind: section.kind,
            title: section.title,
          })),
        });

        setActivePageSections(sections);
      } catch (error) {
        studioError("syncSections:error", error);
        setActivePageSections([]);
      }
    }, 0);
  };

  const syncSelected = (editor: Editor | null | undefined) => {
    try {
      if (!editor || !isReadyEditor(editor)) {
        studioWarn("syncSelected:editor-not-ready");
        setSelectedComponent(null);
        setActivePageSections([]);
        return;
      }

      const selected = editor.getSelected?.() || null;

      studioDebug("syncSelected:success", {
        hasSelected: Boolean(selected),
        selectedTag: selected?.get?.("tagName"),
        selectedId: selected?.getId?.(),
      });

      setSelectedComponent(selected);
      syncSections(editor);
    } catch (error) {
      studioError("syncSelected:error", error);
      setSelectedComponent(null);
      setActivePageSections([]);
    }
  };

  useEffect(() => {
    if (isVisualReactTemplate) return;
    if (!editorContainerRef.current || editorRef.current) return;

    const editor = initBizuplyEditor({
      container: editorContainerRef.current,
      stylesContainer: stylesRef.current,
      traitsContainer: traitsRef.current,
      layersContainer: layersRef.current,
      onReady: (createdEditor) => {
        editorRef.current = createdEditor;
        setReady(true);
        syncSelected(createdEditor);
      },
      onSelect: () => {
        if (editorRef.current) syncSelected(editorRef.current);
      },
    });

    editorRef.current = editor;

    editor.on("component:selected", () => syncSelected(editor));
    editor.on("component:deselected", () => syncSelected(editor));
    editor.on("component:add", () => syncSections(editor));
    editor.on("component:remove", () => syncSections(editor));
    editor.on("component:update", () => syncSections(editor));
    editor.on("component:styleUpdate", () => syncSections(editor));

    return () => {
      editor.destroy();
      editorRef.current = null;
      setSelectedComponent(null);
      setActivePageSections([]);
      setReady(false);
      loadedFromServerRef.current = false;
    };
  }, [isVisualReactTemplate]);

  useEffect(() => {
    if (isVisualReactTemplate) return;

    if (!ready || !editorRef.current || !selectedTemplateSeed) {
      studioDebug("templateLoadEffect:skip", {
        ready,
        hasEditor: Boolean(editorRef.current),
        hasSelectedTemplateSeed: Boolean(selectedTemplateSeed),
      });
      return;
    }

    const editor = editorRef.current;
    const builtTemplate = createPagesFromTemplateSeed(selectedTemplateSeed);
    const pageToLoad =
      builtTemplate.pages.find(
        (page) => page.id === builtTemplate.activePageId,
      ) || builtTemplate.pages[0];

    studioDebug("templateLoadEffect:loading-template", {
      templateId: getTemplateIdFromSeed(selectedTemplateSeed),
      templateName: selectedTemplateSeed.name,
      slug: builtTemplate.slug,
      activePageId: builtTemplate.activePageId,
      pagesCount: builtTemplate.pages.length,
      pageToLoadId: pageToLoad?.id,
      pageToLoadHtmlLength: String(pageToLoad?.html || "").length,
      pageToLoadCssLength: String(pageToLoad?.css || "").length,
    });

    loadedFromServerRef.current = true;
    setLoadingSite(false);
    setSlug(builtTemplate.slug);
    setPages(builtTemplate.pages);
    setActivePageId(builtTemplate.activePageId);
    setActivePanel("pages");
    setActivePalette(null);

    if (pageToLoad) {
      loadPageIntoEditor(editor, pageToLoad, { forceHtml: true });
      syncSections(editor);
    } else {
      studioWarn("templateLoadEffect:no-page-to-load");
    }
  }, [ready, selectedTemplateSeed, isVisualReactTemplate]);

  useEffect(() => {
    if (isVisualReactTemplate) return;

    if (
      !ready ||
      !businessId ||
      !editorRef.current ||
      loadedFromServerRef.current ||
      shouldLoadSelectedTemplate
    ) {
      return;
    }

    loadedFromServerRef.current = true;

    const loadSiteFromServer = async () => {
      setLoadingSite(true);

      try {
        const loadUrl = siteId
          ? `/api/site-builder/sites/${siteId}`
          : `/api/site-builder/site/${businessId}`;

        const res = await fetch(loadUrl, {
          method: "GET",
          credentials: "include",
          headers: buildAuthHeaders(),
        });

        if (!res.ok) {
          setLoadingSite(false);
          return;
        }

        const data = await res.json();

        if (!data?.site) {
          setLoadingSite(false);
          return;
        }

        const serverPages: StudioSitePageWithPortal[] =
          Array.isArray(data.site.pages) && data.site.pages.length
            ? data.site.pages.map((page: StudioSitePageWithPortal) => ({
                ...page,
                hiddenFromMenu: Boolean((page as any).hiddenFromMenu),
                seo: normalizePageSeo(page.seo),
                clientPortal:
                  page.clientPortal || createDefaultClientPortalConfig(),
              }))
            : createInitialPages();

        const nextActivePageId =
          data.site.activePageId ||
          serverPages.find((page) => page.isHome)?.id ||
          serverPages[0]?.id ||
          "home";

        setSlug(
          normalizeBusinessSlug(data.site.slug || initialSlug) ||
            "your-business",
        );
        if (data.site.name) {
          setSiteName(String(data.site.name));
        }
        setSiteSeoSettings(
          normalizeSiteSeoSettings(data.site.seoSettings || data.site.seo),
        );
        setPages(serverPages);
        setActivePageId(nextActivePageId);

        const pageToLoad =
          serverPages.find((page) => page.id === nextActivePageId) ||
          serverPages[0];

        if (pageToLoad && editorRef.current) {
          loadPageIntoEditor(editorRef.current, pageToLoad);
          syncSections(editorRef.current);
        }
      } catch {
      } finally {
        setLoadingSite(false);
      }
    };

    loadSiteFromServer();
  }, [
    ready,
    businessId,
    siteId,
    initialSlug,
    forceTemplateLoad,
    initialTemplateSeed,
    shouldLoadSelectedTemplate,
    isVisualReactTemplate,
  ]);

  const runEditor = (callback: (editor: Editor) => void) => {
  const editor = editorRef.current;

  if (!isReadyEditor(editor)) return;

  callback(editor);
};

const getSelectedOrWrapper = (editor: Editor | null | undefined) => {
  if (!isReadyEditor(editor)) return null;

  const selected = editor.getSelected();
  if (selected) return selected;

  const wrapper = editor.getWrapper();
  return wrapper || null;
};

const getSafeAppendTarget = (editor: Editor | null | undefined) => {
  if (!isReadyEditor(editor)) return null;

  const selected: any = editor.getSelected();
  const wrapper: any = editor.getWrapper();

  if (!selected) return wrapper || null;

  const tagName = String(selected.get?.("tagName") || "").toLowerCase();
  const droppable = selected.get?.("droppable");

  const isGoodContainer = [
    "section",
    "main",
    "header",
    "footer",
    "article",
    "aside",
    "div",
  ].includes(tagName);

  if (isGoodContainer && droppable !== false) return selected;

  return wrapper || null;
};

  const selectAddedComponents = (editor: Editor, added: any) => {
    window.setTimeout(() => {
      const list = Array.isArray(added) ? added : added ? [added] : [];
      const last = list[list.length - 1];

      if (last) {
        editor.select(last);
        setSelectedComponent(last);
        syncSections(editor);
        last.view?.el?.scrollIntoView?.({
          behavior: "smooth",
          block: "center",
        });
        return;
      }

      const wrapper = editor.getWrapper();
      const components = wrapper?.components();
      const lastComponent = components?.at?.(components.length - 1);

      if (lastComponent) {
        editor.select(lastComponent);
        setSelectedComponent(lastComponent);
        syncSections(editor);
      }
    }, 0);
  };

  const applyGlobalPaletteCss = (editor: Editor, palette: ThemePalette) => {
    const colors = palette.colors as Record<string, string>;
    const headingFont = palette.font?.heading || "Assistant";
    const bodyFont = palette.font?.body || "Assistant";

    editor.Css.addRules(`
      :root {
        --biz-primary: ${colors.primary || "#8b5cf6"};
        --biz-secondary: ${colors.secondary || colors.primary || "#ec4899"};
        --biz-accent: ${colors.accent || colors.primary || "#8b5cf6"};
        --biz-bg: ${colors.background || "#ffffff"};
        --biz-surface: #ffffff;
        --biz-text: ${colors.text || "#0f172a"};
        --biz-muted: ${colors.muted || "#64748b"};
        --biz-heading-font: ${headingFont};
        --biz-body-font: ${bodyFont};
      }

      body,
      .bizuply-site,
      [data-bizuply-site="true"] {
        background: var(--biz-bg) !important;
        color: var(--biz-text) !important;
        font-family: var(--biz-body-font), system-ui, sans-serif !important;
      }

      h1, h2, h3, h4, h5, h6,
      .biz-title,
      [data-biz-title="true"] {
        font-family: var(--biz-heading-font), system-ui, sans-serif !important;
      }

      .biz-btn,
      [data-biz-button="primary"],
      a[class*="bg-violet"],
      button[class*="bg-violet"] {
        background: linear-gradient(135deg, var(--biz-primary), var(--biz-secondary)) !important;
        color: #ffffff !important;
        border-color: transparent !important;
      }

      section {
        scroll-margin-top: 120px;
      }
    `);
  };

  const readFileAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const pickImageFromComputer = async () => {
    return new Promise<string | null>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const dataUrl = await readFileAsDataUrl(file);
        resolve(dataUrl);
      };

      input.click();
    });
  };

  const updatePageTitle = (pageId: string, title: string) => {
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) return;

    setPages((prev) => {
      const nextPages = prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          title: cleanTitle,
          updatedAt: new Date().toISOString(),
        };
      });

      setVisualSessionData((previous) =>
        syncSitePageTitlesIntoVisualData(
          previous || {},
          slimSitePageNavSources(nextPages),
        ),
      );

      return nextPages;
    });
  };

  const addBusinessPage = (title: string) => {
    runEditor((editor) => {
      const cleanTitle = title.trim() || "עמוד חדש";
      const id = uid("page");

      const nextPage: StudioSitePageWithPortal = {
        id,
        title: cleanTitle,
        slug: normalizePageSlug(cleanTitle, pages),
        type: "blank",
        html: createBlankPageHtml(cleanTitle),
        css: defaultCanvasCss,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientPortal: createDefaultClientPortalConfig(),
      };

      setPages((prev) => {
        const withSnapshot = snapshotPages(prev, editor, activePageId);
        return [...withSnapshot, nextPage];
      });

      setActivePageId(id);
      setActivePanel("pages");

      window.setTimeout(() => {
        loadPageIntoEditor(editor, nextPage);
        syncSections(editor);
      }, 0);
    });
  };

  const addLibraryPage = (pageTemplate: VisualLibraryPageTemplate) => {
    if (!pageTemplate?.id) return;

    const id = uid("page");
    const title =
      String(pageTemplate.title || "").trim() || "עמוד חדש";
    const slugSuggestion =
      String(pageTemplate.slugSuggestion || "").trim() || title;

    const materialized = materializePageVisualData({
      id,
      title,
      slug: slugSuggestion,
      sections: (pageTemplate.sectionIds || []).map((libraryId) => ({
        libraryId,
      })),
    });

    const insertedCount = Object.keys(
      asPlainObject(materialized.__insertedSections),
    ).length;

    if (!insertedCount) {
      console.warn(
        "[BizUply] library page materialized with 0 sections",
        pageTemplate.id,
        pageTemplate.sectionIds,
      );
    }

    const nextVisualData = {
      ...materialized,
      __activePageId: id,
      __blankVisualPage: true,
      __libraryPage: true,
      __libraryPageTemplateId: String(pageTemplate.id || ""),
    };

    const templateKey =
      selectedTemplateRenderer?.key ||
      selectedTemplateSeed?.id ||
      "";

    const nextPage: StudioSitePageWithPortal = {
      id,
      title,
      slug: normalizePageSlug(slugSuggestion, pages),
      type: "blank" as StudioSitePageType,
      html: "",
      css: "",
      projectData: {
        editorMode: "visual-react",
        templateKey,
        data: nextVisualData,
        templateData: nextVisualData,
      },
      data: nextVisualData,
      templateData: nextVisualData,
      visualEditorPayload: {
        editorMode: "visual-react",
        templateKey,
        data: nextVisualData,
        templateData: nextVisualData,
        activePageId: id,
      },
      htmlSnapshot: "",
      snapshotPageId: id,
      visualSnapshotVersion: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientPortal: createDefaultClientPortalConfig(),
    } as StudioSitePageWithPortal;

    setPages((previousPages) => [...previousPages, nextPage]);
    setActivePageId(id);
    setActivePanel("pages");
  };

  useEffect(() => {
    const handleLibraryPage = (event: Event) => {
      const customEvent = event as CustomEvent<{
        page?: Record<string, any>;
        visualData?: Record<string, any>;
        currentVisualData?: Record<string, any>;
      }>;

      const pageTemplate = asPlainObject(
        customEvent.detail?.page,
      );
      const incomingVisualData = asPlainObject(
        customEvent.detail?.visualData,
      );
      const currentVisualData = asPlainObject(
        customEvent.detail?.currentVisualData,
      );

      if (!Object.keys(pageTemplate).length) return;

      const id = uid("page");
      const title =
        String(pageTemplate.title || "").trim() ||
        "עמוד חדש";
      const slugSuggestion =
        String(pageTemplate.slugSuggestion || "").trim() ||
        title;

      const nextVisualData = {
        ...incomingVisualData,
        __activePageId: id,
        __blankVisualPage: true,
        __libraryPage: true,
        __libraryPageTemplateId:
          String(pageTemplate.id || ""),
      };

      const nextPage: StudioSitePageWithPortal = {
        id,
        title,
        slug: normalizePageSlug(
          slugSuggestion,
          pages,
        ),
        type: "blank" as StudioSitePageType,
        html: "",
        css: "",
        projectData: {
          editorMode: "visual-react",
          templateKey:
            selectedTemplateRenderer?.key ||
            selectedTemplateSeed?.id ||
            "",
          data: nextVisualData,
          templateData: nextVisualData,
        },
        data: nextVisualData,
        templateData: nextVisualData,
        visualEditorPayload: {
          editorMode: "visual-react",
          templateKey:
            selectedTemplateRenderer?.key ||
            selectedTemplateSeed?.id ||
            "",
          data: nextVisualData,
          templateData: nextVisualData,
          activePageId: id,
        },
        htmlSnapshot: "",
        snapshotPageId: id,
        visualSnapshotVersion: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientPortal: createDefaultClientPortalConfig(),
      } as StudioSitePageWithPortal;

      setPages((previousPages) => {
        const withCurrentSnapshot =
          Object.keys(currentVisualData).length
            ? previousPages.map((page) =>
                page.id === activePageId
                  ? ({
                      ...page,
                      data: currentVisualData,
                      templateData: currentVisualData,
                      projectData: {
                        ...asPlainObject(page.projectData),
                        data: currentVisualData,
                        templateData: currentVisualData,
                      },
                      visualEditorPayload: {
                        ...asPlainObject(
                          page.visualEditorPayload,
                        ),
                        data: currentVisualData,
                        templateData: currentVisualData,
                        activePageId,
                      },
                      updatedAt: new Date().toISOString(),
                    } as StudioSitePageWithPortal)
                  : page,
              )
            : previousPages;

        return [...withCurrentSnapshot, nextPage];
      });

      setActivePageId(id);
      setActivePanel("pages");
    };

    window.addEventListener(
      "bizuply:visual-library-add-page",
      handleLibraryPage as EventListener,
    );

    return () => {
      window.removeEventListener(
        "bizuply:visual-library-add-page",
        handleLibraryPage as EventListener,
      );
    };
  }, [
    activePageId,
    pages,
    selectedTemplateRenderer?.key,
    selectedTemplateSeed?.id,
  ]);

  const updateActivePageClientPortal = (
    patch:
      | Partial<ClientPortalPageConfig>
      | ((current: ClientPortalPageConfig) => ClientPortalPageConfig),
  ) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== activePageId) return page;

        const current = page.clientPortal || createDefaultClientPortalConfig();
        const next =
          typeof patch === "function"
            ? patch(current)
            : {
                ...current,
                ...patch,
              };

        return {
          ...page,
          clientPortal: next,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const addClientPortalVariable = () => {
    const now = new Date().toISOString();
    const count = activePageClientPortal.variables.length + 1;

    const variable: ClientPortalVariable = {
      id: uid("var"),
      key: `custom_${count}`,
      label: `משתנה ${count}`,
      type: "text",
      source: "business_input",
      scope: "per_client",
      visibleToClient: true,
      editableByClient: false,
      required: false,
      placeholder: "",
      options: [],
      createdAt: now,
      updatedAt: now,
    };

    updateActivePageClientPortal((current) => ({
      ...current,
      enabled: true,
      loginRequired: true,
      dataMode: "per_client",
      variables: [...current.variables, variable],
    }));
  };

  const updateClientPortalVariable = (
    variableId: string,
    patch: Partial<ClientPortalVariable>,
  ) => {
    updateActivePageClientPortal((current) => ({
      ...current,
      variables: current.variables.map((variable) => {
        if (variable.id !== variableId) return variable;

        const nextLabel = patch.label ?? variable.label;
        const shouldAutoKey =
          patch.label !== undefined &&
          (!variable.key || variable.key.startsWith("custom_"));

        return {
          ...variable,
          ...patch,
          key: shouldAutoKey
            ? cleanVariableKey(nextLabel) || variable.key
            : (patch.key ?? variable.key),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  };

  const deleteClientPortalVariable = (variableId: string) => {
    updateActivePageClientPortal((current) => ({
      ...current,
      variables: current.variables.filter(
        (variable) => variable.id !== variableId,
      ),
    }));
  };

  const insertVariablePlaceholderToEditor = (
    variable: ClientPortalVariable,
  ) => {
    runEditor((editor) => {
      const html = `
<span
  data-client-variable="true"
  data-client-variable-key="${variable.key}"
  class="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-sm font-black text-violet-700 ring-1 ring-violet-100"
>
  {{${variable.key}}}
</span>`;

      const target: any = getSafeAppendTarget(editor);

      const added =
        target && typeof target.append === "function"
          ? target.append(html)
          : editor.addComponents(html);

      selectAddedComponents(editor, added);
    });
  };

  const handleSelectPage = (pageId: string) => {
    runEditor((editor) => {
      if (pageId === activePageId) {
        setActivePanel("pages");
        syncSections(editor);
        return;
      }

      let pageToLoad: StudioSitePageWithPortal | null = null;

      setPages((prev) => {
        const withSnapshot = snapshotPages(prev, editor, activePageId);
        pageToLoad = withSnapshot.find((page) => page.id === pageId) || null;
        return withSnapshot;
      });

      setActivePageId(pageId);
      setActivePanel("pages");

      window.setTimeout(() => {
        if (!pageToLoad) return;
        loadPageIntoEditor(editor, pageToLoad);
        syncSections(editor);
      }, 0);
    });
  };

  const attachVisualDataToPage = (
    page: StudioSitePageWithPortal,
    visualData: Record<string, any>,
  ): StudioSitePageWithPortal => {
    const nextVisualData = {
      ...visualData,
      __activePageId: page.id,
    };

    return {
      ...page,
      data: nextVisualData,
      templateData: nextVisualData,
      projectData: {
        ...asPlainObject(page.projectData),
        data: nextVisualData,
        templateData: nextVisualData,
        editorMode: "visual-react",
        activePageId: page.id,
      },
      visualEditorPayload: {
        ...asPlainObject(page.visualEditorPayload),
        data: nextVisualData,
        templateData: nextVisualData,
        editorMode: "visual-react",
        activePageId: page.id,
      },
      updatedAt: new Date().toISOString(),
    } as StudioSitePageWithPortal;
  };

  const handlePageSettingsModalSave = ({
    title: nextTitle,
    slug: nextSlugValue,
    seo,
  }: {
    title: string;
    slug: string;
    seo: SitePageSeoSettings;
  }) => {
    const id = String(pageSettingsModal.pageId || "").trim();
    if (!id) return;

    const cleanTitle = String(nextTitle || "").trim();
    if (!cleanTitle) return;

    const nextSlug = normalizePageSlug(nextSlugValue || cleanTitle, pages, id);

    setPages((prev) => {
      const previousTitleById: Record<string, string> = {};
      prev.forEach((page) => {
        const pageId = String(page.id || "").trim();
        const title = String(page.title || "").trim();
        if (pageId && title) previousTitleById[pageId] = title;
      });

      const nextPages = prev.map((page) => {
        if (page.id !== id) return page;

        return {
          ...page,
          title: cleanTitle,
          slug: page.isHome ? "" : nextSlug,
          seo: normalizePageSeo(seo),
          updatedAt: new Date().toISOString(),
        };
      });

      const slimPages = slimSitePageNavSources(nextPages);

      setVisualSessionData((previous) => {
        const synced = syncSitePageTitlesIntoVisualData(
          previous || {},
          slimPages,
          { previousTitleById },
        );
        delete (synced as any).__sitePages;
        delete (synced as any).__previousSitePageTitles;
        return synced;
      });

      return nextPages;
    });
  };

  const handleVisualSitePageAction = (
    action: string,
    pageId: string,
  ) => {
    const id = String(pageId || "").trim();
    if (!id) return;

    const target = pages.find((page) => page.id === id);
    if (!target) return;

    if (action === "settings") {
      setPageSettingsModal({ open: true, pageId: id, tab: "settings" });
      return;
    }

    if (action === "seo") {
      setPageSettingsModal({ open: true, pageId: id, tab: "seo" });
      return;
    }

    if (action === "social") {
      setPageSettingsModal({ open: true, pageId: id, tab: "social" });
      return;
    }

    if (action === "rename") {
      const nextTitle = window.prompt(
        "שם חדש לעמוד",
        String(target.title || ""),
      );
      if (nextTitle == null) return;
      const cleanTitle = String(nextTitle).trim();
      if (!cleanTitle) return;

      setPages((prev) => {
        const previousTitleById: Record<string, string> = {};
        prev.forEach((page) => {
          const pageId = String(page.id || "").trim();
          const title = String(page.title || "").trim();
          if (pageId && title) previousTitleById[pageId] = title;
        });

        const nextPages = prev.map((page) => {
          if (page.id !== id) return page;

          return {
            ...page,
            title: cleanTitle,
            updatedAt: new Date().toISOString(),
          };
        });

        const slimPages = slimSitePageNavSources(nextPages);

        setVisualSessionData((previous) => {
          const synced = syncSitePageTitlesIntoVisualData(
            previous || {},
            slimPages,
            { previousTitleById },
          );
          delete (synced as any).__sitePages;
          delete (synced as any).__previousSitePageTitles;
          return synced;
        });

        return nextPages;
      });
      return;
    }

    if (action === "duplicate") {
      const newId = uid("page");
      const visual =
        extractVisualDataFromPayload({
          data: (target as any)?.data,
          templateData: (target as any)?.templateData,
          projectData: (target as any)?.projectData,
          visualEditorPayload: (target as any)?.visualEditorPayload,
        }) || {};

      const copyTitle = `${String(target.title || "עמוד").trim()} (עותק)`;
      const nextPage = {
        ...target,
        id: newId,
        title: copyTitle,
        slug: target.isHome
          ? normalizePageSlug(copyTitle, pages)
          : normalizePageSlug(copyTitle, pages),
        isHome: false,
        type: target.type === "home" ? "blank" : target.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: { ...asPlainObject(visual), __activePageId: newId },
        templateData: { ...asPlainObject(visual), __activePageId: newId },
        projectData: {
          ...asPlainObject(target.projectData),
          data: { ...asPlainObject(visual), __activePageId: newId },
          templateData: { ...asPlainObject(visual), __activePageId: newId },
        },
        visualEditorPayload: {
          ...asPlainObject(target.visualEditorPayload),
          data: { ...asPlainObject(visual), __activePageId: newId },
          templateData: { ...asPlainObject(visual), __activePageId: newId },
          activePageId: newId,
        },
      } as StudioSitePageWithPortal;

      setPages((prev) => [...prev, nextPage]);
      setActivePageId(newId);
      return;
    }

    if (action === "setHome") {
      setPages((prev) =>
        prev.map((page) => ({
          ...page,
          isHome: page.id === id,
          slug: page.id === id ? "" : page.slug || normalizePageSlug(page.title, prev, page.id),
          type:
            page.id === id
              ? ("home" as StudioSitePageType)
              : page.type === "home"
                ? ("blank" as StudioSitePageType)
                : page.type,
          updatedAt: new Date().toISOString(),
        })),
      );
      return;
    }

    if (action === "hideMenu") {
      setPages((prev) =>
        prev.map((page) =>
          page.id === id
            ? ({
                ...page,
                hiddenFromMenu: !(page as any).hiddenFromMenu,
                updatedAt: new Date().toISOString(),
              } as StudioSitePageWithPortal)
            : page,
        ),
      );
      return;
    }

    if (action === "delete") {
      if (target.isHome) {
        window.alert("לא ניתן למחוק את דף הבית. הגדירי קודם עמוד אחר כדף הבית.");
        return;
      }
      const ok = window.confirm(`למחוק את העמוד "${target.title}"?`);
      if (!ok) return;

      setPages((prev) => prev.filter((page) => page.id !== id));
      if (activePageId === id) {
        const fallback =
          pages.find((page) => page.isHome)?.id ||
          pages.find((page) => page.id !== id)?.id ||
          "home";
        setActivePageId(fallback);
      }
      return;
    }

    if (
      action === "background" ||
      action === "copy" ||
      action === "dynamic" ||
      action === "subpage"
    ) {
      window.alert(
        "הפעולה הזו בתפריט העמודים תהיה זמינה בשלב הבא. כרגע אפשר להשתמש בהגדרות, SEO, שיתוף, שינוי שם, שכפול, דף בית, הסתרה מתפריט ומחיקה.",
      );
    }
  };

  const handleSelectVisualSitePage = (
    pageId: string,
    currentVisualData?: Record<string, any>,
  ) => {
    const nextId = String(pageId || "").trim();
    if (!nextId || nextId === activePageId) return;

    const snapshot = asPlainObject(currentVisualData);
    const leavingLibrary = Boolean(
      snapshot.__libraryPage || snapshot.__blankVisualPage,
    );

    setPages((previousPages) =>
      previousPages.map((page) =>
        page.id === activePageId && Object.keys(snapshot).length
          ? attachVisualDataToPage(page, snapshot)
          : page,
      ),
    );

    if (!leavingLibrary && Object.keys(snapshot).length) {
      setVisualSessionData({
        ...snapshot,
        __activePageId: nextId,
        __blankVisualPage: false,
        __libraryPage: false,
        __libraryPageTemplateId: undefined,
      });
    } else {
      setVisualSessionData((previous) => ({
        ...asPlainObject(previous),
        __activePageId: nextId,
        __blankVisualPage: false,
        __libraryPage: false,
        __libraryPageTemplateId: undefined,
      }));
    }

    setActivePageId(nextId);
  };

  const handleSelectSection = (sectionId: string) => {
    runEditor((editor) => {
      const wrapper: any = editor.getWrapper();
      const found =
        wrapper?.find?.(`#${sectionId}`)?.[0] ||
        wrapper?.find?.(`[data-studio-section-id="${sectionId}"]`)?.[0];

      if (!found) return;

      editor.select(found);
      setSelectedComponent(found);
      found.view?.el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    runEditor((editor) => {
      const wrapper: any = editor.getWrapper();
      const found =
        wrapper?.find?.(`#${sectionId}`)?.[0] ||
        wrapper?.find?.(`[data-studio-section-id="${sectionId}"]`)?.[0];

      if (!found) return;

      const ok = window.confirm("למחוק את הסקשן מהעמוד הזה?");
      if (!ok) return;

      found.remove();
      editor.select(null);
      setSelectedComponent(null);
      syncSections(editor);
    });
  };

  const handleDuplicateSection = (sectionId: string) => {
    runEditor((editor) => {
      const wrapper: any = editor.getWrapper();
      const found =
        wrapper?.find?.(`#${sectionId}`)?.[0] ||
        wrapper?.find?.(`[data-studio-section-id="${sectionId}"]`)?.[0];

      if (!found) return;

      const parent = found.parent?.();
      const collection = parent?.components?.();
      const index = collection?.indexOf?.(found) ?? -1;
      const cloned = found.clone?.();

      if (cloned && collection?.add) {
        collection.add(cloned, { at: index >= 0 ? index + 1 : undefined });
        editor.select(cloned);
        setSelectedComponent(cloned);
        syncSections(editor);
      }
    });
  };

  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    runEditor((editor) => {
      const wrapper: any = editor.getWrapper();
      const found =
        wrapper?.find?.(`#${sectionId}`)?.[0] ||
        wrapper?.find?.(`[data-studio-section-id="${sectionId}"]`)?.[0];

      if (!found) return;

      const parent = found.parent?.();
      const collection = parent?.components?.();
      const index = collection?.indexOf?.(found) ?? -1;
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (
        !parent ||
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= collection.length
      ) {
        return;
      }

      found.move?.(parent, { at: nextIndex });
      editor.select(found);
      setSelectedComponent(found);
      syncSections(editor);
    });
  };

  const handleSetDevice = (nextDevice: DeviceMode) => {
    setDevice(nextDevice);

    runEditor((editor) => {
      editor.setDevice(nextDevice);
    });
  };

  const handleAddHtml = (html: string) => {
    runEditor((editor) => {
      const target: any = getSafeAppendTarget(editor);

      if (!target) {
        const added = editor.addComponents(html);
        selectAddedComponents(editor, added);
        return;
      }

      const added =
        typeof target.append === "function"
          ? target.append(html)
          : editor.addComponents(html);

      selectAddedComponents(editor, added);
    });
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    runEditor((editor) => {
      editor.setComponents(template.html);

      const templateAny = template as PageTemplate & {
        palette?: ThemePalette;
        theme?: ThemePalette;
        css?: string;
      };

      const templatePalette =
        templateAny.palette || templateAny.theme || activePalette;

      if (templateAny.css) {
        editor.setStyle(templateAny.css);
      } else if (templatePalette) {
        editor.setStyle(createCanvasCss(templatePalette));
        applyGlobalPaletteCss(editor, templatePalette);
      } else {
        editor.setStyle(defaultCanvasCss);
      }

      editor.select(null);
      setSelectedComponent(null);
      syncSections(editor);

      setPages((prev) =>
        prev.map((page) =>
          page.id === activePageId
            ? {
                ...page,
                html: editor.getHtml(),
                css: editor.getCss(),
                projectData: editor.getProjectData(),
                updatedAt: new Date().toISOString(),
              }
            : page,
        ),
      );

      setActivePanel(null);
    });
  };

  const handleApplyPalette = (palette: ThemePalette) => {
    setActivePalette(palette);

    runEditor((editor) => {
      editor.setStyle(createCanvasCss(palette));
      applyGlobalPaletteCss(editor, palette);
      editor.refresh();
      syncSections(editor);
    });
  };

  const handleOpenMedia = () => {
    runEditor((editor) => {
      editor.runCommand("open-assets");
    });
  };

  const handlePreview = () => {
    runEditor((editor) => {
      editor.runCommand("preview");
    });
  };

  const handleUndo = () => {
    runEditor((editor) => {
      editor.UndoManager.undo();
      syncSections(editor);
    });
  };

  const handleRedo = () => {
    runEditor((editor) => {
      editor.UndoManager.redo();
      syncSections(editor);
    });
  };

  const handleReset = () => {
    const ok = window.confirm("למחוק את כל העיצוב של העמוד הפעיל?");
    if (!ok) return;

    runEditor((editor) => {
      const active = pages.find((page) => page.id === activePageId);
      const templatePages = selectedTemplateSeed
        ? createPagesFromTemplateSeed(selectedTemplateSeed).pages
        : [];
      const templatePage =
        templatePages.find((page) => page.id === activePageId) ||
        templatePages.find((page) => page.id === "home");

      const html = selectedTemplateSeed
        ? templatePage?.html || defaultWebsiteHtml
        : active?.isHome
          ? defaultWebsiteHtml
          : createBlankPageHtml(active?.title || "עמוד חדש");

      editor.setComponents(html);
      editor.setStyle(
        selectedTemplateSeed
          ? templatePage?.css || createTemplateCss(selectedTemplateSeed)
          : defaultCanvasCss,
      );
      editor.select(null);
      setSelectedComponent(null);
      setActivePalette(null);
      setActivePanel(null);
      syncSections(editor);
    });
  };

  const handleSave = async (published: boolean) => {
    if (!editorRef.current || !slugValid || saving) return;

    if (slugChecking) {
      alert("רגע, אנחנו עדיין בודקים אם הסאב דומיין פנוי.");
      return;
    }

    if (published && slug === "your-business") {
      alert("בחרי סאב דומיין אמיתי לפני פרסום.");
      return;
    }

    if (published && slugAvailable === false) {
      alert(slugError || "הסאב דומיין הזה כבר תפוס. בחרי שם אחר.");
      return;
    }

    setSaving(true);

    try {
      const editor = editorRef.current;
      const savedPages = snapshotPages(pages, editor, activePageId);

      setPages(savedPages);

      const payload: SiteSavePayload & {
        businessId?: string;
        siteId?: string;
        clientPortalPages?: StudioSitePageWithPortal[];
        publicUrl?: string;
        siteDomain?: string;
        templateId?: string;
        templateName?: string;
      } = {
        businessId,
        siteId: siteId || undefined,
        templateId: initialTemplateId || selectedTemplateSeed?.id,
        templateName: selectedTemplateSeed?.name,
        slug,
        published,
        html: editor.getHtml(),
        css: editor.getCss(),
        projectData: editor.getProjectData(),
        updatedAt: new Date().toISOString(),
        status: published ? "published" : "draft",
        publicUrl,
        siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
        domain: {
          slug,
          published,
        },
        name: siteName,
        seoSettings: siteSeoSettings,
        pages: savedPages,
        activePageId,
        clientPortalPages: savedPages.filter(
          (page) => page.clientPortal?.enabled,
        ),
      };

      // לא שומרים payload כבד ב-localStorage.
      // השמירה היחידה היא לשרת / MongoDB דרך /api/site-builder/site.

      studioDebug("handleVisualTemplateSave:fetch-start", {
        url: "/api/site-builder/site",
        method: "PUT",
      });

      const safePayload = cleanDataForJsonSave(payload);

      const res = await fetch("/api/site-builder/site", {
        method: "PUT",
        credentials: "include",
        headers: buildAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(safePayload),
      });

      const responseData = await res.json().catch((jsonError) => {
        studioWarn("handleVisualTemplateSave:response-json-failed", jsonError);
        return null;
      });

      studioDebug("handleVisualTemplateSave:fetch-response", {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        responseData,
        responseSiteSummary: responseData?.site
          ? {
              slug: responseData.site.slug,
              published: responseData.site.published,
              status: responseData.site.status,
              htmlLength: getTextLength(responseData.site.html),
              cssLength: getTextLength(responseData.site.css),
              pagesCount: Array.isArray(responseData.site.pages)
                ? responseData.site.pages.length
                : 0,
              pages: summarizeStudioPagesForDebug(responseData.site.pages || []),
            }
          : null,
      });

      if (!res.ok) {
        throw new Error(responseData?.error || "שמירת האתר בשרת נכשלה");
      }

      if (published && responseData?.site) {
        const savedHtmlLength = getTextLength(responseData.site.html);
        const savedPages = Array.isArray(responseData.site.pages)
          ? responseData.site.pages
          : [];
        const hasSavedPageHtml = savedPages.some(
          (page: any) => getTextLength(page?.html) > 20,
        );

        if (savedHtmlLength < 20 && !hasSavedPageHtml) {
          studioError("handleVisualTemplateSave:saved-site-has-no-html", {
            responseData,
            payloadSummary: {
              htmlLength: getTextLength(payload.html),
              pages: summarizeStudioPagesForDebug((payload as any).pages || []),
            },
          });
        }
      }

      await onSave?.(payload);

      setSavedAt(
        new Date().toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      void payload;
    } catch (error: any) {
      alert(error?.message || "אירעה שגיאה בשמירת האתר. נסי שוב.");
    } finally {
      setSaving(false);
    }
  };

  const handleApplyStyle = (style: StylePatch) => {
    runEditor((editor) => {
      const target = getSelectedOrWrapper(editor);

      if (!target) {
        alert("בחרי אלמנט באתר כדי לערוך אותו");
        return;
      }

      target.addStyle(style);
      setSelectedComponent(target);
      syncSections(editor);
    });
  };

  const handleClearSelection = () => {
    runEditor((editor) => {
      editor.select(null);
      setSelectedComponent(null);
      syncSections(editor);
    });
  };

  const handleSetSelectedText = (value: string) => {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי טקסט או אלמנט כדי לערוך");
        return;
      }

      const tagName = String(selected.get?.("tagName") || "").toLowerCase();

      if (tagName === "input" || tagName === "textarea") {
        selected.addAttributes?.({ placeholder: value });
      } else {
        selected.components?.(value);
        selected.set?.("content", value);
      }

      editor.select(selected);
      setSelectedComponent(selected);
      syncSections(editor);
    });
  };

  const handleSetSelectedHref = (href: string) => {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי כפתור או לינק כדי להגדיר קישור");
        return;
      }

      const cleanHref = href.trim() || "#";
      const tagName = String(selected.get?.("tagName") || "").toLowerCase();

      if (tagName === "button") {
        selected.set?.("tagName", "a");
      }

      selected.addAttributes?.({
        href: cleanHref,
        role: "button",
        "data-editable-link": "true",
      });

      selected.addStyle?.({ cursor: "pointer" });

      editor.select(selected);
      setSelectedComponent(selected);
      syncSections(editor);
    });
  };

  const handleReplaceSelectedImage = async () => {
    const dataUrl = await pickImageFromComputer();
    if (!dataUrl) return;

    runEditor((editor) => {
      const selected: any = editor.getSelected() || getSelectedOrWrapper(editor);

      if (!selected) {
        alert("בחרי תמונה או סקשן כדי להחליף תמונה");
        return;
      }

      const tagName = String(selected.get?.("tagName") || "").toLowerCase();

      if (tagName === "img") {
        selected.addAttributes?.({ src: dataUrl });
      } else {
        selected.addStyle?.({
          "background-image": `url("${dataUrl}")`,
          "background-size": "cover",
          "background-position": "center",
          "background-repeat": "no-repeat",
        });
      }

      editor.select(selected);
      setSelectedComponent(selected);
      syncSections(editor);
    });
  };

  const handleDuplicateSelected = () => {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט לשכפול");
        return;
      }

      const parent = selected.parent?.();
      const collection = parent?.components?.();
      const index = collection?.indexOf?.(selected) ?? -1;
      const cloned = selected.clone?.();

      if (cloned && collection?.add) {
        collection.add(cloned, { at: index >= 0 ? index + 1 : undefined });
        editor.select(cloned);
        setSelectedComponent(cloned);
        syncSections(editor);
      }
    });
  };

  const handleDeleteSelected = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט למחיקה");
        return;
      }

      const ok = window.confirm("למחוק את האלמנט הנבחר?");
      if (!ok) return;

      selected.remove();
      setSelectedComponent(null);
      syncSections(editor);
    });
  };

  const handleBringForward = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט");
        return;
      }

      const current = selected.getStyle();
      const zIndex = Number(current["z-index"] || 1);

      selected.addStyle({
        position: current.position || "relative",
        "z-index": zIndex + 1,
      });

      setSelectedComponent(selected);
    });
  };

  const handleSendBackward = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט");
        return;
      }

      const current = selected.getStyle();
      const zIndex = Number(current["z-index"] || 1);

      selected.addStyle({
        position: current.position || "relative",
        "z-index": Math.max(0, zIndex - 1),
      });

      setSelectedComponent(selected);
    });
  };

  const handleSetBackgroundImage = async () => {
    const dataUrl = await pickImageFromComputer();
    if (!dataUrl) return;

    runEditor((editor) => {
      const target = getSelectedOrWrapper(editor);

      if (!target) {
        alert("בחרי סקשן כדי להגדיר לו תמונת רקע");
        return;
      }

      target.addStyle({
        "background-image": `linear-gradient(rgba(2,6,23,0.38), rgba(2,6,23,0.38)), url("${dataUrl}")`,
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
      });

      setSelectedComponent(target);
      syncSections(editor);
    });
  };

  const handleSetAnimation = (animation: string) => {
    runEditor((editor) => {
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט / סקשן כדי להוסיף לו תנועה");
        return;
      }

      selected.addAttributes({
        "data-animate": animation,
      });

      selected.addStyle({
        animation,
        "animation-duration": "0.85s",
        "animation-timing-function": "ease",
        "animation-fill-mode": "both",
      });

      setSelectedComponent(selected);
    });
  };

  const handleClearAnimation = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט / סקשן כדי להסיר ממנו תנועה");
        return;
      }

      const attributes = {
        ...selected.getAttributes(),
      };

      delete attributes["data-animate"];

      selected.setAttributes(attributes);

      selected.addStyle({
        animation: "none",
        transform: "none",
        filter: "none",
      });

      setSelectedComponent(selected);
    });
  };

  async function checkPublicSlugAvailability(value: string) {
    const clean = normalizePublicBusinessSlug(value);
    const cleanValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean);

    if (!clean || clean === "your-business" || !cleanValid || isObjectIdLikeSlug(clean)) {
      return {
        ok: false,
        slug: clean,
        message: "כתובת האתר חייבת להיות באנגלית, מספרים ומקף בלבד. לדוגמה: beneshet",
      };
    }

    try {
      const res = await fetch(
        `/api/site-builder/slug/check?slug=${encodeURIComponent(clean)}&businessId=${encodeURIComponent(businessId)}`,
        {
          method: "GET",
          credentials: "include",
          headers: buildAuthHeaders(),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          slug: clean,
          message: data?.error || "שגיאה בבדיקת כתובת האתר",
        };
      }

      if (!data?.available) {
        return {
          ok: false,
          slug: clean,
          message: data?.error || "הכתובת הזאת כבר תפוסה. בחרי שם אחר.",
        };
      }

      return {
        ok: true,
        slug: clean,
        message: "",
      };
    } catch {
      return {
        ok: false,
        slug: clean,
        message: "שגיאה בבדיקת כתובת האתר. נסי שוב.",
      };
    }
  }

  function openPublishSlugModal(payload: VisualTemplateSavePayload) {
    const suggestedSlug =
      normalizePublicBusinessSlug(String(payload.slug || "")) ||
      normalizePublicBusinessSlug(String(payload.domain?.slug || "")) ||
      normalizePublicBusinessSlug(extractSlugFromPublicUrl(String(payload.publicUrl || ""))) ||
      normalizePublicBusinessSlug(slug) ||
      "";

    setPendingVisualPublishPayload(payload);
    setPublishSlugDraft(suggestedSlug);
    setPublishSlugAvailable(null);
    setPublishSlugError("");
    setPublishSlugModalOpen(true);
  }

  const handlePublishSlugDraftChange = (value: string) => {
    const nextSlug = normalizeBusinessSlug(value);

    setPublishSlugDraft(nextSlug);
    setPublishSlugAvailable(null);
    setPublishSlugError("");
  };

  const handleConfirmVisualPublishSlug = async () => {
    if (!pendingVisualPublishPayload || publishSlugChecking || saving) return;

    setPublishSlugChecking(true);
    setPublishSlugError("");
    setPublishSlugAvailable(null);

    const result = await checkPublicSlugAvailability(publishSlugDraft);

    setPublishSlugChecking(false);
    setPublishSlugAvailable(result.ok);

    if (!result.ok) {
      setPublishSlugError(result.message);
      return;
    }

    const nextPublicUrl = buildPublicSiteUrl(result.slug);

    setSlug(result.slug);
    setSlugAvailable(true);
    setSlugError("");
    setPublishSlugModalOpen(false);

    const payloadToPublish: VisualTemplateSavePayload = {
      ...pendingVisualPublishPayload,
      slug: result.slug,
      publicUrl: nextPublicUrl,
      siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
      published: true,
      status: "published",
      domain: {
        slug: result.slug,
        published: true,
      },
    };

    setPendingVisualPublishPayload(null);

    await handleVisualTemplateSave(payloadToPublish);
  };

  const handleVisualTemplateSave = async (visualPayload: VisualTemplateSavePayload) => {
    if (saving) return;

    const published = Boolean(
      visualPayload.published || visualPayload.status === "published",
    );

    const cleanVisualData = buildCleanVisualDataForSave(
      visualPayload as Record<string, any>,
      serverVisualTemplateData,
    );

    const activeVisualPageId =
      visualPayload.snapshotPageId ||
      String(cleanVisualData?.activePageId || "") ||
      String(cleanVisualData?.currentPageId || "") ||
      String(cleanVisualData?.pageId || "") ||
      activePageId ||
      "home";

    const cleanSlug =
      normalizePublicBusinessSlug(String(visualPayload.slug || "")) ||
      normalizePublicBusinessSlug(slug);

    const cleanSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);

    if (published) {
      if (
        !cleanSlug ||
        cleanSlug === "your-business" ||
        !cleanSlugValid ||
        isObjectIdLikeSlug(cleanSlug)
      ) {
        openPublishSlugModal({
          ...visualPayload,
          published: true,
          status: "published",
        });
        return;
      }
    }

    const nextPublicUrl =
      published && cleanSlug
        ? buildPublicSiteUrl(cleanSlug)
        : visualPayload.publicUrl ||
          (cleanSlug ? buildPublicSiteUrl(cleanSlug) : publicUrl);

    if (cleanSlug) {
      setSlug(cleanSlug);
    }

    setSaving(true);

    studioGroup("Visual React publish/save flow started", {
      businessId,
      cleanSlug,
      published,
      nextPublicUrl,
      templateKey: visualPayload.templateKey,
      visualPayload: {
        templateKey: visualPayload.templateKey,
        editorMode: visualPayload.editorMode,
        updatedAt: visualPayload.updatedAt,
        published,
        status: published ? "published" : "draft",
        slug: cleanSlug,
        snapshotPageId: activeVisualPageId,
        dataKeys: Object.keys(cleanVisualData || {}),
        contentKeys: getVisualContentKeys(cleanVisualData),
      },
      selectedTemplateSeed: selectedTemplateSeed
        ? {
            id: selectedTemplateSeed.id,
            name: selectedTemplateSeed.name,
            rendererKey: (selectedTemplateSeed as any).rendererKey,
            key: (selectedTemplateSeed as any).key,
          }
        : null,
      selectedTemplateRenderer: selectedTemplateRenderer
        ? {
            key: selectedTemplateRenderer.key,
            name: selectedTemplateRenderer.name,
            editorMode: selectedTemplateRenderer.editorMode,
            pagesCount: Array.isArray(selectedTemplateRenderer.pages)
              ? selectedTemplateRenderer.pages.length
              : 0,
          }
        : null,
      currentStatePages: summarizeStudioPagesForDebug(pages),
    });

    try {
      // The current edited pages are always authoritative.
      // The original template is only a fallback for a site that has never been edited.
      const sourcePages =
        pages.length
          ? pages
          : selectedTemplateSeed
            ? createPagesFromTemplateSeed(selectedTemplateSeed, cleanVisualData).pages
            : createInitialPages();

      studioDebug("handleVisualTemplateSave:sourcePages-ready", {
        sourcePagesCount: sourcePages.length,
        sourcePages: summarizeStudioPagesForDebug(sourcePages),
      });

      let publishedPages = buildPublishedVisualPages(sourcePages, {
        templateKey: visualPayload.templateKey,
        data: cleanVisualData,
        updatedAt: visualPayload.updatedAt,
        activePageId: activeVisualPageId,
        published,
        status: published ? "published" : "draft",
      });

      /*
        חשוב:
        htmlSnapshot יכול להיות ענק, ובשמירת Visual React הוא לא אמור להישלח כ־JSON.
        אם בעתיד נצטרך אותו רק לפרסום, משתמשים בו לבניית ה־HTML של העמוד בלבד,
        אבל לא שומרים אותו בתוך projectData/templateData.
      */
      const liveHtmlSnapshot = String(visualPayload.htmlSnapshot || "").trim();

      if (liveHtmlSnapshot.length > 20) {
        const normalizedTargetPageId =
          String(activeVisualPageId || "home").trim() || "home";
        const visualCss = buildPublishedVisualRuntimeCss(cleanVisualData);
        const templateRuntimeCss = String(
          (selectedTemplateRenderer as any)?.runtimeCss ||
            (selectedTemplateRenderer as any)?.editorCss ||
            "",
        );

        const hasTargetPage = publishedPages.some(
          (page) => page.id === normalizedTargetPageId,
        );

        publishedPages = publishedPages.map((page, index) => {
          const shouldReplace =
            page.id === normalizedTargetPageId ||
            (!hasTargetPage &&
              normalizedTargetPageId === "home" &&
              (page.isHome || page.id === "home" || index === 0));

          if (!shouldReplace) return page;

          return {
            ...page,
            html: applyPublishedVisualDataToHtml(
              liveHtmlSnapshot
                .replace(
                  /data-active-page-id="[^"]*"/g,
                  `data-active-page-id="${escapeHtml(page.id)}"`,
                )
                .replace(
                  /data-active-page-slug="[^"]*"/g,
                  `data-active-page-slug="${escapeHtml(
                    page.isHome || !page.slug
                      ? "/"
                      : `/${String(page.slug).replace(/^\/+/, "")}`,
                  )}"`,
                ),
              cleanVisualData,
            ),
            css: [
              templateRuntimeCss,
              String(page.css || ""),
              "/* BizUply visual editor live HTML CSS */",
              visualCss,
            ]
              .filter(Boolean)
              .join("\n\n"),
            projectData: {
              editorMode: "visual-react",
              templateKey: visualPayload.templateKey,
              templateData: cleanVisualData,
              data: cleanVisualData,
              htmlSnapshotSource: "live-dom",
              snapshotPageId: normalizedTargetPageId,
              updatedAt: visualPayload.updatedAt,
            },
            data: cleanVisualData,
            templateData: cleanVisualData,
            updatedAt: visualPayload.updatedAt,
          };
        });

        studioDebug("handleVisualTemplateSave:live-html-snapshot-applied", {
          targetPageId: normalizedTargetPageId,
          hasTargetPage,
          htmlSnapshotLength: liveHtmlSnapshot.length,
          htmlSnapshotPreview: liveHtmlSnapshot.slice(0, 320),
          pages: summarizeStudioPagesForDebug(publishedPages),
        });
      }

      /*
        בדראפט של Visual React אין צורך לשלוח HTML/CSS מלא לכל הדפים.
        ה־data הקטן מספיק כדי לשחזר את העריכות. בפרסום כן שולחים HTML כדי שהאתר הציבורי יעבוד.
      */
      const pagesForSave = publishedPages.map((page) => {
        const isActivePage =
          page.id === activeVisualPageId ||
          (activeVisualPageId === "home" && page.isHome);

        const pageVisual = isActivePage
          ? cleanVisualData
          : extractVisualDataFromPayload({
              data: (page as any)?.data,
              templateData: (page as any)?.templateData,
              projectData: (page as any)?.projectData,
              visualEditorPayload: (page as any)?.visualEditorPayload,
            }) ||
            (page as any)?.templateData ||
            (page as any)?.data ||
            {};

        const isLibraryPage =
          Boolean((pageVisual as any)?.__libraryPage) ||
          Boolean((pageVisual as any)?.__blankVisualPage) ||
          String(page.type || "").toLowerCase() === "blank" ||
          /^page[_-]/i.test(String(page.id || ""));

        return {
          id: page.id,
          title: page.title,
          slug: page.slug,
          type: page.type,
          isHome: Boolean(page.isHome),
          hiddenFromMenu: Boolean((page as any).hiddenFromMenu),
          createdAt: page.createdAt,
          // Every save creates a new authoritative page revision.
          // Keeping the original page.updatedAt made the public renderer
          // unable to distinguish a fresh publish from an older payload.
          updatedAt: visualPayload.updatedAt || new Date().toISOString(),
          clientPortal: page.clientPortal,
          html: String(page.html || ""),
          // Clear obsolete snapshots so a larger legacy blob cannot win over
          // the HTML and visual data produced by this publish revision.
          htmlSnapshot: "",
          css: String(page.css || ""),
          data: pageVisual,
          templateData: pageVisual,
          // Top-level flags so the public renderer can prefer page-scoped
          // visual data even if nested payloads are normalized by the API.
          __blankVisualPage: Boolean(
            (pageVisual as any)?.__blankVisualPage,
          ),
          __libraryPage: isLibraryPage,
          __libraryPageTemplateId: String(
            (pageVisual as any)?.__libraryPageTemplateId ||
              (page as any)?.__libraryPageTemplateId ||
              "",
          ),
          projectData: {
            editorMode: "visual-react",
            templateKey: visualPayload.templateKey,
            templateData: pageVisual,
            data: pageVisual,
            snapshotPageId: page.id,
            updatedAt: visualPayload.updatedAt,
          },
          visualEditorPayload: {
            editorMode: "visual-react",
            templateKey: visualPayload.templateKey,
            data: pageVisual,
            templateData: pageVisual,
            snapshotPageId: page.id,
            updatedAt: visualPayload.updatedAt,
          },
        };
      });

      const homePage =
        pagesForSave.find((page) => page.isHome || page.id === "home") ||
        pagesForSave[0];

      studioDebug("handleVisualTemplateSave:publishedPages-ready", {
        homePage: homePage
          ? {
              id: homePage.id,
              title: homePage.title,
              htmlLength: getTextLength(homePage.html),
              cssLength: getTextLength(homePage.css),
              htmlPreview: String(homePage.html || "").slice(0, 320),
            }
          : null,
        publishedPages: summarizeStudioPagesForDebug(pagesForSave),
      });

      const hasMeaningfulVisualPublishData = [
        "__content",
        "__insertedSections",
        "__insertedElements",
        "__styles",
        "__sectionOrder",
      ].some((key) => {
        const collection = (cleanVisualData as any)?.[key];
        return (
          collection &&
          typeof collection === "object" &&
          !Array.isArray(collection) &&
          Object.keys(collection).length > 0
        );
      });

      /*
        visual-react מפורסם מ-template + data. HTML הוא אופציונלי —
        חסימה בגלל HTML ריק השאירה את האתר הציבורי על גרסה ישנה.
      */
      if (
        published &&
        (!homePage?.html || String(homePage.html).trim().length < 20) &&
        !hasMeaningfulVisualPublishData
      ) {
        studioError("handleVisualTemplateSave:no-html-before-publish", {
          cleanSlug,
          sourcePages: summarizeStudioPagesForDebug(sourcePages),
          publishedPages: summarizeStudioPagesForDebug(pagesForSave),
          visualPayload: {
            templateKey: visualPayload.templateKey,
            published,
            snapshotPageId: activeVisualPageId,
            dataKeys: Object.keys(cleanVisualData || {}),
          },
        });

        throw new Error(
          "הפרסום נעצר: לא נמצא תוכן אתר לשמירה. רענני את העורך ונסי שוב.",
        );
      }

      const payload: SiteSavePayload & {
        businessId?: string;
        siteId?: string;
        publicUrl?: string;
        siteDomain?: string;
        templateId?: string;
        templateName?: string;
        templateKey?: string;
        templateEditorMode?: "visual-react" | "renderer";
        templateData?: Record<string, any>;
        visualEditorPayload?: Record<string, any>;
      } = {
        businessId,
        siteId: siteId || undefined,
        templateId: initialTemplateId || selectedTemplateSeed?.id,
        templateName: selectedTemplateSeed?.name || selectedTemplateRenderer?.name,
        templateKey: visualPayload.templateKey,
        templateEditorMode: "visual-react",

        /*
          שומרים את הדאטה פעם אחת בלבד.
          לא משכפלים אותו גם בתוך projectData וגם בתוך visualEditorPayload.
        */
        templateData: cleanVisualData,
        visualEditorPayload: {
          templateKey: visualPayload.templateKey,
          editorMode: "visual-react",
          data: cleanVisualData,
          templateData: cleanVisualData,
          updatedAt: visualPayload.updatedAt,
          published,
          status: published ? "published" : "draft",
          snapshotPageId: activeVisualPageId,
          hasTemplateData: true,
          dataKeys: Object.keys(cleanVisualData || {}),
        },

        slug: cleanSlug,
        published,
        html: String(homePage?.html || ""),
        htmlSnapshot: "",
        css: String(homePage?.css || ""),
        projectData: {
          editorMode: "visual-react",
          templateKey: visualPayload.templateKey,
          templateData: cleanVisualData,
          data: cleanVisualData,
          slug: cleanSlug,
          published,
          publicUrl: nextPublicUrl,
          updatedAt: visualPayload.updatedAt,
        },
        updatedAt: visualPayload.updatedAt,
        status: published ? "published" : "draft",
        publicUrl: nextPublicUrl,
        siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
        domain: {
          slug: cleanSlug,
          published,
          url: nextPublicUrl,
          domain: BIZUPLY_PUBLIC_SITE_DOMAIN,
        },
        name: siteName,
        seoSettings: siteSeoSettings,
        pages: pagesForSave,
        activePageId: activeVisualPageId,
        customCode: Object.keys(asPlainObject(visualPayload.customCode)).length
          ? asPlainObject(visualPayload.customCode)
          : siteCustomCode,
      } as any;

      const safePayload = cleanDataForJsonSave(payload);
      const requestBody = JSON.stringify(safePayload);
      const requestSizeMb = requestBody.length / 1024 / 1024;

      studioDebug("handleVisualTemplateSave:payload-ready", {
        slug: payload.slug,
        published: payload.published,
        status: payload.status,
        publicUrl: payload.publicUrl,
        htmlLength: getTextLength(payload.html),
        cssLength: getTextLength(payload.css),
        pagesCount: Array.isArray((payload as any).pages) ? (payload as any).pages.length : 0,
        pages: summarizeStudioPagesForDebug((payload as any).pages || []),
        templateDataKeys: Object.keys(cleanVisualData || {}),
        templateContentKeys: getVisualContentKeys(cleanVisualData),
        templateDeletedKeys: Object.keys(
          readPublishedVisualDeleted(cleanVisualData),
        ),
        emptyTextCount: Object.values(
          readPublishedVisualContent(cleanVisualData),
        ).filter((item) => asPlainObject(item).text === "").length,
        requestSizeMb: requestSizeMb.toFixed(2),
      });

      if (requestSizeMb > 8) {
        studioWarn("handleVisualTemplateSave:large-payload", {
          requestSizeMb: requestSizeMb.toFixed(2),
          published,
          pages: summarizeStudioPagesForDebug((payload as any).pages || []),
          templateDataKeys: Object.keys(cleanVisualData || {}),
        });
      }

      studioDebug("handleVisualTemplateSave:fetch-start", {
        url: "/api/site-builder/site",
        method: "PUT",
        requestSizeMb: requestSizeMb.toFixed(2),
      });

      const res = await fetch("/api/site-builder/site", {
        method: "PUT",
        credentials: "include",
        headers: buildAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: requestBody,
      });

      const responseData = await res.json().catch((jsonError) => {
        studioWarn("handleVisualTemplateSave:response-json-failed", jsonError);
        return null;
      });

      studioDebug("handleVisualTemplateSave:fetch-response", {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        responseData,
        responseSiteSummary: responseData?.site
          ? {
              slug: responseData.site.slug,
              published: responseData.site.published,
              status: responseData.site.status,
              htmlLength: getTextLength(responseData.site.html),
              cssLength: getTextLength(responseData.site.css),
              pagesCount: Array.isArray(responseData.site.pages)
                ? responseData.site.pages.length
                : 0,
              pages: summarizeStudioPagesForDebug(responseData.site.pages || []),
            }
          : null,
      });

      if (!res.ok) {
        throw new Error(responseData?.error || "שמירת האתר בשרת נכשלה");
      }

      {
        const savedSiteCode = asPlainObject(
          responseData?.site?.customCode || visualPayload.customCode,
        );
        if (Object.keys(savedSiteCode).length) {
          setSiteCustomCode(savedSiteCode);
        }
      }

      if (published && responseData?.site) {
        const savedHtmlLength = getTextLength(responseData.site.html);
        const savedPages = Array.isArray(responseData.site.pages)
          ? responseData.site.pages
          : [];
        const hasSavedPageHtml = savedPages.some(
          (page: any) => getTextLength(page?.html) > 20,
        );

        if (savedHtmlLength < 20 && !hasSavedPageHtml) {
          studioError("handleVisualTemplateSave:saved-site-has-no-html", {
            responseData,
            payloadSummary: {
              htmlLength: getTextLength(payload.html),
              pages: summarizeStudioPagesForDebug((payload as any).pages || []),
            },
          });
        }
      }

      await onSave?.(safePayload as any);

      setSavedAt(
        new Date().toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      const savedDataFromResponse = pickVisualTemplateDataFromSavedSite(
        responseData?.site || responseData || {},
        visualPayload.templateKey,
      );

      /*
        חשוב כמו Wix:
        אחרי שמירה לא מרעננים ולא מפרקים את העורך.
        cleanVisualData הוא ה-state החי שנשמר עכשיו, ולכן הוא חייב לנצח
        כל response ישן/חלקי מהשרת.
      */
      setServerVisualTemplateData((current) =>
        mergeVisualRootData(
          current || {},
          savedDataFromResponse || {},
          cleanVisualData || {},
          {
            __activePageId: activeVisualPageId || "home",
            __siteSlug: cleanSlug,
            __publicUrl: nextPublicUrl,
            __siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
            __published: published,
            __status: published ? "published" : "draft",
          },
        ),
      );

      if (published) {
        const finalPublishedUrl =
          String(responseData?.site?.publicUrl || "").trim() ||
          String(responseData?.site?.domain?.url || "").trim() ||
          String(responseData?.publicUrl || "").trim() ||
          String(responseData?.domain?.url || "").trim() ||
          String(nextPublicUrl || "").trim() ||
          buildPublicSiteUrl(cleanSlug);

        setPublishedSiteUrl(finalPublishedUrl);
        setPublishSuccessOpen(true);
      }

      studioDebug("handleVisualTemplateSave:success", {
        cleanSlug,
        publicUrl: nextPublicUrl,
        published,
        requestSizeMb: requestSizeMb.toFixed(2),
      });
    } catch (error: any) {
      studioError("handleVisualTemplateSave:error", {
        message: error?.message,
        stack: error?.stack,
        visualPayload: {
          templateKey: visualPayload.templateKey,
          published,
          snapshotPageId: activeVisualPageId,
          dataKeys: Object.keys(cleanVisualData || {}),
        },
      });

      alert(error?.message || "אירעה שגיאה בשמירת האתר. נסי שוב.");
      throw error;
    } finally {
      setSaving(false);
      studioGroupEnd();
    }
  };

  if (isVisualReactTemplate && selectedTemplateRenderer && !serverVisualTemplateLoaded) {
    return (
      <div
        dir="rtl"
        className="fixed inset-0 z-[999999] grid h-screen w-screen place-items-center bg-[#f6f4ff] text-slate-950"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-6 text-center shadow-xl">
          <div className="text-sm font-black text-violet-700">טוען את האתר השמור...</div>
          <div className="mt-2 text-xs font-bold text-slate-500">מכין את העורך עם הנתונים האחרונים</div>
        </div>
      </div>
    );
  }

  if (isVisualReactTemplate && selectedTemplateRenderer) {
    return (
      <div
        dir="rtl"
        className="fixed inset-0 z-[999999] h-screen w-screen overflow-hidden bg-[#f6f4ff] text-slate-950"
      >
        {publishSuccessOpen && publishedSiteUrl ? (
          <div
            dir="rtl"
            className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          >
            <div className="w-full max-w-[640px] overflow-hidden rounded-[34px] border border-white/80 bg-white text-right shadow-[0_35px_120px_rgba(15,23,42,0.35)]">
              <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-emerald-50 px-7 py-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl font-black text-white shadow-lg shadow-emerald-500/30">
                  ✓
                </div>

                <h2 className="text-center text-3xl font-black tracking-[-0.04em] text-slate-950">
                  האתר פורסם בהצלחה
                </h2>

                <p className="mx-auto mt-3 max-w-md text-center text-sm font-bold leading-7 text-slate-500">
                  האתר שלך באוויר. אפשר לפתוח אותו, להעתיק את הקישור או להמשיך לערוך.
                </p>
              </div>

              <div className="px-7 py-6">
                <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                    כתובת האתר שלך
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white p-3">
                    <a
                      href={publishedSiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 flex-1 truncate text-left text-sm font-black text-slate-950 underline decoration-violet-300 underline-offset-4"
                      dir="ltr"
                    >
                      {publishedSiteUrl}
                    </a>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(publishedSiteUrl);
                          alert("הקישור הועתק");
                        } catch {
                          alert("לא הצלחנו להעתיק. אפשר להעתיק ידנית.");
                        }
                      }}
                      className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      העתקה
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.open(publishedSiteUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="h-12 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
                  >
                    פתיחת האתר
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(publishedSiteUrl);
                        alert("הקישור הועתק");
                      } catch {
                        alert("לא הצלחנו להעתיק. אפשר להעתיק ידנית.");
                      }
                    }}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                  >
                    העתקת קישור
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishSuccessOpen(false)}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                  >
                    המשך עריכה
                  </button>
                </div>

                <p className="mt-5 text-center text-xs font-bold leading-6 text-slate-400">
                  אפשר להמשיך לערוך ולפרסם שוב בכל רגע. השינויים הבאים יופיעו באותה כתובת.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {publishSlugModalOpen ? (
          <div className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[560px] overflow-hidden rounded-[32px] border border-white/80 bg-white text-right shadow-[0_35px_120px_rgba(15,23,42,0.35)]">
              <div className="border-b border-slate-100 px-7 py-6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                  פרסום האתר
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  בחרי כתובת לאתר שלך
                </h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
                  כדי לפרסם אתר חי צריך לבחור כתובת קצרה וברורה. השמירה נשארת כטיוטה גם בלי כתובת.
                </p>
              </div>

              <div className="px-7 py-6">
                <label className="text-sm font-black text-slate-700">
                  כתובת האתר
                </label>

                <div className="mt-3 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
                  <span className="hidden shrink-0 items-center border-l border-slate-200 px-4 text-sm font-black text-slate-400 sm:inline-flex">
                    https://
                  </span>
                  <input
                    value={publishSlugDraft}
                    onChange={(event) => handlePublishSlugDraftChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleConfirmVisualPublishSlug();
                      }
                    }}
                    dir="ltr"
                    placeholder="beneshet"
                    className="min-w-0 flex-1 bg-transparent px-4 py-4 text-left text-base font-black text-slate-950 outline-none"
                    autoFocus
                  />
                  <span className="hidden shrink-0 items-center border-r border-slate-200 px-4 text-sm font-black text-slate-400 sm:inline-flex">
                    .{BIZUPLY_PUBLIC_SITE_DOMAIN}
                  </span>
                </div>

                <div className="mt-3 min-h-6 text-sm font-bold">
                  {publishSlugChecking ? (
                    <span className="text-sky-600">בודק זמינות...</span>
                  ) : publishSlugAvailable === true ? (
                    <span className="text-emerald-600">
                      הכתובת פנויה: {buildPublicSiteUrl(publishSlugDraft)}
                    </span>
                  ) : publishSlugError ? (
                    <span className="text-rose-600">{publishSlugError}</span>
                  ) : (
                    <span className="text-slate-400">לדוגמה: beneshet, hadar-beauty, servora-electric</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-7 py-5 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setPublishSlugModalOpen(false);
                    setPendingVisualPublishPayload(null);
                    setPublishSlugError("");
                    setPublishSlugAvailable(null);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
                >
                  ביטול
                </button>

                <button
                  type="button"
                  disabled={publishSlugChecking || saving || !publishSlugDraft}
                  onClick={() => void handleConfirmVisualPublishSlug()}
                  className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {publishSlugChecking ? "בודק..." : "בדיקת זמינות ופרסום"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <TemplateVisualEditor
  renderer={selectedTemplateRenderer}
  businessId={businessId}
  key={`${selectedTemplateRenderer.key || selectedTemplateSeed?.id || "visual"}-${businessId || "business"}-${activePageId || "home"}`}
  initialData={{
    ...mergeVisualRootData(
      selectedTemplateRenderer.defaultData as Record<string, any>,
      extractVisualDataFromPayload({
        data: (selectedTemplateSeed as any)?.data,
        templateData: (selectedTemplateSeed as any)?.templateData,
      }),
      serverVisualTemplateData || {},
      visualSessionData,
      extractVisualDataFromPayload({
        data: (activePage as any)?.data,
        templateData: (activePage as any)?.templateData,
        projectData: (activePage as any)?.projectData,
        visualEditorPayload:
          (activePage as any)?.visualEditorPayload,
      }),
    ),
    __activePageId: activePageId || "home",
    __siteSlug: normalizePublicBusinessSlug(slug),
    __publicUrl: buildPublicSiteUrl(
      normalizePublicBusinessSlug(slug) || "your-business",
    ),
    __siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
  }}
  siteCustomCode={siteCustomCode}
  onSiteCustomCodeChange={setSiteCustomCode}
  slug={normalizePublicBusinessSlug(slug)}
  publicUrl={buildPublicSiteUrl(
    normalizePublicBusinessSlug(slug) || "your-business",
  )}
  siteDomain={BIZUPLY_PUBLIC_SITE_DOMAIN}
  isSaving={saving}
  onBack={() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }}
  onSave={handleVisualTemplateSave}
  onAddLibraryPage={addLibraryPage}
  sitePages={pages.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    isHome: Boolean(page.isHome),
    hiddenFromMenu: Boolean((page as any).hiddenFromMenu),
    html: String(page.html || ""),
    css: String(page.css || selectedTemplateRenderer?.editorCss || ""),
    libraryPageTemplateId: String(
      (page as any)?.data?.__libraryPageTemplateId ||
        (page as any)?.visualEditorPayload?.data?.__libraryPageTemplateId ||
        "",
    ),
  }))}
  activeSitePageId={activePageId}
  onSelectSitePage={handleSelectVisualSitePage}
  onSitePageAction={handleVisualSitePageAction}
/>
        <PageSettingsModal
          open={pageSettingsModal.open}
          tab={pageSettingsModal.tab}
          page={
            pages.find((page) => page.id === pageSettingsModal.pageId) || null
          }
          pages={pages}
          siteName={siteName}
          siteSlug={
            normalizePublicBusinessSlug(slug) ||
            normalizePublicBusinessSlug(
              extractSlugFromPublicUrl(publicUrl),
            ) ||
            "your-business"
          }
          publicUrl={publicUrl}
          publicUrlIsPlaceholder={publicUrlIsPlaceholder}
          seoSettings={siteSeoSettings}
          pageHtml={(() => {
            const target = pages.find(
              (page) => page.id === pageSettingsModal.pageId,
            );
            if (!target) return "";
            if (target.id === activePageId) {
              try {
                const liveHtml = editorRef.current?.getHtml?.() || "";
                if (liveHtml) return liveHtml;
              } catch {
                /* fall back to stored html */
              }
            }
            return String((target as any).html || "");
          })()}
          onClose={() =>
            setPageSettingsModal((current) => ({ ...current, open: false }))
          }
          onSave={handlePageSettingsModalSave}
        />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[999999] h-screen w-screen overflow-hidden bg-[#f6f4ff] text-slate-950"
    >
      <div className="flex h-full w-full flex-col">
        <StudioTopbar
          slug={slug}
          setSlug={(value) => {
            const nextSlug = normalizeBusinessSlug(value);
            setSlug(nextSlug);
            setSlugAvailable(null);
            setSlugError("");
          }}
          slugValid={slugValid}
          device={device}
          setDevice={handleSetDevice}
          ready={ready && !saving && !loadingSite && slugAvailable !== false}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPreview={handlePreview}
          onMedia={handleOpenMedia}
          onReset={handleReset}
          onSaveDraft={() => handleSave(false)}
          onPublish={() => handleSave(true)}
        />

        {!slugValid && (
          <div className="z-40 border-b border-rose-100 bg-rose-50 px-4 py-2 text-center text-xs font-black text-rose-600">
            מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה: hadar-beauty
          </div>
        )}

        {slugValid && slug && slug !== "your-business" && slugChecking && (
          <div className="z-40 border-b border-sky-100 bg-sky-50 px-4 py-2 text-center text-xs font-black text-sky-700">
            בודק אם הסאב דומיין פנוי...
          </div>
        )}

        {slugValid &&
          slug &&
          slug !== "your-business" &&
          slugAvailable === true &&
          !slugChecking && (
            <div className="z-40 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-center text-xs font-black text-emerald-700">
              הסאב דומיין פנוי: {buildPublicSiteUrl(slug)}
            </div>
          )}

        {slugValid &&
          slug &&
          slug !== "your-business" &&
          slugAvailable === false &&
          !slugChecking && (
            <div className="z-40 border-b border-rose-100 bg-rose-50 px-4 py-2 text-center text-xs font-black text-rose-600">
              {slugError || "הסאב דומיין הזה כבר תפוס"}
            </div>
          )}

        {loadingSite && (
          <div className="z-40 border-b border-sky-100 bg-sky-50 px-4 py-2 text-center text-xs font-black text-sky-700">
            טוען אתר מהשרת...
          </div>
        )}

        {saving && (
          <div className="z-40 border-b border-violet-100 bg-violet-50 px-4 py-2 text-center text-xs font-black text-violet-700">
            שומר את האתר...
          </div>
        )}

        {savedAt && !saving && (
          <div className="z-40 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-center text-xs font-black text-emerald-700">
            נשמר בהצלחה בשעה {savedAt} · {publicUrl}
          </div>
        )}

        <div className="hidden" aria-hidden="true">
          <div ref={stylesRef} />
          <div ref={traitsRef} />
        </div>

        <div className={editorStageClass}>
          <StudioWixRail
            activePanel={activePanel}
            activePageTitle={activePage?.title || "עמוד"}
            clientPortalEnabled={activePageClientPortal.enabled}
            onOpenAdd={() => setActivePanel("sections")}
            onOpenPages={() => setActivePanel("pages")}
            onOpenSections={() => setActivePanel("sections")}
            onOpenMedia={handleOpenMedia}
            onOpenClientPortal={() => setClientPortalModalOpen(true)}
          />

          {activePanel && (
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center p-5">
              <button
                type="button"
                aria-label="סגירת פאנל"
                onClick={() => setActivePanel(null)}
                className="pointer-events-auto absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]"
              />

              <div
                className={[
                  "pointer-events-auto relative h-[min(90vh,900px)] max-h-[calc(100vh-40px)] max-w-[calc(100vw-40px)] overflow-hidden rounded-[20px] border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]",
                  activePanel === "sections"
                    ? "w-[min(1400px,calc(100vw-40px))]"
                    : "w-[min(760px,calc(100vw-40px))]",
                ].join(" ")}
              >
                <div className="flex h-full min-h-0 flex-col">
                  <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                        BizUply Studio
                      </p>
                      <p className="truncate text-sm font-black text-slate-950">
                        {activePanel === "pages" ? "דפים וניהול אתר" : "הוספת סקשנים ובלוקים"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePanel(null)}
                      className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      ×
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden">
                    <StudioSidebar
                      activePanel={activePanel}
                      setActivePanel={setActivePanel}
                      onAddHtml={handleAddHtml}
                      onApplyTemplate={handleApplyTemplate}
                      onApplyPalette={handleApplyPalette}
                      onOpenMedia={handleOpenMedia}
                      pages={pages}
                      activePageId={activePageId}
                      activePageSections={activePageSections}
                      onSelectPage={handleSelectPage}
                      onAddPage={addBusinessPage}
                      onUpdatePageTitle={updatePageTitle}
                      onSelectSection={handleSelectSection}
                      onDeleteSection={handleDeleteSection}
                      onDuplicateSection={handleDuplicateSection}
                      onMoveSectionUp={(sectionId) => handleMoveSection(sectionId, "up")}
                      onMoveSectionDown={(sectionId) =>
                        handleMoveSection(sectionId, "down")
                      }
                      onOpenSectionsPanel={() => setActivePanel("sections")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          <StudioCanvas
            editorRefContainer={editorContainerRef}
            publicUrl={publicUrl}
            layersRef={layersRef}
          />
        </div>
      </div>

      {clientPortalModalOpen && activePage && (
        <ClientPortalSettingsModal
          pageTitle={activePage.title}
          config={activePageClientPortal}
          onClose={() => setClientPortalModalOpen(false)}
          onUpdateConfig={updateActivePageClientPortal}
          onAddVariable={addClientPortalVariable}
          onUpdateVariable={updateClientPortalVariable}
          onDeleteVariable={deleteClientPortalVariable}
          onInsertVariable={insertVariablePlaceholderToEditor}
        />
      )}
    </div>
  );
}


function StudioWixRail({
  activePanel,
  activePageTitle,
  clientPortalEnabled,
  onOpenAdd,
  onOpenPages,
  onOpenSections,
  onOpenMedia,
  onOpenClientPortal,
}: {
  activePanel: ActiveStudioPanel;
  activePageTitle: string;
  clientPortalEnabled: boolean;
  onOpenAdd: () => void;
  onOpenPages: () => void;
  onOpenSections: () => void;
  onOpenMedia: () => void;
  onOpenClientPortal: () => void;
}) {
  const items = [
    { id: "add", label: "הוסף", icon: "+", onClick: onOpenAdd },
    {
      id: "pages",
      label: "דפים",
      icon: "▦",
      onClick: onOpenPages,
      active: activePanel === "pages",
    },
    {
      id: "sections",
      label: "סקשנים",
      icon: "≡",
      onClick: onOpenSections,
      active: activePanel === "sections",
    },
    { id: "media", label: "מדיה", icon: "◐", onClick: onOpenMedia },
    {
      id: "portal",
      label: clientPortalEnabled ? "אזור אישי" : "דינמי",
      icon: "⚙",
      onClick: onOpenClientPortal,
    },
  ];

  return (
    <aside className="absolute left-4 top-4 z-30 flex w-[82px] flex-col items-center gap-3 rounded-[28px] border border-white/80 bg-white/95 p-2 shadow-[0_22px_70px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
      <div className="mb-1 w-full rounded-[22px] bg-slate-950 px-2 py-3 text-center text-white">
        <p className="truncate text-[10px] font-black text-white/55">PAGE</p>
        <p className="mt-1 truncate text-xs font-black">{activePageTitle}</p>
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={[
            "group flex w-full flex-col items-center justify-center rounded-[22px] px-2 py-3 text-center transition",
            item.active
              ? "bg-violet-600 text-white shadow-[0_14px_32px_rgba(124,58,237,0.25)]"
              : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
          ].join(" ")}
        >
          <span className="text-lg font-black leading-none">{item.icon}</span>
          <span className="mt-1 text-[10px] font-black leading-none">
            {item.label}
          </span>
        </button>
      ))}
    </aside>
  );
}


function ClientPortalSettingsModal({
  pageTitle,
  config,
  onClose,
  onUpdateConfig,
  onAddVariable,
  onUpdateVariable,
  onDeleteVariable,
  onInsertVariable,
}: {
  pageTitle: string;
  config: ClientPortalPageConfig;
  onClose: () => void;
  onUpdateConfig: (
    patch:
      | Partial<ClientPortalPageConfig>
      | ((current: ClientPortalPageConfig) => ClientPortalPageConfig),
  ) => void;
  onAddVariable: () => void;
  onUpdateVariable: (
    variableId: string,
    patch: Partial<ClientPortalVariable>,
  ) => void;
  onDeleteVariable: (variableId: string) => void;
  onInsertVariable: (variable: ClientPortalVariable) => void;
}) {
  return (
    <div className="fixed inset-0 z-[999999] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-md">
      <div
        dir="rtl"
        className="flex max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[34px] bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]"
      >
        <aside className="hidden w-[320px] shrink-0 bg-slate-950 p-6 text-white lg:block">
          <div className="rounded-[26px] bg-white/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
              Client Portal Page
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight">
              {pageTitle}
            </h2>
            <p className="mt-3 text-sm font-bold leading-7 text-white/55">
              כאן העסק מגדיר אילו משתנים קיימים בעמוד. אחר כך ב־CRM מחברים
              לקוחות, והמערכת מושכת לכל לקוח את הנתונים שלו.
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            <SideInfo
              label="סטטוס"
              value={config.enabled ? "עמוד אזור אישי" : "עמוד רגיל"}
            />
            <SideInfo label="משתנים" value={String(config.variables.length)} />
            <SideInfo
              label="נתונים"
              value={
                config.dataMode === "per_client"
                  ? "אישיים לפי לקוח"
                  : "גלובליים"
              }
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                עמוד אזור אישי
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                הגדרת עמוד דינמי ללקוחות
              </h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
                העסק מגדיר לבד משתנים, שדות ומקורות נתונים — בלי הגבלה לתחום.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              ×
            </button>
          </header>

          <div className="max-h-[calc(92vh-104px)] overflow-y-auto bg-[#F6F8FC] p-5 md:p-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleCard
                  title="הפוך לעמוד אזור אישי"
                  text="העמוד יהיה זמין רק ללקוחות שמחוברים או משויכים."
                  checked={config.enabled}
                  onChange={(checked) =>
                    onUpdateConfig({
                      enabled: checked,
                      loginRequired: checked ? true : config.loginRequired,
                      dataMode: checked ? "per_client" : config.dataMode,
                    })
                  }
                />

                <ToggleCard
                  title="דורש התחברות לקוח"
                  text="לקוח יראה את העמוד רק אחרי התחברות עם מייל וסיסמה."
                  checked={config.loginRequired}
                  onChange={(checked) =>
                    onUpdateConfig({ loginRequired: checked })
                  }
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <SelectBlock
                  label="מי יכול לראות"
                  value={config.accessMode}
                  onChange={(value) =>
                    onUpdateConfig({
                      accessMode: value as ClientPortalPageConfig["accessMode"],
                    })
                  }
                  options={[
                    { value: "assigned_clients", label: "לקוחות משויכים בלבד" },
                    { value: "paid_clients", label: "לקוחות משלמים בלבד" },
                    { value: "all_clients", label: "כל הלקוחות המחוברים" },
                  ]}
                />

                <SelectBlock
                  label="סוג נתונים"
                  value={config.dataMode}
                  onChange={(value) =>
                    onUpdateConfig({
                      dataMode: value as ClientPortalPageConfig["dataMode"],
                    })
                  }
                  options={[
                    { value: "per_client", label: "נתונים אישיים לפי לקוח" },
                    { value: "global", label: "נתון כללי לכולם" },
                  ]}
                />

                <InputBlock
                  label="מחיר חודשי לעמוד"
                  value={String(config.monthlyPrice)}
                  type="number"
                  onChange={(value) =>
                    onUpdateConfig({
                      monthlyPrice: Number(value || 0),
                    })
                  }
                />
              </div>
            </section>

            <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">
                    משתנים דינמיים בעמוד
                  </h3>
                  <p className="mt-1 text-sm font-bold leading-7 text-slate-500">
                    כל משתנה הוא דאטה שהעסק יכול להציג ללקוח או לקבל מהלקוח.
                    לדוגמה: כותרת, סטטוס, רשימת משימות, קובץ, תאריך, תשלום,
                    פגישה.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onAddVariable}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
                >
                  + הוספת משתנה
                </button>
              </div>

              {config.variables.length === 0 ? (
                <div className="rounded-[26px] border border-dashed border-violet-200 bg-violet-50/40 p-8 text-center">
                  <h4 className="text-xl font-black text-slate-950">
                    עדיין אין משתנים בעמוד
                  </h4>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-7 text-slate-500">
                    לחצי על “הוספת משתנה” כדי לאפשר לעסק להגדיר איזה מידע יופיע
                    ללקוח בעמוד הזה.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {config.variables.map((variable) => (
                    <VariableEditorCard
                      key={variable.id}
                      variable={variable}
                      onUpdate={(patch) => onUpdateVariable(variable.id, patch)}
                      onDelete={() => onDeleteVariable(variable.id)}
                      onInsert={() => onInsertVariable(variable)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function VariableEditorCard({
  variable,
  onUpdate,
  onDelete,
  onInsert,
}: {
  variable: ClientPortalVariable;
  onUpdate: (patch: Partial<ClientPortalVariable>) => void;
  onDelete: () => void;
  onInsert: () => void;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_180px_190px]">
        <InputBlock
          label="שם לתצוגה"
          value={variable.label}
          onChange={(value) => onUpdate({ label: value })}
        />

        <SelectBlock
          label="סוג שדה"
          value={variable.type}
          onChange={(value) =>
            onUpdate({ type: value as ClientPortalVariableType })
          }
          options={[
            { value: "text", label: "טקסט קצר" },
            { value: "textarea", label: "טקסט ארוך" },
            { value: "number", label: "מספר" },
            { value: "date", label: "תאריך" },
            { value: "checkbox", label: "צ׳קבוקס" },
            { value: "checklist", label: "רשימת סימון" },
            { value: "status", label: "סטטוס" },
            { value: "file", label: "קובץ" },
            { value: "image", label: "תמונה" },
            { value: "email", label: "מייל" },
            { value: "phone", label: "טלפון" },
          ]}
        />

        <SelectBlock
          label="מקור הנתון"
          value={variable.source}
          onChange={(value) =>
            onUpdate({ source: value as ClientPortalVariableSource })
          }
          options={[
            { value: "business_input", label: "העסק ממלא" },
            { value: "client_input", label: "הלקוח ממלא" },
            { value: "crm_client", label: "מתיק הלקוח" },
            { value: "appointments", label: "מפגישות" },
            { value: "payments", label: "מתשלומים" },
            { value: "tasks", label: "ממשימות" },
            { value: "files", label: "מקבצים" },
            { value: "custom", label: "מותאם אישית" },
          ]}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <InputBlock
          label="שם משתנה טכני"
          value={variable.key}
          onChange={(value) => onUpdate({ key: cleanVariableKey(value) })}
        />

        <SelectBlock
          label="היקף נתונים"
          value={variable.scope}
          onChange={(value) =>
            onUpdate({ scope: value as ClientPortalVariable["scope"] })
          }
          options={[
            { value: "per_client", label: "אישי לפי לקוח" },
            { value: "global", label: "כללי לכל הלקוחות" },
          ]}
        />

        <InputBlock
          label="Placeholder"
          value={variable.placeholder || ""}
          onChange={(value) => onUpdate({ placeholder: value })}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ToggleCard
          compact
          title="מוצג ללקוח"
          text="הלקוח יראה את המשתנה בעמוד"
          checked={variable.visibleToClient}
          onChange={(checked) => onUpdate({ visibleToClient: checked })}
        />

        <ToggleCard
          compact
          title="הלקוח יכול לערוך"
          text="הלקוח יוכל להזין או לעדכן את הערך"
          checked={variable.editableByClient}
          onChange={(checked) => onUpdate({ editableByClient: checked })}
        />

        <ToggleCard
          compact
          title="שדה חובה"
          text="לא ניתן לשלוח בלי למלא"
          checked={variable.required}
          onChange={(checked) => onUpdate({ required: checked })}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-black text-slate-500">
          {"{{"}
          {variable.key || "variable_key"}
          {"}}"} · {clientPortalVariableTypeLabel(variable.type)} ·{" "}
          {clientPortalVariableSourceLabel(variable.source)}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onInsert}
            className="h-11 rounded-2xl bg-violet-700 px-4 text-xs font-black text-white transition hover:bg-violet-800"
          >
            הכנסה לעמוד
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="h-11 rounded-2xl bg-rose-50 px-4 text-xs font-black text-rose-600 transition hover:bg-rose-100"
          >
            מחיקה
          </button>
        </div>
      </div>
    </article>
  );
}

function ToggleCard({
  title,
  text,
  checked,
  onChange,
  compact = false,
}: {
  title: string;
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "rounded-2xl border text-right transition",
        compact ? "p-4" : "p-5",
        checked
          ? "border-violet-300 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {text}
          </p>
        </div>

        <span
          className={[
            "mt-0.5 grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
            checked
              ? "border-violet-700 bg-violet-700 text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

function SelectBlock({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-600">
        {label}
      </label>

      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

function SideInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white/10 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
