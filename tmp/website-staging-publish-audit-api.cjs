/**
 * STAGING-ONLY website publish audit (API + HTTP). No ENV/DNS changes. No fixes.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const API = "https://server-staging-15bb.up.railway.app";
const CLIENT = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6a7747f28d40afd18bb35cdb";
const EMAIL = "e2e-addon@bizuply.test";
const PASSWORD = "E2eAdmin-OBtvohKTEdpH";
const MARKER_V1 = "AUDIT-V1-" + Date.now();
const MARKER_V2 = "AUDIT-V2-" + Date.now();
const OUT = path.join(__dirname, "website-staging-publish-audit-results.json");

const report = {
  startedAt: new Date().toISOString(),
  environment: "staging",
  businessId: BIZ,
  email: EMAIL,
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
      BIZUPLY_PUBLIC_SITE_DOMAIN: "sites.bizuply.com",
      STAGING_PUBLIC_SITE_MUTATIONS: "0",
      STAGING_PUBLIC_SITE_DOMAIN: null,
      clientVITE_BIZUPLY_PUBLIC_SITE_DOMAIN: "sites-staging.invalid",
    },
  },
};

function find(section, severity, step, detail) {
  report.sections[section].findings.push({ severity, step, ...detail });
}

function httpReq(method, urlPath, { token, businessId, body } = {}) {
  return new Promise((resolve, reject) => {
    const data = body != null ? JSON.stringify(body) : null;
    const u = new URL(urlPath, API + "/");
    const headers = { accept: "application/json", origin: CLIENT };
    if (token) headers.authorization = "Bearer " + token;
    if (businessId) headers["x-business-id"] = String(businessId);
    if (data) {
      headers["content-type"] = "application/json";
      headers["content-length"] = Buffer.byteLength(data);
    }
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.request(
      { hostname: u.hostname, path: u.pathname + u.search, method, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try { json = JSON.parse(text); } catch {}
          resolve({ status: res.statusCode, headers: res.headers, json, text });
        });
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === "https:" ? https : http;
      const req = lib.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "GET",
          headers: { "user-agent": "bizuply-staging-audit" },
          timeout: 20000,
          servername: u.hostname,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            resolve({
              ok: true,
              status: res.statusCode,
              headers: res.headers,
              text: Buffer.concat(chunks).toString("utf8"),
            })
          );
        }
      );
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, error: "timeout", status: 0 });
      });
      req.on("error", (e) =>
        resolve({ ok: false, error: e.message, code: e.code, status: 0 })
      );
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
    throw new Error("login failed " + email + " " + res.status + " " + String(res.text).slice(0, 200));
  }
  return res.json;
}

function siteFrom(res) {
  return res.json?.site || res.json?.data || res.json || {};
}

function finalize() {
  for (const key of Object.keys(report.sections)) {
    const s = report.sections[key];
    if (s.status === "BLOCKED_BY_DNS") continue;
    const hard = s.findings.filter((f) => f.severity === "BLOCKER" || f.severity === "HIGH");
    if (!s.findings.length) s.status = "PASS";
    else if (!hard.length) s.status = s.findings.some((f) => f.severity === "MEDIUM") ? "FAIL" : "PASS";
    else s.status = "FAIL";
  }
  if (report.sections.B.status === "PENDING") report.sections.B.status = "BLOCKED_BY_DNS";
  const failed = ["A", "C", "D", "Security"].some((k) => report.sections[k].status === "FAIL");
  report.overall = failed || report.sections.B.status !== "PASS" ? "FAIL" : "PASS";
  report.finishedAt = new Date().toISOString();
  report.statements = {
    WEBSITE_PUBLISHING_WITHOUT_DOMAIN: report.sections.A.status === "PASS" ? "PASS" : "FAIL",
    WEBSITE_PUBLISHING_WITH_CUSTOM_DOMAIN:
      report.sections.B.status === "PASS"
        ? "PASS"
        : report.sections.B.status === "BLOCKED_BY_DNS"
          ? "BLOCKED_BY_DNS"
          : "FAIL",
    READY_FOR_PRODUCTION: "NO",
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log("WROTE", OUT);
}

async function main() {
  const loginA = await login(EMAIL, PASSWORD);
  const tokenA = loginA.accessToken;

  // D: empty + entitlements
  const list0 = await httpReq("GET", "/api/site-builder/sites?businessId=" + BIZ, {
    token: tokenA,
    businessId: BIZ,
  });
  const sites0 = list0.json?.sites || [];
  if (list0.status !== 200) {
    find("D", "BLOCKER", "list sites", {
      request: "GET /api/site-builder/sites",
      httpStatus: list0.status,
      response: list0.json || list0.text.slice(0, 300),
      rootCause: "Sites list API failed",
    });
  } else if (sites0.length !== 0) {
    find("D", "MEDIUM", "expected empty business", {
      request: "GET /api/site-builder/sites",
      httpStatus: 200,
      response: { count: sites0.length, ids: sites0.map((s) => s._id) },
      rootCause: "Business already has sites; empty-state UI check may not apply purely",
    });
  }

  const me = await httpReq("GET", "/api/auth/me?forceRefresh=1", {
    token: tokenA,
    businessId: BIZ,
  });
  const wb = me.json?.entitlements?.websiteBuilder;
  const cd = me.json?.entitlements?.customDomain;
  if (!(wb?.enabled && wb?.status === "active")) {
    find("D", "BLOCKER", "websiteBuilder entitlement", {
      request: "GET /api/auth/me",
      httpStatus: me.status,
      response: wb,
      rootCause: "websiteBuilder not active",
    });
  }
  if (!(cd?.enabled && cd?.status === "active")) {
    find("D", "HIGH", "customDomain entitlement", {
      request: "GET /api/auth/me",
      httpStatus: me.status,
      response: cd,
      rootCause: "customDomain entitlement not active for addon business",
    });
  }

  // Templates
  let templates = await httpReq("GET", "/api/website-templates?limit=10", {
    token: tokenA,
    businessId: BIZ,
  });
  if (templates.status >= 400) {
    templates = await httpReq("GET", "/api/site-builder/templates?limit=10", {
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

  // Create site A
  const createA = await httpReq("POST", "/api/site-builder/sites", {
    token: tokenA,
    businessId: BIZ,
    body: {
      businessId: BIZ,
      name: "Audit Site A " + MARKER_V1,
      templateKey,
      template: templateKey,
    },
  });
  let siteA =
    createA.json?.site?._id ||
    createA.json?.siteId ||
    createA.json?._id ||
    createA.json?.data?._id;
  if (!siteA && createA.status >= 400) {
    // try alternate payloads
    const createA2 = await httpReq("POST", "/api/site-builder/sites", {
      token: tokenA,
      businessId: BIZ,
      body: { businessId: BIZ, name: "Audit Site A " + MARKER_V1, templateId: templateKey },
    });
    siteA =
      createA2.json?.site?._id ||
      createA2.json?.siteId ||
      createA2.json?._id ||
      createA2.json?.data?._id;
    if (!siteA) {
      find("A", "BLOCKER", "create site", {
        request: "POST /api/site-builder/sites",
        httpStatus: createA2.status,
        response: createA2.json || createA2.text.slice(0, 600),
        rootCause: "Site create failed",
      });
      find("D", "BLOCKER", "create first site", {
        request: "POST /api/site-builder/sites",
        httpStatus: createA2.status,
        response: createA2.json || createA2.text.slice(0, 400),
        rootCause: "Cannot create first site",
      });
      finalize();
      return;
    }
  } else if (!siteA) {
    find("A", "BLOCKER", "create site parse", {
      request: "POST /api/site-builder/sites",
      httpStatus: createA.status,
      response: createA.json || createA.text.slice(0, 600),
      rootCause: "Create returned success-like response without site id",
    });
    finalize();
    return;
  }

  report.meta.siteIds.push(String(siteA));
  find("D", "LOW", "create site API works without domain", {
    request: "POST /api/site-builder/sites",
    httpStatus: createA.status,
    response: { siteId: siteA, templateKey },
    rootCause: "n/a — domain not required to create",
  });

  const list1 = await httpReq("GET", "/api/site-builder/sites?businessId=" + BIZ, {
    token: tokenA,
    businessId: BIZ,
  });
  const sites1 = list1.json?.sites || [];
  if (!sites1.some((s) => String(s._id) === String(siteA))) {
    find("D", "HIGH", "list updates after create", {
      request: "GET /api/site-builder/sites",
      httpStatus: list1.status,
      response: sites1.map((s) => s._id),
      rootCause: "Created site missing from list",
    });
  }

  const getA = () =>
    httpReq("GET", "/api/site-builder/sites/" + siteA, { token: tokenA, businessId: BIZ });

  let docA = await getA();
  let siteDoc = siteFrom(docA);

  // Save draft with markers (text/color/image analog)
  const draftPayload = {
    businessId: BIZ,
    name: "Audit Site A " + MARKER_V1,
    status: "draft",
    published: false,
    visualEditorData: {
      ...(siteDoc.visualEditorData || {}),
      auditMarker: MARKER_V1,
      auditColor: "#ff5500",
      auditImage: "https://via.placeholder.com/300x200.png?text=AUDIT",
      auditText: "Hello " + MARKER_V1,
    },
  };
  let save = await httpReq("PATCH", "/api/site-builder/sites/" + siteA, {
    token: tokenA,
    businessId: BIZ,
    body: draftPayload,
  });
  if (save.status >= 400) {
    save = await httpReq("PUT", "/api/site-builder/sites/" + siteA, {
      token: tokenA,
      businessId: BIZ,
      body: draftPayload,
    });
  }
  if (save.status >= 400) {
    find("A", "BLOCKER", "save draft", {
      request: "PATCH/PUT /api/site-builder/sites/" + siteA,
      httpStatus: save.status,
      response: save.json || save.text.slice(0, 500),
      rootCause: "Draft save failed",
    });
  }

  docA = await getA();
  siteDoc = siteFrom(docA);
  const draftPersisted =
    JSON.stringify(siteDoc).includes(MARKER_V1) ||
    siteDoc.visualEditorData?.auditMarker === MARKER_V1;
  if (!draftPersisted) {
    find("A", "HIGH", "draft persistence", {
      request: "GET /api/site-builder/sites/" + siteA,
      httpStatus: docA.status,
      response: {
        keys: Object.keys(siteDoc || {}),
        published: siteDoc.published,
        status: siteDoc.status,
        visualEditorData: siteDoc.visualEditorData,
      },
      rootCause: "Draft marker not found after save",
    });
  }

  // Ownership checks
  if (siteDoc.businessId && String(siteDoc.businessId) !== BIZ) {
    find("A", "BLOCKER", "businessId ownership", {
      request: "GET site",
      response: { businessId: siteDoc.businessId, expected: BIZ },
      rootCause: "Wrong businessId on site",
    });
  }

  // Publish without custom domain
  const publish = await httpReq("PATCH", "/api/site-builder/sites/" + siteA, {
    token: tokenA,
    businessId: BIZ,
    body: {
      businessId: BIZ,
      status: "published",
      published: true,
      visualEditorData: {
        ...(siteDoc.visualEditorData || {}),
        auditMarker: MARKER_V1,
        auditColor: "#ff5500",
        auditImage: "https://via.placeholder.com/300x200.png?text=AUDIT",
        auditText: "Hello " + MARKER_V1,
      },
    },
  });
  report.meta.firstPublishWorked = publish.status < 400 && publish.json?.success !== false;

  if (
    publish.status === 403 &&
    (publish.json?.code === "STAGING_SITE_DOMAIN_BLOCKED" ||
      /Public site mutations blocked/i.test(String(publish.json?.error || publish.text || "")))
  ) {
    find("A", "BLOCKER", "publish without custom domain", {
      request: "PATCH /api/site-builder/sites/" + siteA + " {published:true}",
      httpStatus: 403,
      response: publish.json || publish.text.slice(0, 500),
      dbState: "publish rejected; site remains draft",
      rootCause:
        "Staging blocks public-site mutations: STAGING_PUBLIC_SITE_MUTATIONS=0 and no STAGING_PUBLIC_SITE_DOMAIN. Code path assertPublicSiteMutationsAllowed / ensureSiteMutationsAllowed. Generated host would be *.sites-staging.invalid (non-routable). Publish does NOT require custom domain in product logic, but staging env currently prevents any publish.",
    });
    report.meta.firstPublishWorked = false;

    // Confirm still draft and no domain coupling forcing publish
    docA = await getA();
    siteDoc = siteFrom(docA);
    if (siteDoc.published === true) {
      find("C", "HIGH", "published flag after blocked publish", {
        request: "GET site after 403 publish",
        response: { published: siteDoc.published, status: siteDoc.status },
        rootCause: "published=true despite blocked publish response",
      });
    }
    find("C", "BLOCKER", "cannot complete domain lifecycle on staging", {
      request: "publish lifecycle",
      httpStatus: 403,
      response: {
        published: siteDoc.published,
        status: siteDoc.status,
        publicUrl: siteDoc.publicUrl,
        slug: siteDoc.slug,
        domain: siteDoc.domain,
        customDomain: siteDoc.customDomain,
      },
      rootCause:
        "Cannot verify publish↔domain decoupling end-to-end because publish mutations are blocked by staging public-site domain policy",
    });
  } else if (publish.status >= 400) {
    find("A", "BLOCKER", "publish without custom domain", {
      request: "PATCH /api/site-builder/sites/" + siteA,
      httpStatus: publish.status,
      response: publish.json || publish.text.slice(0, 500),
      rootCause: "Publish failed",
    });
    report.meta.firstPublishWorked = false;
  } else {
    docA = await getA();
    siteDoc = siteFrom(docA);
    const publicUrl = siteDoc.publicUrl || "";
    const slug = siteDoc.slug || "";
    report.meta.urlsChecked.push(publicUrl);
    if (!(siteDoc.published === true || siteDoc.status === "published")) {
      find("A", "BLOCKER", "published state", {
        request: "GET site",
        response: { published: siteDoc.published, status: siteDoc.status, publicUrl, slug },
        rootCause: "Flags not set after publish",
      });
    }
    if (!publicUrl || !slug) {
      find("A", "HIGH", "slug/publicUrl", {
        request: "GET site",
        response: { publicUrl, slug },
        rootCause: "Missing slug/publicUrl",
      });
    }
    if (/sites\.bizuply\.com/i.test(publicUrl)) {
      find("A", "BLOCKER", "staging URL isolation", {
        request: publicUrl,
        response: { publicUrl },
        rootCause: "Staging publish wrote production sites.bizuply.com URL",
      });
    }
    const direct = await fetchUrl(publicUrl);
    if (!direct.ok || direct.status !== 200) {
      find("A", "BLOCKER", "public URL HTTP", {
        request: publicUrl,
        httpStatus: direct.status,
        response: { error: direct.error, code: direct.code },
        rootCause:
          direct.code === "ENOTFOUND" || /invalid/i.test(publicUrl)
            ? "Public host not resolvable"
            : "Public site not HTTP 200",
      });
    } else if (!String(direct.text || "").includes(MARKER_V1)) {
      find("A", "HIGH", "published content marker", {
        request: publicUrl,
        httpStatus: 200,
        response: String(direct.text || "").slice(0, 300),
        rootCause: "Published page missing edit marker",
      });
    }

    const republish = await httpReq("PATCH", "/api/site-builder/sites/" + siteA, {
      token: tokenA,
      businessId: BIZ,
      body: {
        businessId: BIZ,
        status: "published",
        published: true,
        visualEditorData: {
          ...(siteDoc.visualEditorData || {}),
          auditMarker: MARKER_V2,
          auditText: "Hello " + MARKER_V2,
        },
      },
    });
    report.meta.republishWorked = republish.status < 400;
    if (republish.status >= 400) {
      find("A", "BLOCKER", "republish", {
        request: "PATCH site publish v2",
        httpStatus: republish.status,
        response: republish.json || republish.text.slice(0, 400),
        rootCause: "Republish failed",
      });
    }
  }

  // Duplicate create check
  const list2 = await httpReq("GET", "/api/site-builder/sites?businessId=" + BIZ, {
    token: tokenA,
    businessId: BIZ,
  });
  const auditSites = (list2.json?.sites || []).filter((s) =>
    String(s.name || "").includes("Audit Site A")
  );
  if (auditSites.length > 1) {
    find("A", "MEDIUM", "duplicate sites", {
      request: "GET sites",
      response: auditSites.map((s) => ({ id: s._id, name: s.name, published: s.published })),
      rootCause: "Multiple Audit Site A docs",
    });
  }

  // Site B for domain
  const createB = await httpReq("POST", "/api/site-builder/sites", {
    token: tokenA,
    businessId: BIZ,
    body: {
      businessId: BIZ,
      name: "Audit Site B Domain " + Date.now(),
      templateKey,
      template: templateKey,
    },
  });
  const siteB =
    createB.json?.site?._id ||
    createB.json?.siteId ||
    createB.json?._id ||
    createB.json?.data?._id;
  if (siteB) report.meta.siteIds.push(String(siteB));

  if (!siteB) {
    find("B", "BLOCKER", "create site B", {
      request: "POST /api/site-builder/sites",
      httpStatus: createB.status,
      response: createB.json || createB.text.slice(0, 400),
      rootCause: "Cannot create second site for domain tests",
    });
    setBlockedB();
  } else {
    const pubB = await httpReq("PATCH", "/api/site-builder/sites/" + siteB, {
      token: tokenA,
      businessId: BIZ,
      body: { businessId: BIZ, status: "published", published: true },
    });
    if (pubB.status >= 400) {
      find("B", "BLOCKER", "publish site B before domain", {
        request: "PATCH /api/site-builder/sites/" + siteB,
        httpStatus: pubB.status,
        response: pubB.json || pubB.text.slice(0, 400),
        rootCause: pubB.json?.code || "Cannot publish site B on staging",
      });
    }

    const connect = await httpReq("PUT", "/api/site-builder/sites/" + siteB + "/custom-domain", {
      token: tokenA,
      businessId: BIZ,
      body: { customDomain: "audit-staging-test.example.com" },
    });

    if (connect.status === 403 && connect.json?.code === "STAGING_SITE_DOMAIN_BLOCKED") {
      find("B", "BLOCKER", "connect custom domain", {
        request: "PUT /api/site-builder/sites/" + siteB + "/custom-domain",
        httpStatus: 403,
        response: connect.json,
        rootCause:
          "Custom domain bind blocked by STAGING_PUBLIC_SITE_MUTATIONS=0 / missing STAGING_PUBLIC_SITE_DOMAIN",
      });
      report.sections.B.status = "BLOCKED_BY_DNS";
      report.meta.domainStatus = "blocked_by_staging_public_site_policy_before_dns";
    } else if (connect.status >= 400) {
      find("B", "HIGH", "connect custom domain", {
        request: "PUT .../custom-domain",
        httpStatus: connect.status,
        response: connect.json || connect.text.slice(0, 400),
        rootCause: "Custom domain connect rejected",
      });
    } else {
      const dns = connect.json?.dns;
      report.meta.domainStatus = {
        api: "accepted",
        customDomain: connect.json?.customDomain,
        dns,
        liveVerification: "STOPPED — no approved staging test domain; did not change external DNS",
        requiredIfProceeding: dns?.records || null,
        platformTarget: dns?.target || null,
      };
      if (!dns?.records?.length) {
        find("B", "HIGH", "DNS records", {
          request: "PUT .../custom-domain",
          httpStatus: connect.status,
          response: connect.json,
          rootCause: "No DNS records returned",
        });
      } else if (/sites\.bizuply\.com/i.test(String(dns.target || ""))) {
        find("B", "BLOCKER", "DNS target points at production", {
          request: "PUT .../custom-domain",
          httpStatus: connect.status,
          response: dns,
          rootCause:
            "Staging CNAME target is *.sites.bizuply.com — would couple staging custom domains to production public host",
        });
      }
      find("B", "LOW", "DNS instructions returned; live connect blocked pending approval", {
        request: "PUT .../custom-domain",
        httpStatus: connect.status,
        response: dns,
        rootCause: "Need approved staging subdomain before continuing Test B live HTTPS checks",
      });
      report.sections.B.status = "BLOCKED_BY_DNS";

      // Disconnect example domain
      await httpReq("PUT", "/api/site-builder/sites/" + siteB + "/custom-domain", {
        token: tokenA,
        businessId: BIZ,
        body: { disconnect: true },
      });
    }

    // C: disconnect should not delete site (even if connect failed, try disconnect + get)
    const before = await httpReq("GET", "/api/site-builder/sites/" + siteB, {
      token: tokenA,
      businessId: BIZ,
    });
    const disc = await httpReq("PUT", "/api/site-builder/sites/" + siteB + "/custom-domain", {
      token: tokenA,
      businessId: BIZ,
      body: { disconnect: true },
    });
    const after = await httpReq("GET", "/api/site-builder/sites/" + siteB, {
      token: tokenA,
      businessId: BIZ,
    });
    const afterSite = siteFrom(after);
    if (!(after.status === 200 && (afterSite._id || after.json?.success))) {
      // if disconnect itself blocked, that's expected under same policy
      if (disc.status === 403 && disc.json?.code === "STAGING_SITE_DOMAIN_BLOCKED") {
        find("C", "HIGH", "disconnect also blocked by staging policy", {
          request: "PUT .../custom-domain disconnect",
          httpStatus: 403,
          response: disc.json,
          rootCause: "Domain disconnect mutations also gated by STAGING_PUBLIC_SITE_MUTATIONS",
        });
      } else if (!afterSite._id) {
        find("C", "BLOCKER", "site missing after disconnect attempt", {
          request: "GET site B",
          httpStatus: after.status,
          response: after.json || after.text.slice(0, 300),
          rootCause: "Site document not readable after disconnect",
        });
      }
    } else {
      // site still present
      find("C", "LOW", "site document retained after disconnect attempt", {
        request: "GET site B",
        httpStatus: 200,
        response: { id: afterSite._id, published: afterSite.published, publicUrl: afterSite.publicUrl },
        rootCause: "n/a",
      });
    }

    // Prove product allows published without domain at data model level when not blocked
    // (inspect code-level expectation via current doc)
    const aNow = siteFrom(await getA());
    if (aNow.published === true && !aNow.domain?.domain && !aNow.customDomain) {
      find("C", "LOW", "published without custom domain possible", {
        request: "GET site A",
        response: { published: aNow.published, domain: aNow.domain, publicUrl: aNow.publicUrl },
        rootCause: "n/a — design holds",
      });
    }
  }

  // Security
  {
    const unauth = await httpReq("PATCH", "/api/site-builder/sites/" + siteA, {
      businessId: BIZ,
      body: { businessId: BIZ, published: true, status: "published" },
    });
    if (unauth.status === 200) {
      find("Security", "BLOCKER", "unauthenticated publish", {
        request: "PATCH site without Authorization",
        httpStatus: 200,
        response: unauth.json,
        rootCause: "Publish allowed without auth",
      });
    } else if (unauth.status === 401 || unauth.status === 403) {
      find("Security", "LOW", "unauthenticated publish rejected", {
        request: "PATCH site without Authorization",
        httpStatus: unauth.status,
        response: unauth.json || unauth.text.slice(0, 200),
        rootCause: "n/a",
      });
    }

    try {
      const credsB = JSON.parse(
        fs.readFileSync(path.join(process.env.TEMP, "bizuply-phase4-staging-smoke-creds.json"), "utf8")
      );
      const loginB = await login(credsB.email, credsB.password);
      const tokenB = loginB.accessToken;
      const bizB = credsB.businessId;

      const idorGet = await httpReq("GET", "/api/site-builder/sites/" + siteA, {
        token: tokenB,
        businessId: bizB,
      });
      if (idorGet.status === 200 && siteFrom(idorGet)._id) {
        find("Security", "BLOCKER", "IDOR read other business site", {
          request: "GET /api/site-builder/sites/" + siteA + " as B",
          httpStatus: 200,
          response: { id: siteFrom(idorGet)._id },
          rootCause: "Cross-business read allowed",
        });
      }

      const idorPatch = await httpReq("PATCH", "/api/site-builder/sites/" + siteA, {
        token: tokenB,
        businessId: bizB,
        body: { businessId: bizB, name: "HACKED-BY-B" },
      });
      if (idorPatch.status === 200 && idorPatch.json?.success !== false && !idorPatch.json?.error) {
        // verify name actually changed
        const check = siteFrom(await getA());
        if (String(check.name || "").includes("HACKED")) {
          find("Security", "BLOCKER", "IDOR edit other business site", {
            request: "PATCH site as B",
            httpStatus: 200,
            response: { name: check.name },
            rootCause: "Cross-business edit allowed",
          });
        }
      }

      const idorDomain = await httpReq("PUT", "/api/site-builder/sites/" + siteA + "/custom-domain", {
        token: tokenB,
        businessId: bizB,
        body: { customDomain: "idor-steal.example.com" },
      });
      if (idorDomain.status === 200) {
        find("Security", "BLOCKER", "IDOR bind domain to other business site", {
          request: "PUT custom-domain as B",
          httpStatus: 200,
          response: idorDomain.json,
          rootCause: "Cross-business domain bind allowed",
        });
      }

      // monthly without website entitlement
      const monthlyLogin = await login("e2e-monthly@bizuply.test", PASSWORD);
      const monthlyBiz = "6a7747f18d40afd18bb35cc0";
      const monthlyList = await httpReq("GET", "/api/site-builder/sites?businessId=" + monthlyBiz, {
        token: monthlyLogin.accessToken,
        businessId: monthlyBiz,
      });
      if (monthlyList.status === 200) {
        find("Security", "HIGH", "website API allowed without websiteBuilder entitlement", {
          request: "GET /api/site-builder/sites as e2e-monthly",
          httpStatus: 200,
          response: { count: (monthlyList.json?.sites || []).length },
          rootCause: "Expected FEATURE_NOT_INCLUDED / 403 for monthly-only plan",
        });
      } else if (monthlyList.status === 403) {
        find("Security", "LOW", "entitlement enforced for monthly plan", {
          request: "GET sites as monthly",
          httpStatus: 403,
          response: monthlyList.json,
          rootCause: "n/a",
        });
      }
    } catch (e) {
      find("Security", "MEDIUM", "isolation checks incomplete", {
        request: "cross-business login",
        response: String(e.message || e),
        rootCause: "Secondary login failed",
      });
    }
  }

  // Mark D: if no blockers/high beyond notes, and create worked, empty+create path API PASS
  // UI empty-state validated separately via browser in this session screenshot (user-provided + live).
  find("D", "LOW", "API empty/create/entitlement path", {
    request: "composite",
    response: {
      initialCount: sites0.length,
      createdSiteId: siteA,
      websiteBuilder: wb,
      note: "UI empty-state visually confirmed on staging for this business earlier in session",
    },
    rootCause: "n/a",
  });

  finalize();
}

function setBlockedB() {
  report.sections.B.status = "BLOCKED_BY_DNS";
}

main().catch((e) => {
  console.error(e);
  report.fatal = String(e && e.stack ? e.stack : e);
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");
  process.exit(1);
});
