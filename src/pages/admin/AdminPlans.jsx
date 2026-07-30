import React, { useCallback, useEffect, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";

const KIND_LABEL = {
  package: "חבילת מערכת",
  upsell: "אפסייל",
};

const BILLING_LABEL = {
  recurring_month: "חודשי מתחדש",
  recurring_year: "שנתי מתחדש",
  one_time: "חד־פעמי",
};

export default function AdminPlans() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSku, setSavingSku] = useState("");
  const [drafts, setDrafts] = useState({});
  const [banner, setBanner] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/admin/pricing");
      const list = Array.isArray(res.data?.items) ? res.data.items : [];
      setItems(list);
      const next = {};
      for (const item of list) {
        next[item.sku] = {
          nameHe: item.nameHe || "",
          nameEn: item.nameEn || "",
          amountIls: Number(item.amountIls || 0),
          billing: item.billing || "one_time",
          active: item.active !== false,
          sortOrder: Number(item.sortOrder || 0),
          descriptionHe: item.descriptionHe || "",
        };
      }
      setDrafts(next);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "שגיאה בטעינת תמחור");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateDraft = (sku, patch) => {
    setDrafts((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], ...patch },
    }));
  };

  const saveItem = async (sku) => {
    const draft = drafts[sku];
    if (!draft) return;
    setSavingSku(sku);
    setError("");
    setBanner("");
    try {
      const res = await API.put(`/admin/pricing/${encodeURIComponent(sku)}`, {
        nameHe: draft.nameHe,
        nameEn: draft.nameEn,
        amountIls: Number(draft.amountIls || 0),
        billing: draft.billing,
        active: !!draft.active,
        sortOrder: Number(draft.sortOrder || 0),
        descriptionHe: draft.descriptionHe || "",
      });
      const updated = res.data?.item;
      if (updated) {
        setItems((prev) => prev.map((item) => (item.sku === sku ? updated : item)));
        setDrafts((prev) => ({
          ...prev,
          [sku]: {
            nameHe: updated.nameHe || "",
            nameEn: updated.nameEn || "",
            amountIls: Number(updated.amountIls || 0),
            billing: updated.billing || "one_time",
            active: updated.active !== false,
            sortOrder: Number(updated.sortOrder || 0),
            descriptionHe: updated.descriptionHe || "",
          },
        }));
      }
      setBanner(`נשמר: ${sku} — התמחור במונגו עודכן וישמש בצ׳קאאוט.`);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "שמירה נכשלה");
    } finally {
      setSavingSku("");
    }
  };

  const packages = items.filter((item) => item.kind === "package");
  const upsells = items.filter((item) => item.kind === "upsell");

  const renderTable = (list, title) => (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-right font-medium">SKU</th>
              <th className="px-3 py-2 text-right font-medium">שם עברית</th>
              <th className="px-3 py-2 text-right font-medium">שם אנגלית</th>
              <th className="px-3 py-2 text-right font-medium">מחיר ₪</th>
              <th className="px-3 py-2 text-right font-medium">חיוב</th>
              <th className="px-3 py-2 text-right font-medium">פעיל</th>
              <th className="px-3 py-2 text-right font-medium">סדר</th>
              <th className="px-3 py-2 text-right font-medium">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              const draft = drafts[item.sku] || {};
              return (
                <tr key={item.sku} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-mono text-xs text-slate-700">
                    <div>{item.sku}</div>
                    <div className="text-[11px] text-slate-400">
                      {KIND_LABEL[item.kind] || item.kind}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-44 rounded border border-slate-200 px-2 py-1"
                      value={draft.nameHe || ""}
                      onChange={(e) => updateDraft(item.sku, { nameHe: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-40 rounded border border-slate-200 px-2 py-1"
                      value={draft.nameEn || ""}
                      onChange={(e) => updateDraft(item.sku, { nameEn: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="w-24 rounded border border-slate-200 px-2 py-1 font-semibold text-emerald-800"
                      value={draft.amountIls ?? 0}
                      onChange={(e) =>
                        updateDraft(item.sku, { amountIls: Number(e.target.value || 0) })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-slate-200 px-2 py-1"
                      value={draft.billing || "one_time"}
                      onChange={(e) => updateDraft(item.sku, { billing: e.target.value })}
                    >
                      <option value="recurring_month">
                        {BILLING_LABEL.recurring_month}
                      </option>
                      <option value="recurring_year">
                        {BILLING_LABEL.recurring_year}
                      </option>
                      <option value="one_time">{BILLING_LABEL.one_time}</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={draft.active !== false}
                      onChange={(e) => updateDraft(item.sku, { active: e.target.checked })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-16 rounded border border-slate-200 px-2 py-1"
                      value={draft.sortOrder ?? 0}
                      onChange={(e) =>
                        updateDraft(item.sku, { sortOrder: Number(e.target.value || 0) })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      disabled={savingSku === item.sku}
                      onClick={() => saveItem(item.sku)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {savingSku === item.sku ? "שומר…" : "שמור"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!list.length ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-slate-500">
                  אין פריטים
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <AdminHeader />
      <div className="p-6" dir="rtl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              תמחור חבילות ואפסיילים
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              שינוי ידני נשמר במונגו ומשפיע על צ׳קאאוט Stripe (₪ / ILS).
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            רענון
          </button>
        </div>

        {banner ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {banner}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="text-slate-500">טוען תמחור…</div>
        ) : (
          <>
            {renderTable(packages, "חבילות מערכת")}
            {renderTable(upsells, "אפסיילים")}
          </>
        )}
      </div>
    </>
  );
}
