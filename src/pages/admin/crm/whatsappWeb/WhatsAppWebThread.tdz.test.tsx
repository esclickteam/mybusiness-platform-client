import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WhatsAppWebThread from "./WhatsAppWebThread";

vi.mock("../../../../api/adminCrmApi", () => ({
  default: {
    whatsappMessages: vi.fn().mockResolvedValue({ data: { messages: [] } }),
    whatsappThreadMessages: vi.fn().mockResolvedValue({
      data: { messages: [], thread: null },
    }),
    whatsapp: vi.fn().mockResolvedValue({
      data: { bizuplyManaged: { templates: [], sender: {} } },
    }),
    whatsappRead: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("../../../../api/adminManagedWhatsAppApi", () => ({
  getAdminManagedWhatsAppStatus: vi.fn().mockResolvedValue({ connections: [] }),
}));

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ socket: null }),
}));

vi.mock("./WhatsAppMessageComposer", () => ({
  WhatsAppMessageComposer: () => <div data-testid="composer" />,
}));

describe("WhatsAppWebThread initialization order", () => {
  it("mounts without a TDZ ReferenceError from sendFromReady", () => {
    expect(() =>
      render(
        <MemoryRouter>
          <WhatsAppWebThread
            canSend
            canTemplates
            onBanner={() => undefined}
          />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
