import React from "react";
import { useParams } from "react-router-dom";
import BizuplyWebsiteStudio from "../components/site-builder/grapes/BizuplyWebsiteStudio";
import type { BizuplySitePayload } from "../components/site-builder/grapes/types";

export default function BusinessMiniSiteBuilder() {
  const { businessId } = useParams();

  const handleSave = async (payload: BizuplySitePayload) => {
    /*
      שלב הבא נחבר לשרת:

      await fetch("/api/business/my/mini-site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    */

    console.log("SAVE FROM PAGE:", {
      businessId,
      payload,
    });
  };

  return (
    <BizuplyWebsiteStudio
      businessId={businessId}
      initialSlug="hadar-beauty"
      onSave={handleSave}
    />
  );
}