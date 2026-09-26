/** Parse free-form ILS input into minor units (agorot). */
export function parseIlsInputToMinor(raw: string): number | null {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;
  if (/[^\d.\s]/.test(trimmed)) return null;
  const n = Number(trimmed.replace(/\s/g, ""));
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return Math.round(n * 100);
}

export function minorToIlsInput(minor: number): string {
  const n = Math.round(Number(minor) || 0) / 100;
  if (!Number.isFinite(n) || n <= 0) return "";
  return Number.isInteger(n) ? String(n) : String(n);
}

export type AmountValidationCode =
  | "required"
  | "not_numeric"
  | "not_positive"
  | "below_minimum";

export function validateAmountInput(
  raw: string,
  { minMinor = 1 }: { minMinor?: number } = {}
): { ok: true; minor: number } | { ok: false; code: AmountValidationCode } {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return { ok: false, code: "required" };
  if (/[^\d.\s]/.test(trimmed)) return { ok: false, code: "not_numeric" };
  const n = Number(trimmed.replace(/\s/g, ""));
  if (!Number.isFinite(n)) return { ok: false, code: "not_numeric" };
  if (n <= 0) return { ok: false, code: "not_positive" };
  const minor = Math.round(n * 100);
  if (minor < minMinor) return { ok: false, code: "below_minimum" };
  return { ok: true, minor };
}
