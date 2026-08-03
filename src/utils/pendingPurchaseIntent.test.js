import { beforeEach, describe, expect, it } from "vitest";
import {
  PENDING_PURCHASE_INTENT_KEY,
  clearPendingPurchaseIntent,
  loadPendingPurchaseIntent,
  savePendingPurchaseIntent,
} from "./pendingPurchaseIntent";

describe("pendingPurchaseIntent", () => {
  beforeEach(() => sessionStorage.clear());

  it("stores only the approved identifier fields", () => {
    savePendingPurchaseIntent(
      {
        serviceKey: "managed_service",
        purchaseMode: "bundle",
        selectedPlanKey: "monthly",
        selectedAddOnKeys: ["addon"],
        quantities: { addon: 2 },
        returnPath: "/pricing",
        amount: 123,
        currency: "ils",
        priceId: "price_secret",
        userId: "stale-user",
      },
      sessionStorage,
      1_000
    );

    const raw = JSON.parse(
      sessionStorage.getItem(PENDING_PURCHASE_INTENT_KEY)
    );
    expect(Object.keys(raw).sort()).toEqual(
      [
        "createdAt",
        "purchaseMode",
        "quantities",
        "returnPath",
        "selectedAddOnKeys",
        "selectedPlanKey",
        "serviceKey",
      ].sort()
    );
    expect(raw).not.toHaveProperty("userId");
    expect(raw).not.toHaveProperty("amount");
  });

  it("expires and clears an intent after 30 minutes", () => {
    savePendingPurchaseIntent(
      { serviceKey: "service", purchaseMode: "standalone" },
      sessionStorage,
      1_000
    );
    expect(loadPendingPurchaseIntent(sessionStorage, 1_801_001)).toBeNull();
    expect(sessionStorage.getItem(PENDING_PURCHASE_INTENT_KEY)).toBeNull();
  });

  it("loads a valid intent and can clear it", () => {
    savePendingPurchaseIntent(
      { serviceKey: "service", purchaseMode: "standalone" },
      sessionStorage,
      1_000
    );
    expect(loadPendingPurchaseIntent(sessionStorage, 2_000)?.serviceKey).toBe(
      "service"
    );
    clearPendingPurchaseIntent(sessionStorage);
    expect(loadPendingPurchaseIntent(sessionStorage, 2_000)).toBeNull();
  });
});
