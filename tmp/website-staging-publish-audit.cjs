/**
 * STAGING-ONLY website publish audit (no fixes, no DNS/ENV changes).
 * Business: E2E Monthly + Website Addon (6a7747f28d40afd18bb35cdb)
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { chromium } = require("playwright");

const API = "https://server-staging-15bb.up.railway.app";
const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6a7747f28d40afd18bb35cdb";
const BIZ_B = "6a77425ce87097243e0a1676"; // phase4 smoke business for isolation
const EMAIL = "e2e-addon@bizuply.test";
const PASSWORD = "E2eAdmin-OBtvohKTEdpH";
const MARKER_V1 = `AUDIT-V1-${Date.now()}`;
const MARKER_V2 = `AUDIT-V2-${Date.now()}`;
const OUT = path.join(__dirname, "website-staging-publish-audit-results.json");

const report = {
  startedAt: new Date().toISOString(),
  environment: "staging",
  businessId: BIZ,
  overall: "FAIL",
  sections: {
    A: { status: "PENDING", findings: [] },
    B: { status: "PENDING", findings: [] },
    C: { status: "PENDING", findings: [] },
    D: { status: "PENDING", findings: [] },
    Security: { status: "PENDING", findings: [] },
  },
  meta: {
    siteIds: [],
    urlsChecked: [],
    domainStatus: null,
    firstPublishWorked: null,
    republishWorked: null,
    stagingEnvObserved: {
      note: "from prior railway read in session",
      BIZUPLY_PUBLIC_SITE_DOMAIN: "sites.bizuply.com",
      STAGING_PUBLIC_SITE_MUTATIONS: "0",
      STAGING_PUBLIC_SITE_DOMAIN: null,
      clientVITE: "sites-staging.invalid",
    },
  },
};

function find(section, severity, step, detail) {
  report.sections[section].findings.push({
    severity,
    step,
    ...detail,
  });
}

function setStatus(section, status) {
  report.sections[section].status = status;
}

function httpReq(method, urlPath, { token, businessId, body, headers: extra } = {}) {
  return new Promise((resolve, reject) => {
    const data = body != null ? JSON.stringify(body) : null;
    const u = new URL(urlPath, API + "/");
    const headers = {
      accept: "application/json",
      origin: CLIENT,
      ...(extra || {}),
    };
    if (token) headers.authorization = "Bearer " + token;
    if (businessId) headers["x-business-id"] = String(businessId);
    if (data) {
      headers["content-type"] = "application/json";
      headers["content-length"] = Buffer.byteLength(data);
    }
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.request(
      { hostname: u.hostname, port: u.port || undefined, path: u.pathname + u.search, method, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {}
          resolve({ status: res.statusCode, headers: res.headers, json, text });
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function fetchUrl(url, { method = "GET", headers = {}, redirect = "manual", timeoutMs = 20000 } = {}) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === "https:" ? https : http;
      const req = lib.request(
        {
          hostname: u.hostname,
          port: u.port || undefined,
          path: u.pathname + u.search,
          method,
          headers: { "user-agent": "bizuply-staging-audit", ...headers },
          timeout: timeoutMs,
          rejectUnauthorized: true,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            resolve({
              ok: true,
              status: res.statusCode,
              headers: res.headers,
              text,
              redirected: false,
            });
          });
        }
      );
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, error: "timeout", status: 0 });
      });
      req.on("error", (e) => resolve({ ok: false, error: e.message, code: e.code, status: 0 }));
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message, status: 0 });
    }
  });
}

async function login(email, password) {
  const res = await httpReq("POST", "/api/auth/login", {
    body: { email, password },
  });
  if (res.status !== 200 || !res.json?.accessToken) {
    throw new Error(`login failed ${email} ${res.status} ${String(res.text).slice(0, 200)}`);
  }
  return res.json;
}

async function main() {
  const networkErrors = [];
  const consoleErrors = [];

  const loginA = await login(EMAIL, PASSWORD);
  const tokenA = loginA.accessToken;

  // ---------- TEST D: empty state ----------
  {
    const list = await httpReq("GET", `/api/site-builder/sites?businessId=${BIZ}`, {
      token: tokenA,
      businessId: BIZ,
    });
    const sites = list.json?.sites || list.json?.data || [];
    const emptyOk = list.status === 200 && Array.isArray(sites) && sites.length === 0;
    if (!emptyOk) {
      find("D", "HIGH", "API list empty", {
        request: `GET /api/site-builder/sites?businessId=${BIZ}`,
        httpStatus: list.status,
        response: list.json || list.text?.slice(0, 300),
        rootCause: "Expected zero sites for fresh E2E addon business",
      });
    }

    const me = await httpReq("GET", "/api/auth/me?forceRefresh=1", {
      token: tokenA,
      businessId: BIZ,
    });
    const wb = me.json?.entitlements?.websiteBuilder;
    const cd = me.json?.entitlements?.customDomain;
    if (!(wb?.enabled && wb?.status === "active")) {
      find("D", "BLOCKER", "entitlement websiteBuilder", {
        request: "GET /api/auth/me",
        httpStatus: me.status,
        response: wb,
        rootCause: "websiteBuilder entitlement missing/inactive",
      });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push({ url: page.url(), text: msg.text() });
    });
    page.on("response", (res) => {
      const u = res.url();
      if (!u.includes(API.replace("https://", "")) && !u.includes("/api/")) return;
      if (res.status() >= 400) {
        networkErrors.push({ url: u, status: res.status(), method: res.request().method() });
      }
    });

    await page.goto(CLIENT + "/login", { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.evaluate(
      ({ token, user, biz }) => {
        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("businessDetails", JSON.stringify({ ...user, businessId: biz }));
        localStorage.setItem("selectedBusinessId", biz);
      },
      { token: tokenA, user: loginA.user || me.json || {}, biz: BIZ }
    );

    const websiteUrl = `${CLIENT}/business/${BIZ}/dashboard/website`;
    await page.goto(websiteUrl, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(2500);
    const bodyText = await page.locator("body").innerText();
    const hasEmpty =
      /עדיין אין כאן אתרים|אין כאן אתרים|צור אתר ראשון|Create first/i.test(bodyText);
    const hasEntitlementError =
      /FEATURE_NOT_INCLUDED|לא כלול בתוכנית|אין הרשאה|entitlement/i.test(bodyText);
    const createBtn = page.getByRole("button", { name: /צור אתר ראשון|אתר חדש/i });
    const createVisible = await createBtn.first().isVisible().catch(() => false);

    report.meta.urlsChecked.push(websiteUrl);

    if (!hasEmpty || !createVisible) {
      find("D", "HIGH", "UI empty state", {
        request: websiteUrl,
        httpStatus: null,
        response: bodyText.slice(0, 500),
        rootCause: "Empty state / create CTA missing",
        consoleError: consoleErrors.slice(-3),
      });
    }
    if (hasEntitlementError) {
      find("D", "BLOCKER", "false entitlement error on empty sites", {
        request: websiteUrl,
        response: bodyText.slice(0, 400),
        rootCause: "UI shows entitlement error despite active websiteBuilder",
      });
    }

    // Click create first site
    if (createVisible) {
      await createBtn.first().click();
      await page.waitForTimeout(2000);
    } else {
      const alt = page.getByRole("button", { name: /אתר חדש|\+.*אתר/i });
      if (await alt.first().isVisible().catch(() => false)) await alt.first().click();
      await page.waitForTimeout(2000);
    }

    // Template gallery
    await page.waitForTimeout(2000);
    let afterCreateUrl = page.url();
    let templatePicked = false;

    // Prefer visible template cards / use CTA
    const useButtons = page.locator(
      'button:has-text("השתמש"), button:has-text("בחרי"), button:has-text("בחר"), button:has-text("Use"), a:has-text("השתמש"), [data-testid*="template"]'
    );
    const cardCount = await useButtons.count().catch(() => 0);
    if (cardCount > 0) {
      await useButtons.first().click({ timeout: 15000 }).catch(() => {});
      templatePicked = true;
      await page.waitForTimeout(3000);
    } else {
      // Click first template card-like element
      const cards = page.locator('[class*="template"], [class*="Template"], article, .gallery-card');
      if ((await cards.count()) > 0) {
        await cards.first().click().catch(() => {});
        await page.waitForTimeout(1500);
        const confirm = page.getByRole("button", { name: /המשך|בחירה|צור|Use|Select|התחל/i });
        if (await confirm.first().isVisible().catch(() => false)) {
          await confirm.first().click().catch(() => {});
        }
        templatePicked = true;
        await page.waitForTimeout(3000);
      }
    }

    afterCreateUrl = page.url();
    const inEditor = /\/website\/sites\/[^/]+\/edit|\/studio|template=/i.test(afterCreateUrl);

    // If still on gallery, try API create as fallback for remaining audit of publish pipeline
    let siteId = null;
    const m = afterCreateUrl.match(/\/sites\/([a-f0-9]{24})/i);
    if (m) siteId = m[1];

    // ---------- Create via API if UI didn't yield site ----------
    let templates = await httpReq("GET", `/api/website-templates?limit=5`, {
      token: tokenA,
      businessId: BIZ,
    });
    if (templates.status >= 400) {
      templates = await httpReq("GET", `/api/site-builder/templates?limit=5`, {
        token: tokenA,
        businessId: BIZ,
      });
    }
    const templateList =
      templates.json?.templates ||
      templates.json?.data ||
      templates.json?.items ||
      (Array.isArray(templates.json) ? templates.json : []);
    const templateKey =
      templateList[0]?.key ||
      templateList[0]?.slug ||
      templateList[0]?.templateKey ||
      templateList[0]?._id ||
      "adion";

    if (!siteId) {
      const create = await httpReq("POST", `/api/site-builder/sites`, {
        token: tokenA,
        businessId: BIZ,
        body: {
          businessId: BIZ,
          name: `Audit Site A ${MARKER_V1}`,
          templateKey,
          template: templateKey,
        },
      });
      siteId = create.json?.site?._id || create.json?.siteId || create.json?._id || create.json?.data?._id;
      if (!siteId) {
        find("A", "BLOCKER", "create site", {
          request: "POST /api/site-builder/sites",
          httpStatus: create.status,
          response: create.json || create.text?.slice(0, 500),
          rootCause: "Site creation failed",
          uiNote: { afterCreateUrl, templatePicked, inEditor },
        });
        find("D", "BLOCKER", "create first site flow", {
          request: afterCreateUrl,
          httpStatus: create.status,
          response: create.json || create.text?.slice(0, 400),
          rootCause: "Could not create first site via UI or API",
        });
      } else {
        find("D", "MEDIUM", "UI create redirected to API fallback", {
          request: afterCreateUrl,
          response: { siteId, templateKey, templatePicked, inEditor },
          rootCause: "UI gallery selection did not reliably land in editor; API create used for publish audit",
        });
      }
    }

    if (siteId) {
      report.meta.siteIds.push(siteId);
      // list refresh without manual refresh
      const list2 = await httpReq("GET", `/api/site-builder/sites?businessId=${BIZ}`, {
        token: tokenA,
        businessId: BIZ,
      });
      const sites2 = list2.json?.sites || [];
      if (!sites2.some((s) => String(s._id) === String(siteId))) {
        find("D", "HIGH", "list after create", {
          request: "GET /api/site-builder/sites",
          httpStatus: list2.status,
          response: sites2.map((s) => s._id),
          rootCause: "Created site not returned in list",
        });
      }

      // Navigate to editor
      const editUrl = `${CLIENT}/business/${BIZ}/dashboard/website/sites/${siteId}/edit?template=${encodeURIComponent(templateKey)}`;
      report.meta.urlsChecked.push(editUrl);
      await page.goto(editUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
      await page.waitForTimeout(4000);
      const editorText = await page.locator("body").innerText().catch(() => "");
      const editorLoaded = !/404|לא נמצא|שגיאה חמורה/i.test(editorText);
      if (!editorLoaded) {
        find("A", "BLOCKER", "open editor", {
          request: editUrl,
          response: editorText.slice(0, 400),
          rootCause: "Editor failed to load",
        });
      }

      // Domain not required for edit
      if (/חבר דומיין|custom domain.*required|נדרש דומיין/i.test(editorText) && /לפני.*פרסום|before.*publish/i.test(editorText)) {
        find("D", "BLOCKER", "domain required before edit/publish", {
          request: editUrl,
          response: editorText.slice(0, 400),
          rootCause: "UI requires domain before create/edit/publish",
        });
      }

      // ---------- TEST A: save draft + publish without domain ----------
      const getSite = async () =>
        httpReq("GET", `/api/site-builder/sites/${siteId}`, { token: tokenA, businessId: BIZ });

      let siteDoc = await getSite();
      const beforePages = siteDoc.json?.site?.pages || siteDoc.json?.pages || [];

      // Save draft with marker in visual data / pages content
      const draftBody = {
        businessId: BIZ,
        name: `Audit Site A ${MARKER_V1}`,
        status: "draft",
        published: false,
        visualEditorData: {
          ...(siteDoc.json?.site?.visualEditorData || siteDoc.json?.visualEditorData || {}),
          auditMarker: MARKER_V1,
          auditColor: "#ff5500",
          auditImage: "https://via.placeholder.com/300x200.png?text=AUDIT",
        },
        // also stamp a content field if pages exist
        pages: Array.isArray(beforePages) && beforePages.length
          ? beforePages.map((p, idx) =>
              idx === 0
                ? {
                    ...p,
                    title: `${p.title || "Home"} ${MARKER_V1}`,
                    seo: { ...(p.seo || {}), title: `SEO ${MARKER_V1}` },
                  }
                : p
            )
          : undefined,
      };

      const saveDraft = await httpReq("PATCH", `/api/site-builder/sites/${siteId}`, {
        token: tokenA,
        businessId: BIZ,
        body: draftBody,
      });
      if (saveDraft.status >= 400) {
        // try PUT alternate
        const save2 = await httpReq("PUT", `/api/site-builder/sites/${siteId}`, {
          token: tokenA,
          businessId: BIZ,
          body: draftBody,
        });
        if (save2.status >= 400) {
          find("A", "BLOCKER", "save draft", {
            request: `PATCH/PUT /api/site-builder/sites/${siteId}`,
            httpStatus: save2.status,
            response: save2.json || save2.text?.slice(0, 500),
            rootCause: "Draft save failed",
          });
        }
      }

      siteDoc = await getSite();
      const draftOk =
        JSON.stringify(siteDoc.json || {}).includes(MARKER_V1) ||
        siteDoc.json?.site?.visualEditorData?.auditMarker === MARKER_V1;
      if (!draftOk) {
        find("A", "HIGH", "draft persistence", {
          request: `GET /api/site-builder/sites/${siteId}`,
          httpStatus: siteDoc.status,
          response: {
            published: siteDoc.json?.site?.published,
            status: siteDoc.json?.site?.status,
            hasMarker: draftOk,
            keys: Object.keys(siteDoc.json?.site || siteDoc.json || {}),
          },
          rootCause: "Draft marker not persisted as expected",
        });
      }

      // Publish without custom domain
      const publishBody = {
        businessId: BIZ,
        status: "published",
        published: true,
        visualEditorData: {
          ...(siteDoc.json?.site?.visualEditorData || {}),
          auditMarker: MARKER_V1,
          auditColor: "#ff5500",
          auditImage: "https://via.placeholder.com/300x200.png?text=AUDIT",
        },
      };
      const publish = await httpReq("PATCH", `/api/site-builder/sites/${siteId}`, {
        token: tokenA,
        businessId: BIZ,
        body: publishBody,
      });

      report.meta.firstPublishWorked = publish.status < 400 && publish.json?.success !== false;

      if (publish.status === 403 && (publish.json?.code === "STAGING_SITE_DOMAIN_BLOCKED" || /Public site mutations blocked/i.test(publish.json?.error || publish.text || ""))) {
        find("A", "BLOCKER", "publish without custom domain", {
          request: `PATCH /api/site-builder/sites/${siteId} {published:true}`,
          httpStatus: 403,
          response: publish.json || publish.text?.slice(0, 500),
          dbState: "publish rejected before write",
          rootCause:
            "Staging server has STAGING_PUBLIC_SITE_MUTATIONS=0 and no STAGING_PUBLIC_SITE_DOMAIN; assertPublicSiteMutationsAllowed blocks publish. Client public domain is sites-staging.invalid (non-routable).",
        });
        report.meta.firstPublishWorked = false;
      } else if (publish.status >= 400) {
        find("A", "BLOCKER", "publish without custom domain", {
          request: `PATCH /api/site-builder/sites/${siteId}`,
          httpStatus: publish.status,
          response: publish.json || publish.text?.slice(0, 500),
          rootCause: "Publish API failed",
        });
      } else {
        const publishedDoc = await getSite();
        const site = publishedDoc.json?.site || publishedDoc.json || {};
        const publicUrl = site.publicUrl || "";
        const slug = site.slug || "";
        report.meta.urlsChecked.push(publicUrl);
        if (!(site.published === true || site.status === "published")) {
          find("A", "BLOCKER", "published state", {
            request: `GET /api/site-builder/sites/${siteId}`,
            httpStatus: publishedDoc.status,
            response: { published: site.published, status: site.status, publicUrl, slug },
            rootCause: "Publish succeeded but published flags not set",
          });
        }
        if (!publicUrl || !slug) {
          find("A", "HIGH", "slug/publicUrl after publish", {
            request: `GET /api/site-builder/sites/${siteId}`,
            response: { publicUrl, slug },
            rootCause: "Missing slug/publicUrl after publish",
          });
        }
        if (/sites\.bizuply\.com/i.test(publicUrl)) {
          find("A", "BLOCKER", "staging isolation of public URL", {
            request: publicUrl,
            response: { publicUrl },
            rootCause: "Staging publish produced production sites.bizuply.com URL",
          });
        }

        const direct = await fetchUrl(publicUrl);
        report.meta.urlsChecked.push(publicUrl);
        if (!direct.ok || direct.status !== 200) {
          find("A", "BLOCKER", "public URL HTTP access", {
            request: publicUrl,
            httpStatus: direct.status,
            response: { error: direct.error, code: direct.code, body: String(direct.text || "").slice(0, 200) },
            rootCause:
              direct.code === "ENOTFOUND" || /invalid/i.test(publicUrl)
                ? "Public host not DNS-resolvable (sites-staging.invalid or missing staging public domain)"
                : "Public site not HTTP 200",
          });
        } else {
          const hasMarker = String(direct.text || "").includes(MARKER_V1);
          if (!hasMarker) {
            find("A", "HIGH", "published content contains edits", {
              request: publicUrl,
              httpStatus: 200,
              response: String(direct.text || "").slice(0, 300),
              rootCause: "Published HTML missing audit marker (cache or publish payload)",
            });
          }
        }

        // Republish
        const republish = await httpReq("PATCH", `/api/site-builder/sites/${siteId}`, {
          token: tokenA,
          businessId: BIZ,
          body: {
            businessId: BIZ,
            status: "published",
            published: true,
            visualEditorData: {
              ...(site.visualEditorData || {}),
              auditMarker: MARKER_V2,
            },
          },
        });
        report.meta.republishWorked = republish.status < 400;
        if (republish.status >= 400) {
          find("A", "BLOCKER", "republish", {
            request: `PATCH /api/site-builder/sites/${siteId}`,
            httpStatus: republish.status,
            response: republish.json || republish.text?.slice(0, 400),
            rootCause: "Republish failed",
          });
        } else if (publicUrl) {
          await new Promise((r) => setTimeout(r, 2000));
          const direct2 = await fetchUrl(publicUrl + (publicUrl.includes("?") ? "&" : "?") + "t=" + Date.now());
          const hasV2 = String(direct2.text || "").includes(MARKER_V2);
          if (direct2.status === 200 && !hasV2) {
            find("A", "HIGH", "republish cache/content", {
              request: publicUrl,
              httpStatus: direct2.status,
              response: String(direct2.text || "").slice(0, 300),
              rootCause: "Republished marker not visible on public URL (possible cache)",
            });
          }
        }
      }

      // Duplicate site check
      const list3 = await httpReq("GET", `/api/site-builder/sites?businessId=${BIZ}`, {
        token: tokenA,
        businessId: BIZ,
      });
      const allSites = list3.json?.sites || [];
      const sameName = allSites.filter((s) => String(s.name || "").includes("Audit Site A"));
      if (sameName.length > 1) {
        find("A", "MEDIUM", "duplicate sites", {
          request: "GET /api/site-builder/sites",
          response: sameName.map((s) => ({ id: s._id, name: s.name, published: s.published })),
          rootCause: "Multiple Audit Site A documents created",
        });
      }

      // ownership
      const owned = await getSite();
      const ownedSite = owned.json?.site || owned.json || {};
      if (String(ownedSite.businessId) !== BIZ && ownedSite.businessId) {
        find("A", "BLOCKER", "businessId ownership", {
          request: `GET /api/site-builder/sites/${siteId}`,
          response: { businessId: ownedSite.businessId, expected: BIZ },
          rootCause: "Site businessId mismatch",
        });
      }

      // ---------- TEST B: custom domain ----------
      // Create second site for domain tests
      const createB = await httpReq("POST", `/api/site-builder/sites`, {
        token: tokenA,
        businessId: BIZ,
        body: {
          businessId: BIZ,
          name: `Audit Site B Domain ${Date.now()}`,
          templateKey,
          template: templateKey,
        },
      });
      const siteB =
        createB.json?.site?._id || createB.json?.siteId || createB.json?._id || createB.json?.data?._id;
      if (siteB) report.meta.siteIds.push(siteB);

      if (siteB) {
        const pubB = await httpReq("PATCH", `/api/site-builder/sites/${siteB}`, {
          token: tokenA,
          businessId: BIZ,
          body: { businessId: BIZ, status: "published", published: true },
        });
        if (pubB.status >= 400) {
          find("B", "BLOCKER", "publish site B before domain", {
            request: `PATCH /api/site-builder/sites/${siteB}`,
            httpStatus: pubB.status,
            response: pubB.json || pubB.text?.slice(0, 400),
            rootCause: pubB.json?.code || "Cannot publish site B on staging",
          });
        }

        // Open manage / domain UI
        const manageUrl = `${CLIENT}/business/${BIZ}/dashboard/website/sites/${siteB}/manage`;
        report.meta.urlsChecked.push(manageUrl);
        await page.goto(manageUrl, { waitUntil: "domcontentloaded", timeout: 90000 }).catch(() => {});
        await page.waitForTimeout(2000);

        const connect = await httpReq("PUT", `/api/site-builder/sites/${siteB}/custom-domain`, {
          token: tokenA,
          businessId: BIZ,
          body: { customDomain: "audit-staging-test.example.com" },
        });

        if (connect.status === 403 && connect.json?.code === "STAGING_SITE_DOMAIN_BLOCKED") {
          find("B", "BLOCKER", "add custom domain API", {
            request: `PUT /api/site-builder/sites/${siteB}/custom-domain`,
            httpStatus: 403,
            response: connect.json,
            rootCause:
              "Custom domain binding blocked by STAGING_PUBLIC_SITE_MUTATIONS=0 / missing STAGING_PUBLIC_SITE_DOMAIN",
          });
          setStatus("B", "BLOCKED_BY_DNS");
          report.meta.domainStatus = "blocked_before_dns_records";
        } else if (connect.status >= 400) {
          find("B", "HIGH", "add custom domain API", {
            request: `PUT /api/site-builder/sites/${siteB}/custom-domain`,
            httpStatus: connect.status,
            response: connect.json || connect.text?.slice(0, 400),
            rootCause: "Custom domain connect rejected",
          });
          setStatus("B", "FAIL");
        } else {
          const dns = connect.json?.dns;
          report.meta.domainStatus = "records_returned_pending_dns";
          if (!dns?.records?.length || !dns?.target) {
            find("B", "HIGH", "DNS records returned", {
              request: `PUT .../custom-domain`,
              httpStatus: connect.status,
              response: connect.json,
              rootCause: "No DNS records/target returned",
            });
          } else {
            // Validate records point at staging platform host, not prod if staging isolated
            const target = String(dns.target || "");
            if (/sites\.bizuply\.com/i.test(target) && !/staging/i.test(target)) {
              find("B", "BLOCKER", "DNS target isolation", {
                request: `PUT .../custom-domain`,
                response: dns,
                rootCause: "DNS CNAME target points at production sites.bizuply.com from staging",
              });
            }
            find("B", "LOW", "DNS records available", {
              request: `PUT .../custom-domain`,
              httpStatus: 200,
              response: dns,
              rootCause: "Records returned; live DNS connect not performed (no approved staging test domain)",
            });
          }

          // No approved staging test domain available — stop before external DNS
          setStatus("B", "BLOCKED_BY_DNS");
          report.meta.domainStatus = {
            apiConnect: "accepted_example_domain",
            dns,
            liveConnect: "STOPPED — need approved staging subdomain/DNS",
            requiredDns: dns?.records || null,
            note: "Did not change external DNS. Need a real staging test domain/subdomain pointing at the platform target.",
          };

          // Disconnect to avoid leaving example.com bound
          await httpReq("PUT", `/api/site-builder/sites/${siteB}/custom-domain`, {
            token: tokenA,
            businessId: BIZ,
            body: { disconnect: true },
          });
        }

        // ---------- TEST C: lifecycle coupling (API-level where possible) ----------
        const siteADoc = (await getSite()).json?.site || {};
        const couplingIssues = [];
        if (siteADoc.published === true && siteADoc.customDomain) {
          // ok if both set
        }
        // After failed publish, published should remain false without domain requirement
        if (publish.status === 403) {
          if (siteADoc.published === true) {
            couplingIssues.push("published=true despite blocked publish");
          }
          // Site can be draft without domain — expected
          find("C", "BLOCKER", "lifecycle publish without domain", {
            request: "publish then inspect site doc",
            httpStatus: publish.status,
            response: {
              published: siteADoc.published,
              status: siteADoc.status,
              publicUrl: siteADoc.publicUrl,
              slug: siteADoc.slug,
              domain: siteADoc.domain,
              customDomain: siteADoc.customDomain,
            },
            rootCause: "Cannot validate full domain lifecycle because publish mutations are blocked on staging",
          });
        } else {
          // Disconnect domain should not delete site
          const beforeDisconnect = await httpReq("GET", `/api/site-builder/sites/${siteB}`, {
            token: tokenA,
            businessId: BIZ,
          });
          const disc = await httpReq("PUT", `/api/site-builder/sites/${siteB}/custom-domain`, {
            token: tokenA,
            businessId: BIZ,
            body: { disconnect: true },
          });
          const afterDisconnect = await httpReq("GET", `/api/site-builder/sites/${siteB}`, {
            token: tokenA,
            businessId: BIZ,
          });
          const stillExists = afterDisconnect.status === 200 && (afterDisconnect.json?.site?._id || afterDisconnect.json?._id);
          if (!stillExists) {
            find("C", "BLOCKER", "disconnect deletes site", {
              request: `PUT .../custom-domain disconnect`,
              httpStatus: disc.status,
              response: afterDisconnect.json,
              rootCause: "Site document missing after domain disconnect",
            });
          }
          const pubUrl = afterDisconnect.json?.site?.publicUrl || afterDisconnect.json?.publicUrl;
          if (pubUrl) {
            const hit = await fetchUrl(pubUrl);
            if (hit.status !== 200) {
              find("C", "HIGH", "bizuply public URL after disconnect", {
                request: pubUrl,
                httpStatus: hit.status,
                response: { error: hit.error, code: hit.code },
                rootCause: "Platform public URL not reachable after domain disconnect",
              });
            }
          }
        }
      }
    }

    // ---------- Security / Isolation ----------
    {
      const siteId = report.meta.siteIds[0];
      // Unauth publish
      if (siteId) {
        const unauth = await httpReq("PATCH", `/api/site-builder/sites/${siteId}`, {
          businessId: BIZ,
          body: { businessId: BIZ, published: true, status: "published" },
        });
        if (unauth.status === 200) {
          find("Security", "BLOCKER", "unauthenticated publish", {
            request: `PATCH /api/site-builder/sites/${siteId} (no auth)`,
            httpStatus: unauth.status,
            response: unauth.json,
            rootCause: "Publish allowed without auth",
          });
        }

        // Cross-business IDOR: login as other business if possible
        let tokenB = null;
        try {
          const credsB = JSON.parse(
            fs.readFileSync(path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"), "utf8")
          );
          const loginB = await login(credsB.email, credsB.password);
          tokenB = loginB.accessToken;
          const idorGet = await httpReq("GET", `/api/site-builder/sites/${siteId}`, {
            token: tokenB,
            businessId: credsB.businessId || BIZ_B,
          });
          if (idorGet.status === 200 && (idorGet.json?.site || idorGet.json?._id)) {
            find("Security", "BLOCKER", "IDOR read site of other business", {
              request: `GET /api/site-builder/sites/${siteId} as business B`,
              httpStatus: idorGet.status,
              response: { id: idorGet.json?.site?._id || idorGet.json?._id },
              rootCause: "Business B can read Business A site",
            });
          }
          const idorPatch = await httpReq("PATCH", `/api/site-builder/sites/${siteId}`, {
            token: tokenB,
            businessId: credsB.businessId || BIZ_B,
            body: { businessId: credsB.businessId || BIZ_B, name: "HACKED" },
          });
          if (idorPatch.status === 200 && idorPatch.json?.success !== false) {
            find("Security", "BLOCKER", "IDOR edit site of other business", {
              request: `PATCH /api/site-builder/sites/${siteId} as business B`,
              httpStatus: idorPatch.status,
              response: idorPatch.json,
              rootCause: "Business B can edit Business A site",
            });
          }
          const idorDomain = await httpReq("PUT", `/api/site-builder/sites/${siteId}/custom-domain`, {
            token: tokenB,
            businessId: credsB.businessId || BIZ_B,
            body: { customDomain: "idor-steal.example.com" },
          });
          if (idorDomain.status === 200) {
            find("Security", "BLOCKER", "IDOR attach domain to other business site", {
              request: `PUT .../custom-domain as business B`,
              httpStatus: idorDomain.status,
              response: idorDomain.json,
              rootCause: "Business B can bind domain to Business A site",
            });
          }

          // entitlement: monthly-only without website should 403
          // skip if same business has website
        } catch (e) {
          find("Security", "MEDIUM", "isolation secondary business login", {
            request: "login business B",
            response: String(e.message || e),
            rootCause: "Could not complete cross-business checks",
          });
        }

        // Public site should not expose admin tokens etc — only if URL reachable
      }

      // Network 4xx/5xx during UI portion for website APIs
      const siteApiErrors = networkErrors.filter((n) => /site-builder|website/i.test(n.url));
      if (siteApiErrors.length) {
        find("D", "MEDIUM", "network errors during UI flow", {
          request: "browser network",
          response: siteApiErrors.slice(0, 20),
          rootCause: "4xx/5xx observed on site-builder endpoints during flow",
        });
      }
    }

    await browser.close();
  }

  // Finalize section statuses
  for (const key of Object.keys(report.sections)) {
    const s = report.sections[key];
    if (s.status === "BLOCKED_BY_DNS") continue;
    const blockers = s.findings.filter((f) => f.severity === "BLOCKER" || f.severity === "HIGH");
    if (s.findings.length === 0) s.status = "PASS";
    else if (blockers.length === 0 && s.findings.every((f) => f.severity === "LOW" || f.severity === "MEDIUM")) {
      // medium without blocker: FAIL if medium related to core, else PASS with notes
      s.status = s.findings.some((f) => f.severity === "MEDIUM") ? "FAIL" : "PASS";
    } else s.status = "FAIL";
  }

  // Special: B already set
  if (report.sections.B.status === "PENDING") report.sections.B.status = "BLOCKED_BY_DNS";

  const failed = ["A", "C", "D", "Security"].some((k) => report.sections[k].status === "FAIL");
  const blockedB = report.sections.B.status === "BLOCKED_BY_DNS";
  report.overall = failed ? "FAIL" : blockedB ? "FAIL" : "PASS";
  report.finishedAt = new Date().toISOString();
  report.statements = {
    WEBSITE_PUBLISHING_WITHOUT_DOMAIN:
      report.sections.A.status === "PASS" ? "PASS" : "FAIL",
    WEBSITE_PUBLISHING_WITH_CUSTOM_DOMAIN:
      report.sections.B.status === "PASS"
        ? "PASS"
        : report.sections.B.status === "BLOCKED_BY_DNS"
          ? "BLOCKED_BY_DNS"
          : "FAIL",
    READY_FOR_PRODUCTION: "NO",
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", OUT);
}

main().catch((e) => {
  console.error(e);
  report.fatal = String(e && e.stack ? e.stack : e);
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  process.exit(1);
});
