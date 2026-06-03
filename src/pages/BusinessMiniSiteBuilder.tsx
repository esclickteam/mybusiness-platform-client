import React from "react";
import { useParams } from "react-router-dom";

import WebsiteStudioPage from "../components/site-builder/studio/WebsiteStudioPage";
import type { SiteSavePayload } from "../components/site-builder/studio/types";

export default function BusinessMiniSiteBuilder() {
  const { businessId } = useParams<{ businessId: string }>();

  const handleSave = async (payload: SiteSavePayload) => {
    if (!businessId) {
      console.error("Missing businessId for mini site save", payload);
      alert("לא נמצא מזהה עסק. אי אפשר לשמור את האתר.");
      return;
    }

    try {
      console.log("SAVE MINI SITE:", {
        businessId,
        payload,
      });

      /**
       * כרגע זה שומר מקומית כדי שהעורך יעבוד מיד.
       * אחרי שנחבר API אמיתי למונגו — פשוט נפתח את ה־fetch למטה.
       */
      localStorage.setItem(
        `bizuply-mini-site-${businessId}`,
        JSON.stringify({
          businessId,
          ...payload,
        })
      );

      /*
      const response = await fetch("/api/business/my/mini-site", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          businessId,
          ...payload,
        }),
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

  return (
    <WebsiteStudioPage
      businessId={businessId}
      initialSlug="hadar-beauty"
      onSave={handleSave}
    />
  );
}