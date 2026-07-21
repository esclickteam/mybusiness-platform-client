/**
 * Serve Google Search Console HTML verification files from the BizUply API.
 * Matcher is file-only so homepage routing stays untouched.
 */
export const config = {
  matcher: ["/google:path*.html"],
};

export default async function middleware(request) {
  const host = String(request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
  const file = new URL(request.url).pathname.replace(/^\/+/, "").toLowerCase();

  if (!host || !/^google[a-z0-9]+\.html$/i.test(file)) {
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
        "cache-control": "public, max-age=60, must-revalidate",
      },
    });
  } catch {
    return new Response("Verification file unavailable", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
