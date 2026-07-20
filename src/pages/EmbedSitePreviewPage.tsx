import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PublicVisualSiteRenderer from "../components/site-builder/public/PublicVisualSiteRenderer";
import { getMySite } from "../api/mySitesApi";

/**
 * Standalone, isolated render of a single site using the exact same renderer as
 * the published site (template + the user's saved visual data — including their
 * text/image edits). Meant to be embedded in an <iframe> as a live, 1:1 preview
 * on the "My Sites" cards.
 */
export default function EmbedSitePreviewPage() {
  const { siteId = "" } = useParams<{ siteId: string }>();
  const [site, setSite] = useState<Record<string, any> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    let active = true;
    setSite(null);
    setFailed(false);

    getMySite(siteId)
      .then((result) => {
        if (!active) return;
        if (result) setSite(result);
        else setFailed(true);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [siteId]);

  if (failed || !site) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#fff" }}>
      <PublicVisualSiteRenderer site={site} pathname="/" disableAnalytics />
    </div>
  );
}
