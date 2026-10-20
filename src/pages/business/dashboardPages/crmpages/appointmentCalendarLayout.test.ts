import { describe, expect, it } from "vitest";
import {
  getWeekDates,
  layoutDayEvents,
  minutesToTime,
  parseTimeMinutes,
  shiftAnchor,
  snapMinutes,
  appointmentTone,
} from "./appointmentCalendarLayout";

describe("appointmentCalendarLayout", () => {
  it("packs overlapping events into adjacent columns", () => {
    const laid = layoutDayEvents([
      { id: "a", date: "2026-10-19", startMinutes: 10 * 60, endMinutes: 11 * 60 },
      { id: "b", date: "2026-10-19", startMinutes: 10 * 60 + 30, endMinutes: 11 * 60 + 30 },
    ]);
    expect(laid).toHaveLength(2);
    expect(Math.max(...laid.map((item) => item.columns))).toBe(2);
    expect(new Set(laid.map((item) => item.column)).size).toBe(2);
  });

  it("keeps sequential events in a single column", () => {
    const laid = layoutDayEvents([
      { id: "a", date: "2026-10-19", startMinutes: 9 * 60, endMinutes: 10 * 60 },
      { id: "b", date: "2026-10-19", startMinutes: 10 * 60, endMinutes: 11 * 60 },
    ]);
    expect(laid.every((item) => item.columns === 1 && item.column === 0)).toBe(true);
  });

  it("snaps and formats times", () => {
    expect(parseTimeMinutes("09:15")).toBe(9 * 60 + 15);
    expect(minutesToTime(9 * 60 + 15)).toBe("09:15");
    expect(snapMinutes(9 * 60 + 7)).toBe(9 * 60);
    expect(snapMinutes(9 * 60 + 8)).toBe(9 * 60 + 15);
  });

  it("shifts week and day anchors", () => {
    const monday = new Date("2026-10-19T12:00:00");
    expect(getWeekDates(monday)[0]).toBe("2026-10-18");
    expect(shiftAnchor(monday, "day", 1).getDate()).toBe(20);
    expect(shiftAnchor(monday, "week", -1).getDate()).toBe(12);
  });

  it("maps appointment status to calendar tone", () => {
    expect(appointmentTone({ completed: true })).toBe("done");
    expect(appointmentTone({ paid: true })).toBe("paid");
    expect(appointmentTone({ status: "cancelled" })).toBe("busy");
    expect(appointmentTone({ status: "scheduled" })).toBe("open");
  });
});
