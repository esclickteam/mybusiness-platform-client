import React, { useEffect, useMemo, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

import presetWebpage from "grapesjs-preset-webpage";
import basicBlocks from "grapesjs-blocks-basic";

import { registerBizuplyBlocks } from "./grapesBlocks";
import { bizuplyCanvasCss, defaultBizuplyHtml } from "./grapesTheme";
import { BizuplySitePayload, BizuplyWebsiteStudioProps } from "./types";

type LeftPanel = "blocks" | "layers" | "assets";
type RightPanel = "styles" | "traits";

export default function BizuplyWebsiteStudio({
  businessId,
  initialSlug = "hadar-beauty",
  onSave,
}: BizuplyWebsiteStudioProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);

  const editorRef = useRef<Editor | null>(null);

  const [leftPanel, setLeftPanel] = useState<LeftPanel>("blocks");
  const [rightPanel, setRightPanel] = useState<RightPanel>("styles");
  const [device, setDevice] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [slug, setSlug] = useState(initialSlug);
  const [savedAt, setSavedAt] = useState("");
  const [ready, setReady] = useState(false);

  const publicUrl = useMemo(() => {
    const clean = slug.trim() || "your-business";
    return `https://${clean}.bizuply.com`;
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  useEffect(() => {
    if (!editorContainerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
  container: editorContainerRef.current,
  height: "100%",
  width: "100%",
  fromElement: false,
  storageManager: false,
  selectorManager: {
    componentFirst: true,
  },
      assetManager: {
        upload: false,
        assets: [
          {
            src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
            name: "Beauty hero",
          },
          {
            src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90",
            name: "Beauty gallery",
          },
          {
            src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90",
            name: "Spa",
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "",
          },
          {
            name: "Tablet",
            width: "768px",
            widthMedia: "992px",
          },
          {
            name: "Mobile",
            width: "390px",
            widthMedia: "480px",
          },
        ],
      },
      panels: {
        defaults: [],
      },
      blockManager: {
        appendTo: blocksRef.current || undefined,
      },
      layerManager: {
        appendTo: layersRef.current || undefined,
      },
      styleManager: {
        appendTo: stylesRef.current || undefined,
        sectors: [
          {
            name: "Layout",
            open: true,
            properties: [
              "display",
              "position",
              "top",
              "right",
              "bottom",
              "left",
              "width",
              "height",
              "min-height",
              "max-width",
              "margin",
              "padding",
              "z-index",
            ],
          },
          {
            name: "Typography",
            open: true,
            properties: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "color",
              "line-height",
              "text-align",
              "text-decoration",
            ],
          },
          {
            name: "Background",
            open: true,
            properties: [
              "background-color",
              "background",
              "background-image",
              "background-size",
              "background-position",
              "opacity",
            ],
          },
          {
            name: "Border & Radius",
            open: true,
            properties: [
              "border",
              "border-radius",
              "box-shadow",
            ],
          },
          {
            name: "Effects",
            open: false,
            properties: [
              "transform",
              "transition",
              "filter",
              "backdrop-filter",
            ],
          },
        ],
      },
      traitManager: {
        appendTo: traitsRef.current || undefined,
      },
      plugins: [presetWebpage, basicBlocks],
      pluginsOpts: {
        [presetWebpage as unknown as string]: {},
        [basicBlocks as unknown as string]: {
          flexGrid: true,
        },
      },
    });

    editorRef.current = editor;

    editor.on("load", () => {
      registerBizuplyBlocks(editor);

      editor.setComponents(defaultBizuplyHtml);
      editor.addStyle(bizuplyCanvasCss);

      editor.Css.addRules(`
        .gjs-selected {
          outline: 3px solid #7c3aed !important;
          outline-offset: 2px !important;
        }
      `);

      setReady(true);
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const runEditor = (callback: (editor: Editor) => void) => {
    if (!editorRef.current) return;
    callback(editorRef.current);
  };

  const changeDevice = (nextDevice: "Desktop" | "Tablet" | "Mobile") => {
    setDevice(nextDevice);
    runEditor((editor) => editor.setDevice(nextDevice));
  };

  const handleSave = async (published: boolean) => {
    if (!slugValid) return;

    await runEditor(async (editor) => {
      const payload: BizuplySitePayload = {
        slug,
        projectData: editor.getProjectData(),
        html: editor.getHtml(),
        css: editor.getCss(),
        published,
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

      console.log("BIZUPLY WEBSITE SAVED:", payload);
    });
  };

  const handlePreview = () => {
    runEditor((editor) => editor.runCommand("preview"));
  };

  const handleOpenAssets = () => {
    runEditor((editor) => editor.runCommand("open-assets"));
  };

  const handleUndo = () => {
    runEditor((editor) => editor.UndoManager.undo());
  };

  const handleRedo = () => {
    runEditor((editor) => editor.UndoManager.redo());
  };

  const handleClear = () => {
    const ok = window.confirm("למחוק את כל העיצוב הנוכחי?");
    if (!ok) return;

    runEditor((editor) => {
      editor.setComponents(defaultBizuplyHtml);
      editor.setStyle(bizuplyCanvasCss);
    });
  };

  return (
    <div
      dir="ltr"
      className="h-screen w-full overflow-hidden bg-[#eef1f7] text-slate-950"
    >
      <div className="flex h-screen flex-col">
        <header className="z-40 flex h-[58px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-fuchsia-600 text-sm font-black text-white shadow-lg shadow-violet-200">
              B
            </div>

            <div>
              <p className="text-sm font-black leading-none text-slate-950">
                Bizuply Website Studio
              </p>
              <p className="mt-1 text-[11px] font-bold leading-none text-slate-400">
                Wix-style no-code editor
              </p>
            </div>
          </div>

          <div className="flex min-w-[420px] items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <span className="px-3 text-xs font-black text-slate-400">URL</span>
            <input
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value.toLowerCase().trim())
              }
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-black text-slate-800 outline-none"
              dir="ltr"
              placeholder="hadar-beauty"
            />
            <span className="border-l border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-500">
              .bizuply.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ToolbarButton onClick={handleUndo}>Undo</ToolbarButton>
            <ToolbarButton onClick={handleRedo}>Redo</ToolbarButton>

            <div className="mx-1 h-7 w-px bg-slate-200" />

            <DeviceButton
              active={device === "Desktop"}
              onClick={() => changeDevice("Desktop")}
            >
              Desktop
            </DeviceButton>
            <DeviceButton
              active={device === "Tablet"}
              onClick={() => changeDevice("Tablet")}
            >
              Tablet
            </DeviceButton>
            <DeviceButton
              active={device === "Mobile"}
              onClick={() => changeDevice("Mobile")}
            >
              Mobile
            </DeviceButton>

            <div className="mx-1 h-7 w-px bg-slate-200" />

            <ToolbarButton onClick={handleOpenAssets}>Assets</ToolbarButton>
            <ToolbarButton onClick={handlePreview}>Preview</ToolbarButton>
            <ToolbarButton onClick={handleClear}>Reset</ToolbarButton>

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={!ready || !slugValid}
              className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 transition hover:bg-violet-100 disabled:opacity-40"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={!ready || !slugValid}
              className="rounded-xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              Publish
            </button>
          </div>
        </header>

        {!slugValid && (
          <div className="z-30 border-b border-rose-100 bg-rose-50 px-4 py-2 text-center text-xs font-black text-rose-600">
            מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה: hadar-beauty
          </div>
        )}

        {savedAt && (
          <div className="z-30 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-center text-xs font-black text-emerald-700">
            נשמר בהצלחה בשעה {savedAt} · {publicUrl}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[330px_minmax(0,1fr)_350px]">
          <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-12 shrink-0 border-b border-slate-200">
              <PanelTab
                active={leftPanel === "blocks"}
                onClick={() => setLeftPanel("blocks")}
              >
                Add
              </PanelTab>
              <PanelTab
                active={leftPanel === "layers"}
                onClick={() => setLeftPanel("layers")}
              >
                Layers
              </PanelTab>
              <PanelTab
                active={leftPanel === "assets"}
                onClick={() => setLeftPanel("assets")}
              >
                Assets
              </PanelTab>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className={leftPanel === "blocks" ? "block" : "hidden"}>
                <PanelTitle
                  title="Add Elements"
                  subtitle="גררי אלמנטים ובלוקים לתוך האתר"
                />
                <div ref={blocksRef} className="gjs-blocks-container" />
              </div>

              <div className={leftPanel === "layers" ? "block" : "hidden"}>
                <PanelTitle
                  title="Layers"
                  subtitle="ניהול שכבות וסדר האלמנטים באתר"
                />
                <div ref={layersRef} />
              </div>

              <div className={leftPanel === "assets" ? "block" : "hidden"}>
                <PanelTitle
                  title="Assets"
                  subtitle="תמונות וקבצים"
                />
                <button
                  type="button"
                  onClick={handleOpenAssets}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  Open Asset Manager
                </button>
              </div>
            </div>
          </aside>

          <main className="relative min-h-0 bg-[#dfe4ee]">
            <div ref={editorContainerRef} className="h-full w-full" />
          </main>

          <aside className="flex min-h-0 flex-col border-l border-slate-200 bg-white">
            <div className="flex h-12 shrink-0 border-b border-slate-200">
              <PanelTab
                active={rightPanel === "styles"}
                onClick={() => setRightPanel("styles")}
              >
                Style
              </PanelTab>
              <PanelTab
                active={rightPanel === "traits"}
                onClick={() => setRightPanel("traits")}
              >
                Settings
              </PanelTab>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className={rightPanel === "styles" ? "block" : "hidden"}>
                <PanelTitle
                  title="Design"
                  subtitle="צבעים, גדלים, פינות, ריווח, צללים ואפקטים"
                />
                <div ref={stylesRef} />
              </div>

              <div className={rightPanel === "traits" ? "block" : "hidden"}>
                <PanelTitle
                  title="Element Settings"
                  subtitle="קישורים, טקסט חלופי, שדות ופעולות"
                />
                <div ref={traitsRef} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
    </button>
  );
}

function DeviceButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-2 text-xs font-black transition",
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTab({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 text-xs font-black transition",
        active
          ? "border-b-2 border-violet-700 bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}