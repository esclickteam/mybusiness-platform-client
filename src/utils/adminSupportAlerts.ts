import { showLocalNotification } from "./push";

export type AdminSupportAlert = {
  id: string;
  title: string;
  body: string;
  conversationId?: string | null;
  at: number;
  read?: boolean;
};

const STORAGE_KEY = "bizuply_admin_support_alerts";
const MAX_ALERTS = 40;

export function loadStoredAlerts(): AdminSupportAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ALERTS).map((item) => ({
      ...item,
      read: Boolean(item?.read),
    }));
  } catch {
    return [];
  }
}

export function persistAlerts(alerts: AdminSupportAlert[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(alerts.slice(0, MAX_ALERTS))
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

export async function notifyAdminSupportEvent(options: {
  title: string;
  body: string;
  conversationId?: string | null;
  /** Skip OS notification when admin is already focused on that chat */
  skipOsNotification?: boolean;
}): Promise<AdminSupportAlert | null> {
  const alert: AdminSupportAlert = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: options.title,
    body: options.body,
    conversationId: options.conversationId || null,
    at: Date.now(),
    read: false,
  };

  // Socket may emit both support:newMessage and support:notify for one event.
  const dedupeKey = `${alert.conversationId || ""}|${alert.title}|${alert.body}`;
  const now = Date.now();
  if (dedupeKey === lastNotifyKey && now - lastNotifyAt < 2500) {
    return null;
  }
  lastNotifyKey = dedupeKey;
  lastNotifyAt = now;

  playAlertBeep();

  if (!options.skipOsNotification) {
    await showLocalNotification({
      title: `Bizuply · ${options.title}`,
      body: options.body,
      url: options.conversationId
        ? `/admin/support-chat?c=${options.conversationId}`
        : "/admin/support-chat",
      tag: options.conversationId
        ? `support-${options.conversationId}`
        : `support-${alert.id}`,
    });
  }

  return alert;
}
