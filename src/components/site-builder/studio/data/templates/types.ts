import type { ReactNode } from "react";
import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";

export type StudioTemplateCategory =
  | "landing"
  | "business"
  | "real-estate"
  | "portfolio"
  | "store"
  | "food"
  | "medical"
  | "education"
  | "beauty"
  | "service"
  | "home-services"
  | "fitness";

export type StudioTemplateDefinition = {
  id: string;
  name: string;
  author: string;
  priceLabel: string;
  category: StudioTemplateCategory;
  categoryLabel: string;
  badge?: string;
  description: string;
  /** Hero / marketing still — NOT used for gallery cards. */
  previewImage?: string;
  /**
   * Full-page desktop screenshot of the template homepage.
   * Prefer generated `/template-screenshots/{id}.webp` via the screenshot script.
   */
  fullPagePreview?: string;
  seed: ReadyWebsiteTemplateSeed;
  thumbnail?: ReactNode;
  preview?: ReactNode;
};