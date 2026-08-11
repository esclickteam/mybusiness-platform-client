import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

const apiPostMock = vi.fn();
const handlers = new Map();

const socketMock = {
  connected: true,
  on: vi.fn((event, handler) => {
    const list = handlers.get(event) || [];
    list.push(handler);
    handlers.set(event, list);
  }),
  off: vi.fn((event, handler) => {
    const list = handlers.get(event) || [];
    handlers.set(
      event,
      list.filter((h) => h !== handler)
    );
  }),
  emit: vi.fn(),
};

vi.mock("@/api", () => ({
  default: {
    post: (...args) => apiPostMock(...args),
  },
}));

vi.mock("../context/socketContext", () => ({
  useSocket: () => socketMock,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k) => k,
    i18n: { language: "he" },
  }),
}));

import useAiInsights from "./useAiInsights";

const BID = "6a79c2ab99b8637bc15a4573";

function emitSocket(event) {
  const list = handlers.get(event) || [];
  list.forEach((handler) => handler({}));
}

async function waitForBaseline() {
  await waitFor(() => {
    expect(apiPostMock.mock.calls.length).toBeGreaterThan(0);
  });
  await new Promise((r) => setTimeout(r, 450));
  return apiPostMock.mock.calls.length;
}

describe("useAiInsights realtime", () => {
  beforeEach(() => {
    handlers.clear();
    apiPostMock.mockReset();
    socketMock.on.mockClear();
    socketMock.off.mockClear();
    socketMock.emit.mockClear();
    apiPostMock.mockResolvedValue({
      data: [{ id: "untreated_leads", priority: "high" }],
    });
  });

  it("refetches on crmLeadCreated without waiting for F5", async () => {
    renderHook(() => useAiInsights(BID));
    const baseline = await waitForBaseline();

    act(() => {
      emitSocket("crmLeadCreated");
    });

    await waitFor(() => {
      expect(apiPostMock.mock.calls.length).toBeGreaterThan(baseline);
    });
  });

  it("refetches on crmLeadUpdated", async () => {
    renderHook(() => useAiInsights(BID));
    const baseline = await waitForBaseline();

    act(() => {
      emitSocket("crmLeadUpdated");
    });

    await waitFor(() => {
      expect(apiPostMock.mock.calls.length).toBeGreaterThan(baseline);
    });
  });

  it("refetches on bizuply:leads-updated window event", async () => {
    renderHook(() => useAiInsights(BID));
    const baseline = await waitForBaseline();

    act(() => {
      window.dispatchEvent(new CustomEvent("bizuply:leads-updated"));
    });

    await waitFor(() => {
      expect(apiPostMock.mock.calls.length).toBeGreaterThan(baseline);
    });
  });
});
