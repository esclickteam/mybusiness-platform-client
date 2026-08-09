const heNumber = new Intl.NumberFormat("he-IL");

const heDate = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
});

const heDateTime = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatHeNumber(value: number) {
  return heNumber.format(Number.isFinite(value) ? value : 0);
}

export function formatHeDate(iso: string | null | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return heDate.format(date);
}

export function formatHeDateTime(iso: string | null | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return heDateTime.format(date);
}

export type UsageSeverity = "normal" | "warn" | "critical" | "exhausted";

export function getUsageSeverity(percentage: number | null | undefined): UsageSeverity {
  const pct = Number(percentage);
  if (!Number.isFinite(pct)) return "normal";
  if (pct >= 100) return "exhausted";
  if (pct >= 95) return "critical";
  if (pct >= 80) return "warn";
  return "normal";
}
