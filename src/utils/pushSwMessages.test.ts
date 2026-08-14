import { describe, expect, it } from "vitest";
import { SW_SCRIPT_VERSION, SW_URL, shouldForceRebindOnSwMessage } from "./pushSwMessages";

describe("push SW message handling", () => {
  it("does not unsubscribe/rebind when a new SW activates", () => {
    expect(shouldForceRebindOnSwMessage("SW_ACTIVATED")).toBe(false);
    expect(shouldForceRebindOnSwMessage("PUSH_SUBSCRIPTION_NEEDED")).toBe(false);
  });

  it("rebinds only after the browser reports endpoint rotation", () => {
    expect(shouldForceRebindOnSwMessage("PUSH_SUBSCRIPTION_CHANGED")).toBe(true);
  });

  it("cache-busts the service worker script", () => {
    expect(SW_SCRIPT_VERSION).toBe(9);
    expect(SW_URL).toBe("/service-worker.js?v=9");
  });
});
