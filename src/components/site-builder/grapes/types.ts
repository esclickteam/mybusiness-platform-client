import type { Editor } from "grapesjs";

export type BizuplySitePayload = {
  slug: string;
  projectData: unknown;
  html: string;
  css: string;
  published: boolean;
  updatedAt: string;
};

export type BizuplyWebsiteStudioProps = {
  businessId?: string;
  initialSlug?: string;
  onSave?: (payload: BizuplySitePayload) => Promise<void> | void;
};

export type GrapesEditor = Editor;