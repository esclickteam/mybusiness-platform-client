import type { PageTemplate } from "../types";

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

  /**
   * variant קובע את המבנה האמיתי של הבלוק.
   * לדוגמה:
   * hero: "split", "fullscreen", "cards", "offer"
   * services: "cards", "list", "timeline"
   * gallery: "grid", "masonry", "slider"
   */
  variant: string;

  title: string;
  subtitle?: string;
  text?: string;
  image?: string;
  items?: string[];
};

export type ReadyWebsiteTemplateSeed = {
  id: string;
  name: string;
  category: string;
  description: string;

  /**
   * שם תחום העסק שמוצג בכרטיס ובאתר.
   * לדוגמה: יופי, מספרה, קליניקה, פיננסים.
   */
  niche: string;

  /**
   * layout משפיע על השפה העיצובית של כל האתר.
   * לדוגמה: editorial, darkSplit, calendarFirst, dashboard.
   */
  layout: string;

  image: string;
  heroTitle: string;
  heroSubtitle: string;
  palette: ReadyWebsitePalette;
  blocks: ReadyWebsiteBlock[];
};

export type ReadyWebsiteTemplate = PageTemplate & {
  niche: string;
  layout: string;
  image: string;
  heroTitle: string;
  heroSubtitle: string;
  palette: ReadyWebsitePalette;
  blocks: ReadyWebsiteBlock[];

  /**
   * html/css נכנסים ישירות ל־GrapesJS דרך:
   * editor.setComponents(template.html)
   * editor.setStyle(template.css)
   */
  html: string;
  css: string;

  /**
   * preview משמש לתצוגה הקטנה של התבנית בסיידבר.
   */
  preview: string;
};

export type ReadyWebsiteCategory = {
  id: string;
  label: string;
};