import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";

import { getStudioTemplateRenderer } from "../components/site-builder/studio/data/templates/templateRendererRegistry";
import { localizeBuiltInTemplateSeed } from "../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../i18n/localeUtils";
import { setTemplateLanguageOverride } from "../i18n/templateDir";

/**
 * Standalone live render of a studio template's homepage for gallery card
 * iframes. Uses the real React template + app Tailwind so the thumbnail
 * matches Webflow-style marketplace previews (actual site UX, not a screenshot).
 */
export default function EmbedTemplatePreviewPage() {
  const { i18n } = useTranslation();
  const { templateKey = "" } = useParams<{ templateKey: string }>();
  const [searchParams] = useSearchParams();
  const modeParam = String(searchParams.get("mode") || "preview").toLowerCase();
  const mode = modeParam === "edit" ? "edit" : "preview";
  const language = searchParams.get("lang") || i18n.language;
  setTemplateLanguageOverride(searchParams.get("lang"));

  const renderer = useMemo(
    () => getStudioTemplateRenderer(templateKey),
    [templateKey],
  );

  if (!renderer?.Component) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  const Component = renderer.Component as React.ComponentType<Record<string, unknown>>;
  const data = localizeBuiltInTemplateSeed(
    (renderer.defaultData || {}) as Record<string, unknown>,
    language,
  );
  const homePage = renderer.pages?.[0];
  const pageId = homePage?.id || "home";
  const pageSlug = homePage?.slug || "/";
  const key = String(renderer.key || templateKey).toLowerCase();

  return (
    <div
      dir={getTextDirection(language)}
      data-template-card-embed="true"
      data-parity-surface={mode}
      style={{
        minHeight: "100vh",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {renderer.editorCss ? (
        <style dangerouslySetInnerHTML={{ __html: String(renderer.editorCss) }} />
      ) : null}

      {/* Force entrance/reveal states open so the card never shows a blank hero */}
      <style>{`
        [data-template-card-embed="true"] [data-reveal],
        [data-template-card-embed="true"] [data-animate],
        [data-template-card-embed="true"] [data-motion],
        [data-template-card-embed="true"] .bizuply-reveal-up,
        [data-template-card-embed="true"] [class*="opacity-0"] {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
        }
        [data-template-card-embed="true"] *,
        [data-template-card-embed="true"] *::before,
        [data-template-card-embed="true"] *::after {
          animation-delay: 0s !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          animation-fill-mode: both !important;
        }
      `}</style>

      <div data-template-id={key} dir={getTextDirection(language)}>
        <Component
          initialPage={pageId}
          initialPageId={pageId}
          activePageId={pageId}
          currentPageId={pageId}
          pageId={pageId}
          initialSlug={pageSlug}
          activePageSlug={pageSlug}
          currentPageSlug={pageSlug}
          pageSlug={pageSlug}
          mode={mode}
          data={data}
          templateData={data}
          isStudioStatic
        />
      </div>
    </div>
  );
}
