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

import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualFloatingToolbarProps = {
  editor: ReturnType<typeof useVisualEditorState>;
};

function getFallbackSelectionBox(editorAny: any) {
  const elementId = editorAny.selectedElement?.id;
  const canvas = editorAny.canvasRef?.current as HTMLElement | null;

  if (!elementId || !canvas) return null;

  const safeId = String(elementId)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  const node = canvas.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeId}"]`,
  );

  if (!node) return null;

  const nodeRect = node.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  return {
    top: nodeRect.top - canvasRect.top + canvas.scrollTop,
    left: nodeRect.left - canvasRect.left + canvas.scrollLeft,
    width: nodeRect.width,
    height: nodeRect.height,
  };
}

export default function VisualFloatingToolbar({
  editor,
}: VisualFloatingToolbarProps) {
  const editorAny = editor as any;
  const element = editorAny.selectedElement;

  const selectionBox =
    editorAny.selectionBox ||
    editorAny.selectedElement?.rect ||
    getFallbackSelectionBox(editorAny);

  if (!element || !selectionBox) return null;

  const top = Math.max(12, Number(selectionBox.top || 0) - 54);
  const left = Math.max(12, Number(selectionBox.left || 0));

  const elementType = String(element.type || "");
  const elementId = String(element.id || "");

  const canEditText = elementType === "text" || elementType === "button";
  const canEditMedia = elementType === "image";

  const handleEditText = () => {
    if (!elementId) return;

    if (typeof editorAny.startInlineTextEdit === "function") {
      editorAny.startInlineTextEdit(elementId);
      return;
    }

    const currentText = String(element.text || "");
    const nextText = window.prompt("עריכת טקסט", currentText);

    if (nextText !== null && typeof editorAny.updateText === "function") {
      editorAny.updateText(elementId, nextText);
    }
  };

  const handleEditMedia = () => {
    if (!elementId) return;

    if (typeof editorAny.openMediaPicker === "function") {
      editorAny.openMediaPicker(elementId);
      return;
    }

    const currentSrc = String(element.src || "");
    const nextSrc = window.prompt("הדביקי קישור לתמונה / וידאו", currentSrc);

    if (nextSrc !== null && nextSrc.trim() && typeof editorAny.updateImage === "function") {
      editorAny.updateImage(elementId, {
        src: nextSrc.trim(),
      });
    }
  };

  const handleEditLink = () => {
    if (!elementId) return;

    if (typeof editorAny.openLinkSettings === "function") {
      editorAny.openLinkSettings(elementId);
      return;
    }

    const currentHref = String(
      element.href ||
        element.linkValue ||
        "",
    );

    const nextHref = window.prompt("קישור", currentHref);

    if (nextHref !== null && typeof editorAny.updateLink === "function") {
      editorAny.updateLink(elementId, {
        href: nextHref.trim(),
        target: "_self",
      });
    }
  };

  const handleBringForward = () => {
    if (!elementId) return;

    if (typeof editorAny.bringForward === "function") {
      editorAny.bringForward(elementId);
    }
  };

  const handleSendBackward = () => {
    if (!elementId) return;

    if (typeof editorAny.sendBackward === "function") {
      editorAny.sendBackward(elementId);
    }
  };

  const handleDuplicate = () => {
    if (typeof editorAny.duplicateSelected === "function") {
      editorAny.duplicateSelected();
    }
  };

  const handleDelete = () => {
    if (typeof editorAny.deleteSelected === "function") {
      editorAny.deleteSelected();
      return;
    }

    if (typeof editorAny.deleteElement === "function") {
      editorAny.deleteElement(elementId);
    }
  };

  const handleClearSelection = () => {
    if (typeof editorAny.clearSelection === "function") {
      editorAny.clearSelection();
    }
  };

  return (
    <div
      className="pointer-events-auto absolute z-[80] flex max-w-[calc(100vw-32px)] items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      style={{
        top,
        left,
      }}
      dir="rtl"
    >
      <div className="mr-2 max-w-[150px] truncate px-2 text-xs font-black text-slate-500">
        {element.label || elementId || "אלמנט"}
      </div>

      {canEditText ? (
        <button
          type="button"
          title="עריכת טקסט"
          onClick={handleEditText}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <Type className="h-4 w-4" />
        </button>
      ) : null}

      {canEditMedia ? (
        <button
          type="button"
          title="החלפת תמונה / וידאו"
          onClick={handleEditMedia}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      ) : null}

      <button
        type="button"
        title="קישור"
        onClick={handleEditLink}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <Link2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכבה קדימה"
        onClick={handleBringForward}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <MoveUp className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכבה אחורה"
        onClick={handleSendBackward}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <MoveDown className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="שכפול"
        onClick={handleDuplicate}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
      >
        <Copy className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="מחיקה"
        onClick={handleDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 transition hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        title="סגירה"
        onClick={handleClearSelection}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}