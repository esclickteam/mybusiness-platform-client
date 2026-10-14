import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import AdminRowMenu from "./shell/AdminRowMenu";
import API from "../../api";
import {
  adminActivateSetup,
  adminChangePartnerPlan,
  adminMarkCommissionPaid,
  adminPostMonthly,
  adminRecordPayment,
  adminReverseCommission,
  adminSeedShowcaseDemo,
  adminSuspendPartner,
  fetchAdminPartners,
  fetchAdminPartnerTransactions,
  fetchAdminWithdrawalMonth,
  fetchAdminPartnerPaymentsRecent,
} from "../../lib/partnerApi";
import type { AdminPartnerRow } from "../../types/partner";

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
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [showcaseBusy, setShowcaseBusy] = useState(false);
  const [showcaseResult, setShowcaseResult] = useState<any>(null);

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
      const [data, month, payments] = await Promise.all([
        fetchAdminPartners(search),
        fetchAdminWithdrawalMonth().catch(() => null),
        fetchAdminPartnerPaymentsRecent().catch(() => ({ items: [] })),
      ]);
      setItems(data.items || []);
      if (month) setMonthSummary(month);
      setRecentPayments(payments.items || []);
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
        <AdminPageHeader
          title="פרטנרים"
          description="עמלות, משיכות וחשבונות דמו להצגה. הסכמים, צירופים וטיפול נדרש נמצאים בתפריט."
          actions={
          <button
            type="button"
            disabled={showcaseBusy}
            onClick={async () => {
              setShowcaseBusy(true);
              setError("");
              try {
                const data = await adminSeedShowcaseDemo();
                setShowcaseResult(data);
                await refresh();
              } catch (err: any) {
                setError(describeLoadError(err));
              } finally {
                setShowcaseBusy(false);
              }
            }}
            className="biz-btn biz-btn-secondary"
          >
            {showcaseBusy ? "יוצר חשבונות דמו..." : "יצירת חשבונות דמו להצגה"}
          </button>
          }
        />
        {showcaseResult ? (
          <section className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950">
            <p className="font-black">חשבונות דמו מוכנים להצגה לפרטנרים:</p>
            <p className="mt-1">
              פרטנר חינמי (אחוזים בלבד): {showcaseResult.partner?.email} · סיסמה {showcaseResult.partner?.password}
            </p>
            <p>
              לקוח דמו: {showcaseResult.customer?.email} · סיסמה {showcaseResult.customer?.password}
            </p>
            {showcaseResult.partner?.teamEmail ? (
              <p>
                משתמש צוות: {showcaseResult.partner.teamEmail} · סיסמה {showcaseResult.partner.teamPassword}
              </p>
            ) : null}
          </section>
        ) : null}
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
        {recentPayments.length ? (
          <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <h2 className="px-4 py-3 text-lg font-black">תשלומי עסקאות אחרונים</h2>
            <table className="min-w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-3 py-2">עסקה</th>
                  <th className="px-3 py-2">פרטנר</th>
                  <th className="px-3 py-2">לקוח</th>
                  <th className="px-3 py-2">לתשלום עכשיו</th>
                  <th className="px-3 py-2">חודשי</th>
                  <th className="px-3 py-2">ל-Bizuply</th>
                  <th className="px-3 py-2">משתמש</th>
                  <th className="px-3 py-2">שולם</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((row) => (
                  <tr key={row._id} className="border-t">
                    <td className="px-3 py-2 font-black">{row.dealNumber}</td>
                    <td className="px-3 py-2">
                      <Link className="font-black text-violet-700" to={`/admin/partners/${row.partnerId}`}>
                        {row.partnerName || "פרטנר"}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{row.clientName || row.clientEmail || "—"}</td>
                    <td className="px-3 py-2">{ils(row.customerNow)}</td>
                    <td className="px-3 py-2">{ils(row.monthly)}</td>
                    <td className="px-3 py-2">{ils(row.partnerPaysBizuply)}</td>
                    <td className="px-3 py-2">{row.provisioningStatus || "—"}</td>
                    <td className="px-3 py-2">
                      {row.paidAt ? new Date(row.paidAt).toLocaleDateString("he-IL") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          placeholder="חיפוש לפי שם, slug, אימייל כניסה, אימייל קשר, שם חברה משפטי"
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
                    <div className="biz-row-actions">
                      <button
                        type="button"
                        className="biz-btn biz-btn-secondary biz-btn-row"
                        onClick={async () => {
                          setFinancePartnerId(row.partnerId);
                          const data = await fetchAdminPartnerTransactions(row.partnerId);
                          setFinanceRows(data.items || []);
                        }}
                      >
                        עסקאות
                      </button>
                      <AdminRowMenu
                        items={[
                          {
                            label: "הפעל הקמה",
                            onClick: async () => {
                              await adminActivateSetup(row.partnerId);
                              await refresh();
                            },
                          },
                          {
                            label: "חיוב חודשי",
                            onClick: async () => {
                              await adminPostMonthly(row.partnerId);
                              await refresh();
                            },
                          },
                          {
                            label: "רשום תשלום",
                            onClick: async () => {
                              const amount = Number(window.prompt("סכום תשלום", "499"));
                              if (!amount) return;
                              await adminRecordPayment(row.partnerId, amount);
                              await refresh();
                            },
                          },
                          {
                            label: "מסלול Partner",
                            onClick: async () => {
                              await adminChangePartnerPlan(row.partnerId, "partner_basic");
                              await refresh();
                            },
                          },
                          {
                            label: "מסלול Pro",
                            onClick: async () => {
                              await adminChangePartnerPlan(row.partnerId, "partner_pro");
                              await refresh();
                            },
                          },
                          {
                            label: "מסלול Premium",
                            onClick: async () => {
                              await adminChangePartnerPlan(row.partnerId, "partner_premium");
                              await refresh();
                            },
                          },
                          {
                            label: "מסלול אחוזים בלבד",
                            onClick: async () => {
                              await adminChangePartnerPlan(row.partnerId, "partner_percent");
                              await refresh();
                            },
                          },
                          {
                            label: "ייצוא",
                            onClick: async () => {
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
                            },
                          },
                          row.status === "suspended"
                            ? {
                                label: "שחרר השעיה",
                                onClick: async () => {
                                  await adminSuspendPartner(row.partnerId, true);
                                  await refresh();
                                },
                              }
                            : {
                                label: "השעה",
                                danger: true,
                                onClick: async () => {
                                  await adminSuspendPartner(row.partnerId, false);
                                  await refresh();
                                },
                              },
                        ]}
                      />
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
                  <th className="px-3 py-2">Deal</th>
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
                    <td className="px-3 py-2">
                      {row.dealNumber || row.dealId ? (
                        <Link
                          className="font-black text-violet-700"
                          to={`/admin/partners/${financePartnerId}`}
                        >
                          {row.dealNumber || "עסקה"}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">{row.clientName || "—"}</td>
                    <td className="px-3 py-2">{row.product || row.sku}</td>
                    <td className="px-3 py-2">{ils(row.customerFinalPrice)}</td>
                    <td className="px-3 py-2">{ils(row.partnerCommissionAmount)}</td>
                    <td className="px-3 py-2">{row.commissionStatus}</td>
                    <td className="px-3 py-2">
                      <div className="biz-row-actions">
                        <button
                          type="button"
                          className="biz-btn biz-btn-secondary biz-btn-row"
                          onClick={async () => {
                            await adminMarkCommissionPaid(financePartnerId, row._id);
                            const data = await fetchAdminPartnerTransactions(financePartnerId);
                            setFinanceRows(data.items || []);
                            await refresh();
                          }}
                        >
                          סמן שולם
                        </button>
                        <AdminRowMenu
                          items={[
                            {
                              label: "החזר",
                              danger: true,
                              onClick: async () => {
                                await adminReverseCommission(financePartnerId, row._id, "refund");
                                const data = await fetchAdminPartnerTransactions(financePartnerId);
                                setFinanceRows(data.items || []);
                                await refresh();
                              },
                            },
                          ]}
                        />
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
