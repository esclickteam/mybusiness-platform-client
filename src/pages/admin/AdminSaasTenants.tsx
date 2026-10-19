import { useEffect, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";

type TenantRow = {
  id: string;
  ownerUserId?: string;
  businessId?: string | null;
  templateSlug: string;
  businessName: string;
  publicSlug: string;
  status: string;
  domain?: { host?: string };
  hosting?: { planId?: string; quotaMb?: number; usedMb?: number };
  database?: { status?: string };
  services?: { id: string; status: string }[];
  quote?: { dueNow?: number; renewal?: number; currency?: string };
  paymentStatus?: string;
  charged?: boolean;
  renewalAt?: string | null;
  commercial?: {
    enforceExpiry?: boolean;
    accessUntil?: string | null;
    history?: { at?: string; changes?: string[]; note?: string; charged?: boolean; after?: { planId?: string; paymentStatus?: string; dueNow?: number | null } }[];
  };
  owner?: { name?: string; email?: string } | null;
  steps?: { step: string; ok?: boolean }[];
  failure?: string;
  product?: {
    tenantId?: string;
    authorized?: boolean;
    linkStatus?: string;
    sharedRevision?: number;
    syncedAt?: string | null;
    error?: string;
    syncError?: string;
  };
  shared?: { brandName?: string; primaryColor?: string; phone?: string };
};

type CatalogTemplate = {
  slug: string;
  name: string;
  services?: { id: string; label: string }[];
  hostingPlans?: { id: string; label: string; quotaMb: number }[];
};

type OpsState = {
  logs?: { at?: string; action?: string; message?: string; systemKey?: string }[];
  failing?: { id: string; slug?: string; error?: string }[];
  alerts?: { key: string; severity?: string; title?: string; detail?: string }[];
  watch?: { availability?: { id: string; ok?: boolean; detail?: string }[]; dependencies?: { mongo?: boolean; redis?: boolean } | null };
};

export default function AdminSaasTenants() {
  const [rows, setRows] = useState<TenantRow[]>([]);
  const [templates, setTemplates] = useState<CatalogTemplate[]>([]);
  const [extraFor, setExtraFor] = useState<string | null>(null);
  const [templateSlug, setTemplateSlug] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [setup, setSetup] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [ops, setOps] = useState<OpsState | null>(null);
  const [licenseFor, setLicenseFor] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [planId, setPlanId] = useState("starter");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [priceSetup, setPriceSetup] = useState(0);
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [accessUntil, setAccessUntil] = useState("");
  const [licenseNote, setLicenseNote] = useState("");

  async function load() {
    const { data } = await API.get("/admin/saas-tenants");
    setRows(data.tenants || []);
  }

  useEffect(() => {
    load().catch(() => setError("לא ניתן לטעון מופעי SaaS"));
    API.get("/admin/saas-tenants/ops").then((res) => setOps(res.data)).catch(() => setOps(null));
    API.get("/admin/saas-tenants/catalog")
      .then((res) => {
        const list = res.data.templates || [];
        setTemplates(list);
        if (list[0]) setTemplateSlug(list[0].slug);
      })
      .catch(() => setTemplates([]));
  }, []);

  async function provisionAnother(row: TenantRow) {
    setError("");
    setNotice("");
    if (!row.owner?.email || !row.ownerUserId) {
      setError("חסרים פרטי הבעלים");
      return;
    }
    try {
      await API.post("/admin/saas-tenants/provision", {
        accountKind: "bizuply_saas",
        ownerUserId: row.ownerUserId,
        businessId: row.businessId,
        name: row.owner.name || row.businessName,
        email: row.owner.email,
        businessName: row.businessName,
        templateSlug,
        subdomain,
        hostingPlanId: "starter",
        currency: "ILS",
        paymentMode: "none",
        pricing: { setup, monthly },
        idempotencyKey: `${row.owner.email}|${templateSlug}|${subdomain}`,
      });
      setNotice("המערכת הנוספת הוקמה. לא בוצע חיוב.");
      setExtraFor(null);
      await load();
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "";
      setError(message || "ההקמה נכשלה");
    }
  }

  async function act(id: string, action: "suspend" | "resume") {
    await API.post(`/admin/saas-tenants/${id}/${action}`);
    setNotice(action === "suspend" ? "הגישה הושעתה. הנתונים נשמרו." : "הגישה הוחזרה. הנתונים נשמרו.");
    await load();
  }

  function openLicense(row: TenantRow) {
    setLicenseFor(row.id);
    setPaymentStatus(row.paymentStatus === "paid" ? "paid" : "unpaid");
    setPlanId(row.hosting?.planId || "starter");
    setServiceIds((row.services || []).map((service) => service.id).filter((id) => id !== "domain_purchase"));
    setPriceSetup(Number(row.quote?.dueNow || 0));
    setPriceMonthly(Number(row.quote?.renewal || 0));
    const until = row.commercial?.accessUntil || row.renewalAt;
    setAccessUntil(until ? String(until).slice(0, 10) : "");
    setLicenseNote("");
  }

  async function saveLicense(row: TenantRow) {
    setError("");
    setNotice("");
    try {
      await API.post(`/admin/saas-tenants/${row.id}/commercial`, {
        paymentStatus,
        hostingPlanId: planId,
        serviceIds: serviceIds.filter((id) => id !== "domain_purchase"),
        pricing: { setup: priceSetup, monthly: priceMonthly, renewalAt: accessUntil || undefined },
        currency: row.quote?.currency === "ILS" ? "ILS" : "USD",
        accessUntil: accessUntil || null,
        note: licenseNote,
      });
      setNotice("הרישיון עודכן. לא בוצע חיוב.");
      setLicenseFor(null);
      await load();
    } catch (err) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : "";
      setError(message || "עדכון הרישיון נכשל");
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f6fb]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-black">ניהול מערכות SaaS</h1>
        {error ? <p className="text-rose-700">{error}</p> : null}
        {notice ? <p className="text-emerald-800">{notice}</p> : null}
        {ops?.alerts?.length ? (
          <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-black">התראות לאדמין</h2>
            <ul className="space-y-1 text-sm">
              {ops.alerts.map((alert) => (
                <li key={alert.key}>{alert.severity === "critical" ? "קריטי" : "אזהרה"} · {alert.title}{alert.detail ? ` · ${alert.detail}` : ""}</li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="mb-4 text-sm text-emerald-800">אין התראת תפעול פתוחה. ההתראות נשארות אצל האדמין.</p>
        )}
        {ops?.watch?.availability?.length ? (
          <p className="mb-4 text-sm">
            זמינות: {ops.watch.availability.map((item) => `${item.id} ${item.ok ? "תקין" : item.detail || "כשל"}`).join(" · ")}
            {ops.watch.dependencies ? ` · Mongo ${ops.watch.dependencies.mongo ? "תקין" : "כשל"} · Redis ${ops.watch.dependencies.redis ? "תקין" : "כשל"}` : ""}
          </p>
        ) : null}
        {ops?.failing?.length ? (
          <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-black">כשלי סנכרון</h2>
            <ul className="space-y-1 text-sm">
              {ops.failing.map((item) => (
                <li key={item.id}>{item.slug} · {item.error || "שגיאה"} <button type="button" className="font-bold" onClick={() => API.post(`/admin/saas-tenants/${item.id}/bridge-retry`).then(load)}>ניסיון חוזר</button></li>
              ))}
            </ul>
          </section>
        ) : null}
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-start">
                {["מערכת", "בעלים", "Tenant", "סנכרון", "דומיין", "אחסון", "מסד", "שירותים", "חיוב", "חידוש", ""].map((head) => (
                  <th key={head} className="px-3 py-2 text-start">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b align-top">
                  <td className="px-3 py-2">{row.templateSlug}<br />{row.businessName}<br />{row.status}<br />{(row.steps || []).map((step) => step.step).join(" · ")}</td>
                  <td className="px-3 py-2">{row.owner?.name}<br />{row.owner?.email}</td>
                  <td className="px-3 py-2">{row.id}<br />{row.publicSlug}{row.failure ? <><br />{row.failure}</> : null}</td>
                  <td className="px-3 py-2">
                    {row.product?.linkStatus || "—"}
                    {row.product?.authorized ? " · מקושר" : ""}
                    <br />
                    {row.product?.syncedAt ? new Date(row.product.syncedAt).toLocaleString() : "אין סנכרון"}
                    <br />
                    {row.product?.error || row.product?.syncError || "ללא שגיאה"}
                    {row.shared?.brandName ? <><br />{row.shared.brandName}</> : null}
                    {row.shared?.primaryColor ? <><br />{row.shared.primaryColor}</> : null}
                    {row.product?.sharedRevision ? <><br />rev {row.product.sharedRevision}</> : null}
                  </td>
                  <td className="px-3 py-2">{row.domain?.host}</td>
                  <td className="px-3 py-2">{row.hosting?.planId} · {row.hosting?.usedMb}/{row.hosting?.quotaMb}MB</td>
                  <td className="px-3 py-2">{row.database?.status}</td>
                  <td className="px-3 py-2">{(row.services || []).map((service) => `${service.id}:${service.status}`).join(", ")}</td>
                  <td className="px-3 py-2">{row.paymentStatus === "paid" ? "שולם" : "טרם שולם"}{row.charged ? "" : " · ללא חיוב"}<br />{row.quote?.dueNow} {row.quote?.currency}<br />חידוש {row.quote?.renewal}</td>
                  <td className="px-3 py-2">{row.renewalAt ? new Date(row.renewalAt).toLocaleDateString() : "—"}</td>
                  <td className="px-3 py-2">
                    {row.status === "active" ? (
                      <button type="button" className="font-bold" onClick={() => act(row.id, "suspend")}>השהיה</button>
                    ) : row.status === "suspended" ? (
                      <button type="button" className="font-bold" onClick={() => act(row.id, "resume")}>הפעלה מחדש</button>
                    ) : null}
                    <button type="button" className="mt-1 block font-bold" onClick={() => API.post(`/admin/saas-tenants/${row.id}/backup`, { summary: "admin logical backup" }).then(() => setNotice("גיבוי לוגי נשמר. לא נמחק דבר."))}>גיבוי לוגי</button>
                    <button type="button" className="mt-1 block font-bold" onClick={() => API.post(`/admin/saas-tenants/${row.id}/isolation`, { isolationMode: "dedicated_schema" }).then(() => { setNotice("בקשת בידוד נשמרה. המסד הקיים לא פוצל."); load(); })}>בקשת Schema נפרד</button>
                    <button type="button" className="mt-1 block font-bold" onClick={() => openLicense(row)}>רישיון ידני</button>
                    {licenseFor === row.id ? (
                      <div className="mt-2 w-56 space-y-1">
                        <select className="w-full rounded border px-2 py-1" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
                          <option value="unpaid">טרם שולם</option>
                          <option value="paid">שולם ידנית</option>
                        </select>
                        <select className="w-full rounded border px-2 py-1" value={planId} onChange={(event) => setPlanId(event.target.value)}>
                          {(templates.find((template) => template.slug === row.templateSlug)?.hostingPlans || [
                            { id: "starter", label: "Starter", quotaMb: 512 },
                            { id: "growth", label: "Growth", quotaMb: 2048 },
                            { id: "scale", label: "Scale", quotaMb: 10240 },
                          ]).map((plan) => <option key={plan.id} value={plan.id}>{plan.label}</option>)}
                        </select>
                        {(templates.find((template) => template.slug === row.templateSlug)?.services || [])
                          .filter((service) => service.id !== "domain_purchase")
                          .map((service) => (
                            <label key={service.id} className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={serviceIds.includes(service.id)}
                                onChange={() => {
                                  setServiceIds((current) => current.includes(service.id)
                                    ? current.filter((id) => id !== service.id)
                                    : current.concat(service.id));
                                }}
                              />
                              {service.label}
                            </label>
                          ))}
                        <input type="number" min={0} className="w-full rounded border px-2 py-1" value={priceSetup} placeholder="מחיר הקמה" onChange={(event) => setPriceSetup(Number(event.target.value) || 0)} />
                        <input type="number" min={0} className="w-full rounded border px-2 py-1" value={priceMonthly} placeholder="מחיר חודשי" onChange={(event) => setPriceMonthly(Number(event.target.value) || 0)} />
                        <input type="date" className="w-full rounded border px-2 py-1" value={accessUntil} aria-label="תאריך תפוגה" onChange={(event) => setAccessUntil(event.target.value)} />
                        <input className="w-full rounded border px-2 py-1" value={licenseNote} placeholder="הערה" onChange={(event) => setLicenseNote(event.target.value)} />
                        <button type="button" className="font-bold" onClick={() => saveLicense(row)}>שמירה ללא חיוב</button>
                        {(row.commercial?.history || []).slice(-5).reverse().map((entry) => (
                          <p key={entry.at} className="text-xs">{entry.at ? new Date(entry.at).toLocaleString() : ""} · {(entry.changes || []).join(", ")} · {entry.after?.paymentStatus || ""} {entry.after?.planId || ""}</p>
                        ))}
                      </div>
                    ) : null}
                    <button type="button" className="mt-1 block font-bold" onClick={() => setExtraFor(row.id)}>מערכת נוספת</button>
                    {extraFor === row.id ? (
                      <div className="mt-2 space-y-1">
                        <select className="w-full rounded border px-2 py-1" value={templateSlug} onChange={(event) => setTemplateSlug(event.target.value)}>
                          {templates.map((template) => <option key={template.slug} value={template.slug}>{template.name}</option>)}
                        </select>
                        <input className="w-full rounded border px-2 py-1" value={subdomain} placeholder="כתובת" onChange={(event) => setSubdomain(event.target.value)} />
                        <input type="number" min={0} className="w-full rounded border px-2 py-1" value={setup} onChange={(event) => setSetup(Number(event.target.value) || 0)} />
                        <input type="number" min={0} className="w-full rounded border px-2 py-1" value={monthly} onChange={(event) => setMonthly(Number(event.target.value) || 0)} />
                        <button type="button" className="font-bold" onClick={() => provisionAnother(row)}>הקמה ללא חיוב</button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
