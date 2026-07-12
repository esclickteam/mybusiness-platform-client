import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  applyAllVisualDataToDom,
  markSelectedVisualElementInDom,
  syncEditorMediaPreviewForTarget,
} from "./utils/visualDomApply";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

type VisualEditorCanvasProps = {
  editor: ReturnType<typeof useVisualEditorState>;
  className?: string;
};

type SelectionBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
};

type ResizeHandle =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w";

type DragSession = {
  mode: "move" | "resize";
  handle?: ResizeHandle;
  node: HTMLElement;
  elementId: string;
  startX: number;
  startY: number;
  startRect: DOMRect;
  startTranslateX: number;
  startTranslateY: number;
};

type DirectDragSession = {
  node: HTMLElement;
  elementId: string;
  startX: number;
  startY: number;
  startTranslateX: number;
  startTranslateY: number;
  startRect: DOMRect;
  started: boolean;
  originalTransition: string;
  originalTransitionProperty: string;
  originalTransitionDuration: string;
  originalTransitionDelay: string;
  originalAnimationPlayState: string;
};

const TEXT_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "strong",
  "small",
  "label",
  "em",
  "b",
  "i",
  "blockquote",
  "figcaption",
]);

const EDITOR_UI_SELECTOR = [
  "[data-visual-selection-box='true']",
  "[data-visual-resize-handle='true']",
  "[data-visual-floating-toolbar='true']",
  "[data-visual-context-menu='true']",
  "[data-visual-selection-overlay='true']",
  ".visual-floating-toolbar",
  ".visual-context-menu",
].join(",");

function getDeviceWidth(device: VisualDeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";
  return "100%";
}

function getDeviceMaxWidth(device: VisualDeviceMode) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";
  return "100%";
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function getElementId(node: HTMLElement | null) {
  return String(node?.getAttribute("data-visual-edit-id") || "").trim();
}

function isMediaProxyForElement(
  target: HTMLElement,
  elementId: string,
) {
  const proxy = target.closest<HTMLElement>(
    "[data-bizuply-editor-media-preview='true'][data-bizuply-preview-for]",
  );

  return Boolean(
    proxy &&
      String(proxy.getAttribute("data-bizuply-preview-for") || "").trim() ===
        elementId,
  );
}

function getElementType(node: HTMLElement | null) {
  if (!node) return "";

  const explicit = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  )
    .trim()
    .toLowerCase();

  if (["image", "video", "media", "raw"].includes(explicit)) {
    return "image";
  }

  if (["button", "link", "control"].includes(explicit)) {
    return "button";
  }

  if (["text", "heading", "paragraph"].includes(explicit)) {
    return "text";
  }

  if (explicit) return explicit;

  const tagName = String(node.tagName || "").toLowerCase();

  if (["img", "video", "source", "picture"].includes(tagName)) {
    return "image";
  }

  if (["a", "button", "input", "textarea", "select"].includes(tagName)) {
    return "button";
  }

  if (TEXT_TAGS.has(tagName)) return "text";

  if (
    [
      "section",
      "article",
      "header",
      "footer",
      "main",
      "nav",
      "aside",
      "form",
    ].includes(tagName)
  ) {
    return "section";
  }

  return "box";
}

function isTextNode(node: HTMLElement | null) {
  if (!node) return false;

  return (
    getElementType(node) === "text" ||
    TEXT_TAGS.has(String(node.tagName || "").toLowerCase())
  );
}

function getSelectionRect(node: HTMLElement) {
  if (!isTextNode(node)) return node.getBoundingClientRect();

  const text = String(node.textContent || "").trim();

  if (!text) return node.getBoundingClientRect();

  const range = document.createRange();

  try {
    range.selectNodeContents(node);

    const rects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    );

    if (!rects.length) return node.getBoundingClientRect();

    const top = Math.min(...rects.map((rect) => rect.top));
    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));

    return {
      top,
      left,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  } catch {
    return node.getBoundingClientRect();
  } finally {
    range.detach();
  }
}

function getSelectedNode(editor: any, root: HTMLElement | null) {
  const direct =
    editor?.selectedElement?.node ||
    editor?.selectedElement?.domNode ||
    editor?.selectedElement?.element ||
    null;

  if (direct instanceof HTMLElement && root?.contains(direct)) {
    return direct;
  }

  const elementId = String(editor?.selectedElement?.id || "").trim();

  if (!root || !elementId) return null;

  const safeId =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(elementId)
      : elementId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return root.querySelector<HTMLElement>(
    `[data-visual-edit-id="${safeId}"]`,
  );
}

function placeCaretAtPoint(
  node: HTMLElement,
  clientX?: number,
  clientY?: number,
) {
  node.focus({ preventScroll: true });

  const selection = window.getSelection();
  if (!selection) return;

  let range: Range | null = null;

  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };

  if (typeof clientX === "number" && typeof clientY === "number") {
    if (typeof doc.caretPositionFromPoint === "function") {
      const position = doc.caretPositionFromPoint(clientX, clientY);

      if (position) {
        range = document.createRange();
        range.setStart(position.offsetNode, position.offset);
        range.collapse(true);
      }
    } else if (typeof doc.caretRangeFromPoint === "function") {
      range = doc.caretRangeFromPoint(clientX, clientY);
    }
  }

  if (!range || !node.contains(range.startContainer)) {
    range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
  }

  selection.removeAllRanges();
  selection.addRange(range);
}

function selectionBelongsToNode(
  selection: Selection | null,
  node: HTMLElement | null,
) {
  if (!selection || !node || selection.rangeCount === 0) return false;

  const anchorNode = selection.anchorNode;
  const focusNode = selection.focusNode;

  return Boolean(
    (anchorNode && (anchorNode === node || node.contains(anchorNode))) ||
      (focusNode && (focusNode === node || node.contains(focusNode))),
  );
}

function normalizeText(value: string) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n");
}

function getComputedTranslate(node: HTMLElement) {
  const computed = window.getComputedStyle(node);
  const translateValue = String(
    computed.translate || node.style.translate || "",
  ).trim();

  if (translateValue && translateValue !== "none") {
    const parts = translateValue
      .split(/\s+/)
      .map((part) => Number.parseFloat(part))
      .filter((value) => Number.isFinite(value));

    if (parts.length) {
      return {
        x: Number(parts[0] || 0),
        y: Number(parts[1] || 0),
      };
    }
  }

  const transform = computed.transform;

  if (!transform || transform === "none") {
    return { x: 0, y: 0 };
  }

  const match2d = transform.match(/^matrix\(([^)]+)\)$/);

  if (match2d) {
    const parts = match2d[1].split(",").map(Number);

    return {
      x: Number(parts[4] || 0),
      y: Number(parts[5] || 0),
    };
  }

  const match3d = transform.match(/^matrix3d\(([^)]+)\)$/);

  if (match3d) {
    const parts = match3d[1].split(",").map(Number);

    return {
      x: Number(parts[12] || 0),
      y: Number(parts[13] || 0),
    };
  }

  return { x: 0, y: 0 };
}

function getResizeCursor(handle: ResizeHandle) {
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "nw" || handle === "se") return "nwse-resize";
  return "nesw-resize";
}

const HANDLE_POSITIONS: Array<{
  handle: ResizeHandle;
  style: React.CSSProperties;
}> = [
  { handle: "nw", style: { left: -6, top: -6 } },
  { handle: "n", style: { left: "50%", top: -6, transform: "translateX(-50%)" } },
  { handle: "ne", style: { right: -6, top: -6 } },
  { handle: "e", style: { right: -6, top: "50%", transform: "translateY(-50%)" } },
  { handle: "se", style: { right: -6, bottom: -6 } },
  { handle: "s", style: { left: "50%", bottom: -6, transform: "translateX(-50%)" } },
  { handle: "sw", style: { left: -6, bottom: -6 } },
  { handle: "w", style: { left: -6, top: "50%", transform: "translateY(-50%)" } },
];

export default function VisualEditorCanvas({
  editor,
  className = "",
}: VisualEditorCanvasProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editingNodeRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef("");
  const dragSessionRef = useRef<DragSession | null>(null);
  const directDragSessionRef = useRef<DirectDragSession | null>(null);
  const animationFrameRef = useRef(0);
  const directAnimationFrameRef = useRef(0);
  const pendingHandlePointRef = useRef<{ x: number; y: number } | null>(null);
  const selectionBoxRef = useRef<HTMLDivElement | null>(null);
  const suppressClickUntilRef = useRef(0);
  const editorRef = useRef<any>(null);
  const stableTemplateDataRef = useRef<Record<string, any> | null>(null);
  const stableTemplateIdentityRef = useRef("");

  const [inlineEditingElementId, setInlineEditingElementId] = useState("");
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  const editorAny = editor as any;
  editorRef.current = editorAny;

  const templateIdentity = `${String(
    editorAny.renderer?.key || editorAny.templateKey || "template",
  )}:${String(editorAny.activePageId || editorAny.activePageID || "home")}`;

  /*
    React מקבל snapshot בסיס יציב של התבנית בלבד.
    כל עריכה חיה מוחלת על ה-DOM דרך visualDomApply.
    כך החלפת תמונה/וידאו לא גורמת ל-React לבנות מחדש את כל התבנית
    ולהסיר את תצוגת המדיה בכל תזוזה או שינוי קטן.
  */
  if (
    stableTemplateIdentityRef.current !== templateIdentity ||
    stableTemplateDataRef.current === null
  ) {
    stableTemplateIdentityRef.current = templateIdentity;
    stableTemplateDataRef.current = editorAny.data || {};
  }

  const TemplateComponent = useMemo(() => {
    const renderer = editorAny.renderer as any;

    return (
      renderer?.Component ||
      renderer?.component ||
      renderer?.Renderer ||
      renderer?.render ||
      null
    ) as React.ComponentType<any> | null;
  }, [editorAny.renderer]);

  const StableTemplateComponent = useMemo(
    () => (TemplateComponent ? React.memo(TemplateComponent) : null),
    [TemplateComponent],
  );

  const isPreviewMode = Boolean(editorAny.isPreviewMode);
  const isEditMode = !isPreviewMode;

  const selectedElementId = String(editorAny.selectedElement?.id || "");
  const hoveredElementId = String(editorAny.hoveredElementId || "");

  const runtimeCss = useMemo(() => {
    if (typeof editorAny.runtimeCss === "string") {
      return editorAny.runtimeCss;
    }

    if (typeof editorAny.buildRuntimeCss === "function") {
      return (
        editorAny.buildRuntimeCss({
          selectedElementId,
          hoveredElementId,
        }) || ""
      );
    }

    return "";
  }, [
    editorAny.runtimeCss,
    editorAny.styles,
    editorAny.animations,
    selectedElementId,
    hoveredElementId,
  ]);

  const refreshSelectionBox = useCallback(() => {
    const root = rootRef.current;
    const currentEditor = editorRef.current;

    const node = getSelectedNode(currentEditor, root);

    if (!node || !document.body.contains(node)) {
      setSelectionBox(null);
      return;
    }

    const rect = getSelectionRect(node);

    if (!rect.width || !rect.height) {
      setSelectionBox(null);
      return;
    }

    setSelectionBox({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      label:
        node.getAttribute("data-visual-edit-label") ||
        node.getAttribute("data-visual-edit-type") ||
        node.tagName.toLowerCase(),
    });
  }, []);

  const updateSelectionBoxImperatively = useCallback((node: HTMLElement) => {
    const overlay = selectionBoxRef.current;
    if (!overlay || !document.body.contains(node)) return;

    const rect = node.getBoundingClientRect();

    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    syncEditorMediaPreviewForTarget(node);
  }, []);

  const finishInlineEdit = useCallback(
    (save: boolean) => {
      const node = editingNodeRef.current;
      if (!node) return;

      const elementId = getElementId(node);

      if (save && elementId) {
        editorAny.updateText?.(
          elementId,
          normalizeText(node.innerText || node.textContent || ""),
        );
      }

      if (!save) {
        node.innerText = originalTextRef.current;
      }

      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");
      node.removeAttribute("data-visual-inline-editing");
      node.classList.remove("is-visual-inline-editing");

      node.style.userSelect = "";
      node.style.webkitUserSelect = "";
      node.style.cursor = "";

      window.getSelection()?.removeAllRanges();

      editingNodeRef.current = null;
      originalTextRef.current = "";

      setInlineEditingElementId("");

      editorAny.setIsInlineEditing?.(false);
      editorAny.finishInlineTextEdit?.();

      window.requestAnimationFrame(refreshSelectionBox);
    },
    [editorAny, refreshSelectionBox],
  );

  const startInlineEdit = useCallback(
    (
      node: HTMLElement,
      elementId: string,
      clientX?: number,
      clientY?: number,
    ) => {
      if (!elementId || !isTextNode(node)) return;

      if (editingNodeRef.current && editingNodeRef.current !== node) {
        finishInlineEdit(true);
      }

      editingNodeRef.current = node;
      originalTextRef.current = normalizeText(
        node.innerText || node.textContent || "",
      );

      node.setAttribute("contenteditable", "true");
      node.setAttribute("spellcheck", "false");
      node.setAttribute("data-visual-inline-editing", "true");
      node.classList.add("is-visual-inline-editing");

      node.style.cursor = "text";
      node.style.userSelect = "text";
      node.style.webkitUserSelect = "text";

      setInlineEditingElementId(elementId);

      editorAny.setIsInlineEditing?.(true);
      editorAny.startInlineTextEdit?.(elementId);

      window.requestAnimationFrame(() => {
        placeCaretAtPoint(node, clientX, clientY);
        refreshSelectionBox();
      });
    },
    [editorAny, finishInlineEdit, refreshSelectionBox],
  );

  useEffect(() => {
    const root = rootRef.current;
    const currentEditor = editorRef.current;

    if (!root || !currentEditor) return;

    if (currentEditor.canvasRef) {
      currentEditor.canvasRef.current = root;
    }

    currentEditor.setCanvasElement?.(root);
    currentEditor.registerAllVisualElements?.();
  }, [TemplateComponent]);

  /*
    מחילים את נתוני האתר רק כשה-data עצמו משתנה.
    בעבר האפקט רץ גם בכל hover של העכבר, יצר מחדש את תצוגת הווידאו
    וגרם לסרטון לקפוץ בכל תזוזה.
  */
  useEffect(() => {
    const root = rootRef.current;
    const currentEditor = editorRef.current;

    if (!root || !currentEditor) return;

    if (!inlineEditingElementId && !currentEditor.isInlineEditing) {
      applyAllVisualDataToDom(root, currentEditor.data || {});
    }

    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    editorAny.data,
    inlineEditingElementId,
    refreshSelectionBox,
  ]);


  /*
    Custom Code כמו ב-Wix:
    CSS מוחל מיד גם בעריכה. JavaScript רץ רק בתצוגה,
    כדי שקוד משתמש לא ישבור את כלי העריכה.
  */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const customCode = editorAny.customCode || {};
    const documentValue = root.ownerDocument;

    let styleNode = documentValue.querySelector<HTMLStyleElement>(
      'style[data-bizuply-live-custom-css="true"]',
    );

    if (!styleNode) {
      styleNode = documentValue.createElement("style");
      styleNode.setAttribute(
        "data-bizuply-live-custom-css",
        "true",
      );
      documentValue.head.appendChild(styleNode);
    }

    styleNode.textContent =
      customCode.enabled === false
        ? ""
        : String(customCode.css || "");

    const oldScript = documentValue.querySelector<HTMLScriptElement>(
      'script[data-bizuply-preview-custom-js="true"]',
    );
    oldScript?.remove();

    if (
      isPreviewMode &&
      customCode.enabled !== false &&
      String(customCode.javascript || "").trim()
    ) {
      const script = documentValue.createElement("script");
      script.setAttribute(
        "data-bizuply-preview-custom-js",
        "true",
      );
      script.textContent = String(customCode.javascript || "");
      documentValue.body.appendChild(script);
    }

    return () => {
      documentValue
        .querySelector<HTMLScriptElement>(
          'script[data-bizuply-preview-custom-js="true"]',
        )
        ?.remove();
    };
  }, [
    editorAny.customCode,
    isPreviewMode,
  ]);

  /* סימוני בחירה ו-hover אינם מרנדרים מחדש מדיה או תוכן. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    markSelectedVisualElementInDom(
      root,
      selectedElementId,
      hoveredElementId,
    );

    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    selectedElementId,
    hoveredElementId,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    if (!isEditMode) {
      finishInlineEdit(true);
      setSelectionBox(null);
      return;
    }

    const refresh = () => refreshSelectionBox();

    window.addEventListener("scroll", refresh, true);
    window.addEventListener("resize", refresh);

    const observer = new ResizeObserver(refresh);
    const root = rootRef.current;

    if (root) observer.observe(root);

    return () => {
      window.removeEventListener("scroll", refresh, true);
      window.removeEventListener("resize", refresh);
      observer.disconnect();
    };
  }, [finishInlineEdit, isEditMode, refreshSelectionBox]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEditMode) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (performance.now() < suppressClickUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!isHTMLElement(target)) return;
      if (target.closest(EDITOR_UI_SELECTOR)) return;

      const editingNode = editingNodeRef.current;

      if (editingNode) {
        if (editingNode.contains(target)) {
          event.stopPropagation();
          return;
        }

        finishInlineEdit(true);
      }

      const currentEditor = editorRef.current;
      const selected = currentEditor?.selectNode?.(target);

      if (!selected?.id) {
        currentEditor?.handleCanvasClick?.({
          ...event,
          target,
          preventDefault: () => event.preventDefault(),
          stopPropagation: () => event.stopPropagation(),
        });

        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // First click only selects the exact element. Text editing starts on double click.
      // This prevents the editor from getting stuck in contenteditable mode.
    };

    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!isHTMLElement(target)) return;
      if (target.closest(EDITOR_UI_SELECTOR)) return;

      const currentEditor = editorRef.current;
      const selected = currentEditor?.selectNode?.(target);

      if (!selected?.id) return;

      event.preventDefault();
      event.stopPropagation();

      if (String(selected.type || "") === "image") {
        currentEditor?.openMediaPicker?.(selected.id);
        return;
      }

      if (String(selected.type || "") === "button") {
        currentEditor?.openLinkSettings?.(selected.id);
        return;
      }

      const selectedNode =
        selected.node instanceof HTMLElement ? selected.node : target;

      if (isTextNode(selectedNode)) {
        startInlineEdit(
          selectedNode,
          selected.id,
          event.clientX,
          event.clientY,
        );
      }
    };

    const handleBeforeInput = (event: InputEvent) => {
      const node = editingNodeRef.current;

      if (!node || !(event.target instanceof Node)) return;
      if (!node.contains(event.target)) return;

      event.stopPropagation();
    };

    const handleInput = (event: Event) => {
      const node = editingNodeRef.current;

      if (!node || !(event.target instanceof Node)) return;
      if (!node.contains(event.target)) return;

      event.stopPropagation();

      const elementId = getElementId(node);
      if (elementId) {
        const liveText = normalizeText(
          node.innerText || node.textContent || "",
        );

        /*
          שומרים את הטקסט בכל הקלדה, לא רק ב-blur/Enter.
          לכן שינוי צבע, גודל או שכבה לא יכול להחזיר טקסט ישן.
        */
        editorRef.current?.updateText?.(elementId, liveText);
      }

      window.requestAnimationFrame(refreshSelectionBox);
    };

    const handlePaste = (event: ClipboardEvent) => {
      const node = editingNodeRef.current;

      if (!node || !(event.target instanceof Node)) return;
      if (!node.contains(event.target)) return;

      event.preventDefault();
      event.stopPropagation();

      const text = event.clipboardData?.getData("text/plain") || "";

      document.execCommand("insertText", false, text);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const node = editingNodeRef.current;
      if (!node) return;

      const selection = window.getSelection();

      if (!selectionBelongsToNode(selection, node)) return;

      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        finishInlineEdit(false);
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        finishInlineEdit(true);
      }
    };

    root.addEventListener("click", handleClick, true);
    root.addEventListener("dblclick", handleDoubleClick, true);
    root.addEventListener("beforeinput", handleBeforeInput as EventListener, true);
    root.addEventListener("input", handleInput, true);
    root.addEventListener("paste", handlePaste, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      root.removeEventListener("click", handleClick, true);
      root.removeEventListener("dblclick", handleDoubleClick, true);
      root.removeEventListener(
        "beforeinput",
        handleBeforeInput as EventListener,
        true,
      );
      root.removeEventListener("input", handleInput, true);
      root.removeEventListener("paste", handlePaste, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [
    finishInlineEdit,
    isEditMode,
    refreshSelectionBox,
    startInlineEdit,
  ]);

  const commitLayout = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      const currentEditor = editorRef.current;

      if (typeof currentEditor?.applyLayout === "function") {
        currentEditor.applyLayout(elementId, patch);
        return;
      }

      if (typeof currentEditor?.updateLayout === "function") {
        currentEditor.updateLayout(elementId, patch);
        return;
      }

      currentEditor?.applyStyle?.(elementId, patch);
    },
    [],
  );

  const startMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const currentEditor = editorRef.current;
      const node = getSelectedNode(currentEditor, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(currentEditor?.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);

      dragSessionRef.current = {
        mode: "move",
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startRect: node.getBoundingClientRect(),
        startTranslateX: translate.x,
        startTranslateY: translate.y,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    },
    [inlineEditingElementId, isEditMode],
  );

  const startResize = useCallback(
    (
      event: React.PointerEvent<HTMLButtonElement>,
      handle: ResizeHandle,
    ) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const currentEditor = editorRef.current;
      const node = getSelectedNode(currentEditor, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(currentEditor?.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);

      dragSessionRef.current = {
        mode: "resize",
        handle,
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startRect: node.getBoundingClientRect(),
        startTranslateX: translate.x,
        startTranslateY: translate.y,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    },
    [inlineEditingElementId, isEditMode],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragSessionRef.current) return;

      pendingHandlePointRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (!animationFrameRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          animationFrameRef.current = 0;

          const session = dragSessionRef.current;
          const point = pendingHandlePointRef.current;

          if (!session || !point) return;

          const deltaX = point.x - session.startX;
          const deltaY = point.y - session.startY;

          session.node.style.willChange = "transform,width,height";
          session.node.setAttribute("data-visual-dragging", "true");

          if (session.mode === "move") {
            const translateX = session.startTranslateX + deltaX;
            const translateY = session.startTranslateY + deltaY;

            session.node.style.translate =
              `${translateX}px ${translateY}px`;

            updateSelectionBoxImperatively(session.node);
            return;
          }

          const handle = session.handle;
          if (!handle) return;

          let width = session.startRect.width;
          let height = session.startRect.height;
          let translateX = session.startTranslateX;
          let translateY = session.startTranslateY;

          if (handle.includes("e")) width += deltaX;
          if (handle.includes("s")) height += deltaY;

          if (handle.includes("w")) {
            width -= deltaX;
            translateX += deltaX;
          }

          if (handle.includes("n")) {
            height -= deltaY;
            translateY += deltaY;
          }

          width = Math.max(24, width);
          height = Math.max(24, height);

          session.node.style.width = `${width}px`;
          session.node.style.height = `${height}px`;
          session.node.style.translate =
            `${translateX}px ${translateY}px`;

          updateSelectionBoxImperatively(session.node);
        });
      }

      event.preventDefault();
      event.stopPropagation();
    },
    [updateSelectionBoxImperatively],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
      pendingHandlePointRef.current = null;

      const rect = session.node.getBoundingClientRect();
      const translate = getComputedTranslate(session.node);

      if (session.mode === "move") {
        commitLayout(session.elementId, {
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      } else {
        commitLayout(session.elementId, {
          width: `${Math.round(rect.width)}px`,
          height: `${Math.round(rect.height)}px`,
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      }

      dragSessionRef.current = null;
      session.node.style.willChange = "";
      session.node.removeAttribute("data-visual-dragging");

      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(
          event.pointerId,
        );
      } catch {
        // noop
      }

      refreshSelectionBox();
      event.preventDefault();
      event.stopPropagation();
    },
    [commitLayout, refreshSelectionBox],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEditMode) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || inlineEditingElementId) return;
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest(EDITOR_UI_SELECTOR)) return;
      if (event.target.closest('[contenteditable="true"]')) return;

      const currentEditor = editorRef.current;

      const selectedFromPointer = currentEditor?.selectNode?.(
        event.target,
        {
          keepPreviousOnMissing: true,
        },
      );

      const node =
        selectedFromPointer?.node instanceof HTMLElement
          ? selectedFromPointer.node
          : getSelectedNode(currentEditor, root);

      const elementId = getElementId(node);

      const targetBelongsToSelected =
        node &&
        elementId &&
        (node.contains(event.target) ||
          isMediaProxyForElement(event.target, elementId));

      if (
        !node ||
        !elementId ||
        !targetBelongsToSelected ||
        Boolean(currentEditor?.locked?.[elementId])
      ) {
        return;
      }

      /*
        כל אלמנט ניתן לגרירה בנפרד, כולל טקסט וכפתורים.
        שדות קלט פעילים נשארים אינטראקטיביים, ועריכת טקסט נעשית בדאבל־קליק.
      */
      if (
        event.target.closest(
          'input, textarea, select, [contenteditable="true"]',
        )
      ) {
        return;
      }

      const translate = getComputedTranslate(node);

      directDragSessionRef.current = {
        node,
        elementId,
        startX: event.clientX,
        startY: event.clientY,
        startTranslateX: translate.x,
        startTranslateY: translate.y,
        startRect: node.getBoundingClientRect(),
        started: false,
        originalTransition: node.style.transition,
        originalTransitionProperty: node.style.transitionProperty,
        originalTransitionDuration: node.style.transitionDuration,
        originalTransitionDelay: node.style.transitionDelay,
        originalAnimationPlayState: node.style.animationPlayState,
      };

      node.style.touchAction = "none";
    };

    let latestDirectPoint: { x: number; y: number } | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;

      if (!session.started && Math.hypot(deltaX, deltaY) < 3) return;

      session.started = true;
      session.node.style.setProperty("transition", "none", "important");
      session.node.style.setProperty("transition-property", "none", "important");
      session.node.style.setProperty("transition-duration", "0s", "important");
      session.node.style.setProperty("transition-delay", "0s", "important");
      session.node.style.animationPlayState = "paused";
      latestDirectPoint = { x: event.clientX, y: event.clientY };

      event.preventDefault();
      event.stopPropagation();

      if (!directAnimationFrameRef.current) {
        directAnimationFrameRef.current = window.requestAnimationFrame(() => {
          directAnimationFrameRef.current = 0;

          const activeSession = directDragSessionRef.current;
          const point = latestDirectPoint;

          if (!activeSession || !point) return;

          const nextX =
            activeSession.startTranslateX +
            (point.x - activeSession.startX);
          const nextY =
            activeSession.startTranslateY +
            (point.y - activeSession.startY);

          activeSession.node.style.willChange = "transform";
          activeSession.node.setAttribute("data-visual-dragging", "true");
          activeSession.node.style.translate =
            `${nextX}px ${nextY}px`;

          const overlay = selectionBoxRef.current;
          if (overlay) {
            overlay.style.left = `${
              activeSession.startRect.left +
              (point.x - activeSession.startX)
            }px`;
            overlay.style.top = `${
              activeSession.startRect.top +
              (point.y - activeSession.startY)
            }px`;
            overlay.style.width = `${activeSession.startRect.width}px`;
            overlay.style.height = `${activeSession.startRect.height}px`;
          }

          syncEditorMediaPreviewForTarget(activeSession.node);
        });
      }

      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const handlePointerUp = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      directDragSessionRef.current = null;

      window.cancelAnimationFrame(directAnimationFrameRef.current);
      directAnimationFrameRef.current = 0;
      latestDirectPoint = null;

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      session.node.style.willChange = "";
      session.node.style.touchAction = "";
      session.node.style.removeProperty("transition");
      session.node.style.removeProperty("transition-property");
      session.node.style.removeProperty("transition-duration");
      session.node.style.removeProperty("transition-delay");
      session.node.style.transition = session.originalTransition;
      session.node.style.transitionProperty = session.originalTransitionProperty;
      session.node.style.transitionDuration = session.originalTransitionDuration;
      session.node.style.transitionDelay = session.originalTransitionDelay;
      session.node.style.animationPlayState = session.originalAnimationPlayState;
      session.node.removeAttribute("data-visual-dragging");

      if (!session.started) return;

      suppressClickUntilRef.current = performance.now() + 220;

      event.preventDefault();
      event.stopPropagation();

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;
      const finalX = session.startTranslateX + deltaX;
      const finalY = session.startTranslateY + deltaY;

      session.node.style.translate =
        `${finalX}px ${finalY}px`;

      syncEditorMediaPreviewForTarget(session.node);

      commitLayout(session.elementId, {
        translateX: finalX,
        translateY: finalY,
        x: finalX,
        y: finalY,
      });

      refreshSelectionBox();
    };

    root.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointermove", handlePointerMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);

    return () => {
      window.cancelAnimationFrame(directAnimationFrameRef.current);
      root.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerUp, true);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [
    commitLayout,
    inlineEditingElementId,
    isEditMode,
    refreshSelectionBox,
    updateSelectionBoxImperatively,
  ]);

  const deviceMode = (editorAny.deviceMode || "desktop") as VisualDeviceMode;

  if (!StableTemplateComponent) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-slate-100 p-8">
        <div className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black text-slate-400">
            לא נמצא Component לתבנית
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            צריך לבדוק את renderer
          </h2>
        </div>
      </div>
    );
  }

  const selectedNode = getSelectedNode(editorAny, rootRef.current);
  const selectedType = getElementType(selectedNode);
  const selectedTagName = String(
    selectedNode?.tagName || "",
  ).toLowerCase();
  const selectedIsSection =
    selectedType === "section" ||
    [
      "section",
      "header",
      "footer",
      "main",
      "article",
      "form",
    ].includes(selectedTagName);
  const showResizeHandles =
    Boolean(selectionBox) && isEditMode && !inlineEditingElementId;

  return (
    <div
      className={[
        "visual-editor-scroll-area h-full overflow-y-auto overflow-x-hidden bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerOver={editorAny.handleCanvasMouseMove}
      onMouseLeave={editorAny.handleCanvasMouseLeave}
      onContextMenu={editorAny.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>



      {selectionBox ? (
        <div
          ref={selectionBoxRef}
          data-visual-selection-box="true"
          style={{
            position: "fixed",
            top: selectionBox.top,
            left: selectionBox.left,
            width: selectionBox.width,
            height: selectionBox.height,
            zIndex: 2147482000,
            pointerEvents: "none",
            border: "2px solid #7c3aed",
            borderRadius: 10,
            boxShadow: "0 0 0 5px rgba(124,58,237,0.12)",
          }}
        >
          {selectionBox.label ? (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: -30,
                height: 24,
                maxWidth: 220,
                padding: "0 9px",
                display: "flex",
                alignItems: "center",
                borderRadius: 8,
                background: "#7c3aed",
                color: "#fff",
                fontSize: 11,
                fontWeight: 900,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                pointerEvents: "none",
              }}
            >
              {selectionBox.label}
            </div>
          ) : null}


          {selectedIsSection && selectedElementId ? (
            <>
              <button
                type="button"
                data-editor-only="true"
                data-bizuply-editor-only="true"
                title="הוספת סקשן מעל"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  editorAny.addSection?.(
                    "before",
                    selectedElementId,
                  );
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -46,
                  transform: "translateX(-50%)",
                  minWidth: 112,
                  height: 32,
                  border: "1px solid #7c3aed",
                  borderRadius: 999,
                  background: "#ffffff",
                  color: "#6d28d9",
                  fontSize: 12,
                  fontWeight: 900,
                  pointerEvents: "auto",
                  cursor: "pointer",
                  boxShadow:
                    "0 8px 24px rgba(76,29,149,0.18)",
                }}
              >
                + סקשן מעל
              </button>

              <button
                type="button"
                data-editor-only="true"
                data-bizuply-editor-only="true"
                title="הוספת סקשן מתחת"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  editorAny.addSection?.(
                    "after",
                    selectedElementId,
                  );
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -46,
                  transform: "translateX(-50%)",
                  minWidth: 122,
                  height: 32,
                  border: "1px solid #7c3aed",
                  borderRadius: 999,
                  background: "#ffffff",
                  color: "#6d28d9",
                  fontSize: 12,
                  fontWeight: 900,
                  pointerEvents: "auto",
                  cursor: "pointer",
                  boxShadow:
                    "0 8px 24px rgba(76,29,149,0.18)",
                }}
              >
                + סקשן מתחת
              </button>
            </>
          ) : null}

          {!inlineEditingElementId ? (
            <button
              type="button"
              data-visual-drag-handle="true"
              aria-label="גרירת אלמנט"
              title="גרירת אלמנט"
              onPointerDown={startMove}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              style={{
                position: "absolute",
                left: -1,
                top: -32,
                width: 28,
                height: 26,
                padding: 0,
                border: "2px solid #7c3aed",
                borderRadius: 8,
                background: "#ffffff",
                color: "#7c3aed",
                fontSize: 16,
                fontWeight: 900,
                lineHeight: "20px",
                cursor: "grab",
                pointerEvents: "auto",
                touchAction: "none",
                boxShadow: "0 4px 12px rgba(15,23,42,0.14)",
              }}
            >
              ✥
            </button>
          ) : null}

          {showResizeHandles
            ? HANDLE_POSITIONS.map(({ handle, style }) => (
                <button
                  key={handle}
                  type="button"
                  data-visual-resize-handle="true"
                  aria-label={`resize-${handle}`}
                  onPointerDown={(event) => startResize(event, handle)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  onPointerCancel={finishDrag}
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    padding: 0,
                    borderRadius: 999,
                    border: "2px solid #7c3aed",
                    background: "#fff",
                    cursor: getResizeCursor(handle),
                    pointerEvents: "auto",
                    touchAction: "none",
                    ...style,
                  }}
                />
              ))
            : null}
        </div>
      ) : null}

      <style>
        {`
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id] {
            cursor: grab;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id]:active {
            cursor: grabbing;
          }

          [data-visual-template-canvas="true"] [data-visual-inserted-element="true"] {
            touch-action: none !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] [contenteditable="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            caret-color: #7c3aed !important;
            outline: 2px solid #7c3aed !important;
            outline-offset: 4px !important;
            white-space: pre-wrap !important;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"] *,
          [data-visual-template-canvas="true"] [contenteditable="true"] * {
            user-select: text !important;
            -webkit-user-select: text !important;
          }

          [data-visual-template-canvas="true"] [contenteditable="true"]::selection,
          [data-visual-template-canvas="true"] [contenteditable="true"] *::selection {
            background: rgba(37, 99, 235, 0.82) !important;
            color: #ffffff !important;
          }
        `}
      </style>

      <div className="mx-auto min-h-full px-3 py-6 lg:px-6">
        <div
          className={[
            "mx-auto min-h-[720px] overflow-visible bg-white shadow-[0_24px_90px_rgba(15,23,42,0.14)] transition-all duration-300",
            deviceMode === "desktop" ? "w-full" : "rounded-[32px]",
          ].join(" ")}
          style={{
            width: getDeviceWidth(deviceMode),
            maxWidth: getDeviceMaxWidth(deviceMode),
          }}
        >
          <div
            ref={rootRef}
            data-visual-template-canvas="true"
            data-visual-preview-mode={isPreviewMode ? "true" : "false"}
            data-visual-editor-mode={isEditMode ? "edit" : "preview"}
            className={[
              "min-h-full overflow-visible",
              isEditMode && !inlineEditingElementId
                ? "cursor-default select-none"
                : "cursor-auto select-auto",
            ].join(" ")}
            dir="rtl"
          >
            <StableTemplateComponent
              data={stableTemplateDataRef.current || {}}
              mode={isPreviewMode ? "preview" : "edit"}
              businessId={editorAny.businessId}
              activePageId={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              initialPage={
                editorAny.activePageId ||
                editorAny.activePageID ||
                "home"
              }
              isStudioStatic={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
