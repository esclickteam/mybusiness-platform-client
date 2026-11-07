import { describe, expect, it } from "vitest";
import {
  collectionMethodHe,
  dataClassHe,
  priorityHe,
  sampleSizeHe,
  severityHe,
} from "./geoLabels";

describe("geoLabels", () => {
  it("formats sample size in Hebrew", () => {
    expect(sampleSizeHe(12)).toBe("מתוך 12 מדידות");
    expect(sampleSizeHe(0)).toBe("מתוך 0 מדידות");
  });

  it("maps collection methods to Hebrew", () => {
    expect(collectionMethodHe("manual_paste")).toContain("ידנית");
    expect(collectionMethodHe("api_grounded")).toContain("API");
  });

  it("maps data class / priority / severity", () => {
    expect(dataClassHe("measurement")).toBe("מדידת אמת");
    expect(dataClassHe("test_fixture")).toBe("נתוני בדיקה");
    expect(priorityHe("critical")).toBe("קריטי");
    expect(severityHe("warning")).toBe("אזהרה");
  });
});
