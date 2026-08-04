import { describe, expect, it } from "vitest";
import {
  BOOKING_EMAIL_ERROR_HE,
  normalizeBookingEmail,
  parseRequiredBookingEmail,
} from "./bookingEmail";

describe("bookingEmail", () => {
  it("normalizes lowercase", () => {
    expect(normalizeBookingEmail("  A@B.COM ")).toBe("a@b.com");
  });

  it("requires valid email", () => {
    const empty = parseRequiredBookingEmail("");
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error).toBe(BOOKING_EMAIL_ERROR_HE);
    const bad = parseRequiredBookingEmail("bad");
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toBe(BOOKING_EMAIL_ERROR_HE);
    expect(parseRequiredBookingEmail("ok@ex.com")).toEqual({
      ok: true,
      email: "ok@ex.com",
    });
  });
});