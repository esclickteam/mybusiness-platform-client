import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PUSH_PREF_TOGGLE_SOURCE,
  buildNotificationSettingsWrite,
  clearPushEnabledPreferenceCache,
  isPushEnabledPreference,
  peekPushEnabledPreference,
  rememberPushEnabledPreference,
  resolvePushToggleChecked,
  shouldRecoverDeviceSubscription,
} from "./pushPreference";

describe("push preference source of truth", () => {
  afterEach(() => {
    clearPushEnabledPreferenceCache();
  });

  it("defaults missing preference to ON", () => {
    expect(isPushEnabledPreference(undefined)).toBe(true);
    expect(isPushEnabledPreference({})).toBe(true);
  });

  it("treats master and pushEnabled aliases as the same field", () => {
    expect(isPushEnabledPreference({ master: false })).toBe(false);
    expect(isPushEnabledPreference({ pushEnabled: false })).toBe(false);
    expect(isPushEnabledPreference({ master: true, pushEnabled: false })).toBe(
      false
    );
  });

  it("keeps the toggle ON from preference even without a device subscription", () => {
    expect(
      resolvePushToggleChecked({ pushEnabled: true, entitled: true })
    ).toBe(true);
    expect(
      resolvePushToggleChecked({ pushEnabled: false, entitled: true })
    ).toBe(false);
  });

  it("recovers a device only when preference is ON and permission is granted", () => {
    expect(
      shouldRecoverDeviceSubscription({
        pushEnabled: true,
        entitled: true,
        permission: "granted",
        supported: true,
      })
    ).toBe(true);
    expect(
      shouldRecoverDeviceSubscription({
        pushEnabled: false,
        entitled: true,
        permission: "granted",
        supported: true,
      })
    ).toBe(false);
    expect(
      shouldRecoverDeviceSubscription({
        pushEnabled: true,
        entitled: true,
        permission: "denied",
        supported: true,
      })
    ).toBe(false);
  });

  it("omits master from category writes so they cannot flip Push off", () => {
    const payload = buildNotificationSettingsWrite({
      settings: {
        master: false,
        pushEnabled: false,
        appointment: true,
        lead: false,
      },
    });
    expect(payload.settings.master).toBeUndefined();
    expect(payload.settings.pushEnabled).toBeUndefined();
    expect(payload.source).toBeUndefined();
    expect(payload.settings.lead).toBe(false);
  });

  it("allows master=false only on an explicit user-toggle write", () => {
    const payload = buildNotificationSettingsWrite({
      settings: { master: false, appointment: true },
      includeMaster: true,
    });
    expect(payload.source).toBe(PUSH_PREF_TOGGLE_SOURCE);
    expect(payload.settings.master).toBe(false);
    expect(payload.settings.pushEnabled).toBe(false);
  });

  it("does not treat cache writes from device recovery as preference changes", () => {
    rememberPushEnabledPreference(true);
    expect(peekPushEnabledPreference()).toBe(true);
    rememberPushEnabledPreference(true);
    expect(peekPushEnabledPreference()).toBe(true);
  });
});
