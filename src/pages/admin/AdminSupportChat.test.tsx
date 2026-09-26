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
      if (String(url).includes("/messages")) {
        return Promise.resolve({
          data: { messages: [outbound, inbound], conversation },
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
        "/support-chat/conv-wa-1/messages"
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
    expect(await screen.findByTestId("admin-send-demo-modal")).toBeTruthy();
    expect(screen.getByTestId("demo-prefill-name").textContent).toBe("דניאל כהן");
    expect(screen.getByTestId("demo-prefill-phone").textContent).toBe("0501234567");
    expect(screen.getByTestId("demo-prefill-connection").textContent).toBe(
      "US_MANAGED"
    );
  });
});
