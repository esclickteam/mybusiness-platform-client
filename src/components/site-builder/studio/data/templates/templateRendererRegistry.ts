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

import SpalcioPages, { spalcioPages } from "./spalcio/pages";
import { spalcioEditorCss } from "./spalcio/spalcioEditorCss";
import { spalcioData } from "./spalcio/spalcioData";

import ChanelPages from "./chanel/pages";
import { chanelEditorCss } from "./chanel/chanelEditorCss";
import { chanelSeed } from "./chanel/chanelData";

import WantravelPages, { wantravelPages } from "./wantravel/pages";
import { wantravelEditorCss } from "./wantravel/editorCss";
import { wantravelSeed } from "./wantravel/wantravelData";
import { wantravelSchema } from "./wantravel/schema";

import LexoraPages, { lexoraPages } from "./lexora/pages";
import { lexoraEditorCss } from "./lexora/editorCss";
import { lexoraSeed } from "./lexora/lexoraData";
import { lexoraSchema } from "./lexora/schema";

import IdoPages, { idoPages } from "./ido/pages";
import { idoEditorCss } from "./ido/editorCss";
import { idoSchema } from "./ido/schema";
import { idoDefaultData } from "./ido/defaultData";

import type {
  StudioTemplateEditorMode,
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";

/*
  חשוב:
  כל תבנית שרוצה להיות זהה בצפייה ובעריכה
  חייבת להיות מיובאת כאן ולהופיע בתוך studioTemplateRendererRegistry.

  תבניות מקצועיות כמו Velmora / Aeline / PulseCore / Lunelle / Spalcio / Chanel / Wantravel / Lexora / IDO יעבדו עם:
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

    const rawSlug =
      page?.slug ||
      page?.path ||
      page?.href ||
      (id === "home" ? "/" : id);

    const slug = normalizeSlug(rawSlug);

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
  ido: createRenderer({
    key: "ido",
    name: "IDO",
    Component: IdoPages,
    pages: idoPages,
    editorMode: "visual-react",
    schema: idoSchema,
    defaultData: idoDefaultData,
    editorCss: idoEditorCss,
  }),

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

  spalcio: createRenderer({
    key: "spalcio",
    name: "Spalcio",
    Component: SpalcioPages,
    pages: spalcioPages,
    editorMode: "visual-react",
    defaultData: spalcioData as unknown as Record<string, any>,
    editorCss: spalcioEditorCss,
  }),

  chanel: createRenderer({
    key: "chanel",
    name: "Chanel",
    Component: ChanelPages,
    pages: [
      {
        id: "home",
        name: "בית",
        slug: "/",
      },
    ],
    editorMode: "visual-react",
    defaultData: chanelSeed as unknown as Record<string, any>,
    editorCss: chanelEditorCss,
  }),

  wantravel: createRenderer({
    key: "wantravel",
    name: "Wantravel",
    Component: WantravelPages,
    pages: wantravelPages,
    editorMode: "visual-react",
    schema: wantravelSchema,
    defaultData: wantravelSeed as unknown as Record<string, any>,
    editorCss: wantravelEditorCss,
  }),

  lexora: createRenderer({
    key: "lexora",
    name: "Lexora",
    Component: LexoraPages,
    pages: lexoraPages,
    editorMode: "visual-react",
    schema: lexoraSchema,
    defaultData: lexoraSeed as unknown as Record<string, any>,
    editorCss: lexoraEditorCss,
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