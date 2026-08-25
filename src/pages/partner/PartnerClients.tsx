import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, LogIn, MoreHorizontal, Plus } from "lucide-react";
import { enterPartnerClient, fetchPartnerClients, partnerApiError } from "../../lib/partnerApi";
import type { PartnerClient } from "../../types/partner";
import {
  PARTNER_CLIENT_STATUSES,
  PARTNER_STATUS_LABEL,
  PARTNER_STATUS_TONE,
  partnerStatusLabel,
} from "../../lib/partnerLabels";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import {
  PartnerCard,
  PartnerGhostButton,
  PartnerPrimaryButton,
  PartnerSearchField,
  PartnerSelect,
} from "../../components/partner/partnerUi";
import { useAuth } from "../../context/AuthContext";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";
import {
  eventTypeLabel,
  formatPartnerDate,
  nextTaskDue,
  openTaskCount,
} from "../../lib/partnerWork";

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
  const [menuId, setMenuId] = useState("");

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
      } catch (err: unknown) {
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
  const from = total === 0 ? 0 : (page - 1) * 20 + 1;
  const to = Math.min(total, page * 20);

  function setQuery(next: Record<string, string>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (value) merged.set(key, value);
      else merged.delete(key);
    });
    setParams(merged);
  }

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
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן להיכנס לניהול הלקוח"));
    } finally {
      setEnteringId("");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">לקוחות</h2>
          <p className="text-sm font-bold text-slate-500">כל התיקים במורד — חיפוש, סטטוס ומעקב.</p>
        </div>
        <Link to="/partner/dashboard/clients/new">
          <PartnerPrimaryButton type="button">
            <Plus className="h-4 w-4" />
            לקוח חדש
          </PartnerPrimaryButton>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <PartnerSearchField
          value={q}
          onChange={(value) => setQuery({ q: value, page: "1" })}
          placeholder="חיפוש שם, טלפון, אימייל, סטטוס..."
        />
        <PartnerSelect
          value={status}
          onChange={(value) => setQuery({ status: value, page: "1" })}
          icon={<Filter className="h-4 w-4 text-slate-400" />}
        >
          {PARTNER_CLIENT_STATUSES.map((item) => (
            <option key={item || "all"} value={item}>
              {item ? PARTNER_STATUS_LABEL[item] : "כל הסטטוסים"}
            </option>
          ))}
        </PartnerSelect>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <BizuplyLoader label="טוען לקוחות..." />
      ) : (
        <PartnerCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-right text-sm">
              <thead className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3">לקוח</th>
                  <th className="px-3 py-3">סטטוס</th>
                  <th className="px-3 py-3">איש קשר</th>
                  <th className="px-3 py-3">טלפון</th>
                  <th className="px-3 py-3">סוג אירוע</th>
                  <th className="px-3 py-3">מקור</th>
                  <th className="px-3 py-3">תאריך יעד</th>
                  <th className="px-3 py-3">משימות</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row._id}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-violet-50/40"
                    onClick={() => navigate(`/partner/dashboard/crm/${row._id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-black text-violet-800">
                          {(row.contact?.businessName || "?").slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-black text-slate-900">{row.contact?.businessName || "—"}</p>
                          <p className="text-[11px] font-bold text-slate-400">
                            {row.contact?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                          PARTNER_STATUS_TONE[row.status] || "bg-slate-100"
                        }`}
                      >
                        {PARTNER_STATUS_LABEL[row.status] || row.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 font-bold text-slate-700">{row.contact?.contactName || "—"}</td>
                    <td className="px-3 py-4 font-bold text-slate-600" dir="ltr">
                      {row.contact?.phone || "—"}
                    </td>
                    <td className="px-3 py-4 font-bold text-slate-600">{eventTypeLabel(row)}</td>
                    <td className="px-3 py-4 font-bold text-slate-600">
                      {partnerStatusLabel(row.source)}
                    </td>
                    <td className="px-3 py-4 font-bold text-slate-600">
                      {formatPartnerDate(nextTaskDue(row) || row.nextBillingDate)}
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                        {openTaskCount(row)}
                      </span>
                    </td>
                    <td className="relative px-3 py-4" onClick={(event) => event.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {row.canEnterClient ? (
                          <PartnerGhostButton
                            type="button"
                            onClick={(event) => enterClient(event, row)}
                            className="!px-3 !py-1.5 text-xs"
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            {enteringId === row._id ? "נכנס..." : "כניסה"}
                          </PartnerGhostButton>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setMenuId(menuId === row._id ? "" : row._id)}
                          className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                      {menuId === row._id ? (
                        <div className="absolute left-3 top-12 z-10 w-40 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg">
                          <button
                            type="button"
                            className="block w-full rounded-xl px-3 py-2 text-right text-sm font-bold hover:bg-violet-50"
                            onClick={() => navigate(`/partner/dashboard/crm/${row._id}`)}
                          >
                            תיק לקוח
                          </button>
                          <button
                            type="button"
                            className="block w-full rounded-xl px-3 py-2 text-right text-sm font-bold hover:bg-violet-50"
                            onClick={() =>
                              navigate(`/partner/dashboard/clients/new?clientId=${row._id}`)
                            }
                          >
                            הצעת מחיר
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {!items.length ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center font-bold text-slate-400">
                      אין לקוחות להצגה — התחילו באשף לקוח חדש
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm font-bold text-slate-500">
            <span>
              מציג {from}-{to} מתוך {total} לקוחות
            </span>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-sm font-black text-violet-800">
                {page}
              </span>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setQuery({ page: String(page - 1) })}
                className="rounded-xl border border-slate-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setQuery({ page: String(page + 1) })}
                className="rounded-xl border border-slate-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </PartnerCard>
      )}
    </div>
  );
}
