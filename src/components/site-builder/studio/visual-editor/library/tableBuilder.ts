export type TableBuildOptions = {
  rows?: number;
  cols?: number;
  withHeader?: boolean;
  variant?: "simple" | "striped" | "dark-header" | "bordered";
};

function clampInt(value: number, min: number, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function hebrewColLabel(index: number) {
  const letters = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
  return letters[index] || `${index + 1}`;
}

export function buildTableHtml(options: TableBuildOptions = {}) {
  const rows = clampInt(options.rows ?? 3, 1, 20, 3);
  const cols = clampInt(options.cols ?? 3, 1, 12, 3);
  const withHeader = options.withHeader !== false;
  const variant = options.variant || "dark-header";

  const headerBg =
    variant === "dark-header" ? "#0f172a" : variant === "striped" ? "#f1f5f9" : "#f8fafc";
  const headerColor = variant === "dark-header" ? "#ffffff" : "#0f172a";
  const border = "1px solid #e2e8f0";

  const headerCells = Array.from({ length: cols }, (_, c) => {
    return `<th style="padding:12px 14px;border:${border};background:${headerBg};color:${headerColor};font-weight:800;text-align:right">עמודה ${hebrewColLabel(c)}</th>`;
  }).join("");

  const bodyRows = Array.from({ length: rows }, (_, r) => {
    const bg =
      variant === "striped" && r % 2 === 1 ? "background:#f8fafc;" : "";
    const cells = Array.from({ length: cols }, (_, c) => {
      return `<td style="padding:12px 14px;border:${border};${bg}font-weight:600;color:#334155;text-align:right">תא ${r + 1}-${c + 1}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  const radius = variant === "bordered" ? "0" : "16px";
  const outerBorder =
    variant === "bordered" ? "2px solid #0f172a" : "1px solid #e2e8f0";

  return `
<div style="width:100%;overflow:auto;border-radius:${radius};border:${outerBorder};background:#fff">
  <table style="width:100%;border-collapse:collapse;direction:rtl;text-align:right;font-family:inherit">
    ${
      withHeader
        ? `<thead><tr>${headerCells}</tr></thead>`
        : ""
    }
    <tbody>${bodyRows}</tbody>
  </table>
</div>
`.trim();
}

export function buildTablePreviewHtml(rows: number, cols: number) {
  const r = clampInt(rows, 1, 8, 3);
  const c = clampInt(cols, 1, 6, 3);
  const cells = Array.from({ length: c }, () => "<span>•</span>").join("");
  const body = Array.from({ length: Math.min(r, 3) }, () => {
    return `<div style="display:grid;grid-template-columns:repeat(${c},1fr);gap:4px;padding:6px;border-bottom:1px solid #e2e8f0;font-size:10px;color:#64748b">${cells}</div>`;
  }).join("");
  return `<div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#fff"><div style="display:grid;grid-template-columns:repeat(${c},1fr);gap:4px;background:#0f172a;color:#fff;padding:6px;font-size:10px;font-weight:800">${Array.from({ length: c }, (_, i) => `<span>${hebrewColLabel(i)}</span>`).join("")}</div>${body}</div>`;
}
