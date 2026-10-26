import { describe, test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  createPreviewHandler,
  INVISTIMO_EMAIL,
  INVISTIMO_PREVIEW_PASSWORD,
  OTHER_EMAIL,
  OTHER_PREVIEW_PASSWORD,
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
});
