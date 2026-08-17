function attr(node: HTMLElement | null, name: string) {
  return String(node?.getAttribute(name) || "").trim();
}

function isTransientVisualNode(node: HTMLElement) {
  return (
    node.getAttribute("data-visual-rich-paint") === "true" ||
    node.getAttribute("data-visual-inline-mark") === "true" ||
    node.getAttribute("data-visual-element-link") === "true"
  );
}

export function resolvePersistedVisualId(
  node: HTMLElement | null,
  fallback = "",
) {
  let current = node;
  let autoFallback = "";

  while (current) {
    const id = attr(current, "data-visual-edit-id");
    if (id && !isTransientVisualNode(current)) {
      if (current.getAttribute("data-visual-auto-id") !== "true") {
        return id;
      }
      if (!autoFallback) autoFallback = id;
    }
    current = current.parentElement;
  }

  return autoFallback || String(fallback || "").trim();
}
