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

function createInitialPages(): StudioSitePage[] {
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
    },
  ];
}

function snapshotPages(
  pages: StudioSitePage[],
  editor: Editor,
  activePageId: string
): StudioSitePage[] {
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

function loadPageIntoEditor(editor: Editor, page: StudioSitePage) {
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

  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(initialSlug);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [activePalette, setActivePalette] = useState<ThemePalette | null>(null);

  const [pages, setPages] = useState<StudioSitePage[]>(() => createInitialPages());
  const [activePageId, setActivePageId] = useState("home");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [activePageSections, setActivePageSections] = useState<StudioPageSection[]>([]);

  const publicUrl = useMemo(() => {
    const clean = slug.trim() || "your-business";
    return `https://${clean}.bizuply.com`;
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

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
    };
  }, []);

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

      const nextPage: StudioSitePage = {
        id,
        title: cleanTitle,
        slug: normalizePageSlug(cleanTitle, pages),
        type: "blank",
        html: createBlankPageHtml(cleanTitle),
        css: defaultCanvasCss,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  const handleSelectPage = (pageId: string) => {
    runEditor((editor) => {
      if (pageId === activePageId) {
        setActivePanel("pages");
        syncSections(editor);
        return;
      }

      let pageToLoad: StudioSitePage | null = null;

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

    setSaving(true);

    try {
      const editor = editorRef.current;
      const savedPages = snapshotPages(pages, editor, activePageId);

      setPages(savedPages);

      const payload: SiteSavePayload = {
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
      };

      localStorage.setItem(
        `bizuply-mini-site-${businessId || "demo"}`,
        JSON.stringify(payload)
      );

      await onSave?.(payload);

      setSavedAt(
        new Date().toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      console.log("BIZUPLY SITE SAVED:", payload);
    } catch (error) {
      console.error("BIZUPLY SITE SAVE ERROR:", error);
      alert("אירעה שגיאה בשמירת האתר. נסי שוב.");
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
          setSlug={setSlug}
          slugValid={slugValid}
          device={device}
          setDevice={handleSetDevice}
          ready={ready && !saving}
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
