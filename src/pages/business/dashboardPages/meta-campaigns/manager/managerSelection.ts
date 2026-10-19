export type SelectableRow = {
  id: string;
  name: string;
  localOnly?: boolean;
  status?: string;
};

export function toggleSelected(selected: string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
}

export function selectVisible(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

export function bulkLivePlan(rows: SelectableRow[], next: "ACTIVE" | "PAUSED") {
  const eligible = rows.filter((row) => !row.localOnly && /^\d{8,}$/.test(row.id));
  return {
    next,
    count: eligible.length,
    names: eligible.map((row) => row.name || row.id),
    ids: eligible.map((row) => row.id),
    skipped: rows.length - eligible.length,
    changesLiveDelivery: eligible.length > 0,
  };
}

export function matchesManagerQuery(row: { id?: string; name?: string }, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${row.name || ""} ${row.id || ""}`.toLowerCase().includes(needle);
}

export type BulkStatusResult = {
  ok: string[];
  failed: Array<{ id: string; name: string; error: string }>;
};

export async function runBulkStatus(
  rows: SelectableRow[],
  next: "ACTIVE" | "PAUSED",
  apply: (id: string) => Promise<void>
): Promise<BulkStatusResult> {
  const plan = bulkLivePlan(rows, next);
  const result: BulkStatusResult = { ok: [], failed: [] };
  for (const id of plan.ids) {
    const row = rows.find((item) => item.id === id);
    try {
      await apply(id);
      result.ok.push(id);
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ||
        (error as { message?: string })?.message ||
        "failed";
      result.failed.push({ id, name: row?.name || id, error: message });
    }
  }
  return result;
}
