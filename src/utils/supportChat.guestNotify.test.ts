import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("showBrowserNotify guest isolation", () => {
  const OriginalNotification = globalThis.Notification;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    globalThis.Notification = OriginalNotification;
  });

  it("prefixes tags with guest-support- so they cannot collide with Web Push", async () => {
    const ctor = vi.fn();
    globalThis.Notification = Object.assign(ctor, {
      permission: "granted",
    }) as unknown as typeof Notification;

    const { showBrowserNotify } = await import("./supportChat.js");
    showBrowserNotify("title", "body", { tag: "msg-1" });

    expect(ctor).toHaveBeenCalledTimes(1);
    expect(ctor.mock.calls[0][1].tag).toBe("guest-support-msg-1");
  });

  it("keeps an existing guest-support- prefix", async () => {
    const ctor = vi.fn();
    globalThis.Notification = Object.assign(ctor, {
      permission: "granted",
    }) as unknown as typeof Notification;

    const { showBrowserNotify } = await import("./supportChat.js");
    showBrowserNotify("title", "body", { tag: "guest-support-x" });

    expect(ctor.mock.calls[0][1].tag).toBe("guest-support-x");
  });
});
