import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import API from "../../../../api";
import BusinessContentEditor from "../../../../saas/BusinessContentEditor";
import TableflowGuest from "../../../../saas/TableflowGuest";

type Content = {
  branding: Record<string, string>;
  site: Record<string, unknown>;
  business: Record<string, unknown>;
};

type StaffMember = { email: string; name?: string; active?: boolean; permissions?: string[] };
type VersionRow = { at?: string; summary?: string };

const BRAND_FIELDS = ["businessName", "logo", "favicon", "primaryColor", "secondaryColor", "font", "heroImage", "background", "banner", "tagline", "icon", "mobileDensity", "desktopDensity"];
const SITE_FIELDS = ["homeTitle", "homeBody", "footer", "seoTitle", "seoDescription"];
const STAFF_PERMISSIONS = [
  ["content.edit", "עריכת תוכן"],
  ["content.publish", "פרסום"],
  ["staff.manage", "ניהול עובדים"],
] as const;
const PRODUCT_HOSTS: Record<string, string> = {
  beautyflow: "beautyflow-production-9f07.up.railway.app",
  "global-properties": "web-production-923d7.up.railway.app",
  tableflow: "tableflow.bizuply.com",
  dinevo: "dinevo.bizuply.com",
  cliny: "cliny.bizuply.com",
};

function apiError(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data;
    if (data?.error) return data.error;
  }
  return fallback;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
}

function asList(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export default function SaasOwnerConsole() {
  const { businessId = "", tenantId = "" } = useParams();
  const [params] = useSearchParams();
  const [content, setContent] = useState<Content | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [width, setWidth] = useState<"100%" | "768px" | "375px">("100%");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPermissions, setStaffPermissions] = useState<string[]>(["content.edit"]);

  useEffect(() => {
    API.get(`/saas-owner/${tenantId}`)
      .then((res) => {
        setContent(res.data.draft);
        setMeta(res.data);
      })
      .catch(() => setError("לא ניתן לפתוח את אזור העריכה"));
  }, [tenantId]);

  useEffect(() => {
    if (params.get("panel") === "hosting") {
      document.getElementById("hosting")?.scrollIntoView({ block: "start" });
    }
  }, [params, meta]);

  const preview = useMemo(() => content, [content]);
  const templateSlug = String((meta?.tenant as { templateSlug?: string } | undefined)?.templateSlug || "");

  function setBrand(key: string, value: string) {
    setContent((prev) => (prev ? { ...prev, branding: { ...prev.branding, [key]: value } } : prev));
  }

  function setSite(key: string, value: unknown) {
    setContent((prev) => (prev ? { ...prev, site: { ...prev.site, [key]: value } } : prev));
  }

  function setBusiness(key: string, value: unknown) {
    setContent((prev) => (prev ? { ...prev, business: { ...prev.business, [key]: value } } : prev));
  }

  async function saveDraft() {
    setError("");
    try {
      await API.put(`/saas-owner/${tenantId}/draft`, { content });
      setMessage("הטיוטה נשמרה");
    } catch (err) {
      setError(apiError(err, "השמירה נכשלה"));
    }
  }

  async function publish() {
    setError("");
    try {
      await API.put(`/saas-owner/${tenantId}/draft`, { content });
      const { data } = await API.post(`/saas-owner/${tenantId}/publish`, { summary: "publish" });
      setMeta((prev) => (prev ? { ...prev, versions: data.versions || [] } : prev));
      setMessage("השינויים פורסמו");
    } catch (err) {
      setError(apiError(err, "הפרסום נכשל"));
    }
  }

  async function discard() {
    const { data } = await API.post(`/saas-owner/${tenantId}/discard`);
    setContent(data.draft);
    setMessage("הטיוטה בוטלה");
  }

  async function requestUpgrade() {
    await API.post(`/saas-owner/${tenantId}/upgrade-request`, { note: "upgrade" });
    setMessage("בקשת השדרוג נשמרה. לא בוצע חיוב.");
  }

  async function uploadImage(field: string, file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await API.post(`/saas-owner/${tenantId}/media`, body);
      setBrand(field, data.url);
      setMessage("התמונה הועלתה לטיוטה. יש לפרסם כדי שתופיע באתר.");
    } catch (err) {
      setError(apiError(err, "העלאת התמונה נכשלה"));
    }
  }

  async function addStaff() {
    setError("");
    try {
      const { data } = await API.post(`/saas-owner/${tenantId}/staff`, {
        name: staffName,
        email: staffEmail,
        role: "worker",
        permissions: staffPermissions,
      });
      setMeta((prev) => (prev ? { ...prev, staff: data.staff } : prev));
      setStaffName("");
      setStaffEmail("");
      setMessage("העובד נוסף");
    } catch (err) {
      setError(apiError(err, "לא ניתן להוסיף עובד"));
    }
  }

  async function disableStaff(email: string) {
    const { data } = await API.post(`/saas-owner/${tenantId}/staff/${encodeURIComponent(email)}/disable`);
    setMeta((prev) => (prev ? { ...prev, staff: data.staff } : prev));
  }

  if (!content) return <p className="p-6">{error || "טוען את אזור העריכה…"}</p>;
  const tenant = (meta?.tenant || {}) as {
    hosting?: { planId?: string; quotaMb?: number; usedMb?: number };
    domain?: { host?: string; status?: string; ssl?: string; mode?: string };
    product?: { loginUrl?: string; tenantId?: string };
    templateSlug?: string;
    database?: { status?: string; backup?: string; retentionDays?: number };
    services?: { id: string; status: string; label?: string }[];
    quote?: { dueNow?: number; renewal?: number; currency?: string };
    accessPath?: string;
    steps?: { step: string; ok?: boolean }[];
  };
  const contact = asRecord(content.site.contact);
  const social = asRecord(content.site.social);
  const sections = asList(content.site.sections) as { id?: string; title?: string; body?: string; hidden?: boolean }[];
  const nav = asList(content.site.nav) as { label?: string; href?: string; hidden?: boolean }[];
  const staff = (meta?.staff || []) as StaffMember[];
  const versions = (meta?.versions || []) as VersionRow[];

  return (
    <div dir="rtl" className="flex w-full min-w-0 flex-col gap-4 p-4">
      <section className="min-w-0 w-full">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setWidth("100%")}>Desktop</button>
          <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setWidth("768px")}>Tablet</button>
          <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setWidth("375px")}>Mobile</button>
        </div>
        <div className="mx-auto w-full overflow-x-auto rounded-2xl border bg-white" style={{ width, maxWidth: "100%" }}>
          {templateSlug === "tableflow" || templateSlug === "dinevo" ? (
            <TableflowGuest content={preview as never} />
          ) : (
            <div className="p-6" style={{ background: content.branding.background || "#fff", color: content.branding.primaryColor }}>
              {content.branding.logo ? <img src={content.branding.logo} alt="" style={{ height: 48 }} /> : null}
              <h2 className="text-2xl font-black">{content.branding.businessName}</h2>
              <p>{String(content.site.homeBody || content.branding.tagline || "")}</p>
              {sections.filter((section) => !section.hidden).map((section) => (
                <article key={section.id || section.title}>
                  <h3 className="font-black">{section.title}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <aside className="w-full min-w-0 space-y-4 rounded-2xl border bg-white p-4">
        <h1 className="text-lg font-black">עריכת המערכת</h1>
        <Link className="inline-block text-sm font-bold underline" to={`/business/${businessId}/dashboard/saas/${tenantId}/builder`}>בונה נתונים, מסכים ותהליכים</Link>
        {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
        {message ? <p className="text-sm font-bold text-emerald-700">{message}</p> : null}
        <section>
          <h2 className="font-black">מיתוג</h2>
          {BRAND_FIELDS.map((field) => (
            <label key={field} className="mt-2 block text-xs font-bold">
              {field}
              <input className="mt-1 w-full rounded-lg border px-2 py-1" value={content.branding[field] || ""} onChange={(event) => setBrand(field, event.target.value)} />
            </label>
          ))}
          {(["logo", "favicon", "heroImage"] as const).map((field) => (
            <label key={`${field}-file`} className="mt-2 block text-xs font-bold">
              העלאת {field}
              <input className="mt-1 block w-full text-xs" type="file" accept="image/*" onChange={(event) => uploadImage(field, event.target.files?.[0])} />
            </label>
          ))}
        </section>
        <section>
          <h2 className="font-black">אתר</h2>
          {SITE_FIELDS.map((field) => (
            <label key={field} className="mt-2 block text-xs font-bold">
              {field}
              <input className="mt-1 w-full rounded-lg border px-2 py-1" value={String(content.site[field] || "")} onChange={(event) => setSite(field, event.target.value)} />
            </label>
          ))}
          <h3 className="mt-3 text-xs font-black">יצירת קשר</h3>
          {(["phone", "email", "address"] as const).map((field) => (
            <input key={field} className="mt-1 w-full rounded-lg border px-2 py-1 text-xs" placeholder={field} value={contact[field] || ""} onChange={(event) => setSite("contact", { ...contact, [field]: event.target.value })} />
          ))}
          <h3 className="mt-3 text-xs font-black">רשתות</h3>
          {(["instagram", "facebook", "website"] as const).map((field) => (
            <input key={field} className="mt-1 w-full rounded-lg border px-2 py-1 text-xs" placeholder={field} value={social[field] || ""} onChange={(event) => setSite("social", { ...social, [field]: event.target.value })} />
          ))}
          <h3 className="mt-3 text-xs font-black">מקטעים</h3>
          {sections.map((section, index) => (
            <div key={section.id || index} className="mt-2 rounded-lg border p-2">
              <input className="w-full rounded border px-2 py-1 text-xs" value={section.title || ""} placeholder="כותרת" onChange={(event) => {
                const next = sections.slice();
                next[index] = { ...section, title: event.target.value };
                setSite("sections", next);
              }} />
              <textarea className="mt-1 w-full rounded border px-2 py-1 text-xs" rows={2} value={section.body || ""} placeholder="פסקה" onChange={(event) => {
                const next = sections.slice();
                next[index] = { ...section, body: event.target.value };
                setSite("sections", next);
              }} />
              <label className="mt-1 flex items-center gap-2 text-xs">
                <input type="checkbox" checked={Boolean(section.hidden)} onChange={(event) => {
                  const next = sections.slice();
                  next[index] = { ...section, hidden: event.target.checked };
                  setSite("sections", next);
                }} />
                מוסתר
              </label>
              <button type="button" className="text-xs font-bold" onClick={() => {
                if (index === 0) return;
                const next = sections.slice();
                const [item] = next.splice(index, 1);
                next.splice(index - 1, 0, item);
                setSite("sections", next);
              }}>למעלה</button>
            </div>
          ))}
          <button type="button" className="mt-2 text-xs font-black" onClick={() => setSite("sections", [...sections, { id: `s-${Date.now()}`, title: "", body: "", hidden: false }])}>הוספת מקטע</button>
          <h3 className="mt-3 text-xs font-black">תפריט ניווט</h3>
          {nav.map((item, index) => (
            <div key={`${item.label}-${index}`} className="mt-2 grid grid-cols-2 gap-1">
              <input className="rounded border px-2 py-1 text-xs" placeholder="תווית" value={item.label || ""} onChange={(event) => {
                const next = nav.slice();
                next[index] = { ...item, label: event.target.value };
                setSite("nav", next);
              }} />
              <input className="rounded border px-2 py-1 text-xs" placeholder="קישור" value={item.href || ""} onChange={(event) => {
                const next = nav.slice();
                next[index] = { ...item, href: event.target.value };
                setSite("nav", next);
              }} />
            </div>
          ))}
          <button type="button" className="mt-2 text-xs font-black" onClick={() => setSite("nav", [...nav, { label: "", href: "" }])}>הוספת קישור</button>
        </section>
        <section>
          <h2 className="font-black">תוכן עסקי</h2>
          <BusinessContentEditor business={content.business || {}} onChange={setBusiness} />
        </section>
        <section>
          <h2 className="font-black">עובדים</h2>
          <p className="text-xs">אפשר להעניק רק הרשאות עסקיות. אין הרשאת מנהל מערכת.</p>
          <input className="mt-1 w-full rounded-lg border px-2 py-1 text-xs" placeholder="שם" value={staffName} onChange={(event) => setStaffName(event.target.value)} />
          <input className="mt-1 w-full rounded-lg border px-2 py-1 text-xs" placeholder="אימייל" value={staffEmail} onChange={(event) => setStaffEmail(event.target.value)} />
          {STAFF_PERMISSIONS.map(([id, label]) => (
            <label key={id} className="mt-1 flex items-center gap-2 text-xs font-bold">
              <input type="checkbox" checked={staffPermissions.includes(id)} onChange={() => {
                setStaffPermissions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
              }} />
              {label}
            </label>
          ))}
          <button type="button" className="mt-2 text-xs font-black" onClick={addStaff}>הוספת עובד</button>
          <ul className="mt-2 text-xs">
            {staff.map((member) => (
              <li key={member.email} className="flex items-center justify-between gap-2">
                <span>{member.name} · {member.email} · {member.active === false ? "מושבת" : "פעיל"}</span>
                {member.active !== false ? (
                  <button type="button" className="font-bold" onClick={() => disableStaff(member.email)}>השבתה</button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
        <section id="hosting">
          <h2 className="font-black">אחסון, מסד ודומיין</h2>
          <p className="text-xs">חבילה {tenant.hosting?.planId} · {tenant.hosting?.usedMb}/{tenant.hosting?.quotaMb} MB</p>
          <p className="text-xs">מסד: {tenant.database?.status}. גיבוי פר־לקוח: {tenant.database?.backup}. שמירה: {tenant.database?.retentionDays || 30} יום</p>
          <p className="text-xs">כתובת ברירת מחדל: {tenant.domain?.host || tenant.accessPath} · סטטוס {tenant.domain?.status || "platform_path"} · SSL {tenant.domain?.ssl || "platform_only"}</p>
          <p className="text-xs">כניסה למערכת: {tenant.product?.loginUrl || tenant.accessPath}</p>
          {tenant.domain?.status === "pending_connection" ? (
            <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs">
              <p className="font-black">הדומיין עדיין לא פעיל. יש לאמת בעלות אצל רשם הדומיין לפני שהוא יסומן כמחובר.</p>
              <p className="mt-1">רשומת DNS נדרשת:</p>
              <p className="mt-1 font-mono" dir="ltr">CNAME {tenant.domain.host} → {PRODUCT_HOSTS[tenant.templateSlug || templateSlug] || "הכתובת הציבורית של המערכת"}</p>
              <p className="mt-1">אחרי שהרשומה מתפרסמת, סטטוס SSL נשאר ממתין לאישור ולא משתנה לפעיל לפני אימות.</p>
            </div>
          ) : null}
          <button type="button" className="mt-2 text-sm font-bold underline" onClick={requestUpgrade}>בקשת שדרוג</button>
          <ul className="mt-2 text-xs">
            {(tenant.services || []).map((service) => (
              <li key={service.id}>{service.label || service.id}: {service.status}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            לתשלום עכשיו {tenant.quote?.dueNow} {tenant.quote?.currency}. חידוש {tenant.quote?.renewal}. לא בוצע חיוב אוטומטי.
          </p>
        </section>
        <section>
          <h2 className="font-black">גרסאות</h2>
          <ul className="text-xs">
            {versions.map((version) => (
              <li key={version.at}>{version.at} · {version.summary}</li>
            ))}
          </ul>
        </section>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border px-3 py-2 text-sm font-bold" onClick={saveDraft}>שמירת טיוטה</button>
          <button type="button" className="rounded-full bg-[#24124d] px-3 py-2 text-sm font-bold text-white" onClick={publish}>פרסום</button>
          <button type="button" className="rounded-full border px-3 py-2 text-sm font-bold" onClick={discard}>ביטול טיוטה</button>
        </div>
      </aside>
    </div>
  );
}
