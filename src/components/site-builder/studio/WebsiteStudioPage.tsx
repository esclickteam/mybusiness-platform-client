import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "grapesjs";

import type {
  DeviceMode,
  InspectorTab,
  PageTemplate,
  SiteSavePayload,
  StudioPanel,
  ThemePalette,
  WebsiteStudioPageProps,
} from "./types";

import StudioTopbar from "./StudioTopbar";
import StudioSidebar from "./StudioSidebar";
import StudioCanvas from "./StudioCanvas";
import StudioInspector from "./StudioInspector";

import { initBizuplyEditor } from "./grapes/initEditor";
import { createCanvasCss, defaultCanvasCss, defaultWebsiteHtml } from "./grapes/canvasTheme";

export default function WebsiteStudioPage({
  businessId,
  initialSlug = "hadar-beauty",
  onSave,
}: WebsiteStudioPageProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const [activePanel, setActivePanel] = useState<StudioPanel>("templates");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("design");
  const [device, setDevice] = useState<DeviceMode>("Desktop");
  const [slug, setSlug] = useState(initialSlug);
  const [ready, setReady] = useState(false);
  const [savedAt, setSavedAt] = useState("");

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
    };
  }, []);

  const runEditor = (callback: (editor: Editor) => void) => {
    if (!editorRef.current) return;
    callback(editorRef.current);
  };

  const handleSetDevice = (nextDevice: DeviceMode) => {
    setDevice(nextDevice);
    runEditor((editor) => editor.setDevice(nextDevice));
  };

  const handleAddHtml = (html: string) => {
    runEditor((editor) => {
      editor.addComponents(html);
    });
  };

  const handleApplyTemplate = (template: PageTemplate) => {
    const ok = window.confirm("להחליף את התבנית הנוכחית?");
    if (!ok) return;

    runEditor((editor) => {
      editor.setComponents(template.html);
      editor.setStyle(defaultCanvasCss);
    });
  };

  const handleApplyPalette = (palette: ThemePalette) => {
    runEditor((editor) => {
      editor.setStyle(createCanvasCss(palette));
    });
  };

  const handleOpenMedia = () => {
    runEditor((editor) => editor.runCommand("open-assets"));
  };

  const handlePreview = () => {
    runEditor((editor) => editor.runCommand("preview"));
  };

  const handleUndo = () => {
    runEditor((editor) => editor.UndoManager.undo());
  };

  const handleRedo = () => {
    runEditor((editor) => editor.UndoManager.redo());
  };

  const handleReset = () => {
    const ok = window.confirm("למחוק את כל העיצוב הנוכחי ולהחזיר לברירת מחדל?");
    if (!ok) return;

    runEditor((editor) => {
      editor.setComponents(defaultWebsiteHtml);
      editor.setStyle(defaultCanvasCss);
    });
  };

  const handleSave = async (published: boolean) => {
    if (!editorRef.current || !slugValid) return;

    const editor = editorRef.current;

    const payload: SiteSavePayload = {
      slug,
      published,
      html: editor.getHtml(),
      css: editor.getCss(),
      projectData: editor.getProjectData(),
      updatedAt: new Date().toISOString(),
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
  };

  const handleDuplicateSelected = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();
      if (!selected) return;
      selected.clone();
    });
  };

  const handleDeleteSelected = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();
      if (!selected) return;
      selected.remove();
    });
  };

  const handleBringForward = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();
      if (!selected) return;

      const current = selected.getStyle();
      const zIndex = Number(current["z-index"] || 1);

      selected.addStyle({
        "z-index": zIndex + 1,
      });
    });
  };

  const handleSendBackward = () => {
    runEditor((editor) => {
      const selected = editor.getSelected();
      if (!selected) return;

      const current = selected.getStyle();
      const zIndex = Number(current["z-index"] || 1);

      selected.addStyle({
        "z-index": Math.max(0, zIndex - 1),
      });
    });
  };

  const handleSetBackgroundImage = () => {
    const url = window.prompt("הדביקי כתובת תמונה לרקע הבלוק:");
    if (!url) return;

    runEditor((editor) => {
      const selected = editor.getSelected();
      if (!selected) return;

      selected.addStyle({
        "background-image": `linear-gradient(rgba(2,6,23,0.35), rgba(2,6,23,0.35)), url('${url}')`,
        "background-size": "cover",
        "background-position": "center",
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
          ready={ready}
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

        {savedAt && (
          <div className="z-40 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-center text-xs font-black text-emerald-700">
            נשמר בהצלחה בשעה {savedAt} · {publicUrl}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[522px_minmax(0,1fr)_390px]">
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
    border-radius: 18px !important;
    overflow: hidden !important;
    box-shadow: 0 18px 45px rgba(15,23,42,0.20) !important;
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
    border-radius: 28px !important;
    overflow: hidden !important;
  }

  .gjs-am-assets-cont {
    background: #fff !important;
  }
`;