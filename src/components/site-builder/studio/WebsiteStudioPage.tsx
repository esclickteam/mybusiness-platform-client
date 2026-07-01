import React, { useEffect, useMemo, useRef, useState } from "react";
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

function loadPageIntoEditor(editor: Editor, page: StudioSitePageWithPortal) {
  try {
    if (page.projectData && typeof editor.loadProjectData === "function") {
      editor.loadProjectData(page.projectData as any);
    } else {
      editor.setComponents(page.html || createBlankPageHtml(page.title));
      editor.setStyle(page.css || defaultCanvasCss);
    }

    editor.select(null);
    editor.refresh();
  } catch (error) {
    console.error("BIZUPLY LOAD PAGE ERROR:", error);
    editor.setComponents(page.html || createBlankPageHtml(page.title));
    editor.setStyle(page.css || defaultCanvasCss);
    editor.select(null);
    editor.refresh();
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

function extractSectionsFromEditor(editor: Editor): StudioPageSection[] {
  const wrapper: any = editor.getWrapper();
  if (!wrapper) return [];

  const found: any[] = [
    ...(wrapper.find?.("[data-section-kind]") || []),
    ...(wrapper.find?.("header") || []),
    ...(wrapper.find?.("section") || []),
    ...(wrapper.find?.("footer") || []),
  ];

  const unique = new Map<string, any>();

  found.forEach((component) => {
    const cid = component.cid || component.getId?.() || component.get?.("id");
    if (!cid) return;
    unique.set(cid, component);
  });

  return Array.from(unique.values()).map((component, index) => {
    const attrs = component.getAttributes?.() || {};
    const tagName = String(component.get?.("tagName") || "").toLowerCase();
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
      component.addAttributes?.({
        id,
        "data-studio-section-id": id,
      });
    } else if (!attrs["data-studio-section-id"]) {
      component.addAttributes?.({
        "data-studio-section-id": id,
      });
    }

    const titleFromAttr =
      attrs["data-section-title"] ||
      attrs["data-block-title"] ||
      attrs["aria-label"];

    const heading =
      component.find?.("h1")?.[0] ||
      component.find?.("h2")?.[0] ||
      component.find?.("h3")?.[0];

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
  const background = getSeedPaletteValue(seed, "background", "#FBF7EF");
  const text = getSeedPaletteValue(seed, "text", "#2F241B");
  const muted = getSeedPaletteValue(seed, "muted", "#6D5A49");

  return `${defaultCanvasCss}\n\n
:root {
  --biz-primary: ${primary};
  --biz-secondary: ${secondary};
  --biz-accent: ${accent};
  --biz-bg: ${background};
  --biz-text: ${text};
  --biz-muted: ${muted};
}

.bizuply-template-site,
.velmora-editor-site {
  background: var(--biz-bg);
  color: var(--biz-text);
  font-family: Inter, Assistant, Heebo, Arial, sans-serif;
}

.velmora-editor-site * {
  box-sizing: border-box;
}

.velmora-editor-site img {
  display: block;
  max-width: 100%;
}

.velmora-editor-site a,
.velmora-editor-site button {
  cursor: pointer;
  text-decoration: none;
}

.velmora-editor-site [contenteditable="true"],
.velmora-editor-site [data-gjs-type="text"] {
  outline-offset: 4px;
}

.velmora-editor-site [data-gjs-type="text"]:hover {
  outline: 1px dashed rgba(154, 111, 59, 0.42);
}

.velmora-fade-up {
  animation: velmoraFadeUp 0.75s ease both;
}

.velmora-float-1 {
  animation: velmoraFloatOne 5.4s ease-in-out infinite;
}

.velmora-float-2 {
  animation: velmoraFloatTwo 6.2s ease-in-out infinite;
}

.velmora-float-3 {
  animation: velmoraFloatThree 5.8s ease-in-out infinite;
}

.velmora-soft-pulse {
  animation: velmoraSoftPulse 4.8s ease-in-out infinite;
}

.velmora-image-hover {
  transition: transform 700ms ease;
}

.group:hover .velmora-image-hover {
  transform: scale(1.05);
}

@keyframes velmoraFadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes velmoraFloatOne {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-0.8deg); }
}

@keyframes velmoraFloatTwo {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(14px) rotate(0.8deg); }
}

@keyframes velmoraFloatThree {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

@keyframes velmoraSoftPulse {
  0%, 100% { opacity: 0.72; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

[data-section-kind] {
  scroll-margin-top: 120px;
}
`;
}

function velmoraIcon(name: "bag" | "sparkles" | "arrow-left" | "heart" | "check" | "badge" | "phone" | "mail" | "pin" | "star" | "menu") {
  const base =
    'xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const icons: Record<string, string> = {
    bag: `<svg ${base}><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>`,
    sparkles: `<svg ${base}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z"/><path d="m19 14 .8 1.8L22 17l-2.2 1.2L19 20l-.8-1.8L16 17l2.2-1.2L19 14Z"/></svg>`,
    "arrow-left": `<svg ${base}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`,
    heart: `<svg ${base}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
    check: `<svg ${base}><path d="M20 6 9 17l-5-5"/></svg>`,
    badge: `<svg ${base}><path d="M12 3 14.5 8l5.5.8-4 3.9.9 5.5L12 15.7 7.1 18.2l.9-5.5-4-3.9L9.5 8 12 3Z"/></svg>`,
    phone: `<svg ${base}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z"/></svg>`,
    mail: `<svg ${base}><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>`,
    pin: `<svg ${base}><path d="M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    star: `<svg ${base} fill="currentColor" stroke="currentColor"><path d="m12 2 3 6.4 7 .9-5.1 4.8 1.3 6.9L12 17.6 5.8 21l1.3-6.9L2 9.3l7-.9L12 2Z"/></svg>`,
    menu: `<svg ${base}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>`,
  };

  return icons[name];
}

function velmoraHeaderHtml() {
  return `
<header dir="rtl" data-section-kind="header" data-section-title="Header" class="sticky top-0 z-50 border-b border-[#e7dfd2] bg-[#fbf7ef]/95 backdrop-blur-xl">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
    <div class="flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f241b] text-[#f7ead5]">
        ${velmoraIcon("bag")}
      </div>
      <div>
        <p data-gjs-type="text" class="text-lg font-black tracking-[-0.04em] text-[#2f241b]">Velmora</p>
        <p data-gjs-type="text" class="text-xs font-semibold text-[#8b735f]">בוטיק אופנה ולייףסטייל</p>
      </div>
    </div>

    <nav class="hidden items-center gap-8 text-sm font-bold text-[#6d5a49] lg:flex">
      <a data-editable-link="true" href="#collections" class="hover:text-[#2f241b]">קולקציות</a>
      <a data-editable-link="true" href="#products" class="hover:text-[#2f241b]">פריטים</a>
      <a data-editable-link="true" href="#lookbook" class="hover:text-[#2f241b]">לוקבוק</a>
      <a data-editable-link="true" href="#about" class="hover:text-[#2f241b]">אודות</a>
      <a data-editable-link="true" href="#contact" class="hover:text-[#2f241b]">יצירת קשר</a>
    </nav>

    <div class="flex items-center gap-2">
      <a data-editable-link="true" href="#products" class="hidden rounded-full bg-[#2f241b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4b3828] md:inline-flex">
        לקולקציה החדשה
      </a>
      <button type="button" class="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7dfd2] bg-white text-[#2f241b] lg:hidden">
        ${velmoraIcon("menu")}
      </button>
    </div>
  </div>
</header>`;
}

function velmoraHeroHtml() {
  return `
<section id="hero" dir="rtl" data-section-kind="hero" data-section-title="Hero" class="relative overflow-hidden bg-[#fbf7ef]">
  <div class="pointer-events-none absolute left-[-120px] top-12 h-80 w-80 rounded-full bg-[#c9a46d]/20 blur-3xl velmora-soft-pulse"></div>
  <div class="pointer-events-none absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full bg-[#526243]/20 blur-3xl velmora-soft-pulse"></div>

  <div class="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
    <div class="velmora-fade-up">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white px-4 py-2 text-sm font-black text-[#6d5a49] shadow-sm">
        <span class="text-[#9a6f3b]">${velmoraIcon("sparkles")}</span>
        <span data-gjs-type="text">קולקציה חדשה · חורף / אביב</span>
      </div>

      <h1 data-gjs-type="text" class="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[#2f241b] md:text-7xl">
        אופנה נקייה, מדויקת ויוקרתית ליום־יום שלך.
      </h1>

      <p data-gjs-type="text" class="mt-7 max-w-xl text-lg leading-8 text-[#6d5a49]">
        תבנית בוטיק יוקרתית לחנות בגדים, מותג לייףסטייל או סטודיו עיצוב.
        עם קולקציות, מוצרים, לוקבוק, סיפור מותג וטופס יצירת קשר.
      </p>

      <div class="mt-9 flex flex-col gap-3 sm:flex-row">
        <a data-editable-link="true" href="#products" class="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f241b] px-7 py-4 text-sm font-black text-white transition hover:bg-[#4b3828]">
          צפייה בפריטים
          ${velmoraIcon("arrow-left")}
        </a>

        <a data-editable-link="true" href="#lookbook" class="inline-flex items-center justify-center rounded-full border border-[#d8cab9] bg-white px-7 py-4 text-sm font-black text-[#2f241b] transition hover:bg-[#f7ead5]">
          לוקבוק השראה
        </a>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
      <div class="flex flex-col gap-4 pt-10">
        <div class="overflow-hidden rounded-[2rem] bg-white p-3 shadow-xl velmora-float-1">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
            alt="אופנה בוטיק"
            class="h-64 w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div class="rounded-[2rem] border border-[#e7dfd2] bg-white p-5 shadow-sm velmora-float-3">
          <p data-gjs-type="text" class="text-sm font-black text-[#2f241b]">משלוח מהיר</p>
          <p data-gjs-type="text" class="mt-2 text-sm leading-6 text-[#6d5a49]">
            חווית רכישה נקייה, ברורה ומוכנה לחנות אונליין.
          </p>
        </div>
      </div>

      <div class="overflow-hidden rounded-[2.6rem] bg-white p-3 shadow-2xl velmora-float-2">
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
          alt="דוגמנית עם פריטי אופנה"
          class="h-[560px] w-full rounded-[2.1rem] object-cover"
        />
      </div>
    </div>
  </div>
</section>`;
}

function velmoraCollectionsHtml() {
  const collections = [
    {
      title: "Essential",
      text: "פריטים נקיים ליום־יום",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Evening",
      text: "לוקים מוקפדים לערב",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Studio",
      text: "פריטי סטודיו במהדורה מוגבלת",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return `
<section id="collections" dir="rtl" data-section-kind="collections" data-section-title="Collections" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">Collections</p>
        <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">קולקציות שמרגישות כמו מותג.</h2>
      </div>
      <p data-gjs-type="text" class="max-w-md text-base leading-7 text-[#6d5a49]">
        אזורים ברורים להצגת קטגוריות, קולקציות, מבצעים וסגנונות שונים.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      ${collections
        .map(
          (collection) => `
      <article data-section-kind="collection-card" data-section-title="${escapeHtml(collection.title)}" class="group overflow-hidden rounded-[2.2rem] bg-[#fbf7ef] shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
        <div class="overflow-hidden">
          <img src="${collection.image}" alt="${escapeHtml(collection.title)}" class="velmora-image-hover h-80 w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div class="flex items-center justify-between p-6">
          <div>
            <h3 data-gjs-type="text" class="text-2xl font-black text-[#2f241b]">${escapeHtml(collection.title)}</h3>
            <p data-gjs-type="text" class="mt-1 text-sm font-semibold text-[#6d5a49]">${escapeHtml(collection.text)}</p>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f241b] text-white">
            ${velmoraIcon("arrow-left")}
          </div>
        </div>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function velmoraProductsHtml() {
  const products = [
    {
      name: "שמלת ליאן",
      price: "₪289",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "בלייזר נובה",
      price: "₪420",
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "חולצת אור",
      price: "₪169",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "תיק מילה",
      price: "₪240",
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return `
<section id="products" dir="rtl" data-section-kind="products" data-section-title="Products" class="bg-[#fbf7ef] px-5 py-24">
  <div class="mx-auto max-w-7xl">
    <div class="mb-12 flex items-end justify-between gap-6">
      <div>
        <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">Shop</p>
        <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">פריטים נבחרים.</h2>
      </div>

      <a data-editable-link="true" href="#contact" class="hidden rounded-full border border-[#d8cab9] bg-white px-5 py-3 text-sm font-black text-[#2f241b] transition hover:bg-[#f7ead5] md:inline-flex">
        לכל הפריטים
      </a>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      ${products
        .map(
          (product) => `
      <article data-section-kind="product" data-section-title="${escapeHtml(product.name)}" class="group">
        <div class="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" class="velmora-image-hover h-80 w-full rounded-[1.5rem] object-cover transition duration-700 group-hover:scale-105" />
          <button type="button" class="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#2f241b] shadow-sm backdrop-blur transition hover:bg-[#2f241b] hover:text-white">
            ${velmoraIcon("heart")}
          </button>
        </div>

        <div class="mt-4 flex items-start justify-between">
          <div>
            <h3 data-gjs-type="text" class="text-lg font-black text-[#2f241b]">${escapeHtml(product.name)}</h3>
            <p data-gjs-type="text" class="mt-1 text-sm font-semibold text-[#6d5a49]">פריט חדש בקולקציה</p>
          </div>
          <p data-gjs-type="text" class="text-lg font-black text-[#2f241b]">${escapeHtml(product.price)}</p>
        </div>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function velmoraLookbookHtml() {
  return `
<section id="lookbook" dir="rtl" data-section-kind="lookbook" data-section-title="Lookbook" class="bg-[#2f241b] px-5 py-24 text-white">
  <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div>
      <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#d7b27a]">Lookbook</p>
      <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] md:text-6xl">
        תצוגה ויזואלית שמוכרת סגנון, לא רק מוצר.
      </h2>
      <p data-gjs-type="text" class="mt-6 max-w-xl text-lg leading-8 text-white/70">
        אזור לוקבוק עם תמונות גדולות, תחושת מותג, השראה ללקוחות והכוונה
        לקנייה או השארת פרטים.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <img src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80" alt="לוקבוק" class="h-96 rounded-[2rem] object-cover velmora-float-1" />
      <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" alt="לוקבוק אופנה" class="mt-16 h-96 rounded-[2rem] object-cover velmora-float-2" />
    </div>
  </div>
</section>`;
}

function velmoraAboutHtml() {
  const checks = [
    "עמוד בית עם תחושת מותג חזקה",
    "קולקציות, מוצרים ולוקבוק מוכנים להצגה",
    "עיצוב עברי מלא, רספונסיבי ונקי",
  ];

  return `
<section id="about" dir="rtl" data-section-kind="about" data-section-title="About" class="bg-white px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
    <div class="overflow-hidden rounded-[2.6rem]">
      <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80" alt="סטודיו אופנה" class="h-[560px] w-full object-cover" />
    </div>

    <div>
      <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">About</p>
      <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
        אתר שמספר את הסיפור של המותג ומוביל לרכישה.
      </h2>
      <p data-gjs-type="text" class="mt-6 text-lg leading-8 text-[#6d5a49]">
        Velmora מתאימה לחנויות בגדים, סטודיו לעיצוב, מותגי לייףסטייל,
        תכשיטים, אקססוריז וגם נותני שירות שרוצים נראות יוקרתית ונקייה.
      </p>

      <div class="mt-8 grid gap-4">
        ${checks
          .map(
            (item) => `
        <div class="flex items-center gap-3">
          <span class="h-5 w-5 text-[#526243]">${velmoraIcon("check")}</span>
          <span data-gjs-type="text" class="font-bold text-[#2f241b]">${escapeHtml(item)}</span>
        </div>`,
          )
          .join("")}
      </div>
    </div>
  </div>
</section>`;
}

function velmoraFeaturesHtml() {
  const items = [
    ["משלוחים", "הצגה ברורה של אפשרויות משלוח והחזרות"],
    ["קולקציות", "חלוקה לפריטים, קטגוריות ומבצעים"],
    ["אמון", "המלצות, שאלות נפוצות וסיפור מותג"],
  ];

  return `
<section dir="rtl" data-section-kind="features" data-section-title="Features" class="bg-[#fbf7ef] px-5 py-20">
  <div class="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
    ${items
      .map(
        ([title, content]) => `
    <div data-section-kind="feature-card" data-section-title="${escapeHtml(title)}" class="rounded-[2rem] border border-[#e7dfd2] bg-white p-7">
      <span class="h-7 w-7 text-[#526243]">${velmoraIcon("badge")}</span>
      <h3 data-gjs-type="text" class="mt-5 text-2xl font-black text-[#2f241b]">${escapeHtml(title)}</h3>
      <p data-gjs-type="text" class="mt-3 leading-7 text-[#6d5a49]">${escapeHtml(content)}</p>
    </div>`,
      )
      .join("")}
  </div>
</section>`;
}

function velmoraFaqHtml() {
  const faqs = [
    ["האם אפשר להפוך את זה לחנות אמיתית?", "כן. המבנה מתאים לחנות עם מוצרים, קולקציות ודפי פריט."],
    ["אפשר להשתמש בזה גם לנותני שירות?", "כן. אפשר להחליף מוצרים לשירותים, לוקבוק לפרויקטים וטופס רכישה לטופס ליד."],
    ["האם הכל בעברית?", "כן. כל הטקסטים והכיוון מותאמים לעברית ול־RTL."],
  ];

  return `
<section dir="rtl" data-section-kind="faq" data-section-title="FAQ" class="bg-white px-5 py-24">
  <div class="mx-auto max-w-4xl">
    <div class="text-center">
      <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">FAQ</p>
      <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">שאלות נפוצות.</h2>
    </div>

    <div class="mt-10 grid gap-4">
      ${faqs
        .map(
          ([q, a]) => `
      <div data-section-kind="faq-item" data-section-title="${escapeHtml(q)}" class="rounded-[1.5rem] border border-[#e7dfd2] bg-[#fbf7ef] p-6">
        <h3 data-gjs-type="text" class="text-lg font-black text-[#2f241b]">${escapeHtml(q)}</h3>
        <p data-gjs-type="text" class="mt-2 leading-7 text-[#6d5a49]">${escapeHtml(a)}</p>
      </div>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function velmoraContactHtml() {
  const contactItems = [
    ["phone", "03-555-9821"],
    ["mail", "hello@velmora.co.il"],
    ["pin", "רחוב הבוטיק 18, תל אביב"],
  ] as const;

  return `
<section id="contact" dir="rtl" data-section-kind="contact" data-section-title="Contact" class="bg-[#fbf7ef] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
    <div>
      <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">Contact</p>
      <h2 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">
        רוצה להתאים את התבנית לעסק שלך?
      </h2>

      <div class="mt-10 grid gap-4">
        ${contactItems
          .map(
            ([icon, content]) => `
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2f241b]">
            ${velmoraIcon(icon)}
          </div>
          <span data-gjs-type="text" class="font-bold text-[#6d5a49]">${escapeHtml(content)}</span>
        </div>`,
          )
          .join("")}
      </div>
    </div>

    <form data-section-kind="form" data-section-title="Contact Form" class="rounded-[2rem] bg-white p-7 shadow-sm">
      <input placeholder="שם מלא" class="h-14 w-full rounded-2xl border border-[#e7dfd2] px-4 text-sm font-bold outline-none focus:border-[#2f241b]" />
      <input placeholder="טלפון" class="mt-4 h-14 w-full rounded-2xl border border-[#e7dfd2] px-4 text-sm font-bold outline-none focus:border-[#2f241b]" />
      <textarea placeholder="מה תרצו לבנות?" rows="6" class="mt-4 w-full resize-none rounded-2xl border border-[#e7dfd2] p-4 text-sm font-bold outline-none focus:border-[#2f241b]"></textarea>
      <button type="button" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f241b] px-6 py-4 text-sm font-black text-white transition hover:bg-[#4b3828]">
        שליחת פנייה
        ${velmoraIcon("arrow-left")}
      </button>
    </form>
  </div>
</section>`;
}

function velmoraFooterHtml() {
  return `
<footer dir="rtl" data-section-kind="footer" data-section-title="Footer" class="bg-[#2f241b] px-5 py-10 text-white">
  <div class="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
    <div>
      <p data-gjs-type="text" class="text-lg font-black">Velmora</p>
      <p data-gjs-type="text" class="mt-1 text-sm text-white/55">
        תבנית בוטיק יוקרתית לחנות בגדים, לייףסטייל ונותני שירות.
      </p>
    </div>

    <div class="flex items-center gap-2 text-[#d7b27a]">
      ${[1, 2, 3, 4, 5].map(() => velmoraIcon("star")).join("")}
    </div>
  </div>
</footer>`;
}

function createVelmoraShellHtml(content: string, activeLabel: string) {
  return `
<main data-studio-page="true" data-bizuply-site="true" data-template-id="velmora" data-active-page="${escapeHtml(activeLabel)}" dir="rtl" class="velmora-editor-site min-h-screen bg-white text-[#2f241b]">
  ${velmoraHeaderHtml()}
  ${content}
  ${velmoraFooterHtml()}
</main>`;
}

function createVelmoraHomeContent(seed: ReadyWebsiteTemplateSeed) {
  return `
  ${velmoraHeroHtml()}
  ${velmoraCollectionsHtml()}
  ${velmoraProductsHtml()}
  ${velmoraLookbookHtml()}
  ${velmoraAboutHtml()}
  ${velmoraFeaturesHtml()}
  ${velmoraFaqHtml()}
  ${velmoraContactHtml()}`;
}

function createVelmoraInfoContent(title: string, eyebrow: string) {
  return `
<section dir="rtl" data-section-kind="info" data-section-title="${escapeHtml(title)}" class="bg-[#fbf7ef] px-5 py-24">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
    <aside class="h-fit rounded-[2rem] border border-[#e7dfd2] bg-white p-7 shadow-sm">
      <p data-gjs-type="text" class="text-sm font-black uppercase tracking-[0.25em] text-[#9a6f3b]">${escapeHtml(eyebrow)}</p>
      <h1 data-gjs-type="text" class="mt-3 text-4xl font-black tracking-[-0.05em] text-[#2f241b] md:text-5xl">${escapeHtml(title)}</h1>
      <p data-gjs-type="text" class="mt-5 leading-8 text-[#6d5a49]">
        עמוד פנימי מוכן לעריכה מלאה, באותו סגנון של תבנית Velmora.
      </p>
    </aside>

    <article class="rounded-[2rem] bg-white p-8 shadow-sm">
      <h2 data-gjs-type="text" class="text-4xl font-black tracking-[-0.05em] text-[#2f241b]">כאן עורכים את תוכן העמוד</h2>
      <p data-gjs-type="text" class="mt-5 text-lg leading-8 text-[#6d5a49]">
        אפשר להחליף את הטקסטים, התמונות, הכפתורים והסקשנים לפי העסק.
      </p>
      ${["כללי", "פרטים חשובים", "יצירת קשר", "עדכון אחרון"]
        .map(
          (item, i) => `
      <section data-section-kind="basic" data-section-title="${escapeHtml(item)}" class="mt-8 rounded-[1.5rem] border border-[#e7dfd2] bg-[#fbf7ef] p-6">
        <h3 data-gjs-type="text" class="text-2xl font-black text-[#2f241b]">${i + 1}. ${escapeHtml(item)}</h3>
        <p data-gjs-type="text" class="mt-3 leading-7 text-[#6d5a49]">טקסט דוגמה בלבד. ניתן לערוך, למחוק, לשכפל ולהוסיף בלוקים נוספים.</p>
      </section>`,
        )
        .join("")}
    </article>
  </div>
</section>`;
}

function createVelmoraShopContent() {
  return `
  ${velmoraCollectionsHtml()}
  ${velmoraProductsHtml()}
  ${velmoraFeaturesHtml()}`;
}

function createVelmoraLookbookContent() {
  return `
  ${velmoraLookbookHtml()}
  ${velmoraAboutHtml()}`;
}

function createVelmoraAboutContent() {
  return `
  ${velmoraAboutHtml()}
  ${velmoraFeaturesHtml()}
  ${velmoraFaqHtml()}`;
}

function createVelmoraContactContent() {
  return velmoraContactHtml();
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
      content: createVelmoraAboutContent(),
    },
    {
      id: "projects",
      title: "קולקציות",
      slug: "collections",
      type: "gallery",
      content: velmoraCollectionsHtml(),
    },
    {
      id: "custom",
      title: "לוקבוק",
      slug: "lookbook",
      type: "gallery",
      content: createVelmoraLookbookContent(),
    },
    {
      id: "contact",
      title: "צור קשר",
      slug: "contact",
      type: "contact",
      content: createVelmoraContactContent(),
    },
    {
      id: "cart",
      title: "סל קניות",
      slug: "cart",
      type: "blank",
      content: createVelmoraInfoContent("סל קניות", "CART"),
    },
    {
      id: "terms",
      title: "תקנון אתר",
      slug: "terms",
      type: "blank",
      content: createVelmoraInfoContent("תקנון אתר", "TERMS"),
    },
    {
      id: "privacy",
      title: "מדיניות פרטיות",
      slug: "privacy",
      type: "blank",
      content: createVelmoraInfoContent("מדיניות פרטיות", "PRIVACY"),
    },
    {
      id: "accessibility",
      title: "נגישות",
      slug: "accessibility",
      type: "blank",
      content: createVelmoraInfoContent("נגישות", "ACCESSIBILITY"),
    },
    {
      id: "faq",
      title: "שאלות נפוצות",
      slug: "faq",
      type: "blank",
      content: velmoraFaqHtml(),
    },
    {
      id: "shipping",
      title: "משלוחים והחזרות",
      slug: "shipping",
      type: "blank",
      content: createVelmoraInfoContent("משלוחים והחזרות", "SHIPPING"),
    },
    {
      id: "orders",
      title: "שירות והזמנות",
      slug: "orders",
      type: "blank",
      content: createVelmoraInfoContent("שירות והזמנות", "ORDERS"),
    },
  ];

  return {
    slug: "your-business",
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

  const html = `<main data-studio-page="true" data-bizuply-site="true" data-template-id="${escapeHtml(seed.id)}" class="bizuply-template-site min-h-screen" style="background:${background};color:${text};"><header data-section-kind="header" data-section-title="Header" class="sticky top-0 z-40 bg-white/90 px-6 py-5 backdrop-blur-xl"><div class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm"><div class="text-2xl font-black">${name}</div><nav class="hidden gap-6 text-sm font-bold text-slate-500 md:flex"><a data-editable-link="true" href="#about">אודות</a><a data-editable-link="true" href="#services">שירותים</a><a data-editable-link="true" href="#contact">צור קשר</a></nav></div></header><section id="hero" data-section-kind="hero" data-section-title="Hero" class="px-6 py-28 text-center"><h1 class="mx-auto max-w-5xl text-6xl font-black tracking-[-0.06em] md:text-8xl">${title}</h1><p class="mx-auto mt-7 max-w-2xl text-lg leading-9" style="color:${muted};">${subtitle}</p><a data-editable-link="true" href="#contact" class="mt-9 inline-flex rounded-2xl px-8 py-4 text-sm font-black text-white" style="background:${primary};">יצירת קשר</a></section>${sections}<footer data-section-kind="footer" data-section-title="Footer" class="px-6 py-14" style="background:${primary};color:white;"><div class="mx-auto max-w-6xl"><div class="text-3xl font-black">${name}</div><p class="mt-3 max-w-md text-sm leading-7 text-white/70">${escapeHtml(seed.description || "")}</p></div></footer></main>`;

  return {
    slug: "your-business",
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

function createPagesFromTemplateSeed(
  seed: ReadyWebsiteTemplateSeed,
): BuiltTemplatePages {
  if (seed.id === "velmora") {
    return createVelmoraTemplatePages(seed);
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

  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(
    () => normalizeBusinessSlug(initialSlug) || "your-business",
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
    if (forceTemplateLoad && initialTemplateSeed) {
      return createPagesFromTemplateSeed(initialTemplateSeed).pages;
    }

    return createInitialPages();
  });
  const [activePageId, setActivePageId] = useState(() => {
    if (forceTemplateLoad && initialTemplateSeed) {
      return createPagesFromTemplateSeed(initialTemplateSeed).activePageId;
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
      } catch (error) {
        console.error("BIZUPLY SLUG CHECK ERROR:", error);
        setSlugAvailable(false);
        setSlugError("שגיאה בבדיקת הסאב דומיין");
      } finally {
        setSlugChecking(false);
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [businessId, slug, slugValid]);

  const syncSections = (editor: Editor) => {
    window.setTimeout(() => {
      setActivePageSections(extractSectionsFromEditor(editor));
    }, 0);
  };

  const syncSelected = (editor: Editor) => {
    setSelectedComponent(editor.getSelected() || null);
    syncSections(editor);
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
    if (
      !ready ||
      !editorRef.current ||
      !forceTemplateLoad ||
      !initialTemplateSeed
    ) {
      return;
    }

    const editor = editorRef.current;
    const builtTemplate = createPagesFromTemplateSeed(initialTemplateSeed);
    const pageToLoad =
      builtTemplate.pages.find(
        (page) => page.id === builtTemplate.activePageId,
      ) || builtTemplate.pages[0];

    loadedFromServerRef.current = true;
    setLoadingSite(false);
    setSlug(
      normalizeBusinessSlug(initialSlug) ||
        builtTemplate.slug ||
        "your-business",
    );
    setPages(builtTemplate.pages);
    setActivePageId(builtTemplate.activePageId);
    setActivePanel(null);
    setActivePalette(null);

    if (pageToLoad) {
      loadPageIntoEditor(editor, pageToLoad);
      syncSections(editor);
    }
  }, [ready, forceTemplateLoad, initialTemplateSeed, initialSlug]);

  useEffect(() => {
    if (
      !ready ||
      !businessId ||
      !editorRef.current ||
      loadedFromServerRef.current ||
      (forceTemplateLoad && initialTemplateSeed)
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
      } catch (error) {
        console.error("BIZUPLY LOAD SITE FROM SERVER ERROR:", error);
      } finally {
        setLoadingSite(false);
      }
    };

    loadSiteFromServer();
  }, [ready, businessId, initialSlug, forceTemplateLoad, initialTemplateSeed]);

  const runEditor = (callback: (editor: Editor) => void) => {
    if (!editorRef.current) return;
    callback(editorRef.current);
  };

  const getSelectedOrWrapper = (editor: Editor) => {
    const selected = editor.getSelected();
    if (selected) return selected;

    const wrapper = editor.getWrapper();
    return wrapper || null;
  };

  const getSafeAppendTarget = (editor: Editor) => {
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
      const html = active?.isHome
        ? forceTemplateLoad && initialTemplateSeed
          ? createPagesFromTemplateSeed(initialTemplateSeed).pages.find(
              (page) => page.id === "home",
            )?.html || defaultWebsiteHtml
          : defaultWebsiteHtml
        : createBlankPageHtml(active?.title || "עמוד חדש");

      editor.setComponents(html);
      editor.setStyle(
        forceTemplateLoad && initialTemplateSeed
          ? createTemplateCss(initialTemplateSeed)
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
        subdomain?: string;
        siteDomain?: string;
        templateId?: string;
        templateName?: string;
      } = {
        businessId,
        templateId: initialTemplateId || initialTemplateSeed?.id,
        templateName: initialTemplateSeed?.name,
        slug,
        published,
        html: editor.getHtml(),
        css: editor.getCss(),
        projectData: editor.getProjectData(),
        updatedAt: new Date().toISOString(),
        status: published ? "published" : "draft",
        publicUrl,
        subdomain: `${slug}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`,
        siteDomain: BIZUPLY_PUBLIC_SITE_DOMAIN,
        domain: {
          slug,
          subdomain: `${slug}.${BIZUPLY_PUBLIC_SITE_DOMAIN}`,
          publicUrl,
          customDomain: undefined,
          provider: "bizuply-subdomain",
          status: published ? "connected" : "draft",
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

      console.log("BIZUPLY SITE SAVED:", payload);
    } catch (error: any) {
      console.error("BIZUPLY SITE SAVE ERROR:", error);
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

  const handleSidebarPanelChange = (panel: ActiveStudioPanel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const handleOpenDomainSearch = () => {
    const target = businessId
      ? `/business/${businessId}/dashboard/domain-search`
      : "/business/domain-search";

    window.location.assign(target);
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
            setActivePanel={handleSidebarPanelChange}
            businessId={businessId}
            siteSlug={slug}
            publicUrl={publicUrl}
            onSlugChange={(value) => {
              const nextSlug = normalizeBusinessSlug(value);
              setSlug(nextSlug);
              setSlugAvailable(null);
              setSlugError("");
            }}
            onOpenDomainSearch={handleOpenDomainSearch}
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
