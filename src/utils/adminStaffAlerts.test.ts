import { beforeEach, describe, expect, it, vi } from "vitest";

const showLocalNotification = vi.fn(async () => undefined);

vi.mock("./push", () => ({
  showLocalNotification: (...args: unknown[]) => showLocalNotification(...args),
}));

describe("notifyAdminStaffEvent WhatsApp OS dedupe", () => {
  beforeEach(() => {
    showLocalNotification.mockClear();
    vi.resetModules();
  });

  it("skips showLocalNotification when kind is whatsapp_message", async () => {
    const { notifyAdminStaffEvent } = await import("./adminStaffAlerts");
    const alert = await notifyAdminStaffEvent({
      id: "n1",
      kind: "whatsapp_message",
      title: "הודעה חדשה ב-WhatsApp",
      body: "סול: בדיקה",
      providerMessageId: "wamid.test-1",
      pushTag: "wa-inbound:wamid.test-1",
      osDelivery: "web_push",
    });
    expect(alert?.id).toBe("n1");
    expect(showLocalNotification).not.toHaveBeenCalled();
  });

  it("skips showLocalNotification when providerMessageId is set", async () => {
    const { notifyAdminStaffEvent } = await import("./adminStaffAlerts");
    await notifyAdminStaffEvent({
      id: "n2",
      kind: "crm_lead",
      title: "ליד",
      body: "x",
      providerMessageId: "wamid.test-2",
    });
    expect(showLocalNotification).not.toHaveBeenCalled();
  });

  it("still shows local OS notification when socket owns delivery", async () => {
    const { notifyAdminStaffEvent } = await import("./adminStaffAlerts");
    await notifyAdminStaffEvent({
      id: "n3",
      kind: "calendar_booking",
      title: "שיחה",
      body: "נקבעה",
      osDelivery: "socket_or_push",
      skipOsNotification: false,
    });
    expect(showLocalNotification).toHaveBeenCalledTimes(1);
  });

  it("skips local OS when osDelivery is web_push", async () => {
    const { notifyAdminStaffEvent } = await import("./adminStaffAlerts");
    await notifyAdminStaffEvent({
      id: "n4",
      kind: "calendar_booking",
      title: "שיחה",
      body: "נקבעה",
      osDelivery: "web_push",
    });
    expect(showLocalNotification).not.toHaveBeenCalled();
  });
});
