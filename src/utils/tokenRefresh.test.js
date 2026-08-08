import { describe, it, expect } from "vitest";
import {
  abortAuthRefreshPipeline,
  isAccessTokenExpired,
  isHardRefreshFailure,
} from "./tokenRefresh";

function makeToken(expInSeconds) {
  const payload = { exp: expInSeconds };
  const base64 = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${base64({ alg: "HS256" })}.${base64(payload)}.signature`;
}

describe("isAccessTokenExpired", () => {
  it("returns true when there is no token", () => {
    expect(isAccessTokenExpired(null)).toBe(true);
    expect(isAccessTokenExpired(undefined)).toBe(true);
  });

  it("returns true for an already-expired token", () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60;
    expect(isAccessTokenExpired(makeToken(pastExp))).toBe(true);
  });

  it("returns false for a token that is still valid", () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    expect(isAccessTokenExpired(makeToken(futureExp))).toBe(false);
  });

  it("returns true for a malformed token", () => {
    expect(isAccessTokenExpired("not-a-real-token")).toBe(true);
  });
});

describe("session-invalid hard refresh failures", () => {
  it("treats SESSION_REVOKED and AUTH_VERSION_MISMATCH as hard failures", () => {
    expect(isHardRefreshFailure({ code: "SESSION_REVOKED" })).toBe(true);
    expect(isHardRefreshFailure({ code: "AUTH_VERSION_MISMATCH" })).toBe(true);
    expect(
      isHardRefreshFailure({ response: { data: { code: "TOKEN_EXPIRED" } } })
    ).toBe(false);
  });

  it("abortAuthRefreshPipeline clears the access token", () => {
    localStorage.setItem("token", "abc");
    abortAuthRefreshPipeline();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
