import API from "@api";

const CLIENT_DATA_TAB_ID = "client_data_values";

/** Keys that mean "remaining treatments in package". */
const TREATMENTS_LEFT_KEYS = new Set([
  "treatments_left",
  "כמות_טיפולים",
  "treatmentsleft",
  "remaining_treatments",
]);

/** Keys that mean "sessions already completed". */
const SESSIONS_DONE_KEYS = new Set([
  "sessions_done",
  "מפגשים_שבוצעו",
  "sessionsdone",
  "completed_sessions",
]);

type CustomFieldLike = {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  value?: unknown;
  [key: string]: unknown;
};

type CustomTabLike = {
  id?: string;
  title?: string;
  fields?: CustomFieldLike[];
  [key: string]: unknown;
};

type CrmClientLike = {
  _id?: string;
  customTabs?: CustomTabLike[];
};

function normalizeKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function toNonNegativeInt(value: unknown, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.round(num));
}

function matchesKeySet(field: CustomFieldLike, keys: Set<string>) {
  const key = normalizeKey(field.key);
  if (keys.has(key)) return true;
  // Also match by common Hebrew labels when the business used a custom key.
  const label = String(field.label || "").trim();
  if (keys === TREATMENTS_LEFT_KEYS) {
    return /כמות\s*טיפול|טיפולים\s*נותר|treatments?\s*left|remaining/i.test(
      label,
    );
  }
  if (keys === SESSIONS_DONE_KEYS) {
    return /מפגשים\s*שבוצעו|טיפולים\s*שבוצעו|sessions?\s*done|completed/i.test(
      label,
    );
  }
  return false;
}

/**
 * When a treatment/appointment is fulfilled (`delta = 1`):
 * - decrement treatments_left (and Hebrew aliases)
 * - increment sessions_done
 *
 * Pass `delta = -1` to undo a mistaken fulfillment.
 */
export async function applyClientSessionConsumption(
  businessId: string,
  clientId: string,
  options: { delta?: number } = {},
): Promise<{
  treatmentsLeft: number | null;
  sessionsDone: number | null;
  updated: boolean;
} | null> {
  const delta = Number(options.delta ?? 1);
  const cleanBusinessId = String(businessId || "").trim();
  const cleanClientId = String(clientId || "").trim();
  if (!cleanBusinessId || !cleanClientId || !delta) return null;

  const { data } = await API.get(`/crm-clients/${cleanBusinessId}`);
  const clients = Array.isArray(data) ? (data as CrmClientLike[]) : [];
  const client = clients.find(
    (item) => String(item?._id || "").trim() === cleanClientId,
  );
  if (!client) return null;

  const tabs: CustomTabLike[] = Array.isArray(client.customTabs)
    ? client.customTabs.map((tab) => ({
        ...tab,
        fields: Array.isArray(tab.fields)
          ? tab.fields.map((field) => ({ ...field }))
          : [],
      }))
    : [];

  let dataTab = tabs.find((tab) => tab.id === CLIENT_DATA_TAB_ID);
  if (!dataTab) {
    dataTab = {
      id: CLIENT_DATA_TAB_ID,
      title: "נתוני לקוח",
      description: "ערכים אישיים לפי השדות שהוגדרו ב-CRM",
      showInClientPortal: true,
      whoCanFill: "business",
      fields: [],
      updatedAt: new Date().toISOString(),
    };
    tabs.push(dataTab);
  }

  const fields = Array.isArray(dataTab.fields) ? dataTab.fields : [];
  let treatmentsLeft: number | null = null;
  let sessionsDone: number | null = null;
  let touched = false;

  const ensureField = (key: string, label: string, type = "number") => {
    let field = fields.find((item) => normalizeKey(item.key) === key);
    if (!field) {
      field = {
        id: `client_data_${key}`,
        key,
        label,
        type,
        source: "business_input",
        showInClientProfile: true,
        showInClientPortal: true,
        editableByClient: false,
        required: false,
        value: type === "number" ? 0 : "",
      };
      fields.push(field);
    }
    return field;
  };

  // Prefer existing fields; create canonical English keys only if nothing matched.
  const treatmentFields = fields.filter((field) =>
    matchesKeySet(field, TREATMENTS_LEFT_KEYS),
  );
  const sessionFields = fields.filter((field) =>
    matchesKeySet(field, SESSIONS_DONE_KEYS),
  );

  const targetsTreatments =
    treatmentFields.length > 0
      ? treatmentFields
      : [ensureField("treatments_left", "כמות טיפולים")];
  const targetsSessions =
    sessionFields.length > 0
      ? sessionFields
      : [ensureField("sessions_done", "מפגשים שבוצעו")];

  targetsTreatments.forEach((field) => {
    const current = toNonNegativeInt(field.value, 0);
    const next = Math.max(0, current - delta);
    if (next !== current) touched = true;
    field.value = next;
    treatmentsLeft = next;
  });

  targetsSessions.forEach((field) => {
    const current = toNonNegativeInt(field.value, 0);
    const next = Math.max(0, current + delta);
    if (next !== current) touched = true;
    field.value = next;
    sessionsDone = next;
  });

  dataTab.fields = fields;
  dataTab.updatedAt = new Date().toISOString();

  if (!touched && delta !== 0) {
    // Still persist if we created missing canonical fields with starting values.
    touched = true;
  }

  await API.put(`/crm-clients/${cleanClientId}/custom-tabs`, {
    customTabs: tabs,
  });

  return {
    treatmentsLeft,
    sessionsDone,
    updated: touched,
  };
}

export function isAppointmentTreatmentCompleted(appointment: {
  completed?: unknown;
  status?: unknown;
  fulfilled?: unknown;
}) {
  if (Boolean(appointment?.completed) || Boolean(appointment?.fulfilled)) {
    return true;
  }
  return String(appointment?.status || "")
    .trim()
    .toLowerCase() === "completed";
}
