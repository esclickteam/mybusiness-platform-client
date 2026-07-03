import type { ComponentType } from "react";

import VelmoraPages, { velmoraPages } from "./velmora/pages";
import { velmoraEditorCss } from "./velmora/editorCss";
import { velmoraSchema } from "./velmora/schema";
import { velmoraDefaultData } from "./velmora/defaultData";

import AelinePages, { aelinePages } from "./aeline/pages";
import { aelineEditorCss } from "./aeline/editorCss";
import { aelineSchema } from "./aeline/schema";
import { aelineDefaultData } from "./aeline/defaultData";

import PulsecorePages, { pulsecorePages } from "./pulsecore/pages";
import { pulsecoreEditorCss } from "./pulsecore/editorCss";
import { pulsecoreSeed } from "./pulsecore/pulsecoreData";

import LunellePages, { lunellePages } from "./lunelle/pages";
import { lunelleEditorCss } from "./lunelle/editorCss";
import { lunelleSeed } from "./lunelle/lunelleData";

import type {
  StudioTemplateEditorMode,
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";

/*
  חשוב:
  כל תבנית שרוצה להיות זהה בצפייה ובעריכה
  חייבת להיות מיובאת כאן ולהופיע בתוך studioTemplateRendererRegistry.

  תבניות מקצועיות כמו Velmora / Aeline / PulseCore / Lunelle יעבדו עם:
  editorMode: "visual-react"

  תבניות פשוטות / HTML / בלוקים חופשיים יעבדו עם:
  editorMode: "grapes-html"
*/

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
    return [
      {
        id: "home",
        name: "בית",
        slug: "/",
      },
    ];
  }

  return pages.map((page, index) => {
    const id = String(page?.id || `page-${index + 1}`);
    const name = String(page?.name || page?.label || page?.title || id);
    const slug = normalizeSlug(page?.slug || (id === "home" ? "/" : id));

    return {
      id,
      name,
      slug,
    };
  });
}

function createRenderer({
  key,
  name,
  Component,
  pages,
  editorMode = "grapes-html",
  schema,
  defaultData,
  editorCss,
}: {
  key: string;
  name: string;
  Component: ComponentType<any>;
  pages?: ReadonlyArray<any>;
  editorMode?: StudioTemplateEditorMode;
  schema?: StudioTemplateRenderer["schema"];
  defaultData?: StudioTemplateRenderer["defaultData"];
  editorCss?: string;
}): StudioTemplateRenderer {
  const normalizedKey = normalizeTemplateKey(key);

  return {
    key: normalizedKey,
    name,
    Component,
    pages: normalizeRendererPages(pages),
    editorMode,
    schema,
    defaultData,
    editorCss,
  };
}

export const studioTemplateRendererRegistry: Record<
  string,
  StudioTemplateRenderer
> = {
  velmora: createRenderer({
    key: "velmora",
    name: "Velmora",
    Component: VelmoraPages,
    pages: velmoraPages,
    editorMode: "visual-react",
    schema: velmoraSchema,
    defaultData: velmoraDefaultData,
    editorCss: velmoraEditorCss,
  }),

  aeline: createRenderer({
    key: "aeline",
    name: "Nova Flow",
    Component: AelinePages,
    pages: aelinePages,
    editorMode: "visual-react",
    schema: aelineSchema,
    defaultData: aelineDefaultData,
    editorCss: aelineEditorCss,
  }),

  pulsecore: createRenderer({
    key: "pulsecore",
    name: "PulseCore",
    Component: PulsecorePages,
    pages: pulsecorePages,
    editorMode: "visual-react",
    defaultData: pulsecoreSeed as unknown as Record<string, any>,
    editorCss: pulsecoreEditorCss,
  }),

  lunelle: createRenderer({
    key: "lunelle",
    name: "Lunelle",
    Component: LunellePages,
    pages: lunellePages,
    editorMode: "visual-react",
    defaultData: lunelleSeed as unknown as Record<string, any>,
    editorCss: lunelleEditorCss,
  }),
};

export function getStudioTemplateRenderer(
  templateKey: string | null | undefined,
): StudioTemplateRenderer | null {
  const key = normalizeTemplateKey(templateKey);

  if (!key) return null;

  return studioTemplateRendererRegistry[key] || null;
}

export function hasStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  return Boolean(getStudioTemplateRenderer(templateKey));
}

export function getStudioTemplateRendererKeys() {
  return Object.keys(studioTemplateRendererRegistry);
}