/** Shared booking-form email normalize + validate (public BookingWidget / ClientCalendar). */

import i18n from "../i18n/i18n";

export const BOOKING_EMAIL_ERROR_HE = i18n.t("leftover.errors.emailInvalid");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BookingEmailParseResult =
  | { ok: true; email: string; error?: undefined }
  | { ok: false; email?: undefined; error: string };

export function normalizeBookingEmail(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isValidBookingEmail(value: unknown): boolean {
  const email = normalizeBookingEmail(value);
  if (!email) return false;
  return EMAIL_RE.test(email);
}

export function parseRequiredBookingEmail(
  value: unknown
): BookingEmailParseResult {
  const email = normalizeBookingEmail(value);
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: BOOKING_EMAIL_ERROR_HE };
  }
  return { ok: true, email };
}