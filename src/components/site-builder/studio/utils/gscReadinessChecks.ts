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
        label: "האתר הציבורי זמין",
        ok: false,
        detail: "אין כתובת אתר לבדיקה",
      },
      {
        id: "robots",
        label: "robots.txt זמין",
        ok: false,
        skipped: true,
      },
      {
        id: "sitemap",
        label: "sitemap.xml זמין",
        ok: false,
        skipped: true,
      },
      {
        id: "meta",
        label: "קוד אימות Meta נמצא באתר",
        ok: false,
        skipped: true,
      },
      {
        id: "htmlFile",
        label: "קובץ האימות זמין בכתובת האתר",
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
  let metaDetail = "לא הוגדר קוד אימות Meta";
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
        ? "קוד האימות מופיע ב־HTML של האתר"
        : "הקוד נשמר אצלנו, אבל עדיין לא מופיע באתר הציבורי — שמרו ופרסמו";
    } catch {
      metaOk = false;
      metaDetail = "לא הצלחנו לקרוא את ה־HTML של האתר";
    }
  } else {
    metaDetail = "לא הצלחנו לבדוק את ה־HTML של האתר";
  }

  let htmlOk = false;
  let htmlDetail = "לא הועלה קובץ אימות";
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
      htmlDetail = `הקובץ זמין בכתובת האתר (${publicRes.status})`;
    } else if (apiRes.ok) {
      htmlDetail =
        "הקובץ זמין דרך BizUply. אם הבדיקה בכתובת האתר נכשלה בגלל הרשאות דפדפן — בדקו ידנית את הקישור.";
    } else {
      htmlDetail =
        "הקובץ לא נמצא באתר אחרי השמירה. שמרו, פרסמו, ואז לחצו בדיקה מחדש.";
    }
  }

  return [
    {
      id: "site",
      label: "האתר הציבורי זמין",
      ok: siteRes.ok,
      detail: siteRes.ok
        ? `HTTP ${siteRes.status || 200}`
        : siteRes.status
          ? `HTTP ${siteRes.status}`
          : "האתר לא נמצא / לא פורסם",
    },
    {
      id: "robots",
      label: "robots.txt זמין",
      ok: robotsRes.ok,
      detail: robotsRes.ok
        ? `HTTP ${robotsRes.status || 200}`
        : robotsRes.status
          ? `HTTP ${robotsRes.status}`
          : "לא זמין",
    },
    {
      id: "sitemap",
      label: "sitemap.xml זמין",
      ok: sitemapRes.ok,
      detail: sitemapRes.ok
        ? `HTTP ${sitemapRes.status || 200}`
        : sitemapRes.status
          ? `HTTP ${sitemapRes.status}`
          : "לא זמין",
    },
    {
      id: "meta",
      label: "קוד אימות Meta נמצא באתר",
      ok: token ? metaOk : false,
      skipped: !token,
      detail: metaDetail,
    },
    {
      id: "htmlFile",
      label: "קובץ האימות זמין בכתובת האתר",
      ok: htmlOk,
      skipped: htmlSkipped,
      detail: htmlDetail,
    },
  ];
}
