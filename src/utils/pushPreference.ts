import API from "@api";
import type { PushPermission } from "./push";

export const PUSH_PREF_TOGGLE_SOURCE = "user-toggle";

export type PushPreferenceSettings = {
  master?: boolean;
  pushEnabled?: boolean;
  appointment?: boolean;
  collaboration?: boolean;
  review?: boolean;
  message?: boolean;
  lead?: boolean;
  task?: boolean;
};

type CachedPreference = {
  enabled: boolean;
  fetchedAt: number;
};

const CACHE_MS = 30_000;
let cached: CachedPreference | null = null;

/**
 * Business Push preference. Missing values default to ON (opt-out).
 * `pushEnabled` is an alias of `master`.
 */
export function isPushEnabledPreference(
  settings: PushPreferenceSettings | null | undefined
): boolean {
  if (!settings) return true;
  if (settings.pushEnabled === false || settings.master === false) return false;
  return true;
}

/** The settings toggle follows the business preference, never device state. */
export function resolvePushToggleChecked(input: {
  pushEnabled: boolean;
  entitled: boolean;
}): boolean {
  return Boolean(input.pushEnabled && input.entitled);
}

export function shouldRecoverDeviceSubscription(input: {
  pushEnabled: boolean;
  entitled?: boolean;
  permission: PushPermission;
  supported?: boolean;
}): boolean {
  if (input.supported === false) return false;
  if (input.entitled === false) return false;
  return input.pushEnabled && input.permission === "granted";
}

export function rememberPushEnabledPreference(enabled: boolean): void {
  cached = { enabled: Boolean(enabled), fetchedAt: Date.now() };
}

export function clearPushEnabledPreferenceCache(): void {
  cached = null;
}

export function peekPushEnabledPreference(): boolean | null {
  return cached ? cached.enabled : null;
}

export async function getPushEnabledPreference(): Promise<boolean> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return cached.enabled;
  }

  try {
    const res = await API.get("/business/my/notification-settings");
    const enabled = isPushEnabledPreference(res.data?.settings);
    rememberPushEnabledPreference(enabled);
    return enabled;
  } catch {
    return cached?.enabled ?? true;
  }
}

export function buildNotificationSettingsWrite(input: {
  settings: PushPreferenceSettings;
  includeMaster?: boolean;
}): {
  settings: PushPreferenceSettings;
  source?: typeof PUSH_PREF_TOGGLE_SOURCE;
} {
  const { master, pushEnabled, ...categories } = input.settings;

  if (!input.includeMaster) {
    return { settings: categories };
  }

  const enabled = isPushEnabledPreference({ master, pushEnabled });
  return {
    settings: {
      ...input.settings,
      master: enabled,
      pushEnabled: enabled,
    },
    source: PUSH_PREF_TOGGLE_SOURCE,
  };
}

export async function persistPushEnabledPreference(
  enabled: boolean,
  current: PushPreferenceSettings
): Promise<PushPreferenceSettings | null> {
  rememberPushEnabledPreference(enabled);
  const payload = buildNotificationSettingsWrite({
    settings: { ...current, master: enabled, pushEnabled: enabled },
    includeMaster: true,
  });
  const res = await API.put("/business/my/notification-settings", payload);
  if (res.data?.ok && res.data.settings) {
    const nextEnabled = isPushEnabledPreference(res.data.settings);
    rememberPushEnabledPreference(nextEnabled);
    return res.data.settings;
  }
  return null;
}
