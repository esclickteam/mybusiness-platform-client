import type { ComponentType } from "react";

import VelmoraPages, { velmoraPages } from "./velmora/pages";
import { velmoraEditorCss } from "./velmora/editorCss";

/*
  חשוב:
  כל תבנית שרוצה להיות זהה בצפייה ובעריכה
  חייבת להיות מיובאת כאן ולהופיע בתוך studioTemplateRendererRegistry.

  כל תבנית יכולה להביא CSS ייעודי לעורך דרך editorCss,
  כדי שלא נצטרך להכניס אפקטים של 100 תבניות בתוך WebsiteStudioPage.tsx.

  דוגמה להוספה בעתיד:

  import AelinePages, { aelinePages } from "./aeline/pages";
  import { aelineEditorCss } from "./aeline/editorCss";

  import NoirPages, { noirPages } from "./noir/pages";
  import { noirEditorCss } from "./noir/editorCss";

  ואז להוסיף:
  aeline: createRenderer("aeline", "Aeline", AelinePages, aelinePages, aelineEditorCss),
  noir: createRenderer("noir", "Noir", NoirPages, noirPages, noirEditorCss),
*/

export type StudioTemplateRendererPage = {
  id: string;
  name: string;
  slug: string;
};

export type StudioTemplateRenderer = {
  key: string;
  name: string;
  Component: ComponentType;
  pages: StudioTemplateRendererPage[];

  /*
    CSS ייעודי לתבנית בתוך עורך GrapesJS.
    לדוגמה:
    - פתיחת Reveal סטטי
    - אפקטים של תמונות
    - keyframes
    - תיקוני iframe
  */
  editorCss?: string;
};

function normalizeTemplateKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function normalizeSlug(value: string | null | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "/";

  return clean.startsWith("/") ? clean : `/${clean}`;
}

function normalizeRendererPages(
  pages: ReadonlyArray<any> | undefined
): StudioTemplateRendererPage[] {
  if (!Array.isArray(pages) || pages.length === 0) {
    return [
      {
        id: "home",
        name: "Home",
        slug: "/",
      },
    ];
  }

  return pages.map((page, index) => {
    const id = String(page?.id || `page-${index + 1}`);
    const name = String(page?.name || page?.title || id);
    const slug = normalizeSlug(page?.slug || (id === "home" ? "/" : id));

    return {
      id,
      name,
      slug,
    };
  });
}

function createRenderer(
  key: string,
  name: string,
  Component: ComponentType,
  pages?: ReadonlyArray<any>,
  editorCss?: string
): StudioTemplateRenderer {
  const normalizedKey = normalizeTemplateKey(key);

  return {
    key: normalizedKey,
    name,
    Component,
    pages: normalizeRendererPages(pages),
    editorCss,
  };
}

export const studioTemplateRendererRegistry: Record<
  string,
  StudioTemplateRenderer
> = {
  velmora: createRenderer(
    "velmora",
    "Velmora",
    VelmoraPages,
    velmoraPages,
    velmoraEditorCss
  ),

  /*
    להוסיף כאן כל תבנית נוספת:

    aeline: createRenderer(
      "aeline",
      "Aeline",
      AelinePages,
      aelinePages,
      aelineEditorCss
    ),

    noir: createRenderer(
      "noir",
      "Noir",
      NoirPages,
      noirPages,
      noirEditorCss
    ),

    clinic: createRenderer(
      "clinic",
      "Clinic",
      ClinicPages,
      clinicPages,
      clinicEditorCss
    ),
  */
};

export function getStudioTemplateRenderer(
  templateKey: string | null | undefined
): StudioTemplateRenderer | null {
  const key = normalizeTemplateKey(templateKey);

  if (!key) return null;

  return studioTemplateRendererRegistry[key] || null;
}

export function hasStudioTemplateRenderer(
  templateKey: string | null | undefined
) {
  return Boolean(getStudioTemplateRenderer(templateKey));
}

export function getStudioTemplateRendererKeys() {
  return Object.keys(studioTemplateRendererRegistry);
}