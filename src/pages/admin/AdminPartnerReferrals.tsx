import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import {
  adminPartnerReferralAction,
  fetchAdminPartnerReferrals,
  partnerApiError,
} from "../../lib/partnerApi";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { formatIls } from "../../lib/partnerMoney";

export default function AdminPartnerReferrals() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [password, setPassword] = useState("");
  const [linkId, setLinkId] = useState("");
  const [reason, setReason] = useState("");

  function load() {
    fetchAdminPartnerReferrals()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(partnerApiError(err, "שגיאה בטעינת הפניות")));
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: string, payload: Record<string, unknown> = {}) {
    setBusy(`${id}:${action}`);
    setError("");
    try {
      await adminPartnerReferralAction(id, action, payload);
      load();
    } catch (err: unknown) {
      setError(partnerApiError(err, "הפעולה נכשלה"));
    } finally {
      setBusy("");
    }
  }

  return (
    <div dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black">צירופי פרטנרים</h1>
          <Link to="/admin/partners" className="text-sm font-black text-violet-700">
            חזרה לפרטנרים
          </Link>
        </div>
        {error ? <p className="mb-4 font-bold text-rose-700">{error}</p> : null}
        <div className="overflow-x-auto rounded-3xl border bg-white">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs font-black text-slate-500">
              <tr>
                <th className="px-3 py-3">מי הפנה</th>
                <th className="px-3 py-3">מי הופנה</th>
                <th className="px-3 py-3">תאריך</th>
                <th className="px-3 py-3">סטטוס</th>
                <th className="px-3 py-3">פרטנר שנפתח</th>
                <th className="px-3 py-3">ימים פעיל</th>
                <th className="px-3 py-3">זכאות ₪500</th>
                <th className="px-3 py-3">תשלום</th>
                <th className="px-3 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-t align-top">
                  <td className="px-3 py-3">{row.referringPartner?.name || "—"}</td>
                  <td className="px-3 py-3">
                    <p className="font-black">{row.referredName}</p>
                    <p className="text-xs text-slate-500">{row.referredBusinessName}</p>
                    <p className="text-xs">{row.referredEmail}</p>
                  </td>
                  <td className="px-3 py-3">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString("he-IL") : "—"}
                  </td>
                  <td className="px-3 py-3">{partnerStatusLabel(row.status)}</td>
                  <td className="px-3 py-3">
                    {row.referredPartner ? (
                      <Link className="font-black text-violet-700" to={`/admin/partners/${row.referredPartnerId}`}>
                        {row.referredPartner.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {row.qualificationStartDate
                      ? `יום ${row.daysActive ?? 0} מתוך ${row.qualificationDays || 40}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3">
                    {partnerStatusLabel(row.rewardStatus)}
                    {row.rewardStatus === "pending" && row.qualificationStartDate ? (
                      <span className="block text-xs text-slate-500">ממתינה ל־40 ימי פעילות</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{formatIls(row.rewardAmount || 500)}</td>
                  <td className="px-3 py-3">
                    <div className="flex min-w-[220px] flex-col gap-1">
                      <button
                        type="button"
                        className="rounded-xl bg-slate-900 py-1 text-xs font-black text-white"
                        disabled={Boolean(busy)}
                        onClick={() => act(row._id, "approve")}
                      >
                        אישור
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border py-1 text-xs font-black"
                        disabled={Boolean(busy)}
                        onClick={() => act(row._id, "reject", { reason })}
                      >
                        דחייה
                      </button>
                      <input
                        placeholder="סיסמה זמנית לפתיחה"
                        className="rounded-xl border px-2 py-1 text-xs"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="rounded-xl bg-violet-700 py-1 text-xs font-black text-white"
                        disabled={Boolean(busy)}
                        onClick={() =>
                          act(row._id, "create-partner", {
                            password,
                            name: row.referredName,
                            email: row.referredEmail,
                            businessName: row.referredBusinessName,
                          })
                        }
                      >
                        אישור ופתיחת פרטנר
                      </button>
                      <div className="flex gap-1">
                        <input
                          placeholder="מזהה פרטנר קיים"
                          className="flex-1 rounded-xl border px-2 py-1 text-xs"
                          value={linkId}
                          onChange={(e) => setLinkId(e.target.value)}
                        />
                        <button
                          type="button"
                          className="rounded-xl border px-2 text-xs font-black"
                          disabled={Boolean(busy)}
                          onClick={() => act(row._id, "link-partner", { partnerId: linkId })}
                        >
                          קישור
                        </button>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border py-1 text-xs font-black"
                        disabled={Boolean(busy)}
                        onClick={() => act(row._id, "approve-reward")}
                      >
                        אישור עמלה
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-emerald-700 py-1 text-xs font-black text-white"
                        disabled={Boolean(busy)}
                        onClick={() => act(row._id, "pay-reward")}
                      >
                        סימון כשולם
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-rose-200 py-1 text-xs font-black text-rose-700"
                        disabled={Boolean(busy)}
                        onClick={() => act(row._id, "cancel-reward", { reason })}
                      >
                        ביטול זכאות
                      </button>
                      <input
                        placeholder="סיבה לביטול/דחייה"
                        className="rounded-xl border px-2 py-1 text-xs"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-slate-400">
                    אין הפניות
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
