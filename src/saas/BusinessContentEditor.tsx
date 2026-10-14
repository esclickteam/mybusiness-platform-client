type Scalar = {
  key: string;
  label: string;
  input?: "text" | "textarea" | "number" | "checkbox";
};

type RecordSchema = { kind: "records"; label: string; fields: Scalar[] };
type ObjectSchema = { kind: "object"; label: string; fields: Scalar[] };
type TextSchema = { kind: "text"; label: string; input?: "text" | "textarea" };

const LABELS: Record<string, string> = {
  restaurantName: "שם המסעדה",
  details: "פרטי העסק",
  categories: "קטגוריות",
  dishes: "מנות",
  tables: "שולחנות",
  serviceSettings: "הגדרות שירות",
  hours: "שעות פעילות",
  services: "שירותים",
  staff: "עובדים",
  availability: "זמינות",
  galleries: "גלריות",
  products: "מוצרים",
  packages: "חבילות",
  coupons: "קופונים",
  bookingSettings: "הגדרות תורים",
  properties: "נכסים",
  units: "יחידות",
  projects: "פרויקטים",
  agents: "סוכנים",
  organizations: "ארגונים",
  enquiries: "פניות",
  crews: "צוותים",
  sites: "אתרי עבודה",
  jobs: "עבודות",
};

const SCHEMAS: Record<string, RecordSchema | ObjectSchema | TextSchema> = {
  restaurantName: { kind: "text", label: LABELS.restaurantName },
  details: { kind: "text", label: LABELS.details, input: "textarea" },
  categories: {
    kind: "records",
    label: LABELS.categories,
    fields: [
      { key: "nameHe", label: "שם בעברית" },
      { key: "nameEn", label: "שם באנגלית" },
    ],
  },
  dishes: {
    kind: "records",
    label: LABELS.dishes,
    fields: [
      { key: "categoryId", label: "מזהה קטגוריה" },
      { key: "nameHe", label: "שם בעברית" },
      { key: "nameEn", label: "שם באנגלית" },
      { key: "descriptionHe", label: "תיאור בעברית", input: "textarea" },
      { key: "descriptionEn", label: "תיאור באנגלית", input: "textarea" },
      { key: "price", label: "מחיר", input: "number" },
      { key: "image", label: "תמונה" },
      { key: "available", label: "זמין", input: "checkbox" },
    ],
  },
  tables: {
    kind: "records",
    label: LABELS.tables,
    fields: [
      { key: "name", label: "שם" },
      { key: "seats", label: "מקומות", input: "number" },
      { key: "qr", label: "קוד QR" },
    ],
  },
  serviceSettings: {
    kind: "object",
    label: LABELS.serviceSettings,
    fields: [
      { key: "dineIn", label: "ישיבה", input: "checkbox" },
      { key: "takeaway", label: "איסוף", input: "checkbox" },
      { key: "delivery", label: "משלוח", input: "checkbox" },
    ],
  },
  hours: {
    kind: "records",
    label: LABELS.hours,
    fields: [
      { key: "day", label: "יום" },
      { key: "open", label: "פתיחה" },
      { key: "close", label: "סגירה" },
    ],
  },
  services: {
    kind: "records",
    label: LABELS.services,
    fields: [
      { key: "name", label: "שם" },
      { key: "price", label: "מחיר", input: "number" },
      { key: "duration", label: "משך" },
      { key: "description", label: "תיאור", input: "textarea" },
    ],
  },
  staff: {
    kind: "records",
    label: LABELS.staff,
    fields: [
      { key: "name", label: "שם" },
      { key: "role", label: "תפקיד" },
      { key: "active", label: "פעיל", input: "checkbox" },
    ],
  },
  availability: {
    kind: "records",
    label: LABELS.availability,
    fields: [
      { key: "day", label: "יום" },
      { key: "from", label: "משעה" },
      { key: "to", label: "עד שעה" },
    ],
  },
  galleries: {
    kind: "records",
    label: LABELS.galleries,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "image", label: "תמונה" },
    ],
  },
  products: {
    kind: "records",
    label: LABELS.products,
    fields: [
      { key: "name", label: "שם" },
      { key: "price", label: "מחיר", input: "number" },
      { key: "image", label: "תמונה" },
    ],
  },
  packages: {
    kind: "records",
    label: LABELS.packages,
    fields: [
      { key: "name", label: "שם" },
      { key: "price", label: "מחיר", input: "number" },
      { key: "description", label: "תיאור", input: "textarea" },
    ],
  },
  coupons: {
    kind: "records",
    label: LABELS.coupons,
    fields: [
      { key: "code", label: "קוד" },
      { key: "percent", label: "אחוז", input: "number" },
    ],
  },
  bookingSettings: {
    kind: "object",
    label: LABELS.bookingSettings,
    fields: [
      { key: "slotMinutes", label: "דקות לתור", input: "number" },
      { key: "bufferMinutes", label: "מרווח בדקות", input: "number" },
    ],
  },
  properties: {
    kind: "records",
    label: LABELS.properties,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "price", label: "מחיר", input: "number" },
      { key: "description", label: "תיאור", input: "textarea" },
      { key: "image", label: "תמונה" },
      { key: "status", label: "סטטוס" },
    ],
  },
  units: {
    kind: "records",
    label: LABELS.units,
    fields: [
      { key: "propertyId", label: "נכס" },
      { key: "name", label: "שם" },
      { key: "price", label: "מחיר", input: "number" },
    ],
  },
  projects: {
    kind: "records",
    label: LABELS.projects,
    fields: [
      { key: "name", label: "שם" },
      { key: "description", label: "תיאור", input: "textarea" },
    ],
  },
  agents: {
    kind: "records",
    label: LABELS.agents,
    fields: [
      { key: "name", label: "שם" },
      { key: "phone", label: "טלפון" },
      { key: "email", label: "דוא\"ל" },
    ],
  },
  organizations: {
    kind: "records",
    label: LABELS.organizations,
    fields: [
      { key: "name", label: "שם" },
      { key: "phone", label: "טלפון" },
    ],
  },
  enquiries: {
    kind: "records",
    label: LABELS.enquiries,
    fields: [
      { key: "name", label: "שם" },
      { key: "phone", label: "טלפון" },
      { key: "message", label: "הודעה", input: "textarea" },
      { key: "propertyId", label: "נכס" },
    ],
  },
  crews: { kind: "records", label: LABELS.crews, fields: [{ key: "name", label: "שם" }] },
  sites: {
    kind: "records",
    label: LABELS.sites,
    fields: [
      { key: "name", label: "שם" },
      { key: "address", label: "כתובת" },
    ],
  },
  jobs: {
    kind: "records",
    label: LABELS.jobs,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "site", label: "אתר" },
      { key: "status", label: "סטטוס" },
    ],
  },
};

function blank(fields: Scalar[]) {
  const row: Record<string, unknown> = { id: `item-${Date.now().toString(36)}` };
  for (const field of fields) row[field.key] = field.input === "checkbox" ? true : field.input === "number" ? 0 : "";
  return row;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Scalar;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.input === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-xs font-bold">
        <input type="checkbox" checked={value !== false} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.input === "textarea") {
    return (
      <label className="block text-xs font-bold">
        {field.label}
        <textarea className="mt-1 w-full rounded-lg border px-2 py-1" rows={2} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }
  return (
    <label className="block text-xs font-bold">
      {field.label}
      <input
        className="mt-1 w-full rounded-lg border px-2 py-1"
        type={field.input === "number" ? "number" : "text"}
        value={value == null ? "" : String(value)}
        onChange={(event) => onChange(field.input === "number" ? Number(event.target.value) || 0 : event.target.value)}
      />
    </label>
  );
}

export default function BusinessContentEditor({
  business,
  onChange,
}: {
  business: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.keys(business || {}).map((key) => {
        const schema = SCHEMAS[key];
        const value = business[key];
        if (!schema || schema.kind === "text") {
          if (value && typeof value === "object") return null;
          return (
            <label key={key} className="block text-xs font-bold">
              {schema?.label || key}
              {schema?.kind === "text" && schema.input === "textarea" ? (
                <textarea className="mt-1 w-full rounded-lg border px-2 py-1" rows={3} value={String(value ?? "")} onChange={(event) => onChange(key, event.target.value)} />
              ) : (
                <input className="mt-1 w-full rounded-lg border px-2 py-1" value={String(value ?? "")} onChange={(event) => onChange(key, event.target.value)} />
              )}
            </label>
          );
        }
        if (schema.kind === "object") {
          const row = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
          return (
            <fieldset key={key} className="rounded-xl border p-2">
              <legend className="px-1 text-xs font-black">{schema.label}</legend>
              {schema.fields.map((field) => (
                <FieldInput key={field.key} field={field} value={row[field.key]} onChange={(next) => onChange(key, { ...row, [field.key]: next })} />
              ))}
            </fieldset>
          );
        }
        const rows = Array.isArray(value) ? value : [];
        return (
          <fieldset key={key} className="rounded-xl border p-2">
            <legend className="px-1 text-xs font-black">{schema.label}</legend>
            {rows.map((item, index) => {
              const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
              return (
                <div key={String(row.id || index)} className="mt-2 space-y-1 rounded-lg bg-slate-50 p-2">
                  {schema.fields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={row[field.key]}
                      onChange={(next) => {
                        const copy = rows.slice();
                        copy[index] = { ...row, [field.key]: next };
                        onChange(key, copy);
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    className="text-xs font-bold text-rose-700"
                    onClick={() => onChange(key, rows.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    הסרה
                  </button>
                </div>
              );
            })}
            <button type="button" className="mt-2 text-xs font-black" onClick={() => onChange(key, [...rows, blank(schema.fields)])}>
              הוספה
            </button>
          </fieldset>
        );
      })}
    </div>
  );
}
