import { showLocalNotification } from "./push";

export type AdminStaffAlertKind = "support" | "calendar_booking" | "calendar_reminder";

export type AdminStaffAlert = {
  id: string;
  kind: AdminStaffAlertKind;
  title: string;
  body: string;
  targetUrl?: string;
  conversationId?: string | null;
  bookingId?: string | null;
  adminCustomerId?: string | null;
  at: number;
  read?: boolean;
  server?: boolean;
};

const SUPPORT_STORAGE_KEY = "bizuply_admin_support_alerts";
const MAX_ALERTS = 40;

export function loadStoredSupportAlerts(): AdminStaffAlert[] {
  try {
    const raw = localStorage.getItem(SUPPORT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ALERTS).map((item) => ({
      ...item,
      kind: (item?.kind || "support") as AdminStaffAlertKind,
      read: Boolean(item?.read),
      server: false,
    }));
  } catch {
    return [];
  }
}

export function persistSupportAlerts(alerts: AdminStaffAlert[]) {
  try {
    const supportOnly = alerts.filter((item) => item.kind === "support");
    localStorage.setItem(
      SUPPORT_STORAGE_KEY,
      JSON.stringify(supportOnly.slice(0, MAX_ALERTS))
    );
  } catch {
    /* ignore */
  }
}

export function playAlertBeep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.3);
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 400);
  } catch {
    /* ignore */
  }
}

let lastNotifyKey = "";
let lastNotifyAt = 0;

export async function notifyAdminStaffEvent(options: {
  id?: string;
  kind?: AdminStaffAlertKind;
  title: string;
  body: string;
  targetUrl?: string;
  conversationId?: string | null;
  bookingId?: string | null;
  adminCustomerId?: string | null;
  skipOsNotification?: boolean;
}): Promise<AdminStaffAlert | null> {
  const alert: AdminStaffAlert = {
    id: options.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: options.kind || "support",
    title: options.title,
    body: options.body,
    targetUrl: options.targetUrl || "",
    conversationId: options.conversationId || null,
    bookingId: options.bookingId || null,
    adminCustomerId: options.adminCustomerId || null,
    at: Date.now(),
    read: false,
    server: Boolean(options.id),
  };

  const dedupeKey = `${alert.kind}|${alert.id}|${alert.title}|${alert.body}`;
  const now = Date.now();
  if (dedupeKey === lastNotifyKey && now - lastNotifyAt < 2500) {
    return null;
  }
  lastNotifyKey = dedupeKey;
  lastNotifyAt = now;

  playAlertBeep();

  if (!options.skipOsNotification) {
    const url =
      alert.targetUrl ||
      (alert.conversationId
        ? `/admin/support-chat?c=${alert.conversationId}`
        : alert.adminCustomerId
          ? `/admin/crm/customers/${alert.adminCustomerId}`
          : "/admin/support-chat");
    await showLocalNotification({
      title: `BizUply · ${alert.title}`,
      body: alert.body,
      url,
      tag: alert.kind === "support" ? `support-${alert.conversationId || alert.id}` : alert.id,
    });
  }

  return alert;
}

// Backward-compatible exports for support chat
export type AdminSupportAlert = AdminStaffAlert;
export const loadStoredAlerts = loadStoredSupportAlerts;
export const persistAlerts = persistSupportAlerts;
export const notifyAdminSupportEvent = notifyAdminStaffEvent;
