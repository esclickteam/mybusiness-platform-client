import type { TFunction } from "i18next";
import i18n from "../i18n/i18n";
import type { PushPermission } from "./push";

export type PushToggleCopyKind =
  | "on-ready"
  | "on-unbound"
  | "on-other-context"
  | "need-rebind"
  | "blocked"
  | "unsupported"
  | "off";

function translate(
  key: string,
  fallback: string,
  vars?: Record<string, string | number>,
  t?: TFunction
) {
  const options = { defaultValue: fallback, ...vars };
  return t ? t(key, options) : i18n.t(key, options);
}

export function resolvePushToggleCopy(input: {
  pushOn: boolean;
  serverReady: boolean;
  thisDeviceRegistered?: boolean | null;
  permission: PushPermission;
  subscribed: boolean;
  deviceCount: number;
  ios?: boolean;
  t?: TFunction;
}): { kind: PushToggleCopyKind; text: string } {
  const t = input.t;
  if (input.permission === "denied") {
    return {
      kind: "blocked",
      text: translate(
        "leftover.pushToggle.blocked",
        "Blocked in browser / device settings",
        undefined,
        t
      ),
    };
  }

  if (input.permission === "unsupported") {
    if (input.pushOn || input.deviceCount > 0) {
      return {
        kind: "on-other-context",
        text: translate(
          "leftover.pushToggle.onOther",
          "Active on an installed device · {{count}} registered device",
          { count: input.deviceCount },
          t
        ),
      };
    }
    return {
      kind: "unsupported",
      text: input.ios
        ? translate(
            "leftover.pushToggle.unsupportedIos",
            "Cannot enable from here — open Safari from the home-screen icon",
            undefined,
            t
          )
        : translate(
            "leftover.pushToggle.unsupported",
            "This browser does not support Push",
            undefined,
            t
          ),
    };
  }

  if (input.pushOn) {
    const bound =
      input.thisDeviceRegistered === true ||
      (input.thisDeviceRegistered !== false && input.serverReady);
    if (bound) {
      return {
        kind: "on-ready",
        text: translate(
          "leftover.pushToggle.onReady",
          "On · {{count}} registered device",
          { count: input.deviceCount },
          t
        ),
      };
    }
    return {
      kind: "on-unbound",
      text: translate(
        "leftover.pushToggle.onUnbound",
        "On on this device, but not registered on the server yet — tap Test",
        undefined,
        t
      ),
    };
  }

  if (input.permission === "granted" && !input.subscribed) {
    return {
      kind: "need-rebind",
      text: translate(
        "leftover.pushToggle.needRebind",
        "Permission is granted, but this device is not registered — tap to re-register",
        undefined,
        t
      ),
    };
  }

  return {
    kind: "off",
    text: translate(
      "leftover.pushToggle.off",
      "Off — tap to enable phone notifications",
      undefined,
      t
    ),
  };
}
