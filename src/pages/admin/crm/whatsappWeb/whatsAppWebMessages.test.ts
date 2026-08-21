import { describe, expect, it } from "vitest";
import {
  applyStatusPatch,
  buildMessageFeed,
  dateSeparatorLabel,
  mergeMessages,
  messageKey,
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

  it("replaces an optimistic outbound with the confirmed log", () => {
    const pending = mergeMessages([], {
      id: "tmp-1",
      direction: "outbound",
      status: "queued",
      timestamp: "2026-08-21T08:00:00.000Z",
      bodyPreview: "שלום",
      pending: true,
    });
    const confirmed = mergeMessages(pending, {
      id: "log-1",
      direction: "outbound",
      status: "sent",
      timestamp: "2026-08-21T08:00:01.000Z",
      bodyPreview: "שלום",
      providerMessageId: "wamid.out",
    });
    expect(confirmed).toHaveLength(1);
    expect(confirmed[0].id).toBe("log-1");
    expect(confirmed[0].status).toBe("sent");
    expect(confirmed[0].pending).toBe(false);
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
