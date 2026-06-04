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

  // ✅ חשוב: null מאפשר לסיידבר להיסגר בלחיצה חוזרת
  const [activePanel, setActivePanel] = useState<ActiveStudioPanel>(null);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(initialSlug);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [activePalette, setActivePalette] = useState<ThemePalette | null>(null);

  const publicUrl = useMemo(() => {
    const clean = slug.trim() || "your-business";
    return `https://${clean}.bizuply.com`;
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

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
      },
      onSelect: () => {
        setInspectorTab("design");
      },
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
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
        last.view?.el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        return;
      }

      const wrapper = editor.getWrapper();
      const components = wrapper?.components();
      const lastComponent = components?.at?.(components.length - 1);

      if (lastComponent) editor.select(lastComponent);
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

      const added = typeof target.append === "function" ? target.append(html) : editor.addComponents(html);
      selectAddedComponents(editor, added);
    });
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    // ✅ לפי הדרישה: בחירה מחליפה אוטומטית את כל האתר בלי בלבול
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
      setActivePanel(null);
    });
  };

  const handleApplyPalette = (palette: ThemePalette) => {
    setActivePalette(palette);

    runEditor((editor) => {
      editor.setStyle(createCanvasCss(palette));
      applyGlobalPaletteCss(editor, palette);
      editor.refresh();
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
    });
  };

  const handleRedo = () => {
    runEditor((editor) => {
      editor.UndoManager.redo();
    });
  };

  const handleReset = () => {
    const ok = window.confirm("למחוק את כל העיצוב הנוכחי ולהחזיר לברירת מחדל?");
    if (!ok) return;

    runEditor((editor) => {
      editor.setComponents(defaultWebsiteHtml);
      editor.setStyle(defaultCanvasCss);
      editor.select(null);
      setActivePalette(null);
      setActivePanel(null);
    });
  };

  const handleSave = async (published: boolean) => {
    if (!editorRef.current || !slugValid || saving) return;

    setSaving(true);

    try {
      const editor = editorRef.current;

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
    });
  };

  const handleSetBackgroundImage = async () => {
    const dataUrl = await pickImageFromComputer();
    if (!dataUrl) return;

    runEditor((editor) => {
      const target = getSelectedOrWrapper(editor);

      if (!target) {
        alert("בחרי בלוק / סקשן כדי להגדיר לו תמונת רקע");
        return;
      }

      target.addStyle({
        "background-image": `linear-gradient(rgba(2,6,23,0.38), rgba(2,6,23,0.38)), url("${dataUrl}")`,
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
      });
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
        animation: animation,
        "animation-duration": "0.85s",
        "animation-timing-function": "ease",
        "animation-fill-mode": "both",
      });
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
    max-width: min(620px, calc(100vw - 620px)) !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    box-shadow: 0 18px 45px rgba(15,23,42,0.20) !important;
  }

  .gjs-toolbar-item {
    min-height: 34px !important;
    padding: 0 10px !important;
    font-size: 12px !important;
    font-weight: 900 !important;
    white-space: nowrap !important;
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
