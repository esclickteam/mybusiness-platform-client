import type { ComponentType } from "react";

import { withTemplateResponsiveCss } from "./shared/templateResponsiveCss";
import type {
  StudioTemplateEditorMode,
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";

/**
 * Lazy template loader — one template chunk at a time via Vite import.meta.glob.
 * Replaces eager registry imports that pulled ~15MB / 200+ templates into every
 * public-site and gallery bundle.
 */

const metaModules = import.meta.glob("./*/meta.ts");

const rendererCache = new Map<string, StudioTemplateRenderer>();
const inflight = new Map<string, Promise<StudioTemplateRenderer | null>>();

function normalizeTemplateKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function normalizeSlug(value: string | null | undefined) {
  const clean = String(value || "").trim();
  if (!clean || clean === "/") return "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

function normalizeRendererPages(
  pages: ReadonlyArray<any> | undefined,
): StudioTemplateRendererPage[] {
  if (!Array.isArray(pages) || pages.length === 0) {
    return [{ id: "home", name: "בית", slug: "/" }];
  }

  return pages.map((page, index) => {
    const id = String(page?.id || `page-${index + 1}`);
    const name = String(page?.name || page?.label || page?.title || id);
    const rawSlug =
      page?.slug || page?.path || page?.href || (id === "home" ? "/" : id);
    return { id, name, slug: normalizeSlug(rawSlug) };
  });
}

function buildKeyToMetaPath() {
  const map = new Map<string, string>();
  for (const path of Object.keys(metaModules)) {
    // "./justora/meta.ts" or "./Servora/meta.ts"
    const folder = path.replace(/^\.\//, "").split("/")[0] || "";
    if (!folder) continue;
    map.set(folder.toLowerCase(), path);
  }
  return map;
}

const keyToMetaPath = buildKeyToMetaPath();

function createRenderer(partial: {
  key: string;
  name: string;
  Component: ComponentType<any>;
  pages?: ReadonlyArray<any>;
  editorMode?: StudioTemplateEditorMode;
  schema?: StudioTemplateRenderer["schema"];
  defaultData?: StudioTemplateRenderer["defaultData"];
  editorCss?: string;
}): StudioTemplateRenderer {
  return {
    key: normalizeTemplateKey(partial.key),
    name: partial.name,
    Component: partial.Component,
    pages: normalizeRendererPages(partial.pages),
    editorMode: partial.editorMode || "visual-react",
    schema: partial.schema,
    defaultData: partial.defaultData,
    editorCss: withTemplateResponsiveCss(partial.editorCss),
  };
}

function definitionToRenderer(
  def: any,
  fallbackKey: string,
): StudioTemplateRenderer | null {
  if (!def || typeof def !== "object") return null;

  const fromRenderer = def.renderer && typeof def.renderer === "object"
    ? def.renderer
    : null;

  const Component =
    fromRenderer?.Component ||
    fromRenderer?.component ||
    def.Component ||
    def.component ||
    null;

  if (!Component) return null;

  const key = normalizeTemplateKey(
    fromRenderer?.key || def.key || def.id || fallbackKey,
  );
  const name = String(fromRenderer?.name || def.name || def.title || key);
  const pages = fromRenderer?.pages || def.pages || def.seed?.pages;
  const editorMode =
    (fromRenderer?.editorMode as StudioTemplateEditorMode) ||
    (def.editorMode as StudioTemplateEditorMode) ||
    "visual-react";
  const schema = fromRenderer?.schema || def.schema;
  const defaultData =
    fromRenderer?.defaultData ||
    def.defaultData ||
    def.seed?.defaultData ||
    def.seed?.data;
  const editorCss =
    fromRenderer?.editorCss || def.editorCss || def.seed?.css || "";

  return createRenderer({
    key,
    name,
    Component,
    pages,
    editorMode,
    schema,
    defaultData: defaultData as Record<string, any> | undefined,
    editorCss: String(editorCss || ""),
  });
}

function pickTemplateExport(mod: Record<string, unknown>, key: string) {
  const wanted = normalizeTemplateKey(key);
  const values = Object.values(mod);

  for (const value of values) {
    if (!value || typeof value !== "object") continue;
    const id = normalizeTemplateKey((value as any).id || (value as any).key);
    if (id && id === wanted) return value;
  }

  for (const value of values) {
    if (!value || typeof value !== "object") continue;
    if ((value as any).renderer?.Component || (value as any).Component) {
      return value;
    }
  }

  return null;
}

export function getStudioTemplateRendererKeys() {
  return Array.from(keyToMetaPath.keys()).sort();
}

export function hasStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  const key = normalizeTemplateKey(templateKey);
  if (!key) return false;
  return keyToMetaPath.has(key) || rendererCache.has(key);
}

/** Sync lookup — only returns templates already loaded into the cache. */
export function getStudioTemplateRenderer(
  templateKey: string | null | undefined,
): StudioTemplateRenderer | null {
  const key = normalizeTemplateKey(templateKey);
  if (!key) return null;
  return rendererCache.get(key) || null;
}

export async function loadStudioTemplateRenderer(
  templateKey: string | null | undefined,
): Promise<StudioTemplateRenderer | null> {
  const key = normalizeTemplateKey(templateKey);
  if (!key) return null;

  const cached = rendererCache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const metaPath = keyToMetaPath.get(key);
  if (!metaPath) return null;

  const loader = metaModules[metaPath];
  if (!loader) return null;

  const promise = Promise.resolve(loader())
    .then((mod) => {
      const def = pickTemplateExport(mod as Record<string, unknown>, key);
      const renderer = definitionToRenderer(def, key);
      if (renderer) {
        rendererCache.set(key, renderer);
        // Also cache under renderer.key in case of alias differences.
        if (renderer.key && renderer.key !== key) {
          rendererCache.set(renderer.key, renderer);
        }
      }
      return renderer;
    })
    .catch((error) => {
      console.error("[BizUply] Failed to load template renderer", key, error);
      return null;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/** Warm the cache for hover / navigation prefetch. */
export function prefetchStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  const key = normalizeTemplateKey(templateKey);
  if (!key || rendererCache.has(key) || !keyToMetaPath.has(key)) return;
  void loadStudioTemplateRenderer(key);
}

export function prefetchStudioTemplateRenderers(
  templateKeys: Array<string | null | undefined>,
) {
  templateKeys.forEach((key) => prefetchStudioTemplateRenderer(key));
}
