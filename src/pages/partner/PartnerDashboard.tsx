import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartnerDashboard, partnerApiError } from "../../lib/partnerApi";
import type { PartnerDashboardPayload, PartnerMe } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { formatIls } from "../../lib/partnerMoney";
import { PARTNER_STATUS_LABEL, PARTNER_STATUS_TONE } from "../../lib/partnerLabels";

function ils(value: number | null | undefined) {
  if (value == null) return "—";
  return formatIls(value);
}

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PartnerDashboardPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const payload = await fetchPartnerDashboard();
        if (!cancelled) {
          setData(payload);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setData(null);
          setError(partnerApiError(err, "שגיאה בטעינת הדשבורד"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <BizuplyLoader fullScreen label="טוען לוח פרטנר..." />;

  const partner = data?.partner as PartnerMe | undefined;
  const due = data?.amountDueToBizuply;
  const breakdown = data?.breakdown || null;
  const clients = data?.clients;
  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {!data ? (
        <p className="text-sm font-bold text-slate-500">
          לא ניתן להציג מדדים עד שהדשבורד נטען בהצלחה. השגיאה למעלה היא התשובה האמיתית מהשרת.
        </p>
      ) : (
        <>
          {partner?.status === "pending_setup" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              החשבון ממתין להפעלת דמי הקמה ב-Staging (אדמין → פרטנרים → הפעל הקמה).
              אין Stripe LIVE ואין תשלום Production ב-Phase 1.
            </div>
          ) : null}

          {partner?.status === "payment_due" ? (
            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
              יש יתרת תשלום ל-Bizuply. ניתן לצפות בחיוב ולשלם, אך לא ליצור לקוחות,
              לשנות תמחור או להפעיל חשבונות עד להסדרת החוב.
            </div>
          ) : null}

          {partner?.status === "suspended" ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
              חשבון הפרטנר מושעה. החנות הציבורית כבויה ופעולות כתיבה חסומות.
            </div>
          ) : null}

          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-l from-white via-white to-[#f4efff] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C4DFF]">
              הסכום לתשלום ל-Bizuply החודש
            </p>
            <p className="mt-2 text-4xl font-black text-slate-900">{ils(due)}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">
              {partner?.name} · {partner?.plan?.nameHe || partner?.planKey} · {partner?.status}
            </p>
            <Link
              to="/partner/dashboard/revenue"
              className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
            >
              לפירוט החיוב
            </Link>
          </section>

          {breakdown ? (
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["מנוי חודשי", breakdown.monthlySubscription],
                ["דמי הקמה", breakdown.unpaidSetupFee],
                ["סיטונאות לקוחות", breakdown.wholesaleSubscriptions],
                ["חלק Bizuply מהעמלה", breakdown.bizuplyMarkupShare],
                ["שימוש", breakdown.usage],
                ["תוספים", breakdown.addOns],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-slate-500">{label}</p>
                  <p className="text-xl font-black">{ils(Number(value))}</p>
                </div>
              ))}
            </section>
          ) : null}

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics?.partnerMonthlyProfit != null ? (
              <MetricCard label="רווח Partner החודש" value={ils(metrics.partnerMonthlyProfit)} hint="חלקכם מהעמלה הנוספת על לקוחות פעילים" />
            ) : null}
            {metrics?.salesThisMonth != null ? (
              <MetricCard label="מכירות החודש" value={ils(metrics.salesThisMonth)} hint="מחיר סופי ללקוח בהפעלות החודש" />
            ) : null}
            {metrics?.customerMrr != null ? (
              <MetricCard label="MRR לקוחות" value={ils(metrics.customerMrr)} hint="סכום חודשי שהלקוחות משלמים לכם" />
            ) : null}
            {metrics?.monthlyWholesale != null ? (
              <MetricCard label="סיטונאות חודשית" value={ils(metrics.monthlyWholesale)} hint="עלות Bizuply על מנויים פעילים" />
            ) : null}
            <MetricCard
              label="משימות פתוחות"
              value={String(metrics?.openTasks ?? 0)}
              hint="משימות מעקב בתיקי הלקוחות"
              href="/partner/dashboard/crm"
            />
          </section>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["כל הלקוחות", clients?.total ?? 0, "/partner/dashboard/crm", ""],
              ["פעילים", clients?.active ?? 0, "/partner/dashboard/crm", "active"],
              ["ממתינים לתשלום", clients?.waitingPayment ?? 0, "/partner/dashboard/crm", "waiting_payment"],
              ["לידים", clients?.leads ?? 0, "/partner/dashboard/crm", "lead"],
              ["בעיית תשלום", clients?.paymentIssue ?? 0, "/partner/dashboard/crm", "payment_issue"],
              ["מושעים", clients?.suspended ?? 0, "/partner/dashboard/crm", "suspended"],
            ].map(([label, value, href, status]) => (
              <Link
                key={String(label)}
                to={status ? `${href}?status=${status}` : String(href)}
                className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="text-2xl font-black">{value}</p>
              </Link>
            ))}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black">לקוחות אחרונים</h3>
                <Link to="/partner/dashboard/crm" className="text-xs font-black text-violet-700">
                  לכל הלקוחות
                </Link>
              </div>
              <div className="space-y-2">
                {(data.recentClients || []).map((row) => (
                  <Link
                    key={row._id}
                    to={`/partner/dashboard/crm/${row._id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 hover:bg-violet-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-900">
                        {row.contact.businessName}
                      </p>
                      <p className="truncate text-xs font-bold text-slate-500">
                        {row.contact.contactName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-black ${
                        PARTNER_STATUS_TONE[row.status] || "bg-slate-100"
                      }`}
                    >
                      {PARTNER_STATUS_LABEL[row.status] || row.status}
                    </span>
                  </Link>
                ))}
                {!data.recentClients?.length ? (
                  <p className="text-sm font-bold text-slate-400">אין עדיין לקוחות</p>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black">פעילות אחרונה</h3>
                <Link to="/partner/dashboard/revenue" className="text-xs font-black text-violet-700">
                  ליומן החיוב
                </Link>
              </div>
              <div className="space-y-2">
                {(data.recentActivity || []).map((row) => (
                  <div
                    key={row._id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800">{row.label}</p>
                      <p className="truncate text-[11px] font-bold text-slate-400">
                        {row.sku || row.description || "—"}
                      </p>
                    </div>
                    <p className="shrink-0 font-black">{ils(row.amountIls)}</p>
                  </div>
                ))}
                {!data.recentActivity?.length ? (
                  <p className="text-sm font-bold text-slate-400">אין עדיין תנועות ביומן</p>
                ) : null}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-[11px] font-bold text-slate-400">{hint}</p>
    </>
  );
  const className =
    "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm";
  if (href) {
    return (
      <Link to={href} className={`${className} transition hover:-translate-y-0.5 hover:border-violet-200`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}
