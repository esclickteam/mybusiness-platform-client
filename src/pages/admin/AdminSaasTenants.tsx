import { useEffect, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";

type TenantRow = {
  id: string;
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
};

export default function AdminSaasTenants() {
  const [rows, setRows] = useState<TenantRow[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await API.get("/admin/saas-tenants");
    setRows(data.tenants || []);
  }

  useEffect(() => {
    load().catch(() => setError("לא ניתן לטעון מופעי SaaS"));
  }, []);

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
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-start">
                {["מערכת", "בעלים", "Tenant", "דומיין", "אחסון", "מסד", "שירותים", "חיוב", "חידוש", ""].map((head) => (
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
