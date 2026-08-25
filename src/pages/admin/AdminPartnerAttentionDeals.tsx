import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import {
  adminChangeDealEmail,
  adminLinkDealBusiness,
  adminRetryDealActivation,
  fetchAdminPartnerAttentionDeals,
  partnerApiError,
} from "../../lib/partnerApi";
import { partnerStatusLabel } from "../../lib/partnerLabels";

export default function AdminPartnerAttentionDeals() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");

  function load() {
    fetchAdminPartnerAttentionDeals()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת עסקאות")));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black">שולם – נדרש טיפול בהפעלת הלקוח</h1>
          <Link to="/admin/partners" className="text-sm font-black text-violet-700">
            חזרה לפרטנרים
          </Link>
        </div>
        {error ? <p className="mb-4 font-bold text-rose-700">{error}</p> : null}
        <div className="overflow-x-auto rounded-3xl border bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs font-black text-slate-500">
              <tr>
                <th className="px-3 py-3">Deal</th>
                <th className="px-3 py-3">תשלום</th>
                <th className="px-3 py-3">הפעלה</th>
                <th className="px-3 py-3">מוצרים</th>
                <th className="px-3 py-3">עמלה</th>
                <th className="px-3 py-3">סיבה</th>
                <th className="px-3 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="px-3 py-3">
                    <Link className="font-black text-violet-700" to={`/admin/partners/${row.partnerId}`}>
                      #{row.dealNumber}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{partnerStatusLabel(row.paymentStatus || row.pipeline?.paymentStatus)}</td>
                  <td className="px-3 py-3">{partnerStatusLabel(row.activationStatus || row.pipeline?.activationStatus)}</td>
                  <td className="px-3 py-3">
                    {row.pipeline?.fulfillment
                      ? `${row.pipeline.fulfillment.softwareFulfilled}/${row.pipeline.fulfillment.softwareTotal}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3">{partnerStatusLabel(row.commissionStatus || row.pipeline?.commissionStatus)}</td>
                  <td className="px-3 py-3 text-xs">{row.activationErrorMessage || row.badge || "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className="rounded-xl bg-slate-900 py-1 text-xs font-black text-white"
                        disabled={Boolean(busy)}
                        onClick={async () => {
                          setBusy(row._id);
                          try {
                            await adminRetryDealActivation(row.partnerId, row._id);
                            load();
                          } catch (err: unknown) {
                            setError(partnerApiError(err, "ניסיון ההפעלה נכשל"));
                          } finally {
                            setBusy("");
                          }
                        }}
                      >
                        ניסיון הפעלה מחדש
                      </button>
                      <div className="flex gap-1">
                        <input
                          className="w-28 rounded-xl border px-2 py-1 text-xs"
                          placeholder="אימייל חדש"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          type="button"
                          className="rounded-xl border px-2 text-xs font-black"
                          disabled={Boolean(busy)}
                          onClick={async () => {
                            setBusy(row._id);
                            try {
                              await adminChangeDealEmail(row.partnerId, row._id, email);
                              load();
                            } catch (err: unknown) {
                              setError(partnerApiError(err, "עדכון האימייל נכשל"));
                            } finally {
                              setBusy("");
                            }
                          }}
                        >
                          שמירת אימייל
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <input
                          className="w-28 rounded-xl border px-2 py-1 text-xs"
                          placeholder="businessId"
                          value={businessId}
                          onChange={(e) => setBusinessId(e.target.value)}
                        />
                        <button
                          type="button"
                          className="rounded-xl border px-2 text-xs font-black"
                          disabled={Boolean(busy)}
                          onClick={async () => {
                            setBusy(row._id);
                            try {
                              await adminLinkDealBusiness(row.partnerId, row._id, businessId);
                              load();
                            } catch (err: unknown) {
                              setError(partnerApiError(err, "קישור נכשל"));
                            } finally {
                              setBusy("");
                            }
                          }}
                        >
                          קישור לעסק
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-slate-400">
                    אין עסקאות שדורשות טיפול
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
