import { afterEach, describe, expect, it } from "vitest";
import {
  PUSH_PREF_TOGGLE_SOURCE,
  buildNotificationSettingsWrite,
  clearPushEnabledPreferenceCache,
  isPushEnabledPreference,
  rememberPushEnabledPreference,
  resolvePushToggleChecked,
  shouldRecoverDeviceSubscription,
} from "./pushPreference";
import { resolvePushToggleCopy } from "./pushToggleState";
import { shouldForceRebindOnSwMessage } from "./pushSwMessages";

type PrefStore = {
  master: boolean;
  writes: Array<{ master?: boolean; source?: string; event: string }>;
};

type DeviceStore = {
  subscribed: boolean;
  permission: "granted" | "denied" | "default" | "unsupported";
};

function applyLifecycle(
  pref: PrefStore,
  device: DeviceStore,
  event:
    | "refresh"
    | "logout-login"
    | "pwa-reopen"
    | "sw-update"
    | "subscription-expired"
    | "endpoint-upsert"
    | "user-toggle-off"
    | "user-toggle-on"
) {
  if (event === "user-toggle-off") {
    const payload = buildNotificationSettingsWrite({
      settings: { master: false },
      includeMaster: true,
    });
    pref.master = isPushEnabledPreference(payload.settings);
    pref.writes.push({
      master: payload.settings.master,
      source: payload.source,
      event,
    });
    device.subscribed = false;
    rememberPushEnabledPreference(pref.master);
    return;
  }

  if (event === "user-toggle-on") {
    const payload = buildNotificationSettingsWrite({
      settings: { master: true },
      includeMaster: true,
    });
    pref.master = isPushEnabledPreference(payload.settings);
    pref.writes.push({
      master: payload.settings.master,
      source: payload.source,
      event,
    });
    if (device.permission === "granted") device.subscribed = true;
    rememberPushEnabledPreference(pref.master);
    return;
  }

  if (event === "subscription-expired") {
    device.subscribed = false;
    rememberPushEnabledPreference(pref.master);
    return;
  }

  if (event === "sw-update") {
    expect(shouldForceRebindOnSwMessage("SW_ACTIVATED")).toBe(false);
    expect(shouldForceRebindOnSwMessage("PUSH_SUBSCRIPTION_CHANGED")).toBe(true);
  }

  if (event === "logout-login") {
    clearPushEnabledPreferenceCache();
    rememberPushEnabledPreference(pref.master);
  }

  if (
    shouldRecoverDeviceSubscription({
      pushEnabled: pref.master,
      entitled: true,
      permission: device.permission,
      supported: device.permission !== "unsupported",
    })
  ) {
    device.subscribed = true;
  }

  rememberPushEnabledPreference(pref.master);
}

function snapshot(pref: PrefStore, device: DeviceStore) {
  const pushOn = resolvePushToggleChecked({
    pushEnabled: pref.master,
    entitled: true,
  });
  const copy = resolvePushToggleCopy({
    pushOn,
    serverReady: device.subscribed,
    thisDeviceRegistered: device.subscribed,
    permission: device.permission,
    subscribed: device.subscribed,
    deviceCount: device.subscribed ? 1 : 0,
  });
  return { pushOn, copy, master: pref.master };
}

describe("Push preference E2E lifecycle", () => {
  afterEach(() => {
    clearPushEnabledPreferenceCache();
  });

  it("keeps the master toggle ON after refresh, logout/login, PWA reopen, SW update, and recovery", () => {
    const pref: PrefStore = { master: true, writes: [] };
    const device: DeviceStore = { subscribed: true, permission: "granted" };
    rememberPushEnabledPreference(true);

    const events = [
      "refresh",
      "logout-login",
      "pwa-reopen",
      "sw-update",
      "subscription-expired",
      "endpoint-upsert",
    ] as const;

    for (const event of events) {
      if (event === "subscription-expired") {
        applyLifecycle(pref, device, event);
        expect(device.subscribed).toBe(false);
        const beforeRecover = snapshot(pref, device);
        expect(beforeRecover.pushOn).toBe(true);
        expect(beforeRecover.copy.text).not.toContain("כבוי");
      }

      applyLifecycle(pref, device, event);
      const state = snapshot(pref, device);
      expect(state.master).toBe(true);
      expect(state.pushOn).toBe(true);
      expect(state.copy.text).not.toContain("כבוי");
    }

    expect(pref.writes).toEqual([]);
    expect(device.subscribed).toBe(true);
  });

  it("turns the preference OFF only after an explicit user toggle", () => {
    const pref: PrefStore = { master: true, writes: [] };
    const device: DeviceStore = { subscribed: true, permission: "granted" };

    applyLifecycle(pref, device, "refresh");
    applyLifecycle(pref, device, "user-toggle-off");

    expect(pref.master).toBe(false);
    expect(pref.writes).toEqual([
      {
        master: false,
        source: PUSH_PREF_TOGGLE_SOURCE,
        event: "user-toggle-off",
      },
    ]);
    expect(snapshot(pref, device).pushOn).toBe(false);

    applyLifecycle(pref, device, "refresh");
    applyLifecycle(pref, device, "logout-login");
    applyLifecycle(pref, device, "sw-update");
    expect(pref.master).toBe(false);
    expect(device.subscribed).toBe(false);
    expect(pref.writes).toHaveLength(1);
  });
});
