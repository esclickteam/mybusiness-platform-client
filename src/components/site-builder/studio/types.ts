import type { Editor } from "grapesjs";
import type * as React from "react";

/* =====================================================
   DEVICE / VIEW
===================================================== */

export type DeviceMode = "Desktop" | "Tablet" | "Mobile";

export type Direction = "rtl" | "ltr";

/* =====================================================
   MAIN STUDIO PANELS
   null = no panel open.
   This is required for click-to-open/click-to-close sidebar.
   Templates were removed from the editor sidebar.
   Templates are managed only in the dedicated templates page.
===================================================== */

export type StudioPanel =
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
  | "domain"
  | "settings";

export type ActiveStudioPanel = StudioPanel | null;

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
  | "slide-left"
  | "blur-reveal"
  | "float-soft"
  | "pulse-soft";

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
   SECTION KINDS
===================================================== */

export type SectionKind =
  | "header"
  | "hero"
  | "welcome"
  | "about"
  | "team"
  | "services"
  | "gallery"
  | "contact"
  | "promotion"
  | "subscribe"
  | "testimonials"
  | "reviews"
  | "clients"
  | "store"
  | "booking"
  | "bookings"
  | "events"
  | "club"
  | "bot"
  | "social"
  | "course"
  | "miniSaas"
  | "basic"
  | "text"
  | "list"
  | "form"
  | "forms"
  | "savedSections";

/* =====================================================
   SECTION TEMPLATES
===================================================== */

export type SectionCategory =
  | "header"
  | "hero"
  | "welcome"
  | "about"
  | "team"
  | "services"
  | "gallery"
  | "reviews"
  | "testimonials"
  | "clients"
  | "contact"
  | "promotion"
  | "subscribe"
  | "store"
  | "booking"
  | "bookings"
  | "events"
  | "forms"
  | "form"
  | "club"
  | "bot"
  | "social"
  | "course"
  | "miniSaas"
  | "basic"
  | "text"
  | "list"
  | "savedSections";

export type SectionTemplate = {
  id: string;
  category: SectionCategory;
  title: string;
  description: string;
  preview: string;
  html: string;
};

/* =====================================================
   SECTION LAYOUT VARIANTS
===================================================== */

export type SectionLayoutVariant = {
  id: string;
  kind: SectionKind;
  title: string;
  description: string;
  previewLabel: string;
  badge: string;
  html: string;
  previewImage?: string;
  tags?: string[];
  direction?: Direction;
  featured?: boolean;
};

/* =====================================================
   PAGE TYPES / SITE STRUCTURE
===================================================== */

export type StudioSitePageType =
  | "home"
  | "about"
  | "service"
  | "store"
  | "product"
  | "booking"
  | "landing"
  | "contact"
  | "gallery"
  | "course"
  | "miniSaas"
  | "blank";

export type StudioSitePage = {
  id: string;
  title: string;
  slug: string;
  type: StudioSitePageType;
  isHome?: boolean;
  html?: string;
  css?: string;
  projectData?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type StudioPageBlock = {
  id: string;
  title: string;
  kind: SectionKind;
  description: string;
  required?: boolean;
};

export type StudioPageDefinition = {
  id: StudioSitePageType;
  label: string;
  description: string;
  defaultSlug: string;
  blocks: StudioPageBlock[];
};

/* =====================================================
   LINKS
===================================================== */

export type StudioPageLinkType =
  | "none"
  | "page"
  | "section"
  | "product"
  | "category"
  | "whatsapp"
  | "phone"
  | "email"
  | "external";

export type StudioEditableLink = {
  type: StudioPageLinkType;
  pageId?: string;
  sectionId?: string;
  productId?: string;
  categoryId?: string;
  value?: string;
};

/* =====================================================
   PAGE TEMPLATES
   Old sidebar templates can stay as data types for compatibility,
   but the templates panel is no longer part of StudioPanel.
===================================================== */

export type PageTemplateKind =
  | "business"
  | "landing"
  | "store"
  | "booking"
  | "bookings"
  | "portfolio"
  | "course"
  | "miniSaas"
  | "blank";

export type PageTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  html: string;
};

export type StudioPageTemplate = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  kind: PageTemplateKind;
  previewImage?: string;
  html: string;
};

export type StudioSectionTemplate = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  sections: SectionKind[];
  html: string;
};

/* =====================================================
   THEME / BRAND DESIGN
===================================================== */

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
    border?: string;
    buttonText?: string;
  };
  font: {
    heading: FontOption;
    body: FontOption;
  };
  preview?: {
    from?: string;
    to?: string;
  };
};

/* =====================================================
   HEADER SETTINGS
===================================================== */

export type HeaderEditableField =
  | "logo"
  | "businessName"
  | "tagline"
  | "navLinks"
  | "cta"
  | "login"
  | "logout"
  | "direction"
  | "colors"
  | "background"
  | "shadow"
  | "radius"
  | "sticky";

export type HeaderNavLink = {
  id: string;
  label: string;
  href: string;
  visible?: boolean;
};

export type HeaderSettings = {
  direction: Direction;
  businessName: string;
  tagline?: string;
  logoUrl?: string;
  links: HeaderNavLink[];
  showLogin?: boolean;
  showLogout?: boolean;
  showCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  sticky?: boolean;
};

/* =====================================================
   SMART BIZUPLY BLOCKS
===================================================== */

export type BizuplySmartBlockType =
  | "services"
  | "booking"
  | "bookings"
  | "products"
  | "lead-form"
  | "customer-club"
  | "reviews"
  | "faq"
  | "coupons"
  | "contact"
  | "whatsapp"
  | "smart-bot"
  | "bot-tree"
  | "bot-buttons"
  | "bot-whatsapp"
  | "social-links"
  | "social-feed"
  | "digital-course"
  | "course-lessons"
  | "course-pricing"
  | "mini-saas"
  | "mini-saas-login"
  | "mini-saas-billing"
  | "mini-saas-dashboard"
  | "mini-saas-profession";

export type BizuplySmartBlock = {
  type: BizuplySmartBlockType;
  label: string;
  description: string;
  html: string;
};

/* =====================================================
   SMART BOT / CONVERSATION TREE
===================================================== */

export type BotAnswerActionType =
  | "reply"
  | "ask-next"
  | "send-whatsapp"
  | "create-lead"
  | "book-appointment"
  | "show-services"
  | "show-price"
  | "open-link";

export type BotTreeOption = {
  id: string;
  label: string;
  nextNodeId?: string;
  action?: BotAnswerActionType;
  payload?: Record<string, string | number | boolean | null>;
};

export type BotTreeNode = {
  id: string;
  title: string;
  message: string;
  serviceId?: string;
  options: BotTreeOption[];
  fallbackMessage?: string;
};

export type SmartBotSettings = {
  enabled: boolean;
  botName: string;
  welcomeMessage: string;
  whatsappPhone?: string;
  businessTimezone?: string;
  defaultAction: BotAnswerActionType;
  nodes: BotTreeNode[];
};

/* =====================================================
   SOCIAL LINKS
===================================================== */

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "x"
  | "pinterest"
  | "website";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  visible: boolean;
};

/* =====================================================
   DIGITAL COURSE
===================================================== */

export type CourseAccessType = "free" | "paid" | "subscription" | "locked";

export type CourseLesson = {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  access: CourseAccessType;
  order: number;
};

export type DigitalCourseSettings = {
  enabled: boolean;
  title: string;
  description: string;
  price?: number;
  monthlyPrice?: number;
  currency: "ILS" | "USD" | "EUR";
  lessons: CourseLesson[];
};

/* =====================================================
   MINI SAAS
===================================================== */

export type MiniSaasProfession =
  | "fitness-coach"
  | "beauty-clinic"
  | "consultant"
  | "digital-course"
  | "events"
  | "therapist"
  | "real-estate"
  | "service-provider"
  | "custom";

export type MiniSaasFeatureKey =
  | "auth"
  | "client-dashboard"
  | "monthly-billing"
  | "appointments"
  | "crm"
  | "forms"
  | "courses"
  | "products"
  | "messages"
  | "analytics"
  | "documents"
  | "tasks";

export type MiniSaasPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  currency: "ILS" | "USD" | "EUR";
  features: MiniSaasFeatureKey[];
  highlighted?: boolean;
};

export type MiniSaasSettings = {
  enabled: boolean;
  profession: MiniSaasProfession;
  appName: string;
  loginEnabled: boolean;
  monthlyPaymentsEnabled: boolean;
  features: MiniSaasFeatureKey[];
  plans: MiniSaasPlan[];
};

/* =====================================================
   SITE / PUBLIC PAGE SETTINGS
===================================================== */

export type SitePageStatus = "draft" | "published";

export type SiteSeoSettings = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
};

export type SiteDomainProvider =
  | "bizuply-subdomain"
  | "custom-domain"
  | "pending-purchase"
  | "external-provider";

export type SiteDomainStatus =
  | "draft"
  | "available"
  | "connected"
  | "pending"
  | "failed";

export type SiteDomainSettings = {
  /** Business subdomain slug, for example dana-hair */
  slug: string;

  /** Full BizUply subdomain, for example dana-hair.sites.bizuply.com */
  subdomain?: string;

  /** Public URL, for example https://dana-hair.sites.bizuply.com */
  publicUrl?: string;

  /** Optional independent domain, for example dana-hair.co.il */
  customDomain?: string;

  /** Which domain mode is active */
  provider?: SiteDomainProvider;

  /** Domain connection / purchase status */
  status?: SiteDomainStatus;

  /** Whether this site is published */
  published: boolean;

  /** Optional DNS fields for future connection */
  dnsTarget?: string;
  verificationToken?: string;
};

export type SiteBrandSettings = {
  businessName: string;
  tagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  paletteId?: string;
  socialLinks?: SocialLink[];
  smartBot?: SmartBotSettings;
  digitalCourse?: DigitalCourseSettings;
  miniSaas?: MiniSaasSettings;
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
  status?: SitePageStatus;
  seo?: SiteSeoSettings;
  domain?: SiteDomainSettings;
  brand?: SiteBrandSettings;
  pages?: StudioSitePage[];
  activePageId?: string;

  /** Template metadata, used when site started from a website template. */
  templateId?: string;
  templateName?: string;

  /** Convenience fields for local / backend use. */
  subdomain?: string;
  publicUrl?: string;
};

/* =====================================================
   SAVED STUDIO PAGE
===================================================== */

export type StudioSavedPage = {
  id: string;
  name: string;
  slug?: string;
  html: string;
  css?: string;
  projectData?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

/* =====================================================
   SIMPLE OPTION TYPES
===================================================== */

export type StudioOption<T extends string = string> = {
  id: T;
  label: string;
  icon?: string;
  description?: string;
};

/* =====================================================
   MAIN PAGE PROPS
===================================================== */

export type WebsiteStudioPageProps = {
  businessId?: string;
  initialSlug?: string;
  onSave?: (payload: SiteSavePayload) => Promise<void> | void;
};

/* =====================================================
   COMPONENT PROPS
===================================================== */

export type StudioSidebarProps = {
  activePanel: ActiveStudioPanel;

  /** New controlled panel API */
  setActivePanel: (value: ActiveStudioPanel) => void;

  /** Optional alias for newer components */
  onPanelChange?: (value: ActiveStudioPanel) => void;

  onAddHtml: (html: string) => void;

  /**
   * Kept optional for backward compatibility only.
   * The old templates sidebar panel is removed.
   */
  onApplyTemplate?: (template: PageTemplate) => void;

  onApplyPalette: (palette: ThemePalette) => void;
  onOpenMedia: () => void;

  /** Domain panel support */
  businessId?: string;
  siteSlug?: string;
  publicUrl?: string;
  customDomain?: string;
  onSlugChange?: (slug: string) => void;
  onCustomDomainChange?: (domain: string) => void;
  onOpenDomainSearch?: () => void;

  /** Optional page hierarchy support. */
  pages?: StudioSitePage[];
  activePageId?: string;
  onSelectPage?: (pageId: string) => void;
  onAddPage?: (title: string, type?: StudioSitePageType) => void;
  onUpdatePageTitle?: (pageId: string, title: string) => void;
};

export type StudioTopbarProps = {
  slug: string;
  setSlug: (value: string) => void;
  slugValid: boolean;
  device: DeviceMode;
  setDevice: (device: DeviceMode) => void;
  ready: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onMedia: () => void;
  onReset: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export type StudioCanvasProps = {
  editorRefContainer: React.RefObject<HTMLDivElement | null>;
  publicUrl: string;
  layersRef?: React.RefObject<HTMLDivElement | null>;
};

export type StudioInspectorProps = {
  activeTab: InspectorTab;
  setActiveTab: (value: InspectorTab) => void;
  stylesRef: React.RefObject<HTMLDivElement | null>;
  traitsRef: React.RefObject<HTMLDivElement | null>;
  pages?: StudioSitePage[];
  selectedComponent?: unknown;
  onApplyLink?: (link: StudioEditableLink) => void;
  onSetBackgroundImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onApplyStyle: (style: StylePatch) => void;
  onSetAnimation: (animation: AnimationPresetValue | string) => void;
  onClearAnimation: () => void;
};

/* =====================================================
   GRAPES
===================================================== */

export type GrapesEditor = Editor;