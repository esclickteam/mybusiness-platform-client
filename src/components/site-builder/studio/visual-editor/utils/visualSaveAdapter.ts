export type VisualSaveAdapterInput = {
  templateKey: string;
  data: Record<string, any>;
  slug?: string;
  published?: boolean;
  status?: "draft" | "published";
  publicUrl?: string;
  siteDomain?: string;
  htmlSnapshot?: string;
  snapshotPageId?: string;
};

export function buildVisualSavePayload(input: VisualSaveAdapterInput) {
  const now = new Date().toISOString();
  const published = Boolean(input.published || input.status === "published");
  const status: "draft" | "published" = published ? "published" : "draft";

  return {
    templateKey: input.templateKey,
    editorMode: "visual-react" as const,
    templateEditorMode: "visual-react" as const,

    data: input.data,
    templateData: input.data,

    updatedAt: now,
    published,
    status,

    slug: input.slug,
    publicUrl: input.publicUrl,
    siteDomain: input.siteDomain,

    domain: input.slug
      ? {
          slug: input.slug,
          published,
        }
      : undefined,

    htmlSnapshot: input.htmlSnapshot || "",
    snapshotPageId: input.snapshotPageId || "home",

    projectData: {
      editorMode: "visual-react",
      templateKey: input.templateKey,
      templateData: input.data,
      updatedAt: now,
    },
  };
}

export function readSavedVisualTemplateData(site: any): Record<string, any> {
  const candidates = [
    site?.templateData,
    site?.data,
    site?.visualEditorPayload?.data,
    site?.projectData?.templateData,
    site?.projectData?.data,
    site?.editor?.templateData,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Record<string, any>;
    }
  }

  return {};
}

export function readSavedVisualTemplateKey(site: any): string {
  return String(
    site?.templateKey ||
      site?.projectData?.templateKey ||
      site?.visualEditorPayload?.templateKey ||
      site?.editor?.templateKey ||
      "",
  )
    .trim()
    .toLowerCase();
}

export function isVisualReactSavedSite(site: any) {
  const mode = String(
    site?.templateEditorMode ||
      site?.editorMode ||
      site?.projectData?.editorMode ||
      site?.visualEditorPayload?.editorMode ||
      "",
  )
    .trim()
    .toLowerCase();

  return mode === "visual-react" || Boolean(site?.templateData);
}