import API from "@api";
import type { TFunction } from "i18next";

export type {
  ClientTrackingEntry,
  ClientTrackingFieldValue,
} from "./clientTrackingField";
export {
  createTrackingEntry,
  defaultTrackingFieldValue,
  latestTrackingValue,
  normalizeTrackingFieldValue,
  nowTrackingDateParts,
} from "./clientTrackingField";

export type CustomFieldType =
  | "text"
  | "textarea"
  | "summary"
  | "table"
  | "tracking"
  | "number"
  | "date"
  | "status"
  | "checkbox"
  | "boolean"
  | "select"
  | "checklist"
  | "link"
  | "email"
  | "phone"
  | "file"
  | "image";

/** Structured value for `type: "table"` custom fields (e.g. follow-up plan). */
export type ClientTableFieldValue = {
  columns: string[];
  rows: string[][];
};

export function defaultTableFieldValue(
  columns?: string[],
): ClientTableFieldValue {
  const cols =
    Array.isArray(columns) && columns.length
      ? columns.map(String)
      : ["תאריך", "פעולה", "סטטוס"];
  return {
    columns: cols,
    rows: [cols.map(() => "")],
  };
}

export function normalizeTableFieldValue(
  value: unknown,
  fallbackColumns?: string[],
): ClientTableFieldValue {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const raw = value as { columns?: unknown; rows?: unknown };
    const columns = Array.isArray(raw.columns)
      ? raw.columns.map(String)
      : [];
    const rows = Array.isArray(raw.rows)
      ? raw.rows.map((row) =>
          Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : [],
        )
      : [];
    if (columns.length) {
      const width = columns.length;
      return {
        columns,
        rows: rows.length
          ? rows.map((row) => {
              const next = [...row];
              while (next.length < width) next.push("");
              return next.slice(0, width);
            })
          : [columns.map(() => "")],
      };
    }
  }

  if (typeof value === "string" && value.trim()) {
    return {
      columns: ["תוכן"],
      rows: [[value.trim()]],
    };
  }

  return defaultTableFieldValue(fallbackColumns);
}

export type ConfiguredClientField = {
  id: string;
  key: string;
  label: string;
  type: CustomFieldType;
  description?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  showInClientProfile?: boolean;
  showInClientPortal?: boolean;
  clientCanEdit?: boolean;
  editableByClient?: boolean;
  active?: boolean;
  order?: number;
};

const CUSTOM_FIELDS_STORAGE_KEY = "bizuply_custom_client_fields";

const ALLOWED_TYPES: CustomFieldType[] = [
  "text",
  "textarea",
  "summary",
  "table",
  "tracking",
  "number",
  "date",
  "status",
  "checkbox",
  "boolean",
  "select",
  "checklist",
  "link",
  "email",
  "phone",
  "file",
  "image",
];

export function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function cleanKey(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[{}]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

function normalizeClientFieldType(value: unknown): CustomFieldType {
  return ALLOWED_TYPES.includes(value as CustomFieldType)
    ? (value as CustomFieldType)
    : "text";
}

export function normalizeConfiguredClientField(
  value: Partial<ConfiguredClientField>,
  index: number,
  t?: TFunction,
): ConfiguredClientField {
  const label =
    String(value.label || "").trim() ||
    (t
      ? t("crm.clients.defaults.customField", { index: index + 1 })
      : `Field ${index + 1}`);
  const key =
    cleanKey(String(value.key || label)) ||
    (t
      ? t("crm.clients.defaults.customFieldKey", { index: index + 1 })
      : `field_${index + 1}`);

  return {
    id: String(value.id || key || uid("client_field")),
    key,
    label,
    type: normalizeClientFieldType(value.type),
    description: String(value.description || ""),
    placeholder: String(value.placeholder || ""),
    options: Array.isArray(value.options) ? value.options.map(String) : [],
    required: Boolean(value.required),
    showInClientProfile: value.showInClientProfile !== false,
    showInClientPortal: Boolean(value.showInClientPortal),
    clientCanEdit: Boolean(value.clientCanEdit ?? value.editableByClient),
    editableByClient: Boolean(value.editableByClient ?? value.clientCanEdit),
    active: value.active !== false,
    order: Number(value.order) || index + 1,
  };
}

export function readLegacyLocalCustomFields(
  t?: TFunction,
): ConfiguredClientField[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((field, index) => normalizeConfiguredClientField(field, index, t))
      .filter((field) => field.active !== false)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  } catch {
    return [];
  }
}

export function writeLegacyLocalCustomFields(fields: ConfiguredClientField[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CUSTOM_FIELDS_STORAGE_KEY,
      JSON.stringify(
        fields.map((field, index) => ({ ...field, order: index + 1 })),
      ),
    );
  } catch {
    /* ignore */
  }
}

function mergeWithExampleCareFields(
  fields: ConfiguredClientField[],
): ConfiguredClientField[] {
  const examples = createExampleClientFields();
  const byKey = new Map(fields.map((field) => [field.key, field]));
  examples.forEach((example) => {
    if (!byKey.has(example.key)) {
      byKey.set(example.key, {
        ...example,
        order: byKey.size + 1,
      });
    }
  });
  return Array.from(byKey.values()).sort(
    (a, b) => Number(a.order || 0) - Number(b.order || 0),
  );
}

export async function fetchConfiguredClientFields(
  businessId: string,
  t?: TFunction,
): Promise<ConfiguredClientField[]> {
  if (!businessId) return createExampleClientFields();

  try {
    const res = await API.get<{
      success?: boolean;
      fields?: Partial<ConfiguredClientField>[];
    }>(`/crm-clients/${businessId}/custom-field-definitions`);

    const fromApi = Array.isArray(res.data?.fields) ? res.data.fields : [];
    if (fromApi.length) {
      return mergeWithExampleCareFields(
        fromApi
          .map((field, index) => normalizeConfiguredClientField(field, index, t))
          .filter((field) => field.active !== false),
      );
    }
  } catch {
    /* fall through to legacy / examples */
  }

  // One-time migration from legacy localStorage definitions.
  const legacy = readLegacyLocalCustomFields(t);
  if (legacy.length) {
    try {
      await saveConfiguredClientFields(businessId, legacy);
    } catch {
      /* keep using migrated local copy even if save fails once */
    }
    return mergeWithExampleCareFields(legacy);
  }

  return createExampleClientFields();
}

export async function saveConfiguredClientFields(
  businessId: string,
  fields: ConfiguredClientField[],
): Promise<ConfiguredClientField[]> {
  const payload = fields.map((field, index) =>
    normalizeConfiguredClientField(field, index),
  );

  const res = await API.put<{
    success?: boolean;
    fields?: Partial<ConfiguredClientField>[];
  }>(`/crm-clients/${businessId}/custom-field-definitions`, {
    fields: payload,
  });

  const saved = Array.isArray(res.data?.fields)
    ? res.data.fields.map((field, index) =>
        normalizeConfiguredClientField(field, index),
      )
    : payload;

  writeLegacyLocalCustomFields(saved);
  return saved;
}

export function createExampleClientFields(): ConfiguredClientField[] {
  return [
    {
      id: uid("client_field"),
      key: "weight",
      label: "משקל",
      type: "tracking",
      description: "טבלת מעקב משקל — תאריך, שעה וערך לכל מדידה",
      placeholder: "לדוגמה: 72",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 1,
    },
    {
      id: uid("client_field"),
      key: "treatments_left",
      label: "כמות טיפולים",
      type: "number",
      description: "כמה טיפולים נותרו בחבילה",
      placeholder: "לדוגמה: 4",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 2,
    },
    {
      id: uid("client_field"),
      key: "balance",
      label: "יתרה",
      type: "number",
      description: "יתרת תשלום / זכות",
      placeholder: "לדוגמה: 250",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 3,
    },
    {
      id: uid("client_field"),
      key: "sessions_done",
      label: "מפגשים שבוצעו",
      type: "number",
      description: "מספר מפגשים שהושלמו",
      placeholder: "לדוגמה: 8",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 4,
    },
    {
      id: uid("client_field"),
      key: "summary",
      label: "סיכום",
      type: "summary",
      description: "סיכום מצב הלקוח מהתיק",
      placeholder: "לדוגמה: התקדמות טובה, ממשיכים לפי התוכנית",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 5,
    },
    {
      id: uid("client_field"),
      key: "treatment_plan",
      label: "תכנית טיפול",
      type: "textarea",
      description: "תכנית הטיפול המלאה שמוצגת ללקוח באזור האישי",
      placeholder: "לדוגמה: מפגש שבועי · תרגילים ביתיים · יעד לחודש",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 6,
    },
    {
      id: uid("client_field"),
      key: "continuation_plan",
      label: "תוכנית המשך",
      type: "textarea",
      description: "מה ממשיכים בשלב הבא",
      placeholder: "לדוגמה: 4 מפגשים נוספים + מעקב משקל",
      options: [],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 7,
    },
    {
      id: uid("client_field"),
      key: "follow_up_plan",
      label: "תכנית מעקב",
      type: "table",
      description: "טבלת מעקב אישית לכל לקוח — תאריך, פעולה וסטטוס",
      placeholder: "",
      options: ["תאריך", "פעולה", "סטטוס"],
      required: false,
      showInClientProfile: true,
      showInClientPortal: true,
      clientCanEdit: false,
      active: true,
      order: 8,
    },
  ];
}

export function createEmptyClientField(
  count: number,
): ConfiguredClientField {
  return {
    id: uid("client_field"),
    key: `field_${count + 1}`,
    label: `נתון ${count + 1}`,
    type: "text",
    description: "",
    placeholder: "",
    options: [],
    required: false,
    showInClientProfile: true,
    showInClientPortal: true,
    clientCanEdit: false,
    active: true,
    order: count + 1,
  };
}
