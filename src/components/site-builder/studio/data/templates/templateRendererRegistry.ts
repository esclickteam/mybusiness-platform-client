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

import ElevoraPages, { elevoraPages } from "./elevora/pages";
import { elevoraEditorCss } from "./elevora/editorCss";
import { elevoraDefaultData } from "./elevora/elevoraData";

import ServoraPages, { servoraPages } from "./Servora/pages";
import { servoraEditorCss } from "./Servora/editorCss";
import { servoraDefaultData } from "./Servora/servoraData";

import AdionPages, { adionPages } from "./adion/pages";
import { adionEditorCss } from "./adion/editorCss";

import VirelloPages, { virelloPages } from "./Virello/pages";
import { adionEditorCss as virelloEditorCss } from "./Virello/editorCss";
import { adionSchema as virelloSchema } from "./Virello/schema";
import { virelloDefaultData } from "./Virello/defaultData";

import NadlanistPages, { nadlanistPages } from "./nadlanist/pages";
import { nadlanistEditorCss } from "./nadlanist/editorCss";
import { nadlanistDefaultData } from "./nadlanist/defaultData";

import NovastraPages, { novastraPages } from "./novastra/pages";
import { novastraEditorCss } from "./novastra/editorCss";
import { novastraSchema } from "./novastra/schema";
import { novastraDefaultData } from "./novastra/defaultData";

import type {
  StudioTemplateEditorMode,
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";

/*
  חשוב:
  כל תבנית שרוצה להיות זהה בצפייה ובעריכה
  חייבת להיות מיובאת כאן ולהופיע בתוך studioTemplateRendererRegistry.

  תבניות מקצועיות כמו Velmora / Aeline / PulseCore / Lunelle / Spalcio /
  Wantravel / Lexora / IDO / Elevora / Servora / Adion / Virello / Nadlanist / Novastra
  יעבדו עם:
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
    schema: idoSchema as StudioTemplateRenderer["schema"],
    defaultData: idoDefaultData as unknown as Record<string, any>,
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

  elevora: createRenderer({
    key: "elevora",
    name: "Elevora",
    Component: ElevoraPages,
    pages: elevoraPages,
    editorMode: "visual-react",
    defaultData: elevoraDefaultData as unknown as Record<string, any>,
    editorCss: elevoraEditorCss,
  }),

  servora: createRenderer({
    key: "servora",
    name: "Servora",
    Component: ServoraPages,
    pages: servoraPages,
    editorMode: "visual-react",
    defaultData: servoraDefaultData as unknown as Record<string, any>,
    editorCss: servoraEditorCss,
  }),

  adion: createRenderer({
    key: "adion",
    name: "Adion",
    Component: AdionPages,
    pages: adionPages,
    editorMode: "visual-react",
    defaultData: {} as Record<string, any>,
    editorCss: adionEditorCss,
  }),

  virello: createRenderer({
    key: "virello",
    name: "Virello",
    Component: VirelloPages,
    pages: virelloPages,
    editorMode: "visual-react",
    schema: virelloSchema as StudioTemplateRenderer["schema"],
    defaultData: virelloDefaultData as unknown as Record<string, any>,
    editorCss: virelloEditorCss,
  }),

  nadlanist: createRenderer({
    key: "nadlanist",
    name: "Nadlanist",
    Component: NadlanistPages,
    pages: nadlanistPages,
    editorMode: "visual-react",
    defaultData: nadlanistDefaultData as unknown as Record<string, any>,
    editorCss: nadlanistEditorCss,
  }),

  novastra: createRenderer({
    key: "novastra",
    name: "Novastra",
    Component: NovastraPages,
    pages: novastraPages,
    editorMode: "visual-react",
    schema: novastraSchema as StudioTemplateRenderer["schema"],
    defaultData: novastraDefaultData as unknown as Record<string, any>,
    editorCss: novastraEditorCss,
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