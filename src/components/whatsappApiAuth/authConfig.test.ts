import { afterEach, describe, expect, it, vi } from "vitest";

const apiGet = vi.fn();

vi.mock("../../api", () => ({
  default: { get: (...args: unknown[]) => apiGet(...args), defaults: { baseURL: "https://api.test/api" } },
}));

import {
  fetchWhatsAppApiAuthConfig,
  isWhatsAppApiSelfServe,
  resetWhatsAppApiAuthConfigForTests,
  type WhatsAppApiAuthConfig,
} from "./authConfig";

afterEach(() => {
  resetWhatsAppApiAuthConfigForTests();
  vi.clearAllMocks();
});

describe("isWhatsAppApiSelfServe", () => {
  it("keeps checkout visible until the server explicitly closes self-serve", () => {
    const loading: WhatsAppApiAuthConfig = { loaded: false, selfServe: true, providers: [], turnstileSiteKey: null };
    const open: WhatsAppApiAuthConfig = { loaded: true, selfServe: true, providers: [], turnstileSiteKey: null };
    const closed: WhatsAppApiAuthConfig = { loaded: true, selfServe: false, providers: [], turnstileSiteKey: null };
    expect(isWhatsAppApiSelfServe(loading)).toBe(true);
    expect(isWhatsAppApiSelfServe(open)).toBe(true);
    expect(isWhatsAppApiSelfServe(closed)).toBe(false);
  });
});

describe("fetchWhatsAppApiAuthConfig", () => {
  it("treats a missing selfServe flag as open checkout", async () => {
    apiGet.mockResolvedValue({ data: { providers: ["google"] } });
    await expect(fetchWhatsAppApiAuthConfig()).resolves.toMatchObject({ loaded: true, selfServe: true, providers: ["google"] });
  });

  it("honors an explicit self-serve kill switch", async () => {
    apiGet.mockResolvedValue({ data: { selfServe: false, providers: [] } });
    await expect(fetchWhatsAppApiAuthConfig()).resolves.toMatchObject({ loaded: true, selfServe: false });
  });

  it("keeps self-serve open when availability cannot be reached", async () => {
    apiGet.mockRejectedValue(new Error("offline"));
    await expect(fetchWhatsAppApiAuthConfig()).resolves.toEqual({
      loaded: true,
      selfServe: true,
      providers: [],
      turnstileSiteKey: null,
    });
  });
});
