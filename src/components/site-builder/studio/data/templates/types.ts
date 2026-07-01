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
  | "service";

export type StudioTemplateDefinition = {
  id: string;
  name: string;
  author: string;
  priceLabel: string;
  category: StudioTemplateCategory;
  categoryLabel: string;
  badge?: string;
  description: string;
  previewImage?: string;
  seed: ReadyWebsiteTemplateSeed;
  thumbnail?: ReactNode;
  preview?: ReactNode;
};