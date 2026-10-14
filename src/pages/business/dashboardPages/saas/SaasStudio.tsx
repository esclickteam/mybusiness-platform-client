import { useMemo, useState } from "react";
import API from "../../../../api";

type Field = {
  id: string;
  label: string;
  type: string;
  options?: string[];
  archived?: boolean;
  formula?: { op: string } | null;
  relation?: { recordTypeId: string; cardinality: string } | null;
};

type RecordType = { id: string; label: string; fields: Field[]; archived?: boolean };

type Schema = {
  recordTypes?: RecordType[];
  screens?: Screen[];
  forms?: FormDef[];
  workflows?: Workflow[];
  automations?: Automation[];
  products?: Product[];
  messages?: Message[];
  documents?: DocumentDef[];
  signedDocuments?: { id: string; title: string; signerName: string; hash: string }[];
  reports?: Report[];
  webhooks?: { id: string; url: string; secretHint?: string; events?: string[] }[];
  bridge?: { connected?: boolean; reason?: string };
};

type Screen = {
  id: string;
  name: string;
  audience: string;
  widgets: Widget[];
  archived?: boolean;
};

type Widget = {
  id: string;
  kind: string;
  recordTypeId: string;
  fieldIds?: string[];
  titleFieldId?: string;
  dateFieldId?: string;
  statusFieldId?: string;
  valueFieldId?: string;
  searchFieldIds?: string[];
};

type FormDef = { id: string; name: string; recordTypeId: string; steps: { title: string; fieldIds: string[] }[]; questions?: { fieldId: string; visibleWhen?: { fieldId: string; op: string; value: string } | null }[] };
type Workflow = { id: string; name: string; recordTypeId: string; statuses: { id: string; label: string }[]; slaHours?: number | null; archived?: boolean };
type Automation = { id: string; name: string; enabled?: boolean; trigger?: { kind: string }; archived?: boolean };
type Product = { id: string; name: string; price: number; currency: string; kind: string; billing?: string };
type Message = { id: string; name: string; channel: string };
type DocumentDef = { id: string; title: string };
type Report = { id: string; name: string; metric: string };
type Version = { revision: number; summary?: string; hasSnapshot?: boolean };
type Role = { id?: string; name: string; permissions: string[] };

const TABS = [
  ["data", "נתונים"],
  ["screens", "מסכים"],
  ["forms", "טפסים"],
  ["workflows", "תהליכים"],
  ["automations", "אוטומציות"],
  ["roles", "תפקידים"],
  ["products", "מוצרים"],
  ["messages", "הודעות"],
  ["documents", "מסמכים"],
  ["reports", "דוחות"],
  ["webhooks", "חיבורים"],
  ["template", "תבנית"],
  ["infrastructure", "תשתית"],
] as const;

const ROLE_KEYS = ["records.view", "records.create", "records.edit", "records.export", "records.import", "schema.edit", "screens.edit", "forms.edit", "workflows.edit", "automations.edit", "products.edit", "messages.edit", "documents.edit", "reports.view", "webhooks.edit"];

function apiError(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data;
    if (data?.error) return data.error;
  }
  return fallback;
}

function activeTypes(schema: Schema | null) {
  return (schema?.recordTypes || []).filter((item) => !item.archived);
}

export default function SaasStudio({
  tenantId,
  lang,
  section,
  onSection,
  draft,
  published,
  versions,
  roles,
  bridge,
  onReload,
}: {
  tenantId: string;
  lang: "he" | "en";
  section: string;
  onSection: (section: string) => void;
  draft: Schema | null;
  published: Schema | null;
  versions: Version[];
  roles: Role[];
  bridge?: { connected?: boolean; reason?: string } | null;
  onReload: () => Promise<void>;
}) {
  const he = lang === "he";
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [previewWidth, setPreviewWidth] = useState<"100%" | "375px">("100%");
  const types = activeTypes(draft);

  async function save(path: string, body: unknown, ok: string) {
    setError("");
    try {
      await API.post(`/saas-owner/${tenantId}/builder/${path}`, body);
      await onReload();
      setMessage(ok);
    } catch (err) {
      setError(apiError(err, he ? "השמירה נכשלה" : "Save failed"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${section === id ? "bg-[#24124d] text-white" : "border bg-white"}`} onClick={() => onSection(id)}>
            {he ? label : id}
          </button>
        ))}
      </div>
      {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p> : null}
      {message ? <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">{message}</p> : null}
      {section === "data" ? <DataTools tenantId={tenantId} he={he} types={types} publishedTypes={activeTypes(published)} versions={versions} onReload={onReload} onError={setError} onMessage={setMessage} /> : null}
      {section === "screens" ? <ScreenTools tenantId={tenantId} he={he} types={types} screens={draft?.screens || []} published={published} previewWidth={previewWidth} setPreviewWidth={setPreviewWidth} onSave={save} onError={setError} /> : null}
      {section === "forms" ? <FormTools tenantId={tenantId} he={he} types={types} forms={draft?.forms || []} publishedForms={published?.forms || []} previewWidth={previewWidth} onSave={save} /> : null}
      {section === "workflows" ? <WorkflowTools he={he} types={types} workflows={draft?.workflows || []} onSave={save} /> : null}
      {section === "automations" ? <AutomationTools tenantId={tenantId} he={he} types={types} workflows={draft?.workflows || []} automations={draft?.automations || []} onSave={save} onReload={onReload} onError={setError} onMessage={setMessage} /> : null}
      {section === "roles" ? <RoleTools he={he} roles={roles} onSave={save} /> : null}
      {section === "products" ? <ProductTools he={he} products={draft?.products || []} onSave={save} /> : null}
      {section === "messages" ? <MessageTools tenantId={tenantId} he={he} messages={draft?.messages || []} onSave={save} onError={setError} onMessage={setMessage} /> : null}
      {section === "documents" ? <DocumentTools he={he} documents={draft?.documents || []} signed={draft?.signedDocuments || []} onSave={save} /> : null}
      {section === "reports" ? <ReportTools tenantId={tenantId} he={he} types={types} reports={draft?.reports || []} onSave={save} onError={setError} onMessage={setMessage} /> : null}
      {section === "webhooks" ? <WebhookTools tenantId={tenantId} he={he} hooks={draft?.webhooks || []} onError={setError} onMessage={setMessage} onReload={onReload} /> : null}
      {section === "template" ? <TemplateTools he={he} bridge={bridge || draft?.bridge} onSave={save} /> : null}
      {section === "infrastructure" ? <InfraTools tenantId={tenantId} he={he} onError={setError} onMessage={setMessage} /> : null}
    </div>
  );
}

function DataTools({ tenantId, he, types, publishedTypes, versions, onReload, onError, onMessage }: {
  tenantId: string;
  he: boolean;
  types: RecordType[];
  publishedTypes: RecordType[];
  versions: Version[];
  onReload: () => Promise<void>;
  onError: (value: string) => void;
  onMessage: (value: string) => void;
}) {
  const [fieldId, setFieldId] = useState("");
  const [formulaOp, setFormulaOp] = useState("mul");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [whenField, setWhenField] = useState("");
  const [whenOp, setWhenOp] = useState("eq");
  const [whenValue, setWhenValue] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [preset, setPreset] = useState("");
  const [csv, setCsv] = useState("");
  const [importType, setImportType] = useState("");
  const [bulkType, setBulkType] = useState("");
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [revision, setRevision] = useState("");
  const fields = types.flatMap((item) => item.fields.filter((field) => !field.archived).map((field) => ({ ...field, typeLabel: item.label })));

  async function configure() {
    onError("");
    const body: Record<string, unknown> = {};
    if (left && right) {
      body.formula = {
        op: formulaOp,
        args: [left, right].map((value) => (value.startsWith("lit:") ? { kind: "literal", value: Number(value.slice(4)) } : { kind: "field", fieldId: value })),
      };
    }
    if (whenField) body.visibleWhen = { fieldId: whenField, op: whenOp, value: whenValue };
    if (defaultValue !== "") body.defaultValue = defaultValue;
    if (preset) body.validation = { preset };
    try {
      await API.post(`/saas-owner/${tenantId}/builder/fields/${fieldId}/configure`, body);
      await onReload();
      onMessage(he ? "הגדרת השדה נשמרה בטיוטה" : "Field settings saved");
    } catch (err) {
      onError(apiError(err, "Save failed"));
    }
  }

  async function importCsv() {
    onError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/records/import`, { recordTypeId: importType, csv });
      onMessage(he ? `יובאו ${data.created?.length || 0} רשומות` : `Imported ${data.created?.length || 0}`);
    } catch (err) {
      onError(apiError(err, "Import failed"));
    }
  }

  async function importExcel(file: File | undefined) {
    if (!file) return;
    onError("");
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/records/import`, {
        recordTypeId: importType,
        format: "xlsx",
        base64: btoa(binary),
      });
      onMessage(he ? `יובאו ${data.created?.length || 0} רשומות` : `Imported ${data.created?.length || 0}`);
    } catch (err) {
      onError(apiError(err, "Import failed"));
    }
  }

  async function exportCsv() {
    onError("");
    try {
      const { data } = await API.get(`/saas-owner/${tenantId}/builder/records/export`, { params: { type: importType }, responseType: "text" });
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "records.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      onError(apiError(err, "Export failed"));
    }
  }

  async function bulk() {
    onError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/records/bulk`, { recordTypeId: bulkType, fieldId: bulkField, value: bulkValue });
      onMessage(he ? `עודכנו ${data.updated} רשומות` : `Updated ${data.updated}`);
    } catch (err) {
      onError(apiError(err, "Bulk update failed"));
    }
  }

  async function restore() {
    onError("");
    try {
      await API.post(`/saas-owner/${tenantId}/builder/restore`, { revision: Number(revision) });
      await onReload();
      onMessage(he ? "הטיוטה שוחזרה. הרשומות לא נמחקו." : "Draft restored. Records were kept.");
    } catch (err) {
      onError(apiError(err, "Restore failed"));
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border bg-white p-4">
        <h2 className="font-black">{he ? "נוסחה, תנאי, ברירת מחדל ובדיקה" : "Formula, condition, default, validation"}</h2>
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={fieldId} onChange={(event) => setFieldId(event.target.value)}>
          <option value="">{he ? "שדה" : "Field"}</option>
          {fields.map((item) => <option key={item.id} value={item.id}>{item.typeLabel} · {item.label}</option>)}
        </select>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <select className="rounded-xl border px-2 py-2" value={formulaOp} onChange={(event) => setFormulaOp(event.target.value)}>
            {["add", "sub", "mul", "div"].map((op) => <option key={op}>{op}</option>)}
          </select>
          <select className="rounded-xl border px-2 py-2" value={left} onChange={(event) => setLeft(event.target.value)}>
            <option value="">{he ? "שמאל" : "Left"}</option>
            <option value="lit:1">1</option>
            {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <select className="rounded-xl border px-2 py-2" value={right} onChange={(event) => setRight(event.target.value)}>
            <option value="">{he ? "ימין" : "Right"}</option>
            <option value="lit:1">1</option>
            {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <select className="rounded-xl border px-2 py-2" value={whenField} onChange={(event) => setWhenField(event.target.value)}>
            <option value="">{he ? "מוצג כאשר" : "Visible when"}</option>
            {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <select className="rounded-xl border px-2 py-2" value={whenOp} onChange={(event) => setWhenOp(event.target.value)}>
            {["eq", "neq", "gt", "lt", "empty"].map((op) => <option key={op}>{op}</option>)}
          </select>
          <input className="rounded-xl border px-2 py-2" value={whenValue} onChange={(event) => setWhenValue(event.target.value)} placeholder={he ? "ערך" : "Value"} />
        </div>
        <input className="mt-2 w-full rounded-xl border px-3 py-2" value={defaultValue} onChange={(event) => setDefaultValue(event.target.value)} placeholder={he ? "ברירת מחדל" : "Default"} />
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={preset} onChange={(event) => setPreset(event.target.value)}>
          <option value="">{he ? "בלי בדיקה מיוחדת" : "No preset"}</option>
          <option value="digits">{he ? "ספרות בלבד" : "Digits"}</option>
          <option value="slug">slug</option>
        </select>
        <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={configure}>{he ? "שמירת הגדרה" : "Save settings"}</button>
      </article>
      <article className="space-y-3 rounded-2xl border bg-white p-4">
        <h2 className="font-black">{he ? "ייבוא, ייצוא, עדכון ושחזור" : "Import, export, bulk, restore"}</h2>
        <select className="w-full rounded-xl border px-3 py-2" value={importType} onChange={(event) => setImportType(event.target.value)}>
          <option value="">{he ? "סוג רשומה שפורסם" : "Published type"}</option>
          {publishedTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <textarea className="h-24 w-full rounded-xl border px-3 py-2 text-sm" value={csv} onChange={(event) => setCsv(event.target.value)} placeholder="Name,Qty" />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={importCsv}>{he ? "ייבוא CSV" : "Import CSV"}</button>
          <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={exportCsv}>{he ? "ייצוא CSV" : "Export CSV"}</button>
          <label className="rounded-full border px-4 py-2 text-sm font-bold">
            {he ? "ייבוא Excel" : "Import Excel"}
            <input className="hidden" type="file" accept=".xlsx" onChange={(event) => importExcel(event.target.files?.[0])} />
          </label>
        </div>
        <select className="w-full rounded-xl border px-3 py-2" value={bulkType} onChange={(event) => setBulkType(event.target.value)}>
          <option value="">{he ? "עדכון מרוכז" : "Bulk type"}</option>
          {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <select className="w-full rounded-xl border px-3 py-2" value={bulkField} onChange={(event) => setBulkField(event.target.value)}>
          <option value="">{he ? "שדה" : "Field"}</option>
          {(types.find((item) => item.id === bulkType)?.fields || []).filter((item) => !item.archived && !item.formula).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <input className="w-full rounded-xl border px-3 py-2" value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} placeholder={he ? "ערך חדש" : "New value"} />
        <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={bulk}>{he ? "עדכון מרוכז" : "Bulk update"}</button>
        <select className="w-full rounded-xl border px-3 py-2" value={revision} onChange={(event) => setRevision(event.target.value)}>
          <option value="">{he ? "גרסה לשחזור" : "Revision"}</option>
          {versions.map((item) => <option key={item.revision} value={item.revision}>{item.revision} · {item.summary} · {item.hasSnapshot ? "snapshot" : he ? "בלי תצלום" : "no snapshot"}</option>)}
        </select>
        <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={restore}>{he ? "שחזור טיוטה" : "Restore draft"}</button>
      </article>
    </div>
  );
}

function ScreenTools({ tenantId, he, types, screens, published, previewWidth, setPreviewWidth, onSave, onError }: {
  tenantId: string;
  he: boolean;
  types: RecordType[];
  screens: Screen[];
  published: Schema | null;
  previewWidth: "100%" | "375px";
  setPreviewWidth: (value: "100%" | "375px") => void;
  onSave: (path: string, body: unknown, ok: string) => Promise<void>;
  onError: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [audience, setAudience] = useState("staff");
  const [kind, setKind] = useState("table");
  const [recordTypeId, setRecordTypeId] = useState("");
  const [fieldIds, setFieldIds] = useState<string[]>([]);
  const [rows, setRows] = useState<{ id: string; values: Record<string, unknown> }[]>([]);
  const [search, setSearch] = useState("");
  const recordType = types.find((item) => item.id === recordTypeId);
  const live = useMemo(() => [...screens].reverse().find((item) => !item.archived), [screens]);

  function toggle(id: string) {
    setFieldIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function loadRows() {
    const typeId = live?.widgets?.[0]?.recordTypeId || recordTypeId;
    if (!typeId) return;
    const { data } = await API.get(`/saas-owner/${tenantId}/builder/records`, { params: { type: typeId, search } });
    setRows(data.records || []);
  }

  const widget = live?.widgets?.[0];
  const previewType = (published?.recordTypes || []).find((item) => item.id === widget?.recordTypeId);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <article className="rounded-2xl border bg-white p-4">
        <h2 className="font-black">{he ? "מסך" : "Screen"}</h2>
        <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם המסך" : "Screen name"} />
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={audience} onChange={(event) => setAudience(event.target.value)}>
          <option value="staff">{he ? "עובדים" : "Staff"}</option>
          <option value="customer">{he ? "לקוחות" : "Customers"}</option>
        </select>
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={kind} onChange={(event) => setKind(event.target.value)}>
          {["table", "cards", "calendar", "chart", "list", "kanban"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={recordTypeId} onChange={(event) => { setRecordTypeId(event.target.value); setFieldIds([]); }}>
          <option value="">{he ? "סוג רשומה" : "Record type"}</option>
          {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <div className="mt-2 space-y-1">
          {(recordType?.fields || []).filter((item) => !item.archived).map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fieldIds.includes(item.id)} onChange={() => toggle(item.id)} />{item.label}</label>
          ))}
        </div>
        <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("screens", {
          name,
          audience,
          viewPermission: "records.view",
          editPermission: "records.edit",
          widgets: [{
            kind,
            recordTypeId,
            fieldIds,
            titleFieldId: fieldIds[0] || "",
            searchFieldIds: fieldIds.slice(0, 1),
            dateFieldId: kind === "calendar" ? fieldIds[0] : "",
            statusFieldId: kind === "kanban" ? fieldIds[0] : "",
            valueFieldId: kind === "chart" ? fieldIds[0] : "",
          }],
        }, he ? "המסך נשמר בטיוטה" : "Screen saved")} disabled={!name || !recordTypeId}>{he ? "שמירת מסך" : "Save screen"}</button>
      </article>
      <article className="min-w-0 rounded-2xl border bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="font-black">{he ? "תצוגה מקדימה" : "Preview"}</h2>
          <button type="button" className="rounded-full border px-3 py-1 text-sm font-bold" onClick={() => setPreviewWidth("100%")}>{he ? "מחשב" : "Desktop"}</button>
          <button type="button" className="rounded-full border px-3 py-1 text-sm font-bold" onClick={() => setPreviewWidth("375px")}>{he ? "נייד" : "Mobile"}</button>
          <input className="rounded-xl border px-2 py-1 text-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={he ? "חיפוש" : "Search"} />
          <button type="button" className="rounded-full border px-3 py-1 text-sm font-bold" onClick={() => loadRows().catch((err) => onError(apiError(err, "Load failed")))}>{he ? "טעינה" : "Load"}</button>
        </div>
        <div className="overflow-x-hidden rounded-xl border bg-slate-50 p-3" style={{ width: previewWidth, maxWidth: "100%" }}>
          <p className="mb-2 text-sm font-black">{live?.name || (he ? "אין מסך שמור" : "No saved screen")} · {live?.audience}</p>
          <RecordView widget={widget} recordType={previewType} rows={rows} />
        </div>
        <ul className="mt-3 text-sm">{screens.filter((item) => !item.archived).map((item) => <li key={item.id}>{item.name} · {item.audience} · {item.widgets.map((widgetItem) => widgetItem.kind).join(", ")}</li>)}</ul>
      </article>
    </div>
  );
}

function RecordView({ widget, recordType, rows }: { widget?: Widget; recordType?: RecordType; rows: { id: string; values: Record<string, unknown> }[] }) {
  if (!widget || !recordType) return null;
  const label = (id?: string) => recordType.fields.find((item) => item.id === id)?.label || "";
  const text = (row: { values: Record<string, unknown> }, id?: string) => String(row.values[id || ""] ?? "");
  if (widget.kind === "cards") {
    return <div className="grid gap-2 sm:grid-cols-2">{rows.map((row) => <article key={row.id} className="rounded-xl bg-white p-3 text-sm">{text(row, widget.titleFieldId || widget.fieldIds?.[0])}</article>)}</div>;
  }
  if (widget.kind === "kanban") {
    const field = recordType.fields.find((item) => item.id === widget.statusFieldId);
    return <div className="flex gap-2 overflow-x-auto">{(field?.options || []).map((option) => <section key={option} className="min-w-36 flex-1 rounded-xl bg-white p-2"><h3 className="text-xs font-black">{option}</h3>{rows.filter((row) => text(row, field?.id) === option).map((row) => <p key={row.id} className="mt-1 text-sm">{text(row, widget.fieldIds?.[0])}</p>)}</section>)}</div>;
  }
  if (widget.kind === "calendar") {
    return <ul className="space-y-1 text-sm">{rows.map((row) => <li key={row.id}>{text(row, widget.dateFieldId)} · {text(row, widget.fieldIds?.[0])}</li>)}</ul>;
  }
  if (widget.kind === "chart") {
    const max = Math.max(1, ...rows.map((row) => Number(row.values[widget.valueFieldId || ""]) || 0));
    return <div className="space-y-1">{rows.map((row) => <div key={row.id} className="h-6 rounded bg-[#24124d]" style={{ width: `${Math.max(8, (Number(row.values[widget.valueFieldId || ""]) || 0) / max * 100)}%` }} title={text(row, widget.valueFieldId)} />)}</div>;
  }
  const ids = widget.fieldIds?.length ? widget.fieldIds : recordType.fields.map((item) => item.id);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr>{ids.map((id) => <th key={id} className="px-2 py-1 text-start">{label(id)}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}>{ids.map((id) => <td key={id} className="border-t px-2 py-1">{text(row, id)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function FormTools({ tenantId, he, types, forms, publishedForms, previewWidth, onSave }: {
  tenantId: string;
  he: boolean;
  types: RecordType[];
  forms: FormDef[];
  publishedForms: FormDef[];
  previewWidth: "100%" | "375px";
  onSave: (path: string, body: unknown, ok: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [recordTypeId, setRecordTypeId] = useState("");
  const [stepA, setStepA] = useState<string[]>([]);
  const [stepB, setStepB] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [whenField, setWhenField] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const recordType = types.find((item) => item.id === recordTypeId);
  const fields = (recordType?.fields || []).filter((item) => !item.archived);
  const saved = forms[forms.length - 1];
  const published = publishedForms.find((item) => item.name === saved?.name);

  function toggle(list: string[], id: string, setList: (value: string[]) => void) {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  const visibleQuestion = !question || !whenField || (answers[whenField] || "") === whenValue || whenValue === "";

  async function submit() {
    if (!published) return;
    const values: Record<string, unknown> = {};
    for (const field of fields) values[field.id] = answers[field.id] || "";
    await API.post(`/saas-owner/${tenantId}/builder/forms/${published.id}/submit`, { values });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-2xl border bg-white p-4">
        <h2 className="font-black">{he ? "טופס רב־שלבי" : "Multi-step form"}</h2>
        <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם הטופס" : "Form name"} />
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={recordTypeId} onChange={(event) => setRecordTypeId(event.target.value)}>
          <option value="">{he ? "סוג רשומה" : "Record type"}</option>
          {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div>{fields.map((item) => <label key={item.id} className="flex gap-2"><input type="checkbox" checked={stepA.includes(item.id)} onChange={() => toggle(stepA, item.id, setStepA)} />{item.label}</label>)}</div>
          <div>{fields.map((item) => <label key={item.id} className="flex gap-2"><input type="checkbox" checked={stepB.includes(item.id)} onChange={() => toggle(stepB, item.id, setStepB)} />{item.label}</label>)}</div>
        </div>
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={question} onChange={(event) => setQuestion(event.target.value)}>
          <option value="">{he ? "שאלה מותנית" : "Conditional question"}</option>
          {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <select className="mt-2 w-full rounded-xl border px-3 py-2" value={whenField} onChange={(event) => setWhenField(event.target.value)}>
          <option value="">{he ? "כאשר השדה" : "When field"}</option>
          {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <input className="mt-2 w-full rounded-xl border px-3 py-2" value={whenValue} onChange={(event) => setWhenValue(event.target.value)} placeholder={he ? "שווה ל" : "Equals"} />
        <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("forms", {
          name,
          recordTypeId,
          audience: "staff",
          steps: [{ title: he ? "שלב 1" : "Step 1", fieldIds: stepA }, ...(stepB.length ? [{ title: he ? "שלב 2" : "Step 2", fieldIds: stepB }] : [])],
          questions: question ? [{ fieldId: question, visibleWhen: whenField ? { fieldId: whenField, op: "eq", value: whenValue } : null }] : [],
          buttons: [{ label: he ? "שמירה" : "Save", action: "save_record" }],
        }, he ? "הטופס נשמר בטיוטה" : "Form saved")}>{he ? "שמירת טופס" : "Save form"}</button>
      </article>
      <article className="rounded-2xl border bg-white p-4" style={{ maxWidth: previewWidth === "375px" ? 375 : undefined }}>
        <h2 className="font-black">{saved?.name || (he ? "תצוגת טופס" : "Form preview")}</h2>
        <p className="text-xs">{he ? "שליחה יוצרת רשומה רק אחרי פרסום הטופס." : "Submit creates a record only after the form is published."}</p>
        {((step === 0 ? stepA : stepB).length ? (step === 0 ? stepA : stepB) : fields.map((item) => item.id)).filter((id) => id !== question || visibleQuestion).map((id) => (
          <label key={id} className="mt-2 block text-xs font-bold">{fields.find((item) => item.id === id)?.label}<input className="mt-1 w-full rounded-lg border px-2 py-1" value={answers[id] || ""} onChange={(event) => setAnswers((prev) => ({ ...prev, [id]: event.target.value }))} /></label>
        ))}
        <div className="mt-3 flex gap-2">
          <button type="button" className="rounded-full border px-3 py-1 text-sm font-bold" onClick={() => setStep(step === 0 ? 1 : 0)}>{he ? "שלב הבא" : "Next step"}</button>
          <button type="button" className="rounded-full bg-[#24124d] px-3 py-1 text-sm font-bold text-white" disabled={!published} onClick={() => submit()}>{he ? "שמירת רשומה" : "Save record"}</button>
        </div>
      </article>
    </div>
  );
}

function WorkflowTools({ he, types, workflows, onSave }: { he: boolean; types: RecordType[]; workflows: Workflow[]; onSave: (path: string, body: unknown, ok: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [recordTypeId, setRecordTypeId] = useState("");
  const [labels, setLabels] = useState("פתוח,באישור,סגור");
  const [approval, setApproval] = useState(true);
  const [sla, setSla] = useState("24");
  const statuses = labels.split(",").map((label) => label.trim()).filter(Boolean).map((label, index) => ({ id: `s${index + 1}`, label }));
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "תהליך" : "Workflow"}</h2>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם התהליך" : "Name"} />
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={recordTypeId} onChange={(event) => setRecordTypeId(event.target.value)}>
        <option value="">{he ? "סוג רשומה" : "Record type"}</option>
        {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={labels} onChange={(event) => setLabels(event.target.value)} />
      <label className="mt-2 flex gap-2 text-sm font-bold"><input type="checkbox" checked={approval} onChange={(event) => setApproval(event.target.checked)} />{he ? "המעבר הראשון דורש אישור" : "First transition requires approval"}</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={sla} onChange={(event) => setSla(event.target.value)} placeholder={he ? "שעות טיפול" : "SLA hours"} />
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("workflows", {
        name,
        recordTypeId,
        statuses,
        slaHours: Number(sla),
        transitions: statuses.slice(0, -1).map((status, index) => ({ from: status.id, to: statuses[index + 1].id, requiresApproval: index === 0 && approval })),
      }, he ? "התהליך נשמר בטיוטה" : "Workflow saved")}>{he ? "שמירת תהליך" : "Save workflow"}</button>
      <ul className="mt-3 text-sm">{workflows.filter((item) => !item.archived).map((item) => <li key={item.id}>{item.name} · {item.statuses.map((status) => status.label).join(" → ")} · SLA {item.slaHours ?? "-"}</li>)}</ul>
    </article>
  );
}

function AutomationTools({ tenantId, he, types, workflows, automations, onSave, onReload, onError, onMessage }: {
  tenantId: string;
  he: boolean;
  types: RecordType[];
  workflows: Workflow[];
  automations: Automation[];
  onSave: (path: string, body: unknown, ok: string) => Promise<void>;
  onReload: () => Promise<void>;
  onError: (value: string) => void;
  onMessage: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [recordTypeId, setRecordTypeId] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [value, setValue] = useState("");
  const [recordId, setRecordId] = useState("");
  const [trigger, setTrigger] = useState("record.created");
  const fields = (types.find((item) => item.id === recordTypeId)?.fields || []).filter((item) => !item.archived && !item.formula);
  async function run(id: string, confirmRun: boolean) {
    onError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/automations/${id}/run`, { recordId, confirmRun, trigger });
      onMessage(confirmRun ? (he ? "הריצה הפנימית נשמרה. לא נשלח דבר החוצה." : "Internal run saved. Nothing was sent.") : (he ? `בדיקת ניסיון: ${data.plan?.actions?.length || 0} פעולות` : "Dry run finished"));
      await onReload();
    } catch (err) {
      onError(apiError(err, "Run failed"));
    }
  }
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "אוטומציה" : "Automation"}</h2>
      <p className="text-xs">{he ? "רק פעולות מאושרות. אין קוד חופשי ואין שליחה חיצונית. תזמון נשמר ונבדק ידנית; אין מנוע רקע פעיל." : "Approved actions only. Schedule is stored and checked manually."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם" : "Name"} />
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={trigger} onChange={(event) => setTrigger(event.target.value)}>
        <option value="record.created">record.created</option>
        <option value="record.updated">record.updated</option>
        <option value="schedule">schedule</option>
      </select>
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={recordTypeId} onChange={(event) => setRecordTypeId(event.target.value)}>
        <option value="">{he ? "סוג רשומה" : "Record type"}</option>
        {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={fieldId} onChange={(event) => setFieldId(event.target.value)}>
        <option value="">{he ? "שדה לעדכון" : "Field"}</option>
        {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={value} onChange={(event) => setValue(event.target.value)} placeholder={he ? "ערך" : "Value"} />
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("automations", {
        name,
        trigger: { kind: trigger, recordTypeId, everyHours: trigger === "schedule" ? 24 : null },
        workflowId: workflows[0]?.id || "",
        actions: [{ kind: "set_field", fieldId, value }],
        retryLimit: 1,
        dedupe: true,
      }, he ? "האוטומציה נשמרה בטיוטה" : "Automation saved")}>{he ? "שמירה" : "Save"}</button>
      <ul className="mt-3 space-y-2 text-sm">
        {automations.filter((item) => item.enabled !== false).map((item) => (
          <li key={item.id} className="flex flex-wrap gap-2">
            <span>{item.name} · {item.trigger?.kind}</span>
            <button type="button" className="font-bold" onClick={() => run(item.id, false)}>{he ? "בדיקת ניסיון" : "Dry run"}</button>
            <button type="button" className="font-bold" onClick={() => run(item.id, true)}>{he ? "הרצה פנימית" : "Internal run"}</button>
            <button type="button" className="font-bold" onClick={() => onSave(`automations/${item.id}/cancel`, {}, he ? "האוטומציה בוטלה" : "Cancelled")}>{he ? "ביטול" : "Cancel"}</button>
          </li>
        ))}
      </ul>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={recordId} onChange={(event) => setRecordId(event.target.value)} placeholder={he ? "מזהה רשומה לבדיקה" : "Record id"} />
    </article>
  );
}

function RoleTools({ he, roles, onSave }: { he: boolean; roles: Role[]; onSave: (path: string, body: unknown, ok: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>(["records.view"]);
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "תפקיד" : "Role"}</h2>
      <p className="text-xs">{he ? "אי אפשר להעניק הרשאות מערכת, קוד או חיוב." : "Platform, source, and billing permissions stay blocked."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם התפקיד" : "Role name"} />
      <div className="mt-2 grid gap-1 sm:grid-cols-2">
        {ROLE_KEYS.map((key) => (
          <label key={key} className="flex gap-2 text-sm"><input type="checkbox" checked={permissions.includes(key)} onChange={() => setPermissions((prev) => prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key])} />{key}</label>
        ))}
      </div>
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("roles", { name, permissions }, he ? "התפקיד נשמר" : "Role saved")}>{he ? "שמירת תפקיד" : "Save role"}</button>
      <ul className="mt-3 text-sm">{roles.map((role) => <li key={role.name}>{role.name}: {role.permissions.join(", ")}</li>)}</ul>
    </article>
  );
}

function ProductTools({ he, products, onSave }: { he: boolean; products: Product[]; onSave: (path: string, body: unknown, ok: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [kind, setKind] = useState("product");
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "מוצרים ללקוחות הקצה" : "End-customer catalog"}</h2>
      <p className="text-xs">{he ? "זה מחירון של בעל המערכת ללקוחות שלו. הוא לא מחייב את Bizuply." : "This catalog bills the end customer, not the Bizuply subscription."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם" : "Name"} />
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={price} onChange={(event) => setPrice(event.target.value)} placeholder={he ? "מחיר" : "Price"} />
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={kind} onChange={(event) => setKind(event.target.value)}>
        <option value="product">{he ? "מוצר" : "Product"}</option>
        <option value="package">{he ? "חבילה" : "Package"}</option>
      </select>
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("products", { name, price: Number(price), kind, currency: "ILS" }, he ? "המוצר נשמר" : "Saved")}>{he ? "שמירה" : "Save"}</button>
      <ul className="mt-3 text-sm">{products.map((item) => <li key={item.id}>{item.name} · {item.price} {item.currency} · {item.kind} · {item.billing}</li>)}</ul>
    </article>
  );
}

function MessageTools({ tenantId, he, messages, onSave, onError, onMessage }: {
  tenantId: string;
  he: boolean;
  messages: Message[];
  onSave: (path: string, body: unknown, ok: string) => Promise<void>;
  onError: (value: string) => void;
  onMessage: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("email");
  const [template, setTemplate] = useState("");
  async function preview(id: string) {
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/messages/${id}/preview`, { values: {} });
      onMessage(`${data.body} · ${data.delivery?.status}`);
    } catch (err) {
      onError(apiError(err, "Preview failed"));
    }
  }
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "תבנית הודעה" : "Message template"}</h2>
      <p className="text-xs">{he ? "התצוגה נשמרת כאן. שליחת WhatsApp, SMS או דוא״ל אינה מופעלת." : "Preview only. WhatsApp, SMS, and email are not sent."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם" : "Name"} />
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={channel} onChange={(event) => setChannel(event.target.value)}>
        <option value="whatsapp">WhatsApp</option>
        <option value="sms">SMS</option>
        <option value="email">{he ? "דוא״ל" : "Email"}</option>
      </select>
      <textarea className="mt-2 h-24 w-full rounded-xl border px-3 py-2" value={template} onChange={(event) => setTemplate(event.target.value)} />
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("messages", { name, channel, template }, he ? "התבנית נשמרה" : "Saved")}>{he ? "שמירה" : "Save"}</button>
      <ul className="mt-3 text-sm">{messages.map((item) => <li key={item.id}>{item.name} · {item.channel} <button type="button" className="font-bold" onClick={() => preview(item.id)}>{he ? "תצוגה בלי שליחה" : "Preview"}</button></li>)}</ul>
    </article>
  );
}

function DocumentTools({ he, documents, signed, onSave }: { he: boolean; documents: DocumentDef[]; signed: { id: string; title: string; signerName: string; hash: string }[]; onSave: (path: string, body: unknown, ok: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [signer, setSigner] = useState("");
  const [documentId, setDocumentId] = useState("");
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "מסמך וחתימה" : "Document and signature"}</h2>
      <p className="text-xs">{he ? "החתימה היא עותק חתום עם טביעת SHA-256. אין ספק חתימה חיצוני בפעולה הזו." : "The signature is an immutable SHA-256 copy. No external signature vendor is called."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={he ? "כותרת" : "Title"} />
      <textarea className="mt-2 h-24 w-full rounded-xl border px-3 py-2" value={body} onChange={(event) => setBody(event.target.value)} />
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("documents", { title, body }, he ? "המסמך נשמר" : "Saved")}>{he ? "שמירת מסמך" : "Save document"}</button>
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={documentId} onChange={(event) => setDocumentId(event.target.value)}>
        <option value="">{he ? "מסמך לחתימה" : "Document"}</option>
        {documents.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={signer} onChange={(event) => setSigner(event.target.value)} placeholder={he ? "שם החותם" : "Signer"} />
      <button type="button" className="mt-3 rounded-full border px-4 py-2 text-sm font-bold" onClick={() => onSave(`documents/${documentId}/sign`, { signerName: signer }, he ? "העותק נחתם" : "Signed")}>{he ? "חתימה" : "Sign"}</button>
      <ul className="mt-3 text-xs">{signed.map((item) => <li key={item.id}>{item.title} · {item.signerName} · {item.hash.slice(0, 12)}</li>)}</ul>
    </article>
  );
}

function ReportTools({ tenantId, he, types, reports, onSave, onError, onMessage }: {
  tenantId: string;
  he: boolean;
  types: RecordType[];
  reports: Report[];
  onSave: (path: string, body: unknown, ok: string) => Promise<void>;
  onError: (value: string) => void;
  onMessage: (value: string) => void;
}) {
  const [name, setName] = useState("");
  const [recordTypeId, setRecordTypeId] = useState("");
  const [metric, setMetric] = useState("count");
  const [fieldId, setFieldId] = useState("");
  const fields = (types.find((item) => item.id === recordTypeId)?.fields || []).filter((item) => !item.archived);
  async function run(id: string) {
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/reports/${id}/run`);
      onMessage(JSON.stringify(data.report));
    } catch (err) {
      onError(apiError(err, "Report failed"));
    }
  }
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "דוח" : "Report"}</h2>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder={he ? "שם" : "Name"} />
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={recordTypeId} onChange={(event) => setRecordTypeId(event.target.value)}>
        <option value="">{he ? "סוג רשומה" : "Record type"}</option>
        {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={metric} onChange={(event) => setMetric(event.target.value)}>
        <option value="count">{he ? "ספירה" : "Count"}</option>
        <option value="sum">{he ? "סכום" : "Sum"}</option>
      </select>
      <select className="mt-2 w-full rounded-xl border px-3 py-2" value={fieldId} onChange={(event) => setFieldId(event.target.value)}>
        <option value="">{he ? "שדה" : "Field"}</option>
        {fields.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("reports", { name, recordTypeId, metric, fieldId: metric === "sum" ? fieldId : "", groupFieldId: metric === "count" ? fieldId : "" }, he ? "הדוח נשמר" : "Saved")}>{he ? "שמירה" : "Save"}</button>
      <ul className="mt-3 text-sm">{reports.map((item) => <li key={item.id}>{item.name} · {item.metric} <button type="button" className="font-bold" onClick={() => run(item.id)}>{he ? "הרצה" : "Run"}</button></li>)}</ul>
    </article>
  );
}

function WebhookTools({ tenantId, he, hooks, onError, onMessage, onReload }: {
  tenantId: string;
  he: boolean;
  hooks: { id: string; url: string; secretHint?: string; events?: string[] }[];
  onError: (value: string) => void;
  onMessage: (value: string) => void;
  onReload: () => Promise<void>;
}) {
  const [url, setUrl] = useState("https://");
  async function save() {
    onError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/builder/webhooks`, { url, events: ["record.created"] });
      onMessage(data.secretOnce ? (he ? `הסוד מוצג פעם אחת: ${data.secretOnce}` : `Secret once: ${data.secretOnce}`) : (he ? "החיבור עודכן" : "Updated"));
      await onReload();
    } catch (err) {
      onError(apiError(err, "Save failed"));
    }
  }
  async function probe(id: string) {
    const { data } = await API.post(`/saas-owner/${tenantId}/builder/webhooks/${id}/probe`);
    onMessage(`${data.delivered} · ${data.reason}`);
  }
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">Webhook</h2>
      <p className="text-xs">{he ? "נשמרת כתובת https בלבד. הבדיקה לא שולחת קריאה החוצה." : "HTTPS is stored. Probe does not call the network."}</p>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={url} onChange={(event) => setUrl(event.target.value)} />
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={save}>{he ? "שמירה" : "Save"}</button>
      <ul className="mt-3 text-sm">{hooks.map((item) => <li key={item.id}>{item.url} · {item.secretHint} <button type="button" className="font-bold" onClick={() => probe(item.id)}>{he ? "בדיקה בלי שליחה" : "Probe"}</button></li>)}</ul>
    </article>
  );
}

function TemplateTools({ he, bridge, onSave }: { he: boolean; bridge?: { connected?: boolean; reason?: string } | null; onSave: (path: string, body: unknown, ok: string) => Promise<void> }) {
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "מבנה התחלה" : "Starter structure"}</h2>
      <p className="text-sm">{bridge?.reason || (he ? "המבנה נשמר ב־Bizuply בלבד." : "Stored in Bizuply only.")}</p>
      <p className="mt-2 text-sm font-bold">{he ? "מחובר לאפליקציה החיצונית: " : "External app connected: "}{bridge?.connected ? "yes" : "no"}</p>
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-4 py-2 text-sm font-bold text-white" onClick={() => onSave("template-seed", {}, he ? "מבנה ההתחלה נשמר כטיוטה" : "Starter saved")}>{he ? "טעינת מבנה התבנית" : "Load starter"}</button>
    </article>
  );
}

function InfraTools({ tenantId, he, onError, onMessage }: { tenantId: string; he: boolean; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const [view, setView] = useState<Record<string, unknown> | null>(null);
  const [planId, setPlanId] = useState("growth");
  const [host, setHost] = useState("");
  async function load() {
    try {
      const { data } = await API.get(`/saas-owner/${tenantId}/builder/infrastructure`);
      setView(data.infrastructure);
    } catch (err) {
      onError(apiError(err, "Load failed"));
    }
  }
  async function upgrade() {
    try {
      await API.post(`/saas-owner/${tenantId}/upgrade-request`, { planId, note: "plan" });
      onMessage(he ? "בקשת השדרוג נשמרה בלי חיוב ובלי החלפת חבילה." : "Upgrade request saved without a charge.");
      await load();
    } catch (err) {
      onError(apiError(err, "Request failed"));
    }
  }
  async function domain() {
    try {
      await API.post(`/saas-owner/${tenantId}/domain-request`, { host });
      onMessage(he ? "בקשת הדומיין נשמרה. לא בוצעה רכישה." : "Domain request saved. Nothing was purchased.");
    } catch (err) {
      onError(apiError(err, "Request failed"));
    }
  }
  const hosting = (view?.hosting || {}) as { planId?: string; usedMb?: number; quotaMb?: number };
  const database = (view?.database || {}) as { isolation?: string; backup?: string };
  const domainState = (view?.domain || {}) as { host?: string; status?: string; ssl?: string };
  const advice = (view?.paymentAdvice || {}) as { recommend?: string; applied?: boolean };
  return (
    <article className="rounded-2xl border bg-white p-4">
      <h2 className="font-black">{he ? "תשתית" : "Infrastructure"}</h2>
      <button type="button" className="mt-2 rounded-full border px-4 py-2 text-sm font-bold" onClick={load}>{he ? "רענון מצב" : "Refresh"}</button>
      {view ? (
        <div className="mt-3 space-y-1 text-sm">
          <p>{he ? "אחסון" : "Hosting"}: {hosting.planId} · {hosting.usedMb}/{hosting.quotaMb} MB</p>
          <p>{he ? "מסד" : "Database"}: {database.isolation} · backup {database.backup}</p>
          <p>{he ? "דומיין" : "Domain"}: {domainState.host} · {domainState.status} · SSL {domainState.ssl}</p>
          <p>{he ? "חיוב בוצע" : "Charged"}: {String(view.charged)} · {he ? "רשם מוגדר" : "Registrar configured"}: {String(view.registrarConfigured)}</p>
          <p>{he ? "המלצת תשלום" : "Payment advice"}: {advice.recommend} · applied {String(advice.applied)}</p>
        </div>
      ) : null}
      <select className="mt-3 w-full rounded-xl border px-3 py-2" value={planId} onChange={(event) => setPlanId(event.target.value)}>
        <option value="starter">starter</option>
        <option value="growth">growth</option>
        <option value="scale">scale</option>
      </select>
      <button type="button" className="mt-2 rounded-full border px-4 py-2 text-sm font-bold" onClick={upgrade}>{he ? "בקשת שדרוג בלי חיוב" : "Request upgrade"}</button>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={host} onChange={(event) => setHost(event.target.value)} placeholder="example.co.il" />
      <button type="button" className="mt-2 rounded-full border px-4 py-2 text-sm font-bold" onClick={domain}>{he ? "בקשת דומיין בלי רכישה" : "Request domain"}</button>
    </article>
  );
}
