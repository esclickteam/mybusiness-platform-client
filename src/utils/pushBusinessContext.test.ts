import { afterEach, describe, expect, it } from "vitest";
import {
  canUseBusinessPushContext,
  readStoredPushAuthUser,
} from "./pushBusinessContext";

describe("canUseBusinessPushContext", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("rejects null / empty users", () => {
    expect(canUseBusinessPushContext(null)).toBe(false);
    expect(canUseBusinessPushContext(undefined)).toBe(false);
    expect(canUseBusinessPushContext({})).toBe(false);
  });

  it("allows admins without businessId", () => {
    expect(canUseBusinessPushContext({ role: "admin" })).toBe(true);
  });

  it("allows business users only with businessId", () => {
    expect(canUseBusinessPushContext({ role: "business" })).toBe(false);
    expect(
      canUseBusinessPushContext({
        role: "business",
        businessId: "64f000000000000000000001",
      })
    ).toBe(true);
  });

  it("blocks pure Partner sessions without a managed tenant", () => {
    expect(
      canUseBusinessPushContext({
        role: "partner",
        email: "partner-free-demo@bizuply.test",
      } as { role: string })
    ).toBe(false);
    expect(canUseBusinessPushContext({ role: "partner" })).toBe(false);
  });

  it("allows Partner only while managing a client business", () => {
    expect(
      canUseBusinessPushContext({
        role: "partner",
        managedBusinessId: "64f000000000000000000099",
      })
    ).toBe(true);
    expect(
      canUseBusinessPushContext({
        role: "partner",
        businessId: "64f000000000000000000099",
      })
    ).toBe(true);
  });

  it("reads the stored auth user from businessDetails", () => {
    localStorage.setItem(
      "businessDetails",
      JSON.stringify({ role: "partner" })
    );
    expect(readStoredPushAuthUser()?.role).toBe("partner");
    expect(canUseBusinessPushContext(readStoredPushAuthUser())).toBe(false);
  });
});
