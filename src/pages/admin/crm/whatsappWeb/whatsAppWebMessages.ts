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
  /** Client-generated id for one send attempt (optimistic ↔ server upsert). */
  clientRequestId?: string;
  messageType?: string;
  mimeType?: string;
  filename?: string;
  caption?: string;
  mediaSize?: number;
  hasMedia?: boolean;
  canRetrieveMedia?: boolean;
  mediaPath?: string;
  mediaId?: string;
  /** Temporary client-only preview while upload/send is in flight */
  localPreviewUrl?: string;
  managedConnectionId?: string;
  receivedOnLabel?: string;
  sendFromLabel?: string;
};

export type PublicWhatsAppThread = {
  id: string;
  threadId?: string | null;
  adminCustomerId?: string | null;
  name?: string;
  phone?: string;
  hasConversation?: boolean;
  lastMessage?: string;
  lastMessageAt?: string | Date | null;
  unreadCount?: number;
  lastDirection?: string;
  lastStatus?: string;
  matchStatus?: string;
  unresolved?: boolean;
  inboxStatus?: string;
  inboxStatusLabel?: string;
  waitingSince?: string | Date | null;
  assignedStaffId?: string | null;
  assignedStaffName?: string;
  assignedAdminName?: string;
  leadSource?: string;
  handoffAckStatus?: string;
  handoffAckError?: string;
  managedConnectionId?: string;
  phoneNumberId?: string;
  businessDisplayPhone?: string;
  connectionLabel?: string;
  connectionCountry?: string;
  connectionFlag?: string;
  connectionBadge?: string;
  wabaId?: string;
  receivedOnLabel?: string;
  sendFromLabel?: string;
};

export type WhatsAppInboxConnection = {
  managedConnectionId: string;
  connectionBadge?: string;
  connectionLabel?: string;
  connectionCountry?: string;
  connectionFlag?: string;
  businessDisplayPhone?: string;
  displayPhoneMasked?: string;
  expectedDisplayPhone?: string;
  sendFromLabel?: string;
  ready?: boolean;
  sendReady?: boolean;
  enabled?: boolean;
  isDefault?: boolean;
};

/** Fallback chips when GET /inbox/connections is empty. */
export const FALLBACK_INBOX_CONNECTIONS: WhatsAppInboxConnection[] = [
  {
    managedConnectionId: "IL_MANAGED",
    connectionBadge: "IL",
    connectionFlag: "🇮🇱",
    connectionLabel: "Israel",
    connectionCountry: "IL",
    businessDisplayPhone: "",
  },
  {
    managedConnectionId: "US_MANAGED",
    connectionBadge: "US",
    connectionFlag: "🇺🇸",
    connectionLabel: "USA",
    connectionCountry: "US",
    businessDisplayPhone: "+1 210 944 4809",
  },
];

export function normalizeManagedConnectionId(value?: string | null) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

/** Compact US / IL badge for list chips. */
export function connectionBadgeLabel(
  meta?: {
    connectionBadge?: string | null;
    managedConnectionId?: string | null;
    connectionCountry?: string | null;
  } | null
) {
  const badge = String(meta?.connectionBadge || "")
    .trim()
    .toUpperCase();
  if (badge) return badge;
  const country = String(meta?.connectionCountry || "")
    .trim()
    .toUpperCase();
  if (country) return country;
  const id = normalizeManagedConnectionId(meta?.managedConnectionId);
  if (id === "US_MANAGED") return "US";
  if (id === "IL_MANAGED") return "IL";
  if (id.endsWith("_MANAGED")) return id.replace(/_MANAGED$/, "");
  return id.slice(0, 3);
}

/** Switcher / card line: flag + badge + business phone. */
export function connectionChipLabel(
  meta?: {
    connectionFlag?: string | null;
    connectionBadge?: string | null;
    managedConnectionId?: string | null;
    connectionCountry?: string | null;
    connectionLabel?: string | null;
    businessDisplayPhone?: string | null;
    displayPhoneMasked?: string | null;
    expectedDisplayPhone?: string | null;
  } | null
) {
  const flag = String(meta?.connectionFlag || "").trim();
  const badge = connectionBadgeLabel(meta);
  const phone = String(
    meta?.businessDisplayPhone ||
      meta?.displayPhoneMasked ||
      meta?.expectedDisplayPhone ||
      ""
  ).trim();
  const label = String(meta?.connectionLabel || "").trim();
  return [flag, badge, phone || label].filter(Boolean).join(" ").trim();
}

export function sendFromPhoneLabel(
  meta?: {
    connectionFlag?: string | null;
    businessDisplayPhone?: string | null;
    displayPhoneMasked?: string | null;
    expectedDisplayPhone?: string | null;
    sendFromLabel?: string | null;
    connectionLabel?: string | null;
    managedConnectionId?: string | null;
  } | null
) {
  const flag = String(meta?.connectionFlag || "").trim();
  const phone = String(
    meta?.businessDisplayPhone ||
      meta?.displayPhoneMasked ||
      meta?.expectedDisplayPhone ||
      ""
  ).trim();
  if (phone) return `${flag} ${phone}`.trim();
  if (meta?.sendFromLabel) return String(meta.sendFromLabel).trim();
  const label = String(meta?.connectionLabel || "").trim();
  if (label) return `${flag} ${label}`.trim();
  const badge = connectionBadgeLabel(meta);
  return `${flag} ${badge}`.trim();
}

export function threadRowKey(
  thread?: { id?: string | null; threadId?: string | null } | null
) {
  return String(thread?.threadId || thread?.id || "");
}

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
      if (row.clientRequestId && item.clientRequestId === row.clientRequestId) {
        return true;
      }
      if (
        item.pending &&
        row.direction === "outbound" &&
        item.direction === "outbound" &&
        item.bodyPreview === row.bodyPreview
      ) {
        return true;
      }
      return false;
    });
    if (idx >= 0) {
      const prev = next[idx];
      next[idx] = {
        ...prev,
        ...row,
        pending: false,
        localPreviewUrl: row.localPreviewUrl || prev.localPreviewUrl || "",
        clientRequestId: row.clientRequestId || prev.clientRequestId,
      };
    } else {
      next.push({ ...row, pending: Boolean(row.pending) });
    }
  }
  // Final pass: collapse any remaining wamid duplicates (e.g. after refresh).
  const seen = new Map<string, number>();
  const deduped: PublicWhatsAppMessage[] = [];
  for (const msg of next) {
    const k = messageKey(msg);
    const existingIdx = seen.get(k);
    if (existingIdx === undefined) {
      seen.set(k, deduped.length);
      deduped.push(msg);
    } else {
      deduped[existingIdx] = {
        ...deduped[existingIdx],
        ...msg,
        pending: false,
      };
    }
  }
  deduped.sort((a, b) => {
    const delta = timeMs(a.timestamp) - timeMs(b.timestamp);
    if (delta !== 0) return delta;
    return String(a.id).localeCompare(String(b.id));
  });
  return deduped;
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
  // Threads are unique per phone+managedConnectionId — match by row id only.
  const mergedKey = threadRowKey(merged);
  const rest = items.filter((row) => {
    const rowKey = threadRowKey(row);
    if (rowKey && mergedKey && rowKey === mergedKey) return false;
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
  ctx: {
    customerId?: string | null;
    threadId?: string | null;
    phone?: string | null;
    managedConnectionId?: string | null;
  }
) {
  if (!payload) return false;
  // When a specific inbox thread is open, never merge by customer/phone alone
  // (same customer can have IL + US rows).
  if (ctx.threadId) {
    return Boolean(
      payload.thread?.id &&
        String(payload.thread.id) === String(ctx.threadId)
    );
  }
  const payloadCustomer =
    payload.adminCustomerId || payload.thread?.adminCustomerId || null;
  if (
    ctx.customerId &&
    payloadCustomer &&
    String(payloadCustomer) === String(ctx.customerId)
  ) {
    const ctxConn = normalizeManagedConnectionId(ctx.managedConnectionId);
    const eventConn = normalizeManagedConnectionId(
      payload.thread?.managedConnectionId
    );
    if (ctxConn && eventConn && ctxConn !== eventConn) return false;
    return true;
  }
  const eventPhone = normalizeWaPhone(payload.thread?.phone);
  const localPhone = normalizeWaPhone(ctx.phone);
  if (!(eventPhone && localPhone && eventPhone === localPhone)) return false;
  const ctxConn = normalizeManagedConnectionId(ctx.managedConnectionId);
  const eventConn = normalizeManagedConnectionId(
    payload.thread?.managedConnectionId
  );
  if (ctxConn && eventConn && ctxConn !== eventConn) return false;
  return true;
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
