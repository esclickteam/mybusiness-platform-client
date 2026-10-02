import type {
  AnalyticsTemplateRow,
  WhatsAppPerformanceView,
} from "../../../../../api/whatsappAnalyticsApi";

export function metaSent(view: WhatsAppPerformanceView) {
  return view.meta.messaging.available ? view.meta.messaging.sent : null;
}

export function metaDelivered(view: WhatsAppPerformanceView) {
  return view.meta.messaging.available ? view.meta.messaging.delivered : null;
}

export function webhookFailed(view: WhatsAppPerformanceView) {
  return view.local.available ? view.local.failed : null;
}

/** Meta totals and webhook totals are never added together. */
export function separatedTotals(view: WhatsAppPerformanceView) {
  return {
    metaSent: metaSent(view),
    metaDelivered: metaDelivered(view),
    webhookSent: view.local.available ? view.local.sent : null,
    webhookFailed: webhookFailed(view),
  };
}

export function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: Array<Array<string | number | null>>) {
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function templateMatches(
  row: AnalyticsTemplateRow,
  search: string,
  category: string
) {
  const query = search.trim().toLowerCase();
  const nameOk = !query || row.name.toLowerCase().includes(query);
  const categoryOk =
    !category || category === "all" || row.category.toUpperCase() === category;
  return nameOk && categoryOk;
}

export function clickLabel(row: AnalyticsTemplateRow) {
  if (!row.clicks?.available) return null;
  return {
    total: row.clicks.total,
    unique: row.clicks.unique,
    items: row.clicks.items || [],
  };
}
