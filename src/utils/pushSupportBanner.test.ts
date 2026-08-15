import { describe, expect, it } from "vitest";
import {
  isPushOnFromServerOnly,
  resolvePushSupportBanner,
} from "./pushSupportBanner";

describe("resolvePushSupportBanner", () => {
  it("does not tell iPhone users to try Chrome", () => {
    const banner = resolvePushSupportBanner({
      supported: false,
      ios: true,
      standalone: false,
      deviceCount: 2,
    });
    expect(banner?.kind).toBe("ios-webview");
    expect(banner?.text).toContain("Safari");
    expect(banner?.text).not.toMatch(/נסה\/?י Chrome/);
    expect(banner?.text).toContain("ההתראות כבר פעילות");
  });

  it("keeps the generic browser hint off iOS", () => {
    const banner = resolvePushSupportBanner({
      supported: false,
      ios: false,
      standalone: false,
      deviceCount: 0,
    });
    expect(banner?.kind).toBe("unsupported");
    expect(banner?.text).toContain("Chrome");
  });
});

describe("isPushOnFromServerOnly", () => {
  it("reconciles ON from server devices when this browser cannot see PushManager", () => {
    expect(
      isPushOnFromServerOnly({
        supported: false,
        master: true,
        entitled: true,
        deviceCount: 2,
      })
    ).toBe(true);
  });

  it("does not invent an ON state when the account has no devices", () => {
    expect(
      isPushOnFromServerOnly({
        supported: false,
        master: true,
        entitled: true,
        deviceCount: 0,
      })
    ).toBe(false);
  });
});
