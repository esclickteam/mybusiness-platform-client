export type ClientPortalRuntimeValues = Record<
  string,
  string | number | boolean | null | undefined
>;

function formatPortalValue(value: string | number | boolean) {
  if (typeof value === "boolean") return value ? "כן" : "לא";
  return String(value);
}

/**
 * Replaces CRM / client-portal placeholders in a published (or preview) DOM.
 *
 * Supports:
 * - [data-client-variable-key="..."] nodes (raw or label-value display)
 * - {{variable_key}} text tokens anywhere under root
 */
export function bindClientPortalVariables(
  root: HTMLElement | null | undefined,
  values: ClientPortalRuntimeValues | null | undefined,
) {
  if (!root || !values || typeof values !== "object") return;

  const entries = Object.entries(values).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  if (!entries.length) return;

  const map = new Map(
    entries.map(([key, value]) => [
      String(key).trim(),
      formatPortalValue(value as string | number | boolean),
    ]),
  );

  root
    .querySelectorAll<HTMLElement>(
      "[data-client-variable-key], [data-client-variable='true'], [data-bizuply-crm-field]",
    )
    .forEach((node) => {
      const key = String(
        node.getAttribute("data-client-variable-key") ||
          node.getAttribute("data-bizuply-crm-field") ||
          "",
      ).trim();
      if (!key || !map.has(key)) return;

      const nextValue = map.get(key) || "";
      const part = String(
        node.getAttribute("data-bizuply-crm-field-part") || "",
      ).trim();
      const display = String(
        node.getAttribute("data-client-variable-display") ||
          (part === "both" ? "label-value" : "raw"),
      ).trim();
      const label = String(
        node.getAttribute("data-client-variable-label") ||
          node.getAttribute("data-bizuply-crm-field-label") ||
          "",
      ).trim();

      if ((display === "label-value" || part === "both") && label) {
        node.textContent = `${label} - ${nextValue}`;
      } else if (part === "label" && label) {
        node.textContent = label;
      } else {
        node.textContent = nextValue;
      }

      // Strip editor-only chip chrome if it leaked into published HTML.
      node.classList.remove(
        "inline-flex",
        "items-center",
        "rounded-full",
        "bg-violet-50",
        "ring-1",
        "ring-violet-100",
      );
      node.style.background = "transparent";
      node.style.boxShadow = "none";
      node.style.border = "none";
      node.style.padding = node.style.padding || "0";
    });

  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  );

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const original = textNode.nodeValue || "";
    if (!original.includes("{{")) return;

    let next = original;
    map.forEach((value, key) => {
      next = next.split(`{{${key}}}`).join(value);
    });

    if (next !== original) {
      textNode.nodeValue = next;
    }
  });
}

/**
 * Resolve portal/CRM values for binding.
 *
 * Personal CRM data must come from the logged-in portal member
 * (`sitePortalMe` → `window.__BIZUPLY_CLIENT_PORTAL_DATA__`).
 * Site/page-level `clientPortalData` is shared across visitors — only use it
 * when `allowSharedFallback` is explicitly enabled (editor/global demos).
 */
export function readClientPortalRuntimeValues(
  site: Record<string, any> | null | undefined,
  page: Record<string, any> | null | undefined,
  options: { allowSharedFallback?: boolean } = {},
): ClientPortalRuntimeValues {
  if (typeof window !== "undefined") {
    const fromWindow = (window as any).__BIZUPLY_CLIENT_PORTAL_DATA__;
    if (fromWindow && typeof fromWindow === "object") {
      return fromWindow as ClientPortalRuntimeValues;
    }
  }

  if (!options.allowSharedFallback) {
    return {};
  }

  const fromSite = site?.clientPortalData || site?.portalData;
  if (fromSite && typeof fromSite === "object") {
    return fromSite as ClientPortalRuntimeValues;
  }

  const fromPage = page?.clientPortalData || page?.portalData;
  if (fromPage && typeof fromPage === "object") {
    return fromPage as ClientPortalRuntimeValues;
  }

  return {};
}
