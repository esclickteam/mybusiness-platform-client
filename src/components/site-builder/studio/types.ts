import type { Editor } from "grapesjs";

export type DeviceMode = "Desktop" | "Tablet" | "Mobile";

export type StudioPanel =
  | "templates"
  | "add"
  | "sections"
  | "theme"
  | "pages"
  | "media"
  | "store"
  | "bookings"
  | "services"
  | "club"
  | "leads"
  | "animations"
  | "seo"
  | "settings";

export type InspectorTab = "design" | "settings" | "animations";

export type ElementCategory =
  | "text"
  | "image"
  | "button"
  | "strip"
  | "decorative"
  | "box"
  | "gallery"
  | "menu"
  | "forms"
  | "video"
  | "interactive"
  | "list"
  | "embed"
  | "social"
  | "payments"
  | "cms"
  | "blog"
  | "store"
  | "bookings"
  | "bizuply";

export type StudioElement = {
  id: string;
  label: string;
  description?: string;
  icon: string;
  category: ElementCategory;
  html: string;
};

export type SectionCategory =
  | "welcome"
  | "about"
  | "services"
  | "gallery"
  | "testimonials"
  | "contact"
  | "store"
  | "bookings"
  | "forms"
  | "club"
  | "basic";

export type SectionTemplate = {
  id: string;
  category: SectionCategory;
  title: string;
  description: string;
  preview: string;
  html: string;
};

export type PageTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  html: string;
};

export type ThemePalette = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  font: {
    heading: string;
    body: string;
  };
};

export type SiteSavePayload = {
  slug: string;
  published: boolean;
  html: string;
  css: string;
  projectData: unknown;
  updatedAt: string;
};

export type WebsiteStudioPageProps = {
  businessId?: string;
  initialSlug?: string;
  onSave?: (payload: SiteSavePayload) => Promise<void> | void;
};

export type GrapesEditor = Editor;