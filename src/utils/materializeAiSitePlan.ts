import {
  getSectionTemplateById,
  SECTION_LIBRARY,
} from "../components/site-builder/studio/visual-editor/library/sectionLibrary";
import {
  writeVisualAttributesItem,
  writeVisualContentItem,
  writeVisualInsertedElement,
  writeVisualInsertedSection,
  writeVisualLayoutItem,
  writeVisualStyleItem,
  type VisualContentItem,
} from "../components/site-builder/studio/visual-editor/utils/visualData";

export type AiSectionPlan = {
  libraryId: string;
  content?: Record<string, string | VisualContentItem>;
};

export type AiPagePlan = {
  id: string;
  title: string;
  slug?: string;
  type?: string;
  isHome?: boolean;
  sections: AiSectionPlan[];
};

export type AiSitePlan = {
  siteName: string;
  hostTemplateKey?: string;
  templateKey?: string;
  palette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  brand?: {
    businessName?: string;
    tagline?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  pages: AiPagePlan[];
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function applyPaletteToStyle(
  style: Record<string, any> | undefined,
  palette: AiSitePlan["palette"]
) {
  if (!style || !palette) return { ...(style || {}) };

  const next = { ...style };

  // Swap common dark heading colors with brand text / primary accents
  if (next.color === "#0f172a" && palette.text) {
    next.color = palette.text;
  }
  if (next.backgroundColor === "#ffffff" && palette.background) {
    next.backgroundColor = palette.background;
  }
  if (
    typeof next.backgroundImage === "string" &&
    next.backgroundImage.includes("linear-gradient") &&
    palette.primary &&
    palette.secondary
  ) {
    next.backgroundImage = `linear-gradient(90deg,${palette.primary},${palette.secondary})`;
  }
  if (palette.primary && next.color === "#c2410c") {
    next.color = palette.primary;
  }
  if (palette.primary && next.border?.includes?.("#fdba74")) {
    next.border = `1px solid ${palette.primary}`;
  }

  return next;
}

function normalizeContentOverride(
  value: string | VisualContentItem | undefined,
  existing?: VisualContentItem
): VisualContentItem | null {
  if (value == null) return null;
  if (typeof value === "string") {
    if (existing?.src || existing?.url || existing?.secureUrl) {
      return {
        ...existing,
        alt: value,
      };
    }
    return {
      ...(existing || {}),
      text: value,
    };
  }
  return {
    ...(existing || {}),
    ...value,
  };
}

/**
 * Expand SECTION_LIBRARY blueprints into a blank visual page snapshot.
 */
export function materializePageVisualData(
  page: AiPagePlan,
  palette?: AiSitePlan["palette"]
) {
  let data: Record<string, any> = {
    __blankVisualPage: true,
    __libraryPage: true,
    __activePageId: page.id,
    __insertedSections: {},
    __insertedElements: {},
    __content: {},
    __styles: {},
    __layout: {},
    __attributes: {},
  };

  let previousSectionId = "";

  (page.sections || []).forEach((sectionPlan, index) => {
    const template = getSectionTemplateById(sectionPlan.libraryId);
    if (!template) return;

    const sectionId = uid(`sec-${template.category || "block"}`);

    data = writeVisualInsertedSection(data, {
      id: sectionId,
      anchorId: previousSectionId || undefined,
      placement: index === 0 ? "append" : "after",
      label: template.title,
      libraryId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    data = writeVisualStyleItem(data, sectionId, {
      backgroundColor:
        palette?.background && index === 0
          ? palette.background
          : template.backgroundColor || "#ffffff",
      padding: "64px 32px",
    } as any);

    data = writeVisualLayoutItem(data, sectionId, {
      position: "relative",
      width: "100%",
      minHeight: template.minHeight || "320px",
      zIndex: 1,
    });

    const keyToId: Record<string, string> = {};
    template.nodes.forEach((node) => {
      keyToId[node.key] = uid(`el-${node.type}`);
    });

    template.nodes.forEach((node) => {
      const id = keyToId[node.key];
      const parentKey = node.parentKey || "root";
      const parentId =
        parentKey === "root" ? sectionId : keyToId[parentKey] || sectionId;

      data = writeVisualInsertedElement(data, {
        id,
        type: node.type,
        parentId,
        sectionId,
        label: node.label,
        tagName: node.tagName,
        libraryId: template.id,
        localKey: node.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      let content = node.content ? { ...node.content } : undefined;
      const override = sectionPlan.content?.[node.key];
      const normalized = normalizeContentOverride(override as any, content);
      if (normalized) content = normalized;

      // Map common AI keys onto first matching semantic node keys
      if (!override && sectionPlan.content) {
        const semantic = sectionPlan.content as Record<string, any>;
        if (node.key === "title" && semantic.title) {
          content = { ...(content || {}), text: String(semantic.title) };
        }
        if (
          (node.key === "copy" || node.key === "subtitle") &&
          (semantic.copy || semantic.subtitle || semantic.description)
        ) {
          content = {
            ...(content || {}),
            text: String(
              semantic.copy || semantic.subtitle || semantic.description
            ),
          };
        }
        if (node.key === "badge" && semantic.badge) {
          content = { ...(content || {}), text: String(semantic.badge) };
        }
        if (node.key === "eyebrow" && (semantic.eyebrow || semantic.badge)) {
          content = {
            ...(content || {}),
            text: String(semantic.eyebrow || semantic.badge),
          };
        }
        if (
          (node.key === "primary" || node.key === "cta") &&
          (semantic.ctaButton || semantic.primary)
        ) {
          content = {
            ...(content || {}),
            text: String(semantic.ctaButton || semantic.primary),
            href: String(semantic.ctaHref || content?.href || "/contact"),
          };
        }
        if (node.key === "secondary" && semantic.secondary) {
          content = {
            ...(content || {}),
            text: String(semantic.secondary),
          };
        }
      }

      if (content) {
        data = writeVisualContentItem(data, id, content);
      }

      if (node.style) {
        data = writeVisualStyleItem(
          data,
          id,
          applyPaletteToStyle(node.style as any, palette) as any
        );
      }

      if (node.layout) {
        data = writeVisualLayoutItem(data, id, node.layout as any);
      }

      if (node.attributes) {
        data = writeVisualAttributesItem(data, id, node.attributes as any);
      }
    });

    previousSectionId = sectionId;
  });

  return data;
}

export function materializeAiSitePlan(plan: AiSitePlan) {
  const hostTemplateKey = String(
    plan.hostTemplateKey || plan.templateKey || "velmora"
  ).toLowerCase();

  const pages = (plan.pages || []).map((page, index) => {
    const visual = materializePageVisualData(page, plan.palette);
    const pageId = page.id || (index === 0 ? "home" : `page-${index + 1}`);
    const isHome = Boolean(page.isHome || index === 0);

    return {
      id: pageId,
      title: page.title || (isHome ? "דף הבית" : `עמוד ${index + 1}`),
      slug: isHome ? "" : String(page.slug || pageId).replace(/^\//, ""),
      type: page.type || (isHome ? "home" : "blank"),
      isHome,
      html: "",
      css: "",
      templateKey: hostTemplateKey,
      templateEditorMode: "visual-react",
      editorMode: "visual-react",
      data: visual,
      templateData: visual,
      projectData: {
        editorMode: "visual-react",
        templateKey: hostTemplateKey,
        data: visual,
        templateData: visual,
        activePageId: pageId,
      },
      visualEditorPayload: {
        editorMode: "visual-react",
        templateKey: hostTemplateKey,
        data: visual,
        templateData: visual,
        snapshotPageId: pageId,
      },
      snapshotPageId: pageId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const home = pages.find((p) => p.isHome) || pages[0];
  const homeVisual = home?.templateData || {};

  return {
    hostTemplateKey,
    pages,
    homeVisual,
    activePageId: home?.id || "home",
  };
}

export function listAvailableSectionLibraryIds() {
  return SECTION_LIBRARY.map((s) => ({
    id: s.id,
    category: s.category,
    title: s.title,
  }));
}

/** Default page → sections mapping when AI omits details */
export function defaultSectionsForPageType(type: string): string[] {
  switch (type) {
    case "home":
      return [
        "section-hero-business",
        "section-about-split",
        "section-services-cards",
        "section-testimonials",
        "section-cta-gradient",
        "section-footer",
      ];
    case "about":
      return ["section-about-split", "section-team", "section-stats", "section-footer"];
    case "services":
      return ["section-services-cards", "section-pricing", "section-cta-gradient", "section-footer"];
    case "gallery":
      return ["section-gallery-grid", "section-cta-gradient", "section-footer"];
    case "pricing":
      return ["section-pricing", "section-faq", "section-footer"];
    case "testimonials":
      return ["section-testimonials", "section-cta-gradient", "section-footer"];
    case "faq":
      return ["section-faq", "section-contact", "section-footer"];
    case "contact":
      return ["section-contact", "section-footer"];
    default:
      return ["section-about-split", "section-cta-gradient", "section-footer"];
  }
}
