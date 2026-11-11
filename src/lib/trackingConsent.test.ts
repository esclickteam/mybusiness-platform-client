import { afterEach, describe, expect, it, vi } from "vitest";
import { analyticsAllowed, clearTrackingChoice, marketingAllowed, readConsent, readTrackingChoice, writeAdvertisementConsent, writeTrackingChoice } from "./trackingConsent";

describe("tracking consent", () => {
  it("keeps marketing measurement off until the visitor allows it", () => {
    expect(readTrackingChoice("")).toBe("unknown");
    expect(marketingAllowed("bizuply_lang=he")).toBe(false);
    expect(marketingAllowed("bizuply_tracking=essential")).toBe(false);
    expect(marketingAllowed("bizuply_lang=he; bizuply_tracking=all")).toBe(true);
    expect(readTrackingChoice("bizuply_tracking=essential; bizuply_tracking=all")).toBe("all");
    expect(readTrackingChoice("bizuply_tracking=all; bizuply_tracking=essential")).toBe("essential");
  });

  it("keeps a choice across a later read and can clear it", () => {
    let jar = "";
    const reloads: string[] = [];
    vi.stubGlobal("document", {
      get cookie() {
        return jar;
      },
      set cookie(value: string) {
        const pair = value.split(";")[0];
        const name = pair.split("=")[0].trim();
        const parts = jar.split("; ").filter((part) => part && !part.startsWith(`${name}=`));
        if (!/Max-Age=0/i.test(value)) parts.push(pair.trim());
        jar = parts.join("; ");
      },
    });
    vi.stubGlobal("window", {
      location: { hostname: "bizuply.com", reload: () => reloads.push("reload") },
      dispatchEvent: () => true,
    });

    writeTrackingChoice("essential");
    expect(readTrackingChoice()).toBe("essential");
    expect(marketingAllowed()).toBe(false);
    expect(reloads).toEqual([]);

    writeTrackingChoice("all");
    expect(readTrackingChoice()).toBe("all");
    expect(marketingAllowed()).toBe(true);

    clearTrackingChoice();
    expect(readTrackingChoice()).toBe("unknown");
    expect(marketingAllowed()).toBe(false);
  });

  it("revokes measurement immediately so a later pixel event is not sent", () => {
    let jar = "";
    const calls: unknown[][] = [];
    const reloads: string[] = [];
    function fbq(...args: unknown[]) {
      calls.push(args);
    }
    vi.stubGlobal("document", {
      get cookie() {
        return jar;
      },
      set cookie(value: string) {
        const pair = value.split(";")[0];
        const name = pair.split("=")[0].trim();
        const parts = jar.split("; ").filter((part) => part && !part.startsWith(`${name}=`));
        if (!/Max-Age=0/i.test(value)) parts.push(pair.trim());
        jar = parts.join("; ");
      },
    });
    vi.stubGlobal("window", {
      location: { hostname: "bizuply.com", reload: () => reloads.push("reload") },
      dispatchEvent: () => true,
      fbq,
    });

    writeTrackingChoice("essential");
    expect(calls).toEqual([["consent", "revoke"]]);
    window.fbq("track", "PageView");
    expect(calls).toEqual([["consent", "revoke"]]);
    expect(reloads).toEqual([]);
    expect(marketingAllowed()).toBe(false);
  });

  it("keeps a saved all choice as advertising only and never invents analytics", () => {
    const legacy = readConsent("bizuply_tracking=all");
    expect(legacy.advertisement).toBe(true);
    expect(legacy.analytics).toBe(false);
    expect(legacy.functionality).toBe(false);
    expect(analyticsAllowed()).toBe(false);

    const refused = readConsent("bizuply_tracking=essential");
    expect(refused.advertisement).toBe(false);
    expect(refused.decided).toBe(true);

    let jar = "";
    vi.stubGlobal("document", {
      get cookie() {
        return jar;
      },
      set cookie(value: string) {
        const pair = value.split(";")[0];
        const name = pair.split("=")[0].trim();
        const parts = jar.split("; ").filter((part) => part && !part.startsWith(`${name}=`));
        if (!/Max-Age=0/i.test(value)) parts.push(pair.trim());
        jar = parts.join("; ");
      },
    });
    vi.stubGlobal("window", { location: { hostname: "localhost" }, dispatchEvent: () => true });
    expect(writeAdvertisementConsent(true)).toBe(true);
    expect(jar).toContain("bizuply_tracking=v2:ad:2026-11-07");
    expect(readConsent().analytics).toBe(false);
    expect(writeAdvertisementConsent(false)).toBe(true);
    expect(jar).toContain("bizuply_tracking=v2:none:2026-11-07");
    expect(marketingAllowed()).toBe(false);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
