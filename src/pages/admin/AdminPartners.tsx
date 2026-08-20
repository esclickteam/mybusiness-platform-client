import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminsHeader";
import API from "../../api";
import {
  adminActivateSetup,
  adminChangePartnerPlan,
  adminMarkCommissionPaid,
  adminPostMonthly,
  adminRecordPayment,
  adminReverseCommission,
  adminSuspendPartner,
  fetchAdminPartners,
  fetchAdminPartnerTransactions,
  fetchAdminWithdrawalMonth,
} from "../../lib/partnerApi";
import type { AdminPartnerRow, PartnerPlanKey } from "../../types/partner";

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function AdminPartners() {
  const [items, setItems] = useState<AdminPartnerRow[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [financePartnerId, setFinancePartnerId] = useState("");
  const [financeRows, setFinanceRows] = useState<any[]>([]);
  const [monthSummary, setMonthSummary] = useState<any>(null);

  function describeLoadError(err: any) {
    const status = err?.response?.status;
    const body = err?.response?.data || {};
    const detail =
      body.error || body.message || err?.message || "שגיאה בטעינה";
    const path = body.path ? ` path=${body.path}` : "";
    return `HTTP ${status || "network"} — ${detail}${path}`;
  }

  async function refresh(search = q) {
    setError("");
    setLoading(true);
    try {
      const [data, month] = await Promise.all([
        fetchAdminPartners(search),
        fetchAdminWithdrawalMonth().catch(() => null),
      ]);
      setItems(data.items || []);
      if (month) setMonthSummary(month);
    } catch (err: any) {
      setItems([]);
      setError(describeLoadError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] px-4 py-6">
        <h1 className="mb-4 text-2xl font-black">פרטנרים</h1>
        {monthSummary ? (
          <section className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MiniKpi label="בקשות משיכה החודש" value={String(monthSummary.count || 0)} />
            <MiniKpi label="סכום כולל" value={ils(monthSummary.total)} />
            <MiniKpi label="ממתינות" value={String((monthSummary.submitted || 0) + (monthSummary.under_review || 0))} />
            <MiniKpi label="מאושרות" value={String(monthSummary.approved || 0)} />
            <MiniKpi label="נדחו" value={String(monthSummary.rejected || 0)} />
            <MiniKpi label="שולמו" value={String(monthSummary.paid || 0)} />
          </section>
        ) : null}
        {error ? <p className="mb-3 font-bold text-rose-600">{error}</p> : null}
        {loading ? <p className="mb-3 text-sm font-bold text-slate-500">טוען פרטנרים...</p> : null}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") refresh();
          }}
          placeholder="חיפוש"
          className="mb-4 w-full max-w-sm rounded-xl border border-slate-200 px-3 py-2"
        />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs font-black text-slate-500">
              <tr>
                <th className="px-3 py-3">פרטנר</th>
                <th className="px-3 py-3">מסלול</th>
                <th className="px-3 py-3">סטטוס</th>
                <th className="px-3 py-3">מכירות לקוחות</th>
                <th className="px-3 py-3">עמלה שנצברה</th>
                <th className="px-3 py-3">עמלה ממתינה</th>
                <th className="px-3 py-3">עמלה ששולמה</th>
                <th className="px-3 py-3">החזרים</th>
                <th className="px-3 py-3">לקוחות פעילים</th>
                <th className="px-3 py-3">MRR</th>
                <th className="px-3 py-3">מנוי Partner</th>
                <th className="px-3 py-3">תשלום אחרון</th>
                <th className="px-3 py-3">חידוש</th>
                <th className="px-3 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.partnerId} className="border-t border-slate-100">
                  <td className="px-3 py-3 font-black">
                    <a href={`/admin/partners/${row.partnerId}`} className="text-violet-700 hover:underline">
                      {row.name}
                    </a>
                    {row.snapshotError ? (
                      <p className="mt-1 text-xs font-bold text-rose-600">
                        snapshot: {row.snapshotError}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{row.planName || row.planKey}</td>
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">{ils(row.totalCustomerSales)}</td>
                  <td className="px-3 py-3">{ils(row.commissionAccrued)}</td>
                  <td className="px-3 py-3">{ils(row.commissionPending)}</td>
                  <td className="px-3 py-3">{ils(row.commissionPaid)}</td>
                  <td className="px-3 py-3">{ils(row.commissionReversed)}</td>
                  <td className="px-3 py-3">{row.activeDownstreamBusinesses}</td>
                  <td className="px-3 py-3">{ils(row.customerMrr)}</td>
                  <td className="px-3 py-3">{ils(row.partnerSubscription?.monthlyFeeIls)}</td>
                  <td className="px-3 py-3">
                    {row.lastPayment?.at
                      ? new Date(row.lastPayment.at).toLocaleDateString("he-IL")
                      : "—"}
                  </td>
                  <td className="px-3 py-3">
                    {row.nextPartnerSubscriptionRenewal
                      ? new Date(row.nextPartnerSubscriptionRenewal).toLocaleDateString("he-IL")
                      : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          await adminActivateSetup(row.partnerId);
                          await refresh();
                        }}
                        className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-bold text-white"
                      >
                        הפעל הקמה
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminPostMonthly(row.partnerId);
                          await refresh();
                        }}
                        className="rounded-lg border px-2 py-1 text-xs font-bold"
                      >
                        חיוב חודשי
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const amount = Number(window.prompt("סכום תשלום", "499"));
                          if (!amount) return;
                          await adminRecordPayment(row.partnerId, amount);
                          await refresh();
                        }}
                        className="rounded-lg border px-2 py-1 text-xs font-bold"
                      >
                        רשום תשלום
                      </button>
                      <select
                        defaultValue=""
                        onChange={async (event) => {
                          const planKey = event.target.value as PartnerPlanKey;
                          if (!planKey) return;
                          await adminChangePartnerPlan(row.partnerId, planKey);
                          event.target.value = "";
                          await refresh();
                        }}
                        className="rounded-lg border px-2 py-1 text-xs font-bold"
                      >
                        <option value="">שינוי מסלול</option>
                        <option value="partner_basic">Partner</option>
                        <option value="partner_pro">Pro</option>
                        <option value="partner_premium">Premium</option>
                      </select>
                      <button
                        type="button"
                        onClick={async () => {
                          setFinancePartnerId(row.partnerId);
                          const data = await fetchAdminPartnerTransactions(row.partnerId);
                          setFinanceRows(data.items || []);
                        }}
                        className="rounded-lg border px-2 py-1 text-xs font-bold"
                      >
                        עסקאות
                      </button>
                      <a
                        href={`/api/admin/partners/${row.partnerId}/transactions.csv`}
                        className="rounded-lg border px-2 py-1 text-center text-xs font-bold"
                        onClick={async (event) => {
                          event.preventDefault();
                          const { data } = await API.get(
                            `/admin/partners/${row.partnerId}/transactions.csv`,
                            { responseType: "blob" }
                          );
                          const url = URL.createObjectURL(data);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `partner-${row.partnerId}.csv`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        ייצוא
                      </a>
                      {row.status === "suspended" ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await adminSuspendPartner(row.partnerId, true);
                            await refresh();
                          }}
                          className="rounded-lg border px-2 py-1 text-xs font-bold"
                        >
                          שחרר השעיה
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            await adminSuspendPartner(row.partnerId, false);
                            await refresh();
                          }}
                          className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-bold text-rose-700"
                        >
                          השעה
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !error && items.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 font-bold text-slate-500" colSpan={12}>
                    אין פרטנרים להצגה
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {financePartnerId ? (
          <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <h2 className="px-4 py-3 text-lg font-black">פירוט עסקאות</h2>
            <table className="min-w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-3 py-2">לקוח</th>
                  <th className="px-3 py-2">מוצר</th>
                  <th className="px-3 py-2">שילם הלקוח</th>
                  <th className="px-3 py-2">עמלת Partner</th>
                  <th className="px-3 py-2">סטטוס</th>
                  <th className="px-3 py-2">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {financeRows.map((row) => (
                  <tr key={row._id} className="border-t">
                    <td className="px-3 py-2">{row.clientName || "—"}</td>
                    <td className="px-3 py-2">{row.product || row.sku}</td>
                    <td className="px-3 py-2">{ils(row.customerFinalPrice)}</td>
                    <td className="px-3 py-2">{ils(row.partnerCommissionAmount)}</td>
                    <td className="px-3 py-2">{row.commissionStatus}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="rounded border px-2 py-1 text-xs font-bold"
                          onClick={async () => {
                            await adminMarkCommissionPaid(financePartnerId, row._id);
                            const data = await fetchAdminPartnerTransactions(financePartnerId);
                            setFinanceRows(data.items || []);
                            await refresh();
                          }}
                        >
                          סמן שולם
                        </button>
                        <button
                          type="button"
                          className="rounded border px-2 py-1 text-xs font-bold"
                          onClick={async () => {
                            await adminReverseCommission(financePartnerId, row._id, "refund");
                            const data = await fetchAdminPartnerTransactions(financePartnerId);
                            setFinanceRows(data.items || []);
                            await refresh();
                          }}
                        >
                          החזר
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-black text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
