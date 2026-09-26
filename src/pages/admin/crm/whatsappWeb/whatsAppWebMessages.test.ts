import { describe, expect, it } from "vitest";
import {
  applyStatusPatch,
  buildMessageFeed,
  bumpThreadList,
  connectionBadgeLabel,
  connectionChipLabel,
  conversationViaDetailLabel,
  dateSeparatorLabel,
  inboundEventMatches,
  mergeMessages,
  messageKey,
  outboundSentViaLabel,
  sendFromPhoneLabel,
} from "./whatsAppWebMessages";

describe("whatsAppWebMessages", () => {
  it("dedupes by wamid and keeps chronological order", () => {
    const first = mergeMessages([], {
      id: "a",
      direction: "inbound",
      status: "received",
      timestamp: "2026-08-21T07:00:00.000Z",
      providerMessageId: "wamid.1",
      bodyPreview: "hi",
    });
    const next = mergeMessages(first, {
      id: "b",
      direction: "inbound",
      status: "received",
      timestamp: "2026-08-21T07:00:00.000Z",
      providerMessageId: "wamid.1",
      bodyPreview: "hi",
    });
    expect(next).toHaveLength(1);
    expect(messageKey(next[0])).toBe("wamid:wamid.1");
  });

  it("matches an inbound event by thread, customer, or phone", () => {
    expect(
      inboundEventMatches(
        { thread: { id: "th1", phone: "0501234567" } as any },
        { threadId: "th1" }
      )
    ).toBe(true);
    expect(
      inboundEventMatches(
        { adminCustomerId: "c1", thread: { id: "other" } as any },
        { customerId: "c1" }
      )
    ).toBe(true);
    expect(
      inboundEventMatches(
        { thread: { id: "x", phone: "+972501234567" } as any },
        { phone: "0501234567" }
      )
    ).toBe(true);
    expect(
      inboundEventMatches(
        { thread: { id: "x", phone: "0501111111" } as any },
        { phone: "0501234567", customerId: "nope" }
      )
    ).toBe(false);
  });

  it("does not merge IL/US threads when a specific threadId is open", () => {
    expect(
      inboundEventMatches(
        {
          adminCustomerId: "c1",
          thread: {
            id: "us-thread",
            managedConnectionId: "US_MANAGED",
          } as any,
        },
        { threadId: "il-thread", customerId: "c1" }
      )
    ).toBe(false);
    expect(
      inboundEventMatches(
        {
          adminCustomerId: "c1",
          thread: {
            id: "il-thread",
            managedConnectionId: "IL_MANAGED",
          } as any,
        },
        { threadId: "il-thread", customerId: "c1" }
      )
    ).toBe(true);
  });

  it("bumps inbox rows by thread id only (keeps IL + US for same customer)", () => {
    const items = [
      {
        id: "il-1",
        adminCustomerId: "c1",
        managedConnectionId: "IL_MANAGED",
        phone: "0501111111",
        lastMessage: "il",
      },
      {
        id: "us-1",
        adminCustomerId: "c1",
        managedConnectionId: "US_MANAGED",
        phone: "0501111111",
        lastMessage: "us",
      },
    ];
    const next = bumpThreadList(items as any, {
      id: "us-1",
      adminCustomerId: "c1",
      managedConnectionId: "US_MANAGED",
      phone: "0501111111",
      lastMessage: "us-new",
    } as any);
    expect(next).toHaveLength(2);
    expect(next[0].id).toBe("us-1");
    expect(next[0].lastMessage).toBe("us-new");
    expect(next[1].id).toBe("il-1");
  });

  it("formats connection badges and send-from phone labels", () => {
    expect(
      connectionBadgeLabel({
        managedConnectionId: "US_MANAGED",
        connectionBadge: "US",
      })
    ).toBe("US");
    expect(
      connectionChipLabel({
        connectionFlag: "🇺🇸",
        connectionBadge: "US",
        businessDisplayPhone: "+1 210 944 4809",
      })
    ).toBe("🇺🇸 US +1 210 944 4809");
    expect(
      sendFromPhoneLabel({
        managedConnectionId: "IL_MANAGED",
        connectionFlag: "🇮🇱",
        businessDisplayPhone: "+972 50 000 0000",
      })
    ).toBe("Bizuply IL (+972 50 000 0000)");
    expect(
      conversationViaDetailLabel({
        managedConnectionId: "US_MANAGED",
        connectionFlag: "🇺🇸",
        businessDisplayPhone: "+1 210 944 4809",
      })
    ).toBe("🇺🇸 · Bizuply US · +1 210 944 4809 · US_MANAGED");
    expect(
      outboundSentViaLabel(
        {
          managedConnectionId: "US_MANAGED",
          businessPhoneNumber: "+1 210 944 4809",
        },
        null
      )
    ).toBe("Sent via US_MANAGED · +1 210 944 4809");
  });

  it("replaces an optimistic outbound with the confirmed log", () => {
    const pending = mergeMessages([], {
      id: "tmp-1",
      direction: "outbound",
      status: "queued",
      timestamp: "2026-08-21T08:00:00.000Z",
      bodyPreview: "שלום",
      pending: true,
      clientRequestId: "req-1",
    });
    const confirmed = mergeMessages(pending, {
      id: "log-1",
      direction: "outbound",
      status: "sent",
      timestamp: "2026-08-21T08:00:01.000Z",
      bodyPreview: "שלום",
      providerMessageId: "wamid.out",
      clientRequestId: "req-1",
    });
    expect(confirmed).toHaveLength(1);
    expect(confirmed[0].id).toBe("log-1");
    expect(confirmed[0].status).toBe("sent");
    expect(confirmed[0].pending).toBe(false);
  });

  it("upserts websocket + http duplicates by wamid instead of appending", () => {
    const first = mergeMessages([], {
      id: "tmp-1",
      direction: "outbound",
      status: "queued",
      timestamp: "2026-08-21T08:00:00.000Z",
      bodyPreview: "שלום",
      pending: true,
      clientRequestId: "req-2",
    });
    const viaSocket = mergeMessages(first, {
      id: "log-1",
      direction: "outbound",
      status: "sent",
      timestamp: "2026-08-21T08:00:01.000Z",
      bodyPreview: "שלום",
      providerMessageId: "wamid.out",
    });
    const viaHttp = mergeMessages(viaSocket, {
      id: "log-1",
      direction: "outbound",
      status: "sent",
      timestamp: "2026-08-21T08:00:01.000Z",
      bodyPreview: "שלום",
      providerMessageId: "wamid.out",
    });
    expect(viaHttp).toHaveLength(1);
    expect(messageKey(viaHttp[0])).toBe("wamid:wamid.out");
  });

  it("applies delivery and read status by wamid", () => {
    const rows = mergeMessages([], {
      id: "log-1",
      direction: "outbound",
      status: "sent",
      providerMessageId: "wamid.out",
      timestamp: "2026-08-21T08:00:00.000Z",
      bodyPreview: "ok",
    });
    const delivered = applyStatusPatch(rows, {
      providerMessageId: "wamid.out",
      status: "delivered",
    });
    expect(delivered[0].status).toBe("delivered");
  });

  it("inserts Hebrew date separators", () => {
    const feed = buildMessageFeed([
      {
        id: "1",
        direction: "inbound",
        status: "received",
        timestamp: new Date().toISOString(),
        bodyPreview: "now",
      },
    ]);
    expect(feed[0]).toMatchObject({ type: "date", label: "היום" });
    expect(dateSeparatorLabel(new Date())).toBe("היום");
  });
});
