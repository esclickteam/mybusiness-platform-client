import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LogIn,
  Plus,
  Search,
} from "lucide-react";
import { enterPartnerClient, fetchPartnerClients, partnerApiError } from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import type { PartnerClient } from "../../types/partner";
import {
  PARTNER_CLIENT_STATUSES,
  PARTNER_STATUS_LABEL,
  PARTNER_STATUS_TONE,
} from "../../lib/partnerLabels";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { useAuth } from "../../context/AuthContext";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";

const STATUSES = PARTNER_CLIENT_STATUSES;

export default function PartnerClients() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken?: (
      user: unknown,
      token: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<PartnerClient[]>([]);
  const [total, setTotal] = useState(0);
  const [enteringId, setEnteringId] = useState("");

  const q = params.get("q") || "";
  const status = params.get("status") || "";
  const page = Number(params.get("page") || 1);
  const query = useMemo(() => ({ q, status, page }), [q, status, page]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPartnerClients(query);
        if (!cancelled) {
          setItems(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (err: any) {
        if (!cancelled) setError(partnerApiError(err, "שגיאה בטעינת לקוחות"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const pages = Math.max(1, Math.ceil(total / 20));

  async function enterClient(event: React.MouseEvent, row: PartnerClient) {
    event.preventDefault();
    event.stopPropagation();
    if (!row.canEnterClient) return;
    setEnteringId(row._id);
    setError("");
    try {
      const data = await enterPartnerClient(row._id);
      loginWithToken?.(data.user, data.token, { skipRedirect: true });
      navigate(getDefaultDashboardPath(data.user.businessId, data.user.enabledModules), {
        replace: true,
      });
    } catch (err: any) {
      setError(partnerApiError(err, "לא ניתן להיכנס לניהול הלקוח"));
    } finally {
      setEnteringId("");
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow="CRM פרטנר"
        title="לקוחות במורד"
        subtitle="תיק מסחרי מלא לכל עסק שאתם מנהלים — כולל עמלה נוספת, אחוזי פיצול, וגישה ישירה לניהול."
        actions={
          <Link
            to="/partner/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/10"
          >
            <Plus className="h-4 w-4" />
            לקוח חדש
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              next.set("q", e.target.value);
              next.set("page", "1");
              setParams(next);
            }}
            placeholder="חיפוש שם, אימייל, טלפון"
            className="w-full bg-transparent text-sm font-bold outline-none"
          />
        </label>
        <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold shadow-sm">
          <Filter className="h-4 w-4" />
          <select
            value={status}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set("status", e.target.value);
              else next.delete("status");
              next.set("page", "1");
              setParams(next);
            }}
          >
            {STATUSES.map((item) => (
              <option key={item || "all"} value={item}>
                {item ? PARTNER_STATUS_LABEL[item] : "כל הסטטוסים"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <BizuplyLoader label="טוען לקוחות..." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">עסק</th>
                <th className="px-4 py-3">איש קשר</th>
                <th className="px-4 py-3">סטטוס</th>
                <th className="px-4 py-3">מחיר ללקוח</th>
                <th className="px-4 py-3">עמלה נוספת</th>
                <th className="px-4 py-3">עלות ל-Bizuply</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const extra = (row.selectedSkus || []).reduce(
                  (sum, line) => sum + Number(line.markup || line.additionalCommission || 0),
                  0
                );
                return (
                  <tr
                    key={row._id}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-violet-50/40"
                    onClick={() => navigate(`/partner/dashboard/crm/${row._id}`)}
                  >
                    <td className="px-4 py-4">
                      <p className="font-black text-slate-900">{row.contact.businessName}</p>
                      <p className="text-[11px] font-bold text-slate-400">
                        {row.managementMode === "partner"
                          ? "הפרטנר מנהל"
                          : row.managementMode === "customer"
                            ? "הלקוח מנהל"
                            : "ניהול משותף"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold">{row.contact.contactName}</p>
                      <p className="text-xs text-slate-500">{row.contact.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[11px] font-black",
                          PARTNER_STATUS_TONE[row.status] || "bg-slate-100",
                        ].join(" ")}
                      >
                        {PARTNER_STATUS_LABEL[row.status] || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-black">{formatIls(row.mrrCustomer)}</td>
                    <td className="px-4 py-4 font-bold text-violet-800">{formatIls(extra)}</td>
                    <td className="px-4 py-4">{formatIls(row.mrrWholesale)}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {row.canEnterClient ? (
                          <button
                            type="button"
                            onClick={(event) => enterClient(event, row)}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            {enteringId === row._id ? "נכנס..." : "כניסה לניהול"}
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400">הפעלה נדרשת</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!items.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center font-bold text-slate-500">
                    אין לקוחות להצגה — התחילו באשף לקוח חדש
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm font-bold">
        <span>
          {total} רשומות · עמוד {page} מתוך {pages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set("page", String(page - 1));
              setParams(next);
            }}
            className="rounded-xl border border-slate-200 bg-white p-2 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set("page", String(page + 1));
              setParams(next);
            }}
            className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
