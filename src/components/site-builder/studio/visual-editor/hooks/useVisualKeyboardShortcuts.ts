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
  onDeleteTextRange?: () => boolean | void;
  onReplaceTextRange?: (text: string) => boolean | void;
  onCopy?: () => void;
  onPaste?: () => void;
  onPasteTextRange?: (text: string) => boolean | void;
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

function hasDeletableTextSelection() {
  if (typeof window === "undefined") return false;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return false;
  }
  return Boolean(String(selection.toString() || ""));
}

export function shouldDeleteElementOnKey(options: {
  isTyping?: boolean;
  hasTextSelection?: boolean;
  selectedElementId?: string;
}) {
  if (options.isTyping) return false;
  if (options.hasTextSelection) return false;
  return Boolean(options.selectedElementId);
}

export function shouldUseElementClipboardOnKey(options: {
  isTyping?: boolean;
  hasTextSelection?: boolean;
  selectedElementId?: string;
}) {
  return shouldDeleteElementOnKey(options);
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
  onDeleteTextRange,
  onReplaceTextRange,
  onCopy,
  onPaste,
  onPasteTextRange,
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

      const hasTextSelection = hasDeletableTextSelection();
      const useElementShortcut = shouldUseElementClipboardOnKey({
        isTyping: typing,
        hasTextSelection,
        selectedElementId,
      });

      if (meta && key === "c") {
        if (hasTextSelection) {
          return;
        }
        if (!selectedElementId) return;
        event.preventDefault();
        onCopy?.();
        return;
      }

      if (meta && key === "x") {
        if (hasTextSelection) {
          const text = String(window.getSelection()?.toString() || "");
          if (text && navigator.clipboard?.writeText) {
            void navigator.clipboard.writeText(text);
          }
          const handled = onDeleteTextRange?.();
          if (handled) event.preventDefault();
          return;
        }
        return;
      }

      if (meta && key === "v") {
        if (hasTextSelection) {
          return;
        }
        event.preventDefault();
        onPaste?.();
        return;
      }

      if ((key === "delete" || key === "backspace") && selectedElementId) {
        if (!useElementShortcut) {
          if (hasTextSelection) {
            const handled = onDeleteTextRange?.();
            if (handled) {
              event.preventDefault();
            }
          }
          return;
        }
        event.preventDefault();
        onDelete?.();
        return;
      }

      if (
        hasTextSelection &&
        !meta &&
        !event.altKey &&
        event.key.length === 1
      ) {
        const handled = onReplaceTextRange?.(event.key);
        if (handled) event.preventDefault();
        return;
      }

      if (meta && key === "d" && useElementShortcut && selectedElementId) {
        event.preventDefault();
        onDuplicate?.();
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      if (isTypingTarget(event.target) || isInlineEditing) return;
      if (!hasDeletableTextSelection()) return;
      const text = String(event.clipboardData?.getData("text/plain") ?? "");
      const handled = onPasteTextRange?.(text);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste, true);
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
    onDeleteTextRange,
    onReplaceTextRange,
    onCopy,
    onPaste,
    onPasteTextRange,
    onDuplicate,
    onSave,
    onClearSelection,
  ]);
}
