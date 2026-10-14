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

const COPY = {
  he: {
    title: "הרחבת מערכות SaaS",
    intro: "השינויים נשמרים למופע המקושר ומופיעים במערכת אחרי פרסום.",
    system: "מערכת",
    tenant: "מזהה Tenant",
    connect: "קישור למערכת",
    registered: "מערכות רשומות בשרת",
    none: "אין",
    fieldName: "שם שדה",
    role: "תפקיד",
    permission: "הרשאה",
    addPermission: "הוספת הרשאה",
    processName: "שם תהליך",
    steps: "שלבים מופרדים בפסיק",
    process: "תהליך",
    addField: "הוספת שדה",
    screen: "מסך",
    form: "טופס",
    record: "סוג רשומה",
    view: "תצוגה",
    draft: "שמירת טיוטה",
    publish: "פרסום למערכת",
    open: "כניסה למערכת בלי סיסמה",
    preview: "תצוגה מקדימה",
    restore: "שחזור גרסה",
    automation: "אוטומציה",
    event: "אירוע מהמערכת",
    condition: "תנאי",
    action: "כותרת משימה",
    createAutomation: "יצירת אוטומציה",
    language: "English",
    off: "הגשר כבוי. להפעלה בסביבת בדיקה הגדירו SAAS_BRIDGE_ENABLED=true",
    loadError: "לא ניתן לטעון את הגשר",
    linked: "המופע קושר ל־Tenant",
    linkFailed: "הקישור נכשל",
    published: "פורסם במערכת האמיתית",
    publishFailed: "הפרסום נכשל",
    draftSaved: "הטיוטה נשמרה",
    restored: "שוחזרה גרסה במערכת האמיתית",
    automationSaved: "האוטומציה נשמרה כטיוטה",
  },
  en: {
    title: "SaaS extensions",
    intro: "Changes stay on the linked tenant and appear in the product after publish.",
    system: "System",
    tenant: "Tenant id",
    connect: "Link system",
    registered: "Systems registered on the server",
    none: "none",
    fieldName: "Field name",
    role: "Role",
    permission: "Permission",
    addPermission: "Add permission",
    processName: "Process name",
    steps: "Comma-separated steps",
    process: "Process",
    addField: "Add field",
    screen: "Screen",
    form: "Form",
    record: "Record type",
    view: "View",
    draft: "Save draft",
    publish: "Publish",
    open: "Open the product",
    preview: "Preview",
    restore: "Restore version",
    automation: "Automation",
    event: "Source event",
    condition: "Condition",
    action: "Task title",
    createAutomation: "Create automation",
    language: "עברית",
    off: "The bridge is off. Set SAAS_BRIDGE_ENABLED=true in a test environment.",
    loadError: "The bridge could not be loaded",
    linked: "Tenant linked",
    linkFailed: "Link failed",
    published: "Published to the real system",
    publishFailed: "Publish failed",
    draftSaved: "Draft saved",
    restored: "Previous version restored in the real system",
    automationSaved: "Automation saved as a draft",
  },
};

export default function SaasBridgePage() {
  const [locale, setLocale] = useState("he");
  const text = COPY[locale];
  const [systems, setSystems] = useState([]);
  const [links, setLinks] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [linkId, setLinkId] = useState("");
  const [definition, setDefinition] = useState(emptyDefinition());
  const [form, setForm] = useState({ systemKey: "beautyflow", externalTenantId: "" });
  const [field, setField] = useState({ entity: "client", label: "", type: "text" });
  const [permission, setPermission] = useState({ role: "", permission: "", allowed: true });
  const [processDraft, setProcessDraft] = useState({ title: "", steps: "" });
  const [automation, setAutomation] = useState({ event: "", condition: "", actionTitle: "Task" });
  const [releases, setReleases] = useState([]);
  const [message, setMessage] = useState("");
  const [log, setLog] = useState([]);
  const [disabled, setDisabled] = useState(false);

  async function selectLink(id, knownLinks = links) {
    setLinkId(id);
    const releaseRes = await API.get(`/saas-bridge/links/${id}/releases`);
    const list = releaseRes.data.releases || [];
    setReleases(list);
    const current = list.find((item) => item.status === "draft") || list.find((item) => item.status === "published");
    setDefinition({ ...emptyDefinition(), ...(current?.definition || {}) });
    const link = knownLinks.find((item) => item.id === id);
    if (link) setForm((currentForm) => ({ ...currentForm, systemKey: link.systemKey }));
  }

  async function load() {
    try {
      const [catalogRes, systemsRes, linksRes] = await Promise.all([
        API.get("/saas-bridge/catalog"),
        API.get("/saas-bridge/systems"),
        API.get("/saas-bridge/links"),
      ]);
      const nextLinks = linksRes.data.links || [];
      setCatalog(catalogRes.data.systems || []);
      setSystems(systemsRes.data.systems || []);
      setLinks(nextLinks);
      const first = nextLinks[0];
      if (first) await selectLink(first.id, nextLinks);
      setDisabled(false);
    } catch (error) {
      if (error?.response?.status === 404) setDisabled(true);
      setMessage(error?.response?.data?.error || text.loadError);
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
      setMessage(text.linked);
      await load();
      if (response.data.link?.id) setLinkId(response.data.link.id);
    } catch (error) {
      setMessage(error?.response?.data?.error || text.linkFailed);
    }
  }

  function addField() {
    if (!field.label) return;
    setDefinition((current) => {
      const next = { entity: field.entity, label: field.label, type: field.type, key: field.label };
      const fields = current.fields.filter((item) => item.key !== next.key || item.entity !== next.entity);
      return { ...current, fields: [...fields, next] };
    });
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
    setMessage(`${text.restored} ${response.data.version}`);
    setDefinition(response.data.definition || emptyDefinition());
    await selectLink(selected.id);
  }

  async function saveDraft() {
    if (!selected) return;
    const response = await API.post(`/saas-bridge/links/${selected.id}/draft`, { definition });
    setMessage(`${text.draftSaved} ${response.data.version}`);
    await selectLink(selected.id);
  }

  async function publish() {
    if (!selected) return;
    setMessage("");
    try {
      const response = await API.post(`/saas-bridge/links/${selected.id}/publish`, { definition });
      setMessage(`${text.published} ${response.data.version}`);
      const logRes = await API.get(`/saas-bridge/links/${selected.id}/log`);
      setLog(logRes.data.entries || []);
      await selectLink(selected.id);
    } catch (error) {
      setMessage(error?.response?.data?.error || text.publishFailed);
    }
  }

  async function createAutomation(event) {
    event.preventDefault();
    if (!automation.event) return;
    await API.post("/automations", {
      name: `${selected?.systemKey || "saas"} ${automation.event}`,
      useStarter: false,
      nodes: [
        { id: "t1", type: "trigger", position: { x: 0, y: 0 }, data: { triggerKey: automation.event } },
        { id: "c1", type: "condition", position: { x: 220, y: 0 }, data: { expression: automation.condition } },
        { id: "a1", type: "action", position: { x: 440, y: 0 }, data: { actionKey: "create_task", title: automation.actionTitle } },
      ],
      edges: [
        { id: "e1", source: "t1", target: "c1" },
        { id: "e2", source: "c1", target: "a1" },
      ],
    });
    setMessage(text.automationSaved);
  }

  async function openSystem() {
    if (!selected) return;
    const response = await API.post(`/saas-bridge/links/${selected.id}/handoff`, {});
    window.open(response.data.url, "_blank", "noopener");
  }

  if (disabled) {
    return <section className="p-6">{text.off}</section>;
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6" dir={locale === "he" ? "rtl" : "ltr"}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{text.title}</h1>
          <p className="text-sm text-slate-600">{text.intro}</p>
        </div>
        <button type="button" className="rounded border px-3 py-2" onClick={() => setLocale(locale === "he" ? "en" : "he")}>{text.language}</button>
      </header>
      <form onSubmit={connect} className="grid gap-3 rounded-2xl border p-4">
        <label>
          {text.system}
          <select className="mt-1 w-full rounded border p-2" value={form.systemKey} onChange={(event) => setForm({ ...form, systemKey: event.target.value })}>
            {catalog.map((item) => (
              <option key={item.key} value={item.key}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          {text.tenant}
          <input className="mt-1 w-full rounded border p-2" value={form.externalTenantId} onChange={(event) => setForm({ ...form, externalTenantId: event.target.value })} required />
        </label>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">{text.connect}</button>
        <p className="text-xs text-slate-500">{text.registered}: {systems.map((item) => item.name).join(", ") || text.none}</p>
      </form>
      {links.length ? (
        <label className="block">
          {text.system}
          <select className="mt-1 w-full rounded border p-2" value={selected?.id || ""} onChange={(event) => selectLink(event.target.value)}>
            {links.map((link) => (
              <option key={link.id} value={link.id}>{link.externalName || link.systemKey}</option>
            ))}
          </select>
        </label>
      ) : null}
      {selected ? (
        <div className="space-y-4 rounded-2xl border p-4">
          <h2 className="font-medium">{selected.externalName || selected.systemKey} · {selected.publishedVersion}</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="rounded border p-2" placeholder={text.fieldName} value={field.label} onChange={(event) => setField({ ...field, label: event.target.value })} />
            <select className="rounded border p-2" value={field.entity} onChange={(event) => setField({ ...field, entity: event.target.value })}>
              {(system?.entities || []).map((entity) => <option key={entity}>{entity}</option>)}
            </select>
            <select className="rounded border p-2" value={field.type} onChange={(event) => setField({ ...field, type: event.target.value })}>
              {FIELD_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="rounded border p-2" value={permission.role} onChange={(event) => setPermission({ ...permission, role: event.target.value })}>
              <option value="">{text.role}</option>
              {(system?.roles || []).map((role) => <option key={role}>{role}</option>)}
            </select>
            <select className="rounded border p-2" value={permission.permission} onChange={(event) => setPermission({ ...permission, permission: event.target.value })}>
              <option value="">{text.permission}</option>
              {(system?.permissions || []).map((item) => <option key={item}>{item}</option>)}
            </select>
            <button type="button" className="rounded border px-3 py-2" onClick={addPermission}>{text.addPermission}</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input className="rounded border p-2" placeholder={text.processName} value={processDraft.title} onChange={(event) => setProcessDraft({ ...processDraft, title: event.target.value })} />
            <input className="rounded border p-2" placeholder={text.steps} value={processDraft.steps} onChange={(event) => setProcessDraft({ ...processDraft, steps: event.target.value })} />
            <button type="button" className="rounded border px-3 py-2" onClick={addProcess}>{text.process}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border px-3 py-2" onClick={addField}>{text.addField}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("screens", locale === "he" ? "מסך חדש" : "New screen")}>{text.screen}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("forms", locale === "he" ? "טופס חדש" : "New form")}>{text.form}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("recordTypes", locale === "he" ? "רשומה חדשה" : "New record")}>{text.record}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={() => addBlock("views", locale === "he" ? "תצוגה חדשה" : "New view")}>{text.view}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={saveDraft}>{text.draft}</button>
            <button type="button" className="rounded bg-slate-900 px-3 py-2 text-white" onClick={publish}>{text.publish}</button>
            <button type="button" className="rounded border px-3 py-2" onClick={openSystem}>{text.open}</button>
          </div>
          <div className="rounded border p-3 text-sm">
            <h3 className="font-medium">{text.preview}</h3>
            <ul>
              {definition.fields.map((item) => (
                <li key={`${item.entity}-${item.label}`}>
                  <button type="button" onClick={() => setField({ entity: item.entity, label: item.label, type: item.type || "text" })}>{item.entity}: {item.label}</button>
                </li>
              ))}
              {(definition.screens || []).map((item) => <li key={item.key}>{text.screen}: {item.title}</li>)}
              {(definition.forms || []).map((item) => <li key={item.key}>{text.form}: {item.title}</li>)}
              {(definition.recordTypes || []).map((item) => <li key={item.key}>{text.record}: {item.title}</li>)}
              {(definition.processes || []).map((item) => <li key={item.title}>{text.process} {item.title}: {(item.steps || []).map((step) => step.label).join(", ")}</li>)}
              {definition.permissions.map((item) => <li key={`${item.role}-${item.permission}`}>{item.role}: {item.permission}</li>)}
            </ul>
          </div>
          <form onSubmit={createAutomation} className="grid gap-2 sm:grid-cols-2">
            <h3 className="sm:col-span-2 font-medium">{text.automation}</h3>
            <select className="rounded border p-2" value={automation.event} onChange={(event) => setAutomation({ ...automation, event: event.target.value })}>
              <option value="">{text.event}</option>
              {(system?.events || []).map((eventName) => <option key={eventName}>{eventName}</option>)}
            </select>
            <input className="rounded border p-2" placeholder={text.condition} value={automation.condition} onChange={(event) => setAutomation({ ...automation, condition: event.target.value })} />
            <input className="rounded border p-2" placeholder={text.action} value={automation.actionTitle} onChange={(event) => setAutomation({ ...automation, actionTitle: event.target.value })} />
            <button className="rounded border px-3 py-2" type="submit">{text.createAutomation}</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {releases.filter((item) => item.status === "published").map((item) => (
              <button key={item.version} type="button" className="rounded border px-3 py-2 text-sm" onClick={() => restore(item.version)}>
                {text.restore} {item.version}
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
