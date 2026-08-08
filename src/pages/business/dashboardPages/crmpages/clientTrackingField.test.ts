import { describe, expect, it } from "vitest";
import {
  latestTrackingValue,
  normalizeTrackingFieldValue,
} from "./clientTrackingField";

describe("normalizeTrackingFieldValue", () => {
  it("keeps structured tracking entries sorted by date/time", () => {
    const normalized = normalizeTrackingFieldValue({
      entries: [
        { id: "b", date: "2026-08-08", time: "10:00", value: "72" },
        { id: "a", date: "2026-08-01", time: "09:00", value: "74" },
      ],
    });

    expect(normalized.entries.map((entry) => entry.value)).toEqual([
      "74",
      "72",
    ]);
    expect(latestTrackingValue(normalized)).toBe("72");
  });

  it("migrates a plain number into a tracking entry", () => {
    const normalized = normalizeTrackingFieldValue(71.5);
    expect(normalized.entries).toHaveLength(1);
    expect(latestTrackingValue(normalized)).toBe("71.5");
  });

  it("accepts table-shaped date/time/value payloads", () => {
    const normalized = normalizeTrackingFieldValue({
      columns: ["תאריך", "שעה", "משקל"],
      rows: [
        ["2026-07-01", "08:30", "75"],
        ["2026-07-15", "08:45", "73"],
      ],
    });

    expect(normalized.entries).toHaveLength(2);
    expect(latestTrackingValue(normalized)).toBe("73");
  });
});
