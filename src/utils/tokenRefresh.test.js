import { describe, it, expect, beforeEach } from "vitest";
import {
  abortAuthRefreshPipeline,
  isAccessTokenExpired,
  isBillingReturnSearch,
  isHardRefreshFailure,
  shouldAttemptRefresh,
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

describe("billing return refresh gate", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("detects portal/plugin billing return query params", () => {
    expect(isBillingReturnSearch("?portalBilling=success&section=plugins")).toBe(
      true
    );
    expect(isBillingReturnSearch("?pluginBilling=cancel")).toBe(true);
    expect(isBillingReturnSearch("?section=plugins")).toBe(false);
    expect(isBillingReturnSearch("?paid=1")).toBe(true);
    expect(isBillingReturnSearch("?canceled=1")).toBe(true);
    expect(isBillingReturnSearch("?paid=0")).toBe(false);
  });

  it("allows refresh attempt on Stripe return without local token", () => {
    window.history.replaceState(
      {},
      "",
      "/business/x/dashboard/website/sites/y/manage?section=plugins&portalBilling=success"
    );
    expect(shouldAttemptRefresh()).toBe(true);
  });

  it("does not refresh for anonymous visits", () => {
    window.history.replaceState({}, "", "/login");
    expect(shouldAttemptRefresh()).toBe(false);
  });

  it("allows refresh on Partner deal Stripe return without local token", () => {
    window.history.replaceState(
      {},
      "",
      "/partner/dashboard/deals/64a000000000000000000001?paid=1"
    );
    expect(shouldAttemptRefresh()).toBe(true);
  });

  it("retries refresh on Stripe return even if this tab was marked dead", () => {
    sessionStorage.setItem("bizuply:refreshDead", "1");
    window.history.replaceState(
      {},
      "",
      "/partner/dashboard/deals/64a000000000000000000001?paid=1"
    );
    expect(shouldAttemptRefresh()).toBe(true);
    window.history.replaceState({}, "", "/partner/dashboard");
    expect(shouldAttemptRefresh()).toBe(false);
  });
});
