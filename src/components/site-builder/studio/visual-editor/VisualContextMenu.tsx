import React, { useEffect, useMemo, useRef } from "react";
import {
  Copy,
  CornerUpLeft,
  ClipboardList,
  Eye,
  EyeOff,
  Link2,
  Lock,
  MoveDown,
  MoveUp,
  RotateCcw,
  Trash2,
  Unlock,
  X,
} from "lucide-react";

import { resolveFormContext } from "./utils/visualForms";

type VisualContextMenuProps = {
  editor: any;
};

type ContextActionProps = {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ContextAction({
  label,
  icon,
  danger,
  active,
  disabled,
  onClick,
}: ContextActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!disabled) {
          onClick();
        }
      }}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm font-black transition",
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : active
            ? "bg-violet-50 text-violet-700"
            : "text-slate-700 hover:bg-slate-100",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-current/5">
        {icon}
      </span>

      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

function getElementId(editor: any) {
  return String(
    editor?.contextMenu?.elementId ||
      editor?.selectedElement?.id ||
      "",
  ).trim();
}

function getElementType(editor: any) {
  return String(
    editor?.selectedElement?.type ||
      editor?.selectedElement?.elementType ||
      editor?.selectedElement?.kind ||
      "",
  )
    .trim()
    .toLowerCase();
}

export default function VisualContextMenu({
  editor,
}: VisualContextMenuProps) {
  const menu = editor?.contextMenu;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const elementId = getElementId(editor);
  const elementType = getElementType(editor);

  const locked = Boolean(editor?.locked?.[elementId]);
  const hidden = Boolean(editor?.hidden?.[elementId]);

  const position = useMemo(() => {
    const width = 248;
    const estimatedHeight = 440;
    const margin = 12;

    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 1080;

    const requestedX = Number(menu?.x || 0);
    const requestedY = Number(menu?.y || 0);

    return {
      left: Math.max(
        margin,
        Math.min(requestedX, viewportWidth - width - margin),
      ),
      top: Math.max(
        margin,
        Math.min(requestedY, viewportHeight - estimatedHeight - margin),
      ),
    };
  }, [menu?.x, menu?.y]);

  useEffect(() => {
    if (!menu?.open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        editor?.closeContextMenu?.();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        editor?.closeContextMenu?.();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, menu?.open]);

  if (!menu?.open || !elementId) return null;

  const close = () => {
    editor?.closeContextMenu?.();
  };

  const runAndClose = (action: () => void) => {
    action();
    close();
  };

  const canEditLink =
    elementType === "text" ||
    elementType === "button" ||
    elementType === "link";

  const canEditForm = useMemo(() => {
    const node =
      editor?.selectedElement?.node ||
      editor?.selectedElement?.domNode ||
      editor?.selectedElement?.element ||
      null;

    if (!(node instanceof HTMLElement)) return false;

    const root = editor?.canvasRef?.current || null;
    return Boolean(resolveFormContext(node, root));
  }, [editor?.canvasRef, editor?.selectedElement]);

  return (
    <div
      ref={menuRef}
      dir="rtl"
      data-visual-context-menu="true"
      className="fixed z-[2147483640] w-[248px] overflow-hidden rounded-[20px] border border-slate-200 bg-white/95 p-2 shadow-[0_22px_80px_rgba(15,23,42,0.24)] backdrop-blur-2xl"
      style={position}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-slate-100 px-2 pb-2 pt-1">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-[0.14em] text-violet-500">
            פעולות אלמנט
          </p>

          <p className="mt-1 truncate text-xs font-bold text-slate-400">
            {elementId}
          </p>
        </div>

        <button
          type="button"
          title="סגירה"
          onClick={close}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-1">
        <ContextAction
          label="בחירת האלמנט ההורה"
          icon={<CornerUpLeft className="h-4 w-4" />}
          onClick={() =>
            runAndClose(() => {
              editor?.selectParent?.();
            })
          }
        />

        <ContextAction
          label="שכפול"
          icon={<Copy className="h-4 w-4" />}
          disabled={locked}
          onClick={() =>
            runAndClose(() => {
              if (typeof editor?.duplicateElement === "function") {
                editor.duplicateElement(elementId);
                return;
              }

              editor?.duplicateSelected?.();
            })
          }
        />

        {canEditLink ? (
          <ContextAction
            label="עריכת קישור"
            icon={<Link2 className="h-4 w-4" />}
            disabled={locked}
            onClick={() =>
              runAndClose(() => {
                editor?.openLinkSettings?.(elementId);
              })
            }
          />
        ) : null}

        {canEditForm ? (
          <ContextAction
            label="עריכת טופס"
            icon={<ClipboardList className="h-4 w-4" />}
            disabled={locked}
            onClick={() =>
              runAndClose(() => {
                editor?.openFormBuilder?.();
              })
            }
          />
        ) : null}

        <div className="my-1 h-px bg-slate-100" />

        <ContextAction
          label="שכבה קדימה"
          icon={<MoveUp className="h-4 w-4" />}
          disabled={locked}
          onClick={() =>
            runAndClose(() => {
              editor?.bringForward?.(elementId);
            })
          }
        />

        <ContextAction
          label="שכבה אחורה"
          icon={<MoveDown className="h-4 w-4" />}
          disabled={locked}
          onClick={() =>
            runAndClose(() => {
              editor?.sendBackward?.(elementId);
            })
          }
        />

        <ContextAction
          label={locked ? "פתיחת נעילה" : "נעילת אלמנט"}
          icon={
            locked ? (
              <Unlock className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )
          }
          active={locked}
          onClick={() =>
            runAndClose(() => {
              if (typeof editor?.setElementLocked === "function") {
                editor.setElementLocked(elementId, !locked);
                return;
              }

              editor?.toggleElementLocked?.(elementId);
            })
          }
        />

        <ContextAction
          label={hidden ? "הצגת אלמנט" : "הסתרת אלמנט"}
          icon={
            hidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
          active={hidden}
          onClick={() =>
            runAndClose(() => {
              if (typeof editor?.setElementHidden === "function") {
                editor.setElementHidden(elementId, !hidden);
                return;
              }

              editor?.toggleElementHidden?.(elementId);
            })
          }
        />

        <ContextAction
          label="איפוס עיצוב"
          icon={<RotateCcw className="h-4 w-4" />}
          disabled={locked}
          onClick={() =>
            runAndClose(() => {
              editor?.resetStyle?.(elementId);
            })
          }
        />

        <div className="my-1 h-px bg-slate-100" />

        <ContextAction
          label="מחיקה"
          icon={<Trash2 className="h-4 w-4" />}
          danger
          disabled={locked}
          onClick={() =>
            runAndClose(() => {
              if (typeof editor?.deleteElement === "function") {
                editor.deleteElement(elementId);
                return;
              }

              editor?.deleteSelected?.();
            })
          }
        />
      </div>
    </div>
  );
}
