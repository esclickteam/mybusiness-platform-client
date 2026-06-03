import React from "react";
import { useParams } from "react-router-dom";
import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";
import type { SiteSavePayload } from "../components/site-builder/studio/types";

export default function BusinessMiniSiteBuilder() {
  const { businessId } = useParams();

  const handleSave = async (payload: SiteSavePayload) => {
    /*
      שלב הבא — חיבור אמיתי לשרת:

      await fetch("/api/business/my/mini-site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    */

    console.log("SAVE MINI SITE:", {
      businessId,
      payload,
    });
  };

  return (
    <WebsiteStudioPage
      businessId={businessId}
      initialSlug="hadar-beauty"
      onSave={handleSave}
    />
  );
}