import { describe, expect, it } from "vitest";
import { presetToServerWindow } from "./useMetaAdsDateRange";

describe("presetToServerWindow", () => {
  it("maps the shared UI presets to server windows", () => {
    expect(presetToServerWindow("today")).toBe("TODAY");
    expect(presetToServerWindow("last_7")).toBe("LAST_7D");
    expect(presetToServerWindow("last_30")).toBe("LAST_30D");
    expect(presetToServerWindow("custom")).toBe("CUSTOM");
  });
});
