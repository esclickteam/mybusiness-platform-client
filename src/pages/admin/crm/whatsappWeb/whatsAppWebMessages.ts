export const ISRAEL_TZ = "Asia/Jerusalem";

export type PublicWhatsAppMessage = {
  id: string;
  direction: "inbound" | "outbound" | string;
  status: string;
  timestamp?: string | Date | null;
  sentAt?: string | Date | null;
  deliveredAt?: string | Date | null;
  readAt?: string | Date | null;
  failedAt?: string | Date | null;
  bodyPreview?: string;
  templateName?: string;
  kind?: "template" | "free_form" | string;
  adminSenderName?: string;
  error?: string;
  providerMessageId?: string;
  pending?: boolean;
};

export type PublicWhatsAppThread = {
  id: string;
  adminCustomerId?: string | null;
  name?: string;
  phone?: string;
  lastMessage?: string;
  lastMessageAt?: string | Date | null;
  unreadCount?: number;
  lastDirection?: string;
  lastStatus?: string;
  matchStatus?: string;
  unresolved?: boolean;
  assignedAdminName?: string;
};

export function messageKey(msg: PublicWhatsAppMessage) {
  const wamid = String(msg.providerMessageId || "").trim();
  if (wamid) return `wamid:${wamid}`;
  return `id:${msg.id}`;
}

function timeMs(value?: string | Date | null) {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

export function normalizeWaPhone(raw?: string | null) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("972") && digits.length >= 11) return digits;
  if (digits.startsWith("0") && digits.length >= 9) return `972${digits.slice(1)}`;
  if (digits.length === 9) return `972${digits}`;
  return digits;
}

export function mergeMessages(
  current: PublicWhatsAppMessage[],
  incoming: PublicWhatsAppMessage | PublicWhatsAppMessage[]
) {
  const next = [...current];
  const rows = Array.isArray(incoming) ? incoming : [incoming];
  for (const row of rows) {
    if (!row) continue;
    const key = messageKey(row);
    const idx = next.findIndex((item) => {
      if (messageKey(item) === key) return true;
      if (row.providerMessageId && item.providerMessageId === row.providerMessageId) {
        return true;
      }
      if (row.id && item.id === row.id) return true;
      if (
        item.pending &&
        row.direction === "outbound" &&
        item.bodyPreview === row.bodyPreview
      ) {
        return true;
      }
      return false;
    });
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...row, pending: false };
    } else {
      next.push({ ...row, pending: Boolean(row.pending) });
    }
  }
  next.sort((a, b) => {
    const delta = timeMs(a.timestamp) - timeMs(b.timestamp);
    if (delta !== 0) return delta;
    return String(a.id).localeCompare(String(b.id));
  });
  return next;
}

export function applyStatusPatch(
  current: PublicWhatsAppMessage[],
  patch: {
    id?: string;
    providerMessageId?: string;
    status?: string;
    error?: string;
  }
) {
  return current.map((msg) => {
    const byId = patch.id && msg.id === patch.id;
    const byWamid =
      patch.providerMessageId &&
      msg.providerMessageId === patch.providerMessageId;
    if (!byId && !byWamid) return msg;
    return {
      ...msg,
      status: patch.status || msg.status,
      error: patch.error || msg.error,
      pending: false,
    };
  });
}

export function bumpThreadList(
  items: PublicWhatsAppThread[],
  thread: PublicWhatsAppThread,
  extras: Partial<PublicWhatsAppThread> = {}
) {
  const merged = { ...thread, ...extras };
  const rest = items.filter((row) => {
    if (row.id && merged.id && String(row.id) === String(merged.id)) return false;
    if (
      row.adminCustomerId &&
      merged.adminCustomerId &&
      String(row.adminCustomerId) === String(merged.adminCustomerId)
    ) {
      return false;
    }
    const a = normalizeWaPhone(row.phone);
    const b = normalizeWaPhone(merged.phone);
    if (a && b && a === b) return false;
    return true;
  });
  return [merged, ...rest];
}

export function inboundEventMatches(
  payload: {
    adminCustomerId?: string | null;
    thread?: PublicWhatsAppThread | null;
  } | null
  | undefined,
  ctx: { customerId?: string | null; threadId?: string | null; phone?: string | null }
) {
  if (!payload) return false;
  if (
    ctx.threadId &&
    payload.thread?.id &&
    String(payload.thread.id) === String(ctx.threadId)
  ) {
    return true;
  }
  const payloadCustomer =
    payload.adminCustomerId || payload.thread?.adminCustomerId || null;
  if (
    ctx.customerId &&
    payloadCustomer &&
    String(payloadCustomer) === String(ctx.customerId)
  ) {
    return true;
  }
  const eventPhone = normalizeWaPhone(payload.thread?.phone);
  const localPhone = normalizeWaPhone(ctx.phone);
  return Boolean(eventPhone && localPhone && eventPhone === localPhone);
}

export function formatClock(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: ISRAEL_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function jerusalemYmd(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ISRAEL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function dateSeparatorLabel(value?: string | Date | null, now = new Date()) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = jerusalemYmd(date);
  const today = jerusalemYmd(now);
  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterday = jerusalemYmd(yesterdayDate);
  if (day === today) return "היום";
  if (day === yesterday) return "אתמול";
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: ISRAEL_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function listTimeLabel(value?: string | Date | null, now = new Date()) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (jerusalemYmd(date) === jerusalemYmd(now)) return formatClock(date);
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: ISRAEL_TZ,
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export type FeedItem =
  | { type: "date"; key: string; label: string }
  | {
      type: "message";
      key: string;
      message: PublicWhatsAppMessage;
      grouped: boolean;
    };

export function buildMessageFeed(messages: PublicWhatsAppMessage[]): FeedItem[] {
  const feed: FeedItem[] = [];
  let lastDay = "";
  let lastDirection = "";
  let lastMs = 0;
  for (const message of messages) {
    const day = jerusalemYmd(new Date(message.timestamp || Date.now()));
    if (day !== lastDay) {
      feed.push({
        type: "date",
        key: `date-${day}`,
        label: dateSeparatorLabel(message.timestamp),
      });
      lastDay = day;
      lastDirection = "";
      lastMs = 0;
    }
    const ms = timeMs(message.timestamp);
    const grouped =
      lastDirection === message.direction &&
      ms - lastMs < 7 * 60 * 1000 &&
      lastDirection !== "";
    feed.push({
      type: "message",
      key: messageKey(message),
      message,
      grouped,
    });
    lastDirection = String(message.direction || "");
    lastMs = ms;
  }
  return feed;
}

export function tickKind(status?: string) {
  const value = String(status || "").toLowerCase();
  if (value === "failed") return "failed";
  if (value === "read") return "read";
  if (value === "delivered") return "delivered";
  if (value === "sent") return "sent";
  return "pending";
}
