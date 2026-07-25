export type SmartSearchSettings = {
  isActive?: boolean;
  showTrigger?: boolean;
  triggerPosition?: { x: number; y: number };
  placeholder?: string;
  accentColor?: string;
  showPages?: boolean;
};

export type SiteSearchResult = {
  id: string;
  title: string;
  snippet: string;
  kind: "page" | "section" | "text";
  href?: string;
  elementId?: string;
};

const DEFAULTS: SmartSearchSettings = {
  isActive: true,
  showTrigger: true,
  triggerPosition: { x: 6, y: 12 },
  placeholder: "חיפוש באתר...",
  accentColor: "#2563EB",
  showPages: true,
};

export function mergeSmartSearchSettings(
  stored?: Partial<SmartSearchSettings> | null
): SmartSearchSettings {
  const merged = { ...DEFAULTS, ...(stored || {}) };
  if (!merged.triggerPosition || typeof merged.triggerPosition !== "object") {
    merged.triggerPosition = { ...DEFAULTS.triggerPosition! };
  } else {
    merged.triggerPosition = {
      x: Math.min(96, Math.max(4, Number(merged.triggerPosition.x) || 6)),
      y: Math.min(96, Math.max(4, Number(merged.triggerPosition.y) || 12)),
    };
  }
  return merged;
}

function normalizeText(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function snippetAround(text: string, query: string, max = 90) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const idx = normalizeText(clean).indexOf(normalizeText(query));
  if (idx < 0) return clean.slice(0, max);
  const start = Math.max(0, idx - 24);
  const end = Math.min(clean.length, idx + query.length + 48);
  const chunk = clean.slice(start, end);
  return `${start > 0 ? "…" : ""}${chunk}${end < clean.length ? "…" : ""}`;
}

function assignElementId(el: Element, index: number) {
  const existing = el.getAttribute("data-bizuply-search-id");
  if (existing) return existing;
  const id = `bizuply-search-hit-${index}`;
  el.setAttribute("data-bizuply-search-id", id);
  return id;
}

export function buildSiteSearchIndex(
  pages?: Array<{ id?: string; title?: string; name?: string; slug?: string }>,
  options?: { showPages?: boolean }
): SiteSearchResult[] {
  const results: SiteSearchResult[] = [];
  const seen = new Set<string>();

  function push(result: SiteSearchResult) {
    const key = `${result.kind}:${result.title}:${result.snippet}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(result);
  }

  if (options?.showPages !== false && Array.isArray(pages)) {
    pages.forEach((page) => {
      const title = String(page.title || page.name || "").trim();
      const slug = String(page.slug || page.id || "").trim();
      if (!title) return;
      push({
        id: `page-${slug || title}`,
        title,
        snippet: slug ? `עמוד · ${slug}` : "עמוד באתר",
        kind: "page",
        href: slug.startsWith("/") ? slug : slug ? `/${slug}` : undefined,
      });
    });
  }

  if (typeof document === "undefined") return results;

  const selectors = "h1,h2,h3,h4,h5,h6,p,li,a,button,span[data-visual-text],div[data-visual-text]";
  const nodes = document.querySelectorAll(selectors);
  let index = 0;

  nodes.forEach((node) => {
    if (node.closest("[data-bizuply-smart-search]")) return;
    if (node.closest("script,style,noscript,iframe")) return;

    const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length < 2 || text.length > 400) return;

    const tag = node.tagName.toLowerCase();
    const isHeading = /^h[1-6]$/.test(tag);
    const kind: SiteSearchResult["kind"] = isHeading ? "section" : "text";
    const elementId = assignElementId(node, index++);
    const title = isHeading ? text : text.slice(0, 64);

    push({
      id: elementId,
      title,
      snippet: isHeading ? "כותרת בעמוד" : text.slice(0, 120),
      kind,
      elementId,
    });
  });

  return results;
}

export function filterSiteSearchResults(
  index: SiteSearchResult[],
  query: string,
  limit = 12
): SiteSearchResult[] {
  const q = normalizeText(query);
  if (!q || q.length < 1) return [];

  return index
    .map((item) => {
      const haystack = normalizeText(`${item.title} ${item.snippet}`);
      const idx = haystack.indexOf(q);
      if (idx < 0) return null;
      return {
        ...item,
        snippet:
          item.kind === "text" ? snippetAround(item.snippet, query) : item.snippet,
      };
    })
    .filter(Boolean)
    .slice(0, limit) as SiteSearchResult[];
}

export function scrollToSearchResult(result: SiteSearchResult) {
  if (result.href && result.kind === "page") {
    window.location.href = result.href;
    return;
  }

  if (!result.elementId) return;
  const el = document.querySelector(`[data-bizuply-search-id="${result.elementId}"]`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("bizuply-search-highlight");
  window.setTimeout(() => el.classList.remove("bizuply-search-highlight"), 2200);
}
