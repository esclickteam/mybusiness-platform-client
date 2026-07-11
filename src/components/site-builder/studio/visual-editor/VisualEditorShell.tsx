import React from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Monitor,
  Save,
  Smartphone,
  Tablet,
} from "lucide-react";

import VisualEditorCanvas from "./VisualEditorCanvas";
import VisualFloatingToolbar from "./VisualFloatingToolbar";
import VisualContextMenu from "./VisualContextMenu";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualEditorRuntime = ReturnType<typeof useVisualEditorState> & {
  templateName?: string;
  templateKey?: string;

  isPreviewMode?: boolean;
  togglePreviewMode?: () => void;
  setIsPreviewMode?: React.Dispatch<React.SetStateAction<boolean>>;

  isInlineEditing?: boolean;
  setIsInlineEditing?: React.Dispatch<React.SetStateAction<boolean>>;

  isSaving?: boolean;
  save?: (status?: "draft" | "published") => void | Promise<void>;
  saveDraft?: () => void | Promise<void> | Promise<any>;
  publish?: () => void | Promise<void> | Promise<any>;
};

type VisualEditorShellProps = {
  editor: VisualEditorRuntime;
  onBack?: () => void;
  className?: string;
};

const deviceOptions: Array<{
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

export default function VisualEditorShell({
  editor,
  onBack,
  className = "",
}: VisualEditorShellProps) {
  const templateName =
    editor.templateName ||
    editor.renderer?.name ||
    editor.templateKey ||
    "עורך אתר";

  const isPreviewMode = Boolean(editor.isPreviewMode);
  const isInlineEditing = Boolean(editor.isInlineEditing);
  const isSaving = Boolean(editor.isSaving);

  const hasSelectedElement = Boolean(editor.selectedElement);

  /*
    הסרגל צריך להופיע כאשר נבחר אלמנט,
    כולל בזמן עריכת טקסט ישירה.
  */
  const shouldShowFloatingToolbar =
    !isPreviewMode && hasSelectedElement;

  /*
    תפריט קליק ימני לא צריך להופיע בזמן עריכת טקסט.
  */
  const shouldShowContextMenu =
    !isPreviewMode && !isInlineEditing;

  const handleTogglePreview = () => {
    if (typeof editor.setIsInlineEditing === "function") {
      editor.setIsInlineEditing(false);
    }

    if (typeof editor.togglePreviewMode === "function") {
      editor.togglePreviewMode();
      return;
    }

    if (typeof editor.setIsPreviewMode === "function") {
      editor.setIsPreviewMode((current) => !current);
    }
  };

  const handleSaveDraft = () => {
    if (typeof editor.save === "function") {
      void editor.save("draft");
      return;
    }

    if (typeof editor.saveDraft === "function") {
      void editor.saveDraft();
    }
  };

  const handlePublish = () => {
    if (typeof editor.save === "function") {
      void editor.save("published");
      return;
    }

    if (typeof editor.publish === "function") {
      void editor.publish();
    }
  };

  return (
    <div
      data-template-visual-editor="true"
      data-visual-inline-editing={isInlineEditing ? "true" : "false"}
      className={[
        "fixed inset-0 z-[100] flex min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-950",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir="rtl"
    >
      <header className="relative z-[2147483100] flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-xl lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה
          </button>

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-black text-slate-950">
              {templateName}
            </p>

            <p className="truncate text-xs font-bold text-slate-400">
              {isInlineEditing
                ? "עריכת טקסט ישירה"
                : "Visual React Editor"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          {deviceOptions.map((device) => (
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
              <span className="hidden md:inline">{device.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePreview}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {isPreviewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}

            <span className="hidden sm:inline">
              {isPreviewMode ? "חזרה לעריכה" : "תצוגה"}
            </span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveDraft}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "שומר..." : "שמירה"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handlePublish}
            className="hidden h-11 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
          >
            פרסום
          </button>
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <section className="absolute inset-0 min-h-0 overflow-hidden">
          <VisualEditorCanvas editor={editor as any} />
        </section>

        {shouldShowFloatingToolbar ? (
          <div
            data-visual-toolbar-layer="true"
            className="pointer-events-none fixed inset-x-0 top-[72px] z-[2147483000]"
            dir="rtl"
          >
            <div className="pointer-events-auto">
              <VisualFloatingToolbar editor={editor as any} />
            </div>
          </div>
        ) : null}

        {shouldShowContextMenu ? (
          <div
            data-visual-context-menu-layer="true"
            className="pointer-events-none fixed inset-0 z-[2147482999]"
            dir="rtl"
          >
            <div className="pointer-events-auto">
              <VisualContextMenu editor={editor as any} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}