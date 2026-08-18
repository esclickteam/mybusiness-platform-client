import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
const put = vi.fn();

vi.mock("@api", () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

import { applyClientSessionConsumption } from "./clientSessionConsumption";

const BUSINESS = "64f000000000000000000001";
const CLIENT = "64f0000000000000000000c1";

function clientWithCounters(treatmentsLeft: number, sessionsDone: number) {
  return {
    data: {
      _id: CLIENT,
      customTabs: [
        {
          id: "client_data_values",
          title: "נתוני לקוח",
          fields: [
            { id: "client_data_treatments_left", key: "treatments_left", label: "כמות טיפולים", type: "number", value: treatmentsLeft },
            { id: "client_data_sessions_done", key: "sessions_done", label: "מפגשים שבוצעו", type: "number", value: sessionsDone },
          ],
        },
      ],
    },
  };
}

function savedFields() {
  const body = put.mock.calls[0][1] as { customTabs: Array<{ id: string; fields: Array<{ key: string; value: unknown }> }> };
  const tab = body.customTabs.find((t) => t.id === "client_data_values");
  return Object.fromEntries((tab?.fields || []).map((f) => [f.key, f.value]));
}

beforeEach(() => {
  get.mockReset();
  put.mockReset();
  put.mockResolvedValue({ data: { success: true } });
});

describe("applyClientSessionConsumption", () => {
  it("reads the single client, not the list that omits custom tab fields", async () => {
    get.mockResolvedValue(clientWithCounters(5, 0));

    await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 1 });

    expect(get).toHaveBeenCalledWith(`/crm-clients/item/${CLIENT}`);
    expect(get).not.toHaveBeenCalledWith(`/crm-clients/${BUSINESS}`);
  });

  it("decrements the remaining treatments by exactly one and keeps the rest", async () => {
    get.mockResolvedValue(clientWithCounters(5, 0));

    const result = await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 1 });

    expect(savedFields()).toEqual({ treatments_left: 4, sessions_done: 1 });
    expect(result?.treatmentsLeft).toBe(4);
    expect(result?.sessionsDone).toBe(1);
  });

  it("never wipes a stored balance down to zero", async () => {
    get.mockResolvedValue(clientWithCounters(9, 2));

    await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 1 });

    expect(savedFields().treatments_left).toBe(8);
    expect(savedFields().sessions_done).toBe(3);
  });

  it("gives a treatment back when a fulfilment is undone", async () => {
    get.mockResolvedValue(clientWithCounters(4, 1));

    await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: -1 });

    expect(savedFields()).toEqual({ treatments_left: 5, sessions_done: 0 });
  });

  it("handles the item route's wrapped shape", async () => {
    get.mockResolvedValue({ data: { client: clientWithCounters(3, 1).data } });

    await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 1 });

    expect(savedFields().treatments_left).toBe(2);
  });

  it("does nothing when the client does not match", async () => {
    get.mockResolvedValue({ data: { _id: "someone-else", customTabs: [] } });

    const result = await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 1 });

    expect(result).toBeNull();
    expect(put).not.toHaveBeenCalled();
  });

  it("stays inert without a delta", async () => {
    const result = await applyClientSessionConsumption(BUSINESS, CLIENT, { delta: 0 });

    expect(result).toBeNull();
    expect(get).not.toHaveBeenCalled();
  });
});
