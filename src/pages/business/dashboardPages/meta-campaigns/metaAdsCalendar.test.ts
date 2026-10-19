import { describe, expect, it } from "vitest";
import {
  addCalendarDays,
  daysInMonth,
  previousWindow,
  resolveMetaRange,
  shiftMonth,
  zonedIsoDate,
} from "./metaAdsCalendar";

const JERUSALEM = "Asia/Jerusalem";
const NOON = new Date("2026-10-19T10:00:00Z");

describe("Meta ads calendar windows", () => {
  it("uses the ad account timezone instead of UTC", () => {
    expect(zonedIsoDate(JERUSALEM, new Date("2026-10-18T22:00:00Z"))).toBe("2026-10-19");
    expect(zonedIsoDate("UTC", new Date("2026-10-18T22:00:00Z"))).toBe("2026-10-18");
  });

  it("keeps Meta last 7 days ending yesterday and the default including today", () => {
    const meta = resolveMetaRange("last_7", JERUSALEM, NOON);
    expect(meta).toMatchObject({ since: "2026-10-12", until: "2026-10-18", datePreset: "last_7d", includesToday: false });
    const rolling = resolveMetaRange("rolling_7", JERUSALEM, NOON);
    expect(rolling).toMatchObject({ since: "2026-10-13", until: "2026-10-19", datePreset: null, includesToday: true });
  });

  it("matches the Ads Manager presets around 19 Oct 2026", () => {
    expect(resolveMetaRange("today", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-19", until: "2026-10-19", datePreset: "today" });
    expect(resolveMetaRange("yesterday", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-18", until: "2026-10-18" });
    expect(resolveMetaRange("today_yesterday", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-18", until: "2026-10-19", datePreset: null });
    expect(resolveMetaRange("last_14", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-05", until: "2026-10-18", datePreset: "last_14d" });
    expect(resolveMetaRange("last_28", JERUSALEM, NOON)).toMatchObject({ since: "2026-09-21", until: "2026-10-18", datePreset: "last_28d" });
    expect(resolveMetaRange("last_30", JERUSALEM, NOON)).toMatchObject({ since: "2026-09-19", until: "2026-10-18", datePreset: "last_30d" });
    expect(resolveMetaRange("this_week", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-18", until: "2026-10-19", datePreset: "this_week_sun_today" });
    expect(resolveMetaRange("last_week", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-11", until: "2026-10-17", datePreset: "last_week_sun_sat" });
    expect(resolveMetaRange("this_month", JERUSALEM, NOON)).toMatchObject({ since: "2026-10-01", until: "2026-10-19", datePreset: "this_month" });
    expect(resolveMetaRange("last_month", JERUSALEM, NOON)).toMatchObject({ since: "2026-09-01", until: "2026-09-30", datePreset: "last_month" });
    expect(resolveMetaRange("maximum", JERUSALEM, NOON).datePreset).toBe("maximum");
  });

  it("walks months, years, and a leap day without selecting an inverted range", () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(addCalendarDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addCalendarDays("2024-02-29", 1)).toBe("2024-03-01");
    const custom = resolveMetaRange("custom", JERUSALEM, NOON, { since: "2026-10-18", until: "2026-10-12" });
    expect(custom.since).toBe("2026-10-18");
    expect(custom.until).toBe("2026-10-18");
    expect(resolveMetaRange("custom", JERUSALEM, NOON, { since: "2026-11-02", until: "2026-11-05" }).until).toBe("2026-10-19");
  });

  it("builds a previous window of the same length without overlapping", () => {
    expect(previousWindow("2026-10-13", "2026-10-19")).toEqual({ since: "2026-10-06", until: "2026-10-12" });
  });
});
