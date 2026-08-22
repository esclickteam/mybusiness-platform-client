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

vi.mock("../../utils/adminSupportAlerts", () => ({
  notifyAdminSupportEvent: vi.fn(async () => null),
}));

const conversation = {
  _id: "conv-wa-1",
  name: "דניאל כהן",
  phone: "972501234567",
  channel: "whatsapp",
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
});
