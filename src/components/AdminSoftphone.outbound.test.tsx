import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const telnyx = vi.hoisted(() => {
  const handlers: Record<string, (payload?: unknown) => void> = {};
  const invites: Array<{ opts: Record<string, unknown>; call: any }> = [];

  class TelnyxRTC {
    on(event: string, cb: (payload?: unknown) => void) {
      handlers[event] = cb;
      return this;
    }
    connect() {
      queueMicrotask(() => handlers["telnyx.ready"]?.());
    }
    enableMicrophone() {}
    disconnect() {}
    newCall(opts: Record<string, unknown>) {
      const call = {
        state: "new",
        cause: "",
        sipCode: "",
        id: `call-${invites.length + 1}`,
        hangup() {
          this.state = "hangup";
        },
      };
      invites.push({ opts, call });
      return call;
    }
  }

  return { handlers, invites, TelnyxRTC };
});

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@telnyx/webrtc", () => ({
  TelnyxRTC: telnyx.TelnyxRTC,
  default: telnyx.TelnyxRTC,
}));

vi.mock("../api", () => ({
  default: {
    get: (...args: unknown[]) => api.get(...args),
    post: (...args: unknown[]) => api.post(...args),
    patch: (...args: unknown[]) => api.patch(...args),
    defaults: { headers: { common: {} }, baseURL: "http://localhost" },
  },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ socket: null, user: { _id: "admin-1" } }),
}));

vi.mock("../utils/softphoneMicrophone", () => ({
  ensureMicrophoneAccess: vi.fn(async () => {}),
  assertMicrophoneNotDenied: vi.fn(async () => {}),
  markMicrophoneGranted: vi.fn(),
}));

vi.mock("../utils/softphoneHoldMusic", () => ({
  startHoldMusic: vi.fn(),
  stopHoldMusic: vi.fn(),
}));

import AdminSoftphone, { disconnectSoftphoneVoip } from "./AdminSoftphone";
import {
  clearActiveSoftphoneCall,
  setSoftphoneOpen,
} from "../utils/adminSoftphoneStore";

function renderDialer() {
  setSoftphoneOpen(true);
  return render(
    <MemoryRouter>
      <AdminSoftphone launcher="hidden" />
    </MemoryRouter>
  );
}

describe("AdminSoftphone outbound dial", () => {
  beforeEach(() => {
    telnyx.invites.length = 0;
    for (const key of Object.keys(telnyx.handlers)) delete telnyx.handlers[key];
    disconnectSoftphoneVoip();
    clearActiveSoftphoneCall();
    setSoftphoneOpen(true);
    api.get.mockImplementation(async (url: string) => {
      if (url === "/admin/softphone/token") {
        return {
          data: {
            provider: "telnyx",
            login_token: "test-login-token",
            callerId: "+12109444809",
            expiresIn: 3600,
          },
        };
      }
      if (url === "/admin/softphone/status") {
        return {
          data: {
            mode: "voip",
            voipReady: true,
            provider: "telnyx",
            callerId: "+12109444809",
            message: "ready",
          },
        };
      }
      return { data: { calls: [], contacts: [] } };
    });
    api.post.mockImplementation(async (url: string, body?: { toNumber?: string }) => {
      if (url === "/admin/softphone/calls") {
        return { data: { call: { _id: "log-1", toNumber: body?.toNumber } } };
      }
      return { data: {} };
    });
    api.patch.mockResolvedValue({ data: {} });
  });

  it("dials 2109444809 as E.164 and follows Telnyx from ringing to an answered call", async () => {
    renderDialer();

    fireEvent.change(screen.getByPlaceholderText("הזינו מספר לחיוג"), {
      target: { value: "2109444809" },
    });
    fireEvent.click(document.querySelector("[data-softphone-dial]") as HTMLButtonElement);

    await waitFor(() => {
      expect(telnyx.invites).toHaveLength(1);
    });

    expect(telnyx.invites[0].opts.destinationNumber).toBe("+12109444809");
    expect(telnyx.invites[0].opts.callerNumber).toBe("+12109444809");
    expect(api.post).toHaveBeenCalledWith(
      "/admin/softphone/calls",
      expect.objectContaining({
        toNumber: "+12109444809",
        fromNumber: "+12109444809",
        direction: "outbound",
      })
    );
    expect(await screen.findByText("מתחבר...")).toBeTruthy();

    const call = telnyx.invites[0].call;
    act(() => {
      call.state = "trying";
      telnyx.handlers["telnyx.notification"]?.({ call, type: "callUpdate" });
    });
    expect(screen.getByText("מצלצל...")).toBeTruthy();

    act(() => {
      call.state = "active";
      telnyx.handlers["telnyx.notification"]?.({ call, type: "callUpdate" });
    });
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeTruthy();

    act(() => {
      call.state = "hangup";
      call.cause = "NORMAL_CLEARING";
      telnyx.handlers["telnyx.notification"]?.({ call, type: "callUpdate" });
    });

    expect(await screen.findByPlaceholderText("הזינו מספר לחיוג")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(
      (document.querySelector("[data-softphone-dial]") as HTMLButtonElement).disabled
    ).toBe(false);
  });

  it("does not leave the dial button dead after a failed invite", async () => {
    renderDialer();
    fireEvent.change(screen.getByPlaceholderText("הזינו מספר לחיוג"), {
      target: { value: "2109444809" },
    });
    fireEvent.click(document.querySelector("[data-softphone-dial]") as HTMLButtonElement);
    await waitFor(() => expect(telnyx.invites).toHaveLength(1));

    const call = telnyx.invites[0].call;
    act(() => {
      call.state = "hangup";
      call.cause = "unallocated";
      telnyx.handlers["telnyx.notification"]?.({ call });
    });
    expect(await screen.findByRole("alert")).toBeTruthy();

    fireEvent.click(document.querySelector("[data-softphone-dial]") as HTMLButtonElement);
    await waitFor(() => expect(telnyx.invites).toHaveLength(2));
    expect(telnyx.invites[1].opts.destinationNumber).toBe("+12109444809");
  });
});
