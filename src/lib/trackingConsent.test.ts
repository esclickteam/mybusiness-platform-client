import { afterEach, describe, expect, it, vi } from "vitest";
import { clearTrackingChoice, marketingAllowed, readTrackingChoice, writeTrackingChoice } from "./trackingConsent";

describe("tracking consent", () => {
  it("keeps marketing measurement off until the visitor allows it", () => {
    expect(readTrackingChoice("")).toBe("unknown");
    expect(marketingAllowed("bizuply_lang=he")).toBe(false);
    expect(marketingAllowed("bizuply_tracking=essential")).toBe(false);
    expect(marketingAllowed("bizuply_lang=he; bizuply_tracking=all")).toBe(true);
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
});

afterEach(() => {
  vi.unstubAllGlobals();
});
