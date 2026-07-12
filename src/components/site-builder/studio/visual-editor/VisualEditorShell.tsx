import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Cloud,
  Eye,
  EyeOff,
  Layers3,
  Code2,
  Monitor,
  Plus,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  UploadCloud,
} from "lucide-react";

import VisualEditorCanvas from "./VisualEditorCanvas";
import VisualFloatingToolbar from "./VisualFloatingToolbar";
import VisualContextMenu from "./VisualContextMenu";
import VisualAddLayersPanel from "./VisualAddLayersPanel";
import VisualLibraryPanel from "./library/VisualLibraryPanel";

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

export default function VisualEditorShell({
  editor,
  onBack,
  className = "",
}: VisualEditorShellProps) {
  const [actionError, setActionError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [sidePanelMode, setSidePanelMode] = useState<
    "library" | "layers" | "code" | null
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

    editor.setIsPreviewMode?.((current) => !current);
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
                    current === "library" ? null : "library",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-black shadow-sm transition lg:px-4",
                  sidePanelMode === "library"
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

              <button
                type="button"
                onClick={() =>
                  setSidePanelMode((current) =>
                    current === "code" ? null : "code",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-black shadow-sm transition lg:px-4",
                  sidePanelMode === "code"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <Code2 className="h-4 w-4" />
                <span className="hidden xl:inline">
                  קוד מותאם
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
          <>
            <VisualLibraryPanel
              editor={editor as any}
              open={sidePanelMode === "library"}
              onClose={() => setSidePanelMode(null)}
            />

            <VisualAddLayersPanel
              editor={editor as any}
              mode={
                sidePanelMode === "layers" ||
                sidePanelMode === "code"
                  ? sidePanelMode
                  : null
              }
              onClose={() => setSidePanelMode(null)}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
