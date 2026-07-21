/**
 * Serve Google Search Console HTML verification files from the BizUply API.
 * Handles both `/google….html` and `/google…` (cleanUrls-stripped) paths.
 */
export const config = {
  matcher: ["/google:path*"],
};

function normalizeGoogleFile(pathname) {
  let file = String(pathname || "")
    .replace(/^\/+/, "")
    .toLowerCase();
  if (!file) return "";
  if (/^google[a-z0-9]+$/i.test(file)) {
    file = `${file}.html`;
  }
  if (!/^google[a-z0-9]+\.html$/i.test(file)) return "";
  return file;
}

export default async function middleware(request) {
  const host = String(request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
  const file = normalizeGoogleFile(new URL(request.url).pathname);

  if (!host || !file) {
    return;
  }

  const apiUrl =
    `https://api.bizuply.com/api/site-builder/public/by-host/google-html` +
    `?host=${encodeURIComponent(host)}&file=${encodeURIComponent(file)}`;

  try {
    const apiRes = await fetch(apiUrl, {
      headers: { accept: "text/html,text/plain" },
    });
    const body = await apiRes.text();
    return new Response(body, {
      status: apiRes.status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-bizuply-google-html": apiRes.ok ? "1" : "0",
      },
    });
  } catch {
    return new Response("Verification file unavailable", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
