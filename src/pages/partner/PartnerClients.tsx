import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import {
  addPartnerNote,
  addPartnerTask,
  fetchPartnerClient,
  fetchPartnerClients,
  togglePartnerTask,
} from "../../lib/partnerApi";
import type { PartnerClient, PartnerClientStatus } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

const STATUSES: Array<PartnerClientStatus | ""> = [
  "",
  "lead",
  "waiting_payment",
  "provisioning",
  "active",
  "payment_issue",
  "suspended",
  "cancelled",
];

const STATUS_LABEL: Record<string, string> = {
  lead: "ליד",
  waiting_payment: "ממתין לתשלום",
  provisioning: "בהקמה",
  active: "פעיל",
  payment_issue: "בעיית תשלום",
  suspended: "מושעה",
  cancelled: "בוטל",
};

function ils(value?: number) {
  return `₪${Number(value || 0).toLocaleString("he-IL")}`;
}

export default function PartnerClients() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<PartnerClient[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<PartnerClient | null>(null);
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");

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
        if (!cancelled) setError(err.response?.data?.error || "שגיאה בטעינת לקוחות");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const pages = Math.max(1, Math.ceil(total / 20));

  async function openClient(id: string) {
    const client = await fetchPartnerClient(id);
    setSelected(client);
  }

  async function saveNote() {
    if (!selected || !note.trim()) return;
    const notes = await addPartnerNote(selected._id, note.trim());
    setSelected({ ...selected, notes });
    setNote("");
  }

  async function saveTask() {
    if (!selected || !task.trim()) return;
    const tasks = await addPartnerTask(selected._id, task.trim());
    setSelected({ ...selected, tasks });
    setTask("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">CRM פרטנר</h2>
          <p className="text-sm font-bold text-slate-500">
            קשר מסחרי מול עסקים במורד — לא ה-CRM של העסק שלך
          </p>
        </div>
        <Link
          to="/partner/dashboard/clients/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
        >
          <Plus className="h-4 w-4" />
          לקוח חדש
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
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
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
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
                {item ? STATUS_LABEL[item] : "כל הסטטוסים"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <BizuplyLoader label="טוען לקוחות..." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-xs font-black text-slate-500">
              <tr>
                <th className="px-4 py-3">עסק</th>
                <th className="px-4 py-3">איש קשר</th>
                <th className="px-4 py-3">סטטוס</th>
                <th className="px-4 py-3">מחיר ללקוח</th>
                <th className="px-4 py-3">עלות לפרטנר</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row._id}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                  onClick={() => openClient(row._id)}
                >
                  <td className="px-4 py-3 font-black">{row.contact.businessName}</td>
                  <td className="px-4 py-3">
                    {row.contact.contactName}
                    <div className="text-xs text-slate-500">{row.contact.email}</div>
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {STATUS_LABEL[row.status] || row.status}
                  </td>
                  <td className="px-4 py-3">{ils(row.mrrCustomer)}</td>
                  <td className="px-4 py-3">{ils(row.mrrWholesale)}</td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center font-bold text-slate-500">
                    אין לקוחות להצגה
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
            className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
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

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" dir="rtl">
          <aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black">{selected.contact.businessName}</h3>
                <p className="text-sm font-bold text-slate-500">
                  {STATUS_LABEL[selected.status]} · {selected.contact.email}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="font-black">
                סגור
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {selected.selectedSkus?.map((line) => (
                <div key={line.sku} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-black">{line.nameHe || line.sku}</p>
                  <p>מחיר Bizuply לפרטנר: {ils(line.partnerWholesalePrice)}</p>
                  <p>העמלה שהפרטנר מוסיף: {ils(line.markup)}</p>
                  <p>המחיר הסופי ללקוח: {ils(line.customerFinalPrice)}</p>
                  <p>חלק הפרטנר מהעמלה: {ils(line.partnerMarkupShare)}</p>
                  <p>חלק Bizuply מהעמלה: {ils(line.bizuplyMarkupShare)}</p>
                  <p className="text-xs text-slate-500">
                    Retail להשוואה בלבד: {ils(line.retailPrice)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="mb-2 font-black">הערות</h4>
              <div className="space-y-2">
                {(selected.notes || []).map((item) => (
                  <div key={item._id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="הערה חדשה"
                />
                <button type="button" onClick={saveNote} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white">
                  שמור
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-2 font-black">משימות</h4>
              <div className="space-y-2">
                {(selected.tasks || []).map((item) => (
                  <label key={item._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(item.done)}
                      onChange={async (e) => {
                        const tasks = await togglePartnerTask(
                          selected._id,
                          String(item._id),
                          e.target.checked
                        );
                        setSelected({ ...selected, tasks });
                      }}
                    />
                    <span className={item.done ? "line-through text-slate-400" : ""}>
                      {item.title}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="משימה חדשה"
                />
                <button type="button" onClick={saveTask} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white">
                  הוסף
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
