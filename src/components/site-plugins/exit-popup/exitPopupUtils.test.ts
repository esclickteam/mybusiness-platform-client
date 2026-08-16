import { afterEach, describe, expect, it } from "vitest";

import {
  markExitPopupSeen,
  wasExitPopupSeenRecently,
} from "./exitPopupUtils";

describe("exit popup persistence", () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("does not permanently lock the popup when showOncePerDays is 0", () => {
    markExitPopupSeen("site-a");
    expect(wasExitPopupSeenRecently("site-a", 0)).toBe(true);
    sessionStorage.clear();
    expect(wasExitPopupSeenRecently("site-a", 0)).toBe(false);
  });

  it("still suppresses repeats within the configured day window", () => {
    markExitPopupSeen("site-b");
    expect(wasExitPopupSeenRecently("site-b", 7)).toBe(true);
  });
});
