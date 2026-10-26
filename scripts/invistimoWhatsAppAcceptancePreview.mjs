/**
 * Isolated Invistimo WhatsApp acceptance preview.
 * Never talks to api.bizuply.com, Meta, Dialog, or production Mongo.
 * Serves the built client + an in-memory API replica of the existing
 * Invistimo identity (same email + businessId). No new production tenant.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";

export const INVISTIMO_BUSINESS_ID = "6a8df4e95c704a03773a9966";
export const OTHER_BUSINESS_ID = "64f000000000000000000099";
export const INVISTIMO_EMAIL = "support@invistimo.com";
export const OTHER_EMAIL = "other.cafe@example.test";
export const INVISTIMO_PREVIEW_PASSWORD = "InvistimoPreview-Only-2026";
export const OTHER_PREVIEW_PASSWORD = "OtherTenantPreview-Only-2026";
export const AGENT_PREVIEW_PASSWORD = "InvistimoAgentPreview-Only-2026";
export const AGENT_NO_VIEW_EMAIL = "agent.noview@invistimo.com";
export const AGENT_NO_SEND_EMAIL = "agent.nosend@invistimo.com";
export const AGENT_NO_MANAGE_EMAIL = "agent.nomanage@invistimo.com";
const SECRET = "invistimo-acceptance-preview-not-prod";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function sign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url"
  );
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    })
  ).toString("base64url");
  const mac = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${mac}`;
}

function verify(token) {
  const [header, body, mac] = String(token || "").split(".");
  if (!header || !body || !mac) return null;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}

function userPublic(row) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || "business",
    businessId: row.businessId,
    subscriptionPlan: "monthly",
    paymentStatus: "active",
    subscriptionStatus: "active",
    isSubscriptionValid: true,
    subscriptionStart: new Date(Date.now() - 86400000).toISOString(),
    subscriptionEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    hasPaid: true,
    hasAccess: true,
    enabledModules: ["crm", "whatsapp", "automations", "website"],
    activeProducts: [{ key: "business" }, { key: "crm" }],
    isGuidedDemo: false,
  };
}

function connection(businessId) {
  const invistimo = businessId === INVISTIMO_BUSINESS_ID;
  return {
    success: true,
    connected: true,
    readyToSend: false,
    readiness: "ready",
    readinessLabel: "Preview isolated — live send blocked",
    verifiedName: invistimo ? "Invistimo RSVP" : "Other Cafe",
    displayPhoneNumber: invistimo ? "+972 51-584-0471" : "+972 50-111-1111",
    qualityRating: "GREEN",
    messagingLimitTier: "TIER_1K",
    lastMetaSyncAt: new Date().toISOString(),
    wabaId: invistimo ? "preview-waba-invistimo" : "preview-waba-other",
    phoneNumberId: invistimo ? "preview-phone-invistimo" : "preview-phone-other",
    hasAccessToken: true,
    nameStatus: "APPROVED",
    webhookSubscribed: false,
  };
}

function createState() {
  return {
    guests: [
      { id: "g1", name: "Dana Guest", phone: "+972501111222", email: "dana@example.test", kind: "guest" },
      { id: "g2", name: "Noam RSVP", phone: "+972502222333", email: "noam@example.test", kind: "guest" },
    ],
    lists: [{ id: "list1", name: "Wedding guests", purpose: "reminders", memberCount: 2 }],
    templates: [
      {
        _id: "tpl1",
        name: "rsvp_reminder",
        metaTemplateName: "rsvp_reminder",
        language: "he",
        body: "שלום {{1}}, תזכורת לאירוע.",
        metaStatus: "APPROVED",
        source: "meta",
        status: "active",
      },
    ],
    automations: [
      {
        _id: "auto1",
        name: "RSVP reminder",
        trigger: "appointment_reminder_1_day",
        templateId: "tpl1",
        enabled: true,
        stats: { sent: 2, failed: 0 },
      },
    ],
    agents: [
      {
        id: "owner",
        name: "Invistimo Support",
        email: INVISTIMO_EMAIL,
        role: "owner",
        permissions: ["inbox", "send", "templates", "automations", "contacts", "scheduled", "reports"],
        status: "active",
        locked: true,
        source: "account",
      },
    ],
    scheduled: [],
    conversations: [
      {
        phone: "972501111222",
        recipientName: "Dana Guest",
        lastBody: "כן, מגיעים",
        lastDirection: "inbound",
        lastStatus: "received",
        lastMessageAt: new Date().toISOString(),
      },
      {
        phone: "972502222333",
        recipientName: "Noam RSVP",
        lastBody: "menu.pdf",
        lastDirection: "inbound",
        lastStatus: "received",
        lastMessageAt: new Date(Date.now() - 120000).toISOString(),
      },
      {
        phone: "972503333444",
        recipientName: "Closed Window",
        lastBody: "הודעה מלפני יומיים",
        lastDirection: "inbound",
        lastStatus: "received",
        lastMessageAt: new Date(Date.now() - 50 * 3600000).toISOString(),
      },
    ],
    messages: {
      "972501111222": [
        {
          _id: "m1",
          direction: "outbound",
          body: "היי דנה, מאשרים הגעה?",
          status: "delivered",
          source: "automation",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "m2",
          direction: "inbound",
          body: "כן, מגיעים",
          status: "received",
          createdAt: new Date().toISOString(),
        },
      ],
      "972502222333": [
        {
          _id: "n1",
          direction: "outbound",
          body: "שולחים תפריט ומיקום",
          status: "read",
          source: "reply",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: "n2",
          direction: "outbound",
          body: "שולחן 12",
          caption: "שולחן 12",
          messageType: "image",
          mimeType: "image/svg+xml",
          mediaUrl:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><rect fill='%2310b981' width='240' height='120'/><text x='20' y='70' fill='white' font-size='22'>Table 12</text></svg>",
          status: "delivered",
          createdAt: new Date(Date.now() - 7000000).toISOString(),
        },
        {
          _id: "n3",
          direction: "inbound",
          body: "תפריט מצורף",
          messageType: "document",
          filename: "menu.pdf",
          status: "received",
          createdAt: new Date(Date.now() - 120000).toISOString(),
        },
      ],
      "972503333444": [
        {
          _id: "c1",
          direction: "inbound",
          body: "הודעה מלפני יומיים",
          status: "received",
          createdAt: new Date(Date.now() - 50 * 3600000).toISOString(),
        },
      ],
    },
  };
}

export function createPreviewHandler({ distDir } = {}) {
  const users = {
    [INVISTIMO_EMAIL]: {
      id: "6a8df2aafdb200fc5ed281d0",
      name: "Invistimo Support",
      email: INVISTIMO_EMAIL,
      password: INVISTIMO_PREVIEW_PASSWORD,
      businessId: INVISTIMO_BUSINESS_ID,
    },
    [OTHER_EMAIL]: {
      id: "other-user-1",
      name: "Other Cafe",
      email: OTHER_EMAIL,
      password: OTHER_PREVIEW_PASSWORD,
      businessId: OTHER_BUSINESS_ID,
    },
    [AGENT_NO_VIEW_EMAIL]: {
      id: "agent-no-view",
      name: "No View Agent",
      email: AGENT_NO_VIEW_EMAIL,
      password: AGENT_PREVIEW_PASSWORD,
      businessId: INVISTIMO_BUSINESS_ID,
      role: "worker",
      permissions: [],
      manage: false,
    },
    [AGENT_NO_SEND_EMAIL]: {
      id: "agent-no-send",
      name: "No Send Agent",
      email: AGENT_NO_SEND_EMAIL,
      password: AGENT_PREVIEW_PASSWORD,
      businessId: INVISTIMO_BUSINESS_ID,
      role: "worker",
      permissions: ["inbox"],
      manage: false,
    },
    [AGENT_NO_MANAGE_EMAIL]: {
      id: "agent-no-manage",
      name: "No Manage Agent",
      email: AGENT_NO_MANAGE_EMAIL,
      password: AGENT_PREVIEW_PASSWORD,
      businessId: INVISTIMO_BUSINESS_ID,
      role: "worker",
      permissions: ["inbox", "send"],
      manage: false,
    },
  };
  const tenantState = {
    [INVISTIMO_BUSINESS_ID]: createState(),
    [OTHER_BUSINESS_ID]: {
      ...createState(),
      guests: [{ id: "og1", name: "Cafe guest", phone: "+972509999000", email: "", kind: "guest" }],
      agents: [],
      scheduled: [],
    },
  };

  function authUser(req) {
    const header = String(req.headers.authorization || "");
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const session = verify(token);
    if (!session?.email) return null;
    return users[session.email] || null;
  }

  function json(res, status, body) {
    res.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": reqOrigin(res),
      "access-control-allow-credentials": "true",
      "cache-control": "no-store",
    });
    res.end(JSON.stringify(body));
  }

  function reqOrigin() {
    return "*";
  }

  function denyOps(res) {
    return json(res, 403, {
      success: false,
      error: "Invistimo WhatsApp operations are only allowed for the Invistimo tenant",
      code: "INVISTIMO_TENANT_REQUIRED",
    });
  }

  function readBody(req) {
    return new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (!raw) return resolve({});
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve({});
        }
      });
    });
  }

  async function handleApi(req, res, pathname, query) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "Authorization, Content-Type, X-Business-Id",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      });
      return res.end();
    }

    if (pathname === "/api/whatsapp-api/availability") {
      return json(res, 200, { selfServe: true, providers: ["google", "microsoft"], turnstileSiteKey: null });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const user = users[email];
      if (!user || body.password !== user.password) {
        return json(res, 401, { message: "Invalid email or password." });
      }
      const accessToken = sign({ email: user.email, businessId: user.businessId });
      return json(res, 200, {
        accessToken,
        user: userPublic(user),
        redirectUrl: `/business/${user.businessId}/dashboard/whatsapp/overview`,
      });
    }

    const user = authUser(req);
    if (pathname === "/api/auth/me") {
      if (!user) return json(res, 401, { message: "Unauthorized" });
      return json(res, 200, userPublic(user));
    }
    if (pathname === "/api/auth/refresh-token" && req.method === "POST") {
      if (!user) return json(res, 401, { message: "Unauthorized" });
      return json(res, 200, { accessToken: sign({ email: user.email, businessId: user.businessId }) });
    }
    if (pathname === "/api/auth/logout") return json(res, 200, { success: true });

    if (!user) return json(res, 401, { message: "Unauthorized" });

    const businessId = user.businessId;
    const state = tenantState[businessId];
    const isInvistimo = businessId === INVISTIMO_BUSINESS_ID;

    function denyAgent(permission) {
      return json(res, 403, {
        success: false,
        error: `Invistimo WhatsApp agent is missing the "${permission}" permission`,
        code: "AGENT_PERMISSION_DENIED",
      });
    }

    function hasGrant(permission) {
      if (!isInvistimo) return true;
      if (!user.permissions) return true;
      if (permission === "manage") return Boolean(user.manage);
      return user.permissions.includes(permission);
    }

    if (pathname === "/api/whatsapp/status") return json(res, 200, connection(businessId));
    if (pathname === "/api/whatsapp/account-health/sync" && req.method === "POST") {
      return json(res, 200, { success: true, connection: connection(businessId) });
    }
    if (pathname === "/api/whatsapp/overview") {
      return json(res, 200, {
        success: true,
        connection: connection(businessId),
        templates: state.templates.length,
        campaigns: 0,
        automations: state.automations.length,
      });
    }
    if (pathname === "/api/whatsapp/account-health") {
      return json(res, 200, {
        success: true,
        connection: connection(businessId),
        metrics: [
          { key: "templatesApproved", label: "Approved", value: 1, source: "Preview" },
        ],
        chart7d: [{ date: "2026-10-26", sent: 2, delivered: 2, read: 1, failed: 0 }],
        comparison: { current: { sent: 2, delivered: 2, read: 1, failed: 0 } },
      });
    }
    if (pathname === "/api/whatsapp/hub-activity") {
      return json(res, 200, {
        success: true,
        events: [
          { id: "e1", type: "inbound", title: "Guest reply", at: new Date().toISOString() },
        ],
      });
    }
    if (pathname === "/api/whatsapp/templates") {
      return json(res, 200, { success: true, templates: state.templates });
    }
    if (pathname === "/api/whatsapp/templates/approved") {
      return json(res, 200, { success: true, templates: state.templates });
    }
    if (pathname === "/api/whatsapp/templates/sync" && req.method === "POST") {
      return json(res, 200, { success: true, templates: state.templates, synced: 0, liveDispatch: false });
    }
    if (pathname === "/api/whatsapp/profile") {
      return json(res, 200, {
        success: true,
        profile: {
          about: isInvistimo ? "Invistimo RSVP preview" : "Other cafe",
          description: "Isolated preview — production untouched",
          email: user.email,
          websites: ["https://invistimo.com"],
          vertical: "OTHER",
        },
      });
    }
    if (pathname === "/api/whatsapp/conversations") {
      if (!hasGrant("inbox")) return denyAgent("inbox");
      return json(res, 200, { success: true, conversations: state.conversations });
    }
    if (
      pathname.startsWith("/api/whatsapp/conversations/") &&
      !pathname.endsWith("/reply") &&
      req.method === "GET"
    ) {
      if (!hasGrant("inbox")) return denyAgent("inbox");
      const phone = decodeURIComponent(pathname.split("/")[4] || "");
      return json(res, 200, { success: true, messages: state.messages[phone] || [] });
    }
    if (pathname.startsWith("/api/whatsapp/conversations/") && pathname.endsWith("/reply") && req.method === "POST") {
      if (!hasGrant("send")) return denyAgent("send");
      const body = await readBody(req);
      const phone = decodeURIComponent(pathname.split("/")[4] || "");
      const thread = state.messages[phone] || [];
      const lastInbound = [...thread]
        .reverse()
        .find((row) => row.direction === "inbound");
      const inboundAt = lastInbound ? new Date(lastInbound.createdAt).getTime() : 0;
      const sessionOpen = inboundAt && Date.now() - inboundAt <= 24 * 60 * 60 * 1000;
      if (!sessionOpen) {
        return json(res, 400, {
          success: false,
          error: "Customer care window is closed. Send an approved template message instead.",
          code: "SESSION_CLOSED",
          liveDispatch: false,
        });
      }
      const text = String(body.body || body.text || "");
      const msg = {
        _id: `m${Date.now()}`,
        direction: "outbound",
        body: text,
        status: "sent",
        source: "preview_session",
        createdAt: new Date().toISOString(),
        providerMessageId: `preview-${Date.now()}`,
      };
      state.messages[phone] = [...thread, msg];
      const conv = state.conversations.find((row) => row.phone === phone);
      if (conv) {
        conv.lastBody = text;
        conv.lastDirection = "outbound";
        conv.lastStatus = "sent";
        conv.lastMessageAt = msg.createdAt;
      }
      return json(res, 200, {
        success: true,
        log: msg,
        providerMessageId: msg.providerMessageId,
        liveDispatch: false,
        dryRun: true,
        sessionOpen: true,
      });
    }
    if (pathname === "/api/whatsapp/recipients") {
      return json(res, 200, { success: true, recipients: state.guests, total: state.guests.length });
    }
    if (pathname === "/api/whatsapp/lists") {
      return json(res, 200, { success: true, lists: state.lists });
    }
    if (pathname === "/api/whatsapp/automations" && req.method === "GET") {
      return json(res, 200, { success: true, automations: state.automations });
    }
    if (pathname === "/api/whatsapp/automations" && req.method === "POST") {
      const body = await readBody(req);
      const row = {
        _id: `auto${Date.now()}`,
        name: body.name || "Automation",
        trigger: body.trigger,
        templateId: body.templateId,
        enabled: body.enabled !== false,
        stats: { sent: 0, failed: 0 },
      };
      state.automations.push(row);
      return json(res, 201, { success: true, automation: row });
    }
    if (pathname.startsWith("/api/whatsapp/automations/") && req.method === "PATCH") {
      const id = pathname.split("/").pop();
      const body = await readBody(req);
      const row = state.automations.find((a) => a._id === id);
      if (!row) return json(res, 404, { success: false, error: "Not found" });
      Object.assign(row, body);
      return json(res, 200, { success: true, automation: row });
    }
    if (pathname.startsWith("/api/whatsapp/automations/") && req.method === "DELETE") {
      const id = pathname.split("/").pop();
      state.automations = state.automations.filter((a) => a._id !== id);
      return json(res, 200, { success: true });
    }

    if (pathname.startsWith("/api/whatsapp/invistimo-ops") || pathname.startsWith("/api/whatsapp/invistimo-migration")) {
      if (!isInvistimo) return denyOps(res);
    }

    if (pathname === "/api/whatsapp/invistimo-ops/hub") {
      return json(res, 200, {
        success: true,
        extraModulesVisible: true,
        otherTenantsUnchanged: true,
        liveDispatch: false,
        login: { accountEmail: INVISTIMO_EMAIL, noNewTenant: true },
        modules: [
          { id: "contacts", path: "contacts", invistimoOnly: true },
          { id: "automations", path: "automations", invistimoOnly: true },
          { id: "agents", path: "agents", invistimoOnly: true },
          { id: "scheduled", path: "scheduled", invistimoOnly: true },
        ],
      });
    }
    if (pathname === "/api/whatsapp/invistimo-ops/contacts") {
      const q = String(query.q || "").toLowerCase();
      const guests = state.guests.filter((g) =>
        !q || `${g.name} ${g.phone} ${g.email}`.toLowerCase().includes(q)
      );
      return json(res, 200, { success: true, guests, lists: state.lists });
    }
    if (pathname === "/api/whatsapp/invistimo-ops/agents" && req.method === "GET") {
      if (!hasGrant("manage")) return denyAgent("manage");
      return json(res, 200, { success: true, agents: state.agents });
    }
    if (pathname === "/api/whatsapp/invistimo-ops/agents" && req.method === "POST") {
      if (!hasGrant("manage")) return denyAgent("manage");
      const body = await readBody(req);
      if (String(body.email || "").toLowerCase() === INVISTIMO_EMAIL) {
        return json(res, 400, { success: false, code: "AGENT_OWNER_LOCKED", error: "Owner locked" });
      }
      const agent = {
        id: `ag${Date.now()}`,
        name: body.name || body.email,
        email: String(body.email || "").toLowerCase(),
        role: body.role || "agent",
        permissions: body.permissions || ["inbox"],
        status: "invited",
        locked: false,
        source: "invite",
      };
      state.agents.push(agent);
      return json(res, 201, { success: true, agent });
    }
    if (pathname.startsWith("/api/whatsapp/invistimo-ops/agents/") && req.method === "PATCH") {
      if (!hasGrant("manage")) return denyAgent("manage");
      const id = pathname.split("/").pop();
      const body = await readBody(req);
      const agent = state.agents.find((a) => a.id === id);
      if (!agent) return json(res, 404, { success: false, error: "Not found" });
      if (agent.locked) return json(res, 400, { success: false, code: "AGENT_OWNER_LOCKED" });
      Object.assign(agent, body);
      return json(res, 200, { success: true, agent });
    }
    if (pathname === "/api/whatsapp/invistimo-ops/scheduled" && req.method === "GET") {
      return json(res, 200, { success: true, campaigns: state.scheduled, liveDispatch: false });
    }
    if (pathname === "/api/whatsapp/invistimo-ops/scheduled" && req.method === "POST") {
      const body = await readBody(req);
      if (!body.consentConfirmed) {
        return json(res, 400, { success: false, code: "CONSENT_REQUIRED", error: "Consent required" });
      }
      const campaign = {
        _id: `sch${Date.now()}`,
        name: body.name || "Scheduled draft",
        templateName: "rsvp_reminder",
        status: "draft",
        scheduledAt: body.scheduledAt,
        liveDispatch: false,
      };
      state.scheduled.push(campaign);
      return json(res, 201, { success: true, campaign, liveDispatch: false });
    }
    if (pathname.startsWith("/api/whatsapp/invistimo-ops/scheduled/") && pathname.endsWith("/cancel")) {
      const id = pathname.split("/")[5];
      const campaign = state.scheduled.find((c) => c._id === id);
      if (campaign) campaign.status = "cancelled";
      return json(res, 200, { success: true, campaign, liveDispatch: false });
    }
    if (pathname === "/api/whatsapp/invistimo-migration") {
      return json(res, 200, {
        success: true,
        readOnly: true,
        productionCutoverPerformed: false,
        hostingMutationsLocked: true,
        dialogMustStayConnected: true,
      });
    }
    if (pathname === "/api/whatsapp/connection/staging") {
      return json(res, 200, {
        success: true,
        live: connection(businessId),
        pending: null,
        invistimoDialogCutover: isInvistimo
          ? { productionCutoverAllowed: false, hostingMutationsLocked: true, dialogMustStayConnected: true }
          : null,
      });
    }
    if (pathname === "/api/whatsapp/channel-settings" || pathname === "/api/whatsapp/api-settings") {
      return json(res, 200, {
        success: true,
        direction: "meta_to_bizuply",
        connection: connection(businessId),
        timezoneId: "Asia/Jerusalem",
        webhook: { url: "", subscribed: false, health: "preview" },
      });
    }
    if (pathname === "/api/whatsapp-api/status") {
      return json(res, 200, { success: true, status: "preview", liveDispatch: false });
    }

    if (pathname.startsWith("/api/")) {
      return json(res, 200, { success: true, preview: true, liveDispatch: false, path: pathname });
    }
    return false;
  }

  return async function handler(req, res) {
    const parsed = url.parse(req.url, true);
    const pathname = decodeURIComponent(parsed.pathname || "/");
    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname, parsed.query || {});
      return;
    }
    if (!distDir) {
      res.writeHead(404);
      return res.end("dist not built");
    }
    let filePath = path.join(distDir, pathname === "/" ? "index.html" : pathname);
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, "index.html");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  };
}

export function startPreviewServer({ port = 4177, distDir } = {}) {
  const server = http.createServer(createPreviewHandler({ distDir }));
  return new Promise((resolve) => {
    server.listen(port, "0.0.0.0", () => resolve(server));
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);
if (isMain) {
  const distDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "../dist");
  const port = Number(process.env.PORT || 4177);
  const server = await startPreviewServer({ port, distDir });
  const addr = server.address();
  console.log(
    JSON.stringify(
      {
        isolated: true,
        productionUntouched: true,
        liveDispatch: false,
        port: addr.port,
        login: {
          invistimo: { email: INVISTIMO_EMAIL, password: INVISTIMO_PREVIEW_PASSWORD },
          otherTenant: { email: OTHER_EMAIL, password: OTHER_PREVIEW_PASSWORD },
        },
      },
      null,
      2
    )
  );
}
