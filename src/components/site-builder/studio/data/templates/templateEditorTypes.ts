import type { ComponentType } from "react";

export type StudioTemplateEditorMode = "grapes-html" | "visual-react";

export type StudioTemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "image-list"
  | "color"
  | "link"
  | "select"
  | "boolean"
  | "products"
  | "gallery";

export type StudioTemplateFieldOption = {
  label: string;
  value: string;
};

export type StudioTemplateField = {
  key: string;
  label: string;
  type: StudioTemplateFieldType;
  placeholder?: string;
  options?: StudioTemplateFieldOption[];
};

export type StudioTemplateSchemaSection = {
  id: string;
  label: string;
  description?: string;
  fields: StudioTemplateField[];
};

export type StudioTemplateSchema = {
  sections: StudioTemplateSchemaSection[];
};

export type StudioTemplateRendererPage = {
  id: string;
  name: string;
  slug: string;
};

export type StudioTemplateRenderer = {
  key: string;
  name: string;
  Component: ComponentType<any>;
  pages: StudioTemplateRendererPage[];
  editorMode: StudioTemplateEditorMode;
  schema?: StudioTemplateSchema;
  defaultData?: Record<string, any>;
  editorCss?: string;
};