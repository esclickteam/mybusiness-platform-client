import type { ComponentType } from "react";

import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";
import type {
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";
import { withTemplateResponsiveCss } from "./shared/templateResponsiveCss";

const pageLoaders = import.meta.glob("./*/pages.{tsx,ts,jsx,js}");
const defaultDataLoaders = import.meta.glob("./*/defaultData.{ts,tsx,js}");
const namedDataLoaders = import.meta.glob("./*/*Data.{ts,tsx,js}");
const schemaLoaders = import.meta.glob("./*/schema.{ts,tsx,js}");
const editorCssLoaders = import.meta.glob("./*/editorCss.{ts,tsx,js}");
const namedEditorCssLoaders = import.meta.glob("./*/*EditorCss.{ts,tsx,js}");
const metaLoaders = {
  ...import.meta.glob("./*/meta.ts"),
  ...import.meta.glob("./*/meta.tsx"),
};

type GlobLoader = () => Promise<Record<string, unknown>>;

type TemplateAssetLoaders = {
  folder: string;
  pages?: GlobLoader;
  defaultData?: GlobLoader;
  namedData?: GlobLoader;
  schema?: GlobLoader;
  editorCss?: GlobLoader;
  namedEditorCss?: GlobLoader;
  meta?: GlobLoader;
};

function normalizeTemplateKey(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function folderFromGlobPath(globPath: string) {
  return String(globPath || "").split("/")[1] || "";
}

function indexLoaders(
  loaders: Record<string, GlobLoader>,
  assign: (entry: TemplateAssetLoaders, loader: GlobLoader) => void,
  map: Map<string, TemplateAssetLoaders>,
) {
  for (const [globPath, loader] of Object.entries(loaders)) {
    const folder = folderFromGlobPath(globPath);
    const key = normalizeTemplateKey(folder);
    if (!key || key === "shared") continue;
    const entry = map.get(key) || { folder };
    assign(entry, loader as GlobLoader);
    map.set(key, entry);
  }
}

function buildAssetMap() {
  const map = new Map<string, TemplateAssetLoaders>();
  indexLoaders(pageLoaders as Record<string, GlobLoader>, (entry, loader) => {
    entry.pages = loader;
  }, map);
  indexLoaders(
    defaultDataLoaders as Record<string, GlobLoader>,
    (entry, loader) => {
      entry.defaultData = loader;
    },
    map,
  );
  indexLoaders(
    namedDataLoaders as Record<string, GlobLoader>,
    (entry, loader) => {
      if (!entry.namedData) entry.namedData = loader;
    },
    map,
  );
  indexLoaders(
    schemaLoaders as Record<string, GlobLoader>,
    (entry, loader) => {
      entry.schema = loader;
    },
    map,
  );
  indexLoaders(
    editorCssLoaders as Record<string, GlobLoader>,
    (entry, loader) => {
      entry.editorCss = loader;
    },
    map,
  );
  indexLoaders(
    namedEditorCssLoaders as Record<string, GlobLoader>,
    (entry, loader) => {
      if (!entry.namedEditorCss) entry.namedEditorCss = loader;
    },
    map,
  );
  indexLoaders(metaLoaders as Record<string, GlobLoader>, (entry, loader) => {
    entry.meta = loader;
  }, map);
  return map;
}

const assetMap = buildAssetMap();
const rendererCache = new Map<string, StudioTemplateRenderer>();
const definitionCache = new Map<string, StudioTemplateDefinition>();
const inflight = new Map<string, Promise<StudioTemplateRenderer | null>>();

function isReactComponent(value: unknown): value is ComponentType<any> {
  return typeof value === "function";
}

function pickComponent(mod: Record<string, unknown> | null | undefined) {
  if (!mod) return null;
  if (isReactComponent(mod.default)) return mod.default;
  for (const [name, value] of Object.entries(mod)) {
    if (name === "default") continue;
    if (isReactComponent(value) && /^[A-Z]/.test(name)) return value;
  }
  return null;
}

function pickPages(
  mod: Record<string, unknown> | null | undefined,
  folder: string,
): unknown[] | undefined {
  if (!mod) return undefined;
  const lower = normalizeTemplateKey(folder);
  const named = mod[`${lower}Pages`];
  if (Array.isArray(named)) return named;
  if (Array.isArray(mod.pages)) return mod.pages;
  for (const [name, value] of Object.entries(mod)) {
    if (name === "default") continue;
    if (
      Array.isArray(value) &&
      value[0] &&
      typeof value[0] === "object" &&
      ("id" in (value[0] as object) || "slug" in (value[0] as object))
    ) {
      return value;
    }
  }
  return undefined;
}

function pickObjectExport(
  mod: Record<string, unknown> | null | undefined,
  folder: string,
  suffixes: string[],
) {
  if (!mod) return undefined;
  const lower = normalizeTemplateKey(folder);
  for (const suffix of suffixes) {
    const value = mod[`${lower}${suffix}`] || mod[suffix];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }
  if (
    mod.default &&
    typeof mod.default === "object" &&
    !Array.isArray(mod.default) &&
    !isReactComponent(mod.default)
  ) {
    return mod.default as Record<string, unknown>;
  }
  for (const [name, value] of Object.entries(mod)) {
    if (name === "default" || isReactComponent(value) || Array.isArray(value)) {
      continue;
    }
    if (value && typeof value === "object") {
      return value as Record<string, unknown>;
    }
  }
  return undefined;
}

function pickCss(mod: Record<string, unknown> | null | undefined) {
  if (!mod) return "";
  if (typeof mod.default === "string") return mod.default;
  for (const value of Object.values(mod)) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
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
    return [{ id: "home", name: "Home", slug: "/" }];
  }

  return pages.map((page, index) => {
    const id = String(page?.id || `page-${index + 1}`);
    const name = String(page?.name || page?.label || page?.title || id);
    const rawSlug =
      page?.slug || page?.path || page?.href || (id === "home" ? "/" : id);
    return { id, name, slug: normalizeSlug(rawSlug) };
  });
}

function pickTemplateExport(mod: Record<string, unknown> | null | undefined) {
  if (!mod) return null;
  const candidates = [mod.default, ...Object.values(mod)].filter(
    (value) => value && typeof value === "object" && !Array.isArray(value),
  ) as Array<Record<string, any>>;
  return (
    candidates.find((value) => value.id || value.key || value.Component) ||
    null
  );
}

async function safeLoad(loader?: GlobLoader) {
  if (!loader) return null;
  try {
    return (await loader()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function hasStudioTemplateLoader(templateKey: string | null | undefined) {
  return assetMap.has(normalizeTemplateKey(templateKey));
}

export function getStudioTemplateLoaderKeys() {
  return Array.from(assetMap.keys());
}

export function getStudioTemplateRenderer(
  templateKey: string | null | undefined,
): StudioTemplateRenderer | null {
  const key = normalizeTemplateKey(templateKey);
  if (!key) return null;
  return rendererCache.get(key) || null;
}

export function hasStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  return Boolean(
    getStudioTemplateRenderer(templateKey) || hasStudioTemplateLoader(templateKey),
  );
}

export function getStudioTemplateRendererKeys() {
  return getStudioTemplateLoaderKeys();
}

export function getStudioTemplateById(
  templateId: string | null | undefined,
): StudioTemplateDefinition | undefined {
  const key = normalizeTemplateKey(templateId);
  if (!key) return undefined;
  return definitionCache.get(key);
}

export function getStudioTemplateSeedById(
  templateId: string | null | undefined,
): ReadyWebsiteTemplateSeed | undefined {
  return getStudioTemplateById(templateId)?.seed;
}

async function assembleRenderer(
  key: string,
): Promise<StudioTemplateRenderer | null> {
  const assets = assetMap.get(key);
  if (!assets?.pages && !assets?.meta) return null;

  const [pagesMod, defaultDataMod, namedDataMod, schemaMod, editorCssMod, namedCssMod] =
    await Promise.all([
      safeLoad(assets.pages),
      safeLoad(assets.defaultData),
      assets.defaultData ? Promise.resolve(null) : safeLoad(assets.namedData),
      safeLoad(assets.schema),
      safeLoad(assets.editorCss),
      assets.editorCss ? Promise.resolve(null) : safeLoad(assets.namedEditorCss),
    ]);

  let metaMod: Record<string, unknown> | null = null;
  let Component = pickComponent(pagesMod);
  if (!Component && assets.meta) {
    metaMod = await safeLoad(assets.meta);
    const metaTemplateFallback = pickTemplateExport(metaMod);
    Component =
      (metaTemplateFallback?.Component as ComponentType<any> | undefined) ||
      (metaTemplateFallback?.component as ComponentType<any> | undefined) ||
      pickComponent(metaMod);
  }
  const metaTemplate = pickTemplateExport(metaMod);

  if (!Component) return null;

  const defaultData =
    pickObjectExport(defaultDataMod, assets.folder, ["DefaultData", "Data", "Seed"]) ||
    pickObjectExport(namedDataMod, assets.folder, ["DefaultData", "Data", "Seed"]) ||
    (metaTemplate?.defaultData as Record<string, unknown> | undefined) ||
    (metaTemplate?.seed?.defaultData as Record<string, unknown> | undefined) ||
    (metaTemplate?.seed as Record<string, unknown> | undefined) ||
    {};

  const schema =
    pickObjectExport(schemaMod, assets.folder, ["Schema"]) ||
    metaTemplate?.schema ||
    metaTemplate?.renderer?.schema;

  const editorCss = withTemplateResponsiveCss(
    pickCss(editorCssMod) ||
      pickCss(namedCssMod) ||
      metaTemplate?.editorCss ||
      metaTemplate?.css ||
      metaTemplate?.renderer?.editorCss,
  );

  const renderer: StudioTemplateRenderer = {
    key,
    name: String(metaTemplate?.name || metaTemplate?.title || key),
    Component,
    pages: normalizeRendererPages(
      metaTemplate?.renderer?.pages ||
        metaTemplate?.pages ||
        pickPages(pagesMod, assets.folder),
    ),
    editorMode: "visual-react",
    schema: schema as StudioTemplateRenderer["schema"],
    defaultData: defaultData as Record<string, any>,
    editorCss,
  };

  const definition = {
    ...(metaTemplate || {}),
    id: key,
    key,
    name: renderer.name,
    seed:
      (metaTemplate?.seed as ReadyWebsiteTemplateSeed | undefined) ||
      ({
        id: key,
        key,
        name: renderer.name,
        category: metaTemplate?.category || "business",
        description: metaTemplate?.description || "",
        defaultData,
        data: defaultData,
      } as unknown as ReadyWebsiteTemplateSeed),
    renderer,
    Component,
    pages: renderer.pages,
    defaultData,
    editorCss,
    schema,
  } as unknown as StudioTemplateDefinition;

  definitionCache.set(key, definition);
  rendererCache.set(key, renderer);
  return renderer;
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
  const request = assembleRenderer(key).finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, request);
  return request;
}

export async function loadStudioTemplateById(
  templateId: string | null | undefined,
): Promise<StudioTemplateDefinition | undefined> {
  const key = normalizeTemplateKey(templateId);
  if (!key) return undefined;
  if (definitionCache.has(key)) return definitionCache.get(key);
  await loadStudioTemplateRenderer(key);
  return definitionCache.get(key);
}

export async function loadStudioTemplateSeedById(
  templateId: string | null | undefined,
): Promise<ReadyWebsiteTemplateSeed | undefined> {
  const definition = await loadStudioTemplateById(templateId);
  return definition?.seed;
}
