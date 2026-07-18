import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import { getStudioTemplateRenderer } from "../studio/data/templates/templateRendererRegistry";

import { buildVisualRuntimeCss } from "../studio/visual-editor/utils/visualCssRuntime";
import {
  readVisualAnimations,
  readVisualStyles,
} from "../studio/visual-editor/utils/visualData";
import {
  applyCustomCodeToDocument,
  injectHtmlIntoElement,
  mergeCustomCodeLayers,
} from "../studio/visual-editor/utils/visualCustomCodeRuntime";

import {
  applyAllVisualDataToDom,
  prepareAllVideosInDom,
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

function hasMeaningfulVisualData(value) {
  const data = asPlainObject(value);

  return VISUAL_EDITOR_COLLECTION_KEYS.some((key) => {
    const collection = data[key];

    return (
      collection &&
      typeof collection === "object" &&
      !Array.isArray(collection) &&
      Object.keys(collection).length > 0
    );
  });
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
  const siteProjectData = asPlainObject(source.projectData);
  const pageProjectData = asPlainObject(page.projectData);
  const sitePayload = asPlainObject(source.visualEditorPayload);
  const pagePayload = asPlainObject(page.visualEditorPayload);

  /*
    /public/by-host כבר מנרמל site.data / site.projectData למקור האמת העדכני.
    לכן הם מקבלים עדיפות על פני עותקים ישנים בתוך activePage.
  */
  const candidates = [
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
    {
      value: pagePayload.data,
      updatedAt: pagePayload.updatedAt || page.updatedAt,
      priority: 100,
    },
    {
      value: pagePayload.templateData,
      updatedAt: pagePayload.updatedAt || page.updatedAt,
      priority: 95,
    },
    {
      value: page.data,
      updatedAt: page.updatedAt,
      priority: 90,
    },
    {
      value: page.templateData,
      updatedAt: page.updatedAt,
      priority: 85,
    },
    {
      value: pageProjectData.data,
      updatedAt: pageProjectData.updatedAt || page.updatedAt,
      priority: 80,
    },
    {
      value: pageProjectData.templateData,
      updatedAt: pageProjectData.updatedAt || page.updatedAt,
      priority: 75,
    },
  ];

  const validCandidates = candidates
    .filter(
      (candidate) =>
        candidate.value &&
        typeof candidate.value === "object" &&
        !Array.isArray(candidate.value) &&
        Object.keys(candidate.value).length > 0,
    )
    .map((candidate) => {
      const timestamp = Date.parse(safeString(candidate.updatedAt));

      return {
        ...candidate,
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
      };
    })
    .sort(
      (left, right) =>
        right.timestamp - left.timestamp ||
        right.priority - left.priority,
    );
  const found = validCandidates[0];

  return asPlainObject(found?.value);
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

      if (target === "_blank") {
        linkNode.setAttribute("rel", "noopener noreferrer");
      } else {
        linkNode.removeAttribute("rel");
      }

      linkNode.setAttribute("data-bizuply-public-link", "true");
      return;
    }

    selectedNode.setAttribute("data-bizuply-public-href", href);
    selectedNode.setAttribute("data-bizuply-public-target", target);
    selectedNode.setAttribute("data-bizuply-public-link", "true");

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

function applyPublicVisualData(root, visualData) {
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

  const customCode = useMemo(
    () => readCustomCode(site, activePage, visualData),
    [site, activePage, visualData],
  );

  usePublicCustomCode(customCode);

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

    applyPublicVisualData(root, visualData);

    if (!root) return undefined;

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
      candidates: htmlResult.candidates,
    });

    return () => {
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
        {css ? <style>{css}</style> : null}

        {customCode.enabled !== false ? (
          <CustomHtmlSlot
            slot="start"
            html={customCode.bodyStartHtml}
          />
        ) : null}

        <div data-bizuply-template-fallback="true">
          <TemplateComponent
            key={`${templateKey || "template"}-${pageId}-${publicRevision}`}
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
