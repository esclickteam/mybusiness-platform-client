import { describe, expect, it } from "vitest";
import {
  collectionMethodHe,
  dataClassHe,
  engineIdHe,
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
    expect(collectionMethodHe("gsc_impressions")).toContain("רשמים");
  });

  it("maps the five monitored engines", () => {
    expect(engineIdHe("openai")).toBe("ChatGPT");
    expect(engineIdHe("gemini")).toBe("Gemini API");
    expect(engineIdHe("google_ai_overviews")).toBe("AI Overviews / AI Mode");
    expect(engineIdHe("perplexity")).toBe("Perplexity");
    expect(engineIdHe("claude")).toBe("Claude");
  });

  it("maps data class / priority / severity", () => {
    expect(dataClassHe("measurement")).toBe("מדידת אמת");
    expect(dataClassHe("test_fixture")).toBe("נתוני בדיקה");
    expect(priorityHe("critical")).toBe("קריטי");
    expect(severityHe("warning")).toBe("אזהרה");
  });
});
