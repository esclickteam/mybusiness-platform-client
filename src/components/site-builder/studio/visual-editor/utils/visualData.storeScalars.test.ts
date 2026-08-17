import { describe, expect, it } from "vitest";

import {
  copyStoreVisualScalars,
  hasStoreVisualScalars,
  syncStoreTextScalar,
} from "./visualData";

describe("store visual scalars", () => {
  it("copies hero text so collection-only snapshots still persist it", () => {
    const copied = copyStoreVisualScalars(
      { __content: { heroTitle: { text: "AS-A" } } },
      { heroTitle: "AS-A", heroImage: "" },
    );
    expect(copied.heroTitle).toBe("AS-A");
    expect(copied.heroImage).toBeUndefined();
    expect(hasStoreVisualScalars(copied)).toBe(true);
  });

  it("syncs a live heroTitle edit onto the store scalar", () => {
    const next = syncStoreTextScalar(
      { heroTitle: "뿯ֽ뿯ֽ뿯ֽ", __content: {} },
      "heroTitle",
      "AS-B",
    );
    expect(next.heroTitle).toBe("AS-B");
  });
});
