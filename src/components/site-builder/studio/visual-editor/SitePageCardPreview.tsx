import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { FileText, Home } from "lucide-react";

import PageLibraryCardPreview from "./library/PageLibraryCardPreview";
import { getPageTemplateById } from "./library/pageLibrary";

const PREVIEW_WIDTH = 1280;

export type VisualSitePageItem = {
  id: string;
  title: string;
  slug?: string;
  isHome?: boolean;
  libraryPageTemplateId?: string;
  thumbnail?: string;
  html?: string;
  css?: string;
};

type SitePageCardPreviewProps = {
  page: VisualSitePageItem;
  PageComponent?: ComponentType<any> | null;
  pageData?: Record<string, any> | null;
  editorCss?: string;
};

function buildSrcDoc(html: string, css = "") {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
  }
  body { width: ${PREVIEW_WIDTH}px; }
  ${css || ""}
</style>
</head>
<body>${html}</body>
</html>`;
}

function ScaledFrame({
  children,
  height = 900,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(280);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width) setFrameWidth(rect.width);
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const scale = Math.max(frameWidth / PREVIEW_WIDTH, 0.08);

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0"
        style={{
          width: PREVIEW_WIDTH,
          height,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LiveTemplatePreview({
  page,
  PageComponent,
  pageData,
}: {
  page: VisualSitePageItem;
  PageComponent: ComponentType<any>;
  pageData?: Record<string, any> | null;
}) {
  return (
    <ScaledFrame height={1600}>
      <div
        className="bg-white"
        style={{
          // Keep thumbnail renders from stealing pointer / focus from the editor.
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <PageComponent
          data={pageData || {}}
          activePageId={page.id}
          pageId={page.id}
          slug={page.slug || page.id}
          mode="preview"
          isStudioStatic
        />
      </div>
    </ScaledFrame>
  );
}

function HtmlTemplatePreview({
  html,
  css,
}: {
  html: string;
  css?: string;
}) {
  const srcDoc = useMemo(() => buildSrcDoc(html, css), [html, css]);

  return (
    <ScaledFrame height={1600}>
      <iframe
        title="page-preview"
        srcDoc={srcDoc}
        sandbox=""
        tabIndex={-1}
        className="block border-0"
        style={{
          width: PREVIEW_WIDTH,
          height: 1600,
          background: "#fff",
        }}
      />
    </ScaledFrame>
  );
}

function PlaceholderPreview({ page }: { page: VisualSitePageItem }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
        {page.isHome ? (
          <Home className="h-5 w-5" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
      </span>
      <span className="line-clamp-2 text-center text-sm font-black text-slate-800">
        {page.title}
      </span>
    </div>
  );
}

/**
 * Wix-style page card thumbnail: live template render, static HTML snapshot,
 * library blueprint, or a lightweight placeholder.
 */
export default function SitePageCardPreview({
  page,
  PageComponent,
  pageData,
  editorCss = "",
}: SitePageCardPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const libraryTemplate = useMemo(() => {
    const templateId = String(page.libraryPageTemplateId || "").trim();
    if (!templateId) return null;
    return getPageTemplateById(templateId);
  }, [page.libraryPageTemplateId]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const html = String(page.html || "").trim();
  const hasHtml = html.length > 80;

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden">
      {!isVisible ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      ) : libraryTemplate ? (
        <PageLibraryCardPreview page={libraryTemplate} />
      ) : PageComponent ? (
        <LiveTemplatePreview
          page={page}
          PageComponent={PageComponent}
          pageData={pageData}
        />
      ) : hasHtml ? (
        <HtmlTemplatePreview html={html} css={page.css || editorCss} />
      ) : page.thumbnail ? (
        <img
          src={page.thumbnail}
          alt=""
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <PlaceholderPreview page={page} />
      )}
    </div>
  );
}
