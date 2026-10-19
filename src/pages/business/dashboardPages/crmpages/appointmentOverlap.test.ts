import { describe, expect, it } from "vitest";
import { appointmentsOverlap, findAppointmentConflict } from "./appointmentOverlap";

describe("appointmentOverlap", () => {
  it("detects overlapping times on the same day", () => {
    expect(
      appointmentsOverlap(
        { date: "2026-10-19", time: "10:00", duration: 60 },
        { date: "2026-10-19", time: "10:30", duration: 30 }
      )
    ).toBe(true);
  });

  it("ignores a record compared with itself", () => {
    expect(
      appointmentsOverlap(
        { _id: "a", date: "2026-10-19", time: "10:00", duration: 60 },
        { _id: "a", date: "2026-10-19", time: "10:00", duration: 60 }
      )
    ).toBe(false);
  });

  it("finds the first conflicting appointment", () => {
    const hit = findAppointmentConflict(
      { _id: "new", date: "2026-10-19", time: "11:00", duration: 45 },
      [
        { _id: "1", date: "2026-10-18", time: "11:00", duration: 45 },
        { _id: "2", date: "2026-10-19", time: "11:15", duration: 30 },
      ]
    );
    expect(hit?._id).toBe("2");
  });
});
