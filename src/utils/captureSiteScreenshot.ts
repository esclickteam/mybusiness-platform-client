import { toBlob } from "html-to-image";

import { uploadMediaToCloudinary } from "../components/site-builder/studio/utils/uploadMediaToCloudinary";
import type { MySiteSummary } from "../api/mySitesApi";
import API from "../api";
import { getTemplateFullPageScreenshotUrl } from "./templateScreenshot";

const DESIGN_WIDTH = 1440;
const CAPTURE_TIMEOUT_MS = 75_000;
const inFlight = new Map<string, Promise<string>>();

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/** Prefer a stored full-page site shot; never return hero/cover thumbnails. */
export function getSiteCardScreenshotUrl(site: MySiteSummary): string {
  const screenshot = String(site.screenshotUrl || "").trim();
  if (screenshot) return screenshot;

  // Interim still: template full-page capture (not hero image).
  return getTemplateFullPageScreenshotUrl(site.templateKey);
}

export function siteNeedsScreenshotCapture(site: MySiteSummary): boolean {
  const siteId = String(site._id || "").trim();
  if (!siteId) return false;

  const screenshot = String(site.screenshotUrl || "").trim();
  if (!screenshot) return true;

  const shotAt = site.screenshotUpdatedAt
    ? Date.parse(String(site.screenshotUpdatedAt))
    : NaN;
  const updatedAt = site.updatedAt ? Date.parse(String(site.updatedAt)) : NaN;

  if (!Number.isFinite(shotAt)) return true;
  if (Number.isFinite(updatedAt) && updatedAt > shotAt + 1000) return true;

  return false;
}

async function waitForEmbedReady(iframe: HTMLIFrameElement) {
  const started = Date.now();

  while (Date.now() - started < CAPTURE_TIMEOUT_MS) {
    const doc = iframe.contentDocument;
    const root =
      (doc?.querySelector("[data-template-id]") as HTMLElement | null) ||
      (doc?.body as HTMLElement | null);

    if (root && (root.scrollHeight > 200 || root.offsetHeight > 200)) {
      await sleep(600);
      return root;
    }

    await sleep(200);
  }

  throw new Error("Site embed did not become ready for screenshot");
}

async function captureSiteScreenshotBlob(siteId: string): Promise<Blob> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  iframe.src = `/embed/site/${encodeURIComponent(siteId)}?shot=1&_t=${Date.now()}`;
  iframe.style.cssText = [
    "position:fixed",
    "left:-14000px",
    "top:0",
    `width:${DESIGN_WIDTH}px`,
    "height:1100px",
    "border:0",
    "opacity:0",
    "pointer-events:none",
    "z-index:-1",
  ].join(";");

  document.body.appendChild(iframe);

  try {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(new Error("Embed load timeout")),
        CAPTURE_TIMEOUT_MS,
      );
      iframe.onload = () => {
        window.clearTimeout(timer);
        resolve();
      };
      iframe.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("Embed failed to load"));
      };
    });

    const root = await waitForEmbedReady(iframe);
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("Missing embed document");

    // Force reveal states open (same idea as template embed cards).
    const style = doc.createElement("style");
    style.textContent = `
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
    `;
    doc.head?.appendChild(style);

    await sleep(250);

    const height = Math.max(
      root.scrollHeight,
      root.offsetHeight,
      doc.documentElement?.scrollHeight || 0,
      1100,
    );

    const blob = await toBlob(root, {
      width: DESIGN_WIDTH,
      height,
      canvasWidth: Math.round(DESIGN_WIDTH * 0.67),
      canvasHeight: Math.round(height * 0.67),
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#ffffff",
      filter: (node) => {
        const tag = String((node as HTMLElement)?.tagName || "").toLowerCase();
        return tag !== "script" && tag !== "noscript";
      },
    });

    if (!blob) throw new Error("Screenshot blob was empty");
    return blob;
  } finally {
    iframe.remove();
  }
}

export async function captureAndSaveSiteScreenshot(
  site: MySiteSummary,
): Promise<string> {
  const siteId = String(site._id || "").trim();
  if (!siteId) throw new Error("Missing site id");

  const existing = inFlight.get(siteId);
  if (existing) return existing;

  const task = (async () => {
    const blob = await captureSiteScreenshotBlob(siteId);
    const file = new File([blob], `site-${siteId}-screenshot.png`, {
      type: blob.type || "image/png",
    });

    const uploaded = await uploadMediaToCloudinary({
      file,
      businessId: site.businessId,
      source: "site-card-screenshot",
    });

    const url = String(uploaded.secureUrl || "").trim();
    if (!url) throw new Error("Upload returned empty URL");

    await API.patch(`/site-builder/sites/${siteId}`, {
      screenshotUrl: url,
    });

    return url;
  })();

  inFlight.set(siteId, task);

  try {
    return await task;
  } finally {
    inFlight.delete(siteId);
  }
}

export async function ensureSiteCardScreenshots(
  sites: MySiteSummary[],
  onUpdated?: (siteId: string, screenshotUrl: string) => void,
) {
  const queue = sites.filter(siteNeedsScreenshotCapture);
  // Capture sequentially to avoid melting the tab with many embeds.
  for (const site of queue) {
    const key = normalizeKey(site._id);
    if (!key) continue;
    try {
      const url = await captureAndSaveSiteScreenshot(site);
      onUpdated?.(String(site._id), url);
    } catch (error) {
      console.warn(
        "[MySites] screenshot capture failed:",
        site._id,
        error,
      );
    }
  }
}
