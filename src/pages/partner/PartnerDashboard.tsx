import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPartnerDashboard, partnerApiError } from "../../lib/partnerApi";
import type { PartnerDashboardPayload, PartnerMe, PartnerSubscriptionSnapshot } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { formatIls } from "../../lib/partnerMoney";
import { PARTNER_STATUS_LABEL, PARTNER_STATUS_TONE } from "../../lib/partnerLabels";

const PRESETS = [
  { id: "today", label: "היום" },
  { id: "week", label: "השבוע" },
  { id: "month", label: "החודש" },
  { id: "last_month", label: "החודש הקודם" },
  { id: "3m", label: "3 חודשים" },
  { id: "6m", label: "6 חודשים" },
  { id: "year", label: "השנה" },
  { id: "custom", label: "טווח מותאם אישית" },
];

function ils(value: number | null | undefined) {
  if (value == null) return "—";
  return formatIls(value);
}

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PartnerDashboardPayload | null>(null);
  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { preset };
        if (preset === "custom") {
          if (from) params.from = from;
          if (to) params.to = to;
        }
        const payload = await fetchPartnerDashboard(params);
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
  }, [preset, from, to]);

  if (loading && !data) return <BizuplyLoader fullScreen label="טוען לוח פרטנר..." />;

  const partner = data?.partner as PartnerMe | undefined;
  const subscription = data?.partnerSubscription || null;
  const clients = data?.clients;
  const metrics = data?.metrics;
  const chart = data?.chart || [];

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
          <DateRangeBar
            preset={preset}
            from={from}
            to={to}
            onPreset={setPreset}
            onFrom={setFrom}
            onTo={setTo}
          />

          <section>
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-violet-700">
              המנוי שלי
            </h2>
            <MyPartnerSubscriptionCard partner={partner} subscription={subscription} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
              הפעילות העסקית שלי
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard label="סך העסקאות" value={ils(metrics?.totalSales)} hint="הלקוח משלם ל-Bizuply" />
              <MetricCard label="העמלה שלי" value={ils(metrics?.partnerCommission)} hint="חלקכם מהעמלה הנוספת" />
              <MetricCard label="עמלה ממתינה" value={ils(metrics?.pendingCommission)} hint="ממתינה לסימון תשלום" />
              <MetricCard label="עמלה ששולמה" value={ils(metrics?.paidCommission)} hint="עמלות שסומנו כשולמו" />
              <MetricCard
                label="לקוחות פעילים"
                value={String(clients?.active ?? 0)}
                hint="לקוחות עם חשבון פעיל"
                href="/partner/dashboard/crm?status=active"
              />
              <MetricCard label="MRR לקוחות" value={ils(metrics?.customerMrr)} hint="סכום חודשי שהלקוחות משלמים" />
            </div>
          </section>

          <SalesCommissionChart points={chart} />

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="משימות פתוחות"
              value={String(metrics?.openTasks ?? 0)}
              hint="משימות מעקב בתיקי הלקוחות"
              href="/partner/dashboard/crm"
            />
            {[
              ["כל הלקוחות", clients?.total ?? 0, "/partner/dashboard/crm", ""],
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
                <h3 className="font-black">עסקאות אחרונות</h3>
                <Link to="/partner/dashboard/transactions" className="text-xs font-black text-violet-700">
                  לכל העסקאות
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
                        {row.description || row.sku || "—"}
                      </p>
                    </div>
                    <p className="shrink-0 font-black">{ils(row.amountIls)}</p>
                  </div>
                ))}
                {!data.recentActivity?.length ? (
                  <p className="text-sm font-bold text-slate-400">אין עדיין עסקאות בטווח</p>
                ) : null}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function DateRangeBar({
  preset,
  from,
  to,
  onPreset,
  onFrom,
  onTo,
}: {
  preset: string;
  from: string;
  to: string;
  onPreset: (value: string) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPreset(item.id)}
            className={[
              "rounded-2xl px-3 py-2 text-sm font-black",
              preset === item.id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-slate-50 text-slate-600",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>
      {preset === "custom" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-black text-slate-500">
            מ
            <input
              type="date"
              value={from}
              onChange={(e) => onFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          </label>
          <label className="text-xs font-black text-slate-500">
            עד
            <input
              type="date"
              value={to}
              onChange={(e) => onTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}

function SalesCommissionChart({
  points,
}: {
  points: Array<{ bucket: string; sales: number; commission: number }>;
}) {
  const width = 640;
  const height = 220;
  const pad = 28;
  const max = Math.max(
    1,
    ...points.map((row) => Math.max(Number(row.sales) || 0, Number(row.commission) || 0))
  );
  const path = (key: "sales" | "commission") => {
    if (!points.length) return "";
    return points
      .map((row, index) => {
        const x =
          pad +
          (points.length === 1 ? (width - pad * 2) / 2 : (index * (width - pad * 2)) / (points.length - 1));
        const y = height - pad - ((Number(row[key]) || 0) / max) * (height - pad * 2);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-black">מכירות ועמלת Partner</h3>
        <div className="flex gap-3 text-[11px] font-black">
          <span className="text-slate-700">● מכירות</span>
          <span className="text-violet-700">● העמלה שלך</span>
        </div>
      </div>
      {points.length ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
          <path d={path("sales")} fill="none" stroke="#0f172a" strokeWidth="3" />
          <path d={path("commission")} fill="none" stroke="#6d28d9" strokeWidth="3" />
        </svg>
      ) : (
        <p className="text-sm font-bold text-slate-400">אין נתונים לגרף בטווח שנבחר</p>
      )}
    </section>
  );
}

function paymentLabel(value?: string | null) {
  if (value === "paid" || value === "waived") return "שולם";
  if (value === "unpaid") return "לא שולם";
  return "—";
}

function statusLabel(value?: string | null) {
  if (value === "active") return "פעיל";
  if (value === "inactive") return "לא פעיל";
  return value || "—";
}

function MyPartnerSubscriptionCard({
  partner,
  subscription,
}: {
  partner?: PartnerMe;
  subscription: PartnerSubscriptionSnapshot | null;
}) {
  const planName = subscription?.planName || partner?.plan?.nameHe || partner?.planKey || "מנוי Partner";
  const monthly = subscription?.monthlyFeeIls ?? partner?.plan?.monthlyIls ?? null;
  const setup = subscription?.setupFeeIls ?? partner?.plan?.setupIls ?? null;
  const renewal = partner?.nextRenewalAt || partner?.currentPeriodEnd;
  return (
    <section className="overflow-hidden rounded-3xl border border-violet-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <p className="text-2xl font-black text-slate-900">{planName}</p>
      <p className="mt-1 text-lg font-black text-slate-800">
        {monthly != null ? `${ils(monthly)} לחודש` : "—"}
      </p>
      <p className="mt-3 text-sm font-bold text-slate-600">
        סטטוס: {statusLabel(subscription?.monthlyStatus)} / {paymentLabel(subscription?.currentMonthPayment)}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-600">
        חידוש הבא: {renewal ? new Date(renewal).toLocaleDateString("he-IL") : "—"}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-600">
        דמי הקמה {setup != null ? ils(setup) : "—"} — {paymentLabel(subscription?.setupPayment)}
      </p>
    </section>
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
  const className = "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm";
  if (href) {
    return (
      <Link to={href} className={`${className} transition hover:-translate-y-0.5 hover:border-violet-200`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

export { DateRangeBar, PRESETS };
