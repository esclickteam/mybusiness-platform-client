import React, {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { getStudioTemplateRenderer } from "../studio/data/templates/templateRendererRegistry";

import {
  applyVisualAttributesToDom,
  applyVisualContentToDom,
  applyVisualDeletedToDom,
  applyVisualHiddenToDom,
  applyVisualLayoutToDom,
  applyVisualResponsiveToDom,
  applyVisualStylesToDom,
  prepareAllVideosInDom,
  registerAllVisualElements,
} from "../studio/visual-editor/utils/visualDomApply";

const PUBLIC_BASE_CSS = `
html,
body,
#root {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
  background: #ffffff;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.bizuply-public-mini-site,
.bizuply-public-render-root,
[data-bizuply-published-html="true"],
[data-bizuply-template-fallback="true"] {
  width: 100%;
  min-height: 100vh;
}

.bizuply-public-mini-site {
  overflow-x: hidden;
  background: #ffffff;
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

[data-bizuply-published-html="true"],
[data-bizuply-template-fallback="true"] {
  display: block !important;
  visibility: visible !important;
}

/*
  הגנה לתבניות עם reveal שמתחילות ב-opacity:0.
  מסירים את מצב ההתחלה רק מאלמנטים שמסומנים כאנימציה/reveal,
  ולא מכל אלמנט מוסתר באתר.
*/
[data-bizuply-published-html="true"] [data-reveal],
[data-bizuply-published-html="true"] [data-animate],
[data-bizuply-published-html="true"] [data-motion],
[data-bizuply-published-html="true"] .bizuply-reveal-up,
[data-bizuply-template-fallback="true"] [data-reveal],
[data-bizuply-template-fallback="true"] [data-animate],
[data-bizuply-template-fallback="true"] [data-motion],
[data-bizuply-template-fallback="true"] .bizuply-reveal-up {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}
`;

const EDITOR_ONLY_SELECTOR = [
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
].join(",");

const EDITOR_ONLY_ATTRIBUTES = [
  "contenteditable",
  "draggable",
  "aria-selected",
  "data-visual-selected",
  "data-visual-hovered",
  "data-visual-inline-editing",
  "data-visual-dragging",
  "data-visual-resizing",
  "data-editor-active",
  "data-editor-hovered",
];

function asPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function safeString(value) {
  return typeof value === "string" ? value : "";
}

function normalizeTemplateKey(value) {
  return safeString(value).trim().toLowerCase();
}

function normalizePublicPath(value) {
  const clean = safeString(value)
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\/+/, "").replace(/\/+$/, "");
}

function getCurrentPathname(pathname) {
  if (typeof pathname === "string") return pathname;

  if (typeof window !== "undefined") {
    return window.location.pathname || "/";
  }

  return "/";
}

function getPagePath(page) {
  const source = asPlainObject(page);

  if (source.isHome || source.id === "home") return "";

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
    const activePath = getPagePath(responseActivePage);

    if (
      activePath === currentPath ||
      (!currentPath &&
        (responseActivePage.isHome ||
          responseActivePage.id === "home" ||
          activePath === ""))
    ) {
      return responseActivePage;
    }
  }

  if (!pages.length) return responseActivePage;

  const exactPage = pages.find((page) => {
    const sourcePage = asPlainObject(page);
    const pagePath = getPagePath(sourcePage);
    const pageId = normalizePublicPath(
      safeString(sourcePage.id),
    );

    if (!currentPath) {
      return (
        sourcePage.isHome === true ||
        sourcePage.id === "home" ||
        pagePath === ""
      );
    }

    return pagePath === currentPath || pageId === currentPath;
  });

  if (exactPage) return exactPage;

  const activePageId = safeString(source.activePageId);

  const activeById = pages.find(
    (page) =>
      safeString(asPlainObject(page).id) === activePageId,
  );

  if (activeById) return activeById;

  const homePage = pages.find((page) => {
    const sourcePage = asPlainObject(page);

    return (
      sourcePage.isHome === true ||
      sourcePage.id === "home"
    );
  });

  return homePage || pages[0] || responseActivePage;
}

function readTemplateKey(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);

  const siteProjectData = asPlainObject(source.projectData);
  const pageProjectData = asPlainObject(page.projectData);
  const sitePayload = asPlainObject(source.visualEditorPayload);
  const pagePayload = asPlainObject(page.visualEditorPayload);

  return normalizeTemplateKey(
    safeString(source.templateKey) ||
      safeString(source.templateId) ||
      safeString(page.templateKey) ||
      safeString(page.templateId) ||
      safeString(siteProjectData.templateKey) ||
      safeString(pageProjectData.templateKey) ||
      safeString(sitePayload.templateKey) ||
      safeString(pagePayload.templateKey),
  );
}

function readTemplateData(site, activePage, explicitData) {
  if (
    explicitData &&
    typeof explicitData === "object" &&
    !Array.isArray(explicitData)
  ) {
    return explicitData;
  }

  const source = asPlainObject(site);
  const page = asPlainObject(activePage);

  const candidates = [
    page.data,
    asPlainObject(page.projectData).data,
    asPlainObject(page.projectData).templateData,
    page.templateData,
    asPlainObject(page.visualEditorPayload).data,
    asPlainObject(page.visualEditorPayload).templateData,

    source.data,
    asPlainObject(source.projectData).data,
    asPlainObject(source.projectData).templateData,
    source.templateData,
    asPlainObject(source.visualEditorPayload).data,
    asPlainObject(source.visualEditorPayload).templateData,
  ];

  const found = candidates.find(
    (candidate) =>
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate) &&
      Object.keys(candidate).length > 0,
  );

  return asPlainObject(found);
}

function getHtmlCandidates(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const pageContent = asPlainObject(page.content);

  return [
    {
      source: "activePage.htmlSnapshot",
      value: safeString(page.htmlSnapshot),
    },
    {
      source: "activePage.html",
      value: safeString(page.html),
    },
    {
      source: "activePage.content.html",
      value: safeString(pageContent.html),
    },
    {
      source: "activePage.publishedHtml",
      value: safeString(page.publishedHtml),
    },
    {
      source: "site.htmlSnapshot",
      value: safeString(source.htmlSnapshot),
    },
    {
      source: "site.html",
      value: safeString(source.html),
    },
  ];
}

function scoreHtml(value) {
  const html = safeString(value).trim();

  if (html.length < 20) {
    return {
      score: 0,
      html,
      textLength: 0,
      elementCount: 0,
      mediaCount: 0,
      sectionCount: 0,
    };
  }

  if (typeof DOMParser === "undefined") {
    const plainText = html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      score: plainText.length + Math.min(html.length / 100, 100),
      html,
      textLength: plainText.length,
      elementCount: 1,
      mediaCount: 0,
      sectionCount: 0,
    };
  }

  try {
    const documentValue = new DOMParser().parseFromString(
      html,
      "text/html",
    );

    documentValue
      .querySelectorAll(
        "script, style, meta, link, noscript, template",
      )
      .forEach((node) => node.remove());

    const body = documentValue.body;
    const textLength = String(body.textContent || "")
      .replace(/\s+/g, " ")
      .trim().length;

    const elementCount = body.querySelectorAll("*").length;
    const mediaCount = body.querySelectorAll(
      "img, video, picture, svg, canvas, iframe",
    ).length;

    const sectionCount = body.querySelectorAll(
      "header, main, section, article, footer, form, nav",
    ).length;

    const visibleStructureCount = body.querySelectorAll(
      "h1, h2, h3, p, a, button, input, textarea, select, img, video",
    ).length;

    const editorShellPenalty = body.querySelector(
      '[data-template-visual-editor="true"]',
    )
      ? 500
      : 0;

    const score =
      textLength +
      elementCount * 2 +
      mediaCount * 120 +
      sectionCount * 40 +
      visibleStructureCount * 20 -
      editorShellPenalty;

    return {
      score: Math.max(0, score),
      html,
      textLength,
      elementCount,
      mediaCount,
      sectionCount,
    };
  } catch {
    return {
      score: html.length > 100 ? 10 : 0,
      html,
      textLength: 0,
      elementCount: 0,
      mediaCount: 0,
      sectionCount: 0,
    };
  }
}

function chooseBestPublishedHtml(site, activePage) {
  const scored = getHtmlCandidates(site, activePage)
    .map((candidate) => ({
      ...candidate,
      ...scoreHtml(candidate.value),
    }))
    .sort((a, b) => b.score - a.score);

  const selected = scored.find(
    (candidate) =>
      candidate.score >= 40 &&
      (candidate.textLength > 0 ||
        candidate.mediaCount > 0 ||
        candidate.sectionCount > 0),
  );

  return {
    html: selected?.html || "",
    source: selected?.source || "none",
    score: selected?.score || 0,
    candidates: scored.map((candidate) => ({
      source: candidate.source,
      score: candidate.score,
      length: candidate.html.length,
      textLength: candidate.textLength,
      elementCount: candidate.elementCount,
      mediaCount: candidate.mediaCount,
      sectionCount: candidate.sectionCount,
    })),
  };
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

function joinCssParts(...parts) {
  const output = [];
  const seen = new Set();

  parts.forEach((part) => {
    const clean = safeString(part).trim();

    if (!clean || seen.has(clean)) return;

    seen.add(clean);
    output.push(clean);
  });

  return output.join("\n\n");
}

function getRendererRuntimeCss(renderer) {
  const source = asPlainObject(renderer);

  return joinCssParts(
    PUBLIC_BASE_CSS,
    safeString(source.runtimeCss),
    safeString(source.editorCss),
  );
}

function removeEditorArtifacts(root) {
  if (!root) return;

  root.querySelectorAll(EDITOR_ONLY_SELECTOR).forEach((node) => {
    node.remove();
  });

  const nodes = [
    root,
    ...Array.from(root.querySelectorAll("*")),
  ];

  nodes.forEach((node) => {
    EDITOR_ONLY_ATTRIBUTES.forEach((attribute) => {
      node.removeAttribute(attribute);
    });

    Array.from(node.attributes || []).forEach((attribute) => {
      const name = attribute.name.toLowerCase();

      if (
        name.startsWith("data-react") ||
        name.startsWith("data-selection-") ||
        name.startsWith("data-editor-runtime")
      ) {
        node.removeAttribute(attribute.name);
      }
    });
  });
}

function revealRuntimeAnimatedElements(root) {
  if (!root) return;

  const selectors = [
    "[data-reveal]",
    "[data-animate]",
    "[data-motion]",
    ".bizuply-reveal-up",
    ".opacity-0.translate-y-10",
    ".opacity-0.translate-y-12",
    ".opacity-0.translate-y-8",
  ];

  root.querySelectorAll(selectors.join(",")).forEach((node) => {
    node.style.opacity = "1";
    node.style.visibility = "visible";

    if (
      node.classList.contains("translate-y-10") ||
      node.classList.contains("translate-y-12") ||
      node.classList.contains("translate-y-8")
    ) {
      node.style.transform = "none";
    }
  });
}

function getPermanentMediaSource(item) {
  const source = asPlainObject(item);

  return safeString(
    source.secureUrl ||
      source.secure_url ||
      source.url ||
      source.src ||
      source.originalUrl,
  ).trim();
}

function getPublicMediaType(item, source) {
  const record = asPlainObject(item);
  const explicit = safeString(
    record.mediaType ||
      record.resourceType ||
      record.resource_type ||
      record.type,
  )
    .trim()
    .toLowerCase();

  if (explicit === "video" || explicit.startsWith("video/")) {
    return "video";
  }

  if (explicit === "image" || explicit.startsWith("image/")) {
    return "image";
  }

  const clean = safeString(source)
    .toLowerCase()
    .split("?")[0]
    .split("#")[0];

  if (
    clean.includes("/video/upload/") ||
    /\.(mp4|webm|mov|m4v|ogv|ogg)$/i.test(clean)
  ) {
    return "video";
  }

  return "image";
}

function safeVisualSelector(elementId) {
  const id = safeString(elementId).trim();

  if (!id) return "";

  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  return `[data-visual-edit-id="${escaped}"]`;
}

function copyPublicMediaAttributes(from, to) {
  Array.from(from.attributes || []).forEach((attribute) => {
    const name = attribute.name.toLowerCase();

    if (
      name === "src" ||
      name === "poster" ||
      name === "alt" ||
      name === "controls" ||
      name === "autoplay" ||
      name === "muted" ||
      name === "loop" ||
      name === "preload"
    ) {
      return;
    }

    try {
      to.setAttribute(attribute.name, attribute.value);
    } catch {
      // Ignore an invalid attribute from an old snapshot.
    }
  });

  to.className = from.className || "";
  to.setAttribute("style", from.getAttribute("style") || "");
}

function createPublicVideo(documentValue, sourceNode, src, item) {
  const record = asPlainObject(item);
  const video = documentValue.createElement("video");

  copyPublicMediaAttributes(sourceNode, video);

  video.src = src;
  video.playsInline = true;
  video.preload = safeString(record.preload) || "auto";
  video.controls = record.controls !== false;
  video.loop = record.loop === true;

  if (record.autoplay === true) {
    video.autoplay = true;
    video.muted = record.muted !== false;
    video.defaultMuted = record.muted !== false;
  } else {
    video.muted = record.muted === true;
  }

  const poster = safeString(record.poster).trim();

  if (poster) {
    video.poster = poster;
  }

  video.setAttribute("data-visual-current-src", src);
  video.setAttribute("data-video-src", src);
  video.setAttribute("data-visual-media-type", "video");
  video.setAttribute("data-resource-type", "video");
  video.setAttribute("playsinline", "true");

  const alt = safeString(record.alt || sourceNode.getAttribute("alt")).trim();

  if (alt) {
    video.setAttribute("title", alt);
    video.setAttribute("aria-label", alt);
  }

  return video;
}

function createPublicImage(documentValue, sourceNode, src, item) {
  const record = asPlainObject(item);
  const image = documentValue.createElement("img");

  copyPublicMediaAttributes(sourceNode, image);

  image.src = src;
  image.alt = safeString(record.alt || sourceNode.getAttribute("title"));
  image.setAttribute("data-visual-current-src", src);
  image.setAttribute("data-image-src", src);
  image.setAttribute("data-visual-media-type", "image");
  image.setAttribute("data-resource-type", "image");

  return image;
}

function materializePublicMedia(root, visualData) {
  if (!root) return;

  const data = asPlainObject(visualData);
  const content = asPlainObject(data.__content);

  Object.entries(content).forEach(([elementId, item]) => {
    const source = getPermanentMediaSource(item);
    if (!source) return;

    const selector = safeVisualSelector(elementId);
    if (!selector) return;

    const selectedNode = root.querySelector(selector);
    if (!selectedNode) return;

    const mediaNode =
      selectedNode.matches("img, video")
        ? selectedNode
        : selectedNode.querySelector("img, video");

    if (!mediaNode) return;

    const type = getPublicMediaType(item, source);

    if (type === "video" && mediaNode.tagName.toLowerCase() === "img") {
      const video = createPublicVideo(
        mediaNode.ownerDocument,
        mediaNode,
        source,
        item,
      );

      mediaNode.replaceWith(video);

      try {
        video.load();

        if (video.autoplay) {
          void video.play().catch(() => undefined);
        }
      } catch {
        // The browser will continue loading the source naturally.
      }

      return;
    }

    if (type === "image" && mediaNode.tagName.toLowerCase() === "video") {
      mediaNode.replaceWith(
        createPublicImage(
          mediaNode.ownerDocument,
          mediaNode,
          source,
          item,
        ),
      );
      return;
    }

    if (mediaNode instanceof HTMLVideoElement) {
      mediaNode.src = source;
      mediaNode.preload = safeString(asPlainObject(item).preload) || "auto";
      mediaNode.playsInline = true;
      mediaNode.setAttribute("data-visual-current-src", source);
      mediaNode.setAttribute("data-video-src", source);

      try {
        mediaNode.load();
      } catch {
        // noop
      }
    } else if (mediaNode instanceof HTMLImageElement) {
      mediaNode.src = source;
      mediaNode.setAttribute("data-visual-current-src", source);
      mediaNode.setAttribute("data-image-src", source);
    }
  });

  /*
    תאימות ל-snapshot ישן: אם ה-img עצמו כבר מסומן כווידאו,
    ממירים אותו גם כאשר __content חסר או ישן.
  */
  root
    .querySelectorAll(
      'img[data-visual-media-type="video"], img[data-resource-type="video"], img[data-video-src]',
    )
    .forEach((image) => {
      const source = safeString(
        image.getAttribute("data-video-src") ||
          image.getAttribute("data-visual-current-src"),
      ).trim();

      if (!source) return;

      const video = createPublicVideo(
        image.ownerDocument,
        image,
        source,
        {},
      );

      image.replaceWith(video);

      try {
        video.load();
      } catch {
        // noop
      }
    });
}

function applyPublicVisualData(root, visualData) {
  if (!root) return;

  const data = asPlainObject(visualData);

  root.setAttribute("data-bizuply-public-render-root", "true");

  registerAllVisualElements(root);
  applyVisualContentToDom(root, data);
  materializePublicMedia(root, data);
  applyVisualStylesToDom(root, data);
  applyVisualLayoutToDom(root, data);
  applyVisualAttributesToDom(root, data);
  applyVisualResponsiveToDom(root, data);
  applyVisualHiddenToDom(root, data);
  applyVisualDeletedToDom(root, data);
  removeEditorArtifacts(root);
  prepareAllVideosInDom(root);
  revealRuntimeAnimatedElements(root);
}

function getFallbackPageId(activePage, pathname) {
  const page = asPlainObject(activePage);

  if (safeString(page.id)) return safeString(page.id);

  return (
    normalizePublicPath(getCurrentPathname(pathname)) ||
    "home"
  );
}

export default function PublicVisualSiteRenderer({
  site,
  pathname,
  templateData,
  className = "",
}) {
  const rootRef = useRef(null);

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

  const visualData = useMemo(
    () => readTemplateData(site, activePage, templateData),
    [site, activePage, templateData],
  );

  const htmlResult = useMemo(
    () => chooseBestPublishedHtml(site, activePage),
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

  const hasSavedHtml = htmlResult.html.length > 20;
  const TemplateComponent = renderer?.Component || null;
  const pageId = getFallbackPageId(activePage, pathname);

  useLayoutEffect(() => {
    applyPublicVisualData(rootRef.current, visualData);

    console.log("[BizUply Public Renderer]", {
      templateKey,
      activePageId: activePage?.id || "",
      activePageSlug: activePage?.slug || "",
      renderSource: hasSavedHtml
        ? htmlResult.source
        : TemplateComponent
          ? "template-fallback-with-saved-data"
          : "missing-content",
      selectedHtmlLength: htmlResult.html.length,
      selectedHtmlScore: htmlResult.score,
      visualDataKeys: Object.keys(visualData || {}),
      candidates: htmlResult.candidates,
    });
  }, [
    activePage,
    hasSavedHtml,
    htmlResult,
    templateKey,
    visualData,
    TemplateComponent,
  ]);

  if (hasSavedHtml) {
    return (
      <div
        ref={rootRef}
        className={[
          "bizuply-public-mini-site bizuply-public-render-root",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-bizuply-public-render-root="true"
        data-bizuply-public-source={htmlResult.source}
        data-bizuply-template-key={templateKey || undefined}
        dir="rtl"
      >
        {css ? <style>{css}</style> : null}

        <div
          data-bizuply-published-html="true"
          dangerouslySetInnerHTML={{
            __html: htmlResult.html,
          }}
        />
      </div>
    );
  }

  /*
    אם נשמר בעבר snapshot ריק/פגום, לא מציגים דף לבן.
    מרנדרים את התבנית שנבחרה ומחילים עליה את כל נתוני העריכה השמורים.
  */
  if (TemplateComponent) {
    return (
      <div
        ref={rootRef}
        className={[
          "bizuply-public-mini-site bizuply-public-render-root",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-bizuply-public-render-root="true"
        data-bizuply-public-source="template-fallback-with-saved-data"
        data-bizuply-template-key={templateKey || undefined}
        dir="rtl"
      >
        {css ? <style>{css}</style> : null}

        <div data-bizuply-template-fallback="true">
          <TemplateComponent
            key={`${templateKey || "template"}-${pageId}`}
            mode="public"
            viewMode="public"
            runtimeMode="public"
            initialPage={pageId}
            initialPageId={pageId}
            activePageId={pageId}
            currentPageId={pageId}
            pageId={pageId}
            page={pageId}
            data={visualData}
            templateData={visualData}
            isPublic
            isStudioStatic={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 p-6"
      dir="rtl"
    >
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">
          לא נמצא תוכן להצגת האתר
        </h1>

        <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
          האתר פורסם, אבל לא נשמר HTML תקין ולא נמצא renderer עבור
          התבנית.
        </p>

        <pre className="mt-5 overflow-auto rounded-2xl bg-slate-950 p-4 text-left text-xs text-white">
          {JSON.stringify(
            {
              templateKey,
              activePageId: activePage?.id || "",
              htmlCandidates: htmlResult.candidates,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
