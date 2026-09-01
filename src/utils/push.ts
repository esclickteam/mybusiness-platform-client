import API from "@api";
import {
  SW_SCOPE,
  SW_URL,
  isCurrentSwScript,
  pickPushRegistrationIndex,
  shouldForceRebindOnSwMessage,
} from "./pushSwMessages";

export { SW_SCRIPT_VERSION, SW_URL, shouldForceRebindOnSwMessage } from "./pushSwMessages";

const PUSH_DEVICE_ID_KEY = "bizuply-push-device-id";

function registrationScriptURLs(reg: ServiceWorkerRegistration): string[] {
  return [reg.active, reg.waiting, reg.installing]
    .filter(Boolean)
    .map((worker) => (worker as ServiceWorker).scriptURL);
}

async function listPushRegistrations(): Promise<ServiceWorkerRegistration[]> {
  if (!("serviceWorker" in navigator)) return [];
  if ("getRegistrations" in navigator.serviceWorker) {
    return navigator.serviceWorker.getRegistrations();
  }
  const one =
    (await navigator.serviceWorker.getRegistration(SW_SCOPE)) ||
    (await navigator.serviceWorker.getRegistration()) ||
    null;
  return one ? [one] : [];
}

async function getPushRegistration(): Promise<ServiceWorkerRegistration | null> {
  const regs = await listPushRegistrations();
  if (!regs.length) return null;

  const origin = window.location.origin;
  const snapshots = [];
  for (const reg of regs) {
    const sub = await reg.pushManager.getSubscription().catch(() => null);
    snapshots.push({
      scriptURLs: registrationScriptURLs(reg),
      hasSubscription: Boolean(sub),
    });
  }

  const index = pickPushRegistrationIndex(snapshots, origin);
  return index >= 0 ? regs[index] : null;
}

export function getPushDeviceId(): string {
  if (typeof window === "undefined" || !window.localStorage) {
    return "";
  }
  try {
    const existing = window.localStorage.getItem(PUSH_DEVICE_ID_KEY);
    if (existing && existing.trim()) return existing.trim();
    const created =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(PUSH_DEVICE_ID_KEY, created);
    return created;
  } catch {
    return "";
  }
}

export type PushPermission =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPermission(): PushPermission {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission as PushPermission;
}

/**
 * Detects whether the app is running as an installed PWA (standalone).
 * Needed for iOS, where Web Push only works from an installed PWA.
 */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  return /macintosh/i.test(ua) && Number(navigator.maxTouchPoints || 0) > 1;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }

  return output;
}

async function unregisterExtraServiceWorkers(
  keep: ServiceWorkerRegistration
): Promise<void> {
  if (!("getRegistrations" in navigator.serviceWorker)) return;

  const origin = window.location.origin;
  const keepSub = await keep.pushManager.getSubscription().catch(() => null);
  const regs = await navigator.serviceWorker.getRegistrations();

  for (const other of regs) {
    const scripts = [other.active, other.waiting, other.installing]
      .filter(Boolean)
      .map((worker) => (worker as ServiceWorker).scriptURL);
    if (scripts.some((script) => isCurrentSwScript(script, origin))) continue;

    const otherSub = await other.pushManager.getSubscription().catch(() => null);
    // Never drop a live token just because a newer SW script has no
    // subscription yet. That is what made the settings toggle read OFF
    // while the phone still received push.
    if (otherSub && !keepSub) continue;
    if (keepSub && otherSub && otherSub.endpoint === keepSub.endpoint) continue;

    try {
      await other.unregister();
    } catch (err) {
      console.error("Extra service worker unregister failed:", err);
    }
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const reg = await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPE,
      updateViaCache: "none",
    });

    // Force check for a newer SW (important after deploy).
    try {
      await reg.update();
    } catch {
      /* ignore update errors */
    }

    // iOS can keep /service-worker.js and /service-worker.js?v=N as two
    // registrations. The stale one still paints the generic fallback banner.
    try {
      await unregisterExtraServiceWorkers(reg);
    } catch {
      /* ignore */
    }

    return reg;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const reg = await getPushRegistration();
  if (!reg) return null;
  return (await reg.pushManager.getSubscription().catch(() => null)) || null;
}

export async function isSubscribed(): Promise<boolean> {
  return Boolean(await getCurrentPushSubscription());
}

export type SubscribeResult = {
  ok: boolean;
  reason?:
    | "unsupported"
    | "denied"
    | "default"
    | "no-sw"
    | "no-key"
    | "ios-install"
    | "entitlement-required"
    | "preference-off"
    | "no-subscription"
    | "error";
  detail?: string;
  code?: string;
  status?: number;
};

async function createPushSubscription(
  reg: ServiceWorkerRegistration,
  key: string
): Promise<PushSubscription> {
  const applicationServerKey = urlBase64ToUint8Array(key);

  try {
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // BufferSource typing differs across TS/DOM libs.
      applicationServerKey: applicationServerKey as BufferSource,
    });
  } catch (err) {
    // Existing subscription may have been created with a different VAPID key.
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      await existing.unsubscribe().catch(() => undefined);
    }

    return reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource,
    });
  }
}

export async function subscribeToPush(
  options: { forceRebind?: boolean } = {}
): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };

  // iOS only delivers Web Push from an installed Home Screen PWA.
  if (isIos() && !isStandalone()) {
    return { ok: false, reason: "ios-install" };
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return { ok: false, reason: permission as "denied" | "default" };
    }

    const reg = await registerServiceWorker();
    if (!reg) return { ok: false, reason: "no-sw" };

    await navigator.serviceWorker.ready;

    const res = await API.get("/push/vapid-public-key");
    const key = res.data?.key;
    const enabled = res.data?.enabled !== false;

    if (!key || !enabled) return { ok: false, reason: "no-key" };

    if (options.forceRebind) {
      const existing = await getCurrentPushSubscription();
      if (existing) {
        await existing.unsubscribe().catch(() => undefined);
      }
    } else {
      const existing = await getCurrentPushSubscription();
      if (existing) {
        return saveExistingPushSubscription(existing);
      }
    }

    const subscription = await createPushSubscription(reg, key);
    return saveExistingPushSubscription(subscription);
  } catch (err) {
    console.error("subscribeToPush failed:", err);
    const anyErr = err as {
      status?: number;
      code?: string;
      message?: string;
      response?: { status?: number; data?: { code?: string; error?: string } };
    };
    const status = anyErr.response?.status ?? anyErr.status;
    const code = anyErr.response?.data?.code || anyErr.code;
    if (status === 402 || code === "PUSH_ENTITLEMENT_REQUIRED") {
      return {
        ok: false,
        reason: "entitlement-required",
        detail:
          anyErr.response?.data?.error ||
          anyErr.message ||
          "entitlement required",
        code:
          typeof code === "string" ? code : "PUSH_ENTITLEMENT_REQUIRED",
        status: 402,
      };
    }
    return {
      ok: false,
      reason: "error",
      detail: err instanceof Error ? err.message : "subscribe failed",
      code: typeof code === "string" ? code : undefined,
      status: typeof status === "number" ? status : undefined,
    };
  }
}

async function saveExistingPushSubscription(
  subscription: PushSubscription
): Promise<SubscribeResult> {
  const saveRes = await API.post("/push/subscribe", {
    subscription: subscription.toJSON(),
    deviceId: getPushDeviceId(),
  });

  if (!saveRes.data?.ok) {
    return {
      ok: false,
      reason: "error",
      detail: saveRes.data?.error || "subscribe save failed",
    };
  }

  return { ok: true };
}

/**
 * Re-save the current browser subscription to the server.
 * Does not create a new PushSubscription.
 */
export async function bindExistingPushSubscription(): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };
  if (Notification.permission !== "granted") {
    return {
      ok: false,
      reason: Notification.permission as "denied" | "default",
    };
  }

  const existing = await getCurrentPushSubscription();
  if (!existing) return { ok: false, reason: "no-subscription" };

  try {
    return await saveExistingPushSubscription(existing);
  } catch (err) {
    const anyErr = err as {
      status?: number;
      code?: string;
      message?: string;
      response?: { status?: number; data?: { code?: string; error?: string } };
    };
    const status = anyErr.response?.status ?? anyErr.status;
    const code = anyErr.response?.data?.code || anyErr.code;
    if (status === 402 || code === "PUSH_ENTITLEMENT_REQUIRED") {
      return {
        ok: false,
        reason: "entitlement-required",
        detail:
          anyErr.response?.data?.error ||
          anyErr.message ||
          "entitlement required",
        code: typeof code === "string" ? code : "PUSH_ENTITLEMENT_REQUIRED",
        status: 402,
      };
    }
    return {
      ok: false,
      reason: "error",
      detail: err instanceof Error ? err.message : "bind failed",
      code: typeof code === "string" ? code : undefined,
      status: typeof status === "number" ? status : undefined,
    };
  }
}

/**
 * If the user already granted notification permission, make sure the device
 * subscription is registered for the current business (no permission prompt).
 *
 * Recovery never writes the business preference. If pushEnabled/master is
 * false, this is a no-op so login/SW refresh cannot turn Push back on.
 */
export async function ensurePushSubscription(
  options: { forceRebind?: boolean; ignorePreference?: boolean } = {}
): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };
  if (Notification.permission !== "granted") {
    return { ok: false, reason: Notification.permission as "denied" | "default" };
  }

  if (isIos() && !isStandalone()) {
    return { ok: false, reason: "ios-install" };
  }

  if (!options.ignorePreference) {
    const { getPushEnabledPreference } = await import("./pushPreference");
    const pushEnabled = await getPushEnabledPreference();
    if (!pushEnabled) {
      return { ok: false, reason: "preference-off" };
    }
  }

  return subscribeToPush(options);
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  try {
    const reg = await getPushRegistration();
    if (!reg) return;

    const subscription = await reg.pushManager.getSubscription();
    if (!subscription) return;

    try {
      await API.post("/push/unsubscribe", { endpoint: subscription.endpoint });
    } catch {
      /* ignore network errors on unsubscribe */
    }

    await subscription.unsubscribe();
  } catch (err) {
    console.error("unsubscribeFromPush failed:", err);
  }
}

/**
 * Show a device notification from the open page.
 * FORBIDDEN for authenticated-system events with osDelivery=web_push —
 * those must use claimed Web Push via the shared server stack only.
 * Prefer adminStaffAlerts (which skips OS unless osDelivery=socket_or_push).
 */
export async function showLocalNotification(options: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}): Promise<boolean> {
  if (!isPushSupported()) return false;
  if (Notification.permission !== "granted") return false;

  try {
    const reg = (await getPushRegistration()) || (await registerServiceWorker());

    const payload = {
      body: options.body,
      icon: "/android-chrome-192x192.png",
      badge: "/favicon-v2.png",
      tag: options.tag || `bizuply-local-${Date.now()}`,
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: options.url || "/" },
    };

    if (reg?.showNotification) {
      await reg.showNotification(options.title, payload);
      return true;
    }

    // Fallback without SW (desktop browsers).
    // eslint-disable-next-line no-new
    new Notification(options.title, payload);
    return true;
  } catch (err) {
    console.error("showLocalNotification failed:", err);
    return false;
  }
}

/** Listen for SW asking the page to re-bind push after endpoint rotation. */
export function listenForPushSubscriptionChange(): () => void {
  if (!("serviceWorker" in navigator)) return () => undefined;

  let rebindTimer: ReturnType<typeof setTimeout> | null = null;
  const schedule = (forceRebind: boolean) => {
    if (rebindTimer) clearTimeout(rebindTimer);
    rebindTimer = setTimeout(() => {
      rebindTimer = null;
      void ensurePushSubscription({ forceRebind });
    }, 250);
  };

  const handler = (event: Event) => {
    const data = (event as MessageEvent).data;
    if (
      data?.type !== "PUSH_SUBSCRIPTION_CHANGED" &&
      data?.type !== "PUSH_SUBSCRIPTION_NEEDED" &&
      data?.type !== "SW_ACTIVATED"
    ) {
      return;
    }
    schedule(shouldForceRebindOnSwMessage(data?.type));
  };

  // iOS PWA often resumes a frozen JS context without remounting React.
  // Retry the save so a new Apple endpoint is stored after a server fix.
  const onVisible = () => {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    schedule(false);
  };

  navigator.serviceWorker.addEventListener("message", handler);
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("pageshow", onVisible);
  return () => {
    navigator.serviceWorker.removeEventListener("message", handler);
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("pageshow", onVisible);
    if (rebindTimer) clearTimeout(rebindTimer);
  };
}
