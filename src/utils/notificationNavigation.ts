const PENDING_NOTIFICATION_URL_KEY = "bizuply_pending_notification_url";

export function normalizeBusinessId(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return id ? String(id) : "";
  }

  return String(value);
}

export function pickNotificationText(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;

      if (typeof record.text === "string" && record.text.trim()) {
        return record.text.trim();
      }

      if (typeof record.message === "string" && record.message.trim()) {
        return record.message.trim();
      }
    }
  }

  return "התראה חדשה";
}

export function toDisplayString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.text === "string" && record.text.trim()) {
      return record.text.trim();
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message.trim();
    }

    if (typeof record.title === "string" && record.title.trim()) {
      return record.title.trim();
    }
  }

  return fallback;
}

export function rewriteDashboardTargetForBusiness(
  targetUrl: string,
  businessId: string
): string {
  if (!targetUrl || !businessId) return targetUrl;

  const normalizedBusinessId = normalizeBusinessId(businessId);
  if (!normalizedBusinessId) return targetUrl;

  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
    try {
      const url = new URL(targetUrl);

      url.pathname = url.pathname.replace(
        /^\/business\/[^/]+/,
        `/business/${normalizedBusinessId}`
      );

      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return targetUrl;
    }
  }

  if (targetUrl.startsWith("/business/")) {
    return targetUrl.replace(
      /^\/business\/[^/]+/,
      `/business/${normalizedBusinessId}`
    );
  }

  return targetUrl;
}

export function toAbsoluteAppUrl(targetUrl: string): string {
  if (!targetUrl) return "/";

  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
    return targetUrl;
  }

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://bizuply.com";

  return `${origin}${targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`}`;
}

export function stashPendingNotificationUrl(targetUrl: string) {
  if (!targetUrl) return;

  try {
    sessionStorage.setItem(PENDING_NOTIFICATION_URL_KEY, targetUrl);
  } catch {
    // ignore quota / private mode
  }
}

export function consumePendingNotificationUrl(): string | null {
  try {
    const pending = sessionStorage.getItem(PENDING_NOTIFICATION_URL_KEY);

    if (pending) {
      sessionStorage.removeItem(PENDING_NOTIFICATION_URL_KEY);
    }

    return pending;
  } catch {
    return null;
  }
}

export function registerServiceWorkerNotificationBridge() {
  if (typeof window === "undefined") return () => {};

  const handleMessage = (event: MessageEvent) => {
    const data = event.data as { type?: string; url?: string } | null;

    if (data?.type !== "NOTIFICATION_NAVIGATE" || !data.url) return;

    const path = data.url.startsWith("http")
      ? `${new URL(data.url).pathname}${new URL(data.url).search}${new URL(data.url).hash}`
      : data.url;

    stashPendingNotificationUrl(path);

    window.dispatchEvent(
      new CustomEvent("bizuply:notification-navigate", {
        detail: { url: path },
      })
    );
  };

  navigator.serviceWorker?.addEventListener("message", handleMessage);

  return () => {
    navigator.serviceWorker?.removeEventListener("message", handleMessage);
  };
}
