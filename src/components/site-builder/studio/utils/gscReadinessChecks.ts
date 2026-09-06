import i18n from "../../../../i18n/i18n";

const t = (key: string, opts?: Record<string, unknown>) => String(i18n.t(key, opts));

export type GscCheckId =
  | "site"
  | "robots"
  | "sitemap"
  | "meta"
  | "htmlFile";

export type GscCheckResult = {
  id: GscCheckId;
  label: string;
  ok: boolean;
  skipped?: boolean;
  detail?: string;
};

export type GscReadinessInput = {
  siteBaseUrl: string;
  googleSiteVerification?: string;
  googleHtmlVerificationFile?: string;
  /** Prefer checking saved/published values after reload. */
  enabled?: boolean;
};

function hostFromSiteBaseUrl(siteBaseUrl: string): string {
  const raw = String(siteBaseUrl || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return parsed.host.toLowerCase();
  } catch {
    return raw
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .toLowerCase();
  }
}

async function fetchOk(url: string, init?: RequestInit): Promise<{
  ok: boolean;
  status: number;
  text?: string;
}> {
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      ...init,
    });
    let text: string | undefined;
    try {
      text = await res.text();
    } catch {
      text = undefined;
    }
    return { ok: res.ok, status: res.status, text };
  } catch {
    return { ok: false, status: 0 };
  }
}

/**
 * BizUply-controlled readiness checks only (no Google API / verify status).
 * Uses public by-host API endpoints from the studio origin.
 */
export async function runGscReadinessChecks(
  input: GscReadinessInput,
): Promise<GscCheckResult[]> {
  const host = hostFromSiteBaseUrl(input.siteBaseUrl);
  const token = String(input.googleSiteVerification || "").trim();
  const htmlFile = String(input.googleHtmlVerificationFile || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "");

  if (!host) {
    return [
      {
        id: "site",
        label: t("studio.gsc.siteAvailable"),
        ok: false,
        detail: t("studio.gsc.noUrl"),
      },
      {
        id: "robots",
        label: t("studio.gsc.robotsAvailable"),
        ok: false,
        skipped: true,
      },
      {
        id: "sitemap",
        label: t("studio.gsc.sitemapAvailable"),
        ok: false,
        skipped: true,
      },
      {
        id: "meta",
        label: t("studio.gsc.metaOnSite"),
        ok: false,
        skipped: true,
      },
      {
        id: "htmlFile",
        label: t("studio.gsc.fileOnSite"),
        ok: false,
        skipped: true,
      },
    ];
  }

  const q = encodeURIComponent(host);
  const byHost = `/api/site-builder/public/by-host?host=${q}`;
  const robotsApi = `/api/site-builder/public/by-host/robots.txt?host=${q}`;
  const sitemapApi = `/api/site-builder/public/by-host/sitemap.xml?host=${q}`;
  const seoHeadApi = `/api/site-builder/public/by-host/seo-head?host=${q}`;

  const [siteRes, robotsRes, sitemapRes, seoHeadRes] = await Promise.all([
    fetchOk(byHost),
    fetchOk(robotsApi),
    fetchOk(sitemapApi),
    fetchOk(seoHeadApi),
  ]);

  let metaOk = false;
  let metaDetail = t("studio.gsc.noMetaCode");
  if (!token) {
    metaOk = false;
  } else if (seoHeadRes.ok && seoHeadRes.text) {
    try {
      const json = JSON.parse(seoHeadRes.text) as {
        googleSiteVerification?: string;
        headHtml?: string;
      };
      const saved = String(json.googleSiteVerification || "").trim();
      const inHead =
        typeof json.headHtml === "string" &&
        json.headHtml.includes("google-site-verification") &&
        json.headHtml.includes(token);
      metaOk = saved === token || inHead;
      metaDetail = metaOk
        ? t("studio.gsc.metaInHtml")
        : t("studio.gsc.metaSavedNotLive");
    } catch {
      metaOk = false;
      metaDetail = t("studio.gsc.htmlReadFailed");
    }
  } else {
    metaDetail = t("studio.gsc.htmlCheckFailed");
  }

  let htmlOk = false;
  let htmlDetail = t("studio.gsc.noFileUploaded");
  let htmlSkipped = !htmlFile;
  if (htmlFile) {
    const apiFile = `/api/site-builder/public/by-host/google-html?host=${q}&file=${encodeURIComponent(
      htmlFile,
    )}`;
    const publicFile = `${String(input.siteBaseUrl).replace(/\/+$/, "")}/${htmlFile}`;
    const [apiRes, publicRes] = await Promise.all([
      fetchOk(apiFile),
      fetchOk(publicFile),
    ]);
    htmlSkipped = false;
    htmlOk = apiRes.ok || publicRes.ok;
    if (publicRes.ok) {
      htmlDetail = t("studio.gsc.fileAtUrl", { status: publicRes.status });
    } else if (apiRes.ok) {
      htmlDetail = t("studio.gsc.fileViaBizuply");
    } else {
      htmlDetail = t("studio.gsc.fileNotLive");
    }
  }

  return [
    {
      id: "site",
      label: t("studio.gsc.siteAvailable"),
      ok: siteRes.ok,
      detail: siteRes.ok
        ? `HTTP ${siteRes.status || 200}`
        : siteRes.status
          ? `HTTP ${siteRes.status}`
          : t("studio.gsc.siteNotFound"),
    },
    {
      id: "robots",
      label: t("studio.gsc.robotsAvailable"),
      ok: robotsRes.ok,
      detail: robotsRes.ok
        ? `HTTP ${robotsRes.status || 200}`
        : robotsRes.status
          ? `HTTP ${robotsRes.status}`
          : t("studio.gsc.unavailable"),
    },
    {
      id: "sitemap",
      label: t("studio.gsc.sitemapAvailable"),
      ok: sitemapRes.ok,
      detail: sitemapRes.ok
        ? `HTTP ${sitemapRes.status || 200}`
        : sitemapRes.status
          ? `HTTP ${sitemapRes.status}`
          : t("studio.gsc.unavailable"),
    },
    {
      id: "meta",
      label: t("studio.gsc.metaOnSite"),
      ok: token ? metaOk : false,
      skipped: !token,
      detail: metaDetail,
    },
    {
      id: "htmlFile",
      label: t("studio.gsc.fileOnSite"),
      ok: htmlOk,
      skipped: htmlSkipped,
      detail: htmlDetail,
    },
  ];
}
