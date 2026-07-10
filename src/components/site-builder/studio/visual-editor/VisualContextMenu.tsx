import React from "react";
import {
  Copy,
  Link2,
  MoveDown,
  MoveUp,
  Trash2,
  X,
} from "lucide-react";

import type { VisualEditorController } from "./visualEditorTypes";

type VisualContextMenuProps = {
  editor: VisualEditorController;
};

export default function VisualContextMenu({
  editor,
}: VisualContextMenuProps) {
  const menu = editor.contextMenu;

  if (!menu?.open) return null;

  const elementId = menu.elementId || editor.selectedElement?.id || "";

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-right text-sm font-black text-slate-700 transition hover:bg-slate-100";

  return (
    <div
      className="fixed z-[150] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.22)]"
      style={{
        top: menu.y,
        left: menu.x,
      }}
      dir="rtl"
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button
        type="button"
        className={itemClass}
        onClick={() => {
          editor.duplicateSelected?.();
          editor.closeContextMenu?.();
        }}
      >
        <Copy className="h-4 w-4" />
        שכפול
      </button>

      <button
        type="button"
        className={itemClass}
        onClick={() => {
          if (elementId) editor.openLinkSettings?.(elementId);
          editor.closeContextMenu?.();
        }}
      >
        <Link2 className="h-4 w-4" />
        קישור
      </button>

      <button
        type="button"
        className={itemClass}
        onClick={() => {
          if (elementId) editor.bringForward?.(elementId);
          editor.closeContextMenu?.();
        }}
      >
        <MoveUp className="h-4 w-4" />
        שכבה קדימה
      </button>

      <button
        type="button"
        className={itemClass}
        onClick={() => {
          if (elementId) editor.sendBackward?.(elementId);
          editor.closeContextMenu?.();
        }}
      >
        <MoveDown className="h-4 w-4" />
        שכבה אחורה
      </button>

      <div className="my-1 h-px bg-slate-100" />

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-right text-sm font-black text-rose-600 transition hover:bg-rose-50"
        onClick={() => {
          editor.deleteSelected?.();
          editor.closeContextMenu?.();
        }}
      >
        <Trash2 className="h-4 w-4" />
        מחיקה
      </button>

      <button
        type="button"
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-right text-sm font-black text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        onClick={editor.closeContextMenu}
      >
        <X className="h-4 w-4" />
        סגירה
      </button>
    </div>
  );
}
