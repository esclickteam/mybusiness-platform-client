import React, {
  useEffect,
  useLayoutEffect,
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
  hiddenFromMenu?: boolean;
  parentPageId?: string;
  menuOrder?: number;
  libraryPageTemplateId?: string;
  pageData?: Record<string, any> | null;
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

const PAGE_PANEL_FORCE_CSS = `
  [data-visual-page-panel][hidden],
  [data-visual-page-visible="false"],
  [data-visual-page-panel][aria-hidden="true"] {
    display: none !important;
  }
`;

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
  ${PAGE_PANEL_FORCE_CSS}
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

function pagePropBag(page: VisualSitePageItem) {
  const id = String(page.id || "home").trim() || "home";
  const slug = page.isHome
    ? "/"
    : `/${String(page.slug || id).replace(/^\//, "")}`;

  return {
    initialPage: id,
    initialPageId: id,
    activePageId: id,
    currentPageId: id,
    pageId: id,
    page: id,
    initialSlug: slug,
    activePageSlug: slug,
    currentPageSlug: slug,
    pageSlug: slug,
    slug,
  };
}

function enforceVisiblePagePanel(host: HTMLElement, pageId: string) {
  const targetId = String(pageId || "").trim();
  if (!targetId) return;

  host
    .querySelectorAll<HTMLElement>("[data-visual-page-panel]")
    .forEach((panel) => {
      const panelId = String(panel.getAttribute("data-visual-page-panel") || "");
      const visible = panelId === targetId;
      panel.hidden = !visible;
      panel.setAttribute("aria-hidden", visible ? "false" : "true");
      panel.setAttribute(
        "data-visual-page-visible",
        visible ? "true" : "false",
      );
      panel.style.setProperty("display", visible ? "" : "none", "important");
    });
}

function LiveTemplatePreview({
  page,
  PageComponent,
  pageData,
  editorCss = "",
}: {
  page: VisualSitePageItem;
  PageComponent: ComponentType<any>;
  pageData?: Record<string, any> | null;
  editorCss?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pageProps = pagePropBag(page);
  const previewData = useMemo(
    () => ({
      ...(pageData || {}),
      __activePageId: page.id,
      __previewPageId: page.id,
    }),
    [pageData, page.id],
  );

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const apply = () => enforceVisiblePagePanel(host, page.id);
    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "hidden",
        "aria-hidden",
        "data-visual-page-visible",
        "style",
        "class",
      ],
    });

    return () => observer.disconnect();
  }, [page.id]);

  return (
    <ScaledFrame height={1600}>
      {editorCss ? (
        <style dangerouslySetInnerHTML={{ __html: editorCss }} />
      ) : null}
      <style>{PAGE_PANEL_FORCE_CSS}</style>
      <div
        ref={hostRef}
        className="bg-white"
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <PageComponent
          key={page.id}
          data={previewData}
          templateData={previewData}
          mode="preview"
          isStudioStatic
          {...pageProps}
        />
      </div>
    </ScaledFrame>
  );
}

function HtmlTemplatePreview({
  html,
  css,
  pageId,
}: {
  html: string;
  css?: string;
  pageId: string;
}) {
  const srcDoc = useMemo(() => {
    let nextHtml = html;
    try {
      if (typeof DOMParser !== "undefined") {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const panels = Array.from(
          doc.querySelectorAll<HTMLElement>("[data-visual-page-panel]"),
        );
        if (panels.length) {
          panels.forEach((panel) => {
            const panelId = String(
              panel.getAttribute("data-visual-page-panel") || "",
            );
            const visible = panelId === pageId;
            if (visible) {
              panel.removeAttribute("hidden");
              panel.setAttribute("aria-hidden", "false");
              panel.setAttribute("data-visual-page-visible", "true");
              panel.style.display = "";
            } else {
              panel.setAttribute("hidden", "");
              panel.setAttribute("aria-hidden", "true");
              panel.setAttribute("data-visual-page-visible", "false");
              panel.style.display = "none";
            }
          });
          nextHtml = doc.body?.innerHTML || html;
        }
      }
    } catch {
      nextHtml = html;
    }

    return buildSrcDoc(nextHtml, css);
  }, [html, css, pageId]);

  return (
    <ScaledFrame height={1600}>
      <iframe
        title={`page-preview-${pageId}`}
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
      <span className="flex h-12 w-12 items-center justify-center rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-white shadow-lg">
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
 * Page card thumbnail: prefer page-specific HTML snapshot, then live template
 * render locked to that page id (so services/about/etc. never show home).
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
      ) : hasHtml ? (
        <HtmlTemplatePreview
          html={html}
          css={page.css || editorCss}
          pageId={page.id}
        />
      ) : PageComponent ? (
        <LiveTemplatePreview
          page={page}
          PageComponent={PageComponent}
          pageData={pageData}
          editorCss={editorCss}
        />
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
