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
  renewalAt?: string | null;
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
};

type CatalogTemplate = { slug: string; name: string };

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

  async function load() {
    const { data } = await API.get("/admin/saas-tenants");
    setRows(data.tenants || []);
  }

  useEffect(() => {
    load().catch(() => setError("לא ניתן לטעון מופעי SaaS"));
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
    await load();
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f6fb]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-black">ניהול מערכות SaaS</h1>
        {error ? <p className="text-rose-700">{error}</p> : null}
        {notice ? <p className="text-emerald-800">{notice}</p> : null}
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
                    {row.product?.sharedRevision ? <><br />rev {row.product.sharedRevision}</> : null}
                  </td>
                  <td className="px-3 py-2">{row.domain?.host}</td>
                  <td className="px-3 py-2">{row.hosting?.planId} · {row.hosting?.usedMb}/{row.hosting?.quotaMb}MB</td>
                  <td className="px-3 py-2">{row.database?.status}</td>
                  <td className="px-3 py-2">{(row.services || []).map((service) => `${service.id}:${service.status}`).join(", ")}</td>
                  <td className="px-3 py-2">{row.quote?.dueNow} {row.quote?.currency}<br />חידוש {row.quote?.renewal}</td>
                  <td className="px-3 py-2">{row.renewalAt ? new Date(row.renewalAt).toLocaleDateString() : "—"}</td>
                  <td className="px-3 py-2">
                    {row.status === "active" ? (
                      <button type="button" className="font-bold" onClick={() => act(row.id, "suspend")}>השהיה</button>
                    ) : row.status === "suspended" ? (
                      <button type="button" className="font-bold" onClick={() => act(row.id, "resume")}>הפעלה מחדש</button>
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
