import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { VisualLibraryPageProvider } from "../../runtime/visualLibraryPage";

import {
  applyAllVisualDataToDom,
  markSelectedVisualElementInDom,
  syncEditorMediaPreviewForTarget,
  syncEditorMediaPreviewsInDom,
} from "./utils/visualDomApply";

import { applyMediaFitStyles } from "./utils/visualMediaUtils";
import { resolveFormContext } from "./utils/visualForms";
import {
  applyCustomCodeToDocument,
  injectHtmlIntoElement,
} from "./utils/visualCustomCodeRuntime";
import { readVisualSectionOrder } from "./utils/visualData";
import { syncSitePageTitlesIntoVisualData } from "./utils/syncNavWithSitePages";
import {
  applyVisualSectionOrderToDom,
  didOnlyDomAppliedVisualKeysChange,
  didOnlyVisualSectionOrderChange,
} from "./utils/visualSectionOrder";

import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";

function isMediaDragTarget(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) return false;

  return Boolean(
    node instanceof HTMLImageElement ||
      node instanceof HTMLVideoElement ||
      node.closest(
        "img, video, picture, [data-bizuply-editor-media-preview='true'], [data-visual-edit-type='image'], [data-visual-type='image']",
      ),
  );
}

function isButtonDragTarget(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) return false;

  const tag = String(node.tagName || "").toLowerCase();
  if (tag === "button" || tag === "a") return true;

  const type = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-editable") ||
      "",
  )
    .trim()
    .toLowerCase();

  return type === "button" || type === "link" || type === "control";
}

function disableNativeMediaDrag(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>(
      "img, video, [data-bizuply-editor-media-preview='true']",
    )
    .forEach((node) => {
      if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement) {
        node.draggable = false;
        node.setAttribute("draggable", "false");
      }

      node.style.setProperty("-webkit-user-drag", "none");
      node.style.setProperty("user-select", "none");
    });
}

function setNodeDraggingState(node: HTMLElement, dragging: boolean) {
  if (dragging) {
    node.setAttribute("data-visual-dragging", "true");
    node.style.willChange = "translate, transform";
    node.style.setProperty("transition", "none", "important");
    node.style.setProperty("animation", "none", "important");
    return;
  }

  node.removeAttribute("data-visual-dragging");
  node.style.willChange = "";
  node.style.removeProperty("transition");
  node.style.removeProperty("animation");
}

function syncSelectionBoxElement(
  box: HTMLElement | null,
  node: HTMLElement,
) {
  if (!box) return false;

  const rect = node.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  box.style.top = `${rect.top}px`;
  box.style.left = `${rect.left}px`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
  return true;
}

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

function getDeviceWidth(device: VisualDeviceMode, preview = false) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";
  // Wix-style framed desktop preview (not full bleed)
  if (preview) return "min(1280px, calc(100vw - 96px))";
  return "100%";
}

function getDeviceMaxWidth(device: VisualDeviceMode, preview = false) {
  if (device === "mobile") return "390px";
  if (device === "tablet") return "820px";
  if (preview) return "1280px";
  return "100%";
}

function getPreviewDeviceLabel(device: VisualDeviceMode) {
  if (device === "mobile") return "מובייל · 390px";
  if (device === "tablet") return "טאבלט · 820px";
  return "דסקטופ · 1280px";
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

function normalizeEditableText(value: unknown) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Header nav links / CTAs are typed as "button" but their label text must still
 * be inline-editable. Also allow text-bearing anchors/buttons.
 */
function isInlineTextEditableNode(node: HTMLElement | null) {
  if (!node) return false;
  if (isTextNode(node)) return true;

  const type = getElementType(node);
  const tagName = String(node.tagName || "").toLowerCase();
  const isControl =
    type === "button" ||
    type === "link" ||
    tagName === "a" ||
    tagName === "button" ||
    tagName === "label";

  if (!isControl) return false;

  if (node.querySelector("img, video, svg, input, textarea, select")) {
    return false;
  }

  return Boolean(
    normalizeEditableText(node.innerText || node.textContent || ""),
  );
}

function resolveInlineTextEditTarget(
  node: HTMLElement,
  clickTarget?: HTMLElement | null,
) {
  if (
    clickTarget &&
    node.contains(clickTarget) &&
    isInlineTextEditableNode(clickTarget) &&
    !clickTarget.querySelector(
      "[data-visual-edit-id][data-visual-edit-type='text'], [data-visual-edit-id][data-editable='text']",
    )
  ) {
    return clickTarget;
  }

  const nestedTexts = Array.from(
    node.querySelectorAll<HTMLElement>(
      "[data-visual-editable='true'][data-visual-edit-type='text'], [data-editable='text'], [data-visual-edit-type='text']",
    ),
  ).filter(
    (child) =>
      child !== node &&
      isInlineTextEditableNode(child) &&
      !child.querySelector(
        "[data-visual-edit-id][data-visual-edit-type='text'], [data-visual-edit-id][data-editable='text']",
      ),
  );

  if (nestedTexts.length) {
    if (clickTarget) {
      const hit = nestedTexts.find(
        (child) => child === clickTarget || child.contains(clickTarget),
      );
      if (hit) return hit;
    }

    return nestedTexts[0];
  }

  if (
    isInlineTextEditableNode(node) &&
    !node.querySelector(
      "[data-visual-edit-id][data-visual-edit-type='text'], [data-visual-edit-id][data-editable='text']",
    )
  ) {
    return node;
  }

  return null;
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

function buildDragLayoutPatch(
  node: HTMLElement,
  extra: Record<string, any> = {},
) {
  const translate = getComputedTranslate(node);
  const position = getStablePosition(node);
  const patch: Record<string, any> = {
    position,
    translateX: translate.x,
    translateY: translate.y,
    x: translate.x,
    y: translate.y,
    ...extra,
  };

  if (position === "absolute" || translate.x || translate.y) {
    patch.freePosition = true;
    patch.left = 0;
    patch.top = 0;
    patch.right = "auto";
    patch.bottom = "auto";
  }

  return patch;
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
  const previousTemplateDataRef = useRef<Record<string, any> | null>(null);
  const selectionBoxElRef = useRef<HTMLDivElement | null>(null);
  const isCanvasDraggingRef = useRef(false);
  const [templateEpoch, setTemplateEpoch] = useState(0);
  const [sectionOrderEpoch, setSectionOrderEpoch] = useState(0);
  const [domPatchEpoch, setDomPatchEpoch] = useState(0);

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
          selectedElementId: isPreviewMode ? "" : selectedElementId,
          hoveredElementId: isPreviewMode ? "" : hoveredElementId,
        }) || ""
      );
    }

    return "";
  }, [
    editorAny.runtimeCss,
    editorAny.styles,
    editorAny.animations,
    editorAny.customCode,
    selectedElementId,
    hoveredElementId,
    isPreviewMode,
  ]);

  const customCodeEnabled = editorAny.customCode?.enabled !== false;
  const bodyStartHtml = customCodeEnabled
    ? String(editorAny.customCode?.bodyStartHtml || "").trim()
    : "";
  const bodyEndHtml = customCodeEnabled
    ? String(editorAny.customCode?.bodyEndHtml || "").trim()
    : "";

  const bodyStartRef = useRef<HTMLDivElement | null>(null);
  const bodyEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const start = bodyStartRef.current;
    if (!start) return;
    start.innerHTML = "";
    if (bodyStartHtml) {
      injectHtmlIntoElement(start, bodyStartHtml, {
        allowScripts: isPreviewMode,
      });
    }
  }, [bodyStartHtml, isPreviewMode]);

  useEffect(() => {
    const end = bodyEndRef.current;
    if (!end) return;
    end.innerHTML = "";
    if (bodyEndHtml) {
      injectHtmlIntoElement(end, bodyEndHtml, {
        allowScripts: isPreviewMode,
      });
    }
  }, [bodyEndHtml, isPreviewMode]);

  // Head + custom JS only in preview (so editor tools stay stable)
  useEffect(() => {
    if (!isPreviewMode) {
      return undefined;
    }

    return applyCustomCodeToDocument(
      customCodeEnabled
        ? {
            ...(editorAny.customCode || {}),
            // CSS already live via canvas <style>{runtimeCss}</style>
            css: "",
          }
        : { enabled: false },
      {
        runScripts: true,
      },
    );
  }, [
    isPreviewMode,
    customCodeEnabled,
    editorAny.customCode?.headHtml,
    editorAny.customCode?.javascript,
    editorAny.customCode?.enabled,
    editorAny.customCode?.updatedAt,
  ]);

  // In edit mode: apply head tags (no scripts) + rely on runtimeCss for CSS
  useEffect(() => {
    if (isPreviewMode) {
      return undefined;
    }

    return applyCustomCodeToDocument(
      customCodeEnabled
        ? {
            enabled: true,
            headHtml: String(editorAny.customCode?.headHtml || ""),
            css: "",
            javascript: "",
          }
        : { enabled: false },
      { runScripts: false },
    );
  }, [
    isPreviewMode,
    customCodeEnabled,
    editorAny.customCode?.headHtml,
    editorAny.customCode?.enabled,
    editorAny.customCode?.updatedAt,
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

    /*
      בזמן גרירה מעדכנים רק DOM — בלי setState בכל פריים.
      זה קריטי לכפתורים (יש nested text + runtimeCss על hover).
    */
    if (
      isCanvasDraggingRef.current &&
      syncSelectionBoxElement(selectionBoxElRef.current, node)
    ) {
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

  const paintDragFrame = useCallback(
    (session: DirectDragSession | DragSession, clientX: number, clientY: number) => {
      const deltaX = clientX - session.startX;
      const deltaY = clientY - session.startY;

      if ("mode" in session && session.mode === "resize") {
        return;
      }

      const translateX = session.startTranslateX + deltaX;
      const translateY = session.startTranslateY + deltaY;

      applyLiveTranslate(session.node, translateX, translateY);

      if (isMediaDragTarget(session.node)) {
        syncEditorMediaPreviewForTarget(session.node);
      }

      syncSelectionBoxElement(selectionBoxElRef.current, session.node);
    },
    [],
  );

  /*
    רכיב התבנית ממומו (memoized) כדי שלא ירונדר מחדש בכל שינוי של
    תיבת הבחירה או מצב הגרירה. בלי זה, כל תזוזת עכבר בזמן resize גרמה
    ל-re-render של כל עץ התבנית — ותגית <video> אמיתית "קופצת"/מהבהבת
    בזמן ה-reconciliation, בעוד <img> סטטית לא.

    חשוב: שינוי __sectionOrder בלבד לא מרים מחדש את כל התבנית —
    רק מזיז DOM. זה מה שהופך גרירת בלוקים לחלקה כמו Wix.
  */
  useEffect(() => {
    const previous = previousTemplateDataRef.current;
    const next = (editorAny.data || {}) as Record<string, any>;
    const onlySectionOrder = didOnlyVisualSectionOrderChange(
      previous,
      next,
    );
    const onlyDomPatch = didOnlyDomAppliedVisualKeysChange(
      previous,
      next,
    );

    previousTemplateDataRef.current = next;

    if (onlySectionOrder) {
      setSectionOrderEpoch((value) => value + 1);
      return;
    }

    if (onlyDomPatch) {
      setDomPatchEpoch((value) => value + 1);
      return;
    }

    setTemplateEpoch((value) => value + 1);
  }, [editorAny.data]);

  /*
    Page renames update sitePages without always changing visual data shape
    enough for the data-effect above — force a live header/footer refresh.
  */
  const sitePagesTitleSignature = useMemo(
    () =>
      JSON.stringify(
        (Array.isArray(editorAny.sitePages) ? editorAny.sitePages : []).map(
          (page: any) => ({
            id: page?.id || "",
            title: page?.title || page?.name || "",
            slug: page?.slug || "",
          }),
        ),
      ),
    [editorAny.sitePages],
  );

  useEffect(() => {
    setTemplateEpoch((value) => value + 1);
    setDomPatchEpoch((value) => value + 1);
  }, [sitePagesTitleSignature]);

  const templateElement = useMemo(() => {
    if (!TemplateComponent) return null;

    const activePageId = String(
      editorAny.activePageId || editorAny.activePageID || "home",
    ).trim() || "home";

    const sitePages = Array.isArray(editorAny.sitePages)
      ? editorAny.sitePages
      : [];

    const templateData = {
      ...((editorAny.data as Record<string, any>) || {}),
      __sitePages: sitePages,
      __previousSitePageTitles:
        (editorAny.previousSitePageTitles as Record<string, string>) || {},
    };

    return (
      <VisualLibraryPageProvider pageId={activePageId} data={templateData}>
        <TemplateComponent
          data={templateData}
          mode={isPreviewMode ? "preview" : "edit"}
          businessId={editorAny.businessId}
          activePageId={activePageId}
          initialPage={activePageId}
          initialPageId={activePageId}
          currentPageId={activePageId}
          pageId={activePageId}
          page={activePageId}
          isStudioStatic={false}
          onPageChange={(nextPageId: string) => {
            const id = String(nextPageId || "").trim();
            if (!id) return;
            if (typeof editorAny.onSelectSitePage === "function") {
              editorAny.onSelectSitePage(
                id,
                (editorAny.data as Record<string, any>) || {},
              );
            }
          }}
        />
      </VisualLibraryPageProvider>
    );
    // templateEpoch gates remounts; section-order-only updates skip it on purpose.
    // onPageChange reads editorAny.data at click-time, so data is not a memo dep.
  }, [
    TemplateComponent,
    templateEpoch,
    editorAny.businessId,
    editorAny.activePageId,
    editorAny.activePageID,
    editorAny.onSelectSitePage,
    editorAny.sitePages,
    editorAny.data,
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
      if (!elementId || !isInlineTextEditableNode(node)) return;

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
      node.style.setProperty("user-select", "text", "important");
      node.style.setProperty("-webkit-user-select", "text", "important");

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
    if (!root || !sectionOrderEpoch) return;
    if (inlineEditingElementId || editorAny.isInlineEditing) return;

    const activePageId = String(
      editorAny.activePageId || editorAny.activePageID || "home",
    ).trim() || "home";

    applyVisualSectionOrderToDom(
      root,
      readVisualSectionOrder(editorAny.data || {}),
      activePageId,
    );
    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    sectionOrderEpoch,
    editorAny.activePageId,
    editorAny.activePageID,
    editorAny.data,
    editorAny.isInlineEditing,
    inlineEditingElementId,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !domPatchEpoch) return;
    if (inlineEditingElementId || editorAny.isInlineEditing) return;

    const syncedData = syncSitePageTitlesIntoVisualData(
      editorAny.data || {},
      Array.isArray(editorAny.sitePages) ? editorAny.sitePages : [],
    );
    applyAllVisualDataToDom(root, syncedData);
    syncEditorMediaPreviewsInDom(root);
    disableNativeMediaDrag(root);
    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    domPatchEpoch,
    editorAny.data,
    editorAny.sitePages,
    editorAny.isInlineEditing,
    inlineEditingElementId,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const activePageId = String(
      editorAny.activePageId || editorAny.activePageID || "home",
    ).trim() || "home";
    root.setAttribute("data-visual-page-id", activePageId);

    if (!inlineEditingElementId && !editorAny.isInlineEditing) {
      const syncedData = syncSitePageTitlesIntoVisualData(
        editorAny.data || {},
        Array.isArray(editorAny.sitePages) ? editorAny.sitePages : [],
      );
      applyAllVisualDataToDom(root, syncedData);
      syncEditorMediaPreviewsInDom(root);
      disableNativeMediaDrag(root);
    }

    markSelectedVisualElementInDom(
      root,
      selectedElementId,
      hoveredElementId,
    );

    window.requestAnimationFrame(refreshSelectionBox);
  }, [
    templateEpoch,
    editorAny.activePageId,
    editorAny.activePageID,
    editorAny.data,
    editorAny.sitePages,
    editorAny.isInlineEditing,
    inlineEditingElementId,
    refreshSelectionBox,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || isCanvasDraggingRef.current) return;

    markSelectedVisualElementInDom(
      root,
      selectedElementId,
      hoveredElementId,
    );
  }, [selectedElementId, hoveredElementId]);

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

      // Nested Site Menu links must navigate — don't steal the click for selection
      if (target.closest('[data-bizuply-nav-submenu="true"] a, [data-bizuply-nav-submenu="true"] button')) {
        return;
      }

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

      const selectedNode =
        selected.node instanceof HTMLElement ? selected.node : target;

      const formRoot = editorAny.canvasRef?.current || null;
      const formContext = resolveFormContext(selectedNode, formRoot);

      if (formContext) {
        editorAny.openFormBuilder?.(selectedNode);
        return;
      }

      if (String(selected.type || "") === "image") {
        editorAny.openMediaModal?.(selected.id, "change");
        return;
      }

      /*
        Header titles are often a box/h1 wrapper around a text child.
        Nav items are typed as button/link but still need label editing.
        Prefer the nested text target; never open link settings on dblclick
        when the control itself has editable text.
      */
      const textTarget = resolveInlineTextEditTarget(selectedNode, target);

      if (textTarget) {
        const textId =
          textTarget.getAttribute("data-visual-edit-id") ||
          selected.id;

        startInlineEdit(
          textTarget,
          textId,
          event.clientX,
          event.clientY,
        );
        return;
      }

      if (String(selected.type || "") === "button") {
        editorAny.openLinkSettings?.(selected.id);
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
      isCanvasDraggingRef.current = true;
      setNodeDraggingState(node, true);
      editorAny.setHoveredElementId?.("");

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
      isCanvasDraggingRef.current = true;
      setNodeDraggingState(node, true);
      editorAny.setHoveredElementId?.("");

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
          paintDragFrame(session, event.clientX, event.clientY);
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
        if (isMediaDragTarget(session.node)) {
          syncEditorMediaPreviewForTarget(session.node);
        }
        syncSelectionBoxElement(selectionBoxElRef.current, session.node);
      });

      event.preventDefault();
      event.stopPropagation();
    },
    [paintDragFrame],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session) return;

      window.cancelAnimationFrame(animationFrameRef.current);

      const rect = session.node.getBoundingClientRect();

      suppressClickUntilRef.current = Date.now() + 350;
      isCanvasDraggingRef.current = false;
      setNodeDraggingState(session.node, false);

      if (session.mode === "move") {
        commitLayout(
          session.elementId,
          buildDragLayoutPatch(session.node),
        );
      } else {
        const liveWidth =
          Number.parseFloat(
            session.node.style.getPropertyValue("width"),
          ) || rect.width;

        const liveHeight =
          Number.parseFloat(
            session.node.style.getPropertyValue("height"),
          ) || rect.height;

        commitLayout(
          session.elementId,
          buildDragLayoutPatch(session.node, {
            width: `${Math.round(liveWidth)}px`,
            height: `${Math.round(liveHeight)}px`,
          }),
        );
      }

      if (isMediaDragTarget(session.node)) {
        syncEditorMediaPreviewForTarget(session.node);
      }
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

      // Let nested Site Menu links receive the click (navigate / follow href)
      if (
        event.target.closest(
          '[data-bizuply-nav-submenu="true"] a, [data-bizuply-nav-submenu="true"] button',
        )
      ) {
        return;
      }

      const selected = editorAny.selectNode?.(event.target);
      const node =
        selected?.node instanceof HTMLElement
          ? selected.node
          : getSelectedNode(editorAny, root);
      const elementId = String(selected?.id || getElementId(node)).trim();

      if (!node || !elementId || Boolean(editorAny.locked?.[elementId])) {
        return;
      }

      /*
        דפדפנים מפעילים HTML5 drag על img/video — זה חוסם את הגרירה שלנו.
        כפתורים גם מקבלים preventDefault כדי למנוע focus/active שמכבידים.
      */
      if (isMediaDragTarget(event.target) || isMediaDragTarget(node)) {
        event.preventDefault();
        disableNativeMediaDrag(root);
      }

      if (isButtonDragTarget(event.target) || isButtonDragTarget(node)) {
        event.preventDefault();
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

      if (!session.started && Math.hypot(deltaX, deltaY) < 3) return;

      if (!session.started) {
        session.started = true;
        isCanvasDraggingRef.current = true;
        setNodeDraggingState(session.node, true);
        editorAny.setHoveredElementId?.("");
        document.body.style.cursor = "grabbing";
      }

      suppressClickUntilRef.current = Date.now() + 350;
      event.preventDefault();
      event.stopPropagation();

      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = window.requestAnimationFrame(() => {
        paintDragFrame(session, event.clientX, event.clientY);
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      const session = directDragSessionRef.current;
      if (!session) return;

      window.cancelAnimationFrame(animationFrameRef.current);
      directDragSessionRef.current = null;
      document.body.style.cursor = "";
      isCanvasDraggingRef.current = false;
      setNodeDraggingState(session.node, false);

      if (!session.started) return;

      event.preventDefault();
      event.stopPropagation();

      suppressClickUntilRef.current = Date.now() + 350;

      commitLayout(
        session.elementId,
        buildDragLayoutPatch(session.node),
      );

      if (isMediaDragTarget(session.node)) {
        syncEditorMediaPreviewForTarget(session.node);
      }
      refreshSelectionBox();
    };

    const handleNativeDragStart = (event: DragEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!isMediaDragTarget(event.target) && !isButtonDragTarget(event.target)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    root.addEventListener("pointerdown", handlePointerDown, true);
    root.addEventListener("dragstart", handleNativeDragStart, true);
    window.addEventListener("pointermove", handlePointerMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);

    disableNativeMediaDrag(root);

    return () => {
      root.removeEventListener("pointerdown", handlePointerDown, true);
      root.removeEventListener("dragstart", handleNativeDragStart, true);
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
    paintDragFrame,
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

          <h2 className="mt-3 text-2xl font-black text-slate-800">
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
        "visual-editor-scroll-area h-full overflow-y-auto overflow-x-hidden",
        isPreviewMode ? "bg-slate-300/90" : "bg-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseMove={(event) => {
        /*
          בזמן גרירה לא מחשבים hover — אחרת בכפתורים ה-hover קופץ
          בין הכפתור לטקסט הפנימי ובונה runtimeCss מחדש בכל פריים.
        */
        if (
          isCanvasDraggingRef.current ||
          directDragSessionRef.current?.started ||
          dragSessionRef.current
        ) {
          return;
        }
        editorAny.handleCanvasMouseMove?.(event);
      }}
      onMouseLeave={editorAny.handleCanvasMouseLeave}
      onContextMenu={editorAny.handleCanvasContextMenu}
    >
      <style>{runtimeCss}</style>


      {selectionBox ? (
        <div
          ref={selectionBoxElRef}
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
            willChange: "top, left, width, height",
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
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-editor-layer="orbit"] {
            pointer-events: auto !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] img,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] video,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-bizuply-editor-media-preview="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] img[data-visual-editable="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] video[data-visual-editable="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-editor-layer="orbit"] [data-visual-editable="true"] {
            pointer-events: auto !important;
            cursor: grab !important;
            -webkit-user-drag: none !important;
            user-select: none !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] img:active,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] video:active,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-bizuply-editor-media-preview="true"]:active {
            cursor: grabbing !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-dragging="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-dragging="true"] * {
            transition: none !important;
            animation: none !important;
            cursor: grabbing !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] button:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] a[data-visual-edit-type="button"]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-type="button"]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-editable="button"]:not([data-visual-inline-editing="true"]) {
            cursor: grab !important;
            -webkit-user-drag: none !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-edit-id] {
            cursor: pointer;
          }

          /* Header / nav: grab cursor so drag affordance matches body elements */
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] header [data-visual-edit-id]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [role="banner"] [data-visual-edit-id]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-section-kind="header"] [data-visual-edit-id]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-section-type="header"] [data-visual-edit-id]:not([data-visual-inline-editing="true"]),
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-flow-lock="true"] [data-visual-edit-id]:not([data-visual-inline-editing="true"]) {
            cursor: grab !important;
            touch-action: none;
          }

          /* Contact/lead forms: keep children draggable outside the card bounds */
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-builder="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-id],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="lead-form"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="subscribe-form"] {
            position: relative !important;
            overflow: visible !important;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-builder="true"] [data-visual-edit-id],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-id] [data-visual-edit-id],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="lead-form"] [data-visual-edit-id],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="subscribe-form"] [data-visual-edit-id],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-bizuply-form-field-wrapper="true"],
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] .ido-form-field-slot {
            cursor: grab;
            touch-action: none;
          }

          /*
            Form controls stay non-interactive in edit mode so the field slot /
            wrapper receives selection + drag (same pattern as Ido FormFieldSlot).
          */
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-builder="true"] input,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-builder="true"] textarea,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-builder="true"] select,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-id] input,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-id] textarea,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-form-id] select,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="lead-form"] input,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="lead-form"] textarea,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] form[data-bizuply-block="lead-form"] select,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] .ido-form-field-slot input,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] .ido-form-field-slot textarea,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] .ido-form-field-slot select,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] .ido-form-field-slot button {
            pointer-events: none;
          }

          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-visual-section-key]:hover,
          [data-visual-template-canvas="true"][data-visual-editor-mode="edit"] [data-template-section-id]:hover {
            outline: 2px dashed rgba(124, 58, 237, 0.35);
            outline-offset: -2px;
            transition: outline-color 160ms ease;
          }

          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] [contenteditable="true"] {
            cursor: text !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            caret-color: #7c3aed !important;
            outline: 2px solid #7c3aed !important;
            outline-offset: 4px !important;
          }

          /* Keep single-line header/nav labels from reflowing siblings while typing */
          [data-visual-template-canvas="true"] [data-visual-inline-editing="true"]:not(header *):not([data-section-kind="header"] *):not([data-visual-flow-lock="true"] *),
          [data-visual-template-canvas="true"] [contenteditable="true"]:not(header *):not([data-section-kind="header"] *):not([data-visual-flow-lock="true"] *) {
            white-space: pre-wrap !important;
          }

          [data-visual-template-canvas="true"] header [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] header [contenteditable="true"],
          [data-visual-template-canvas="true"] [data-section-kind="header"] [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] [data-section-kind="header"] [contenteditable="true"],
          [data-visual-template-canvas="true"] [data-visual-flow-lock="true"] [data-visual-inline-editing="true"],
          [data-visual-template-canvas="true"] [data-visual-flow-lock="true"] [contenteditable="true"] {
            white-space: nowrap !important;
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

      <div
        className={[
          "mx-auto min-h-full",
          isPreviewMode
            ? "flex flex-col items-center px-4 pb-10 pt-8 lg:px-8"
            : "px-3 pb-8 pt-28 lg:px-6",
        ].join(" ")}
      >
        {isPreviewMode ? (
          <div className="mb-4 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-black text-slate-600 shadow-sm backdrop-blur">
            <span>תצוגה מקדימה</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{getPreviewDeviceLabel(deviceMode)}</span>
          </div>
        ) : null}

        <div
          className={[
            "mx-auto overflow-hidden bg-white shadow-[0_24px_90px_rgba(15,23,42,0.18)] transition-all duration-300",
            isPreviewMode || deviceMode !== "desktop"
              ? "rounded-[28px] ring-1 ring-black/10"
              : "",
            isPreviewMode ? "max-h-[calc(100vh-170px)] overflow-y-auto" : "min-h-[720px] overflow-visible",
          ].join(" ")}
          style={{
            width: getDeviceWidth(deviceMode, isPreviewMode),
            maxWidth: getDeviceMaxWidth(deviceMode, isPreviewMode),
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
            {bodyStartHtml ? (
              <div
                ref={bodyStartRef}
                data-bizuply-custom-body-start="true"
              />
            ) : null}

            {templateElement}

            {bodyEndHtml ? (
              <div
                ref={bodyEndRef}
                data-bizuply-custom-body-end="true"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
