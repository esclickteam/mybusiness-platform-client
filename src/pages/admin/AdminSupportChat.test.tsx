import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminSupportChat from "./AdminSupportChat";

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock("../../api", () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Admin", _id: "admin1" },
    socket: null,
  }),
}));

vi.mock("./AdminsHeader", () => ({
  default: () => <div>admin-header</div>,
}));

vi.mock("./AdminSendGuidedDemoModal", () => ({
  __esModule: true,
  default: ({
    open,
    context,
  }: {
    open: boolean;
    context: {
      customerName?: string;
      phone?: string;
      managedConnectionId?: string;
    };
  }) =>
    open ? (
      <div data-testid="admin-send-demo-modal">
        <span data-testid="demo-prefill-name">{context.customerName}</span>
        <span data-testid="demo-prefill-phone">{context.phone}</span>
        <span data-testid="demo-prefill-connection">
          {context.managedConnectionId}
        </span>
      </div>
    ) : null,
  AdminSendDemoButton: ({ onClick }: { onClick: () => void }) => (
    <button type="button" data-testid="admin-send-demo-button" onClick={onClick}>
      שליחת דמו
    </button>
  ),
}));

vi.mock("../../utils/adminStaffAlerts", () => ({
  notifyAdminSupportEvent: vi.fn(async () => null),
}));

const conversation = {
  _id: "conv-wa-1",
  name: "דניאל כהן",
  phone: "972501234567",
  channel: "whatsapp",
  managedConnectionId: "US_MANAGED",
  businessDisplayPhone: "+12109444809",
  connectionCountry: "US",
  connectionLabel: "Bizuply US",
  status: "active",
  mode: "human",
  lastMessagePreview: "היי דניאל, נעים מאוד",
  lastMessageAt: new Date().toISOString(),
  unreadByAgent: 2,
  sourceLeadId: "lead1",
};

const demoCard = {
  _id: "m-demo",
  senderType: "agent",
  senderName: "Bizuply",
  direction: "outbound",
  text: "https://bizuply.com/demo/SHOULD_NOT_RENDER",
  deliveryStatus: "delivered",
  createdAt: new Date().toISOString(),
  metadata: {
    interactiveDemoCard: true,
    templateName: "interactive_demo_followup_v2",
    buttonText: "View interactive demo",
    senderLabel: "Bizuply US · +1 210-944-4809",
    demoLink: "https://bizuply.com/demo/3cyGi127La8xeOzmVpLswxsbcTJ-D-DrHFjbQmG5uNo",
  },
};

const outbound = {
  _id: "m1",
  senderType: "agent",
  senderName: "Bizuply",
  direction: "outbound",
  text: "היי דניאל, נעים מאוד 👋\nhttps://bizuply.com/demo/abc",
  deliveryStatus: "sent",
  providerMessageId: "wamid.abc",
  createdAt: new Date().toISOString(),
};

const inbound = {
  _id: "m2",
  senderType: "visitor",
  senderName: "דניאל כהן",
  direction: "inbound",
  text: "היי, אשמח לקבל פרטים",
  createdAt: new Date().toISOString(),
};

describe("AdminSupportChat whatsapp", () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    getMock.mockImplementation((url: string) => {
      if (String(url).includes("/admin/conversations")) {
        return Promise.resolve({
          data: { conversations: [conversation], onlineAgents: [] },
        });
      }
      if (String(url).includes("/whatsapp-context")) {
        return Promise.resolve({
          data: {
            sessionWindowOpen: true,
            requiresTemplate: false,
            managedConnectionId: "US_MANAGED",
          },
        });
      }
      if (String(url).includes("/whatsapp-templates")) {
        return Promise.resolve({
          data: {
            managedConnectionId: "US_MANAGED",
            templates: [
              {
                id: "tpl-1",
                metaTemplateName: "partner_agreement_followup_v1",
                language: "en_US",
                metaCategory: "UTILITY",
                metaStatus: "APPROVED",
                body: "Hi {{1}}, following up on the partner agreement.",
                variables: ["1"],
              },
            ],
          },
        });
      }
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [outbound, inbound], conversation, hasMore: false },
        });
      }
      return Promise.resolve({ data: {} });
    });
    postMock.mockResolvedValue({ data: { success: true } });
  });

  it("renders RTL list, whatsapp phone, and opens conversation", async () => {
    render(
      <MemoryRouter>
        <AdminSupportChat />
      </MemoryRouter>
    );

    expect(document.querySelector("[dir='rtl']")).toBeTruthy();
    expect(await screen.findByText("דניאל כהן")).toBeTruthy();
    expect(screen.getByText("0501234567")).toBeTruthy();

    fireEvent.click(screen.getByText("דניאל כהן"));
    expect(await screen.findByTestId("support-bubble-outbound")).toBeTruthy();
    expect(screen.getByTestId("support-bubble-inbound")).toBeTruthy();
    expect(screen.getByTestId("support-chat-composer")).toBeTruthy();
    expect(screen.getByText("ליד מקושר")).toBeTruthy();
    expect(screen.getByText("חזרה לרשימה")).toBeTruthy();
  });

  it("opens the exact conversation from notification query", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getMock).toHaveBeenCalledWith(
        "/support-chat/conv-wa-1/messages",
        expect.objectContaining({ params: { limit: 80 } })
      );
    });
    expect(await screen.findByTestId("support-bubble-outbound")).toBeTruthy();
    expect(
      screen.getByTestId("support-bubble-outbound").getAttribute("data-direction")
    ).toBe("outbound");
    expect(
      screen.getByTestId("support-bubble-inbound").getAttribute("data-direction")
    ).toBe("inbound");
  });

  it("opens guided demo modal from thread header with phone and US connection prefilled", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("admin-send-demo-button")).toBeTruthy();
    fireEvent.click(screen.getByTestId("admin-send-demo-button"));
    const modal = await screen.findByTestId("interactive-demo-send-modal");
    expect(modal.textContent).toContain("שליחת דמו אינטראקטיבי");
    expect(modal.textContent).toContain("דניאל כהן");
    expect(screen.getByTestId("interactive-demo-sender").textContent).toContain(
      "+1 210-944-4809"
    );
    expect(modal.textContent).not.toContain("בחירת דמו קיים");
    expect(modal.textContent).not.toContain("completed");
    expect(modal.textContent).not.toContain("expired");
    expect(screen.getByTestId("interactive-demo-create")).toBeTruthy();
    expect(await screen.findByText("צרו דמו חדש לפני השליחה.")).toBeTruthy();
    expect(screen.getByTestId("interactive-demo-send")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("interactive-demo-send").textContent).toContain(
      "שלח דמו עם תבנית"
    );
    expect(screen.getByTestId("interactive-demo-mode-direct")).toHaveProperty(
      "disabled",
      true
    );
    expect(modal.textContent).toContain("זמין רק בתוך חלון 24 השעות של WhatsApp");
    expect(screen.getByTestId("interactive-demo-button-preview").textContent).toContain(
      "View interactive demo"
    );
  });

  it("enables demo-only inside the 24h window and switches the preview", async () => {
    getMock.mockImplementation((url: string) => {
      if (String(url).includes("/admin/conversations")) {
        return Promise.resolve({
          data: { conversations: [conversation], onlineAgents: [] },
        });
      }
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [inbound], conversation },
        });
      }
      if (String(url).includes("/admin/guided-demos/catalog")) {
        return Promise.resolve({
          data: {
            catalog: { presets: [] },
            delivery: {
              whatsapp: { available: true },
              usSessionWindow: { open: true },
            },
          },
        });
      }
      return Promise.resolve({ data: {} });
    });
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByTestId("admin-send-demo-button"));
    await waitFor(() => {
      expect(screen.getByTestId("interactive-demo-mode-direct")).toHaveProperty(
        "disabled",
        false
      );
    });
    fireEvent.click(screen.getByTestId("interactive-demo-mode-direct"));
    expect(screen.getByTestId("interactive-demo-send").textContent).toContain("שלח דמו");
    expect(screen.getByTestId("interactive-demo-send").textContent).not.toContain("תבנית");
    expect(screen.getByTestId("interactive-demo-direct-preview").textContent).toContain(
      "https://bizuply.com/demo/"
    );
    expect(screen.queryByTestId("interactive-demo-button-preview")).toBeNull();
    expect(screen.getByTestId("interactive-demo-send")).toHaveProperty("disabled", true);
  });

  it("renders an interactive demo card instead of the raw URL", async () => {
    getMock.mockImplementation((url: string) => {
      if (String(url).includes("/admin/conversations")) {
        return Promise.resolve({
          data: { conversations: [conversation], onlineAgents: [] },
        });
      }
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [demoCard], conversation },
        });
      }
      return Promise.resolve({ data: {} });
    });
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );
    const card = await screen.findByTestId("interactive-demo-thread-card");
    expect(card.textContent).toContain("Interactive demo sent");
    expect(card.textContent).toContain("interactive_demo_followup_v2");
    expect(card.textContent).toContain("View interactive demo");
    expect(card.textContent).toContain("Bizuply US");
    expect(card.textContent).toContain("Delivered");
    expect(card.textContent).not.toContain("SHOULD_NOT_RENDER");
    expect(screen.getByTestId("interactive-demo-open").getAttribute("href")).toBe(
      "https://bizuply.com/demo/3cyGi127La8xeOzmVpLswxsbcTJ-D-DrHFjbQmG5uNo"
    );
  });

  it("renders a direct interactive demo card without the raw URL", async () => {
    const directCard = {
      ...demoCard,
      _id: "m-direct",
      text: "https://bizuply.com/demo/SHOULD_NOT_RENDER",
      deliveryStatus: "read",
      metadata: {
        interactiveDemoCard: true,
        interactiveDemoKind: "direct",
        senderLabel: "Bizuply US · +1 210-944-4809",
        demoLink: "https://bizuply.com/demo/3cyGi127La8xeOzmVpLswxsbcTJ-D-DrHFjbQmG5uNo",
      },
    };
    getMock.mockImplementation((url: string) => {
      if (String(url).includes("/admin/conversations")) {
        return Promise.resolve({
          data: { conversations: [conversation], onlineAgents: [] },
        });
      }
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [directCard], conversation },
        });
      }
      return Promise.resolve({ data: {} });
    });
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );
    const card = await screen.findByTestId("interactive-demo-thread-card");
    expect(card.textContent).toContain("Interactive demo sent");
    expect(card.textContent).toContain("Type: Direct message");
    expect(card.textContent).toContain("Bizuply US");
    expect(card.textContent).toContain("Read");
    expect(card.textContent).not.toContain("interactive_demo_followup_v2");
    expect(card.textContent).not.toContain("SHOULD_NOT_RENDER");
    expect(screen.getByTestId("interactive-demo-open").getAttribute("href")).toBe(
      "https://bizuply.com/demo/3cyGi127La8xeOzmVpLswxsbcTJ-D-DrHFjbQmG5uNo"
    );
  });

  it("opens the send-template drawer for the conversation connection", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByTestId("support-send-template"));
    const drawer = await screen.findByTestId("support-template-drawer");
    expect(drawer.textContent).toContain("US_MANAGED");
    expect(await screen.findByText("partner_agreement_followup_v1")).toBeTruthy();
    expect(drawer.textContent).toContain("en_US");
    expect(drawer.textContent).toContain("UTILITY");
    expect(drawer.textContent).toContain("APPROVED");
    expect(screen.getByTestId("support-template-preview").textContent).toContain(
      "partner agreement"
    );
  });

  it("requires a template when the 24h window is closed", async () => {
    getMock.mockImplementation((url: string) => {
      if (String(url).includes("/admin/conversations")) {
        return Promise.resolve({
          data: { conversations: [conversation], onlineAgents: [] },
        });
      }
      if (String(url).includes("/whatsapp-context")) {
        return Promise.resolve({
          data: {
            sessionWindowOpen: false,
            requiresTemplate: true,
            managedConnectionId: "US_MANAGED",
          },
        });
      }
      if (String(url).includes("/whatsapp-templates")) {
        return Promise.resolve({
          data: { managedConnectionId: "US_MANAGED", templates: [] },
        });
      }
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [inbound], conversation, hasMore: false },
        });
      }
      return Promise.resolve({ data: {} });
    });
    render(
      <MemoryRouter initialEntries={["/admin/support-chat?c=conv-wa-1"]}>
        <Routes>
          <Route path="/admin/support-chat" element={<AdminSupportChat />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByTestId("support-window-closed")).toBeTruthy();
    expect(screen.getByTestId("support-chat-composer")).toHaveProperty(
      "disabled",
      true
    );
    expect(screen.getByTestId("support-window-closed").textContent).toContain(
      "Send Template"
    );
  });
});
