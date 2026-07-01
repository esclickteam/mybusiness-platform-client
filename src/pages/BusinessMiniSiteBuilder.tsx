import React, { useMemo } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";

import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";
import {
  getStudioTemplateById,
  getStudioTemplateSeedById,
  templateSeedHasEditorPages,
} from "../components/site-builder/studio/data/templates";

import type { SiteSavePayload } from "../components/site-builder/studio/types";
import type { ReadyWebsiteTemplateSeed } from "../components/site-builder/studio/data/readyWebsiteTypes";

type WebsiteStudioPageWithTemplateProps = {
  businessId: string;
  initialSlug: string;
  onSave: (payload: SiteSavePayload) => Promise<void>;
  initialTemplateId?: string;
  initialTemplateSeed?: ReadyWebsiteTemplateSeed;
  forceTemplateLoad?: boolean;
};

const StudioPage =
  WebsiteStudioPage as React.ComponentType<WebsiteStudioPageWithTemplateProps>;

function safeParseSavedSite(raw: string | null): Partial<SiteSavePayload> | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Partial<SiteSavePayload>;
  } catch {
    return null;
  }
}

function normalizeTemplateId(value: string | null) {
  const cleanValue = value?.trim();
  return cleanValue || "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[֐-׿]+/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function getDefaultBusinessSlug(businessId?: string) {
  if (!businessId) return "your-business";

  const safeBusinessId = slugify(businessId);
  return safeBusinessId || "your-business";
}

function getSavedSlug(storageKey: string) {
  if (typeof window === "undefined") return "";

  const saved = safeParseSavedSite(localStorage.getItem(storageKey));

  return typeof saved?.slug === "string" && saved.slug.trim()
    ? slugify(saved.slug)
    : "";
}

export default function BusinessMiniSiteBuilder() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();

  const storageKey = useMemo(() => {
    return `bizuply-mini-site-${businessId || "demo"}`;
  }, [businessId]);

  const templateIdFromUrl = useMemo(() => {
    return normalizeTemplateId(searchParams.get("templateId"));
  }, [searchParams]);

  const templateIdFromStorage = useMemo(() => {
    if (typeof window === "undefined") return "";
    return normalizeTemplateId(localStorage.getItem("bizuply-selected-template-id"));
  }, []);

  const selectedTemplateId = useMemo(() => {
    return templateIdFromUrl || templateIdFromStorage;
  }, [templateIdFromUrl, templateIdFromStorage]);

  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId) return undefined;
    return getStudioTemplateById(selectedTemplateId);
  }, [selectedTemplateId]);

  const selectedTemplateSeed = useMemo(() => {
    if (!selectedTemplateId) return undefined;
    return getStudioTemplateSeedById(selectedTemplateId);
  }, [selectedTemplateId]);

  const selectedTemplateCanOpenInEditor = useMemo(() => {
    return templateSeedHasEditorPages(selectedTemplateSeed);
  }, [selectedTemplateSeed]);

  const editorTemplateSeed = useMemo(() => {
    return selectedTemplateCanOpenInEditor ? selectedTemplateSeed : undefined;
  }, [selectedTemplateCanOpenInEditor, selectedTemplateSeed]);

  const shouldForceTemplateLoad = useMemo(() => {
    return Boolean(templateIdFromUrl && editorTemplateSeed);
  }, [templateIdFromUrl, editorTemplateSeed]);

  const initialSlug = useMemo(() => {
    if (!businessId) return "your-business";

    const savedSlug = getSavedSlug(storageKey);
    if (savedSlug) return savedSlug;

    return getDefaultBusinessSlug(businessId);
  }, [businessId, storageKey]);

  React.useEffect(() => {
    if (!templateIdFromUrl || !selectedTemplate || selectedTemplateCanOpenInEditor) {
      return;
    }

    window.alert(
      `התבנית ${selectedTemplate.name} עדיין לא מחוברת ל-editor.pages ולכן אי אפשר לפתוח אותה לעריכה. עמוד התבניות ייפתח עכשיו.`
    );

    navigate(`/business/${businessId}/dashboard/website/templates`, {
      replace: true,
    });
  }, [
    businessId,
    navigate,
    selectedTemplate,
    selectedTemplateCanOpenInEditor,
    templateIdFromUrl,
  ]);

  const handleSave = async (payload: SiteSavePayload) => {
    if (!businessId) {
      console.error("Missing businessId for mini site save", payload);
      alert("לא נמצא מזהה עסק. אי אפשר לשמור את האתר.");
      return;
    }

    const finalSlug =
      slugify(payload.slug || payload.domain?.slug || initialSlug) ||
      getDefaultBusinessSlug(businessId);

    const safePayload: SiteSavePayload & {
      businessId: string;
      templateId?: string;
      templateName?: string;
      subdomain?: string;
      publicUrl?: string;
    } = {
      ...payload,
      businessId,
      templateId: selectedTemplateCanOpenInEditor ? selectedTemplateId || undefined : undefined,
      templateName: selectedTemplateCanOpenInEditor ? selectedTemplate?.name : undefined,
      slug: finalSlug,
      published: Boolean(payload.published),
      html: payload.html || "",
      css: payload.css || "",
      projectData: payload.projectData || {},
      updatedAt: payload.updatedAt || new Date().toISOString(),
      status: payload.published ? "published" : "draft",
      subdomain: `${finalSlug}.sites.bizuply.com`,
      publicUrl: `https://${finalSlug}.sites.bizuply.com`,
      domain: {
        slug: finalSlug,
        subdomain: `${finalSlug}.sites.bizuply.com`,
        publicUrl: `https://${finalSlug}.sites.bizuply.com`,
        published: Boolean(payload.published),
        customDomain: payload.domain?.customDomain,
        provider: "bizuply-subdomain",
        status: payload.published ? "connected" : "draft",
      },
      seo: payload.seo || {
        title: "האתר שלי",
        description:
          selectedTemplate?.description || "אתר עסקי מקצועי שנבנה עם BizUply",
      },
      brand: payload.brand || {
        businessName: "העסק שלי",
      },
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(safePayload));

      if (selectedTemplateCanOpenInEditor && selectedTemplateId) {
        localStorage.setItem("bizuply-selected-template-id", selectedTemplateId);
      }
    } catch (error) {
      console.error("MINI SITE SAVE ERROR:", error);
      alert("אירעה שגיאה בשמירת האתר. נסי שוב.");
    }
  };

  React.useEffect(() => {
    if (!selectedTemplateCanOpenInEditor || !selectedTemplateId) return;
    localStorage.setItem("bizuply-selected-template-id", selectedTemplateId);
  }, [selectedTemplateCanOpenInEditor, selectedTemplateId]);

  if (!businessId) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return (
    <StudioPage
      businessId={businessId}
      initialSlug={initialSlug}
      initialTemplateId={selectedTemplateCanOpenInEditor ? selectedTemplateId || undefined : undefined}
      initialTemplateSeed={editorTemplateSeed}
      forceTemplateLoad={shouldForceTemplateLoad}
      onSave={handleSave}
    />
  );
}
