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
} from "./types";

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

import { normalizePageSlug, writeEditableLinkAttributes } from "./data/linkUtils";

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
  activePageId: string
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
      (tagName === "header" ? "header" : tagName === "footer" ? "footer" : "section");

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

export default function WebsiteStudioPage({
  businessId,
  initialSlug = "your-business",
  onSave,
}: WebsiteStudioPageProps) {
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
    () => normalizeBusinessSlug(initialSlug) || "your-business"
  );
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugError, setSlugError] = useState("");
  const [ready, setReady] = useState(false);
  const [loadingSite, setLoadingSite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [activePalette, setActivePalette] = useState<ThemePalette | null>(null);

  const [pages, setPages] = useState<StudioSitePageWithPortal[]>(() =>
    createInitialPages()
  );
  const [activePageId, setActivePageId] = useState("home");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [activePageSections, setActivePageSections] = useState<StudioPageSection[]>([]);
  const [clientPortalModalOpen, setClientPortalModalOpen] = useState(false);

  const activePage = useMemo(() => {
    return pages.find((page) => page.id === activePageId) || pages[0];
  }, [pages, activePageId]);

  const activePageClientPortal = useMemo(() => {
    return activePage?.clientPortal || createDefaultClientPortalConfig();
  }, [activePage]);

  const publicUrl = useMemo(() => {
    const clean = slug.trim() || "your-business";
    return `https://${clean}.bizuply.com`;
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

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
            slug
          )}&businessId=${encodeURIComponent(businessId)}`,
          {
            method: "GET",
            credentials: "include",
            headers: buildAuthHeaders(),
          }
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
          available ? "" : data?.error || "הסאב דומיין הזה כבר תפוס"
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
    if (!ready || !businessId || !editorRef.current || loadedFromServerRef.current) {
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
                clientPortal: page.clientPortal || createDefaultClientPortalConfig(),
              }))
            : createInitialPages();

        const nextActivePageId =
          data.site.activePageId ||
          serverPages.find((page) => page.isHome)?.id ||
          serverPages[0]?.id ||
          "home";

        setSlug(normalizeBusinessSlug(data.site.slug || initialSlug) || "your-business");
        setPages(serverPages);
        setActivePageId(nextActivePageId);

        const pageToLoad =
          serverPages.find((page) => page.id === nextActivePageId) || serverPages[0];

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
  }, [ready, businessId, initialSlug]);

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
        last.view?.el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
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
      })
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
      | ((current: ClientPortalPageConfig) => ClientPortalPageConfig)
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
      })
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
    patch: Partial<ClientPortalVariable>
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
          key: shouldAutoKey ? cleanVariableKey(nextLabel) || variable.key : patch.key ?? variable.key,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  };

  const deleteClientPortalVariable = (variableId: string) => {
    updateActivePageClientPortal((current) => ({
      ...current,
      variables: current.variables.filter((variable) => variable.id !== variableId),
    }));
  };

  const insertVariablePlaceholderToEditor = (variable: ClientPortalVariable) => {
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

      if (!parent || index < 0 || nextIndex < 0 || nextIndex >= collection.length) {
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

      const templatePalette = templateAny.palette || templateAny.theme || activePalette;

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
        ? defaultWebsiteHtml
        : createBlankPageHtml(active?.title || "עמוד חדש");

      editor.setComponents(html);
      editor.setStyle(defaultCanvasCss);
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
      } = {
        businessId,
        slug,
        published,
        html: editor.getHtml(),
        css: editor.getCss(),
        projectData: editor.getProjectData(),
        updatedAt: new Date().toISOString(),
        status: published ? "published" : "draft",
        domain: {
          slug,
          published,
        },
        pages: savedPages,
        activePageId,
        clientPortalPages: savedPages.filter((page) => page.clientPortal?.enabled),
      };

      localStorage.setItem(
        `bizuply-mini-site-${businessId || "demo"}`,
        JSON.stringify(payload)
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
        })
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
      const selected = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט לשכפול");
        return;
      }

      const cloned = selected.clone();

      if (cloned) {
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
      <style>{studioShellCss}</style>

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
              הסאב דומיין פנוי: https://{slug}.bizuply.com
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

        <div
          className="grid min-h-0 flex-1 transition-[grid-template-columns] duration-300 ease-out"
          style={{
            gridTemplateColumns: `${activePanel ? "522px" : "92px"} minmax(0, 1fr) 430px`,
          }}
        >
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
            onMoveSectionDown={(sectionId) => handleMoveSection(sectionId, "down")}
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
      | ((current: ClientPortalPageConfig) => ClientPortalPageConfig)
  ) => void;
  onAddVariable: () => void;
  onUpdateVariable: (variableId: string, patch: Partial<ClientPortalVariable>) => void;
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
            <h2 className="mt-3 text-2xl font-black leading-tight">{pageTitle}</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-white/55">
              כאן העסק מגדיר אילו משתנים קיימים בעמוד. אחר כך ב־CRM מחברים
              לקוחות, והמערכת מושכת לכל לקוח את הנתונים שלו.
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            <SideInfo label="סטטוס" value={config.enabled ? "עמוד אזור אישי" : "עמוד רגיל"} />
            <SideInfo label="משתנים" value={String(config.variables.length)} />
            <SideInfo
              label="נתונים"
              value={config.dataMode === "per_client" ? "אישיים לפי לקוח" : "גלובליים"}
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
                  onChange={(checked) => onUpdateConfig({ loginRequired: checked })}
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
                    לדוגמה: כותרת, סטטוס, רשימת משימות, קובץ, תאריך, תשלום, פגישה.
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
                    לחצי על “הוספת משתנה” כדי לאפשר לעסק להגדיר איזה מידע
                    יופיע ללקוח בעמוד הזה.
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
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{text}</p>
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

const studioShellCss = `
  .gjs-one-bg {
    background: #ffffff !important;
  }

  .gjs-two-color {
    color: #475569 !important;
  }

  .gjs-three-bg {
    background: #8b5cf6 !important;
  }

  .gjs-four-color,
  .gjs-four-color-h:hover {
    color: #8b5cf6 !important;
  }

  .gjs-cv-canvas {
    background: #eef0f7 !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
  }

  .gjs-frame-wrapper {
    box-shadow: 0 25px 90px rgba(15, 23, 42, 0.16) !important;
  }

  .gjs-frame {
    border-radius: 18px !important;
  }

  .gjs-toolbar {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    width: auto !important;
    min-width: max-content !important;
    max-width: calc(100vw - 32px) !important;
    min-height: 44px !important;
    padding: 8px 12px !important;
    border-radius: 999px !important;
    background: #2296e8 !important;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18) !important;
    overflow: visible !important;
    white-space: nowrap !important;
    z-index: 999999 !important;
    direction: rtl !important;
  }

  .gjs-toolbar .gjs-toolbar-item {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    min-width: 34px !important;
    height: 34px !important;
    margin: 0 !important;
    padding: 0 9px !important;
    border-radius: 999px !important;
    color: #ffffff !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    background: transparent !important;
    opacity: 1 !important;
    overflow: visible !important;
    white-space: nowrap !important;
    transform: none !important;
  }

  .gjs-toolbar .gjs-toolbar-item:hover {
    background: rgba(255, 255, 255, 0.18) !important;
  }

  .gjs-badge {
    background: #8b5cf6 !important;
    color: #ffffff !important;
    border-radius: 999px !important;
    padding: 4px 8px !important;
    font-weight: 900 !important;
  }

  .gjs-resizer-h {
    border-color: #8b5cf6 !important;
  }

  .gjs-selected {
    outline: 3px solid #8b5cf6 !important;
    outline-offset: 6px !important;
  }

  .gjs-hovered {
    outline: 2px dashed rgba(139, 92, 246, 0.55) !important;
    outline-offset: 6px !important;
  }

  .gjs-sm-sector {
    border: 1px solid #e2e8f0 !important;
    border-radius: 24px !important;
    overflow: hidden !important;
    margin-bottom: 14px !important;
    background: #ffffff !important;
  }

  .gjs-sm-sector-title {
    background: #f8fafc !important;
    color: #0f172a !important;
    font-weight: 900 !important;
    letter-spacing: 0 !important;
    padding: 14px 16px !important;
  }

  .gjs-sm-property {
    padding: 10px 14px !important;
  }

  .gjs-field,
  .gjs-input-holder input,
  .gjs-sm-select select {
    border-radius: 14px !important;
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
  }

  .gjs-layer {
    border-radius: 14px !important;
    margin-bottom: 6px !important;
  }

  .gjs-mdl-dialog {
    width: min(1180px, 92vw) !important;
    max-width: 1180px !important;
    border-radius: 32px !important;
    overflow: hidden !important;
    box-shadow: 0 40px 140px rgba(15, 23, 42, 0.28) !important;
  }

  .gjs-mdl-header {
    display: none !important;
  }

  .gjs-mdl-content {
    padding: 0 !important;
  }

  .gjs-am-assets-cont {
    background: #fff !important;
  }

  .gjs-am-file-uploader {
    border-radius: 24px !important;
    border: 1px dashed #c4b5fd !important;
    background: #f8f5ff !important;
  }

  .gjs-am-assets {
    background: #ffffff !important;
  }

  .gjs-am-preview-cont {
    border-radius: 18px !important;
    overflow: hidden !important;
  }
`;