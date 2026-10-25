import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../../../api";
import { enterSystemHref } from "../../../../saas/productAccess";

type TenantCard = {
  id: string;
  templateSlug: string;
  businessName: string;
  publicSlug: string;
  status: string;
  accessPath: string;
  productLoginUrl?: string;
  product?: { loginUrl?: string; passwordSync?: { status?: string; reason?: string } };
  domain?: { host?: string };
  hosting?: { planId?: string };
  quote?: { renewal?: number; currency?: string };
  renewalAt?: string | null;
  services?: { id: string; status: string }[];
};

const STATUS: Record<string, string> = {
  pending: "ממתין",
  provisioning: "בהקמה",
  active: "פעיל",
  failed: "נכשל",
  suspended: "מושהה",
};

export default function MySaasSystems() {
  const { businessId = "" } = useParams();
  const [tenants, setTenants] = useState<TenantCard[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/saas-owner/mine")
      .then((res) => setTenants(res.data.tenants || []))
      .catch(() => setError("לא ניתן לטעון את המערכות"));
  }, []);

  return (
    <div dir="rtl" className="space-y-4 p-4 md:p-6">
      <h1 className="text-2xl font-black">המערכות שלי — My SaaS Systems</h1>
      <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm">
        <h2 className="font-black">התחלה ראשונה</h2>
        <ol className="mt-2 list-decimal space-y-1 pe-5">
          <li>החליפו את הסיסמה הזמנית בכניסה הראשונה.</li>
          <li>פתחו את המערכת ולחצו «עריכת מערכת».</li>
          <li>עדכנו שם עסק, לוגו וצבעים.</li>
          <li>מלאו שירותים, תפריט או נכסים לפי המוצר.</li>
          <li>פרסמו, ואז בדקו את קישור הלקוח לפני שיתוף.</li>
        </ol>
      </section>
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      {!error && tenants.length === 0 ? <p className="text-sm">עדיין אין מערכת משויכת לחשבון.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {tenants.map((tenant) => (
          <article key={tenant.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-black">{tenant.businessName || tenant.templateSlug}</h2>
            <p className="text-sm text-slate-600">{tenant.templateSlug}</p>
            <p className="mt-2 text-sm">דומיין: {tenant.domain?.host || enterSystemHref(tenant) || tenant.accessPath}</p>
            <p className="text-sm">סטטוס: {STATUS[tenant.status] || tenant.status}</p>
            <p className="text-sm">חבילה: {tenant.hosting?.planId || "—"}</p>
            <p className="text-sm">חידוש: {tenant.renewalAt ? new Date(tenant.renewalAt).toLocaleDateString() : "—"}</p>
            {tenant.product?.passwordSync?.status === "too_short" ? (
              <p className="mt-2 text-sm font-bold text-rose-700">יש להחליף את סיסמת Bizuply ל־8 תווים לפחות לפני כניסה למוצר.</p>
            ) : null}
            {tenant.product?.passwordSync?.status === "failed" ? (
              <p className="mt-2 text-sm font-bold text-rose-700">סנכרון הסיסמה למוצר נכשל. התחברו שוב ל־Bizuply כדי לנסות שוב. אין להעביר סיסמה בכתובת.</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <a className="rounded-full bg-[#24124d] px-3 py-2 text-sm font-bold text-white" href={enterSystemHref(tenant)} target="_blank" rel="noreferrer">
                כניסה למערכת
              </a>
              <Link className="rounded-full border px-3 py-2 text-sm font-bold" to={`/business/${businessId}/dashboard/saas/${tenant.id}`}>
                עריכת מערכת
              </Link>
              <Link className="rounded-full border px-3 py-2 text-sm font-bold" to={`/business/${businessId}/dashboard/saas/${tenant.id}/builder`}>
                בונה המערכת
              </Link>
              <Link className="rounded-full border px-3 py-2 text-sm font-bold" to={`/business/${businessId}/dashboard/saas/${tenant.id}?panel=hosting`}>
                ניהול אחסון ודומיין
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
