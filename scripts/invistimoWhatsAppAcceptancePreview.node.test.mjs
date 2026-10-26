import { describe, test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  createPreviewHandler,
  INVISTIMO_EMAIL,
  INVISTIMO_PREVIEW_PASSWORD,
  OTHER_EMAIL,
  OTHER_PREVIEW_PASSWORD,
  AGENT_PREVIEW_PASSWORD,
  AGENT_NO_VIEW_EMAIL,
  AGENT_NO_SEND_EMAIL,
  AGENT_NO_MANAGE_EMAIL,
} from "./invistimoWhatsAppAcceptancePreview.mjs";

function listen(handler) {
  const server = http.createServer(handler);
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${port}`,
      });
    });
  });
}

async function request(base, path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function login(base, email, password) {
  const { data, status } = await request(base, "/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(status, 200, JSON.stringify(data));
  return data.accessToken;
}

describe("isolated Invistimo acceptance preview", () => {
  test("other tenants cannot call Invistimo ops APIs", async () => {
    const { server, url } = await listen(createPreviewHandler());
    try {
      const otherToken = await login(url, OTHER_EMAIL, OTHER_PREVIEW_PASSWORD);
      const invToken = await login(url, INVISTIMO_EMAIL, INVISTIMO_PREVIEW_PASSWORD);

      const denied = await request(url, "/api/whatsapp/invistimo-ops/hub", {
        token: otherToken,
      });
      assert.equal(denied.status, 403);
      assert.equal(denied.data.code, "INVISTIMO_TENANT_REQUIRED");

      const contactsDenied = await request(
        url,
        "/api/whatsapp/invistimo-ops/contacts",
        { token: otherToken }
      );
      assert.equal(contactsDenied.status, 403);

      const allowed = await request(url, "/api/whatsapp/invistimo-ops/hub", {
        token: invToken,
      });
      assert.equal(allowed.status, 200);
      assert.equal(allowed.data.liveDispatch, false);

      const created = await request(url, "/api/whatsapp/invistimo-ops/agents", {
        method: "POST",
        token: invToken,
        body: {
          name: "Desk",
          email: "desk@invistimo.com",
          permissions: ["inbox"],
        },
      });
      assert.equal(created.status, 201);
    } finally {
      server.close();
    }
  });

  test("restricted Invistimo agents receive 403 on view/send/manage", async () => {
    const { server, url } = await listen(createPreviewHandler());
    try {
      const noView = await login(url, AGENT_NO_VIEW_EMAIL, AGENT_PREVIEW_PASSWORD);
      const noSend = await login(url, AGENT_NO_SEND_EMAIL, AGENT_PREVIEW_PASSWORD);
      const noManage = await login(url, AGENT_NO_MANAGE_EMAIL, AGENT_PREVIEW_PASSWORD);
      const owner = await login(url, INVISTIMO_EMAIL, INVISTIMO_PREVIEW_PASSWORD);

      const inboxDenied = await request(url, "/api/whatsapp/conversations", {
        token: noView,
      });
      assert.equal(inboxDenied.status, 403);
      assert.equal(inboxDenied.data.code, "AGENT_PERMISSION_DENIED");

      const threadDenied = await request(
        url,
        "/api/whatsapp/conversations/972501111222",
        { token: noView }
      );
      assert.equal(threadDenied.status, 403);

      const sendDenied = await request(
        url,
        "/api/whatsapp/conversations/972501111222/reply",
        { method: "POST", token: noSend, body: { body: "should fail" } }
      );
      assert.equal(sendDenied.status, 403);
      assert.equal(sendDenied.data.code, "AGENT_PERMISSION_DENIED");

      const manageDenied = await request(url, "/api/whatsapp/invistimo-ops/agents", {
        method: "POST",
        token: noManage,
        body: { email: "new@invistimo.com", name: "Nope" },
      });
      assert.equal(manageDenied.status, 403);

      const ownerInbox = await request(url, "/api/whatsapp/conversations", {
        token: owner,
      });
      assert.equal(ownerInbox.status, 200);
      assert.ok(ownerInbox.data.conversations.length >= 2);
    } finally {
      server.close();
    }
  });

  test("inbox loads inbound/outbound messages and allows a 24h test reply only", async () => {
    const { server, url } = await listen(createPreviewHandler());
    try {
      const token = await login(url, INVISTIMO_EMAIL, INVISTIMO_PREVIEW_PASSWORD);
      const first = await request(url, "/api/whatsapp/conversations/972501111222", {
        token,
      });
      assert.equal(first.status, 200);
      assert.equal(first.data.messages.length, 2);
      assert.equal(first.data.messages[0].direction, "outbound");
      assert.equal(first.data.messages[1].direction, "inbound");
      assert.equal(first.data.messages[1].status, "received");

      const files = await request(url, "/api/whatsapp/conversations/972502222333", {
        token,
      });
      assert.equal(files.status, 200);
      assert.ok(files.data.messages.some((row) => row.messageType === "document"));
      assert.ok(files.data.messages.some((row) => row.messageType === "image"));

      const reply = await request(
        url,
        "/api/whatsapp/conversations/972501111222/reply",
        { method: "POST", token, body: { body: "תודה, נרשם. Preview only." } }
      );
      assert.equal(reply.status, 200);
      assert.equal(reply.data.liveDispatch, false);
      assert.equal(reply.data.sessionOpen, true);
      assert.ok(reply.data.providerMessageId);

      const after = await request(url, "/api/whatsapp/conversations/972501111222", {
        token,
      });
      assert.equal(after.data.messages.length, 3);

      const closed = await request(
        url,
        "/api/whatsapp/conversations/972503333444/reply",
        { method: "POST", token, body: { body: "too late" } }
      );
      assert.equal(closed.status, 400);
      assert.equal(closed.data.code, "SESSION_CLOSED");
    } finally {
      server.close();
    }
  });
});
