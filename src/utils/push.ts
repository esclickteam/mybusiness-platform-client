import API from "@api";

const SW_URL = "/service-worker.js";

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
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
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

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const reg = await navigator.serviceWorker.register(SW_URL, {
      scope: "/",
      updateViaCache: "none",
    });

    // Force check for a newer SW (important after deploy).
    try {
      await reg.update();
    } catch {
      /* ignore update errors */
    }

    return reg;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;

  const reg = await navigator.serviceWorker.getRegistration(SW_URL);
  if (!reg) return false;

  const sub = await reg.pushManager.getSubscription();
  return Boolean(sub);
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
    | "error";
  detail?: string;
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

export async function subscribeToPush(): Promise<SubscribeResult> {
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

    const subscription = await createPushSubscription(reg, key);

    // Always re-bind the browser subscription to the current business tenant.
    const saveRes = await API.post("/push/subscribe", {
      subscription: subscription.toJSON(),
    });

    if (!saveRes.data?.ok) {
      return {
        ok: false,
        reason: "error",
        detail: saveRes.data?.error || "subscribe save failed",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("subscribeToPush failed:", err);
    return {
      ok: false,
      reason: "error",
      detail: err instanceof Error ? err.message : "subscribe failed",
    };
  }
}

/**
 * If the user already granted notification permission, make sure the device
 * subscription is registered for the current business (no permission prompt).
 */
export async function ensurePushSubscription(): Promise<SubscribeResult> {
  if (!isPushSupported()) return { ok: false, reason: "unsupported" };
  if (Notification.permission !== "granted") {
    return { ok: false, reason: Notification.permission as "denied" | "default" };
  }

  if (isIos() && !isStandalone()) {
    return { ok: false, reason: "ios-install" };
  }

  return subscribeToPush();
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  try {
    const reg =
      (await navigator.serviceWorker.getRegistration(SW_URL)) ||
      (await navigator.serviceWorker.getRegistration());
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

/** Listen for SW asking the page to re-bind push after endpoint rotation. */
export function listenForPushSubscriptionChange(): () => void {
  if (!("serviceWorker" in navigator)) return () => undefined;

  const handler = (event: Event) => {
    const data = (event as MessageEvent).data;
    if (data?.type !== "PUSH_SUBSCRIPTION_CHANGED") return;
    void ensurePushSubscription();
  };

  navigator.serviceWorker.addEventListener("message", handler);
  return () => navigator.serviceWorker.removeEventListener("message", handler);
}
