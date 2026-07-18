const VISITOR_KEY = "bizuply_vid";
const SESSION_KEY = "bizuply_sid";
const DEDUP_MS = 30_000;

type TrackPageViewInput = {
  businessId: string;
  websiteId: string;
  pageId?: string;
  pageSlug?: string;
  pageTitle?: string;
  pathname?: string;
  hostname?: string;
};

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function getBizuplyVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;

    const next = uuid();
    localStorage.setItem(VISITOR_KEY, next);
    return next;
  } catch {
    return uuid();
  }
}

export function getBizuplySessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const next = uuid();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return uuid();
  }
}

function getApiBaseUrl() {
  const isProd = import.meta.env.MODE === "production";
  return isProd ? "https://api.bizuply.com/api" : "/api";
}

function shouldSkipDedup(visitorId: string, pageId: string) {
  try {
    const key = `bizuply_pv_dedup:${visitorId}:${pageId}`;
    const raw = sessionStorage.getItem(key);
    const now = Date.now();

    if (raw && now - Number(raw) < DEDUP_MS) {
      return true;
    }

    sessionStorage.setItem(key, String(now));
    return false;
  } catch {
    return false;
  }
}

export async function trackBizuplyPageView(input: TrackPageViewInput) {
  if (!input.businessId || !input.websiteId) return;

  const visitorId = getBizuplyVisitorId();
  const pageId = input.pageId || "home";

  if (shouldSkipDedup(visitorId, pageId)) {
    return;
  }

  const params = new URLSearchParams(window.location.search || "");

  const payload = {
    businessId: input.businessId,
    websiteId: input.websiteId,
    pageId,
    pageSlug: input.pageSlug || "",
    pageTitle: input.pageTitle || document.title || "",
    pathname: input.pathname || window.location.pathname || "/",
    hostname: input.hostname || window.location.hostname || "",
    referrer: document.referrer || "",
    visitorId,
    sessionId: getBizuplySessionId(),
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
  };

  const body = JSON.stringify(payload);
  const endpoint = `${getApiBaseUrl()}/analytics/page-view`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }

  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "omit",
  }).catch(() => undefined);
}

export function readSiteAnalyticsContext(site: Record<string, any> | null | undefined) {
  if (!site) {
    return null;
  }

  const businessId = String(site.businessId || site.business?._id || "");
  const websiteId = String(site._id || site.id || "");
  const activePage = site.activePage || site.pages?.find((page: any) => page.isHome) || site.pages?.[0];

  if (!businessId || !websiteId) {
    return null;
  }

  return {
    businessId,
    websiteId,
    pageId: String(activePage?.id || "home"),
    pageSlug: String(activePage?.slug || ""),
    pageTitle: String(activePage?.title || document.title || ""),
  };
}
