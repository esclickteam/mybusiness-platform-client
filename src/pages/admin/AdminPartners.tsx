import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminsHeader";
import {
  adminActivateSetup,
  adminChangePartnerPlan,
  adminPostMonthly,
  adminRecordPayment,
  adminSuspendPartner,
  fetchAdminPartners,
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
      const data = await fetchAdminPartners(search);
      setItems(data.items || []);
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
                <th className="px-3 py-3">חוב ל-Bizuply</th>
                <th className="px-3 py-3">פיגור</th>
                <th className="px-3 py-3">עסקים פעילים</th>
                <th className="px-3 py-3">מושעים</th>
                <th className="px-3 py-3">MRR סיטונאי</th>
                <th className="px-3 py-3">הכנסת עמלה Bizuply</th>
                <th className="px-3 py-3">סה״כ עמלת פרטנר</th>
                <th className="px-3 py-3">תשלום אחרון</th>
                <th className="px-3 py-3">חידוש</th>
                <th className="px-3 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.partnerId} className="border-t border-slate-100">
                  <td className="px-3 py-3 font-black">
                    {row.name}
                    {row.snapshotError ? (
                      <p className="mt-1 text-xs font-bold text-rose-600">
                        snapshot: {row.snapshotError}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{row.planName || row.planKey}</td>
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">{ils(row.amountDueToBizuply)}</td>
                  <td className="px-3 py-3">{ils(row.overdueBalance)}</td>
                  <td className="px-3 py-3">{row.activeDownstreamBusinesses}</td>
                  <td className="px-3 py-3">{row.suspendedDownstreamBusinesses}</td>
                  <td className="px-3 py-3">{ils(row.currentWholesaleMrr)}</td>
                  <td className="px-3 py-3">{ils(row.bizuplyMarkupRevenue)}</td>
                  <td className="px-3 py-3">{ils(row.partnerMarkupTotal)}</td>
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
      </main>
    </div>
  );
}
