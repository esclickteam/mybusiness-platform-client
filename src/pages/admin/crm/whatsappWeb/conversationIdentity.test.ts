import { describe, expect, it } from "vitest";
import { conversationIdentity, isHumanContactLabel } from "./conversationIdentity";

describe("conversationIdentity", () => {
  it("shows company, person and phone for a saved recipient", () => {
    const view = conversationIdentity({
      contactSaved: true,
      companyName: "Northwind Studio",
      contactPersonName: "Dana Cohen",
      phone: "+1 415 555 0134",
      whatsappProfileName: "Dana",
    });
    expect(view.title).toBe("Northwind Studio");
    expect(view.person).toBe("Dana Cohen");
    expect(view.phone).toBe("+1 415 555 0134");
    expect(view.saved).toBe(true);
  });

  it("shows the WhatsApp profile and phone when the recipient is not saved", () => {
    const view = conversationIdentity({
      contactSaved: false,
      companyName: "Should Not Show",
      name: "64f1a2b3c4d5e6f7a8b9c0d1",
      whatsappProfileName: "Alex Rivera",
      phone: "+15555550123",
    });
    expect(view.saved).toBe(false);
    expect(view.title).toBe("Alex Rivera");
    expect(view.person).toBe("");
    expect(view.phone).toBe("+15555550123");
  });

  it("never uses an internal id as the visible name", () => {
    expect(isHumanContactLabel("US_MANAGED")).toBe(false);
    const view = conversationIdentity({
      contactSaved: false,
      name: "customer:64f1a2b3c4d5e6f7a8b9c0d1",
      phone: "+15555550199",
    });
    expect(view.title).toBe("+15555550199");
  });
});
