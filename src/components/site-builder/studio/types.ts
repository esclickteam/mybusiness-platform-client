import type { Editor } from "grapesjs";

/* =====================================================
   DEVICE / VIEW
===================================================== */

export type DeviceMode = "Desktop" | "Tablet" | "Mobile";

/* =====================================================
   MAIN STUDIO PANELS
   null = no panel open. This is required for click-to-open/click-to-close sidebar.
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
   SECTION TEMPLATES
===================================================== */

export type SectionCategory =
  | "header"
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
  | "bot"
  | "social"
  | "course"
  | "miniSaas"
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
   SECTION LAYOUT VARIANTS
   Used by Grapes toolbar: "✨ מבנה"
===================================================== */

export type SectionKind =
  | "header"
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "store"
  | "booking"
  | "reviews"
  | "contact"
  | "club"
  | "bot"
  | "social"
  | "course"
  | "miniSaas"
  | "basic";

export type SectionLayoutVariant = {
  id: string;
  kind: SectionKind;
  title: string;
  description: string;
  previewLabel: string;
  badge: string;
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
  };
  font: {
    heading: FontOption;
    body: FontOption;
  };
};

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

export type SiteDomainSettings = {
  slug: string;
  customDomain?: string;
  published: boolean;
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

  /**
   * שדות אופציונליים להמשך חיבור למונגו / פרסום אמיתי
   */
  status?: SitePageStatus;
  seo?: SiteSeoSettings;
  domain?: SiteDomainSettings;
  brand?: SiteBrandSettings;
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
   Keeping these optional lets the UI evolve without TS errors.
===================================================== */

export type StudioSidebarProps = {
  activePanel: ActiveStudioPanel;
  setActivePanel: (value: ActiveStudioPanel) => void;
  onAddHtml: (html: string) => void;
  onApplyTemplate: (template: PageTemplate) => void;
  onApplyPalette: (palette: ThemePalette) => void;
  onOpenMedia: () => void;
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
