import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Editor } from "grapesjs";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Monitor,
  Save,
  Smartphone,
  Tablet,
} from "lucide-react";

import StudioSidebar from "./StudioSidebar";
import StudioInspector from "./StudioInspector";

import { initBizuplyEditor } from "./grapes/initEditor";
import { defaultCanvasCss } from "./grapes/canvasTheme";
import { writeEditableLinkAttributes } from "./data/linkUtils";

import type {
  ActiveStudioPanel,
  AnimationPresetValue,
  InspectorTab,
  PageTemplate,
  StudioEditableLink,
  StudioSitePage,
  StudioSitePageType,
  StylePatch,
  ThemePalette,
} from "./types";

import type { StudioTemplateRenderer } from "./data/templates/templateEditorTypes";

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
  }) => void | Promise<void>;
};

type VisualPageSection = {
  id: string;
  title: string;
  kind: string;
  tagName: string;
};

type DeviceMode = "Desktop" | "Tablet" | "Mobile";

type EditablePage = StudioSitePage & {
  projectData?: unknown;
};

function normalizeSlug(value: string | null | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\//, "").replace(/\/$/, "");
}

function getPageType(pageId: string): StudioSitePageType {
  if (pageId === "home") return "home";
  if (pageId === "shop") return "store";
  if (pageId === "product") return "product";
  if (pageId === "cart") return "store";
  if (pageId === "contact") return "contact";
  if (pageId === "about") return "about";
  if (pageId === "projects") return "gallery";
  if (pageId === "custom") return "service";
  return "blank";
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

function getSectionTitleFromKind(kind: string) {
  const labels: Record<string, string> = {
    header: "Header",
    hero: "פתיח",
    about: "אודות",
    services: "שירותים",
    service: "שירות",
    gallery: "גלריה",
    projects: "קולקציות",
    store: "חנות",
    product: "מוצר",
    contact: "יצירת קשר",
    footer: "Footer",
    section: "סקשן",
  };

  return labels[kind] || kind || "סקשן";
}

function isReadyEditor(editor: Editor | null | undefined): editor is Editor {
  return Boolean(
    editor &&
      typeof editor.getWrapper === "function" &&
      typeof editor.getSelected === "function",
  );
}

function ensureComponentEditable(component: any) {
  if (!component || typeof component.set !== "function") return;

  component.set({
    draggable: true,
    droppable: true,
    copyable: true,
    removable: true,
    editable: true,
    stylable: true,
    highlightable: true,
    hoverable: true,
    selectable: true,
    resizable: {
      tl: true,
      tc: true,
      tr: true,
      cl: true,
      cr: true,
      bl: true,
      bc: true,
      br: true,
      keyWidth: "width",
      keyHeight: "height",
    },
  });
}

function makeAllComponentsEditable(editor: Editor) {
  const wrapper: any = editor.getWrapper?.();

  if (!wrapper) return;

  ensureComponentEditable(wrapper);

  wrapper.find?.("*")?.forEach((component: any) => {
    ensureComponentEditable(component);
  });
}

function extractSectionsFromEditor(
  editor: Editor | null | undefined,
): VisualPageSection[] {
  if (!isReadyEditor(editor)) return [];

  const wrapper: any = editor.getWrapper();

  if (!wrapper || typeof wrapper.find !== "function") return [];

  const marked = [
    ...(wrapper.find?.('[data-bizuply-editor-section="true"]') || []),
  ];

  const dataMarked = [
    ...(wrapper.find?.("[data-section-kind]") || []),
    ...(wrapper.find?.("[data-bizuply-block]") || []),
  ];

  const fallback = [
    ...(wrapper.find?.("header") || []),
    ...(wrapper.find?.("section") || []),
    ...(wrapper.find?.("footer") || []),
  ];

  const found: any[] = marked.length
    ? marked
    : dataMarked.length
      ? dataMarked
      : fallback;

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
      id = `section-${index + 1}`;
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
    const label = getSectionTitleFromKind(String(kind));

    return {
      id,
      title: titleFromAttr || headingText || `${label} ${index + 1}`,
      kind: String(kind),
      tagName: tagName || "section",
    };
  });
}

function renderTemplatePageHtml(
  renderer: StudioTemplateRenderer,
  pageId: string,
) {
  const TemplateComponent = renderer.Component as React.ComponentType<any>;

  const rawHtml = renderToStaticMarkup(
    <TemplateComponent
      initialPage={pageId}
      isStudioStatic
      isVisualEditor={false}
      templateData={renderer.defaultData || {}}
      data={renderer.defaultData || {}}
      studioData={renderer.defaultData || {}}
    />,
  );

  return `
<div
  data-studio-page="true"
  data-bizuply-site="true"
  data-template-id="${String(renderer.key || "")}"
  class="min-h-screen"
>
  ${rawHtml}
</div>`;
}

function getEditorCss(renderer: StudioTemplateRenderer) {
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

[data-bizuply-site="true"] img,
[data-bizuply-site="true"] video {
  display: block;
  max-width: 100%;
}

[data-bizuply-site="true"] a,
[data-bizuply-site="true"] button {
  cursor: pointer;
}

[data-bizuply-site="true"] .opacity-0,
[data-bizuply-site="true"] [class*="opacity-0"],
[data-bizuply-site="true"] [style*="opacity:0"],
[data-bizuply-site="true"] [style*="opacity: 0"] {
  opacity: 1 !important;
}

[data-bizuply-site="true"] [class*="translate-y"],
[data-bizuply-site="true"] [class*="-translate-y"],
[data-bizuply-site="true"] [style*="translateY"],
[data-bizuply-site="true"] [style*="translate3d"] {
  transform: none !important;
}

${renderer.editorCss || ""}
`;
}

function snapshotActivePage(
  page: EditablePage,
  editor: Editor | null,
): EditablePage {
  if (!editor) return page;

  return {
    ...page,
    html: editor.getHtml(),
    css: editor.getCss(),
    projectData: editor.getProjectData(),
    updatedAt: new Date().toISOString(),
  };
}

function loadPageIntoEditor(editor: Editor, page: EditablePage) {
  const html = page.html || "";
  const css = page.css || defaultCanvasCss;

  if (page.projectData && typeof editor.loadProjectData === "function") {
    editor.loadProjectData(page.projectData as any);
  } else {
    editor.setComponents(html);
    editor.setStyle(css);
  }

  editor.select(null);

  window.setTimeout(() => {
    makeAllComponentsEditable(editor);
    editor.refresh();
  }, 0);
}

function pickImageFromComputer() {
  return new Promise<string>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];

      if (!file) {
        resolve("");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        resolve(String(reader.result || ""));
      };

      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    };

    input.click();
  });
}

function getSelectedOrWrapper(editor: Editor) {
  return (editor.getSelected?.() as any) || (editor.getWrapper?.() as any) || null;
}

function isEditableLinkComponent(selectedComponent: any) {
  if (!selectedComponent) return false;

  const tagName = String(selectedComponent.get?.("tagName") || "").toLowerCase();
  const attrs = selectedComponent.getAttributes?.() || {};

  return (
    tagName === "a" ||
    tagName === "button" ||
    attrs["data-editable-link"] === "true" ||
    attrs["data-biz-button"] ||
    attrs.href
  );
}

export default function TemplateVisualEditor({
  renderer,
  businessId,
  initialData,
  onBack,
  onSave,
}: TemplateVisualEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [previewOnly, setPreviewOnly] = useState(false);
  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>("pages");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [activePageSections, setActivePageSections] = useState<VisualPageSection[]>(
    [],
  );

  const pagesSeed = useMemo(() => {
    const now = new Date().toISOString();
    const sourcePages =
      Array.isArray(renderer.pages) && renderer.pages.length
        ? renderer.pages
        : [
            {
              id: "home",
              name: "Home",
              slug: "/",
            },
          ];

    return sourcePages.map((page: any, index: number) => {
      const pageId = String(page.id || `page-${index + 1}`);
      const isHome = pageId === "home" || page.slug === "/" || index === 0;
      const html = renderTemplatePageHtml(renderer, pageId);
      const css = getEditorCss(renderer);

      return {
        id: pageId,
        title: String(page.name || page.title || pageId),
        slug: isHome ? "" : normalizeSlug(page.slug || pageId),
        type: getPageType(pageId),
        isHome,
        html,
        css,
        createdAt: now,
        updatedAt: now,
      } as EditablePage;
    });
  }, [renderer]);

  const [pages, setPages] = useState<EditablePage[]>(pagesSeed);
  const [activePageId, setActivePageId] = useState(pagesSeed[0]?.id || "home");

  useEffect(() => {
    setPages(pagesSeed);
    setActivePageId(pagesSeed[0]?.id || "home");
  }, [pagesSeed]);

  const activePage = useMemo(() => {
    return pages.find((page) => page.id === activePageId) || pages[0] || null;
  }, [pages, activePageId]);

  const publicPages = useMemo<StudioSitePage[]>(() => {
    return pages.map((page) => ({
      ...page,
      projectData: undefined,
    }));
  }, [pages]);

  function runEditor(callback: (editor: Editor) => void) {
    if (!editorRef.current) return;
    callback(editorRef.current);
  }

  function syncSections(editor: Editor | null | undefined) {
    window.setTimeout(() => {
      setActivePageSections(extractSectionsFromEditor(editor));
    }, 0);
  }

  function syncSelected(editor: Editor | null | undefined) {
    if (!editor || !isReadyEditor(editor)) {
      setSelectedComponent(null);
      setActivePageSections([]);
      return;
    }

    const selected = editor.getSelected?.() || null;
    setSelectedComponent(selected);
    syncSections(editor);
  }

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

        const firstPage = pagesSeed[0];

        if (firstPage) {
          loadPageIntoEditor(createdEditor, firstPage);
        }

        makeAllComponentsEditable(createdEditor);
        syncSelected(createdEditor);
      },
      onSelect: () => {
        setInspectorTab("design");
        if (editorRef.current) syncSelected(editorRef.current);
      },
    });

    editorRef.current = editor;

    editor.on("component:selected", () => {
      makeAllComponentsEditable(editor);
      syncSelected(editor);
    });
    editor.on("component:deselected", () => syncSelected(editor));
    editor.on("component:add", () => {
      makeAllComponentsEditable(editor);
      syncSections(editor);
    });
    editor.on("component:remove", () => syncSections(editor));
    editor.on("component:update", () => {
      makeAllComponentsEditable(editor);
      syncSections(editor);
    });
    editor.on("component:styleUpdate", () => syncSections(editor));
    editor.on("load", () => {
      makeAllComponentsEditable(editor);
      syncSelected(editor);
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
      setReady(false);
      setSelectedComponent(null);
      setActivePageSections([]);
    };
  }, []);

  useEffect(() => {
    if (!ready || !editorRef.current || !activePage) return;

    loadPageIntoEditor(editorRef.current, activePage);
    syncSelected(editorRef.current);
  }, [ready, activePageId]);

  function handleSelectPage(pageId: string) {
    runEditor((editor) => {
      setPages((currentPages) => {
        const active = currentPages.find((page) => page.id === activePageId);
        const snapshotted = active
          ? currentPages.map((page) =>
              page.id === activePageId ? snapshotActivePage(page, editor) : page,
            )
          : currentPages;

        return snapshotted;
      });

      setActivePageId(pageId);
      setActivePanel("pages");
    });
  }

  function handleSelectSection(sectionId: string) {
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
  }

  function handleApplyStyle(style: StylePatch) {
    runEditor((editor) => {
      const target = getSelectedOrWrapper(editor);

      if (!target) {
        alert("בחרי אלמנט באתר כדי לערוך אותו");
        return;
      }

      target.addStyle(style);
      editor.select(target);
      setSelectedComponent(target);
      syncSections(editor);
    });
  }

  function handleApplyLink(link: StudioEditableLink) {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי כפתור או לינק כדי להגדיר קישור");
        return;
      }

      if (!isEditableLinkComponent(selected)) {
        alert("בחרי כפתור או לינק. אם זה טקסט רגיל, קודם הוסיפי כפתור.");
        return;
      }

      const tagName = String(selected.get?.("tagName") || "").toLowerCase();

      if (tagName === "button") {
        selected.set?.("tagName", "a");

        const currentAttrs = { ...(selected.getAttributes?.() || {}) };
        delete currentAttrs.type;

        selected.setAttributes?.({
          ...currentAttrs,
          role: "button",
        });
      }

      const nextAttrs = writeEditableLinkAttributes(link, publicPages);

      selected.addAttributes(nextAttrs);
      selected.addStyle({
        cursor: "pointer",
      });

      editor.select(selected);
      setSelectedComponent(selected);
      syncSections(editor);
    });
  }

  function handleSetBackgroundImage() {
    pickImageFromComputer().then((dataUrl) => {
      if (!dataUrl) return;

      runEditor((editor) => {
        const target = getSelectedOrWrapper(editor);

        if (!target) {
          alert("בחרי אלמנט או סקשן כדי להגדיר תמונת רקע");
          return;
        }

        target.addStyle({
          "background-image": `linear-gradient(rgba(2,6,23,0.30), rgba(2,6,23,0.30)), url("${dataUrl}")`,
          "background-size": "cover",
          "background-position": "center",
          "background-repeat": "no-repeat",
        });

        editor.select(target);
        setSelectedComponent(target);
        syncSections(editor);
      });
    });
  }

  function handleDuplicateSelected() {
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
  }

  function handleDeleteSelected() {
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
  }

  function handleBringForward() {
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

      editor.select(selected);
      setSelectedComponent(selected);
    });
  }

  function handleSendBackward() {
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

      editor.select(selected);
      setSelectedComponent(selected);
    });
  }

  function handleSetAnimation(animation: AnimationPresetValue | string) {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

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

      editor.select(selected);
      setSelectedComponent(selected);
    });
  }

  function handleClearAnimation() {
    runEditor((editor) => {
      const selected: any = editor.getSelected();

      if (!selected) {
        alert("בחרי אלמנט / סקשן");
        return;
      }

      const attrs = selected.getAttributes?.() || {};
      delete attrs["data-animate"];

      selected.setAttributes?.(attrs);
      selected.addStyle({
        animation: "",
        "animation-duration": "",
        "animation-timing-function": "",
        "animation-fill-mode": "",
      });

      editor.select(selected);
      setSelectedComponent(selected);
    });
  }

  function changeDevice(nextDevice: DeviceMode) {
    setDevice(nextDevice);
    runEditor((editor) => editor.setDevice(nextDevice));
  }

  function handlePreviewToggle() {
    setPreviewOnly((current) => {
      const next = !current;

      runEditor((editor) => {
        if (next) {
          editor.runCommand("preview");
        } else {
          editor.stopCommand("preview");
        }
      });

      return next;
    });
  }

  async function handleSave() {
    const updatedAt = new Date().toISOString();

    setSaving(true);

    try {
      let finalPages = pages;

      if (editorRef.current && activePage) {
        finalPages = pages.map((page) =>
          page.id === activePageId
            ? snapshotActivePage(page, editorRef.current)
            : page,
        );
        setPages(finalPages);
      }

      const active = finalPages.find((page) => page.id === activePageId);

      const payload = {
        templateKey: renderer.key,
        editorMode: "visual-react" as const,
        data: {
          ...(initialData || {}),
          __editorEngine: "grapesjs",
          __activePageId: activePageId,
          __pages: finalPages,
          __html: active?.html || "",
          __css: active?.css || "",
          __projectData: active?.projectData || null,
        },
        updatedAt,
      };

      await onSave?.(payload);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `bizuply-visual-template-${businessId || renderer.key}`,
          JSON.stringify(payload),
        );
      }

      setSavedAt(updatedAt);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-100 text-slate-950"
      dir="rtl"
      data-template-visual-editor="true"
      data-template-key={renderer.key}
      data-business-id={businessId || ""}
    >
      <header className="z-30 flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </button>
          ) : null}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              React Template · Wix Behavior
            </p>

            <h1 className="text-xl font-black tracking-[-0.04em] text-slate-950">
              {renderer.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedAt ? (
            <div className="hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700 xl:block">
              נשמר {new Date(savedAt).toLocaleTimeString("he-IL")}
            </div>
          ) : null}

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 md:flex">
            {(["Desktop", "Tablet", "Mobile"] as DeviceMode[]).map((item) => {
              const active = device === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeDevice(item)}
                  title={item}
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-950",
                  ].join(" ")}
                >
                  {item === "Desktop" ? (
                    <Monitor className="h-4 w-4" />
                  ) : item === "Tablet" ? (
                    <Tablet className="h-4 w-4" />
                  ) : (
                    <Smartphone className="h-4 w-4" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handlePreviewToggle}
            className={[
              "inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-black transition",
              previewOnly
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {previewOnly ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewOnly ? "חזרה לעריכה" : "מצב צפייה"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !ready}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "שומר..." : "שמירה"}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[522px_minmax(0,1fr)_420px]">
        <StudioSidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          pages={publicPages}
          activePageId={activePageId}
          activePageSections={activePageSections}
          onSelectPage={handleSelectPage}
          onAddPage={() => alert("יצירת עמוד חדש תחובר בשלב הבא")}
          onUpdatePageTitle={() => alert("עריכת שם עמוד תחובר בשלב הבא")}
          onSelectSection={handleSelectSection}
          onDeleteSection={() => alert("מחיקת סקשן דרך הסיידבר תחובר בשלב הבא")}
          onDuplicateSection={() =>
            alert("שכפול סקשן דרך הסיידבר תחובר בשלב הבא")
          }
          onMoveSectionUp={() => alert("הזזת סקשן תחובר בשלב הבא")}
          onMoveSectionDown={() => alert("הזזת סקשן תחובר בשלב הבא")}
          onOpenSectionsPanel={(kind) => {
            setActivePanel("sections");
            if (kind) {
              alert(`פתיחת וריאציות עבור ${kind} תחובר בשלב הבא`);
            }
          }}
          onAddHtml={() => alert("הוספת HTML תחובר בשלב הבא")}
          onApplyTemplate={(_template: PageTemplate) =>
            alert("החלפת תבנית עמוד תחובר בשלב הבא")
          }
          onApplyPalette={(_palette: ThemePalette) =>
            alert("ערכת עיצוב תחובר בשלב הבא")
          }
          onOpenMedia={() => {
            runEditor((editor) => editor.runCommand("open-assets"));
          }}
        />

        <main className="min-h-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_28%),linear-gradient(135deg,#f8fafc,#ffffff)] p-5">
          <div className="h-full overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_100px_rgba(15,23,42,0.10)]">
            <div ref={editorContainerRef} className="h-full w-full" />
          </div>
        </main>

        <aside className="flex min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <StudioInspector
            activeTab={inspectorTab}
            setActiveTab={setInspectorTab}
            stylesRef={stylesRef}
            traitsRef={traitsRef}
            pages={publicPages}
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
        </aside>

        <div className="hidden">
          <div ref={layersRef} />
        </div>
      </div>
    </div>
  );
}
