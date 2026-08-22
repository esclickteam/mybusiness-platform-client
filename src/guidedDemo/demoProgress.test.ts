import { describe, expect, it } from "vitest";
import { mapRequestToEvent } from "./demoProgress";

describe("guided demo progress mapping", () => {
  it("maps a real CRM status PATCH, not a click", () => {
    expect(
      mapRequestToEvent({
        method: "PATCH",
        url: "/crm/leads/abc123/status",
        data: { status: "contacted" },
      })
    ).toEqual({
      event: "CRM_STATUS_CHANGED",
      payload: { status: "contacted" },
    });
  });

  it("maps note vs task activities", () => {
    expect(
      mapRequestToEvent({
        method: "POST",
        url: "/crm/leads/abc/activities",
        data: { type: "note", text: "דיברנו" },
      })?.event
    ).toBe("CRM_NOTE_CREATED");
    expect(
      mapRequestToEvent({
        method: "POST",
        url: "/crm/leads/abc/activities",
        data: { type: "task", text: "לחזור מחר" },
      })?.event
    ).toBe("TASK_CREATED");
  });

  it("maps website publish as a demo publish, not production", () => {
    expect(
      mapRequestToEvent({
        method: "PUT",
        url: "/site-builder/xyz",
        data: { published: true },
      })?.event
    ).toBe("WEBSITE_DEMO_PUBLISHED");
    expect(
      mapRequestToEvent({
        method: "PATCH",
        url: "/site-builder/xyz",
        data: { html: "<h1>x</h1>" },
      })?.event
    ).toBe("WEBSITE_SAVED");
  });

  it("ignores unrelated GETs", () => {
    expect(
      mapRequestToEvent({ method: "GET", url: "/crm/leads", data: {} })
    ).toBeNull();
  });
});
