import { useEffect } from "react";

type UseVisualKeyboardShortcutsOptions = {
  enabled?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  selectedElementId?: string;
  isInlineEditing?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSave?: () => void;
  onClearSelection?: () => void;
};

function isTypingTarget(target: EventTarget | null) {
  if (!target || !(target instanceof HTMLElement)) return false;

  const tagName = String(target.tagName || "").toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable ||
    target.closest?.("[data-visual-inline-editing='true']")
  );
}

export function useVisualKeyboardShortcuts({
  enabled = true,
  canUndo = false,
  canRedo = false,
  selectedElementId,
  isInlineEditing = false,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onSave,
  onClearSelection,
}: UseVisualKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const meta = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const typing = isTypingTarget(event.target) || isInlineEditing;

      if (key === "escape") {
        onClearSelection?.();
        return;
      }

      if (meta && key === "s") {
        event.preventDefault();
        onSave?.();
        return;
      }

      if (meta && key === "z" && !shift) {
        if (!canUndo) return;
        event.preventDefault();
        onUndo?.();
        return;
      }

      if ((meta && key === "y") || (meta && shift && key === "z")) {
        if (!canRedo) return;
        event.preventDefault();
        onRedo?.();
        return;
      }

      if (typing) return;

      if ((key === "delete" || key === "backspace") && selectedElementId) {
        event.preventDefault();
        onDelete?.();
        return;
      }

      if (meta && key === "d" && selectedElementId) {
        event.preventDefault();
        onDuplicate?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enabled,
    canUndo,
    canRedo,
    selectedElementId,
    isInlineEditing,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSave,
    onClearSelection,
  ]);
}
