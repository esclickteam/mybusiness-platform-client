import { useEffect, useState } from "react";
import API from "../../../api";

const FIELD_TYPES = ["text", "textarea", "number", "date", "select", "checkbox", "email", "phone"];

const emptyDefinition = () => ({
  fields: [],
  screens: [],
  forms: [],
  recordTypes: [],
  permissions: [],
  views: [],
  processes: [],
});

export default function SaasBridgePage() {
  const [systems, setSystems] = useState([]);
  const [links, setLinks] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [linkId, setLinkId] = useState("");
  const [definition, setDefinition] = useState(emptyDefinition());
  const [form, setForm] = useState({ systemKey: "beautyflow", externalTenantId: "" });
  const [field, setField] = useState({ entity: "client", label: "", type: "text" });
  const [permission, setPermission] = useState({ role: "", permission: "", allowed: true });
  const [processDraft, setProcessDraft] = useState({ title: "", steps: "" });
  const [releases, setReleases] = useState([]);
  const [message, setMessage] = useState("");
  const [log, setLog] = useState([]);
  const [disabled, setDisabled] = useState(false);

  async function load() {
    try {
      const [catalogRes, systemsRes, linksRes] = await Promise.all([
        API.get("/saas-bridge/catalog"),
        API.get("/saas-bridge/systems"),
        API.get("/saas-bridge/links"),
      ]);
      setCatalog(catalogRes.data.systems || []);
      setSystems(systemsRes.data.systems || []);
      setLinks(linksRes.data.links || []);
      const first = linksRes.data.links?.[0];
      if (first) {
        setLinkId(first.id);
        const releaseRes = await API.get(`/saas-bridge/links/${first.id}/releases`);
        const published = (releaseRes.data.releases || []).find((item) => item.status === "published");
        setReleases(releaseRes.data.releases || []);
        if (published?.definition) setDefinition({ ...emptyDefinition(), ...published.definition });
      }
      setDisabled(false);
    } catch (error) {
      if (error?.response?.status === 404) setDisabled(true);
      setMessage(error?.response?.data?.error || "לא ניתן לטעון את הגשר");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const selected = links.find((link) => link.id === linkId) || links[0];
  const system = catalog.find((item) => item.key === (selected?.systemKey || form.systemKey));

  async function connect(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await API.post("/saas-bridge/links", form);
      setLinkId(response.data.link.id);
      setMessage("המופע קושר ל־Tenant");
      await load();
    } catch (error) {
      setMessage(error?.response?.data?.error || "הקישור נכשל");
    }
  }

  function addField() {
    if (!field.label) return;
    setDefinition((current) => ({
      ...current,
      fields: [...current.fields, { ...field, key: field.label }],
    }));
    setField({ ...field, label: "" });
  }

  function addBlock(bucket, title) {
    const key = title.trim().toLowerCase().replace(/\s+/g, "_");
    if (!key) return;
    setDefinition((current) => ({
      ...current,
      [bucket]: [...current[bucket], { key, title, entity: field.entity, fieldKeys: current.fields.map((item) => item.key || item.label) }],
    }));
  }

  function addProcess() {
    const steps = processDraft.steps.split(",").map((label) => ({ label: label.trim() })).filter((step) => step.label);
    if (!processDraft.title || !steps.length) return;
    setDefinition((current) => ({
      ...current,
      processes: [...(current.processes || []), { key: processDraft.title, title: processDraft.title, entity: field.entity, steps }],
    }));
    setProcessDraft({ title: "", steps: "" });
  }

  function addPermission() {
    if (!permission.role || !permission.permission) return;
    setDefinition((current) => ({
      ...current,
      permissions: [...current.permissions, { ...permission, allowed: permission.allowed !== false }],
    }));
  }

  async function restore(version) {
    if (!selected) return;
    const response = await API.post(`/saas-bridge/links/${selected.id}/restore`, { version });
    setMessage(`שוחזרה גרסה ${response.data.version} במערכת האמיתית`);
    setDefinition(response.data.definition || emptyDefinition());
  }

  async function publish() {
    if (!selected) return;
    setMessage("");
    try {
      const response = await API.post(`/saas-bridge/links/${selected.id}/publish`, { definition });
      setMessage(`פורסם גרסה ${response.data.version} במערכת האמיתית`);
      const logRes = await API.get(`/saas-bridge/links/${selected.id}/log`);
      setLog(logRes.data.entries || []);
    } catch (error) {
      setMessage(error?.response?.data?.error || "הפרסום נכשל");
    }
  }

  async function openSystem() {
    if (!selected) return;
    const response = await API.post(`/saas-bridge/links/${selected.id}/handoff`, {});
    window.open(response.data.url, "_blank", "noopener");
  }

  if (disabled) {
    return <section className="p-6">הגשר כבוי. להפעלה בסביבת בדיקה הגדירו SAAS_BRIDGE_ENABLED=true</section>;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-semibold">הרחבת מערכות SaaS</h1>
        <p className="text-sm text-slate-600">
          השינויים נשמרים למופע המקושר ומופיעים במערכת אחרי פרסום. אוטומציות ממשיכות להיבנות במסך האוטומציות הקיים.
        </p>
      </header>
      <form onSubmit={connect} className="grid gap-3 rounded-2xl border p-4">
        <label>
          מערכת
          <select className="mt-1 w-full rounded border p-2" value={form.systemKey} onChange={(event) => setForm({ ...form, systemKey: event.target.value })}>
            {catalog.map((item) => (
              <option key={item.key} value={item.key}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          מזהה Tenant
          <input className="mt-1 w-full rounded border p-2" value={form.externalTenantId} onChange={(event) => setForm({ ...form, externalTenantId: event.target.value })} required />
        </label>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">קישור למערכת</button>
        <p className="text-xs text-slate-500">מערכות רשומות בשרת: {systems.map((item) => item.name).join(", ") || "אין"}</p>
      </form>
      {selected ? (
        <div className="space-y-4 rounded-2xl border p-4">
          <h2 className="font-medium">{selected.externalName || selected.systemKey} · גרסה {selected.publishedVersion}</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="rounded border p-2" placeholder="שם שדה" value={field.label} onChange={(event) => setField({ ...field, label: event.target.value })} />
            <select className="rounded border p-2" value={field.entity} onChange={(event) => setField({ ...field, entity: event.target.value })}>
              {(system?.entities || []).map((entity) => <option key={entity}>{entity}</option>)}
            </select>
            <select className="rounded border p-2" value={field.type} onChange={(event) => setField({ ...field, type: event.target.value })}>
              {FIELD_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="rounded border p-2" value={permission.role} onChange={(event) => setPermission({ ...permission, role: event.target.value })}>
              <option value="">תפקיד</option>
              {(system?.roles || []).map((role) => <option key={role}>{role}</option>)}
            </select>
            <select className="rounded border p-2" value={permission.permission} onChange={(event) => setPermission({ ...permission, permission: event.target.value })}>
              <option value="">הרשאה</option>
              {(system?.permissions || []).map((item) => <option key={item}>{item}</option>)}
            </select>
            <button type="button" className="rounded border px-3 py-2" onClick={addPermission}>הוספת הרשאה</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input className="rounded border p-2" placeholder="שם תהליך" value={processDraft.title} onChange={(event) => setProcessDraft({ ...processDraft, title: event.target.value })} />
            <input className="rounded border p-2" placeholder="שלבים מופרדים בפסיק" value={processDraft.steps} onChange={(event) => setProcessDraft({ ...processDraft, steps: event.target.value })} />
            <button type="button" className="rounded border px-3 py-2" onClick={addProcess}>תהליך</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border px-3 py-2" onClick={addField}>הוספת שדה</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("screens", "מסך חדש")}>מסך</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("forms", "טופס חדש")}>טופס</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("recordTypes", "רשומה חדשה")}>סוג רשומה</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("views", "תצוגה חדשה")}>תצוגה</button>
            <button type="button" className="rounded bg-slate-900 px-3 py-2 text-white" onClick={publish}>פרסום למערכת</button>
            <button type="button" className="rounded border px-3 py-2" onClick={openSystem}>כניסה למערכת בלי סיסמה</button>
          </div>
          <ul className="text-sm">
            {definition.fields.map((item) => <li key={`${item.entity}-${item.label}`}>{item.entity}: {item.label}</li>)}
            {(definition.processes || []).map((item) => <li key={item.title}>תהליך {item.title}</li>)}
            {definition.permissions.map((item) => <li key={`${item.role}-${item.permission}`}>{item.role}: {item.permission}</li>)}
          </ul>
          <div className="flex flex-wrap gap-2">
            {releases.filter((item) => item.status === "published").map((item) => (
              <button key={item.version} type="button" className="rounded border px-3 py-2 text-sm" onClick={() => restore(item.version)}>
                שחזור גרסה {item.version}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {message ? <p>{message}</p> : null}
      <ul className="text-xs text-slate-600">
        {log.map((entry) => <li key={`${entry.action}-${entry.createdAt}`}>{entry.action}: {entry.message}</li>)}
      </ul>
    </section>
  );
}
