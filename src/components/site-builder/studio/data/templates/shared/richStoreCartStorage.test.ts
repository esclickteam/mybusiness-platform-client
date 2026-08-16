import { describe, expect, it } from "vitest";

import {
  loadRichStoreCart,
  normalizeRichStoreCartItems,
  persistRichStoreCart,
  richStoreCartKey,
  serializeRichStoreCart,
} from "./richStoreCartStorage";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
    data,
  };
}

const hat = {
  id: "hat-1",
  productId: "hat-1",
  name: "QA Hat wbpr16f",
  price: 39,
  image: "https://example.com/hat.jpg",
  qty: 1,
};

describe("richStoreCartStorage", () => {
  it("loads an empty cart when JSON is corrupt", () => {
    const storage = memoryStorage({
      [richStoreCartKey("biz-a")]: "{not-json",
    });
    expect(loadRichStoreCart("biz-a", storage)).toEqual([]);
  });

  it("loads an empty cart when stored value is not an array", () => {
    const storage = memoryStorage({
      [richStoreCartKey("biz-a")]: JSON.stringify({ items: [hat] }),
    });
    expect(loadRichStoreCart("biz-a", storage)).toEqual([]);
  });

  it("drops invalid or duplicate lines", () => {
    expect(
      normalizeRichStoreCartItems([
        { productId: "hat-1", name: "QA Hat wbpr16f", price: 39, quantity: 2 },
        hat,
        { ...hat, name: "" },
        { ...hat, productId: "" },
        { ...hat, price: "nope" },
        hat,
      ]),
    ).toMatchObject([{ id: "hat-1", productId: "hat-1", name: "QA Hat wbpr16f", qty: 2 }]);
  });

  it("accepts checkout quantity and keeps qty in sync", () => {
    const [item] = normalizeRichStoreCartItems([
      { productId: "hat-1", name: "QA Hat", price: 39, quantity: 3 },
    ]);
    expect(item?.qty).toBe(3);
    expect(serializeRichStoreCart([item!])[0].quantity).toBe(3);
    expect(serializeRichStoreCart([item!])[0].qty).toBe(3);
  });

  it("does not persist or load without a business id", () => {
    const storage = memoryStorage();
    expect(persistRichStoreCart("", [hat], storage)).toBe(false);
    expect(persistRichStoreCart("   ", [hat], storage)).toBe(false);
    expect(Object.keys(storage.data)).toEqual([]);
    expect(loadRichStoreCart("", storage)).toEqual([]);
  });

  it("keeps business A cart isolated from business B", () => {
    const storage = memoryStorage();
    persistRichStoreCart("biz-a", [hat], storage);
    persistRichStoreCart(
      "biz-b",
      [{ ...hat, id: "mug-1", productId: "mug-1", name: "QA Mug" }],
      storage,
    );

    expect(loadRichStoreCart("biz-a", storage).map((item) => item.name)).toEqual([
      "QA Hat wbpr16f",
    ]);
    expect(loadRichStoreCart("biz-b", storage).map((item) => item.name)).toEqual([
      "QA Mug",
    ]);
    expect(storage.data[richStoreCartKey("biz-a")]).not.toContain("QA Mug");
    expect(storage.data[richStoreCartKey("biz-b")]).not.toContain("QA Hat");
  });
});
