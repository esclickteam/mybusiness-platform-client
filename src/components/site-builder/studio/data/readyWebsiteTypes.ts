import type { PageTemplate, StudioSitePageType } from "../types";

export type ReadyBlockType =
  | "header"
  | "hero"
  | "trust"
  | "about"
  | "services"
  | "pricing"
  | "booking"
  | "gallery"
  | "store"
  | "testimonials"
  | "reviews"
  | "faq"
  | "contact"
  | "team"
  | "process"
  | "lead"
  | "menu"
  | "offers"
  | "programs"
  | "results"
  | "listings"
  | "map"
  | "packages"
  | "clients"
  | "course"
  | "collection"
  | "areas"
  | "emergency"
  | "projects"
  | "benefits"
  | "story"
  | "doctor"
  | "artist"
  | "club"
  | "footer";

export type ReadyWebsitePalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  dark: string;
};

export type ReadyWebsiteBlock = {
  id: string;
  type: ReadyBlockType;
  variant: string;
  title: string;
  subtitle?: string;
  text?: string;
  image?: string;
  items?: string[];
};

export type ReadyWebsiteEditorPage = {
  id: string;
  title: string;
  slug: string;
  type: StudioSitePageType;
  isHome?: boolean;
  html: string;
  css?: string;
  projectData?: unknown;
};

export type ReadyWebsiteEditorDefinition = {
  pages: ReadyWebsiteEditorPage[];
  css?: string;
};

export type ReadyWebsiteTemplateSeed = {
  id: string;
  name: string;
  category: string;
  description: string;
  niche: string;
  layout: string;
  image: string;
  heroTitle: string;
  heroSubtitle: string;
  palette: ReadyWebsitePalette;
  blocks: ReadyWebsiteBlock[];

  /**
   * מקור האמת של התבנית.
   * Preview, Editor ו-Publish חייבים להשתמש באותם pages/html/css.
   */
  editor?: ReadyWebsiteEditorDefinition;

  /** תאימות לאחור לכרטיסיות/חיפוש ישנים */
  html?: string;
  css?: string;
  preview?: string;
};

export type ReadyWebsiteTemplate = PageTemplate & {
  niche: string;
  layout: string;
  image: string;
  heroTitle: string;
  heroSubtitle: string;
  palette: ReadyWebsitePalette;
  blocks: ReadyWebsiteBlock[];
  html: string;
  css: string;
  preview: string;
  editor?: ReadyWebsiteEditorDefinition;
};

export type ReadyWebsiteCategory = {
  id: string;
  label: string;
};
