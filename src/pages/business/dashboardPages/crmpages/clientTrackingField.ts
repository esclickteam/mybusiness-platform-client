/** One row in a tracking field (e.g. weight over time). */
export type ClientTrackingEntry = {
  id: string;
  date: string;
  time: string;
  value: string;
};

/** Structured value for `type: "tracking"` custom fields. */
export type ClientTrackingFieldValue = {
  entries: ClientTrackingEntry[];
};

function trackingUid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function nowTrackingDateParts(date = new Date()) {
  return {
    date: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`,
    time: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`,
  };
}

export function createTrackingEntry(
  partial?: Partial<ClientTrackingEntry>,
): ClientTrackingEntry {
  const now = nowTrackingDateParts();
  return {
    id: String(partial?.id || trackingUid("track")),
    date: String(partial?.date || now.date),
    time: String(partial?.time || now.time),
    value: String(partial?.value ?? ""),
  };
}

export function defaultTrackingFieldValue(
  seedValue?: string | number | null,
): ClientTrackingFieldValue {
  const value =
    seedValue == null || seedValue === ""
      ? ""
      : String(seedValue).trim();
  return {
    entries: [createTrackingEntry({ value })],
  };
}

function sortTrackingEntries(entries: ClientTrackingEntry[]) {
  return [...entries].sort((a, b) => {
    const left = `${a.date}T${a.time || "00:00"}`;
    const right = `${b.date}T${b.time || "00:00"}`;
    return left.localeCompare(right);
  });
}

export function normalizeTrackingFieldValue(
  value: unknown,
): ClientTrackingFieldValue {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const raw = value as {
      entries?: unknown;
      columns?: unknown;
      rows?: unknown;
    };

    if (Array.isArray(raw.entries)) {
      const entries = raw.entries
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const item = entry as Partial<ClientTrackingEntry>;
          return createTrackingEntry({
            id: item.id,
            date: item.date,
            time: item.time,
            value: item.value,
          });
        })
        .filter(Boolean) as ClientTrackingEntry[];

      return {
        entries: entries.length
          ? sortTrackingEntries(entries)
          : [createTrackingEntry()],
      };
    }

    // Accept table-shaped payloads (תאריך / שעה / ערך).
    if (Array.isArray(raw.rows)) {
      const columns = Array.isArray(raw.columns)
        ? raw.columns.map((column) => String(column || "").toLowerCase())
        : [];
      const dateIndex = Math.max(
        0,
        columns.findIndex((column) => /תאריך|date/.test(column)),
      );
      const timeIndex = columns.findIndex((column) => /שעה|time/.test(column));
      const valueIndex = columns.findIndex((column) =>
        /ערך|value|משקל|weight|מדד/.test(column),
      );
      const resolvedValueIndex =
        valueIndex >= 0
          ? valueIndex
          : Math.max(
              0,
              ...[0, 1, 2].filter(
                (index) => index !== dateIndex && index !== timeIndex,
              ),
            );

      const entries = raw.rows
        .filter((row): row is unknown[] => Array.isArray(row))
        .map((row) =>
          createTrackingEntry({
            date: String(row[dateIndex] ?? ""),
            time:
              timeIndex >= 0
                ? String(row[timeIndex] ?? "")
                : nowTrackingDateParts().time,
            value: String(row[resolvedValueIndex] ?? ""),
          }),
        )
        .filter(
          (entry) =>
            entry.date.trim() || entry.time.trim() || entry.value.trim(),
        );

      if (entries.length) {
        return { entries: sortTrackingEntries(entries) };
      }
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return defaultTrackingFieldValue(value);
  }

  if (typeof value === "string" && value.trim()) {
    return defaultTrackingFieldValue(value.trim());
  }

  return defaultTrackingFieldValue();
}

/** Latest measurement for simple CRM / portal bindings (e.g. current weight). */
export function latestTrackingValue(value: unknown): string {
  const { entries } = normalizeTrackingFieldValue(value);
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const item = String(entries[index]?.value || "").trim();
    if (item) return item;
  }
  return "";
}
