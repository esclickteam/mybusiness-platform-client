import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../../../api";

type Field = {
  id: string;
  key: string;
  label: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  visibility?: string;
  options?: string[];
  archived?: boolean;
};

type RecordType = { id: string; label: string; fields: Field[]; archived?: boolean };

type Schema = { recordTypes: RecordType[]; revision?: number };

const TYPE_LABELS: Record<string, string> = {
  text: "טקסט",
  number: "מספר",
  money: "מחיר",
  percent: "אחוז",
  date: "תאריך",
  time: "שעה",
  phone: "טלפון",
  email: "דוא״ל",
  address: "כתובת",
  select: "בחירה",
  multiselect: "בחירה מרובה",
  boolean: "כן/לא",
  image: "תמונה",
  file: "קובץ",
  signature: "חתימה",
};

function apiError(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data;
    if (data?.error) return data.error;
  }
  return fallback;
}

export default function SaasSystemBuilder() {
  const { businessId = "", tenantId = "" } = useParams();
  const [lang, setLang] = useState<"he" | "en">("he");
  const [fieldTypes, setFieldTypes] = useState<string[]>([]);
  const [draft, setDraft] = useState<Schema | null>(null);
  const [published, setPublished] = useState<Schema | null>(null);
  const [events, setEvents] = useState<{ at: string; kind: string }[]>([]);
  const [typeLabel, setTypeLabel] = useState("");
  const [fieldDraft, setFieldDraft] = useState({ recordTypeId: "", label: "", type: "text", required: false, unique: false, visibility: "internal", options: "" });
  const [recordTypeId, setRecordTypeId] = useState("");
  const [recordValues, setRecordValues] = useState<Record<string, string>>({});
  const [records, setRecords] = useState<{ id: string; values: Record<string, unknown> }[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dir = lang === "he" ? "rtl" : "ltr";

  async function load() {
    const { data } = await API.get(`/saas-owner/${tenantId}/builder`);
    setFieldTypes(data.fieldTypes || []);
    setDraft(data.draft);
    setPublished(data.published);
    const activity = await API.get(`/saas-owner/${tenantId}/builder/activity`);
    setEvents(activity.data.events || []);
  }

  useEffect(() => {
    load().catch(() => setError(lang === "he" ? "לא ניתן לטעון את הבונה" : "The builder could not be loaded"));
  }, [tenantId]);

  async function addType() {
    setError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/record-types`, { label: typeLabel });
      setDraft(data.draft);
      setTypeLabel("");
      setMessage(lang === "he" ? "סוג הרשומה נשמר כטיוטה" : "Record type saved as a draft");
    } catch (err) {
      setError(apiError(err, "Save failed"));
    }
  }

  async function addField() {
    setError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/fields`, {
        recordTypeId: fieldDraft.recordTypeId,
        label: fieldDraft.label,
        type: fieldDraft.type,
        required: fieldDraft.required,
        unique: fieldDraft.unique,
        visibility: fieldDraft.visibility,
        options: fieldDraft.options.split(",").map((item) => item.trim()).filter(Boolean),
      });
      setDraft(data.draft);
      setFieldDraft((prev) => ({ ...prev, label: "", options: "" }));
      setMessage(lang === "he" ? "השדה נוסף לטיוטה" : "Field added to the draft");
    } catch (err) {
      setError(apiError(err, "Save failed"));
    }
  }

  async function archive(fieldId: string) {
    setError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/fields/${fieldId}/archive`);
      setDraft(data.draft);
    } catch (err) {
      setError(apiError(err, "Archive failed"));
    }
  }

  async function publish() {
    setError("");
    try {
      await API.post(`/saas-owner/${tenantId}/builder/publish`, { summary: "publish", idempotencyKey: `${tenantId}-${Date.now()}` });
      await load();
      setMessage(lang === "he" ? "מבנה הנתונים פורסם" : "Data structure published");
    } catch (err) {
      setError(apiError(err, "Publish failed"));
    }
  }

  async function loadRecords(typeId: string) {
    setRecordTypeId(typeId);
    const { data } = await API.get(`/saas-owner/${tenantId}/builder/records`, { params: { type: typeId } });
    setRecords(data.records || []);
  }

  async function createRecord() {
    setError("");
    const type = (published?.recordTypes || []).find((item) => item.id === recordTypeId);
    if (!type) return;
    const values: Record<string, unknown> = {};
    for (const field of type.fields) {
      if (field.archived) continue;
      const raw = recordValues[field.id];
      if (field.type === "boolean") values[field.id] = raw === "true";
      else if (field.type === "multiselect") values[field.id] = String(raw || "").split(",").map((item) => item.trim()).filter(Boolean);
      else values[field.id] = raw ?? "";
    }
    try {
      await API.post(`/saas-owner/${tenantId}/builder/records`, { recordTypeId, values });
      setRecordValues({});
      await loadRecords(recordTypeId);
      setMessage(lang === "he" ? "הרשומה נשמרה" : "Record saved");
    } catch (err) {
      setError(apiError(err, "Save failed"));
    }
  }

  const types = draft?.recordTypes || [];
  const publishedType = (published?.recordTypes || []).find((item) => item.id === recordTypeId);

  return (
    <div dir={dir} className="min-h-screen overflow-x-hidden bg-[#f6f7fb] p-3 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">System Builder</p>
          <h1 className="text-2xl font-black">{lang === "he" ? "בונה המערכת — נתונים ושדות" : "System Builder — data and fields"}</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border bg-white px-3 py-1 text-sm font-bold" onClick={() => setLang(lang === "he" ? "en" : "he")}>{lang === "he" ? "EN" : "עב"}</button>
          <Link className="rounded-full border bg-white px-3 py-1 text-sm font-bold" to={`/business/${businessId}/dashboard/saas/${tenantId}`}>{lang === "he" ? "עריכת אתר" : "Website editor"}</Link>
        </div>
      </div>
      {error ? <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p> : null}
      {message ? <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">{message}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border bg-white p-4">
          <h2 className="font-black">{lang === "he" ? "סוג רשומה" : "Record type"}</h2>
          <input className="w-full rounded-xl border px-3 py-2" value={typeLabel} onChange={(event) => setTypeLabel(event.target.value)} placeholder={lang === "he" ? "לדוגמה: לקוחות" : "Example: Customers"} />
          <button type="button" className="rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={addType}>{lang === "he" ? "הוספה" : "Add"}</button>
          <h2 className="font-black">{lang === "he" ? "שדה" : "Field"}</h2>
          <select className="w-full rounded-xl border px-3 py-2" value={fieldDraft.recordTypeId} onChange={(event) => setFieldDraft((prev) => ({ ...prev, recordTypeId: event.target.value }))}>
            <option value="">{lang === "he" ? "בחירת סוג" : "Choose a type"}</option>
            {types.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <input className="w-full rounded-xl border px-3 py-2" value={fieldDraft.label} onChange={(event) => setFieldDraft((prev) => ({ ...prev, label: event.target.value }))} placeholder={lang === "he" ? "שם השדה" : "Field label"} />
          <select className="w-full rounded-xl border px-3 py-2" value={fieldDraft.type} onChange={(event) => setFieldDraft((prev) => ({ ...prev, type: event.target.value }))}>
            {fieldTypes.map((type) => <option key={type} value={type}>{TYPE_LABELS[type] || type}</option>)}
          </select>
          {fieldDraft.type === "select" || fieldDraft.type === "multiselect" ? (
            <input className="w-full rounded-xl border px-3 py-2" value={fieldDraft.options} onChange={(event) => setFieldDraft((prev) => ({ ...prev, options: event.target.value }))} placeholder={lang === "he" ? "אפשרויות מופרדות בפסיק" : "Options, comma separated"} />
          ) : null}
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={fieldDraft.required} onChange={(event) => setFieldDraft((prev) => ({ ...prev, required: event.target.checked }))} />{lang === "he" ? "שדה חובה" : "Required"}</label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={fieldDraft.unique} onChange={(event) => setFieldDraft((prev) => ({ ...prev, unique: event.target.checked }))} />{lang === "he" ? "ערך ייחודי" : "Unique"}</label>
          <select className="w-full rounded-xl border px-3 py-2" value={fieldDraft.visibility} onChange={(event) => setFieldDraft((prev) => ({ ...prev, visibility: event.target.value }))}>
            <option value="internal">{lang === "he" ? "פנימי" : "Internal"}</option>
            <option value="public">{lang === "he" ? "ציבורי" : "Public"}</option>
          </select>
          <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={addField}>{lang === "he" ? "הוספת שדה" : "Add field"}</button>
          <button type="button" className="block rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={publish}>{lang === "he" ? "פרסום המבנה" : "Publish structure"}</button>
        </aside>
        <section className="min-w-0 space-y-4">
          {types.length === 0 ? <p className="rounded-2xl border bg-white p-6 text-sm">{lang === "he" ? "עדיין אין סוגי רשומות. הוסיפו סוג ואז שדות." : "No record types yet. Add a type, then fields."}</p> : null}
          {types.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <h2 className="text-lg font-black">{item.label}</h2>
              <ul className="mt-2 space-y-2">
                {item.fields.map((field) => (
                  <li key={field.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className={field.archived ? "line-through" : ""}>{field.label} · {TYPE_LABELS[field.type] || field.type} · {field.id}</span>
                    {field.archived ? null : <button type="button" className="font-bold" onClick={() => archive(field.id)}>{lang === "he" ? "הוצאה משימוש" : "Retire"}</button>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <article className="rounded-2xl border bg-white p-4">
            <h2 className="font-black">{lang === "he" ? "רשומות שפורסמו" : "Published records"}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(published?.recordTypes || []).filter((item) => !item.archived).map((item) => (
                <button key={item.id} type="button" className="rounded-full border px-3 py-1 text-sm font-bold" onClick={() => loadRecords(item.id)}>{item.label}</button>
              ))}
            </div>
            {publishedType ? (
              <div className="mt-3 space-y-2">
                {publishedType.fields.filter((field) => !field.archived).map((field) => (
                  <label key={field.id} className="block text-xs font-bold">
                    {field.label}
                    <input className="mt-1 w-full rounded-lg border px-2 py-1" value={recordValues[field.id] || ""} onChange={(event) => setRecordValues((prev) => ({ ...prev, [field.id]: event.target.value }))} />
                  </label>
                ))}
                <button type="button" className="rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={createRecord}>{lang === "he" ? "שמירת רשומה" : "Save record"}</button>
              </div>
            ) : null}
            <ul className="mt-3 space-y-2 text-sm">
              {records.map((row) => <li key={row.id} className="rounded-xl bg-slate-50 px-3 py-2 break-words">{JSON.stringify(row.values)}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border bg-white p-4">
            <h2 className="font-black">{lang === "he" ? "היסטוריית פעילות" : "Activity"}</h2>
            <ul className="mt-2 text-xs">
              {events.map((event) => <li key={`${event.at}-${event.kind}`}>{event.at} · {event.kind}</li>)}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
