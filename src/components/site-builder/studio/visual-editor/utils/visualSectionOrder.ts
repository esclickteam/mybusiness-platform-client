export type VisualSectionOrderMap = Record<string, string[]>;

export type VisualSectionItem = {
  id: string;
  key: string;
  label: string;
  pinned: boolean;
  inserted: boolean;
  elementId: string;
};

const SECTION_CHILD_SELECTOR = [
  ":scope > section",
  ":scope > header",
  ":scope > footer",
  ":scope > nav",
  ':scope > [data-template-section-id]',
  ':scope > [data-section-kind]',
  ':scope > [data-visual-inserted-section="true"]',
  ':scope > [data-bizuply-block="section"]',
  ':scope > [data-visual-edit-type="section"]',
  ':scope > [data-studio-section-id]',
].join(", ");

const PARENT_CANDIDATE_SELECTOR = [
  "main",
  '[data-bizuply-site="true"]',
  '[data-studio-page="true"]',
  "[data-template-page-id]",
  "[data-visual-page-root]",
  "[data-template-id]",
].join(", ");

function normalizeKey(value: unknown) {
  return String(value || "").trim();
}

function isEditorOnlyNode(node: HTMLElement | null) {
  if (!node) return true;

  return Boolean(
    node.closest(
      "[data-editor-only], [data-bizuply-editor-only], [data-bizuply-custom-body-start], [data-bizuply-custom-body-end]",
    ),
  );
}

function deriveSectionLabel(node: HTMLElement, fallback: string) {
  const explicit = normalizeKey(
    node.getAttribute("data-section-title") ||
      node.getAttribute("data-visual-edit-label") ||
      node.getAttribute("aria-label") ||
      node.getAttribute("data-template-section-id"),
  );

  if (explicit) return explicit;

  const heading = node.querySelector<HTMLElement>("h1, h2, h3, h4");
  const headingText = normalizeKey(heading?.textContent || "").slice(0, 42);
  if (headingText) return headingText;

  const tag = String(node.tagName || "section").toLowerCase();
  if (tag === "header") return "כותרת עליונה";
  if (tag === "footer") return "פוטר";
  if (tag === "nav") return "ניווט";

  return fallback || "בלוק";
}

export function isPinnedVisualSection(node: HTMLElement) {
  const tag = String(node.tagName || "").toLowerCase();
  if (tag === "header" || tag === "footer" || tag === "nav") return true;

  const identity = normalizeKey(
    node.getAttribute("data-visual-section-key") ||
      node.getAttribute("data-template-section-id") ||
      node.getAttribute("data-section-kind") ||
      node.getAttribute("data-visual-edit-id") ||
      "",
  ).toLowerCase();

  return /(?:^|[-_.])(header|footer|navbar|nav|site-header|site-footer)(?:$|[-_.])/.test(
    identity,
  );
}

function getDirectSectionChildren(parent: HTMLElement) {
  return Array.from(
    parent.querySelectorAll<HTMLElement>(SECTION_CHILD_SELECTOR),
  ).filter((node) => {
    if (!(node instanceof HTMLElement)) return false;
    if (node.parentElement !== parent) return false;
    if (isEditorOnlyNode(node)) return false;
    return true;
  });
}

export function resolveVisualSectionPageId(
  root: HTMLElement | null,
  fallbackPageId = "home",
) {
  if (!root) return normalizeKey(fallbackPageId) || "home";

  return (
    normalizeKey(root.getAttribute("data-visual-page-id")) ||
    normalizeKey(
      root
        .querySelector<HTMLElement>("[data-template-page-id]")
        ?.getAttribute("data-template-page-id"),
    ) ||
    normalizeKey(root.getAttribute("data-template-page-id")) ||
    normalizeKey(root.getAttribute("data-page-id")) ||
    normalizeKey(fallbackPageId) ||
    "home"
  );
}

export function ensureVisualSectionKey(
  node: HTMLElement,
  fallbackIndex: number,
) {
  const existing = normalizeKey(
    node.getAttribute("data-visual-section-key"),
  );
  if (existing) return existing;

  const explicit = normalizeKey(
    node.getAttribute("data-template-section-id") ||
      (node.getAttribute("data-visual-inserted-section") === "true"
        ? node.getAttribute("data-visual-edit-id")
        : "") ||
      node.getAttribute("data-visual-edit-id") ||
      node.getAttribute("data-section-kind") ||
      node.getAttribute("data-studio-section-id"),
  );

  const key = explicit || `native-${fallbackIndex}`;
  node.setAttribute("data-visual-section-key", key);

  if (!normalizeKey(node.getAttribute("data-template-section-id"))) {
    node.setAttribute("data-template-section-id", key);
  }

  if (!normalizeKey(node.getAttribute("data-section-kind"))) {
    node.setAttribute("data-section-kind", key);
  }

  const elementId = normalizeKey(node.getAttribute("data-visual-edit-id"));
  if (!elementId) {
    const nextId = key.endsWith(".section") ? key : `${key}.section`;
    node.setAttribute("data-visual-edit-id", nextId);
    node.setAttribute("data-visual-editable", "true");
    node.setAttribute("data-visual-edit-type", "section");
    node.setAttribute("data-visual-type", "section");
  } else if (!normalizeKey(node.getAttribute("data-visual-edit-type"))) {
    node.setAttribute("data-visual-edit-type", "section");
    node.setAttribute("data-visual-type", "section");
    node.setAttribute("data-visual-editable", "true");
  }

  const label = deriveSectionLabel(node, key);
  if (!normalizeKey(node.getAttribute("data-visual-edit-label"))) {
    node.setAttribute("data-visual-edit-label", label);
  }
  if (!normalizeKey(node.getAttribute("data-section-title"))) {
    node.setAttribute("data-section-title", label);
  }

  return key;
}

export function collectVisualSectionGroups(root: HTMLElement | null) {
  if (!root) return [] as Array<{ parent: HTMLElement; sections: HTMLElement[] }>;

  const parents = new Set<HTMLElement>();
  parents.add(root);

  root
    .querySelectorAll<HTMLElement>(PARENT_CANDIDATE_SELECTOR)
    .forEach((node) => {
      parents.add(node);

      Array.from(node.children).forEach((child) => {
        if (child instanceof HTMLElement) parents.add(child);
      });
    });

  const groups: Array<{ parent: HTMLElement; sections: HTMLElement[] }> = [];
  const claimed = new WeakSet<HTMLElement>();

  Array.from(parents).forEach((parent) => {
    if (claimed.has(parent)) return;

    const sections = getDirectSectionChildren(parent);
    if (sections.length < 2) return;

    const overlapsClaimed = sections.some((section) => claimed.has(section));
    if (overlapsClaimed) return;

    sections.forEach((section) => claimed.add(section));
    groups.push({ parent, sections });
  });

  return groups;
}

export function collectVisualSectionItems(
  root: HTMLElement | null,
): VisualSectionItem[] {
  if (!root) return [];

  const items: VisualSectionItem[] = [];
  const seen = new Set<string>();

  collectVisualSectionGroups(root).forEach((group) => {
    group.sections.forEach((node, index) => {
      const key = ensureVisualSectionKey(node, index);
      if (seen.has(key)) return;
      seen.add(key);

      const elementId = normalizeKey(
        node.getAttribute("data-visual-edit-id") || key,
      );

      items.push({
        id: key,
        key,
        label: deriveSectionLabel(node, key),
        pinned: isPinnedVisualSection(node),
        inserted:
          node.getAttribute("data-visual-inserted-section") === "true",
        elementId,
      });
    });
  });

  return items;
}

function mergeOrder(currentKeys: string[], preferredOrder: string[]) {
  const available = new Set(currentKeys);
  const next: string[] = [];

  preferredOrder.forEach((key) => {
    const normalized = normalizeKey(key);
    if (!normalized || !available.has(normalized) || next.includes(normalized)) {
      return;
    }
    next.push(normalized);
  });

  currentKeys.forEach((key) => {
    if (!next.includes(key)) next.push(key);
  });

  return next;
}

function reorderGroup(
  parent: HTMLElement,
  sections: HTMLElement[],
  preferredOrder: string[],
) {
  const keyed = sections.map((node, index) => {
    const key = ensureVisualSectionKey(node, index);
    return { node, key, pinned: isPinnedVisualSection(node) };
  });

  const movableKeys = keyed
    .filter((item) => !item.pinned)
    .map((item) => item.key);

  const desiredMovable = mergeOrder(movableKeys, preferredOrder);
  const nodeByKey = new Map(keyed.map((item) => [item.key, item.node]));
  const movableNodes = desiredMovable
    .map((key) => nodeByKey.get(key))
    .filter((node): node is HTMLElement => Boolean(node));

  let movableIndex = 0;
  const nextOrder: HTMLElement[] = [];

  keyed.forEach((item) => {
    if (item.pinned) {
      nextOrder.push(item.node);
      return;
    }

    const nextNode = movableNodes[movableIndex++];
    if (nextNode) nextOrder.push(nextNode);
  });

  while (movableIndex < movableNodes.length) {
    nextOrder.push(movableNodes[movableIndex++]);
  }

  const unchanged = nextOrder.every(
    (node, index) => sections[index] === node,
  );
  if (unchanged) return desiredMovable;

  const sectionSet = new Set(nextOrder);
  const originalChildren = Array.from(parent.children);
  let beforeCount = 0;

  for (const child of originalChildren) {
    if (sectionSet.has(child as HTMLElement)) break;
    beforeCount += 1;
  }

  const fragment = parent.ownerDocument.createDocumentFragment();
  nextOrder.forEach((node) => {
    fragment.appendChild(node);
  });

  const remaining = Array.from(parent.children);
  const reference = remaining[beforeCount] || null;
  parent.insertBefore(fragment, reference);

  return desiredMovable;
}

export function applyVisualSectionOrderToDom(
  root: HTMLElement | null,
  orderByPage: VisualSectionOrderMap | string[] | null | undefined,
  pageId = "home",
) {
  if (!root) return;

  const resolvedPageId = resolveVisualSectionPageId(root, pageId);
  const preferredOrder = Array.isArray(orderByPage)
    ? orderByPage
    : Array.isArray(orderByPage?.[resolvedPageId])
      ? orderByPage[resolvedPageId]
      : [];

  collectVisualSectionGroups(root).forEach((group) => {
    group.sections.forEach((node, index) => {
      ensureVisualSectionKey(node, index);
    });

    if (preferredOrder.length) {
      reorderGroup(group.parent, group.sections, preferredOrder);
    }
  });
}

export function buildNextSectionOrder(
  currentItems: VisualSectionItem[],
  activeId: string,
  overId: string,
) {
  const movable = currentItems.filter((item) => !item.pinned);
  const keys = movable.map((item) => item.key);
  const from = keys.indexOf(normalizeKey(activeId));
  const to = keys.indexOf(normalizeKey(overId));

  if (from < 0 || to < 0 || from === to) {
    return keys;
  }

  const next = [...keys];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function moveSectionKey(
  currentItems: VisualSectionItem[],
  sectionKey: string,
  direction: "up" | "down",
) {
  const movable = currentItems.filter((item) => !item.pinned);
  const keys = movable.map((item) => item.key);
  const index = keys.indexOf(normalizeKey(sectionKey));

  if (index < 0) return keys;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= keys.length) return keys;

  const next = [...keys];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}
