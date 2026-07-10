import React from "react";
import {
  Copy,
  Image as ImageIcon,
  Link2,
  MoveDown,
  MoveUp,
  Trash2,
  Type,
  X,
} from "lucide-react";

import type { VisualEditorController } from "./visualEditorTypes";

type VisualFloatingToolbarProps = {
  editor: VisualEditorController;
};

export default function VisualFloatingToolbar({
  editor,
}: VisualFloatingToolbarProps) {
  const element = editor.selectedElement;

  if (!element || !editor.selectionBox) return null;

  const top = Math.max(12, editor.selectionBox.top - 54);
  const left = Math.max(12, editor.selectionBox.left);

  return (
    <div
      className="pointer-events-auto absolute z-40 flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      style={{
        top,
        left,
      }}
      dir="rtl"
    >
      <div className="mr-2 max-w-[150px] truncate px-2 text-xs font-black text-slate-500">
        {element.label || "אלמנט"}
      </div>

      {element.type === "text" || element.type === "button" ? (
        <button
          type="button"
          title="עריכת טקסט"
          onClick={() => editor.startInlineTextEdit?.(element.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <Type className="h-4 w-4" />
        </button>
      ) : null}

      {element.type === "image" ? (
        <button
          type="button"
          title="החלפת תמונה / וידאו"
          onClick={() => editor.openMediaPicker?.(element.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      ) : null}

      <button
        type="button"
        title="קישור"
        onClick={() => editor.openLinkSettings?.(element.id)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <Link2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכבה קדימה"
        onClick={() => editor.bringForward?.(element.id)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <MoveUp className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכבה אחורה"
        onClick={() => editor.sendBackward?.(element.id)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <MoveDown className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכפול"
        onClick={() => editor.duplicateSelected?.()}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <Copy className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="מחיקה"
        onClick={() => editor.deleteSelected?.()}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 transition hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="סגירה"
        onClick={editor.clearSelection}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
