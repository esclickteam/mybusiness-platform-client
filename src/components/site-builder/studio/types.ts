import type { Editor } from "grapesjs";

/* =====================================================
   DEVICE / VIEW
===================================================== */

export type DeviceMode = "Desktop" | "Tablet" | "Mobile";

/* =====================================================
   MAIN STUDIO PANELS
===================================================== */

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

/* =====================================================
   INSPECTOR
===================================================== */

export type InspectorTab = "design" | "settings" | "animations";

export type StylePatch = Record<string, string | number>;

export type AnimationPresetValue =
  | ""
  | "fade-up"
  | "zoom-in"
  | "slide-right"
  | "blur-reveal";

/* =====================================================
   ELEMENT LIBRARY
===================================================== */

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

/* =====================================================
   SECTION TEMPLATES
===================================================== */

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

/* =====================================================
   PAGE TEMPLATES
===================================================== */

export type PageTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  html: string;
};

/* =====================================================
   THEME / BRAND DESIGN
===================================================== */

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

export type FontOption =
  | "Heebo"
  | "Assistant"
  | "Rubik"
  | "Alef"
  | "Varela Round"
  | "Noto Sans Hebrew"
  | "Poppins"
  | "Inter"
  | "DM Sans"
  | "Playfair Display"
  | "Lora"
  | "Libre Baskerville";

/* =====================================================
   SMART BIZUPLY BLOCKS
===================================================== */

export type BizuplySmartBlockType =
  | "services"
  | "booking"
  | "products"
  | "lead-form"
  | "customer-club"
  | "reviews"
  | "faq"
  | "coupons"
  | "contact"
  | "whatsapp";

export type BizuplySmartBlock = {
  type: BizuplySmartBlockType;
  label: string;
  description: string;
  html: string;
};

/* =====================================================
   SAVE / PUBLISH
===================================================== */

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

/* =====================================================
   GRAPES
===================================================== */

export type GrapesEditor = Editor;