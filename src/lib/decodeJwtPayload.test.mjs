import test from "node:test";
import assert from "node:assert/strict";

function decodeJwtPayload(token) {
  const part = String(token || "").split(".")[1];
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = Buffer.from(padded, "base64").toString("binary");
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return JSON.parse(new TextDecoder("utf-8").decode(bytes));
}

test("UTF-8 JWT payload keeps Hebrew business names", () => {
  const payload = Buffer.from(
    JSON.stringify({
      role: "partner",
      managedBusinessName: "סטודיו נועה",
      partnerName: "BizUply Partner Demo",
    }),
    "utf8"
  ).toString("base64url");
  const token = `hdr.${payload}.sig`;
  const decoded = decodeJwtPayload(token);
  assert.equal(decoded.role, "partner");
  assert.equal(decoded.managedBusinessName, "סטודיו נועה");
  assert.equal(decoded.partnerName, "BizUply Partner Demo");
});
