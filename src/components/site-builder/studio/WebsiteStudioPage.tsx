import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Editor } from "grapesjs";

import type {
  DeviceMode,
  InspectorTab,
  PageTemplate,
  SiteSavePayload,
  ActiveStudioPanel,
  StylePatch,
  ThemePalette,
  WebsiteStudioPageProps,
  StudioEditableLink,
  StudioSitePage,
  StudioSitePageType,
} from "./types";
import type { ReadyWebsiteTemplateSeed } from "./data/readyWebsiteTypes";

import StudioTopbar from "./StudioTopbar";
import StudioSidebar from "./StudioSidebar";
import StudioCanvas from "./StudioCanvas";
import StudioInspector from "./StudioInspector";

import { getStudioTemplateRenderer } from "./data/templates/templateRendererRegistry";

import { initBizuplyEditor } from "./grapes/initEditor";
import {
  createCanvasCss,
  defaultCanvasCss,
  defaultWebsiteHtml,
} from "./grapes/canvasTheme";

import {
  normalizePageSlug,
  writeEditableLinkAttributes,
} from "./data/linkUtils";

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
};

const BIZUPLY_PUBLIC_SITE_DOMAIN =
  process.env.NEXT_PUBLIC_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

const STUDIO_TEMPLATE_DEBUG = false;

function studioDebug(_label: string, _payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;
}

function studioWarn(_label: string, _payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;
}

function studioError(_label: string, _payload?: unknown) {
  if (!STUDIO_TEMPLATE_DEBUG) return;
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
        editor.runCommand?.("core:component-outline");

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
        editor.runCommand?.("core:component-outline");
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

function readTemplateSeedFromStorage(): ReadyWebsiteTemplateSeed | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const templateFromUrl = String(params.get("template") || "")
    .trim()
    .toLowerCase();

  studioDebug("readTemplateSeedFromStorage:start", {
    templateFromUrl,
    href: window.location.href,
  });

  if (!templateFromUrl) {
    studioWarn("readTemplateSeedFromStorage:no-template-query");
    return null;
  }

  try {
    const raw = window.localStorage.getItem("bizuply-selected-template-data");

    studioDebug("readTemplateSeedFromStorage:localStorage", {
      hasRaw: Boolean(raw),
      rawLength: raw?.length || 0,
    });

    if (!raw) return null;

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
      hasFonts: Boolean(parsed?.fonts),
      hasLayoutSettings: Boolean(parsed?.layoutSettings),
    });

    if (!parsedKey && !parsedRendererKey) {
      studioWarn("readTemplateSeedFromStorage:missing-parsed-key", parsed);
      return null;
    }

    const matchesTemplateFromUrl =
      parsedKey === templateFromUrl || parsedRendererKey === templateFromUrl;

    if (!matchesTemplateFromUrl) {
      studioWarn("readTemplateSeedFromStorage:key-mismatch", {
        parsedKey,
        parsedRendererKey,
        templateFromUrl,
      });
      return null;
    }

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
      palette: parsed.palette || {},
      fonts: parsed.fonts || {},
      layoutSettings: parsed.layoutSettings || {},
      blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
    } as ReadyWebsiteTemplateSeed;

    studioDebug("readTemplateSeedFromStorage:success", {
      id: seed.id,
      key: (seed as any).key,
      rendererKey: (seed as any).rendererKey,
      renderMode: (seed as any).renderMode,
      editorMode: (seed as any).editorMode,
      name: seed.name,
      blocksCount: Array.isArray(seed.blocks) ? seed.blocks.length : 0,
    });

    return seed;
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

function renderRegisteredTemplateToStaticHtml(
  seed: ReadyWebsiteTemplateSeed,
  rendererPage?: any,
) {
  const renderer = getTemplateRendererBySeed(seed);
  const templateId = getTemplateIdFromSeed(seed);
  const pageId = String(rendererPage?.id || "home");

  if (!renderer?.Component) {
    studioWarn("renderRegisteredTemplateToStaticHtml:no-renderer-component", {
      templateId,
      pageId,
    });
    return "";
  }

  try {
    const TemplateComponent = renderer.Component as React.ComponentType<any>;
    const rawHtml = renderToStaticMarkup(
      <TemplateComponent initialPage={pageId} isStudioStatic />,
    );
    const editableHtml = ensureEditableSectionMarkers(
      rawHtml,
      templateId,
      rendererPage,
    );

    studioDebug("renderRegisteredTemplateToStaticHtml:success-1-to-1", {
      templateId,
      pageId,
      rendererKey: renderer.key,
      rendererName: renderer.name,
      rawHtmlLength: rawHtml.length,
      editableHtmlLength: editableHtml.length,
      rawDataSectionKindCount:
        (rawHtml.match(/data-section-kind=/g) || []).length,
      editableDataSectionKindCount:
        (editableHtml.match(/data-section-kind=/g) || []).length,
      editorSectionCount:
        (editableHtml.match(/data-bizuply-editor-section="true"/g) || []).length,
      hasSection: editableHtml.includes("<section"),
      hasDataSectionKind: editableHtml.includes("data-section-kind"),
      hasImage: editableHtml.includes("<img"),
      sample: editableHtml.slice(0, 300),
    });

    return `
<div
  data-studio-page="true"
  data-bizuply-site="true"
  data-template-id="${escapeHtml(templateId)}"
  data-template-page-id="${escapeHtml(pageId)}"
  class="min-h-screen"
>
  ${editableHtml}
</div>`;
  } catch (error) {
    studioError("renderRegisteredTemplateToStaticHtml:error", {
      templateId,
      pageId,
      error,
    });
    return "";
  }
}

function createRegisteredTemplateCss(seed: ReadyWebsiteTemplateSeed) {
  const templateId = getTemplateIdFromSeed(seed);
  const safeTemplateId = escapeHtml(templateId);

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
  GrapesJS מקבל HTML סטטי מתוך React.
  אנימציות reveal / motion של התבנית לא רצות בתוך iframe סטטי,
  לכן בעורך אנחנו מכריחים את כל התוכן להיות גלוי.
*/
[data-template-id="${safeTemplateId}"] .opacity-0,
[data-template-id="${safeTemplateId}"] [class*="opacity-0"],
[data-template-id="${safeTemplateId}"] [style*="opacity:0"],
[data-template-id="${safeTemplateId}"] [style*="opacity: 0"] {
  opacity: 1 !important;
}

[data-template-id="${safeTemplateId}"] [style*="translateY"],
[data-template-id="${safeTemplateId}"] [style*="translate3d"],
[data-template-id="${safeTemplateId}"] [style*="translate-y"],
[data-template-id="${safeTemplateId}"] [class*="translate-y"],
[data-template-id="${safeTemplateId}"] [class*="-translate-y"] {
  transform: none !important;
}

[data-template-id="${safeTemplateId}"] [style*="visibility:hidden"],
[data-template-id="${safeTemplateId}"] [style*="visibility: hidden"] {
  visibility: visible !important;
}

[data-template-id="${safeTemplateId}"] [style*="display:none"],
[data-template-id="${safeTemplateId}"] [style*="display: none"] {
  display: block !important;
}

[data-template-id="${safeTemplateId}"] .serif-title {
  font-family: Georgia, 'Times New Roman', serif;
}

[data-section-kind] {
  scroll-margin-top: 120px;
}
`;
}

function createPagesFromRegisteredRenderer(
  seed: ReadyWebsiteTemplateSeed,
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
    const html = renderRegisteredTemplateToStaticHtml(seed, page);

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

  const registeredTemplate = createPagesFromRegisteredRenderer(seed);

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

export default function WebsiteStudioPage({
  businessId,
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

  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(
    () =>
      normalizeBusinessSlug(
        selectedTemplateSeed
          ? selectedTemplateSeed.id || selectedTemplateSeed.name || initialSlug
          : initialSlug,
      ) || "your-business",
  );
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");
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
  const [activePageId, setActivePageId] = useState(() => {
    if (selectedTemplateSeed) {
      return createPagesFromTemplateSeed(selectedTemplateSeed).activePageId;
    }

    return "home";
  });
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
    return buildPublicSiteUrl(slug);
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  const studioGridClass = useMemo(() => {
    const base =
      "grid min-h-0 flex-1 transition-[grid-template-columns] duration-300 ease-out";

    if (activePanel) {
      return [base, "grid-cols-[522px_minmax(0,1fr)_430px]"].join(" ");
    }

    return [base, "grid-cols-[92px_minmax(0,1fr)_430px]"].join(" ");
  }, [activePanel]);

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
        setInspectorTab("design");
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
  }, []);

  useEffect(() => {
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
  }, [ready, selectedTemplateSeed]);

  useEffect(() => {
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
        const res = await fetch(`/api/site-builder/site/${businessId}`, {
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
    initialSlug,
    forceTemplateLoad,
    initialTemplateSeed,
    shouldLoadSelectedTemplate,
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
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          title,
          slug: page.isHome ? "" : normalizePageSlug(title, prev, pageId),
          updatedAt: new Date().toISOString(),
        };
      }),
    );
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

    if (slug === "your-business") {
      alert("בחרי סאב דומיין אמיתי לפני שמירה.");
      return;
    }

    if (slugAvailable === false) {
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
        clientPortalPages?: StudioSitePageWithPortal[];
        publicUrl?: string;
        siteDomain?: string;
        templateId?: string;
        templateName?: string;
      } = {
        businessId,
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
        pages: savedPages,
        activePageId,
        clientPortalPages: savedPages.filter(
          (page) => page.clientPortal?.enabled,
        ),
      };

      localStorage.setItem(
        `bizuply-mini-site-${businessId || "demo"}`,
        JSON.stringify(payload),
      );

      const res = await fetch("/api/site-builder/site", {
        method: "PUT",
        credentials: "include",
        headers: buildAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "שמירת האתר בשרת נכשלה");
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

  const handleApplyLink = (link: StudioEditableLink) => {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי כפתור או לינק כדי להגדיר קישור");
        return;
      }

      const tagName = String(selected.get?.("tagName") || "").toLowerCase();
      const attrs = selected.getAttributes?.() || {};

      const isLinkLike =
        tagName === "a" ||
        tagName === "button" ||
        attrs["data-editable-link"] === "true" ||
        attrs["data-biz-button"];

      if (!isLinkLike) {
        alert("בחרי כפתור או לינק. אם זה טקסט רגיל, קודם הוסיפי כפתור.");
        return;
      }

      if (tagName === "button") {
        selected.set?.("tagName", "a");

        const currentAttrs = { ...(selected.getAttributes?.() || {}) };
        delete currentAttrs.type;

        selected.setAttributes?.({
          ...currentAttrs,
          role: "button",
        });
      }

      const nextAttrs = writeEditableLinkAttributes(link, pages);

      selected.addAttributes(nextAttrs);
      selected.addStyle({
        cursor: "pointer",
      });

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

  return (
    <div
      dir="rtl"
      className="h-screen w-full overflow-hidden bg-[#f6f4ff] text-slate-950"
    >
      <div className="flex h-screen flex-col">
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

        <div className="z-40 border-b border-violet-100 bg-white px-4 py-2">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-slate-950">
                עמוד פעיל: {activePage?.title || "עמוד"}
              </p>
              <p className="truncate text-[11px] font-bold text-slate-400">
                {activePageClientPortal.enabled
                  ? `עמוד אזור אישי · ${activePageClientPortal.variables.length} משתנים`
                  : "עמוד רגיל באתר"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setClientPortalModalOpen(true)}
              className={[
                "inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition",
                activePageClientPortal.enabled
                  ? "bg-violet-700 text-white shadow-[0_14px_35px_rgba(124,58,237,0.22)] hover:bg-violet-800"
                  : "bg-slate-950 text-white hover:bg-violet-700",
              ].join(" ")}
            >
              {activePageClientPortal.enabled
                ? "ניהול משתנים לאזור אישי"
                : "הפוך לעמוד אזור אישי"}
            </button>
          </div>
        </div>

        <div className={studioGridClass}>
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

          <StudioCanvas
            editorRefContainer={editorContainerRef}
            publicUrl={publicUrl}
            layersRef={layersRef}
          />

          <StudioInspector
            activeTab={inspectorTab}
            setActiveTab={setInspectorTab}
            stylesRef={stylesRef}
            traitsRef={traitsRef}
            pages={pages}
            selectedComponent={selectedComponent}
            onApplyLink={handleApplyLink}
            onSetBackgroundImage={handleSetBackgroundImage}
            onDuplicate={handleDuplicateSelected}
            onDelete={handleDeleteSelected}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onApplyStyle={handleApplyStyle}
            onSetAnimation={handleSetAnimation}
            onClearAnimation={handleClearAnimation}
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
