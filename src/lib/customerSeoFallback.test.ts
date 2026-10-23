import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import middleware from "../../middleware.js";

const SHELL = `<!doctype html><html><head>
<title>Bizuply — Business Platform</title>
<meta name="description" content="Bizuply is a business platform for CRM, leads, appointments, websites, automations, and WhatsApp. In Hebrew, the brand name is ביזאפלי.">
<meta property="og:title" content="Bizuply — Business Platform">
<meta property="og:url" content="https://bizuply.com">
<meta name="apple-mobile-web-app-title" content="Bizuply">
<meta name="application-name" content="Bizuply">
<script type="application/ld+json">{"@type":"Organization","name":"Bizuply","alternateName":["ביזאפלי","BizUply"],"url":"https://bizuply.com"}</script>
</head><body><div id="root">customer app shell</div></body></html>`;

const CUSTOMER_HEAD = [
  `<title data-bizuply-edge-seo="1">Sample Studio</title>`,
  `<meta name="description" content="Appointments and a public page for Sample Studio." data-bizuply-edge-seo="1" />`,
  `<meta property="og:title" content="Sample Studio" data-bizuply-edge-seo="1" />`,
  `<meta property="og:url" content="https://sample.example/" data-bizuply-edge-seo="1" />`,
  `<link rel="canonical" href="https://sample.example/" data-bizuply-edge-seo="1" />`,
  `<script type="application/ld+json" data-bizuply-edge-seo="1">{"@type":"LocalBusiness","name":"Sample Studio","url":"https://sample.example/"}</script>`,
].join("");

let server: http.Server;
let base = "";
let mode: "ok" | "missing" | "down" | "recover" = "missing";
let seoCalls = 0;
const realFetch = globalThis.fetch;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(SHELL);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("no port");
  base = `http://127.0.0.1:${address.port}`;

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (!url.includes("/by-host/seo-head")) return realFetch(input, init);
    seoCalls += 1;
    if (mode === "ok" || (mode === "recover" && seoCalls > 1)) {
      return new Response(JSON.stringify({ success: true, headHtml: CUSTOMER_HEAD }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    if (mode === "down" || mode === "recover") {
      return new Response("unavailable", { status: 503 });
    }
    return new Response(JSON.stringify({ success: false, headHtml: "" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  };
});

afterAll(async () => {
  globalThis.fetch = realFetch;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function customerRequest() {
  return new Request(`${base}/`, {
    headers: {
      accept: "text/html",
      "x-forwarded-host": "sample.sites.bizuply.com",
    },
  });
}

describe("customer SEO fallback", () => {
  it("injects the customer's own SEO when the API returns it", async () => {
    mode = "ok";
    seoCalls = 0;
    const response = await middleware(customerRequest());
    const body = await response.text();
    expect(response.headers.get("x-bizuply-seo-edge")).toBe("injected");
    expect(body).toContain("<title data-bizuply-edge-seo=\"1\">Sample Studio</title>");
    expect(body).toContain('content="https://sample.example/"');
    expect(body).toContain('"name":"Sample Studio"');
    expect(body).not.toContain("Bizuply — Business Platform");
    expect(body).not.toContain("https://bizuply.com");
    expect(body).not.toContain("ביזאפלי");
    expect(body).toContain("customer app shell");
    expect(seoCalls).toBe(1);
  });

  it("does not index a confirmed missing site as Bizuply", async () => {
    mode = "missing";
    seoCalls = 0;
    const response = await middleware(customerRequest());
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("x-bizuply-seo-edge")).toBe("customer-absent");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(body).toContain('content="noindex, nofollow"');
    expect(body).not.toContain("Bizuply");
    expect(body).not.toContain("ביזאפלי");
    expect(body).not.toContain("bizuply.com");
    expect(body).not.toContain("<title>");
    expect(body).not.toContain("sample.sites.bizuply.com");
    expect(body).toContain("customer app shell");
    expect(seoCalls).toBe(1);
  });

  it("strips the platform brand on a temporary API failure without noindex", async () => {
    mode = "down";
    seoCalls = 0;
    const response = await middleware(customerRequest());
    const body = await response.text();
    expect(response.headers.get("x-bizuply-seo-edge")).toBe("customer-unavailable");
    expect(response.headers.get("x-robots-tag")).toBeNull();
    expect(body).toContain('content="index, follow"');
    expect(body).not.toContain("noindex");
    expect(body).not.toContain("Bizuply");
    expect(body).not.toContain("ביזאפלי");
    expect(body).not.toContain("bizuply.com");
    expect(body).toContain("customer app shell");
    expect(seoCalls).toBe(2);
  });

  it("uses the customer SEO from a retry after a temporary failure", async () => {
    mode = "recover";
    seoCalls = 0;
    const response = await middleware(customerRequest());
    const body = await response.text();
    expect(response.headers.get("x-bizuply-seo-edge")).toBe("injected");
    expect(body).toContain("Sample Studio");
    expect(body).not.toContain("Bizuply — Business Platform");
    expect(seoCalls).toBe(2);
  });
});
