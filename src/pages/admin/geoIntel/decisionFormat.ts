/** Display helpers — never coerce unmeasured values to 0. */

export function formatUnmeasured(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(Number(v))) return "לא נמדד";
  return String(v);
}

export function computeDisplayPct(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(Number(v))) return "לא נמדד";
  return `${(Number(v) * 100).toFixed(1)}%`;
}
