import React, { useEffect, useMemo, useRef } from "react";

import { getStudioTemplateRenderer } from "../studio/data/templates/templateRendererRegistry";

const PUBLIC_BASE_CSS = `
html,
body,
#root {
  margin: 0;
  min-height: 100%;
  width: 100%;
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.bizuply-public-mini-site {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.bizuply-public-mini-site img,
.bizuply-public-mini-site video,
.bizuply-public-mini-site canvas,
.bizuply-public-mini-site svg {
  max-width: 100%;
}

.bizuply-public-mini-site video {
  display: block;
}

.bizuply-public-mini-site [contenteditable="true"] {
  outline: none;
}
`;

function asPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function safeString(value) {
  return typeof value === "string" ? value : "";
}

function normalizePublicPath(value) {
  const clean = safeString(value)
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\/+/, "").replace(/\/+$/, "");
}

function normalizeTemplateKey(value) {
  return safeString(value).trim().toLowerCase();
}

function getCurrentPathname(pathname) {
  if (typeof pathname === "string") {
    return pathname;
  }

  if (typeof window !== "undefined") {
    return window.location.pathname || "/";
  }

  return "/";
}

function getPagePath(page) {
  const source = asPlainObject(page);

  if (source.isHome || source.id === "home") {
    return "";
  }

  return normalizePublicPath(
    safeString(source.slug) ||
      safeString(source.path) ||
      safeString(source.id),
  );
}

function resolveActivePage(site, pathname) {
  const source = asPlainObject(site);
  const pages = Array.isArray(source.pages) ? source.pages : [];
  const currentPath = normalizePublicPath(
    getCurrentPathname(pathname),
  );

  const responseActivePage = asPlainObject(source.activePage);

  if (Object.keys(responseActivePage).length > 0) {
    const activePagePath = getPagePath(responseActivePage);

    if (
      activePagePath === currentPath ||
      (!currentPath &&
        (responseActivePage.isHome ||
          responseActivePage.id === "home" ||
          activePagePath === ""))
    ) {
      return responseActivePage;
    }
  }

  if (pages.length > 0) {
    const exactPage = pages.find((page) => {
      const pageSource = asPlainObject(page);
      const pagePath = getPagePath(pageSource);
      const pageId = normalizePublicPath(
        safeString(pageSource.id),
      );

      if (!currentPath) {
        return (
          pageSource.isHome === true ||
          pageSource.id === "home" ||
          pagePath === ""
        );
      }

      return pagePath === currentPath || pageId === currentPath;
    });

    if (exactPage) {
      return exactPage;
    }

    const activePageId = safeString(source.activePageId);

    const activePageById = pages.find(
      (page) =>
        safeString(asPlainObject(page).id) === activePageId,
    );

    if (activePageById) {
      return activePageById;
    }

    const homePage = pages.find((page) => {
      const pageSource = asPlainObject(page);

      return (
        pageSource.isHome === true ||
        pageSource.id === "home"
      );
    });

    if (homePage) {
      return homePage;
    }

    return asPlainObject(pages[0]);
  }

  return responseActivePage;
}

function readTemplateKey(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);

  const siteProjectData = asPlainObject(source.projectData);
  const pageProjectData = asPlainObject(page.projectData);

  const siteVisualPayload = asPlainObject(
    source.visualEditorPayload,
  );

  const pageVisualPayload = asPlainObject(
    page.visualEditorPayload,
  );

  return normalizeTemplateKey(
    safeString(source.templateKey) ||
      safeString(source.templateId) ||
      safeString(page.templateKey) ||
      safeString(page.templateId) ||
      safeString(siteProjectData.templateKey) ||
      safeString(pageProjectData.templateKey) ||
      safeString(siteVisualPayload.templateKey) ||
      safeString(pageVisualPayload.templateKey),
  );
}

function readPublishedHtml(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const pageContent = asPlainObject(page.content);

  return (
    safeString(page.htmlSnapshot).trim() ||
    safeString(page.html).trim() ||
    safeString(pageContent.html).trim() ||
    safeString(page.publishedHtml).trim() ||
    safeString(source.htmlSnapshot).trim() ||
    safeString(source.html).trim()
  );
}

function readSavedCss(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const pageContent = asPlainObject(page.content);

  return (
    safeString(page.css).trim() ||
    safeString(pageContent.css).trim() ||
    safeString(page.publishedCss).trim() ||
    safeString(source.css).trim()
  );
}

function readTemplateData(
  site,
  activePage,
  explicitTemplateData,
) {
  if (
    explicitTemplateData &&
    typeof explicitTemplateData === "object" &&
    !Array.isArray(explicitTemplateData)
  ) {
    return explicitTemplateData;
  }

  const source = asPlainObject(site);
  const page = asPlainObject(activePage);

  const candidates = [
    page.data,
    asPlainObject(page.projectData).data,
    asPlainObject(page.projectData).templateData,
    page.templateData,
    asPlainObject(page.visualEditorPayload).data,

    source.data,
    asPlainObject(source.projectData).data,
    asPlainObject(source.projectData).templateData,
    source.templateData,
    asPlainObject(source.visualEditorPayload).data,
  ];

  const found = candidates.find(
    (candidate) =>
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate),
  );

  return asPlainObject(found);
}

function joinCssParts(...parts) {
  const uniqueParts = [];
  const seen = new Set();

  parts.forEach((part) => {
    const clean = safeString(part).trim();

    if (!clean || seen.has(clean)) return;

    seen.add(clean);
    uniqueParts.push(clean);
  });

  return uniqueParts.join("\n\n");
}

function getRendererRuntimeCss(renderer) {
  const source = asPlainObject(renderer);

  return joinCssParts(
    PUBLIC_BASE_CSS,
    safeString(source.runtimeCss),
    safeString(source.editorCss),
  );
}

function getFallbackPageId(activePage, pathname) {
  const page = asPlainObject(activePage);

  if (safeString(page.id)) {
    return safeString(page.id);
  }

  const path = normalizePublicPath(
    getCurrentPathname(pathname),
  );

  return path || "home";
}

function preparePublishedDom(root) {
  if (!root) return;

  root
    .querySelectorAll(
      [
        "[data-visual-editor-overlay]",
        "[data-visual-selection-overlay]",
        "[data-visual-hover-overlay]",
        "[data-visual-resize-overlay]",
        "[data-visual-resize-handle]",
        "[data-visual-drag-handle]",
        "[data-visual-toolbar]",
        "[data-visual-floating-toolbar]",
        "[data-visual-context-menu]",
        "[data-visual-inspector]",
        "[data-editor-only]",
        "[data-bizuply-editor-only]",
      ].join(","),
    )
    .forEach((node) => {
      node.remove();
    });

  root.querySelectorAll("*").forEach((node) => {
    node.removeAttribute("contenteditable");
    node.removeAttribute("draggable");
    node.removeAttribute("aria-selected");

    node.removeAttribute("data-visual-selected");
    node.removeAttribute("data-visual-hovered");
    node.removeAttribute("data-visual-inline-editing");
    node.removeAttribute("data-visual-dragging");
    node.removeAttribute("data-visual-resizing");
  });

  root.querySelectorAll("video").forEach((video) => {
    video.setAttribute("playsinline", "");
    video.playsInline = true;

    if (!video.preload || video.preload === "none") {
      video.preload = "metadata";
    }

    if (video.autoplay) {
      video.muted = true;
      video.defaultMuted = true;
    }

    try {
      video.load();
    } catch {
      // הדפדפן יטען את הסרטון באופן רגיל.
    }
  });
}

export default function PublicVisualSiteRenderer({
  site,
  pathname,
  templateData,
  className = "",
}) {
  const publicRootRef = useRef(null);

  const activePage = useMemo(
    () => resolveActivePage(site, pathname),
    [site, pathname],
  );

  const templateKey = useMemo(
    () => readTemplateKey(site, activePage),
    [site, activePage],
  );

  const renderer = useMemo(
    () => getStudioTemplateRenderer(templateKey),
    [templateKey],
  );

  const html = useMemo(
    () => readPublishedHtml(site, activePage),
    [site, activePage],
  );

  const css = useMemo(
    () =>
      joinCssParts(
        getRendererRuntimeCss(renderer),
        readSavedCss(site, activePage),
      ),
    [renderer, site, activePage],
  );

  const resolvedTemplateData = useMemo(
    () =>
      readTemplateData(
        site,
        activePage,
        templateData,
      ),
    [site, activePage, templateData],
  );

  useEffect(() => {
    preparePublishedDom(publicRootRef.current);
  }, [html]);

  /*
    ברגע שקיים HTML שנשמר מהעורך,
    הוא מקור האמת היחיד.

    לא מרנדרים מחדש את התבנית המקורית.
  */
  if (html.length > 20) {
    return (
      <div
        ref={publicRootRef}
        className={[
          "bizuply-public-mini-site min-h-screen bg-white",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-bizuply-public-source="saved-editor-snapshot"
        data-bizuply-template-key={
          templateKey || undefined
        }
        dir="rtl"
      >
        {css ? <style>{css}</style> : null}

        <div
          data-bizuply-published-html="true"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    );
  }

  /*
    התבנית המקורית משמשת רק כ־fallback
    לאתר שעדיין מעולם לא נשמר בעורך.
  */
  const TemplateComponent = renderer?.Component || null;

  if (TemplateComponent) {
    const pageId = getFallbackPageId(
      activePage,
      pathname,
    );

    return (
      <div
        ref={publicRootRef}
        className={[
          "bizuply-public-mini-site min-h-screen bg-white",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-bizuply-public-source="unsaved-template-fallback"
        data-bizuply-template-key={
          templateKey || undefined
        }
        dir="rtl"
      >
        {css ? <style>{css}</style> : null}

        <TemplateComponent
          mode="public"
          viewMode="public"
          runtimeMode="public"
          initialPage={pageId}
          initialPageId={pageId}
          activePageId={pageId}
          currentPageId={pageId}
          pageId={pageId}
          page={pageId}
          data={resolvedTemplateData}
          templateData={resolvedTemplateData}
          isPublic
          isStudioStatic={false}
        />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 p-6"
      dir="rtl"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-700 shadow-sm">
        לא נמצא תוכן מפורסם לאתר.
      </div>
    </div>
  );
}