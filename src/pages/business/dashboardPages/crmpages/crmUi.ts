export function periodChange(
  current: number,
  previous: number | null | undefined
): { label: string; dir: "up" | "down" | "flat" } | null {
  if (previous == null || Number.isNaN(Number(previous))) return null;
  const prev = Number(previous);
  const curr = Number(current) || 0;
  if (prev === 0 && curr === 0) return { label: "0%", dir: "flat" };
  if (prev === 0) return null;
  const pct = ((curr - prev) / prev) * 100;
  const rounded = Math.round(pct * 10) / 10;
  if (rounded === 0) return { label: "0%", dir: "flat" };
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    dir: rounded > 0 ? "up" : "down",
  };
}

export function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows: Array<Array<unknown>>) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadText(filename: string, content: string, type = "text/csv;charset=utf-8") {
  downloadBlob(filename, new Blob([content], { type }));
}
