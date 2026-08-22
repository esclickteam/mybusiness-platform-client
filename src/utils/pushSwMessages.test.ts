import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import {
  SW_SCRIPT_VERSION,
  SW_URL,
  isCurrentSwScript,
  isLegacyGenericBanner,
  pickPushRegistrationIndex,
  shouldForceRebindOnSwMessage,
  shouldShowWebPushBanner,
} from "./pushSwMessages";

describe("push SW message handling", () => {
  it("does not unsubscribe/rebind when a new SW activates", () => {
    expect(shouldForceRebindOnSwMessage("SW_ACTIVATED")).toBe(false);
    expect(shouldForceRebindOnSwMessage("PUSH_SUBSCRIPTION_NEEDED")).toBe(false);
  });

  it("rebinds only after the browser reports endpoint rotation", () => {
    expect(shouldForceRebindOnSwMessage("PUSH_SUBSCRIPTION_CHANGED")).toBe(true);
  });

  it("cache-busts the service worker script", () => {
    expect(SW_SCRIPT_VERSION).toBe(11);
    expect(SW_URL).toBe("/service-worker.js?v=11");
  });

  it("picks the registration that already has a push subscription", () => {
    const origin = "https://bizuply.com";
    expect(
      pickPushRegistrationIndex(
        [
          { scriptURLs: [`${origin}/service-worker.js`], hasSubscription: false },
          { scriptURLs: [`${origin}/service-worker.js?v=11`], hasSubscription: true },
        ],
        origin
      )
    ).toBe(1);
    expect(
      pickPushRegistrationIndex(
        [
          { scriptURLs: [`${origin}/service-worker.js`], hasSubscription: true },
          { scriptURLs: [`${origin}/service-worker.js?v=11`], hasSubscription: false },
        ],
        origin
      )
    ).toBe(0);
  });

  it("treats only the current query-busted SW URL as the live registration", () => {
    expect(
      isCurrentSwScript("https://bizuply.com/service-worker.js?v=11", "https://bizuply.com")
    ).toBe(true);
    expect(
      isCurrentSwScript("https://bizuply.com/service-worker.js", "https://bizuply.com")
    ).toBe(false);
    expect(
      isCurrentSwScript("https://bizuply.com/service-worker.js?v=9", "https://bizuply.com")
    ).toBe(false);
  });

  it("does not show a generic banner when title/body are missing", () => {
    expect(shouldShowWebPushBanner({ title: "", body: "יש לך התראה חדשה" })).toBe(false);
    expect(shouldShowWebPushBanner({ title: "BizUply", body: "" })).toBe(false);
    expect(
      shouldShowWebPushBanner({
        title: "BizUply · ליד חדש",
        body: "ליד חדש נכנס למערכת",
      })
    ).toBe(true);
  });

  it("recognizes the legacy generic iOS banner", () => {
    expect(
      isLegacyGenericBanner({
        title: "BizUply",
        body: "יש לך התראה חדשה",
        tag: "bizuply-notification",
      })
    ).toBe(true);
    expect(
      isLegacyGenericBanner({
        title: "BizUply · ליד חדש",
        body: "ליד חדש נכנס למערכת",
        tag: "bizuply-lead-1",
      })
    ).toBe(false);
  });

  it("does not paint the generic Hebrew fallback from empty payloads", () => {
    const sw = readFileSync(join(process.cwd(), "public/service-worker.js"), "utf8");
    expect(sw).toContain("bizuply-sw-delivery-ack-v11");
    expect(sw).toContain("if (!title || !body)");
    expect(sw).not.toMatch(/body:\s*payload\.body\s*\|\|\s*"/);
    expect(sw).not.toMatch(/data\.body\s*\|\|\s*"/);
  });
});
