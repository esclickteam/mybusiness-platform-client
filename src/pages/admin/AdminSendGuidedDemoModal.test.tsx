import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminSendGuidedDemoModal, {
  AdminSendDemoButton,
} from "./AdminSendGuidedDemoModal";
import {
  createGuidedDemo,
  fetchGuidedDemoCatalog,
} from "../../api/guidedDemoApi";

const catalogPayload = {
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
};

vi.mock("../../api/guidedDemoApi", () => ({
  fetchGuidedDemoCatalog: vi.fn(async () => catalogPayload),
  listGuidedDemos: vi.fn(async () => ({ items: [] })),
  createGuidedDemo: vi.fn(),
  resendGuidedDemo: vi.fn(),
  copyGuidedDemoLink: vi.fn(),
  previewGuidedDemo: vi.fn(),
  extendGuidedDemo: vi.fn(),
  revokeGuidedDemo: vi.fn(),
  duplicateGuidedDemo: vi.fn(),
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
    expect(screen.getByText("שם מלא")).toBeTruthy();
    expect(screen.getByText("מספר טלפון")).toBeTruthy();
    expect(screen.getByText("פרטי הלקוח")).toBeTruthy();
    expect(screen.getByText("מה לכלול בדמו?")).toBeTruthy();
    expect(screen.getByText("סיכום")).toBeTruthy();

    const fullName = await screen.findByTestId("admin-send-demo-fullname");
    expect((fullName as HTMLInputElement).value).toBe("ישראל ישראלי");
    fireEvent.change(fullName, { target: { value: "" } });
    expect((fullName as HTMLInputElement).value).toBe("");

    const phone = await screen.findByTestId("admin-send-demo-phone");
    expect((phone as HTMLInputElement).value).toBe("0501234567");
    fireEvent.change(phone, { target: { value: "123" } });
    expect((phone as HTMLInputElement).value).toBe("123");
    expect(screen.getByText("מספר טלפון לא תקין")).toBeTruthy();

    const submit = screen.getByTestId("admin-send-demo-submit") as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(screen.getByText("SMS עדיין לא זמין")).toBeTruthy();
    expect(screen.getByText("יצירת קישור לדמו")).toBeTruthy();
    expect((screen.getByTestId("admin-create-demo-link") as HTMLButtonElement).disabled).toBe(true);
  });

  it("keeps create-link available when WhatsApp API is down", async () => {
    vi.mocked(fetchGuidedDemoCatalog).mockResolvedValueOnce({
      ...catalogPayload,
      delivery: {
        whatsapp: { available: false, reason: "WhatsApp disconnected" },
        sms: { available: false, reason: "SMS עדיין לא זמין" },
      },
    } as any);

    render(
      <MemoryRouter>
        <AdminSendGuidedDemoModal
          open
          onClose={() => {}}
          context={{
            customerName: "ישראל ישראלי",
            phone: "0501234567",
            sourceType: "manual",
          }}
        />
      </MemoryRouter>
    );

    const banner = await screen.findByTestId("admin-wa-api-unavailable");
    expect(banner.textContent).toContain("שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע");
    await waitFor(() => {
      expect((screen.getByTestId("admin-create-demo-link") as HTMLButtonElement).disabled).toBe(
        false
      );
    });
    expect((screen.getByTestId("admin-send-demo-submit") as HTMLButtonElement).disabled).toBe(true);
  });

  it("creates a demo URL without calling WhatsApp and exposes copy/open/manual share", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.mocked(createGuidedDemo).mockResolvedValueOnce({
      invitation: {
        id: "inv1",
        customerName: "ישראל ישראלי",
        customerPhone: "0501234567",
        selectedModules: ["crm", "website-builder", "email"],
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        status: "created",
        linkAvailable: true,
        demoLink: "https://bizuply.com/demo/test-token-abc",
      },
      demoLink: "https://bizuply.com/demo/test-token-abc",
      delivery: { ok: false, skipped: true },
    } as any);

    render(
      <MemoryRouter>
        <AdminSendGuidedDemoModal
          open
          onClose={() => {}}
          context={{
            customerName: "ישראל ישראלי",
            phone: "0501234567",
            sourceType: "manual",
          }}
        />
      </MemoryRouter>
    );

    await screen.findByText("דמו מלא");
    await waitFor(() => {
      expect((screen.getByTestId("admin-create-demo-link") as HTMLButtonElement).disabled).toBe(
        false
      );
    });
    fireEvent.click(screen.getByTestId("admin-create-demo-link"));
    expect((await screen.findByTestId("admin-created-demo-url")).textContent).toContain(
      "https://bizuply.com/demo/test-token-abc"
    );
    expect(createGuidedDemo).toHaveBeenCalledWith(expect.objectContaining({ send: false }));
    expect(screen.getByText("הקישור נוצר")).toBeTruthy();
    expect(screen.getByText("העתקת קישור")).toBeTruthy();
    expect(screen.getByText("פתיחת הדמו")).toBeTruthy();
    expect(screen.getByText("שליחה ידנית ב-WhatsApp")).toBeTruthy();

    fireEvent.click(screen.getByTestId("admin-created-open-demo"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://bizuply.com/demo/test-token-abc",
      "_blank",
      "noopener,noreferrer"
    );

    fireEvent.click(screen.getByTestId("admin-created-manual-whatsapp"));
    expect(openSpy.mock.calls.at(-1)?.[0]).toContain("https://wa.me/972501234567?text=");
    expect(String(openSpy.mock.calls.at(-1)?.[0])).toContain(
      encodeURIComponent("https://bizuply.com/demo/test-token-abc")
    );
    expect(screen.getByText("WhatsApp נפתח — שלחו ידנית מהאפליקציה")).toBeTruthy();
    openSpy.mockRestore();
  });
});
