import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  getStudioTemplateRenderer,
  hasStudioTemplateRenderer,
} from "../site-builder/studio/data/templates/templateRendererRegistry";
import SiteCardPreview from "./SiteCardPreview";

type TemplateCardPreviewProps = {
  templateKey: string;
  title?: string;
};

type RenderedTemplate = { html: string; css: string } | null;

const previewCache = new Map<string, RenderedTemplate>();

function normalizeKey(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

export function canRenderTemplatePreview(
  templateKey: string | null | undefined,
) {
  return hasStudioTemplateRenderer(templateKey);
}

/**
 * Render a template's first page to isolated static HTML using its registry
 * renderer + default data, so it can be shown as a small live preview inside a
 * sandboxed, scaled iframe. Results are cached per template key.
 */
function renderTemplatePreview(templateKey: string): RenderedTemplate {
  const key = normalizeKey(templateKey);
  if (!key) return null;

  if (previewCache.has(key)) {
    return previewCache.get(key) ?? null;
  }

  const renderer = getStudioTemplateRenderer(key);
  if (!renderer?.Component) {
    previewCache.set(key, null);
    return null;
  }

  try {
    const Component = renderer.Component as React.ComponentType<any>;
    const data = (renderer.defaultData || {}) as Record<string, any>;
    const homePage = renderer.pages?.[0];
    const pageId = homePage?.id || "home";
    const pageSlug = homePage?.slug || "/";

    const markup = renderToStaticMarkup(
      <div data-template-id={key} dir="rtl">
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
          mode="preview"
          data={data}
          templateData={data}
          isStudioStatic
        />
      </div>,
    );

    const result: RenderedTemplate = {
      html: markup,
      css: String(renderer.editorCss || ""),
    };
    previewCache.set(key, result);
    return result;
  } catch {
    previewCache.set(key, null);
    return null;
  }
}

/**
 * Small live preview of how a template actually looks, shown on the templates
 * gallery cards. Rendering is deferred until the card nears the viewport, and
 * returns null when the template has no in-app renderer so callers can fall
 * back to a static image.
 */
export default function TemplateCardPreview({
  templateKey,
  title,
}: TemplateCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const rendered = useMemo(
    () => (shouldRender ? renderTemplatePreview(templateKey) : null),
    [shouldRender, templateKey],
  );

  return (
    <div ref={frameRef} className="h-full w-full">
      {rendered ? (
        <SiteCardPreview
          html={rendered.html}
          css={rendered.css}
          title={title}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-slate-100" />
      )}
    </div>
  );
}
