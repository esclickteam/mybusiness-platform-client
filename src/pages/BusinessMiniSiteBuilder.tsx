import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";

import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";
import type { SiteSavePayload } from "../components/site-builder/studio/types";

export default function BusinessMiniSiteBuilder() {
  const { businessId } = useParams<{ businessId: string }>();

  const storageKey = useMemo(() => {
    return `bizuply-mini-site-${businessId || "demo"}`;
  }, [businessId]);

  const initialSlug = useMemo(() => {
    if (!businessId) return "your-business";

    const savedRaw = localStorage.getItem(storageKey);

    if (!savedRaw) return "your-business";

    try {
      const saved = JSON.parse(savedRaw) as Partial<SiteSavePayload>;

      return typeof saved.slug === "string" && saved.slug.trim()
        ? saved.slug
        : "your-business";
    } catch {
      return "your-business";
    }
  }, [businessId, storageKey]);

  const handleSave = async (payload: SiteSavePayload) => {
    if (!businessId) {
      console.error("Missing businessId for mini site save", payload);
      alert("לא נמצא מזהה עסק. אי אפשר לשמור את האתר.");
      return;
    }

    const safePayload: SiteSavePayload & { businessId: string } = {
      ...payload,
      businessId,
      slug: payload.slug || "your-business",
      published: Boolean(payload.published),
      html: payload.html || "",
      css: payload.css || "",
      projectData: payload.projectData || {},
      updatedAt: payload.updatedAt || new Date().toISOString(),
      status: payload.published ? "published" : "draft",
      domain: {
        slug: payload.slug || "your-business",
        published: Boolean(payload.published),
        customDomain: payload.domain?.customDomain,
      },
      seo: payload.seo || {
        title: "האתר שלי",
        description: "אתר עסקי מקצועי שנבנה עם Bizuply",
      },
      brand: payload.brand || {
        businessName: "העסק שלי",
      },
    };

    try {
      console.log("SAVE MINI SITE:", safePayload);

      localStorage.setItem(storageKey, JSON.stringify(safePayload));

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

  if (!businessId) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return (
    <WebsiteStudioPage
      businessId={businessId}
      initialSlug={initialSlug}
      onSave={handleSave}
    />
  );
}