import React, { useMemo } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";
import {
  getStudioTemplateById,
  getStudioTemplateSeedById,
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
    .replace(/[^a-z0-9\u0590-\u05ff]+/gi, "-")
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

    return normalizeTemplateId(
      localStorage.getItem("bizuply-selected-template-id")
    );
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

  const shouldForceTemplateLoad = useMemo(() => {
    return Boolean(templateIdFromUrl && selectedTemplateSeed);
  }, [templateIdFromUrl, selectedTemplateSeed]);

  const initialSlug = useMemo(() => {
    if (!businessId) return "your-business";

    const savedSlug = getSavedSlug(storageKey);

    if (savedSlug) {
      return savedSlug;
    }

    return getDefaultBusinessSlug(businessId);
  }, [businessId, storageKey]);

  const handleSave = async (payload: SiteSavePayload) => {
    if (!businessId) {
      console.error("Missing businessId for mini site save", payload);
      alert("לא נמצא מזהה עסק. אי אפשר לשמור את האתר.");
      return;
    }

    const finalSlug = slugify(payload.slug || initialSlug);

    const safePayload: SiteSavePayload & {
      businessId: string;
      templateId?: string;
      templateName?: string;
      subdomain?: string;
      publicUrl?: string;
    } = {
      ...payload,
      businessId,
      templateId: selectedTemplateId || undefined,
      templateName: selectedTemplate?.name,
      slug: finalSlug || getDefaultBusinessSlug(businessId),
      published: Boolean(payload.published),
      html: payload.html || "",
      css: payload.css || "",
      projectData: payload.projectData || {},
      updatedAt: payload.updatedAt || new Date().toISOString(),
      status: payload.published ? "published" : "draft",
      subdomain: `${finalSlug || getDefaultBusinessSlug(businessId)}.sites.bizuply.com`,
      publicUrl: `https://${finalSlug || getDefaultBusinessSlug(
        businessId
      )}.sites.bizuply.com`,
      domain: {
        slug: finalSlug || getDefaultBusinessSlug(businessId),
        published: Boolean(payload.published),
        customDomain: payload.domain?.customDomain,
      },
      seo: payload.seo || {
        title: "האתר שלי",
        description:
          selectedTemplate?.description || "אתר עסקי מקצועי שנבנה עם Bizuply",
      },
      brand: payload.brand || {
        businessName: "העסק שלי",
      },
    };

    try {
      console.log("SAVE MINI SITE:", safePayload);

      localStorage.setItem(storageKey, JSON.stringify(safePayload));

      if (selectedTemplateId) {
        localStorage.setItem("bizuply-selected-template-id", selectedTemplateId);
      }

      /*
      const token = localStorage.getItem("token");

      const response = await fetch("/api/business/my/mini-site", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(safePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save mini site");
      }
      */
    } catch (error) {
      console.error("MINI SITE SAVE ERROR:", error);
      alert("אירעה שגיאה בשמירת האתר. נסי שוב.");
    }
  };

  React.useEffect(() => {
    if (!selectedTemplateId) return;

    localStorage.setItem("bizuply-selected-template-id", selectedTemplateId);
  }, [selectedTemplateId]);

  if (!businessId) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return (
    <StudioPage
      businessId={businessId}
      initialSlug={initialSlug}
      initialTemplateId={selectedTemplateId || undefined}
      initialTemplateSeed={selectedTemplateSeed}
      forceTemplateLoad={shouldForceTemplateLoad}
      onSave={handleSave}
    />
  );
}