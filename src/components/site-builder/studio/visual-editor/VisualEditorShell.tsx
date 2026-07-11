import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpToLine,
  Box,
  Check,
  Cloud,
  Eye,
  EyeOff,
  ImagePlus,
  Layers3,
  Minus,
  Monitor,
  MousePointer2,
  Plus,
  RectangleHorizontal,
  Redo2,
  RefreshCw,
  Rows3,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  Type,
  Undo2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";

import VisualEditorCanvas from "./VisualEditorCanvas";
import VisualFloatingToolbar from "./VisualFloatingToolbar";
import VisualContextMenu from "./VisualContextMenu";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualEditorRuntime = ReturnType<typeof useVisualEditorState> & {
  templateName?: string;
  templateKey?: string;

  isPreviewMode: boolean;
  setIsPreviewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  togglePreviewMode?: () => void;

  isInlineEditing?: boolean;
  setIsInlineEditing?: React.Dispatch<React.SetStateAction<boolean>>;

  isSaving: boolean;
  isUploadingMedia?: boolean;
  lastSavedAt?: string;
  saveError?: string;

  save?: (
    status?: "draft" | "published",
  ) => void | Promise<void> | Promise<any>;

  saveDraft?: () => void | Promise<void> | Promise<any>;
  publish?: () => void | Promise<void> | Promise<any>;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
};

type VisualEditorShellProps = {
  editor: VisualEditorRuntime;
  onBack?: () => void;
  className?: string;
};

const DEVICE_OPTIONS: Array<{
  value: VisualDeviceMode;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: "desktop",
    label: "דסקטופ",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    value: "tablet",
    label: "טאבלט",
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    value: "mobile",
    label: "מובייל",
    icon: <Smartphone className="h-4 w-4" />,
  },
];

function formatSavedTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type VisualAddLayersPanelProps = {
  editor: any;
  mode: "add" | "layers" | null;
  onClose: () => void;
};

type LayerItem = {
  id: string;
  label: string;
  type: string;
  zIndex: number;
  hidden?: boolean;
  locked?: boolean;
  inserted?: boolean;
};

function AddAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-300 hover:bg-violet-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-950">
          {title}
        </span>
        <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}

function VisualAddLayersPanel({
  editor,
  mode,
  onClose,
}: VisualAddLayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([]);

  const selectedElementId = String(
    editor?.selectedElement?.id || "",
  );

  const refreshLayers = () => {
    const next =
      typeof editor?.getLayerItems === "function"
        ? editor.getLayerItems()
        : [];

    setLayers(Array.isArray(next) ? next : []);
  };

  useEffect(() => {
    if (mode !== "layers") return;

    refreshLayers();

    const timer = window.setInterval(refreshLayers, 900);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    mode,
    editor?.data,
    editor?.selectedElement?.id,
  ]);

  const selectedLayer = useMemo(
    () =>
      layers.find(
        (item) => item.id === selectedElementId,
      ) || null,
    [layers, selectedElementId],
  );

  if (!mode) return null;

  const closeAfter = (action: () => void | Promise<any>) => {
    void Promise.resolve(action()).finally(() => {
      window.setTimeout(refreshLayers, 50);
    });
  };

  return (
    <aside
      data-editor-only="true"
      data-bizuply-editor-only="true"
      className="fixed bottom-4 right-4 top-[88px] z-[2147483200] flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
      dir="rtl"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            {mode === "add" ? (
              <Plus className="h-5 w-5" />
            ) : (
              <Layers3 className="h-5 w-5" />
            )}
          </span>

          <div>
            <h2 className="text-base font-black text-slate-950">
              {mode === "add"
                ? "הוספת אלמנטים"
                : "שכבות"}
            </h2>
            <p className="text-xs font-bold text-slate-400">
              {mode === "add"
                ? "הוספה לסקשן המסומן"
                : "בחירה וסידור עומק"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {mode === "add" ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-6 text-slate-500">
            האלמנט נוסף לסקשן המסומן וניתן לגרור אותו
            חופשי, לשנות גודל ולהעביר קדימה או אחורה.
          </div>

          <AddAction
            icon={<Type className="h-5 w-5" />}
            title="טקסט"
            description="כותרת או כיתוב חופשי מעל תמונה וסרטון"
            onClick={() => closeAfter(() => editor?.addText?.())}
          />

          <AddAction
            icon={<RectangleHorizontal className="h-5 w-5" />}
            title="כפתור"
            description="כפתור עצמאי שניתן לגרירה ועריכת קישור"
            onClick={() => closeAfter(() => editor?.addButton?.())}
          />

          <AddAction
            icon={<ImagePlus className="h-5 w-5" />}
            title="תמונה"
            description="מוסיף תמונה חדשה ופותח מיד בחירת קובץ"
            onClick={() => closeAfter(() => editor?.addImage?.())}
          />

          <AddAction
            icon={<Video className="h-5 w-5" />}
            title="סרטון"
            description="מוסיף סרטון חדש עם הפעלה אוטומטית"
            onClick={() => closeAfter(() => editor?.addVideo?.())}
          />

          <AddAction
            icon={<Box className="h-5 w-5" />}
            title="קופסה / רקע"
            description="שכבת רקע שאפשר לשים מאחורי טקסט ומדיה"
            onClick={() => closeAfter(() => editor?.addBox?.())}
          />

          <AddAction
            icon={<Minus className="h-5 w-5" />}
            title="קו מפריד"
            description="קו עצמאי שאפשר להזיז, לסובב ולצבוע"
            onClick={() => closeAfter(() => editor?.addDivider?.())}
          />

          <div className="my-4 h-px bg-slate-200" />

          <AddAction
            icon={<Rows3 className="h-5 w-5" />}
            title="סקשן מעל"
            description="מוסיף אזור חדש לפני הסקשן המסומן"
            onClick={() =>
              closeAfter(() =>
                editor?.addSection?.("before"),
              )
            }
          />

          <AddAction
            icon={<Rows3 className="h-5 w-5" />}
            title="סקשן מתחת"
            description="מוסיף אזור חדש אחרי הסקשן המסומן"
            onClick={() =>
              closeAfter(() =>
                editor?.addSection?.("after"),
              )
            }
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="text-xs font-black text-slate-500">
              {layers.length} שכבות
            </div>

            <button
              type="button"
              onClick={refreshLayers}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              רענון
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {layers.map((item) => {
              const active = item.id === selectedElementId;

              return (
                <div
                  key={item.id}
                  className={[
                    "rounded-2xl border p-2 transition",
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => {
                      editor?.selectByElementId?.(item.id);
                      window.setTimeout(refreshLayers, 0);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl p-2 text-right"
                  >
                    <MousePointer2 className="h-4 w-4 shrink-0 text-violet-600" />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-slate-900">
                        {item.label || item.type}
                      </span>

                      <span className="block truncate text-[11px] font-bold text-slate-400">
                        {item.type} · שכבה {item.zIndex}
                      </span>
                    </span>
                  </button>

                  {active ? (
                    <div className="grid grid-cols-4 gap-1 border-t border-violet-100 pt-2">
                      <button
                        type="button"
                        title="לחזית"
                        onClick={() => {
                          editor?.bringToFront?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowUpToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="לרקע"
                        onClick={() => {
                          editor?.sendToBack?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title={item.hidden ? "הצגה" : "הסתרה"}
                        onClick={() => {
                          editor?.toggleElementHidden?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-white text-slate-600"
                      >
                        {item.hidden ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        title="מחיקה"
                        onClick={() => {
                          editor?.deleteElement?.(item.id);
                          window.setTimeout(refreshLayers, 30);
                        }}
                        className="flex h-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {!layers.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-400">
                לא נמצאו שכבות בעמוד.
              </div>
            ) : null}
          </div>

          {selectedLayer ? (
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
              מסומן: {selectedLayer.label}
            </div>
          ) : null}
        </div>
      )}
    </aside>
  );
}

export default function VisualEditorShell({
  editor,
  onBack,
  className = "",
}: VisualEditorShellProps) {
  const [actionError, setActionError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [sidePanelMode, setSidePanelMode] = useState<
    "add" | "layers" | null
  >(null);

  const templateName =
    editor.templateName ||
    editor.renderer?.name ||
    editor.templateKey ||
    "עורך אתר";

  const isPreviewMode = Boolean(editor.isPreviewMode);
  const isInlineEditing = Boolean(editor.isInlineEditing);
  const isSaving = Boolean(editor.isSaving);
  const isUploadingMedia = Boolean(editor.isUploadingMedia);

  const hasSelectedElement = Boolean(editor.selectedElement);

  const shouldShowFloatingToolbar =
    !isPreviewMode && hasSelectedElement;

  const shouldShowContextMenu =
    !isPreviewMode && !isInlineEditing;

  const busy = isSaving || isUploadingMedia;

  useEffect(() => {
    if (!editor.saveError) {
      setActionError("");
      return;
    }

    setActionError(editor.saveError);
  }, [editor.saveError]);

  useEffect(() => {
    if (!editor.lastSavedAt) return;

    const savedTime = formatSavedTime(editor.lastSavedAt);

    if (!savedTime) return;

    setSavedMessage(`נשמר ב־${savedTime}`);

    const timer = window.setTimeout(() => {
      setSavedMessage("");
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [editor.lastSavedAt]);

  async function runAction(
    action: () => void | Promise<void> | Promise<any>,
  ) {
    setActionError("");

    try {
      await action();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "הפעולה נכשלה",
      );
    }
  }

  function handleTogglePreview() {
    editor.setIsInlineEditing?.(false);
    setSidePanelMode(null);

    if (typeof editor.togglePreviewMode === "function") {
      editor.togglePreviewMode();
      return;
    }

    editor.setIsPreviewMode?.((current: boolean) => !current);
  }

  function handleSaveDraft() {
    void runAction(async () => {
      if (typeof editor.save === "function") {
        await editor.save("draft");
        return;
      }

      if (typeof editor.saveDraft === "function") {
        await editor.saveDraft();
        return;
      }

      throw new Error("פעולת השמירה אינה מחוברת לעורך.");
    });
  }

  function handlePublish() {
    void runAction(async () => {
      if (typeof editor.save === "function") {
        await editor.save("published");
        return;
      }

      if (typeof editor.publish === "function") {
        await editor.publish();
        return;
      }

      throw new Error("פעולת הפרסום אינה מחוברת לעורך.");
    });
  }

  function handleUndo() {
    if (busy || !editor.canUndo) return;

    editor.undo?.();
  }

  function handleRedo() {
    if (busy || !editor.canRedo) return;

    editor.redo?.();
  }

  return (
    <div
      data-template-visual-editor="true"
      data-visual-inline-editing={
        isInlineEditing ? "true" : "false"
      }
      className={[
        "fixed inset-0 z-[100] flex min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-950",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir="rtl"
    >
      <header className="relative z-[2147483100] flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur-xl lg:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 lg:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">חזרה</span>
          </button>

          <div className="hidden min-w-0 lg:block">
            <p className="max-w-[220px] truncate text-sm font-black text-slate-950">
              {templateName}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-slate-400">
              {isUploadingMedia ? (
                <>
                  <UploadCloud className="h-3.5 w-3.5 animate-pulse text-violet-500" />
                  מעלה מדיה
                </>
              ) : savedMessage ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {savedMessage}
                </>
              ) : (
                <>
                  <Cloud className="h-3.5 w-3.5" />
                  Visual React Editor
                </>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 xl:flex">
            <button
              type="button"
              title="ביטול"
              disabled={!editor.canUndo || busy}
              onClick={handleUndo}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Undo2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              title="ביצוע מחדש"
              disabled={!editor.canRedo || busy}
              onClick={handleRedo}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          {DEVICE_OPTIONS.map((device) => (
            <button
              key={device.value}
              type="button"
              title={device.label}
              onClick={() => editor.setDeviceMode(device.value)}
              className={[
                "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-black transition",
                editor.deviceMode === device.value
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              ].join(" ")}
            >
              {device.icon}

              <span className="hidden 2xl:inline">
                {device.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isPreviewMode ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setSidePanelMode((current) =>
                    current === "add" ? null : "add",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-black shadow-sm transition lg:px-4",
                  sidePanelMode === "add"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xl:inline">
                  הוספה
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSidePanelMode((current) =>
                    current === "layers" ? null : "layers",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-black shadow-sm transition lg:px-4",
                  sidePanelMode === "layers"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <Layers3 className="h-4 w-4" />
                <span className="hidden xl:inline">
                  שכבות
                </span>
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleTogglePreview}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 lg:px-4"
          >
            {isPreviewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}

            <span className="hidden md:inline">
              {isPreviewMode ? "חזרה לעריכה" : "תצוגה"}
            </span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handleSaveDraft}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 lg:px-5"
          >
            <Save className="h-4 w-4" />

            <span className="hidden sm:inline">
              {isUploadingMedia
                ? "מעלה..."
                : isSaving
                  ? "שומר..."
                  : "שמירה"}
            </span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handlePublish}
            className="hidden h-11 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
          >
            פרסום
          </button>
        </div>
      </header>

      {actionError ? (
        <div className="relative z-[2147483099] flex h-11 shrink-0 items-center justify-center border-b border-rose-200 bg-rose-50 px-4 text-center text-sm font-black text-rose-700">
          {actionError}
        </div>
      ) : null}

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <section className="absolute inset-0 min-h-0 overflow-hidden">
          <VisualEditorCanvas editor={editor as any} />
        </section>

        {shouldShowFloatingToolbar ? (
          <VisualFloatingToolbar editor={editor as any} />
        ) : null}

        {shouldShowContextMenu ? (
          <VisualContextMenu editor={editor as any} />
        ) : null}

        {!isPreviewMode ? (
          <VisualAddLayersPanel
            editor={editor as any}
            mode={sidePanelMode}
            onClose={() => setSidePanelMode(null)}
          />
        ) : null}
      </main>
    </div>
  );
}
