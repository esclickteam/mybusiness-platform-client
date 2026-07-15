import type {
  VisualAttributeValue,
  VisualInsertedElementType,
  VisualLayoutItem,
} from "../utils/visualData";

export type VisualLibraryTab =
  | "elements"
  | "sections"
  | "pages"
  | "media";

export type VisualLibraryCategory =
  | "featured"
  | "text"
  | "buttons"
  | "images"
  | "video"
  | "social"
  | "contact"
  | "graphics"
  | "shapes"
  | "gallery"
  | "forms"
  | "menu"
  | "lists"
  | "embed"
  | "apps"
  | "hero"
  | "about"
  | "services"
  | "portfolio"
  | "testimonials"
  | "pricing"
  | "faq"
  | "team"
  | "stats"
  | "cta"
  | "footer"
  | "legal"
  | "blog"
  | "commerce"
  | "features"
  | "promote"
  | "events"
  | "resume";

export type VisualLibraryNodeTemplate = {
  key: string;
  type: VisualInsertedElementType;
  label: string;
  tagName?: string;
  parentKey?: string;
  content?: Record<string, any>;
  style?: Record<string, any>;
  layout?: VisualLayoutItem;
  attributes?: Record<string, VisualAttributeValue>;
};

export type VisualLibraryElementItem = {
  id: string;
  kind: "element" | "group";
  tab: "elements";
  category: VisualLibraryCategory;
  title: string;
  description: string;
  keywords: string[];
  previewHtml?: string;
  thumbnail?: string;
  nodes: VisualLibraryNodeTemplate[];
};

export type VisualLibrarySectionTemplate = {
  id: string;
  kind: "section";
  tab: "sections";
  category: VisualLibraryCategory;
  title: string;
  description: string;
  keywords: string[];
  previewHtml?: string;
  thumbnail?: string;
  minHeight?: string | number;
  backgroundColor?: string;
  nodes: VisualLibraryNodeTemplate[];
};

export type VisualLibraryPageTemplate = {
  id: string;
  kind: "page";
  tab: "pages";
  category: VisualLibraryCategory;
  title: string;
  description: string;
  slugSuggestion: string;
  keywords: string[];
  thumbnail?: string;
  sectionIds: string[];
};

export type VisualLibraryMediaItem = {
  id: string;
  kind: "media";
  tab: "media";
  category: VisualLibraryCategory;
  title: string;
  description: string;
  keywords: string[];
  src: string;
  thumbnail: string;
  mediaType: "image" | "video";
  alt: string;
};

export type VisualLibraryEntry =
  | VisualLibraryElementItem
  | VisualLibrarySectionTemplate
  | VisualLibraryPageTemplate
  | VisualLibraryMediaItem;
