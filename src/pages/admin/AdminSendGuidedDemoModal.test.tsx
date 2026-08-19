import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminSendGuidedDemoModal, {
  AdminSendDemoButton,
} from "./AdminSendGuidedDemoModal";

vi.mock("../../api/guidedDemoApi", () => ({
  fetchGuidedDemoCatalog: vi.fn(async () => ({
    catalog: {
      modules: [
        { key: "crm", title: "CRM", interactive: true },
        { key: "website-builder", title: "בניית אתר", interactive: true },
        {
          key: "email",
          title: "אימייל",
          interactive: false,
          simulationReason: "הסבר מודרך",
        },
      ],
      presets: [
        { key: "full", title: "דמו מלא", description: "", moduleKeys: ["crm", "website-builder", "email"] },
        { key: "crm-only", title: "CRM", description: "", moduleKeys: ["crm"] },
        { key: "website-only", title: "בניית אתר", description: "", moduleKeys: ["website-builder"] },
        { key: "automations-only", title: "אוטומציות", description: "", moduleKeys: [] },
        { key: "custom", title: "בחירה מותאמת אישית", description: "", moduleKeys: [] },
      ],
      ttlOptionsHours: [24],
    },
    delivery: {
      whatsapp: { available: true, reason: "" },
      sms: { available: false, reason: "SMS עדיין לא זמין" },
    },
  })),
  listGuidedDemos: vi.fn(async () => ({ items: [] })),
  createGuidedDemo: vi.fn(),
  resendGuidedDemo: vi.fn(),
  copyGuidedDemoLink: vi.fn(),
  extendGuidedDemo: vi.fn(),
  revokeGuidedDemo: vi.fn(),
}));

describe("admin send demo button and modal", () => {
  it("renders the Hebrew send demo button", () => {
    const onClick = vi.fn();
    render(<AdminSendDemoButton onClick={onClick} />);
    fireEvent.click(screen.getByTestId("admin-send-demo-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("שליחת דמו")).toBeTruthy();
  });

  it("opens an RTL modal with prefilled editable phone and blocks invalid send", async () => {
    render(
      <MemoryRouter>
        <AdminSendGuidedDemoModal
          open
          onClose={() => {}}
          context={{
            customerName: "ישראל ישראלי",
            phone: "0501234567",
            sourceType: "early_access",
            sourceLeadId: "lead1",
          }}
        />
      </MemoryRouter>
    );

    const modal = await screen.findByTestId("admin-send-demo-modal");
    expect(modal.getAttribute("dir")).toBe("rtl");
    expect(screen.getByText("שליחת דמו אינטראקטיבי")).toBeTruthy();
    expect(screen.getByText("לקוח: ישראל ישראלי")).toBeTruthy();

    const phone = await screen.findByTestId("admin-send-demo-phone");
    expect((phone as HTMLInputElement).value).toBe("0501234567");
    fireEvent.change(phone, { target: { value: "123" } });
    expect((phone as HTMLInputElement).value).toBe("123");
    expect(screen.getByText("מספר טלפון לא תקין")).toBeTruthy();

    const submit = screen.getByTestId("admin-send-demo-submit") as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(screen.getByText("SMS עדיין לא זמין")).toBeTruthy();
    expect(screen.getByText("יצירת קישור בלבד")).toBeTruthy();
  });
});
