import { describe, expect, it } from "vitest";
import { resolvePushToggleCopy } from "./pushToggleState";

describe("resolvePushToggleCopy", () => {
  it("turns ON when local subscription and server registration agree", () => {
    const copy = resolvePushToggleCopy({
      pushOn: true,
      serverReady: true,
      thisDeviceRegistered: true,
      permission: "granted",
      subscribed: true,
      deviceCount: 2,
    });
    expect(copy.kind).toBe("on-ready");
    expect(copy.text).toContain("מופעל");
  });

  it("does not show off-copy when a live local subscription exists", () => {
    const copy = resolvePushToggleCopy({
      pushOn: true,
      serverReady: true,
      thisDeviceRegistered: true,
      permission: "granted",
      subscribed: true,
      deviceCount: 2,
    });
    expect(copy.text).not.toContain("כבוי");
  });

  it("asks to re-register when permission is granted but no local subscription", () => {
    const copy = resolvePushToggleCopy({
      pushOn: false,
      serverReady: true,
      thisDeviceRegistered: false,
      permission: "granted",
      subscribed: false,
      deviceCount: 2,
    });
    expect(copy.kind).toBe("need-rebind");
    expect(copy.text).toContain("רישום מחדש");
  });

  it("shows blocked copy when the browser denied notifications", () => {
    const copy = resolvePushToggleCopy({
      pushOn: false,
      serverReady: false,
      thisDeviceRegistered: false,
      permission: "denied",
      subscribed: false,
      deviceCount: 0,
    });
    expect(copy.kind).toBe("blocked");
    expect(copy.text).toContain("חסום");
  });
  it("shows installed-device copy when this browser has no Push API but the server has devices", () => {
    const copy = resolvePushToggleCopy({
      pushOn: true,
      serverReady: true,
      thisDeviceRegistered: false,
      permission: "unsupported",
      subscribed: false,
      deviceCount: 2,
      ios: true,
    });
    expect(copy.kind).toBe("on-other-context");
    expect(copy.text).toContain("פעיל במכשיר מותקן");
  });

  it("does not ask to tap enable when Push API is missing and no devices exist", () => {
    const copy = resolvePushToggleCopy({
      pushOn: false,
      serverReady: false,
      thisDeviceRegistered: false,
      permission: "unsupported",
      subscribed: false,
      deviceCount: 0,
      ios: true,
    });
    expect(copy.kind).toBe("unsupported");
    expect(copy.text).not.toContain("כבוי");
  });
});
