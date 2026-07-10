export function safeCssSelectorValue(value: string) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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

  if (elementId.endsWith(".section") && sectionId) {
    const safeSectionId = safeCssSelectorValue(sectionId);

    selectors.push(`[data-template-section-id="${safeSectionId}"]`);
    selectors.push(`[data-section-kind="${safeSectionId}"]`);
  }

  return selectors.join(",\n");
}

export function getNodeText(node: HTMLElement | null) {
  return String(node?.textContent || "").replace(/\s+/g, " ").trim();
}

export function isEditableVisualNode(node: Element | null): node is HTMLElement {
  if (!node || !(node instanceof HTMLElement)) return false;

  return node.matches('[data-visual-editable="true"], [data-visual-edit-id]');
}

export function findEditableVisualNode(
  target: EventTarget | null,
  root?: HTMLElement | null,
): HTMLElement | null {
  if (!target || !(target instanceof HTMLElement)) return null;

  const editable = target.closest<HTMLElement>(
    '[data-visual-editable="true"], [data-visual-edit-id]',
  );

  if (!editable) return null;

  if (root && !root.contains(editable)) return null;

  return editable;
}

export function getVisualElementId(node: HTMLElement | null) {
  return String(node?.getAttribute("data-visual-edit-id") || "").trim();
}

export function getVisualElementType(node: HTMLElement | null) {
  return String(node?.getAttribute("data-visual-edit-type") || "").trim();
}

export function getVisualElementLabel(node: HTMLElement | null) {
  return String(
    node?.getAttribute("data-visual-edit-label") ||
      node?.getAttribute("aria-label") ||
      node?.getAttribute("alt") ||
      node?.textContent ||
      "",
  )
    .replace(/\s+/g, " ")
    .trim();
}