export function safeCssSelectorValue(value: string) {
  const clean = String(value || "");

  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(clean);
  }

  return clean.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function getSectionIdFromVisualId(elementId: string) {
  const clean = String(elementId || "").trim();

  if (!clean) return "";

  return clean.split(".")[0] || "";
}

export function getFieldKeyFromVisualId(elementId: string) {
  const clean = String(elementId || "").trim();
  const parts = clean.split(".");

  if (parts.length < 2) return "";

  return parts.slice(1).join(".");
}

export function normalizeFieldKeyForTemplate(
  fieldKey: string,
  elementType?: string,
) {
  const clean = String(fieldKey || "").trim();

  if (!clean) return "";

  if (clean === "button") return "buttonText";
  if (clean === "cta") return "buttonText";
  if (clean === "heading") return "title";
  if (clean === "description") return "subtitle";
  if (clean === "image" || elementType === "image") return clean;

  return clean;
}

export function selectorForVisualElement(elementId: string) {
  const safeId = safeCssSelectorValue(elementId);
  const sectionId = getSectionIdFromVisualId(elementId);

  const selectors = [`[data-visual-edit-id="${safeId}"]`];

  /*
    fallback לסקשן רק כשה-ID באמת מייצג section.
    חשוב לא לתת ל-ID של טקסט כמו hero.text.h1.15 ליפול לסקשן בטעות.
  */
  if (
    sectionId &&
    (elementId.endsWith(".section") ||
      elementId.includes(".section.") ||
      elementId === `${sectionId}.section`)
  ) {
    const safeSectionId = safeCssSelectorValue(sectionId);

    selectors.push(`[data-template-section-id="${safeSectionId}"]`);
    selectors.push(`[data-section-kind="${safeSectionId}"]`);
  }

  return selectors.join(",\n");
}

export function getNodeText(node: HTMLElement | null) {
  if (!node) return "";

  if (node instanceof HTMLInputElement) {
    return String(node.value || node.placeholder || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (node instanceof HTMLTextAreaElement) {
    return String(node.value || node.placeholder || node.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return String(node.textContent || "").replace(/\s+/g, " ").trim();
}

const TEXT_SELECTOR = [
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
].join(",");

const MEDIA_SELECTOR = [
  "img",
  "video",
  "source",
  "picture",
  "[data-image-field]",
  "[data-visual-image-field]",
  "[data-edit-type='image']",
].join(",");

const CONTROL_SELECTOR = ["a", "button", "input", "textarea", "select"].join(
  ",",
);

const STRUCTURE_SELECTOR = [
  "section",
  "article",
  "header",
  "footer",
  "main",
  "nav",
  "aside",
  "form",
].join(",");

const EDITABLE_ATTR_SELECTOR = [
  "[data-visual-editable='true'][data-visual-edit-id]",
  "[data-visual-edit-id]",
].join(",");

function closestInsideRoot(
  target: HTMLElement,
  root: HTMLElement | null | undefined,
  selector: string,
) {
  const node = target.closest<HTMLElement>(selector);

  if (!node) return null;

  if (root && !root.contains(node)) return null;

  return node;
}

function hasUsefulText(node: HTMLElement | null) {
  if (!node) return false;

  return getNodeText(node).length > 0;
}

export function isEditableVisualNode(node: Element | null): node is HTMLElement {
  if (!node || !(node instanceof HTMLElement)) return false;

  return Boolean(
    node.matches("[data-visual-editable='true'], [data-visual-edit-id]") ||
      node.matches("[data-image-field], [data-visual-image-field]") ||
      node.matches("[data-edit-type='image']") ||
      node.matches(
        [
          "img",
          "video",
          "source",
          "a",
          "button",
          "input",
          "textarea",
          "select",
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
        ].join(","),
      ),
  );
}

export function findEditableVisualNode(
  target: EventTarget | null,
  root?: HTMLElement | null,
): HTMLElement | null {
  if (!target || !(target instanceof HTMLElement)) return null;

  /*
    הסדר קריטי:
    לא מתחילים מ-[data-visual-edit-id],
    כי זה עלול לתפוס section/parent במקום הטקסט הפנימי.
  */

  const mediaNode = closestInsideRoot(target, root, MEDIA_SELECTOR);

  if (mediaNode) {
    return mediaNode;
  }

  const controlNode = closestInsideRoot(target, root, CONTROL_SELECTOR);

  if (controlNode) {
    return controlNode;
  }

  const textNode = closestInsideRoot(target, root, TEXT_SELECTOR);

  if (textNode && hasUsefulText(textNode)) {
    return textNode;
  }

  const editableNode = closestInsideRoot(target, root, EDITABLE_ATTR_SELECTOR);

  if (editableNode) {
    return editableNode;
  }

  let current: HTMLElement | null = target;

  while (current && current !== root) {
    if (root && !root.contains(current)) return null;

    const tagName = String(current.tagName || "").toLowerCase();

    if (
      [
        "img",
        "video",
        "source",
        "a",
        "button",
        "input",
        "textarea",
        "select",
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
      ].includes(tagName)
    ) {
      return current;
    }

    if (
      current.getAttribute("data-visual-editable") === "true" ||
      current.getAttribute("data-visual-edit-id")
    ) {
      return current;
    }

    current = current.parentElement;
  }

  const structureNode = closestInsideRoot(target, root, STRUCTURE_SELECTOR);

  if (structureNode) {
    return structureNode;
  }

  return null;
}

export function getVisualElementId(node: HTMLElement | null) {
  return String(
    node?.getAttribute("data-visual-edit-id") ||
      node?.getAttribute("data-image-field") ||
      node?.getAttribute("data-visual-image-field") ||
      "",
  ).trim();
}

export function getVisualElementType(node: HTMLElement | null) {
  if (!node) return "";

  const directType = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      node.getAttribute("data-edit-type") ||
      "",
  )
    .trim()
    .toLowerCase();

  if (directType === "heading" || directType === "paragraph") return "text";
  if (directType === "link") return "button";
  if (
    directType === "video" ||
    directType === "media" ||
    directType === "raw"
  ) {
    return "image";
  }

  if (directType) return directType;

  const tagName = String(node.tagName || "").toLowerCase();

  if (tagName === "img" || tagName === "video" || tagName === "source") {
    return "image";
  }

  if (
    tagName === "a" ||
    tagName === "button" ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  ) {
    return "button";
  }

  if (
    [
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
    ].includes(tagName)
  ) {
    return "text";
  }

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

  if (tagName === "svg" || tagName === "path") {
    return "icon";
  }

  return "box";
}

export function getVisualElementLabel(node: HTMLElement | null) {
  if (!node) return "";

  const attrLabel = String(
    node.getAttribute("data-visual-edit-label") ||
      node.getAttribute("aria-label") ||
      node.getAttribute("alt") ||
      "",
  )
    .replace(/\s+/g, " ")
    .trim();

  if (attrLabel) return attrLabel;

  const type = getVisualElementType(node);
  const tagName = String(node.tagName || "").toLowerCase();

  if (type === "text") {
    const text = getNodeText(node);

    if (text) return text.slice(0, 60);
  }

  if (type === "image") return "תמונה";
  if (type === "button") return "כפתור";
  if (type === "section") return "סקשן";

  return tagName || "";
}