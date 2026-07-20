import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Helmet } from "react-helmet-async";

import { getStudioTemplateRenderer } from "../studio/data/templates/templateRendererRegistry";
import { resolvePageSeoMeta } from "../studio/utils/pageSeoUtils";

import { buildVisualRuntimeCss } from "../studio/visual-editor/utils/visualCssRuntime";
import {
  readVisualAnimations,
  readVisualStyles,
} from "../studio/visual-editor/utils/visualData";
import { syncSitePageTitlesIntoVisualData } from "../studio/visual-editor/utils/syncNavWithSitePages";
import {
  applyCustomCodeToDocument,
  injectHtmlIntoElement,
  mergeCustomCodeLayers,
} from "../studio/visual-editor/utils/visualCustomCodeRuntime";

import {
  applyAllVisualDataToDom,
  prepareAllVideosInDom,
} from "../studio/visual-editor/utils/visualDomApply";
import {
  applyMediaFitStyles,
  preserveVisualMediaBoxSize,
} from "../studio/visual-editor/utils/visualMediaUtils";

import {
  readSiteAnalyticsContext,
  trackBizuplyPageView,
} from "@/utils/bizuplyAnalytics";

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

/*
  אוספי העורך הוויזואלי שמכריעים אם מדובר באתר visual-react מלא.
  אם קיים אחד מהם עם תוכן ממשי, מקור האמת הוא ה-data (snapshot נקי),
  ולכן עדיף לרנדר מהתבנית + data — בדיוק כמו בעורך — במקום מ-HTML snapshot
  שעלול לסטות ממצב העורך (למשל background-image שנצרב לתמונת ה-hero).
*/
const VISUAL_EDITOR_COLLECTION_KEYS = [
  "__content",
  "__styles",
  "__layout",
  "__attributes",
  "__responsive",
  "__animations",
  "__deletedElements",
  "__hiddenElements",
  "__insertedElements",
  "__insertedSections",
  "__sectionOrder",
];

function countMeaningfulVisualEntries(value) {
  const data = asPlainObject(value);

  return VISUAL_EDITOR_COLLECTION_KEYS.reduce((total, key) => {
    const collection = data[key];

    if (
      !collection ||
      typeof collection !== "object" ||
      Array.isArray(collection)
    ) {
      return total;
    }

    return total + Object.keys(collection).length;
  }, 0);
}

function hasMeaningfulVisualData(value) {
  return countMeaningfulVisualEntries(value) > 0;
}

function isLibraryOrBlankVisualData(value) {
  const data = asPlainObject(value);

  return (
    data.__blankVisualPage === true ||
    data.__libraryPage === true ||
    Boolean(safeString(data.__libraryPageTemplateId))
  );
}

function isLibraryOrBlankPage(page) {
  const source = asPlainObject(page);
  const pageId = safeString(source.id);

  if (
    source.__blankVisualPage === true ||
    source.__libraryPage === true ||
    safeString(source.type).toLowerCase() === "blank" ||
    Boolean(safeString(source.libraryPageTemplateId)) ||
    Boolean(safeString(source.__libraryPageTemplateId)) ||
    // Studio library pages are created with uid("page") → page_…
    /^page[_-]/i.test(pageId)
  ) {
    return true;
  }

  return [
    source.data,
    source.templateData,
    asPlainObject(source.projectData).data,
    asPlainObject(source.projectData).templateData,
    asPlainObject(source.visualEditorPayload).data,
    asPlainObject(source.visualEditorPayload).templateData,
  ].some((candidate) => isLibraryOrBlankVisualData(candidate));
}

function isHomeActivePage(page) {
  const source = asPlainObject(page);

  return (
    source.isHome === true ||
    safeString(source.id) === "home" ||
    getPagePath(source) === ""
  );
}

function pickBestVisualCandidate(candidates) {
  const validCandidates = candidates
    .filter((candidate) => hasMeaningfulVisualData(candidate.value))
    .map((candidate) => {
      const timestamp = Date.parse(safeString(candidate.updatedAt));

      return {
        ...candidate,
        richness: countMeaningfulVisualEntries(candidate.value),
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
        libraryBoost: isLibraryOrBlankVisualData(candidate.value)
          ? 1
          : 0,
      };
    })
    .sort(
      (left, right) =>
        right.libraryBoost - left.libraryBoost ||
        right.richness - left.richness ||
        right.timestamp - left.timestamp ||
        right.priority - left.priority,
    );

  return asPlainObject(validCandidates[0]?.value);
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

  /*
    Never treat the editor's last activePageId (often home) as a match for a
    different public URL — that made /pricing-services render the homepage.
  */
  if (activeById) {
    const byIdPath = getPagePath(activeById);
    const byId = asPlainObject(activeById);
    const byIdKey = normalizePublicPath(safeString(byId.id));

    if (
      !currentPath ||
      byIdPath === currentPath ||
      byIdKey === currentPath
    ) {
      return activeById;
    }
  }

  const homePage = pages.find((page) => {
    const sourcePage = asPlainObject(page);

    return (
      sourcePage.isHome === true ||
      sourcePage.id === "home"
    );
  });

  if (currentPath) {
    return exactPage || responseActivePage || homePage || pages[0];
  }

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
  const explicit = asPlainObject(explicitData);
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const siteProjectData = asPlainObject(source.projectData);
  const pageProjectData = asPlainObject(page.projectData);
  const sitePayload = asPlainObject(source.visualEditorPayload);
  const pagePayload = asPlainObject(page.visualEditorPayload);
  const preferPageScoped =
    !isHomeActivePage(page) && isLibraryOrBlankPage(page);

  /*
    עמודי ספרייה/ריקים שומרים visual data משלהם. הנתונים ברמת האתר הם
    בדרך כלל של דף הבית ולכן "עשירים" יותר — אסור שידרסו את העמוד הפעיל.
  */
  const pageCandidates = [
    {
      value: pagePayload.data,
      updatedAt: pagePayload.updatedAt || page.updatedAt,
      priority: 200,
    },
    {
      value: pagePayload.templateData,
      updatedAt: pagePayload.updatedAt || page.updatedAt,
      priority: 195,
    },
    {
      value: page.data,
      updatedAt: page.updatedAt,
      priority: 190,
    },
    {
      value: page.templateData,
      updatedAt: page.updatedAt,
      priority: 185,
    },
    {
      value: pageProjectData.data,
      updatedAt: pageProjectData.updatedAt || page.updatedAt,
      priority: 180,
    },
    {
      value: pageProjectData.templateData,
      updatedAt: pageProjectData.updatedAt || page.updatedAt,
      priority: 175,
    },
  ];

  const siteCandidates = [
    {
      value: source.data,
      updatedAt:
        source.updatedAt ||
        source.__publicFetchedAt ||
        siteProjectData.updatedAt,
      priority: 140,
    },
    {
      value: siteProjectData.data,
      updatedAt: siteProjectData.updatedAt || source.updatedAt,
      priority: 135,
    },
    {
      value: siteProjectData.templateData,
      updatedAt: siteProjectData.updatedAt || source.updatedAt,
      priority: 130,
    },
    {
      value: sitePayload.data,
      updatedAt: sitePayload.updatedAt || source.updatedAt,
      priority: 125,
    },
    {
      value: sitePayload.templateData,
      updatedAt: sitePayload.updatedAt || source.updatedAt,
      priority: 120,
    },
    {
      value: source.templateData,
      updatedAt: source.updatedAt,
      priority: 115,
    },
  ];

  if (preferPageScoped) {
    if (
      hasMeaningfulVisualData(explicit) &&
      isLibraryOrBlankVisualData(explicit)
    ) {
      return explicit;
    }

    const pageScoped = pickBestVisualCandidate(pageCandidates);
    if (hasMeaningfulVisualData(pageScoped)) {
      return pageScoped;
    }

    const blankOnly = pageCandidates.find((candidate) =>
      isLibraryOrBlankVisualData(candidate.value),
    );
    if (blankOnly) {
      return asPlainObject(blankOnly.value);
    }
  }

  if (hasMeaningfulVisualData(explicit)) {
    return explicit;
  }

  /*
    /public/by-host כבר מנרמל site.data / site.projectData למקור האמת העדכני.
    בוחרים מועמד עם תוכן ממשי (לא מפות ריקות), ואז לפי עדכניות/עדיפות.
  */
  return pickBestVisualCandidate([
    ...siteCandidates,
    ...pageCandidates,
  ]);
}

function getHtmlCandidates(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const pageContent = asPlainObject(page.content);
  const pageUpdatedAt =
    asPlainObject(page.projectData).updatedAt || page.updatedAt;
  const siteUpdatedAt =
    asPlainObject(source.projectData).updatedAt || source.updatedAt;

  return [
    {
      source: "activePage.htmlSnapshot",
      value: safeString(page.htmlSnapshot),
      updatedAt: pageUpdatedAt,
      priority: 10,
    },
    {
      source: "activePage.html",
      value: safeString(page.html),
      updatedAt: pageUpdatedAt,
      priority: 120,
    },
    {
      source: "activePage.content.html",
      value: safeString(pageContent.html),
      updatedAt: pageUpdatedAt,
      priority: 100,
    },
    {
      source: "activePage.publishedHtml",
      value: safeString(page.publishedHtml),
      updatedAt: pageUpdatedAt,
      priority: 110,
    },
    {
      source: "site.htmlSnapshot",
      value: safeString(source.htmlSnapshot),
      updatedAt: siteUpdatedAt,
      priority: 5,
    },
    {
      source: "site.html",
      value: safeString(source.html),
      updatedAt: siteUpdatedAt,
      priority: 80,
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
    .map((candidate) => {
      const timestamp = Date.parse(safeString(candidate.updatedAt));

      return {
        ...candidate,
        ...scoreHtml(candidate.value),
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
      };
    })
    .sort(
      (left, right) =>
        right.timestamp - left.timestamp ||
        right.priority - left.priority ||
        right.score - left.score,
    );

  const isValidCandidate = (candidate) =>
    candidate.score >= 40 &&
    (candidate.textLength > 0 ||
      candidate.mediaCount > 0 ||
      candidate.sectionCount > 0);
  const selected =
    scored.find(
      (candidate) =>
        candidate.source.startsWith("activePage.") &&
        isValidCandidate(candidate),
    ) ||
    scored.find(
    (candidate) =>
      isValidCandidate(candidate),
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
      updatedAt: candidate.updatedAt || "",
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
  video.preload = "auto";
  video.controls = false;
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.defaultMuted = true;

  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "auto");
  video.removeAttribute("controls");

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

  /*
    נועלים את תיבת המדיה של העורך לפני שהווידאו מחליף img —
    אחרת יחס הפריים של הקובץ משנה את הגודל באתר הציבורי.
  */
  preserveVisualMediaBoxSize(sourceNode, video);
  applyMediaFitStyles(video);

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

function clearPublicMediaNode(mediaNode, item) {
  if (!mediaNode) return;

  const record = asPlainObject(item);
  const applyAsBackground =
    record.target === "background" ||
    record.background === true ||
    record.applyAsBackground === true;

  if (applyAsBackground) {
    mediaNode.style.removeProperty("background-image");
    mediaNode.removeAttribute("data-visual-background-src");
    return;
  }

  try {
    mediaNode.removeAttribute("src");
    mediaNode.src = "";
    if (mediaNode instanceof HTMLVideoElement) {
      mediaNode.load();
    }
  } catch {
    // noop
  }

  [
    "src",
    "data-visual-current-src",
    "data-image-src",
    "data-video-src",
    "poster",
  ].forEach((attribute) => mediaNode.removeAttribute(attribute));

  mediaNode.style.opacity = "0";
  mediaNode.setAttribute("data-visual-media-cleared", "true");
}

function materializePublicMedia(root, visualData) {
  if (!root) return;

  const data = asPlainObject(visualData);
  const content = asPlainObject(data.__content);

  Object.entries(content).forEach(([elementId, item]) => {
    const record = asPlainObject(item);
    const source = getPermanentMediaSource(item);
    const hasMediaFields =
      record.src !== undefined ||
      record.secureUrl !== undefined ||
      record.secure_url !== undefined ||
      record.url !== undefined ||
      record.originalUrl !== undefined ||
      record.mediaType !== undefined ||
      record.resourceType !== undefined ||
      record.resource_type !== undefined ||
      record.target === "background" ||
      record.background === true ||
      record.applyAsBackground === true;

    const selector = safeVisualSelector(elementId);
    if (!selector) return;

    const selectedNode = root.querySelector(selector);
    if (!selectedNode) return;

    const mediaNode =
      selectedNode.matches("img, video")
        ? selectedNode
        : selectedNode.querySelector("img, video") || selectedNode;

    if (!source) {
      if (hasMediaFields) {
        clearPublicMediaNode(mediaNode, item);
      }
      return;
    }

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
      const previousSrc = String(
        mediaNode.getAttribute("data-visual-current-src") ||
          mediaNode.currentSrc ||
          mediaNode.getAttribute("src") ||
          "",
      );

      mediaNode.src = source;
      mediaNode.preload = "auto";
      mediaNode.playsInline = true;
      mediaNode.autoplay = true;
      mediaNode.muted = true;
      mediaNode.defaultMuted = true;
      mediaNode.loop = true;
      mediaNode.controls = false;

      mediaNode.setAttribute("autoplay", "");
      mediaNode.setAttribute("muted", "");
      mediaNode.setAttribute("loop", "");
      mediaNode.setAttribute("playsinline", "");
      mediaNode.setAttribute("preload", "auto");
      mediaNode.removeAttribute("controls");
      mediaNode.setAttribute("data-visual-current-src", source);
      mediaNode.setAttribute("data-video-src", source);

      if (mediaNode.style.maxWidth === "none") {
        mediaNode.style.removeProperty("max-width");
      }
      if (mediaNode.style.maxHeight === "none") {
        mediaNode.style.removeProperty("max-height");
      }
      applyMediaFitStyles(mediaNode);

      try {
        if (previousSrc !== source) {
          mediaNode.load();
        }

        void mediaNode.play().catch(() => undefined);
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
        void video.play().catch(() => undefined);
      } catch {
        // noop
      }
    });
}

function readPublicLinkRecord(visualData, elementId) {
  const data = asPlainObject(visualData);
  const attributesCollection = asPlainObject(data.__attributes);
  const contentCollection = asPlainObject(data.__content);

  const rawAttributes = asPlainObject(attributesCollection[elementId]);
  const nestedAttributes = asPlainObject(
    rawAttributes.attributes || rawAttributes.attrs,
  );
  const contentItem = asPlainObject(contentCollection[elementId]);
  const contentLink = asPlainObject(
    contentItem.link || contentItem.linkData || contentItem.action,
  );

  const merged = {
    ...contentItem,
    ...contentLink,
    ...rawAttributes,
    ...nestedAttributes,
  };

  const href = safeString(
    merged.href ||
      merged.url ||
      merged.linkHref ||
      merged.linkUrl ||
      merged.destination,
  ).trim();

  const target = safeString(
    merged.target || merged.linkTarget,
  ).trim();

  return {
    href,
    target,
  };
}

function normalizePublicHref(value) {
  const href = safeString(value).trim();

  if (!href || href === "#") return href;

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("geo:") ||
    href.startsWith("javascript:")
  ) {
    return href;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
    return href;
  }

  if (
    href.startsWith("www.") ||
    href.includes(".")
  ) {
    return `https://${href}`;
  }

  return href;
}

function applyPublicLinksToDom(root, visualData) {
  if (!root) return;

  const data = asPlainObject(visualData);
  const attributesCollection = asPlainObject(data.__attributes);
  const contentCollection = asPlainObject(data.__content);
  const elementIds = new Set([
    ...Object.keys(attributesCollection),
    ...Object.keys(contentCollection),
  ]);

  elementIds.forEach((elementId) => {
    const link = readPublicLinkRecord(data, elementId);
    const href = normalizePublicHref(link.href);

    if (!href || href === "#") return;

    const selector = safeVisualSelector(elementId);
    if (!selector) return;

    const selectedNode = root.querySelector(selector);
    if (!selectedNode) return;

    const linkNode =
      selectedNode.matches("a")
        ? selectedNode
        : selectedNode.querySelector("a");

    const target =
      link.target ||
      (href.startsWith("http://") || href.startsWith("https://")
        ? "_blank"
        : "_self");

    if (linkNode instanceof HTMLAnchorElement) {
      linkNode.setAttribute("href", href);
      linkNode.setAttribute("target", target);
      linkNode.setAttribute("data-visual-link-href", href);
      linkNode.setAttribute("data-visual-link-target", target);
      linkNode.setAttribute("data-link-url", href);
      linkNode.setAttribute("data-bizuply-public-href", href);
      linkNode.setAttribute("data-bizuply-public-target", target);
      linkNode.setAttribute("data-bizuply-public-link", "true");

      if (target === "_blank") {
        linkNode.setAttribute("rel", "noopener noreferrer");
      } else {
        linkNode.removeAttribute("rel");
      }

      return;
    }

    selectedNode.setAttribute("data-bizuply-public-href", href);
    selectedNode.setAttribute("data-bizuply-public-target", target);
    selectedNode.setAttribute("data-bizuply-public-link", "true");
    selectedNode.setAttribute("data-visual-link-href", href);
    selectedNode.setAttribute("data-visual-link-target", target);
    selectedNode.setAttribute("data-link-url", href);
    selectedNode.setAttribute("data-href", href);

    if (!selectedNode.hasAttribute("role")) {
      selectedNode.setAttribute("role", "link");
    }

    if (!selectedNode.hasAttribute("tabindex")) {
      selectedNode.setAttribute("tabindex", "0");
    }

    if (!selectedNode.style.cursor) {
      selectedNode.style.cursor = "pointer";
    }
  });
}

function resolvePublicLinkFromEventTarget(root, target, visualData) {
  if (!(target instanceof Element) || !root?.contains(target)) {
    return null;
  }

  const anchor = target.closest("a[href]");
  if (anchor && root.contains(anchor)) {
    return {
      node: anchor,
      href: normalizePublicHref(anchor.getAttribute("href")),
      target: safeString(anchor.getAttribute("target")).trim() || "_self",
      isNativeAnchor: true,
    };
  }

  const explicitNode = target.closest("[data-bizuply-public-href]");
  if (explicitNode && root.contains(explicitNode)) {
    return {
      node: explicitNode,
      href: normalizePublicHref(
        explicitNode.getAttribute("data-bizuply-public-href"),
      ),
      target:
        safeString(
          explicitNode.getAttribute("data-bizuply-public-target"),
        ).trim() || "_self",
      isNativeAnchor: false,
    };
  }

  const visualNode = target.closest("[data-visual-edit-id]");
  if (!visualNode || !root.contains(visualNode)) {
    return null;
  }

  const elementId = safeString(
    visualNode.getAttribute("data-visual-edit-id"),
  ).trim();

  if (!elementId) return null;

  const saved = readPublicLinkRecord(visualData, elementId);
  const href = normalizePublicHref(saved.href);

  if (!href || href === "#") return null;

  return {
    node: visualNode,
    href,
    target:
      saved.target ||
      (href.startsWith("http://") || href.startsWith("https://")
        ? "_blank"
        : "_self"),
    isNativeAnchor: visualNode.matches("a"),
  };
}

function navigatePublicLink(href, target) {
  const cleanHref = normalizePublicHref(href);

  if (!cleanHref || cleanHref === "#") return;

  if (cleanHref.startsWith("#")) {
    const id = decodeURIComponent(cleanHref.slice(1));
    const targetNode =
      document.getElementById(id) ||
      document.querySelector(`[name="${id.replace(/"/g, '\\"')}"]`);

    if (targetNode) {
      targetNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (typeof window !== "undefined") {
        window.history.replaceState(
          window.history.state,
          "",
          cleanHref,
        );
      }
    }

    return;
  }

  if (target === "_blank") {
    window.open(cleanHref, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.assign(cleanHref);
}

function readNodePublicHref(node) {
  if (!(node instanceof Element)) return "";

  return normalizePublicHref(
    node.getAttribute("data-bizuply-public-href") ||
      node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      (node.matches("a") ? node.getAttribute("href") : "") ||
      "",
  );
}

function syncPublicNavActiveState(root, pathname) {
  if (!root) return;

  const currentPath = normalizePublicPath(
    pathname || getCurrentPathname(),
  );

  const containers = root.querySelectorAll(
    "nav, .servora-nav, [data-template-section-type='header'], [aria-label*='ניווט']",
  );

  const scopes = containers.length ? Array.from(containers) : [root];

  scopes.forEach((container) => {
    const items = container.querySelectorAll(
      [
        "a.servora-nav-link",
        "button.servora-nav-link",
        ".servora-nav-link",
        "nav a[href]",
        "nav button",
        '[data-editable="link"]',
        "[data-visual-link-href]",
        "[data-bizuply-public-href]",
      ].join(", "),
    );

    let best = null;
    let bestScore = -1;

    items.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;

      const href = readNodePublicHref(node);
      if (
        !href ||
        href === "#" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("sms:") ||
        href.startsWith("http://") ||
        href.startsWith("https://")
      ) {
        return;
      }

      const path = normalizePublicPath(href);
      let score = -1;

      if (currentPath && path === currentPath) {
        score = 100;
      } else if (!currentPath && (path === "" || href === "/")) {
        score = 50;
      }

      if (score > bestScore) {
        bestScore = score;
        best = node;
      }
    });

    items.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;

      const active = Boolean(best && node === best && bestScore >= 0);
      node.classList.toggle("is-active", active);

      if (active) {
        node.setAttribute("aria-current", "page");
      } else {
        node.removeAttribute("aria-current");
      }
    });
  });
}

function applyPublicVisualData(root, visualData, pathname) {
  if (!root) return;

  const data = asPlainObject(visualData);

  root.setAttribute("data-bizuply-public-render-root", "true");

  /*
    מקור אמת יחיד לעורך ולאתר המפורסם.
    applyAllVisualDataToDom כולל גם:
    - יצירת סקשנים ואלמנטים
    - styles/layout/responsive
    - scaling של לוח הסקשן לפי הרוחב האמיתי
    - ResizeObserver לשינויי viewport
    - forms, hidden/deleted וידאו
  */
  applyAllVisualDataToDom(root, data);

  // Public-only hydration that must run after the shared DOM pipeline.
  materializePublicMedia(root, data);
  applyPublicLinksToDom(root, data);
  syncPublicNavActiveState(root, pathname);
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

function readPublicRevision(site, activePage) {
  const source = asPlainObject(site);
  const page = asPlainObject(activePage);
  const timestamps = [
    page.updatedAt,
    page.publishedAt,
    asPlainObject(page.projectData).updatedAt,
    asPlainObject(page.visualEditorPayload).updatedAt,
    source.updatedAt,
    source.publishedAt,
    asPlainObject(source.projectData).updatedAt,
    asPlainObject(source.visualEditorPayload).updatedAt,
  ];

  const latestTimestamp = timestamps.reduce((latest, value) => {
    const timestamp = Date.parse(safeString(value));
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, 0);

  return String(
    latestTimestamp ||
      safeString(source.__publicFetchedAt) ||
      "initial",
  );
}


function readPageCustomCode(activePage, visualData) {
  const page = asPlainObject(activePage);
  return asPlainObject(
    asPlainObject(visualData).__customCode ||
      page.__customCode ||
      asPlainObject(page.data).__customCode ||
      asPlainObject(page.templateData).__customCode,
  );
}

function readSiteCustomCode(site) {
  const source = asPlainObject(site);
  return asPlainObject(
    source.customCode ||
      source.__customCode ||
      // Legacy fallback: only when page-level maps weren't the source
      asPlainObject(source.projectData).customCode,
  );
}

function PublicSeoHead({ resolvedSeo, faviconUrl }) {
  if (!resolvedSeo) return null;

  return (
    <Helmet>
      {faviconUrl ? (
        <>
          <link rel="icon" href={faviconUrl} />
          <link rel="apple-touch-icon" href={faviconUrl} />
        </>
      ) : null}
      {resolvedSeo.titleTag ? <title>{resolvedSeo.titleTag}</title> : null}
      {resolvedSeo.metaDescription ? (
        <meta name="description" content={resolvedSeo.metaDescription} />
      ) : null}
      {resolvedSeo.keywords ? (
        <meta name="keywords" content={resolvedSeo.keywords} />
      ) : null}
      <meta name="robots" content={resolvedSeo.robots || "index, follow"} />
      {resolvedSeo.canonicalUrl ? (
        <link rel="canonical" href={resolvedSeo.canonicalUrl} />
      ) : null}
      {resolvedSeo.social?.ogTitle ? (
        <meta property="og:title" content={resolvedSeo.social.ogTitle} />
      ) : null}
      {resolvedSeo.social?.ogDescription ? (
        <meta
          property="og:description"
          content={resolvedSeo.social.ogDescription}
        />
      ) : null}
      {resolvedSeo.social?.ogImage ? (
        <meta property="og:image" content={resolvedSeo.social.ogImage} />
      ) : null}
      {resolvedSeo.absoluteUrl ? (
        <meta property="og:url" content={resolvedSeo.absoluteUrl} />
      ) : null}
      <meta property="og:type" content="website" />
      <meta
        name="twitter:card"
        content={resolvedSeo.social?.twitterCard || "summary_large_image"}
      />
      {resolvedSeo.social?.ogTitle ? (
        <meta name="twitter:title" content={resolvedSeo.social.ogTitle} />
      ) : null}
      {resolvedSeo.social?.ogDescription ? (
        <meta
          name="twitter:description"
          content={resolvedSeo.social.ogDescription}
        />
      ) : null}
      {resolvedSeo.social?.ogImage ? (
        <meta name="twitter:image" content={resolvedSeo.social.ogImage} />
      ) : null}
      {Array.isArray(resolvedSeo.hreflang)
        ? resolvedSeo.hreflang
            .filter((entry) => entry && entry.lang && entry.href)
            .map((entry) => (
              <link
                key={`hreflang-${entry.lang}`}
                rel="alternate"
                hrefLang={entry.lang}
                href={entry.href}
              />
            ))
        : null}
      {Array.isArray(resolvedSeo.customMetaTags)
        ? resolvedSeo.customMetaTags
            .filter((meta) => meta && meta.key)
            .map((meta) =>
              meta.attr === "property" ? (
                <meta
                  key={`custom-${meta.attr}-${meta.key}`}
                  property={meta.key}
                  content={meta.content || ""}
                />
              ) : (
                <meta
                  key={`custom-${meta.attr}-${meta.key}`}
                  name={meta.key}
                  content={meta.content || ""}
                />
              ),
            )
        : null}
      {Array.isArray(resolvedSeo.structuredData)
        ? resolvedSeo.structuredData
            .filter((entry) => entry && entry.json && isValidJson(entry.json))
            .map((entry, index) => (
              <script
                key={`ld-${entry.id || index}`}
                type="application/ld+json"
              >
                {minifyJson(entry.json)}
              </script>
            ))
        : null}
    </Helmet>
  );
}

function isValidJson(value) {
  try {
    JSON.parse(String(value));
    return true;
  } catch {
    return false;
  }
}

function minifyJson(value) {
  try {
    return JSON.stringify(JSON.parse(String(value)));
  } catch {
    return String(value);
  }
}

function readCustomCode(site, activePage, visualData) {
  return mergeCustomCodeLayers(
    readSiteCustomCode(site),
    readPageCustomCode(activePage, visualData),
  );
}

function usePublicCustomCode(customCode) {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;

    const code = asPlainObject(customCode);
    // CSS is also joined into page <style> when possible; still inject
    // head HTML + JS (and CSS as document style for coverage across paths).
    return applyCustomCodeToDocument(code, { runScripts: true });
  }, [
    customCode?.enabled,
    customCode?.css,
    customCode?.headHtml,
    customCode?.javascript,
    customCode?.updatedAt,
  ]);
}

function CustomHtmlSlot({ html, slot }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.innerHTML = "";
    const value = safeString(html).trim();
    if (!value) return;
    injectHtmlIntoElement(node, value);
  }, [html]);

  if (!safeString(html).trim()) return null;

  return (
    <div
      ref={ref}
      data-bizuply-custom-body-slot={slot}
    />
  );
}

export default function PublicVisualSiteRenderer({
  site,
  pathname,
  templateData,
  className = "",
  disableAnalytics = false,
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

  const visualData = useMemo(() => {
    const raw = readTemplateData(site, activePage, templateData);
    const sitePages = Array.isArray(asPlainObject(site).pages)
      ? asPlainObject(site).pages
      : [];

    return syncSitePageTitlesIntoVisualData(raw, sitePages);
  }, [site, activePage, templateData]);

  const customCode = useMemo(
    () => readCustomCode(site, activePage, visualData),
    [site, activePage, visualData],
  );

  // In preview mode we must not inject the site's custom code/scripts into the
  // host document (dashboard). Only run it for the real published render.
  usePublicCustomCode(disableAnalytics ? {} : customCode);

  const htmlResult = useMemo(
    () => chooseBestPublishedHtml(site, activePage),
    [site, activePage],
  );

  const visualRuntimeCss = useMemo(
    () =>
      buildVisualRuntimeCss(
        readVisualStyles(visualData || {}),
        readVisualAnimations(visualData || {}),
      ),
    [visualData],
  );

  const css = useMemo(
    () =>
      joinCssParts(
        getRendererRuntimeCss(renderer),
        readSavedCss(site, activePage),
        visualRuntimeCss,
        customCode.enabled !== false ? safeString(customCode.css) : "",
      ),
    [renderer, site, activePage, visualRuntimeCss, customCode],
  );

  const hasSavedHtml = htmlResult.html.length > 20;
  const TemplateComponent = renderer?.Component || null;
  const pageId = getFallbackPageId(activePage, pathname);
  const publicRevision = useMemo(
    () => readPublicRevision(site, activePage),
    [site, activePage],
  );

  const resolvedSeo = useMemo(() => {
    const clientResolved = resolvePageSeoMeta({
      page: activePage,
      siteName: site?.name,
      siteSlug: site?.slug,
      publicUrl: site?.publicUrl,
      seoSettings: site?.seoSettings || site?.seo,
    });

    if (!site?.resolvedSeo) return clientResolved;

    /*
      Prefer the server-resolved meta for scalar values, but backfill the
      advanced arrays (structured data / custom meta / hreflang) from the
      client resolver so they render even against an older server payload.
    */
    return {
      ...clientResolved,
      ...site.resolvedSeo,
      structuredData:
        site.resolvedSeo.structuredData ?? clientResolved.structuredData,
      customMetaTags:
        site.resolvedSeo.customMetaTags ?? clientResolved.customMetaTags,
      hreflang: site.resolvedSeo.hreflang ?? clientResolved.hreflang,
    };
  }, [site, activePage]);

  useEffect(() => {
    if (disableAnalytics) return;

    const context = readSiteAnalyticsContext(site);
    if (!context) return;

    trackBizuplyPageView({
      ...context,
      pageId: pageId || context.pageId,
      pageSlug: activePage?.slug || context.pageSlug,
      pageTitle: activePage?.title || context.pageTitle,
      pathname: pathname || window.location.pathname || "/",
    });
  }, [site, pageId, pathname, activePage?.slug, activePage?.title, disableAnalytics]);

  /*
    התאמה 1:1 לעורך לכל התבניות visual-react:
    אם יש Component רשום לתבנית — תמיד מרנדרים תבנית + data (כמו בעורך),
    ולא HTML snapshot. ה-snapshot עלול להיות ישן/שבור ולסטות מהעורך
    (סדר סקשנים, hero, מדיה). HTML נשאר רק ל-GrapesJS/legacy בלי renderer.
  */
  const isVisualReactSite =
    safeString(asPlainObject(site).templateEditorMode) === "visual-react" ||
    safeString(asPlainObject(site).editorMode) === "visual-react" ||
    safeString(asPlainObject(activePage).projectData?.editorMode) ===
      "visual-react" ||
    hasMeaningfulVisualData(visualData);

  const preferTemplateRender = Boolean(
    TemplateComponent && (isVisualReactSite || Boolean(templateKey)),
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    root.setAttribute("data-visual-page-id", pageId || "home");

    let applyScheduled = false;
    let applying = false;
    let reapplyQueued = false;

    const insertedSectionIds = Object.keys(
      asPlainObject(asPlainObject(visualData).__insertedSections),
    );

    const isInsertedVisualMissing = () => {
      if (!insertedSectionIds.length) return false;

      return insertedSectionIds.some((sectionId) => {
        const selector = safeVisualSelector(sectionId);
        if (!selector) return false;
        return !root.querySelector(selector);
      });
    };

    const applyVisual = () => {
      if (applying) {
        reapplyQueued = true;
        return;
      }

      applying = true;
      try {
        applyPublicVisualData(
          root,
          visualData,
          pathname || getCurrentPathname(),
        );
      } finally {
        applying = false;
      }

      if (reapplyQueued) {
        reapplyQueued = false;
        if (isInsertedVisualMissing()) {
          window.requestAnimationFrame(() => applyVisual());
        }
      }
    };

    applyVisual();

    /*
      תבניות כמו Justora מחליפות את עץ ה-DOM בניווט פנימי (בית/אודות...).
      בלי re-apply, סקשנים שהוכנסו מהעורך ו-overrides של __content נמחקים.
      צופים על root החיצוני (לא על צומת התבנית) כדי לא לאבד את ה-observer
      כש-React מחליף את עץ התבנית.
    */
    const scheduleApply = () => {
      if (applyScheduled) return;
      applyScheduled = true;
      window.requestAnimationFrame(() => {
        applyScheduled = false;
        applyVisual();
      });
    };

    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver((mutations) => {
            const pageChanged = mutations.some(
              (mutation) =>
                mutation.type === "attributes" &&
                (mutation.attributeName === "data-template-page-id" ||
                  mutation.attributeName === "data-active-page-id"),
            );

            const childrenChanged = mutations.some(
              (mutation) => mutation.type === "childList",
            );

            if (pageChanged) {
              scheduleApply();
              return;
            }

            if (!childrenChanged) return;

            if (applying) {
              reapplyQueued = true;
              return;
            }

            if (isInsertedVisualMissing()) {
              scheduleApply();
            }
          })
        : null;

    mutationObserver?.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-template-page-id", "data-active-page-id"],
    });

    /*
      Justora (ואחרות) מחליפות children אחרי paint — rAF כפול תופס
      גם remount שמפספס את ה-observer הראשון.
    */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!applying) applyVisual();
      });
    });

    const handleClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = resolvePublicLinkFromEventTarget(
        root,
        event.target,
        visualData,
      );

      if (!link?.href || link.href === "#") return;

      if (link.isNativeAnchor) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      navigatePublicLink(link.href, link.target);
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const link = resolvePublicLinkFromEventTarget(
        root,
        event.target,
        visualData,
      );

      if (!link?.href || link.href === "#" || link.isNativeAnchor) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      navigatePublicLink(link.href, link.target);
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("keydown", handleKeyDown);

    console.log("[BizUply Public Renderer]", {
      templateKey,
      activePageId: activePage?.id || "",
      activePageSlug: activePage?.slug || "",
      renderSource: preferTemplateRender
        ? "template-render-parity"
        : hasSavedHtml
          ? htmlResult.source
          : TemplateComponent
            ? "template-fallback-with-saved-data"
            : "missing-content",
      selectedHtmlLength: htmlResult.html.length,
      selectedHtmlScore: htmlResult.score,
      visualDataKeys: Object.keys(visualData || {}),
      insertedSections: Object.keys(
        asPlainObject(visualData?.__insertedSections),
      ).length,
      candidates: htmlResult.candidates,
    });

    return () => {
      mutationObserver?.disconnect();
      root.removeEventListener("click", handleClick);
      root.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activePage,
    hasSavedHtml,
    htmlResult,
    templateKey,
    visualData,
    TemplateComponent,
    preferTemplateRender,
    pageId,
    pathname,
  ]);

  if (hasSavedHtml && !preferTemplateRender) {
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
        data-bizuply-public-revision={publicRevision}
        dir="rtl"
      >
        <PublicSeoHead
          resolvedSeo={resolvedSeo}
          faviconUrl={site?.brand?.faviconUrl || ""}
        />
        {css ? <style>{css}</style> : null}

        {customCode.enabled !== false ? (
          <CustomHtmlSlot
            slot="start"
            html={customCode.bodyStartHtml}
          />
        ) : null}

        <div
          data-bizuply-published-html="true"
          dangerouslySetInnerHTML={{
            __html: htmlResult.html,
          }}
        />

        {customCode.enabled !== false ? (
          <CustomHtmlSlot
            slot="end"
            html={customCode.bodyEndHtml}
          />
        ) : null}
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
        data-bizuply-public-revision={publicRevision}
        dir="rtl"
      >
        <PublicSeoHead
          resolvedSeo={resolvedSeo}
          faviconUrl={site?.brand?.faviconUrl || ""}
        />
        {css ? <style>{css}</style> : null}

        {customCode.enabled !== false ? (
          <CustomHtmlSlot
            slot="start"
            html={customCode.bodyStartHtml}
          />
        ) : null}

        <div data-bizuply-template-fallback="true">
          {/*
            מפתח יציב לפי template בלבד.
            publicRevision/pageId ב-key גרמו ל-remount מלא בכל רענון —
            וכך נמחקו סקשנים/מדיה שהוחלו על ה-DOM. העדכונים מגיעים
            דרך props + applyPublicVisualData, בלי להרוס את העץ.
          */}
          <TemplateComponent
            key={templateKey || "template"}
            mode="preview"
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

        {customCode.enabled !== false ? (
          <CustomHtmlSlot
            slot="end"
            html={customCode.bodyEndHtml}
          />
        ) : null}
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
