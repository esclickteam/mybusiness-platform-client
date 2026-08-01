import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMySite } from "../api/mySitesApi";
import PublicVisualSiteRenderer from "../components/site-builder/public/PublicVisualSiteRenderer";

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
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    if (!siteId) return;

    let active = true;
    setSite(null);
    setFailed(false);
    setPathname("/");

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

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname || "/");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (failed || !site) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  const isScreenshotCapture =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("shot") === "1";

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#fff" }}>
      {isScreenshotCapture ? (
        <style>{`
          [data-reveal], [data-animate], [data-motion], .bizuply-reveal-up,
          [class*="opacity-0"] {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
            filter: none !important;
          }
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        `}</style>
      ) : null}
      <PublicVisualSiteRenderer site={site} pathname={pathname} disableAnalytics />
    </div>
  );
}
