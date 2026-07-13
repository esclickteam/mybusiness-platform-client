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
  syncEditorMediaPreviewsInDom,
} from "./utils/visualDomApply";

import { applyMediaFitStyles } from "./utils/visualMediaUtils";

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
  started: boolean;
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
  /*
    מסגרת הבחירה נמדדת תמיד לפי הקופסה האמיתית של האלמנט.
    מדידה לפי Range של אותיות גרמה למסגרת לקפוץ ולהיחתך בזמן שינוי גודל.
  */
  return node.getBoundingClientRect();
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

function parseCssLength(value: string | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "none") return 0;

  const parsed = Number.parseFloat(clean);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getComputedTranslate(node: HTMLElement) {
  const computed = window.getComputedStyle(node);
  const individualTranslate = String(computed.translate || "").trim();

  if (individualTranslate && individualTranslate !== "none") {
    const parts = individualTranslate
      .split(/\s+/)
      .filter(Boolean);

    return {
      x: parseCssLength(parts[0]),
      y: parseCssLength(parts[1]),
    };
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

function applyLiveTranslate(
  node: HTMLElement,
  translateX: number,
  translateY: number,
) {
  node.style.translate = `${translateX}px ${translateY}px`;
}

function applyLiveSize(
  node: HTMLElement,
  width: number,
  height: number,
) {
  const safeWidth = Math.max(24, width);
  const safeHeight = Math.max(24, height);

  /*
    משתמשים ב-important בזמן ה-Resize כדי לנטרל CSS של התבנית
    כגון height:auto, aspect-ratio או max-width:100%.
    זה קריטי במיוחד כשווידאו מוצג מעל placeholder מסוג img.
  */
  node.style.setProperty(
    "width",
    `${safeWidth}px`,
    "important",
  );
  node.style.setProperty(
    "height",
    `${safeHeight}px`,
    "important",
  );
  node.style.setProperty(
    "inline-size",
    `${safeWidth}px`,
    "important",
  );
  node.style.setProperty(
    "block-size",
    `${safeHeight}px`,
    "important",
  );
  node.style.setProperty("min-width", "24px", "important");
  node.style.setProperty("min-height", "24px", "important");
  node.style.setProperty("max-width", "none", "important");
  node.style.setProperty("max-height", "none", "important");
  node.style.setProperty("aspect-ratio", "auto", "important");
  node.style.setProperty("box-sizing", "border-box", "important");
  node.style.setProperty("flex", "none", "important");
}

function getStablePosition(node: HTMLElement) {
  const position = window.getComputedStyle(node).position;

  return position === "static" ? "relative" : position;
}

function sizeMediaChildren(node: HTMLElement) {
  const isDirectMedia =
    node instanceof HTMLImageElement ||
    node instanceof HTMLVideoElement;

  /*
    קריטי:
    כשהאלמנט המסומן הוא הווידאו/התמונה עצמם, אסור להחליף
    את ה-width וה-height שה-Resize קבע ל-100%.
    זה היה הופך את הווידאו לפס רחב בגודל ההורה.
  */
  if (isDirectMedia) {
    node.style.display = "block";
    node.style.boxSizing = "border-box";
    node.style.maxWidth = "none";
    node.style.maxHeight = "none";
    node.style.minWidth = "0";
    node.style.minHeight = "0";
    node.style.aspectRatio = "auto";

    /*
      וידאו ותמונה מטופלים באופן זהה:
      שומרים על object-fit הקיים (כולל ערך שמור), וברירת המחדל היא cover.
      כך אין מעבר cover<->contain שגרם לקפיצה בסיום ה-resize.
    */
    applyMediaFitStyles(node);

    return;
  }

  /*
    רק כשהאלמנט המסומן הוא wrapper, המדיה שבתוכו צריכה
    למלא את הקופסה שלו.
  */
  node
    .querySelectorAll<HTMLElement>("img, video, picture")
    .forEach((mediaNode) => {
      mediaNode.style.display = "block";
      mediaNode.style.width = "100%";
      mediaNode.style.height = "100%";
      mediaNode.style.maxWidth = "none";
      mediaNode.style.maxHeight = "none";
      mediaNode.style.minWidth = "0";
      mediaNode.style.minHeight = "0";
      mediaNode.style.boxSizing = "border-box";

      if (
        mediaNode instanceof HTMLVideoElement ||
        mediaNode instanceof HTMLImageElement
      ) {
        applyMediaFitStyles(mediaNode);
      }
    });
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
  const suppressClickUntilRef = useRef(0);

  const [inlineEditingElementId, setInlineEditingElementId] = useState("");
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  const editorAny = editor as any;

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
    const node = getSelectedNode(editorAny, root);

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
  }, [editorAny]);

  /*
    רכיב התבנית ממומו (memoized) כדי שלא ירונדר מחדש בכל שינוי של
    תיבת הבחירה או מצב הגרירה. בלי זה, כל תזוזת עכבר בזמן resize גרמה
    ל-re-render של כל עץ התבנית — ותגית <video> אמיתית "קופצת"/מהבהבת
    בזמן ה-reconciliation, בעוד <img> סטטית לא. הרינדור מחדש מתרחש רק
    כשמשתנים הנתונים, העמוד או מצב התצוגה — לא בזמן בחירה/גרירה.
  */
  const templateElement = useMemo(() => {
    if (!TemplateComponent) return null;

    const activePageId =
      editorAny.activePageId || editorAny.activePageID || "home";

    return (
      <TemplateComponent
        data={editorAny.data}
        mode={isPreviewMode ? "preview" : "edit"}
        businessId={editorAny.businessId}
        activePageId={activePageId}
        initialPage={activePageId}
        isStudioStatic={false}
      />
    );
  }, [
    TemplateComponent,
    editorAny.data,
    editorAny.businessId,
    editorAny.activePageId,
    editorAny.activePageID,
    isPreviewMode,
  ]);

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
    if (!root) return;

    if (editorAny.canvasRef) {
      editorAny.canvasRef.current = root;
    }

    editorAny.setCanvasElement?.(root);
    editorAny.registerAllVisualElements?.();
  }, [editorAny]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!inlineEditingElementId && !editorAny.isInlineEditing) {
      applyAllVisualDataToDom(root, editorAny.data || {});
      syncEditorMediaPreviewsInDom(root);
    }

    markSelectedVisualElementInDom(
      root,
      selectedElementId,
      hoveredElementId,
    );

    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    editorAny.data,
    editorAny.isInlineEditing,
    inlineEditingElementId,
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
      if (Date.now() < suppressClickUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const target = event.target;

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

      const selected = editorAny.selectNode?.(target);

      if (!selected?.id) {
        editorAny.handleCanvasClick?.({
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

      const selected = editorAny.selectNode?.(target);

      if (!selected?.id) return;

      event.preventDefault();
      event.stopPropagation();

      if (String(selected.type || "") === "image") {
        editorAny.openMediaPicker?.(selected.id);
        return;
      }

      if (String(selected.type || "") === "button") {
        editorAny.openLinkSettings?.(selected.id);
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
    editorAny,
    finishInlineEdit,
    isEditMode,
    refreshSelectionBox,
    startInlineEdit,
  ]);

  const commitLayout = useCallback(
    (elementId: string, patch: Record<string, any>) => {
      if (typeof editorAny.applyLayout === "function") {
        editorAny.applyLayout(elementId, patch);
        return;
      }

      if (typeof editorAny.updateLayout === "function") {
        editorAny.updateLayout(elementId, patch);
        return;
      }

      editorAny.applyStyle?.(elementId, patch);
    },
    [editorAny],
  );

  const startMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const node = getSelectedNode(editorAny, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(editorAny.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);

      suppressClickUntilRef.current = Date.now() + 350;

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
    [editorAny, inlineEditingElementId, isEditMode],
  );

  const startResize = useCallback(
    (
      event: React.PointerEvent<HTMLButtonElement>,
      handle: ResizeHandle,
    ) => {
      if (!isEditMode || inlineEditingElementId) return;

      const root = rootRef.current;
      const node = getSelectedNode(editorAny, root);
      const elementId = getElementId(node);

      if (!node || !elementId) return;
      if (Boolean(editorAny.locked?.[elementId])) return;

      const translate = getComputedTranslate(node);

      suppressClickUntilRef.current = Date.now() + 350;

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
    [editorAny, inlineEditingElementId, isEditMode],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;

      window.cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = window.requestAnimationFrame(() => {
        if (session.mode === "move") {
          const translateX = session.startTranslateX + deltaX;
          const translateY = session.startTranslateY + deltaY;

          applyLiveTranslate(
            session.node,
            translateX,
            translateY,
          );

          syncEditorMediaPreviewForTarget(session.node);
          refreshSelectionBox();
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

        /*
          ידית צד משנה רק ציר אחד:
          e/w = רוחב בלבד
          n/s = גובה בלבד
          פינות = רוחב וגובה
        */
        if (handle === "e" || handle === "w") {
          height = session.startRect.height;
        }

        if (handle === "n" || handle === "s") {
          width = session.startRect.width;
        }

        applyLiveSize(
          session.node,
          width,
          height,
        );

        applyLiveTranslate(
          session.node,
          translateX,
          translateY,
        );

        sizeMediaChildren(session.node);
        syncEditorMediaPreviewForTarget(session.node);
        refreshSelectionBox();
      });

      event.preventDefault();
      event.stopPropagation();
    },
    [refreshSelectionBox],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      window.cancelAnimationFrame(animationFrameRef.current);

      const rect = session.node.getBoundingClientRect();
      const translate = getComputedTranslate(session.node);

      suppressClickUntilRef.current = Date.now() + 350;

      if (session.mode === "move") {
        commitLayout(session.elementId, {
          position: getStablePosition(session.node),
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      } else {
        const liveWidth =
          Number.parseFloat(
            session.node.style.getPropertyValue("width"),
          ) || rect.width;

        const liveHeight =
          Number.parseFloat(
            session.node.style.getPropertyValue("height"),
          ) || rect.height;

        commitLayout(session.elementId, {
          position: getStablePosition(session.node),
          width: `${Math.round(liveWidth)}px`,
          height: `${Math.round(liveHeight)}px`,
          translateX: translate.x,
          translateY: translate.y,
          x: translate.x,
          y: translate.y,
        });
      }

      syncEditorMediaPreviewForTarget(session.node);
      dragSessionRef.current = null;

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

      const selected = editorAny.selectNode?.(event.target);
      const node =
        selected?.node instanceof HTMLElement
          ? selected.node
          : getSelectedNode(editorAny, root);
      const elementId = String(selected?.id || getElementId(node)).trim();

      if (!node || !elementId || Boolean(editorAny.locked?.[elementId])) {
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
        started: false,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;

      if (!session.started && Math.hypot(deltaX, deltaY) < 4) return;

      session.started = true;
      suppressClickUntilRef.current = Date.now() + 350;
      event.preventDefault();
      event.stopPropagation();

      const translateX = session.startTranslateX + deltaX;
      const translateY = session.startTranslateY + deltaY;

      applyLiveTranslate(
        session.node,
        translateX,
        translateY,
      );

      syncEditorMediaPreviewForTarget(session.node);
      session.node.style.willChange = "translate";
      document.body.style.cursor = "grabbing";

      refreshSelectionBox();
    };

    const handlePointerUp = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      directDragSessionRef.current = null;
      document.body.style.cursor = "";
      session.node.style.willChange = "";

      if (!session.started) return;

      event.preventDefault();
      event.stopPropagation();

      const translate = getComputedTranslate(session.node);

      suppressClickUntilRef.current = Date.now() + 350;

      commitLayout(session.elementId, {
        position: getStablePosition(session.node),
        translateX: translate.x,
        translateY: translate.y,
        x: translate.x,
        y: translate.y,
      });

      syncEditorMediaPreviewForTarget(session.node);
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
      root.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerUp, true);
      document.body.style.cursor = "";
    };
  }, [
    commitLayout,
    editorAny,
    inlineEditingElementId,
    isEditMode,
    refreshSelectionBox,
  ]);


  const deviceMode = (editorAny.deviceMode || "desktop") as VisualDeviceMode;

  if (!TemplateComponent) {
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
      onMouseMove={editorAny.handleCanvasMouseMove}
      onMouseLeave={editorAny.handleCanvasMouseLeave}
      onContextMenu={editorAny.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>


      {selectionBox ? (
        <div
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
            cursor: pointer;
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
            {templateElement}
          </div>
        </div>
      </div>
    </div>
  );
}
